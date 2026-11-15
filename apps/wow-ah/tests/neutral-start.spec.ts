import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { STORE } from "../src/state/profile";
test("blank setup records actual skill and supports independent user-created characters", async ({
  page,
}) => {
  await page.route("https://api.ahledger.com/**", (r) => r.abort());
  await page.setViewportSize({ width: 320, height: 844 });
  await page.goto("#opportunities");
  const character = page.getByRole("combobox", {
    name: "Character",
    exact: true,
  });
  await expect(character.locator("option")).toHaveText(["My character"]);
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
  await page
    .getByRole("combobox", { name: "Add profession", exact: true })
    .selectOption("Alchemy");
  const skill = page.getByRole("spinbutton", {
    name: "Current Alchemy skill",
    exact: true,
  });
  await expect(skill).toHaveValue("");
  await expect(
    page.getByRole("region", { name: "Suggested next steps", exact: true }),
  ).toContainText("Enter your current Alchemy skill");
  await skill.fill("130");
  await page.getByRole("button", { name: "Edit profile", exact: true }).click();
  await page
    .getByRole("dialog")
    .getByRole("textbox", { name: "Character name", exact: true })
    .fill("Trader one");
  await page
    .getByRole("button", { name: "Add another character", exact: true })
    .click();
  await expect(
    page
      .getByRole("dialog")
      .getByRole("heading", { name: "Character 2", exact: true }),
  ).toBeVisible();
  await page
    .getByRole("dialog")
    .getByRole("textbox", { name: "Character name", exact: true })
    .fill("Trader two");
  await page
    .getByRole("button", { name: "Close profile", exact: true })
    .click();
  await expect(character.locator("option")).toHaveText([
    "Trader one",
    "Trader two",
  ]);
  await expect(
    page.getByRole("textbox", {
      name: "Current gold on this character",
      exact: true,
    }),
  ).toHaveValue("");
  await expect(
    page.getByRole("combobox", { name: "Add profession", exact: true }),
  ).toHaveValue("");
  await character.selectOption("my-character");
  await expect(page.locator(".context-editor > summary")).toContainText(
    "Alchemy 130",
  );
  const saved = await page.evaluate(
    (key) => JSON.parse(localStorage.getItem(key)!),
    STORE,
  );
  expect(saved.characters[0].cash).toBe(10000);
  expect(saved.characters[0].skills.Alchemy.level).toBe(130);
  expect(saved.characters[1].cash).toBeNull();
  expect(saved.characters[1].skills).toEqual({});
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
});
test("watch, sale and vendor forms require a deliberate item selection", async ({
  page,
}) => {
  await page.route("https://api.ahledger.com/**", (r) => r.abort());
  await page.goto("#watchlist");
  await expect(page.locator(".watch-add select")).toHaveValue("0");
  await expect(
    page.getByRole("button", { name: "Add to watchlist", exact: true }),
  ).toBeDisabled();
  await page.locator(".sales-log > summary").click();
  const sales = page.locator(".sales-log");
  await expect(
    sales.getByRole("combobox", { name: "Item", exact: true }),
  ).toHaveValue("0");
  await sales
    .getByRole("textbox", { name: "Total gross sale proceeds", exact: true })
    .fill("1s");
  await expect(
    sales.getByRole("button", { name: "Record actual sale", exact: true }),
  ).toBeDisabled();
  await sales
    .getByRole("combobox", { name: "Item", exact: true })
    .selectOption("785");
  await sales
    .getByRole("button", { name: "Record actual sale", exact: true })
    .click();
  const saved = await page.evaluate(
    (key) => JSON.parse(localStorage.getItem(key)!),
    STORE,
  );
  expect(saved.characters[0].sales[0].itemId).toBe(785);
  await page.getByRole("button", { name: "Edit profile", exact: true }).click();
  const dialog = page.getByRole("dialog");
  await expect(
    dialog.getByRole("combobox", { name: "Vendor item", exact: true }),
  ).toHaveValue("0");
  await expect(
    dialog.getByRole("textbox", {
      name: "Actual vendor price per unit",
      exact: true,
    }),
  ).toBeDisabled();
  await expect(
    dialog.getByRole("heading", {
      name: "Explicit material transfer",
      exact: true,
    }),
  ).toHaveCount(0);
  await dialog
    .getByRole("combobox", { name: "Vendor item", exact: true })
    .selectOption("3371");
  await expect(
    dialog.getByRole("textbox", {
      name: "Actual vendor price per unit",
      exact: true,
    }),
  ).toBeEnabled();
});
