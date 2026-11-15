import { installScenario } from "./support/profiles";
import { test, expect } from "@playwright/test";
test.beforeEach(async ({ page }) => installScenario(page));
import AxeBuilder from "@axe-core/playwright";
const market = "forever.rp.alliance.eu";
async function prices(page: import("@playwright/test").Page) {
  await page.route("https://api.ahledger.com/**", async (r) => {
    const url = new URL(r.request().url());
    let body: unknown = { market };
    if (url.pathname.endsWith("/markets"))
      body = {
        markets: [
          { id: market, ruleset: "rp", region: "eu", faction: "alliance" },
        ],
      };
    if (url.pathname.includes("/tooltip/"))
      body = {
        market: { slug: "forever/rp/alliance/eu" },
        items: [
          {
            id: 4306,
            name: "Silk Cloth",
            minBuyout: 100,
            quantity: 100,
            observedAt: new Date().toISOString(),
          },
          {
            id: 4305,
            name: "Bolt of Silk Cloth",
            minBuyout: 1000,
            quantity: 100,
            observedAt: new Date().toISOString(),
          },
        ],
      };
    await r.fulfill({
      json: body,
      headers: { "Cache-Control": "max-age=300" },
    });
  });
}
test("character context is short, isolated and persistent without changing the general scanner", async ({
  page,
}) => {
  await page.route("https://api.ahledger.com/**", (r) => r.abort());
  await page.goto("#opportunities");
  await expect(
    page.getByRole("heading", { name: "Character plan", exact: true }),
  ).toBeVisible();
  await expect(page.locator(".all-crafting")).not.toHaveAttribute("open", "");
  const context = page.getByRole("region", { name: "Character context" });
  await expect(
    context.getByRole("spinbutton", { name: "Current character level" }),
  ).toHaveValue("");
  await context
    .getByRole("spinbutton", { name: "Current character level" })
    .fill("20");
  await context
    .getByRole("textbox", { name: "Current gold on this character" })
    .fill("3g");
  await context
    .getByText("Recorded supplies · optional", { exact: true })
    .click();
  await context
    .getByRole("spinbutton", { name: "Wool Cloth", exact: true })
    .fill("7");
  await expect(context).toContainText("3g");
  await page
    .getByRole("combobox", { name: "Character", exact: true })
    .selectOption("chumbles");
  await expect(
    context.getByRole("spinbutton", { name: "Current character level" }),
  ).toHaveValue("");
  await expect(
    context.getByRole("textbox", { name: "Current gold on this character" }),
  ).toHaveValue("");
  await context
    .getByRole("spinbutton", { name: "Current character level" })
    .fill("24");
  await context
    .getByRole("textbox", { name: "Current gold on this character" })
    .fill("1g");
  await context
    .getByRole("spinbutton", { name: "Current Alchemy skill" })
    .fill("135");
  await page
    .getByRole("combobox", { name: "Character", exact: true })
    .selectOption("glimpo");
  await context.locator(".context-editor > summary").click();
  await expect(
    context.getByRole("spinbutton", { name: "Current character level" }),
  ).toHaveValue("20");
  await expect(
    context.getByRole("textbox", { name: "Current gold on this character" }),
  ).toHaveValue("3g 0s");
  await context
    .getByText("Recorded supplies · optional", { exact: true })
    .click();
  await expect(
    context.getByRole("spinbutton", { name: "Wool Cloth", exact: true }),
  ).toHaveValue("7");
  await page.reload();
  await context.locator(".context-editor > summary").click();
  await expect(
    context.getByRole("spinbutton", { name: "Current character level" }),
  ).toHaveValue("20");
  const saved = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("copper-ledger.profile.v1")!),
  );
  expect(saved.characters[0].inventory[2592].qty).toBe(7);
  expect(saved.characters[1].skills.Alchemy.level).toBe(135);
  expect(saved.characters[1].characterLevel).toBe(24);
  expect(saved.characters[2].characterLevel).toBeNull();
  await page.getByRole("link", { name: "Market scan", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Market scan", exact: true }),
  ).toBeVisible();
});

test("a priced recommendation keeps gray conversions separate from skill gains and funds no assumed sales", async ({
  page,
}) => {
  await prices(page);
  await page.goto("#opportunities");
  await page
    .getByRole("spinbutton", { name: "Current character level" })
    .fill("20");
  await page.getByText("Compare priorities", { exact: true }).click();
  await page
    .getByRole("checkbox", {
      name: "Include crafting profit scenarios",
      exact: true,
    })
    .check();
  const card = page.locator(".plan-choice").filter({
    has: page.getByRole("heading", {
      name: "Bolt of Silk Cloth",
      exact: true,
    }),
  });
  await expect(card).toBeVisible();
  await expect(card.locator(".plan-goal")).toHaveText("Gold scenario");
  await expect(card.locator(".mini-stats dd").nth(1)).toHaveText("0.00");
  await expect(card).toContainText("5s 50c");
  await card
    .getByRole("button", { name: "Add one to batch", exact: true })
    .click();
  await card.getByRole("link", { name: "Review batch" }).click();
  await expect(page.locator(".batch-row")).toHaveCount(1);
  await expect(page.locator(".batch-row select").first()).toHaveValue("0");
  await expect(page.locator(".batch-status")).toContainText("incomplete");
  const saved = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("copper-ledger.profile.v1")!),
  );
  expect(saved.characters[0].batch[0].deposit).toBeNull();
  expect(saved.characters[0].batch[0].sellFraction).toBe(0);
  expect(JSON.stringify(saved)).not.toContain("api.ahledger.com");
});

test("expanded character plan is readable and accessible on narrow phones and desktop", async ({
  page,
}) => {
  await prices(page);
  await page.goto("#opportunities");
  await page
    .getByRole("spinbutton", { name: "Current character level" })
    .fill("20");
  await page.getByText("Recorded supplies · optional", { exact: true }).click();
  await page.getByText("Compare priorities", { exact: true }).click();
  await page
    .getByRole("checkbox", {
      name: "Include crafting profit scenarios",
      exact: true,
    })
    .check();
  await page
    .getByText("How character level and priorities are used", { exact: true })
    .click();
  await page.locator(".plan-choice details > summary").first().click();
  for (const width of [320, 390, 1280]) {
    await page.setViewportSize({ width, height: 844 });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    for (const control of await page
      .locator(".character-plan input, .character-plan select")
      .all()) {
      expect(
        await control.evaluate((n) => parseFloat(getComputedStyle(n).fontSize)),
      ).toBeGreaterThanOrEqual(width <= 600 ? 16 : 12);
    }
    const scan = await new AxeBuilder({ page }).analyze();
    expect(
      scan.violations.map(
        (v) => `${v.id}: ${v.nodes.map((n) => n.target).join()}`,
      ),
    ).toEqual([]);
  }
});

test("changing profession preserves its position and a new skill moves the default target forward", async ({
  page,
}) => {
  await page.route("https://api.ahledger.com/**", (r) => r.abort());
  await page.goto("#opportunities");
  const first = page.getByRole("group", { name: "Profession 1", exact: true });
  await first
    .getByRole("combobox", { name: "Profession", exact: true })
    .selectOption("Alchemy");
  await expect(
    first.getByRole("combobox", { name: "Profession", exact: true }),
  ).toHaveValue("Alchemy");
  await expect(
    page
      .getByRole("group", { name: "Profession 2", exact: true })
      .getByRole("combobox"),
  ).toHaveValue("Enchanting");
  await first
    .getByRole("spinbutton", { name: "Current Alchemy skill" })
    .fill("150");
  await page
    .getByRole("spinbutton", { name: "Current character level" })
    .fill("20");
  await expect(
    page.getByRole("region", { name: "Suggested next steps" }),
  ).toContainText("confirm Expert training");
  const saved = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("copper-ledger.profile.v1")!),
  );
  expect(saved.characters[0].skills.Alchemy).toEqual({
    level: 150,
    cap: 150,
    target: 225,
  });
  await page.reload();
  await page.locator(".context-editor > summary").click();
  await expect(first.getByRole("combobox")).toHaveValue("Alchemy");
});

test("confirming a Copper Rod unlocks Wand progress, without assuming tool ownership or guaranteed DE profit", async ({
  page,
}) => {
  const market = "forever.rp.alliance.eu";
  await page.route("https://api.ahledger.com/**", async (r) => {
    const path = new URL(r.request().url()).pathname;
    let body: any = { market };
    if (path.endsWith("/markets"))
      body = {
        markets: [
          { id: market, ruleset: "rp", region: "eu", faction: "alliance" },
        ],
      };
    else if (path.includes("/tooltip/"))
      body = {
        market,
        items: [
          [10938, 100],
          [11288, 500],
          [10059, 7000],
          [11176, 3000],
          [11175, 30000],
          [11178, 20000],
        ].map(([id, minBuyout]) => ({
          id,
          name: String(id),
          minBuyout,
          quantity: 10,
          observedAt: new Date(Date.now() - 90 * 60000).toISOString(),
        })),
      };
    await r.fulfill({
      json: body,
      headers: { "Cache-Control": "max-age=300" },
    });
  });
  await page.goto("#opportunities");
  await page
    .getByRole("spinbutton", { name: "Current character level", exact: true })
    .fill("20");
  await expect(
    page.locator(".plan-choice h3").filter({ hasText: "Greater Magic Wand" }),
  ).toHaveCount(0);
  await page
    .getByRole("checkbox", {
      name: "I have Runed Copper Rod available",
      exact: true,
    })
    .check();
  const wand = page.locator(".plan-choice").filter({
    has: page.getByRole("heading", {
      name: "Greater Magic Wand",
      exact: true,
    }),
  });
  await expect(wand).toContainText("Enchanting progress");
  await page.getByText("Compare priorities", { exact: true }).click();
  await page
    .getByRole("checkbox", {
      name: "Include crafting profit scenarios",
      exact: true,
    })
    .check();
  await page
    .getByRole("combobox", { name: "Gold priority", exact: true })
    .selectOption("margin");
  const de = page.locator(".plan-choice").filter({
    has: page.getByRole("heading", {
      name: "Duskwoven Bracers",
      exact: true,
    }),
  });
  await expect(de).toContainText("25%");
  await expect(de).toContainText("over an hour old");
  await expect(de).toContainText("DE skill gains are not modeled");
  await page.reload();
  await page.locator(".context-editor > summary").click();
  await expect(
    page.getByRole("checkbox", {
      name: "I have Runed Copper Rod available",
      exact: true,
    }),
  ).toBeChecked();
  await expect(wand).toBeVisible();
});
