# Priority fixes after the scored review — 2026-11-14

## Decisions and accounting

Owned items now use the higher known NPC sale or net AH proceeds, including a vendor floor without an auction quote. Known bound items cannot acquire an auction value. Planner acquisition and final batch accounting use the same disposal helper.

Regression: one owned Gloves of Meditation, gross AH500c, Soul Dust300c, Greater Astral Essence600c, Large Glimmering Shard1500c. Expected DE recovery562.875c is below vendor610c; economic margin is−47.125c. It is excluded from gold recommendations. The separate Sell/vendor comparison agrees. Higher AH proceeds still win when present; unknown and zero are distinct.

Gold defaults to alternatives without a modeled yield loss before comparing expected margin. A higher-mean DE alternative can be selected explicitly under Compare priorities. If only risky yields qualify, the suggestion is labeled higher risk and waiting is valid. This does not model personal selling time or guarantee buyers. Progress can compare upfront cost or net cost after quoted recovery; both require the full purchase cash before future sales.

## Checked catalogue expansion

The catalogue grows from22 to31 recipes:11 Tailoring,7 Enchanting,6 Alchemy,7 Engineering. Each new recipe retains unknown trainer fees until marked learned or priced; no profession rank, recipe learning or tool ownership is granted automatically.

| Spell | Recipe | Learn / yellow / green / grey | Output per craft |
|---|---|---|---|
|3173|Lesser Mana Potion|120 /145 /165 /185|1|
|7837|Fire Oil|130 /150 /160 /170|2|
|3177|Elixir of Lesser Defense|130 /155 /175 /195|1|
|7845|Elixir of Fire Power|140 /165 /185 /205|1|
|3452|Mana Potion|160 /180 /200 /220|1|
|3941|Bronze Tube|105 /105 /130 /155|1|
|3958|Iron Strut|160 /160 /170 /180|1|
|3961|Gyrochronatom|170 /170 /190 /210|1|
|12585|Solid Blasting Powder|175 /175 /185 /195|1|

Reagents, thresholds and source: [WCLBox Alchemy build1.60.1.70938](https://wowforever.wclbox.com/en/zhuanye/alchemy), [Engineering](https://wowforever.wclbox.com/en/zhuanye/engineering). Reagent/output checks: [Lesser Mana Potion](https://www.wowhead.com/forever/spell=3173/lesser-mana-potion), [Fire Oil](https://www.wowhead.com/forever/spell=7837/fire-oil), [Elixir of Lesser Defense](https://www.wowhead.com/forever/spell=3177/elixir-of-lesser-defense), [Elixir of Fire Power](https://www.wowhead.com/forever/spell=7845/elixir-of-fire-power), [Mana Potion](https://www.wowhead.com/forever/spell=3452/mana-potion). Engineering output/material/tool checks: [client-data list](https://foreverguide.net/professions/engineering/), [Iron Strut](https://www.wowhead.com/forever/spell=3958/iron-strut), [Gyrochronatom](https://www.wowhead.com/forever/spell=3961/gyrochronatom), [Solid Blasting Powder](https://www.wowhead.com/forever/spell=12585/solid-blasting-powder).

Gold Power Core crafting deliberately remains excluded: WCLBox lists three output, while the current Wowhead Forever entry lists four. Its tradeable item can be priced as an input. Variable-count dynamite also remains excluded from the deterministic crafting model.

Vendor research found a pack-versus-unit distinction: Empty Vial20c/5 (4c each), Leaded Vial2s/5 (40c each). Whole five-item packs are funded upfront and their surplus enters the shared batch pool. A manual AH quote purchases individual units; vendor overrides remain per unit. [Empty Vial](https://www.wowhead.com/forever/item=3371/empty-vial), [Leaded Vial](https://www.wowhead.com/forever/item=3372/leaded-vial), [explicit vendor pack display](https://wowforever.gg/en/atlas/knowledge/npcs/felika-n3367/). Weak Flux is1s per unit: [Forever item data](https://wowforever.gameslantern.com/items/weak-flux), [vendor listing](https://questcorehq.com/wowdb/forever/item/2880/weak-flux). Reputation discounts remain editable.

## Guided mobile experience

Character plan is the landing page; hash links preserve direct access to scanner, sell and other workflows. Configured characters show a compact expandable setup summary. Incomplete profiles open setup. Show my next steps closes setup and moves keyboard focus to the recommendation heading. Current profession coverage shows repeat recipe count, current skill candidates, learned count and the furthest supported skill; it does not claim exhaustive coverage.

The batch next-step panel identifies missing prices, requirements, cash, deposits and excessive size in turn. Its deposit button focuses the correct existing field. Once funding is complete, it opens the action checklist. Sales still default to zero; recording real inventory, skill and wallet changes remains manual.

Character context and batch guidance now have dedicated components. Routes and labels are centralized. This is an incremental reduction in App responsibilities, not a full provider/state architecture rewrite.

## Validation

Financial regressions cover the vendor floor, a higher AH alternative, no AH quote, bound/unknown/zero cases, batch agreement, whole vendor packs, explicit risk selection, progress priorities and unaffordable inputs. Current-bracket recipe tests cover materials, tool gates, unknown trainer fees and multi-output Fire Oil. Browser regressions cover compact mobile recommendations, edit/reopen/character isolation, explicit higher-risk comparisons, deposit focus, unchanged zero-sale assumptions, narrow-screen overflow and accessibility. Full results are recorded at release below.

Release validation: **89 unit tests passed across13 files**, including the independent3,840-case finite-essence oracle; **55 browser tests passed** including all-screen and expanded mobile accessibility. Production TypeScript/Vite build and whitespace checks passed. Synthetic screenshot measurement at390×844: first recommendation starts at677px, compared with1,319px in the review; no horizontal overflow. Price fixtures are synthetic, not claims of current achievable market profits. The generated `/wow-ah/` release was rebuilt without changing the other hosted applications.
