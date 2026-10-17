# Research priorities audit

17 October 2026 · reviewed application revision `935fca9`.

The highest-value next research is a **complete, source-checked and then field-tested champion duo plan for Steve and Matt**. The project already has broad catalogue coverage. Its next improvement should be stronger evidence behind the decisions it recommends: which exact builds to run, what to change, what to buy, and which fights those choices solve.

This audit reviewed the embedded datasets, recommendation functions, research notes and UX records, plus targeted live source checks. It did not replay the game, establish new combat benchmarks, re-audit every external source or change/deploy the application.

## Evidence from the current project

| Area | What is present | Research gap |
|---|---|---|
| Spec bible | 36 specs; 115 source-build records across 113 unique URLs | Source coverage is broad; fun, flow, floor, comfort and solo-power estimates still need practical calibration. |
| Cozy lanes | 72 selections; 18 specs use the same source build for both lanes | Shared sources can be appropriate, but each lane needs an explicit, tested skill priority and description of the compromises. |
| Duo notebook | 14 supported specs, 25 role choices and 12 curated pairings | Pairings are editorial hypotheses. Matt’s actual equipment is unconfirmed and Steve’s D/D alacrity variant is explicitly experimental. |
| Gear planner | Primary stat slots, item multiplicity, armour weight and weapon-access rules | It is not an audit of the players’ physical inventories or a complete upgrade shopping list. Bindings, upgrades, relics, food, tier and costs need separate evidence. |
| Quiz and encounter guidance | Explained preference scores and six encounter categories | Effective range and encounter fit use heuristics; several learning-path steps come from a spec-level profile reused across builds. Accuracy needs validation beyond working UI controls. |
| Atlas | 100 hero challenges | 22 explicitly flag incomplete approach/prerequisite documentation: 4 HoT, 4 PoF, 14 EoD. This is not a finding that their coordinates or rewards are wrong. |
| Mastery | 73 distinct reward sources | Four combat-djinn approaches are documented as incomplete; timing/effort rankings would benefit from actual route runs. |
| Mobile | Extensive Chromium touch/layout tests | Physical iOS/Safari and real task observation remain untested. Application tests do not establish combat effectiveness. |
| Freshness | Dated source revisions and a manual snapshot | Seven of the 115 build records carry pre-2026 revisions. Age alone does not invalidate them; field-level provenance and targeted rechecks would improve confidence. |

## 1. Validate the exact current champion duo — highest priority

**Question:** Which two complete loadouts give Steve and Matt the most reliable champion clears with acceptable effort and minimal new investment?

Start with the actual current characters. Record weapons, traits, utility bar, stats, runes, sigils, relic, equipment tier, food and relevant expansion/training access. Build-template codes cover skills/traits, so equipment must be recorded separately. The live site’s browser-local notes are not accessible to this audit.

Research and compare:

- **Reaper + Untamed:** the current robust starting pair.
- **Power D/D Tempest + Untamed:** first preserve Steve’s weapon layout; compare his actual damage setup with a deliberately specified alacrity-support experiment.
- **Reaper + a complete heal-alacrity Druid:** a recovery-oriented alternative when repeated deaths are the problem. Do not assume Matt’s condition Druid is already this build.

Calculate the proposed shared-boon loop from current PvE skill/trait values, cooldowns, boon duration and range. Then check what reaches the *partner* during movement and defensive interruptions. Include might/fury, breakbar jobs, cleanse, stability, recovery and damage uptime; counting quickness and alacrity badges is insufficient.

The live [Fresh Air source](https://metabattle.com/wiki/Build:Tempest_-_Fresh_Air) defaults to scepter/warhorn and cautions that theoretical alacrity coverage can be unrealistic in real fights. The live [Untamed source](https://metabattle.com/wiki/Build:Untamed_-_Boon_DPS_Power_Untamed_Open_World) distinguishes shared quickness access from permanent personal quickness. These support making this research first; they do not establish a finished D/D duo build.

**Deliverable:** two fully specified current-roster loadouts and one recovery alternative, with skill priorities, partner responsibilities, a small change list, equipment/access requirements and explicit evidence status. Keep any untested D/D conversion labelled provisional.

**Done when:** every recommended skill belongs to the stated weapons/traits, the gear plan is complete, shared-boon assumptions are documented, and remaining combat questions are clearly separated from source-confirmed mechanics.

## 2. Research specific PoF champions and run a small comparison pilot

**Question:** Which encounters are suitable first duo targets, and what changes are required for each?

Choose roughly six encounters within the users’ revealed areas, separating hero-challenge champions, ordinary champion events and bounties. Start with repeatable examples of sustained melee pressure, movement/ranged pressure and condition/defensive pressure. Confirm spawn/reset conditions, timers, breakbar behavior, projectile interactions, cleanses, recovery windows and any special positioning requirements. Bounty effects and outside players can change the comparison.

For the first three encounters, try repeated attempts per pairing if practical. Record clear/failure, duration, downs, recovery time, missed control opportunities, partner-boon gaps, perceived effort, gear/skill changes and other players present. Record bounty effects. A small pilot provides observations, not a universal ranking; optional logs or video can improve attribution, but neither is required to begin.

**Deliverable:** spoiler-controlled encounter cards with a suggested pair, one alternative, each player’s job, a short opening plan, useful swaps, common failure causes and “come back later” conditions. Add an evidence label for sourced mechanics versus observed duo results.

**Done when:** a recommendation names the fight conditions it was tested under and does not claim that one pairing or one successful attempt proves all champions are covered.

## 3. Research gear reuse and upgrade value for these loadouts

**Question:** What is the cheapest meaningful improvement from what each player actually owns?

Audit physical items and bindings, weights, exact stats, upgrades, relics and unlocks. Check exotic sufficiency, ascended stat-change eligibility, accessible acquisition routes and account-bound alternatives. Only then price tradable items using timestamped quotes. Trading-post prices alone do not cover collections, vendors, currencies or non-tradable unlocks.

Compare the cost and practical benefit of one defensive/boon adjustment, a second equipment template, and a new specialization. Distinguish item reuse from merely having matching stats. Preserve separate inventory facts for Matt and Steve.

**Deliverable:** “reuse / obtain / optional” lists and an ordered upgrade plan, with assumptions, quote dates, prerequisites and changes that can wait. Do not publish a fixed gold total without a checked shopping basket.

**Done when:** every required item or unlock has a verified acquisition path, the list avoids duplicate ownership assumptions, and optional improvements are separated from prerequisites.

## 4. Observe the real mobile workflow

**Question:** Can the users complete the intended decisions easily on their actual phones?

Observe the sequence: choose a build → inspect requirements → record owned setup → compare a target → choose a duo → edit a note → copy or restore a plan. Prioritize the phone/browser where problems were reported, plus a physical iPhone/Safari session if available.

Record completion, confusion, wrong selections, keyboard/scroll behavior, disclosure-state loss, native-select readability, copy fallback, reload behavior and slow-network loading. Confirm whether browser-local progress and cross-device transfer are understood. This is usability research; a successful automated tap is only one part of it.

**Deliverable:** a short issue list supported by task observations and reproducible steps, ordered by task impact. Research sharing/sync requirements through this workflow before choosing infrastructure.

## 5. Calibrate the spec finder, cozy lanes and learning paths

**Question:** Do the explanations and scores predict the experience of the exact recommended variant?

Begin with the current roster and thief shortlist. Verify effective ranged damage, forced movement, ground dependence, resource tracking, defensive responses and the smallest useful repeatable loop per build. Review cases where both cozy lanes share a source: specify what the relaxed loop omits and what the survival loop actively requires. Replace generic learning advice with source-specific priorities where evidence supports it.

Use a consistent practical rubric: attention required, simultaneous resources, recovery after a mistake, movement freedom, defensive effort and useful damage uptime. Keep personal fun/fantasy preferences explicit. Preserve the requested positive treatment of skill ceiling and the four-part overall formula; improve the evidence and comparability of its inputs.

**Deliverable:** calibrated explanations and confidence labels for a focused first batch, followed by broader coverage. Include worked quiz examples and documented exceptions. Do not assign new precision just because a decimal can be displayed.

## 6. Revalidate source selection and compare builds within roles

**Question:** Is each recommendation supported by the intended source criterion and an appropriate comparison group?

Recheck the builds used by priorities 1–3 first, then expand. Separate pure damage, boon damage and heal/boon roles, and distinguish solo, duo and organised-group conditions. A raw damage band omits the value supplied by a boon role; it cannot by itself decide which role improves a two-player party.

One concrete revalidation lead: the stored Druid group pick is condition-alacrity and the original research explains the absence of a pure-DPS benchmark option. The current [Snow Crows ranger directory](https://snowcrows.com/builds/raids/ranger) lists both Condition Druid and Condition Alacrity Druid. That does **not** prove a new benchmark winner or invalidate the selected build; it is reason to recheck the candidate set and wording.

Track source publication/revision, balance label, checked date and the fields actually verified. Keep upcoming balance previews separate from live recommendations. Older source dates should trigger targeted review, not automatic deletion.

**Deliverable:** a source-change queue and an evidence checklist per selected build, with a documented reason for each pick and a clear pending-review status where necessary.

## 7. Close the existing route-evidence gaps selectively

Prioritize the four incompletely documented PoF hero approaches when they affect the players’ progress, then the four combat-djinn mastery approaches. Confirm exact starting points, mastery requirements, transfers/jumps, approach hazards and realistic completion effort. Handle the EoD gaps within the existing spoiler boundary when those routes become relevant.

**Deliverable:** verified approaches, ideally supported by a recorded route or reliable detailed evidence, plus revisions to readiness/effort labels. API reward/coordinate verification and route verification remain separate facts.

## Recommended first research package

1. Capture the current Reaper, D/D Tempest and Untamed loadouts; establish Matt’s actual Druid variant if recovery support is being considered.
2. Produce the complete current-roster duo plans, rechecking their sources and assumptions.
3. Create three initial champion cards and a repeatable comparison sheet.
4. Use the observed results to choose one upgrade path and the next unlock worth investigating.

This package connects the existing roster, spec bible, ownership tools and duo page to the user’s concrete goal. Additional expansion catalogues, broad new rankings and an exhaustive all-spec pairing matrix can follow once the build and encounter evidence is stronger.
