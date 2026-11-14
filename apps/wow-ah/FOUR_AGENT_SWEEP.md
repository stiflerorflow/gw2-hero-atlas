# Independent four-reviewer bug sweep — 2026-11-14

Scope: the Copper Ledger app, after release910ac63. Four independent reviewers audited calculations/data, complete user flows, mobile/accessibility, and engineering reliability. Each reproduced new defects, implemented focused fixes in separate source areas, and cross-reviewed another reviewer's result. The root integration pass independently checked the combined math and release.

## Confirmed findings and fixes

| Area | Reproduction | Result |
|---|---|---|
| Nested acquisition stock | Need8 Lesser Magic Essences; listings contain4 Lesser at100c and2 Greater at1000c. The previous result bought5 Lesser across nested branches and claimed1500c. | Immutable purchase ledgers track every branch and input. Feasible minimum is2200c: two Greater split and two Lesser bought. Discarded alternatives never consume shared stock. |
| Mixed conversion choices | Partly available raw units and whole conversion lots could reuse inputs or make pointless reciprocal conversions. | Check the minimum conversion-lot breakpoint, prevent circular conversion detours, preserve whole-lot surplus and debit quoted stock across subsequent batch rows. |
| Physical pattern unlock | An unlearned pattern with zero listed quantity could still fund a craft from its nonzero ask. An owned pattern was charged as a purchase. | Acquire a physical pattern through the stock/inventory engine once. Consume an owned pattern once at zero extra cash while preserving its resale opportunity cost. Include a purchased pattern once in shopping. Explicit scalar unlock-price overrides remain user-entered scenarios, not proof of market stock. |
| Cash draft identity | Two characters have the same saved cash. Type an invalid cash draft in one, then select the other; the invalid text previously persisted under the second name. | Reset just the cash input for character identity and backup-restore revision. Open supply disclosures stay intact. |
| Below-fold navigation | Activate Review batch from a recommendation below the fold; old scroll position could hide the new budget. | Explicit in-app navigation focuses main content and scrolls to top. Native Back restores the prior scroll, and Forward returns to the batch position. Refresh and profile edits do not steal focus. |
| Cleared override values | Enter a recipe fee or vendor-price override, then clear the field. The old number remained saved behind the blank field. | Clearing removes the override and restores reference/unknown behavior. Blur cannot silently re-save the restored reference as an override. Pattern helper text distinguishes ownership/stock from a scalar fee scenario. |
| Unknown binding values | A catalogue item with binding UNKNOWN was treated as verified tradable metadata. | Accept explicit recognized bound/tradable forms only. Other strings, missing values and unrecognized types remain unknown and cannot certify auction eligibility. Added explicit pickup/account/warband bound aliases. |
| Open comparison aging | A fresh comparison crossed its one-hour observation-age threshold without interaction and retained its earlier recommendation until a later expiry/render. | A separate observation-age deadline updates the verdict while its cache is still valid; cache expiry remains independently enforced. |
| Expanded text contrast | Lower unavailable-recipe badges failed at4.34:1; priced Leveling labels failed at4.14:1. Default/empty-route checks did not expose these. | Darker foregrounds; independent cross-review measured5.22:1 for badges and5.91:1 for route labels on actual surfaces. |
| Keyboard focus and target size | Toast dismissal's gold focus ring contrasted only2.45:1 against its background; tablet/desktop profile selects were42px. | A light focus outline meets contrast; profile selectors meet the44px target standard. |

## Independent cross-checks

- Root's separate brute-force oracle enumerated **3,840** bounded essence purchase cases: both directions, three relative-price pairs, finite raw/converted stocks, owned quantities and requested amounts. It independently enumerates feasible purchases and minimum cash without calling planner helpers. Every result matched, and purchased quantities stayed within available stock.
- Reliability independently checked a mixed batch with owned Greater1, listed Greater1 at50c and Lesser3 at100c: two Greater Wands plus two Lesser Wands cost202c including wood, reuse the actual retained surplus, and do not mutate original inventory. A custom quote-source label confirmed stock accounting does not depend on display text.
- Math independently tested26 binding cases through the actual adapter/helper and reviewed the cash identity and quote-age timer changes.
- Mobile independently activated Review batch using the keyboard at320/390px: scroll0, visible budget and focused main. Back restored1520px/1306px respectively; Forward returned to batch top. Equal-wallet keyboard profile changes cleared invalid cash drafts.
- Flow independently measured the CSS contrast fixes and reran the mobile reviewer's expanded candidate, populated-route, target-size and toast-keyboard checks.

## Release verification

Combined suite: **83 unit tests and53 browser tests**, including all earlier regressions. Build and source/release consistency checks run before publication; the published asset version and core flows are checked after deployment. Only `apps/wow-ah/` and its generated `wow-ah/` release change. No additional dependencies or provider snapshots are introduced.

The audit does not change external-data boundaries: asking prices and daily rates are observations/estimates, not executable depth or confirmed personal sales. Trainer/rank acquisition, deposits and actual skill/DE rolls still need the game client. Recipe coverage and maximum-batch performance retain the limitations recorded in the earlier audit reports.
