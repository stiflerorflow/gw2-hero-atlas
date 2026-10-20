# Revenue Cloud dictionary and linked definitions

Reviewed **20 October2026**. The dictionary contains **237 original entries across12 areas**, supplementing the28lessons and84question bank. It lives at `#dictionary`; permanent entry URLs use `#dictionary/<id>`.

The vocabulary covers platform/context, rules/configuration, catalog/selling models, pricing, transactions/contracts, fulfillment/orchestration, assets, usage/rating, billing/financial documents, metrics/reporting, implementation/integration, and legacy CPQ comparisons. Entries include names, acronyms and older branding (RLM/RCA), original concise definitions, practical distinctions, related terms, official reading and a linked lesson. Common object landmarks and API names are included where useful; this is not an exhaustive Salesforce object/field reference.

## Sources and freshness

Definitions are original study explanations, not copied official glossary entries. They use the existing reviewed official Trailhead units, migration references and developer documentation described in [RESEARCH.md](RESEARCH.md), plus a fresh review of Salesforce’s current glossary structure and indexed Help text:

- [Revenue Management glossary](https://help.salesforce.com/s/articleView?id=ind.revenue_impl_glossary.htm&language=en_US&type=5)
- [Product Catalog Management essentials](https://help.salesforce.com/s/articleView?id=product_catalog_management_essentials.htm&language=en_US&type=5)
- [Salesforce Pricing essentials](https://help.salesforce.com/s/articleView?id=ind.pricing_essentials.htm&language=en_US&type=5)
- [Rate Management essentials](https://help.salesforce.com/s/articleView?id=ind.rate_management_essentials.htm&language=en_US&type=5)
- [Product Configurator essentials](https://help.salesforce.com/s/articleView?id=ind.product_configurator_essentials.htm&language=en_US&type=5)
- [Transaction Management essentials](https://help.salesforce.com/s/articleView?id=ind.transaction_management_essentials.htm&language=en_US&type=5)
- [Dynamic Revenue Orchestrator essentials](https://help.salesforce.com/s/articleView?id=sf.dynamic_revenue_orchestration_essentials.htm&language=en_US&type=5)
- [Usage Management essentials](https://help.salesforce.com/s/articleView?id=ind.usage_management_essentials.htm&language=en_US&type=5)
- [Billing essentials](https://help.salesforce.com/s/articleView?id=ind.invoice_management_essentials.htm&language=en_US&type=5)
- [General revenue terms](https://help.salesforce.com/s/articleView?id=ind.general_terms.htm&language=en_US&type=5)

Salesforce Help bodies are available inconsistently through direct HTTP; the review used the research browser’s indexed content and previously reviewed specific learning units, not a claim that every page rendered directly. Each entry maps to its relevant source IDs. Standard metric and implementation definitions are labeled as general concepts rather than asserted to be unique native product objects. Native Revenue Management, legacy Salesforce CPQ, Industries CPQ and the Salesforce Billing managed package remain distinct.

Review date means a dated editorial/source review, not automatic live synchronization. Current product learning can be ahead of the official exam’s stated Summer’25 alignment. Release-sensitive entries (including constraints, variants, some fulfillment coordination and newer billing/rating concepts) explicitly say to check licensed-org/release availability. No exact universal licensing matrix or claim that every dictionary term is an exam objective is made.

## Interaction and quiz boundaries

- Search covers names, acronyms, aliases, definitions and contextual notes, with exact-name/alias results ranked first. Category and A–Z filters combine; results paginate24at a time. Clearing filters resets all three. Back from an entry retains the current in-tab search/filter state; reloading the index starts fresh.
- Inline terms use real dictionary hyperlinks and dotted-underlined markup. Hover or keyboard focus reveals a custom `role=tooltip` preview, with `aria-describedby` only on the active term. Escape dismisses it; pointer movement into the preview keeps it open. The preview stays within the viewport; touch activates the normal link to the full definition.
- Markup is applied only to study text, CPQ comparison prose and revealed answer explanations. It does not alter headings, existing links, source lists, user notes, code, question stems or answer choices. At most four distinct concepts are linked per annotated text block to keep prose readable.
- Quiz stems/options remain unannotated, including during a mock. Opening an inline definition and using browser Back restores the originating term’s reading position/focus. Visiting the dictionary preserves the attempt, checked-answer state, selections and original deadline; it does not pause a mock.
- Definitions are read-only reference content. No new storage is required. `content.js` and its question-bank version are unchanged, so existing attempts/history are not invalidated. New asset URLs are versioned; optional dictionary integration guards protect against mixed cached HTML/scripts.

## Maintenance

`dictionary-data.js` is the canonical editable data source, separate from quiz content. Keep IDs stable for permanent links. Validate lesson/source references and related IDs when adding an entry. Add aliases deliberately; ambiguous or excessively common words can disable `autoLink` and remain searchable. Current full descriptions, glossary distinctions and related links should be re-reviewed when product releases or exam objectives change; do not change the quiz bank version for dictionary-only edits.

`dictionary.js` implements search, pagination, scoped DOM text annotation and preview behavior. It creates text nodes/escaped markup rather than inserting search input or learner notes as HTML. The CSS uses the existing study-room design and disables active-nav color transitions to avoid a transient low-contrast state during view changes.

## Verification

`tests/revenue-dictionary.cjs` checks237unique definitions with valid source/lesson/related references, every permanent route, alias/API-name search, categories, A–Z, combined filters, pagination, no-result clearing, escaped search input, keyboard hover/Escape behavior, hover persistence, touch navigation, quiz-history preservation and no definition links in question content.

Expanded index, native and legacy entries, bridge, lesson and open previews are checked at320/390/768/1280px for reflow, text spacing, viewport bounds and automated WCAG2A/AA+2.1AA with `AXE_PATH`. The existing revenue-study scoring/persistence suite remains applicable. Verification is Chromium-based and does not claim physical Safari or authenticated Salesforce-org testing.
