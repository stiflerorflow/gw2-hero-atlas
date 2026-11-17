import { it, expect } from "vitest";
import { analyzeDisenchant } from "./disenchant";
import type { Outcome } from "../types";
// Synthetic prices: the user's 38s example is a regression input, never a production preset.
const table: Outcome[] = [
  {
    probability: 0.75,
    drops: [{ id: 11137, min: 2, max: 5 }],
    source: "Synthetic armor table",
  },
  {
    probability: 0.2,
    drops: [{ id: 11174, min: 1, max: 2 }],
    source: "Synthetic armor table",
  },
  {
    probability: 0.05,
    drops: [{ id: 11177, min: 1, max: 1 }],
    source: "Synthetic armor table",
  },
];
it("computes the complete 38s example and distinguishes profit from an exact tie", () => {
  const r = analyzeDisenchant(
    table,
    { 11137: 1000, 11174: 4000, 11177: 5000 },
    3800,
  );
  expect(r.gross).toBe(4075);
  expect(r.net).toBe(3871.25);
  expect(r.profit).toBe(71.25);
  expect(r.worst).toBe(-1900);
  expect(r.best).toBe(3800);
  expect(r.chanceProfit).toBeCloseTo(0.3375);
  expect(r.chanceBreakEven).toBeCloseTo(0.625);
  expect(r.chanceLoss).toBeCloseTo(0.375);
  expect(r.chanceBounds).toEqual([0.05, 1]);
  expect(r.quantityAssumed).toBe(true);
  expect(r.maxBuy).toBe(3871.25);
});
it("leaves totals and odds unknown if any material is unpriced, but preserves priced branches", () => {
  const r = analyzeDisenchant(
    table,
    { 11137: 1000, 11174: null, 11177: 5000 },
    3800,
  );
  expect(r.net).toBeNull();
  expect(r.profit).toBeNull();
  expect(r.chanceProfit).toBeNull();
  expect(r.missing).toEqual([11174]);
  expect(r.branches[0].gross).toBe(3500);
  expect(r.branches[1].gross).toBeNull();
  expect(
    analyzeDisenchant(table, { 11137: 0, 11174: 0, 11177: 0 }, 3800).profit,
  ).toBe(-3800);
});
it("subtracts lost deposits once and never calls a break-even result a profit", () => {
  const fixed: Outcome[] = [
    {
      probability: 1,
      drops: [{ id: 1, min: 1, max: 1 }],
      source: "Synthetic fixed drop",
    },
  ];
  const tie = analyzeDisenchant(fixed, { 1: 100 }, 95);
  expect(tie.profit).toBe(0);
  expect(tie.chanceProfit).toBe(0);
  expect(tie.chanceBreakEven).toBe(1);
  expect(tie.chanceBounds).toEqual([0, 0]);
  const lost = analyzeDisenchant(fixed, { 1: 100 }, 95, 1);
  expect(lost.profit).toBe(-1);
  expect(lost.chanceLoss).toBe(1);
  expect(lost.chanceBreakEven).toBe(0);
});
it("rejects incomplete tables and malformed prices without inventing missing probability", () => {
  for (const invalid of [
    null,
    [],
    table.slice(0, 2),
    [{ ...table[0], probability: NaN }],
    [{ ...table[0], probability: 1, drops: [{ id: 1, min: 1, max: 100 }] }],
  ])
    expect(analyzeDisenchant(invalid, {}, 100).error).not.toBeNull();
  expect(analyzeDisenchant(table, {}, -1).error).not.toBeNull();
  expect(
    analyzeDisenchant(table, { 11137: 1000, 11174: 4000, 11177: 5000 }, null)
      .net,
  ).toBe(3871.25);
  expect(
    analyzeDisenchant(table, { 11137: 1000, 11174: 4000, 11177: 5000 }, null)
      .chanceProfit,
  ).toBeNull();
});
it("matches an independent exhaustive oracle across purchase and material-price thresholds", () => {
  // Explicit seven elementary events, independent of the engine's state expansion.
  for (const dust of [0, 1, 100, 999, 1000])
    for (const essence of [1, 50, 4000])
      for (const shard of [0, 500, 5000])
        for (const buy of [0, 95, 1900, 2850, 3800, 7600])
          for (const lost of [0, 1, 50]) {
            const events = [
              [0.1875, 2 * dust],
              [0.1875, 3 * dust],
              [0.1875, 4 * dust],
              [0.1875, 5 * dust],
              [0.1, essence],
              [0.1, 2 * essence],
              [0.05, shard],
            ];
            const costTicks = (buy + lost) * 100;
            const win = events.reduce(
                (n, [p, gross]) => n + (gross * 95 > costTicks ? p : 0),
                0,
              ),
              cover = events.reduce(
                (n, [p, gross]) => n + (gross * 95 >= costTicks ? p : 0),
                0,
              );
            const net = events.reduce(
              (n, [p, gross]) => n + (p * gross * 95) / 100,
              0,
            );
            const r = analyzeDisenchant(
              table,
              { 11137: dust, 11174: essence, 11177: shard },
              buy,
              lost,
            );
            expect(r.net).toBeCloseTo(net, 8);
            expect(r.profit).toBeCloseTo(net - buy - lost, 8);
            expect(r.chanceProfit).toBeCloseTo(win, 10);
            expect(r.chanceBreakEven).toBeCloseTo(cover, 10);
          }
});
it("handles simultaneous drops as one outcome and counts their joint recovery", () => {
  const r = analyzeDisenchant(
    [
      {
        probability: 1,
        drops: [
          { id: 1, min: 1, max: 2 },
          { id: 2, min: 1, max: 2 },
        ],
        source: "Synthetic joint drop",
      },
    ],
    { 1: 100, 2: 200 },
    400,
  );
  expect(r.gross).toBe(450);
  expect(r.profit).toBe(27.5);
  expect(r.chanceProfit).toBe(0.5);
});
