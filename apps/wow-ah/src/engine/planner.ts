import type {
  Action,
  Character,
  Item,
  MarketData,
  Outcome,
  Quote,
  Recipe,
} from "../types";
import { ITEMS, itemName } from "../catalog/items";
import { RECIPES, CONVERSIONS, recipeById } from "../catalog/recipes";
import { net } from "./money";
export type Line = {
  id: number;
  qty: number;
  cash: number | null;
  economic: number | null;
  source: string;
  observedAt: string | null;
};
export type Cost = {
  cash: number | null;
  economic: number | null;
  lines: Line[];
  steps: string[];
  missing: string[];
  pool: Record<number, number>;
  fees: number | null;
};
export const emptyCost = (pool: Record<number, number>): Cost => ({
  cash: 0,
  economic: 0,
  lines: [],
  steps: [],
  missing: [],
  pool: { ...pool },
  fees: 0,
});
const plus = (a: number | null, b: number | null) =>
  a === null || b === null ? null : a + b;
export function combine(a: Cost, b: Cost): Cost {
  return {
    cash: plus(a.cash, b.cash),
    economic: plus(a.economic, b.economic),
    lines: [...a.lines, ...b.lines],
    steps: [...a.steps, ...b.steps],
    missing: [...a.missing, ...b.missing],
    pool: b.pool,
    fees: plus(a.fees, b.fees),
  };
}
export function quoteFor(
  id: number,
  c: Character,
  m: MarketData,
  now = Date.now(),
): Quote | undefined {
  const manual = c.manual[id];
  if (manual?.market === "forever.rp.alliance.eu" && manual.ask !== null)
    return {
      id,
      name: itemName(id),
      ask: manual.ask,
      median: manual.exit,
      median7d: null,
      quantity: null,
      soldPerDay: null,
      observedAt: manual.observedAt,
      source: "Manual quote",
      url: "",
      expiresAt: Infinity,
      detectedSale: null,
      coveredHours: null,
    };
  const vendor = c.vendor[id] ?? ITEMS[id]?.vendor;
  if (vendor !== undefined)
    return {
      id,
      name: itemName(id),
      ask: vendor,
      median: vendor,
      median7d: null,
      quantity: null,
      soldPerDay: null,
      observedAt: null,
      source: "Vendor reference · editable",
      url: "",
      expiresAt: Infinity,
      detectedSale: null,
      coveredHours: null,
    };
  const q = m.quotes[id];
  return q && q.expiresAt > now ? q : undefined;
}
export function exitFor(
  id: number,
  c: Character,
  m: MarketData,
): number | null {
  const q = c.manual[id];
  if (q?.market === "forever.rp.alliance.eu" && q.exit !== null) return q.exit;
  const market = m.quotes[id];
  return market && market.expiresAt > Date.now() ? market.ask : null;
}
export function unlockCost(
  r: Recipe,
  c: Character,
  m: MarketData,
): number | null {
  return c.known.includes(r.id) || r.acquisition === "conversion"
    ? 0
    : (c.unlockCosts[r.id] ??
        (r.pattern ? quoteFor(r.pattern, c, m)?.ask : null) ??
        r.unlock);
}
export function access(
  r: Recipe,
  c: Character,
  forLevel = false,
): string | null {
  if (r.acquisition === "conversion") return null;
  const s = c.skills[r.profession];
  if (!s) return `Needs ${r.profession}`;
  if (s.level < r.min) return `Needs ${r.profession} ${r.min}`;
  if (r.min > s.cap) return `Rank cap ${s.cap} blocks this recipe`;
  if (r.tool && !c.tools.includes(r.tool))
    return `Confirm ${itemName(r.tool)} in profile tools`;
  if (!r.verified) return "Imported recipe: requirements not verified";
  if (forLevel && r.once) return "One-time tool: not a repeat skill route";
  if (!c.known.includes(r.id)) return `Not learned · ${r.acquisition}`;
  return null;
}
export function skillChance(r: Recipe, skill: number): number {
  if (skill < r.min || skill >= r.grey) return 0;
  if (skill < r.yellow) return 1;
  if (skill < r.green)
    return 0.75 - (0.25 * (skill - r.yellow)) / Math.max(1, r.green - r.yellow);
  return Math.max(
    0.05,
    (0.5 * (r.grey - skill)) / Math.max(1, r.grey - r.green),
  );
}
const poolFor = (c: Character) =>
  Object.fromEntries(
    Object.entries(c.inventory).map(([id, v]) => [+id, v.qty]),
  );
function rawAcquire(
  id: number,
  qty: number,
  c: Character,
  m: MarketData,
  pool: Record<number, number>,
): Cost {
  const out = emptyCost(pool),
    q = quoteFor(id, c, m),
    price = q?.ask ?? null;
  out.cash = price === null ? null : Math.ceil(price * qty);
  out.economic = out.cash;
  out.lines = [
    {
      id,
      qty,
      cash: out.cash,
      economic: out.economic,
      source: q?.source || "Unpriced",
      observedAt: q?.observedAt ?? null,
    },
  ];
  if (price === null)
    out.missing.push("Missing purchase price: " + itemName(id));
  if (q?.quantity !== null && q?.quantity !== undefined && qty > q.quantity) {
    out.missing.push(`Only ${q.quantity} ${itemName(id)} listed; need ${qty}.`);
    out.cash = out.economic = null;
  }
  return out;
}
export function acquire(
  id: number,
  qty: number,
  c: Character,
  m: MarketData,
  pool: Record<number, number>,
  path: number[] = [],
): Cost {
  qty = Math.ceil(qty);
  let result = emptyCost(pool);
  if (qty <= 0) return result;
  const owned = Math.min(qty, Math.max(0, result.pool[id] || 0));
  if (owned) {
    result.pool[id] -= owned;
    const price = exitFor(id, c, m),
      economic = price === null ? null : net(price) * owned;
    result.economic = economic;
    result.lines.push({
      id,
      qty: owned,
      cash: 0,
      economic,
      source: c.inventory[id]?.note || "Owned / earlier batch output",
      observedAt: c.manual[id]?.observedAt || m.quotes[id]?.observedAt || null,
    });
    qty -= owned;
  }
  if (qty === 0) return result;
  let chosen = rawAcquire(id, qty, c, m, result.pool);
  if (!path.includes(id)) {
    const candidates = [
      ...RECIPES.filter(
        (r) => r.output === id && r.name.startsWith("Bolt of "),
      ),
      ...CONVERSIONS.filter((r) => r.output === id),
    ].filter((r) => !access(r, c));
    for (const r of candidates) {
      const maxCrafts = Math.ceil(qty / r.count);
      const available = r.reagents.map((input) => {
        const q = quoteFor(input.id, c, m);
        const purchasable = q?.ask != null ? (q.quantity ?? Infinity) : 0;
        return Math.floor(
          ((result.pool[input.id] || 0) + purchasable) / input.qty,
        );
      });
      // Cash cost changes at whole output lots, finite stock limits, and owned-stock
      // boundaries. Check those breakpoints rather than enumerating every craft.
      const counts = new Set([
        maxCrafts,
        Math.floor(qty / r.count),
        Math.min(maxCrafts, ...available),
      ]);
      for (const input of r.reagents) {
        const ownedCrafts = (result.pool[input.id] || 0) / input.qty;
        counts.add(Math.floor(ownedCrafts));
        counts.add(Math.ceil(ownedCrafts));
      }
      for (const crafts of [...counts].filter((n) => n > 0 && n <= maxCrafts)) {
        let attempt = emptyCost(result.pool);
        for (const reagent of r.reagents)
          attempt = combine(
            attempt,
            acquire(reagent.id, reagent.qty * crafts, c, m, attempt.pool, [
              ...path,
              id,
            ]),
          );
        const surplus = Math.max(0, crafts * r.count - qty),
          remainder = Math.max(0, qty - crafts * r.count);
        if (remainder)
          attempt = combine(
            attempt,
            rawAcquire(id, remainder, c, m, attempt.pool),
          );
        if (surplus) attempt.pool[id] = (attempt.pool[id] || 0) + surplus;
        attempt.steps.push(
          `${crafts} × ${r.name} → ${crafts * r.count} units${surplus ? `; keep ${surplus} surplus` : ""}`,
        );
        if (
          attempt.cash !== null &&
          (chosen.cash === null || attempt.cash < chosen.cash)
        )
          chosen = attempt;
      }
    }
  }
  return combine(result, chosen);
}
export function craftCost(
  r: Recipe,
  crafts: number,
  c: Character,
  m: MarketData,
  pool = poolFor(c),
  chargeUnlock = true,
): Cost {
  let out = emptyCost(pool);
  for (const input of r.reagents)
    out = combine(
      out,
      acquire(input.id, input.qty * Math.ceil(crafts), c, m, out.pool, [
        r.output,
      ]),
    );
  const fee = chargeUnlock ? unlockCost(r, c, m) : 0;
  out.cash = plus(out.cash, fee);
  out.economic = plus(out.economic, fee);
  out.fees = fee;
  if (fee === null)
    out.missing.push(
      "Enter the actual recipe/trainer price, or mark this recipe learned.",
    );
  out.steps.push(
    `${Math.ceil(crafts)} × ${r.name} → ${Math.ceil(crafts) * r.count} ${r.service ? "applications" : itemName(r.output)}`,
  );
  return out;
}
export type DEValue = {
  expected: number | null;
  worst: number | null;
  best: number | null;
  common: string;
  breakEvenChance: number | null;
  dustOnly: number | null;
  outcomes: { probability: number; value: number | null; label: string }[];
  missing: number[];
  guaranteed: boolean;
};
export function disenchantValue(
  item: Item,
  buy: number | null,
  c: Character,
  m: MarketData,
  overrides?: Record<number, number>,
): DEValue | null {
  if (item.noDE || !item.de?.length) return null;
  const outcomes = item.de,
    probability = outcomes.reduce((s, o) => s + o.probability, 0);
  if (Math.abs(probability - 1) > 0.001) return null;
  const values: DEValue["outcomes"] = [],
    missing: number[] = [];
  let expected = 0,
    worst = Infinity,
    best = -Infinity,
    breakEven = 0,
    dustOnly = 0;
  for (const o of outcomes) {
    let mid = 0,
      lo = 0,
      hi = 0;
    let unknown = false;
    let states: { value: number; prob: number }[] = [{ value: 0, prob: 1 }];
    for (const drop of o.drops) {
      const p = overrides?.[drop.id] ?? exitFor(drop.id, c, m);
      if (p === null) {
        missing.push(drop.id);
        unknown = true;
        continue;
      }
      const price = net(p);
      mid += (price * (drop.min + drop.max)) / 2;
      lo += price * drop.min;
      hi += price * drop.max;
      if (itemName(drop.id).includes("Dust"))
        dustOnly += (o.probability * price * (drop.min + drop.max)) / 2;
      const next: typeof states = [];
      for (const s of states)
        for (let n = drop.min; n <= drop.max; n++)
          next.push({
            value: s.value + n * price,
            prob: s.prob / (drop.max - drop.min + 1),
          });
      states = next;
    }
    const label = o.drops
      .map(
        (d) =>
          `${d.min === d.max ? d.min : d.min + "–" + d.max} ${itemName(d.id)}`,
      )
      .join(" + ");
    values.push({
      probability: o.probability,
      value: unknown ? null : mid,
      label,
    });
    if (!unknown) {
      expected += o.probability * mid;
      worst = Math.min(worst, lo);
      best = Math.max(best, hi);
      if (buy !== null)
        breakEven +=
          o.probability *
          states.filter((s) => s.value >= buy).reduce((n, s) => n + s.prob, 0);
    }
  }
  const complete = !missing.length;
  return {
    expected: complete ? expected : null,
    worst: complete ? worst : null,
    best: complete ? best : null,
    common:
      values.slice().sort((a, b) => b.probability - a.probability)[0]?.label ||
      "",
    breakEvenChance: complete && buy !== null ? breakEven : null,
    dustOnly: complete ? dustOnly : null,
    outcomes: values,
    missing: [...new Set(missing)],
    guaranteed:
      outcomes.length === 1 &&
      outcomes[0].probability === 1 &&
      outcomes[0].drops.every((d) => d.min === d.max),
  };
}
export type Evaluation = {
  action: Action;
  name: string;
  cost: Cost;
  proceeds: number | null;
  economicProfit: number | null;
  profit: number | null;
  maxBuy: number | null;
  units: number;
  oldest: string | null;
  reasons: string[];
  de: DEValue | null;
  skill: number;
  quote: Quote | undefined;
  depositHeld: number | null;
  vendorValue: number | null;
  eligible: boolean;
};
// Provider item-name stubs must not shadow separately normalized DE metadata.
// Explicit catalogue exceptions and checked tables always take precedence.
function resolvedItem(id: number, m: MarketData): Item {
  const curated = ITEMS[id],
    imported = m.deItems.find((i) => i.id === id);
  return curated?.noDE || curated?.de?.length
    ? curated
    : imported || curated || { id, name: itemName(id) };
}
export function evaluate(
  a: Action,
  c: Character,
  m: MarketData,
  pool = poolFor(c),
  charged = new Set<number>(),
): Evaluation {
  const r =
      a.recipeId !== undefined
        ? [...RECIPES, ...CONVERSIONS].find((r) => r.id === a.recipeId)
        : undefined,
    item = resolvedItem(a.itemId, m);
  let cost = emptyCost(pool),
    reasons: string[] = [],
    units = a.quantity * (r?.count || 1),
    de: DEValue | null = null,
    proceeds: number | null = null,
    skill = 0;
  if (r && r.output !== a.itemId)
    reasons.push("Recipe output does not match this action.");
  if (a.kind === "craft" || a.kind === "craft-de" || a.kind === "convert") {
    if (!r) {
      reasons.push("Recipe unavailable");
      cost.cash = null;
    } else {
      const problem = access(r, c);
      if (problem) reasons.push(problem);
      const duplicateTool =
        r.once &&
        (a.quantity > 1 ||
          c.tools.includes(r.output) ||
          (pool[r.output] || 0) > 0 ||
          charged.has(r.id));
      if (duplicateTool)
        reasons.push(
          "One-time tool already owned or repeated in this batch; craft it only once.",
        );
      cost = craftCost(r, a.quantity, c, m, pool, !charged.has(r.id));
      charged.add(r.id);
      skill = expectedSkillGains(
        r,
        c.skills[r.profession]?.level || 0,
        a.quantity,
        c.skills[r.profession]?.cap || 300,
      );
      if (duplicateTool) skill = 0;
    }
  } else if (a.kind === "buy-de")
    cost = acquire(a.itemId, a.quantity, c, m, pool);
  else cost = acquire(a.itemId, a.quantity, c, m, pool);
  const exit = a.exit ?? (r?.service ? 0 : exitFor(a.itemId, c, m));
  if (a.kind === "craft-de" || a.kind === "buy-de") {
    if (!c.skills.Enchanting) reasons.push("Needs Enchanting to disenchant");
    de = disenchantValue(
      item,
      cost.cash === null ? null : cost.cash / a.quantity,
      c,
      m,
    );
    if (!de)
      reasons.push(
        "No verified disenchant table / explicit non-disenchantable item",
      );
    proceeds = de?.expected === null || !de ? null : de.expected * units;
  } else if (r?.binding === "BoP") {
    proceeds = 0;
    reasons.push("Soulbound output: keep as a tool; no AH resale.");
  } else proceeds = exit === null ? null : net(exit) * units;
  const q = m.quotes[a.itemId],
    dates = cost.lines.map((l) => l.observedAt).filter((v): v is string => !!v);
  if (q?.observedAt && q.expiresAt > Date.now()) dates.push(q.observedAt);
  if (de)
    for (const o of item.de || [])
      for (const drop of o.drops) {
        const q = m.quotes[drop.id];
        if (q?.observedAt && q.expiresAt > Date.now()) dates.push(q.observedAt);
      }
  const oldest =
    dates.slice().sort((a, b) => Date.parse(a) - Date.parse(b))[0] || null;
  const depositHeld =
    a.retain || r?.service || r?.binding === "BoP"
      ? 0
      : a.deposit === null
        ? null
        : a.deposit * units;
  const vendorValue =
    item.vendorSell === undefined ? null : item.vendorSell * units;
  return {
    action: a,
    name: r?.name || item.name,
    cost,
    proceeds,
    profit:
      proceeds === null || cost.cash === null ? null : proceeds - cost.cash,
    economicProfit:
      proceeds === null || cost.economic === null
        ? null
        : proceeds - cost.economic,
    maxBuy: proceeds === null ? null : proceeds / a.quantity,
    units,
    oldest,
    reasons: [...reasons, ...cost.missing],
    de,
    skill,
    quote: q?.expiresAt > Date.now() ? q : undefined,
    depositHeld,
    vendorValue,
    eligible: !reasons.some(
      (reason) =>
        !reason.startsWith("Soulbound") &&
        !(reason.startsWith("Not learned") && cost.fees !== null),
    ),
  };
}
export function batchPlan(actions: Action[], c: Character, m: MarketData) {
  let pool = poolFor(c),
    cash: number | null = 0,
    economic: number | null = 0,
    revenue: number | null = 0,
    held: number | null = 0;
  const charged = new Set<number>(),
    rows: Evaluation[] = [],
    marketUsed: Record<number, number> = {},
    skillStates = new Map<Recipe["profession"], Map<number, number>>();
  let plannedRecovery = 0;
  for (const a of actions) {
    const effective = {
      ...c,
      tools: [
        ...c.tools,
        ...Object.keys(pool)
          .map(Number)
          .filter((id) => pool[id] > 0 && ITEMS[id]?.binding === "BoP"),
      ],
    };
    const availableMarket = {
      ...m,
      quotes: Object.fromEntries(
        Object.entries(m.quotes).map(([id, q]) => [
          id,
          {
            ...q,
            quantity:
              q.quantity === null
                ? null
                : Math.max(0, q.quantity - (marketUsed[+id] || 0)),
          },
        ]),
      ),
    };
    const e = evaluate(a, effective, availableMarket, pool, charged);
    const r =
      a.kind === "craft" || a.kind === "craft-de" || a.kind === "convert"
        ? [...RECIPES, ...CONVERSIONS].find((r) => r.id === a.recipeId)
        : undefined;
    const profession = r && c.skills[r.profession];
    if (r && profession && e.eligible) {
      const before =
        skillStates.get(r.profession) || new Map([[profession.level, 1]]);
      const after = rollSkillStates(r, before, a.quantity, profession.cap);
      e.skill = meanSkill(after) - meanSkill(before);
      skillStates.set(r.profession, after);
    }
    for (const l of e.cost.lines)
      if (l.cash !== null && l.cash > 0 && l.source.startsWith("AHledger"))
        marketUsed[l.id] = (marketUsed[l.id] || 0) + l.qty;
    pool = e.cost.pool;
    cash = plus(cash, e.cost.cash);
    economic = plus(economic, e.cost.economic);
    held = plus(held, e.depositHeld);
    const deAction = a.kind === "craft-de" || a.kind === "buy-de",
      sold = deAction
        ? e.units * a.sellFraction
        : Math.floor(e.units * a.sellFraction),
      unsold = e.units - sold;
    let recovery =
      a.retain || sold === 0
        ? 0
        : e.proceeds === null
          ? null
          : (e.proceeds * sold) / e.units;
    if (!a.retain && a.fallback === "vendor" && unsold > 0)
      recovery =
        deAction || e.vendorValue === null
          ? null
          : plus(recovery, (e.vendorValue * unsold) / e.units);
    if (!a.retain && unsold > 0)
      recovery =
        recovery === null || e.depositHeld === null
          ? null
          : recovery - (e.depositHeld * unsold) / e.units;
    revenue = plus(revenue, recovery);
    if (recovery !== null) plannedRecovery += recovery;
    rows.push(e);
    if (
      a.retain &&
      ["craft", "convert", "resell"].includes(a.kind) &&
      a.itemId > 0
    )
      pool[a.itemId] = (pool[a.itemId] || 0) + e.units;
    // Random outputs remain expected inventory, never guaranteed funding/materials for later crafts.
    if (
      (a.kind === "craft-de" || a.kind === "buy-de") &&
      e.de?.guaranteed &&
      a.retain
    ) {
      const item = resolvedItem(a.itemId, m);
      for (const d of item?.de?.[0].drops || [])
        pool[d.id] = (pool[d.id] || 0) + d.min * e.units;
    }
  }
  const usedOwned: Record<number, number> = {};
  for (const e of rows)
    for (const l of e.cost.lines)
      if (l.cash === 0) usedOwned[l.id] = (usedOwned[l.id] || 0) + l.qty;
  economic = cash;
  for (const [key, used] of Object.entries(usedOwned)) {
    const id = +key,
      qty = Math.min(used, c.inventory[id]?.qty || 0);
    if (qty) {
      const price = exitFor(id, c, m);
      economic = plus(economic, price === null ? null : net(price) * qty);
    }
  }
  const upfront = plus(cash, held),
    spendable =
      c.cash === null
        ? null
        : Math.max(0, Math.min(c.cash - c.reserve, c.budget ?? c.cash));
  return {
    rows,
    cash,
    economic,
    held,
    upfront,
    revenue,
    profit: cash === null || revenue === null ? null : revenue - cash,
    spendable,
    cashLeft: c.cash === null || upfront === null ? null : c.cash - upfront,
    fits: upfront === null || spendable === null ? null : upfront <= spendable,
    ready:
      rows.every((r) => r.eligible) &&
      held !== null &&
      upfront !== null &&
      spendable !== null &&
      upfront <= spendable,
    pool,
    plannedRecovery,
  };
}
export function levelRoute(
  c: Character,
  m: MarketData,
  profession: Recipe["profession"],
  strategy: "cash" | "net" = "cash",
) {
  const s = c.skills[profession];
  if (!s) return { steps: [], stopped: "Profession not selected", end: 0 };
  const target = Math.min(s.target, s.cap);
  let skill = s.level;
  const steps: {
    recipe: Recipe;
    from: number;
    to: number;
    attempts: number;
    costPerPoint: number;
  }[] = [];
  const candidates = RECIPES.filter(
    (r) => r.profession === profession && !r.once && r.verified,
  );
  let stopped = "";
  while (skill < target) {
    const ranked = candidates
      .filter(
        (r) =>
          !access(
            r,
            {
              ...c,
              skills: { ...c.skills, [profession]: { ...s, level: skill } },
            },
            true,
          ) && skillChance(r, skill) > 0,
      )
      .map((recipe) => {
        const cost = craftCost(
            recipe,
            1,
            { ...c, inventory: {} },
            m,
            {},
            false,
          ),
          recovery = recipe.service ? 0 : exitFor(recipe.output, c, m),
          p = skillChance(recipe, skill),
          cash = cost.cash;
        const per =
          cash === null
            ? Infinity
            : (cash -
                (strategy === "net" && recovery !== null
                  ? net(recovery) * recipe.count
                  : 0)) /
              p;
        return { recipe, per, p };
      })
      .filter((x) => Number.isFinite(x.per))
      .sort((a, b) => a.per - b.per);
    if (!ranked.length) {
      stopped =
        "No learned, eligible, priced recipe reaches the next point. Check recipes, tools and quotes.";
      break;
    }
    const best = ranked[0],
      last = steps.at(-1);
    if (last?.recipe.id === best.recipe.id) {
      last.to = skill + 1;
      last.attempts += 1 / best.p;
      last.costPerPoint =
        (last.costPerPoint * (last.to - last.from - 1) + best.per) /
        (last.to - last.from);
    } else
      steps.push({
        recipe: best.recipe,
        from: skill,
        to: skill + 1,
        attempts: 1 / best.p,
        costPerPoint: best.per,
      });
    skill++;
  }
  if (s.target > s.cap)
    stopped = `Target ${s.target} is above cap ${s.cap}; rank/trainer upgrade required (fee not assumed).`;
  return { steps, stopped, end: skill };
}

export function expectedSkillGains(
  r: Recipe,
  start: number,
  crafts: number,
  cap: number,
): number {
  return (
    meanSkill(rollSkillStates(r, new Map([[start, 1]]), crafts, cap)) - start
  );
}
const meanSkill = (states: Map<number, number>) =>
  [...states].reduce((sum, [s, p]) => sum + s * p, 0);
function rollSkillStates(
  r: Recipe,
  initial: Map<number, number>,
  crafts: number,
  cap: number,
) {
  let states = initial;
  for (let n = 0; n < Math.min(1000, crafts); n++) {
    const next = new Map<number, number>();
    for (const [s, chance] of states) {
      const p = s >= cap ? 0 : skillChance(r, s);
      next.set(s, (next.get(s) || 0) + chance * (1 - p));
      if (p) next.set(s + 1, (next.get(s + 1) || 0) + chance * p);
    }
    states = next;
  }
  return states;
}

export function patternPayback(e: Evaluation): number | null {
  const fee = e.cost.fees;
  if (fee === null || fee <= 0 || e.proceeds === null || e.cost.cash === null)
    return null;
  const contribution = (e.proceeds - e.cost.cash + fee) / e.action.quantity;
  return contribution > 0 ? Math.ceil(fee / contribution) : null;
}
