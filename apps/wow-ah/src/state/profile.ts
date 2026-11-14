import type { Character, SavedState, Profession, Action } from "../types";
import { MARKET, PROFESSIONS } from "../types";
import { isCopper } from "../engine/money";
import { ITEMS } from "../catalog/items";
export const STORE = "copper-ledger.profile.v1";
const char = (
  id: string,
  name: string,
  skills: [Profession, number][],
  cash: number | null,
  className = "",
): Character => ({
  id,
  name,
  className,
  cash,
  budget: cash,
  reserve: 0,
  skills: Object.fromEntries(
    skills.map(([p, level]) => [p, { level, cap: 150, target: 150 }]),
  ),
  known: [],
  inventory: {},
  manual: {},
  vendor: {},
  unlockCosts: {},
  tools: [],
  watch: [
    { id: 4306, buyBelow: null, sellAbove: null },
    { id: 2592, buyBelow: null, sellAbove: null },
    { id: 11083, buyBelow: null, sellAbove: null },
    { id: 11084, buyBelow: null, sellAbove: null },
  ],
  batch: [],
  duration: 24,
  sales: [],
});
export function defaults(): SavedState {
  const g = char(
    "glimpo",
    "Glimpo",
    [
      ["Tailoring", 120],
      ["Enchanting", 100],
    ],
    25000,
  );
  g.known = [2963, 2964, 3839, 6688, 3852, 3848, 14293, 14807];
  g.inventory = {
    2592: { qty: 0, note: "Matt’s donated cloth · enter actual quantity" },
    3383: {
      qty: 0,
      note: "Personally free Elixirs of Wisdom · enter available quantity",
    },
  };
  return {
    version: 1,
    active: g.id,
    characters: [
      g,
      char(
        "chumbles",
        "Chumbles",
        [
          ["Herbalism", 110],
          ["Alchemy", 130],
        ],
        null,
      ),
      char(
        "grimpo-grongo",
        "Grimpo Grongo",
        [
          ["Engineering", 130],
          ["Mining", 110],
        ],
        null,
        "Warrior",
      ),
    ],
  };
}
const integer = (x: unknown, min = 0, max = 300) =>
  typeof x === "number" && Number.isInteger(x) && x >= min && x <= max;
export function validateState(x: unknown): SavedState {
  if (!x || typeof x !== "object" || (x as SavedState).version !== 1)
    throw Error("Unsupported Copper Ledger backup.");
  const input = x as SavedState;
  if (
    !Array.isArray(input.characters) ||
    !input.characters.length ||
    input.characters.length > 20
  )
    throw Error("Expected 1–20 character profiles.");
  const result: Character[] = [];
  for (const old of input.characters) {
    if (
      !old ||
      typeof old !== "object" ||
      typeof old.id !== "string" ||
      !/^[a-z0-9-]{1,60}$/.test(old.id) ||
      result.some((c) => c.id === old.id)
    )
      throw Error("Invalid or duplicate character.");
    const c = char(
      old.id,
      typeof old.name === "string" ? old.name.slice(0, 60) : "Character",
      [],
      isCopper(old.cash) ? old.cash : null,
      typeof old.className === "string" ? old.className.slice(0, 30) : "",
    );
    c.budget = isCopper(old.budget) ? old.budget : null;
    c.reserve = isCopper(old.reserve) ? old.reserve : 0;
    c.known = [
      ...new Set(
        (Array.isArray(old.known) ? old.known : []).filter((v) =>
          integer(v, 1, 2_000_000),
        ),
      ),
    ].slice(0, 1000);
    c.tools = (Array.isArray(old.tools) ? old.tools : [])
      .filter((v) => integer(v, 1, 2_000_000))
      .slice(0, 100);
    for (const p of PROFESSIONS) {
      const s = old.skills?.[p];
      if (s && integer(s.level) && integer(s.cap, 1) && integer(s.target))
        c.skills[p] = {
          level: Math.min(s.level, s.cap),
          cap: s.cap,
          target: s.target,
        };
    }
    for (const [id, v] of Object.entries(old.inventory || {}))
      if (/^\d+$/.test(id) && integer(v?.qty, 0, 1_000_000))
        c.inventory[+id] = {
          qty: v.qty,
          note: typeof v.note === "string" ? v.note.slice(0, 200) : "",
        };
    for (const [id, v] of Object.entries(old.manual || {}))
      if (
        /^\d+$/.test(id) &&
        v?.market === MARKET &&
        typeof v.observedAt === "string" &&
        Number.isFinite(Date.parse(v.observedAt)) &&
        (v.ask === null || (isCopper(v.ask) && v.ask > 0)) &&
        (v.exit === null || isCopper(v.exit))
      )
        c.manual[+id] = {
          market: MARKET,
          ask: v.ask,
          exit: v.exit,
          observedAt: v.observedAt,
          note: typeof v.note === "string" ? v.note.slice(0, 200) : "",
        };
    for (const k of ["vendor", "unlockCosts"] as const)
      for (const [id, v] of Object.entries(old[k] || {}))
        if (/^\d+$/.test(id) && isCopper(v)) c[k][+id] = v;
    c.watch = (Array.isArray(old.watch) ? old.watch : [])
      .filter((v) => integer(v?.id, 1, 2_000_000))
      .slice(0, 100)
      .map((v) => ({
        id: v.id,
        buyBelow: isCopper(v.buyBelow) ? v.buyBelow : null,
        sellAbove: isCopper(v.sellAbove) ? v.sellAbove : null,
      }));
    c.batch = (Array.isArray(old.batch) ? old.batch : [])
      .slice(0, 50)
      .filter(
        (a) =>
          ["craft", "craft-de", "buy-de", "convert", "resell"].includes(
            a.kind,
          ) &&
          integer(a.itemId, -2_000_000, 2_000_000) &&
          integer(a.quantity, 1, 1000),
      )
      .map((a, i): Action => ({
        id: typeof a.id === "string" ? a.id.slice(0, 70) : "batch-" + i,
        kind: a.kind,
        itemId: a.itemId,
        recipeId: Number.isInteger(a.recipeId) ? a.recipeId : undefined,
        quantity: a.quantity,
        exit: isCopper(a.exit) ? a.exit : null,
        deposit: isCopper(a.deposit) ? a.deposit : null,
        fallback: a.fallback === "vendor" ? "vendor" : "keep",
        sellFraction:
          typeof a.sellFraction === "number" && Number.isFinite(a.sellFraction)
            ? Math.max(0, Math.min(1, a.sellFraction))
            : 0,
        retain: a.retain === true,
      }));
    c.duration = [12, 24, 48].includes(old.duration) ? old.duration : 24;
    c.sales = (Array.isArray(old.sales) ? old.sales : [])
      .slice(0, 1000)
      .filter(
        (s) =>
          integer(s.itemId, 1, 2_000_000) &&
          integer(s.qty, 1, 1_000_000) &&
          isCopper(s.gross) &&
          isCopper(s.lostDeposit) &&
          typeof s.when === "string" &&
          Number.isFinite(Date.parse(s.when)),
      )
      .map((s) => ({
        ...s,
        id: String(s.id).slice(0, 70),
        cost: isCopper(s.cost) ? s.cost : null,
      }));
    result.push(c);
  }
  return {
    version: 1,
    active: result.some((c) => c.id === input.active)
      ? input.active
      : result[0].id,
    characters: result,
  };
}
export function transfer(
  s: SavedState,
  from: string,
  to: string,
  itemId: number,
  quantity: number,
): SavedState {
  if (ITEMS[itemId]?.binding === "BoP")
    throw Error("Soulbound items cannot be transferred.");
  if (from === to || !integer(quantity, 1, 1_000_000))
    throw Error(
      "Choose two different characters and a positive whole quantity.",
    );
  const next = structuredClone(s),
    a = next.characters.find((c) => c.id === from),
    b = next.characters.find((c) => c.id === to);
  if (!a || !b || (a.inventory[itemId]?.qty || 0) < quantity)
    throw Error("The sending character does not have that quantity recorded.");
  a.inventory[itemId].qty -= quantity;
  b.inventory[itemId] = {
    qty: (b.inventory[itemId]?.qty || 0) + quantity,
    note: `Transferred from ${a.name}`,
  };
  return next;
}
