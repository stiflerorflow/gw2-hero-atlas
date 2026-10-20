# Revenue Cloud study room: scope and evidence

Reviewed **20 October 2026**. Built for Salesforce experts with the CPQ certificate and strong managed-package CPQ experience, but little native Revenue Cloud experience. This is an independent study aid, not an official Salesforce course, exam dump, endorsed practice test or pass guarantee.

## Credential identity and release

The current [credential listing](https://trailhead.salesforce.com/credentials/revenuemanagementconsultant) says **Salesforce Certified Revenue Management Consultant**. The [official exam guide](https://help.salesforce.com/s/articleView?id=005298978&language=en_US&type=1) also uses **Agentforce Revenue Management Consultant**. The [preparation trail](https://trailhead.salesforce.com/content/learn/trails/prepare-for-your-salesforce-revenue-cloud-consultant-exam) retains Revenue Cloud in its URL. The study room explains these names and targets the native product on core; it does not target the legacy CPQ Administrator or older Accredited Professional exams.

The reviewed guide specifies 60 scored questions, up to five additional unscored questions, 105 minutes, a63% passing score and no prerequisite. It still states Summer’25 alignment. We have not invented a later exam version. Product units have current names and may include newer features; the interface explicitly distinguishes current product learning from the exam’s stated release. Recheck the official guide before registering. Fees and registration mechanics are intentionally left to Salesforce.

## Coverage

Seven domain weights are transcribed as structured metadata. The objectives below are editorial summaries. Each domain contains four original lessons, an exercise per lesson and mapped questions.

| Domain | Weight | Lesson focus | Bank questions | Mock allocation |
|---|---:|---|---:|---:|
| Platform concepts |18%| Product identity/data relationships; Context Service; BRE/Flow/Omnistudio; access/APIs/reporting |15|11|
| Implementation readiness |14%| Org/entitlement readiness; discovery/scope/owners; testing/adoption; CPQ migration |12|8|
| Catalog management |16%| Catalog/category structure; attributes/classifications; bundles; selling models |14|10|
| Configure, price, quote |18%| Configurator engines; pricing procedure; advanced pricing; transactions/Agentforce |15|11|
| Contracts and orders |11%| Legal lifecycle; decomposition; orchestration dependencies/scope; fallout/recovery |9|6|
| Asset management |16%| Actions/state periods; amendments; renewals; cancellations and finance |13|10|
| Invoice management |7%| Policies/profiles/treatments; schedules/invoices; usage; credits/payments |6|4|

Mock allocation totals60 and approximately follows blueprint percentages. It is not a forecast of exact live exam question counts. All60 mock items are scored; no unscored items are simulated. A balanced14-question diagnostic deliberately uses two per domain rather than exam weighting. Domain practice samples up to10; missed review samples up to20 based on each question’s latest attempted outcome.

## Source review

The preparation trail was inspected and58 individual learning units across15 modules were fetched and reviewed for relevant concepts, including catalog modeling, configuration engines, pricing setup and advanced pricing, context definitions/mappings, BRE tools, contracts, simple/complex orchestration, usage, asset changes and Billing. The searchable library contains72 official references. Titles and URLs are stored alongside the content in `content.js`; each lesson and question maps to those source IDs.

Primary references include:

- [Product identity](https://help.salesforce.com/s/articleView?id=ind.rev_which_product.htm&language=en_US&type=5)
- [CPQ differences](https://help.salesforce.com/s/articleView?id=ind.rev_migration_revenue_differences_from_cpq.htm&language=en_US&type=5)
- [Data-model migration](https://help.salesforce.com/s/articleView?id=ind.rev_migration_architecture_data_model.htm&language=en_US&type=5)
- [Context Service](https://trailhead.salesforce.com/content/learn/modules/context-service-basics)
- [Catalog management](https://trailhead.salesforce.com/content/learn/modules/product-catalog-management-with-revenue-cloud)
- [Product configuration](https://trailhead.salesforce.com/content/learn/modules/product-configuration-with-revenue-cloud)
- [Pricing](https://trailhead.salesforce.com/content/learn/modules/price-management-with-revenue-cloud) and [advanced pricing](https://trailhead.salesforce.com/content/learn/modules/advanced-price-management-with-revenue-cloud)
- [Dynamic Revenue Orchestrator](https://trailhead.salesforce.com/content/learn/modules/dynamic-revenue-orchestrator-foundations)
- [Asset lifecycle](https://trailhead.salesforce.com/content/learn/modules/asset-lifecycle-management-with-revenue-cloud)
- [Usage Management](https://trailhead.salesforce.com/content/learn/modules/usage-management-foundations)
- [Billing](https://trailhead.salesforce.com/content/learn/modules/billing-basics-in-revenue-cloud)
- [Quoting agent project](https://trailhead.salesforce.com/content/learn/projects/quick-start-build-an-agent-to-create-quotes-fast/build-your-first-agentforce-quoting-agent)
- [Catalog business API reference](https://developer.salesforce.com/docs/revenue/revenue-management/guide/product-catalog-management-api-resources.html)

Two Salesforce Help references (feature-license availability and implementation setup) were linked by the official trail but their bodies did not render in the research tool. Their source-library entries say so. They are retained as official follow-up references; no exact entitlement matrix is claimed from an unread body. Adoption and UAT modules were verified as official trail references. No paid exam-bank material or purported live questions was used. All84 practice stems, choices, distractor explanations and worked scenarios are original.

## Educational depth and limitations

The local material prioritizes architectural distinctions and scenario decisions rather than basic Salesforce navigation. Exercises state evidence to produce, and learner checks are explicitly manual. Specialized training orgs follow the instructions in the relevant badge; a standard Playground, one special Developer Edition or a legacy CPQ sandbox is not assumed to contain every capability.

The lessons are a structured companion to the official curriculum, not a claim to replace every unit, release note or implementation experience. No authenticated Salesforce org work, actual certification sitting or psychometric calibration was performed. A high score on repeated questions from this finite bank can reflect memorization. A higher pass prediction or “exam ready” certification is deliberately not generated.

## Technical and persistence contracts

`index.html`, `styles.css`, `content.js` and `app.js` are static assets served at `/revenue-cloud/` under the same repository-root GitHub Pages deployment. `content.js` is the editable canonical content source; no build step, backend, Salesforce connection or runtime third-party asset is required. The existing companion links here from Start and More tools. Native browser hash history supports direct lesson, bridge, practice and source links.

Dedicated localStorage key `revenue-cloud-study-v1` stores lesson/exercise self-checks, escaped notes, latest question outcomes, up to12 completed attempts and one resumable current attempt. It does not read or write the companion’s state key. Study JSON backup/restore is separate from companion backups. Unknown lesson/question IDs and invalid answer indices are discarded; import is bounded to1MB and requires explicit replacement confirmation. Question-bank changes preserve compatible lesson checks/notes but invalidate scored history/current attempts rather than grading old answers against a different bank.

Options and question order are shuffled when an attempt starts and preserved across reload. Multi-select scoring requires exactly the correct set, without partial credit. Learning answers are locked after checking; mock answers remain editable until submission. Mock timing is wall-clock105minutes from the persisted start and continues across closed tabs. Expiry submits automatically, counting unanswered/invalid selections incorrect. A mock backup retains the original start time, so restoring cannot imply a paused exam. Restore/reset affects only study data. Unreadable stored data is preserved and automatic overwrites blocked; storage failure is disclosed, and stale tabs do not overwrite newer data.

## Verification

`tests/revenue-study.cjs` checks content integrity and domain allocations; actual diagnostic answering and explanations; exact-set scoring; review/domain/mock modes; replacement confirmation; delayed mock feedback; answer/flag/reload persistence; deadline expiry; escaped notes; export/restore/cancel; invalid storage preservation; source filtering; browser history; and companion-state isolation.

`tests/revenue-mobile.cjs` checks plan, study index, representative expanded lessons, bridge, source library, practice setup, question, feedback, results and confirmation dialog at320/390/768/1280px. Checks include touch interactions, text spacing, reflow, landscape and axe WCAG2A/AA+2.1AA when `AXE_PATH` is supplied. Screenshots are written to `/tmp/revenue-study-shots/`. Verification uses Chromium automation, not physical Safari testing or an authenticated Salesforce org.

## Linked dictionary update

The original24-term bridge glossary has been replaced in the interface by a separate237-entry dictionary, with its own versioned data file, source mapping, aliases, links and accessible previews. The quiz content/bank version is unchanged. See [dictionary research and verification](DICTIONARY_RESEARCH.md) for source scope and release cautions.
