import { createCharacter, STORE } from "../../src/state/profile";
import type { Page } from "@playwright/test";
/** Explicit synthetic context for historical calculation/UI regression cases, never product defaults. */
export function scenarioProfiles() {
  const c = createCharacter("glimpo", "Glimpo");
  c.skills = {
    Tailoring: { level: 120, cap: 150, target: 150 },
    Enchanting: { level: 100, cap: 150, target: 150 },
  };
  const alchemist = createCharacter("chumbles", "Chumbles");
  alchemist.skills = {
    Herbalism: { level: 110, cap: 150, target: 150 },
    Alchemy: { level: 130, cap: 150, target: 150 },
  };
  const engineer = createCharacter("grimpo-grongo", "Grimpo Grongo");
  engineer.skills = {
    Engineering: { level: 130, cap: 150, target: 150 },
    Mining: { level: 110, cap: 150, target: 150 },
  };
  engineer.className = "Warrior";
  const state: import("../../src/types").SavedState = {
    version: 1,
    active: c.id,
    characters: [c, alchemist, engineer],
  };
  c.cash = c.budget = 25000;
  c.known = [2963, 2964, 3839, 6688, 3852, 3848, 14293, 14807];
  c.inventory = {
    2592: { qty: 0, note: "Synthetic cloth stock" },
    3383: { qty: 0, note: "Synthetic potion stock" },
  };
  for (const character of state.characters)
    character.watch = [4306, 2592, 11083, 11084].map((id) => ({
      id,
      buyBelow: null,
      sellAbove: null,
    }));
  return state;
}
export async function installScenario(page: Page) {
  await page.addInitScript(
    ({ state, key }) => {
      if (!localStorage.getItem(key))
        localStorage.setItem(key, JSON.stringify(state));
    },
    { state: scenarioProfiles(), key: STORE },
  );
}
