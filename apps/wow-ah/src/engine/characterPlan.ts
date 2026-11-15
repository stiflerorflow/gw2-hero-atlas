import type { Action, Character, MarketData, Profession } from "../types";
import { RECIPES, CONVERSIONS } from "../catalog/recipes";
import { ITEMS } from "../catalog/items";
import { evaluate } from "./planner";
import type { Evaluation } from "./planner";
export const CRAFTING: Profession[] = [
  "Tailoring",
  "Enchanting",
  "Alchemy",
  "Engineering",
];
export function rankCapForLevel(level: number) {
  return level < 10 ? 75 : level < 20 ? 150 : level < 35 ? 225 : 300;
}
// Context comes from recorded inventory, never a list of favored recipe ingredients.
export function keySupplies(c: Character) {
  return Object.keys(c.inventory)
    .map(Number)
    .sort((a, b) => a - b)
    .slice(0, 6);
}
export type Suggestion = {
  evaluation: Evaluation;
  goals: string[];
  reason: string;
};
export type PlanPreferences = {
  progress: "cash" | "net";
  gold: "yield" | "margin";
  includeScenarios?: boolean;
};
export const DEFAULT_PRIORITIES: PlanPreferences = {
  progress: "cash",
  gold: "yield",
  includeScenarios: false,
};
// Yield risk is separate from sale risk: fixed outputs still need buyers.
export function hasYieldDownside(e: Evaluation) {
  return (
    !!e.de &&
    !e.de.guaranteed &&
    (e.de.worst === null ||
      e.cost.economic === null ||
      e.de.worst * e.units < e.cost.economic)
  );
}
export function characterPlan(
  c: Character,
  m: MarketData,
  priorities = DEFAULT_PRIORITIES,
) {
  const spendable =
    c.cash === null
      ? null
      : Math.max(0, Math.min(c.cash - c.reserve, c.budget ?? c.cash));
  const blockers: string[] = [];
  if (c.characterLevel == null)
    blockers.push(
      "Enter character level to check profession rank requirements.",
    );
  if (c.cash === null)
    blockers.push("Enter current gold to check what you can fund.");
  if (c.characterLevel != null)
    for (const [p, s] of Object.entries(c.skills))
      if (
        CRAFTING.includes(p as Profession) &&
        s.level > rankCapForLevel(c.characterLevel)
      )
        blockers.push(
          `${p} ${s.level} exceeds the crafting rank range for level ${c.characterLevel}. Check character level and profession skill.`,
        );
  const actions: Action[] = [];
  for (const r of [...RECIPES, ...CONVERSIONS]) {
    if (!c.skills[r.profession] && r.acquisition !== "conversion") continue;
    const kind =
      r.acquisition === "conversion" || r.name.startsWith("Bolt of ")
        ? "convert"
        : "craft";
    const a: Action = {
      id: "plan-" + kind + "-" + r.id,
      kind,
      itemId: r.output,
      recipeId: r.id,
      quantity: 1,
      exit: r.service ? 0 : null,
      deposit: r.service || r.binding === "BoP" ? 0 : null,
      sellFraction: 0,
      fallback: "keep",
      retain: r.service || r.binding === "BoP",
    };
    actions.push(a);
    if (c.skills.Enchanting && ITEMS[r.output]?.de && !ITEMS[r.output].noDE)
      actions.push({
        ...a,
        id: "plan-de-" + r.id,
        kind: "craft-de",
        deposit: null,
        retain: false,
      });
  }
  if (c.skills.Enchanting)
    for (const item of [
      ...Object.values(ITEMS).filter((i) => i.de),
      ...m.deItems,
    ])
      if (
        !item.noDE &&
        !actions.some((a) => a.kind === "buy-de" && a.itemId === item.id)
      )
        actions.push({
          id: "plan-buy-de-" + item.id,
          kind: "buy-de",
          itemId: item.id,
          quantity: 1,
          exit: null,
          deposit: null,
          sellFraction: 0,
          fallback: "keep",
        });
  const all = actions.map((a) => evaluate(a, c, m)),
    available = all.filter(
      (e) =>
        e.eligible &&
        e.cost.cash !== null &&
        spendable !== null &&
        e.cost.cash <= spendable,
    );
  const choices: Suggestion[] = [],
    notes: string[] = [];
  if (!blockers.length)
    for (const [p, s] of Object.entries(c.skills)) {
      if (!CRAFTING.includes(p as Profession)) {
        notes.push(`${p}: gathering routes are not part of this planner yet.`);
        continue;
      }
      if (s.level >= Math.min(s.cap, s.target)) {
        const next =
          s.cap === 75
            ? { level: 10, skill: 50, name: "Journeyman" }
            : s.cap === 150
              ? { level: 20, skill: 125, name: "Expert" }
              : s.cap === 225
                ? { level: 35, skill: 200, name: "Artisan" }
                : null;
        if (s.level >= s.cap && s.target > s.cap && next)
          notes.push(
            c.characterLevel! < next.level
              ? `${p}: reach character level ${next.level} before ${next.name} training.`
              : `${p}: confirm ${next.name} training in game (skill ${next.skill}+), then update the trained cap. Training fees are not assumed.`,
          );
        else
          notes.push(
            `${p}: your saved target or trained cap is reached. Update it in profile settings when ready.`,
          );
        continue;
      }
      const ranked = available
        .filter((e) => {
          const r = RECIPES.find((r) => r.id === e.action.recipeId);
          return (
            r?.profession === p &&
            !r.once &&
            e.skill > 0 &&
            (priorities.progress === "cash" || e.proceeds !== null)
          );
        })
        .sort((a, b) => {
          const perPoint = (e: Evaluation) =>
            (e.cost.cash! -
              (priorities.progress === "net" ? (e.proceeds ?? 0) : 0)) /
            e.skill;
          return perPoint(a) - perPoint(b) || a.cost.cash! - b.cost.cash!;
        });
      const e = ranked[0];
      if (e)
        choices.push({
          evaluation: e,
          goals: [`${p} progress`],
          reason:
            priorities.progress === "cash"
              ? "Lowest cash cost per expected skill point among the checked, affordable one-craft options."
              : "Lowest modeled net cost per expected skill point after quoted resale. All inputs still need funding upfront; sale and deposits are uncertain.",
        });
      else
        notes.push(
          `${p}: no priced, eligible step fits the inputs budget. Check learned recipes, tools and material prices in the options below.`,
        );
    }
  if (!blockers.length && priorities.includeScenarios) {
    const earn = available
      .filter(
        (e) =>
          e.profit !== null &&
          e.profit > 0 &&
          e.economicProfit !== null &&
          e.economicProfit > 0 &&
          !RECIPES.find((r) => r.id === e.action.recipeId)?.once,
      )
      .sort(
        (a, b) =>
          (priorities.gold === "yield"
            ? Number(hasYieldDownside(a)) - Number(hasYieldDownside(b))
            : 0) ||
          (b.economicProfit ?? 0) - (a.economicProfit ?? 0) ||
          a.cost.cash! - b.cost.cash!,
      );
    const best = earn[0];
    if (best) {
      const same = choices.find(
        (x) => x.evaluation.action.id === best.action.id,
      );
      if (same) same.goals.push("Gold scenario");
      else
        choices.push({
          evaluation: best,
          goals: ["Gold scenario"],
          reason:
            priorities.gold === "yield"
              ? hasYieldDownside(best)
                ? "Only variable-yield opportunities have a positive modeled margin. This is a higher-risk alternative; wait if you cannot absorb a bad drop."
                : "Prioritizes output without a modeled yield loss, then expected profit. Sale prices and selling time remain uncertain."
              : "Highest expected margin among checked affordable options. A higher average may depend on rare drops; it does not imply safer or faster gold.",
        });
    } else
      notes.push(
        "No positive gold scenario was found within this limited recipe set and the entered assumptions.",
      );
  }
  if (!priorities.includeScenarios)
    notes.push(
      "Crafting profit scenarios are off. This recipe subset cannot establish the best money-making activity; use Market scan to investigate current listings.",
    );
  const coverage = Object.entries(c.skills)
    .filter(([p]) => CRAFTING.includes(p as Profession))
    .map(([profession, skill]) => {
      const recipes = RECIPES.filter(
        (r) => r.verified && r.profession === profession && !r.once,
      );
      const current = recipes.filter(
        (r) => r.min <= skill.level && r.grey > skill.level,
      );
      return {
        profession,
        total: recipes.length,
        current: current.length,
        learned: current.filter((r) => c.known.includes(r.id)).length,
        through: Math.max(0, ...recipes.map((r) => r.grey - 1)),
      };
    });
  return { spendable, blockers, choices, notes, coverage, checked: all.length };
}
