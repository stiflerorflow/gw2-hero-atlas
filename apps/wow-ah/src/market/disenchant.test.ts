import { it, expect, vi, afterEach } from "vitest";
import { normalizeDisenchantScan, loadDisenchantScan } from "./disenchant";
import { purgeExpired } from "./ahledger";
import { MARKET } from "../types";
const row = (id = 7924) => ({
  item: {
    id,
    name: "Synthetic bracers",
    quality: "UNCOMMON",
    level: 43,
    url: `https://ahledger.com/items/${id}?utm_source=fixture`,
  },
  minBuyout: 3800,
  quantity: 2,
  profit: 999999,
  observedAt: "2026-11-17T09:00:00Z",
  yields: [
    {
      id: 11137,
      name: "Vision Dust",
      minCount: 2,
      maxCount: 5,
      chance: 0.75,
      median: 99999,
    },
    {
      id: 11174,
      name: "Lesser Nether Essence",
      minCount: 1,
      maxCount: 2,
      chance: 0.2,
      median: 99999,
    },
    {
      id: 11177,
      name: "Small Radiant Shard",
      minCount: 1,
      maxCount: 1,
      chance: 0.05,
      median: 99999,
    },
  ],
});
afterEach(() => vi.unstubAllGlobals());
it("keeps source gear quotes and exclusive yields, without accepting provider headline profits", () => {
  const scan = normalizeDisenchantScan(
    {
      market: MARKET,
      opportunities: [row()],
      page: "https://ahledger.com/disenchant?market=forever/rp/alliance/eu",
    },
    Date.now() + 10000,
  );
  expect(scan.candidates).toHaveLength(1);
  expect(scan.candidates[0].listing.ask).toBe(3800);
  expect(scan.candidates[0].outcomes?.map((o) => o.probability)).toEqual([
    0.75, 0.2, 0.05,
  ]);
  expect(scan.names[11137]).toBe("Vision Dust");
  expect(scan.candidates[0]).not.toHaveProperty("profit");
  expect(scan.candidates[0].tableOrigin).toBe("reference");
  expect(() =>
    normalizeDisenchantScan({ market: "another", opportunities: [row()] }),
  ).toThrow("market");
});
it("never repairs incomplete probability by dropping a malformed outcome", () => {
  const x = row();
  (x.yields[1] as any).chance = "20%";
  const scan = normalizeDisenchantScan({ market: MARKET, opportunities: [x] });
  expect(scan.candidates[0].outcomes).toBeNull();
  expect(
    normalizeDisenchantScan({
      market: MARKET,
      opportunities: [{ ...row(), yields: row().yields.slice(0, 2) }],
    }).candidates[0].outcomes,
  ).toBeNull();
});
it("excludes known exceptions, bound items and duplicate rows; checked item tables win", () => {
  const scan = normalizeDisenchantScan({
    market: MARKET,
    opportunities: [
      row(11288),
      { ...row(900001), item: { ...row(900001).item, binding: "Soulbound" } },
      row(7924),
      row(7924),
      row(4253),
    ],
  });
  expect(scan.rejected).toBe(3);
  expect(scan.candidates.map((c) => c.id)).toEqual([7924, 4253]);
  expect(scan.candidates[1].tableOrigin).toBe("checked");
  expect(scan.candidates[1].outcomes![0].drops[0].id).toBe(11084);
});
it("fetches only the dedicated feed and material quotes, honoring expiry and observation times", async () => {
  const calls: string[] = [];
  vi.stubGlobal(
    "fetch",
    vi.fn(async (raw: string) => {
      calls.push(raw);
      const u = new URL(raw);
      let body: unknown = { market: MARKET };
      if (u.pathname.endsWith("/markets"))
        body = {
          markets: [
            { id: MARKET, ruleset: "rp", region: "eu", faction: "alliance" },
          ],
        };
      else if (u.pathname.includes("/disenchant/")) {
        expect(u.searchParams.get("all")).toBe("true");
        expect(u.searchParams.get("limit")).toBe("200");
        body = { market: MARKET, opportunities: [row()] };
      } else if (u.pathname.includes("/tooltip/")) {
        expect(u.searchParams.get("items")).toBe("11137,11174,11177");
        body = {
          market: MARKET,
          items: [
            {
              id: 11137,
              name: "Vision Dust",
              minBuyout: 1000,
              median: 5000,
              quantity: 20,
              observedAt: "2026-11-17T09:00:00Z",
            },
            {
              id: 11174,
              name: "Lesser Nether Essence",
              minBuyout: 4000,
              quantity: 10,
              observedAt: "2026-11-17T09:00:00Z",
            },
            {
              id: 11177,
              name: "Small Radiant Shard",
              minBuyout: 5000,
              quantity: 10,
              observedAt: "2026-11-17T09:00:00Z",
            },
          ],
        };
      }
      return new Response(JSON.stringify(body), {
        headers: { "Cache-Control": "no-store" },
      });
    }),
  );
  const market = await loadDisenchantScan();
  expect(calls).toHaveLength(3);
  expect(calls.some((c) => /crafting|deals/.test(c))).toBe(false);
  expect(market.quotes[7924].ask).toBe(3800);
  expect(market.quotes[11137].ask).toBe(1000);
  expect(market.quotes[11137].observedAt).toBe("2026-11-17T09:00:00.000Z");
  expect(purgeExpired(market).deScan).toBeUndefined();
  expect(purgeExpired(market).quotes).toEqual({});
});
it("keeps missing prices missing when only the source's optimistic median exists", async () => {
  vi.stubGlobal(
    "fetch",
    vi.fn(async (raw: string) => {
      const u = new URL(raw);
      const body = u.pathname.endsWith("/markets")
        ? {
            markets: [
              { id: MARKET, ruleset: "rp", region: "eu", faction: "alliance" },
            ],
          }
        : u.pathname.includes("/disenchant/")
          ? { market: MARKET, opportunities: [row()] }
          : { market: MARKET, items: [] };
      return new Response(JSON.stringify(body), {
        headers: { "Cache-Control": "no-store" },
      });
    }),
  );
  const market = await loadDisenchantScan();
  expect(market.quotes[11137]).toBeUndefined();
  expect(market.deScan?.candidates[0].listing.ask).toBe(3800);
});
