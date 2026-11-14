import { afterEach, it, expect, vi } from "vitest";
import { ExpiryCache } from "./expiryCache";
import { getCatalogItem, searchCatalog } from "./catalog";
import { purgeExpired, unknownMarket } from "./ahledger";
afterEach(() => {
  vi.unstubAllGlobals();
  vi.useRealTimers();
});
it("removes expired provider payloads without another request, including replacements and eviction", () => {
  vi.useFakeTimers();
  const cache = new ExpiryCache<object>(2),
    start = Date.now();
  cache.set("a", {
    data: { sensitive: "provider snapshot" },
    expires: start + 100,
  });
  expect(cache.size).toBe(1);
  vi.advanceTimersByTime(100);
  expect(cache.size).toBe(0);
  cache.set("a", { data: {}, expires: Date.now() + 100 });
  cache.set("a", { data: { updated: true }, expires: Date.now() + 200 });
  vi.advanceTimersByTime(100);
  expect(cache.get("a")?.data).toEqual({ updated: true });
  vi.advanceTimersByTime(100);
  expect(cache.size).toBe(0);
  cache.set("no-store", { data: {}, expires: Date.now() });
  expect(cache.size).toBe(0);
  for (const key of ["a", "b", "c"])
    cache.set(key, { data: {}, expires: Date.now() + 500 });
  expect(cache.size).toBe(2);
  expect(cache.get("a")).toBeUndefined();
  cache.clear();
  expect(vi.getTimerCount()).toBe(0);
});
it("passes factual catalogue and result-page deadlines to the UI, without renewing cached TTL", async () => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2026-11-20T00:00:00Z"));
  const row = {
    id: 999888,
    name: "Synthetic item",
    kind: "item",
    version: "forever",
    vendor_sell: 10,
  };
  const fetcher = vi.fn(
    async (input: RequestInfo | URL) =>
      new Response(
        JSON.stringify(
          String(input).includes("?")
            ? {
                kind: "item",
                version: "forever",
                page: 1,
                has_more: false,
                results: [row],
              }
            : row,
        ),
        { headers: { "Cache-Control": "max-age=2" } },
      ),
  );
  vi.stubGlobal("fetch", fetcher);
  const a = await getCatalogItem(999888);
  expect(a.expiresAt).toBe(Date.now() + 2000);
  vi.advanceTimersByTime(1000);
  expect((await getCatalogItem(999888)).expiresAt).toBe(a.expiresAt);
  expect(fetcher).toHaveBeenCalledTimes(1);
  const page = await searchCatalog("Synthetic expiry fixture");
  expect(page.expiresAt).toBe(Date.now() + 2000);
  vi.advanceTimersByTime(1001);
  await getCatalogItem(999888);
  expect(fetcher).toHaveBeenCalledTimes(3);
});
it("removes expired supplemental history while leaving an independently fresh quote usable", () => {
  const m = unknownMarket();
  m.quotes[1] = {
    id: 1,
    name: "Item",
    ask: 10,
    median: 11,
    median7d: null,
    quantity: 1,
    soldPerDay: 1,
    observedAt: null,
    source: "Test",
    url: "",
    expiresAt: Date.now() + 10000,
    coveredHours: null,
    detectedSale: null,
    historyExpiresAt: Date.now() - 1,
    history: [{ t: new Date().toISOString(), median: 11, min: 10 }],
  };
  const q = purgeExpired(m).quotes[1];
  expect(q.ask).toBe(10);
  expect(q.history).toBeUndefined();
  expect(q.historyExpiresAt).toBeUndefined();
});
