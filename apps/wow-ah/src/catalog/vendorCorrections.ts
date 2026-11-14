// Static game facts, not cached market prices. Checked against Blizzard's
// October 8 Forever notes and current Forever item pages on 2026-11-14.
export type VendorReference = {
  value: number;
  source: string;
  checkedAt: string;
};
const source =
  "https://us.forums.blizzard.com/en/wow/t/wow-forever-beta-development-notes-%E2%80%93-updated-november-2/2360696/5";
export const VENDOR_CORRECTIONS: Record<number, VendorReference> =
  Object.fromEntries(
    [
      [11287, 110],
      [11288, 200],
      [11289, 450],
      [11290, 600],
      [20744, 100],
    ].map(([id, value]) => [id, { value, source, checkedAt: "2026-11-14" }]),
  );
