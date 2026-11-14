# Useful free context APIs — checked 2026-11-14

Add data only when it changes the action or makes a price comparison more reliable. Keep one conclusion visible, followed by the numbers that support it; put methodology and sources below an expandable control.

## Added: TheWoWDB catalogue

[Public API documentation](https://thewowdb.com/developers/) describes a keyless Forever item search with pagination, item detail, binding and vendor sell value. Live requests to item2320 and the paged Forever item search returned200 with permissive CORS. The API supports name search, numeric IDs and paged browsing. Attribution is required. Data is cached in memory for its declared lifetime (at most an hour), with Retry-After handling and no credentials or embedded HTML execution.

This enables the Sell or vendor workflow. The catalogue supplies item facts only. Its embedded price field can describe US Horde and is deliberately discarded; market quotes come from the existing EU RP Alliance adapter. Vendor sell is not vendor purchase price. Zero sell value differs from an unavailable value. Catalogue builds can be older than the live client and include unused/beta records; a searchable catalogue does not establish that every record is currently obtainable or every live item is present. Large lists report has_more rather than a reliable total; the UI does not invent one.

Useful output: vendor gold, assumed AH proceeds after the5% cut, and the minimum gross unit price that strictly beats vendoring. Stack quantity, soulbound state and an allowance for future lost deposits are explicit. No sales log or character setup is needed. This compares gold, not personal utility, quest value or crafting needs.

## Worth a later integration: actual auction price levels

[Forever Battle.net API notes](https://mhuijskens.com/WoWForever/Api/) and the [developer forum discussion](https://us.forums.blizzard.com/en/blizzard/t/wow-forever-api-what-works-so-far-plus-a-ts-client/60334) describe authenticated auction and commodity snapshots. This could answer how many units can actually be bought at each price. An app OAuth token, a server-side collector and a verified ruleset/house mapping are prerequisites; no Blizzard secret belongs in Pages. The Forever routes are community-tested, not a stable officially documented contract. No authenticated request was made in this session, so this is a recommendation, not a claimed working integration. Snapshot disappearance still does not establish a completed sale.

## Useful vendor provenance, but requires access: ForeverDB

[ForeverDB's developer documentation](https://foreverdb.net/developers) describes vendor stock, location, price per item and whether a vendor was observed in Forever or inherited from Classic. Its documented free tier is5000 requests/day and30/min with attribution; an account, developer approval and a correctly scoped key are required. This would improve the current small vendor-competition catalogue. Do not expose a private key or describe unverified Classic stock as current Forever availability. No account was created, access requested or key added.

## Tested and deferred: more metrics from AHledger

[AHledger API documentation](https://ahledger.com/developers) lists structure and timing endpoints. Both responded200 with open CORS for EU RP Alliance. In the actual structure response, “depth” meant total units listed, not prices and quantities at each level; this does not solve executable purchase depth. Several large positions had only one or two samples. The tested Rough Stone timing result labelled confidence early and warned it was too early to trust. Adding a best-time recommendation or volatility score now would add apparent precision without enough evidence.

The existing item endpoint also worked, but its vendorSell field is an NPC buyback value, not proof of where or how cheaply players can purchase an item. Extra population, news, sentiment, cross-region prices and duplicate price feeds were not added: none directly resolves the current buying or selling decision.

## Presentation and validation

All six workflows now use direct headings rather than slogans. Scanner cards lead with the conclusion and primary reason, followed by buy/profit/activity figures; secondary assumptions remain accessible in details. Batch budget verdict precedes its supporting totals. Optional personal sales logging is collapsed. Low-contrast sensory decoration was not substituted for accessible text: contrast, visible keyboard focus, mobile form sizing and reduced-motion behavior are preserved.

Tests cover provider identity/version, ignoring wrong-market catalogue prices, unknown versus zero, binding, quantities, break-even prices, refresh behavior, catalogue failure, phone overflow and accessibility. Full APIs are not polled simply to populate decorative dashboards.
