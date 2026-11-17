import type { Quote } from "../types";
export const PRICE_MAX_AGE = 60 * 60 * 1000;
/** A recent observation is a lead to check, never proof the listing still exists. */
export function recentPrice(q: Quote | undefined, now = Date.now()): boolean {
  if (
    !q ||
    !Number.isFinite(q.expiresAt) ||
    q.expiresAt <= now ||
    !q.observedAt
  )
    return false;
  const at = Date.parse(q.observedAt);
  return (
    Number.isFinite(at) && at <= now + 5 * 60 * 1000 && now - at < PRICE_MAX_AGE
  );
}
