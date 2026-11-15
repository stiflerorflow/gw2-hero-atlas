import { assessCandidate, listingEvidence } from "../engine/assessment";
import { ITEMS } from "../catalog/items";
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
    filters: { discount: 25, sells: 1, units: 1, sort: "sales" },
  },
  {
    label: "Deep discounts",
    note: "50%+ below reference; includes slow sellers",
    filters: { discount: 50, sells: 0, units: 1, sort: "discount" },
  },
  {
    label: "Broad scan",
    note: "15%+ below reference; all activity levels",
    filters: DEFAULT_SCAN,
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
    [model, setModel] = useState<"current" | "historical">("current"),
    [sort, setSort] = useState("activity"),
    [maxBuy, setMaxBuy] = useState<number | null>(null),
    [positive, setPositive] = useState(false),
    [showAll, setShowAll] = useState(false),
    [drafts, setDrafts] = useState<
      Record<
        number,
        { exit: number | null; deposit: number | null; qty: number }
      >
    >({});
  const rows = (market.deals || [])
    .map((d) => ({
      d,
      q: market.quotes[d.id],
      s: flipScenario(
        market.quotes[d.id],
        d.reference,
        exitPercent,
        null,
        0,
        Date.now(),
        model,
      ),
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
        <h1>Market scan</h1>
        <p>
          Listing data first. Resale is a scenario.
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
            Filter returned leads
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
              <option value="activity">Inferred daily activity</option>
              <option value="profit">Scenario profit / item</option>
              <option value="roi">Return %</option>
              <option value="cost">Buy price</option>
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
              {" "}
              <label>
                Resale model
                <select
                  value={model}
                  onChange={(e) =>
                    setModel(e.target.value as "current" | "historical")
                  }
                >
                  <option value="current">Current prices</option>
                  <option value="historical">
                    Price recovery · speculative
                  </option>
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
          <h2 className="scanner-results-heading">Listing leads</h2>
          <p className="note">
            {Math.min(rows.length, showAll ? 200 : compact ? 3 : 12)} /{" "}
            {rows.length} provider leads
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
          <h3>No matching listing leads</h3>
          <p>
            Try Broad scan, relax the price limit, or allow non-positive
            scenarios. An empty result is not proof the market has no
            opportunities. No cached recipe ideas are substituted.
          </p>
        </section>
      )}
      <div className="flip-grid">
        {rows.slice(0, showAll ? 200 : compact ? 3 : 12).map(({ d, q, s }) => (
          <article className="panel flip-card" key={d.id}>
            <h3>{q.name}</h3>
            <dl className="card-numbers">
              <div>
                <dt>Lowest listed / unit</dt>
                <dd>{money(s.buy)}</dd>
              </div>
              <div>
                <dt>Median listed / unit</dt>
                <dd>{money(q.median)}</dd>
              </div>
              <div>
                <dt>Units listed</dt>
                <dd>
                  {q.quantity === null
                    ? "Unknown"
                    : q.quantity.toLocaleString()}
                </dd>
              </div>
            </dl>
            <div className="candidate-verdict">
              <strong>{listingEvidence(q).title}</strong>
              <p>{listingEvidence(q).reason}</p>
            </div>
            <div className="flip-demand">
              <b>
                {q.soldPerDay === null
                  ? "Unknown"
                  : q.soldPerDay.toLocaleString(undefined, {
                      maximumFractionDigits: 1,
                    }) + " / day"}
              </b>
              <span>inferred market activity · not confirmed sales</span>
            </div>

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
              <div className="scenario-evidence">
                <p className="eyebrow">Resale scenario · not observed profit</p>
                <dl className="mini-stats">
                  <div>
                    <dt>Assumed sell / unit</dt>
                    <dd>{money(s.exit)}</dd>
                  </div>
                  <div>
                    <dt>Potential profit / unit</dt>
                    <dd>{money(s.profit)}</dd>
                  </div>
                </dl>
                <p className="note">
                  {
                    assessCandidate(q, s.profit, s.exit, ITEMS[q.id]?.vendor)
                      .title
                  }
                  :{" "}
                  {
                    assessCandidate(q, s.profit, s.exit, ITEMS[q.id]?.vendor)
                      .reason
                  }
                </p>
                <p className="note">
                  The exit uses an adjustable fraction of reference asking
                  prices, capped by median asks in current-price mode. It is not
                  evidence that a buyer paid that price. Deposits and executable
                  listing depth still need checking.
                </p>
              </div>
              <details className="price-evidence">
                <summary>Price assumptions and source details</summary>{" "}
                <p className="card-note">
                  {d.reference !== null &&
                    d.reference > 0 &&
                    s.buy !== null && (
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
                  {model === "current"
                    ? "Capped at current median; historical ceiling "
                    : "Speculative recovery to "}
                  {exitPercent}% of {basisLabel(d.basis)} ({money(d.reference)})
                  <br />
                  Current median asks: {money(q.median)}
                </p>
                <p className="note">
                  {s.daysSupply === null
                    ? "Days of supply unknown"
                    : s.daysSupply.toFixed(1) +
                      " approximate days of supply"}{" "}
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
                {model === "historical" &&
                  s.exit !== null &&
                  q.median !== null &&
                  s.exit > q.median && (
                    <p className="warning">
                      Resale assumption is{" "}
                      {((s.exit / q.median - 1) * 100).toFixed(0)}% above
                      current median asks. This needs a market recovery, not
                      just a relist.
                    </p>
                  )}
                {ITEMS[q.id]?.vendor !== undefined && (
                  <p className="warning">
                    Vendor competition: catalogue purchase reference{" "}
                    {money(ITEMS[q.id].vendor)} per unit before reputation
                    discounts. Check NPC stock before buying from the AH.
                    {q.id === 2320 && (
                      <>
                        {" "}
                        <a
                          href="https://wow-forever.gg/spotlight/coarse-thread/"
                          target="_blank"
                          rel="noreferrer"
                        >
                          Vendor check ↗
                        </a>
                      </>
                    )}
                  </p>
                )}
                {q.observedAt &&
                  Date.now() - Date.parse(q.observedAt) > 3600000 && (
                    <p className="warning">
                      Quote is{" "}
                      {Math.floor(
                        (Date.now() - Date.parse(q.observedAt)) / 60000,
                      )}{" "}
                      minutes old. Verify the current in-game price before
                      buying.
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
              </details>
              <FlipDetail
                q={q}
                reference={d.reference}
                basis={basisLabel(d.basis)}
                percent={exitPercent}
                model={model}
                load={load}
                draft={drafts[q.id] || { exit: null, deposit: 0, qty: 1 }}
                change={(patch) =>
                  setDrafts((old) => ({
                    ...old,
                    [q.id]: {
                      ...(old[q.id] || { exit: null, deposit: 0, qty: 1 }),
                      ...patch,
                    },
                  }))
                }
              />
              <p className="note">
                Independent market checks:{" "}
                <a
                  href="https://hyjal.cc/auctions/eu/rp-pve/alliance"
                  target="_blank"
                  rel="noreferrer"
                >
                  Hyjal EU RP Alliance
                </a>{" "}
                ·{" "}
                <a
                  href="https://wowauctionhouse.com/forever/eu/rp-alliance/"
                  target="_blank"
                  rel="noreferrer"
                >
                  WoW Auction House EU RP Alliance
                </a>
                . Search this item and compare timestamps; their estimates and
                scans may differ.
              </p>
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
          Show all {rows.length} provider leads
        </button>
      )}
      <details className="panel">
        <summary>How to use this scanner</summary>
        <p>
          The front of each card shows provider-reported listing data, not
          realized trades. Optional potential profit includes one 5% AH cut and
          excludes lost deposits. Search covers these provider leads, not every
          item in the game. Choose a scan, compare daily activity and profit,
          then inspect the actual listings before buying. Try a small position
          first. Your own listing competes with other sellers, so market volume
          is not a promise of personal sales.
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
  model,
  load,
  draft,
  change,
}: {
  draft: { exit: number | null; deposit: number | null; qty: number };
  change: (
    patch: Partial<{
      exit: number | null;
      deposit: number | null;
      qty: number;
    }>,
  ) => void;
  q: Quote;
  reference: number | null;
  basis: string;
  percent: number;
  model: "current" | "historical";
  load: (id: number) => Promise<void>;
}) {
  const { exit, deposit, qty } = draft;
  const [loading, setLoading] = useState(false),
    [error, setError] = useState("");
  const s = flipScenario(
    q,
    reference,
    percent,
    exit,
    deposit ?? 0,
    Date.now(),
    model,
  );
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
      {q.history && (q.historyExpiresAt ?? q.expiresAt) > Date.now() && (
        <PriceContext q={q} />
      )}
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
          onChange={(exit) => change({ exit })}
        />
        <MoneyInput
          label="Lost deposit allowance / unit"
          allowUnknown={false}
          value={deposit}
          onChange={(deposit) => change({ deposit })}
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
              if (Number.isInteger(n) && n > 0 && n <= 1000) change({ qty: n });
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
