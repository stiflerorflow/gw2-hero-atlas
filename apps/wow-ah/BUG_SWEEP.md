# Four-agent bug sweep — 2026-11-14

Scope: The Copper Ledger in `apps/wow-ah`, released at `/wow-ah/`. Existing GW2, Revenue Cloud and Skyscale files were not changed. Four independent reviewers covered planner math, data/persistence, functional workflows, and mobile/accessibility. Findings were reproduced and fixed with regression coverage.

## Confirmed fixes

- Spending limits and cash reserves now apply independently; a reserve no longer unnecessarily reduces an already smaller spending limit.
- Unknown lost deposits leave partial-sale profit unknown. Services and soulbound tools cannot lose deposits they never needed to post.
- Successive batch rows share their profession's skill distribution and cap. Already-owned/repeated one-time rods cannot manufacture additional forecast gains.
- Imported disenchant tables are no longer hidden by catalogue name-only entries. Explicit non-DE exceptions and checked tables still take priority.
- Material sourcing considers mixed crafted/purchased bolts when raw quote stock or owned stock limits the cheaper path.
- Quote ages compare actual instants across timestamp formats and time zones.
- Malformed backup entries no longer crash restore; imported action/sales identifiers stay unique and watch items are deduplicated.
- Transfers reject destination overflow instead of creating quantities lost on the next reload.
- Malformed API entries cannot discard otherwise valid rows; incomplete DE tables are rejected, history timestamps sorted/normalized, and HTTP Age reduces cache lifetime.
- Money edits commit before Enter submits their form. Invalid/out-of-range amounts are flagged and block form submission. External form resets refresh the displayed value.
- Character switches and backup restores clear stale drafts; editing stock and transferring stock use separate item selectors.
- Narrow-screen form controls use16px text to avoid iPhone focus zoom. Expanded input tables can be reached and scrolled from the keyboard, populated batches preserve heading order, and closing the profile restores focus.

## Verification

Pure Vitest regressions cover arithmetic, finite inventory, market stock, deposits, skill progression, recipe restrictions, imports/transfers, adapters and cache behavior. Playwright checks the original four flows plus new Enter-submit, profile isolation/restore, invalid inputs, populated batches, dialog focus and320px expanded states. Axe checks cover all four screens on phone/desktop and newly expanded states. Production dependency audit and a fresh build are run before release. GitHub CI repeats tests/build and verifies the checked-in static release matches the source.

This sweep does not establish actual in-game prices, sell-through or yellow/green skill-up probabilities. Those remain explicitly identified assumptions in the app. Tests exercise browser behavior in Chromium; phone text-size checks guard Safari focus zoom but do not replace testing on a physical iPhone.

Final local results: **36 unit tests and10 browser tests passed**; production build and production dependency audit passed.
