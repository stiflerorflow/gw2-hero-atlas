/* Original instruction, objective map and retrieval practice. See PEDAGOGY_AUDIT.md. */
window.RC_LEARNING = {
  "checked": "21 October 2026",
  "lessons": {
    "platform-map": {
      "outcome": "Trace one sale through the native records and name the owner of each business fact.",
      "explain": "Treat the data model as a set of responsibilities, not a renamed CPQ package. Product2 describes what is sold; its selling-model options describe ways to sell it; PricebookEntry supplies commercial price context. Quote and QuoteLineItem describe an offer. Order and OrderItem describe the committed transaction. Asset lifecycle records describe what the customer has over time. Invoice records describe billed obligations. A Contract can hold legal terms and negotiated pricing without being the fulfillment engine. These are conceptual relationships: an implementation need not create every record at every stage.",
      "steps": [
        "Sketch Account → Quote → QuoteLineItem and Order → OrderItem; annotate product and price-book references rather than copying SBQQ fields.",
        "Add Asset, AssetAction and AssetStatePeriod; separate current installed state, change event and historical interval.",
        "Add billing schedules, invoice and payment as separate stages. Identify the system responsible for each transition and its failure handling."
      ],
      "worked": {
        "prompt": "Northstar buys 10 support seats for a year, then adds 4 seats in July. Where should an analyst look for the original offer, the committed change and the installed quantity in August?",
        "trace": [
          "Original offer: quote and its lines, with product, dates and pricing context.",
          "Committed change: amendment transaction and resulting order lines; do not overwrite the original offer as historical evidence.",
          "Installed position: asset lifecycle and the state period effective in August. An invoice is financial evidence, not an installed-seat counter."
        ]
      },
      "transfer": {
        "prompt": "An executive asks for booked revenue, active seats and collected cash in one chart. Explain why a single sum of quote-line amounts cannot answer all three.",
        "rubric": [
          "Define booked value from an agreed commercial event and time basis.",
          "Use effective asset state for seats and settled payment data for collected cash.",
          "Describe reconciliation keys and grain before combining datasets; do not promise one-to-one quote/order/asset/invoice cardinality."
        ]
      },
      "verify": "Produce a record-responsibility diagram with at least one identifier linking each relevant stage. Explain where history survives after an amendment.",
      "sources": [
        "product-identity",
        "data-model",
        "manage-orders",
        "get-started-with-billing-revenue-cloud"
      ],
      "reference": {
        "title": "Native record responsibility map",
        "columns": [
          "Record / relationship",
          "Key information",
          "Question it answers"
        ],
        "rows": [
          [
            "Product2 → selling-model options / price entries",
            "Product identity, available selling behavior and matching price-book context",
            "What is offered and on what commercial basis?"
          ],
          [
            "Quote → QuoteLineItem",
            "Account, line product/quantity, selling model, dates and pricing context",
            "What offer was proposed?"
          ],
          [
            "Order → OrderItem",
            "Committed line details and processing status",
            "What transaction must be executed?"
          ],
          [
            "Contract → negotiated pricing records where applicable",
            "Legal state and agreed commercial terms",
            "What agreement governs this transaction?"
          ],
          [
            "Asset → AssetAction / AssetStatePeriod",
            "Installed identity, change events and effective intervals",
            "What did the customer have on the requested date?"
          ],
          [
            "AssetActionSource → source transaction",
            "The lineage of an installed-base change",
            "Which transaction produced this lifecycle event?"
          ],
          [
            "Order product → billing schedule / schedule group",
            "Planned billable amounts and dates",
            "What is expected to be invoiced and when?"
          ],
          [
            "Invoice → invoice lines / applied credits and payments",
            "Billed obligation, adjustments and settlement",
            "What is owed, adjusted and paid?"
          ]
        ]
      }
    },
    "platform-context": {
      "outcome": "Diagnose a missing pricing input across definition, mapping, runtime data and persistence.",
      "explain": "Context Service provides a structured working view for business services. Metadata defines nodes, attributes, mappings and tags; a runtime instance contains values for one operation. Tags let consuming logic refer to a business input without hard-coding every source field. Hydration brings source data into that structure. Updating a runtime value is not proof that a Salesforce record was saved: persistence requires the appropriate mapping and operation. Extend a standard definition for additional requirements rather than trying to edit inherited standard components.",
      "steps": [
        "List the account, header and line inputs required by a decision; note each source field and context node.",
        "Inspect the definition and mapping used by the consuming procedure. Check exact tag names and whether the node has one or multiple instances.",
        "Hydrate a sample transaction, inspect the values, run the service, and verify intended persisted outputs independently."
      ],
      "worked": {
        "prompt": "Northstar has Region = EMEA on Account, but the discount decision receives no region.",
        "trace": [
          "Confirm the actual execution uses the intended context definition and has access to the source account.",
          "Trace Account.Region → mapped attribute → tag consumed by the decision. A field existing on Account alone proves none of these connections.",
          "Inspect the hydrated instance before changing the discount table. Then verify the decision output and any saved quote value separately."
        ]
      },
      "transfer": {
        "prompt": "The simulation works when Region is typed in, but the quote still prices incorrectly. Which boundary has the simulation not proved?",
        "rubric": [
          "Manual simulation proves behavior for supplied inputs, not live hydration.",
          "Check the real transaction mapping, user access, procedure selection and runtime values.",
          "Verify the saved result rather than assuming the transient context is persisted."
        ]
      },
      "verify": "Capture an input-to-tag-to-output trace and deliberately break one mapping. Record the observed missing input and the successful retest.",
      "sources": [
        "get-to-know-context-service",
        "explore-context-service-components-and-processes"
      ]
    },
    "platform-rules": {
      "outcome": "Choose reusable decisions, orchestration and guided UI without recreating a monolithic price rule.",
      "explain": "Separate what a decision means from when it runs and how a user supplies its inputs. A decision matrix returns configured outputs for a matching lookup. A decision table supports matching-record decision patterns; confirm the expected match cardinality instead of treating all lookups as interchangeable. An expression set sequences calculations and decisions. Flow can invoke services and control process actions. Omnistudio can support guided interaction and integration. Use each at the appropriate boundary: a screen component does not itself define a pricing policy.",
      "steps": [
        "Write the decision inputs, output, valid matches, no-match behavior and overlapping-match policy before building the rule.",
        "Keep reusable commercial logic in a callable decision/calculation service; use Flow or the appropriate orchestration to invoke it.",
        "Test one eligible, one ineligible and one ambiguous input. Capture the selected rule/version and output."
      ],
      "worked": {
        "prompt": "Three channels must apply the same region-and-tier eligibility policy; only the assisted-sales channel needs a guided screen.",
        "trace": [
          "Represent eligibility as reusable decision logic with a clear input/output contract.",
          "Have the guided flow collect or hydrate inputs and invoke that logic; API channels invoke the supported business service.",
          "Test identical inputs through each channel. Duplicating the policy in three UI flows creates divergence."
        ]
      },
      "transfer": {
        "prompt": "A screen flow performs a correct discount lookup, but an API quote bypasses it. What design change addresses the cause?",
        "rubric": [
          "Move or expose the shared business decision at a service boundary used by both paths.",
          "Keep UI-only guidance separate from transaction validity.",
          "Do not assume making a screen mandatory for sales reps protects every integration."
        ]
      },
      "verify": "Show the same policy evaluated outside the screen, with explicit no-match and multi-match expectations.",
      "sources": [
        "get-to-know-business-rules-engine",
        "build-decisions-with-lookup-tables",
        "orchestrate-rules-with-expression-sets",
        "automate-business-processes"
      ],
      "reference": {
        "title": "Select the tool by responsibility",
        "columns": [
          "Requirement",
          "Primary tool / pattern",
          "Do not confuse it with"
        ],
        "rows": [
          [
            "Lookup configured outputs for inputs",
            "Decision matrix, with verified matching behavior",
            "Orchestrating an entire user journey"
          ],
          [
            "Evaluate matching records / eligibility",
            "Decision table with the intended output cardinality",
            "Assuming one matching row in every case"
          ],
          [
            "Sequence calculations and decisions",
            "Expression set / appropriate business procedure",
            "A screen merely showing the final amount"
          ],
          [
            "Guide a process or invoke actions",
            "Flow at the appropriate transaction boundary",
            "A universal replacement for pricing/configuration services"
          ],
          [
            "Provide a guided interaction / integration experience",
            "Omnistudio where appropriate and supported",
            "The commercial policy itself"
          ],
          [
            "Expose catalog or transaction behavior to another channel",
            "Supported business APIs plus authentication and validation",
            "Direct record inserts proving every lifecycle side effect"
          ]
        ]
      }
    },
    "platform-access": {
      "outcome": "Configure the user experience and prove access and reporting under the real persona.",
      "explain": "A permission-set license permits assignment of relevant licensed capabilities; it does not replace object permissions, field permissions or record sharing. Feature availability also depends on org entitlements and enablement. Distinguish the identity viewing a Lightning page from the identity executing an action or integration. For reporting, define the business question, reporting grain, date basis and filters first. Context-aware reporting means meaningful customer/transaction context and navigation, not an assumption that a transient Context Service instance is a reportable Salesforce object.",
      "steps": [
        "Choose the relevant Lightning record page and standard revenue components/actions supported by the org; activate page assignments for the intended app and persona.",
        "Assign required entitlements and permissions using the current feature documentation. Test read, create and action execution as a non-admin, including denied cases.",
        "Build a report type and dashboard at the required grain; choose running-user or viewer semantics deliberately and verify record visibility."
      ],
      "worked": {
        "prompt": "Two quotes total 1000 and 2000. Each has three lines. A joined report sums the repeated quote amount to 9000.",
        "trace": [
          "The correct quote-level total is 3000. Joining to lines multiplied the header facts.",
          "Use a quote-grain report or a supported aggregation that counts each header once; simply hiding detail rows does not fix duplicated sums.",
          "For conversion, define the eligible quote cohort and the converted event; for aging, use unpaid balance and due date. These are distinct metrics."
        ]
      },
      "transfer": {
        "prompt": "A component is visible but its pricing action fails for sellers; admins succeed. Give an ordered investigation and a valid dashboard access test.",
        "rubric": [
          "Check feature entitlement, permission-set license and permission assignments, then object/field/record access and execution identity.",
          "Check page/action assignment and service errors after authorization is understood.",
          "Test the dashboard as the seller with known visible and hidden records; a successful admin view is insufficient."
        ]
      },
      "verify": "Provide a persona access matrix, activated page assignment and one reconciled report with a written grain, numerator, denominator and date definition.",
      "sources": [
        "licenses",
        "catalog-api",
        "data-model",
        "provide-post-sales-support",
        "navigate-the-full-billing-lifecycle"
      ],
      "reference": {
        "title": "Define a KPI before building its chart",
        "columns": [
          "Metric",
          "Suggested business definition",
          "Grain / date caveat"
        ],
        "rows": [
          [
            "Quote conversion",
            "Converted eligible quotes / eligible quotes in a defined cohort",
            "Count quotes once; state cohort and conversion-window rules"
          ],
          [
            "Booked value",
            "Accepted/committed value at the agreed business event",
            "Use the agreed order/booking grain, date and status"
          ],
          [
            "Active seats",
            "Installed quantity effective on a selected date",
            "Effective asset state, not all action deltas or today’s state for past dates"
          ],
          [
            "Recurring run rate",
            "Normalized recurring value under an agreed definition",
            "Do not infer this directly from invoice or payment totals"
          ],
          [
            "Invoice aging",
            "Open amount grouped by lateness relative to due date",
            "Use an as-of date and reconcile applied credits/payments"
          ],
          [
            "Collected cash",
            "Settled/applied cash under the agreed finance definition",
            "Payment date/status; exclude credits from cash totals"
          ]
        ]
      }
    },
    "readiness-org": {
      "outcome": "Create a readiness gate that proves one native transaction, not just app visibility.",
      "explain": "Start with a capability inventory: catalog, configuration, pricing, transactions, contracts, assets and billing can have different prerequisites. A CPQ sandbox is not automatically a native Revenue Management training org. Use the special org required by each official badge; sample data and feature setup can differ between badges. For production planning, record entitlement and feature dependencies against the current documentation and validate with the org owner. Do not assume a license name or a generic administrator permission grants the whole product-to-cash stack.",
      "steps": [
        "Record each capability, entitlement/feature prerequisite, permission-set license if required, persona permission, owning team and verification evidence.",
        "In the configurator training org, follow its full search-index rebuild, pricing-data sync and qualification/disqualification table refresh instructions; wait for the relevant completion status.",
        "Run one discover → configure → price → quote test as a seller, then separately validate downstream services required by scope."
      ],
      "worked": {
        "prompt": "The new org contains products, but search returns no items and the configurator has stale eligibility.",
        "trace": [
          "Check catalog availability, active dates, access and the search index rather than rebuilding the catalog blindly.",
          "Check qualification/disqualification decision data and the refresh required by the unit.",
          "Treat pricing-data sync as a separate readiness step; successful indexing does not prove pricing lookup readiness."
        ]
      },
      "transfer": {
        "prompt": "The project sponsor says “we already bought CPQ, start billing next week.” What evidence must be gathered before committing?",
        "rubric": [
          "Verify native product identity, contracted capabilities and billing-specific enablement.",
          "Identify org/environment, data, integration, persona and finance prerequisites.",
          "Demonstrate a scoped end-to-end slice and list remaining gates, owners and risks."
        ]
      },
      "verify": "Produce a dated readiness checklist with observed evidence. A design exercise can be complete without an org, but hands-on verification stays open until execution is demonstrated.",
      "sources": [
        "setup",
        "licenses",
        "manage-customer-asset-amendments",
        "explore-salesforce-pricing"
      ]
    },
    "readiness-discovery": {
      "outcome": "Turn discovery into scoped, testable product-to-cash decisions and accountable owners.",
      "explain": "CPQ experience helps you ask better commercial questions; it does not supply the customer’s native revenue policies. Discover offer structure, selling models, qualification, discount precedence, contract approval, fulfillment, installed-base changes and billing outcomes. Separate business policy ownership from technical implementation. A RACI is useful only if it resolves who makes a decision, who configures it and who accepts the result. A scope of work should name deliverables, exclusions, assumptions, dependencies, acceptance criteria and change control.",
      "steps": [
        "Interview sales, product, legal, operations, finance, security and integration owners. Capture policy conflicts using concrete examples.",
        "Define a thin vertical slice and acceptance criteria, then sequence dependencies in a project plan with milestones and named approvers.",
        "Maintain a risk/decision log; unresolved tax or renewal policy is a decision dependency, not a hidden developer assumption."
      ],
      "worked": {
        "prompt": "Sales promises instant activation; finance bills only after acceptance; legal requires signature first.",
        "trace": [
          "Document these as separate gates: legal execution, technical activation and invoice eligibility.",
          "Assign legal to signing policy, operations to fulfillment evidence and finance to billability. Agree how exceptional cases are handled.",
          "Write acceptance tests for signed/unaccepted, unsigned/ready and accepted/fulfilled cases before estimating automation."
        ]
      },
      "transfer": {
        "prompt": "The sponsor requests “everything in phase one.” Propose a scope that still proves business value.",
        "rubric": [
          "Name a product, customer segment, supported sale/change transaction and measurable outcome.",
          "Include required cross-product dependencies and explicit exclusions.",
          "Specify acceptance evidence and a change-control route; do not hide exclusions inside technical notes."
        ]
      },
      "verify": "Write a one-page scope, responsibility matrix and three decision records with an accountable business owner.",
      "sources": [
        "setup",
        "trail",
        "collaborate-with-salesforce-contracts"
      ]
    },
    "readiness-delivery": {
      "outcome": "Build a release plan that validates dependency deployment, business outcomes and adoption.",
      "explain": "A native revenue release combines metadata, business configuration and reference data. Not every setup record follows the same transport mechanism. Inventory each dependency and its supported deployment or data-load process; parameterize environment-specific identifiers. Component tests prove local behavior, while an end-to-end transaction proves interactions. UAT belongs to representative users and business acceptance criteria. Adoption needs training and operational support, including how staff recover failed fulfillment or incorrect billing.",
      "steps": [
        "Sequence shared definitions/data before consuming rules, flows and experiences. Verify target-org entitlements and permissions before testing.",
        "Test positive, negative, boundary-date, permission, integration-failure and replay cases. Include amendments and invoices, not only initial quoting.",
        "Define cutover reconciliation, rollback or forward recovery, pilot population, support ownership and adoption measures."
      ],
      "worked": {
        "prompt": "A pricing procedure deploys successfully, but production quotes have no list price.",
        "trace": [
          "Deployment success proves metadata transfer, not availability of matching price entries, context mappings, versions or synced lookup data.",
          "Compare known transaction inputs and environment-specific references with the working environment.",
          "Recover through the approved release process, reconcile affected transactions and retest the actual seller path."
        ]
      },
      "transfer": {
        "prompt": "What would make a 99% unit-test pass rate insufficient for go-live?",
        "rubric": [
          "Missing cross-service UAT, unauthorized persona access or incorrect business amounts/dates are material gaps.",
          "Prove critical end-to-end scenarios and operational recovery.",
          "Use adoption metrics such as successful supported transactions and error recovery time, not training attendance alone."
        ]
      },
      "verify": "Provide a deployment dependency list, signed UAT evidence, reconciliation totals and a named operational owner for each critical failure.",
      "sources": [
        "uat",
        "adoption",
        "manage-customer-asset-renewals-and-cancellations",
        "explore-order-orchestration"
      ]
    },
    "readiness-migration": {
      "outcome": "Decide what to migrate by future transaction behavior and reconciliation, not field-name similarity.",
      "explain": "Migrating managed-package CPQ to the native model is a redesign of commercial behavior and history. A subscription record is not a native asset history merely because product and quantity fields were copied. Separate product/reference configuration, open transactions, active installed base and archival history. Decide which historical records need to support amendments, renewals and finance reporting. Supported migration scope and tooling change: use the linked official guidance for the target release rather than promising an arbitrary direct load will create a valid lifecycle.",
      "steps": [
        "Inventory CPQ products, options, price rules, subscriptions and transaction history; map each to a native capability or an explicit retirement/archive decision.",
        "Choose a cutover date and a reconciliation baseline including quantities, dates, price agreements and outstanding financial balances.",
        "Pilot one customer with a mid-term change and renewal; validate subsequent native behavior before mass cutover."
      ],
      "worked": {
        "prompt": "A migrated account shows 20 seats correctly, but cannot generate a valid renewal.",
        "trace": [
          "The visible quantity proves only part of the migration. Inspect required lifecycle state, dates, relationships and supported transaction readiness.",
          "Compare the native renewal inputs against the intended contract end and commercial terms.",
          "Reconcile the customer’s installed base and financial history independently; do not manufacture history by editing balances."
        ]
      },
      "transfer": {
        "prompt": "Should five years of closed quotes be recreated as fully operational native transactions?",
        "rubric": [
          "Decide from regulatory, analytics and future servicing requirements rather than a blanket rule.",
          "Separate searchable archive needs from data required for supported native changes.",
          "Assess migration support, cost and reconciliation risk; prove the chosen scope in a pilot."
        ]
      },
      "verify": "Deliver a migration decision table and demonstrate a supported post-migration amendment or renewal with reconciled balances.",
      "sources": [
        "migration",
        "data-model",
        "differences"
      ]
    },
    "catalog-structure": {
      "outcome": "Build a discoverable catalog while keeping navigation and attribute reuse separate.",
      "explain": "A catalog groups an assortment for a selling context. Categories and their hierarchy organize discovery within that catalog. A classification groups common product characteristics for reuse; an attribute category organizes those characteristics in the configurator. None of these automatically guarantees customer eligibility. Qualification and disqualification govern which products apply to the transaction context. Distinguish “the product is modeled” from “this buyer can discover and buy it today.”",
      "steps": [
        "Create an assortment and category hierarchy that matches the selling journey. Assign the appropriate products rather than duplicating products for every navigation branch.",
        "Define reusable characteristics through classifications and attributes; group the attributes for a readable UI.",
        "Verify product availability, relevant context, qualification and indexing in the intended channel."
      ],
      "worked": {
        "prompt": "Northstar wants the same support offer under both “Software” and “Services,” with the same region and support-level attributes.",
        "trace": [
          "Model discovery placement through catalog/category associations as supported by the org.",
          "Reuse a classification and attribute definitions for the common characteristics.",
          "Keep region eligibility in qualification logic; a category label is not an access or eligibility rule."
        ]
      },
      "transfer": {
        "prompt": "The product is visible in the product list but not in seller discovery. Which checks distinguish modeling from runtime availability?",
        "rubric": [
          "Inspect catalog/category inclusion, product status and applicable dates.",
          "Check seller permissions and transaction qualification/disqualification inputs.",
          "Verify search index readiness rather than immediately creating a duplicate Product2."
        ]
      },
      "verify": "Show the same product in the intended discovery structure and explain why a category change does not redefine its shared attributes.",
      "sources": [
        "get-started-with-product-catalog-management",
        "create-product-categories-and-attributes"
      ]
    },
    "catalog-attributes": {
      "outcome": "Reuse attribute definitions and demonstrate when an attribute changes configuration versus price.",
      "explain": "Define the meaning and type of a characteristic once, then reuse it through classifications where appropriate. Picklist choices, defaults and required values affect configuration quality. A classification supplies a reusable structure, while the selected values belong to the configured product/transaction context. A price-impacting attribute also needs the pricing inputs and adjustment setup that interpret it; adding a visible field or checkbox alone cannot create a price change. Bundle-context overrides should be deliberate and should not accidentally change every standalone offer.",
      "steps": [
        "Create or reuse typed attribute definitions and any constrained value sets. Group them into attribute categories for presentation.",
        "Associate shared definitions with the classification, then verify inheritance and permitted product/component overrides.",
        "For a price-impacting choice, configure the matching adjustment and context mapping; test default, alternate and missing values."
      ],
      "worked": {
        "prompt": "“Priority support” should cost more than “Standard.” Both values appear in the configurator but the quote amount is unchanged.",
        "trace": [
          "First confirm the selected support value reaches the pricing context and is marked/configured as relevant to pricing.",
          "Inspect the adjustment schedule and the consuming procedure; configuration validity and price derivation are different responsibilities.",
          "Reprice and compare waterfalls for both values. Do not substitute a second product unless the business actually needs a distinct offering."
        ]
      },
      "transfer": {
        "prompt": "A component needs a different default from the standalone product. How do you avoid changing all offers?",
        "rubric": [
          "Use the supported component/bundle-context override rather than editing a shared default indiscriminately.",
          "Verify inherited versus overridden behavior in both contexts.",
          "Retest pricing and rules that consume the attribute; a UI-only check is insufficient."
        ]
      },
      "verify": "Capture two configurations using the same definition with different values and explain the exact setup responsible for any price difference.",
      "sources": [
        "work-with-product-classifications",
        "create-product-categories-and-attributes",
        "implement-attribute-based-pricing"
      ]
    },
    "catalog-bundles": {
      "outcome": "Configure component behavior and distinguish a sellable bundle from a fulfillment decomposition.",
      "explain": "A bundle’s commercial structure answers what the customer can choose and buy. Product groups organize components; relationship configuration controls required inclusion, default selection and whether quantity can change. These are independent choices: included by default is not necessarily mandatory. Static and configurable offers have different runtime choices. Technical products and decomposition answer how a committed sale is delivered, and should not be introduced merely to make option groups look tidy.",
      "steps": [
        "Create the parent and component products, define the bundle and groups, then add component relationships with explicit quantities and selection behavior.",
        "Define required/default/changeable properties and allowed selections. Add configuration rules for dependent choices.",
        "Preview valid and invalid selections, standalone versus bundle attributes, and the resulting priced lines."
      ],
      "worked": {
        "prompt": "A workstation includes one required base device and an optional support package that is preselected but removable.",
        "trace": [
          "Base device: require it, include by default and restrict quantity according to policy.",
          "Support: include by default but do not require it; verify the user can remove it.",
          "Neither setting by itself defines the technical provisioning tasks. Model those later if fulfillment requires decomposition."
        ]
      },
      "transfer": {
        "prompt": "A rep can remove a component that appears selected initially. Is this necessarily a bug?",
        "rubric": [
          "Default inclusion describes the starting state; required inclusion describes validity.",
          "Inspect component relationship properties and validation rules.",
          "Test save/reconfigure behavior, not only the first screen."
        ]
      },
      "verify": "Demonstrate a valid minimal bundle, a valid optional selection and an invalid required-component omission with an understandable message.",
      "sources": [
        "build-a-simple-product",
        "create-a-product-bundle",
        "discover-order-decomposition"
      ]
    },
    "catalog-selling": {
      "outcome": "Represent commercial duration independently of billing frequency.",
      "explain": "A product selling model describes whether an offer is one-time, term-defined or evergreen. A product selling model option connects a product to an available way of selling it; corresponding price entries support pricing that option. Pricing term and transaction duration need compatible units. Billing frequency and payment terms answer different questions. An annual commitment can be invoiced monthly; this does not make it twelve separate one-time products. Usage also needs a measured resource and consumption/rating setup beyond the choice of selling model.",
      "steps": [
        "Choose the selling model from commitment and termination behavior. Define the product’s available options and compatible price-book entries.",
        "Specify term units, relevant start/end dates and any subscription pricing/proration configuration.",
        "Design billing cadence and payment terms separately; validate their downstream schedule behavior."
      ],
      "worked": {
        "prompt": "Northstar commits for 12 months, pays monthly and has 30 days to settle each invoice.",
        "trace": [
          "Commitment: a term-defined commercial offer with a 12-month duration.",
          "Invoice cadence: monthly billing under the applicable billing configuration.",
          "Cash due: payment terms applied to invoices. Neither 30 days nor monthly invoicing replaces the commercial term."
        ]
      },
      "transfer": {
        "prompt": "The customer wants service to continue until canceled, with monthly invoices. What needs to change compared with a fixed annual commitment?",
        "rubric": [
          "Consider evergreen selling behavior rather than inferring a fixed end date from monthly billing.",
          "Verify supported cancellation and billing behavior for the chosen model.",
          "Keep the monthly invoice cadence as a separate configuration decision."
        ]
      },
      "verify": "Show a product’s selling-model option and matching price entry, and write independent statements for commitment, price basis, invoice cadence and due date.",
      "sources": [
        "build-a-simple-product",
        "selling-models",
        "set-up-and-sell-products"
      ]
    },
    "cpq-configure": {
      "outcome": "Connect the actual Flow definition, configuration-flow record and product assignment; then validate choices.",
      "explain": "The configurator combines data handling, UI components and configuration logic. In the official training path, clone the default configurator Flow as a new Flow, edit the relevant component properties and activate it. A Product Configuration Flow record identifies that Flow; a Product Configuration Flow Assignment links it to a product or classification. A beautiful screen is not enough: requirements, exclusions and validation must enforce allowed configurations. Newer constraint-rule features in current learning material need release/entitlement checks rather than being assumed to be the exam baseline.",
      "steps": [
        "Complete the training-org index/pricing/decision-table readiness steps. Clone and activate the default Flow with one intentional layout change.",
        "Create the active Product Configuration Flow record using the correct Flow identifier, then create the supported product/classification assignment.",
        "Preview the assigned product and test one requirement, one exclusion and one invalid combination through save/reconfigure."
      ],
      "worked": {
        "prompt": "The edited Flow shows two columns in Flow Builder, but sales reps still see the old product configurator.",
        "trace": [
          "Verify the saved Flow version is active, not merely edited.",
          "Verify the Product Configuration Flow identifier/status and the assignment to the actual product or classification.",
          "Check the runtime product and persona; editing an unrelated Flow does not change the assigned experience."
        ]
      },
      "transfer": {
        "prompt": "A selection is hidden by UI logic but an integration still submits it. What has not been proved?",
        "rubric": [
          "UI visibility is not universal transaction validation.",
          "Identify supported business/configuration validation for the API path.",
          "Test the invalid combination in each supported channel and inspect the returned failure."
        ]
      },
      "verify": "Record the Flow API name, active version, configuration-flow record and assignment, plus evidence of one rejected invalid configuration.",
      "sources": [
        "get-started-with-product-configurator",
        "create-and-configure-a-product-configurator-flow",
        "use-product-configurator-with-business-rules-engine",
        "explore-product-configurator-with-constraint-rules-engine"
      ]
    },
    "cpq-pricing": {
      "outcome": "Build and debug a procedure by tracing inputs, ordered elements and output mappings.",
      "explain": "A pricing procedure is an ordered calculation, not an unordered list of CPQ-style rules. Pricing Setting establishes common mappings; List Price looks up a compatible price entry using the product, price book and selling model. Later elements consume the current values. Adjustment data, lookup refresh/sync, active procedure/version selection and live context inputs all matter. Simulation is powerful because the waterfall exposes where a price first diverges from expectation, but manually supplied simulation inputs do not prove production hydration.",
      "steps": [
        "In the pricing training org, create the procedure against its specified context definition. Add Pricing Setting and List Price, map lookup inputs and price outputs.",
        "Add volume and manual adjustments in the intended order; configure the required adjustment data and refresh/sync using the unit instructions.",
        "Simulate eligible, ineligible and boundary quantities; activate/select the intended version as required and retest a real quote."
      ],
      "worked": {
        "prompt": "For this exercise, the procedure applies a 10% reduction to a unit list price of 240, then a fixed 12 reduction per unit. Quantity is 5, with no tax or proration.",
        "trace": [
          "List unit price 240 → percentage adjustment 24 → current unit price 216.",
          "Fixed reduction 12 → net unit price 204 → line total 1020.",
          "If the order is reversed: (240 − 12) × 0.9 = 205.20, total 1026. The order is a commercial policy decision, not a rounding defect."
        ]
      },
      "transfer": {
        "prompt": "Simulation returns 204 but a live quote returns 240. Give the first three categories of evidence to compare.",
        "rubric": [
          "Compare the actual selected procedure/version and execution path.",
          "Compare live context inputs and the matching adjustment/lookup data with the simulation.",
          "Inspect the first differing waterfall step and output persistence; do not add a duplicate discount blindly."
        ]
      },
      "verify": "Keep a before/after waterfall with all inputs, expected arithmetic and boundary tests immediately below/at/above each tier.",
      "sources": [
        "create-a-pricing-procedure-with-the-list-price-element",
        "configure-pricing-for-products",
        "add-volume-and-manual-discounts"
      ],
      "reference": {
        "title": "Exercise waterfall: quantity 5, no tax or proration",
        "columns": [
          "Stage",
          "Unit amount",
          "Line amount"
        ],
        "rows": [
          [
            "List",
            "240.00",
            "1200.00"
          ],
          [
            "10% reduction",
            "216.00",
            "1080.00"
          ],
          [
            "12 fixed reduction per unit",
            "204.00",
            "1020.00"
          ],
          [
            "Reversed order, for comparison",
            "205.20",
            "1026.00"
          ]
        ]
      }
    },
    "cpq-advanced": {
      "outcome": "Choose and combine advanced pricing mechanisms with explicit eligibility, precedence and time conventions.",
      "explain": "Use the driver of the price to select the mechanism. Attribute pricing consumes configured characteristics; bundle pricing consumes bundle context; volume pricing consumes quantities and tiers. Derived pricing needs both a way to discover the source product(s) and the relationship/formula for the dependent price. Contract-based pricing needs the appropriate account/contract context and negotiated price records, including tiers where required. Aggregate pricing summarizes supported line-level values; it is not a guarantee of arbitrary header rollups. Subscription pricing consumes the duration multiplier determined by the proration setup. Define stacking policy rather than assuming all discounts should compound.",
      "steps": [
        "Attribute/bundle: create the applicable adjustment data, map inputs and test the same product inside/outside the qualifying context.",
        "Derived: configure source discovery and derived-price records, add the corresponding pricing element and test no source, one source and multiple eligible sources.",
        "Contract: define Contract Item Price and any adjustment tiers, activate the eligible contract, refresh relevant decision data and configure the procedure to use contract context and conditional tiers.",
        "Subscription: map effective dates, term units and proration-policy inputs. Apply Proration before the subscription calculation and trace the multiplier into total price. Test partial periods and rounding explicitly."
      ],
      "worked": {
        "prompt": "Northstar’s device costs 800. Support is 15% of the eligible device amount. A customer contract can instead fix support at 100. A separate monthly subscription costs 60 per seat.",
        "trace": [
          "Derived support without a contract: discover the eligible device and apply 800 × 15% = 120. Changing the source amount to 600 changes support to 90 under this stated policy.",
          "With the eligible contract: this exercise uses the fixed 100 instead of the derived value. That precedence must be implemented and tested; the engine does not infer the business agreement.",
          "For the independent subscription, assume a stated 30-day convention, 10 chargeable days and 3 seats: multiplier 10/30; total 60 × 3 × 10/30 = 60. This arithmetic is a teaching convention, not a claim that every native policy uses 30-day months.",
          "A monthly list price with a 1.5-period multiplier differs from an annual price with the same numeric multiplier. Always identify what period the base price represents."
        ]
      },
      "transfer": {
        "prompt": "A bundle discount, negotiated contract rate and partial first month overlap. What must be decided before configuring elements?",
        "rubric": [
          "Define the source/base price and contract eligibility, including effective dates and selected context.",
          "State replacement versus stacking behavior and the sequence of supported adjustments.",
          "Define period/day-count and rounding conventions; compare full-period, partial-period and no-contract waterfalls.",
          "Validate supported aggregate/derived combinations in the current documentation rather than treating a rollup as universal."
        ]
      },
      "verify": "Complete the official derived, contract and subscription exercises separately, then produce a combined policy table with expected amounts for eligible, ineligible and boundary cases.",
      "sources": [
        "implement-attribute-based-pricing",
        "set-up-bundle-based-pricing",
        "explore-derived-pricing-and-discovery-procedures",
        "implement-derived-pricing",
        "set-up-subscription-pricing-with-proration",
        "apply-aggregate-pricing",
        "configure-contract-based-pricing"
      ],
      "reference": {
        "title": "Choose the mechanism from the price driver",
        "columns": [
          "Business driver",
          "Mechanism and setup inputs",
          "A boundary case to test"
        ],
        "rows": [
          [
            "Selected support level changes price",
            "Attribute adjustment: attribute value, price-impact configuration, mapped context and adjustment data",
            "Missing value; changing configuration and repricing"
          ],
          [
            "Quantity determines discount",
            "Volume tiers: adjustment schedule/tier data and consuming element",
            "Immediately below/at/above the threshold; tier basis"
          ],
          [
            "Price changes only inside a specific bundle",
            "Bundle adjustment: bundle/component context and applicable adjustment",
            "Same component sold standalone or in another bundle"
          ],
          [
            "Support is a percentage of eligible equipment",
            "Derived price: source discovery, derived-price relationship/formula and procedure",
            "No source; multiple sources; changing source amounts"
          ],
          [
            "A customer has negotiated rates",
            "Contract price: account/contract context, Contract Item Price and optional adjustment tiers",
            "Wrong/expired contract; no match; precedence with other adjustments"
          ],
          [
            "Partial recurring period",
            "Proration plus subscription pricing: effective dates, period units and policy/multiplier",
            "First/last partial period, month boundary and rounding"
          ],
          [
            "A supported line value must roll up",
            "Aggregate pricing with supported grouping and fields",
            "Do not assume every header or derived-line combination is supported"
          ],
          [
            "Measured consumption creates a charge",
            "Usage resource, entitlement/allowance, unit/rate and rating/billing setup",
            "Duplicate usage; late usage; mismatched measurement/rate units"
          ]
        ]
      }
    },
    "cpq-transact": {
      "outcome": "Generate an accurate quote through the human or agent path and verify persisted commercial facts.",
      "explain": "A quote must combine the correct customer, eligible products, quantities, configuration, selling model, dates, price context and approvals. A quoting agent is an additional interaction channel over configured capabilities; it cannot compensate for an incomplete catalog or missing pricing context. In the official project, follow its org, agent, topic/action and activation prerequisites. Evaluate which actions the execution identity can perform, what information a request must supply and where a human must confirm. Generated text is not proof of a saved, correctly priced quote.",
      "steps": [
        "Create a known-good quote manually with the intended account, price book/currency, product choices, dates and selling model. Save and verify pricing and validation results.",
        "Configure the agent using the linked project, with only the required topics/actions and permissions. Supply required inputs or clarify missing ones.",
        "Compare agent-created output with the manual baseline and test invalid quantities, unavailable products, unauthorized requests and incomplete customer context."
      ],
      "worked": {
        "prompt": "A customer asks an agent for “our usual renewal plus five seats,” but no asset or renewal dates have been identified.",
        "trace": [
          "Resolve the customer and relevant installed base, transaction type and effective dates before treating the request as executable.",
          "Do not create a new sale merely because it is easier than a supported renewal/amendment action.",
          "Verify resulting quote records, amounts, selected assets and any required approval/confirmation. A fluent response alone is insufficient."
        ]
      },
      "transfer": {
        "prompt": "A seller can create the quote but the agent cannot. Does giving the agent administrator access solve the right problem?",
        "rubric": [
          "Identify the action’s execution identity and required feature, object, field and record permissions.",
          "Check action/topic availability, activation and required inputs against the project.",
          "Grant only the necessary access and retest permitted and prohibited actions; do not bypass commercial validation."
        ]
      },
      "verify": "Retain a manual-versus-agent comparison of persisted quote fields and pricing, plus one safe refusal or clarification for an unsupported request.",
      "sources": [
        "work-with-quotes",
        "discover-and-configure-products",
        "agent"
      ]
    },
    "contracts-legal": {
      "outcome": "Configure a legal lifecycle separately from pricing, order execution and asset servicing.",
      "explain": "Salesforce Contracts supports contract creation, collaboration and lifecycle governance. Contract types and applicable state models determine which stages and transitions suit the agreement. Templates and approved clauses support consistent documents; versions preserve negotiated changes. Define who may author, approve, sign and activate, and which conditions gate transitions. Negotiated commercial pricing can be represented through native contract-pricing records, but signing the document alone does not execute every downstream fulfillment step. Verify available integrations for document generation or e-signature in the target org.",
      "steps": [
        "Identify contract types, required stages, permitted transitions and responsible personas for the customer’s legal process.",
        "Select the supported template/clause and document/version process. Configure approvals/signature integration according to the scoped capabilities.",
        "Test an unauthorized transition, a negotiated revision and the approved execution path; confirm the separately configured order handoff."
      ],
      "worked": {
        "prompt": "Legal requires a security clause for enterprise deals and approval before signature. Sales wants immediate provisioning after a quote is accepted.",
        "trace": [
          "Model enterprise legal requirements through the applicable contract type/template/clause process and lifecycle controls.",
          "Make approval/signature gates explicit; quote acceptance alone does not prove legal execution.",
          "Define a separate order/fulfillment gate that consumes the agreed contract status rather than assuming every accepted quote is ready."
        ]
      },
      "transfer": {
        "prompt": "The correct clause appears in version one but disappears after negotiation. What needs to be checked beyond the quote?",
        "rubric": [
          "Inspect contract document versions, template/clause selection and revision governance.",
          "Verify the approval/signature process applies to the final agreed version.",
          "Ensure downstream execution references the intended agreement/status."
        ]
      },
      "verify": "Produce a contract state-transition table with entry conditions, authorized actor, required evidence and rejected-transition behavior.",
      "sources": [
        "meet-salesforce-contracts",
        "dive-into-salesforce-contracts-capabilities",
        "collaborate-with-salesforce-contracts"
      ]
    },
    "contracts-decompose": {
      "outcome": "Map a commercial offer to technical fulfillment units only when execution requires it.",
      "explain": "Order decomposition translates what was sold into what must be delivered. A commercial bundle can map to technical products or work units according to configured rules and relationships. The customer-facing structure need not mirror each downstream system. Attribute mapping transfers the parameters needed by fulfillment. Decomposition is not the same as orchestration: one decides what work exists, the other sequences execution. A simple order can use orchestration without unnecessary technical decomposition.",
      "steps": [
        "Identify systems of fulfillment and the exact technical outputs each needs. Decide whether the commercial order already provides enough structure.",
        "For complex cases, define technical products, commercial-to-technical mappings and decomposition rules, including relevant attribute mappings.",
        "Preview/run decomposition and compare the generated work with a written expectation before adding orchestration dependencies."
      ],
      "worked": {
        "prompt": "A connectivity offer includes a router shipment and a network activation. A training service needs only one internal approval.",
        "trace": [
          "Connectivity may decompose into shipping and activation work with their required addresses/service parameters.",
          "The simple training order may orchestrate its approval directly if the supported model meets the need.",
          "Avoid creating technical products just to force every offer through the same architecture."
        ]
      },
      "transfer": {
        "prompt": "Two commercial lines intentionally share one technical service. What must be specified before implementing the mapping?",
        "rubric": [
          "Define the supported decomposition grouping/cardinality and identity of the shared service.",
          "Specify how attributes combine and what happens when one commercial line changes.",
          "Test generated quantities and later amendment/cancellation behavior; never assume one-to-one mapping."
        ]
      },
      "verify": "Provide a commercial-input → technical-output table with quantity, attributes, rule condition and expected output count for each case.",
      "sources": [
        "meet-dynamic-revenue-orchestrator",
        "discover-order-decomposition",
        "define-an-order-decomposition"
      ]
    },
    "contracts-orchestrate": {
      "outcome": "Build the workspace, step types, scope and dependencies needed for a reliable execution plan.",
      "explain": "A fulfillment workspace groups step definitions into functional lanes. Step type describes the work: an automated task can run a Flow, a callout integrates with another system, a manual task requires human action, a milestone marks progress and a pause waits as configured. Scope controls whether a step runs for the plan, bundle or individual line. Dependency edges enforce ordering; visual placement in a lane is not a substitute. Choose the execution identity and required access deliberately.",
      "steps": [
        "Create the supported fulfillment workspace and step groups. Select each step’s type, handler/integration or assignee.",
        "Set scope from how often the business action should occur, then define predecessor conditions across lanes.",
        "Associate the applicable plan/scenario, execute a sample order and verify counts, ordering, permissions and completion evidence."
      ],
      "worked": {
        "prompt": "An order contains three laptops, each needing provisioning, but the customer should receive only one consolidated completion email.",
        "trace": [
          "Use line-level scope for work that genuinely belongs to each applicable line; confirm quantity versus line semantics in the configured process.",
          "Use the appropriate once-per-plan scope for the consolidated notification.",
          "Make the notification depend on all required provisioning completion; a nearby email step on the diagram does not establish this gate."
        ]
      },
      "transfer": {
        "prompt": "The email runs three times and one activation starts before shipping. Which two independent configurations deserve inspection?",
        "rubric": [
          "Inspect notification scope and plan association for duplicated execution.",
          "Inspect explicit shipping→activation dependencies and their completion conditions.",
          "Test a multi-line order and actual event sequence; a one-line happy path hides both issues."
        ]
      },
      "verify": "Capture the workspace, step scopes, dependency graph and actual execution counts/order for at least two lines.",
      "sources": [
        "explore-order-orchestration",
        "design-a-simple-order-orchestration",
        "design-an-orchestration-plan",
        "define-dependencies-and-fulfillment-scenarios"
      ]
    },
    "contracts-recovery": {
      "outcome": "Separate delivery risk from failed execution and recover without duplicate external work.",
      "explain": "Jeopardy signals schedule risk; fallout concerns execution failure requiring resolution. Diagnose the failing step and its input/output evidence before retrying an entire order. An integration timeout is ambiguous: the remote system may have completed the request before the response was lost. Recovery needs correlation, reconciliation and replay-safe behavior. Idempotency is a solution-design requirement to confirm with the relevant API/integration; it is not a blanket promise that every retry is safe.",
      "steps": [
        "Define expected step durations and responsibility for monitoring delays versus execution failures.",
        "Capture transaction correlation identifiers, remote status and error details for callouts; separate transient errors from invalid business data.",
        "Before retry, reconcile remote effects, apply the supported recovery action and verify downstream work is released exactly as intended."
      ],
      "worked": {
        "prompt": "A payment/provisioning callout times out after the remote service accepts the request.",
        "trace": [
          "Do not infer that a timeout means nothing happened. Query/reconcile using the external correlation key.",
          "If remote work exists, follow the designed completion/reconciliation path; if it does not, retry according to the supported replay policy.",
          "Confirm that subsequent tasks and customer communications occur once. Replaying the whole order may duplicate successful work."
        ]
      },
      "transfer": {
        "prompt": "A task is still running but will miss its delivery target; another task has rejected invalid data. Should they receive the same recovery action?",
        "rubric": [
          "Classify the first as timing risk and investigate schedule/dependencies.",
          "Classify the second as execution failure; correct data or configuration before an appropriate retry.",
          "Assign ownership and verify completed outcomes; do not use blind retries as an operational policy."
        ]
      },
      "verify": "Demonstrate one delayed task and one failed integration with a recovery runbook showing evidence, owner, action and reconciliation.",
      "sources": [
        "explore-order-orchestration",
        "execute-an-orchestration-plan"
      ]
    },
    "assets-history": {
      "outcome": "Read current and historical installed state without summing events as balances.",
      "explain": "An Asset identifies what the customer owns or is entitled to. AssetAction records lifecycle changes; AssetActionSource provides transaction lineage; AssetStatePeriod represents effective state over an interval. Events and state answer different questions. A future-dated amendment can be recorded before it becomes effective, so “last modified” is not the correct date for every installed-base report. Verify actual generated fields in your org, including monetary measures, rather than assuming all state-period amounts are populated automatically.",
      "steps": [
        "Complete the official setup/activation path for managed assets. Identify the customer, asset, source transaction and effective periods.",
        "Place the actions and state intervals on a timeline and annotate start/end conventions.",
        "Reconcile selected historical dates against expected quantities and values, keeping recurring run rate distinct from billed and paid amounts."
      ],
      "worked": {
        "prompt": "An asset has 10 seats in January; an action adds 4 effective July 1; a later action removes 2 effective October 1.",
        "trace": [
          "Before July, expected state is 10. From July until the October change, expected state is 14. After that change, expected state is 12.",
          "The action deltas are +4 and −2, not three balances to sum. State periods preserve the relevant intervals.",
          "Check actual boundary semantics and generated records; avoid inventing overlapping end/start dates when implementing the report."
        ]
      },
      "transfer": {
        "prompt": "An August report shows 12 because it reads today’s asset quantity. Explain the error and the appropriate source of evidence.",
        "rubric": [
          "The report uses current state to answer a historical question.",
          "Select effective state for the requested date, with correct interval boundaries.",
          "Reconcile against action/source lineage and ensure future-dated changes are not applied early."
        ]
      },
      "verify": "Produce a three-date timeline showing action deltas, effective states and links back to the originating transaction.",
      "sources": [
        "provide-post-sales-support",
        "build-loyalty-through-post-sale-engagement"
      ],
      "reference": {
        "title": "A state timeline is not a sum of balances",
        "columns": [
          "Effective interval (conceptual)",
          "Change at interval start",
          "Expected installed quantity"
        ],
        "rows": [
          [
            "Before July 1",
            "Initial purchase",
            "10"
          ],
          [
            "July 1 until the October change",
            "Amendment +4",
            "14"
          ],
          [
            "After October 1",
            "Amendment −2",
            "12"
          ]
        ]
      }
    },
    "assets-amend": {
      "outcome": "Execute the delta-based amendment path and verify effective state after order processing.",
      "explain": "The official native amendment exercise distinguishes Start Quantity, Quantity as the change/delta, and End Quantity. This is an important CPQ transfer hazard: entering the desired total into a delta field overstates the outcome. The flow selects the asset and amendment date, produces the amendment quote, then creates and activates the order. Follow the org’s required processing/assetization steps and inspect the resulting lifecycle records. Saving the quote alone does not prove that the asset changed.",
      "steps": [
        "Select the managed asset and intended amendment effective date; generate the amendment quote using the supported action.",
        "Read Start Quantity, enter the required positive or negative delta, and verify End Quantity, dates and calculated price before ordering.",
        "Create/activate the amendment order and complete the required processing. Inspect asset actions/state periods and related billing effects."
      ],
      "worked": {
        "prompt": "Northstar has 10 seats and needs a total of 14 from July 1. The amendment screen uses Quantity as delta.",
        "trace": [
          "Start 10 + delta 4 = end 14. Entering 14 would request an increase to 24.",
          "A later reduction from 14 to 11 needs delta −3, subject to eligibility and effective-date validation.",
          "Verify service-period pricing and financial adjustments under the configured policy. The quantity arithmetic alone cannot determine the invoice or credit."
        ]
      },
      "transfer": {
        "prompt": "The saved quote has End Quantity 14, but the installed base still shows 10. What should be verified before manually editing the asset?",
        "rubric": [
          "Inspect order creation, activation and the required transaction/asset-processing status.",
          "Check the effective date and historical/current state being viewed.",
          "Investigate errors and source lineage; do not erase lifecycle consistency by changing the asset quantity directly."
        ]
      },
      "verify": "Capture start/delta/end quantities, effective date, processed order and resulting state. Include one negative-delta test where supported.",
      "sources": [
        "manage-customer-asset-amendments",
        "provide-post-sales-support"
      ]
    },
    "assets-renew": {
      "outcome": "Separate continuation into a new term from a mid-term amendment and preserve the timeline.",
      "explain": "Renewal extends the customer relationship into a subsequent service period. It is not just an end-date edit on a historical quote. Select the intended assets and renewal dates, verify offered quantities and commercial terms, then complete the supported quote/order processing. Agreed prices, current price entries and renewal policies can differ; do not assume the old amount always repeats or that a new contract price always overrides automatically. Term overrides need explicit validation against business policy and actual supported behavior.",
      "steps": [
        "Identify eligible assets and their ending periods. Define the next term and check boundary conventions to avoid unintended gaps/overlaps.",
        "Generate the renewal transaction, inspect quantities, selling model, price context and any authorized negotiated terms.",
        "Process the resulting order and inspect future effective state plus downstream billing schedules."
      ],
      "worked": {
        "prompt": "A 12-month service ends at the agreed year boundary. Northstar wants another year at 12 seats instead of the prior 10.",
        "trace": [
          "Create a renewal for the subsequent term with the intended quantity and price policy.",
          "Do not treat the new quantity as a mid-term delta unless the chosen UI explicitly uses that semantic.",
          "Verify that historical state remains intact and the new term is represented once; reconcile service continuity with the org’s date conventions."
        ]
      },
      "transfer": {
        "prompt": "The customer asks to add two seats today and also renew next year. Is one generic quantity change enough?",
        "rubric": [
          "Separate the in-term amendment date and delta from the subsequent renewal term and quantity.",
          "Evaluate supported sequencing and overlapping future changes.",
          "Verify both periods, commercial prices and resulting billing rather than assuming one action covers both intents."
        ]
      },
      "verify": "Show original and renewed term boundaries, quantity/price basis and a processed renewal order with no unintended overlap.",
      "sources": [
        "manage-customer-asset-renewals-and-cancellations",
        "configure-contract-based-pricing"
      ]
    },
    "assets-cancel": {
      "outcome": "Cancel service from the correct date and trace separate commercial, billing and cash consequences.",
      "explain": "Cancellation changes the effective entitlement and lifecycle; it does not erase the fact that service existed. Use the supported cancellation transaction and resulting order processing, preserving prior state and source lineage. Financial outcomes depend on prepaid versus arrears billing, unused periods, fees, existing invoices and policy. A credit memo reduces an invoiced obligation; a refund returns money. Neither should be inferred solely because an asset is canceled. A cancellation can also affect future schedules without implying that every historical invoice should disappear.",
      "steps": [
        "Confirm which asset/quantity is ending, the effective date and applicable cancellation terms.",
        "Generate/process the supported cancellation transaction and verify the ended or adjusted effective state.",
        "Inspect future schedules, already invoiced amounts, credit eligibility and payment/refund handling separately; reconcile the customer balance."
      ],
      "worked": {
        "prompt": "A customer paid 120 for a future service period, then becomes eligible under the stated policy for a 30 credit when canceling.",
        "trace": [
          "Asset state records the cancellation at the correct effective date, preserving prior service history.",
          "The credit reduces the relevant financial obligation according to policy and supported processing.",
          "If the invoice was already paid, returning 30 requires the separate authorized refund process; a credit record alone is not proof of cash movement."
        ]
      },
      "transfer": {
        "prompt": "A canceled asset no longer appears active, but the customer still owes money for service already delivered. Is that necessarily inconsistent?",
        "rubric": [
          "No: service state and accounts receivable are distinct facts.",
          "Reconcile cancellation date, delivered service, invoice/credit records and payments.",
          "Apply the contract and billing policy; do not zero the invoice merely to match the active-asset count."
        ]
      },
      "verify": "Provide a before/after timeline and a ledger-style reconciliation separating service, invoice, credit and refund evidence.",
      "sources": [
        "manage-customer-asset-renewals-and-cancellations",
        "navigate-the-full-billing-lifecycle"
      ]
    },
    "invoice-policy": {
      "outcome": "Choose the billing setup for eligibility, amount allocation, customer preferences and due dates.",
      "explain": "Assign each requirement to the correct layer. Billing policy addresses billability and relevant billing behavior; billing treatments and items describe invoicing treatment and allocations. Billing profiles capture the customer billing context such as bill-to and payment terms. Legal entities and tax configuration address the invoicing organization and applicable calculation rules. Pricing still owns the agreed commercial amount. Do not solve a timing requirement by distorting the product price or product selling model.",
      "steps": [
        "Write the price, billability, advance/arrears or milestone behavior and allocation requirements independently.",
        "Configure the applicable policy/treatment/items and customer profile using the current supported setup; establish legal/tax ownership.",
        "Preview resulting schedules/invoices and verify amounts, dates, billing entity, tax inputs and due-date logic."
      ],
      "worked": {
        "prompt": "A project is priced at 12000, with 25% due for invoicing at kickoff and 75% at acceptance. Each invoice has net-30 payment terms. Ignore tax for this exercise.",
        "trace": [
          "Commercial price remains 12000. Milestone allocations are 3000 and 9000, totaling 100%.",
          "Invoice eligibility follows the milestone evidence and configured treatment. Net-30 determines payment due relative to the invoice terms.",
          "An unpaid kickoff invoice is not a reason to reprice the project to 9000. Collections and later milestone eligibility are separate policies."
        ]
      },
      "transfer": {
        "prompt": "Finance asks to change invoices from net-30 to net-45 without changing the service commitment. Which concerns stay independent?",
        "rubric": [
          "Change the appropriate customer/invoice payment-term configuration under the supported process.",
          "Keep commercial price, subscription duration and invoice-allocation policy independent.",
          "Verify whether the change applies to future or existing invoices; do not assume retroactive recalculation."
        ]
      },
      "verify": "Show a requirement→configuration→expected result table with a reconciled allocation and the applicable legal/tax context.",
      "sources": [
        "explore-billing-features-and-roles",
        "generate-invoices"
      ],
      "reference": {
        "title": "Match each requirement to its owner",
        "columns": [
          "Requirement",
          "Configuration responsibility",
          "Independent concern"
        ],
        "rows": [
          [
            "Is this product billable?",
            "Applicable billing policy and eligibility",
            "The negotiated product price"
          ],
          [
            "When and how is the charge allocated?",
            "Billing treatment/items and supported schedule behavior",
            "The customer’s payment due terms"
          ],
          [
            "Who is billed and what payment preferences apply?",
            "Billing profile and relevant customer setup",
            "The product selling model"
          ],
          [
            "Which organization invoices?",
            "Legal entity and its applicable setup",
            "A display label on the quote"
          ],
          [
            "How is applicable tax calculated?",
            "Tax policy/treatment and configured tax process",
            "A manual product-price change"
          ],
          [
            "When must the customer pay?",
            "Applicable payment terms and invoice due-date logic",
            "When service starts or the invoice becomes eligible"
          ]
        ]
      }
    },
    "invoice-schedules": {
      "outcome": "Trace order products into planned billing and actual invoice creation, including cutoffs and exclusions.",
      "explain": "A billing schedule represents planned invoiceable amounts and dates; a schedule group organizes related billing work. An invoice is a generated financial document. In the standard learning flow, relevant order products drive billing schedules, then eligible schedule amounts feed invoice generation. Preview is a validation opportunity, not evidence of posted invoicing or collected money. Advance versus arrears changes when service is billed; service dates, invoice dates and payment due dates should be tracked separately.",
      "steps": [
        "Trace an eligible order product to its generated schedule/group and inspect amounts, service period, next billing date and relevant status.",
        "Preview an invoice run with a clear cutoff/filter scope; compare expected eligible and excluded schedule items.",
        "Generate using the supported process, inspect the resulting invoice/lines and verify later runs do not unintentionally duplicate billed amounts."
      ],
      "worked": {
        "prompt": "Two schedule items are 100 for June and 100 for July. The run should invoice only June. Ignore tax and prior balances.",
        "trace": [
          "Eligible June amount is 100; July should remain scheduled for a later run according to the defined cutoff.",
          "A preview showing 200 suggests a filter/date/configuration issue to resolve before generating.",
          "After generation, inspect invoice and schedule state. An invoice total of 100 does not prove payment occurred."
        ]
      },
      "transfer": {
        "prompt": "The customer wants quarterly invoices for a one-year commitment. Should the product be turned into a three-month service?",
        "rubric": [
          "No: term and cadence are separate commercial/billing requirements.",
          "Use the supported billing schedule/cadence configuration while preserving the intended service term.",
          "Test first/last and partial periods, plus the invoice run’s selection criteria."
        ]
      },
      "verify": "Retain order-to-schedule-to-invoice lineage and a preview containing one eligible item and one deliberately excluded item.",
      "sources": [
        "get-started-with-billing-revenue-cloud",
        "generate-invoices",
        "explore-billing-features-and-roles"
      ]
    },
    "invoice-usage": {
      "outcome": "Explain measured consumption, entitlement, rating and billing without conflating units or replaying usage.",
      "explain": "Usage starts with a measurable resource and unit of measure. Product setup connects the commercial offer to entitlements/grants, rates and any wallet/consumption arrangement. Usage records must identify the correct customer/service, time and resource; summaries aggregate according to the configured process. Rating derives the commercial liability using applicable rates and eligibility. Billing then invoices eligible amounts. A wallet or allowance is not automatically a bank balance, and consumption is not revenue recognition.",
      "steps": [
        "Define the resource, unit, customer/asset identity, entitlement period and rate policy, including overage and late-arrival handling.",
        "Validate/deduplicate ingested usage using the designed identifiers; inspect summaries and applicable grants/wallets.",
        "Trace rated amounts to billing and reconcile adjustments, duplicates and period cutoffs."
      ],
      "worked": {
        "prompt": "Northstar has an allowance of 1000 API calls for the period, consumes 1250, and pays 0.02 per excess call. Assume all calls qualify for the allowance and there are no other charges.",
        "trace": [
          "Measured usage: 1250 calls. Included usage: 1000. Chargeable overage: 250 calls.",
          "Exercise liability: 250 × 0.02 = 5. The measured unit must agree with the rate unit.",
          "Replaying the same usage batch must not make consumption 2500. Reconcile identifiers and the supported ingestion/reprocessing behavior."
        ]
      },
      "transfer": {
        "prompt": "A customer is charged 1000 times too much after sending kilobytes into a megabyte-based rate. Where is the conceptual failure?",
        "rubric": [
          "Resource/unit mapping is wrong before the arithmetic is evaluated.",
          "Validate ingestion, conversion, summary and rating units; inspect whether allowance and rate use the same measure.",
          "Correct and reconcile through supported adjustment/reprocessing, preventing duplicate liability."
        ]
      },
      "verify": "Produce a usage→allowance→rated amount→invoice reconciliation with explicit units, period boundaries and one duplicate/late-usage test.",
      "sources": [
        "get-to-know-usage-management",
        "set-up-and-sell-products",
        "manage-wallets-and-track-consumption"
      ]
    },
    "invoice-finance": {
      "outcome": "Reconcile an obligation, credit, payment and refund with separate records and responsibilities.",
      "explain": "An invoice establishes an amount owed. A credit memo adjusts that obligation; a payment settles it; a refund returns previously received funds. Collections and write-offs address outstanding balances under separate policies. Invoice creation or payment collection alone does not establish all revenue-recognition outcomes. Financial accounting capabilities, legal-entity setup and external-ledger integrations require their own scope and entitlement checks. For exam scenarios, identify the business event first instead of choosing every finance object that sounds related.",
      "steps": [
        "List invoice charges, applied credits, applied payments and resulting open balance; specify currency and date basis.",
        "For overpayments or cancellation after payment, distinguish credit allocation from refund authorization and cash movement.",
        "Reconcile with finance using supported records and statuses, including failures and unapplied balances."
      ],
      "worked": {
        "prompt": "An invoice is 500. A valid credit of 80 and an applied payment of 300 exist. Ignore tax, prior balances and currency conversion.",
        "trace": [
          "Adjusted obligation: 500 − 80 = 420. Open receivable: 420 − 300 = 120.",
          "The credit did not collect cash; the payment did not change the original commercial price.",
          "If a later refund is authorized, inspect its separate effect on cash and settlement. Do not call the outstanding 120 “recognized revenue.”"
        ]
      },
      "transfer": {
        "prompt": "A fully paid invoice is reduced by a valid credit. Does the customer automatically receive money back?",
        "rubric": [
          "A credit and a refund are different events; inspect allocation and applicable policy.",
          "Use the authorized supported refund process for cash return when appropriate.",
          "Reconcile invoice, credit, payment and refund statuses rather than inferring from the canceled asset alone."
        ]
      },
      "verify": "Prepare a reconciled customer balance and explain which records demonstrate commercial adjustment, settlement and cash return.",
      "sources": [
        "navigate-the-full-billing-lifecycle",
        "explore-billing-features-and-roles"
      ],
      "reference": {
        "title": "Separate the business events",
        "columns": [
          "Event",
          "Business effect",
          "Evidence to inspect"
        ],
        "rows": [
          [
            "Price / order agreement",
            "Defines the commercial charge",
            "Priced transaction and accepted terms"
          ],
          [
            "Invoice",
            "Establishes a billed obligation",
            "Invoice/lines and relevant status"
          ],
          [
            "Applied credit",
            "Reduces the applicable obligation",
            "Credit memo and allocation/application"
          ],
          [
            "Applied payment",
            "Settles the applicable balance with funds",
            "Payment and its application/status"
          ],
          [
            "Refund",
            "Returns funds through the authorized process",
            "Refund and payment/gateway reconciliation"
          ],
          [
            "Recognition / accounting",
            "Follows the relevant accounting policy and scoped capability",
            "Accounting setup and ledger evidence, not invoice status alone"
          ]
        ]
      }
    }
  },
  "objectives": [
    {
      "id": "platform-foundations",
      "domain": "platform",
      "title": "Configure Flow, Lightning components and layered user access.",
      "lessons": [
        "platform-access",
        "cpq-configure",
        "readiness-org"
      ],
      "evidence": "An activated page/Flow assignment and a non-admin allowed/denied test."
    },
    {
      "id": "platform-services",
      "domain": "platform",
      "title": "Explain Context Service, Omnistudio, BRE and business APIs.",
      "lessons": [
        "platform-context",
        "platform-rules",
        "platform-access"
      ],
      "evidence": "A mapped input-to-decision trace and a justified UI/service boundary."
    },
    {
      "id": "platform-reporting",
      "domain": "platform",
      "title": "Design contextual dashboards and meaningful KPIs using native reporting.",
      "lessons": [
        "platform-access"
      ],
      "evidence": "A report with correct grain, date basis, visibility and reconciled totals."
    },
    {
      "id": "platform-model",
      "domain": "platform",
      "title": "Describe core fields, objects and relationships.",
      "lessons": [
        "platform-map",
        "assets-history",
        "invoice-schedules"
      ],
      "evidence": "A record-responsibility diagram and source lineage through a transaction."
    },
    {
      "id": "readiness-prerequisites",
      "domain": "readiness",
      "title": "Plan licenses, permissions and feature prerequisites.",
      "lessons": [
        "readiness-org",
        "platform-access"
      ],
      "evidence": "A dated capability matrix and a successful thin transaction as the real persona."
    },
    {
      "id": "readiness-owners",
      "domain": "readiness",
      "title": "Assign cross-product stakeholder responsibilities.",
      "lessons": [
        "readiness-discovery"
      ],
      "evidence": "Named business decision owners, implementers and acceptance approvers."
    },
    {
      "id": "readiness-scope",
      "domain": "readiness",
      "title": "Develop scope and a dependency-aware project plan.",
      "lessons": [
        "readiness-discovery",
        "readiness-migration"
      ],
      "evidence": "Deliverables, exclusions, assumptions, milestones, risks and acceptance criteria."
    },
    {
      "id": "readiness-delivery",
      "domain": "readiness",
      "title": "Drive build, test, deployment and adoption.",
      "lessons": [
        "readiness-delivery"
      ],
      "evidence": "Dependency deployment, end-to-end UAT, recovery and adoption evidence."
    },
    {
      "id": "catalog-concepts",
      "domain": "catalog",
      "title": "Explain the catalog model and capabilities.",
      "lessons": [
        "catalog-structure",
        "catalog-attributes",
        "catalog-selling"
      ],
      "evidence": "Correct distinction between navigation, shared attributes and selling models."
    },
    {
      "id": "catalog-implementation",
      "domain": "catalog",
      "title": "Implement an appropriate out-of-the-box catalog solution.",
      "lessons": [
        "catalog-bundles",
        "catalog-attributes",
        "catalog-structure",
        "catalog-selling"
      ],
      "evidence": "A discoverable, correctly constrained bundle with compatible price entries."
    },
    {
      "id": "cpq-configuration",
      "domain": "cpq",
      "title": "Configure components/attributes and validate product choices.",
      "lessons": [
        "cpq-configure",
        "catalog-bundles"
      ],
      "evidence": "An assigned active configurator and rejected invalid combination."
    },
    {
      "id": "cpq-pricing",
      "domain": "cpq",
      "title": "Configure and apply pricing procedures to business requirements.",
      "lessons": [
        "cpq-pricing",
        "cpq-advanced"
      ],
      "evidence": "A simulated and live waterfall including boundaries, precedence and proration."
    },
    {
      "id": "cpq-quote",
      "domain": "cpq",
      "title": "Generate an accurately priced quote, including an Agentforce scenario.",
      "lessons": [
        "cpq-transact",
        "cpq-pricing"
      ],
      "evidence": "Persisted quote evidence plus manual/agent parity and unauthorized-request checks."
    },
    {
      "id": "contracts-implementation",
      "domain": "contracts",
      "title": "Configure Salesforce Contracts for a business scenario.",
      "lessons": [
        "contracts-legal"
      ],
      "evidence": "A type/state/template/approval design with a rejected unauthorized transition."
    },
    {
      "id": "orders-implementation",
      "domain": "contracts",
      "title": "Configure order management for a business scenario.",
      "lessons": [
        "contracts-decompose",
        "contracts-orchestrate",
        "contracts-recovery"
      ],
      "evidence": "Expected decomposition, scoped dependent execution and replay-safe recovery evidence."
    },
    {
      "id": "assets-concepts",
      "domain": "assets",
      "title": "Explain asset-management capabilities and effective history.",
      "lessons": [
        "assets-history",
        "assets-amend",
        "assets-renew",
        "assets-cancel"
      ],
      "evidence": "A timeline distinguishing events, state periods and source transactions."
    },
    {
      "id": "assets-implementation",
      "domain": "assets",
      "title": "Implement an appropriate out-of-the-box asset lifecycle solution.",
      "lessons": [
        "assets-amend",
        "assets-renew",
        "assets-cancel"
      ],
      "evidence": "Processed change transactions with verified dates, quantities and billing consequences."
    },
    {
      "id": "invoices-concepts",
      "domain": "invoices",
      "title": "Explain invoice-management concepts and capabilities.",
      "lessons": [
        "invoice-policy",
        "invoice-schedules",
        "invoice-usage",
        "invoice-finance"
      ],
      "evidence": "A correct distinction between pricing, schedules, invoices, credits and cash."
    },
    {
      "id": "invoices-implementation",
      "domain": "invoices",
      "title": "Implement an appropriate out-of-the-box invoice solution.",
      "lessons": [
        "invoice-policy",
        "invoice-schedules",
        "invoice-finance",
        "invoice-usage"
      ],
      "evidence": "A reconciled schedule/invoice run with exclusions, allocations and customer context."
    }
  ]
};
