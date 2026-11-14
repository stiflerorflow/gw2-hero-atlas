import { useMemo } from "react";
import type { Action, Character, MarketData, Profession } from "../types";
import { PROFESSIONS } from "../types";
import { ITEMS, itemName } from "../catalog/items";
import { RECIPES } from "../catalog/recipes";
import { characterPlan, keySupplies } from "../engine/characterPlan";
import { MoneyInput } from "./MoneyInput";
import { money } from "../engine/money";
export function CharacterPlan({
  c,
  market,
  loading,
  update,
  add,
  settings,
}: {
  c: Character;
  market: MarketData;
  loading: boolean;
  update: (f: (c: Character) => Character) => boolean;
  add: (a: Action) => void;
  settings: () => void;
}) {
  const plan = useMemo(() => characterPlan(c, market), [c, market]),
    supplies = keySupplies(c);
  return (
    <section className="character-plan">
      <div className="page-heading">
        <h1>Character plan</h1>
        <p>Use your level, professions and gold to choose a small next step.</p>
      </div>
      <section className="panel" aria-label="Character context">
        <div className="form-grid">
          <label>
            Current character level
            <input
              type="number"
              min="1"
              max="60"
              placeholder="Not entered"
              value={c.characterLevel ?? ""}
              onChange={(e) => {
                const n = e.target.value === "" ? null : +e.target.value;
                if (n === null || (Number.isInteger(n) && n >= 1 && n <= 60))
                  update((c) => ({ ...c, characterLevel: n }));
              }}
            />
          </label>
          <MoneyInput
            label="Current gold on this character"
            value={c.cash}
            onChange={(cash) =>
              update((c) => ({
                ...c,
                cash,
                budget: c.budget === c.cash ? cash : c.budget,
              }))
            }
          />
          {Object.entries(c.skills).map(([p, s], i) => (
            <fieldset key={p}>
              <legend>Profession {i + 1}</legend>
              <label>
                Profession
                <select
                  value={p}
                  onChange={(e) => {
                    const profession = e.target.value as Profession;
                    update((c) => {
                      const skills = Object.fromEntries(
                        Object.entries(c.skills).map(([slot, value]) =>
                          slot === p
                            ? [profession, { level: 1, cap: 75, target: 150 }]
                            : [slot, value],
                        ),
                      );
                      return { ...c, skills };
                    });
                  }}
                >
                  {PROFESSIONS.filter((v) => v === p || !c.skills[v]).map(
                    (v) => (
                      <option key={v}>{v}</option>
                    ),
                  )}
                </select>
              </label>
              <label>
                Current skill
                <input
                  aria-label={`Current ${p} skill`}
                  type="number"
                  min="1"
                  max="300"
                  value={s.level}
                  onChange={(e) => {
                    const level = +e.target.value;
                    if (Number.isInteger(level) && level >= 1 && level <= 300)
                      update((c) => ({
                        ...c,
                        skills: {
                          ...c.skills,
                          [p]: {
                            ...s,
                            level,
                            target:
                              level >= s.target
                                ? Math.min(
                                    300,
                                    (Math.floor(level / 75) + 1) * 75,
                                  )
                                : s.target,
                            cap: Math.max(
                              s.cap,
                              level <= 75
                                ? 75
                                : level <= 150
                                  ? 150
                                  : level <= 225
                                    ? 225
                                    : 300,
                            ),
                          },
                        },
                      }));
                  }}
                />
              </label>
            </fieldset>
          ))}
        </div>
        <p className="note">
          Inputs budget: <b>{money(plan.spendable)}</b> after your reserve and
          saved spending limit.{" "}
          <button className="text-button" onClick={settings}>
            Adjust limits, targets or trained caps
          </button>
        </p>
        <details>
          <summary>Relevant supplies · optional</summary>
          <p className="note">
            Enter only what is available now. Unrecorded supplies are assumed
            unavailable; free or donated stock is finite.
          </p>
          <div className="form-grid">
            {supplies.map((id) => (
              <label key={id}>
                {itemName(id)}
                <input
                  type="number"
                  min="0"
                  max="1000000"
                  value={c.inventory[id]?.qty ?? 0}
                  onChange={(e) => {
                    const qty = +e.target.value;
                    if (Number.isInteger(qty) && qty >= 0 && qty <= 1e6)
                      update((c) => ({
                        ...c,
                        inventory: {
                          ...c.inventory,
                          [id]: {
                            qty,
                            note: c.inventory[id]?.note || "Owned supply",
                          },
                        },
                      }));
                  }}
                />
              </label>
            ))}
          </div>
          <button onClick={settings}>Other inventory and tools</button>
        </details>
      </section>
      <section aria-label="Suggested next steps">
        <div className="section-title">
          <h2>Your next steps</h2>
          <span className="note">
            {loading
              ? "Checking prices…"
              : `${plan.checked} checked action types`}
          </span>
        </div>
        {plan.blockers.length > 0 ? (
          <div className="decision-summary">
            <h3>Finish the character context</h3>
            <ul>
              {plan.blockers.map((v) => (
                <li key={v}>{v}</li>
              ))}
            </ul>
          </div>
        ) : loading ? (
          <p role="status">Checking recipes, prices and the inputs budget…</p>
        ) : (
          <>
            <div className="plan-choices">
              {plan.choices.map(({ evaluation: e, goals, reason }) => {
                const r = RECIPES.find((r) => r.id === e.action.recipeId);
                const deItem = ITEMS[e.action.itemId]?.de
                  ? ITEMS[e.action.itemId]
                  : market.deItems.find((i) => i.id === e.action.itemId);
                const deSources = [
                  ...new Set(
                    deItem?.de?.map((o) => o.source).filter(Boolean) || [],
                  ),
                ];
                return (
                  <article className="panel plan-choice" key={e.action.id}>
                    <p className="plan-goal">{goals.join(" · ")}</p>
                    <h3>{e.name}</h3>
                    <p>
                      {e.action.kind === "craft-de"
                        ? "Craft one and disenchant it"
                        : e.action.kind === "buy-de"
                          ? "Buy one and disenchant it"
                          : r?.service
                            ? "Apply one enchant to suitable owned gear"
                            : e.action.kind === "convert"
                              ? "Make one conversion lot"
                              : "Craft one to test the market"}
                      .
                    </p>
                    <dl className="mini-stats">
                      <div>
                        <dt>Cash inputs & unlock</dt>
                        <dd>{money(e.cost.cash)}</dd>
                      </div>
                      <div>
                        <dt>Expected skill gain</dt>
                        <dd>{e.skill.toFixed(2)}</dd>
                      </div>
                      <div>
                        <dt>
                          {e.de
                            ? "Expected cash margin"
                            : "Cash margin if sold"}
                        </dt>
                        <dd>{money(e.profit)}</dd>
                      </div>
                    </dl>
                    <p className="note">
                      After input resale value: {money(e.economicProfit)}.{" "}
                      {e.depositHeld === null
                        ? "Posting deposit is not included; enter it in Batch before spending."
                        : "No posting deposit is assumed for kept tools or enchant applications."}
                    </p>
                    {e.oldest &&
                      Date.now() - Date.parse(e.oldest) > 6 * 3600_000 && (
                        <p className="note">
                          Price data used here is over six hours old. Recheck
                          the prices in game.
                        </p>
                      )}
                    {e.de && (
                      <p className="note">
                        {e.de.guaranteed
                          ? "Material yield is guaranteed; resale prices are not."
                          : `One-roll cash margin before deposits: ${money(e.de.worst === null ? null : e.de.worst * e.units - e.cost.cash!)} to ${money(e.de.best === null ? null : e.de.best * e.units - e.cost.cash!)}. Material drops vary.`}{" "}
                        Disenchanting does not award Enchanting skill.
                      </p>
                    )}
                    {r && !c.known.includes(r.id) && (
                      <p className="note">
                        <b>Learn the {r.acquisition} recipe first.</b> The shown
                        cash cost includes its saved unlock fee; confirm the
                        quote in game.
                      </p>
                    )}
                    {r && !c.known.includes(r.id) && (
                      <label className="inline">
                        <input
                          type="checkbox"
                          checked={false}
                          onChange={() =>
                            update((c) => ({
                              ...c,
                              known: [...new Set([...c.known, r.id])],
                            }))
                          }
                        />
                        I already know this recipe
                      </label>
                    )}
                    <p className="note">{reason}</p>
                    <div className="row-actions">
                      <button className="primary" onClick={() => add(e.action)}>
                        Add one to batch
                      </button>
                      <a href="#batch">Review batch</a>
                    </div>
                    <details>
                      <summary>Materials and requirements</summary>
                      <ul>
                        {e.cost.lines.map((l, i) => (
                          <li key={i}>
                            {l.qty} {itemName(l.id)} · {money(l.cash)} cash ·{" "}
                            {l.source}
                          </li>
                        ))}
                      </ul>
                      {e.oldest && (
                        <p className="note">
                          Oldest recorded price observation:{" "}
                          {new Date(e.oldest).toLocaleString()}.
                        </p>
                      )}
                      {e.quote && !e.de && (
                        <p className="note">
                          Output market activity:{" "}
                          {e.quote.soldPerDay === null
                            ? "unknown daily rate"
                            : `${e.quote.soldPerDay.toLocaleString()}/day estimated across the market`}
                          .{" "}
                          {e.quote.quantity === null
                            ? "Listing stock unknown."
                            : `${e.quote.quantity} units listed in the snapshot.`}{" "}
                          This does not predict your own sales.
                        </p>
                      )}
                      {deSources.map((url) => (
                        <p className="note" key={url}>
                          <a href={url} target="_blank" rel="noreferrer">
                            Disenchant outcome reference ↗
                          </a>
                        </p>
                      ))}
                      {r && (
                        <p className="note">
                          {r.profession} {r.min} · {r.acquisition} · {r.binding}{" "}
                          ·{" "}
                          <a href={r.source} target="_blank" rel="noreferrer">
                            Recipe source ↗
                          </a>
                        </p>
                      )}
                      {e.reasons.length > 0 && (
                        <ul>
                          {e.reasons.map((v) => (
                            <li key={v}>{v}</li>
                          ))}
                        </ul>
                      )}
                    </details>
                  </article>
                );
              })}
            </div>
            {plan.notes.map((v) => (
              <p className="note" key={v}>
                {v}
              </p>
            ))}
            <p className="note">
              These are alternative next steps, not a combined shopping list.
              Batch checks shared supplies and total cash once. Expected skill
              rates and DE values are estimates; update actual skill and drops
              before repeating.
            </p>
            <p className="note">
              Already have an item to sell?{" "}
              <a href="#sell">Compare auction and vendor gold</a>.
            </p>
            <p className="credit">
              <a href="https://ahledger.com" target="_blank" rel="noreferrer">
                Prices from AHledger ↗
              </a>
            </p>
          </>
        )}
      </section>
      <details className="panel">
        <summary>How character level and priorities are used</summary>
        <p>
          Character level checks crafting-rank ranges: Journeyman up to 150 from
          level 10, Expert up to 225 from level 20, Artisan up to 300 from level
          35. Your saved trained cap still controls access. Gathering
          requirements are not inferred from crafting ranks.{" "}
          <a
            href="https://www.icy-veins.com/wow-forever/professions-overview"
            target="_blank"
            rel="noreferrer"
          >
            Rank reference ↗
          </a>
        </p>
        <p>
          Progress picks the lowest cash cost per expected point among checked
          one-craft choices. Gold picks require a positive modeled margin after
          valuing owned inputs. Profits assume sale or material recovery at
          current quotes; no market share or sale time is promised. The
          catalogue is a small checked set, not every recipe in Forever.
          Equipment's required wearing level does not decide whether you can
          craft it for sale.
        </p>
        <p>
          Use Leveling to confirm recipes, tools, targets and material quotes.
          Farming routes are a separate future feature.
        </p>
      </details>
    </section>
  );
}
