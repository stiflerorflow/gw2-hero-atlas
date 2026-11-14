import { it, expect, vi, afterEach } from "vitest";
import { getCatalogItem, itemIdFrom } from "./catalog";
afterEach(() => {
  vi.unstubAllGlobals();
  vi.useRealTimers();
});
it("recognizes the catalogue URL format it actually links to, without parsing arbitrary text as an item", () => {
  expect(
    itemIdFrom(
      "https://thewowdb.com/wow-forever/item/greater-magic-wand-11288/?view=stats#facts",
    ),
  ).toBe(11288);
  expect(itemIdFrom("https://thewowdb.com/wow-forever/item/11288/")).toBe(
    11288,
  );
  expect(
    itemIdFrom("https://www.wowhead.com/forever/item=11288/greater-magic-wand"),
  ).toBe(11288);
  expect(itemIdFrom("Guide for levels 1-300")).toBeNull();
  expect(itemIdFrom("https://example.com/news/a-guide-11288/")).toBeNull();
});
it("a late detail response cannot replace the newer catalogue payload in cache", async () => {
  let finish: (r: Response) => void = () => {};
  const response = (name: string) =>
    new Response(
      JSON.stringify({
        version: "forever",
        kind: "item",
        id: 987653,
        name,
        vendor_sell: 10,
      }),
      { headers: { "Cache-Control": "max-age=60" } },
    );
  const fetcher = vi
    .fn()
    .mockImplementationOnce(
      () =>
        new Promise<Response>((resolve) => {
          finish = resolve;
        }),
    )
    .mockResolvedValue(response("New item facts"));
  vi.stubGlobal("fetch", fetcher);
  const old = getCatalogItem(987653);
  await getCatalogItem(987653);
  finish(response("Old item facts"));
  await old;
  expect((await getCatalogItem(987653)).name).toBe("New item facts");
  expect(fetcher).toHaveBeenCalledTimes(2);
});
