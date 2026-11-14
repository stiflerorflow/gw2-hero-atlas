import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const noPageOverflow = async (page: import("@playwright/test").Page) => {
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
};

test("narrow phone controls avoid focus zoom and expanded calculations are accessible", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 700 });
  await page.route("https://api.ahledger.com/**", (r) => r.abort());
  await page.goto("#opportunities");
  for (const selector of [
    ".profile-switch select",
    ".filters input",
    ".filters select",
  ]) {
    for (const control of await page.locator(selector).all()) {
      expect(
        await control.evaluate((n) => parseFloat(getComputedStyle(n).fontSize)),
      ).toBeGreaterThanOrEqual(16);
    }
  }
  const card = page.locator(".mobile-cards .opportunity").first();
  await card.getByText("Show the calculation", { exact: true }).click();
  await noPageOverflow(page);
  const scroller = card.getByRole("region", { name: "Input cost details" });
  await scroller.focus();
  await expect(scroller).toBeFocused();
  const issues = await new AxeBuilder({ page }).analyze();
  expect(
    issues.violations.map((v) => ({
      id: v.id,
      nodes: v.nodes.map((n) => n.target),
    })),
  ).toEqual([]);
});

test("phone profile dialog remains usable with long names, expanded settings and keyboard", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await page.route("https://api.ahledger.com/**", (r) => r.abort());
  await page.goto("#opportunities");
  const opener = page.getByRole("button", {
    name: "Edit profile",
    exact: true,
  });
  await opener.click();
  const dialog = page.getByRole("dialog");
  await dialog
    .getByRole("textbox", { name: "Character name", exact: true })
    .fill("A very long character name with several words for narrow phones");
  await dialog.getByText("Change profession slots", { exact: true }).click();
  expect(await dialog.evaluate((n) => n.scrollWidth <= n.clientWidth)).toBe(
    true,
  );
  await dialog
    .getByRole("button", { name: "Done · return to planner", exact: true })
    .scrollIntoViewIfNeeded();
  await expect(
    dialog.getByRole("button", {
      name: "Done · return to planner",
      exact: true,
    }),
  ).toBeVisible();
  const issues = await new AxeBuilder({ page }).analyze();
  expect(
    issues.violations.map((v) => ({
      id: v.id,
      nodes: v.nodes.map((n) => n.target),
    })),
  ).toEqual([]);
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(opener).toBeFocused();
  await noPageOverflow(page);
});

test("populated phone batch supports expanded inputs and readable money errors", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 700 });
  await page.route("https://api.ahledger.com/**", (r) => r.abort());
  await page.goto("#opportunities");
  await page
    .locator(".mobile-cards .opportunity")
    .first()
    .getByRole("button", { name: /Add to batch/ })
    .click();
  await page.getByRole("link", { name: /Batch planner/ }).click();
  await page
    .getByText("Inputs and material-value accounting", { exact: true })
    .click();
  const cash = page.getByRole("textbox", { name: /Cash reserve/ });
  await cash.fill("not a price");
  await cash.press("Tab");
  await expect(cash).toHaveAttribute("aria-invalid", "true");
  await expect(
    page.getByText("Use copper, or money such as 1g 12s 20c.", { exact: true }),
  ).toBeVisible();
  await noPageOverflow(page);
  await expect(
    page.getByRole("region", { name: "Input cost details" }),
  ).toHaveAttribute("tabindex", "0");
  const issues = await new AxeBuilder({ page }).analyze();
  expect(
    issues.violations.map((v) => ({
      id: v.id,
      nodes: v.nodes.map((n) => n.target),
    })),
  ).toEqual([]);
});
