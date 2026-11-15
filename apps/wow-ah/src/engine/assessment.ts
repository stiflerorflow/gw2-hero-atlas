import { money } from "./money";
import type { Quote } from "../types";
export function assessCandidate(
  q: Quote,
  profit: number | null,
  exit: number | null,
  vendor: number | undefined,
  now = Date.now(),
) {
  if (vendor !== undefined && q.ask !== null && vendor < q.ask)
    return {
      title: "Check the vendor price",
      reason: `NPC reference ${money(vendor)}; AH buy quote ${money(q.ask)}.`,
    };
  if (exit !== null && q.median !== null && exit > q.median)
    return {
      title: "Needs a price recovery",
      reason: `${money(exit)} assumed resale versus ${money(q.median)} latest median asks.`,
    };
  if (!q.observedAt || now - Date.parse(q.observedAt) > 3600000)
    return {
      title: "Check the live quote",
      reason: q.observedAt
        ? `Quoted ${Math.max(0, Math.floor((now - Date.parse(q.observedAt)) / 60000))} minutes ago. Check current listings.`
        : "Quote time is unavailable.",
    };
  if (q.soldPerDay === null || q.soldPerDay === 0)
    return {
      title: "Demand is unverified",
      reason:
        q.soldPerDay === 0
          ? "Zero daily sales inferred; demand is unproven."
          : "No daily sales estimate is available.",
    };
  if (profit === null || profit <= 0)
    return {
      title: "No positive spread",
      reason:
        profit === null
          ? "Buy or resale price is unavailable."
          : "Resale proceeds do not cover the buy price.",
    };
  return {
    title: "Spread worth checking",
    reason: `${q.ask ? ((profit / q.ask) * 100).toFixed(1) : "Unknown"}% return on the quoted buy price, before lost deposits.`,
  };
}

/** Listing evidence stays separate from any assumed exit or profitability calculation. */
export function listingEvidence(q: Quote, now = Date.now()) {
  const observed = q.observedAt ? Date.parse(q.observedAt) : NaN;
  if (!Number.isFinite(observed) || observed > now + 5 * 60000)
    return {
      title: "Observation time unverified",
      reason:
        "The provider has not supplied a usable observation time. Check listings in game.",
    };
  const age = Math.max(0, Math.floor((now - observed) / 60000));
  if (age >= 60)
    return {
      title: "Old listing snapshot",
      reason: `Observed ${age} minutes ago. Refreshing the feed does not make this observation newer.`,
    };
  return {
    title: "Recent listing snapshot",
    reason: `Observed ${age < 1 ? "less than a minute" : age + " minutes"} ago. Asking prices are not completed sales.`,
  };
}
