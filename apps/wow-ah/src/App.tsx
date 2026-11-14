import {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type {
  Action,
  Character,
  MarketData,
  Profession,
  Quote,
  Recipe,
  SavedState,
} from "./types";
import { MARKET, PROFESSIONS } from "./types";
import { ITEMS, itemName } from "./catalog/items";
import { RECIPES, CONVERSIONS, recipeById } from "./catalog/recipes";
import {
  patternPayback,
  access,
  batchPlan,
  craftCost,
  disenchantValue,
  evaluate,
  exitFor,
  levelRoute,
  quoteFor,
  skillChance,
} from "./engine/planner";
import type { Evaluation } from "./engine/planner";
import { money, net, copper } from "./engine/money";
import { defaults, STORE, transfer, validateState } from "./state/profile";
import {
  loadHistory,
  loadMarket,
  purgeExpired,
  unknownMarket,
} from "./market/ahledger";
import { SellOrVendor } from "./components/SellOrVendor";
import { FlipScanner } from "./components/FlipScanner";
import { loadScanner, DEFAULT_SCAN } from "./market/scanner";
import type { ScanFilters } from "./market/scanner";
import { MoneyInput } from "./components/MoneyInput";
const uid = () => crypto.randomUUID(),
  time = (s: string | null) =>
    s
      ? new Date(s).toLocaleString(undefined, {
          dateStyle: "medium",
          timeStyle: "short",
        })
      : "No observation",
  kindLabel: Record<Action["kind"], string> = {
    craft: "Craft & sell",
    "craft-de": "Craft & disenchant",
    "buy-de": "Buy & disenchant",
    convert: "Material conversion",
    resell: "Direct resale",
  };
function download(name: string, data: string) {
  const url = URL.createObjectURL(
      new Blob([data], { type: "application/json" }),
    ),
    a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
function quoteAge(q: Quote | undefined) {
  return !q?.observedAt
    ? "No scan time"
    : Date.now() - Date.parse(q.observedAt) > 6 * 3600_000
      ? "Old scan · " + time(q.observedAt)
      : time(q.observedAt);
}
function Demand({ q }: { q: Quote | undefined }) {
  return (
    <span className="demand">
      {q?.soldPerDay == null
        ? "Insufficient sales data"
        : q.soldPerDay === 0
          ? "0/day estimated · zero inferred"
          : q.soldPerDay.toLocaleString() + "/day estimated"}
      {q?.quantity != null
        ? " · " + q.quantity.toLocaleString() + " listed"
        : ""}
    </span>
  );
}
function Credit({ url = "https://ahledger.com" }: { url?: string }) {
  return (
    <a
      className="credit"
      href={url || "https://ahledger.com"}
      target="_blank"
      rel="noreferrer"
    >
      Prices from AHledger ↗
    </a>
  );
}
function CostLines({ e }: { e: Evaluation }) {
  return (
    <>
      <div
        className="scroll-table"
        tabIndex={0}
        role="region"
        aria-label="Input cost details"
      >
        <table>
          <thead>
            <tr>
              <th>Input</th>
              <th>Units</th>
              <th>Additional cash</th>
              <th>Source</th>
            </tr>
          </thead>
          <tbody>
            {e.cost.lines.map((l, i) => (
              <tr key={i}>
                <td>{itemName(l.id)}</td>
                <td>{l.qty}</td>
                <td>{money(l.cash)}</td>
                <td>
                  <small>
                    {l.source}
                    <br />
                    {l.observedAt ? time(l.observedAt) : "No live observation"}
                  </small>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {e.cost.steps.length > 0 && (
        <p className="note">{e.cost.steps.join(" · ")}</p>
      )}
      <dl className="mini-stats">
        <div>
          <dt>Unlock fee, once</dt>
          <dd>{money(e.cost.fees)}</dd>
        </div>
        <div>
          <dt>Material value + fees</dt>
          <dd>{money(e.cost.economic)}</dd>
        </div>
        <div>
          <dt>Profit after input value</dt>
          <dd>{money(e.economicProfit)}</dd>
        </div>
      </dl>
      <p className="note">
        Owned inputs use zero extra cash and their assumed net resale value as
        opportunity cost. Cheapest asks are unit-price scenarios: total stock
        does not prove that all units are offered at that price. Subcomponent
        plans use whole crafts and retain surplus.
      </p>
    </>
  );
}
function DEExplanation({ e }: { e: Evaluation }) {
  if (!e.de) return null;
  const d = e.de;
  return (
    <section className="risk-box">
      <h4>
        {d.guaranteed
          ? "Guaranteed material yield"
          : "Random outcomes · expected value is not one-roll profit"}
      </h4>
      <ul>
        {d.outcomes.map((o, i) => (
          <li key={i}>
            <b>{Math.round(o.probability * 100)}%</b> · {o.label} →{" "}
            {money(o.value)} net
          </li>
        ))}
      </ul>
      <dl className="mini-stats">
        <div>
          <dt>Worst / best recovery</dt>
          <dd>
            {money(d.worst)} / {money(d.best)}
          </dd>
        </div>
        <div>
          <dt>Break-even chance</dt>
          <dd>
            {d.breakEvenChance === null
              ? "Unknown"
              : Math.round(d.breakEvenChance * 100) + "%"}
          </dd>
        </div>
        <div>
          <dt>Dust-only contribution</dt>
          <dd>{money(d.dustOnly)}</dd>
        </div>
      </dl>
      <p>
        Most common: {d.common}. Quantities within each stated min–max range are
        modeled uniformly; joint drops are added within an outcome. Prices and
        resale remain uncertain even for a guaranteed shard. Missing material
        prices make the value unknown, never zero.
      </p>
    </section>
  );
}
function QuoteEditor({
  id,
  c,
  onUpdate,
}: {
  id: number;
  c: Character;
  onUpdate: (fn: (c: Character) => Character) => void;
}) {
  const [ask, setAsk] = useState<number | null>(c.manual[id]?.ask ?? null),
    [exit, setExit] = useState<number | null>(c.manual[id]?.exit ?? null),
    [message, setMessage] = useState("");
  useEffect(() => {
    setAsk(c.manual[id]?.ask ?? null);
    setExit(c.manual[id]?.exit ?? null);
  }, [c.manual[id]?.ask, c.manual[id]?.exit]);
  return (
    <details className="quote-editor">
      <summary>Enter your in-game quote / exit scenario</summary>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (ask === 0) {
            setMessage(
              "For free supplies, record the available inventory quantity instead of an unlimited zero-price purchase.",
            );
            return;
          }
          onUpdate((c) => ({
            ...c,
            manual: {
              ...c.manual,
              [id]: {
                market: MARKET,
                ask,
                exit,
                observedAt: new Date().toISOString(),
                note: "Player-entered unit quote",
              },
            },
          }));
          setMessage("Saved for this character and market, with a timestamp.");
        }}
      >
        <div className="form-grid">
          <MoneyInput
            label="Purchase price per unit"
            value={ask}
            onChange={setAsk}
          />
          <MoneyInput
            label="Your proposed gross exit per unit"
            value={exit}
            onChange={setExit}
          />
        </div>
        <div className="actions">
          <button type="submit">Save manual quote</button>
          <button
            type="button"
            onClick={() => {
              onUpdate((c) => {
                const manual = { ...c.manual };
                delete manual[id];
                return { ...c, manual };
              });
              setAsk(null);
              setExit(null);
              setMessage("Manual override removed.");
            }}
          >
            Use provider again
          </button>
        </div>
        <p role="status">{message}</p>
        <small>
          Not a confirmed sale or a live listing. Source snapshot timestamps are
          never replaced with refresh time.
        </small>
      </form>
    </details>
  );
}
function App() {
  const initial = useRef<{
    state: SavedState;
    raw: string | null;
    error: string;
  }>(null);
  if (!initial.current) {
    try {
      const raw = localStorage.getItem(STORE);
      initial.current = {
        state: raw ? validateState(JSON.parse(raw)) : defaults(),
        raw,
        error: "",
      };
    } catch {
      initial.current = {
        state: defaults(),
        raw: null,
        error:
          "Saved data could not be read. It has been preserved; export this session or explicitly restore a valid backup.",
      };
    }
  }
  const [state, setState] = useState(initial.current.state),
    [storageError, setStorageError] = useState(initial.current.error),
    [stale, setStale] = useState(false),
    savedRaw = useRef(initial.current.raw),
    [page, setPage] = useState(
      [
        "scanner",
        "sell",
        "opportunities",
        "leveling",
        "batch",
        "watchlist",
      ].includes(location.hash.slice(1))
        ? location.hash.slice(1)
        : "scanner",
    ),
    [modal, setModal] = useState(false),
    [restoreRevision, setRestoreRevision] = useState(0),
    [toast, setToast] = useState(""),
    [market, setMarket] = useState<MarketData>(unknownMarket),
    [scanFilters, setScanFilters] = useState<ScanFilters>(DEFAULT_SCAN),
    [loading, setLoading] = useState(false),
    [kind, setKind] = useState("all"),
    [search, setSearch] = useState(""),
    [showAll, setShowAll] = useState(false),
    [sort, setSort] = useState<"profit" | "cost" | "yield">("profit"),
    [history, setHistory] = useState<number | null>(null),
    [inspect, setInspect] = useState<string | null>(null);
  const c = state.characters.find((x) => x.id === state.active)!;
  const commit = useCallback(
    (next: SavedState) => {
      if (stale) {
        setToast("Reload before editing: another tab changed your profiles.");
        return;
      }
      try {
        if (!storageError) {
          if (localStorage.getItem(STORE) !== savedRaw.current) {
            setStale(true);
            return;
          }
          const raw = JSON.stringify(next);
          localStorage.setItem(STORE, raw);
          savedRaw.current = raw;
        }
      } catch {
        setStorageError(
          "Storage is unavailable or full. Changes stay in this tab; export before closing.",
        );
      }
      setState(next);
    },
    [stale, storageError],
  );
  const update = (fn: (c: Character) => Character) =>
    commit({
      ...state,
      characters: state.characters.map((p) => (p.id === c.id ? fn(p) : p)),
    });
  useEffect(() => {
    const fn = (e: StorageEvent) => {
      if (e.key === STORE || e.key === null) setStale(true);
    };
    window.addEventListener("storage", fn);
    return () => window.removeEventListener("storage", fn);
  }, []);
  useEffect(() => {
    const fn = () =>
      setPage(
        [
          "scanner",
          "sell",
          "opportunities",
          "leveling",
          "batch",
          "watchlist",
        ].includes(location.hash.slice(1))
          ? location.hash.slice(1)
          : "scanner",
      );
    window.addEventListener("hashchange", fn);
    return () => window.removeEventListener("hashchange", fn);
  }, []);
  useEffect(() => {
    document.title =
      ({
        scanner: "Flip scanner",
        sell: "Sell or vendor",
        opportunities: "Crafting",
        leveling: "Leveling",
        batch: "Batch planner",
        watchlist: "Watchlist",
      }[page] || "Planner") + " · The Copper Ledger";
  }, [page]);
  const allWatches = useMemo(
    () =>
      [
        ...new Set(state.characters.flatMap((c) => c.watch.map((w) => w.id))),
      ].sort((a, b) => a - b),
    [state.characters.map((c) => c.watch.map((w) => w.id).join(",")).join(";")],
  );
  const abort = useRef<AbortController | null>(null);
  const refresh = useCallback(async () => {
    abort.current?.abort();
    if (page === "sell") {
      setLoading(false);
      return;
    }
    const controller = new AbortController();
    abort.current = controller;
    setLoading(true);
    try {
      const fresh =
        page === "scanner"
          ? await loadScanner(scanFilters, controller.signal)
          : await loadMarket(allWatches, controller.signal);
      if (!controller.signal.aborted) setMarket(fresh);
    } catch (e) {
      if (!controller.signal.aborted)
        setMarket((old) => ({
          ...purgeExpired(old),
          errors: [(e as Error).message],
        }));
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  }, [allWatches.join(","), page === "scanner", page === "sell", scanFilters]);
  useEffect(() => {
    setMarket(unknownMarket());
  }, [page === "scanner", page === "sell", scanFilters]);
  useEffect(() => {
    void refresh();
    const timer = setInterval(() => void refresh(), 60000),
      purge = setInterval(() => setMarket((old) => purgeExpired(old)), 15000);
    return () => {
      abort.current?.abort();
      clearInterval(timer);
      clearInterval(purge);
    };
  }, [refresh]);
  const actions = useMemo(() => {
    const out: Action[] = [];
    for (const r of [...RECIPES, ...CONVERSIONS]) {
      if (
        r.service ||
        r.binding === "BoP" ||
        (!c.skills[r.profession] && r.acquisition !== "conversion")
      )
        continue;
      out.push({
        id: "craft-" + r.id,
        kind:
          r.acquisition === "conversion" || r.name.startsWith("Bolt of ")
            ? "convert"
            : "craft",
        recipeId: r.id,
        itemId: r.output,
        quantity: 1,
        exit: null,
        deposit: null,
        fallback: "keep",
        sellFraction: 0,
      });
      if (c.skills.Enchanting && ITEMS[r.output]?.de)
        out.push({
          id: "craft-de-" + r.id,
          kind: "craft-de",
          recipeId: r.id,
          itemId: r.output,
          quantity: 1,
          exit: null,
          deposit: null,
          fallback: "keep",
          sellFraction: 0,
        });
    }
    if (c.skills.Enchanting)
      for (const i of [
        ...Object.values(ITEMS).filter((i) => i.de),
        ...market.deItems,
      ])
        if (
          !out.some((a) => a.kind === "buy-de" && a.itemId === i.id) &&
          !i.noDE
        )
          out.push({
            id: "de-" + i.id,
            kind: "buy-de",
            itemId: i.id,
            quantity: 1,
            exit: null,
            deposit: null,
            fallback: "keep",
            sellFraction: 0,
          });
    for (const d of market.deals || [])
      out.push({
        id: "resell-" + d.id,
        kind: "resell",
        itemId: d.id,
        quantity: 1,
        exit: c.manual[d.id]?.exit ?? null,
        deposit: null,
        fallback: "keep",
        sellFraction: 0,
      });
    return out;
  }, [c, market]);
  const evaluations = useMemo(
    () =>
      actions
        .map((a) => evaluate(a, c, market))
        .filter(
          (e) =>
            (kind === "all" || e.action.kind === kind) &&
            e.name.toLowerCase().includes(search.toLowerCase()),
        )
        .sort((a, b) => {
          const eligible = Number(b.eligible) - Number(a.eligible);
          if (eligible) return eligible;
          const budget =
            c.cash === null
              ? null
              : Math.max(0, Math.min(c.budget ?? c.cash, c.cash - c.reserve));
          if (budget !== null) {
            const fits = (e: typeof a) =>
              e.cost.cash !== null && e.cost.cash <= budget;
            const affordability = Number(fits(b)) - Number(fits(a));
            if (affordability) return affordability;
          }
          if (sort === "yield") {
            const certain =
              Number(!!b.de?.guaranteed) - Number(!!a.de?.guaranteed);
            if (certain) return certain;
          }
          return sort === "cost"
            ? (a.cost.cash ?? Infinity) - (b.cost.cash ?? Infinity)
            : (b.profit ?? -Infinity) - (a.profit ?? -Infinity);
        }),
    [actions, c, market, kind, search, sort],
  );
  const usable =
      c.cash === null
        ? null
        : Math.max(0, Math.min(c.budget ?? c.cash, c.cash - c.reserve)),
    affordable = evaluations.filter(
      (e) =>
        e.eligible &&
        e.cost.cash !== null &&
        usable !== null &&
        e.cost.cash <= usable &&
        e.profit !== null &&
        e.profit > 0,
    ).length;
  const add = (a: Action) => {
    if (c.batch.length >= 50) {
      setToast("Keep batches to 50 actions.");
      return;
    }
    update((c) => ({
      ...c,
      batch: [...c.batch, { ...a, id: uid(), sellFraction: 0 }],
    }));
    setToast(
      "Added one unit to " +
        c.name +
        "’s batch. Set deposits and sale assumptions before committing.",
    );
  };
  const watch = (id: number) => {
    if (c.watch.some((w) => w.id === id)) {
      setToast("Already on this character’s watchlist.");
      return;
    }
    if (c.watch.length >= 100) {
      setToast("Watchlist limit: 100 items per character.");
      return;
    }
    update((c) => ({
      ...c,
      watch: [...c.watch, { id, buyBelow: null, sellAbove: null }],
    }));
    setToast("Added to watchlist.");
  };
  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setToast("Copied.");
    } catch {
      setToast(
        "Clipboard unavailable. Select and copy the visible item name or checklist text.",
      );
    }
  };
  const stamp =
    market.updatedAt ||
    Object.values(c.manual)
      .map((q) => q.observedAt)
      .sort((a, b) => Date.parse(a) - Date.parse(b))[0] ||
    null;
  function calculation(e: Evaluation) {
    const r = recipeById(e.action.recipeId || 0);
    return (
      <div className="calculation">
        <CostLines e={e} />
        <DEExplanation e={e} />
        {patternPayback(e) !== null && (
          <p>
            Recover the recipe unlock after{" "}
            <b>{patternPayback(e)} sold crafts</b> at this input/exit scenario,
            before lost deposits.
          </p>
        )}
        {e.action.kind === "resell" && (
          <p>
            Discovery reference:{" "}
            {money(
              market.deals?.find((d) => d.id === e.action.itemId)?.reference ??
                null,
            )}{" "}
            ·{" "}
            {market.deals?.find((d) => d.id === e.action.itemId)?.basis ||
              "historical asks"}
            . This is not a confirmed sale.
          </p>
        )}
        {e.reasons.length > 0 && (
          <ul className="warnings">
            {e.reasons.map((v, i) => (
              <li key={i}>{v}</li>
            ))}
          </ul>
        )}
        <dl className="mini-stats">
          <div>
            <dt>Net if all units sell</dt>
            <dd>{money(e.proceeds)}</dd>
          </div>
          <div>
            <dt>Break-even {r ? "total input spend" : "purchase / action"}</dt>
            <dd>{money(e.maxBuy)}</dd>
          </div>
          <div>
            <dt>Expected skill gain</dt>
            <dd>{e.skill.toFixed(2)}</dd>
          </div>
        </dl>
        {e.vendorValue !== null && (
          <p>
            Alternative vendor proceeds: <b>{money(e.vendorValue)}</b>. No AH
            cut on vendor sales.
          </p>
        )}
        <p>
          Profit shown before any lost deposit. A successful sale returns its
          deposit; expiry loses it. The 5% cut is applied once to gross exit
          value.
        </p>
        {e.action.kind === "resell" && (
          <p className="warning">
            A historical-ask discount is a lead, not a sale price. Enter a
            plausible separate exit quote; buying and relisting at the same
            price loses the AH cut.
          </p>
        )}
        <p className="note">
          Oldest required provider/manual observation: {time(e.oldest)}.{" "}
          {e.quote?.quantity != null && e.quote.soldPerDay
            ? `Market stock / inferred daily sales: ${(e.quote.quantity / e.quote.soldPerDay).toFixed(1)} days. This is the whole market’s queue, not your promised turnover.`
            : "Personal listing turnover is unknown."}
        </p>
        {r && (
          <p>
            <a href={r.source} target="_blank" rel="noreferrer">
              Recipe requirements & source ↗
            </a>
            <br />
            {r.profession} {r.min} · yellow {r.yellow}, green {r.green}, grey{" "}
            {r.grey} · {r.binding} · {r.expansion}
            <br />
            {r.note}
          </p>
        )}
        <QuoteEditor
          key={c.id + "-" + restoreRevision + "-" + e.action.itemId}
          id={e.action.itemId}
          c={c}
          onUpdate={update}
        />
        <Credit url={e.quote?.url} />
      </div>
    );
  }
  function card(e: Evaluation) {
    const affordable =
      e.cost.cash !== null && usable !== null && e.cost.cash <= usable;
    return (
      <article className="opportunity" key={e.action.id}>
        <div className="card-top">
          <span className="eyebrow">{kindLabel[e.action.kind]}</span>
          <span
            className={
              "pill " + (!e.eligible ? "muted" : e.de?.guaranteed ? "good" : "")
            }
          >
            {!e.eligible
              ? "Check requirements"
              : e.de?.guaranteed
                ? "Certain yield"
                : e.de
                  ? "Random yield"
                  : "Price scenario"}
          </span>
        </div>
        <h3>{e.name}</h3>
        <Demand q={e.quote} />
        <dl className="card-numbers">
          <div>
            <dt>Upfront inputs</dt>
            <dd>{money(e.cost.cash)}</dd>
          </div>
          <div>
            <dt>Net profit / action</dt>
            <dd
              className={
                e.profit !== null && e.profit > 0 ? "positive" : "negative"
              }
            >
              {money(e.profit)}
            </dd>
          </div>
        </dl>
        <p className="card-note">
          {usable === null
            ? "Enter character cash to check budget"
            : affordable
              ? "Inputs fit your current budget"
              : "Over budget / missing price"}{" "}
          ·{" "}
          {e.profit === null || !e.cost.cash
            ? "Margin unknown"
            : ((e.profit / e.cost.cash) * 100).toFixed(1) + "% return on cash"}
        </p>
        <p className="timestamp">{quoteAge(e.quote)}</p>
        <div className="row-actions">
          <button className="primary" onClick={() => add(e.action)}>
            ＋ Add to batch
          </button>
          <button onClick={() => watch(e.action.itemId)}>☆ Watch</button>
          <button
            aria-label={"Copy name: " + e.name}
            onClick={() => void copy(e.name)}
          >
            Copy name
          </button>
        </div>
        <details>
          <summary>Show the calculation</summary>
          {calculation(e)}
        </details>
      </article>
    );
  }
  return (
    <div className="app-shell">
      <a
        className="skip"
        href="#main-content"
        onClick={(e) => {
          e.preventDefault();
          document.getElementById("main-content")?.focus();
        }}
      >
        Skip to content
      </a>
      <header className="masthead">
        <a className="brand" href="#scanner">
          <span className="brand-mark">
            C<span>↗</span>
          </span>
          <span>
            THE COPPER LEDGER
            <small>Auction prices and profession planning.</small>
          </span>
        </a>
        {["scanner", "sell"].includes(page) ? (
          <p className="scanner-identity">
            Market-wide scanning
            <br />
            <small>Character setup is optional</small>
          </p>
        ) : (
          <div className="profile-switch">
            <label>
              Character
              <select
                value={c.id}
                onChange={(e) => commit({ ...state, active: e.target.value })}
              >
                {state.characters.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                    {p.className ? " · " + p.className : ""}
                  </option>
                ))}
              </select>
            </label>
            <button onClick={() => setModal(true)}>Edit profile</button>
          </div>
        )}
      </header>
      <div className="market-bar" role="region" aria-label="Market status">
        <span>
          <i /> WoW Forever · EU · RP non-PvP · Alliance
        </span>
        <span>
          {page === "sell" ? (
            "Quote time is shown with each item"
          ) : (
            <>Observed {stamp ? time(stamp) : "— no market observation"}</>
          )}
        </span>
        {page !== "sell" && (
          <button onClick={() => void refresh()} disabled={loading}>
            {loading ? "Refreshing…" : "↻ Refresh"}
          </button>
        )}
      </div>
      <nav className="main-nav" aria-label="Planner">
        {[
          ["scanner", "Flip scanner", "00"],
          ["sell", "Sell or vendor", "05"],
          ["opportunities", "Crafting", "01"],
          ["leveling", "Leveling", "02"],
          ["batch", "Batch planner", "03"],
          ["watchlist", "Watchlist", "04"],
        ].map(([id, label]) => (
          <a
            key={id}
            href={"#" + id}
            aria-current={page === id ? "page" : undefined}
          >
            {label}
            {id === "batch" && c.batch.length > 0 && <b>{c.batch.length}</b>}
          </a>
        ))}
      </nav>
      {stale || storageError ? (
        <p className="alert" role="alert">
          {stale
            ? "Another tab changed your saved profiles. Reload before editing."
            : storageError}
        </p>
      ) : null}
      {toast && (
        <div className="toast" role="status">
          {toast}
          <button aria-label="Dismiss message" onClick={() => setToast("")}>
            ×
          </button>
        </div>
      )}
      <main id="main-content" tabIndex={-1}>
        {page === "sell" && <SellOrVendor />}
        {page === "scanner" && (
          <FlipScanner
            market={market}
            loading={loading}
            filters={scanFilters}
            onScan={setScanFilters}
            copy={copy}
            watch={watch}
            character={c.name}
            load={async (id) => {
              const q = await loadHistory(id);
              setMarket((old) => ({
                ...old,
                quotes: { ...old.quotes, [id]: q },
              }));
            }}
          />
        )}
        {page === "opportunities" && (
          <>
            <section className="intro">
              <div>
                <h1>Crafting opportunities</h1>
                <p>
                  {c.cash === null
                    ? "Enter cash to check affordability."
                    : `${affordable} positive scenarios fit the inputs budget.`}{" "}
                  Compare the cost and requirements before adding a batch.
                </p>
              </div>
              <aside className="wallet">
                <span>Cash on hand</span>
                <strong>{money(c.cash)}</strong>
                <small>
                  {Object.entries(c.skills)
                    .map(([name, s]) => name + " " + s.level)
                    .join(" · ")}
                </small>
                <button onClick={() => setModal(true)}>
                  Update cash & supplies →
                </button>
              </aside>
            </section>
            <section className="summary-strip">
              <div>
                <b>{money(usable)}</b>
                <span>Available after reserve</span>
              </div>
              <div>
                <b>{affordable}</b>
                <span>Positive scenarios within inputs budget</span>
              </div>
              <div>
                <b>5%</b>
                <span>Faction AH cut</span>
              </div>
              <div>
                <b>Deposits</b>
                <span>Enter the in-game quote</span>
              </div>
            </section>
            <div className="section-title">
              <div>
                <h2>Compare craft costs</h2>
              </div>
              <Credit />
            </div>
            <div className="filters">
              <label>
                Action
                <select
                  value={kind}
                  onChange={(e) => {
                    setKind(e.target.value);
                    setShowAll(false);
                  }}
                >
                  <option value="all">All opportunities</option>
                  {Object.entries(kindLabel).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Find an item
                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cloth, hood, shard…"
                />
              </label>
              <label>
                Sort
                <select
                  value={sort}
                  onChange={(e) =>
                    setSort(e.target.value as "profit" | "cost" | "yield")
                  }
                >
                  <option value="profit">
                    Net profit · requirements first
                  </option>
                  <option value="cost">Lowest upfront inputs</option>
                  <option value="yield">Guaranteed yields first</option>
                </select>
              </label>
            </div>
            {market.errors.length > 0 && (
              <details className="alert">
                <summary>Some live data is unavailable</summary>
                <ul>
                  {market.errors.map((e, i) => (
                    <li key={i}>{e}</li>
                  ))}
                </ul>
                <p>
                  Use timestamped manual quotes. Unpriced actions stay unknown
                  and are not counted as profitable. Provider answers are held
                  only for their cache lifetime.
                </p>
              </details>
            )}
            {!evaluations.length ? (
              <section className="empty">
                <h3>
                  {loading ? "Checking the market…" : "No matching candidates"}
                </h3>
                <p>
                  Try another filter, add manual quotes, or confirm your
                  character’s professions.
                </p>
              </section>
            ) : (
              <>
                <div className="mobile-cards">
                  {evaluations.slice(0, showAll ? 50 : 3).map(card)}
                  {evaluations.length > 3 && !showAll && (
                    <button className="wide" onClick={() => setShowAll(true)}>
                      Show more candidates ({Math.min(50, evaluations.length)})
                    </button>
                  )}
                </div>
                <div className="desktop-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Item / action</th>
                        <th>Inputs</th>
                        <th>Net profit</th>
                        <th>Demand evidence</th>
                        <th>Actions / calculation</th>
                      </tr>
                    </thead>
                    <tbody>
                      {evaluations.map((e) => (
                        <Fragment key={e.action.id}>
                          <tr>
                            <td>
                              <b>{e.name}</b>
                              <small>
                                {kindLabel[e.action.kind]} ·{" "}
                                {!e.eligible
                                  ? "Requirements pending"
                                  : e.de?.guaranteed
                                    ? "Guaranteed yield"
                                    : e.de
                                      ? "Random outcome"
                                      : "Scenario"}
                              </small>
                              <small>{quoteAge(e.quote)}</small>
                            </td>
                            <td>{money(e.cost.cash)}</td>
                            <td
                              className={
                                e.profit !== null && e.profit > 0
                                  ? "positive"
                                  : ""
                              }
                            >
                              {money(e.profit)}
                              <small>
                                {e.cost.cash && e.profit !== null
                                  ? ((100 * e.profit) / e.cost.cash).toFixed(
                                      1,
                                    ) + "%"
                                  : "Unknown margin"}
                              </small>
                            </td>
                            <td>
                              <Demand q={e.quote} />
                            </td>
                            <td>
                              <div className="row-actions">
                                <button onClick={() => add(e.action)}>
                                  ＋ Batch
                                </button>
                                <button onClick={() => watch(e.action.itemId)}>
                                  ☆ Watch
                                </button>
                                <button onClick={() => void copy(e.name)}>
                                  Copy name
                                </button>
                              </div>
                              <button
                                aria-expanded={inspect === e.action.id}
                                onClick={() =>
                                  setInspect(
                                    inspect === e.action.id
                                      ? null
                                      : e.action.id,
                                  )
                                }
                              >
                                Calculation & quotes
                              </button>
                            </td>
                          </tr>
                          {inspect === e.action.id && (
                            <tr>
                              <td colSpan={5}>{calculation(e)}</td>
                            </tr>
                          )}
                        </Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
            <details className="panel method">
              <summary>What these numbers mean</summary>
              <p>
                Results compare gross exit scenarios after one 5% cut with cash
                inputs. They are not realized profits. Lowest asks are not
                confirmed sales and do not describe listing depth. Deposits
                remain unknown until you enter the in-game amount. Test one or
                two appearance items; estimated demand belongs to the whole
                market. Changing layers cannot change this market’s listings.
              </p>
              <p>
                Manual prices are scoped to this character and {MARKET}. Vendor
                quotes are editable references, not live AH observations.
                Craft/DE outcomes have separate metadata and exceptions. No
                in-game actions are automated.
              </p>
            </details>
          </>
        )}
        {page === "leveling" && (
          <Leveling
            key={c.id + restoreRevision}
            c={c}
            market={market}
            update={update}
            add={add}
          />
        )}
        {page === "batch" && (
          <Batch
            key={c.id + restoreRevision}
            c={c}
            market={market}
            update={update}
            copy={copy}
          />
        )}
        {page === "watchlist" && (
          <Watchlist
            key={c.id + restoreRevision}
            c={c}
            market={market}
            update={update}
            watch={watch}
            history={history}
            setHistory={setHistory}
            load={async (id) => {
              try {
                const q = await loadHistory(id);
                setMarket((old) => ({
                  ...old,
                  quotes: { ...old.quotes, [id]: q },
                }));
                setHistory(id);
              } catch (e) {
                setToast((e as Error).message);
              }
            }}
          />
        )}
      </main>
      <footer>
        <div>
          <span className="footer-brand">C / THE COPPER LEDGER</span>
          <p>
            Independent fan tool. Buying, crafting, posting and trading happen
            in game.
            <br />
            Profiles stay in this browser. No Blizzard credentials or account
            login.
          </p>
        </div>
        <div>
          <Credit />
          <a
            href="https://ahledger.com/developers"
            target="_blank"
            rel="noreferrer"
          >
            API terms & attribution ↗
          </a>
          <button
            onClick={() =>
              download(
                "copper-ledger-profiles.json",
                JSON.stringify(state, null, 2),
              )
            }
          >
            Export profiles
          </button>
          <label className="file-label">
            Import profiles
            <input
              type="file"
              accept=".json,application/json"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                e.target.value = "";
                if (!file) return;
                try {
                  if (file.size > 5_000_000)
                    throw Error("Backup exceeds 5 MB.");
                  const next = validateState(JSON.parse(await file.text()));
                  if (
                    !confirm(
                      "Replace all Copper Ledger character profiles with this backup? Other apps are unaffected.",
                    )
                  )
                    return;
                  const raw = JSON.stringify(next);
                  localStorage.setItem(STORE, raw);
                  savedRaw.current = raw;
                  setState(next);
                  setRestoreRevision((n) => n + 1);
                  setModal(false);
                  setHistory(null);
                  setStorageError("");
                  setStale(false);
                  setToast(
                    "Profiles restored. Market snapshots are fetched separately.",
                  );
                } catch (e) {
                  setToast((e as Error).message);
                }
              }}
            />
          </label>
        </div>
      </footer>
      {modal && (
        <ProfileEditor
          key={c.id + restoreRevision}
          c={c}
          state={state}
          update={update}
          commit={commit}
          close={() => setModal(false)}
          notify={setToast}
        />
      )}
    </div>
  );
}
function Leveling({
  c,
  market,
  update,
  add,
}: {
  c: Character;
  market: MarketData;
  update: (fn: (c: Character) => Character) => void;
  add: (a: Action) => void;
}) {
  const [profession, setProfession] = useState<Profession>(
      Object.keys(c.skills)[0] as Profession,
    ),
    [strategy, setStrategy] = useState<"cash" | "net">("cash");
  useEffect(
    () => setProfession(Object.keys(c.skills)[0] as Profession),
    [c.id],
  );
  const s = c.skills[profession],
    plan = levelRoute(c, market, profession, strategy),
    recipes = RECIPES.filter((r) => r.profession === profession),
    gathering = profession === "Herbalism" || profession === "Mining";
  return (
    <>
      <section className="page-heading">
        <h1>Plan your skill points</h1>
        <p>
          {gathering
            ? "Record your current skill and gathered materials."
            : plan.steps.length
              ? `The estimated route reaches ${plan.end}. Check the steps below, then add them to a batch.`
              : "No priced, learned route is available yet. Confirm known recipes and missing prices below."}
        </p>
      </section>
      <div className="panel leveling-controls">
        <label>
          Profession
          <select
            value={profession}
            onChange={(e) => setProfession(e.target.value as Profession)}
          >
            {Object.keys(c.skills).map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
        </label>
        {s && (
          <>
            <label>
              Current skill
              <input
                type="number"
                min="0"
                max={s.cap}
                value={s.level}
                onChange={(e) => {
                  const level = +e.target.value;
                  if (Number.isInteger(level) && level >= 0 && level <= s.cap)
                    update((c) => ({
                      ...c,
                      skills: { ...c.skills, [profession]: { ...s, level } },
                    }));
                }}
              />
            </label>
            <label>
              Target
              <input
                type="number"
                min="0"
                max="300"
                value={s.target}
                onChange={(e) => {
                  const target = +e.target.value;
                  if (Number.isInteger(target) && target >= 0 && target <= 300)
                    update((c) => ({
                      ...c,
                      skills: { ...c.skills, [profession]: { ...s, target } },
                    }));
                }}
              />
            </label>
            <label>
              Rank cap
              <input
                type="number"
                min="1"
                max="300"
                value={s.cap}
                onChange={(e) => {
                  const cap = +e.target.value;
                  if (Number.isInteger(cap) && cap >= s.level && cap <= 300)
                    update((c) => ({
                      ...c,
                      skills: { ...c.skills, [profession]: { ...s, cap } },
                    }));
                }}
              />
            </label>
          </>
        )}
        <label>
          Rank candidates by
          <select
            value={strategy}
            onChange={(e) => setStrategy(e.target.value as "cash" | "net")}
          >
            <option value="cash">Lowest replacement-material cost</option>
            <option value="net">Net cost if outputs sell</option>
          </select>
        </label>
      </div>
      {gathering ? (
        <section className="panel">
          <h2>Gathering has no craft-count shortcut.</h2>
          <p>
            Keep your profession trained up to its rank cap, gather nodes that
            still award skill, and record your actual level here. A node’s
            skill-up rate and the world route are not inferred from AH prices.
          </p>
          <p>
            Record gathered materials in this character’s inventory. They cost
            zero extra gold to gather, but selling or transferring them has an
            opportunity cost. Grimpo Grongo’s ore and Chumbles’ herbs are never
            silently added to Glimpo’s stock.
          </p>
          <p>
            At the cap, confirm rank requirements and the trainer’s price in
            game before spending; this planner does not invent a rank fee.
          </p>
        </section>
      ) : (
        <>
          <section className="route-card">
            <div className="section-title">
              <div>
                <p className="eyebrow">
                  {s?.level} → {plan.end}
                  {s && s.target > plan.end ? " · partial route" : ""}
                </p>
                <h2>Your learned-recipe route</h2>
              </div>
              <span className="pill">Estimated attempts</span>
            </div>
            {plan.steps.length ? (
              <ol className="route-steps">
                {plan.steps.map((step) => (
                  <li key={step.from}>
                    <div>
                      <span>
                        {step.from} → {step.to}
                      </span>
                      <h3>{step.recipe.name}</h3>
                      <p>
                        {step.attempts.toFixed(2)} expected attempts · plan{" "}
                        {Math.ceil(step.attempts)} whole crafts ·{" "}
                        {money(step.costPerPoint)} modeled cost/point
                      </p>
                      <small>
                        {step.recipe.min}/{step.recipe.yellow}/
                        {step.recipe.green}/{step.recipe.grey} ·{" "}
                        {step.recipe.service
                          ? "Apply to suitable owned gear; no assumed resale"
                          : "Sale recovery is only a scenario"}
                      </small>
                    </div>
                    <button
                      onClick={() =>
                        add({
                          id: uid(),
                          kind: "craft",
                          itemId: step.recipe.output,
                          recipeId: step.recipe.id,
                          quantity: Math.min(1000, Math.ceil(step.attempts)),
                          exit: step.recipe.service ? 0 : null,
                          deposit: step.recipe.service ? 0 : null,
                          sellFraction: 0,
                          fallback: "keep",
                          retain:
                            step.recipe.service ||
                            step.recipe.binding === "BoP",
                        })
                      }
                    >
                      Add this step to batch
                    </button>
                  </li>
                ))}
              </ol>
            ) : (
              <p>
                No priced learned route yet. Confirm the recipes you actually
                know below and enter missing quotes.
              </p>
            )}
            {plan.stopped && <p className="alert">{plan.stopped}</p>}
            <p className="note">
              Ranks one point at a time among checked, learned recipes using
              replacement-material prices. It is not a globally optimized
              two-profession route. The batch applies your finite inventory once
              and reserves upfront purchases; future proceeds never finance
              those purchases. Recheck your actual skill after yellow/green
              rolls.
            </p>
          </section>
          <details className="panel">
            <summary>Skill-up probability model</summary>
            <p>
              Orange: 100%. Grey or below the requirement: 0%. Yellow: estimated
              75% declining toward 50% at green. Green: estimated 50% declining
              toward grey, with a 5% floor before grey. Expected attempts for
              the next point = 1 / probability. These yellow/green rates are an
              explicit model, not verified server probabilities.
            </p>
            <p>
              Profession caps stop gains. A trainer or new rank can require
              character level, prerequisites and a fee; those are not assumed
              from the profession skill number alone.
            </p>
          </details>
        </>
      )}
      <section className="panel">
        <h2>Recipe book · {profession}</h2>
        <p>
          Tick only recipes already learned in game. Unticking restores the
          separate unlock fee; trainer, vendor pattern, drop and quest
          acquisition are distinct. Known recipes do not bypass their skill or
          tool requirements.
        </p>
        {recipes.length ? (
          recipes.map((r) => (
            <div className="recipe-row" key={r.id}>
              <label>
                <input
                  type="checkbox"
                  checked={c.known.includes(r.id)}
                  onChange={(e) =>
                    update((c) => ({
                      ...c,
                      known: e.target.checked
                        ? [...new Set([...c.known, r.id])]
                        : c.known.filter((id) => id !== r.id),
                    }))
                  }
                />
                <span>
                  <b>{r.name}</b>
                  <small>
                    Learn {r.min} · yellow {r.yellow} · green {r.green} · grey{" "}
                    {r.grey}
                    <br />
                    {r.acquisition} · {r.binding} · {r.expansion}
                  </small>
                </span>
              </label>
              <div>
                <MoneyInput
                  label="Actual unlock quote · once"
                  value={c.unlockCosts[r.id] ?? r.unlock}
                  onChange={(n) => {
                    if (n === null) return;
                    update((c) => ({
                      ...c,
                      unlockCosts: { ...c.unlockCosts, [r.id]: n },
                    }));
                  }}
                />
                <a href={r.source} target="_blank" rel="noreferrer">
                  Requirements source ↗
                </a>
              </div>
              <p>{r.note}</p>
            </div>
          ))
        ) : (
          <p>Gathering progression is recorded as skill, not a recipe book.</p>
        )}
      </section>
      <details className="panel">
        <summary>
          Imported candidates · not yet verified for this character
        </summary>
        <p>
          Provider requirements can be wrong. These are discovery leads,
          excluded from leveling recommendations until checked catalogue
          coverage expands.
        </p>
        <ul>
          {market.imported
            .filter(
              (r) =>
                r.profession === profession &&
                !RECIPES.some((v) => v.id === r.id),
            )
            .slice(0, 30)
            .map((r) => (
              <li key={r.id}>
                {r.name} · provider reports {r.min} ·{" "}
                <a href={r.source} target="_blank" rel="noreferrer">
                  check source
                </a>
              </li>
            ))}
        </ul>
        <Credit />
      </details>
    </>
  );
}
function Batch({
  c,
  market,
  update,
  copy,
}: {
  c: Character;
  market: MarketData;
  update: (fn: (c: Character) => Character) => void;
  copy: (s: string) => Promise<void>;
}) {
  const plan = batchPlan(c.batch, c, market),
    [postView, setPostView] = useState(false);
  const modify = (id: string, fn: (a: Action) => Action) =>
    update((c) => ({
      ...c,
      batch: c.batch.map((a) => (a.id === id ? fn(a) : a)),
    }));
  const shopping = new Map<number, { qty: number; cash: number | null }>();
  for (const row of plan.rows)
    for (const l of row.cost.lines)
      if (l.source !== "Owned / earlier batch output" && l.cash !== 0) {
        const old = shopping.get(l.id);
        shopping.set(l.id, {
          qty: (old?.qty || 0) + l.qty,
          cash:
            old?.cash === null || l.cash === null
              ? null
              : (old?.cash || 0) + l.cash,
        });
      }
  const withdrawals = new Map<number, number>();
  for (const row of plan.rows)
    for (const line of row.cost.lines) {
      if (line.cash === 0 && c.inventory[line.id]?.qty)
        withdrawals.set(
          line.id,
          Math.min(
            c.inventory[line.id].qty,
            (withdrawals.get(line.id) || 0) + line.qty,
          ),
        );
    }
  const text = [
    "THE COPPER LEDGER · " + c.name,
    "Market: " + MARKET,
    "Observation: " + (market.updatedAt || "unknown"),
    "Upfront: " + money(plan.upfront) + " · reserve " + money(c.reserve),
    "BUY / WITHDRAW",
    ...[...shopping].map(
      ([id, v]) =>
        `${v.qty} ${itemName(id)} · ${money(v.cash)} (unit-price scenario; verify lots)`,
    ),
    "WITHDRAW OWNED SUPPLIES",
    ...[...withdrawals].map(
      ([id, qty]) =>
        `${qty} ${itemName(id)} from recorded inventory; zero additional cash`,
    ),
    "LEARN / PREPARE",
    ...plan.rows
      .filter((r) => r.cost.fees !== 0)
      .map((r) => r.name + ": unlock " + money(r.cost.fees)),
    "CRAFT / CONVERT / DISENCHANT",
    ...plan.rows.flatMap((r) => [
      ...r.cost.steps,
      ...(["craft-de", "buy-de"].includes(r.action.kind)
        ? [
            `${r.units} × disenchant ${r.name}; record actual output${r.action.retain ? " · keep materials" : ""}`,
          ]
        : []),
    ]),
    "POST BEFORE LEAVING",
    ...plan.rows
      .filter(
        (r) =>
          !r.action.retain &&
          !recipeById(r.action.recipeId || 0)?.service &&
          recipeById(r.action.recipeId || 0)?.binding !== "BoP",
      )
      .map((r) =>
        r.action.kind.includes("de")
          ? `Post actual materials from ${r.units} × ${r.name} after disenchanting; possible outcomes: ${r.de?.outcomes.map((o) => o.label).join(" OR ") || "unknown"}. Check each material's gross exit and actual listing deposit; original-item allowance ${money(r.action.deposit)} per input.`
          : `${r.units} output units from ${r.name}; proposed gross exit ${money(r.action.exit ?? exitFor(r.action.itemId, c, market))}; deposit ${money(r.action.deposit)} per output`,
      ),
    "Expected batch result: " + money(plan.profit) + " · not realized profit",
    "No automatic purchases or postings. Prices from AHledger (ahledger.com)",
  ].join("\n");
  return (
    <>
      <section className="page-heading">
        <h1>Check your batch budget</h1>
        <p>
          Shared inputs are consumed once across this character’s actions. Other
          characters’ materials and cash stay separate.
        </p>
      </section>
      <p className={"batch-status " + (plan.ready ? "good" : "warning")}>
        {!c.batch.length
          ? "Add a small test batch from Crafting or Leveling."
          : plan.ready
            ? "Fits the stated budget with known deposits. Verify all in-game quotes before acting."
            : plan.fits === false
              ? "This batch exceeds the budget after your reserve."
              : plan.upfront === null
                ? "Upfront total is incomplete: enter missing input prices, fees and deposits."
                : "Inputs may fit, but requirements or deposits still need attention."}
      </p>
      <div className="batch-top">
        <MoneyInput
          label="Cash reserve"
          value={c.reserve}
          allowUnknown={false}
          onChange={(n) => update((c) => ({ ...c, reserve: n ?? 0 }))}
        />
        <label className="field">
          Listing duration
          <select
            value={c.duration}
            onChange={(e) =>
              update((c) => ({
                ...c,
                duration: +e.target.value as 12 | 24 | 48,
              }))
            }
          >
            {[12, 24, 48].map((h) => (
              <option key={h} value={h}>
                {h} hours
              </option>
            ))}
          </select>
          <small>Enter the deposit quoted for this duration.</small>
        </label>
        <button onClick={() => setPostView(!postView)}>
          {postView ? "Edit assumptions" : "Post-before-leaving view →"}
        </button>
      </div>
      <section className="summary-strip">
        <div>
          <b>{money(plan.cash)}</b>
          <span>Purchases & unlocks</span>
        </div>
        <div>
          <b>{money(plan.held)}</b>
          <span>Deposits held upfront</span>
        </div>
        <div>
          <b>{money(plan.cashLeft)}</b>
          <span>Cash left before any sale</span>
        </div>
        <div>
          <b>{money(plan.profit)}</b>
          <span>Scenario profit · not realized</span>
        </div>
      </section>

      <p className="note">
        Profit assumes only the sale fraction selected below. Zero sales is the
        default. A returned deposit is not income; only unsold/expired deposits
        reduce the result. Negative cash is never hidden by expected sale
        revenue.
      </p>
      {postView ? (
        <section className="panel">
          <h2>Shopping → preparation → production → posting</h2>
          <pre className="checklist-text">{text}</pre>
          <button className="primary" onClick={() => void copy(text)}>
            Copy checklist
          </button>
        </section>
      ) : (
        <>
          {c.batch.map((a, i) => {
            const e = plan.rows[i],
              recipe = recipeById(a.recipeId || 0);
            return (
              <article className="batch-row" key={a.id}>
                <div className="section-title">
                  <div>
                    <span className="eyebrow">
                      {i + 1} · {kindLabel[a.kind]}
                    </span>
                    <h2 className="batch-item-title">{e.name}</h2>
                  </div>
                  <button
                    className="text-button"
                    onClick={() =>
                      update((c) => ({
                        ...c,
                        batch: c.batch.filter((x) => x.id !== a.id),
                      }))
                    }
                  >
                    Remove
                  </button>
                </div>
                <div className="form-grid">
                  <label className="field">
                    {recipe ? "Crafts / conversion operations" : "Items to buy"}
                    <input
                      type="number"
                      min="1"
                      max="1000"
                      value={a.quantity}
                      onChange={(ev) => {
                        const quantity = +ev.target.value;
                        if (
                          Number.isInteger(quantity) &&
                          quantity > 0 &&
                          quantity <= 1000
                        )
                          modify(a.id, (a) => ({ ...a, quantity }));
                      }}
                    />
                  </label>
                  <MoneyInput
                    label="Gross exit / output unit"
                    value={a.exit}
                    onChange={(exit) => modify(a.id, (a) => ({ ...a, exit }))}
                  />
                  <MoneyInput
                    label="Deposit / output unit (copper or g/s/c)"
                    value={a.deposit}
                    onChange={(deposit) =>
                      modify(a.id, (a) => ({ ...a, deposit }))
                    }
                  />
                  <label className="field">
                    Units sold (whole items; DE uses recovery share)
                    <select
                      value={a.sellFraction}
                      onChange={(ev) =>
                        modify(a.id, (a) => ({
                          ...a,
                          sellFraction: +ev.target.value,
                        }))
                      }
                    >
                      <option value="0">0% · no sales yet</option>
                      <option value="0.25">25%</option>
                      <option value="0.5">50%</option>
                      <option value="1">100% · all sell</option>
                    </select>
                  </label>
                  <label className="field">
                    Unsold stock
                    <select
                      value={a.fallback}
                      onChange={(ev) =>
                        modify(a.id, (a) => ({
                          ...a,
                          fallback: ev.target.value as "keep" | "vendor",
                        }))
                      }
                    >
                      <option value="keep">Keep it · no proceeds</option>
                      <option value="vendor" disabled={a.kind.includes("de")}>
                        Vendor fallback · crafted items only
                      </option>
                    </select>
                  </label>
                </div>
                <label className="inline">
                  <input
                    type="checkbox"
                    checked={a.retain || false}
                    onChange={(ev) =>
                      modify(a.id, (a) => ({ ...a, retain: ev.target.checked }))
                    }
                  />
                  Keep output / DE materials instead of selling (zero assumed
                  proceeds)
                </label>
                <dl className="mini-stats">
                  <div>
                    <dt>Cash for this row</dt>
                    <dd>{money(e.cost.cash)}</dd>
                  </div>
                  <div>
                    <dt>Output units</dt>
                    <dd>{e.units}</dd>
                  </div>
                  <div>
                    <dt>Held deposit</dt>
                    <dd>{money(e.depositHeld)}</dd>
                  </div>
                  <div>
                    <dt>Expected skill gain</dt>
                    <dd>{e.skill.toFixed(2)}</dd>
                  </div>
                </dl>
                {e.reasons.length > 0 && (
                  <ul className="warnings">
                    {e.reasons.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                )}
                {a.kind.includes("de") && (
                  <p className="note">
                    {e.de?.guaranteed && a.retain
                      ? "Retained guaranteed yields can supply a later row."
                      : "Random yields are not spendable cash or guaranteed inputs. Record actual drops before relying on them for another craft."}{" "}
                    Sale assumptions apply to material recovery; deposits are a
                    conservative per-input allowance for this DE action, not a
                    server-calculated posting quote.
                  </p>
                )}
                <details>
                  <summary>Inputs and material-value accounting</summary>
                  <CostLines e={e} />
                  <DEExplanation e={e} />
                </details>
                <div className="actions">
                  <button
                    disabled={i === 0}
                    onClick={() =>
                      update((c) => {
                        const batch = [...c.batch];
                        [batch[i - 1], batch[i]] = [batch[i], batch[i - 1]];
                        return { ...c, batch };
                      })
                    }
                  >
                    ↑ Earlier
                  </button>
                  <button
                    disabled={i === c.batch.length - 1}
                    onClick={() =>
                      update((c) => {
                        const batch = [...c.batch];
                        [batch[i + 1], batch[i]] = [batch[i], batch[i + 1]];
                        return { ...c, batch };
                      })
                    }
                  >
                    ↓ Later
                  </button>
                </div>
              </article>
            );
          })}
          {!!c.batch.length && (
            <section className="panel">
              <h2>Combined shopping list</h2>
              <ul>
                {[...shopping].map(([id, v]) => (
                  <li key={id}>
                    <b>
                      {v.qty} × {itemName(id)}
                    </b>{" "}
                    · {money(v.cash)}
                  </li>
                ))}
              </ul>
              <p>
                Owned materials are withdrawn once; whole-craft surpluses remain
                available. Verify stock at each quoted unit price: there is no
                listing-depth feed in this version.
              </p>
              <button className="primary" onClick={() => void copy(text)}>
                Copy ordered checklist
              </button>
            </section>
          )}
        </>
      )}
      <p className="note">
        Recorded profit from this character’s completed sales:{" "}
        <b>
          {money(
            c.sales
              .filter((s) => s.cost !== null)
              .reduce(
                (sum, s) => sum + net(s.gross) - s.cost! - s.lostDeposit,
                0,
              ),
          )}
        </b>
        . These entries are separate from this batch’s scenario and do not
        finance it.
      </p>
      <Credit />
    </>
  );
}
function HistoryChart({ q }: { q: Quote }) {
  const [range, setRange] = useState("7d");
  const samples = (q.history || []).filter(
      (s) =>
        s.median !== null &&
        (range !== "24h" || Date.parse(s.t) >= Date.now() - 86400000),
    ),
    values = samples.map((s) => s.median!),
    lo = Math.min(...values),
    hi = Math.max(...values),
    points = values
      .map(
        (v, i) =>
          `${20 + (i * 560) / Math.max(1, values.length - 1)},${150 - ((v - lo) * 120) / Math.max(1, hi - lo)}`,
      )
      .join(" ");
  return (
    <section className="history">
      <div className="actions">
        <h4>History of median asks</h4>
        <label>
          Window
          <select value={range} onChange={(e) => setRange(e.target.value)}>
            <option>24h</option>
            <option>7d</option>
          </select>
        </label>
      </div>
      {values.length > 1 ? (
        <>
          <svg
            viewBox="0 0 600 180"
            role="img"
            aria-label={`${range} median asking prices from ${money(lo)} to ${money(hi)}. These are listings, not confirmed sale prices.`}
          >
            <path d="M20 160H580" stroke="#d4d8cf" />
            <polyline
              points={points}
              fill="none"
              stroke="#1a6654"
              strokeWidth="3"
            />
          </svg>
          <p>
            {money(lo)} low · {money(hi)} high · {values.length} observed
            intervals
          </p>
        </>
      ) : (
        <p>Insufficient observations in this window.</p>
      )}
      <p>
        7-day median of asks: {money(q.median7d)}. Separately sourced detected
        sale price: {money(q.detectedSale)}. Provider sell-through is inferred,
        not proof that a disappearing auction sold.
      </p>
    </section>
  );
}
function Watchlist({
  c,
  market,
  update,
  watch,
  history,
  setHistory,
  load,
}: {
  c: Character;
  market: MarketData;
  update: (fn: (c: Character) => Character) => void;
  watch: (id: number) => void;
  history: number | null;
  setHistory: (id: number | null) => void;
  load: (id: number) => Promise<void>;
}) {
  const [item, setItem] = useState(4306),
    [itemSearch, setItemSearch] = useState(""),
    [saleItem, setSaleItem] = useState(4306),
    [saleQty, setSaleQty] = useState(1),
    [gross, setGross] = useState<number | null>(null),
    [cost, setCost] = useState<number | null>(null),
    [deposit, setDeposit] = useState<number | null>(0);
  const candidates = Object.values(ITEMS)
    .filter(
      (i) =>
        i.id > 0 && i.name.toLowerCase().includes(itemSearch.toLowerCase()),
    )
    .slice(0, 100);
  const realized = c.sales
    .filter((s) => s.cost !== null)
    .reduce((n, s) => n + net(s.gross) - s.cost! - s.lostDeposit, 0);
  return (
    <>
      <section className="page-heading">
        <h1>Watch market prices</h1>
        <p>
          Track asking prices and your own transactions separately. Thresholds
          are checks while this page is open, not background notifications.
        </p>
      </section>
      <form
        className="panel watch-add"
        onSubmit={(e) => {
          e.preventDefault();
          watch(item);
        }}
      >
        <label>
          Find catalogue item
          <input
            type="search"
            value={itemSearch}
            onChange={(e) => setItemSearch(e.target.value)}
            placeholder="Search item names"
          />
        </label>
        <label>
          Item
          <select value={item} onChange={(e) => setItem(+e.target.value)}>
            {!candidates.some((i) => i.id === item) && (
              <option value={item}>{itemName(item)}</option>
            )}
            {candidates.map((i) => (
              <option key={i.id} value={i.id}>
                {i.name} · #{i.id}
              </option>
            ))}
          </select>
        </label>
        <button className="primary">Add to watchlist</button>
      </form>
      <div className="watch-grid">
        {c.watch.map((w) => {
          const q =
              market.quotes[w.id]?.expiresAt > Date.now()
                ? market.quotes[w.id]
                : undefined,
            manual = c.manual[w.id],
            ask = manual ? manual.ask : (q?.ask ?? null),
            hit =
              ask !== null &&
              ((w.buyBelow !== null && ask <= w.buyBelow) ||
                (w.sellAbove !== null && ask >= w.sellAbove)),
            own = c.sales.filter((s) => s.itemId === w.id);
          return (
            <article className="panel watch-card" key={w.id}>
              <div className="section-title">
                <h2 className="watch-item-title">{itemName(w.id)}</h2>
                <button
                  className="text-button"
                  onClick={() =>
                    update((c) => ({
                      ...c,
                      watch: c.watch.filter((x) => x.id !== w.id),
                    }))
                  }
                >
                  Remove
                </button>
              </div>
              <p className="watch-price">
                {money(ask)}
                <small>lowest ask / manual purchase quote per unit</small>
              </p>
              <p>
                {manual ? "Manual · " + time(manual.observedAt) : quoteAge(q)}
              </p>
              <Demand q={q} />
              {hit && (
                <p className="threshold-hit">
                  A current ask crosses your threshold. Verify the actual
                  listings and exit price.
                </p>
              )}
              <div className="form-grid">
                <MoneyInput
                  label="Buy at or below / unit"
                  value={w.buyBelow}
                  onChange={(buyBelow) =>
                    update((c) => ({
                      ...c,
                      watch: c.watch.map((x) =>
                        x.id === w.id ? { ...x, buyBelow } : x,
                      ),
                    }))
                  }
                />
                <MoneyInput
                  label="Inspect asks at or above / unit"
                  value={w.sellAbove}
                  onChange={(sellAbove) =>
                    update((c) => ({
                      ...c,
                      watch: c.watch.map((x) =>
                        x.id === w.id ? { ...x, sellAbove } : x,
                      ),
                    }))
                  }
                />
              </div>
              <p>
                Recent typical listing: {money(q?.median)} · quantity{" "}
                {q?.quantity ?? "unknown"}. Your recorded sales:{" "}
                {own.reduce((n, s) => n + s.qty, 0)} units
                {own.length
                  ? " · latest gross unit " +
                    money(own.at(-1)!.gross / own.at(-1)!.qty)
                  : ""}
                .
              </p>
              <button
                onClick={() =>
                  history === w.id ? setHistory(null) : void load(w.id)
                }
              >
                {history === w.id
                  ? "Close price history"
                  : "Load 24h / 7d history"}
              </button>
              {history === w.id && q && <HistoryChart q={q} />}
              <QuoteEditor
                key={c.id + "-" + w.id}
                id={w.id}
                c={c}
                onUpdate={update}
              />
              <Credit url={q?.url} />
            </article>
          );
        })}
      </div>
      <details className="panel sales-log">
        <summary>Record a completed sale</summary>
        <p className="eyebrow">Your evidence, not inferred demand</p>
        <h2>Record a completed sale</h2>
        <p>
          Enter total gross proceeds before the AH cut. This records results; it
          does not alter your wallet or inventory automatically. Your current
          cash is updated in the profile.
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (gross === null) return;
            update((c) => ({
              ...c,
              sales: [
                ...c.sales,
                {
                  id: uid(),
                  itemId: saleItem,
                  qty: saleQty,
                  gross,
                  cost,
                  lostDeposit: deposit ?? 0,
                  when: new Date().toISOString(),
                },
              ].slice(-1000),
            }));
            setGross(null);
            setCost(null);
          }}
        >
          <div className="form-grid">
            <label>
              Item
              <select
                value={saleItem}
                onChange={(e) => setSaleItem(+e.target.value)}
              >
                {Object.values(ITEMS)
                  .filter((i) => i.id > 0)
                  .map((i) => (
                    <option key={i.id} value={i.id}>
                      {i.name}
                    </option>
                  ))}
              </select>
            </label>
            <label>
              Units sold
              <input
                type="number"
                min="1"
                max="100000"
                value={saleQty}
                onChange={(e) => {
                  const n = +e.target.value;
                  if (Number.isInteger(n) && n > 0 && n <= 100000)
                    setSaleQty(n);
                }}
              />
            </label>
            <MoneyInput
              label="Total gross sale proceeds"
              value={gross}
              onChange={setGross}
            />
            <MoneyInput
              label="Actual allocated input cost · optional"
              value={cost}
              onChange={setCost}
            />
            <MoneyInput
              label="Lost deposits across earlier attempts"
              value={deposit}
              onChange={setDeposit}
            />
          </div>
          <button className="primary" type="submit" disabled={gross === null}>
            Record actual sale
          </button>
        </form>
        <p>
          <b>{money(realized)}</b> realized profit on entries with a recorded
          cost · {c.sales.filter((s) => s.cost === null).length} entries have
          unknown profit.
        </p>
        {c.sales.length > 0 && (
          <details>
            <summary>{c.sales.length} sales-log entries</summary>
            <ul>
              {c.sales
                .slice()
                .reverse()
                .map((s) => (
                  <li key={s.id}>
                    {time(s.when)} · {s.qty} {itemName(s.itemId)} · net proceeds{" "}
                    {money(net(s.gross))} · profit{" "}
                    {s.cost === null
                      ? "Unknown"
                      : money(net(s.gross) - s.cost - s.lostDeposit)}{" "}
                    <button
                      onClick={() =>
                        update((c) => ({
                          ...c,
                          sales: c.sales.filter((x) => x.id !== s.id),
                        }))
                      }
                    >
                      Remove entry
                    </button>
                  </li>
                ))}
            </ul>
          </details>
        )}
      </details>
    </>
  );
}
function ProfileEditor({
  c,
  state,
  update,
  commit,
  close,
  notify,
}: {
  c: Character;
  state: SavedState;
  update: (fn: (c: Character) => Character) => void;
  commit: (s: SavedState) => void;
  close: () => void;
  notify: (s: string) => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null),
    [inventoryItem, setInventoryItem] = useState(2592),
    [inventoryQty, setInventoryQty] = useState(c.inventory[2592]?.qty || 0),
    [inventoryNote, setInventoryNote] = useState(c.inventory[2592]?.note || ""),
    [to, setTo] = useState(
      state.characters.find((p) => p.id !== c.id)?.id || "",
    ),
    [transferItem, setTransferItem] = useState(2592),
    [transferQty, setTransferQty] = useState(1),
    [vendorId, setVendorId] = useState(2321),
    [transferMessage, setTransferMessage] = useState("");
  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    const node = dialog.current;
    node?.showModal();
    return () => {
      node?.close();
      opener?.focus();
    };
  }, []);
  useEffect(() => {
    setInventoryQty(c.inventory[inventoryItem]?.qty || 0);
    setInventoryNote(c.inventory[inventoryItem]?.note || "");
  }, [
    inventoryItem,
    c.inventory[inventoryItem]?.qty,
    c.inventory[inventoryItem]?.note,
  ]);
  return (
    <dialog
      ref={dialog}
      className="profile-dialog"
      onCancel={close}
      aria-labelledby="profile-title"
    >
      <div className="dialog-top">
        <div>
          <p className="eyebrow">Character workspace</p>
          <h2 id="profile-title">{c.name}</h2>
        </div>
        <button aria-label="Close profile" onClick={close}>
          ×
        </button>
      </div>
      <p>
        Edit this character’s cash, skills and supplies. Other characters stay
        separate.
      </p>
      <div className="form-grid">
        <label>
          Character name
          <input
            maxLength={60}
            value={c.name}
            onChange={(e) => update((c) => ({ ...c, name: e.target.value }))}
          />
        </label>
        <label>
          Class / note
          <input
            maxLength={30}
            value={c.className}
            onChange={(e) =>
              update((c) => ({ ...c, className: e.target.value }))
            }
          />
        </label>
        <MoneyInput
          label="Actual cash on this character"
          value={c.cash}
          onChange={(cash) => update((c) => ({ ...c, cash }))}
        />
        <MoneyInput
          label="Maximum spending budget"
          value={c.budget}
          onChange={(budget) => update((c) => ({ ...c, budget }))}
        />
      </div>
      <p>
        Glimpo starts at 2g 50s. Cash for other characters is unknown until
        entered; it is never copied or pooled.
      </p>
      <section>
        <h3>Professions & rank caps</h3>
        <div className="form-grid">
          {Object.entries(c.skills).map(([profession, s]) => (
            <fieldset key={profession}>
              <legend>{profession}</legend>
              {(["level", "cap", "target"] as const).map((k) => (
                <label key={k}>
                  {k === "level"
                    ? "Current"
                    : k === "cap"
                      ? "Rank cap"
                      : "Target"}
                  <input
                    type="number"
                    min={k === "cap" ? 1 : 0}
                    max="300"
                    value={s[k]}
                    onChange={(e) => {
                      const value = +e.target.value;
                      if (
                        !Number.isInteger(value) ||
                        value < 0 ||
                        value > 300 ||
                        (k === "level" && value > s.cap) ||
                        (k === "cap" && (value < s.level || value < 1))
                      )
                        return;
                      update((c) => ({
                        ...c,
                        skills: {
                          ...c.skills,
                          [profession]: { ...s, [k]: value },
                        },
                      }));
                    }}
                  />
                </label>
              ))}
            </fieldset>
          ))}
        </div>
        <details>
          <summary>Change profession slots</summary>
          {Object.keys(c.skills).map((p, i) => (
            <label key={p}>
              Slot {i + 1}
              <select
                value={p}
                onChange={(e) =>
                  update((c) => {
                    const skills = { ...c.skills };
                    delete skills[p as Profession];
                    skills[e.target.value as Profession] = {
                      level: 1,
                      cap: 150,
                      target: 150,
                    };
                    return { ...c, skills };
                  })
                }
              >
                {PROFESSIONS.filter((v) => v === p || !c.skills[v]).map((v) => (
                  <option key={v}>{v}</option>
                ))}
              </select>
            </label>
          ))}
        </details>
      </section>
      <section>
        <h3>Inventory · quantities available now</h3>
        <p>
          Owned and donated inputs cost no additional cash, but their resale
          value stays visible. Free supplies are finite; zero recorded quantity
          means none is assumed available.
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            update((c) => ({
              ...c,
              inventory: {
                ...c.inventory,
                [inventoryItem]: {
                  qty: inventoryQty,
                  note: inventoryNote || "Owned stock",
                },
              },
            }));
          }}
        >
          <div className="form-grid">
            <label>
              Item
              <select
                value={inventoryItem}
                onChange={(e) => {
                  const id = +e.target.value;
                  setInventoryItem(id);
                  setInventoryQty(c.inventory[id]?.qty || 0);
                  setInventoryNote(c.inventory[id]?.note || "");
                }}
              >
                {Object.values(ITEMS)
                  .filter((i) => i.id > 0)
                  .map((i) => (
                    <option key={i.id} value={i.id}>
                      {i.name}
                    </option>
                  ))}
              </select>
            </label>
            <label>
              Available whole units
              <input
                type="number"
                min="0"
                max="1000000"
                value={inventoryQty}
                onChange={(e) => {
                  const n = +e.target.value;
                  if (Number.isInteger(n) && n >= 0 && n <= 1e6)
                    setInventoryQty(n);
                }}
              />
            </label>
            <label>
              Supply note
              <input
                value={inventoryNote}
                maxLength={200}
                placeholder="Matt’s cloth / free potions"
                onChange={(e) => setInventoryNote(e.target.value)}
              />
            </label>
          </div>
          <button type="submit">Set available quantity</button>
        </form>
        <ul className="inventory-list">
          {Object.entries(c.inventory).map(([id, v]) => (
            <li key={id}>
              <span>
                <b>
                  {v.qty} × {itemName(+id)}
                </b>
                <small>{v.note}</small>
              </span>
              <button
                onClick={() => {
                  setInventoryItem(+id);
                  setInventoryQty(v.qty);
                  setInventoryNote(v.note);
                }}
              >
                Edit
              </button>
              <button
                onClick={() =>
                  update((c) => {
                    const inventory = { ...c.inventory };
                    delete inventory[+id];
                    return { ...c, inventory };
                  })
                }
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h3>Explicit material transfer</h3>
        <p>
          This moves recorded stock only. It does not mail anything in game. You
          cannot transfer more than the sender has, or move a soulbound tool.
        </p>
        <div className="form-grid">
          <label>
            Recorded item
            <select
              value={transferItem}
              onChange={(e) => setTransferItem(+e.target.value)}
            >
              {!c.inventory[transferItem] && (
                <option value={transferItem}>
                  {itemName(transferItem)} · none recorded
                </option>
              )}
              {Object.entries(c.inventory).map(([id, v]) => (
                <option key={id} value={id}>
                  {itemName(+id)} · {v.qty} units
                </option>
              ))}
            </select>
          </label>
          <label>
            To character
            <select value={to} onChange={(e) => setTo(e.target.value)}>
              {state.characters
                .filter((p) => p.id !== c.id)
                .map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
            </select>
          </label>
          <label>
            Units
            <input
              type="number"
              min="1"
              value={transferQty}
              onChange={(e) =>
                setTransferQty(Math.max(1, Math.floor(+e.target.value || 1)))
              }
            />
          </label>
        </div>
        <button
          onClick={() => {
            try {
              commit(transfer(state, c.id, to, transferItem, transferQty));
              setTransferMessage(
                "Recorded transfer; move the actual items in game.",
              );
              notify("Recorded transfer; move the actual items in game.");
            } catch (e) {
              setTransferMessage((e as Error).message);
              notify((e as Error).message);
            }
          }}
        >
          Record transfer
        </button>
        <p role="status">{transferMessage}</p>
      </section>
      <section>
        <h3>Vendor quotes & tools</h3>
        <p>
          Fine Thread defaults to 1s before discounts. Override the actual unit
          quote here; live AH listings do not replace vendor supply prices.
        </p>
        <div className="form-grid">
          <label>
            Vendor item
            <select
              value={vendorId}
              onChange={(e) => setVendorId(+e.target.value)}
            >
              {Object.values(ITEMS)
                .filter((i) => i.vendor !== undefined)
                .map((i) => (
                  <option key={i.id} value={i.id}>
                    {i.name}
                  </option>
                ))}
            </select>
          </label>
          <MoneyInput
            key={vendorId}
            label="Actual vendor price per unit"
            value={c.vendor[vendorId] ?? ITEMS[vendorId]?.vendor ?? null}
            onChange={(n) => {
              if (n !== null)
                update((c) => ({
                  ...c,
                  vendor: { ...c.vendor, [vendorId]: n },
                }));
            }}
          />
        </div>
        <label className="inline">
          <input
            type="checkbox"
            checked={c.tools.includes(6339)}
            onChange={(e) =>
              update((c) => ({
                ...c,
                tools: e.target.checked
                  ? [...new Set([...c.tools, 6339])]
                  : c.tools.filter((i) => i !== 6339),
              }))
            }
          />
          I have the required Runed Silver Rod available
        </label>
      </section>
      <button className="primary wide" onClick={close}>
        Done · return to planner
      </button>
    </dialog>
  );
}
export default App;
