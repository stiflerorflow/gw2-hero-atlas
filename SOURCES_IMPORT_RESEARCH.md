# Sources and optional account imports

Reviewed 17 October 2026. The Sources & evidence tab separates selected builds from alternative variants, editorial ratings and published benchmarks. Added provider coverage: official GW2 API, GW2 Wiki, Snow Crows, MetaBattle, Accessibility Wars, Masel, Lord Hizen, GuildJen, Discretize optimizer and GW2 Wingman. Old Discretize guides are archival; optimizer is a separate current tool. Historical Hizen demonstrations and revision-unconfirmed alternatives are labelled accordingly. External pages can reveal spoilers.

Official endpoint contracts: https://wiki.guildwars2.com/wiki/API:2/characters/:id/equipmenttabs and https://wiki.guildwars2.com/wiki/API:2/characters/:id/buildtabs plus `/tokeninfo`, `/account`, `/characters`, character `/core`, `/items`, `/itemstats`, `/skills`, `/traits`, `/specializations`. Public item/stat metadata was fetched during research. Private account behaviour is verified using mocked API responses; no real personal API key was available during development.

The optional browser import requires account, characters and builds permissions. It imports independently selected equipment/build templates, resolves chosen stats ahead of item defaults, records binding, upgrades and item level/tier, and saves up to twelve offline snapshots. No bank/bags/materials, mastery progress, ownership or elite training is inferred. Snapshot comparisons remain conditional on upgrades, actual bindings and available legendary copies.

Keys exist in memory only, sent in Authorization headers to official private API endpoints. Disconnect/pagehide clears the key and pending work. Keys are excluded from local saves, backups and copy output. Snapshots contain personal character/account identifiers and equipment; progress backups therefore contain that personal data. Users should share backups deliberately. There is no backend, analytics or automatic two-person sync.

Matt and Steve can maintain separate browser imports and share snapshots via existing progress backups; restoring a backup replaces local guide progress after confirmation, so it is not a selective merge or multi-user sync.

Run `node tests/sources-import.cjs` with Playwright and the browser environment described in README. Tests cover mocked authenticated/public request boundaries, key exclusion, independent tabs, chosen stats, tier checks, offline persistence, progress isolation, spoiler suppression and mobile widths. Real-account import still needs the account holder's browser check.
