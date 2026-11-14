import { test, expect } from "@playwright/test";
test("scanner exposes candidates early with readable controls and stable local typography", async ({
  page,
}) => {
  const fontRequests: string[] = [];
  page.on("request", (r) => {
    if (/fonts\.(googleapis|gstatic)\.com/.test(r.url()))
      fontRequests.push(r.url());
  });
  await page.route("https://api.ahledger.com/**", (r) => {
    const u = new URL(r.request().url()),
      market = "forever.rp.alliance.eu";
    return r.fulfill({
      json: u.pathname.endsWith("/markets")
        ? {
            markets: [
              { id: market, ruleset: "rp", region: "eu", faction: "alliance" },
            ],
          }
        : {
            market,
            deals: Array.from({ length: 111 }, (_, i) => ({
              item: { id: 50000 + i, name: "Trade material " + i },
              minBuyout: 100,
              median: 180,
              referenceMedian: 200,
              basis: "7d",
              quantity: 20,
              salesPerDay: 10,
              observedAt: new Date().toISOString(),
            })),
          },
      headers: { "Cache-Control": "max-age=300" },
    });
  });
  for (const [width, limit] of [
    [320, 780],
    [390, 750],
    [1280, 650],
  ]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("");
    const card = page.locator(".flip-card").first();
    await expect(card).toBeVisible();
    expect(
      await card.evaluate((n) => n.getBoundingClientRect().top),
    ).toBeLessThanOrEqual(limit);
    if (width === 390) {
      const prices = await card
        .locator(".card-numbers dd")
        .evaluateAll((nodes) =>
          nodes.map((n) => n.getBoundingClientRect().bottom),
        );
      expect(Math.max(...prices)).toBeLessThanOrEqual(844);
    }
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    expect(
      await page
        .getByRole("heading", { level: 1 })
        .evaluate((n) => getComputedStyle(n).fontFamily),
    ).toContain("system-ui");
    expect(
      await card
        .locator(".card-numbers dd")
        .first()
        .evaluate((n) => getComputedStyle(n).fontVariantNumeric),
    ).toContain("tabular-nums");
    for (const selector of [
      ".scan-presets button",
      ".scan-controls input",
      ".scan-controls select",
      ".main-nav a",
    ])
      for (const el of await page.locator(selector).all())
        if (await el.isVisible())
          expect(
            await el.evaluate((n) => n.getBoundingClientRect().height),
          ).toBeGreaterThanOrEqual(44);
  }
  expect(fontRequests).toEqual([]);
});
