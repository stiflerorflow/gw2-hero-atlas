import { test, expect } from "@playwright/test";
const market = "forever.rp.alliance.eu";
test("an explicit unknown binding value cannot certify an item as tradeable", async ({
  page,
}) => {
  await page.route("https://thewowdb.com/api/v1/**", (r) =>
    r.fulfill({
      json: {
        id: 987649,
        kind: "item",
        version: "forever",
        name: "Unknown-binding item",
        vendor_sell: 100,
        binding: "UNKNOWN",
        quality: "Uncommon",
      },
      headers: { "Cache-Control": "max-age=60" },
    }),
  );
  await page.route("https://api.ahledger.com/**", (r) =>
    r.fulfill({
      json: {
        market,
        item: { id: 987649, name: "Unknown-binding item" },
        latest: { minBuyout: 300, observedAt: new Date().toISOString() },
        series: [],
      },
      headers: { "Cache-Control": "max-age=60" },
    }),
  );
  await page.goto("#sell");
  await page
    .getByRole("searchbox", { name: "Item name, ID or pasted item link" })
    .fill("987649");
  await page.getByRole("button", { name: "Search items", exact: true }).click();
  await page.locator(".catalog-results button").first().click();
  await expect(
    page.getByRole("heading", { name: "Refresh item facts", exact: true }),
  ).toBeVisible();
});

test("an open comparison changes its conclusion when the observation crosses the stale threshold", async ({
  page,
}) => {
  await page.clock.install({ time: new Date("2026-11-14T12:00:00Z") });
  await page.clock.setFixedTime(new Date("2026-11-14T12:00:00Z"));
  await page.route("https://thewowdb.com/api/v1/**", (r) =>
    r.fulfill({
      json: {
        id: 987648,
        kind: "item",
        version: "forever",
        name: "Aging item",
        vendor_sell: 100,
        binding: null,
        quality: "Uncommon",
      },
      headers: { "Cache-Control": "max-age=300" },
    }),
  );
  await page.route("https://api.ahledger.com/**", (r) =>
    r.fulfill({
      json: {
        market,
        item: { id: 987648, name: "Aging item" },
        latest: { minBuyout: 300, observedAt: "2026-11-14T11:00:01Z" },
        series: [],
      },
      headers: { "Cache-Control": "max-age=300" },
    }),
  );
  await page.goto("#sell");
  await page
    .getByRole("searchbox", { name: "Item name, ID or pasted item link" })
    .fill("987648");
  await page.getByRole("button", { name: "Search items", exact: true }).click();
  await page.locator(".catalog-results button").first().click();
  await expect(
    page.getByRole("heading", { name: "AH could pay more", exact: true }),
  ).toBeVisible();
  await page.clock.setFixedTime(new Date("2026-11-14T12:00:01.100Z"));
  await page.clock.fastForward(1100);
  await expect(
    page.getByRole("heading", { name: "Refresh the AH quote", exact: true }),
  ).toBeVisible();
});
