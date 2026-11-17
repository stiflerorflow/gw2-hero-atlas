import { request, normalizeTooltip, safeURL, unknownMarket } from "./ahledger";
import { ITEMS } from "../catalog/items";
import { MARKET } from "../types";
import type { MarketData, Outcome, Quote } from "../types";
import { isAuctionBound } from "../engine/binding";
import { analyzeDisenchant } from "../engine/disenchant";
import { matchesReference } from "../catalog/disenchantTables";
export const DE_LIMIT = 200;
export type DECandidate = {
  id: number;
  name: string;
  level: number | null;
  quality: string;
  url: string;
  outcomes: Outcome[] | null;
  tableOrigin: "checked" | "reference" | "provider";
  observedAt: string | null;
  listing: Quote;
  vendorSell: number | null;
};
export type DEScan = {
  candidates: DECandidate[];
  names: Record<number, string>;
  rejected: number;
  total: number;
  source: string;
  pricingTruncated?: boolean;
};
const record = (x: unknown): Record<string, unknown> =>
  x && typeof x === "object" && !Array.isArray(x)
    ? (x as Record<string, unknown>)
    : {};
const stamp = (v: unknown) =>
  typeof v === "string" && Number.isFinite(Date.parse(v))
    ? new Date(v).toISOString()
    : null;
const id = (v: unknown): v is number =>
  typeof v === "number" && Number.isSafeInteger(v) && v > 0 && v <= 2_000_000;
export function normalizeDisenchantScan(raw: unknown, expires = 0): DEScan {
  const x = record(raw);
  if (x.market !== MARKET || !Array.isArray(x.opportunities))
    throw Error("Unexpected disenchant feed or market. Scan rejected.");
  const candidates: DECandidate[] = [],
    names: Record<number, string> = {};
  let rejected = 0;
  const seen = new Set<number>();
  // Bound work and requests even if an upstream response is unexpectedly large.
  for (const value of x.opportunities.slice(0, DE_LIMIT)) {
    const r = record(value),
      item = record(r.item);
    if (
      !id(item.id) ||
      typeof item.name !== "string" ||
      seen.has(item.id) ||
      ITEMS[item.id]?.noDE ||
      isAuctionBound(ITEMS[item.id]?.binding) ||
      isAuctionBound(typeof item.binding === "string" ? item.binding : null)
    ) {
      rejected++;
      continue;
    }
    seen.add(item.id);
    names[item.id] = item.name.slice(0, 160);
    let outcomes: Outcome[] | null = null;
    if (
      Array.isArray(r.yields) &&
      r.yields.length > 0 &&
      r.yields.length <= 16
    ) {
      const parsed: Outcome[] = [];
      for (const rawYield of r.yields) {
        const y = record(rawYield);
        if (
          !id(y.id) ||
          typeof y.name !== "string" ||
          typeof y.chance !== "number" ||
          typeof y.minCount !== "number" ||
          typeof y.maxCount !== "number"
        ) {
          parsed.length = 0;
          break;
        }
        names[y.id] = y.name.slice(0, 160);
        parsed.push({
          probability: y.chance,
          drops: [{ id: y.id, min: y.minCount, max: y.maxCount }],
          source: safeURL(item.url),
        });
      }
      if (parsed.length && analyzeDisenchant(parsed, {}, null).error === null)
        outcomes = parsed;
    }
    const checked = ITEMS[item.id]?.de;
    if (checked?.length) outcomes = checked;
    const observedAt = stamp(r.observedAt) ?? stamp(x.pricesAsOf);
    const amount = (v: unknown) =>
      typeof v === "number" &&
      Number.isSafeInteger(v) &&
      v >= 0 &&
      v <= 1_000_000_000
        ? v
        : null;
    const ask = amount(r.minBuyout);
    const listing: Quote = {
      id: item.id,
      name: names[item.id],
      ask: ask === 0 ? null : ask,
      median: null,
      median7d: null,
      quantity: amount(r.quantity),
      soldPerDay: null,
      observedAt,
      source: "AHledger · disenchant listing",
      url: safeURL(item.url),
      expiresAt: expires,
      detectedSale: null,
      coveredHours: null,
    };
    candidates.push({
      listing,
      vendorSell: ITEMS[item.id]?.vendorSell ?? amount(item.vendorSell),
      id: item.id,
      name: names[item.id],
      level:
        typeof item.level === "number" &&
        Number.isInteger(item.level) &&
        item.level > 0
          ? item.level
          : null,
      quality:
        typeof item.quality === "string"
          ? item.quality.slice(0, 40)
          : "Unknown",
      url: safeURL(item.url),
      outcomes,
      tableOrigin: checked?.length
        ? "checked"
        : matchesReference(
              typeof item.quality === "string" ? item.quality : "",
              typeof item.level === "number" ? item.level : null,
              outcomes,
            )
          ? "reference"
          : "provider",
      observedAt: stamp(r.observedAt) ?? stamp(x.pricesAsOf),
    });
  }
  return {
    candidates,
    names,
    rejected,
    total: x.opportunities.length,
    source: safeURL(x.page),
  };
}
export async function loadDisenchantScan(
  signal?: AbortSignal,
): Promise<MarketData> {
  const markets = record((await request("/markets", signal)).data);
  if (
    !Array.isArray(markets.markets) ||
    !markets.markets.some((raw) => {
      const m = record(raw);
      return (
        m.id === MARKET &&
        m.ruleset === "rp" &&
        m.region === "eu" &&
        m.faction === "alliance"
      );
    })
  )
    throw Error("EU RP Alliance market could not be verified.");
  const response = await request(
      `/disenchant/${MARKET}?all=true&limit=${DE_LIMIT}`,
      signal,
    ),
    scan = normalizeDisenchantScan(response.data, response.expires),
    market = unknownMarket();
  market.deScan = scan;
  market.expiresAt = response.expires;
  for (const c of scan.candidates) market.quotes[c.id] = c.listing;
  const allIds = [
    ...new Set(
      scan.candidates.flatMap((c) =>
        (c.outcomes || []).flatMap((o) => o.drops.map((d) => d.id)),
      ),
    ),
  ];
  const ids = allIds.slice(0, 1000);
  scan.pricingTruncated = allIds.length > ids.length;
  // Quote independently; do not trust provider headline margins or missing-as-zero medians.
  const batches: Promise<import("../types").Quote[]>[] = [];
  for (let offset = 0; offset < ids.length; offset += 100)
    batches.push(
      request(
        `/tooltip/${MARKET}?items=${ids.slice(offset, offset + 100).join(",")}`,
        signal,
      ).then((r) => normalizeTooltip(r.data, r.expires)),
    );
  const responses = await Promise.allSettled(batches);
  if (signal?.aborted) throw signal.reason;
  for (const r of responses) {
    if (r.status === "fulfilled") {
      for (const q of r.value) market.quotes[q.id] = q;
    } else
      market.errors.push(
        r.reason instanceof Error
          ? r.reason.message
          : "Material quotes unavailable.",
      );
  }
  market.updatedAt =
    Object.values(market.quotes)
      .map((q) => q.observedAt)
      .filter((t): t is string => !!t)
      .sort()[0] ?? null;
  return market;
}
