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
      reason: `An NPC purchase reference is cheaper than the AH quote.`,
    };
  if (exit !== null && q.median !== null && exit > q.median)
    return {
      title: "Needs a price recovery",
      reason: "The resale assumption exceeds the latest median asks.",
    };
  if (!q.observedAt || now - Date.parse(q.observedAt) > 3600000)
    return {
      title: "Check the live quote",
      reason:
        "The quoted price is over an hour old or has no observation time.",
    };
  if (q.soldPerDay === null || q.soldPerDay === 0)
    return {
      title: "Demand is unverified",
      reason:
        "There is no positive inferred sales rate to support a quick resale.",
    };
  if (profit === null || profit <= 0)
    return {
      title: "No positive spread",
      reason: "This sale-price scenario does not produce a positive margin.",
    };
  return {
    title: "Spread worth checking",
    reason:
      "A positive quoted spread and inferred activity justify inspecting the listings.",
  };
}
