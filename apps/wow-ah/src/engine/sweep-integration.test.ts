import { it, expect } from "vitest";
import { defaults } from "../state/profile";
import { unknownMarket } from "../market/ahledger";
import { acquire } from "./planner";
import type { Quote } from "../types";

function quote(id: number, ask: number, quantity: number): Quote {
  return {
    id,
    name: "Synthetic essence",
    ask,
    median: ask,
    median7d: null,
    quantity,
    soldPerDay: null,
    observedAt: null,
    source: "AHledger · synthetic",
    url: "",
    expiresAt: Infinity,
    detectedSale: null,
    coveredHours: null,
  };
}

// Independent oracle: enumerate finite purchases in a tiny two-item market,
// then use the reversible 3 Lesser = 1 Greater conversion. No planner helpers
// are used in deciding feasibility or the minimum cash cost.
function bruteCost(
  requiredLesserUnits: number,
  lessPrice: number,
  greaterPrice: number,
  lessStock: number,
  greaterStock: number,
  ownedLess: number,
  ownedGreater: number,
) {
  let cheapest = Infinity;
  for (let buyLess = 0; buyLess <= lessStock; buyLess++)
    for (let buyGreater = 0; buyGreater <= greaterStock; buyGreater++)
      if (
        ownedLess + buyLess + 3 * (ownedGreater + buyGreater) >=
        requiredLesserUnits
      )
        cheapest = Math.min(
          cheapest,
          buyLess * lessPrice + buyGreater * greaterPrice,
        );
  return Number.isFinite(cheapest) ? cheapest : null;
}
it("matches a brute-force oracle for bounded finite essence purchases in either direction", () => {
  for (const [lessPrice, greaterPrice] of [
    [100, 1000],
    [100, 200],
    [300, 100],
  ])
    for (let lessStock = 0; lessStock <= 4; lessStock++)
      for (let greaterStock = 0; greaterStock <= 3; greaterStock++)
        for (const [ownedLess, ownedGreater] of [
          [0, 0],
          [1, 0],
          [0, 1],
          [2, 1],
        ])
          for (let quantity = 1; quantity <= 8; quantity++)
            for (const itemId of [10938, 10939]) {
              const c = defaults().characters[0],
                market = unknownMarket();
              market.quotes[10938] = quote(10938, lessPrice, lessStock);
              market.quotes[10939] = quote(10939, greaterPrice, greaterStock);
              const pool = { 10938: ownedLess, 10939: ownedGreater };
              const actual = acquire(itemId, quantity, c, market, pool);
              const expected = bruteCost(
                quantity * (itemId === 10939 ? 3 : 1),
                lessPrice,
                greaterPrice,
                lessStock,
                greaterStock,
                ownedLess,
                ownedGreater,
              );
              const context = JSON.stringify({
                itemId,
                quantity,
                lessPrice,
                greaterPrice,
                lessStock,
                greaterStock,
                ownedLess,
                ownedGreater,
              });
              expect(actual.cash, context).toBe(expected);
              if (actual.cash !== null)
                for (const [id, maximum] of [
                  [10938, lessStock],
                  [10939, greaterStock],
                ]) {
                  const bought = actual.lines
                    .filter((l) => l.id === id && l.cash !== null && l.cash > 0)
                    .reduce((sum, l) => sum + l.qty, 0);
                  expect(bought, context).toBeLessThanOrEqual(maximum);
                }
            }
});
