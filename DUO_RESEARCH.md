# Matt & Steve: temporary duo notebook

Checked 17 October 2026. This notebook focuses on **two players fighting Path of Fire champions**, following the user’s clarification. It includes the specialization names the user supplied; no later map, boss or story names are included in the guide’s duo content. External references can mention later equipment or encounters.

## Confirmed inputs and assumptions

Steve currently has power Reaper and power **dagger/dagger Tempest**. Vindicator, Specter (official spelling) and Chronomancer start as working-on/soon. The statement “soon will have” was applied to all three; every status is editable.

Matt currently has Holosmith, Untamed, Druid, Virtuoso and Mirage. Willbender starts as working-on; Firebrand as considering. The user authorized sensible open-world build defaults for Matt. The defaults are power Holo, power Let Loose Untamed, condition Druid, condition Virtuoso and staff condition Mirage. These are suggestions, not verified inventory, traits or skill bars. Daredevil and pistol Deadeye are editorial thief-shortlist entries; Specter can be added to Matt’s shortlist explicitly. No thief is marked trained automatically.

## Champion recommendations and limits

- Start with the familiar Reaper + suggested Untamed for a robust damage pair. Reaper’s personal quickness is not party coverage.
- The most complementary **current-spec experiment** is Steve’s power D/D Tempest with the optional Lucid Singularity alacrity trait and Matt’s Let Loose Untamed for shared quickness access. This is a trait/role experiment, **not a finished audited D/D alacrity template**. Actual boon duration, critical chance, support range, overload completion, gear and survival must be confirmed. No permanent uptime or damage result is claimed. Keep Reaper + Untamed as a practical fallback.
- Reaper + a separately geared heal-alacrity Druid is a recovery experiment when deaths block a kill; it can be slower than two damage characters, and Reaper needs appropriate out-of-shroud recovery windows.
- Alacrity Chronomancer + quickness-access Untamed is the main future flexibility option. A solo Chronomancer’s personal boons do not imply both boons are shared; the two boon roles are separate choices.
- Future condition alacrity Specter + condition quickness Firebrand is a complementary support/damage option, requiring trained specs and distinct complete role builds. Vindicator primarily adds a power playstyle, rather than an assumed dedicated boon role.
- Matt’s first thief recommendation is staff Daredevil for power gameplay, with Specter for deliberate condition/alacrity support and pistol Deadeye as another open-world loop. The pistol damage preset is not treated as quickness Deadeye.

These are editorial inferences from the two rosters and documented mechanics. They are not a simulated ranking, measured duo benchmark, champion-clear guarantee or tank assignment. Bounty mechanics can change what works; inspect target effects, coordinate control for an active defiance bar and preserve attack uptime. Equipment access and actual ownership remain unverified. Recommendations do not write to the gear planner or unlock records.

## Important source distinctions

The [open-world Fresh Air guide](https://metabattle.com/wiki/Build:Tempest_-_Fresh_Air) supports the overload/Fresh Air principles but defaults to scepter/warhorn. The [power-DPS guide](https://metabattle.com/wiki/Build:Tempest_-_Power_DPS) documents dagger/dagger in a group context. Neither source’s different-weapon opener is silently relabelled as Steve’s current rotation. [Lucid Singularity](https://wiki.guildwars2.com/wiki/Lucid_Singularity) supports the optional alacrity trait; [Ring of Fire](https://wiki.guildwars2.com/wiki/Ring_of_Fire_(elementalist_skill)) and [Earthquake](https://wiki.guildwars2.com/wiki/Earthquake) document the D/D field/finisher options.

[Open-world Untamed](https://metabattle.com/wiki/Build:Untamed_-_Boon_DPS_Power_Untamed_Open_World) distinguishes Let Loose’s shared-boon access from Enhancing Impact’s personal quickness. Mace access and the documented hammer alternative must be checked. [Power Reaper](https://metabattle.com/wiki/Build:Reaper_-_Power_Greatsword_Reaper) supports the damage baseline; the [group reference](https://metabattle.com/wiki/Build:Reaper_-_Power_DPS) also discusses recovery timing outside shroud.

[Condition Druid](https://metabattle.com/wiki/Build:Druid_-_Condition_Druid) and [heal-alacrity Druid](https://snowcrows.com/builds/raids/ranger/heal-alacrity-druid-staff-mace-warhorn) are treated as separate builds. The latter source carries an older revision/balance label; it is used as role/equipment evidence, not as proof of a newly benchmarked duo build. [Solo Chronomancer](https://metabattle.com/wiki/Build:Chronomancer_-_Power_Chrono) and [boon Chronomancer](https://metabattle.com/wiki/Build:Chronomancer_-_Boon_Support_Power_DPS) likewise establish different personal/shared-boon assumptions.

[Defiance bar](https://wiki.guildwars2.com/wiki/Defiance_bar), [Interrupt](https://wiki.guildwars2.com/wiki/Interrupt) and [Unstable Magic Abilities](https://wiki.guildwars2.com/wiki/Unstable_Magic_Abilities) support the champion primer. Do not assume control effects stop a defiant champion as they stop ordinary enemies, or that any two builds ignore bounty mechanics.

Every selectable role in `duo-data` has its own source URL. References come from the checked pages and the existing source catalogue. Pairing recommendations are original editorial guidance; source prose is not reproduced.

## Behavior and storage

The new `#duo` view uses the existing native-link navigation and early loading fallback. Its bounded `state.duo` object is included in the existing version-3 save and backup format; older saves receive defaults. Roster statuses, per-spec roles and setup notes, current selections, session goal, preview mode and navigation visibility are editable. The notebook can be hidden and reopened through Help or `#duo`; resetting it requires a concrete confirmation and affects only duo data.

Available status means trained specialization, not owned support gear. Planned and considering specs enter pairing selectors only when preview is enabled. Applying a recipe explicitly changes the two roles and selected pair, never their availability or equipment. The personalized names are independent of global map/spec spoiler settings; importing a backup still resets those global reveal boundaries.

Progress remains browser-local. The two players do not automatically share edits; use the existing backup/restore or copy-plan tools. Setup/session text is escaped and bounded, and storage failures use the existing stale-save and recovery protections.

## Verification

`tests/duo.cjs` checks current/planned selections, complementary and duplicate boon roles, all supported modes and recipes, D/D preservation, status changes, escaped notes, archive/reopen/reset, no inventory/unlock/progress changes, real export/import, old/malformed save migration, empty rosters, copy/print, unique IDs, six screen widths, increased text spacing and landscape. Set `AXE_PATH` for the optional automated WCAG A/AA audit. Tests use Chromium with touch emulation, not physical-device Safari.
