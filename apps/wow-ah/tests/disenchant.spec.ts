import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
const market = "forever.rp.alliance.eu";
async function feed(
  page: import("@playwright/test").Page,
  missing = false,
  ttl = 300,
) {
  const paths: string[] = [];
  await page.route("https://api.ahledger.com/**", async (r) => {
    const u = new URL(r.request().url());
    paths.push(u.pathname);
    let body: unknown = { market };
    if (u.pathname.endsWith("/markets"))
      body = {
        markets: [
          { id: market, ruleset: "rp", region: "eu", faction: "alliance" },
        ],
      };
    else if (u.pathname.includes("/disenchant/"))
      body = {
        market,
        page: "https://ahledger.com/disenchant?market=forever/rp/alliance/eu",
        opportunities: [
          {
            item: {
              id: 7924,
              name: "Synthetic Mithril Plate Bracers",
              quality: "UNCOMMON",
              level: 43,
              url: "https://ahledger.com/items/7924?utm_source=fixture",
            },
            minBuyout: 3800,
            quantity: 2,
            observedAt: new Date(Date.now() - 7200000).toISOString(),
            profit: 999999,
            yields: [
              {
                id: 11137,
                name: "Vision Dust",
                minCount: 2,
                maxCount: 5,
                chance: 0.75,
              },
              {
                id: 11174,
                name: "Lesser Nether Essence",
                minCount: 1,
                maxCount: 2,
                chance: 0.2,
              },
              {
                id: 11177,
                name: "Small Radiant Shard",
                minCount: 1,
                maxCount: 1,
                chance: 0.05,
              },
            ],
          },
        ],
      };
    else if (u.pathname.includes("/tooltip/"))
      body = {
        market,
        items: [
          [11137, "Vision Dust", 1000],
          [11174, "Lesser Nether Essence", 4000],
          [11177, "Small Radiant Shard", 5000],
        ]
          .filter(([id]) => !missing || id !== 11174)
          .map(([id, name, minBuyout]) => ({
            id,
            name,
            minBuyout,
            median: minBuyout,
            quantity: 20,
            salesPerDay: 10,
            observedAt: new Date(Date.now() - 7200000).toISOString(),
          })),
      };
    await r.fulfill({
      json: body,
      headers: { "Cache-Control": `max-age=${ttl}` },
    });
  });
  return paths;
}
test("standalone scan shows expected profit, strict profit odds and the full loot-price calculation", async ({
  page,
}) => {
  const paths = await feed(page);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("#disenchant");
  await expect(
    page.getByRole("heading", { name: "Disenchant scanner", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Edit profile", exact: true }),
  ).toHaveCount(0);
  const card = page.locator(".de-card").first();
  await expect(card).toBeVisible();
  await expect(card.locator(".de-numbers dd")).toHaveText([
    "38s",
    "71c",
    "≈33.75%",
  ]);
  await expect(card).toContainText("38s 71c");
  await expect(card).toContainText(
    "Positive average, but one item can lose gold",
  );
  await expect(card).toContainText("over an hour old");
  expect(paths.some((p) => p.includes("crafting") || p.includes("deals"))).toBe(
    false,
  );
  await card
    .getByText("Loot table, prices & calculator", { exact: true })
    .click();
  await expect(card).toContainText("75% · 2–5 Vision Dust");
  await expect(card).toContainText("62.5%");
  await expect(card).toContainText("5%–100%");
  await expect(
    card.getByRole("region", { name: "Vision Dust price", exact: true }),
  ).toContainText("10s");
  const buy = card.getByRole("textbox", {
    name: "Override gear buy price / item",
    exact: true,
  });
  await buy.fill("40s");
  await expect(card.locator(".de-numbers dd").nth(1)).toHaveText("−1s 29c");
  await expect(card).toContainText("Manual scenario in use");
  await buy.fill("");
  await buy.press("Tab");
  await expect(card.locator(".de-numbers dd").first()).toHaveText("38s");
  await card
    .getByRole("textbox", {
      name: "Override Vision Dust gross / unit",
      exact: true,
    })
    .fill("20s");
  await expect(card.locator(".de-numbers dd").nth(1)).toHaveText("25s 65c");
  await card
    .getByRole("button", {
      name: "Use feed prices and zero lost deposits",
      exact: true,
    })
    .click();
  await expect(card.locator(".de-numbers dd").nth(1)).toHaveText("71c");
  for (const width of [320, 390, 1280]) {
    await page.setViewportSize({ width, height: 844 });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    expect(
      (await new AxeBuilder({ page }).analyze()).violations.map((v) => ({
        id: v.id,
        nodes: v.nodes.map((n) => n.target),
      })),
    ).toEqual([]);
  }
  expect(
    await page.evaluate(() => localStorage.getItem("copper-ledger.profile.v1")),
  ).toBeNull();
  await page.getByText("Price basis and filters", { exact: true }).click();
  const minChance = page.getByRole("combobox", {
    name: "Minimum modeled chance of profit",
    exact: true,
  });
  await minChance.selectOption("0.5");
  await expect(page.locator(".de-card")).toHaveCount(0);
  await minChance.selectOption("0");
  await expect(page.locator(".de-card")).toHaveCount(1);
  await card
    .getByText("Loot table, prices & calculator", { exact: true })
    .click();
  await card
    .getByRole("textbox", {
      name: "Override gear buy price / item",
      exact: true,
    })
    .fill("40s");
  await page
    .getByRole("searchbox", { name: "Find gear or material", exact: true })
    .fill("Vision Dust");
  await expect(card).toBeVisible();
  await page.getByRole("link", { name: "Market scan", exact: true }).click();
  await page.getByRole("link", { name: "Disenchant", exact: true }).click();
  await expect(page.locator(".de-card")).toHaveCount(1);
  await expect(page.locator(".de-card .de-numbers dd").first()).toHaveText(
    "40s",
  );
});
test("missing material quotes never become zero and explicit overrides can complete the scenario", async ({
  page,
}) => {
  await feed(page, true);
  await page.goto("#disenchant");
  await page
    .getByRole("button", { name: "All candidates", exact: true })
    .click();
  const card = page.locator(".de-card").first();
  await expect(card).toBeVisible();
  await expect(card.locator(".de-numbers dd")).toHaveText([
    "38s",
    "Unknown",
    "Unknown",
  ]);
  await expect(card).toContainText(
    "Missing resale quotes: Lesser Nether Essence",
  );
  await card
    .getByText("Loot table, prices & calculator", { exact: true })
    .click();
  await card
    .getByRole("textbox", {
      name: "Override Lesser Nether Essence gross / unit",
      exact: true,
    })
    .fill("40s");
  await expect(card.locator(".de-numbers dd").nth(1)).toHaveText("71c");
});
test("expired outcome data disappears and a failed feed supplies no curated fallback", async ({
  page,
}) => {
  await page.clock.install();
  await feed(page, false, 1);
  await page.goto("#disenchant");
  await expect(page.locator(".de-card")).toHaveCount(1);
  await page.clock.fastForward(2000);
  await expect(page.locator(".de-card")).toHaveCount(0);
  await page.unroute("https://api.ahledger.com/**");
  await page.route("https://api.ahledger.com/**", (r) => r.abort());
  await page.getByRole("button", { name: "↻ Refresh", exact: true }).click();
  await expect(page.locator(".de-card")).toHaveCount(0);
  await expect(page.getByRole("alert")).toContainText(
    "Unpriced materials remain unknown",
  );
});

test("Top 10 recomputes ranking and never fills with losses, missing prices or unverified tables", async ({
  page,
}) => {
  await feed(page);
  await page.route("https://api.ahledger.com/v1/disenchant/**", async (r) => {
    const rows = Array.from({ length: 14 }, (_, i) => ({
      item: {
        id: 900100 + i,
        name: `Candidate ${i}`,
        quality: "UNCOMMON",
        level: 43,
        url: `https://ahledger.com/items/${900100 + i}`,
      },
      minBuyout: 1000 + i * 100,
      quantity: 2,
      observedAt: new Date().toISOString(),
      profit: i * 999999,
      yields: [
        {
          id: 11137,
          name: "Vision Dust",
          minCount: 2,
          maxCount: 5,
          chance: 0.75,
        },
        {
          id: 11174,
          name: "Lesser Nether Essence",
          minCount: 1,
          maxCount: 2,
          chance: 0.2,
        },
        {
          id: 11177,
          name: "Small Radiant Shard",
          minCount: 1,
          maxCount: 1,
          chance: 0.05,
        },
      ],
    }));
    rows[10].item.name = "TenthUnique";
    rows[13].item.name = "UnverifiedUnique";
    rows[11].minBuyout = 9000; // negative margin
    rows[12].quantity = 0; // no available stock
    rows[13].yields[0].maxCount = 8; // unverified loot table
    await r.fulfill({
      json: { market, opportunities: rows },
      headers: { "Cache-Control": "max-age=300" },
    });
  });
  await page.goto("#disenchant");
  await expect(page.locator(".de-card")).toHaveCount(10);
  await expect(page.locator(".de-card h2")).toHaveText(
    Array.from({ length: 10 }, (_, i) => `#${i + 1} · Candidate ${i}`),
  );
  await expect(
    page.getByRole("button", { name: "Top 10 to verify", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await page
    .getByRole("searchbox", { name: "Find gear or material", exact: true })
    .fill("TenthUnique");
  await expect(page.locator(".de-card")).toHaveCount(1); // fewer than 10 stays honest
  await page
    .getByRole("searchbox", { name: "Find gear or material", exact: true })
    .fill("UnverifiedUnique");
  await expect(page.locator(".de-card")).toHaveCount(0);
  await page
    .getByRole("button", { name: "All candidates", exact: true })
    .click();
  await expect(page.locator(".de-card")).toHaveCount(1);
  await expect(page.locator(".de-card")).toContainText(
    "Loot table needs item-level verification",
  );
  await page
    .getByRole("searchbox", { name: "Find gear or material", exact: true })
    .fill("");
  await page
    .getByRole("button", { name: "Top 10 to verify", exact: true })
    .click();
  const edited = page.locator(".de-card").first();
  await edited
    .getByText("Loot table, prices & calculator", { exact: true })
    .click();
  await edited
    .getByRole("textbox", {
      name: "Override gear buy price / item",
      exact: true,
    })
    .fill("2g");
  await expect(
    page.getByRole("button", { name: "All candidates", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator(".de-card").first().locator("h2")).toHaveText(
    "Candidate 0",
  );
  await expect(
    page.locator(".de-card").first().locator(".de-numbers dd").first(),
  ).toHaveText("2g 0s");
  await expect(page.locator(".de-card").first()).toContainText(
    "No positive expected margin",
  );
});
