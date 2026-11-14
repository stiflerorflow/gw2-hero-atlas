import { PriceContext } from "./PriceContext";
import { useEffect, useState } from "react";
import type { MarketData, Quote } from "../types";
import type { ScanFilters } from "../market/scanner";
import { DEFAULT_SCAN } from "../market/scanner";
import { flipScenario } from "../engine/flips";
import { money } from "../engine/money";
import { MoneyInput } from "./MoneyInput";
const basisLabel = (basis: string) =>
  basis === "7d"
    ? "7-day median asks"
    : basis === "30d"
      ? "30-day median asks"
      : basis === "scan"
        ? "current-scan median asks"
        : "provider reference asks";
const presets: { label: string; note: string; filters: ScanFilters }[] = [
  {
    label: "Active markets",
    note: "At least 1 estimated sale/day",
    filters: DEFAULT_SCAN,
  },
  {
    label: "Deep discounts",
    note: "50%+ below reference; includes slow sellers",
    filters: { discount: 50, sells: 0, units: 1, sort: "discount" },
  },
  {
    label: "Broad scan",
    note: "15%+ below reference; all activity levels",
    filters: { discount: 15, sells: 0, units: 1, sort: "saving" },
  },
];
export function FlipScanner({
  market,
  loading,
  filters,
  onScan,
  load,
  copy,
  watch,
  character,
}: {
  market: MarketData;
  loading: boolean;
  filters: ScanFilters;
  onScan: (f: ScanFilters) => void;
  load: (id: number) => Promise<void>;
  copy: (s: string) => Promise<void>;
  watch: (id: number) => void;
  character: string;
}) {
  const [compact, setCompact] = useState(
    () => matchMedia("(max-width:600px)").matches,
  );
  useEffect(() => {
    const m = matchMedia("(max-width:600px)");
    const change = () => setCompact(m.matches);
    m.addEventListener("change", change);
    return () => m.removeEventListener("change", change);
  }, []);
  const [draft, setDraft] = useState(filters),
    [search, setSearch] = useState(""),
    [exitPercent, setExitPercent] = useState(90),
    [sort, setSort] = useState("activity"),
    [maxBuy, setMaxBuy] = useState<number | null>(null),
    [positive, setPositive] = useState(true),
    [showAll, setShowAll] = useState(false);
  const rows = (market.deals || [])
    .map((d) => ({
      d,
      q: market.quotes[d.id],
      s: flipScenario(market.quotes[d.id], d.reference, exitPercent),
    }))
    .filter(
      ({ q, s }) =>
        q &&
        q.expiresAt > Date.now() &&
        q.name.toLowerCase().includes(search.toLowerCase()) &&
        (!positive || (s.profit !== null && s.profit > 0)) &&
        (maxBuy === null || (s.buy !== null && s.buy <= maxBuy)),
    )
    .sort((a, b) =>
      sort === "activity"
        ? (b.q.soldPerDay ?? -1) - (a.q.soldPerDay ?? -1)
        : sort === "profit"
          ? (b.s.profit ?? -Infinity) - (a.s.profit ?? -Infinity)
          : sort === "roi"
            ? (b.s.roi ?? -Infinity) - (a.s.roi ?? -Infinity)
            : (a.s.buy ?? Infinity) - (b.s.buy ?? Infinity),
    );
  function apply(f: ScanFilters) {
    setDraft(f);
    setShowAll(false);
    onScan(f);
  }
  return (
    <>
      <section className="page-heading scanner-heading">
        <p className="eyebrow">Buy low. Resell. Keep the difference.</p>
        <h1>
          Find your next <em>flip.</em>
        </h1>
        <p>
          Scan the market for resale opportunities. No profession, inventory or
          character setup required.
        </p>
        <p className="note">
          Potential profit uses your assumed resale price after the 5% AH cut,
          before lost deposits. Historical asks are a reference, not confirmed
          sales.
        </p>
      </section>
      <div className="scan-presets" role="group" aria-label="Scan presets">
        {presets.map((p) => (
          <button
            key={p.label}
            aria-pressed={Object.entries(p.filters).every(
              ([k, v]) => filters[k as keyof ScanFilters] === v,
            )}
            onClick={() => apply(p.filters)}
          >
            <b>{p.label}</b>
            <small>{p.note}</small>
          </button>
        ))}
      </div>
      <div className="panel scan-controls">
        <div className="form-grid">
          <label>
            Find item
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cloth, herbs, weapons…"
            />
          </label>
          <label>
            Rank results
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="activity">Most estimated sales/day</option>
              <option value="profit">Highest potential profit/unit</option>
              <option value="roi">Highest return on cash</option>
              <option value="cost">Lowest buy price</option>
            </select>
          </label>
          <label>
            Assumed resale price
            <select
              value={exitPercent}
              onChange={(e) => setExitPercent(+e.target.value)}
            >
              {[80, 90, 100].map((n) => (
                <option key={n} value={n}>
                  {n}% of reference asks
                </option>
              ))}
            </select>
          </label>
        </div>
        <details>
          <summary>Adjust scan and price limits</summary>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              apply(draft);
            }}
          >
            <div className="form-grid">
              <label>
                Minimum discount to reference
                <select
                  value={draft.discount}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      discount: +e.target.value as ScanFilters["discount"],
                    })
                  }
                >
                  {[15, 25, 35, 50, 70].map((n) => (
                    <option key={n} value={n}>
                      {n}%
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Minimum estimated units/day
                <select
                  value={draft.sells}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      sells: +e.target.value as ScanFilters["sells"],
                    })
                  }
                >
                  {[0, 1, 10, 100].map((n) => (
                    <option key={n} value={n}>
                      {n === 0 ? "Any, including zero / unknown" : n + " / day"}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Minimum listed stock
                <select
                  value={draft.units}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      units: +e.target.value as ScanFilters["units"],
                    })
                  }
                >
                  {[1, 5, 20, 100].map((n) => (
                    <option key={n} value={n}>
                      {n} units
                    </option>
                  ))}
                </select>
              </label>
              <MoneyInput
                label="Maximum purchase price / unit · optional"
                value={maxBuy}
                onChange={setMaxBuy}
              />
            </div>
            <label className="inline">
              <input
                type="checkbox"
                checked={positive}
                onChange={(e) => setPositive(e.target.checked)}
              />
              Only positive resale scenarios after AH cut
            </label>
            <button type="submit" className="primary">
              Apply scan filters
            </button>
          </form>
        </details>
      </div>
      <div className="section-title">
        <div>
          <h2>Resale candidates</h2>
          <p className="note">
            {rows.length} shown · up to 200 provider leads · {filters.discount}
            %+ reference discount ·{" "}
            {filters.sells
              ? filters.sells + "+ estimated units/day"
              : "all activity levels"}
            . Search filters these returned leads, not every item in the game.
          </p>
        </div>
        <a
          className="credit"
          href="https://ahledger.com"
          target="_blank"
          rel="noreferrer"
        >
          Prices from AHledger ↗
        </a>
      </div>
      {loading && <p role="status">Scanning market leads…</p>}
      {market.errors.length > 0 && (
        <p className="alert" role="alert">
          {market.errors.join(" ")} Use Refresh to try again. Missing data is
          not treated as a free purchase.
        </p>
      )}
      {!loading && !rows.length && (
        <section className="empty">
          <h3>No matching resale candidates</h3>
          <p>
            Try Broad scan, relax the price limit, or allow non-positive
            scenarios. An empty result is not proof the market has no flips.
          </p>
        </section>
      )}
      <div className="flip-grid">
        {rows.slice(0, showAll ? 200 : compact ? 3 : 12).map(({ d, q, s }) => (
          <article className="panel flip-card" key={d.id}>
            <div className="card-top">
              <span className="eyebrow">{d.quality || "Market resale"}</span>
              <span className="pill">
                {q.soldPerDay === null
                  ? "Demand unknown"
                  : q.soldPerDay === 0
                    ? "No inferred sales"
                    : "Estimated activity"}
              </span>
            </div>
            <h3>{q.name}</h3>
            <div className="flip-demand">
              <b>
                {q.soldPerDay === null
                  ? "Unknown"
                  : q.soldPerDay.toLocaleString(undefined, {
                      maximumFractionDigits: 1,
                    }) + " / day"}
              </b>
              <span>
                estimated market units sold · {q.quantity ?? "unknown"} listed
              </span>
            </div>
            <dl className="card-numbers">
              <div>
                <dt>Buy / unit</dt>
                <dd>{money(s.buy)}</dd>
              </div>
              <div>
                <dt>Potential profit / unit</dt>
                <dd
                  className={
                    s.profit !== null && s.profit > 0 ? "positive" : "negative"
                  }
                >
                  {money(s.profit)}
                </dd>
              </div>
            </dl>
            <p className="card-note">
              {d.reference !== null && d.reference > 0 && s.buy !== null && (
                <>
                  <b>
                    {((1 - s.buy / d.reference) * 100).toFixed(1)}% below
                    reference asks
                  </b>
                  <br />
                </>
              )}
              Assumed resale {money(s.exit)} ·{" "}
              {s.roi === null
                ? "Unknown ROI"
                : s.roi.toFixed(1) + "% return on cash"}
              <br />
              {exitPercent}% of {basisLabel(d.basis)} ({money(d.reference)})
            </p>
            <p className="note">
              {s.daysSupply === null
                ? "Days of supply unknown"
                : s.daysSupply.toFixed(1) + " approximate days of supply"}{" "}
              · whole market, not your selling time.
            </p>
            {(q.soldPerDay === null ||
              q.soldPerDay === 0 ||
              d.basis === "scan") && (
              <p className="warning">
                {d.basis === "scan"
                  ? "Reference is only the current scan; no historical discount is established."
                  : "Demand is not established. A large paper margin may never sell."}
              </p>
            )}
            <p className="timestamp">
              Observed{" "}
              {q.observedAt
                ? new Date(q.observedAt).toLocaleString()
                : "unknown"}
              {q.observedAt &&
              Date.now() - Date.parse(q.observedAt) > 6 * 3600000
                ? " · old scan"
                : ""}
            </p>
            <div className="row-actions">
              <button onClick={() => void copy(q.name)}>Copy item name</button>
              <a
                href={q.url || "https://ahledger.com"}
                target="_blank"
                rel="noreferrer"
              >
                Inspect source ↗
              </a>
            </div>
            <details>
              <summary>Price history & calculator</summary>
              <FlipDetail
                q={q}
                reference={d.reference}
                basis={basisLabel(d.basis)}
                percent={exitPercent}
                load={load}
              />
              {d.assessment && (
                <p className="note">Provider assessment: {d.assessment}</p>
              )}
              <button onClick={() => watch(q.id)}>
                Save to {character}’s watchlist
              </button>
            </details>
          </article>
        ))}
      </div>
      {rows.length > (compact ? 3 : 12) && !showAll && (
        <button className="wide" onClick={() => setShowAll(true)}>
          Show all {rows.length} candidates
        </button>
      )}
      <details className="panel">
        <summary>How to use this scanner</summary>
        <p>
          Choose a scan, compare daily activity and profit, then inspect the
          actual listings before buying. Try a small position first. Your own
          listing competes with other sellers, so market volume is not a promise
          of personal sales.
        </p>
        <p>
          The provider supplies discounted-item leads, not complete market
          depth. Listed stock is a supply total: it does not mean every unit is
          available at the lowest price. Missing rates differ from zero inferred
          sales. Changing layers cannot change this market.
        </p>
        <p>
          Crafting, leveling and character budgets remain available in the other
          workflows. This scanner uses market prices only; owned supplies,
          profession levels and character-specific overrides do not change the
          results. Filters and resale scenarios last for this visit; provider
          snapshots are never saved in your profile.
        </p>
      </details>
    </>
  );
}
function FlipDetail({
  q,
  reference,
  basis,
  percent,
  load,
}: {
  q: Quote;
  reference: number | null;
  basis: string;
  percent: number;
  load: (id: number) => Promise<void>;
}) {
  const [exit, setExit] = useState<number | null>(null),
    [deposit, setDeposit] = useState<number | null>(0),
    [qty, setQty] = useState(1),
    [loading, setLoading] = useState(false),
    [error, setError] = useState("");
  const s = flipScenario(q, reference, percent, exit, deposit ?? 0);
  return (
    <div className="flip-detail">
      <h4>Check the historical price context</h4>
      <button
        disabled={loading}
        onClick={async () => {
          setLoading(true);
          setError("");
          try {
            await load(q.id);
          } catch (e) {
            setError((e as Error).message);
          } finally {
            setLoading(false);
          }
        }}
      >
        {loading ? "Loading coverage…" : "Load price history & demand coverage"}
      </button>
      {error && <p role="alert">{error}</p>}
      {q.windowDays !== undefined && (
        <p className="note">
          Provider estimate window: {q.windowDays ?? "unknown"} days · coverage
          reported: {q.coveredHours ?? "unknown"} hours.{" "}
          {q.salesMethod && (
            <a href={q.salesMethod} target="_blank" rel="noreferrer">
              Estimation method ↗
            </a>
          )}{" "}
          This is an inferred daily rate, not a confirmed count for the past 24
          hours.
        </p>
      )}
      {q.history && <PriceContext q={q} />}
      {q.history && (
        <p className="note">
          Recent typical asks: {money(q.median)} · reference used here:{" "}
          {money(reference)} ({basis}).
        </p>
      )}

      <h4>Test a different resale price</h4>
      <div className="form-grid">
        <MoneyInput
          label="Override gross resale / unit · calculator"
          value={exit}
          onChange={setExit}
        />
        <MoneyInput
          label="Lost deposit allowance / unit"
          allowUnknown={false}
          value={deposit}
          onChange={setDeposit}
        />
        <label>
          Test quantity
          <input
            type="number"
            min="1"
            max="1000"
            value={qty}
            onChange={(e) => {
              const n = +e.target.value;
              if (Number.isInteger(n) && n > 0 && n <= 1000) setQty(n);
            }}
          />
        </label>
      </div>
      <dl className="mini-stats">
        <div>
          <dt>Purchase scenario</dt>
          <dd>
            {money(
              s.buy === null || (q.quantity !== null && qty > q.quantity)
                ? null
                : s.buy * qty,
            )}
          </dd>
        </div>
        <div>
          <dt>Potential profit if all sell</dt>
          <dd>
            {money(
              s.profit === null || (q.quantity !== null && qty > q.quantity)
                ? null
                : s.profit * qty,
            )}
          </dd>
        </div>
        <div>
          <dt>Break-even max buy / unit</dt>
          <dd>{money(s.maxBuy)}</dd>
        </div>
      </dl>
      {q.quantity !== null && qty > q.quantity && (
        <p className="warning">
          Quantity exceeds the total listed stock. This purchase is not
          supported by the snapshot.
        </p>
      )}
      <p className="note">
        Whole-unit calculation assumes all {qty} can be bought at the displayed
        unit price and resold at your assumed price. Verify price depth in game.
        Successful posting deposits must also be funded upfront; the allowance
        above represents deposits lost to expiry, not the total posting deposit.
      </p>
    </div>
  );
}
