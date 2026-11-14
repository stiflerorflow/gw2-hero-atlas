import type { Item, Outcome } from "../types";
import { VENDOR_CORRECTIONS } from "./vendorCorrections";
// Item levels 26–30 correspond to required equipment levels 21–25.
const greenSource =
  "https://www.wow-professions.com/forever/disenchanting-guide";
export const ARMOR_26_30: Outcome[] = [
  {
    probability: 0.75,
    drops: [{ id: 11083, min: 1, max: 2 }],
    source: greenSource,
  },
  {
    probability: 0.2,
    drops: [{ id: 11082, min: 1, max: 2 }],
    source: greenSource,
  },
  {
    probability: 0.05,
    drops: [{ id: 11084, min: 1, max: 1 }],
    source: greenSource,
  },
];
export const ITEMS: Record<number, Item> = Object.fromEntries(
  (
    [
      [2589, "Linen Cloth"],
      [2592, "Wool Cloth"],
      [4306, "Silk Cloth"],
      [2996, "Bolt of Linen Cloth"],
      [2997, "Bolt of Woolen Cloth"],
      [4305, "Bolt of Silk Cloth"],
      [2318, "Light Leather"],
      [4234, "Heavy Leather"],
      [3383, "Elixir of Wisdom"],
      [929, "Healing Potion"],
      [10940, "Strange Dust"],
      [10938, "Lesser Magic Essence"],
      [10939, "Greater Magic Essence"],
      [10998, "Lesser Astral Essence"],
      [11082, "Greater Astral Essence"],
      [11083, "Soul Dust"],
      [11084, "Large Glimmering Shard"],
      [10978, "Small Glimmering Shard"],
      [1210, "Shadowgem"],
      [6338, "Silver Rod"],
      [6339, "Runed Silver Rod"],
      [6218, "Runed Copper Rod"],
      [5956, "Blacksmith Hammer"],
      [6219, "Arclight Spanner"],
      [5763, "Red Woolen Bag"],
      [4313, "Red Woolen Boots"],
      [4333, "Dark Silk Shirt"],
      [7049, "Truefaith Gloves"],
      [5764, "Green Silk Pack"],
      [7048, "Azure Silk Hood"],
      [4318, "Gloves of Meditation"],
      [4314, "Double-Stitched Woolen Shoulders"],
      [11287, "Lesser Magic Wand"],
      [11288, "Greater Magic Wand"],
      [4253, "Toughened Leather Gloves"],
      [4340, "Gray Dye"],
      [2604, "Red Dye"],
      [2605, "Green Dye"],
      [6260, "Blue Dye"],
      [2321, "Fine Thread"],
      [2320, "Coarse Thread"],
      [4470, "Simple Wood"],
      [17034, "Maple Seed"],
      [3372, "Leaded Vial"],
      [20745, "Minor Mana Oil"],
      [5773, "Pattern: Robes of Arcana"],
      [5774, "Pattern: Green Silk Pack"],
      [7091, "Pattern: Truefaith Gloves"],
      [4347, "Pattern: Reinforced Woolen Shoulders"],
      [4345, "Pattern: Red Woolen Boots"],
      [4350, "Pattern: Spider Silk Slippers"],
      [4346, "Pattern: Heavy Woolen Cloak"],
      [4348, "Pattern: Phoenix Gloves"],
      [4349, "Pattern: Phoenix Pants"],
      [4344, "Brown Linen Shirt"],
    ] as [number, string][]
  ).map(([id, name]) => [id, { id, name }]),
);
Object.assign(ITEMS[2321], { vendor: 100 });
Object.assign(ITEMS[2320], { vendor: 10 });
Object.assign(ITEMS[4340], { vendor: 350 });
Object.assign(ITEMS[2604], { vendor: 50 });
Object.assign(ITEMS[2605], { vendor: 100 });
Object.assign(ITEMS[6260], { vendor: 50 });
Object.assign(ITEMS[4470], { vendor: 38 });
Object.assign(ITEMS[17034], { vendor: 7 });
Object.assign(ITEMS[3372], { vendor: 40, vendorLot: 5, vendorSell: 10 });
Object.assign(ITEMS[7048], {
  de: ARMOR_26_30,
  vendorSell: 745,
  binding: "BoE",
});
Object.assign(ITEMS[4318], {
  de: ARMOR_26_30,
  vendorSell: 610,
  binding: "BoE",
});
Object.assign(ITEMS[7049], {
  de: ARMOR_26_30,
  vendorSell: 914,
  binding: "BoE",
});
Object.assign(ITEMS[4253], {
  de: [
    {
      probability: 1,
      drops: [{ id: 11084, min: 1, max: 1 }],
      source: "https://foreverdb.net/item/4253",
    },
  ],
  binding: "BoE",
});
for (const id of [11287, 11288, 6339, 4333, 5763, 5764]) ITEMS[id].noDE = true;
ITEMS[6339].binding = "BoP";
ITEMS[6218].binding = "BoP";
ITEMS[6218].noDE = true;
ITEMS[4333].vendorSell = 1200;
ITEMS[5764].vendorSell = 3000;
export const itemName = (id: number) => ITEMS[id]?.name || `Item #${id}`;

// Item 10059: Wowhead Forever item level 50 / required level 45, checked
// against WoW-Professions' required-level 41–45 baseline DE table (2026-11-14).
for (const [id, name] of [
  [11176, "Dream Dust"],
  [11175, "Greater Nether Essence"],
  [11178, "Large Radiant Shard"],
] as [number, string][])
  ITEMS[id] = { id, name };
ITEMS[10059] = {
  id: 10059,
  name: "Duskwoven Bracers",
  binding: "BoE",
  de: [
    {
      probability: 0.75,
      drops: [{ id: 11176, min: 1, max: 2 }],
      source: greenSource,
    },
    {
      probability: 0.2,
      drops: [{ id: 11175, min: 1, max: 2 }],
      source: greenSource,
    },
    {
      probability: 0.05,
      drops: [{ id: 11178, min: 1, max: 1 }],
      source: greenSource,
    },
  ],
};

for (const [id, fix] of Object.entries(VENDOR_CORRECTIONS))
  if (ITEMS[+id]) ITEMS[+id].vendorSell = fix.value;

// Checked profession supplies and outputs. Unknown vendor values stay unknown.
for (const [id, name] of [
  [785, "Mageroyal"],
  [2450, "Briarthorn"],
  [3371, "Empty Vial"],
  [2838, "Heavy Stone"],
  [4377, "Heavy Blasting Powder"],
  [2841, "Bronze Bar"],
  [4375, "Whirring Bronze Gizmo"],
  [4382, "Bronze Framework"],
  [2319, "Medium Leather"],
  [3820, "Stranglekelp"],
  [6359, "Firefin Snapper"],
  [3355, "Wild Steelbloom"],
  [3356, "Kingsblood"],
  [3385, "Lesser Mana Potion"],
  [6371, "Fire Oil"],
  [3389, "Elixir of Lesser Defense"],
  [6373, "Elixir of Fire Power"],
  [3827, "Mana Potion"],
  [2880, "Weak Flux"],
  [4371, "Bronze Tube"],
  [3575, "Iron Bar"],
  [10558, "Gold Power Core"],
  [4387, "Iron Strut"],
  [4389, "Gyrochronatom"],
  [7912, "Solid Stone"],
  [10505, "Solid Blasting Powder"],
] as [number, string][])
  ITEMS[id] = { ...ITEMS[id], id, name };
Object.assign(ITEMS[3371], { vendor: 4, vendorLot: 5, vendorSell: 1 });
Object.assign(ITEMS[2880], { vendor: 100, vendorSell: 25 });
for (const [id, value] of [
  [4377, 150],
  [4375, 115],
  [4382, 600],
] as [number, number][])
  ITEMS[id].vendorSell = value;
// Remove obsolete pattern placeholders, never infer recipe acquisition items.
for (const id of [5773, 4347, 4345, 4350, 4346, 4348, 4349]) delete ITEMS[id];
