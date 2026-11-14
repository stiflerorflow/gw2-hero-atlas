import { it, expect } from "vitest";
import type { Quote } from "../types";
import { mergeHistoryQuote } from "./historyMerge";
const now = Date.parse("2026-11-14T12:00:00Z");
function q(change: Partial<Quote> = {}): Quote {
  return {
    id: 765,
    name: "Test item",
    ask: 100,
    median: 200,
    median7d: null,
    quantity: 5,
    soldPerDay: 10,
    observedAt: "2026-11-14T11:58:00Z",
    source: "Provider",
    url: "",
    expiresAt: now + 60000,
    detectedSale: null,
    coveredHours: null,
    ...change,
  };
}
it("attaches a late history answer without rewinding a newer market quote or extending either TTL", () => {
  const old = q({
      ask: 150,
      observedAt: "2026-11-14T12:00:00Z",
      expiresAt: now + 300000,
    }),
    incoming = q({
      history: [{ t: "2026-11-14T11:58:00Z", min: 100, median: 200 }],
      historyExpiresAt: now + 10000,
    });
  const merged = mergeHistoryQuote(old, incoming, now)!;
  expect(merged.ask).toBe(150);
  expect(merged.observedAt).toBe(old.observedAt);
  expect(merged.expiresAt).toBe(old.expiresAt);
  expect(merged.history).toEqual(incoming.history);
  expect(merged.historyExpiresAt).toBe(now + 10000);
});
it("uses a genuinely newer incoming snapshot with its own TTL and treats missing stamps conservatively", () => {
  const old = q({ ask: 100 }),
    fresh = q({
      ask: 150,
      observedAt: "2026-11-14T12:00:00Z",
      expiresAt: now + 1000,
    });
  expect(mergeHistoryQuote(old, fresh, now)?.ask).toBe(150);
  expect(mergeHistoryQuote(old, fresh, now)?.expiresAt).toBe(now + 1000);
  expect(
    mergeHistoryQuote(fresh, q({ ask: 10, observedAt: null }), now)?.ask,
  ).toBe(150);
});
it("does not revive expired price or historical payloads", () => {
  const expired = q({
    expiresAt: now - 1,
    history: [{ t: "2026-11-14T11:58:00Z", min: 1, median: 1 }],
    historyExpiresAt: now - 1,
  });
  expect(mergeHistoryQuote(undefined, expired, now)).toBeUndefined();
  const fresh = q({ ask: 150 });
  expect(mergeHistoryQuote(fresh, expired, now)?.ask).toBe(150);
  expect(mergeHistoryQuote(fresh, expired, now)?.history).toBeUndefined();
  const supplemental = q({
    expiresAt: now + 10000,
    history: expired.history,
    historyExpiresAt: now - 1,
  });
  expect(mergeHistoryQuote(supplemental, q(), now)?.history).toBeUndefined();
});
