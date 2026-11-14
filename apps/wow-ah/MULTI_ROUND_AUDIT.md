# Multi-round application audit — 2026-11-14

Scope: all six Copper Ledger workflows. GW2, Revenue Cloud and Skyscale are outside this change.

## Review method

1. Four independent first-pass reviews: product/decision correctness, end-to-end UX, visual/content design, and engineering/data behavior. Reviewers reproduced problems before proposing changes.
2. Assigned fixes with separate source ownership and focused regressions. Priorities were incorrect conclusions, lost context, misleading feedback, then hierarchy and page density.
3. Cross-review the integrated result, including code owned by another reviewer, and retest the relevant expanded/loading/error states. Release only after the combined suite and deployment checks.

The presentation target is a working decision tool: conclusion first, supporting prices next, assumptions and source detail on demand. Plain functional copy, system fonts, quiet colors and visible focus are preferred to slogans, oversized editorial headings or decorative dashboards.

## Workflow checks

| Workflow | Decision the screen should support | Audit focus |
|---|---|---|
| Flip scanner | Is this quoted spread worth investigating? | Visible buy/resale/profit, demand and quote age; preserve calculations and unexpired history through refresh; correct visible-result count |
| Sell or vendor | Does this sale scenario beat NPC buyback? | Stale quotes, source/override provenance, quantities, binding and expired catalogue facts; no foreign-market prices |
| Crafting | Does this character have an eligible, fundable action? | Clear loading state, material price correction, gates, fees and cash versus owned-material value |
| Leveling | What can I use for the next skill points? | Explain missing inputs with an adjacent correction path; learned fees and detailed recipe facts do not dominate the route |
| Batch | Can I pay for these actions before anything sells? | Missing cash versus other blockers, shared stock, deposits and upfront funding; rejected edits must never report success |
| Watchlist | What item/price am I watching? | Search selection identity, manual purchase versus exit overrides, latest-click history requests, collapsed secondary settings |

## Confirmed first-pass findings

- Scanner results began around980px down a390px phone screen and840px down a1280px desktop screen. Headings/chrome occupied the first view while useful prices were below it.
- Resale assumptions were less visible than the resulting profit.
- Loaded history was replaced by periodic market refresh; chart requests could finish out of order and reopen an earlier item.
- Saving only a manual exit assumption erased an otherwise valid purchase quote.
- A stale profile tab could show a success toast for an edit that was actually rejected.
- A stale losing sale quote could recommend vendoring more confidently than an equally stale winning quote.
- Manual vendor overrides were not visibly identified once their editor was collapsed.
- Provider caches and standalone comparison state could retain expired payloads without a subsequent read.
- Missing material prices had no direct correction path where crafting/leveling asked for them.
- Watchlist search could leave a different item selected when adding the search result.
- Missing character cash was described as a requirements/deposit problem in batch feedback.
- Dense learned-recipe fees and threshold editors added long scrolling before a useful action.

## Release criteria

- Unit/regression tests for changed math, expiry and quote semantics.
- Browser tests for feedback truthfulness, latest-click behavior, navigation context and manual correction.
- Phone/desktop overflow and accessibility checks, including populated and expanded states.
- First scanner result visible substantially sooner;44px controls and16px mobile input text remain usable.
- Fresh production build matches the checked-in release; existing Pages paths and profile backups remain compatible.

Remaining data limits are product facts, not hidden audit failures: no confirmed market-wide sales feed, no executable full price ladder, estimated yellow/green skill probabilities, and third-party item catalogues that can lag the live build. The UI must keep these assumptions separate from known cash and item facts.

## Integrated result

Three audit rounds completed with four reviewers. The cross-review reproduced and then independently rechecked the late-history rewind and exact-deadline expiry defects; both are fixed. A stale open profile dialog now closes so the reload warning can be acted on. No blocking product, visual or integration issues remained in the final reviews.

- System typography and tabular money replaced the oversized editorial hierarchy; external font downloads were removed.
- Scanner buy, assumed resale and profit are visible together before explanatory detail.
- First card starts at635px on320px screens,627px at390px and481px at1280px with the system font (previously about980px mobile/840px desktop). Wider-font coverage is also tested: the worst mobile first-card position was673px; at390px, all first-card price values finished by765px, within an844px viewport. These are measured layout-test fixtures, not a claim that every long item name fits identically.
- Provider cache payloads and displayed supplementary history expire on their actual deadlines. User drafts have separate session lifetimes and cannot prolong provider-data retention.
- Exit-only overrides preserve purchase quotes; stale writes cannot report success; missing cash and missing material-price paths now give actionable guidance.
- Catalogue expiry cannot turn a previously bound item into an AH recommendation through retained manual prices.
- Manual overrides remain identified and reversible after their editors collapse.

The combined local suite passed54 unit tests and27 browser tests. Final release checks also cover source/build consistency and the deployed app. One non-blocking limitation remains: the recipe catalogue is naturally long on narrow screens, though learned fees and source notes are collapsed. Disclosure controls retain44px minimum targets.

Clean-runner release verification found a font-dependent density failure after local checks passed. Duplicate scanner copy and spacing were reduced; the original layout limits were retained and tested with both system and wider fallback fonts. This was corrected before final sign-off.
