# UI and UX bug sweep · 17 October 2026

Scope: the map atlas, route planner, help, PoF mastery checklist and Elite Spec Bible, including both cozy lanes and all six practical tools.

## Confirmed issues and fixes

| Area | Before | After |
|---|---|---|
| Navigation | Only two views had deep links; changing the hash did not change the visible view. Back/Forward and reload could show a different view. | All five views support URL navigation, reload and browser history. Opening maps or restoring a backup keeps the URL consistent with the visible view. |
| Clipboard | Build codes and gear lists used waypoint messages. The fallback text input stripped checklist line breaks. | Copy messages identify waypoints, templates or checklists. Multiline fallback uses a selectable textarea; short codes keep their input fallback. A late clipboard rejection does not overwrite an already-open dialog. |
| Expanded details | Editing a personal rating closed the exact gear/template section. | Nested build sections retain their open state through rerenders. |
| Keyboard and editing | Clearing the last comparison or removing a filtered favourite left focus on the page body. Text selection could move during rerenders. | Focus moves to a relevant visible control, detail summaries have stable identifiers, and text caret/selection is restored when the value is unchanged. |
| Journal | “Open spec & edit” stopped at the collapsed spec card. | It opens and focuses the personal editor. Whitespace-only text does not create an otherwise empty journal entry. |
| Search | A build name such as “Fresh Air” could return no result even though that build was displayed. | Search includes revealed build names and trait lines as well as specs, weapons and playstyle text. |
| Quiz | Editing preferences left results that appeared current but belonged to the previous answers. | A changed-preferences notice replaces old results until they are recalculated. |
| Hidden gear presets | Hiding an expansion silently substituted a hypothetical Berserker inventory and another target. | Saved choices remain stored. A hidden target requires an explicit choice or reveal. A hidden owned setup contributes no assumed inventory and is labelled as unverified. Copy is disabled without a revealed target. |
| Gear selectors | Aliases of the same source page appeared as indistinguishable duplicate choices. | Each selector contains one option per source URL while preserving the selected saved alias. |
| Rating presentation | High effort/difficulty used the same positive colour as high fun or ceiling. | Demand metrics use a separate colour and retain their actual numeric scale. High skill ceiling remains positive. |
| Filter feedback | Unrelated award cards could remain visible in an empty personal collection or encounter filter. | Award highlights appear in the unfiltered catalogue. |
| Motion and announcements | Tool jumps always requested smooth scrolling; typing notes and gear changes could repeat large announcements. | Tool jumps respect reduced motion. Unchanged save messages are not repeated. Gear announcements summarize counts and access rather than reading the entire regenerated table. |
| Short screens | Copy dialogs had no explicit viewport-height bound. | Dialogs scroll within the viewport; the checklist textarea is independently scrollable. |

## Verification

Targeted browser checks reproduced the failures before the fixes and verified navigation/history, focus, selection, disclosure state, source-name search, editor jumps, quiz freshness, hidden presets, unique selector choices and both successful/denied clipboard paths afterward.

The sweep also checks:

- All five views at widths 1440, 768, 390 and 320 CSS pixels, plus a 667×375 short landscape screen.
- Every specialization expanded in solo, group, low-input cozy and survival-first cozy modes, including unique DOM identifiers and all nested forms.
- Narrow-layout resilience with increased text spacing and maximum-length personal notes.
- Automated WCAG A/AA checks with expanded tool and build sections.
- The existing 100-challenge hero catalogue, 73 mastery rewards, spoiler controls, backup migration/restore and point accounting.
- Real backup export/import carrying notes, learning checkpoints and gear settings; stale-save protection still prevents clobbering newer saved progress.

Automation uses Chromium with keyboard, reduced-motion and touch-capable viewport checks. This is broad regression coverage, not a claim that every browser, physical device or screen reader was tested. Existing build research and ratings were not re-audited as a balance update.

## Elite spec navigation follow-up — 2026-10-17

A user reported that tapping Elite spec bible did nothing. Fresh production sessions did not reproduce that exact device failure. Navigation previously depended entirely on the final JavaScript handler, and every view render depended on rendering the map first.

The five view controls now use native hash links. A small early loading handler shows the selected view and loading status before the embedded guide data finishes loading. Each view renders independently; a map-rendering failure cannot block the spec catalogue. Clicking the current view retries its render. Hidden generated spec/mastery content is discarded, preserving spoiler protection after backup imports or boundary reductions.

Verified mobile touch navigation while the HTML response was deliberately paused before the embedded data, recovery by clicking the current tab, and spec navigation with an injected map-rendering exception. Existing navigation, accessibility, spec tools, mastery and backup regressions were also checked. This improves the failure paths without claiming to identify the user's exact browser failure.

## Mobile quiz and ownership sweep — 2026-10-17

The focused phone audit found 12px form inputs, 39px selects, 24px ownership labels, clipped selected-build descriptions and a disabled armour-weight field that retained the Berserker preset’s weight when a different owned build was selected. The quiz inherited catalogue filters located below it without showing their scope. Following a match into a two-build card did not identify the matching variant, and the gear-plan jump could leave its focused target off screen.

Changes:

- Touch layouts use 16px form inputs and at least 48px control/ownership-label targets. Quiz actions stack on narrow phones; ownership and target selection are grouped into two steps. Comparison details collapse separately.
- Source and target pickers have independent searches over revealed spec, profession, weapon and build names. Full selected descriptions wrap beneath the native select. Searching retains the current saved selection, explains zero matches and never reveals a hidden build. Unchanged option lists retain their DOM nodes and stable order.
- Owned-build weight is derived from its profession. Switching back restores the separately saved Berserker weight. “Gear not recorded” assumes no inventory, marks every target slot unverified, and survives backups/reloads. Hidden saved presets remain stored and never become invented gear.
- Quiz scope lists its PvE setting, build focus and catalogue filters. A local clear-filters action preserves the chosen build focus. An optional recorded-access filter checks expansion/weapon prerequisites. Ownership remains separate from spoiler reveals, gear inventory and specialization training.
- Submitting moves focus to the results; matches identify the selected variant, offer its exact gear plan and provide a return path. Gear-plan jumps show the target control. Copies identify the owned setup and explicitly state when compared stat slots need no changes.

The repeatable `tests/mobile-tools.cjs` exercises touch flows at 320, 360, 375, 390, 430 and 768 CSS pixels, plus landscape and increased text spacing. It checks repeated ownership-label taps, search/empty states, correct weights and restored presets, quiz filtering/reset/handoffs, exact gear targets, unknown inventory, copy content, saved progress, reloads and spoiler changes. All 115 sourced build presets were checked for retained aliases, complete self-reuse and correct derived armour weight; unchanged option lists retained their nodes. Existing full spec/tools/accessibility, backup and five-view navigation regressions also passed. Chromium touch emulation was used; physical-device Safari was not tested. WebKit was downloaded, but this environment lacks its required shared libraries and administrative package installation was unavailable.

## Editable champion-duo notebook — 2026-10-17

The sixth native-navigation view, `#duo`, adds Matt and Steve’s editable current/planned roster, source-linked role assumptions, complementary/duplicate-boon feedback, champion breakbar jobs, pairing experiments, a thief shortlist and local setup/session notes. Dagger/dagger Tempest is preserved and its optional alacrity conversion remains explicitly experimental. No role selection writes to inventory, hero points, mastery or global spoiler reveals.

`tests/duo.cjs` passed current/planned selection, all supported role modes and curated recipes, empty-roster recovery, stable editor disclosures/focus, escaped notes, copy/print, actual backup export/import, old/malformed save validation, reset/archive/reopen and browser-local progress checks. Automated WCAG A/AA checks passed with the editor expanded; 320, 360, 390, 430, 768 and 1440 CSS-pixel layouts, increased text spacing and landscape were checked. Browser Back/Forward and direct/reloaded `#duo` routes passed. The existing spec/tools, gear mobile, backup and five-view navigation suites passed too. Physical Safari devices were not tested.

## Four-agent whole-tool sweep · 17 October 2026

Audited deployed revision `2e44361`, then verified corrections locally. Four independent scopes: functionality/progress recovery; mobile/accessibility; catalogue/source/spoiler data; API/privacy/imported gear. Added portable `tests/sweep-{functional,mobile,data,api}.cjs` checks alongside existing regressions.

Fixed imported equipment search to include actual item names and stats; replaced two GuildJen guessed paths with links verified from the provider menu. Hardened imported gear against invalid or duplicate physical slots (including Back/Backpack aliases), conflicting character bindings, missing account eligibility and negative/invalid specialization IDs. Eligible level80 Exotic/Ascended/Legendary candidates now take priority over lower-tier candidates. Incomplete public metadata fails the import rather than inventing a core build or partial equipment resolution.

Coverage: seven tabs, reload/history/print, real two-tab stale-write and corrupt-save protection, reset isolation,100HP/73mastery data integrity,115build profiles,36specs across settings/lenses/cozy lanes, hidden source/print suppression, and imported API request boundaries/cancellation/privacy. All73mastery achievements were also checked against the public official achievement endpoint and each has one mastery reward. Mobile checks include320/390/768 whole-tool expanded disclosures, WCAG2A/AA and2.1AA axe checks, text spacing and landscape; deeper tool flows also cover360/375/430. No browser exceptions, duplicate DOM IDs or horizontal overflow were found in these tested paths.

Limits: Chromium automation, not a physical-device/Safari certification; authenticated API paths use fixtures, not real account keys; combat performance remains editorial/source-derived rather than personally field-tested. Passing this sweep is evidence for the tested paths, not a claim that every future action is bug-free.

## Account workspace and production-readiness pass · 17 October 2026

Added default Start here navigation, a four-step API-key guide, per-account setup/resource/progress data, source-based upgrade priorities and account-only partner sharing. The matrices now cover eight views. The new account suite tests the populated workspace at320/390/768/1440, optional WCAG2A/AA+2.1AA axe, text spacing, onboarding, partial permissions, stale-section dates, cancellation, account/profession isolation, malformed files, selective sharing, whole-guide backup/restore and localStorage quota failures. Existing deep mobile, duo, catalogue, API and functional tests also pass; the whole-tool mobile matrix covers eight tabs with expanded disclosures, text spacing and landscape.

The pass found and fixed atlas URLs that became ambiguous after changing the default landing view; disclosure/focus loss during training edits; ambiguous default target selection for power equipment; cross-profession training claims from imported files; and scans that could outlive a backup restore or account replacement/removal. Account changes reset personal-item disclosure. Reported ownership is applied only by an explicit action. API mastery progress is read-only, selected-account-specific and separate from manual ticks.

Browser authentication correction supersedes the earlier API audit’s URL-boundary assertion: GW2 does not support the Authorization preflight used by the initial importer. The working browser transport uses the official HTTPS `access_token` request parameter, only to api.guildwars2.com, never a page-navigation URL. This is disclosed in the guide/import UI; keys remain excluded from saved and exported data. A real-browser deliberately invalid-key request returned a readable401; successful private imports remain fixture-tested. See ACCOUNT_WORKSPACE_RESEARCH.md for contracts and limitations.

This is a strengthened static personal tool, not an enterprise-service certification. No real-key successful import, physical Safari test, server authentication, encrypted backend, automatic synchronisation or game field test is claimed.

## Upgrade, acquisition, Vault and journal verification · 17 October 2026

Checked115source equipment variants and restored a missing Dire Backpiece in one cozy profile; normalized public `Harpoon` weapon IDs to Spear for actual imports. Added exact upgrade references to revealed spec cards and quantities/spare-item accounting to saved setups. Price and acquisition requests are explicit, public metadata requests exclude API keys, and private recipe/crafting verification is limited to the matching connected account. Lowest offer, waiting buy-order estimates, unavailable stock, incomplete subtotals, remaining component costs, separate currencies and unknown unlocks are labelled distinctly.

Optional daily/weekly/listing Vault scans keep old dates/data after failures. Objective/reward names are opt-in and reset across account/connection changes. API purchase counters are explicitly unreliable and never certify stock. The manual journal preserves the originally recorded pair during edits, escapes notes, survives reload/backups and has separate confirmation for destructive removal/clear; derived practice advice does not alter editorial scores.

The new `tests/upgrades-vault-journal.cjs` covers catalogue fingerprints/quantities, set swaps, spare counts, non-tradable/rate-limited quotes, public/private request boundaries, wrong-account recipe isolation, ingredient/currency/discipline/unlock checks, Vault schema/failure/privacy behaviour, journal CRUD/persistence, populated workspace/journal axe and320/390/768reflow. Existing eight-view functional/mobile/accessibility, duo,115preset, data/spoiler and API regressions pass. Real public prices and a current Scholar-rune recipe were also read from the official API. Successful private account paths remain fixture-tested; physical Safari and combat performance are not claimed tested.

## Fresh four-agent whole-tool sweep · 18 October 2026

Audited revision `be3175b` across four independent scopes: functionality and persistence; mobile UX and accessibility; catalogue correctness and spoilers; API/privacy and asynchronous operations. Found and corrected three issues:

- Partner-file import captured unrelated equipment snapshots before confirmation. An in-flight equipment save completing while the dialog was open could then be silently discarded. The confirmation now merges against current state and rechecks account capacity, snapshot capacity and ID conflicts before changing saved data.
- Exact sigil comparison used weapon-name membership without physical quantities. Two daggers could satisfy a dagger/torch target and hide a missing sigil. Matching now consumes source weapon occurrences; legitimate dual daggers, two-handed weapons with two sigils and swapped weapon sets remain supported.
- Editing a fight with zero deaths showed an empty death field. Explicit zero values now remain visible.

Added focused `tests/audit2-{functional,data,api}.cjs` regressions. Fresh checks covered all eight tabs, browser history/reload/print, stale-tab and corrupt-save protection, account/Vault/journal backup round trips, journal escaping and pair preservation, account removal,115 source fingerprints and upgrade records,100HP/73mastery data,36specializations, spoiler suppression, API cancellation and secret boundaries. Existing deep mobile, source import, duo, account workspace and upgrade/market/Vault/journal suites also passed.

Mobile coverage includes all eight tabs at320/390/768 CSS pixels with expanded disclosures, text spacing, landscape and automated WCAG2A/AA+2.1AA checks; deeper touch flows additionally cover360/375/430. Populated market, recipe, Vault and journal paths passed touch and accessibility checks. No new overflow, automated accessibility violation or browser exception was found in the tested paths.

Limits: Chromium automation rather than physical-device/Safari certification; private API scenarios use synthetic fixtures without real account credentials; source snapshots and metadata do not substitute for gameplay validation. This audit does not certify the absence of all bugs.
