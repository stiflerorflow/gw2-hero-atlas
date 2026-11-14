import { test, expect } from "@playwright/test";
async function prepare(
  page: import("@playwright/test").Page,
  old = false,
  binding: string | null = null,
) {
  await page.route("https://thewowdb.com/api/v1/forever/**", (r) => {
    const row = {
      id: 2320,
      name: "Fixture Thread",
      kind: "item",
      version: "forever",
      quality: "common",
      links: {
        html: "https://thewowdb.com/wow-forever/item/coarse-thread-2320/",
      },
    };
    return r.fulfill({
      json: new URL(r.request().url()).pathname.endsWith("/2320")
        ? { ...row, vendor_sell: 100, binding, build: "fixture-build" }
        : {
            kind: "item",
            version: "forever",
            page: 1,
            has_more: false,
            total: 1,
            results: [row],
          },
      headers: { "Cache-Control": "max-age=60" },
    });
  });
  await page.route("https://api.ahledger.com/**", (r) =>
    r.fulfill({
      json: {
        market: "forever.rp.alliance.eu",
        item: { id: 2320, name: "Fixture Thread" },
        latest: {
          minBuyout: 50,
          quantity: 20,
          observedAt: new Date(Date.now() - (old ? 7200000 : 0)).toISOString(),
        },
        sales: { estimatedPerDay: 10 },
        series: [],
      },
      headers: { "Cache-Control": "max-age=30" },
    }),
  );
  await page.goto("#sell");
  await page.getByRole("searchbox").fill("Fixture");
  await page.getByRole("button", { name: "Search items", exact: true }).click();
  await page.locator(".catalog-results button").first().click();
  await expect(
    page.getByRole("button", { name: "Refresh comparison" }),
  ).toBeEnabled();
  return page.getByRole("region", { name: "Selected item" });
}
test("stale losing quotes require refresh and manual vendor overrides stay visible and reversible", async ({
  page,
}) => {
  const panel = await prepare(page, true);
  await expect(
    panel.getByRole("heading", { name: "Refresh the AH quote" }),
  ).toBeVisible();
  await panel
    .getByText("Adjust prices and see item facts", { exact: true })
    .click();
  await panel.getByRole("textbox", { name: /Vendor sell value/ }).fill("1c");
  await panel
    .getByText("Adjust prices and see item facts", { exact: true })
    .click();
  await expect(
    panel.getByText("Manual vendor value is in use.", { exact: true }),
  ).toBeVisible();
  await panel
    .getByRole("button", { name: "Use catalogue vendor value" })
    .click();
  await expect(
    panel.getByRole("button", { name: "Use catalogue vendor value" }),
  ).toHaveCount(0);
  await expect(
    panel.getByRole("heading", { name: "Refresh the AH quote" }),
  ).toBeVisible();
});
test("expired quote and catalogue payloads are removed while keeping user quantity", async ({
  page,
}) => {
  await page.clock.install();
  const panel = await prepare(page);
  await panel.getByRole("spinbutton", { name: "Quantity owned" }).fill("20");
  await expect(panel).toContainText("Vendor pays at least as much");
  await page.clock.fastForward(61000);
  await expect(panel).not.toContainText("fixture-build");
  await expect(
    panel.getByRole("heading", { name: "Item #2320" }),
  ).toBeVisible();
  await expect(panel).toContainText("No unexpired AH quote");
  await expect(
    panel.getByRole("spinbutton", { name: "Quantity owned" }),
  ).toHaveValue("20");
  await expect(page.locator(".catalog-results")).toHaveCount(0);
});

test("expiry cannot turn a known bound item into an auction recommendation via manual prices", async ({
  page,
}) => {
  await page.clock.install();
  const panel = await prepare(page, false, "Binds when picked up");
  await expect(
    panel.getByRole("heading", { name: "Cannot auction a bound item" }),
  ).toBeVisible();
  await panel
    .getByText("Adjust prices and see item facts", { exact: true })
    .click();
  await panel.getByRole("textbox", { name: /Gross AH price/ }).fill("10s");
  await panel.getByRole("textbox", { name: /Vendor sell value/ }).fill("1c");
  await expect(
    panel.getByRole("checkbox", { name: "Item is already soulbound" }),
  ).toBeChecked();
  await page.clock.fastForward(61000);
  await expect(
    panel.getByRole("heading", { name: "Refresh item facts" }),
  ).toBeVisible();
  await expect(panel).toContainText("Auction eligibility is unknown");
  await expect(
    panel.getByRole("checkbox", { name: "Item is already soulbound" }),
  ).toHaveCount(0);
  await expect(panel).not.toContainText("AH could pay more");
  await panel.getByRole("button", { name: "Refresh comparison" }).click();
  await expect(
    panel.getByRole("heading", { name: "Cannot auction a bound item" }),
  ).toBeVisible();
});
