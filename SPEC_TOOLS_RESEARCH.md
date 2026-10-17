# Spec Bible v2: cozy lanes and practical tools

Research snapshot: 17 October 2026 UTC. This audit contains every elite-spec name, including later expansions. The app keeps the EoD/newest expansion boundaries independent of map reveals.

## Research and evidence

The update re-fetched 60 current source pages successfully: 36 existing open-world references plus 24 Snow Crows Champion Hunter pages (two Evoker variants). It selects 23 Champion Hunter source records for defensive alternatives; two were already referenced in v1. Across the original and added records the dataset has 113 unique build-page URLs. Source revision and balance labels are shown individually. Upcoming November balance previews are not applied.

References: [Snow Crows open-world guides](https://snowcrows.com/builds/open-world), [MetaBattle open-world guides](https://metabattle.com/wiki/Open_World), [official skill API](https://api.guildwars2.com/v2/skills), [official profession API](https://api.guildwars2.com/v2/professions?ids=all). Specific selected source links appear in the table below and in the app. Factual weapon/gear/trait/code fields come from the selected source. Snow Crows skill icons were resolved through the official API before reviewing defensive and rotation notes.

## Cozy: two independent goals

Each of the 36 specs has an AFK / no-brain recommendation and an Unkillable recommendation, giving 72 preset selections. These are not 72 unique original build guides. Some lanes share a source setup but apply different input and defence priorities.

- **AFK / no-brain** means a compact player-controlled loop, minimal extra tracking and forgiving ordinary exploration. Movement, dodging, healing and reacting remain necessary. It does not recommend automation.
- **Unkillable** means survival-first: healing, damage reduction, defensive boons, condition removal and recovery. It is not literal invulnerability. Some specs remain poor or merely workable fits, and active resource management is often essential.

Comfort, survivability and useful damage use editorial 1–5 scales, higher being stronger. Effort is 1–5 with **lower** being less demanding. Scores apply to the way a source setup is used in that lane, so a shared build may perform differently when simplified. They are research estimates, not playtest measurements or comparable solo DPS. In cozy view, combat power uses the useful-damage estimate; the existing overall formula remains 25% each fantasy, ceiling, fun and combat power. Ceiling remains positive. Comfort/survival leaders are separate from overall leaders.

The baseline equipment/template stays sourced. Source-listed optional defensive swaps are identified as alternatives, not silently injected into the template or gear checklist. Some defensive variants require Celestial/Trailblazer/other gear, cross-spec weapon training, newer expansions or relics. High sustain is not evidence of low input. In particular Weaver, Catalyst, Bladesworn, Untamed, Antiquary and Luminary carry explicit management/effort trade-offs.

## The six features

1. **Spec finder:** six preference questions, scored over the revealed and filtered builds in the current PvE setting/lane. Range availability, pace, learning preference, defence, fantasy theme and a rating priority produce explained fit points. These are not probabilities. Ties are equal and alphabetical. Group defence preference uses approachability/attention for mechanics, not a claim that the raid build is a self-sufficient tank.
2. **Learning paths:** three saved checkpoints per exact source build and setting/lane: starter loop, adding systems, and refining the full build. These are editorial practice progressions with spec-specific mechanics and safety tips. The source link supplies the complete weapon/trait-specific rotation. Starter priorities intentionally omit optimization and claim no benchmark DPS. Group guidance avoids importing optional solo defensive skills into the raid template. Checkpoints are self-assessed, not automated combat measurements.
3. **Gear sharing:** canonical primary equipment slots, item multiplicity, exact stat comparison and profession armour weight. Armour only potentially matches within a weight; trinkets and weapons are counted independently and each owned item can match once. Full Berserker inventory means six armour plus six trinkets, weapons unknown. For source pages with multiple equipment variants, only the first primary set is compared. No market-price estimates are fabricated. Bindings, tier, upgrade components, food, relics and agony resistance require a separate check.
4. **Encounter guidance:** qualitative suitability for solo champions, moving bosses, burst phases, heavy mechanics, fractals and ordinary events. This uses the selected build’s damage type and researched spec friction rather than invented boss DPS. The “Good fits” filter selects score >=4. Cozy/open-world builds are explicitly redirected to group setups for fractals. No boss, story or later-map names are needed.
5. **Personal journal:** favourites, tried status, personal fun/flow, goal and notes shared across local characters. Personal scores never alter editorial ratings. Journal/quiz/gear options/comparisons filter hidden specs. Learning is stored per build and mode, so practicing one variant does not complete a different variant.
6. **Cozy builds:** the two lanes described above, with distinct picks, comfort/survival/effort/damage ratings and explicit poor-fit labels.

Weapon access checks distinguish ownership from training. They check the elite’s expansion, Janthir land spear, SotO Expanded Weapon Proficiency and cross-elite Weaponmaster Training using the official profession weapon specialization IDs. Additional source-listed expansion requirements are surfaced. These checks are not a claim that every relic, mastery or hero-point training step is already completed. Gear access never reveals hidden spec names.

## Persistence and validation

State remains additive version 3 under the existing storage key. New fields are `specPersonal`, `specLearning` and `specKit`. Missing fields in older saves receive safe defaults. Unknown IDs are discarded; note/goal lengths, ratings and checkpoint masks are bounded. Notes are escaped before display. Existing stale-tab and failed-storage protection remains in use. Export/import transfers all new fields. Restoring a backup explicitly warns about replacing the spec journal, checkpoints and kit, then resets later-spec reveals while retaining hidden personal data.

## Verification

Browser checks cover all six features; both lanes across all 36 specs; quiz matching/filtering; source/target stat and weight comparison; weapon access; unique-item use; personal/learning persistence; actual export/import; legacy migration; malformed input bounds; HTML escaping; hidden-spec removal from every tool; print; no hero/mastery mutation; stale-save protection; 1440/768/390/320px layouts; and automated accessibility with tools and spec details expanded. Existing hero catalogue and mastery regression suites pass. No runtime external API requests are added.

## Selected cozy sources

| Spec | AFK / no-brain baseline | Survival-first baseline | Survival / effort (survival lane) |
|---|---|---|---|
| Druid | [Champion Hunter Druid](https://snowcrows.com/builds/open-world/ranger/champion-hunter-druid) | [Champion Hunter Druid](https://snowcrows.com/builds/open-world/ranger/champion-hunter-druid) | 5/5 survival · 3/5 effort |
| Daredevil | [Power Daredevil](https://metabattle.com/wiki/Build:Daredevil_-_Power_Daredevil) | [Power Daredevil](https://metabattle.com/wiki/Build:Daredevil_-_Power_Daredevil) | 3/5 survival · 3/5 effort |
| Berserker | [Boon DPS Power Berserker Open World](https://metabattle.com/wiki/Build:Berserker_-_Boon_DPS_Power_Berserker_Open_World) | [Champion Hunter Berserker](https://snowcrows.com/builds/open-world/warrior/champion-hunter-berserker) | 4/5 survival · 4/5 effort |
| Dragonhunter | [Power Dragonhunter](https://metabattle.com/wiki/Build:Dragonhunter_-_Power_Dragonhunter) | [Power Dragonhunter](https://metabattle.com/wiki/Build:Dragonhunter_-_Power_Dragonhunter) | 3/5 survival · 3/5 effort |
| Reaper | [Power Greatsword Reaper](https://metabattle.com/wiki/Build:Reaper_-_Power_Greatsword_Reaper) | [Champion Hunter Reaper](https://snowcrows.com/builds/open-world/necromancer/champion-hunter-reaper) | 5/5 survival · 3/5 effort |
| Chronomancer | [Power Chrono](https://metabattle.com/wiki/Build:Chronomancer_-_Power_Chrono) | [Power Chrono](https://metabattle.com/wiki/Build:Chronomancer_-_Power_Chrono) | 3/5 survival · 4/5 effort |
| Scrapper | [Power Scrapper](https://metabattle.com/wiki/Build:Scrapper_-_Power_Scrapper) | [Power Scrapper](https://metabattle.com/wiki/Build:Scrapper_-_Power_Scrapper) | 4/5 survival · 2/5 effort |
| Tempest | [Fresh Air](https://metabattle.com/wiki/Build:Tempest_-_Fresh_Air) | [Champion Hunter Tempest](https://snowcrows.com/builds/open-world/elementalist/champion-hunter-tempest) | 5/5 survival · 3/5 effort |
| Herald | [Power Herald](https://metabattle.com/wiki/Build:Herald_-_Power_Herald) | [Champion Hunter Herald](https://snowcrows.com/builds/open-world/revenant/champion-hunter-herald) | 5/5 survival · 3/5 effort |
| Soulbeast | [Power Soulbeast](https://metabattle.com/wiki/Build:Soulbeast_-_Power_Soulbeast) | [Champion Hunter Soulbeast](https://snowcrows.com/builds/open-world/ranger/champion-hunter-soulbeast) | 5/5 survival · 3/5 effort |
| Weaver | [Power Weaver](https://metabattle.com/wiki/Build:Weaver_-_Power_Weaver) | [Power Weaver](https://metabattle.com/wiki/Build:Weaver_-_Power_Weaver) | 3/5 survival · 4/5 effort |
| Holosmith | [Power Holo](https://metabattle.com/wiki/Build:Holosmith_-_Power_Holo) | [Power Holo](https://metabattle.com/wiki/Build:Holosmith_-_Power_Holo) | 3/5 survival · 3/5 effort |
| Deadeye | [Pistol Pistol Payback Deadeye](https://metabattle.com/wiki/Build:Deadeye_-_Pistol_Pistol_Payback_Deadeye) | [Pistol Pistol Payback Deadeye](https://metabattle.com/wiki/Build:Deadeye_-_Pistol_Pistol_Payback_Deadeye) | 3/5 survival · 2/5 effort |
| Mirage | [Condi Mirage](https://metabattle.com/wiki/Build:Mirage_-_Condi_Mirage) | [Condi Mirage](https://metabattle.com/wiki/Build:Mirage_-_Condi_Mirage) | 4/5 survival · 2/5 effort |
| Scourge | [Champion Hunter Scourge](https://snowcrows.com/builds/open-world/necromancer/champion-hunter-scourge) | [Champion Hunter Scourge](https://snowcrows.com/builds/open-world/necromancer/champion-hunter-scourge) | 5/5 survival · 2/5 effort |
| Spellbreaker | [Power Spellbreaker](https://metabattle.com/wiki/Build:Spellbreaker_-_Power_Spellbreaker) | [Champion Hunter Spellbreaker](https://snowcrows.com/builds/open-world/warrior/champion-hunter-spellbreaker) | 4/5 survival · 3/5 effort |
| Firebrand | [Condi Firebrand](https://metabattle.com/wiki/Build:Firebrand_-_Condi_Firebrand) | [Champion Hunter Firebrand](https://snowcrows.com/builds/open-world/guardian/champion-hunter-firebrand) | 5/5 survival · 4/5 effort |
| Renegade | [Power Renegade](https://metabattle.com/wiki/Build:Renegade_-_Power_Renegade) | [Power Renegade](https://metabattle.com/wiki/Build:Renegade_-_Power_Renegade) | 4/5 survival · 3/5 effort |
| Harbinger | [Power Harbinger Spear Sword Sword](https://snowcrows.com/builds/open-world/necromancer/power-harbinger-spear-sword-sword) | [Champion Hunter Harbinger](https://snowcrows.com/builds/open-world/necromancer/champion-hunter-harbinger) | 4/5 survival · 3/5 effort |
| Willbender | [Power Willbender](https://metabattle.com/wiki/Build:Willbender_-_Power_Willbender) | [Champion Hunter Willbender](https://snowcrows.com/builds/open-world/guardian/champion-hunter-willbender) | 4/5 survival · 4/5 effort |
| Virtuoso | [Power Virtuoso](https://metabattle.com/wiki/Build:Virtuoso_-_Power_Virtuoso) | [Champion Hunter Virtuoso](https://snowcrows.com/builds/open-world/mesmer/champion-hunter-virtuoso) | 4/5 survival · 2/5 effort |
| Catalyst | [Celestial Quickness Catalyst](https://metabattle.com/wiki/Build:Catalyst_-_Celestial_Quickness_Catalyst) | [Champion Hunter Catalyst](https://snowcrows.com/builds/open-world/elementalist/champion-hunter-catalyst) | 5/5 survival · 4/5 effort |
| Bladesworn | [Power Bladesworn](https://metabattle.com/wiki/Build:Bladesworn_-_Power_Bladesworn) | [Power Bladesworn](https://metabattle.com/wiki/Build:Bladesworn_-_Power_Bladesworn) | 4/5 survival · 4/5 effort |
| Vindicator | [Power Vindicator](https://metabattle.com/wiki/Build:Vindicator_-_Power_Vindicator) | [Power Vindicator](https://metabattle.com/wiki/Build:Vindicator_-_Power_Vindicator) | 4/5 survival · 3/5 effort |
| Mechanist | [Power Mechanist](https://metabattle.com/wiki/Build:Mechanist_-_Power_Mechanist) | [Champion Hunter Mechanist](https://snowcrows.com/builds/open-world/engineer/champion-hunter-mechanist) | 5/5 survival · 2/5 effort |
| Specter | [Champion Hunter Specter](https://snowcrows.com/builds/open-world/thief/champion-hunter-specter) | [Champion Hunter Specter](https://snowcrows.com/builds/open-world/thief/champion-hunter-specter) | 5/5 survival · 3/5 effort |
| Untamed | [Boon DPS Power Untamed Open World](https://metabattle.com/wiki/Build:Untamed_-_Boon_DPS_Power_Untamed_Open_World) | [Champion Hunter Untamed](https://snowcrows.com/builds/open-world/ranger/champion-hunter-untamed) | 5/5 survival · 4/5 effort |
| Troubadour | [Champion Hunter Troubadour](https://snowcrows.com/builds/open-world/mesmer/champion-hunter-troubadour) | [Champion Hunter Troubadour](https://snowcrows.com/builds/open-world/mesmer/champion-hunter-troubadour) | 4/5 survival · 3/5 effort |
| Paragon | [Champion Hunter Paragon](https://snowcrows.com/builds/open-world/warrior/champion-hunter-paragon) | [Champion Hunter Paragon](https://snowcrows.com/builds/open-world/warrior/champion-hunter-paragon) | 5/5 survival · 3/5 effort |
| Amalgam | [Power Amalgam open world](https://metabattle.com/wiki/Build:Amalgam_-_Power_Amalgam_open_world) | [Champion Hunter Amalgam](https://snowcrows.com/builds/open-world/engineer/champion-hunter-amalgam) | 5/5 survival · 3/5 effort |
| Ritualist | [Power Ritualist open world](https://metabattle.com/wiki/Build:Ritualist_-_Power_Ritualist_open_world) | [Power Ritualist open world](https://metabattle.com/wiki/Build:Ritualist_-_Power_Ritualist_open_world) | 5/5 survival · 2/5 effort |
| Antiquary | [Power Antiquary open world](https://metabattle.com/wiki/Build:Antiquary_-_Power_Antiquary_open_world) | [Champion Hunter Antiquary](https://snowcrows.com/builds/open-world/thief/champion-hunter-antiquary) | 4/5 survival · 4/5 effort |
| Galeshot | [Boon DPS Power Galeshot Open World](https://metabattle.com/wiki/Build:Galeshot_-_Boon_DPS_Power_Galeshot_Open_World) | [Boon DPS Power Galeshot Open World](https://metabattle.com/wiki/Build:Galeshot_-_Boon_DPS_Power_Galeshot_Open_World) | 3/5 survival · 3/5 effort |
| Conduit | [Power Conduit Staff Sword Sword](https://snowcrows.com/builds/open-world/revenant/power-conduit-staff-sword-sword) | [Champion Hunter Conduit](https://snowcrows.com/builds/open-world/revenant/champion-hunter-conduit) | 5/5 survival · 3/5 effort |
| Evoker | [Power Evoker Fire Inferno](https://metabattle.com/wiki/Build:Evoker_-_Power_Evoker_Fire_Inferno) | [Champion Hunter Evoker](https://snowcrows.com/builds/open-world/elementalist/champion-hunter-evoker-toad) | 5/5 survival · 4/5 effort |
| Luminary | [Power Luminary Greatsword Spear](https://snowcrows.com/builds/open-world/guardian/power-luminary-greatsword-spear) | [Champion Hunter Luminary](https://snowcrows.com/builds/open-world/guardian/champion-hunter-luminary) | 4/5 survival · 4/5 effort |
