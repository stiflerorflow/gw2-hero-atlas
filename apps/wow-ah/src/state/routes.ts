export const ROUTES = [
  ["scanner", "Market scan"],
  ["opportunities", "Character plan"],
  ["sell", "Sell or vendor"],
  ["leveling", "Leveling"],
  ["batch", "Batch planner"],
  ["watchlist", "Watchlist"],
] as const;
export function pageFromHash(hash: string) {
  return ROUTES.find(([id]) => id === hash.slice(1))?.[0] ?? "scanner";
}
