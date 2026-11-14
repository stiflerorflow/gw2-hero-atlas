import type { Quote } from "../types";
import { net } from "./money";
export function flipScenario(
  q: Quote | undefined,
  reference: number | null,
  exitPercent: number,
  override: number | null = null,
  lostDeposit = 0,
  now = Date.now(),
  model: "current" | "historical" = "historical",
) {
  const buy =
    q && q.expiresAt > now && q.ask !== null && q.ask > 0 && q.quantity !== 0
      ? q.ask
      : null;
  const historical =
    reference !== null && reference > 0
      ? Math.floor((reference * exitPercent) / 100)
      : null;
  const exit =
    override ??
    (model === "current"
      ? historical === null || q?.median == null
        ? null
        : Math.min(historical, q.median)
      : historical);
  const proceeds = exit === null ? null : net(exit),
    profit =
      buy === null || proceeds === null ? null : proceeds - buy - lostDeposit;
  return {
    buy,
    exit,
    proceeds,
    profit,
    roi: profit === null || buy === null ? null : (profit / buy) * 100,
    maxBuy:
      proceeds === null
        ? null
        : Math.max(0, Math.floor(proceeds - lostDeposit)),
    daysSupply:
      q && q.quantity !== null && q.soldPerDay !== null && q.soldPerDay > 0
        ? q.quantity / q.soldPerDay
        : null,
  };
}
