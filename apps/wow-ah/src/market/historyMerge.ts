import type { Quote } from "../types";

function unexpired(quote: Quote | undefined, now: number): Quote | undefined {
  if (!quote || quote.expiresAt <= now) return;
  if (quote.historyExpiresAt !== undefined && quote.historyExpiresAt <= now) {
    const { history, historyExpiresAt, ...base } = quote;
    return base;
  }
  return quote;
}
const observed = (quote: Quote) => {
  const value = quote.observedAt ? Date.parse(quote.observedAt) : NaN;
  return Number.isFinite(value) ? value : -Infinity;
};

/** A late history response may supplement, but never rewind, a newer price snapshot. */
export function mergeHistoryQuote(
  existing: Quote | undefined,
  incoming: Quote,
  now = Date.now(),
): Quote | undefined {
  const old = unexpired(existing, now),
    next = unexpired(incoming, now);
  if (!next) return old;
  const base = old && observed(old) > observed(next) ? old : next;
  const history =
    incoming.history !== undefined &&
    (incoming.historyExpiresAt ?? incoming.expiresAt) > now
      ? {
          history: incoming.history,
          historyExpiresAt: incoming.historyExpiresAt ?? incoming.expiresAt,
        }
      : old?.history !== undefined &&
          (old.historyExpiresAt ?? old.expiresAt) > now
        ? {
            history: old.history,
            historyExpiresAt: old.historyExpiresAt ?? old.expiresAt,
          }
        : undefined;
  return history ? { ...base, ...history } : base;
}
