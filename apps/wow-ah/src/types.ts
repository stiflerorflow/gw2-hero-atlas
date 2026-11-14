export type Profession =
  | "Tailoring"
  | "Enchanting"
  | "Alchemy"
  | "Engineering"
  | "Mining"
  | "Herbalism";
export const PROFESSIONS: Profession[] = [
  "Tailoring",
  "Enchanting",
  "Alchemy",
  "Engineering",
  "Mining",
  "Herbalism",
];
export const MARKET = "forever.rp.alliance.eu";
export type Item = {
  id: number;
  name: string;
  vendor?: number;
  vendorSell?: number;
  de?: Outcome[];
  noDE?: boolean;
  binding?: string;
};
export type Outcome = {
  probability: number;
  drops: { id: number; min: number; max: number }[];
  source: string;
};
export type Recipe = {
  id: number;
  name: string;
  profession: Profession;
  output: number;
  count: number;
  reagents: { id: number; qty: number }[];
  min: number;
  yellow: number;
  green: number;
  grey: number;
  acquisition: "trainer" | "vendor" | "drop" | "quest" | "conversion";
  unlock: number | null;
  pattern?: number;
  verified: boolean;
  source: string;
  note: string;
  tool?: number;
  once?: boolean;
  service?: boolean;
  binding: "BoE" | "BoP" | "none";
  expansion: string;
};
export type Quote = {
  id: number;
  name: string;
  ask: number | null;
  median: number | null;
  median7d: number | null;
  quantity: number | null;
  soldPerDay: number | null;
  observedAt: string | null;
  source: string;
  url: string;
  expiresAt: number;
  detectedSale: number | null;
  coveredHours: number | null;
  history?: { t: string; min: number | null; median: number | null }[];
};
export type Inventory = { qty: number; note: string };
export type ManualQuote = {
  market: string;
  ask: number | null;
  exit: number | null;
  observedAt: string;
  note: string;
};
export type Skill = { level: number; cap: number; target: number };
export type Action = {
  id: string;
  kind: "craft" | "craft-de" | "buy-de" | "convert" | "resell";
  recipeId?: number;
  itemId: number;
  quantity: number;
  exit: number | null;
  deposit: number | null;
  fallback: "keep" | "vendor";
  sellFraction: number;
  retain?: boolean;
};
export type SaleLog = {
  id: string;
  itemId: number;
  qty: number;
  gross: number;
  cost: number | null;
  lostDeposit: number;
  when: string;
};
export type Character = {
  id: string;
  name: string;
  className: string;
  cash: number | null;
  budget: number | null;
  reserve: number;
  skills: Partial<Record<Profession, Skill>>;
  known: number[];
  inventory: Record<number, Inventory>;
  manual: Record<number, ManualQuote>;
  vendor: Record<number, number>;
  unlockCosts: Record<number, number>;
  tools: number[];
  watch: { id: number; buyBelow: number | null; sellAbove: number | null }[];
  batch: Action[];
  duration: 12 | 24 | 48;
  sales: SaleLog[];
};
export type SavedState = {
  version: 1;
  active: string;
  characters: Character[];
};
export type MarketData = {
  quotes: Record<number, Quote>;
  imported: Recipe[];
  deItems: Item[];
  deals?: { id: number; reference: number | null; basis: string }[];
  errors: string[];
  updatedAt: string | null;
  expiresAt: number;
};
