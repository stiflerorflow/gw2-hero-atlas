import type { Outcome } from "../types";
// Reference models, not proof that an individual item has no exception.
// Item level, never required character level. Disputed bands remain provider-only.
export const DE_REFERENCE =
  "https://www.wow-professions.com/forever/disenchanting-guide";
export const DE_CLASSIC_REFERENCE =
  "https://legacyofwarcraft.com/db/classic/professions/disenchanting.html";
type Band = [number, number, number, number, number, number, number];
// min ilvl, max ilvl, dust id, dust min, dust max, essence id, shard id
const bands: Band[] = [
  [5, 15, 10940, 1, 2, 10938, 0],
  [16, 20, 10940, 2, 3, 10939, 10978],
  // 21–25 has conflicting 5%/10% shard guidance; do not certify a baseline.
  [26, 30, 11083, 1, 2, 11082, 11084],
  [31, 35, 11083, 2, 5, 11134, 11138],
  [36, 40, 11137, 1, 2, 11135, 11139],
  [41, 45, 11137, 2, 5, 11174, 11177],
  [46, 50, 11176, 1, 2, 11175, 11178],
  [51, 55, 11176, 2, 5, 16202, 14343],
  [56, 60, 16204, 1, 2, 16203, 14344],
  // 61+ essence count guidance disagrees; retain the provider table with a warning.
];
const outcome = (
  id: number,
  min: number,
  max: number,
  probability: number,
): Outcome => ({
  probability,
  drops: [{ id, min, max }],
  source: DE_REFERENCE,
});
export function referenceTables(
  quality: string,
  level: number | null,
): Outcome[][] {
  if (level === null || !Number.isInteger(level)) return [];
  const band = bands.find((b) => level >= b[0] && level <= b[1]);
  if (!band) return [];
  const [, , dust, min, max, essence, shard] = band;
  if (quality.toUpperCase() === "RARE" && level >= 26 && level <= 55)
    return [[outcome(shard, 1, 1, 1)]];
  if (quality.toUpperCase() !== "UNCOMMON") return [];
  const model = (weapon: boolean) => {
    const early = level <= 15,
      lateWeapon = weapon && level >= 51;
    return [
      outcome(
        dust,
        min,
        max,
        weapon ? (early ? 0.2 : lateWeapon ? 0.22 : 0.2) : early ? 0.8 : 0.75,
      ),
      outcome(essence, 1, 2, weapon ? (early ? 0.8 : 0.75) : 0.2),
      ...(shard ? [outcome(shard, 1, 1, lateWeapon ? 0.03 : 0.05)] : []),
    ];
  };
  return [model(false), ...(level >= 10 ? [model(true)] : [])];
}
const signature = (table: Outcome[]) =>
  JSON.stringify(
    table
      .map((o) => ({
        p: Math.round(o.probability * 1e8),
        d: o.drops.map((d) => [d.id, d.min, d.max]).sort((a, b) => a[0] - b[0]),
      }))
      .sort((a, b) => JSON.stringify(a.d).localeCompare(JSON.stringify(b.d))),
  );
export function matchesReference(
  quality: string,
  level: number | null,
  table: Outcome[] | null,
): boolean {
  return (
    table !== null &&
    referenceTables(quality, level).some(
      (t) => signature(t) === signature(table),
    )
  );
}
