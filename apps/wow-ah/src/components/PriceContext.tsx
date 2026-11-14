import { useState } from "react";
import type { Quote } from "../types";
import { money } from "../engine/money";
export function historyContext(
  q: Quote,
  range: "24h" | "7d",
  now = Date.now(),
) {
  const start = now - (range === "24h" ? 86400000 : 7 * 86400000);
  const rows = (q.history || [])
    .filter((s) => Date.parse(s.t) >= start && Date.parse(s.t) <= now)
    .slice()
    .sort((a, b) => Date.parse(a.t) - Date.parse(b.t));
  const values = rows
    .map((s) => s.median)
    .filter((v): v is number => v !== null && Number.isFinite(v) && v > 0);
  const low = values.length ? Math.min(...values) : null,
    high = values.length ? Math.max(...values) : null;
  return {
    rows,
    low,
    high,
    position:
      q.ask === null || low === null || high === null || values.length < 2
        ? "Insufficient observations to compare"
        : q.ask < low
          ? "Current buy price is below the observed median-ask range"
          : q.ask > high
            ? "Current buy price is above the observed median-ask range"
            : "Current buy price is within the observed median-ask range",
  };
}
export function PriceContext({ q }: { q: Quote }) {
  const [range, setRange] = useState<"24h" | "7d">("7d");
  const { rows, low, high, position } = historyContext(q, range);
  const plotValues = rows
    .flatMap((s) => [s.min, s.median])
    .filter((v): v is number => v !== null && Number.isFinite(v) && v > 0);
  if (q.ask !== null && q.ask > 0) plotValues.push(q.ask);
  const floor = Math.min(...plotValues),
    ceiling = Math.max(...plotValues),
    first = Date.parse(rows[0]?.t || ""),
    last = Date.parse(rows.at(-1)?.t || "");
  const y = (value: number) =>
      150 - ((value - floor) * 115) / Math.max(1, ceiling - floor),
    x = (t: string) =>
      35 + ((Date.parse(t) - first) * 510) / Math.max(1, last - first);
  const segments = (field: "min" | "median") => {
    const out: string[] = [];
    let points: string[] = [];
    for (const row of rows) {
      const v = row[field];
      if (v === null || v <= 0) {
        if (points.length) out.push(points.join(" "));
        points = [];
      } else points.push(`${x(row.t)},${y(v)}`);
    }
    if (points.length) out.push(points.join(" "));
    return out;
  };
  return (
    <section className="price-context" aria-label="Historical price context">
      <div className="section-title">
        <h4>Does this look cheap?</h4>
        <label>
          Price-history window
          <select
            value={range}
            onChange={(e) => setRange(e.target.value as "24h" | "7d")}
          >
            <option value="24h">Last 24 hours</option>
            <option value="7d">Last 7 days</option>
          </select>
        </label>
      </div>
      <p>
        <b>{position}.</b>
      </p>
      <p className="note">
        Median asks observed in this window: {money(low)}–{money(high)} ·{" "}
        {rows.length} snapshots. A lower ask can signal an opportunity or
        falling demand.
      </p>
      {rows.length > 1 && plotValues.length > 1 ? (
        <>
          <svg
            viewBox="0 0 580 210"
            role="img"
            aria-label={`${range} listing prices. Observed median asks range from ${money(low)} to ${money(high)}. Current buy quote ${money(q.ask)}. Asking prices, not confirmed sales.`}
          >
            <path d="M35 165H545" stroke="#a6b09e" />
            {segments("min").map((p, i) => (
              <polyline
                key={"min" + i}
                points={p}
                fill="none"
                stroke="#8d5e2c"
                strokeWidth="2"
              />
            ))}
            {segments("median").map((p, i) => (
              <polyline
                key={"median" + i}
                points={p}
                fill="none"
                stroke="#1c4d3f"
                strokeWidth="3"
              />
            ))}
            {q.ask !== null && (
              <path
                d={`M35 ${y(q.ask)}H545`}
                stroke="#58654e"
                strokeWidth="2"
                strokeDasharray="5 5"
              />
            )}
            <text x="35" y="20" fill="#233d34" fontSize="12">
              {money(ceiling)}
            </text>
            <text x="35" y="185" fill="#233d34" fontSize="12">
              {new Date(first).toLocaleDateString()}
            </text>
            <text x="545" y="185" textAnchor="end" fill="#233d34" fontSize="12">
              {new Date(last).toLocaleDateString()}
            </text>
          </svg>
          <p className="history-legend">
            <span>Green: median asks</span>
            <span>Brown: lowest asks</span>
            <span>Dashed: current buy quote</span>
          </p>
        </>
      ) : (
        <p>
          Insufficient price observations in this window. Try the seven-day
          view.
        </p>
      )}
      <p className="note">
        These are listing snapshots. Missing intervals are not filled with
        invented prices; lines connect available snapshots and do not establish
        uninterrupted coverage. Historical asking prices do not guarantee a
        future sale.
      </p>
    </section>
  );
}
