# Evidence-led market discovery — 2026-11-15

## Purpose

Discover what current available evidence supports, while keeping unsupported conclusions unknown. Original gloves, potion and cloth ideas are hypotheses, not favored products. A small checked recipe catalogue is useful for mechanics and skill estimates, but cannot establish the best gold-making action across the market.

## Product behavior

- Market scan is the default entry point and brand link. Its leads come from the provider deals feed, not ITEMS, a list of favorite recipes, character inventory or manually assumed exit prices.
- The default asks for the broadest supported reference discount15%, any activity including zero/unknown,1+ listed unit and up to200 returned leads. This is still a provider-filtered subset, not the full AH or all possible crafting opportunities.
- Card fronts show lowest listed price, median listed price, listed quantity, observation age and explicitly inferred activity. Unknown median/activity remain unknown and do not hide the row. A positive hypothetical profit is not required to appear.
- The resale calculation lives inside Price history & calculator. Its assumed exit,5%cut, deposit assumptions and prospective margin are explicitly scenarios. Current-price mode caps its derived exit at median asks; historical recovery remains speculative.
- No recipe hypothesis substitutes for a failed or empty market feed. Cache freshness does not make an old source observation newer. Missing/future observation times are not called fresh.
- Character plan handles skill estimates within the checked catalogue. Automatic gold-scenario selection is off by default. Include crafting profit scenarios is an explicit what-if choice; its cards say Gold scenario, not Gold opportunity. Recipe verification establishes mechanics, not liquidity or sale price.
- New profiles have unknown cash/budget, no assumed learned recipes, no owned supplies and no watched-item favorites. The named characters keep the profession starting skills previously supplied by the user; these must be checked against the current character.
- Quick inventory context follows recorded items, including IDs outside the recipe catalogue. It no longer inserts a potion because of a particular glove recipe. Empty inventory editors require an item choice before recording stock.
- Existing saved values/backups are preserved. The app cannot distinguish an old seeded value from one the user later confirmed, so it does not silently erase records. Market scanning does not consume those personal assumptions. Confirm older profile data before skill planning.

## What counts as evidence

|Information|Treatment|
|---|---|
|Provider lowest/median ask, listed stock, source time|Reported listing observation, subject to freshness and source accuracy|
|Provider units/day|Inferred activity estimate; not a confirmed count of completed sales|
|Recipe source, ingredients and skill boundaries|Mechanics reference; no implication of demand|
|Assumed resale price, expected random DE value, modeled margin|Scenario requiring explicit assumptions|
|User-entered completed sale|Personal recorded result; no claim it predicts the next sale|
|Buyer willingness, full executable lowest-price depth, future turnover|Unknown unless independently established|

Provider documentation reviewed2026-11-15: [AHledger developers](https://ahledger.com/developers), including the public deals filters,200-lead cap and estimated sales fields. No new undocumented endpoints, persistent provider archives or keys were introduced.

## Validation

New unit/browser regressions check clean profile defaults, arbitrary provider items outside the recipe set, unknown median/activity, explicit scenario opt-in, preservation of recorded data, source-age labels, empty-feed behavior, inventory choice and mobile accessibility. Historical finance/UI regression inputs are now explicit synthetic fixtures in tests/support/profiles.ts, not runtime product defaults. They continue to verify the calculators without promoting the old hypotheses.

Remaining limit: this release corrects discovery framing and removes seeded bias. The checked crafting catalogue is still limited; the app does not claim a verified market-wide best craft or guaranteed profitable flip.
