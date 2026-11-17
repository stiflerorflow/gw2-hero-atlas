import { expect, it } from "vitest";
import { matchesReference, referenceTables } from "./disenchantTables";
it("uses item level and rejects disputed or unsupported tables", () => {
  const bracers = referenceTables("UNCOMMON", 43)[0];
  expect(
    bracers.map((o) => [
      o.probability,
      o.drops[0].id,
      o.drops[0].min,
      o.drops[0].max,
    ]),
  ).toEqual([
    [0.75, 11137, 2, 5],
    [0.2, 11174, 1, 2],
    [0.05, 11177, 1, 1],
  ]);
  expect(matchesReference("UNCOMMON", 43, [...bracers].reverse())).toBe(true);
  expect(matchesReference("UNCOMMON", 40, bracers)).toBe(false);
  for (const level of [21, 25, 61, 65, 70, null, NaN, 26.5])
    expect(referenceTables("UNCOMMON", level)).toEqual([]);
  expect(referenceTables("EPIC", 43)).toEqual([]);
});
it("checks full quantities and probabilities, not just material identities", () => {
  const t = referenceTables("UNCOMMON", 51)[1];
  expect(t.map((o) => o.probability)).toEqual([0.22, 0.75, 0.03]);
  const altered = structuredClone(t);
  altered[0].drops[0].max = 6;
  expect(matchesReference("UNCOMMON", 51, altered)).toBe(false);
  expect(matchesReference("UNCOMMON", 51, t.slice(0, 2))).toBe(false);
  expect(referenceTables("RARE", 43)[0]).toMatchObject([
    { probability: 1, drops: [{ id: 11177, min: 1, max: 1 }] },
  ]);
});
