import { useMemo, useState } from "react";
import type { Action, Character, MarketData } from "../types";
import { ITEMS, itemName } from "../catalog/items";
import { recipeById, recipeTools } from "../catalog/recipes";
import {
  characterPlan,
  DEFAULT_PRIORITIES,
  hasYieldDownside,
} from "../engine/characterPlan";
import { CharacterContext } from "./CharacterContext";
import { money } from "../engine/money";
export function CharacterPlan({
  c,
  market,
  loading,
  update,
  add,
  settings,
  revision = 0,
}: {
  c: Character;
  market: MarketData;
  loading: boolean;
  update: (f: (c: Character) => Character) => boolean;
  add: (a: Action) => void;
  settings: () => void;
  revision?: number;
}) {
  const [priorities, setPriorities] = useState(DEFAULT_PRIORITIES);
  const plan = useMemo(
    () => characterPlan(c, market, priorities),
    [c, market, priorities],
  );
  return (
    <section className="character-plan">
      <div className="page-heading">
        <h1>Character plan</h1>
        <p>
          Plan profession skill using your recorded context and a limited
          checked recipe set.
        </p>
      </div>
      <section className="panel" aria-label="Character context">
        <CharacterContext
          key={c.id}
          c={c}
          update={update}
          settings={settings}
          revision={revision}
          spendable={plan.spendable}
        />
      </section>
      <section aria-label="Suggested next steps">
        <div className="section-title">
          <h2 id="next-steps-title" tabIndex={-1}>
            Your next steps
          </h2>
          <span className="note">
            {loading
              ? "Checking prices…"
              : `${plan.checked} checked action types`}
          </span>
        </div>
        <p className="note">
          For current market evidence, <a href="#scanner">open Market scan</a>.
          Skill options below are estimates within this catalogue, not a search
          of every money-making activity.
        </p>
        <details className="plan-priorities">
          <summary>Compare priorities</summary>
          <label className="inline">
            <input
              type="checkbox"
              checked={!!priorities.includeScenarios}
              onChange={(e) =>
                setPriorities({
                  ...priorities,
                  includeScenarios: e.target.checked,
                })
              }
            />
            Include crafting profit scenarios
          </label>
          <p className="note">
            Optional what-if calculations. A recipe source verifies mechanics;
            it does not establish demand or a profitable resale.
          </p>
          <div className="form-grid">
            <label>
              Progress priority
              <select
                value={priorities.progress}
                onChange={(e) =>
                  setPriorities({
                    ...priorities,
                    progress: e.target.value as "cash" | "net",
                  })
                }
              >
                <option value="cash">Lowest upfront cost</option>
                <option value="net">Lowest cost after quoted resale</option>
              </select>
            </label>
            <label>
              Gold priority
              <select
                value={priorities.gold}
                onChange={(e) =>
                  setPriorities({
                    ...priorities,
                    gold: e.target.value as "yield" | "margin",
                  })
                }
              >
                <option value="yield">Lower yield risk first</option>
                <option value="margin">Highest expected margin</option>
              </select>
            </label>
          </div>
          <p className="note">
            These compare one attempt at a time. Lower yield risk does not
            guarantee buyers or profit. Neither option predicts your selling
            speed.
          </p>
        </details>
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
                const r = recipeById(e.action.recipeId ?? 0);
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
                          ? (c.inventory[e.action.itemId]?.qty ?? 0) >= 1
                            ? "Disenchant one from your recorded supplies"
                            : "Buy one and disenchant it"
                          : r?.service
                            ? "Apply one enchant to suitable owned gear"
                            : e.action.kind === "convert"
                              ? "Make one conversion lot"
                              : "Model one craft for resale"}
                      .
                    </p>
                    <dl className="mini-stats">
                      <div>
                        <dt>Cash inputs & unlock</dt>
                        <dd>{money(e.cost.cash)}</dd>
                      </div>
                      <div>
                        <dt>
                          {e.de
                            ? "Modeled craft skill gain"
                            : "Expected skill gain"}
                        </dt>
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
                      After best known input sale value:{" "}
                      {money(e.economicProfit)}.{" "}
                      {e.depositHeld === null
                        ? "Posting deposit is not included; enter it in Batch before spending."
                        : "No posting deposit is assumed for kept tools or enchant applications."}
                    </p>
                    {e.oldest &&
                      Date.now() - Date.parse(e.oldest) > 3600_000 && (
                        <p className="note">
                          Price data used here is over an hour old. Recheck the
                          prices in game.
                        </p>
                      )}
                    {e.de && (
                      <p className="note">
                        {e.de.guaranteed
                          ? "Material yield is guaranteed; resale prices are not."
                          : `One-roll cash margin before deposits: ${money(e.de.worst === null ? null : e.de.worst * e.units - e.cost.cash!)} to ${money(e.de.best === null ? null : e.de.best * e.units - e.cost.cash!)}. Material drops vary.`}{" "}
                        {e.de.breakEvenChance !== null && !e.de.guaranteed && (
                          <>
                            {" "}
                            Modeled chance to cover cash inputs before deposits:{" "}
                            {(e.de.breakEvenChance * 100).toFixed(0)}%.{" "}
                          </>
                        )}
                        DE skill gains are not modeled; this plan does not count
                        them toward your Enchanting target.
                      </p>
                    )}
                    {r &&
                      r.acquisition !== "conversion" &&
                      !c.known.includes(r.id) && (
                        <p className="note">
                          <b>Learn the {r.acquisition} recipe first.</b> The
                          shown cash cost includes its saved unlock fee; confirm
                          the quote in game.
                        </p>
                      )}
                    {r &&
                      r.acquisition !== "conversion" &&
                      !c.known.includes(r.id) && (
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
                    {hasYieldDownside(e) && goals.includes("Gold scenario") && (
                      <p className="warning">
                        Higher-risk gold option · a bad drop can leave you worse
                        off.
                      </p>
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
                      <p className="note">
                        Owned inputs use the higher known vendor payout or net
                        auction quote. Auction values assume a buyer; missing
                        auction data can leave only a vendor floor.
                      </p>
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
                      {r && recipeTools(r).length > 0 && (
                        <p className="note">
                          Tools: {recipeTools(r).map(itemName).join(", ")}.
                          {r.station ? ` Use a nearby ${r.station}.` : ""}
                        </p>
                      )}
                      {e.de && !ITEMS[e.action.itemId]?.de && (
                        <p className="note">
                          DE table supplied by the price provider; not
                          independently checked for this item. Verify its
                          outcome table before buying.
                        </p>
                      )}
                      {r && (
                        <p className="note">
                          {r.acquisition === "conversion"
                            ? `Makes ${r.count} units · no profession or recipe unlock required`
                            : `${r.profession} ${r.min} · ${r.acquisition} · ${r.binding}`}{" "}
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
        <summary>Checked recipe coverage</summary>
        <p className="note">
          This planner compares a checked subset, not every recipe in Forever.
          Unknown trainer fees need entering in Leveling, or confirmation that
          the recipe is learned.
        </p>
        {plan.coverage.map((v) => (
          <p key={v.profession}>
            <b>{v.profession}:</b> {v.total} repeat recipes checked; {v.current}{" "}
            can still give skill at your current level, {v.learned} marked
            learned. The checked set can give skill through {v.through}, subject
            to your trained cap, materials and tools.{" "}
            <a href="#leveling">Review recipes and fees</a>.
          </p>
        ))}
      </details>
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
          Skill chances and DE stack averages are baseline estimates. Legacy
          perks, campsite bonuses and individual sales speed are not modeled.
        </p>
        <p>
          Use Leveling to confirm recipes, tools, targets and material quotes.
          Farming routes are a separate future feature.
        </p>
      </details>
    </section>
  );
}
