import type { Character } from "../types";
import type { batchPlan } from "../engine/planner";
import { money } from "../engine/money";
export function BatchGuide({
  c,
  plan,
  showChecklist,
  showEditor,
}: {
  c: Character;
  plan: ReturnType<typeof batchPlan>;
  showChecklist: () => void;
  showEditor: () => void;
}) {
  if (!c.batch.length) return null;
  const missingPrice = plan.rows.find((r) => r.cost.cash === null);
  const blocked = plan.rows.find((r) => !r.eligible);
  const deposit = plan.rows.find((r) => r.depositHeld === null);
  const focusRow = (id: string, selector: string) => {
    showEditor();
    requestAnimationFrame(() => {
      const row = document.getElementById("batch-" + id);
      const input = row?.querySelector<HTMLInputElement>(selector);
      input?.focus();
      input?.scrollIntoView({ block: "center", behavior: "smooth" });
    });
  };
  return (
    <section className="decision-summary" aria-label="Next batch step">
      {missingPrice ? (
        <>
          <h2>Next: check the missing prices</h2>
          <p>
            {missingPrice.name}: {missingPrice.cost.missing.join(" ")}
          </p>
          <a href="#leveling">Review recipes and trainer fees</a>
          {" · "}
          <a href="#watchlist">Enter material quotes</a>
        </>
      ) : blocked ? (
        <>
          <h2>Next: resolve the requirements</h2>
          <p>
            {blocked.name}: {blocked.reasons.join(" ")}
          </p>
          <a href="#opportunities">Check character details and tools</a>
        </>
      ) : c.cash === null ? (
        <>
          <h2>Next: enter your current gold</h2>
          <a href="#opportunities">Open character details</a>
        </>
      ) : deposit ? (
        <>
          <h2>Next: enter the posting deposit</h2>
          <p>
            For {deposit.name}, check the deposit for your selected listing
            duration in game. Purchases and unlocks need {money(plan.cash)}{" "}
            before deposits. No sales fund the purchase.
          </p>
          <button
            onClick={() => focusRow(deposit.action.id, "[data-deposit] input")}
          >
            Enter deposit for {deposit.name}
          </button>
        </>
      ) : plan.fits === false ? (
        <>
          <h2>Next: reduce the batch</h2>
          <p>
            It needs {money(plan.upfront)} upfront; your inputs budget is{" "}
            {money(plan.spendable)}. Reduce quantities or review your reserve
            before spending.
          </p>
          <button
            onClick={() => focusRow(c.batch[0].id, 'input[type="number"]')}
          >
            Review quantity
          </button>
        </>
      ) : (
        <>
          <h2>Ready to verify in game</h2>
          <p>
            {money(plan.upfront)} upfront, with {money(plan.cashLeft)} left
            before any sale. Confirm recipe learning, tool availability and
            current prices, then follow the checklist. The budget does not
            promise a profit.
          </p>
          <button className="primary" onClick={showChecklist}>
            Open the action checklist
          </button>
        </>
      )}
    </section>
  );
}
