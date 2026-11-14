import { it, expect, vi, afterEach } from "vitest";
import {
  request,
  normalizeTooltip,
  normalizeCrafting,
  normalizeDE,
} from "./ahledger";
afterEach(() => {
  vi.unstubAllGlobals();
  vi.useRealTimers();
});
it("honors cache TTL and no-store without persisting snapshots", async () => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2026-11-14T10:00:00Z"));
  const fetcher = vi.fn().mockImplementation(
    async () =>
      new Response(JSON.stringify({ ok: true }), {
        headers: { "Cache-Control": "public,max-age=2" },
      }),
  );
  vi.stubGlobal("fetch", fetcher);
  await request("/cache-fixture");
  await request("/cache-fixture");
  expect(fetcher).toHaveBeenCalledTimes(1);
  vi.advanceTimersByTime(2001);
  await request("/cache-fixture");
  expect(fetcher).toHaveBeenCalledTimes(2);
  fetcher.mockImplementation(
    async () =>
      new Response("{}", { headers: { "Cache-Control": "no-store" } }),
  );
  await request("/no-store-fixture");
  await request("/no-store-fixture");
  expect(fetcher).toHaveBeenCalledTimes(4);
});
it("429 Retry-After pauses subsequent reads rather than retrying immediately", async () => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2026-11-15T10:00:00Z"));
  const fetcher = vi
    .fn()
    .mockResolvedValue(
      new Response("{}", { status: 429, headers: { "Retry-After": "10" } }),
    );
  vi.stubGlobal("fetch", fetcher);
  await expect(request("/rate-fixture")).rejects.toThrow("429");
  await expect(request("/rate-fixture-2")).rejects.toThrow("pause");
  expect(fetcher).toHaveBeenCalledTimes(1);
  vi.advanceTimersByTime(10001);
  fetcher.mockResolvedValue(
    new Response("{}", { headers: { "Cache-Control": "max-age=0" } }),
  );
  await request("/rate-fixture-2");
  expect(fetcher).toHaveBeenCalledTimes(2);
});
it("subtracts the HTTP cache Age instead of extending a snapshot TTL", async () => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2026-11-16T10:00:00Z"));
  const fetcher = vi.fn().mockImplementation(
    async () =>
      new Response("{}", {
        headers: { "Cache-Control": "max-age=300", Age: "299" },
      }),
  );
  vi.stubGlobal("fetch", fetcher);
  const response = await request("/aged-fixture");
  expect(response.expires - Date.now()).toBe(1000);
  vi.advanceTimersByTime(1001);
  await request("/aged-fixture");
  expect(fetcher).toHaveBeenCalledTimes(2);
});

it("keeps valid provider rows when other rows are null and canonicalizes timestamps", () => {
  const market = "forever.rp.alliance.eu";
  const quotes = normalizeTooltip(
    {
      market,
      items: [
        null,
        {
          id: 4306,
          name: "Silk Cloth",
          minBuyout: 100,
          observedAt: "2026-11-14T09:00:00-05:00",
        },
      ],
    },
    Date.now() + 1000,
  );
  expect(quotes).toHaveLength(1);
  expect(quotes[0].observedAt).toBe("2026-11-14T14:00:00.000Z");
  const valid = {
    recipe: {
      spellId: 123456,
      name: "Synthetic recipe",
      profession: "Tailoring",
    },
    result: { id: 123456, name: "Synthetic item" },
    reagents: [{ id: 4306, qty: 1, name: "Silk Cloth" }],
  };
  expect(
    normalizeCrafting({
      market,
      recipes: [null, valid, { ...valid, reagents: [null] }],
    }),
  ).toHaveLength(1);
  expect(
    normalizeDE({
      market,
      opportunities: [
        null,
        {
          item: { id: 123457, name: "Synthetic armor" },
          yields: [{ id: 11084, chance: 1, minCount: 1, maxCount: 1 }, null],
        },
      ],
    }),
  ).toEqual([]);
  expect(
    normalizeDE({
      market,
      opportunities: [
        {
          item: { id: 123458, name: "Synthetic armor" },
          yields: [{ id: 11084, chance: 1, minCount: 1, maxCount: 1 }],
        },
      ],
    }),
  ).toHaveLength(1);
});

it("late responses cannot replace a newer same-path response in the provider cache", async () => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2026-11-18T10:00:00Z"));
  let finishOld: (r: Response) => void = () => {};
  const fetcher = vi
    .fn()
    .mockImplementationOnce(
      () =>
        new Promise<Response>((resolve) => {
          finishOld = resolve;
        }),
    )
    .mockResolvedValue(
      new Response('{"version":"new"}', {
        headers: { "Cache-Control": "max-age=60" },
      }),
    );
  vi.stubGlobal("fetch", fetcher);
  const old = request("/audit-cache-race");
  const newer = await request("/audit-cache-race");
  expect(newer.data).toEqual({ version: "new" });
  finishOld(
    new Response('{"version":"old"}', {
      headers: { "Cache-Control": "max-age=60" },
    }),
  );
  await old;
  expect((await request("/audit-cache-race")).data).toEqual({ version: "new" });
  expect(fetcher).toHaveBeenCalledTimes(2);
});
