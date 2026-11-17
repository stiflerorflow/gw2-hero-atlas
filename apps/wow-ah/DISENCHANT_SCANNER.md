# Standalone disenchant scanner — 2026-11-17

[Open Disenchant](https://stiflerorflow.github.io/gw2-hero-atlas/wow-ah/#disenchant). No character setup or crafting recipe is required. This feature buys or posts nothing.

## Ranking and scope

The initial **Top 10 to verify** ranks positive modeled profit per input item. It requires a nonzero quoted gear quantity, complete material prices and either an item-specific checked loot table or a full match to a local reference model. Sort options also allow profit odds or purchase price. User filters apply before the ten-result limit. Fewer than ten qualifying items remain fewer than ten; no examples fill empty results. **All candidates** includes negative, incomplete and unverified rows, with pagination. Search matches returned names, material names and IDs; it is not a whole-AH item search.

The provider's dedicated `disenchant` endpoint supplies up to **200 returned item listings**, including negative margins with `all=true`. This is not a complete AH scan or a proof of globally optimal purchases. Gear quantity is the total returned stock, not a claim that every unit costs the minimum ask. Default material values are lowest **asking** prices, not completed sales. An optional median-asking basis and explicit temporary overrides support scenarios. Edits open All candidates so a now-unprofitable row remains editable. Edited scenarios remain first in All candidates even when their new profit drops below the first page. Filters still apply. Manually edited scenarios are labeled and can be reset.

## Loot-table knowledge

`src/catalog/disenchantTables.ts` stores item-level reference models independently of provider profit headlines. It compares every outcome probability, material ID and count range, ignoring only ordering. Models distinguish dust-heavy and essence-heavy green items, the early 80/20 band and the later 3% weapon shard band. Blue-item reference coverage is deliberately limited to item levels 26–55. Item level is not the wearing-level requirement.

Checked item exceptions take priority, including the existing guaranteed-shard example and known non-disenchantable crafted wands. A reference match is **not independent proof for an individual item's eligibility or exceptions**: inspect its source and confirm in game. Provider-only rows remain visible with a verification warning in All candidates. Unknown or malformed tables never become fabricated complete tables.

References reviewed:

- [WoW Forever disenchanting guide](https://www.wow-professions.com/forever/disenchanting-guide): material progression and ranges; uses required equipment levels.
- [Classic item-level game-data comparison](https://legacyofwarcraft.com/db/classic/professions/disenchanting.html): item-level bands, differing weapon rates and exception boundaries. This is a Classic comparison, not authority for every Forever change.
- [Forever Mastery](https://forevermastery.com/en/tools/disenchant): Forever cross-check. Its broad guide and Classic game-data comparison disagree on some shard boundaries and high-level essence counts.
- [Greater Eternal Essence commentary](https://www.wowhead.com/item=16203/greater-eternal-essence): another 61–65 count reference, with differing guidance elsewhere.

Because references disagree, item levels **21–25 and 61+** do not receive generic reference-matched status in this release. Epic and other unsupported tables stay provider-only unless an item-specific checked table exists. This trades coverage for explicit evidence, rather than quietly choosing whichever table produces the largest profit. The full provider table and its actual calculated returns can still be inspected.

## Arithmetic

For mutually exclusive outcome branches:

`expected gross = sum(branch probability × sum(mean count × gross material unit quote))`

`expected net = expected gross × 0.95`

`expected profit = expected net − purchase price − lost-deposit allowance`

The modeled strict profit probability evaluates each integer quantity combination and sums only outcomes whose net recovery is **greater than** cost. Covering costs includes exact ties and is reported separately. Worst and best single-input profits use outcome bounds. Break-even purchase price on average equals expected net less lost deposits. Original-item vendor payout is shown when known, with an explicit unknown alternative otherwise.

When only count ranges are supplied, equal odds per integer count are a **model**, not observed loot statistics. Joint count ranges are modeled independently. Such probability values use an approximation marker and the expanded explanation also gives profit-probability bounds without assuming a count distribution. A material with no usable quote makes aggregate expected returns and profit odds unknown; an explicitly entered zero is distinct. Invalid probability totals are rejected, never repaired by dropping a branch.

Money comparisons use hundredths of a copper so 5% fee thresholds do not create false profitable ties. Actual per-auction rounding can differ by a few copper. Successful posting deposits return and are not additional income; lost deposits are a separate user-entered allowance. Upfront deposit funding still matters.

## Demand, freshness and privacy

Drop profit odds do not include the probability of finding a buyer. Zero inferred activity is flagged prominently; missing activity is labeled unverified. Top 10 is an expected-value shortlist to verify, not a liquidity-adjusted buy order. Observations older than an hour and missing/future observation times are flagged. A cache refresh cannot make the underlying observation newer.

The loader verifies EU RP Alliance market identity, fetches only the dedicated feed plus its distinct material quotes, and ignores provider headline profits and inline missing-as-zero material medians. Material quote batches contain at most 100 IDs; bounded input handling caps work and requests. Source attribution links preserve safe AHledger query parameters. Requests obey existing Retry-After and cache-header limits. Both candidate tables and prices disappear at expiration; there is no curated fallback on feed failure. Quotes and calculator drafts stay in memory, never in profiles, exports or a bundled data archive.

## Verification

Unit tests include independent enumeration over 810 price/cost combinations, strict tie boundaries, fees, missing prices, malformed tables, joint drops, reference boundaries, checked exceptions, source identity, limited endpoint selection and cache expiry. Browser tests exercise computed ranking independently of provider headline profit, the ten-result cap, short results, unverified exclusion, manual edits/reset/navigation, filtering, missing quotes, expiration and provider failure. Mobile and desktop accessibility checks include the new route.

A live-browser development check fetched the actual 200-row EU RP Alliance feed and independently reconstructed one returned item's expected recovery and strict profit odds from raw source outcomes and material quotes, without using the app's math helper. Values agreed at displayed precision. Provider observations were old, and the UI correctly exposed that limitation. This verifies calculations against observed inputs, not eventual sales or future loot.
