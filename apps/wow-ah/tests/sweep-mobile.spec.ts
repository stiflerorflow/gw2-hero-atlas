import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { STORE } from "../src/state/profile";
import {
  scenarioProfiles as defaults,
  installScenario,
} from "./support/profiles";
import { MARKET } from "../src/types";

async function offline(page: import("@playwright/test").Page) {
  await page.route("https://api.ahledger.com/**", (r) => r.abort());
}
function contrast(a: string, b: string) {
  const luminance = (text: string) => {
    const channels = text
      .match(/[\d.]+/g)!
      .slice(0, 3)
      .map(Number)
      .map((n) => {
        const s = n / 255;
        return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
      });
    return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
  };
  const x = luminance(a),
    y = luminance(b);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}

test("all unavailable crafting candidates retain readable requirement badges", async ({
  page,
}) => {
  await installScenario(page);
  await offline(page);
  for (const width of [390, 1280]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto("#opportunities");
    const workbench = page.locator(".all-crafting");
    if (!(await workbench.evaluate((node: HTMLDetailsElement) => node.open)))
      await workbench.locator(":scope > summary").click();
    await expect(
      page.getByRole("heading", {
        name: "Crafting scenarios",
        exact: true,
      }),
    ).toBeVisible();
    const more = page.getByRole("button", { name: /Show more candidates/ });
    if (await more.isVisible()) await more.click();
    if (width === 390)
      await expect(
        page.locator(".mobile-cards .pill.muted").first(),
      ).toBeVisible();
    const scan = await new AxeBuilder({ page }).analyze();
    expect(
      scan.violations.map((v) => ({
        id: v.id,
        targets: v.nodes.map((n) => n.target),
      })),
    ).toEqual([]);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  }
});

test("priced learned leveling routes remain readable on phone and desktop", async ({
  page,
}) => {
  await offline(page);
  const state = defaults(),
    c = state.characters[0];
  c.characterLevel = 20;
  c.tools = [6218];
  for (const id of [2592, 2997, 3383, 4318, 4306, 4305, 10938, 11288, 10940])
    c.manual[id] = {
      market: MARKET,
      ask: 100,
      exit: 100,
      observedAt: new Date().toISOString(),
      note: "Synthetic accessibility quote",
    };
  await page.addInitScript(
    ({ state, key }) => localStorage.setItem(key, JSON.stringify(state)),
    { state, key: STORE },
  );
  for (const width of [320, 1280]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto("#leveling");
    await expect(page.locator(".route-steps li").first()).toBeVisible();
    const scan = await new AxeBuilder({ page }).analyze();
    expect(
      scan.violations.map((v) => ({
        id: v.id,
        targets: v.nodes.map((n) => n.target),
      })),
    ).toEqual([]);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  }
});

test("profile selection meets touch sizing and toast dismissal has a visible keyboard focus ring", async ({
  page,
}) => {
  await offline(page);
  await page.goto("#watchlist");
  for (const width of [320, 768, 1280]) {
    await page.setViewportSize({ width, height: 844 });
    const selector = page.getByRole("combobox", {
      name: "Character",
      exact: true,
    });
    expect(
      await selector.evaluate((n) => n.getBoundingClientRect().height),
    ).toBeGreaterThanOrEqual(44);
  }
  await page.setViewportSize({ width: 320, height: 700 });
  await page
    .getByRole("searchbox", { name: "Find catalogue item", exact: true })
    .fill("Mageroyal");
  await page
    .getByRole("button", { name: "Add to watchlist", exact: true })
    .focus();
  await page.keyboard.press("Enter");
  const dismiss = page.getByRole("button", {
    name: "Dismiss message",
    exact: true,
  });
  await dismiss.focus();
  await expect(dismiss).toBeFocused();
  const colors = await dismiss.evaluate((n) => ({
    outline: getComputedStyle(n).outlineColor,
    style: getComputedStyle(n).outlineStyle,
    background: getComputedStyle(n.closest(".toast")!).backgroundColor,
  }));
  expect(colors.style).not.toBe("none");
  expect(contrast(colors.outline, colors.background)).toBeGreaterThanOrEqual(3);
  await page.keyboard.press("Enter");
  await expect(page.locator(".toast")).toHaveCount(0);
});
