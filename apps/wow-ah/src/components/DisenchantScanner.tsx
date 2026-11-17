import {
  DE_REFERENCE,
  DE_CLASSIC_REFERENCE,
} from "../catalog/disenchantTables";
import { DE_LIMIT } from "../market/disenchant";
import { useMemo, useState } from "react";
import type { MarketData, Quote } from "../types";
import { analyzeDisenchant } from "../engine/disenchant";
import { listingEvidence } from "../engine/assessment";
import { ITEMS } from "../catalog/items";
import { money } from "../engine/money";
import { MoneyInput } from "./MoneyInput";
type Draft = {
  buy: number | null;
  lost: number;
  prices: Record<number, number>;
};
const emptyDraft = (): Draft => ({ buy: null, lost: 0, prices: {} });
const percent = (v: number | null) =>
  v === null
    ? "Unknown"
    : (v * 100).toLocaleString(undefined, { maximumFractionDigits: 2 }) + "%";
const observed = (q: Quote | undefined) =>
  q?.observedAt ? new Date(q.observedAt).toLocaleString() : "Unknown";
export function DisenchantScanner({
  market,
  loading,
  copy,
  active,
}: {
  market: MarketData;
  active: boolean;
  loading: boolean;
  copy: (s: string) => Promise<void>;
}) {
  const [search, setSearch] = useState(""),
    [sort, setSort] = useState("profit"),
    [view, setView] = useState<"top" | "all">("top"),
    [maximum, setMaximum] = useState<number | null>(null),
    [minimumChance, setMinimumChance] = useState(0),
    [positive, setPositive] = useState(false),
    [basis, setBasis] = useState<"ask" | "median">("ask"),
    [shown, setShown] = useState(10),
    [drafts, setDrafts] = useState<Record<number, Draft>>({});
  const scan = market.deScan;
  const getQuote = (id: number) => {
    const q = market.quotes[id];
    return q?.expiresAt > Date.now() ? q : undefined;
  };
  const name = (id: number) =>
    scan?.names[id] ??
    market.quotes[id]?.name ??
    ITEMS[id]?.name ??
    `Item #${id}`;
  const rows = useMemo(
    () =>
      (scan?.candidates || [])
        .map((candidate) => {
          const draft = drafts[candidate.id] ?? emptyDraft(),
            quote = getQuote(candidate.id);
          const buy =
            draft.buy ?? (quote?.quantity === 0 ? null : (quote?.ask ?? null));
          const prices: Record<number, number | null> = {};
          for (const o of candidate.outcomes || [])
            for (const d of o.drops)
              prices[d.id] =
                draft.prices[d.id] ?? getQuote(d.id)?.[basis] ?? null;
          return {
            candidate,
            draft,
            quote,
            buy,
            prices,
            result: analyzeDisenchant(
              candidate.outcomes,
              prices,
              buy,
              draft.lost,
            ),
          };
        })
        .filter((r) => {
          const text = [
            r.candidate.name,
            String(r.candidate.id),
            ...(r.candidate.outcomes || []).flatMap((o) =>
              o.drops.map((d) => name(d.id)),
            ),
          ]
            .join(" ")
            .toLowerCase();
          return (
            (view === "all" ||
              (r.candidate.tableOrigin !== "provider" &&
                r.result.profit !== null &&
                r.result.profit > 0 &&
                (r.quote?.quantity ?? 0) > 0)) &&
            search
              .toLowerCase()
              .trim()
              .split(/\s+/)
              .every((term) => text.includes(term)) &&
            (maximum === null || (r.buy !== null && r.buy <= maximum)) &&
            (!positive || (r.result.profit !== null && r.result.profit > 0)) &&
            (minimumChance === 0 ||
              (r.result.chanceProfit !== null &&
                r.result.chanceProfit >= minimumChance))
          );
        })
        .sort((a, b) =>
          sort === "chance"
            ? (b.result.chanceProfit ?? -1) - (a.result.chanceProfit ?? -1) ||
              (b.result.profit ?? -Infinity) - (a.result.profit ?? -Infinity)
            : sort === "cost"
              ? (a.buy ?? Infinity) - (b.buy ?? Infinity)
              : (b.result.profit ?? -Infinity) - (a.result.profit ?? -Infinity),
        ),
    [
      market,
      search,
      sort,
      maximum,
      minimumChance,
      positive,
      basis,
      drafts,
      view,
    ],
  );
  const isManual = (row: (typeof rows)[number]) =>
    row.draft.buy !== null ||
    row.draft.lost !== 0 ||
    Object.keys(row.draft.prices).length > 0;
  const visibleRows =
    view === "top"
      ? rows.slice(0, 10)
      : [
          ...rows.filter(isManual),
          ...rows.filter((row) => !isManual(row)).slice(0, shown),
        ];
  const change = (id: number, patch: Partial<Draft>) => {
    setView("all");
    setDrafts((old) => ({
      ...old,
      [id]: { ...(old[id] ?? emptyDraft()), ...patch },
    }));
  };
  const priceChange = (id: number, material: number, value: number | null) => {
    setView("all");
    setDrafts((old) => {
      const draft = old[id] ?? emptyDraft(),
        prices = { ...draft.prices };
      if (value === null) delete prices[material];
      else prices[material] = value;
      return { ...old, [id]: { ...draft, prices } };
    });
  };
  if (!active) return null;
  return (
    <>
      <section className="page-heading">
        <h1>Disenchant scanner</h1>
        <p>Ranked gear-to-material opportunities.</p>
      </section>
      <section
        className="panel de-controls"
        aria-label="Disenchant scan controls"
      >
        <div
          className="button-row"
          role="group"
          aria-label="Disenchant result view"
        >
          <button
            aria-pressed={view === "top"}
            onClick={() => {
              setView("top");
              setShown(10);
            }}
          >
            Top 10 to verify
          </button>
          <button
            aria-pressed={view === "all"}
            onClick={() => {
              setView("all");
              setShown(10);
            }}
          >
            All candidates
          </button>
        </div>
        <div className="form-grid">
          <label>
            Find gear or material
            <input
              type="search"
              value={search}
              placeholder="Gear name, item ID, Vision Dust…"
              onChange={(e) => {
                setSearch(e.target.value);
                setShown(10);
              }}
            />
          </label>
        </div>
        <details>
          <summary>Price basis and filters</summary>
          <div className="form-grid">
            <label>
              Rank disenchant results
              <select
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value);
                  setShown(10);
                }}
              >
                <option value="profit">Expected profit / item</option>
                <option value="chance">Modeled chance of profit</option>
                <option value="cost">Lowest purchase price</option>
              </select>
            </label>
            <label>
              Material resale quotes
              <select
                value={basis}
                onChange={(e) => setBasis(e.target.value as "ask" | "median")}
              >
                <option value="ask">Current lowest asking prices</option>
                <option value="median">Current median asking prices</option>
              </select>
            </label>
            <MoneyInput
              label="Maximum gear price / item"
              value={maximum}
              onChange={setMaximum}
            />
            <label>
              Minimum modeled chance of profit
              <select
                value={minimumChance}
                onChange={(e) => setMinimumChance(+e.target.value)}
              >
                {[0, 0.25, 0.5, 0.75, 1].map((p) => (
                  <option key={p} value={p}>
                    {p === 0 ? "Any / unknown" : percent(p)}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <label className="inline">
            <input
              type="checkbox"
              checked={positive}
              onChange={(e) => setPositive(e.target.checked)}
            />
            Only positive expected profit
          </label>
        </details>
      </section>
      <div className="section-title">
        <p className="note">
          {view === "top" ? Math.min(10, rows.length) : rows.length} /{" "}
          {scan?.candidates.length ?? 0} candidates
        </p>
        <a
          className="credit"
          href={scan?.source || "https://ahledger.com"}
          target="_blank"
          rel="noreferrer"
        >
          Prices from AHledger ↗
        </a>
      </div>
      <p className="note de-assumption">
        {view === "top"
          ? "Top 10 from up to 200 listings. "
          : "Includes incomplete and unverified scenarios. "}
        Returns assume sale after the 5% cut; drop odds are not sale odds.
      </p>
      {loading && <p role="status">Scanning gear and material quotes…</p>}
      {market.errors.length > 0 && (
        <p className="alert" role="alert">
          {market.errors.join(" ")} Unpriced materials remain unknown. Use
          Refresh to retry.
        </p>
      )}
      {scan?.pricingTruncated && (
        <p className="note">
          Quote requests are limited to 1,000 distinct material IDs. Additional
          prices stay unknown.
        </p>
      )}
      {!loading && !rows.length && (
        <section className="empty">
          <h2>
            {view === "top"
              ? "No qualifying plays in this scan"
              : "No matching disenchant candidates"}
          </h2>
          <p>
            {view === "top"
              ? "Try All candidates to inspect missing quotes or unverified tables. Fewer than 10 qualifying items are never padded with guesses."
              : "Check the filters or refresh the feed. Missing prices stay unknown."}
          </p>
        </section>
      )}
      <div className="de-grid">
        {visibleRows.map(
          ({ candidate: c, draft, quote, buy, prices, result: r }, index) => {
            const materialIds = [
              ...new Set(
                (c.outcomes || []).flatMap((o) => o.drops.map((d) => d.id)),
              ),
            ];
            const usedQuotes = [quote, ...materialIds.map(getQuote)];
            const old = usedQuotes.some(
              (q) =>
                q?.observedAt &&
                Date.now() - Date.parse(q.observedAt) > 3600000,
            );
            const unknownAge = usedQuotes.some(
              (q) =>
                !q?.observedAt ||
                Date.parse(q.observedAt) > Date.now() + 300000,
            );
            const manual =
              draft.buy !== null ||
              Object.keys(draft.prices).length > 0 ||
              draft.lost !== 0;
            return (
              <article className="panel de-card" key={c.id}>
                <h2>
                  {view === "top" && (
                    <span className="de-rank">#{index + 1} · </span>
                  )}
                  {c.name}
                </h2>
                <p className="note">
                  {c.quality.toLowerCase()}
                  {c.level !== null ? ` · item level ${c.level}` : ""} ·{" "}
                  {quote?.quantity ?? "unknown"} units listed
                </p>
                <dl className="de-numbers">
                  <div>
                    <dt>Buy / item{draft.buy !== null ? " · override" : ""}</dt>
                    <dd>{money(buy)}</dd>
                  </div>
                  <div>
                    <dt>Expected profit / item</dt>
                    <dd>{money(r.profit)}</dd>
                  </div>
                  <div>
                    <dt>Modeled chance of profit</dt>
                    <dd>
                      {r.quantityAssumed && r.chanceProfit !== null ? "≈" : ""}
                      {percent(r.chanceProfit)}
                    </dd>
                  </div>
                </dl>
                <p className="note">
                  Expected material recovery after AH cut: <b>{money(r.net)}</b>
                  .
                </p>
                <p className="note">
                  One-item profit range: <b>{money(r.worst)}</b> to{" "}
                  <b>{money(r.best)}</b>.
                </p>
                {r.profit !== null && r.profit <= 0 && (
                  <p className="warning">
                    No positive expected margin at these prices.
                  </p>
                )}
                {r.profit !== null &&
                  r.profit > 0 &&
                  r.worst !== null &&
                  r.worst < 0 && (
                    <p className="warning">
                      Positive average, but one item can lose gold. Modeled loss
                      chance: {percent(r.chanceLoss)}.
                    </p>
                  )}
                {r.quantityAssumed && (
                  <p className="note">
                    Quantity ranges use equal chances for each count. Exact
                    count odds are not supplied.
                  </p>
                )}
                {old && (
                  <p className="warning">
                    At least one price observation is over an hour old. Recheck
                    the listing and material prices.
                  </p>
                )}
                {unknownAge && (
                  <p className="note">
                    Some price observation times are unverified. A refresh time
                    is not an observation time.
                  </p>
                )}
                {materialIds.some((id) => getQuote(id)?.soldPerDay === 0) ? (
                  <p className="warning">
                    No recent inferred sales for at least one material. The
                    quoted profit may be difficult to realise.
                  </p>
                ) : (
                  materialIds.some(
                    (id) => getQuote(id)?.soldPerDay == null,
                  ) && (
                    <p className="note">
                      Material demand is unverified; this ranking measures
                      expected value, not speed of sale.
                    </p>
                  )
                )}
                {c.tableOrigin === "provider" && (
                  <p className="warning">
                    Loot table needs item-level verification; excluded from Top
                    10.
                  </p>
                )}
                {manual && (
                  <p className="note">
                    <b>Manual scenario in use.</b> Overrides are not new market
                    observations. Edited scenarios stay first in All candidates;
                    filters still apply.
                  </p>
                )}
                {r.error && <p className="warning">{r.error}</p>}
                {r.missing.length > 0 && (
                  <p className="note">
                    Missing resale quotes: {r.missing.map(name).join(", ")}.
                    Expected totals and profit odds stay unknown.
                  </p>
                )}
                <div className="row-actions">
                  <button onClick={() => void copy(c.name)}>
                    Copy gear name
                  </button>
                  <a href={c.url} target="_blank" rel="noreferrer">
                    Inspect gear source ↗
                  </a>
                </div>
                <details>
                  <summary>Loot table, prices & calculator</summary>
                  <h3>Possible drops</h3>
                  <p className="note">
                    {c.tableOrigin === "checked"
                      ? "Checked item table takes precedence over the provider baseline."
                      : c.tableOrigin === "reference"
                        ? "The supplied table matches a local item-level reference model. Special item exceptions still need checking."
                        : "Provider baseline loot table; not independently verified for this item."}{" "}
                    Outcomes below are alternatives, not a combined shopping
                    basket.{" "}
                    {c.tableOrigin === "reference" && (
                      <>
                        <a href={DE_REFERENCE} target="_blank" rel="noreferrer">
                          Forever reference ↗
                        </a>
                        {" · "}
                        <a
                          href={DE_CLASSIC_REFERENCE}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Classic comparison ↗
                        </a>
                      </>
                    )}
                  </p>
                  <ol className="de-outcomes">
                    {(c.outcomes || []).map((o, i) => {
                      const b = r.branches[i];
                      return (
                        <li key={i}>
                          <b>
                            {percent(o.probability)} ·{" "}
                            {o.drops
                              .map(
                                (d) =>
                                  `${d.min === d.max ? d.min : d.min + "–" + d.max} ${name(d.id)}`,
                              )
                              .join(" + ")}
                          </b>
                          <p className="note">
                            Net recovery for this outcome:{" "}
                            {money(
                              b?.low === null || b?.low === undefined
                                ? null
                                : b.low / 100,
                            )}{" "}
                            to{" "}
                            {money(
                              b?.high === null || b?.high === undefined
                                ? null
                                : b.high / 100,
                            )}
                            .
                          </p>
                          <p className="note">
                            Weighted contribution: {percent(o.probability)} × (
                            {o.drops
                              .map(
                                (d) =>
                                  `${((d.min + d.max) / 2).toLocaleString()} × ${money(prices[d.id])}`,
                              )
                              .join(" + ")}
                            ) × 95% ={" "}
                            {money(
                              b?.gross == null
                                ? null
                                : o.probability * b.gross * 0.95,
                            )}
                            .
                          </p>
                        </li>
                      );
                    })}
                  </ol>
                  <h3>Material prices</h3>
                  {materialIds.map((id) => {
                    const q = getQuote(id),
                      override = draft.prices[id];
                    return (
                      <section
                        className="de-material"
                        key={id}
                        aria-label={name(id) + " price"}
                      >
                        <h4>{name(id)}</h4>
                        <p>
                          Gross quote / unit: <b>{money(prices[id])}</b> · after
                          AH cut:{" "}
                          <b>
                            {money(
                              prices[id] === null ? null : prices[id]! * 0.95,
                            )}
                          </b>
                          .
                        </p>
                        <p className="note">
                          {override !== undefined
                            ? "Your manual scenario"
                            : basis === "ask"
                              ? "Lowest asking price"
                              : "Median asking price"}{" "}
                          · observed {observed(q)}. Inferred market activity:{" "}
                          {q?.soldPerDay == null
                            ? "unknown"
                            : `${q.soldPerDay.toLocaleString()}/day`}
                          ; not your sale probability.
                        </p>
                        <MoneyInput
                          label={`Override ${name(id)} gross / unit`}
                          value={override ?? null}
                          onChange={(value) => priceChange(c.id, id, value)}
                        />
                        <a
                          href={q?.url || `https://ahledger.com/items/${id}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Material price source ↗
                        </a>
                      </section>
                    );
                  })}
                  <h3>Test this purchase</h3>
                  <p className="note">
                    Gear listing observed: {observed(quote)}.{" "}
                    {quote
                      ? listingEvidence(quote).reason
                      : "No current purchase quote is available."}{" "}
                    Listed quantity is not proof that every unit is available at
                    the lowest price.
                  </p>
                  <div className="form-grid">
                    <MoneyInput
                      label="Override gear buy price / item"
                      value={draft.buy}
                      onChange={(value) => change(c.id, { buy: value })}
                    />
                    <MoneyInput
                      label="Lost-deposit allowance / disenchant"
                      value={draft.lost}
                      allowUnknown={false}
                      onChange={(value) => change(c.id, { lost: value ?? 0 })}
                    />
                  </div>
                  {manual && (
                    <button
                      onClick={() =>
                        setDrafts((old) => {
                          const next = { ...old };
                          delete next[c.id];
                          return next;
                        })
                      }
                    >
                      Use feed prices and zero lost deposits
                    </button>
                  )}
                  <h3>The calculation</h3>
                  <p className="note">
                    Known NPC resale value for the original item:{" "}
                    {money(c.vendorSell)}.{" "}
                    {c.vendorSell !== null &&
                    r.net !== null &&
                    c.vendorSell > r.net - draft.lost
                      ? "Vendoring pays more than the modeled disenchant recovery."
                      : c.vendorSell === null
                        ? "Check this alternative before destroying valuable gear."
                        : "Compare this with the recovery before choosing to disenchant."}
                  </p>
                  <p>
                    Expected gross materials {money(r.gross)} × 95% ={" "}
                    {money(r.net)}. Less purchase {money(buy)} and lost deposits{" "}
                    {money(draft.lost)} = <b>{money(r.profit)}</b> expected
                    profit.
                  </p>
                  <p className="note">
                    Break-even purchase price on average:{" "}
                    {r.maxBuy !== null && r.maxBuy < 0
                      ? "None at these costs"
                      : money(r.maxBuy)}
                    . Covering costs, including an exact tie:{" "}
                    {percent(r.chanceBreakEven)}. Profit requires strictly more
                    than the costs.
                  </p>
                  {r.quantityAssumed && r.chanceBounds && (
                    <p className="note">
                      Without assuming how often each quantity occurs, the
                      supplied ranges only constrain chance of profit to{" "}
                      {percent(r.chanceBounds[0])}–{percent(r.chanceBounds[1])}.
                      The displayed point estimate uses equal count odds.
                    </p>
                  )}
                  <p className="note">
                    Posting deposits still need funding upfront. This allowance
                    covers deposits lost to expiry; returned deposits are not
                    income. Rounding each actual auction can move the result by
                    a few copper.
                  </p>
                  {[...new Set((c.outcomes || []).map((o) => o.source))].map(
                    (url) => (
                      <p className="note" key={url}>
                        <a href={url} target="_blank" rel="noreferrer">
                          {c.tableOrigin === "checked"
                            ? "Checked loot reference"
                            : "Provider outcome source"}{" "}
                          ↗
                        </a>
                      </p>
                    ),
                  )}
                </details>
              </article>
            );
          },
        )}
      </div>
      {view === "all" &&
        rows.filter((row) => !isManual(row)).length > shown && (
          <button className="wide" onClick={() => setShown((n) => n + 10)}>
            Show more disenchant candidates
          </button>
        )}
      {scan && (scan.rejected > 0 || scan.total > DE_LIMIT) && (
        <p className="note">
          {scan.rejected} invalid, duplicate or known
          non-auctionable/non-disenchantable rows excluded.
          {scan.total > DE_LIMIT
            ? " This view is limited to the first 200 returned rows."
            : ""}
        </p>
      )}
      <details className="panel">
        <summary>How the odds and prices work</summary>
        <p>
          Top 10 includes only positive expected profit, quoted stock and
          checked or reference-matched loot tables. It ranks by your selected
          criterion, expected profit per item by default; it does not predict
          sale probability. Manual edits open All candidates so a losing
          scenario remains editable. The scan uses the provider’s returned gear
          set, including negative-margin rows, rather than a fixed recipe
          shortlist. Its coverage is not the complete auction house. Enchanting
          and an eligible item are required; verify actual access in game.
        </p>
        <p>
          For each exclusive drop outcome: probability × average count × quoted
          material price. Sum those values, take the 5% faction AH cut once, and
          subtract the purchase and lost deposits. For profit odds, each integer
          count is evaluated separately. An exact break-even result is not a
          profit.
        </p>
        <p>
          The base loot table may differ for special items or character bonuses.
          Count ranges alone do not establish exact count odds; simultaneous
          ranges are modeled independently. All resale values assume buyers at
          your quotes; inferred activity is not a probability of sale. Prices
          and drafts stay in this visit and are not exported with character
          records.
        </p>
      </details>
    </>
  );
}
