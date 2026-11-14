import { useState } from "react";
import type { Character, Profession } from "../types";
import { PROFESSIONS } from "../types";
import { itemName } from "../catalog/items";
import { relevantTools } from "../catalog/recipes";
import { keySupplies } from "../engine/characterPlan";
import { MoneyInput } from "./MoneyInput";
import { money } from "../engine/money";
export function CharacterContext({
  c,
  update,
  settings,
  revision,
  spendable,
}: {
  c: Character;
  update: (f: (c: Character) => Character) => boolean;
  settings: () => void;
  revision: number;
  spendable: number | null;
}) {
  const [editing, setEditing] = useState(
    c.characterLevel === null || c.cash === null,
  );
  const supplies = keySupplies(c);
  return (
    <details
      open={editing}
      onToggle={(e) => setEditing(e.currentTarget.open)}
      className="context-editor"
    >
      <summary>
        Character details ·{" "}
        {c.characterLevel === null
          ? "level needed"
          : `Level ${c.characterLevel}`}{" "}
        · {money(c.cash)}
        <span className="note">
          {Object.entries(c.skills)
            .map(([p, s]) => `${p} ${s.level}`)
            .join(" · ")}{" "}
          · tap to edit
        </span>
      </summary>
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
          key={c.id + "-" + revision}
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
        {Object.keys(c.skills).length < 2 && (
          <label>
            Add profession
            <select
              value=""
              onChange={(e) => {
                const profession = e.target.value as Profession;
                if (profession)
                  update((c) => ({
                    ...c,
                    skills: {
                      ...c.skills,
                      [profession]: { level: 1, cap: 75, target: 150 },
                    },
                  }));
              }}
            >
              <option value="">Choose a profession…</option>
              {PROFESSIONS.filter((p) => !c.skills[p]).map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>
          </label>
        )}
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
                {PROFESSIONS.filter((v) => v === p || !c.skills[v]).map((v) => (
                  <option key={v}>{v}</option>
                ))}
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
                              ? Math.min(300, (Math.floor(level / 75) + 1) * 75)
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
        Inputs budget: <b>{money(spendable)}</b> after your reserve and saved
        spending limit.{" "}
        <button className="text-button" onClick={settings}>
          Adjust limits, targets or trained caps
        </button>
      </p>
      {relevantTools(c).length > 0 && (
        <div className="tool-checks">
          <p className="note">
            Confirm tools you have available. Unconfirmed tools block recipes
            that need them.
          </p>
          {relevantTools(c).map((id) => (
            <label className="inline" key={id}>
              <input
                type="checkbox"
                checked={c.tools.includes(id)}
                onChange={(e) => {
                  const checked = e.target.checked;
                  update((c) => ({
                    ...c,
                    tools: checked
                      ? [...new Set([...c.tools, id])]
                      : c.tools.filter((v) => v !== id),
                  }));
                }}
              />
              I have {itemName(id)} available
            </label>
          ))}
        </div>
      )}
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

      <button
        className="primary"
        onClick={() => {
          setEditing(false);
          requestAnimationFrame(() => {
            document.getElementById("next-steps-title")?.focus();
            document
              .getElementById("next-steps-title")
              ?.scrollIntoView({ block: "start" });
          });
        }}
      >
        Show my next steps
      </button>
    </details>
  );
}
