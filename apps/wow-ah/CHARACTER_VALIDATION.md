# Live-use accuracy review — 2026-11-14

Used the production site in Chromium, then repeated the corrected flows locally against the real public feeds. Tested Glimpo, Chumbles and Grimpo Grongo, the general scanner, and sell-or-vendor comparisons for Gloves of Meditation, Greater Magic Wand and Duskwoven Bracers. No in-game purchase, craft or sale was performed.

## Controlled context

All three characters used **character level 20 for this test**, because their real levels are not provided. Glimpo retained the supplied 2g50. Chumbles and Grimpo used **2g50 test cash**, not a claim about their actual wallets. Kept the supplied profession skills, zero donated supplies and profile isolation. Tests ran in disposable browser contexts and did not edit anyone's normal saved profiles.

## Independently recomputed examples

These are derived audit examples from the 16:08 UTC observation used during the check, not a price archive or current buy recommendations. Posting deposits are excluded. Expected values can include fractional copper; the UI rounds displayed money.

| Action | Independent calculation | Finding |
|---|---|---|
| Gloves of Meditation, known recipe, Tailoring120 | 12 wool at118c +3 thread at100c +1 potion at108c =1824c. Quoted gross2499c ×0.95 −1824c =550.05c. | UI18s24c cost and5s50c conditional margin agree. Orange until125, so one modeled Tailoring point at120. |
| Greater Magic Wand, known recipe, Enchanting100 | Wood38c +2 essences at178c =394c. Gross298c ×0.95 −394c =−110.9c. | UI3s94c cost and−1s11c margin agree. This is a skill step with a loss, not a profitable craft. Requires Copper Rod. |
| Elixir of Wisdom, unlearned, Alchemy130 | Herb34c +2 herbs at98c +vial20c +training reference500c =750c. Gross108c ×0.95 −750c =−647.4c. | UI7s50c including unlock agrees. Marking a genuinely learned recipe removes500c once. The0.625 skill estimate is an approximation, not a published server chance. |
| Duskwoven Bracers buy/DE | Net expected recovery `(0.75×1.5×3348 +0.20×1.5×29996 +0.05×19000)×0.95 =13029.535c`; subtract7200c purchase =5829.535c. | UI58s30c mean margin agrees, but all dust rolls lose: only25% of the baseline modeled outcomes cover inputs before deposits. |
| Silverleaf scanner lead | Buy13c; capped gross scenario18c;18×0.95−13 =4.1c. | UI4c potential margin agrees. This is an asking-price scenario, not a confirmed resale. |

After confirming the engineering tools, Grimpo's corrected guide surfaced Whirring Bronze Gizmo. Cost958c includes two bars340c, cloth118c and500c training. At skill130 its baseline skill estimate is0.70, not a guaranteed point. Confirming an already-known recipe removes the500c fee. A nearby Anvil is required and appears in the production checklist.

## Material errors corrected

1. **Legacy vendor values in the catalogue.** Live TheWoWDB returned1535c for Greater Magic Wand, the Classic amount. Forever's value is200c. Lesser Magic Wand similarly has a110c Forever value rather than508c. Corrected four established crafted wands and Minor Wizard Oil using a separate sourced static-facts layer, shared with the crafting catalogue. Sell-or-vendor shows a correction notice and the Blizzard source, while preserving user-entered overrides. This fixes a comparison that could point users toward a nonexistent vendor profit.
2. **Missing crafting prerequisites.** Four low-level enchanting recipes now require confirming Runed Copper Rod. Whirring Bronze Gizmo checks both Blacksmith Hammer and Arclight Spanner, and names the nearby Anvil. Tools can be confirmed directly in Character plan and in profile settings. Unknown ownership is not silently granted.
3. **Unlearned recipe costs.** Greater Magic Wand's fee was incorrectly zero; reference is2s. Whirring Bronze Gizmo now has its corroborated5s fee. Lesser Wand's unconfirmed current training fee stays unknown, rather than free. User-confirmed learned recipes still have no repeat unlock fee.
4. **Risk and unsupported certainty.** Random DE recommendations now expose the modeled chance to cover inputs. Removed the categorical assertion that DE never grants skill: DE gains are not modeled or credited. Skill probabilities, uniform stack averages, Legacy perks and camp bonuses are distinguished. Provider-only DE tables remain identified; independently checked Duskwoven Bracers now has a sourced baseline table.
5. **Quote age and profile editing.** Character plan and detailed crafting now flag observations over one hour old, matching scanner/vendor workflows. The advanced profession editor preserves slot order. Owned-item DE wording no longer instructs the user to buy stock already recorded as owned.

## Source checks

- [Blizzard October8 developer notes](https://us.forums.blizzard.com/en/wow/t/wow-forever-beta-development-notes-%E2%80%93-updated-november-2/2360696/5), Items: Lesser Magic Wand1s10c; Greater Magic Wand2s; Lesser Mystic4s50c; Greater Mystic6s; Minor Wizard Oil1s. Checked against [current Greater Wand tooltip](https://www.wowhead.com/forever/item=11288/greater-magic-wand), [Lesser Wand client diff](https://foreverdiff.com/items/lesser-magic-wand-11287/), and [post-launch client/hotfix comparison](https://wowforevertalents.com/patch-notes/). Do not use the superseded1c beta nerf or Classic prices as current values.
- [Greater Wand spell](https://www.wowhead.com/forever/spell=14807/greater-magic-wand) and [ninja's observed/client reference](https://wowforever.ninja/professions/enchanting/14807-greater-magic-wand/): learn70, colors110/130/150, two Lesser Magic Essences, Copper Rod,2s before reputation discount.
- [Gloves spell and observed requirement](https://wowforever.ninja/professions/tailoring/3852-gloves-of-meditation/) and [independent client comparison](https://foreverdiff.com/recipes/gloves-of-meditation-2389/): four wool bolts, three thread, one potion; learn105, yellow125, green140, gray155.
- [Elixir spell](https://www.wowhead.com/forever/spell=3171/elixir-of-wisdom):90/120/140/160; Mageroyal1, Briarthorn2, Empty Vial1;5s reference trainer fee. Reputation discounts need the actual quote.
- [Gizmo spell](https://www.wowhead.com/forever/spell=3942/whirring-bronze-gizmo), [observed trainer guide](https://foreverdb.net/profession/engineering/leveling), [recipe/output reference](https://www.foreverdb.app/en/forever/spells/3942/whirring-bronze-gizmo):125/125/150/175, two bars and one wool, **one output**,5s, hammer/spanner/anvil. No invented two-output craft.
- [DE guide](https://www.wow-professions.com/forever/disenchanting-guide), [Gloves outcome reference](https://wowforever.gg/en/atlas/knowledge/items/gloves-of-meditation-i4318/), [Duskwoven item facts](https://www.wowhead.com/forever/item=10059/duskwoven-bracers): checked baseline outcomes. The guide uses **required equipment level**, not item level: Gloves item26/required21 and Bracers item50/required45 map correctly. No minimum Enchanting rank beyond learning the profession is imposed for higher-level DE items.
- [Hyjal EU RP-PvE Alliance house119](https://hyjal.cc/auctions/eu/rp-pve/alliance),16:18 UTC: Lesser Magic Essence178c agrees; Wool128c differs from the tool's118c ten-minute-earlier snapshot. This difference moves the modeled glove cost by1s20c if other prices are held constant. Third-party agreement is corroboration, not proof of independent upstream data or executable listings.

## Remaining boundaries

The arithmetic and reviewed game facts can be checked outside the game. Actual stock at a quoted unit price, post-hotfix vendor offers, your gear/tools, actual trainer discounts, server skill-up rolls, deposits, and successful sales still require the client. Daily units are provider-inferred market activity, not personal sales. Quotes refresh on provider schedules; refreshing the page does not make an old observation current. The recipe catalogue is incomplete and the next-step ranking is not a global route optimum.

Static corrections cover known sourced discrepancies, not a claim that every searchable catalogue item has been independently verified. Manual overrides remain explicit. No provider JSON snapshots were added to the repo, profile export or persistent browser storage. Regression fixtures use synthetic market prices and the historical wrong-vendor response that triggered the bug.
