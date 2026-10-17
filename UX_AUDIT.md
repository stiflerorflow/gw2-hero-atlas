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
