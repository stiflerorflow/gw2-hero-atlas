# HoT nine-stop field-readiness source audit

Independent review, 18 October 2026, against main da90783. Read-only review of app data. This is source verification, not an in-game traversal or completion-time measurement. Wiki pages were checked through fresh indexed passages where direct requests returned403; Snow Crows was directly readable.

## Local approaches and required kit

| Run stop | Source-supported approach | Assessment |
|---|---|---|
| Nightthistle Blossom | West of Shipwreck Peak, descend to bottom-level roof-like ruin | Basic gliding feasible; kill veteran plus four ordinary Mordrem. Old Dulfy champion label is outdated. |
| Ancient Fighting Pit | East of Shrouded Ruins, southern stairs, above Waking Tomb | Current stairs text matches Wiki. SC says northern stairs; prefer dedicated Wiki page rather than changing direction from the general tour. |
| Wyvern Nesting Grounds | Pact Encampment northeast stone bridge, right into valley, north-cliff stone steps | Current route matches Wiki; bouncing mushroom is an alternative, not required. Kill hatchling/electric wyverns before fire wyvern. |
| Nuhoch Alchemical Energy | East of Pact Encampment, drop/glide to recessed cliff ledge | Wiki explicitly permits basic glider instead of Nuhoch Wallows. Do not descend to bottom or expect to walk back up. |
| Abyssal Depths | Southwest branch, deep descent to small recessed ledge | Wiki identifies near-bottom Thistlevine Ravine ledge and says a keen glider is needed; Updraft Use helps. SC independently permits dropping/gliding instead of Wallows. Navigation warrants a stronger precision/landing warning. |
| Cliffside Ruins | From Mellaggan's Valor, ramps above challenge, drop/glide into alcove | Wiki explicitly says Glider Basics suffices. SC warns careful gliding and updraft recovery. Never treat missed drop as a reversible ordinary climb. |
| Coztic Itzel Belongings | Treacherous Path vicinity, northeast ledges | SC uses this waypoint. Older movement guide explicitly describes gliding east; road/ground-only classification is too certain. Available kit already includes gliding. Champion can stealth; waiting for reveal works without Nuhoch Stealth Detection. |
| Young Mushrooms | Just south of Wanderer's, drop/glide past branches to jungle floor | Direct Wiki approach match. Champion Mushroom King event must complete within ten minutes for first ten HP. Repeat daily reward is not additional HP. |
| Toxin-Cured Hog | South from Wanderer's, enter cave from north by dropping above hog | Dedicated Wiki confirms this avoids the south vines when Westwatch is unpowered. No Adrenal/Bouncing Mushroom needed to complete. Each player survives60seconds using supplied heal after fifth damage pulse, then on cooldown. Other players cannot ordinary-heal/Regenerate the eater; barrier/alacrity may assist but are not required. |

## Conservative changes recommended

1. Coztic: describe ledges and a possible short glide rather than guarantee ground-only access; set run `requiresGlider` conservatively true. This does not increase the user's confirmed kit requirement.
2. Abyssal: change `precision:false` or add explicit difficult recessed-landing warning. The landing is feasible with the confirmed kit, but should not be presented as trivial or guarantee fast recovery.
3. State the evidence boundary: specific waypoint-to-challenge approaches have source support; inter-hub instructions such as “upper paths southwest” are planning links, not independently traced turn-by-turn tracks. Existing coordinate bearings match their destinations but map coordinates do not prove a traversable route.

## Recovery and map connections

The southwest Verdant Brink portal near Treacherous Path is the documented ordinary Auric Basin connection; no Tarir meta gate or Exalted mastery is involved. Its arrival-area pair can use Wanderer's as an escape waypoint after descending. Cliff/abyss branches should recover by a discovered uncontested waypoint, not reverse climbing. A discovered waypoint can still be contested. No authoritative claim that every named hub is permanently uncontested was established, so retain conditional recovery wording.

The run's scouting chain (Shipwreck→Shrouded→Pact→Mellaggan→Treacherous) has plausible compass bearings and uses surface hubs. I did not establish a precise physically continuous track between each hub; do not label these links field-tested or guarantee a150-minute run.

## Sources

- https://snowcrows.com/guides/open-world/hero-point-tour-heart-of-thorns (directly read; local challenges and kit support, not this exact mixed route)
- https://wiki.guildwars2.com/wiki/Nightthistle_Blossom
- https://wiki.guildwars2.com/wiki/Ancient_Fighting_Pit
- https://wiki.guildwars2.com/wiki/Wyvern_Nesting_Grounds
- https://wiki.guildwars2.com/wiki/Nuhoch_Alchemical_Energy
- https://wiki.guildwars2.com/wiki/Abyssal_Depths
- https://wiki.guildwars2.com/wiki/Cliffside_Ruins
- https://wiki.guildwars2.com/wiki/Young_Mushrooms
- https://wiki.guildwars2.com/wiki/Toxin-Cured_Hog
- https://wiki.guildwars2.com/wiki/Keep_It_Down
- https://wiki.guildwars2.com/wiki/Auric_Basin
- https://wiki.guildwars2.com/wiki/Waypoint
- https://www.tentonhammer.com/guides/guild-wars-2-heart-of-thorns-verdant-brink-hero-points-guide.amp (old secondary movement evidence; do not prefer its old challenge-difficulty labels over current Wiki/SC)
- https://dulfyreborn.net/guides/hero-points/gw2-verdant-brinks-hero-points-guide.html (historical descent evidence only)
