import { it, expect } from "vitest";
import { defaults, addCharacter, validateState, transfer } from "./profile";
it("restores valid rows around malformed backup entries and makes row IDs unique", () => {
  const state: any = defaults(),
    c = state.characters[0];
  const action = {
    id: "duplicate",
    kind: "buy-de",
    itemId: 4253,
    quantity: 1,
    exit: null,
    deposit: 0,
    sellFraction: 0,
    fallback: "keep",
  };
  c.batch = [null, action, { ...action }, { ...action, id: "" }];
  const sale = {
    id: "duplicate",
    itemId: 4253,
    qty: 1,
    gross: 1200,
    lostDeposit: 0,
    cost: 500,
    when: "2026-11-14T12:00:00Z",
    unexpectedSecret: "should not survive",
  };
  c.sales = [null, sale, { ...sale }];
  c.watch = [null, { id: 4306 }, { id: 4306 }];
  const saved = validateState(state).characters[0];
  expect(saved.batch).toHaveLength(3);
  expect(new Set(saved.batch.map((a) => a.id)).size).toBe(3);
  expect(saved.sales).toHaveLength(2);
  expect(new Set(saved.sales.map((s) => s.id)).size).toBe(2);
  expect(JSON.stringify(saved.sales)).not.toContain("unexpectedSecret");
  expect(saved.watch).toHaveLength(1);
});
it("rejects out-of-range inventory keys and transfers that would be lost on reload", () => {
  const state: any = defaults();
  const c = state.characters[0];
  c.inventory[0] = { qty: 8, note: "" };
  c.inventory["999999999999999999999999"] = { qty: 8, note: "" };
  expect(validateState(state).characters[0].inventory[0]).toBeUndefined();
  expect(
    Object.keys(validateState(state).characters[0].inventory),
  ).not.toContain("999999999999999999999999");
  c.inventory[2592] = { qty: 2, note: "Recorded transfer test stock" };
  const second = addCharacter(state, "Other character");
  second.characters[1].inventory[2592] = { qty: 1_000_000, note: "" };
  expect(() => transfer(second, c.id, second.active, 2592, 1)).toThrow("limit");
  expect(c.inventory[2592].qty).toBe(2);
  expect(() => transfer(second, c.id, second.active, 0, 1)).toThrow(
    "valid item",
  );
});

it("preserves chosen profession slot order through backups and ignores unknown professions", () => {
  const state: any = defaults();
  state.characters[0].skills = {
    Alchemy: { level: 130, cap: 150, target: 150 },
    Enchanting: { level: 100, cap: 150, target: 150 },
    FakeProfession: { level: 300, cap: 300, target: 300 },
  };
  const restored = validateState(JSON.parse(JSON.stringify(state)));
  expect(Object.keys(restored.characters[0].skills)).toEqual([
    "Alchemy",
    "Enchanting",
  ]);
  expect(Object.keys(validateState(defaults()).characters[0].skills)).toEqual(
    [],
  );
});

it("adds a blank character without inheriting the active character's context", () => {
  const original = defaults(),
    first = original.characters[0];
  first.name = "Recorded character";
  first.cash = 12345;
  first.skills = { Alchemy: { level: 130, cap: 150, target: 150 } };
  first.inventory[785] = { qty: 7, note: "Recorded stock" };
  first.known = [3173];
  const next = addCharacter(original, " Another character ");
  expect(original.characters).toHaveLength(1);
  expect(next.characters[0]).toEqual(first);
  const fresh = next.characters[1];
  expect(next.active).toBe(fresh.id);
  expect(fresh.id).not.toBe(first.id);
  expect(fresh.name).toBe("Another character");
  expect(fresh.skills).toEqual({});
  expect(fresh.characterLevel).toBeNull();
  expect(fresh.cash).toBeNull();
  expect(fresh.className).toBe("");
  expect(fresh.inventory).toEqual({});
  expect(fresh.known).toEqual([]);
  expect(fresh.watch).toEqual([]);
  expect(validateState(next)).toEqual(next);
  let full = next;
  while (full.characters.length < 20) full = addCharacter(full, "Character");
  expect(() => addCharacter(full, "One too many")).toThrow("20");
});
