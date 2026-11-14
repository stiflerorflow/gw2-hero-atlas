# Live scanner validation — 2026-11-14

Used the deployed scanner in desktop Chromium: Active markets, highest profit, Deep discounts, price history and calculator. Checked several commodity, vendor-supply, crafted-bag and rare-equipment leads. Browser had no JavaScript errors. Independently recalculated the 90%-of-reference scenario and the single5% AH cut.

## Findings and corrections

The calculation matched its assumptions, but historical asking-price recovery was too optimistic as a default. A historical discount does not establish an immediately profitable relist. Default scanning now caps the assumed gross resale at the lower of the latest quoted median and the selected percentage of historical reference. Historical recovery remains an explicit speculative mode, with a warning when its exit exceeds latest median asks. Missing current medians are unknown in current-spread mode, not silently replaced by historical prices.

Representative reviewed scenarios (copper input amounts; example observations around14:15 UTC, not current buy recommendations):

| Item | Buy | Historical reference | Latest median | Former historical scenario profit | Current-spread outcome |
|---|---:|---:|---:|---:|---|
| Feathered Arrow |10|15|10|+2.35|Negative after cut; hidden by positive-only filter|
| Rough Stone |7|18|17|+8.20|Same capped16c exit; candidate, not confirmed executable depth|
| Coarse Thread |32|46|32|+6.95|Negative after cut; NPC competition flagged|
| Mageweave Reagent Bag |30000|54214|30000|+16352.40|−1500 before lost deposits|
| Sandpaper |7997|21356|8000|+10262|−397 before lost deposits|
| Flurry Axe |1504500|10004500|1504500|+7049347.50|Negative after cut; zero inferred daily sales additionally discourages recovery speculation|

Only illustrative derived audit findings and regression cases are recorded here, not a provider-response archive. Application prices remain TTL-limited in memory.

## Broader corroboration

- [Hyjal EU RP-PvE Alliance house119](https://hyjal.cc/auctions/eu/rp-pve/alliance):14:18 UTC page snapshot listed Feathered Arrow10c/current median10c and Rough Stone7c/current median17c, agreeing with those prices in the scanner's14:15 feed. Stock and inferred daily-volume numbers differed. Agreement validates those snapshot quotes, not successful resale or the exact rate.
- [WoW Auction House EU RP Alliance](https://wowauctionhouse.com/forever/eu/rp-alliance/) and [Rough Stone all-house detail](https://wowauctionhouse.com/forever/item/2835-rough-stone/?house=horde): another scan showed different prices and quantities, including an EU RP Alliance Rough Stone quote20c in the item detail. Its summary page also differed from its detail. These are corroborating snapshots with different collection/cache times, not a second exact current-price guarantee. The website's own source descriptions vary between Blizzard API and addon uploads; source independence was not audited.
- [Coarse Thread Forever vendor observation](https://wow-forever.gg/spotlight/coarse-thread/) explicitly reports an addon-observed Stormwind vendor at10c with unlimited stock. [MetaBot's Coarse Thread page](https://metabot.gg/en/wow-forever/items/coarse-thread) independently lists the10c vendor purchase price. This is a meaningful alternative to buying the scanner's32c AH quote. Scanner now exposes known catalogue vendor references instead of implying an AH discount alone proves value. Availability, reputation discounts and convenience premiums still require judgment.
- [Enchanter's Cowl Icy Veins item4322](https://db.icy-veins.com/wow-forever/items/4322) and [WoW Forever item page](https://wow-forever.gg/db/items/4322-enchanter-s-cowl/) corroborate tradable BoE gear rather than a soulbound craft. This does not establish its resale price.
- [Mageweave Reagent Bag item facts](https://forevermastery.com/en/recipes/1257443-mageweave-reagent-bag) and [ZugZugDB item254035](https://zugzugdb.com/item/254035/mageweave-reagent-bag) establish the item's identity; Normal/US/other-faction quotes were not used to certify EU RP Alliance prices.
- [AHledger glossary](https://ahledger.com/glossary): quantity-weighted median asks, seven-day median of daily typical prices, inferred sales from scan disappearances and cancellation/expiry ambiguity. Detailed candidates reported a seven-day sales window with10.9 covered hours. Arbitrary actual sales counts are not available or claimed.
- [Official November10 hotfix](https://worldofwarcraft.blizzard.com/en-us/news/24315281/wow-forever-hotfixes-november-5-2026): minimum deposit was reduced from1s to1c. Deposits remain user-entered rather than a made-up fixed charge; margins above exclude lost deposits.

## User-visible changes and verification

Added current-spread versus speculative-recovery selector, latest median display, recovery premium warning, known-vendor competition reference, quote-age warning after one hour, and same-market links to two comparison sites. These external links do not auto-certify the listing or add unlicensed data feeds.

Regression tests cover the bag false-positive, missing current median, explicit exit override, vendor warning and aging quote. Full unit/browser suites and build are rerun for release. Positive spread, daily estimates, third-party corroboration and executable profitable sales remain four different claims. The in-game price and quantity available at that price are still the decisive final check.
