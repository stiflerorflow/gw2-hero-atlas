import { expect, it } from "vitest";
import { recentPrice, PRICE_MAX_AGE } from "./freshness";
import type { Quote } from "../types";
it("requires both a recent source observation and a valid cache lifetime", () => {
  const now = Date.parse("2026-11-17T13:00:00Z");
  const quote = {
    observedAt: new Date(now - PRICE_MAX_AGE + 1).toISOString(),
    expiresAt: now + 300000,
  } as Quote;
  expect(recentPrice(quote, now)).toBe(true);
  expect(recentPrice(quote, now + 1)).toBe(false);
  expect(
    recentPrice(
      { ...quote, observedAt: new Date(now).toISOString(), expiresAt: now },
      now,
    ),
  ).toBe(false);
  expect(
    recentPrice(
      { ...quote, observedAt: new Date(now + 300001).toISOString() },
      now,
    ),
  ).toBe(false);
  for (const observedAt of [null, "invalid"])
    expect(recentPrice({ ...quote, observedAt }, now)).toBe(false);
  expect(recentPrice({ ...quote, expiresAt: NaN }, now)).toBe(false);
  expect(recentPrice(undefined, now)).toBe(false);
});
