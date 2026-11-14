import { it, expect } from "vitest";
import { sellDecision } from "./sell";
import {
  normalizeCatalog,
  normalizeCatalogItem,
  itemIdFrom,
} from "../market/catalog";
import { assessCandidate } from "./assessment";
import { normalizeDeals } from "../market/scanner";
it("compares vendor sell value with net AH gold once, in whole owned quantities", () => {
  const d = sellDecision(100, 200, 3, 10, false);
  expect(d.vendorTotal).toBe(300);
  expect(d.ahNet).toBe(560);
  expect(d.extra).toBe(260);
  expect(d.minGross).toBe(109);
  expect(sellDecision(100, 100, 1, 0, false).title).toContain("Vendor pays");
  expect(sellDecision(95, 100, 1, 0, false).minGross).toBe(101);
});
it("unknown, zero and bound items remain distinct", () => {
  expect(sellDecision(null, 100, 1, 0, false).title).toBe(
    "Check the vendor value",
  );
  expect(sellDecision(10, null, 1, 0, false).ahNet).toBeNull();
  expect(sellDecision(0, 100, 1, 0, false).vendorTotal).toBe(0);
  expect(sellDecision(10, 1000, 1, 0, true).ahNet).toBeNull();
  expect(sellDecision(10, 1000, 1, 0, true).title).toContain("bound");
  expect(sellDecision(10, 1000, 1, 0, false, true).title).toBe(
    "Refresh the AH quote",
  );
});
it("catalogue metadata does not consume US/Horde prices or confuse buy and sell", () => {
  const d = normalizeCatalogItem(
    {
      id: 2320,
      kind: "item",
      version: "forever",
      name: "Coarse Thread",
      vendor_sell: 2,
      buy_price: 10,
      price: { region: "us", min: 99999 },
      binding: null,
      links: { html: "javascript:alert(1)" },
    },
    2320,
  );
  expect(d.vendorSell).toBe(2);
  expect(d.url).toBe("https://thewowdb.com");
  expect("price" in d).toBe(false);
  expect(() =>
    normalizeCatalogItem({ ...d, version: "retail", kind: "item" }, 2320),
  ).toThrow();
});
it("catalogue paging and identity validation handle missing entries safely", () => {
  const d = normalizeCatalog({
    kind: "item",
    version: "forever",
    page: 1,
    has_more: true,
    total: null,
    results: [
      null,
      { id: 1, name: "test", kind: "item", version: "forever" },
      { id: 1, name: "duplicate", kind: "item", version: "forever" },
      { id: 2, name: "Retail", kind: "item", version: "retail" },
    ],
  });
  expect(d.items).toHaveLength(1);
  expect(d.hasMore).toBe(true);
  expect(d.total).toBeNull();
  expect(itemIdFrom("|cff|Hitem:2320:0:0|h[Coarse Thread]|h")).toBe(2320);
  expect(itemIdFrom("2320")).toBe(2320);
  expect(itemIdFrom("Coarse Thread")).toBeNull();
});
it("candidate conclusions prioritize the reason to pause rather than encouraging a purchase", () => {
  const q = normalizeDeals(
    {
      market: "forever.rp.alliance.eu",
      deals: [
        {
          item: { id: 2320, name: "Thread" },
          minBuyout: 32,
          median: 32,
          salesPerDay: 20,
          observedAt: new Date().toISOString(),
        },
      ],
    },
    Date.now() + 10000,
  ).quotes[2320];
  expect(assessCandidate(q, 7, 41, 10).title).toBe("Check the vendor price");
  expect(assessCandidate(q, 7, 41, undefined).title).toBe(
    "Needs a price recovery",
  );
  expect(
    assessCandidate({ ...q, observedAt: null }, 7, 30, undefined).title,
  ).toBe("Check the live quote");
});
