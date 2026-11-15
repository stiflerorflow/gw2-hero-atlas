import { test, expect } from "@playwright/test";
import { STORE } from "../src/state/profile";
import { scenarioProfiles as defaults } from "./support/profiles";
const url = "./";
async function setup(page: any) {
  const s = defaults();
  s.characters[0].inventory[2592] = { qty: 4, note: "Wool stock" };
  s.characters[0].inventory[3383] = { qty: 2, note: "Potion stock" };
  await page.addInitScript(
    ({ s, key }: any) => {
      if (!localStorage.getItem(key))
        localStorage.setItem(key, JSON.stringify(s));
    },
    { s, key: STORE },
  );
  await page.route("https://api.ahledger.com/**", (r: any) => r.abort());
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(url + "#watchlist");
  await page.locator(".sales-log > summary").click();
}
test("Enter saves current money edits, not previous quote or sale values", async ({
  page,
}) => {
  await setup(page);
  const card = page.locator(".watch-card").first();
  await card
    .getByText("Enter your in-game quote / exit scenario", { exact: true })
    .click();
  await card
    .getByRole("textbox", { name: /Purchase price per unit/ })
    .fill("10s");
  const exit = card.getByRole("textbox", {
    name: /Your proposed gross exit per unit/,
  });
  await exit.fill("15s");
  await exit.press("Enter");
  await expect
    .poll(() =>
      page.evaluate(
        (key) =>
          JSON.parse(localStorage.getItem(key)!).characters[0].manual[4306],
        STORE,
      ),
    )
    .toMatchObject({ ask: 1000, exit: 1500 });
  const gross = page.getByRole("textbox", {
    name: /Total gross sale proceeds/,
  });
  await gross.fill("12s");
  await gross.press("Enter");
  await expect
    .poll(() =>
      page.evaluate(
        (key) => JSON.parse(localStorage.getItem(key)!).characters[0].sales,
        STORE,
      ),
    )
    .toHaveLength(1);
  const sales = await page.evaluate(
    (key) => JSON.parse(localStorage.getItem(key)!).characters[0].sales,
    STORE,
  );
  expect(sales[0].gross).toBe(1200);
  await expect(gross).toHaveValue("");
  await gross.fill("1000000001");
  await gross.press("Enter");
  await expect(gross).toHaveAttribute("aria-invalid", "true");
  await expect
    .poll(() =>
      page.evaluate(
        (key) =>
          JSON.parse(localStorage.getItem(key)!).characters[0].sales.length,
        STORE,
      ),
    )
    .toBe(1);
});
test("unsaved sale drafts are cleared when changing characters", async ({
  page,
}) => {
  await setup(page);
  await page
    .getByRole("textbox", { name: /Total gross sale proceeds/ })
    .fill("12s");
  await page
    .getByRole("combobox", { name: "Character", exact: true })
    .selectOption("chumbles");
  await page.locator(".sales-log > summary").click();
  await expect(
    page.getByRole("textbox", { name: /Total gross sale proceeds/ }),
  ).toHaveValue("");
  await expect(
    page.getByRole("button", { name: "Record actual sale", exact: true }),
  ).toBeDisabled();
});
test("inventory editor loads stock and transfer selector cannot retarget its quantity", async ({
  page,
}) => {
  await setup(page);
  await page.getByRole("button", { name: "Edit profile", exact: true }).click();
  const modal = page.getByRole("dialog");
  await expect(
    modal.getByRole("spinbutton", { name: "Available whole units" }),
  ).toHaveValue("4");
  await modal
    .getByRole("combobox", { name: "Recorded item" })
    .selectOption("3383");
  await expect(
    modal.getByRole("spinbutton", { name: "Available whole units" }),
  ).toHaveValue("4");
  await modal
    .getByRole("button", { name: "Record transfer", exact: true })
    .click();
  await expect
    .poll(() =>
      page.evaluate(
        (key) =>
          JSON.parse(localStorage.getItem(key)!).characters[0].inventory[3383]
            .qty,
        STORE,
      ),
    )
    .toBe(1);
  await modal
    .getByRole("button", { name: "Set available quantity", exact: true })
    .click();
  const inv = await page.evaluate(
    (key) => JSON.parse(localStorage.getItem(key)!).characters[0].inventory,
    STORE,
  );
  expect(inv[2592].qty).toBe(4);
  expect(inv[3383].qty).toBe(1);
});
