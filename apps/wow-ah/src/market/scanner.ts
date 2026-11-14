import { request, unknownMarket, safeURL } from "./ahledger";
import { MARKET } from "../types";
import type { MarketData, Quote } from "../types";
import { ITEMS } from "../catalog/items";
export type ScanFilters = {
  discount: 15 | 25 | 35 | 50 | 70;
  sells: 0 | 1 | 10 | 100;
  units: 1 | 5 | 20 | 100;
  sort: "saving" | "discount" | "sales";
};
export const DEFAULT_SCAN: ScanFilters = {
  discount: 25,
  sells: 1,
  units: 1,
  sort: "sales",
};
export function normalizeDeals(raw: unknown, expires: number): MarketData {
  const x = raw as any;
  if (!x || x.market !== MARKET || !Array.isArray(x.deals))
    throw Error("Unexpected deals response or market. Scan rejected.");
  const m = unknownMarket();
  m.expiresAt = expires;
  m.deals = [];
  const amount = (v: unknown) =>
    typeof v === "number" && Number.isSafeInteger(v) && v >= 0 ? v : null;
  const rate = (v: unknown) =>
    typeof v === "number" && Number.isFinite(v) && v >= 0 ? v : null;
  const stamp = (v: unknown) =>
    typeof v === "string" && Number.isFinite(Date.parse(v))
      ? new Date(v).toISOString()
      : null;
  for (const d of x.deals) {
    if (
      !d ||
      !Number.isSafeInteger(d.item?.id) ||
      d.item.id <= 0 ||
      typeof d.item.name !== "string" ||
      m.quotes[d.item.id]
    )
      continue;
    const id = d.item.id,
      name = d.item.name.slice(0, 160),
      observedAt = stamp(d.observedAt);
    ITEMS[id] ??= { id, name };
    const q: Quote = {
      id,
      name,
      ask: d.minBuyout === 0 ? null : amount(d.minBuyout),
      median: amount(d.median),
      median7d: d.basis === "7d" ? amount(d.referenceMedian) : null,
      quantity: amount(d.quantity),
      soldPerDay: rate(d.salesPerDay),
      observedAt,
      source: "AHledger · inferred sales",
      url: safeURL(d.item.url),
      expiresAt: expires,
      detectedSale: null,
      coveredHours: null,
    };
    m.quotes[id] = q;
    m.deals.push({
      id,
      reference: amount(d.referenceMedian),
      basis: typeof d.basis === "string" ? d.basis : "unknown",
      quality: typeof d.item.quality === "string" ? d.item.quality : "",
      assessment:
        typeof d.assessment === "string" ? d.assessment.slice(0, 600) : "",
    });
  }
  m.updatedAt =
    Object.values(m.quotes)
      .map((q) => q.observedAt)
      .filter((s): s is string => !!s)
      .sort()[0] || null;
  return m;
}
export async function loadScanner(
  filters: ScanFilters,
  signal?: AbortSignal,
): Promise<MarketData> {
  if (
    ![15, 25, 35, 50, 70].includes(filters.discount) ||
    ![0, 1, 10, 100].includes(filters.sells) ||
    ![1, 5, 20, 100].includes(filters.units) ||
    !["saving", "discount", "sales"].includes(filters.sort)
  )
    throw Error("Unsupported scan filters.");
  const markets = (await request("/markets", signal)).data as any;
  if (
    !Array.isArray(markets?.markets) ||
    !markets.markets.some(
      (m: any) =>
        m?.id === MARKET &&
        m.ruleset === "rp" &&
        m.region === "eu" &&
        m.faction === "alliance",
    )
  )
    throw Error("EU RP Alliance market could not be verified.");
  const query = new URLSearchParams({
    ...Object.fromEntries(
      Object.entries(filters).map(([k, v]) => [k, String(v)]),
    ),
    limit: "200",
  });
  const result = await request(`/deals/${MARKET}?${query}`, signal);
  return normalizeDeals(result.data, result.expires);
}
