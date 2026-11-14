import type { Item, Outcome } from "../types";
const greenSource =
  "https://bootybaybroker.com/forever/crafting/disenchant?faction=alliance&realm=camwow-eu4-realm-10-rp&region=eu";
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
Object.assign(ITEMS[3372], { vendor: 200 });
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
ITEMS[4333].vendorSell = 1200;
ITEMS[5764].vendorSell = 3000;
export const itemName = (id: number) => ITEMS[id]?.name || `Item #${id}`;
