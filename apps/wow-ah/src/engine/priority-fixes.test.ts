import { it, expect } from "vitest";
import { defaults } from "../state/profile";
import { MARKET, type Action } from "../types";
import { unknownMarket } from "../market/ahledger";
import {
  acquire,
  batchPlan,
  evaluate,
  ownedValue,
  skillChance,
} from "./planner";
import { characterPlan } from "./characterPlan";
import { sellDecision, bestKnownSaleValue } from "./sell";
import { RECIPES, recipeById } from "../catalog/recipes";
function fixture(prices: Record<number, number>) {
  const c = defaults().characters[0],
    m = unknownMarket();
  c.characterLevel = 20;
  for (const [id, value] of Object.entries(prices))
    c.manual[+id] = {
      market: MARKET,
      ask: value,
      exit: value,
      observedAt: new Date().toISOString(),
      note: "Synthetic regression quote",
    };
  return { c, m };
}
it("rejects the reviewed DE recommendation when vendoring owned gloves pays more", () => {
  const { c, m } = fixture({ 4318: 500, 11083: 300, 11082: 600, 11084: 1500 });
  c.skills = { Enchanting: { level: 100, cap: 150, target: 100 } };
  c.inventory = { 4318: { qty: 1, note: "Owned gloves" } };
  const a: Action = {
    id: "review",
    kind: "buy-de",
    itemId: 4318,
    quantity: 1,
    exit: null,
    deposit: 0,
    sellFraction: 1,
    fallback: "keep",
  };
  const e = evaluate(a, c, m);
  expect(sellDecision(610, 500, 1, 0, false).title).toBe(
    "Vendor pays at least as much",
  );
  expect(e.cost.cash).toBe(0);
  expect(e.cost.economic).toBe(610);
  expect(e.proceeds).toBeCloseTo(562.875);
  expect(e.economicProfit).toBeCloseTo(-47.125);
  expect(batchPlan([a], c, m).economic).toBe(610);
  expect(characterPlan(c, m).choices).toEqual([]);
  delete c.manual[4318];
  expect(ownedValue(4318, c, m)).toBe(610);
  expect(acquire(4318, 1, c, m, { 4318: 1 }).economic).toBe(610);
  c.manual[4318] = {
    market: MARKET,
    ask: 1000,
    exit: 1000,
    observedAt: new Date().toISOString(),
    note: "Higher auction",
  };
  expect(ownedValue(4318, c, m)).toBe(950);
  expect(batchPlan([a], c, m).economic).toBe(950);
});
it("keeps unknown, zero and bound disposal alternatives separate", () => {
  expect(bestKnownSaleValue(null, null)).toBeNull();
  expect(bestKnownSaleValue(0, null)).toBe(0);
  expect(bestKnownSaleValue(500, 1000, true)).toBe(500);
  expect(bestKnownSaleValue(null, 1000, true)).toBeNull();
  expect(bestKnownSaleValue(610, 500)).toBe(610);
  expect(bestKnownSaleValue(610, 1000)).toBe(950);
});
it("prefers fixed output by default, while letting users explicitly choose a higher DE mean", () => {
  const { c, m } = fixture({
    4306: 100,
    4305: 1000,
    10059: 7000,
    11176: 3000,
    11175: 30000,
    11178: 20000,
  });
  c.skills.Tailoring!.target = 120;
  c.skills.Enchanting!.target = 100;
  const gold = (mode: "yield" | "margin") =>
    characterPlan(c, m, { progress: "cash", gold: mode }).choices.find((v) =>
      v.goals.includes("Gold opportunity"),
    )!;
  expect(gold("yield").evaluation.action.recipeId).toBe(3839);
  expect(gold("margin").evaluation.action.itemId).toBe(10059);
  expect(gold("margin").evaluation.economicProfit).toBeGreaterThan(
    gold("yield").evaluation.economicProfit!,
  );
});
it("adds checked choices through the actual Alchemy and Engineering skill brackets without inventing trainer fees", () => {
  const { c, m } = fixture({
    785: 100,
    3820: 200,
    6359: 150,
    3355: 100,
    3356: 100,
    6371: 200,
    2841: 100,
    3575: 100,
    10558: 100,
    7912: 100,
  });
  c.skills = {
    Alchemy: { level: 175, cap: 225, target: 200 },
    Engineering: { level: 175, cap: 225, target: 200 },
  };
  c.tools = [5956, 6219];
  for (const id of [3173, 7837, 3177, 7845, 3452, 3941, 3958, 3961, 12585]) {
    const r = recipeById(id)!;
    expect(r.verified).toBe(true);
    expect(r.unlock).toBeNull();
    c.known.push(id);
    const a: Action = {
      id: String(id),
      kind: "craft",
      recipeId: id,
      itemId: r.output,
      quantity: 1,
      exit: null,
      deposit: 0,
      sellFraction: 0,
      fallback: "keep",
    };
    const e = evaluate(a, c, m);
    expect(e.eligible, r.name).toBe(true);
    expect(e.cost.cash, r.name).not.toBeNull();
  }
  const fire = recipeById(7837)!;
  expect(fire.count).toBe(2);
  expect(fire.reagents).toEqual([
    { id: 6359, qty: 2 },
    { id: 3371, qty: 1 },
  ]);
  expect(skillChance(fire, 170)).toBe(0);
  expect(skillChance(recipeById(3452)!, 175)).toBe(1);
  expect(RECIPES.filter((r) => r.profession === "Alchemy")).toHaveLength(6);
  expect(RECIPES.filter((r) => r.profession === "Engineering")).toHaveLength(7);
  const plan = characterPlan(c, m);
  expect(plan.choices.some((v) => v.goals.includes("Alchemy progress"))).toBe(
    true,
  );
  expect(
    plan.choices.some((v) => v.goals.includes("Engineering progress")),
  ).toBe(true);
});

it("funds whole vendor vial packs once and carries the unused vials forward", () => {
  const { c, m } = fixture({});
  const first = acquire(3371, 1, c, m, {});
  expect(first.cash).toBe(20);
  expect(first.lines[0].qty).toBe(5);
  expect(first.pool[3371]).toBe(4);
  expect(acquire(3371, 10, c, m, {}).cash).toBe(40);
  expect(acquire(3372, 6, c, m, {}).cash).toBe(400);
  const next = acquire(3371, 4, c, m, first.pool);
  expect(next.cash).toBe(0);
  expect(next.pool[3371]).toBe(0);
});
it("compares upfront progress with net progress without spending future proceeds", () => {
  const {c,m}=fixture({785:100,2450:200,3820:200,3383:1000,3385:400});
  c.skills={Alchemy:{level:130,cap:150,target:150}};
  c.known=[3171,3173];
  const pick=(progress:"cash"|"net")=>characterPlan(c,m,{progress,gold:"yield"}).choices.find(v=>v.goals.includes("Alchemy progress"))!;
  expect(pick("cash").evaluation.action.recipeId).toBe(3173);
  expect(pick("net").evaluation.action.recipeId).toBe(3171);
  c.cash=319;c.budget=319;
  expect(characterPlan(c,m,{progress:"net",gold:"yield"}).choices).toEqual([]);
});
