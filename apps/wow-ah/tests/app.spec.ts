import { installScenario } from "./support/profiles";
import { test, expect } from "@playwright/test";
test.beforeEach(async ({ page }) => installScenario(page));
import AxeBuilder from "@axe-core/playwright";
const api = "https://api.ahledger.com/v1/**";
test("phone: navigation, isolated profiles, inventory, batch and accessible layout", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.setViewportSize({ width: 390, height: 844 });
  await page.route(api, (r) =>
    r.fulfill({
      status: 503,
      headers: { "Retry-After": "60" },
      body: "Unavailable",
    }),
  );
  await page.goto("#opportunities");
  await page.locator(".all-crafting > summary").click();
  await expect(
    page.getByRole("heading", { name: "Crafting scenarios" }),
  ).toBeVisible();
  await expect(page.locator(".wallet")).toContainText("2g 50s");
  await expect(page.locator(".opportunity")).toHaveCount(3);
  await page
    .getByRole("combobox", { name: "Character", exact: true })
    .selectOption("chumbles");
  await expect(page.locator(".wallet")).toContainText("Unknown");
  await expect(page.locator(".wallet")).toContainText("Alchemy 130");
  await page
    .getByRole("combobox", { name: "Character", exact: true })
    .selectOption("grimpo-grongo");
  await expect(page.locator(".wallet")).toContainText("Engineering 130");
  await page
    .getByRole("combobox", { name: "Character", exact: true })
    .selectOption("glimpo");
  await page.getByRole("button", { name: "Edit profile", exact: true }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await dialog
    .getByRole("spinbutton", { name: "Available whole units" })
    .fill("7");
  await dialog.getByRole("button", { name: "Set available quantity" }).click();
  await expect(dialog.locator(".inventory-list")).toContainText("7 ×");
  await page.getByRole("button", { name: "Close profile" }).click();
  await page.getByRole("link", { name: "Leveling", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Your learned-recipe route" }),
  ).toBeVisible();
  await page.getByRole("link", { name: /Batch planner/ }).click();
  await expect(
    page.getByRole("heading", { name: /batch|shopping/i }).first(),
  ).toBeVisible();
  await page.getByRole("link", { name: "Watchlist", exact: true }).click();
  await expect(page.locator("main")).toContainText("Record a completed sale");
  await page.reload();
  await expect(
    page.getByRole("combobox", { name: "Character", exact: true }),
  ).toHaveValue("glimpo");
  for (const width of [320, 390, 768, 1280]) {
    await page.setViewportSize({ width, height: 844 });
    for (const hash of [
      "scanner",
      "sell",
      "opportunities",
      "leveling",
      "batch",
      "watchlist",
    ]) {
      await page.goto("#" + hash);
      await expect
        .poll(() =>
          page.evaluate(
            () => document.documentElement.scrollWidth <= window.innerWidth,
          ),
        )
        .toBe(true);
    }
  }
  expect(errors).toEqual([]);
  const axe = await new AxeBuilder({ page }).analyze();
  expect(axe.violations.map((v) => `${v.id}: ${v.nodes.length}`)).toEqual([]);
});
test("manual quotes remain useful without provider and batch survives refresh", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.route(api, (r) => r.fulfill({ status: 503, body: "Unavailable" }));
  await page.goto("#opportunities");
  await page.locator(".all-crafting > summary").click();
  await page
    .getByRole("combobox", { name: "Action", exact: true })
    .selectOption("buy-de");
  await page
    .getByRole("searchbox", { name: "Find an item" })
    .fill("Azure Silk Hood");
  await page
    .locator(".mobile-cards .opportunity")
    .first()
    .getByText("Show the calculation", { exact: true })
    .click();
  const card = page.locator(".mobile-cards .opportunity").first();
  await card
    .getByText("Enter your in-game quote / exit scenario", { exact: true })
    .click();
  await card
    .getByRole("textbox", { name: /Purchase price per unit/ })
    .fill("10s");
  await card.getByRole("button", { name: "Save manual quote" }).click();
  await expect(card).toContainText("Saved for this character");
  await card.getByRole("button", { name: "Add to batch" }).click();
  await page.getByRole("link", { name: /Batch planner/ }).click();
  await expect(page.locator(".batch-row")).toHaveCount(1);
  await page.reload();
  await expect(page.locator(".batch-row")).toHaveCount(1);
  await expect(page.locator(".batch-row select").first()).toHaveValue("0");
});
test("every screen passes accessibility checks on phone and desktop", async ({
  page,
}) => {
  await page.route(api, (r) => r.abort());
  for (const width of [390, 1280]) {
    await page.setViewportSize({ width, height: 844 });
    for (const hash of [
      "scanner",
      "sell",
      "opportunities",
      "leveling",
      "batch",
      "watchlist",
    ]) {
      await page.goto("#" + hash);
      const scan = await new AxeBuilder({ page }).analyze();
      expect(
        scan.violations.map(
          (v) =>
            `${hash}@${width}: ${v.id} ${v.nodes.map((n) => n.target).join()}`,
        ),
      ).toEqual([]);
    }
  }
});

test("synthetic provider: real adapter shapes, limited stock and history", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.route(api, async (route) => {
    const url = new URL(route.request().url()),
      market = "forever.rp.alliance.eu",
      observedAt = new Date().toISOString();
    let body: unknown = { market };
    if (url.pathname.endsWith("/markets"))
      body = {
        markets: [
          { id: market, ruleset: "rp", region: "eu", faction: "alliance" },
        ],
      };
    else if (url.pathname.includes("/tooltip/"))
      body = {
        market: { slug: "forever/rp/alliance/eu" },
        items: [
          {
            id: 4253,
            name: "Toughened Leather Gloves",
            minBuyout: 3555,
            quantity: 1,
            salesPerDay: 0,
            observedAt,
          },
          {
            id: 11084,
            name: "Large Glimmering Shard",
            minBuyout: 5022,
            quantity: 10,
            salesPerDay: 2,
            observedAt,
          },
        ],
      };
    else if (url.pathname.includes("/crafting/"))
      body = { market, recipes: [] };
    else if (url.pathname.includes("/disenchant/"))
      body = { market, opportunities: [] };
    else if (url.pathname.includes("/deals/")) body = { market, deals: [] };
    else if (url.pathname.includes("/prices/"))
      body = {
        market,
        item: { id: 4306, name: "Silk Cloth" },
        latest: {
          minBuyout: 200,
          median: 210,
          median7d: 205,
          quantity: 30,
          observedAt,
        },
        sales: { estimatedPerDay: 0, coveredHours: 168 },
        series: [
          { t: new Date(Date.now() - 3600000).toISOString(), median: 205 },
          { t: observedAt, median: 210 },
        ],
        attribution: { url: "https://ahledger.com?utm_source=ahledger_api" },
      };
    await route.fulfill({
      json: body,
      headers: { "Cache-Control": "public,max-age=300" },
    });
  });
  await page.goto("#opportunities");
  await page.locator(".all-crafting > summary").click();
  await page
    .getByRole("combobox", { name: "Action", exact: true })
    .selectOption("buy-de");
  const card = page.locator(".mobile-cards .opportunity").filter({
    has: page.getByRole("heading", {
      name: "Toughened Leather Gloves",
      exact: true,
    }),
  });
  await expect(card).toContainText("12s 16c");
  await expect(card).toContainText("0/day estimated");
  await card.getByRole("button", { name: /Add to batch/ }).click();
  await card.getByRole("button", { name: /Add to batch/ }).click();
  await page.getByRole("link", { name: /Batch planner/ }).click();
  await expect(page.locator(".batch-row").nth(1)).toContainText("Only 0");
  await expect(page.locator(".batch-status")).toContainText("incomplete");
  await page.getByRole("link", { name: "Watchlist", exact: true }).click();
  await page
    .locator(".watch-card")
    .first()
    .getByRole("button", { name: "Load 24h / 7d history" })
    .click();
  await expect(page.locator(".history svg")).toBeVisible();
  await expect(page.locator(".history")).toContainText(
    "Separately sourced detected sale price: Unknown",
  );
});
