import { test, expect } from "@playwright/test";
import { defaults, STORE } from "../src/state/profile";
import { MARKET } from "../src/types";
import AxeBuilder from "@axe-core/playwright";
test("landing discovers arbitrary listing leads without recipe ideas or a resale assumption", async ({
  page,
}) => {
  const paths: string[] = [];
  await page.route("https://api.ahledger.com/**", async (r) => {
    const u = new URL(r.request().url());
    paths.push(u.pathname);
    if (u.pathname.includes("/deals/")) {
      expect(u.searchParams.get("discount")).toBe("15");
      expect(u.searchParams.get("sells")).toBe("0");
    }
    await r.fulfill({
      json: u.pathname.endsWith("/markets")
        ? {
            markets: [
              { id: MARKET, ruleset: "rp", region: "eu", faction: "alliance" },
            ],
          }
        : {
            market: MARKET,
            deals: [
              {
                item: { id: 887766, name: "Unfamiliar market item" },
                minBuyout: 100,
                median: null,
                referenceMedian: null,
                quantity: 3,
                salesPerDay: null,
                observedAt: new Date().toISOString(),
              },
            ],
          },
      headers: { "Cache-Control": "max-age=300" },
    });
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("");
  await expect(
    page.getByRole("heading", { name: "Market scan", exact: true }),
  ).toBeVisible();
  const card = page.locator(".flip-card").first();
  await expect(card).toContainText("Unfamiliar market item");
  await expect(card.locator(".card-numbers dd")).toHaveText([
    "1s",
    "Unknown",
    "3",
  ]);
  await expect(card.locator(".candidate-verdict")).toContainText(
    "Asking prices are not completed sales",
  );
  await expect(card.locator(".flip-demand")).toContainText("Unknown");
  await expect(
    card.getByText("Potential profit / unit", { exact: true }),
  ).not.toBeVisible();
  expect(
    paths.some((p) => p.includes("crafting") || p.includes("disenchant")),
  ).toBe(false);
  expect(await page.locator("main").innerText()).not.toMatch(
    /Meditation|Elixir of Wisdom/,
  );
  await card.getByText("Price history & calculator", { exact: true }).click();
  await expect(card.locator(".scenario-evidence")).toContainText(
    "not observed profit",
  );
  await expect(card.locator(".scenario-evidence dd")).toHaveText([
    "Unknown",
    "Unknown",
  ]);
  for (const width of [320, 390, 1280]) {
    await page.setViewportSize({ width, height: 844 });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  }
});
test("missing market data gives no canned fallback; new and existing context stays factual", async ({
  page,
}) => {
  await page.route("https://api.ahledger.com/**", (r) => r.abort());
  await page.goto("");
  await expect(page.locator(".empty")).toContainText(
    "No matching listing leads",
  );
  await expect(page.locator(".flip-card")).toHaveCount(0);
  await page.getByRole("link", { name: "Character plan", exact: true }).click();
  await expect(
    page.getByRole("textbox", {
      name: "Current gold on this character",
      exact: true,
    }),
  ).toHaveValue("");
  await page
    .getByRole("spinbutton", { name: "Current character level", exact: true })
    .fill("20");
  await page
    .getByRole("textbox", {
      name: "Current gold on this character",
      exact: true,
    })
    .fill("1g");
  await page.getByText("Compare priorities", { exact: true }).click();
  await expect(
    page.getByRole("checkbox", {
      name: "Include crafting profit scenarios",
      exact: true,
    }),
  ).not.toBeChecked();
  await expect(page.locator(".plan-choice")).toHaveCount(0);
  const saved = await page.evaluate(
    (key) => JSON.parse(localStorage.getItem(key)!),
    STORE,
  );
  expect(saved.characters[0].known).toEqual([]);
  expect(saved.characters[0].inventory).toEqual({});
  await page.getByRole("button", { name: "Edit profile", exact: true }).click();
  const inventory = page.getByRole("dialog");
  await expect(
    inventory.getByRole("combobox", { name: "Item", exact: true }),
  ).toHaveValue("0");
  await expect(
    inventory.getByRole("button", {
      name: "Set available quantity",
      exact: true,
    }),
  ).toBeDisabled();
});
test("existing recorded data survives the new defaults and only enters gold scenarios by choice", async ({
  page,
}) => {
  const state = defaults(),
    c = state.characters[0];
  c.characterLevel = 20;
  c.cash = c.budget = 12345;
  c.known = [3839, 3852];
  c.skills.Tailoring!.target = 120;
  c.skills.Enchanting!.target = 100;
  c.inventory[3383] = { qty: 9, note: "User recorded stock" };
  for (const [id, value] of [
    [4306, 100],
    [4305, 1000],
  ])
    c.manual[id] = {
      market: MARKET,
      ask: value,
      exit: value,
      observedAt: new Date().toISOString(),
      note: "Manual scenario",
    };
  await page.addInitScript(
    ({ state, key }) => {
      if (!localStorage.getItem(key))
        localStorage.setItem(key, JSON.stringify(state));
    },
    { state, key: STORE },
  );
  await page.route("https://api.ahledger.com/**", (r) => r.abort());
  await page.goto("#opportunities");
  await expect(page.locator(".plan-choice")).toHaveCount(0);
  await page.getByText("Compare priorities", { exact: true }).click();
  await page
    .getByRole("checkbox", {
      name: "Include crafting profit scenarios",
      exact: true,
    })
    .check();
  await expect(page.locator(".plan-choice").first()).toContainText(
    "Gold scenario",
  );
  const saved = await page.evaluate(
    (key) => JSON.parse(localStorage.getItem(key)!),
    STORE,
  );
  expect(saved.characters[0].cash).toBe(12345);
  expect(saved.characters[0].inventory[3383].qty).toBe(9);
  expect(saved.characters[0].known).toEqual([3839, 3852]);
});
