import { it, expect } from "vitest";
import { flipScenario } from "./flips";
import { normalizeDeals } from "../market/scanner";
import { MARKET } from "../types";
const fixture = () =>
  normalizeDeals(
    {
      market: MARKET,
      deals: [
        {
          item: { id: 4306, name: "Silk Cloth", quality: "COMMON" },
          minBuyout: 100,
          referenceMedian: 200,
          basis: "7d",
          quantity: 20,
          salesPerDay: 10,
          observedAt: "2026-11-14T10:00:00Z",
        },
      ],
    },
    Date.now() + 60000,
  );
it("uses assumed gross exit, a single AH cut and explicit lost-deposit allowance", () => {
  const m = fixture(),
    s = flipScenario(m.quotes[4306], 200, 90);
  expect(s.exit).toBe(180);
  expect(s.profit).toBe(71);
  expect(s.roi).toBe(71);
  expect(s.maxBuy).toBe(171);
  expect(s.daysSupply).toBe(2);
  expect(flipScenario(m.quotes[4306], 200, 90, 150, 5).profit).toBe(37.5);
});
it("missing, expired and zero-stock purchases are not profitable phantom flips", () => {
  const q = fixture().quotes[4306];
  expect(flipScenario(undefined, 200, 90).profit).toBeNull();
  expect(flipScenario({ ...q, expiresAt: 0 }, 200, 90).profit).toBeNull();
  expect(flipScenario({ ...q, quantity: 0 }, 200, 90).profit).toBeNull();
  expect(flipScenario(q, null, 90).profit).toBeNull();
  expect(flipScenario({ ...q, soldPerDay: 0 }, 200, 90).daysSupply).toBeNull();
});
it("normalizes standalone resale data without professions or character overrides", () => {
  const m = fixture();
  expect(m.imported).toEqual([]);
  expect(m.deItems).toEqual([]);
  expect(m.quotes[4306].soldPerDay).toBe(10);
  expect(m.deals?.[0].basis).toBe("7d");
  expect(() => normalizeDeals({ market: "wrong", deals: [] }, 10)).toThrow();
  const bad = normalizeDeals(
    {
      market: MARKET,
      deals: [
        null,
        { item: { id: 1, name: "item" }, minBuyout: 0, salesPerDay: null },
      ],
    },
    Date.now() + 1000,
  );
  expect(bad.quotes[1].ask).toBeNull();
  expect(bad.quotes[1].soldPerDay).toBeNull();
});

import { historyContext } from "../components/PriceContext";
it("historical context compares listing snapshots without inventing missing intervals", () => {
  const q = fixture().quotes[4306],
    now = Date.parse("2026-11-14T12:00:00Z");
  q.history = [
    { t: "2026-11-14T11:00:00Z", median: 200, min: 180 },
    { t: "2026-11-13T13:00:00Z", median: 150, min: 140 },
    { t: "2026-11-01T00:00:00Z", median: 1, min: 1 },
  ];
  const h = historyContext(q, "24h", now);
  expect(h.rows).toHaveLength(2);
  expect(h.low).toBe(150);
  expect(h.high).toBe(200);
  expect(h.position).toContain("below");
  expect(historyContext({ ...q, history: [] }, "7d", now).position).toContain(
    "Insufficient",
  );
});
