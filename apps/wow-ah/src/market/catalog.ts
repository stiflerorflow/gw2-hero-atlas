import { ExpiryCache } from "./expiryCache";
import { isCopper } from "../engine/money";
import { VENDOR_CORRECTIONS } from "../catalog/vendorCorrections";
import type { VendorReference } from "../catalog/vendorCorrections";
export type CatalogItem = {
  id: number;
  name: string;
  quality: string;
  url: string;
  vendorSell?: number | null;
  vendorReference?: VendorReference;
  binding?: string | null;
  build?: string;
  expiresAt?: number;
};
export type CatalogPage = {
  items: CatalogItem[];
  page: number;
  hasMore: boolean;
  total: number | null;
  expiresAt?: number;
};
const BASE = "https://thewowdb.com/api/v1/forever/",
  cache = new ExpiryCache<unknown>(200);
let pauseUntil = 0;
export function catalogURL(value: unknown) {
  try {
    const u = new URL(String(value));
    return u.protocol === "https:" && u.hostname === "thewowdb.com"
      ? u.href
      : "https://thewowdb.com";
  } catch {
    return "https://thewowdb.com";
  }
}
const pending = new Map<string, symbol>();
async function read(path: string, signal?: AbortSignal) {
  const previous = cache.get(path);
  if (previous && previous.expires > Date.now()) return previous;
  if (Date.now() < pauseUntil)
    throw Error(
      "Catalogue is rate-limited. Try again after " +
        new Date(pauseUntil).toLocaleTimeString() +
        ".",
    );
  const ticket = Symbol(path);
  pending.set(path, ticket);
  try {
    const r = await fetch(BASE + path, {
      signal: signal
        ? AbortSignal.any([signal, AbortSignal.timeout(20000)])
        : AbortSignal.timeout(20000),
      credentials: "omit",
    });
    if (r.status === 429 || r.status === 503) {
      const retry = r.headers.get("Retry-After") || "60",
        n = Number(retry);
      pauseUntil = Number.isFinite(n)
        ? Date.now() + Math.max(1, n) * 1000
        : Date.parse(retry);
      if (!Number.isFinite(pauseUntil)) pauseUntil = Date.now() + 60000;
      throw Error("Catalogue is busy. Please retry later.");
    }
    if (!r.ok) throw Error("Catalogue request failed (" + r.status + ").");
    const data: unknown = await r.json(),
      cc = r.headers.get("Cache-Control") || "",
      age = Math.max(0, Number(r.headers.get("Age")) || 0),
      ttl = /no-store|no-cache/i.test(cc)
        ? 0
        : Math.max(
            0,
            Math.min(
              3600,
              Number(cc.match(/(?:^|,)\s*max-age=(\d+)/)?.[1] ?? 60) - age,
            ),
          );
    const result = { data, expires: Date.now() + ttl * 1000 };
    if (pending.get(path) === ticket) cache.set(path, result);
    return result;
  } finally {
    if (pending.get(path) === ticket) pending.delete(path);
  }
}
function item(x: any): CatalogItem | null {
  if (
    !x ||
    x.version !== "forever" ||
    x.kind !== "item" ||
    !Number.isSafeInteger(x.id) ||
    x.id <= 0 ||
    typeof x.name !== "string"
  )
    return null;
  return {
    id: x.id,
    name: x.name.slice(0, 160),
    quality: typeof x.quality === "string" ? x.quality : "unknown",
    url: catalogURL(x.links?.html),
  };
}
export function normalizeCatalog(raw: unknown): CatalogPage {
  const x = raw as any;
  if (
    !x ||
    x.version !== "forever" ||
    x.kind !== "item" ||
    !Array.isArray(x.results) ||
    !Number.isInteger(x.page) ||
    x.page < 1 ||
    x.page > 200 ||
    typeof x.has_more !== "boolean"
  )
    throw Error("Unexpected Forever catalogue response.");
  const ids = new Set<number>(),
    items: CatalogItem[] = [];
  for (const row of x.results) {
    const v = item(row);
    if (v && !ids.has(v.id)) {
      items.push(v);
      ids.add(v.id);
    }
  }
  return {
    items,
    page: x.page,
    hasMore: x.has_more,
    total:
      typeof x.total === "number" &&
      Number.isSafeInteger(x.total) &&
      x.total >= 0
        ? x.total
        : null,
  };
}
export function normalizeCatalogItem(raw: unknown, id: number): CatalogItem {
  const x = raw as any,
    v = item(x);
  if (!v || v.id !== id)
    throw Error("Catalogue item or game version did not match.");
  return {
    ...v,
    vendorSell:
      VENDOR_CORRECTIONS[id]?.value ??
      (isCopper(x.vendor_sell) ? x.vendor_sell : null),
    ...(VENDOR_CORRECTIONS[id]
      ? { vendorReference: VENDOR_CORRECTIONS[id] }
      : {}),
    binding:
      x.binding === null
        ? null
        : typeof x.binding === "string"
          ? x.binding
          : undefined,
    build: typeof x.build === "string" ? x.build : "",
  };
}
export function itemIdFrom(value: string): number | null {
  const clean = value.trim(),
    hit = /^\d+$/.test(clean)
      ? clean
      : clean.match(/(?:item[:=]|\/item\/)(\d+)/i)?.[1];
  const slugId = /^https?:\/\//i.test(clean)
    ? clean.match(/\/item\/(?:[^/?#]*-)?(\d+)\/?(?:[?#].*)?$/i)?.[1]
    : undefined;
  const resolved = hit || slugId;
  const n = Number(resolved);
  return resolved && Number.isSafeInteger(n) && n > 0 && n <= 2_000_000
    ? n
    : null;
}
export async function searchCatalog(
  query: string,
  page = 1,
  signal?: AbortSignal,
): Promise<CatalogPage> {
  if (page < 1 || page > 200 || !Number.isInteger(page))
    throw Error("Choose a valid catalogue page.");
  const id = itemIdFrom(query);
  if (id) {
    const v = await getCatalogItem(id, signal);
    return {
      items: [v],
      page: 1,
      hasMore: false,
      total: 1,
      expiresAt: v.expiresAt,
    };
  }
  const p = new URLSearchParams({
    q: query.trim().slice(0, 64),
    page: String(page),
    per_page: "25",
  });
  const response = await read("item/?" + p, signal);
  return { ...normalizeCatalog(response.data), expiresAt: response.expires };
}
export async function getCatalogItem(id: number, signal?: AbortSignal) {
  if (!Number.isSafeInteger(id) || id <= 0 || id > 2_000_000)
    throw Error("Invalid item ID.");
  const response = await read("item/" + id, signal);
  return {
    ...normalizeCatalogItem(response.data, id),
    expiresAt: response.expires,
  };
}
