# Whole-tool audit — 2026-11-14

Scope: Copper Ledger only, following the live recommendation/data review. Reviewed all six workflows: Flip scanner, Sell or vendor, Character plan and detailed crafting, Leveling, Batch planner, Watchlist and sales. The other applications and Pages configuration are outside this change.

## How it was checked

- Read the calculation engine, profile validation/persistence, request adapters/caches, all screen components and their error/loading/expanded states.
- Reproduced incorrect calculations and cache races with failing regressions before fixing them.
- Exercised complete browser flows: quote edits, recovered-material pricing, profession changes, unknown restored inventory, sales, backup restore, bound items, navigation and reload.
- Retested phone widths320/390 and desktop widths through1280; checked keyboard/modal flows, expanded content, horizontal overflow and automated accessibility.
- Ran dependency auditing, TypeScript/build checks, source/release consistency and the combined test suite. Synthetic test data stays separate from provider snapshots and the user's normal browser profiles.

## Findings fixed

| Area | Reproduced defect | Corrected behavior |
|---|---|---|
| Action math | A restored non-crafting action could carry a conversion recipe ID and multiply purchased outputs/proceeds. | Only craft/conversion actions use recipe metadata. Backup normalization strips unrelated recipe IDs. |
| Auction eligibility | Known soulbound owned stock could be modeled as auction income. | Known bound items cannot generate an eligible auction resale scenario. Common explicit bound codes are handled consistently. |
| Incomplete item facts | Missing binding metadata was normalized into the same value as confirmed unbound metadata. | Unknown binding remains unknown; a price override cannot establish auction eligibility. |
| Request ordering | A late older response could overwrite a newer same-path payload in either provider cache. | Request-scoped tickets protect the cache. Only the latest-started in-flight request writes the entry; tickets are removed on completion/failure. |
| Disenchanting controls | The destroyed item's gross exit field was editable but ignored by DE recovery math. | Remove unused exit controls for the destroyed item; preserve any existing separate resale assumption. |
| Recovered-material prices | Batch could edit the input purchase but offered no direct correction for the material exits actually used in the DE estimate. | Input/DE material editors expose the recovered materials. Exit-only material quotes count as available, and changing one changes recovery and survives reload. |
| Incomplete profiles | A valid restored character with no professions had no way to choose one. | Character plan can add either missing profession. Empty Leveling links directly to setup. |
| Profession changes | Leveling could keep the deleted profession selected after changing it in profile settings. | The selected profession follows the available slots immediately. |
| Inventory editing | A restored item without loaded name metadata was missing from its own editor's dropdown. | Preserve an explicit selected fallback option for the imported ID and its quantity. |
| Conversion UX | Internal conversion IDs were absent from recipe lookup, producing an "Items to buy" label for whole conversion operations. | Correct operation/output labels, no learned-recipe checkbox or unlock claim, and real item-reference links rather than negative spell URLs. |
| Sale log | Recording a second sale could reuse the first sale's one-off lost-deposit cost. | Clear that cost after a successful record; retain it when a write is rejected. |
| Quote feedback | Editing a saved quote left the previous "Saved" status visible before saving the new draft. | Clear the prior status while a draft changes. |
| Backup recovery | A valid backup could not be loaded if browser storage writes were blocked. | Explicit restore can load a temporary session, with a clear export-before-closing message. It never claims persistence succeeded. |
| Pasted links | Search did not recognize the catalogue's own item-slug URLs. | Accept that URL format alongside numeric IDs, Wowhead links and in-game item links. |
| Accessibility | Expanded DE/history content could skip a heading level; money validation was not programmatically associated with its field. | Context-appropriate headings, explicit input names/help associations and announced validation errors. |
| Narrow layout | The selected profession clipped on a320px screen; the toast dismiss target overrode the shared width minimum. | Rebalance profession/skill widths while preserving readable inputs and44px targets. |
| Performance | Large batches repeatedly rolled the same original-skill estimate before rolling the shared batch state. Purge ticks also created new state even when nothing expired. | Compute shared batch skill once, skip zero-probability states and finished gray rolls, memoize the batch plan, and retain unchanged market state on no-op purge ticks. |

## Validation and remaining limits

Final suite: **75 unit tests and43 browser tests**, including the existing expiry, stale-tab, source-correction, provider-failure, stock-sharing, deposits and profile-isolation regressions. Expanded phone DE/history states pass automated accessibility checks. `npm audit` reported **zero known vulnerabilities**, including development dependencies, at the time of this run.

A maximum50-row ×1000-craft batch on a320px viewport under4× CPU throttling took approximately5.27 seconds before the performance changes and4.28 seconds afterward; switching to the posting checklist took0.34 seconds afterward. These are local stress measurements, not universal benchmarks. Maximum batches can still take several seconds on a slow device; no claim of instant performance is made.

Automated accessibility and browser coverage cannot prove the absence of every defect. External catalogue coverage, provider freshness, listing depth, actual sales, game-client prerequisites/discounts, and modeled skill/DE chances retain the boundaries documented in [the live accuracy review](CHARACTER_VALIDATION.md). No external orders, postings or in-game actions were performed. No new farming or catalogue-expansion feature was added during the sweep.

The release is verified against the built assets and checked again on the published Pages URL. Only `apps/wow-ah/` source and the generated `wow-ah/` release are deployed.
