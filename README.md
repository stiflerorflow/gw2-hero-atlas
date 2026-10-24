# GW2 Companion · Hero Point Atlas, Builds & Duo

A self-contained, spoiler-controlled Heart of Thorns, Path of Fire and End of Dragons hero point atlas, with route filters, embedded maps, character profiles, a neutral 250-point elite-spec goal and an optional personal Tempest-to-Weaver preset. The complete catalogue contains 100 challenges: 40 HoT, 29 PoF and 31 EoD, worth 1,000 HP across eligible first completions.

EoD has its own staged spoiler boundary and stays hidden by default. Revealing a map does not enable character access or grant its prerequisites. Older four-stop EoD saves retain their completions and open only the first EoD map. Existing saved goals, including 500-point plans, and the browser storage key are preserved.

Progress and notes are saved locally in each browser. They are not uploaded to GitHub or automatically synced. Use the guide’s backup/export and restore controls to transfer progress between the downloaded and hosted versions or between devices.

The **PoF mastery points** tab lists all 40 PoF insights and 33 additional mastery-point achievement rewards, grouped by easy, medium/hard and low-priority hard routes. Easy achievement rewards are highlighted. Search, map and availability filters obey the existing PoF spoiler boundary. Mastery completions are tracked once per account, shared across character profiles, and included in progress backups; they never add hero points or imply a current unspent mastery-point balance. The tab opens directly at `#mastery`.

Open `index.html` directly in a browser, or serve this repository with GitHub Pages from the `main` branch and repository root. No build or dependencies are required.

This is an unofficial fan guide, not affiliated with or endorsed by ArenaNet. Source attributions and Guild Wars 2 Wiki links are preserved inside the application.

The [EoD research notes](EOD_RESEARCH.md) contain later location names; read them only if you are comfortable with map spoilers. In the application, source links appear only for revealed maps and warn before leaving the spoiler-controlled guide.

[PoF mastery research notes](POF_MASTERY_RESEARCH.md) also contain later map and achievement names. Individual reward and route references are available inside revealed mastery cards.

The **Elite spec bible** tab (`#specs`) covers all 36 specializations, with separate open-world/solo and organised-group PvE views. It includes power/Berserker routes, source-rated solo picks, group benchmark picks, exact stat directions and template codes, dated source links, a three-spec comparison, and editorial complexity, floor, ceiling, fun, flow and class-fantasy ratings. Overall is equally weighted fantasy, ceiling, fun and combat power; higher ceiling is positive. Unsupported power routes are explicitly unranked. EoD and newest-expansion spec reveals are independent of map spoilers and included in progress backups. See [the research audit](ELITE_SPECS_RESEARCH.md) for source coverage and the scoring limitations (contains later spec names).

The bible’s **v2 tools** add a preference quiz, three-stage learning paths with saved checkpoints, a gear-sharing planner with armour-weight/stat/weapon-access checks, encounter suitability guidance, and a personal journal with favourites, tried status, fun/flow ratings, goals and notes. **Cozy builds** split into **AFK / no-brain** (low input while playing) and **Unkillable** (survival first). Each of the 36 specs has a sourced baseline for both lanes, with separate comfort, survival, effort and damage assessments. All new personal data is included in progress backups; restoring retains the data and hides later specs again. See [the v2 research and validation audit](SPEC_TOOLS_RESEARCH.md) for source selections and limitations (contains later spec names).

The [UI/UX audit](UX_AUDIT.md) records the navigation, clipboard, focus, disclosure, quiz and gear-planner fixes and their verification coverage. All guide views support reloadable URLs and browser Back/Forward; `#route` and `#help` join the existing `#mastery` and `#specs` links.

Optional mobile regression checks require Node.js and Playwright. They do not add runtime dependencies to the guide:

```sh
npm install --no-save --package-lock=false playwright
npx playwright install chromium
python3 -m http.server 8765 --bind 127.0.0.1
# In another terminal:
node tests/mobile-tools.cjs
```

Set `ATLAS_URL` to check a deployed copy. `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` selects an existing Chromium installation; `PW_BROWSER=webkit` runs the same flows in WebKit when that browser and its system dependencies are installed. Screenshots are written to a temporary directory printed by the test.

The optional **Duo notebook** under **More tools** (`#duo`) is an editable notebook for taking down Path of Fire champions as two players. It distinguishes trained specs from planned unlocks, suggested roles from confirmed equipment, personal boons from shared coverage, and damage setups from support conversions. It includes current/future pairing experiments, dagger/dagger Tempest notes, breakbar jobs, Matt’s thief shortlist, saved loadout/session notes, copy/print, and an option to hide the tab until needed. Duo data travels in progress backups; it does not sync between players automatically. See [the duo research and assumptions](DUO_RESEARCH.md). Run `node tests/duo.cjs` with the same Playwright/browser setup as the mobile checks above; `AXE_PATH` optionally points to an installed axe-core browser script.

The **Sources & evidence** tab (`#sources`) adds a searchable research library and evidence notes next to build and duo recommendations. The bible’s optional **Import real setup** tool uses your own read-only official GW2 API key to save equipment/build snapshots locally and compare actual gear. Keys are never saved; account snapshots are included in personal backups. Each player connects separately; there is no automatic shared account sync. See [source/import scope and validation](SOURCES_IMPORT_RESEARCH.md). Regression: `node tests/sources-import.cjs`.

Whole-tool audit checks: `node tests/sweep-functional.cjs`, `node tests/sweep-data.cjs`, `node tests/sweep-api.cjs` and `node tests/sweep-mobile.cjs`. They share the browser/URL environment variables above; the mobile sweep optionally uses `AXE_PATH` for WCAG checks. These scripts use isolated browser contexts and simulated keys; they do not modify your GW2 account.

**Start here** (`#home`, also the default landing view) now provides a four-step API-key guide and a personal account workspace. Scan each player’s training/resources/progress/wallet, save tonight’s equipment/build tabs, confirm training when GW2 cannot return it, and choose a target blueprint for practical upgrade priorities. Optional permissions fail independently and retain previous dated data. Share an account-only file to combine two players’ snapshots without replacing manual guide progress. The mastery tab offers a separate read-only API progress view. See [account-workspace contracts, privacy and limitations](ACCOUNT_WORKSPACE_RESEARCH.md). Test: `node tests/account-workspace.cjs` (optional `AXE_PATH`).

The account workspace now adds **exact rune/sigil/relic comparisons**, user-triggered **live Trading Post upgrade quotes**, and **item acquisition/recipe checks** with material, currency and crafting/unlock requirements. **Wizard’s Vault** progress and gearing opportunities are optional progression imports; unreliable API stock counters are explicitly marked for in-game verification. The duo tab adds a **manual champion combat journal** whose recorded lessons guide practice without changing bible ratings. See [data contracts, source verification and limits](UPGRADE_MARKET_VAULT_RESEARCH.md). Regression: `node tests/upgrades-vault-journal.cjs`.


The calmer landing page offers three starting choices: find a build, earn hero points, or use owned equipment. Four primary destinations keep the navigation short; routes, the personal duo notebook, sources and help sit under **More tools**. Account setup appears when requested, and saved account detail is collapsed by default. Fresh gear planners assume no owned equipment or expansions and ask for a target; existing saved choices are retained. Builds show the selected recommendation first, with alternative variants and detailed ratings behind disclosures.

Each build now has a hero-point training step, also available beside imported setups and gear comparisons. Enter points invested in that target elite plus the current unspent balance; the tool shows the remaining HP and the number of new 10-HP expansion challenges. Confirming updates only the chosen character’s goal and credit, converts earned stops to prior completions to prevent double counting, and preserves locations, notes and other profiles. Imported characters can be added to the tracker explicitly; changing characters clears the training/balance inputs. The API does not supply a reliable unspent balance. Test this journey with `node tests/calm-journey.cjs`; `AXE_PATH` enables the expanded eight-view mobile accessibility matrix.


**Guided250HP duo run** (`#run`) is now the primary Hero points destination; the full atlas remains under More tools. It selects25quick-access challenges across five HoT/PoF maps, scouts unknown waypoints, explains every incoming link and map connection, and tracks250newHP separately for two chosen character profiles. Individual rewards, prior completions, skips, six replacement candidates, undo, copy/print and backup/restore are supported. Confirmed awards update each character’s actual atlas completion without replacing their existing goal, notes or credits.

The persistent active timer starts at the first arrival checkpoint, pauses/resumes, survives reloads and automatically stops at250each. The editable150-minute target is a provisional planning budget, not a measured result; it excludes initial story/access setup and paused breaks. [Route choices, linking rationale, estimate and verification limits](FAST_DUO_RUN_RESEARCH.md). Test: `node tests/guided-run.cjs` (`AXE_PATH` optional).

## Revenue Cloud study room

The same Pages deployment now includes a separate [Revenue Cloud study room](revenue-cloud/) at `revenue-cloud/`, linked from Start and More tools. It targets CPQ-certified Salesforce experts preparing for the current **Revenue Management Consultant** certification (also described as Agentforce Revenue Management / Revenue Cloud Consultant).

Includes 28 guided lessons across all 7 weighted exam domains, a CPQ-to-native bridge, 28 manual exercises, 237 dictionary terms, 78 official study references and 112 original explained practice questions. Each lesson now teaches the background first: a plain-language explanation, actual objects/components, connected technical instruction and a complete narrated example. Each lesson also has an implementation sequence, worked reasoning, an independent transfer case with a hidden rubric and saved answer draft. A 19-objective evidence map and eight-stage capstone connect the curriculum. Practice modes include a balanced 14-question diagnostic, a 14-question transfer challenge, domain practice, missed-question review and a 105-minute 60-question approximate-blueprint mock. The current official guide’s Summer’25 alignment is disclosed alongside newer product-learning references; no later exam release or pass guarantee is assumed.

Study progress, notes and attempts use independent local browser storage and separate backup/restore. No Salesforce login, API key, backend or new hosting is required. Editable lesson/quiz content: `revenue-cloud/content.js`; expanded instruction and objective map: `revenue-cloud/learning.js`; teaching chapters: `revenue-cloud/foundations.js`. [Teaching-first review](revenue-cloud/FOUNDATIONS_REVIEW.md). [Depth and pedagogy audit](revenue-cloud/PEDAGOGY_AUDIT.md). [Research, scope, source limitations and data contracts](revenue-cloud/RESEARCH.md).

Regression checks: `node tests/revenue-study.cjs`, `node tests/revenue-mobile.cjs`, `node tests/revenue-dictionary.cjs`, `node tests/revenue-learning.cjs` and `node tests/revenue-foundations.cjs`; mobile, dictionary, learning and foundation checks support `AXE_PATH`. All accept `REVENUE_URL` or the existing `ATLAS_URL`/browser environment variables.

The study room now has a **[Revenue Cloud dictionary](revenue-cloud/#dictionary)** with237sourced definitions across12areas, acronym/alias search, category and A–Z filters, permanent entry links, CPQ distinctions and related concepts. Dotted-underlined terms in lessons and revealed quiz explanations show accessible hover/focus previews; tapping opens the full definition. Question stems/options stay unannotated, and visiting definitions preserves the current attempt. Current versus legacy terminology and release-sensitive concepts are identified. [Dictionary source/review notes](revenue-cloud/DICTIONARY_RESEARCH.md). Regression: `node tests/revenue-dictionary.cjs` (`AXE_PATH` optional).

## Skyscale unlock tasks

Open **More tools → Skyscale unlock**, or use `#skyscale`. A mandatory acknowledgement keeps later names, locations and references out of the rendered guide until you choose to reveal them. Reloading locks it again; saved progress remains.

Choose either acquisition route, keep separate progress for two accounts, follow one stage at a time, reserve resources, and use manual collection-transition reminders. Shopping notes identify avoidable crafting delays, current token limits, parallel mastery work and optional versus required costs. Skyscale JSON backup/restore is separate from the companion backup. For a local copy, keep the `skyscale/` asset folder alongside `index.html`. [Source and spoiler contracts](skyscale/RESEARCH.md).

Verification: `node tests/skyscale.cjs` (`ATLAS_URL`, `AXE_PATH` and `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` supported).
