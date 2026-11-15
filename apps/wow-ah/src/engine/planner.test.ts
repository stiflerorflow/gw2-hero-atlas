import { describe, it, expect } from "vitest";
import {
  defaults as blankProfiles,
  transfer,
  validateState,
} from "../state/profile";
import { scenarioProfiles as defaults } from "../../tests/support/profiles";
import { MARKET } from "../types";
import type { Action, MarketData } from "../types";
import {
  unknownMarket,
  normalizeTooltip,
  purgeExpired,
  safeURL,
} from "../market/ahledger";
import { RECIPES, CONVERSIONS } from "../catalog/recipes";
import { ITEMS } from "../catalog/items";
import {
  quoteFor,
  exitFor,
  acquire,
  craftCost,
  evaluate,
  batchPlan,
  disenchantValue,
  skillChance,
  expectedSkillGains,
  patternPayback,
  access,
  levelRoute,
} from "./planner";
import { copper, net } from "./money";
const recipe = (id: number) => RECIPES.find((r) => r.id === id)!;
function fixture(prices: Record<number, number> = {}) {
  const c = defaults().characters[0],
    m = unknownMarket();
  c.cash = c.budget = 25000;
  c.known = [2963, 2964, 3839, 6688, 3852, 3848, 14293, 14807];
  c.inventory[3383] = { qty: 0, note: "Synthetic finite input" };
  for (const [id, p] of Object.entries(prices))
    c.manual[+id] = {
      market: MARKET,
      ask: p,
      exit: p,
      observedAt: "2026-11-14T12:00:00Z",
      note: "Synthetic test quote",
    };
  return { c, m };
}
function action(
  kind: Action["kind"],
  itemId: number,
  recipeId?: number,
  extra: Partial<Action> = {},
): Action {
  return {
    id: "test",
    kind,
    itemId,
    recipeId,
    quantity: 1,
    exit: null,
    deposit: 0,
    sellFraction: 1,
    fallback: "keep",
    ...extra,
  };
}
describe("handoff acceptance fixtures", () => {
  it("shirt raw cloth path, five orange gains and pattern paid once", () => {
    const { c, m } = fixture({ 4306: 217, 4305: 2000, 4333: 3000 });
    c.known.push(3870);
    const r = recipe(3870);
    expect(craftCost(r, 1, c, m).cash).toBe(2536);
    expect(evaluate(action("craft", 4333, 3870), c, m).profit).toBe(314);
    c.known = c.known.filter((x) => x !== 3870);
    c.unlockCosts[3870] = 1100;
    const e = evaluate(action("craft", 4333, 3870, { quantity: 5 }), c, m);
    expect(e.profit).toBe(470);
    expect(e.skill).toBe(5);
    expect(patternPayback(e)).toBe(4);
  });
  it("finite donated potion and random DE expected recovery", () => {
    const { c, m } = fixture({
      2592: 130,
      2997: 900,
      3383: 700,
      11083: 440,
      11082: 2749,
      11084: 5022,
    });
    c.inventory[3383].qty = 1;
    expect(craftCost(recipe(3852), 1, c, m).cash).toBe(1860);
    const d = disenchantValue(ITEMS[4318], null, c, m)!;
    expect(d.expected).toBeCloseTo(1492.26, 2);
    expect(d.guaranteed).toBe(false);
    const a = action("craft-de", 4318, 3852, { sellFraction: 0 });
    const p = batchPlan([a, { ...a, id: "two" }], c, m);
    expect(p.cash).toBe(1860 * 2 + 700);
    expect(p.pool[3383]).toBe(0);
  });
  it("guaranteed shard and unknown price do not become zero", () => {
    const { c, m } = fixture({ 4253: 3555, 11084: 5022 });
    const e = evaluate(action("buy-de", 4253), c, m);
    expect(e.profit).toBeCloseTo(1215.9);
    expect(e.de?.guaranteed).toBe(true);
    delete c.manual[11084];
    expect(evaluate(action("buy-de", 4253), c, m).profit).toBeNull();
  });
  it("red bag hotfix consumes five wool bolts", () => {
    const { c, m } = fixture({ 2592: 150, 2997: 1000, 5763: 2300 });
    const e = evaluate(action("craft", 5763, 6688), c, m);
    expect(e.cost.cash).toBe(2400);
    expect(e.profit).toBe(-215);
  });
  it("green pack pattern and skill gate are corrected; thirteen sales pay back", () => {
    const { c, m } = fixture({
      4305: 700,
      4306: 1000,
      4234: 450,
      5764: 8000,
      5774: 30000,
    });
    expect(access(recipe(6693), c)).toContain("140");
    c.skills.Tailoring!.level = 140;
    const e = evaluate(action("craft", 5764, 6693), c, m);
    expect(e.cost.cash).toBe(35250);
    expect(patternPayback(e)).toBe(13);
    expect(recipe(6693).acquisition).toBe("drop");
  });
  it("whole essence lots have precise EV and no recursive cycles", () => {
    const { c, m } = fixture({ 10939: 472, 10938: 208 });
    const e = evaluate(action("convert", 10938, -1), c, m);
    expect(e.cost.cash).toBe(472);
    expect(e.profit).toBeCloseTo(120.8);
    const cost = acquire(10938, 4, c, m, {});
    expect(cost.cash).toBe(680);
    expect(cost.pool[10938] || 0).toBe(0);
    expect(CONVERSIONS).toHaveLength(4);
  });
  it("silk bolt grey at 120, caps stop gains and yellow is estimated", () => {
    const r = recipe(3839);
    expect(skillChance(r, 120)).toBe(0);
    expect(expectedSkillGains(r, 120, 100, 150)).toBe(0);
    expect(expectedSkillGains(recipe(8760), 129, 10, 130)).toBe(1);
    expect(skillChance(recipe(3852), 125)).toBe(0.75);
  });
});
describe("cash, stock and selling boundaries", () => {
  it("deposits commit cash, return without income, and expiry loses only its deposit", () => {
    const { c, m } = fixture({ 4253: 3555, 11084: 5022 });
    const a = action("buy-de", 4253, undefined, { deposit: 100 });
    const sold = batchPlan([a], c, m);
    expect(sold.upfront).toBe(3655);
    expect(sold.profit).toBeCloseTo(1215.9);
    const expired = batchPlan([{ ...a, sellFraction: 0 }], c, m);
    expect(expired.revenue).toBe(-100);
    expect(expired.profit).toBe(-3655);
  });
  it("zero sales needs no exit price; fractions never sell part of a crafted item", () => {
    const { c, m } = fixture({ 4306: 100, 4305: 9999 });
    c.known.push(8760);
    const a = action("craft", 7048, 8760, { sellFraction: 0 });
    expect(batchPlan([a], c, m).revenue).toBe(0);
    const b = { ...a, quantity: 3, sellFraction: 0.5, exit: 1000 };
    expect(batchPlan([b], c, m).revenue).toBe(950);
  });
  it("DE vendor fallback never sells the already destroyed original item", () => {
    const { c, m } = fixture({ 4253: 3555, 11084: 5022 });
    expect(
      batchPlan(
        [
          action("buy-de", 4253, undefined, {
            sellFraction: 0,
            fallback: "vendor",
          }),
        ],
        c,
        m,
      ).revenue,
    ).toBeNull();
  });
  it("future sales cannot fund first purchases and pattern only charged once", () => {
    const { c, m } = fixture({ 4306: 217, 4305: 9999, 4333: 30000 });
    c.cash = c.budget = 5000;
    c.unlockCosts[3870] = 1100;
    const a = action("craft", 4333, 3870);
    const p = batchPlan([a, { ...a, id: "two" }], c, m);
    expect(p.cash).toBe(6172);
    expect(p.fits).toBe(false);
    expect(p.ready).toBe(false);
  });
  it("retained guaranteed mats can be used once and cannot be sold too", () => {
    const { c, m } = fixture({ 4253: 1000, 11084: 5000 });
    const p = batchPlan(
      [
        action("buy-de", 4253, undefined, { retain: true }),
        action("resell", 11084),
      ],
      c,
      m,
    );
    expect(p.cash).toBe(1000);
    expect(p.revenue).toBe(4750);
    expect(p.economic).toBe(1000);
    expect(p.pool[11084]).toBe(0);
  });
  it("random retained mats do not become guaranteed inputs", () => {
    const { c, m } = fixture({
      7048: 1000,
      11083: 100,
      11082: 200,
      11084: 300,
    });
    const p = batchPlan(
      [action("buy-de", 7048, undefined, { retain: true })],
      c,
      m,
    );
    expect(p.pool[11083] || 0).toBe(0);
    expect(p.revenue).toBe(0);
  });
  it("wands excluded despite a generic table and duplicate outcome validation", () => {
    const { c, m } = fixture();
    expect(
      disenchantValue(
        {
          ...ITEMS[11288],
          de: [
            {
              probability: 1,
              drops: [{ id: 10940, min: 1, max: 1 }],
              source: "",
            },
          ],
        },
        1,
        c,
        m,
      ),
    ).toBeNull();
    expect(
      disenchantValue(
        {
          id: 1,
          name: "bad",
          de: [{ probability: 0.4, drops: [], source: "" }],
        },
        1,
        c,
        m,
      ),
    ).toBeNull();
  });
  it("unknown/stale inputs stop funding and routes respect caps", () => {
    const { c, m } = fixture();
    expect(craftCost(recipe(8760), 1, c, m).cash).toBeNull();
    c.skills.Tailoring!.target = 200;
    expect(levelRoute(c, m, "Tailoring").stopped).toBeTruthy();
    c.cash = 0;
    expect(batchPlan([action("craft", 7048, 8760)], c, m).ready).toBe(false);
  });
});
describe("profiles and provider boundaries", () => {
  it("starts with one character without invented identity, skills or property", () => {
    const s = blankProfiles();
    expect(s.characters).toHaveLength(1);
    const c = s.characters[0];
    expect(c.name).toBe("My character");
    expect(c.className).toBe("");
    expect(c.skills).toEqual({});
    expect(c.cash).toBeNull();
    expect(c.characterLevel).toBeNull();
    expect(c.known).toEqual([]);
    expect(c.inventory).toEqual({});
    expect(c.watch).toEqual([]);
  });
  it("explicit finite transfers isolate profiles and reject BoP", () => {
    const s = defaults();
    s.characters[0].inventory[2592] = {
      qty: 4,
      note: "Recorded transfer stock",
    };
    const next = transfer(s, "glimpo", "chumbles", 2592, 3);
    expect(s.characters[0].inventory[2592].qty).toBe(4);
    expect(next.characters[0].inventory[2592].qty).toBe(1);
    expect(next.characters[1].inventory[2592].qty).toBe(3);
    expect(() => transfer(s, "glimpo", "chumbles", 2592, 5)).toThrow();
    expect(() => transfer(s, "glimpo", "chumbles", 6339, 1)).toThrow();
  });
  it("import strips wrong market overrides and unsafe values", () => {
    const s = defaults();
    s.characters[0].manual[4306] = {
      market: "other",
      ask: 0,
      exit: 12,
      observedAt: new Date().toISOString(),
      note: "",
    };
    expect(validateState(s).characters[0].manual[4306]).toBeUndefined();
    expect(() => validateState({ version: 8 })).toThrow();
  });
  it("response identity, zero inferred sales, unknowns, stale removal and URL safety", () => {
    expect(() =>
      normalizeTooltip({ market: "other", items: [] }, 9999),
    ).toThrow();
    const rows = normalizeTooltip(
      {
        market: { slug: "forever/rp/alliance/eu" },
        items: [
          { id: 4306, name: "Silk", minBuyout: 0, salesPerDay: 0, quantity: 2 },
          { id: 4305, name: "Bolt" },
        ],
      },
      Date.now() - 1,
    );
    expect(rows[0].ask).toBeNull();
    expect(rows[0].soldPerDay).toBe(0);
    expect(rows[1].soldPerDay).toBeNull();
    const m: MarketData = { ...unknownMarket(), quotes: { 4306: rows[0] } };
    expect(purgeExpired(m).quotes[4306]).toBeUndefined();
    expect(safeURL("javascript:alert(1)")).toBe("https://ahledger.com");
  });
  it("copper inputs and single AH cut", () => {
    expect(copper("1g 12s 20c")).toBe(11220);
    expect(copper("25000")).toBe(25000);
    expect(copper("-1g")).toBeNull();
    expect(copper("1g 2g")).toBeNull();
    expect(net(3000)).toBe(2850);
  });
});
it("combined batch cannot buy the same quoted stock twice", () => {
  const { c, m } = fixture({ 11084: 5022 });
  m.quotes[4253] = {
    id: 4253,
    name: "Toughened Leather Gloves",
    ask: 3555,
    median: null,
    median7d: null,
    quantity: 1,
    soldPerDay: null,
    observedAt: new Date().toISOString(),
    expiresAt: Date.now() + 60000,
    source: "AHledger · test",
    url: "",
    detectedSale: null,
    coveredHours: null,
  };
  const a = action("buy-de", 4253);
  const plan = batchPlan([a, { ...a, id: "second" }], c, m);
  expect(plan.cash).toBeNull();
  expect(plan.ready).toBe(false);
  expect(plan.rows[1].cost.missing.join()).toContain("Only 0");
});

describe("bug sweep regressions", () => {
  it("unknown expiry deposits make partial/zero-sale recovery unknown, while all-sold remains known", () => {
    const { c, m } = fixture({ 4253: 3555, 11084: 5022 });
    expect(
      batchPlan(
        [action("buy-de", 4253, undefined, { sellFraction: 0, deposit: null })],
        c,
        m,
      ).profit,
    ).toBeNull();
    expect(
      batchPlan(
        [
          action("buy-de", 4253, undefined, {
            sellFraction: 0.5,
            deposit: null,
          }),
        ],
        c,
        m,
      ).profit,
    ).toBeNull();
    expect(
      batchPlan(
        [action("buy-de", 4253, undefined, { sellFraction: 1, deposit: null })],
        c,
        m,
      ).profit,
    ).toBeCloseTo(1215.9);
  });
  it("service rows cannot lose a fictitious auction deposit", () => {
    const { c, m } = fixture({ 10940: 100 });
    c.known.push(7457);
    const p = batchPlan(
      [action("craft", -7457, 7457, { sellFraction: 0, deposit: 500 })],
      c,
      m,
    );
    expect(p.held).toBe(0);
    expect(p.profit).toBe(-200);
  });
  it("cash reserve and spending cap are independent upper bounds", () => {
    const { c, m } = fixture();
    c.cash = 25000;
    c.budget = 10000;
    c.reserve = 5000;
    expect(batchPlan([], c, m).spendable).toBe(10000);
    c.budget = 24000;
    expect(batchPlan([], c, m).spendable).toBe(20000);
  });
  it("batch rows share the same skill roll distribution and rank cap", () => {
    const { c, m } = fixture({ 4305: 500 });
    c.known.push(8760);
    c.skills.Tailoring = { level: 120, cap: 125, target: 125 };
    const a = action("craft", 7048, 8760, { quantity: 4, retain: true });
    const p = batchPlan([a, { ...a, id: "again" }], c, m);
    expect(p.rows[0].skill).toBe(4);
    expect(p.rows[1].skill).toBe(1);
    c.skills.Tailoring = { level: 130, cap: 150, target: 150 };
    const one = { ...a, quantity: 3 };
    const q = batchPlan([one, { ...one, id: "again" }], c, m);
    expect(q.rows.reduce((sum, r) => sum + r.skill, 0)).toBeCloseTo(
      expectedSkillGains(recipe(8760), 130, 6, 150),
    );
  });
  it("imported DE tables survive catalogue name stubs, but cannot override curated exceptions", () => {
    const { c, m } = fixture({ 4344: 100, 11084: 1000 });
    m.deItems = [
      {
        id: 4344,
        name: "Named catalogue stub",
        de: [
          {
            probability: 1,
            drops: [{ id: 11084, min: 1, max: 1 }],
            source: "test",
          },
        ],
      },
    ];
    expect(evaluate(action("buy-de", 4344), c, m).de?.expected).toBe(950);
    const p = batchPlan(
      [action("buy-de", 4344, undefined, { retain: true })],
      c,
      m,
    );
    expect(p.pool[11084]).toBe(1);
    m.deItems = [
      { id: 11288, name: "Greater Magic Wand", de: m.deItems[0].de },
    ];
    expect(evaluate(action("buy-de", 11288), c, m).de).toBeNull();
  });
});
it("one-time tools cannot farm gains through repeated rows or existing ownership", () => {
  const { c, m } = fixture({ 6338: 100, 10940: 100, 10938: 100, 1210: 100 });
  c.known.push(7795);
  const a = action("craft", 6339, 7795, { retain: true });
  const p = batchPlan([a, { ...a, id: "repeat" }], c, m);
  expect(p.ready).toBe(false);
  expect(p.rows[1].eligible).toBe(false);
  expect(p.rows[1].skill).toBe(0);
  const unretained = batchPlan(
    [
      { ...a, retain: false },
      { ...a, id: "repeat", retain: false },
    ],
    c,
    m,
  );
  expect(unretained.rows[1].eligible).toBe(false);
  c.tools = [6339];
  expect(evaluate(a, c, m).eligible).toBe(false);
  expect(evaluate(a, c, m).skill).toBe(0);
  c.tools = [];
  c.inventory[6339] = { qty: 1, note: "Owned tool" };
  expect(evaluate(a, c, m).eligible).toBe(false);
});
it("mixes crafted and purchased bolts when raw listing stock only supports some crafts", () => {
  const { c, m } = fixture({ 2997: 300 });
  m.quotes[2592] = {
    id: 2592,
    name: "Wool Cloth",
    ask: 50,
    median: null,
    median7d: null,
    quantity: 3,
    soldPerDay: null,
    observedAt: new Date().toISOString(),
    expiresAt: Date.now() + 60000,
    source: "AHledger · test",
    url: "",
    detectedSale: null,
    coveredHours: null,
  };
  const plan = acquire(2997, 2, c, m, {});
  expect(plan.cash).toBe(450);
  expect(plan.lines.find((l) => l.id === 2592)?.qty).toBe(3);
  expect(plan.lines.find((l) => l.id === 2997)?.qty).toBe(1);
});
it("mixes owned raw stock and bought bolts rather than pricing every bolt from new cloth", () => {
  const { c, m } = fixture({ 2592: 50, 2997: 100 });
  const plan = acquire(2997, 2, c, m, { 2592: 3 });
  expect(plan.cash).toBe(100);
  expect(plan.pool[2592]).toBe(0);
});
it("orders observation ages by time rather than date-string offsets", () => {
  const { c, m } = fixture({ 4306: 50, 4305: 9999, 7048: 1000 });
  c.known.push(8760);
  c.manual[4306].observedAt = "2026-11-14T10:00:00+02:00";
  c.manual[2321] = {
    market: MARKET,
    ask: 100,
    exit: 100,
    observedAt: "2026-11-14T09:00:00Z",
    note: "",
  };
  expect(evaluate(action("craft", 7048, 8760), c, m).oldest).toBe(
    "2026-11-14T10:00:00+02:00",
  );
});

it("an exit-only scenario preserves independently sourced purchase prices", () => {
  const { c, m } = fixture();
  c.manual[4306] = {
    market: MARKET,
    ask: null,
    exit: 300,
    observedAt: new Date().toISOString(),
    note: "Sale scenario only",
  };
  m.quotes[4306] = {
    id: 4306,
    name: "Silk Cloth",
    ask: 100,
    median: 110,
    median7d: 120,
    quantity: 20,
    soldPerDay: 5,
    observedAt: "2026-11-14T10:00:00Z",
    source: "AHledger",
    url: "",
    expiresAt: Date.now() + 60000,
    detectedSale: null,
    coveredHours: null,
  };
  expect(quoteFor(4306, c, m)?.ask).toBe(100);
  expect(quoteFor(4306, c, m)?.source).toBe("AHledger");
  expect(exitFor(4306, c, m)).toBe(300);
  c.manual[2321] = { ...c.manual[4306], exit: 200 };
  expect(quoteFor(2321, c, m)?.ask).toBe(100);
  m.quotes[4306].expiresAt = 0;
  expect(quoteFor(4306, c, m)).toBeUndefined();
  c.manual[4306].ask = 90;
  expect(quoteFor(4306, c, m)?.ask).toBe(90);
});

it("checks both engineering tools; training and a nearby station are distinct prerequisites", () => {
  const { c, m } = fixture({ 2841: 100, 2592: 100, 4375: 1000 });
  c.skills = { Engineering: { level: 130, cap: 150, target: 150 } };
  const r = recipe(3942),
    a = action("craft", 4375, 3942);
  c.tools = [5956];
  expect(access(r, c)).toContain("Arclight Spanner");
  expect(evaluate(a, c, m).eligible).toBe(false);
  c.tools.push(6219);
  expect(evaluate(a, c, m).eligible).toBe(true);
  expect(evaluate(a, c, m).cost.cash).toBe(800);
  expect(r.station).toBe("Anvil");
  expect(evaluate(a, c, m).cost.steps.join(" ")).toContain(
    "Prepare a nearby Anvil",
  );
  expect(r.count).toBe(1);
  c.known.push(3942);
  expect(evaluate(a, c, m).cost.cash).toBe(300);
  expect(evaluate(a, c, m).skill).toBeCloseTo(0.7);
});
it("independently cross-checked bracer outcomes can have a positive mean with a 75% loss probability", () => {
  const { c, m } = fixture({
    10059: 7000,
    11176: 3000,
    11175: 30000,
    11178: 20000,
  });
  const e = evaluate(action("buy-de", 10059), c, m);
  // Synthetic regression prices: 75% dust, 20% essence, 5% shard; 1–2 units uniformly modeled.
  const independentRecovery =
    (0.75 * 1.5 * 3000 + 0.2 * 1.5 * 30000 + 0.05 * 20000) * 0.95;
  expect(e.proceeds).toBeCloseTo(independentRecovery);
  expect(e.profit).toBeGreaterThan(0);
  expect(e.de!.breakEvenChance).toBeCloseTo(0.25);
  expect(e.de!.worst! - e.cost.cash!).toBeLessThan(0);
});
