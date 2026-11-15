import { test, expect } from "@playwright/test";
import { STORE } from "../src/state/profile";
import { scenarioProfiles as defaults } from "./support/profiles";
import { MARKET, type SavedState } from "../src/types";
async function seed(
  page: import("@playwright/test").Page,
  state: SavedState,
  route = "opportunities",
) {
  await page.route("https://api.ahledger.com/**", (r) => r.abort());
  await page.addInitScript(
    ({ state, key }) => {
      if (!localStorage.getItem(key))
        localStorage.setItem(key, JSON.stringify(state));
    },
    { state, key: STORE },
  );
  await page.goto("#" + route);
}
test("equal saved wallet values cannot carry an invalid cash draft between characters", async ({
  page,
}) => {
  const state = defaults();
  state.characters[1].cash = 25000;
  state.characters[1].budget = 25000;
  await seed(page, state);
  const cash = page.getByRole("textbox", {
    name: "Current gold on this character",
    exact: true,
  });
  await cash.fill("not money");
  await expect(cash).toHaveAttribute("aria-invalid", "true");
  await page
    .getByRole("combobox", { name: "Character", exact: true })
    .selectOption("chumbles");
  await expect(cash).toHaveValue("2g 50s");
  await expect(cash).toHaveAttribute("aria-invalid", "false");
  const saved = await page.evaluate(
    (key) => JSON.parse(localStorage.getItem(key)!),
    STORE,
  );
  expect(saved.characters[1].cash).toBe(25000);
});
test("explicit backup restore resets stale cash drafts even with unchanged character identity and cash", async ({
  page,
}) => {
  const state = defaults();
  await seed(page, state);
  const cash = page.getByRole("textbox", {
    name: "Current gold on this character",
    exact: true,
  });
  await cash.fill("invalid draft");
  page.on("dialog", (d) => d.accept());
  await page.getByLabel("Import profiles").setInputFiles({
    name: "backup.json",
    mimeType: "application/json",
    buffer: Buffer.from(JSON.stringify(state)),
  });
  await expect(cash).toHaveValue("2g 50s");
  await expect(cash).toHaveAttribute("aria-invalid", "false");
});
test("a below-fold Review batch link exposes the new budget and leaves Back scroll restoration intact", async ({
  page,
}) => {
  const state = defaults(),
    c = state.characters[0];
  c.characterLevel = 20;
  for (const [id, price] of [
    [2592, 100],
    [3383, 100],
    [4318, 3000],
  ])
    c.manual[id] = {
      market: MARKET,
      ask: price,
      exit: price,
      observedAt: new Date().toISOString(),
      note: "Synthetic navigation quote",
    };
  await page.setViewportSize({ width: 390, height: 844 });
  await seed(page, state);
  const card = page.locator(".plan-choice").first();
  await card
    .getByRole("button", { name: "Add one to batch", exact: true })
    .click();
  const oldScroll = await page.evaluate(() => scrollY);
  expect(oldScroll).toBeGreaterThan(500);
  await card.getByRole("link", { name: "Review batch", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Check your batch budget", exact: true }),
  ).toBeVisible();
  await expect.poll(() => page.evaluate(() => scrollY)).toBe(0);
  await expect(page.locator("#main-content")).toBeFocused();
  const heading = await page
    .getByRole("heading", { name: "Check your batch budget", exact: true })
    .boundingBox();
  expect(heading!.y).toBeGreaterThanOrEqual(0);
  expect(heading!.y).toBeLessThan(844);
  await page.goBack();
  await expect(
    page.getByRole("heading", { name: "Character plan", exact: true }),
  ).toBeVisible();
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(500);
});

test("clearing a recipe fee removes its hidden saved override and restores unknown eligibility", async ({
  page,
}) => {
  const state = defaults();
  state.active = "grimpo-grongo";
  await seed(page, state, "leveling");
  await page
    .locator(".leveling-controls")
    .getByRole("combobox", { name: "Profession", exact: true })
    .selectOption("Engineering");
  const recipe = page
    .locator(".recipe-row")
    .filter({ has: page.getByText("Heavy Blasting Powder", { exact: true }) });
  const fee = recipe.getByRole("textbox", {
    name: "Actual unlock quote · once",
    exact: true,
  });
  await fee.fill("5s");
  await fee.fill("");
  await fee.press("Tab");
  const override = await page.evaluate(
    (key) =>
      JSON.parse(localStorage.getItem(key)!).characters[2].unlockCosts[3945],
    STORE,
  );
  expect(override).toBeUndefined();
  await page.reload();
  await page
    .locator(".leveling-controls")
    .getByRole("combobox", { name: "Profession", exact: true })
    .selectOption("Engineering");
  await expect(
    recipe.getByRole("textbox", {
      name: "Actual unlock quote · once",
      exact: true,
    }),
  ).toHaveValue("");
});
test("clearing a vendor quote restores the catalogue reference rather than preserving a hidden override", async ({
  page,
}) => {
  await seed(page, defaults());
  await page.getByRole("button", { name: "Edit profile", exact: true }).click();
  const dialog = page.getByRole("dialog");
  const quote = dialog.getByRole("textbox", {
    name: "Actual vendor price per unit",
    exact: true,
  });
  await quote.fill("5s");
  await quote.fill("");
  await quote.press("Tab");
  const override = await page.evaluate(
    (key) => JSON.parse(localStorage.getItem(key)!).characters[0].vendor[2321],
    STORE,
  );
  expect(override).toBeUndefined();
  await dialog
    .getByRole("button", { name: "Close profile", exact: true })
    .click();
  await page.getByRole("button", { name: "Edit profile", exact: true }).click();
  await expect(
    page.getByRole("dialog").getByRole("textbox", {
      name: "Actual vendor price per unit",
      exact: true,
    }),
  ).toHaveValue("1s");
});
