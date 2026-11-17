import type { Outcome } from "../types";
export type DEAnalysis = {
  gross: number | null;
  net: number | null;
  profit: number | null;
  worst: number | null;
  best: number | null;
  chanceProfit: number | null;
  chanceBreakEven: number | null;
  chanceLoss: number | null;
  chanceBounds: [number, number] | null;
  maxBuy: number | null;
  quantityAssumed: boolean;
  missing: number[];
  error: string | null;
  branches: {
    probability: number;
    gross: number | null;
    low: number | null;
    high: number | null;
  }[];
};
/** One item; outcome categories are exclusive. Count ranges use an explicit uniform model.
 * Values use hundredths of a copper: a 5% AH cut is exact for integer gross prices.
 * Fees here are lost deposits, not refundable posting cash. Never infer the odds of selling.
 */
export function analyzeDisenchant(
  outcomes: Outcome[] | null,
  prices: Record<number, number | null>,
  buy: number | null,
  lost = 0,
): DEAnalysis {
  const empty: DEAnalysis = {
    gross: null,
    net: null,
    profit: null,
    worst: null,
    best: null,
    chanceProfit: null,
    chanceBreakEven: null,
    chanceLoss: null,
    chanceBounds: null,
    maxBuy: null,
    quantityAssumed: false,
    missing: [],
    error: null,
    branches: [],
  };
  const validPrice = (v: unknown): v is number =>
    typeof v === "number" &&
    Number.isSafeInteger(v) &&
    v >= 0 &&
    v <= 1_000_000_000;
  if ((buy !== null && !validPrice(buy)) || !validPrice(lost))
    return { ...empty, error: "Invalid purchase price or deposit allowance." };
  if (
    !outcomes?.length ||
    outcomes.length > 16 ||
    outcomes.some(
      (o) =>
        !Number.isFinite(o.probability) ||
        o.probability <= 0 ||
        o.probability > 1 ||
        !o.drops.length ||
        o.drops.length > 4 ||
        o.drops.some(
          (d) =>
            !Number.isSafeInteger(d.id) ||
            d.id <= 0 ||
            !Number.isInteger(d.min) ||
            !Number.isInteger(d.max) ||
            d.min < 1 ||
            d.max < d.min ||
            d.max > 10,
        ),
    ) ||
    Math.abs(outcomes.reduce((n, o) => n + o.probability, 0) - 1) > 1e-8
  )
    return {
      ...empty,
      error:
        "Incomplete or invalid outcome table; probabilities must total 100%.",
    };
  const missing = [
    ...new Set(
      outcomes
        .flatMap((o) => o.drops.map((d) => d.id))
        .filter((id) => !validPrice(prices[id])),
    ),
  ];
  const quantityAssumed = outcomes.some((o) =>
    o.drops.some((d) => d.min !== d.max),
  );
  const branches = outcomes.map((o) => {
    if (o.drops.some((d) => !validPrice(prices[d.id])))
      return { probability: o.probability, gross: null, low: null, high: null };
    return {
      probability: o.probability,
      gross: o.drops.reduce(
        (n, d) => n + (prices[d.id]! * (d.min + d.max)) / 2,
        0,
      ),
      low: o.drops.reduce((n, d) => n + prices[d.id]! * d.min * 95, 0),
      high: o.drops.reduce((n, d) => n + prices[d.id]! * d.max * 95, 0),
    };
  });
  if (missing.length) return { ...empty, missing, quantityAssumed, branches };
  let gross = 0,
    worst = Infinity,
    best = -Infinity,
    win = 0,
    tieOrWin = 0,
    loss = 0,
    boundLow = 0,
    boundHigh = 0;
  const threshold = buy === null ? null : (buy + lost) * 100;
  for (const [index, o] of outcomes.entries()) {
    const b = branches[index];
    gross += o.probability * b.gross!;
    worst = Math.min(worst, b.low!);
    best = Math.max(best, b.high!);
    if (threshold === null) continue;
    if (b.low! > threshold) boundLow += o.probability;
    if (b.high! > threshold) boundHigh += o.probability;
    let states = [{ ticks: 0, p: 1 }];
    for (const d of o.drops) {
      const next: typeof states = [];
      for (const s of states)
        for (let count = d.min; count <= d.max; count++)
          next.push({
            ticks: s.ticks + count * prices[d.id]! * 95,
            p: s.p / (d.max - d.min + 1),
          });
      states = next;
    }
    for (const s of states) {
      const probability = o.probability * s.p;
      if (s.ticks > threshold) win += probability;
      if (s.ticks >= threshold) tieOrWin += probability;
      if (s.ticks < threshold) loss += probability;
    }
  }
  const net = gross * 0.95;
  const clamp = (p: number) =>
    Math.max(0, Math.min(1, Math.round(p * 1e12) / 1e12));
  return {
    gross,
    net,
    profit: buy === null ? null : net - buy - lost,
    worst: buy === null ? null : worst / 100 - buy - lost,
    best: buy === null ? null : best / 100 - buy - lost,
    chanceProfit: threshold === null ? null : clamp(win),
    chanceBreakEven: threshold === null ? null : clamp(tieOrWin),
    chanceLoss: threshold === null ? null : clamp(loss),
    chanceBounds:
      threshold === null ? null : [clamp(boundLow), clamp(boundHigh)],
    maxBuy: net - lost,
    quantityAssumed,
    missing,
    error: null,
    branches,
  };
}
