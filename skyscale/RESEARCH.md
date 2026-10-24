# Skyscale unlock planner

Source review: October 2026. Independent, manually tracked acquisition guide at `#skyscale`. It is aimed at reducing unnecessary travel, premature farming, accidental purchases and confusion between the two permanent-unlock methods. It does not reproduce story dialogue or outcomes and does not claim an in-game-tested fastest collectible route.

## Spoiler boundary

The default DOM contains only a generic mount-project introduction and an acknowledgement form. No route names, later locations, NPCs, collection instructions or external reference links are rendered before acknowledgement. Consent is held in memory for the page visit, never included in backups and reset on reload. “Hide spoilers again” removes revealed content and any generated print itinerary. Leaving the view clears its generated content. Other companion reveal settings are independent.

The acknowledgement permits mechanical/collection, map, NPC and story-chapter names. Linked wiki pages can contain additional plot information. A gate is a presentation boundary, not encryption: source assets necessarily contain the guide data.

## Reviewed acquisition distinctions

| Route | Prerequisites and completion | Main friction controls |
|---|---|---|
| Living World Season 4 | Path of Fire and all six episodes; relevant episode-4 access and final episode story/epilogue; five acquisition collections | Four two-hour transition effects, 12 feeds at four per daily-reset period, reserve six map-currency stacks, compare finished food/Grow Lamp with crafting, one flight rift per required map |
| Secrets of the Obscure | Expansion flight access, Who Rescues Whom?, A New Friend and its three lists, Rising Spirits and final hand-in | Start lists before collecting targeted drops, random nest/weekly refresh caveat, train the full Flight Training track in parallel, group ten saddle purchases by map, distinguish temporary local flight from permanent access |

The original path has 24 coarse task checks; the newer path has 30, including individual infusion checks. A checkbox is a planning record, not API-verified achievement completion. Collection maps and precise object locations are linked from each stage rather than reproduced as invented walking directions. Navigation can inspect later stages without marking progress.

### Costs and timing

Original fixed baseline: 41 gold, 5,390 karma, 1,700 Volatile Magic, 520 Trade Contracts, 250 each of the six Season 4 map currencies, with 260 Mistborn Motes total including the additional medicine requirement, 12 Pieces of Skyscale Food and one Grow Lamp. Finished food/lamp prices and optional skip treats are separate. These are whole-route totals, not an instruction to spend every amount immediately.

Newer fixed baseline: 15 gold in comforts, 12 Pieces of Skyscale Food, 30 Provisioner Tokens, 375 Static Charges, 375 Pinches of Stardust and 500 Fine Rift Essence. The ten saddle components each use three tokens plus their listed currency. Optional infusion bypasses are not required expenses. The full Flight Training track through Rising Spirits totals 25 regional mastery points and 6,985,000 XP.

Current naming/limit checks matter: Fine Rift Essence was formerly Essence of Despair and is a wallet currency; Central Tyria/HoT provisioner offers changed from daily to commonly seven-per-week limits. The guide avoids repeating outdated daily-token advice. Skyscale nests refresh weekly rather than daily; random egg discovery is not promised within a fixed number of nests or a single session.

The four original-route two-hour reminders store absolute end timestamps set by the player. They survive closed tabs but are not server truth. Waiting for Gorrik continues while logged out; receiving the mail requires returning to the character with the effect. Daily reset is 00:00 UTC; the guide calculates the next reset and formats it in the browser’s local time, including daylight-saving offsets. Three feeding reset periods are not described as a fixed 72-hour timer. There is no same-day or fastest-unlock promise.

### Sources

- [ArenaNet route announcement](https://www.guildwars2.com/en/news/a-new-chapter-begins-in-guild-wars-2-secrets-of-the-obscure/)
- [Mount acquisition and masteries](https://wiki.guildwars2.com/wiki/Skyscale)
- [Original walkthrough](https://wiki.guildwars2.com/wiki/Skyscale/Walkthrough)
- [Saving Skyscales](https://wiki.guildwars2.com/wiki/Saving_Skyscales), [Raising Skyscales](https://wiki.guildwars2.com/wiki/Raising_Skyscales), [Riding Skyscales](https://wiki.guildwars2.com/wiki/Riding_Skyscales)
- [Original saddle](https://wiki.guildwars2.com/wiki/Skyscale_Saddle) and [flight lessons](https://wiki.guildwars2.com/wiki/Skyscale_Flight)
- [Waiting effect and offline behavior](https://wiki.guildwars2.com/wiki/Waiting_for_Gorrik)
- [A New Friend](https://wiki.guildwars2.com/wiki/A_New_Friend)
- [Infusions](https://wiki.guildwars2.com/wiki/Skyscale_Egg_Infusions), [comforts](https://wiki.guildwars2.com/wiki/Skyscale_Growing_Comforts), [saddle materials](https://wiki.guildwars2.com/wiki/Skyscale_Saddle_Materials)
- [Flight Training totals](https://wiki.guildwars2.com/wiki/Flight_Training)
- [Provisioner Tokens](https://wiki.guildwars2.com/wiki/Provisioner_Token) and [vendor limit changes](https://wiki.guildwars2.com/wiki/Faction_Provisioner)
- [Fine Rift Essence naming/conversion](https://wiki.guildwars2.com/wiki/Fine_Rift_Essence)
- [Daily/weekly reset](https://wiki.guildwars2.com/wiki/Server_reset)

Several direct wiki opens returned HTTP 403 in the research browser. Indexed first-party wiki excerpts supplied the relevant current facts; no blocked-access bypass or unsupported exact collectible coordinates were used. Community discussions were not treated as authority where current wiki text supplied the fact. The guide links the live pages so in-game changes and detailed location tables can be checked.

## Data and integration

The main app registers a separate `skyscale` view, available in More tools and the Start footer. Existing four primary navigation choices remain. `data.js`, `app.js` and `styles.css` are served alongside the repository root; keep the `skyscale/` folder with `index.html` for a local copy of this optional module. Failed module loading displays a recovery message rather than breaking other views.

LocalStorage key `gw2-skyscale-v1` holds two account slots, independently selected routes, per-route task IDs, current stage, amounts secured/spent for this goal, notes and reminder timestamps. Its JSON backup/restore is independent from main companion and Revenue Cloud backups. No account key, external mutation or automatic API request is involved. Input is validated against known task/resource IDs, notes are escaped, quantities are bounded, and corrupt or stale saves are preserved rather than silently overwritten. Restore/reset requires explicit in-page confirmation and applies only to this tracker. Consent is never restored.

`tests/skyscale.cjs` verifies the initial boundary, required acknowledgement, print/relock scrubbing, reload locking, per-account/route progress, resource deficits, timer persistence, separate backup round trips, note escaping, stale-tab and corrupt-data protection, and 320/390/768/1280 reflow/text spacing with axe WCAG checks. Existing calm-journey and functional suites verify surrounding navigation and state protections. Chromium automation does not constitute an actual in-game unlock or physical-device test.
