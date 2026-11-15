import { test, expect } from "@playwright/test";
import { STORE } from "../src/state/profile";
import { scenarioProfiles as defaults } from "./support/profiles";
import { MARKET } from "../src/types";
import AxeBuilder from "@axe-core/playwright";
test("saved character lands on a compact next action and follows the missing-deposit guide", async ({
  page,
}) => {
  const state = defaults(),
    c = state.characters[0];
  c.characterLevel = 20;
  c.skills.Tailoring!.target = 120;
  c.skills.Enchanting!.target = 100;
  for (const [id, value] of [
    [4306, 100],
    [4305, 1000],
  ])
    c.manual[id] = {
      market: MARKET,
      ask: value,
      exit: value,
      observedAt: new Date().toISOString(),
      note: "Synthetic browser quote",
    };
  await page.route("https://api.ahledger.com/**", (r) => r.abort());
  await page.addInitScript(
    ({ state, key }) => localStorage.setItem(key, JSON.stringify(state)),
    { state, key: STORE },
  );
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("#opportunities");
  await expect(
    page.getByRole("heading", { name: "Character plan", exact: true }),
  ).toBeVisible();
  const editor = page.locator(".context-editor");
  await expect(editor).not.toHaveAttribute("open", "");
  await page.getByText("Compare priorities", { exact: true }).click();
  await page
    .getByRole("checkbox", {
      name: "Include crafting profit scenarios",
      exact: true,
    })
    .check();
  await page.getByText("Compare priorities", { exact: true }).click();
  const card = page.locator(".plan-choice").first();
  await expect(card).toBeVisible();
  expect(
    await card.evaluate((n) => n.getBoundingClientRect().top),
  ).toBeLessThan(844);
  await editor.locator(":scope > summary").click();
  await page
    .getByRole("spinbutton", { name: "Current character level", exact: true })
    .fill("21");
  await page
    .getByRole("button", { name: "Show my next steps", exact: true })
    .click();
  await expect(editor).not.toHaveAttribute("open", "");
  await expect(
    page.getByRole("heading", { name: "Your next steps", exact: true }),
  ).toBeFocused();
  await card
    .getByRole("button", { name: "Add one to batch", exact: true })
    .click();
  await card.getByRole("link", { name: "Review batch", exact: true }).click();
  const guide = page.getByRole("region", {
    name: "Next batch step",
    exact: true,
  });
  await expect(guide).toContainText("Next: enter the posting deposit");
  await guide.getByRole("button", { name: /Enter deposit for/ }).click();
  const deposit = page.getByRole("textbox", {
    name: "Deposit / output unit (copper or g/s/c)",
    exact: true,
  });
  await expect(deposit).toBeFocused();
  await deposit.fill("10c");
  await expect(guide).toContainText("Ready to verify in game");
  await expect(page.locator(".batch-row select").first()).toHaveValue("0");
  await guide
    .getByRole("button", { name: "Open the action checklist", exact: true })
    .click();
  await expect(page.locator(".checklist-text")).toBeVisible();
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
test("Chumbles sees checked current-skill alternatives and explicit coverage after setup", async ({
  page,
}) => {
  const state = defaults(),
    c = state.characters[1];
  state.active = c.id;
  c.characterLevel = 24;
  c.cash = 10000;
  c.budget = 10000;
  c.known = [3171, 3173, 7837, 3177];
  for (const [id, value] of [
    [785, 100],
    [2450, 200],
    [3820, 100],
    [6359, 200],
    [3355, 200],
    [3385, 500],
    [6371, 500],
    [3389, 600],
  ])
    c.manual[id] = {
      market: MARKET,
      ask: value,
      exit: value,
      observedAt: new Date().toISOString(),
      note: "Synthetic browser quote",
    };
  await page.route("https://api.ahledger.com/**", (r) => r.abort());
  await page.addInitScript(
    ({ state, key }) => localStorage.setItem(key, JSON.stringify(state)),
    { state, key: STORE },
  );
  await page.goto("#opportunities");
  await expect(page.locator(".plan-choice").first()).toContainText(
    "Alchemy progress",
  );
  await page.getByText("Checked recipe coverage", { exact: true }).click();
  await expect(page.locator(".character-plan")).toContainText(
    "6 repeat recipes checked",
  );
  await page.getByText("Compare priorities", { exact: true }).click();
  await page
    .getByRole("combobox", { name: "Progress priority", exact: true })
    .selectOption("net");
  await expect(page.locator(".plan-choice").first()).toContainText(
    "Lowest modeled net cost",
  );
});
