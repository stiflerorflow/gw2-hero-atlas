# Path of Fire mastery-point research

Reviewed 17 October 2026. **Later PoF map and achievement names appear below.** In the application they remain inside the existing staged PoF spoiler boundary.

## Coverage and accounting

The dedicated tab contains 73 distinct one-point sources: all 40 achievements in the PoF Mastery Insights category and 33 additional mastery rewards in the five PoF map categories and Crystal Desert category. This is not a list of every source that spends into the purple mastery pool: story mission rewards and Living World Season 4 maps are excluded.

ArenaNet achievement categories checked: 174, 176, 179, 181, 182, 189 and 190. Each catalogue entry stores its achievement ID, mastery reward ID, reward API link, route reference and starting waypoint. Rewards were verified as `Mastery` in the `Desert` region, not ordinary achievement points, adventure medals or repeatable event rewards. The 73 mastery reward IDs are unique.

| Map | Map-insight achievements | Other reward achievements | Total |
| --- | ---: | ---: | ---: |
| Crystal Oasis | 6 | 7 | 13 |
| Desert Highlands | 15 | 3 | 18 |
| Elon Riverlands | 8 | 7 | 15 |
| The Desolation | 8 | 6 | 14 |
| Domain of Vabbi | 3 | 10 | 13 |
| Total | 40 | 33 | 73 |

The mount-unlock rewards from the Crystal Desert category are assigned to the map where the relevant unlock occurs. The optional post-story flying-mount collection is assigned to the final map and treated as poor value for a quick point.

Map markers come from ArenaNet’s continent-floor API. Marker-bearing achievements such as Just a Sip and the djinn challenges are included once as achievement rewards, not also duplicated as insights. Collections without a single completion marker show a starting reference without inventing an endpoint pin.

Mastery rewards are account-wide and can be earned once, as documented in the [mastery system](https://wiki.guildwars2.com/wiki/Mastery_Insight). They are tracked in a separate account-level checklist under the existing save format. They do not change hero-point totals. The UI never claims this checklist represents unspent mastery currency; mastery XP and spending remain in game.

## Effort and prerequisite decisions

The groups are recommendations for low traversal effort, limited technical jumping and little waiting/backtracking. They are not combat-only ratings or a claim that every player will find a source equally easy. Each source retains its required mount/mastery and a reason for the rating. Friend lifts or already-owned flying mounts can change the effort.

Examples of useful easy achievement rewards:

- [Just a Sip / Pot of Soup](https://wiki.guildwars2.com/wiki/Pot_of_Soup): a two-minute ingredient minigame in Amnoon, requiring no mount puzzle. Its timing and possible retries are explicit.
- [A Trip Down Memory Lane / Pahan](https://wiki.guildwars2.com/wiki/Pahan): repeated switch sequences rather than a fight or jumping puzzle.
- [Fleet of Foot](https://api.guildwars2.com/v2/achievements/3567) and [Skimming the Surface](https://api.guildwars2.com/v2/achievements/3627): useful rewards for mount purchases the player may already be working toward. Mount ownership is not silently converted into a collected reward.
- [Mysteries of the Exalted](https://wiki.guildwars2.com/wiki/Mysteries_of_the_Exalted): a short artifact puzzle with a basic-Skimmer cave approach.
- [Sulfur Shooter / Creator Jadi](https://wiki.guildwars2.com/wiki/Creator_Jadi): apply the bundle to the three required enemy types before killing them.
- [Yitfei](https://wiki.guildwars2.com/wiki/High_Elder_Yitfei_the_Light) and [Zomi](https://wiki.guildwars2.com/wiki/High_Elder_Zomi_the_Accomplished): local dialogue riddles with the answers supplied. Other quizzes with a cliff/cave approach remain in the middle group.

Important exceptions and poor-value choices:

- [Reins of the Raptor](https://wiki.guildwars2.com/wiki/Reins_of_the_Raptor) is mechanically simple but involves several hearts and conversations, so it is not sold as an instant pickup.
- [Lost Pilgrims](https://wiki.guildwars2.com/wiki/Vision_Crystal_(bundle)) can use free nearby crystal bundles. No crafted Vision Crystal purchase is prescribed; ledges and a hydra patrol make it a middle-group choice.
- [Springer Backpacking](https://wiki.guildwars2.com/wiki/Springer_Backpacking), lore-page collections, Magic Hunter and Jackal Reconnaissance cover many objectives. These are low priority for a dedicated single-point run.
- [Discarded Vessels](https://wiki.guildwars2.com/wiki/Desert_Highlands_Insight:_Discarded_Vessels) uses Ride the Wind plus Shifting Sands in the written route. Basic Skimmer is not interchangeable with the higher hover mastery.
- [Glint’s Legacy](https://wiki.guildwars2.com/wiki/Crystal_Oasis_Insight:_Glint%27s_Legacy), [Above the Flats](https://wiki.guildwars2.com/wiki/Desert_Highlands_Insight:_Above_the_Flats), the Tombs and airborne portal transfers are explicitly low priority for this player’s preference against technical traversal.
- The [Mouth of Torment mastery insight](https://wiki.guildwars2.com/wiki/Desolation_Insight:_The_Mouth_of_Torment) is distinct from the hero challenge; no successful meta-event requirement is borrowed from the hero route.
- [Jackal unlocking](https://wiki.guildwars2.com/wiki/Jackal#Unlocking) requires High Vault or Ride the Wind before the heart is available. Basic Springer alone is insufficient.
- The four combat djinn have verified reward identities and exact markers, but their local ascent evidence is incomplete. Their cards disclose that limitation and stay out of the “Ready with my kit” filter.

Routes were checked against GW2 Wiki text and public ArenaNet achievement/map data. General coverage is cross-checked against [PoF Mastery Insights](https://wiki.guildwars2.com/wiki/Mastery_Insights_(Path_of_Fire)) and [mastery-point unlocks](https://wiki.guildwars2.com/wiki/Mastery_point_unlocks). This is researched guide content, not an in-game route recording. No new achievement/AP-only activities are counted as mastery rewards.

## UI and verification

The mastery tab has its own account-level counters and hides the hero-point score and planner. Navigation is placed before the long hero setup. Easy sources open first; harder groups start collapsed. Search, map choices, map art, route text, source links and printing all respect the PoF boundary. EoD opt-in does not reveal PoF maps.

Verification covers reward identity/uniqueness, all insight coordinates, existing hero/EoD regression checks, old-save migration, per-account persistence across characters, backup restore, exclusion from hero credit, hidden-name search, filter behavior, printing, embedded previews and narrow-screen layouts. Individual external references retain a spoiler warning.
