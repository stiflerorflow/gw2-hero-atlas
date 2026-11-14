import type { Recipe } from "../types";
import { ITEMS } from "./items";
const ref = (profession: string, id: number, slug: string) =>
  `https://www.foreverdb.app/en/forever/spells/${id}/${slug}`;
function r(
  id: number,
  name: string,
  profession: Recipe["profession"],
  output: number,
  skills: number[],
  reagents: [number, number][],
  extra: Partial<Recipe> = {},
): Recipe {
  return {
    id,
    name,
    profession,
    output,
    count: 1,
    reagents: reagents.map(([id, qty]) => ({ id, qty })),
    min: skills[0],
    yellow: skills[1],
    green: skills[2],
    grey: skills[3],
    acquisition: "trainer",
    unlock: null,
    verified: true,
    source: ref(profession, id, name.toLowerCase().replace(/[^a-z0-9]+/g, "-")),
    note: "Forever client-data reference; vendor amounts before reputation discounts. Confirm your trainer quote.",
    binding: "BoE",
    expansion: "WoW Forever",
    ...extra,
  };
}
export const RECIPES: Recipe[] = [
  r(
    2963,
    "Bolt of Linen Cloth",
    "Tailoring",
    2996,
    [1, 25, 38, 50],
    [[2589, 2]],
    { unlock: 0 },
  ),
  r(
    2964,
    "Bolt of Woolen Cloth",
    "Tailoring",
    2997,
    [55, 70, 78, 85],
    [[2592, 3]],
    { unlock: 0 },
  ),
  r(
    3839,
    "Bolt of Silk Cloth",
    "Tailoring",
    4305,
    [100, 110, 115, 120],
    [[4306, 4]],
    {
      unlock: 0,
      note: "Verified Forever boundaries: grey at 120. A profitable conversion gives zero Tailoring points at 120.",
      source:
        "https://wowforever.ninja/professions/tailoring/3839-bolt-of-silk-cloth/",
    },
  ),
  r(
    6688,
    "Red Woolen Bag",
    "Tailoring",
    5763,
    [90, 115, 133, 150],
    [
      [2997, 5],
      [2321, 1],
      [2604, 1],
    ],
    {
      unlock: 0,
      note: "November 11 hotfix: five wool bolts, not four. 10 slots. Requirements override older feed data.",
      source:
        "https://us.forums.blizzard.com/en/wow/t/wow-forever-hotfixes-november-11-2026/2403040",
    },
  ),
  r(
    3852,
    "Gloves of Meditation",
    "Tailoring",
    4318,
    [105, 125, 140, 155],
    [
      [2997, 4],
      [2321, 3],
      [3383, 1],
    ],
    {
      unlock: 750,
      source:
        "https://wowforever.ninja/professions/tailoring/3852-gloves-of-meditation/",
      note: "Same curated 26–30 armor disenchant bracket as Azure Silk Hood. Free potions require a finite inventory quantity; unused stock has a resale value.",
    },
  ),
  r(
    3848,
    "Double-Stitched Woolen Shoulders",
    "Tailoring",
    4314,
    [85, 110, 128, 145],
    [
      [2997, 3],
      [2321, 2],
    ],
    {
      unlock: 0,
      source:
        "https://wowforever.ninja/professions/tailoring/3848-double-stitched-woolen-shoulders/",
    },
  ),
  r(
    8760,
    "Azure Silk Hood",
    "Tailoring",
    7048,
    [120, 130, 135, 140],
    [
      [4305, 2],
      [6260, 2],
      [2321, 1],
    ],
    {
      unlock: 600,
      source:
        "https://wowforever.ninja/professions/tailoring/8760-azure-silk-hood/",
      note: "Corrected to Tailoring 120 (feed reports 90). Trainer fee is a reference, editable to your actual quote.",
    },
  ),
  r(
    3870,
    "Dark Silk Shirt",
    "Tailoring",
    4333,
    [120, 130, 135, 140],
    [
      [4305, 2],
      [4340, 2],
      [2321, 1],
    ],
    {
      acquisition: "vendor",
      unlock: 900,
      note: "Vendor pattern required; initial reference is 9s before discounts. Enter actual pattern price. Not disenchantable.",
    },
  ),
  r(
    3847,
    "Red Woolen Boots",
    "Tailoring",
    4313,
    [75, 80, 98, 115],
    [
      [2997, 4],
      [2318, 2],
      [2604, 2],
      [2321, 1],
    ],
    {
      acquisition: "drop",
      unlock: null,
      source:
        "https://wowforever.ninja/professions/tailoring/3847-red-woolen-boots/",
      note: "Pattern drop / AH acquisition. Enter its actual unlock price; zero skill-ups at Tailoring 120.",
    },
  ),
  r(
    8782,
    "Truefaith Gloves",
    "Tailoring",
    7049,
    [125, 145, 160, 175],
    [
      [4305, 3],
      [4234, 2],
      [929, 4],
      [2321, 1],
    ],
    {
      acquisition: "drop",
      pattern: 7091,
      unlock: null,
      source:
        "https://wowforever.ninja/professions/tailoring/8782-truefaith-gloves/",
      note: "Pattern-locked, learn at 125. Try one or two sales before assuming the whole market buys your output.",
    },
  ),
  r(
    6693,
    "Green Silk Pack",
    "Tailoring",
    5764,
    [140, 160, 175, 190],
    [
      [4305, 5],
      [4234, 3],
      [2321, 3],
      [2605, 1],
    ],
    {
      acquisition: "drop",
      pattern: 5774,
      unlock: null,
      note: "Learn from a pattern at 140, not a trainer at 120. Five silk bolts follow the November 11 bag hotfix; the November 3 client reference still shows four.",
      source: "https://worldofwarcraft.blizzard.com/en-us/news/24315281",
    },
  ),
  r(
    14293,
    "Lesser Magic Wand",
    "Enchanting",
    11287,
    [10, 75, 95, 115],
    [
      [4470, 1],
      [10938, 1],
    ],
    {
      tool: 6218,
      unlock: null,
      note: "Explicit item exception: cannot be disenchanted. No Enchanting skill gain at 115 or above.",
    },
  ),
  r(
    14807,
    "Greater Magic Wand",
    "Enchanting",
    11288,
    [70, 110, 130, 150],
    [
      [4470, 1],
      [10938, 2],
    ],
    {
      tool: 6218,
      source: "https://www.wowhead.com/forever/spell=14807/greater-magic-wand",
      unlock: 200,
      note: "Explicit item exception: cannot be disenchanted, even if a generic weapon table or feed lists yields.",
    },
  ),
  r(
    7457,
    "Enchant Bracer - Minor Stamina",
    "Enchanting",
    -7457,
    [50, 100, 120, 140],
    [[10940, 2]],
    {
      tool: 6218,
      service: true,
      binding: "none",
      unlock: 200,
      note: "Reusable enchant on your bracers, not a tradable scroll. Recovery defaults to zero; record service income only after a real sale.",
    },
  ),
  r(
    7771,
    "Enchant Cloak - Minor Protection",
    "Enchanting",
    -7771,
    [70, 110, 130, 150],
    [[10940, 2]],
    {
      tool: 6218,
      service: true,
      binding: "none",
      unlock: 200,
      note: "Repeatedly enchant a suitable cloak. Grey at 150; yellow/green attempts use the disclosed estimate.",
    },
  ),
  r(
    7795,
    "Runed Silver Rod",
    "Enchanting",
    6339,
    [100, 130, 150, 170],
    [
      [6338, 1],
      [10940, 3],
      [10938, 4],
      [1210, 1],
    ],
    {
      once: true,
      binding: "BoP",
      unlock: 1000,
      source:
        "https://wowforever.ninja/professions/enchanting/7795-runed-silver-rod/",
      note: "Tool craft, useful once; not a repeat leveling recommendation. Some guides show a later learn threshold; confirm in game.",
    },
  ),
  r(
    13501,
    "Enchant Bracer - Lesser Stamina",
    "Enchanting",
    -13501,
    [130, 155, 175, 195],
    [[11083, 1]],
    {
      tool: 6339,
      service: true,
      binding: "none",
      unlock: 1500,
      source:
        "https://wowforever.ninja/professions/enchanting/13501-enchant-bracer-lesser-stamina/",
      note: "Requires Runed Silver Rod. Forever cost is one Soul Dust. Confirm the trainer quote.",
    },
  ),
  r(
    13536,
    "Enchant Bracer - Lesser Strength",
    "Enchanting",
    -13536,
    [140, 165, 185, 205],
    [[11083, 1]],
    {
      tool: 6339,
      service: true,
      binding: "none",
      acquisition: "vendor",
      unlock: 2500,
    },
  ),
  r(
    3171,
    "Elixir of Wisdom",
    "Alchemy",
    3383,
    [90, 120, 140, 160],
    [
      [785, 1],
      [2450, 2],
      [3371, 1],
    ],
    {
      unlock: 500,
      note: "Chumbles can plan production; transfer a finite number to Glimpo explicitly. Herbs you gathered have zero extra cash cost, but still have value.",
    },
  ),
];
for (const recipe of RECIPES) {
  if (!ITEMS[recipe.output])
    ITEMS[recipe.output] = {
      id: recipe.output,
      name: recipe.name,
      noDE: recipe.service,
      binding: recipe.binding,
    };
}
export const recipeById = (id: number) =>
  [...RECIPES, ...CONVERSIONS].find((r) => r.id === id);
export const CONVERSIONS: Recipe[] = [
  r(
    -1,
    "Greater → Lesser Magic Essence",
    "Enchanting",
    10938,
    [0, 0, 0, 0],
    [[10939, 1]],
    {
      count: 3,
      acquisition: "conversion",
      source:
        "https://www.wowhead.com/forever/item=10939/greater-magic-essence",
      unlock: 0,
      binding: "none",
    },
  ),
  r(
    -2,
    "Lesser → Greater Magic Essence",
    "Enchanting",
    10939,
    [0, 0, 0, 0],
    [[10938, 3]],
    {
      acquisition: "conversion",
      source: "https://www.wowhead.com/forever/item=10938/lesser-magic-essence",
      unlock: 0,
      binding: "none",
    },
  ),
  r(
    -3,
    "Greater → Lesser Astral Essence",
    "Enchanting",
    10998,
    [0, 0, 0, 0],
    [[11082, 1]],
    {
      count: 3,
      acquisition: "conversion",
      source:
        "https://www.wowhead.com/forever/item=11082/greater-astral-essence",
      unlock: 0,
      binding: "none",
    },
  ),
  r(
    -4,
    "Lesser → Greater Astral Essence",
    "Enchanting",
    11082,
    [0, 0, 0, 0],
    [[10998, 3]],
    {
      acquisition: "conversion",
      source:
        "https://www.wowhead.com/forever/item=10998/lesser-astral-essence",
      unlock: 0,
      binding: "none",
    },
  ),
];
for (const [id, name] of [
  [785, "Mageroyal"],
  [2450, "Briarthorn"],
  [3371, "Empty Vial"],
] as [number, string][])
  ITEMS[id] = { id, name };
ITEMS[3371].vendor = 20;
// Remove unrelated unverified pattern-name stubs; the catalogue never guesses an unlock item.
for (const id of [5773, 4347, 4345, 4350, 4346, 4348, 4349]) delete ITEMS[id];
for (const [id, name, vendorSell] of [
  [2838, "Heavy Stone", 0],
  [4377, "Heavy Blasting Powder", 150],
  [2841, "Bronze Bar", 0],
  [4375, "Whirring Bronze Gizmo", 115],
  [4382, "Bronze Framework", 600],
  [2319, "Medium Leather", 0],
] as [number, string, number][])
  ITEMS[id] = { id, name, ...(vendorSell ? { vendorSell } : {}) };
RECIPES.push(
  r(
    3945,
    "Heavy Blasting Powder",
    "Engineering",
    4377,
    [125, 125, 135, 145],
    [[2838, 1]],
    {
      unlock: null,
      note: "Available at 125, already yellow; first shown threshold is yellow, not an orange interval. Enter trainer fee or mark learned.",
    },
  ),
  r(
    3942,
    "Whirring Bronze Gizmo",
    "Engineering",
    4375,
    [125, 125, 150, 175],
    [
      [2841, 2],
      [2592, 1],
    ],
    {
      unlock: 500,
      tools: [5956, 6219],
      station: "Anvil",
      source:
        "https://www.wowhead.com/forever/spell=3942/whirring-bronze-gizmo",
      note: "Yellow from skill 125; not a guaranteed skill-up. Requires a Blacksmith Hammer, Arclight Spanner and a nearby Anvil. Training reference 5s; confirm your trainer quote.",
    },
  ),
  r(
    3953,
    "Bronze Framework",
    "Engineering",
    4382,
    [145, 145, 170, 195],
    [
      [2841, 2],
      [2319, 1],
      [2592, 1],
    ],
    {
      unlock: null,
      note: "Corrected to 145 (provider currently reports 105). Already yellow when learned.",
    },
  ),
);

export const recipeTools = (recipe: Recipe): number[] => [
  ...new Set([...(recipe.tool ? [recipe.tool] : []), ...(recipe.tools || [])]),
];
export const relevantTools = (c: import("../types").Character): number[] => [
  ...new Set(
    RECIPES.filter(
      (r) => c.skills[r.profession] && r.min <= c.skills[r.profession]!.level,
    ).flatMap(recipeTools),
  ),
];
