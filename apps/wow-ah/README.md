# The Copper Ledger — WoW Forever AH planner

Standalone React/TypeScript app at `/gw2-hero-atlas/wow-ah/`, for **EU RP non-PvP Alliance** (`forever.rp.alliance.eu`). This directory owns all its UI, dependencies and calculations. It neither loads nor changes the GW2/Revenue Cloud applications, their navigation, API keys or storage. No service worker intercepts another application's routes.

## Market scanning

The default [flip scanner](https://stiflerorflow.github.io/gw2-hero-atlas/wow-ah/#scanner) finds resale leads without character setup or crafting. It includes daily activity, stock, assumed net profit, flexible filters and on-demand24h/7d asking-price history. [Scanner behavior and data limitations](SCANNER.md). Existing crafting, leveling, batch and watchlist workflows remain available.

## Use

1. Choose Glimpo, Chumbles or Grimpo Grongo. Edit cash, spending limit, caps, learned recipes and actual inventory first. Unknown cash stays unknown. Donated cloth/free potions start at **zero available**, never unlimited.
2. Inspect opportunities and their input sources. Unit quotes aren't full listing depth; inferred market demand isn't your own sales. Compare cash profit with profit after owned-material value.
3. Add a small batch, enter actual deposits for your listing duration, choose sale assumptions and keep a reserve. The batch consumes owned materials and quoted market stock once and cannot fund purchases with future proceeds. Retained guaranteed outputs can supply later rows; random DE results cannot until actually recorded.
4. Use the ordered shopping/preparation/production/posting checklist in game. Buying, posting, gathering and crafting are manual.
5. Record completed sales separately; update your wallet and inventory yourself. Export profiles to move between devices. Nothing automatically syncs between Matt/Steve or browsers.

Initial profiles: Glimpo Tailoring120/Enchanting100, 2g50; Chumbles Herbalism110/Alchemy130; Grimpo Grongo Warrior Engineering130/Mining110. Cash for the last two is unknown. Explicit transfers move finite recorded materials without pooling wallets; soulbound tools cannot transfer.

## Sell or vendor

Open `#sell` to search the paged Forever catalogue by name, item ID or pasted item link. Select an item to compare vendor gold against the EU RP Alliance AH scenario after fees. No profile or sales logging is required. [API choices and presentation review](API_CONTEXT_REVIEW.md).

## Development and release

```sh
npm ci
npm test
npm run build
npm run dev
# System Chromium (default /usr/bin/chromium), or set CHROMIUM_PATH:
npm run test:e2e
```

Source lives in `apps/wow-ah/` in the hosting repository; the generated static release lives in `/wow-ah/`. Run `node scripts/publish.mjs` from this directory after tests/build to replace only that release folder. Commit source and release together. CI checks tests, mobile/desktop accessibility and a deterministic release build. Existing **main/root legacy Pages** remains the deployment mechanism; switching Pages to an artifact containing only this app would remove the other apps. Hash tabs support direct links and refresh.

`BASE_PATH` can override the production Vite base when deploying elsewhere. This app requires HTTP(S), not double-clicking the source HTML. Browser localStorage key `copper-ledger.profile.v1` is exclusive to this app. Backups contain profile data and user-entered quotes, never API credentials or provider snapshots. Concurrent-tab edits block stale writes. Invalid stored data is preserved and can be explicitly replaced by a valid backup.

## Data and limitations

Prices from [AHledger](https://ahledger.com), public read-only endpoints, no Blizzard login or client secret. Prices, requirements and math are separate modules. Cached provider responses remain in memory only, honor cache headers up to five minutes, and are removed at expiration; historic charts use the provider's live seven-day endpoint rather than an archive. `429`/`503` obey Retry-After. Market mismatch rejects the response. Missing/expired prices remain unknown; timestamped manual quotes remain available without the feed. Observation times belong to snapshots, not refresh time.

[Developer terms](https://ahledger.com/developers) checked 2026-11-14: attribution required; personal/community use. Announced 2026-12-10 policy: unauthenticated 30 requests/min, seven-day history; caching only for the supplied TTL, no licensed archives. Monetization or persistent provider history requires revisiting the terms. No price snapshots are bundled, exported or persisted. Attribution links are constrained to AHledger HTTPS URLs, preserve supplied query parameters, and never inject provider HTML.

The checked catalogue is deliberately small. Imported recipes are shown as unverified candidates and excluded from leveling recommendations. Chumbles and Grimpo have checked starting recipes; this isn't a complete Alchemy/Engineering catalogue or a gathering-route optimizer. Use the recipe list to confirm which recipes are actually known.

Next-point routes rank learned eligible recipes using replacement-material quotes, with explicit estimated yellow/green probabilities. They are **not** a globally optimized dual-profession route or a promise of a skill point. Future-skill batch rows still require confirming actual skill. Orange/grey thresholds are checked separately, rank caps and tools are enforced, and one-time rods aren't repeat leveling recommendations. Manual fees override catalogue references.

Net sales apply one 5% faction cut. Deposits are separate upfront commitments; successful deposits return, expired deposits are lost. Whole crafted items sell in whole units; DE sale fractions are a scenario share of expected material recovery, not guaranteed material counts. The DE posting deposit is an editable per-input allowance; obtain the actual posting quote once the drops are known. Vendor fallback does not sell an already disenchanted item.

Listing-depth snapshots, authenticated Blizzard data, background notifications, cross-market comparisons and cloud sync are deferred. No secrets belong in Pages; any future Blizzard OAuth collector needs a backend.

## Accuracy and sources

Catalogue reviewed 2026-11-14 against Forever client-data references and the November11 bag hotfix. Each recipe and DE outcome carries a source URL. API-reported profits and skill gates are never accepted as authoritative.

- [November11 bag hotfix](https://worldofwarcraft.blizzard.com/en-us/news/24315281): Red Woolen Bag five bolts, ten slots; Green Silk Pack five bolts, twelve slots.
- [Azure Silk Hood](https://wowforever.ninja/professions/tailoring/8760-azure-silk-hood/): Tailoring120, not the feed's90.
- [Gloves of Meditation](https://wowforever.ninja/professions/tailoring/3852-gloves-of-meditation/).
- [Dark Silk Shirt](https://www.foreverdb.app/en/forever/spells/3870/dark-silk-shirt): vendor pattern; reference fee9s, actual quote editable.
- [Green Silk Pack](https://wowforever.ninja/professions/tailoring/6693-green-silk-pack/): pattern at140, not trainer at120; older four-bolt reference overridden by later official hotfix.
- [Runed Silver Rod](https://wowforever.ninja/professions/enchanting/7795-runed-silver-rod/), [Lesser Stamina](https://wowforever.ninja/professions/enchanting/13501-enchant-bracer-lesser-stamina/).
- [DE outcome reference](https://bootybaybroker.com/forever/crafting/disenchant?faction=alliance&realm=camwow-eu4-realm-10-rp&region=eu); [Toughened Leather Gloves guaranteed shard](https://foreverdb.net/item/4253).
- [Magic Wand non-DE exception](https://db.icy-veins.com/wow-forever/items/11288): explicit exceptions override generic feed tables for both Magic Wands.

Manual vendor prices account for actual reputation discounts. Reference Fine Thread is1s, not the feed's2s. Bronze Framework requires Engineering145, not the feed's105. Engineering references that show three thresholds start at yellow; they do not imply an orange interval.

Tests cover handoff acceptance values, finite donations, mixed essence purchases/whole lots, skill gates/caps, recipe fees once, missing/stale quotes, restricted market identity, shared market stock, retained outputs, budget and deposits, import/transfer isolation, mobile widths320–1280, all-screen accessibility, provider failure, synthetic endpoint shapes and a separate live-browser smoke check.
