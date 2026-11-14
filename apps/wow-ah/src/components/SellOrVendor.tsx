import { useEffect, useRef, useState } from "react";
import { getCatalogItem, searchCatalog } from "../market/catalog";
import type { CatalogItem, CatalogPage } from "../market/catalog";
import { loadHistory } from "../market/ahledger";
import type { Quote } from "../types";
import { money } from "../engine/money";
import { isAuctionBound } from "../engine/binding";
import { sellDecision } from "../engine/sell";
import { MoneyInput } from "./MoneyInput";
export function SellOrVendor({ active = true }: { active?: boolean }) {
  const [query, setQuery] = useState(""),
    [result, setResult] = useState<CatalogPage | null>(null),
    [searched, setSearched] = useState(""),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [notice, setNotice] = useState(""),
    [selected, setSelected] = useState<CatalogItem | null>(null),
    [quote, setQuote] = useState<Quote | null>(null),
    [detailError, setDetailError] = useState(""),
    [detailBusy, setDetailBusy] = useState(false);
  const searchAbort = useRef<AbortController | null>(null),
    detailAbort = useRef<AbortController | null>(null);
  const comparison = useRef<HTMLElement | null>(null),
    opener = useRef<HTMLElement | null>(null);
  useEffect(() => {
    if (selected && active) {
      comparison.current?.focus();
      comparison.current?.scrollIntoView({ block: "start" });
    }
  }, [selected?.id, active]);
  useEffect(
    () => () => {
      searchAbort.current?.abort();
      detailAbort.current?.abort();
    },
    [],
  );
  useEffect(() => {
    const deadlines = [
      quote?.expiresAt,
      selected?.expiresAt,
      result?.expiresAt,
    ].filter((n): n is number => typeof n === "number" && Number.isFinite(n));
    if (!deadlines.length) return;
    const timer = setTimeout(
      () => {
        const now = Date.now();
        if (result?.expiresAt !== undefined && result.expiresAt <= now) {
          setResult(null);
          setNotice("Catalogue results expired. Search again to refresh them.");
        }
        if (quote && quote.expiresAt <= now) {
          setQuote(null);
          setDetailError(
            "AH quote expired. Refresh the comparison before relying on its price.",
          );
        }
        if (selected?.expiresAt !== undefined && selected.expiresAt <= now) {
          setSelected({
            id: selected.id,
            name: "Item #" + selected.id,
            quality: "unknown",
            url: "https://thewowdb.com",
          });
          setDetailError(
            "Item facts expired. Refresh the comparison to check vendor value and binding.",
          );
        }
      },
      Math.max(1, Math.min(...deadlines) - Date.now()),
    );
    return () => clearTimeout(timer);
  }, [quote, selected, result]);
  async function search(text: string, page = 1) {
    searchAbort.current?.abort();
    const c = new AbortController();
    searchAbort.current = c;
    setBusy(true);
    setError("");
    setNotice("");
    setResult(null);
    setSearched(text);
    detailAbort.current?.abort();
    setSelected(null);
    setQuote(null);
    setDetailBusy(false);
    try {
      const r = await searchCatalog(text, page, c.signal);
      if (!c.signal.aborted) setResult(r);
    } catch (e) {
      if (!c.signal.aborted) setError((e as Error).message);
    } finally {
      if (!c.signal.aborted) setBusy(false);
    }
  }
  async function select(v: CatalogItem) {
    if (selected?.id !== v.id)
      opener.current = document.activeElement as HTMLElement;
    detailAbort.current?.abort();
    const c = new AbortController();
    detailAbort.current = c;
    setSelected(
      v.expiresAt !== undefined && v.expiresAt <= Date.now()
        ? {
            id: v.id,
            name: "Item #" + v.id,
            quality: "unknown",
            url: "https://thewowdb.com",
          }
        : v,
    );
    setQuote(null);
    setDetailError("");
    setDetailBusy(true);
    const responses = await Promise.allSettled([
      getCatalogItem(v.id, c.signal),
      loadHistory(v.id, c.signal),
    ]);
    if (c.signal.aborted) return;
    const messages: string[] = [];
    if (responses[0].status === "fulfilled") setSelected(responses[0].value);
    else
      messages.push("Vendor facts unavailable: " + responses[0].reason.message);
    if (responses[1].status === "fulfilled") setQuote(responses[1].value);
    else messages.push("AH quote unavailable: " + responses[1].reason.message);
    setDetailError(messages.join(" "));
    setDetailBusy(false);
  }
  return (
    <>
      <section className="page-heading">
        <h1>Sell on the AH or vendor?</h1>
        <p>
          Search an item you own. Compare vendor value with AH proceeds after
          the 5% cut.
        </p>
      </section>
      <form
        className="panel item-search"
        onSubmit={(e) => {
          e.preventDefault();
          void search(query);
        }}
      >
        <label>
          Item name, ID or pasted item link
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            maxLength={300}
            placeholder="Coarse Thread, 2320, or an item link"
          />
        </label>
        <button type="submit" className="primary" disabled={busy}>
          {busy ? "Searching…" : "Search items"}
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={() => {
            setQuery("");
            void search("");
          }}
        >
          Browse catalogue
        </button>
      </form>
      {!result && !busy && !error && !selected && (
        <p className="note">
          Search covers TheWoWDB’s Forever catalogue, including items without AH
          prices. Some live or hidden items may be absent from its current
          build. No character setup is needed.
        </p>
      )}
      {error && (
        <p className="alert" role="alert">
          {error} Try again or check the{" "}
          <a
            href="https://thewowdb.com/wow-forever/items/"
            target="_blank"
            rel="noreferrer"
          >
            source catalogue
          </a>
          .
        </p>
      )}
      {notice && (
        <p className="note" role="status">
          {notice}
        </p>
      )}
      {busy && <p role="status">Searching the Forever catalogue…</p>}
      {selected && (
        <section
          className="panel item-comparison"
          ref={comparison}
          tabIndex={-1}
          aria-label="Selected item"
        >
          <div className="section-title">
            <h2>{selected.name}</h2>
            <button
              className="text-button"
              onClick={() => {
                detailAbort.current?.abort();
                setSelected(null);
                setQuote(null);
                requestAnimationFrame(() => opener.current?.focus());
              }}
            >
              Close comparison
            </button>
          </div>
          {detailBusy && (
            <p role="status">Loading vendor value and EU RP Alliance quote…</p>
          )}
          <Comparison
            key={selected.id}
            item={selected}
            quote={quote}
            busy={detailBusy}
            refresh={() => void select(selected)}
          />
          {detailError && (
            <p className="note" role="status">
              {detailError}
            </p>
          )}
          <p className="credit">
            <a href={selected.url} target="_blank" rel="noreferrer">
              Data from TheWoWDB ↗
            </a>{" "}
            ·{" "}
            <a
              href={quote?.url || "https://ahledger.com"}
              target="_blank"
              rel="noreferrer"
            >
              Prices from AHledger ↗
            </a>
          </p>
        </section>
      )}
      {result && (
        <section aria-label="Catalogue results">
          <div className="section-title">
            <h2>
              {result.items.length
                ? `Choose an item to compare`
                : "No matching items"}
            </h2>
            <span className="note">
              {result.items.length} items · page {result.page}
              {result.total !== null ? " · " + result.total + " matches" : ""}
            </span>
          </div>
          <ul className="catalog-results">
            {result.items.map((v) => (
              <li key={v.id}>
                <button
                  onClick={() => void select(v)}
                  aria-pressed={selected?.id === v.id}
                >
                  <span>{v.name}</span>
                  <small>
                    #{v.id} · {v.quality}
                  </small>
                </button>
              </li>
            ))}
          </ul>
          <div className="actions">
            <button
              disabled={result.page <= 1 || busy}
              onClick={() => void search(searched, result.page - 1)}
            >
              Previous page
            </button>
            <button
              disabled={!result.hasMore || result.page >= 200 || busy}
              onClick={() => void search(searched, result.page + 1)}
            >
              Next page
            </button>
          </div>
          <p className="credit">
            <a href="https://thewowdb.com" target="_blank" rel="noreferrer">
              Catalogue data from TheWoWDB ↗
            </a>
          </p>
        </section>
      )}
      <details className="panel">
        <summary>What the comparison includes</summary>
        <p>
          Vendor value is what an NPC pays you, not what the NPC charges. AH
          proceeds assume the item sells at the displayed gross price and
          include one 5% cut. Successful deposits return; expired listings can
          cost extra. Estimated daily activity is market-wide and does not
          guarantee your sale.
        </p>
        <p>
          Equipped or already soulbound items cannot be auctioned. This compares
          gold only: keep anything you need for use, quests or crafting.
          Catalogue records can include beta or unused items; check the name and
          ID against your inventory. Catalogue facts are identified by build; AH
          prices come only from EU RP Alliance, not the other-region prices
          embedded in catalogue data.
        </p>
      </details>
    </>
  );
}
function Comparison({
  item,
  quote,
  refresh,
  busy,
}: {
  item: CatalogItem;
  quote: Quote | null;
  refresh: () => void;
  busy: boolean;
}) {
  const [qty, setQty] = useState(1),
    [override, setOverride] = useState<number | null>(null),
    [vendorOverride, setVendorOverride] = useState<number | null>(null),
    [lost, setLost] = useState<number | null>(0),
    [soulbound, setSoulbound] = useState(false);
  const automaticBound = isAuctionBound(item.binding),
    bound = automaticBound || soulbound,
    factsReady =
      item.vendorSell !== undefined &&
      item.binding !== undefined &&
      (item.expiresAt === undefined || item.expiresAt > Date.now()),
    eligibilityUnknown = !factsReady && !bound,
    validQuote = quote && quote.expiresAt > Date.now() ? quote : null,
    ask = override ?? validQuote?.ask ?? null,
    vendor = vendorOverride ?? item.vendorSell ?? null,
    old =
      !validQuote?.observedAt ||
      Date.now() - Date.parse(validQuote.observedAt) > 3600000;
  const d = sellDecision(
    vendor,
    ask,
    qty,
    lost ?? 0,
    bound || eligibilityUnknown,
    override !== null ? false : old,
  );
  return (
    <>
      <div className="decision-summary">
        <h3>{eligibilityUnknown ? "Refresh item facts" : d.title}</h3>
        <p>
          {eligibilityUnknown
            ? "Current item facts are needed to check whether this item can be auctioned. Price overrides do not confirm auction eligibility."
            : d.title === "Refresh the AH quote"
              ? "The quote is over an hour old or has no observation time. Check the current in-game price before choosing."
              : bound
                ? "Check whether you still need it before vendoring."
                : d.extra === null
                  ? "A missing price is unknown, not zero."
                  : d.extra > 0
                    ? `The AH scenario pays ${money(d.extra)} more for ${qty} ${qty === 1 ? "unit" : "units"} if all sell.`
                    : `At this sale price, vendoring returns ${money(Math.abs(d.extra))} more, or the same amount.`}
        </p>
      </div>
      {item.vendorReference && (
        <p className="note">
          Forever vendor correction:{" "}
          <a
            href={item.vendorReference.source}
            target="_blank"
            rel="noreferrer"
          >
            Blizzard's price update ↗
          </a>{" "}
          · checked {item.vendorReference.checkedAt}. The catalogue can retain
          Classic vendor values.
        </p>
      )}
      {(override !== null || vendorOverride !== null) && (
        <div className="note" role="status">
          <p>
            {override !== null ? "Manual AH price is in use. " : ""}
            {vendorOverride !== null ? "Manual vendor value is in use." : ""}
          </p>
          {override !== null && (
            <button onClick={() => setOverride(null)}>Use market quote</button>
          )}
          {vendorOverride !== null && (
            <button onClick={() => setVendorOverride(null)}>
              {item.vendorReference
                ? "Use corrected vendor reference"
                : "Use catalogue vendor value"}
            </button>
          )}
        </div>
      )}
      <dl className="summary-strip">
        <div>
          <dt>
            Vendor · {qty} {qty === 1 ? "unit" : "units"}
          </dt>
          <dd>{money(d.vendorTotal)}</dd>
        </div>
        <div>
          <dt>
            AH after cut · {qty} {qty === 1 ? "unit" : "units"}
          </dt>
          <dd>{money(d.ahNet)}</dd>
        </div>
        <div>
          <dt>AH price to beat vendor / unit</dt>
          <dd>{money(d.minGross)}</dd>
        </div>
      </dl>
      <div className="form-grid">
        <label>
          Quantity owned
          <input
            type="number"
            min="1"
            max="1000000"
            value={qty}
            onChange={(e) => {
              const n = +e.target.value;
              if (Number.isInteger(n) && n > 0 && n <= 1000000) setQty(n);
            }}
          />
        </label>
        {eligibilityUnknown ? (
          <p className="note">
            Auction eligibility is unknown until item facts are refreshed.
          </p>
        ) : (
          <label className="inline">
            <input
              type="checkbox"
              checked={bound}
              disabled={automaticBound}
              onChange={(e) => setSoulbound(e.target.checked)}
            />
            Item is already soulbound
          </label>
        )}
      </div>
      <p className="note">
        {override !== null
          ? "Manual sale-price scenario."
          : validQuote
            ? `AH quote: ${money(validQuote.ask)} / unit · observed ${validQuote.observedAt ? new Date(validQuote.observedAt).toLocaleString() : "at an unknown time"}.`
            : "No unexpired AH quote."}{" "}
        {validQuote?.soldPerDay === null || !validQuote
          ? "Demand unknown."
          : `${validQuote.soldPerDay.toLocaleString()} estimated units/day.`}
      </p>
      <button disabled={busy} onClick={refresh}>
        Refresh comparison
      </button>
      <details>
        <summary>Adjust prices and see item facts</summary>
        <div className="form-grid">
          <MoneyInput
            label="Gross AH price / unit · optional override"
            value={override}
            onChange={setOverride}
          />
          <MoneyInput
            label="Vendor sell value / unit · optional override"
            value={vendorOverride}
            onChange={setVendorOverride}
          />
          <MoneyInput
            label="Allowance for lost deposits · total"
            allowUnknown={false}
            value={lost}
            onChange={setLost}
          />
        </div>
        <p className="note">
          Catalogue: {item.build || "build unavailable"} · binding:{" "}
          {item.binding || "not specified"}. Verify the vendor offer in game if
          the item was changed after this build.
        </p>
      </details>
    </>
  );
}
