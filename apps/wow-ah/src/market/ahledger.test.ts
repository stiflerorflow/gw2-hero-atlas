import { it, expect, vi, afterEach } from "vitest";
import { request } from "./ahledger";
afterEach(() => {
  vi.unstubAllGlobals();
  vi.useRealTimers();
});
it("honors cache TTL and no-store without persisting snapshots", async () => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2026-11-14T10:00:00Z"));
  const fetcher = vi
    .fn()
    .mockImplementation(
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
