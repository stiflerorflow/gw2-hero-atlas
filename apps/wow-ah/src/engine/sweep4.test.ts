import { it, expect } from "vitest";
import { defaults } from "../state/profile";
import { unknownMarket } from "../market/ahledger";
import { acquire, evaluate, batchPlan } from "./planner";
import type { Quote } from "../types";
function marketQuote(id: number, ask: number, quantity: number): Quote {
  return {
    id,
    name: "Synthetic audit item",
    ask,
    quantity,
    median: null,
    median7d: null,
    soldPerDay: null,
    observedAt: new Date().toISOString(),
    expiresAt: Date.now() + 60000,
    source: "AHledger · synthetic audit",
    url: "",
    detectedSale: null,
    coveredHours: null,
  };
}
it("uses the minimum necessary conversion lot when only some requested output can be bought", () => {
  const c = defaults().characters[0],
    m = unknownMarket();
  m.quotes[10938] = marketQuote(10938, 100, 4);
  m.quotes[10939] = marketQuote(10939, 1000, 2);
  const result = acquire(10938, 8, c, m, {});
  expect(result.cash).toBe(2200); // Buy two lesser and split two greater; five lesser are not available.
  expect(
    result.lines.filter((l) => l.id === 10939).reduce((n, l) => n + l.qty, 0),
  ).toBe(2);
});
it("does not fund learning an unavailable pattern from its stale nonzero ask", () => {
  const c = defaults().characters[0],
    m = unknownMarket();
  c.skills.Tailoring!.level = 125;
  for (const [id, ask] of [
    [7091, 100],
    [4305, 100],
    [4234, 100],
    [929, 100],
    [7049, 5000],
  ])
    m.quotes[id] = marketQuote(id, ask, id === 7091 ? 0 : 100);
  const e = evaluate(
    {
      id: "pattern",
      kind: "craft",
      itemId: 7049,
      recipeId: 8782,
      quantity: 1,
      exit: null,
      deposit: 0,
      sellFraction: 1,
      fallback: "keep",
    },
    c,
    m,
  );
  expect(e.cost.cash).toBeNull();
  expect(e.eligible).toBe(false);
});
it("uses a finite owned unlearned pattern once and still values its resale opportunity", () => {
  const c = defaults().characters[0],
    m = unknownMarket();
  c.skills.Tailoring!.level = 125;
  c.inventory[7091] = { qty: 1, note: "Owned unlearned pattern" };
  for (const [id, ask] of [
    [7091, 100],
    [4305, 100],
    [4234, 100],
    [929, 100],
    [7049, 5000],
  ])
    m.quotes[id] = marketQuote(id, ask, 100);
  const a = {
    id: "pattern",
    kind: "craft" as const,
    itemId: 7049,
    recipeId: 8782,
    quantity: 1,
    exit: null,
    deposit: 0,
    sellFraction: 1,
    fallback: "keep" as const,
  };
  const e = batchPlan([a, { ...a, id: "second" }], c, m);
  expect(e.cash).toBe(2000); // Each craft 3*100 +2*100 +4*100 +100 vendor thread.
  expect(e.economic).toBe(2095);
  expect(e.pool[7091]).toBe(0);
});
it("conserves finite market stock across raw/conversion branches and later batch rows", () => {
  const c = defaults().characters[0],
    m = unknownMarket();
  c.tools = [6218];
  c.known = [14807];
  c.cash = 2351;
  c.budget = 2351;
  m.quotes[10938] = marketQuote(10938, 100, 4);
  m.quotes[10939] = marketQuote(10939, 1000, 2);
  const a = {
    id: "first",
    kind: "craft" as const,
    itemId: 11288,
    recipeId: 14807,
    quantity: 4,
    exit: null,
    deposit: 0,
    sellFraction: 0,
    fallback: "keep" as const,
  };
  const result = batchPlan([a], c, m);
  expect(result.cash).toBe(2352);
  expect(result.fits).toBe(false);
  const used = result.rows[0].cost.lines
    .filter((l) => l.id === 10938 && l.fromMarket)
    .reduce((n, l) => n + l.qty, 0);
  expect(used).toBeLessThanOrEqual(4);
  const rest = batchPlan(
    [a, { ...a, id: "second", quantity: 1 }],
    { ...c, cash: 5000, budget: 5000 },
    m,
  );
  expect(rest.cash).toBe(2590);
  expect(rest.rows[1].cost.lines.find((l) => l.id === 10938)?.qty).toBe(2);
  const unavailable = batchPlan(
    [a, { ...a, id: "second", quantity: 2 }],
    { ...c, cash: 5000, budget: 5000 },
    m,
  );
  expect(unavailable.ready).toBe(false);
  expect(unavailable.cash).toBeNull();
});
it("a mixed conversion avoids pointless opposite-direction conversions and retains whole-lot surplus", () => {
  const c = defaults().characters[0],
    m = unknownMarket();
  m.quotes[10938] = marketQuote(10938, 100, 5);
  m.quotes[10939] = marketQuote(10939, 1000, 2);
  const result = acquire(10938, 8, c, m, {});
  expect(result.cash).toBe(1500);
  expect(
    result.steps.filter((s) => s.includes("Lesser → Greater")),
  ).toHaveLength(0);
  const surplus = acquire(10938, 5, c, m, { 10939: 2 });
  expect(surplus.cash).toBe(0);
  expect(surplus.pool[10938]).toBe(1);
  expect(surplus.pool[10939]).toBe(0);
});
it("explicit bound aliases cannot produce an auction resale", async () => {
  const { isAuctionBound } = await import("./binding");
  for (const binding of [
    "Binds on pickup",
    "Binds to account",
    "Binds on acquire",
    "Binds to warband",
  ])
    expect(isAuctionBound(binding)).toBe(true);
});
it("an explicit unlock-price scenario stays a scalar override rather than claiming pattern stock", () => {
  const c = defaults().characters[0],
    m = unknownMarket();
  c.skills.Tailoring!.level = 125;
  c.unlockCosts[8782] = 55;
  for (const [id, ask] of [
    [7091, 100],
    [4305, 100],
    [4234, 100],
    [929, 100],
  ])
    m.quotes[id] = marketQuote(id, ask, id === 7091 ? 0 : 100);
  const result = evaluate(
    {
      id: "override",
      kind: "craft",
      itemId: 7049,
      recipeId: 8782,
      quantity: 1,
      exit: null,
      deposit: 0,
      sellFraction: 0,
      fallback: "keep",
    },
    c,
    m,
  );
  expect(result.cost.cash).toBe(1055);
  expect(result.cost.fees).toBe(55);
  expect(result.cost.lines.some((l) => l.id === 7091)).toBe(false);
});
