import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { STORE } from "../src/state/profile";
import {
  scenarioProfiles as defaults,
  installScenario,
} from "./support/profiles";
import { MARKET, type SavedState } from "../src/types";
async function prepare(
  page: import("@playwright/test").Page,
  s: SavedState,
  hash: string,
) {
  await page.route("https://api.ahledger.com/**", (r) => r.abort());
  await page.addInitScript(
    ({ s, key }) => {
      if (!localStorage.getItem(key))
        localStorage.setItem(key, JSON.stringify(s));
    },
    { s, key: STORE },
  );
  await page.goto("#" + hash);
}
test("DE editing changes the material recovery and exposes no ignored item-exit control", async ({
  page,
}) => {
  const s = defaults(),
    c = s.characters[0];
  c.batch = [
    {
      id: "audit",
      kind: "buy-de",
      itemId: 4253,
      quantity: 1,
      exit: null,
      deposit: 0,
      sellFraction: 1,
      fallback: "keep",
    },
  ];
  for (const [id, price] of [
    [4253, 100],
    [11084, 500],
  ])
    c.manual[id] = {
      market: MARKET,
      ask: id === 11084 ? null : price,
      exit: price,
      observedAt: new Date().toISOString(),
      note: "Synthetic audit quote",
    };
  await prepare(page, s, "batch");
  await expect(
    page.getByRole("textbox", { name: "Gross exit / output unit" }),
  ).toHaveCount(0);
  await expect(page.locator(".summary-strip b").last()).toHaveText("3s 75c");
  await page
    .getByText("Inputs and material-value accounting", { exact: true })
    .click();
  await page.getByText("Input and DE material prices", { exact: true }).click();
  const editors = page.locator(".input-quotes > div");
  const original = editors.filter({
    has: page.getByText("Toughened Leather Gloves", { exact: true }),
  });
  await expect(
    original.getByRole("textbox", {
      name: "Your proposed gross exit per unit",
    }),
  ).toHaveCount(0);
  const shard = editors.filter({
    has: page.getByText("Large Glimmering Shard", { exact: true }),
  });
  await shard
    .getByRole("textbox", { name: "Your proposed gross exit per unit" })
    .fill("10s");
  await shard
    .getByRole("button", { name: "Save manual quote", exact: true })
    .click();
  await expect(page.locator(".summary-strip b").last()).toHaveText("8s 50c");
  await page.reload();
  await expect(page.locator(".summary-strip b").last()).toHaveText("8s 50c");
});
test("an incomplete restored profile can select a profession, and unknown inventory IDs stay editable", async ({
  page,
}) => {
  const s = defaults();
  s.characters[0].skills = {};
  s.characters[0].inventory[987654] = { qty: 7, note: "Imported stock" };
  await prepare(page, s, "opportunities");
  await page
    .getByRole("combobox", { name: "Add profession", exact: true })
    .selectOption("Alchemy");
  await expect(
    page.getByRole("spinbutton", {
      name: "Current Alchemy skill",
      exact: true,
    }),
  ).toHaveValue("");
  await page.getByRole("button", { name: "Edit profile", exact: true }).click();
  const dialog = page.getByRole("dialog");
  const row = dialog
    .locator(".inventory-list li")
    .filter({ hasText: "Item #987654" });
  await row.getByRole("button", { name: "Edit", exact: true }).click();
  await expect(
    dialog.getByRole("combobox", { name: "Item", exact: true }),
  ).toHaveValue("987654");
  await dialog
    .getByRole("spinbutton", { name: "Available whole units" })
    .fill("9");
  await dialog.getByRole("button", { name: "Set available quantity" }).click();
  await expect(row).toContainText("9 ×");
  await page.keyboard.press("Escape");
  await page.reload();
  const saved = await page.evaluate(
    (key) => JSON.parse(localStorage.getItem(key)!),
    STORE,
  );
  expect(saved.characters[0].inventory[987654].qty).toBe(9);
});
test("a new completed sale does not reuse the previous sale lost-deposit cost", async ({
  page,
}) => {
  await prepare(page, defaults(), "watchlist");
  await page.locator(".sales-log > summary").click();
  await page
    .locator(".sales-log")
    .getByRole("combobox", { name: "Item", exact: true })
    .selectOption("4306");
  const gross = page.getByRole("textbox", {
    name: "Total gross sale proceeds",
    exact: true,
  });
  const lost = page.getByRole("textbox", {
    name: "Lost deposits across earlier attempts",
    exact: true,
  });
  await lost.fill("5s");
  await gross.fill("20s");
  await page
    .getByRole("button", { name: "Record actual sale", exact: true })
    .click();
  await expect(lost).toHaveValue("0c");
  await gross.fill("30s");
  await page
    .getByRole("button", { name: "Record actual sale", exact: true })
    .click();
  const rows = await page.evaluate(
    (key) => JSON.parse(localStorage.getItem(key)!).characters[0].sales,
    STORE,
  );
  expect(rows.map((s: any) => s.lostDeposit)).toEqual([500, 0]);
});
test("manual quote feedback clears while edits are still unsaved, and validation text is associated", async ({
  page,
}) => {
  await prepare(page, defaults(), "watchlist");
  const card = page.locator(".watch-card").first();
  await card
    .getByText("Enter your in-game quote / exit scenario", { exact: true })
    .click();
  const price = card.getByRole("textbox", {
    name: "Purchase price per unit",
    exact: true,
  });
  await price.fill("1s");
  await card
    .getByRole("button", { name: "Save manual quote", exact: true })
    .click();
  await expect(card.getByRole("status")).toContainText("Saved");
  await price.fill("2s");
  await expect(card.getByRole("status")).toHaveText("");
  await price.fill("not money");
  await expect(price).toHaveAttribute("aria-invalid", "true");
  const help = await price.getAttribute("aria-describedby");
  expect(help).toBeTruthy();
  await expect(page.locator('[id="' + help + '"]')).toContainText("Use copper");
  const saved = await page.evaluate(
    (key) =>
      JSON.parse(localStorage.getItem(key)!).characters[0].manual[4306].ask,
    STORE,
  );
  expect(saved).toBe(100);
});
test("backup restore remains usable for this session when storage writes are blocked", async ({
  page,
}) => {
  await page.route("https://api.ahledger.com/**", (r) => r.abort());
  await page.addInitScript(() => {
    Storage.prototype.setItem = function () {
      throw new DOMException("Blocked", "SecurityError");
    };
  });
  await page.goto("#opportunities");
  const s = defaults();
  s.characters[0].name = "Restored session";
  s.characters[0].characterLevel = 28;
  page.on("dialog", (d) => d.accept());
  await page.getByLabel("Import profiles").setInputFiles({
    name: "backup.json",
    mimeType: "application/json",
    buffer: Buffer.from(JSON.stringify(s)),
  });
  await expect(page.getByRole("alert")).toContainText(
    "loaded in this tab only",
  );
  await page.locator(".context-editor > summary").click();
  await expect(
    page.getByRole("spinbutton", {
      name: "Current character level",
      exact: true,
    }),
  ).toHaveValue("28");
  await page
    .getByRole("spinbutton", { name: "Current character level", exact: true })
    .fill("29");
  await expect(
    page.getByRole("spinbutton", {
      name: "Current character level",
      exact: true,
    }),
  ).toHaveValue("29");
});
test("expanded DE prices and incomplete-profile setup remain accessible on a narrow phone", async ({
  page,
}) => {
  const s = defaults();
  s.characters[0].skills = {};
  s.characters[0].batch = [
    {
      id: "audit",
      kind: "buy-de",
      itemId: 4253,
      quantity: 1,
      exit: null,
      deposit: 0,
      sellFraction: 0,
      fallback: "keep",
    },
  ];
  await page.setViewportSize({ width: 320, height: 700 });
  await prepare(page, s, "opportunities");
  await page
    .getByRole("combobox", { name: "Add profession" })
    .selectOption("Enchanting");
  await page.getByRole("link", { name: /Batch planner/ }).click();
  await page
    .getByText("Inputs and material-value accounting", { exact: true })
    .click();
  await page.getByText(/Input and DE material prices/).click();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  const scan = await new AxeBuilder({ page }).analyze();
  expect(scan.violations.map((v) => v.id)).toEqual([]);
});

test("leveling follows a profession changed in the profile editor without needing a reload", async ({
  page,
}) => {
  await prepare(page, defaults(), "leveling");
  await page.getByRole("button", { name: "Edit profile", exact: true }).click();
  const dialog = page.getByRole("dialog");
  await dialog.getByText("Change profession slots", { exact: true }).click();
  await dialog
    .getByRole("combobox", { name: "Slot 1", exact: true })
    .selectOption("Alchemy");
  await dialog
    .getByRole("button", { name: "Close profile", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Recipe book · Alchemy", exact: true }),
  ).toBeVisible();
  await expect(
    page
      .locator(".leveling-controls")
      .getByRole("combobox", { name: "Profession", exact: true }),
  ).toHaveValue("Alchemy");
});
test("whole essence conversions keep their operation count, output size and no-unlock semantics", async ({
  page,
}) => {
  const s = defaults(),
    c = s.characters[0];
  c.characterLevel = 20;
  c.skills = {};
  for (const [id, price] of [
    [10939, 100],
    [10938, 100],
  ])
    c.manual[id] = {
      market: MARKET,
      ask: price,
      exit: price,
      observedAt: new Date().toISOString(),
      note: "Synthetic conversion quote",
    };
  await prepare(page, s, "opportunities");
  await page.getByText("Compare priorities", { exact: true }).click();
  await page
    .getByRole("checkbox", {
      name: "Include crafting profit scenarios",
      exact: true,
    })
    .check();
  const card = page.locator(".plan-choice").filter({
    has: page.getByRole("heading", {
      name: "Greater → Lesser Magic Essence",
      exact: true,
    }),
  });
  await expect(card).toBeVisible();
  await expect(card.getByRole("checkbox")).toHaveCount(0);
  await card.getByRole("button", { name: "Add one to batch" }).click();
  await card.getByRole("link", { name: "Review batch" }).click();
  await expect(
    page.getByRole("spinbutton", { name: "Crafts / conversion operations" }),
  ).toHaveValue("1");
  await expect(page.locator(".batch-row .mini-stats dd").nth(1)).toHaveText(
    "3",
  );
});
test("expanded watch history preserves heading order and keyboard-accessible chart controls", async ({
  page,
}) => {
  const market = MARKET;
  await installScenario(page);
  await page.route("https://api.ahledger.com/**", async (r) => {
    const path = new URL(r.request().url()).pathname;
    let body: any = { market };
    if (path.endsWith("/markets"))
      body = {
        markets: [
          { id: market, ruleset: "rp", region: "eu", faction: "alliance" },
        ],
      };
    else if (path.includes("/prices/")) {
      const id = Number(path.split("/").at(-1));
      body = {
        market,
        item: { id, name: "Synthetic item" },
        latest: {
          minBuyout: 100,
          quantity: 20,
          observedAt: new Date().toISOString(),
        },
        series: [
          { t: new Date(Date.now() - 3600000).toISOString(), median: 90 },
          { t: new Date().toISOString(), median: 100 },
        ],
      };
    }
    await r.fulfill({
      json: body,
      headers: { "Cache-Control": "max-age=300" },
    });
  });
  await page.setViewportSize({ width: 320, height: 700 });
  await page.goto("#watchlist");
  await page
    .locator(".watch-card")
    .first()
    .getByRole("button", { name: "Load 24h / 7d history" })
    .click();
  await expect(page.locator(".history svg")).toBeVisible();
  const scan = await new AxeBuilder({ page }).analyze();
  expect(scan.violations.map((v) => v.id)).toEqual([]);
});

test("missing binding metadata cannot become an auction recommendation through a price override", async ({
  page,
}) => {
  await page.route("https://thewowdb.com/api/v1/**", (r) =>
    r.fulfill({
      json: {
        id: 987651,
        kind: "item",
        version: "forever",
        name: "Incomplete item",
        vendor_sell: 100,
        quality: "Uncommon",
      },
      headers: { "Cache-Control": "max-age=60" },
    }),
  );
  await page.route("https://api.ahledger.com/**", (r) =>
    r.fulfill({
      json: {
        market: MARKET,
        item: { id: 987651, name: "Incomplete item" },
        latest: { minBuyout: 300, observedAt: new Date().toISOString() },
        series: [],
      },
      headers: { "Cache-Control": "max-age=60" },
    }),
  );
  await page.goto("#sell");
  await page
    .getByRole("searchbox", { name: "Item name, ID or pasted item link" })
    .fill("987651");
  await page.getByRole("button", { name: "Search items", exact: true }).click();
  await page.locator(".catalog-results button").first().click();
  await expect(
    page.getByRole("heading", { name: "Refresh item facts", exact: true }),
  ).toBeVisible();
  await page
    .getByText("Adjust prices and see item facts", { exact: true })
    .click();
  await page
    .getByRole("textbox", {
      name: "Gross AH price / unit · optional override",
      exact: true,
    })
    .fill("1g");
  await expect(
    page.getByRole("heading", { name: "Refresh item facts", exact: true }),
  ).toBeVisible();
  await expect(
    page.locator(".item-comparison .summary-strip dd").nth(1),
  ).toHaveText("Unknown");
});
