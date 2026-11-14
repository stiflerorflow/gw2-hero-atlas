import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
test("default scanner needs no profile or crafting, ranks market activity and evaluates manual resale", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 780 });
  const paths: string[] = [];
  await page.route("https://api.ahledger.com/**", async (r) => {
    const u = new URL(r.request().url());
    paths.push(u.pathname + u.search);
    const market = "forever.rp.alliance.eu";
    let body: unknown;
    if (u.pathname.endsWith("/markets"))
      body = {
        markets: [
          { id: market, ruleset: "rp", region: "eu", faction: "alliance" },
        ],
      };
    else if (u.pathname.includes("/deals/")) {
      expect(u.searchParams.get("limit")).toBe("200");
      body = {
        market,
        deals: [
          {
            item: {
              id: 765,
              name: "Trade Herb",
              quality: "COMMON",
              url: "https://ahledger.com/items/765",
            },
            minBuyout: 100,
            median: 180,
            referenceMedian: 200,
            basis: "7d",
            quantity: 20,
            salesPerDay: 10,
            observedAt: new Date().toISOString(),
          },
        ],
      };
    } else if (u.pathname.includes("/prices/"))
      body = {
        market,
        item: { id: 765, name: "Trade Herb" },
        latest: {
          minBuyout: 100,
          median: 180,
          quantity: 20,
          observedAt: new Date().toISOString(),
        },
        sales: {
          estimatedPerDay: 10,
          windowDays: 7,
          coveredHours: 11,
          method: "https://ahledger.com/glossary#estimated-sales",
        },
        series: [
          {
            t: new Date(Date.now() - 3600000).toISOString(),
            min: 120,
            median: 180,
          },
          { t: new Date().toISOString(), min: 100, median: 200 },
        ],
      };
    else
      body = { market, recipes: [], opportunities: [], items: [], deals: [] };
    await r.fulfill({
      json: body,
      headers: { "Cache-Control": "max-age=300" },
    });
  });
  await page.goto("#scanner");
  await expect(
    page.getByRole("heading", { name: "Flip scanner" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Edit profile", exact: true }),
  ).toHaveCount(0);
  const card = page.locator(".flip-card").first();
  await expect(card).toContainText("Trade Herb");
  await expect(card).toContainText("71c");
  await expect(card).toContainText("10 / day");
  expect(
    paths.some((p) => p.includes("crafting") || p.includes("disenchant")),
  ).toBe(false);
  await card.getByText("Price history & calculator", { exact: true }).click();
  await card
    .getByRole("textbox", { name: /Override gross resale/ })
    .fill("150c");
  await expect(card).toContainText("43c");
  await card
    .getByRole("button", { name: "Load price history & demand coverage" })
    .click();
  await expect(card.getByRole("img")).toBeVisible();
  await expect(card).toContainText("coverage reported: 11 hours");
  await expect(card).toContainText("below the observed median-ask range");
  await card.getByRole("spinbutton", { name: "Test quantity" }).fill("30");
  await expect(card).toContainText("Quantity exceeds");
  await expect
    .poll(() =>
      page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
    )
    .toBe(true);
  const scan = await new AxeBuilder({ page }).analyze();
  expect(
    scan.violations.map((v) => ({
      id: v.id,
      nodes: v.nodes.map((n) => n.target),
    })),
  ).toEqual([]);
  await page.getByRole("button", { name: /Deep discounts/ }).click();
  await expect
    .poll(() =>
      paths.some((p) => p.includes("discount=50") && p.includes("sells=0")),
    )
    .toBe(true);
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "Flip scanner" }),
  ).toBeVisible();
});
test("scanner handles missing data without phantom flips and preserves crafting workflow", async ({
  page,
}) => {
  await page.route("https://api.ahledger.com/**", (r) => r.abort());
  await page.goto("#scanner");
  await expect(page.getByRole("alert")).toContainText(/fetch|network|failed/i);
  await expect(page.locator(".flip-card")).toHaveCount(0);
  await page.getByRole("link", { name: "Character plan", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Character plan" }),
  ).toBeVisible();
  await expect(
    page.getByRole("combobox", { name: "Character", exact: true }),
  ).toBeVisible();
});

test("historical recovery is opt-in and vendor competition/old quotes are exposed", async ({
  page,
}) => {
  await page.route("https://api.ahledger.com/**", async (r) => {
    const u = new URL(r.request().url()),
      market = "forever.rp.alliance.eu";
    const body = u.pathname.endsWith("/markets")
      ? {
          markets: [
            { id: market, ruleset: "rp", region: "eu", faction: "alliance" },
          ],
        }
      : {
          market,
          deals: [
            {
              item: { id: 254035, name: "Mageweave Reagent Bag" },
              minBuyout: 30000,
              median: 30000,
              referenceMedian: 54214,
              basis: "7d",
              quantity: 22,
              salesPerDay: 13.2,
              observedAt: new Date(Date.now() - 7200000).toISOString(),
            },
            {
              item: { id: 2320, name: "Coarse Thread" },
              minBuyout: 32,
              median: 32,
              referenceMedian: 46,
              basis: "7d",
              quantity: 689,
              salesPerDay: 546.7,
              observedAt: new Date().toISOString(),
            },
          ],
        };
    await r.fulfill({
      json: body,
      headers: { "Cache-Control": "max-age=300" },
    });
  });
  await page.goto("#scanner");
  await expect(page.locator(".empty")).toContainText(
    "No matching resale candidates",
  );
  await page
    .getByRole("combobox", { name: "Resale model", exact: true })
    .selectOption("historical");
  await expect(page.locator(".flip-card")).toHaveCount(2);
  const bag = page.locator(".flip-card").filter({
    has: page.getByRole("heading", { name: "Mageweave Reagent Bag" }),
  });
  await expect(bag).toContainText("Needs a price recovery");
  await expect(bag).toContainText("Quote is 120 minutes old");
  const thread = page
    .locator(".flip-card")
    .filter({ has: page.getByRole("heading", { name: "Coarse Thread" }) });
  await expect(thread).toContainText("Vendor competition");
  await expect(thread).toContainText("10c per unit");
});
