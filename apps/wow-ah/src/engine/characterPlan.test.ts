import { describe, expect, it } from "vitest";
import { characterPlan, keySupplies, rankCapForLevel } from "./characterPlan";
import { defaults, validateState } from "../state/profile";
import { unknownMarket } from "../market/ahledger";
import { evaluate } from "./planner";
import { MARKET, type Action } from "../types";

function fixture(prices: Record<number, number> = {}) {
  const c = defaults().characters[0],
    m = unknownMarket();
  c.characterLevel = 20;
  for (const [id, value] of Object.entries(prices))
    c.manual[+id] = {
      market: MARKET,
      ask: value,
      exit: value,
      observedAt: new Date().toISOString(),
      note: "Synthetic test quote",
    };
  return { c, m };
}
describe("character next steps", () => {
  it("does not invent missing character level, cash, prices or recommendations", () => {
    const c = defaults().characters[1],
      m = unknownMarket();
    const plan = characterPlan(c, m);
    expect(plan.blockers).toHaveLength(2);
    expect(plan.spendable).toBeNull();
    expect(plan.choices).toEqual([]);
    c.characterLevel = 20;
    c.cash = 5000;
    expect(characterPlan(c, m).choices).toEqual([]);
    expect(characterPlan(c, m).notes.join(" ")).toContain(
      "no priced, eligible step",
    );
  });
  it("checks crafting-rank ranges without applying them to gathering", () => {
    expect([9, 10, 19, 20, 34, 35].map(rankCapForLevel)).toEqual([
      75, 150, 150, 225, 225, 300,
    ]);
    const { c, m } = fixture();
    c.characterLevel = 9;
    expect(characterPlan(c, m).blockers.join()).toContain("Tailoring 120");
    c.characterLevel = 10;
    expect(characterPlan(c, m).blockers).toEqual([]);
    c.skills.Tailoring!.level = 151;
    c.skills.Tailoring!.cap = 225;
    c.characterLevel = 19;
    expect(characterPlan(c, m).blockers).toHaveLength(1);
    c.skills = { Herbalism: { level: 225, cap: 225, target: 300 } };
    expect(characterPlan(c, m).blockers).toEqual([]);
    expect(characterPlan(c, m).notes.join()).toContain(
      "gathering routes are not part",
    );
  });
  it("preserves unknown level in older backups and validates entered level", () => {
    const data: any = defaults();
    delete data.characters[0].characterLevel;
    expect(validateState(data).characters[0].characterLevel).toBeNull();
    for (const level of [0, 61, 2.5, "20"]) {
      data.characters[0].characterLevel = level;
      expect(validateState(data).characters[0].characterLevel).toBeNull();
    }
    data.characters[0].characterLevel = 37;
    expect(
      validateState(JSON.parse(JSON.stringify(data))).characters[0]
        .characterLevel,
    ).toBe(37);
  });
  it("accepts exactly affordable inputs and respects reserve and spending limit", () => {
    const { c, m } = fixture({ 785: 100, 2450: 200 });
    c.skills = { Alchemy: { level: 130, cap: 150, target: 150 } };
    c.known = [3171];
    const a: Action = {
      id: "test",
      kind: "craft",
      itemId: 3383,
      recipeId: 3171,
      quantity: 1,
      exit: null,
      deposit: null,
      sellFraction: 0,
      fallback: "keep",
    };
    const cost = evaluate(a, c, m).cost.cash!;
    expect(cost).toBeGreaterThan(0);
    c.cash = cost;
    c.budget = cost;
    expect(
      characterPlan(c, m).choices.some(
        (x) => x.evaluation.action.recipeId === 3171,
      ),
    ).toBe(true);
    c.reserve = 1;
    expect(characterPlan(c, m).choices).toEqual([]);
    c.reserve = 0;
    c.cash = cost * 3;
    c.budget = cost - 1;
    expect(characterPlan(c, m).choices).toEqual([]);
  });
  it("does not count free owned materials as economic gold-making profit", () => {
    const { c, m } = fixture({ 4306: 100, 4305: 200 });
    c.skills = { Tailoring: { level: 120, cap: 150, target: 120 } };
    c.inventory[4306] = { qty: 8, note: "Finite owned cloth" };
    const plan = characterPlan(c, m);
    expect(plan.choices).toEqual([]);
    expect(plan.notes.join()).toContain("No checked gold opportunity");
    expect(c.inventory[4306].qty).toBe(8);
  });
  it("keeps gray conversions out of progress but permits positive resale margin", () => {
    const { c, m } = fixture({ 4306: 100, 4305: 1000 });
    c.skills = { Tailoring: { level: 120, cap: 150, target: 150 } };
    const plan = characterPlan(c, m);
    const bolt = plan.choices.find(
      (x) => x.evaluation.action.recipeId === 3839,
    )!;
    expect(bolt).toBeDefined();
    expect(bolt.evaluation.skill).toBe(0);
    expect(bolt.goals).toEqual(["Gold opportunity"]);
    expect(new Set(plan.choices.map((x) => x.evaluation.action.id)).size).toBe(
      plan.choices.length,
    );
    expect(
      plan.choices.every((x) => x.evaluation.action.sellFraction === 0),
    ).toBe(true);
    expect(
      plan.choices.every((x) => x.evaluation.action.recipeId !== 7795),
    ).toBe(true);
  });
  it("stops progression at saved targets and caps, and advises rank training separately", () => {
    const { c, m } = fixture({ 4306: 100 });
    c.skills = { Tailoring: { level: 150, cap: 150, target: 225 } };
    c.characterLevel = 19;
    expect(characterPlan(c, m).notes.join()).toContain(
      "reach character level 20",
    );
    c.characterLevel = 20;
    expect(characterPlan(c, m).notes.join()).toContain(
      "confirm Expert training",
    );
    expect(c.skills.Tailoring!.cap).toBe(150);
    c.skills.Tailoring!.target = 150;
    expect(characterPlan(c, m).notes.join()).toContain(
      "target or trained cap is reached",
    );
  });
  it("uses only a short profession-specific set of finite supplies", () => {
    const { c } = fixture();
    expect(keySupplies(c)).toEqual([2592, 4306, 3383, 10940, 10938, 11083]);
    c.skills = {
      Herbalism: { level: 110, cap: 150, target: 150 },
      Alchemy: { level: 130, cap: 150, target: 150 },
    };
    expect(keySupplies(c)).toEqual([785, 2450]);
  });
});
