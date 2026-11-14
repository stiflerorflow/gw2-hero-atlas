import { test, expect } from "@playwright/test";
const market = "forever.rp.alliance.eu";
async function fixture(page: any, delayA = 0, historyTTL = 300) {
  await page.route("https://api.ahledger.com/**", async (r: any) => {
    const u = new URL(r.request().url()),
      now = new Date().toISOString();
    let body: any;
    if (u.pathname.endsWith("/markets"))
      body = {
        markets: [
          { id: market, ruleset: "rp", region: "eu", faction: "alliance" },
        ],
      };
    else if (u.pathname.includes("/prices/")) {
      const id = Number(u.pathname.split("/").at(-1));
      if (id === 4306 && delayA)
        await new Promise((r) => setTimeout(r, delayA));
      body = {
        market,
        item: { id, name: id === 4306 ? "Silk Cloth" : "Wool Cloth" },
        latest: { minBuyout: 100, median: 110, quantity: 20, observedAt: now },
        sales: { estimatedPerDay: 10 },
        series: [
          {
            t: new Date(Date.now() - 3600000).toISOString(),
            min: 90,
            median: 100,
          },
          { t: now, min: 100, median: 110 },
        ],
      };
    } else if (u.pathname.includes("/tooltip/"))
      body = {
        market: { slug: "forever/rp/alliance/eu" },
        items: [4306, 2592].map((id) => ({
          id,
          name: id === 4306 ? "Silk Cloth" : "Wool Cloth",
          minBuyout: 100,
          median: 110,
          quantity: 20,
          salesPerDay: 10,
          observedAt: now,
        })),
      };
    else if (u.pathname.includes("/crafting/")) body = { market, recipes: [] };
    else if (u.pathname.includes("/disenchant/"))
      body = { market, opportunities: [] };
    else
      body = {
        market,
        deals: [
          {
            item: { id: 765, name: "Trade Herb" },
            minBuyout: 100,
            median: 180,
            referenceMedian: 200,
            basis: "7d",
            quantity: 20,
            salesPerDay: 10,
            observedAt: now,
          },
        ],
      };
    await r.fulfill({
      json: body,
      headers: {
        "Cache-Control": u.pathname.includes("/prices/")
          ? `max-age=${historyTTL}`
          : "max-age=300",
      },
    });
  });
}
test("watch search cannot add the previously selected unrelated item", async ({
  page,
}) => {
  await fixture(page);
  await page.goto("#watchlist");
  await page
    .getByRole("searchbox", { name: "Find catalogue item" })
    .fill("Coarse Thread");
  await expect(page.locator(".watch-add select")).toHaveValue("2320");
  await page.getByRole("button", { name: "Add to watchlist" }).click();
  await expect(
    page.locator(".watch-card h2").filter({ hasText: "Coarse Thread" }),
  ).toHaveCount(1);
});
test("manual reagent quotes are reachable from leveling without finding another workflow", async ({
  page,
}) => {
  await page.route("https://api.ahledger.com/**", (r) => r.abort());
  await page.goto("#leveling");
  await page.getByText(/Reagent prices ·/).click();
  const quote = page.locator(".input-quotes .quote-editor").first();
  await quote
    .getByRole("textbox", { name: /Purchase price per unit/ })
    .fill("1s");
  await quote.getByRole("button", { name: "Save manual quote" }).click();
  await expect(quote.getByRole("status")).toContainText("Saved");
});
test("a rejected stale-tab action never reports success", async ({ page }) => {
  await fixture(page);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("#opportunities");
  await page.evaluate(() =>
    window.dispatchEvent(
      new StorageEvent("storage", {
        key: "copper-ledger.profile.v1",
        newValue: "changed elsewhere",
      }),
    ),
  );
  await page
    .locator(".mobile-cards .opportunity")
    .first()
    .getByRole("button", { name: /Add to batch/ })
    .click();
  await expect(page.locator(".toast")).toContainText("Reload before editing");
  await expect(page.locator(".toast")).not.toContainText("Added");
});
test("latest history request wins and refresh retains unexpired history", async ({
  page,
}) => {
  await fixture(page, 500);
  await page.goto("#watchlist");
  const a = page.locator(".watch-card").nth(0),
    b = page.locator(".watch-card").nth(1);
  const older = page.waitForResponse(
    (r) => r.url().includes("/prices/") && r.url().includes("/4306?"),
  );
  await a.getByRole("button", { name: "Load 24h / 7d history" }).click();
  await b.getByRole("button", { name: "Load 24h / 7d history" }).click();
  await expect(b.locator("svg")).toHaveCount(1);
  await older;
  await expect(a.locator("svg")).toHaveCount(0);
  await page.getByRole("button", { name: "↻ Refresh", exact: true }).click();
  await expect(b.locator("svg")).toHaveCount(1);
  await expect(
    b.getByRole("button", { name: "Close price history" }),
  ).toBeVisible();
});
test("scanner calculator drafts survive navigation without storing provider prices", async ({
  page,
}) => {
  await fixture(page);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("");
  const card = page.locator(".flip-card").first();
  await card.getByText("Price history & calculator", { exact: true }).click();
  await card
    .getByRole("textbox", { name: /Override gross resale/ })
    .fill("150c");
  await card.getByRole("spinbutton", { name: "Test quantity" }).fill("3");
  await page.getByRole("link", { name: "Crafting", exact: true }).click();
  await page.getByRole("link", { name: "Flip scanner", exact: true }).click();
  const again = page.locator(".flip-card").first();
  await again.getByText("Price history & calculator", { exact: true }).click();
  await expect(
    again.getByRole("spinbutton", { name: "Test quantity" }),
  ).toHaveValue("3");
  await expect(
    again.getByRole("textbox", { name: /Override gross resale/ }),
  ).toHaveValue("1s 50c");
});

test("expired history can be reloaded without removing a newer live quote", async ({
  page,
}) => {
  await page.clock.install();
  await fixture(page, 0, 1);
  await page.goto("#watchlist");
  const card = page.locator(".watch-card").first();
  await card.getByRole("button", { name: "Load 24h / 7d history" }).click();
  await expect(card.locator("svg")).toHaveCount(1);
  await page.getByRole("button", { name: "↻ Refresh", exact: true }).click();
  await expect(card.locator("svg")).toHaveCount(1);
  await page.clock.fastForward(2000);
  await page.clock.runFor(100);
  await expect(card.locator("svg")).toHaveCount(0);
  await expect(
    card.getByRole("button", { name: "Reload price history" }),
  ).toBeVisible();
  await expect(card.locator(".watch-price")).toContainText("1s");
});

test("cross-tab conflict closes profile editing so the warning is actionable", async ({
  page,
}) => {
  await fixture(page);
  await page.goto("#opportunities");
  await page.getByRole("button", { name: "Edit profile", exact: true }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.evaluate(() =>
    window.dispatchEvent(
      new StorageEvent("storage", {
        key: "copper-ledger.profile.v1",
        newValue: "another tab",
      }),
    ),
  );
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(page.getByRole("alert")).toContainText("Another tab changed");
  await expect(page.locator(".wallet")).toContainText("2g 50s");
});

test("late scanner history cannot rewind a newly refreshed buy quote", async ({
  page,
}) => {
  await page.clock.install({ time: new Date("2026-11-14T12:00:00Z") });
  let scans = 0;
  await page.route("https://api.ahledger.com/**", async (r) => {
    const u = new URL(r.request().url());
    let body: any,
      ttl = 300;
    if (u.pathname.endsWith("/markets"))
      body = {
        markets: [
          { id: market, ruleset: "rp", region: "eu", faction: "alliance" },
        ],
      };
    else if (u.pathname.includes("/prices/")) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      body = {
        market,
        item: { id: 765, name: "Trade Herb" },
        latest: {
          minBuyout: 100,
          median: 200,
          quantity: 20,
          observedAt: "2026-11-14T10:00:00Z",
        },
        sales: { estimatedPerDay: 10 },
        series: [
          { t: "2026-11-14T09:00:00Z", min: 90, median: 180 },
          { t: "2026-11-14T10:00:00Z", min: 100, median: 200 },
        ],
      };
    } else {
      scans++;
      ttl = scans === 1 ? 1 : 300;
      body = {
        market,
        deals: [
          {
            item: { id: 765, name: "Trade Herb" },
            minBuyout: scans === 1 ? 100 : 150,
            median: 200,
            referenceMedian: 200,
            basis: "7d",
            quantity: 20,
            salesPerDay: 10,
            observedAt:
              scans === 1 ? "2026-11-14T10:00:00Z" : "2026-11-14T12:00:00Z",
          },
        ],
      };
    }
    await r.fulfill({
      json: body,
      headers: { "Cache-Control": `max-age=${ttl}` },
    });
  });
  await page.goto("");
  const card = page.locator(".flip-card").first();
  await card.getByText("Price history & calculator", { exact: true }).click();
  const older = page.waitForResponse((r) => r.url().includes("/prices/"));
  await card
    .getByRole("button", { name: "Load price history & demand coverage" })
    .click();
  await page.clock.fastForward(1100);
  await page.getByRole("button", { name: "↻ Refresh", exact: true }).click();
  await expect(page.locator(".flip-card .card-numbers dd").first()).toHaveText(
    "1s 50c",
  );
  await older;
  const details = page.locator(".flip-card > details").first();
  if (!(await details.evaluate((node: HTMLDetailsElement) => node.open)))
    await details.locator(":scope > summary").click();
  await expect(page.locator(".flip-card .price-context svg")).toHaveCount(1);
  await expect(page.locator(".flip-card .card-numbers dd").first()).toHaveText(
    "1s 50c",
  );
});
