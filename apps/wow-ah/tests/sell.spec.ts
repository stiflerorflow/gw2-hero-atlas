import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
test("search full catalogue, compare correct market, preserve quantity on refresh and handle bound stock", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 780 });
  await page.route("https://thewowdb.com/api/v1/forever/**", (r) => {
    const u = new URL(r.request().url());
    const row = {
      id: 2320,
      name: "Coarse Thread",
      kind: "item",
      version: "forever",
      quality: "common",
      links: {
        html: "https://thewowdb.com/wow-forever/item/coarse-thread-2320/",
      },
    };
    return r.fulfill({
      json: u.pathname.endsWith("/2320")
        ? {
            ...row,
            vendor_sell: 2,
            binding: null,
            price: { region: "us", min: 999999 },
            build: "test-build",
          }
        : {
            kind: "item",
            version: "forever",
            page: 1,
            has_more: true,
            total: null,
            results: [row],
          },
      headers: { "Cache-Control": "max-age=60" },
    });
  });
  await page.route("https://api.ahledger.com/**", (r) =>
    r.fulfill({
      json: {
        market: "forever.rp.alliance.eu",
        item: { id: 2320, name: "Coarse Thread" },
        latest: {
          minBuyout: 10,
          quantity: 20,
          observedAt: new Date().toISOString(),
        },
        sales: { estimatedPerDay: 10 },
        series: [],
      },
      headers: { "Cache-Control": "max-age=60" },
    }),
  );
  await page.goto("#sell");
  await expect(
    page.getByRole("heading", { name: "Sell on the AH or vendor?" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Edit profile", exact: true }),
  ).toHaveCount(0);
  await page.getByRole("searchbox").fill("Coarse");
  await page.getByRole("button", { name: "Search items", exact: true }).click();
  await page.locator(".catalog-results button").first().click();
  const panel = page.getByRole("region", { name: "Selected item" });
  await expect(panel).toContainText("AH could pay more");
  await expect(panel).toContainText("8c");
  await expect(panel).not.toContainText("999999");
  await panel.getByRole("spinbutton", { name: "Quantity owned" }).fill("20");
  await expect(panel).toContainText("1s 90c");
  await panel.getByRole("button", { name: "Refresh comparison" }).click();
  await expect(
    panel.getByRole("spinbutton", { name: "Quantity owned" }),
  ).toHaveValue("20");
  await panel
    .getByRole("checkbox", { name: "Item is already soulbound" })
    .check();
  await expect(panel).toContainText("Cannot auction a bound item");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  const a = await new AxeBuilder({ page }).analyze();
  expect(
    a.violations.map((v) => ({
      id: v.id,
      nodes: v.nodes.map((n) => n.target),
    })),
  ).toEqual([]);
});
test("catalogue failure stays useful and does not pretend there are no items", async ({
  page,
}) => {
  await page.route("https://thewowdb.com/**", (r) => r.abort());
  await page.goto("#sell");
  await page.getByRole("button", { name: "Browse catalogue" }).click();
  await expect(page.getByRole("alert")).toBeVisible();
  await expect(page.locator(".catalog-results")).toHaveCount(0);
});

test("a Classic vendor value cannot reverse the Forever Wand recommendation", async ({
  page,
}) => {
  await page.route("https://thewowdb.com/api/v1/**", (r) =>
    r.fulfill({
      json: {
        id: 11288,
        kind: "item",
        version: "forever",
        name: "Greater Magic Wand",
        quality: "Uncommon",
        vendor_sell: 1535,
        binding: "Binds when equipped",
        links: {
          html: "https://thewowdb.com/wow-forever/item/greater-magic-wand-11288/",
        },
      },
      headers: { "Cache-Control": "max-age=60" },
    }),
  );
  await page.route("https://api.ahledger.com/**", (r) =>
    r.fulfill({
      json: {
        market: "forever.rp.alliance.eu",
        item: { id: 11288, name: "Greater Magic Wand" },
        latest: {
          minBuyout: 300,
          quantity: 10,
          observedAt: new Date().toISOString(),
        },
        series: [],
      },
      headers: { "Cache-Control": "max-age=60" },
    }),
  );
  await page.goto("#sell");
  await page
    .getByRole("searchbox", { name: "Item name, ID or pasted item link" })
    .fill("11288");
  await page.getByRole("button", { name: "Search items", exact: true }).click();
  await page.locator(".catalog-results button").first().click();
  await expect(
    page.getByRole("heading", { name: "AH could pay more", exact: true }),
  ).toBeVisible();
  await expect(
    page.locator(".item-comparison .summary-strip dd").first(),
  ).toHaveText("2s");
  await expect(page.locator(".item-comparison")).toContainText(
    "Forever vendor correction",
  );
  await page
    .getByText("Adjust prices and see item facts", { exact: true })
    .click();
  await page.getByRole("textbox", { name: /Vendor sell value/ }).fill("5s");
  await expect(
    page.getByRole("heading", {
      name: "Vendor pays at least as much",
      exact: true,
    }),
  ).toBeVisible();
});
