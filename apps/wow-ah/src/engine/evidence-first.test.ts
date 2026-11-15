import { it, expect } from "vitest";
import { defaults, validateState } from "../state/profile";
import { unknownMarket } from "../market/ahledger";
import {
  characterPlan,
  DEFAULT_PRIORITIES,
  keySupplies,
} from "./characterPlan";
import { listingEvidence } from "./assessment";
import { normalizeDeals } from "../market/scanner";
import { MARKET } from "../types";
it("new profiles inherit no guessed recipe knowledge, cash, stock or favorites", () => {
  for (const c of defaults().characters) {
    expect(c.cash).toBeNull();
    expect(c.budget).toBeNull();
    expect(c.known).toEqual([]);
    expect(c.inventory).toEqual({});
    expect(c.watch).toEqual([]);
  }
});
it("a profitable calculator hypothesis is never promoted automatically", () => {
  const c = defaults().characters[0],
    m = unknownMarket();
  c.characterLevel = 20;
  c.cash = c.budget = 25000;
  c.skills = {
    Tailoring: { level: 120, cap: 150, target: 120 },
    Enchanting: { level: 100, cap: 150, target: 100 },
  };
  c.known = [3839];
  for (const [id, value] of [
    [4306, 100],
    [4305, 1000],
  ])
    c.manual[id] = {
      market: MARKET,
      ask: value,
      exit: value,
      observedAt: new Date().toISOString(),
      note: "A hypothetical manual exit",
    };
  const ordinary = characterPlan(c, m);
  expect(ordinary.choices).toEqual([]);
  const scenario = characterPlan(c, m, {
    ...DEFAULT_PRIORITIES,
    includeScenarios: true,
  });
  expect(scenario.choices[0].goals).toEqual(["Gold scenario"]);
});
it("recorded inventory controls context even outside the checked recipe catalogue", () => {
  const c = defaults().characters[0];
  expect(keySupplies(c)).toEqual([]);
  c.inventory[888001] = { qty: 7, note: "Actual recorded item" };
  expect(keySupplies(c)).toEqual([888001]);
  const saved = validateState({ ...defaults(), characters: [c] }).characters[0];
  expect(saved.inventory[888001].qty).toBe(7);
});
it("broad market leads and unknowns remain independent of curated crafting ideas", () => {
  const now = Date.now(),
    id = 887766;
  const m = normalizeDeals(
    {
      market: MARKET,
      deals: [
        {
          item: { id, name: "Item outside the craft list" },
          minBuyout: 100,
          median: null,
          referenceMedian: null,
          quantity: 3,
          salesPerDay: null,
          observedAt: new Date(now).toISOString(),
        },
      ],
    },
    now + 60000,
  );
  expect(m.deals!.map((d) => d.id)).toEqual([id]);
  expect(m.quotes[id].median).toBeNull();
  expect(m.quotes[id].soldPerDay).toBeNull();
  expect(listingEvidence(m.quotes[id], now).title).toBe(
    "Recent listing snapshot",
  );
  expect(
    listingEvidence({ ...m.quotes[id], observedAt: null }, now).title,
  ).toBe("Observation time unverified");
  expect(
    listingEvidence(
      { ...m.quotes[id], observedAt: new Date(now - 7200000).toISOString() },
      now,
    ).title,
  ).toBe("Old listing snapshot");
});
