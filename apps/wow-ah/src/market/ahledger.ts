import { ExpiryCache } from "./expiryCache";
import type {
  Item,
  MarketData,
  Outcome,
  Profession,
  Quote,
  Recipe,
} from "../types";
import { MARKET } from "../types";
import { ITEMS } from "../catalog/items";
import { RECIPES } from "../catalog/recipes";
const BASE = "https://api.ahledger.com/v1",
  cache = new ExpiryCache<unknown>();
let backoffUntil = 0;
export const unknownMarket = (): MarketData => ({
  quotes: {},
  imported: [],
  deItems: [],
  errors: [],
  updatedAt: null,
  expiresAt: 0,
});
const object = (x: unknown): Record<string, any> =>
  x && typeof x === "object" && !Array.isArray(x)
    ? (x as Record<string, any>)
    : {};
const num = (x: unknown): number | null =>
  typeof x === "number" && Number.isFinite(x) && x >= 0 ? x : null;
const price = (x: unknown): number | null =>
  num(x) !== null && Number.isSafeInteger(x) ? (x as number) : null;
const stamp = (x: unknown): string | null =>
  typeof x === "string" && Number.isFinite(Date.parse(x))
    ? new Date(x).toISOString()
    : null;
export const safeURL = (x: unknown): string => {
  if (typeof x !== "string") return "https://ahledger.com";
  try {
    const u = new URL(x);
    return u.protocol === "https:" && u.hostname === "ahledger.com"
      ? u.href
      : "https://ahledger.com";
  } catch {
    return "https://ahledger.com";
  }
};
const pending = new Map<string, symbol>();
export async function request(
  path: string,
  signal?: AbortSignal,
): Promise<{ data: unknown; expires: number }> {
  const cached = cache.get(path);
  if (cached && cached.expires > Date.now()) return cached;
  if (Date.now() < backoffUntil)
    throw Error(
      `AHledger requested a pause. Try again after ${new Date(backoffUntil).toLocaleTimeString()}.`,
    );
  const ticket = Symbol(path);
  pending.set(path, ticket);
  try {
    const response = await fetch(BASE + path, {
      signal: signal
        ? AbortSignal.any([signal, AbortSignal.timeout(20000)])
        : AbortSignal.timeout(20000),
    });
    if (response.status === 429 || response.status === 503) {
      const h = response.headers.get("Retry-After") || "60",
        seconds = Number(h),
        until = Number.isFinite(seconds)
          ? Date.now() + Math.max(1, seconds) * 1000
          : Date.parse(h);
      backoffUntil = Number.isFinite(until) ? until : Date.now() + 60000;
      throw Error(
        `Provider busy (${response.status}); retry after ${new Date(backoffUntil).toLocaleTimeString()}.`,
      );
    }
    if (!response.ok)
      throw Error(`AHledger ${response.status}: ${path.split("?")[0]}`);
    const data: unknown = await response.json(),
      responseAge = Math.max(0, Number(response.headers.get("Age")) || 0),
      maxAge = response.headers
        .get("Cache-Control")
        ?.match(/(?:^|,)\s*max-age=(\d+)/)?.[1],
      expires =
        Date.now() +
        Math.min(
          300,
          Math.max(
            0,
            Number(
              /no-store|no-cache/i.test(
                response.headers.get("Cache-Control") || "",
              )
                ? 0
                : Math.max(0, Number(maxAge ?? 60) - responseAge),
            ),
          ),
        ) *
          1000;
    const result = { data, expires };
    if (pending.get(path) === ticket) cache.set(path, result);
    return result;
  } finally {
    if (pending.get(path) === ticket) pending.delete(path);
  }
}
function assertMarket(x: Record<string, any>) {
  const value =
    typeof x.market === "string"
      ? x.market
      : object(x.market).slug?.replaceAll("/", ".");
  if (value !== MARKET)
    throw Error(
      "Provider returned a different or unidentified market. Data rejected.",
    );
}
export function normalizeTooltip(raw: unknown, expires: number): Quote[] {
  const x = object(raw);
  assertMarket(x);
  if (!Array.isArray(x.items))
    throw Error("Unexpected tooltip response: items missing.");
  return x.items
    .filter(
      (r: any) =>
        r &&
        Number.isSafeInteger(r.id) &&
        r.id > 0 &&
        typeof r.name === "string",
    )
    .map((r: any) => ({
      id: r.id,
      name: r.name.slice(0, 160),
      ask: r.minBuyout === 0 ? null : price(r.minBuyout),
      median: price(r.median),
      median7d: null,
      quantity: num(r.quantity),
      soldPerDay: num(r.salesPerDay),
      observedAt: stamp(r.observedAt),
      source: "AHledger · inferred sales",
      url: safeURL(r.url || "https://ahledger.com"),
      expiresAt: expires,
      detectedSale: null,
      coveredHours: null,
    }));
}
export function normalizeCrafting(raw: unknown): Recipe[] {
  const x = object(raw);
  assertMarket(x);
  if (!Array.isArray(x.recipes))
    throw Error("Crafting catalogue is unavailable.");
  return x.recipes
    .filter(
      (r: any) =>
        r &&
        Number.isSafeInteger(r.recipe?.spellId) &&
        r.recipe.spellId > 0 &&
        typeof r.recipe?.name === "string" &&
        Array.isArray(r.reagents) &&
        r.reagents.every(
          (v: any) =>
            v &&
            Number.isSafeInteger(v.id) &&
            v.id > 0 &&
            Number.isSafeInteger(v.qty) &&
            v.qty > 0,
        ) &&
        ["Tailoring", "Enchanting", "Alchemy", "Engineering"].includes(
          r.recipe.profession,
        ) &&
        Number.isSafeInteger(r.result?.id) &&
        r.result.id > 0,
    )
    .map((r: any) => {
      for (const item of [r.result, ...r.reagents])
        if (!ITEMS[item.id])
          ITEMS[item.id] = {
            id: item.id,
            name: String(item.name).slice(0, 160),
          };
      return {
        id: r.recipe.spellId,
        name: r.recipe.name,
        profession: r.recipe.profession as Profession,
        output: r.result.id,
        count: Math.max(
          1,
          Number.isInteger(r.result.qtyMin) ? r.result.qtyMin : 1,
        ),
        reagents: r.reagents.map((v: any) => ({ id: v.id, qty: v.qty })),
        min: price(r.recipe.skillRequired) ?? 0,
        yellow: 0,
        green: 0,
        grey: 0,
        acquisition: ["vendor", "trainer", "drop", "quest"].includes(
          r.recipe.acquisition,
        )
          ? r.recipe.acquisition
          : "trainer",
        unlock: null,
        verified: false,
        source: safeURL(x.page),
        note: "Imported candidate. Reported skill/source may be wrong; excluded from skill-route recommendations until independently verified.",
        binding: "BoE",
        expansion: "WoW Forever",
      };
    });
}
export function normalizeDE(raw: unknown): Item[] {
  const x = object(raw);
  assertMarket(x);
  if (!Array.isArray(x.opportunities))
    throw Error("Disenchant candidates missing.");
  return x.opportunities
    .filter(
      (r: any) =>
        r &&
        Number.isSafeInteger(r.item?.id) &&
        r.item.id > 0 &&
        typeof r.item.name === "string" &&
        !ITEMS[r.item.id]?.noDE &&
        Array.isArray(r.yields),
    )
    .map((r: any) => {
      const de: Outcome[] = r.yields
        .filter(
          (y: any) =>
            y &&
            Number.isSafeInteger(y.id) &&
            y.id > 0 &&
            num(y.chance) !== null &&
            y.chance > 0 &&
            y.chance <= 1 &&
            Number.isInteger(y.minCount) &&
            Number.isInteger(y.maxCount) &&
            y.minCount > 0 &&
            y.maxCount >= y.minCount &&
            y.maxCount <= 10,
        )
        .map((y: any) => ({
          probability: y.chance,
          drops: [{ id: y.id, min: y.minCount, max: y.maxCount }],
          source: safeURL(r.item.url),
        }));
      if (!ITEMS[r.item.id])
        ITEMS[r.item.id] = { id: r.item.id, name: r.item.name };
      return {
        ...ITEMS[r.item.id],
        de:
          ITEMS[r.item.id]?.de ||
          (de.length === r.yields.length ? de : undefined),
      };
    })
    .filter(
      (i: Item) =>
        i.de &&
        Math.abs(i.de.reduce((n, o) => n + o.probability, 0) - 1) < 0.001,
    );
}
export async function loadMarket(
  watchIds: number[],
  signal?: AbortSignal,
): Promise<MarketData> {
  const result = unknownMarket(),
    markets = object((await request("/markets", signal)).data);
  if (
    !Array.isArray(markets.markets) ||
    !markets.markets.some(
      (m: any) =>
        m &&
        m.id === MARKET &&
        m.ruleset === "rp" &&
        m.region === "eu" &&
        m.faction === "alliance",
    )
  )
    throw Error("EU RP Alliance market not verified by provider.");
  const professions = ["Tailoring", "Enchanting", "Alchemy", "Engineering"];
  const responses = await Promise.allSettled([
    ...professions.map((p) =>
      request(`/crafting/${MARKET}?profession=${p}&all=1`, signal),
    ),
    request(`/disenchant/${MARKET}`, signal),
    request(`/deals/${MARKET}?discount=25&units=1`, signal),
  ]);
  let expires = Infinity;
  responses.forEach((r, i) => {
    if (r.status === "rejected") {
      result.errors.push(r.reason?.message || "Provider unavailable");
      return;
    }
    expires = Math.min(expires, r.value.expires);
    try {
      if (i < 4) result.imported.push(...normalizeCrafting(r.value.data));
      if (i === 4) result.deItems = normalizeDE(r.value.data);
      if (i === 5) {
        const x = object(r.value.data);
        assertMarket(x);
        if (Array.isArray(x.deals))
          for (const d of x.deals.slice(0, 40)) {
            if (
              !d ||
              !Number.isSafeInteger(d.item?.id) ||
              d.item.id <= 0 ||
              typeof d.item.name !== "string" ||
              result.deals?.some((v) => v.id === d.item.id)
            )
              continue;
            ITEMS[d.item.id] ??= { id: d.item.id, name: String(d.item.name) };
            (result.deals ??= []).push({
              id: d.item.id,
              reference: price(d.referenceMedian),
              basis: String(d.basis || "historical asks"),
            });
          }
      }
    } catch (e) {
      result.errors.push((e as Error).message);
    }
  });
  const baseIds = new Set<number>([
    ...RECIPES.flatMap((r) => [
      r.output,
      ...r.reagents.map((v) => v.id),
      r.pattern || 0,
    ]),
    ...watchIds,
    ...(result.deals || []).map((d) => d.id),
    ...result.deItems
      .slice(0, 60)
      .flatMap((i) => [
        i.id,
        ...(i.de || []).flatMap((o) => o.drops.map((d) => d.id)),
      ]),
    ...Object.keys(ITEMS).map(Number).slice(0, 140),
  ]);
  const all = [...baseIds].filter((id) => id > 0);
  for (let i = 0; i < all.length; i += 100) {
    try {
      const response = await request(
        `/tooltip/${MARKET}?items=${all.slice(i, i + 100).join(",")}`,
        signal,
      );
      expires = Math.min(expires, response.expires);
      for (const q of normalizeTooltip(response.data, response.expires))
        result.quotes[q.id] = q;
    } catch (e) {
      result.errors.push((e as Error).message);
    }
  }
  result.expiresAt = Number.isFinite(expires) ? expires : Date.now();
  result.updatedAt =
    Object.values(result.quotes)
      .map((q) => q.observedAt)
      .filter((t): t is string => !!t)
      .sort()[0] || null;
  return result;
}
export async function loadHistory(
  id: number,
  signal?: AbortSignal,
): Promise<Quote> {
  const response = await request(`/prices/${MARKET}/${id}?range=7d`, signal),
    x = object(response.data);
  assertMarket(x);
  const latest = object(x.latest),
    sales = object(x.sales),
    item = object(x.item);
  if (item.id !== id) throw Error("History item mismatch.");
  return {
    id,
    name: String(item.name || `Item #${id}`),
    ask: latest.minBuyout === 0 ? null : price(latest.minBuyout),
    median: price(latest.median),
    median7d: price(latest.median7d),
    quantity: num(latest.quantity),
    soldPerDay: num(sales.estimatedPerDay),
    observedAt: stamp(latest.observedAt),
    source: "AHledger · " + String(latest.source || "snapshot"),
    url: safeURL(object(x.attribution).url),
    expiresAt: response.expires,
    detectedSale: null,
    coveredHours: num(sales.coveredHours),
    windowDays: num(sales.windowDays),
    salesMethod:
      typeof sales.method === "string" ? safeURL(sales.method) : undefined,
    historyExpiresAt: response.expires,
    history: Array.isArray(x.series)
      ? x.series
          .filter((s: any) => s && stamp(s.t))
          .map((s: any) => ({
            t: stamp(s.t)!,
            min: price(s.min),
            median: price(s.median),
          }))
          .sort((a, b) => Date.parse(a.t) - Date.parse(b.t))
      : [],
  };
}
export function purgeExpired(m: MarketData): MarketData {
  const now = Date.now();
  const hasExpiredQuote = Object.values(m.quotes).some(
    (q) =>
      q.expiresAt <= now ||
      (q.historyExpiresAt !== undefined && q.historyExpiresAt <= now),
  );
  const hasExpiredCatalog =
    m.expiresAt <= now &&
    (m.imported.length || m.deItems.length || m.deals?.length);
  if (!hasExpiredQuote && !hasExpiredCatalog) return m;
  return {
    ...m,
    quotes: Object.fromEntries(
      Object.entries(m.quotes)
        .filter(([, q]) => q.expiresAt > Date.now())
        .map(([id, q]) => {
          if (
            q.historyExpiresAt !== undefined &&
            q.historyExpiresAt <= Date.now()
          ) {
            const { history, historyExpiresAt, ...quote } = q;
            return [id, quote];
          }
          return [id, q];
        }),
    ),
    imported: m.expiresAt > Date.now() ? m.imported : [],
    deItems: m.expiresAt > Date.now() ? m.deItems : [],
    deals: m.expiresAt > Date.now() ? m.deals : [],
  };
}
