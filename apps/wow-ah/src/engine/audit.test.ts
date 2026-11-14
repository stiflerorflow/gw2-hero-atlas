import { it, expect } from "vitest";
import { defaults, validateState } from "../state/profile";
import { unknownMarket } from "../market/ahledger";
import { evaluate, batchPlan } from "./planner";
import { MARKET, type Action } from "../types";
const a = (extra: Partial<Action>): Action => ({
  id: "audit",
  kind: "resell",
  itemId: 6339,
  quantity: 1,
  exit: 1000,
  deposit: 0,
  sellFraction: 1,
  fallback: "keep",
  ...extra,
});
it("a known soulbound item cannot produce modeled auction income", () => {
  const c = defaults().characters[0],
    m = unknownMarket();
  c.inventory[6339] = { qty: 1, note: "Owned soulbound rod" };
  const e = evaluate(a({}), c, m);
  expect(e.eligible).toBe(false);
  expect(e.proceeds).toBeNull();
  expect(batchPlan([a({})], c, m).ready).toBe(false);
});
it("a purchase action cannot multiply its output through an unrelated recipe ID", () => {
  const c = defaults().characters[0],
    m = unknownMarket();
  c.manual[10938] = {
    market: MARKET,
    ask: 100,
    exit: 200,
    observedAt: new Date().toISOString(),
    note: "Synthetic quote",
  };
  const action = a({ itemId: 10938, recipeId: -1, exit: 200 });
  const e = evaluate(action, c, m);
  expect(e.units).toBe(1);
  expect(e.profit).toBe(90);
  const s = defaults();
  s.characters[0].batch = [action];
  expect(validateState(s).characters[0].batch[0].recipeId).toBeUndefined();
});

it("recognizes explicit bound codes without treating BoE as already bound", async () => {
  const { isAuctionBound } = await import("./binding");
  for (const value of [
    "BoP",
    "BIND_ON_ACQUIRE",
    "Binds when picked up",
    "Quest item",
    "Account bound",
  ])
    expect(isAuctionBound(value)).toBe(true);
  for (const value of ["BoE", "Binds when equipped", "Binds when used", null])
    expect(isAuctionBound(value)).toBe(false);
});

it("a large sequence shares skill gains and stops adding points when the recipe is gray", () => {
  const c = defaults().characters[0],
    m = unknownMarket();
  c.tools = [6218];
  c.manual[10938] = {
    market: MARKET,
    ask: 1,
    exit: 1,
    observedAt: new Date().toISOString(),
    note: "Synthetic bulk quote",
  };
  const rows = Array.from({ length: 50 }, (_, i) =>
    a({
      id: "bulk-" + i,
      kind: "craft",
      itemId: 11288,
      recipeId: 14807,
      quantity: 1000,
      exit: 100,
      deposit: 0,
    }),
  );
  const plan = batchPlan(rows, c, m);
  expect(plan.rows.reduce((n, r) => n + r.skill, 0)).toBeCloseTo(50, 8);
  expect(plan.rows.slice(1).every((r) => r.skill < 0.000001)).toBe(true);
});

it("catalogue missing binding facts stay unknown rather than becoming confirmed unbound", async () => {
  const { normalizeCatalogItem } = await import("../market/catalog");
  const base = {
    id: 987651,
    kind: "item",
    version: "forever",
    name: "Synthetic incomplete item",
    vendor_sell: 100,
  };
  expect(normalizeCatalogItem(base, 987651).binding).toBeUndefined();
  expect(
    normalizeCatalogItem({ ...base, binding: null }, 987651).binding,
  ).toBeNull();
});
