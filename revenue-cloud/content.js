/* Original study material. Official references and review scope: RESEARCH.md. */
window.RC_CONTENT = {
  "version": "2026-10-20.1",
  "checked": "21 October 2026",
  "exam": {
    "title": "Revenue Management Consultant",
    "aliases": [
      "Revenue Cloud Consultant",
      "Agentforce Revenue Management Consultant"
    ],
    "release": "Summer ’25 (as stated in the official guide checked 21 October 2026)",
    "questions": 60,
    "unscored": "Up to 5 additional unscored questions",
    "minutes": 105,
    "pass": 63,
    "prerequisite": "None stated; CPQ certification is useful background, not a prerequisite"
  },
  "domains": [
    {
      "id": "platform",
      "title": "Platform concepts",
      "weight": 18,
      "summary": "Service boundaries, context, rules, data and access.",
      "objective": "Connect platform services, data relationships, access and operational reporting."
    },
    {
      "id": "readiness",
      "title": "Implementation readiness",
      "weight": 14,
      "summary": "Readiness, ownership, delivery and adoption.",
      "objective": "Plan prerequisites, ownership, scope, delivery and adoption."
    },
    {
      "id": "catalog",
      "title": "Catalog management",
      "weight": 16,
      "summary": "Categories, attributes, classifications and selling models.",
      "objective": "Design and configure a maintainable product catalog."
    },
    {
      "id": "cpq",
      "title": "Configure, price, quote",
      "weight": 18,
      "summary": "Configuration engines, pricing procedures and valid quotes.",
      "objective": "Configure products, pricing and quotes, including Agentforce-assisted scenarios."
    },
    {
      "id": "contracts",
      "title": "Contracts and orders",
      "weight": 11,
      "summary": "Legal lifecycle, decomposition and fulfillment.",
      "objective": "Select contract and order capabilities for a business scenario."
    },
    {
      "id": "assets",
      "title": "Asset management",
      "weight": 16,
      "summary": "Effective-dated amendments, renewals and cancellations.",
      "objective": "Design post-sale changes using the asset lifecycle."
    },
    {
      "id": "invoices",
      "title": "Invoice management",
      "weight": 7,
      "summary": "Billing setup, schedules, usage and financial handoffs.",
      "objective": "Choose appropriate invoice-management capabilities."
    }
  ],
  "lessons": [
    {
      "id": "platform-map",
      "domain": "platform",
      "title": "Start with the product-to-cash map",
      "minutes": 12,
      "bridge": "Keep your commercial-process knowledge. Replace the assumption that the SBQQ package is the architecture for every revenue capability.",
      "concepts": [
        {
          "title": "Identify the product first",
          "body": "Revenue Cloud has been used for several offerings. Here it means the native platform now called Revenue Management or Agentforce Revenue Management. Salesforce CPQ (SBQQ) and Industries CPQ are separate products. Inspect an org and its entitlements before applying configuration advice."
        },
        {
          "title": "Place each responsibility",
          "body": "Catalog defines what can be sold. Configuration validates selections. Pricing calculates commercial amounts. Transaction Management handles the transaction journey. Contracts manages legal agreements; orchestration coordinates fulfillment; assets support post-sale changes; Billing produces financial documents."
        },
        {
          "title": "Trace data, not just screens",
          "body": "Use Account, Product2, Quote/QuoteLineItem and Order/OrderItem as starting landmarks. Follow the relevant relationships into catalog, pricing, assets and billing. A familiar standard object does not make the legacy package rules or fields compatible."
        }
      ],
      "scenario": "A manufacturer sells a device, a yearly service and measured usage through sales and an external portal. The team proposes duplicating the CPQ calculator in the portal.",
      "decision": "Identify shared native configuration and pricing services and their business APIs. Agree ownership of each downstream lifecycle stage before selecting UI technology.",
      "lab": [
        "Draw one sale from product selection through invoice.",
        "Label the owner and source of truth at every handoff.",
        "Identify one failure that a correct quote would not prevent."
      ],
      "proof": "A diagram that distinguishes price calculation, fulfillment, asset state and collection; no SBQQ object is silently treated as a native equivalent.",
      "traps": [
        "A valid quote does not prove an order was fulfilled.",
        "Revenue Management is not a renamed CPQ managed package."
      ],
      "recall": "Where do quoting, legal agreement, delivery and payment have different responsibilities?",
      "sources": [
        "product-identity",
        "data-model",
        "manage-orders",
        "get-started-with-billing-revenue-cloud",
        "native-transaction-objects"
      ]
    },
    {
      "id": "platform-context",
      "domain": "platform",
      "title": "Context Service: structure, mappings and runtime data",
      "minutes": 12,
      "bridge": "In CPQ you may reach directly for a quote-line field. In native services, first establish how the business value reaches the consuming context.",
      "concepts": [
        {
          "title": "Separate the design from the instance",
          "body": "A context definition describes nodes, attributes and their relationships. A mapping connects that logical structure to source records and fields. Tags give consumers stable names for context values. None of these is the same as a populated runtime instance."
        },
        {
          "title": "Follow the data lifecycle",
          "body": "A process builds or hydrates an in-memory context, reads or updates its values, and can persist changes using the configured mapping. An updated transient value is not proof that the database was updated."
        },
        {
          "title": "Debug the boundary",
          "body": "When pricing cannot see a customer segment, verify the source value, mapping, tag and runtime data before modifying discount logic. Also verify that the service and calling identity can use the intended data."
        }
      ],
      "scenario": "An account has a valid segment, but pricing receives no segment and returns the default price.",
      "decision": "Check the mapping and hydrated/tagged input first. Rewriting the pricing formula cannot fix a missing input.",
      "lab": [
        "In the Context Service unit’s supported org, inspect a definition and its mappings.",
        "Trace one Account value into a tagged attribute.",
        "Explain which operation would persist an updated value."
      ],
      "proof": "A source-field → mapping → attribute/tag → runtime-consumer trace with persistence explicitly identified.",
      "traps": [
        "A context definition is metadata, not a quote.",
        "Hydrating data does not by itself write a business transaction."
      ],
      "recall": "How would you distinguish an input-mapping failure from a pricing-rule failure?",
      "sources": [
        "get-to-know-context-service",
        "explore-context-service-components-and-processes",
        "context-create",
        "context-flow",
        "context-bre"
      ]
    },
    {
      "id": "platform-rules",
      "domain": "platform",
      "title": "Choose Flow, Omnistudio and Business Rules Engine",
      "minutes": 12,
      "bridge": "Do not translate every CPQ price rule into Flow. Distinguish process coordination, guided interaction and a reusable decision.",
      "concepts": [
        {
          "title": "Flow and guided interaction",
          "body": "Flow coordinates platform processes; screen flows and Omnistudio can provide guided user experiences. The interaction should call the right service rather than duplicate its pricing or configuration logic."
        },
        {
          "title": "Understand BRE tools",
          "body": "Expression sets execute ordered decision and calculation steps. A decision matrix returns outputs from a matching row. Decision tables support multiple matching outcomes. Choose the tool based on the decision’s shape, not the number of existing custom fields."
        },
        {
          "title": "Make decisions explainable",
          "body": "Identify inputs, outputs, versions and consuming processes. Use supported explainability capabilities where applicable; a user-facing explanation and a reproducible test make decisions maintainable."
        }
      ],
      "scenario": "Pricing and an onboarding flow both need the same eligibility decision. Two teams propose maintaining separate conditional trees.",
      "decision": "Model a reusable decision with clear inputs and outputs; invoke it from the relevant processes. Confirm that the supported rule tool and data access fit the scenario.",
      "lab": [
        "In the BRE unit’s special org, inspect a lookup and expression set.",
        "Predict the result for a match, a boundary and no match.",
        "Describe how a guided flow consumes the result."
      ],
      "proof": "A decision table/matrix versus expression-set choice you can justify, with expected outputs for three test inputs.",
      "traps": [
        "BRE is not a new name for SBQQ price rules.",
        "Do not assume an ordinary Trailhead Playground contains the required services."
      ],
      "recall": "What is the difference between coordinating a process and evaluating its reusable business decision?",
      "sources": [
        "get-to-know-business-rules-engine",
        "build-decisions-with-lookup-tables",
        "orchestrate-rules-with-expression-sets",
        "automate-business-processes",
        "context-bre"
      ]
    },
    {
      "id": "platform-access",
      "domain": "platform",
      "title": "Access, APIs and useful revenue reporting",
      "minutes": 12,
      "bridge": "Your admin expertise transfers. The new work is identifying the exact licensed service, native objects and execution identity.",
      "concepts": [
        {
          "title": "Layer the access checks",
          "body": "Check org entitlement and feature enablement, permission-set licenses where required, assigned permissions, object/field access and record access. A visible app or administrator profile is not evidence that every revenue capability is licensed."
        },
        {
          "title": "Use business APIs deliberately",
          "body": "Catalog discovery, configuration and pricing have business semantics beyond writing records. Select supported services for an external channel. Define authentication, errors, limits and reconciliation rather than treating a direct insert as a complete transaction."
        },
        {
          "title": "Define reporting grain",
          "body": "Specify whether a KPI is per quote, line, order, asset period or invoice. Join carefully: multiple lines can duplicate a header amount. Distinguish booked value, recurring run rate, billed amount and collected cash before designing a dashboard."
        }
      ],
      "scenario": "A dashboard triples booked revenue after a report joins each quote to three lines, while portal users get access errors.",
      "decision": "Fix the reporting grain and aggregation separately from access troubleshooting. Test the portal’s actual execution identity and required services.",
      "lab": [
        "Sketch a quote conversion and invoice-aging dashboard with one grain per metric.",
        "Write an access checklist for a sales persona and a billing persona.",
        "Locate catalog discovery resources in the official developer reference."
      ],
      "proof": "Metric definitions with numerator, denominator, dates and record grain; an access matrix tested using a non-admin persona.",
      "traps": [
        "An API-first design still needs authorization and business validation.",
        "MRR is not an invoice total or a payment."
      ],
      "recall": "Which access layer and which record grain would you inspect first in these two failures?",
      "sources": [
        "licenses",
        "catalog-api",
        "data-model",
        "provide-post-sales-support",
        "navigate-the-full-billing-lifecycle"
      ]
    },
    {
      "id": "readiness-org",
      "domain": "readiness",
      "title": "Prepare an org that can run the exercises",
      "minutes": 12,
      "bridge": "A CPQ certificate and an SBQQ sandbox do not provision native Revenue Management.",
      "concepts": [
        {
          "title": "Check capability availability",
          "body": "Confirm the edition, contracted licenses, feature prerequisites and intended personas before solution design. Feature bundles and labels change; use the linked availability reference rather than assuming every license includes Billing, orchestration or Agentforce."
        },
        {
          "title": "Use the right training org",
          "body": "Several official badges require a special Developer Edition or generated playground with sample data. Follow that badge’s signup instructions. An org prepared for one badge may not support another."
        },
        {
          "title": "Prove readiness with a thin slice",
          "body": "Verify the catalog, pricing setup/synchronization, permissions and one sample transaction before expanding. Record required activation and deployment tasks so a working developer org is reproducible elsewhere."
        }
      ],
      "scenario": "A team loses a week trying to reproduce a billing lab inside its legacy CPQ sandbox.",
      "decision": "Validate entitlement and the exercise’s supported org first. Missing features are a readiness issue, not a reason to recreate the billing service in Apex.",
      "lab": [
        "Open a linked badge and identify its exact org requirement.",
        "Create a prerequisite checklist with evidence and an owner.",
        "Test the smallest supported quote/order example using the intended persona."
      ],
      "proof": "A reproducible readiness checklist; if you lack the required org, keep the lab uncompleted and use the design exercise instead.",
      "traps": [
        "Trailhead points do not prove production permissions are configured.",
        "Do not treat a product license and a permission set as interchangeable."
      ],
      "recall": "How will you prove that a missing feature is licensing, setup or user access?",
      "sources": [
        "setup",
        "licenses",
        "manage-customer-asset-amendments",
        "explore-salesforce-pricing"
      ]
    },
    {
      "id": "readiness-discovery",
      "domain": "readiness",
      "title": "Run discovery around outcomes and ownership",
      "minutes": 12,
      "bridge": "Use your CPQ discovery experience, but extend ownership beyond the quote calculator.",
      "concepts": [
        {
          "title": "Define the commercial boundary",
          "body": "Document channels, products, selling models, currencies, contract terms and post-sale events. Ask which business decisions must be consistent across channels and which remain local."
        },
        {
          "title": "Agree decision rights",
          "body": "Assign accountable owners for catalog, pricing, legal, fulfillment, assets, finance and integrations. Make the customer’s acceptance criteria measurable: accurate prices, successful fulfillment and reconciled invoices, not simply screens delivered."
        },
        {
          "title": "Scope the first outcome",
          "body": "Write inclusions, exclusions, assumptions, dependencies and change control. Sequence a usable end-to-end slice before broad product coverage. Resolve disagreements with business value and risk, not the preference for a familiar tool."
        }
      ],
      "scenario": "Sales wants faster quotes, finance wants fewer invoice disputes, and operations wants reliable provisioning. Each sponsors a different implementation.",
      "decision": "Define one cross-team lifecycle outcome, a shared acceptance test and accountable owners at the handoffs. Capture later enhancements outside the first release.",
      "lab": [
        "Create a one-page scope for a new subscription sale plus one midterm change.",
        "Assign a responsible and accountable owner to each handoff.",
        "Write three acceptance criteria that finance and sales can both verify."
      ],
      "proof": "A bounded release with named decisions, dependencies and a demonstrable customer outcome.",
      "traps": [
        "A project plan is more than a list of setup tasks.",
        "Quoting success alone is not product-to-cash success."
      ],
      "recall": "What would you exclude from the first release, and who signs off each boundary?",
      "sources": [
        "setup",
        "trail",
        "collaborate-with-salesforce-contracts"
      ]
    },
    {
      "id": "readiness-delivery",
      "domain": "readiness",
      "title": "Build a testable release and an adoption plan",
      "minutes": 12,
      "bridge": "Reuse deployment discipline; add multi-stage lifecycle reconciliation and business-persona testing.",
      "concepts": [
        {
          "title": "Test the whole chain",
          "body": "Cover catalog selection, valid and invalid configurations, pricing boundaries, order handoff, fulfillment failure, asset changes and invoices. Include negative access tests and reconciliation of dates, quantities and amounts."
        },
        {
          "title": "Separate kinds of evidence",
          "body": "A passing unit test is not user acceptance. Give business users representative scenarios and expected results. Record defects, triage ownership and explicit release criteria."
        },
        {
          "title": "Plan life after go-live",
          "body": "Define deployment order, prerequisites, rollback/forward-recovery choices, training, support ownership and operational monitoring. Track adoption with task completion and process quality, not logins alone."
        }
      ],
      "scenario": "The quote demo succeeds, but a renewal fails in UAT because the existing asset history was never loaded.",
      "decision": "Add lifecycle data and renewal acceptance tests before go-live. Resolve data dependencies and reconciliation rather than marking UAT complete from the new-sale demo.",
      "lab": [
        "Write tests for a new sale, amendment, cancellation and failed downstream call.",
        "Define expected ledger/history checks for each.",
        "List go-live owners and one adoption metric per persona."
      ],
      "proof": "A release checklist with business sign-off and an observable process for handling a failed handoff.",
      "traps": [
        "A happy-path quote is not sufficient UAT.",
        "Do not train all personas only on the seller experience."
      ],
      "recall": "Which failed scenario would prevent go-live, and what objective evidence supports that decision?",
      "sources": [
        "uat",
        "adoption",
        "manage-customer-asset-renewals-and-cancellations",
        "explore-order-orchestration"
      ]
    },
    {
      "id": "readiness-migration",
      "domain": "readiness",
      "title": "Treat CPQ migration as a redesign",
      "minutes": 12,
      "bridge": "This is the highest-risk transfer of old assumptions: familiar names do not imply compatible records, rules or integrations.",
      "concepts": [
        {
          "title": "Inventory behavior and dependencies",
          "body": "List package objects, QCP logic, product rules, price rules, custom fields, integrations, reports and active subscriptions. Identify which business requirement each customization serves before deciding what to retain."
        },
        {
          "title": "Choose a data scope",
          "body": "Agree whether to bring history, only active business or a phased coexistence set. Preserve the relationships and effective dates required for assets and future changes. Define how open quotes and renewals are handled at cutover."
        },
        {
          "title": "Reconcile behavior, not counts alone",
          "body": "Remap integrations and analytics to the native model. Rebuild rules using supported capabilities. Reconcile sample commercial outcomes, quantities, dates and financial values as well as record totals."
        }
      ],
      "scenario": "A migration plan copies all SBQQ subscriptions into Asset records and immediately enables renewals.",
      "decision": "Validate the complete target lifecycle model and required history first. A flat record copy may lose the relationships needed to amend or renew accurately.",
      "lab": [
        "Choose three existing CPQ customizations and write their business purpose.",
        "Propose a native replacement or a justified extension.",
        "Create cutover checks for one active subscription with a prior amendment."
      ],
      "proof": "A migration decision log with data lineage, open-transaction handling and reconciliation criteria.",
      "traps": [
        "Do not assume QCP can run unchanged in native pricing.",
        "A record mapping table is not a complete migration strategy."
      ],
      "recall": "What must remain true after cutover for an existing customer to renew correctly?",
      "sources": [
        "migration",
        "data-model",
        "differences"
      ]
    },
    {
      "id": "catalog-structure",
      "domain": "catalog",
      "title": "Separate navigation from product definition",
      "minutes": 12,
      "bridge": "Product Family is familiar, but a maintainable discovery catalog needs more than a single flat grouping.",
      "concepts": [
        {
          "title": "Model the browsing experience",
          "body": "Catalogs organize offerings for discovery. Categories and subcategories create a navigation hierarchy; assign products where users expect to find them. A category is not a rule that guarantees valid configuration or a price."
        },
        {
          "title": "Keep dimensions distinct",
          "body": "Product categories organize offerings. Attribute categories organize characteristics. Product classifications provide reusable attribute structures. Each solves a different modeling problem."
        },
        {
          "title": "Design for reuse",
          "body": "Start with shared product characteristics and channel needs. Avoid cloning a product only to place it in another browsing category. Validate actual discovery behavior, visibility and availability after changes."
        }
      ],
      "scenario": "One laptop belongs in both the business-device and remote-working journeys, and the team proposes duplicate SKUs.",
      "decision": "First model catalog/category membership and discovery requirements. Duplicate products only when there is a genuine separate commercial identity.",
      "lab": [
        "In the catalog badge’s special org, create a category and subcategory.",
        "Assign a product and locate it using the selling experience.",
        "Describe what pricing and configuration this action has not set."
      ],
      "proof": "A product discoverable in the right hierarchy without assuming that category membership determines its price.",
      "traps": [
        "Catalog hierarchy is not bundle hierarchy.",
        "An attribute category is not a selling category."
      ],
      "recall": "Which grouping helps browsing, and which grouping helps reuse product characteristics?",
      "sources": [
        "get-started-with-product-catalog-management",
        "create-product-categories-and-attributes"
      ]
    },
    {
      "id": "catalog-attributes",
      "domain": "catalog",
      "title": "Use attributes and classifications deliberately",
      "minutes": 12,
      "bridge": "CPQ configuration attributes often lead you toward custom fields. Native catalog design offers record-based reusable characteristics.",
      "concepts": [
        {
          "title": "Define reusable characteristics",
          "body": "An attribute captures a characteristic such as capacity or finish. Choose the data type and allowed values, and organize related attributes so designers and users can find them."
        },
        {
          "title": "Use classification as a template",
          "body": "A classification groups characteristics shared by related products. Products inherit that attribute structure, with supported product-level refinements. This is a reuse mechanism, not a navigation menu."
        },
        {
          "title": "Separate configurability from price impact",
          "body": "A configurable attribute can guide selection without changing price. When an attribute should affect an amount, configure the relevant pricing setup as well; the characteristic alone does not calculate a surcharge."
        }
      ],
      "scenario": "Twenty device products need the same capacity and connectivity attributes, but one product must offer fewer capacity values.",
      "decision": "Use a shared classification, then apply supported product-specific restrictions. Avoid twenty independent attribute definitions that drift over time.",
      "lab": [
        "Create or inspect a classification with two attributes.",
        "Create a product from it and inspect inherited attributes.",
        "Document which values are configurable and which should influence price."
      ],
      "proof": "A classification-to-product trace showing reuse and a justified product-level variation.",
      "traps": [
        "A classification is not a bundle or a price book.",
        "An attribute being visible does not make it price-impacting."
      ],
      "recall": "How would you add a shared characteristic without duplicating its definition for every product?",
      "sources": [
        "work-with-product-classifications",
        "create-product-categories-and-attributes",
        "implement-attribute-based-pricing"
      ]
    },
    {
      "id": "catalog-bundles",
      "domain": "catalog",
      "title": "Model bundles, components and constraints",
      "minutes": 12,
      "bridge": "Recognize the commercial bundle concept, but do not assume SBQQ product-option fields or rule execution transfer directly.",
      "concepts": [
        {
          "title": "Separate simple and bundled products",
          "body": "A simple product is standalone; a bundle has a hierarchy of components. Required and optional components express what the offer contains. Nested structures should reflect real commercial needs."
        },
        {
          "title": "Separate static and configurable behavior",
          "body": "A static offer fixes the runtime choices. A configurable offer permits supported changes to attributes, quantities or optional items. Choose this deliberately rather than creating a configurable experience for every SKU."
        },
        {
          "title": "Keep fulfillment modeling separate",
          "body": "A commercial bundle expresses what the customer buys. Technical products can represent downstream work. Do not expose internal provisioning tasks as extra commercial options simply to trigger delivery."
        }
      ],
      "scenario": "A connected device bundle includes a mandatory device, optional support and a hidden provisioning task.",
      "decision": "Model the customer-visible bundle and its choices, then model downstream technical fulfillment separately. Validate required components in the configurator.",
      "lab": [
        "Inspect a static and configurable bundle in the supported catalog org.",
        "Add one required and one optional component.",
        "Predict what a seller can change at runtime."
      ],
      "proof": "A bundle definition and runtime test that agree on which component and attribute changes are allowed.",
      "traps": [
        "A category containing products is not a bundle.",
        "Hidden technical work is not automatically a customer-facing SKU."
      ],
      "recall": "When would a static bundle meet the requirement more simply than a configurable one?",
      "sources": [
        "build-a-simple-product",
        "create-a-product-bundle",
        "discover-order-decomposition"
      ]
    },
    {
      "id": "catalog-selling",
      "domain": "catalog",
      "title": "Selling models and the same SKU in different forms",
      "minutes": 12,
      "bridge": "Replace the instinct to clone a recurring and a one-time SKU before checking Product Selling Models.",
      "concepts": [
        {
          "title": "Decouple what from how",
          "body": "The product is the offering; the selling model describes how it is sold. Native Product Selling Models support one-time, term-defined and evergreen approaches. A product can offer more than one supported model."
        },
        {
          "title": "Join model to price",
          "body": "Associate appropriate selling-model options and price-book entries. A valid product record alone is not enough to offer every duration or charging approach. Test the selected model’s availability and price together."
        },
        {
          "title": "Keep usage distinct",
          "body": "Consumption offerings also need measurable resources, rates and entitlement/grant policies. A recurring subscription fee and actual metered usage are different inputs even when sold together."
        }
      ],
      "scenario": "The business wants the same service offered for a fixed year or as an ongoing subscription, with separate commercial prices.",
      "decision": "Evaluate selling-model options and corresponding prices on the same product before duplicating the catalog. Validate lifecycle dates for each choice.",
      "lab": [
        "Inspect a product with two selling models and their prices.",
        "Create a quote for each supported model.",
        "Explain which usage definitions would still be needed for a consumption charge."
      ],
      "proof": "Two distinct commercial transactions with a clear model/price association and no accidental SKU duplication.",
      "traps": [
        "A subscription term is not the same as an invoice cadence.",
        "A selling model alone does not meter consumption."
      ],
      "recall": "What changes between the product definition, selling model and billing treatment?",
      "sources": [
        "build-a-simple-product",
        "selling-models",
        "set-up-and-sell-products",
        "native-selling-option"
      ]
    },
    {
      "id": "cpq-configure",
      "domain": "cpq",
      "title": "Configuration: rules, constraints and guided flows",
      "minutes": 12,
      "bridge": "Your rule-design skill transfers. The configuration engine and invocation path must be selected afresh.",
      "concepts": [
        {
          "title": "Design the interaction and engine separately",
          "body": "Product Configurator supplies the guided selection/validation experience and can work with supported configuration engines. The official trail covers both BRE-based rules and Constraint Rules Engine; availability and implementation details are release-sensitive."
        },
        {
          "title": "Match the type of relationship",
          "body": "Validation detects an invalid combination. Exclusion prevents incompatible choices. Requirement adds or requires a dependency. For large interrelated configuration spaces, evaluate constraints rather than maintaining ever more independent if/then rules."
        },
        {
          "title": "Prove the full configuration",
          "body": "Test defaults, required dependencies, mutually exclusive choices and nested interactions. Repeat representative tests through every supported channel; hiding a control is not an enforcement strategy."
        }
      ],
      "scenario": "A premium appliance requires an installation service, while two power modules cannot be selected together.",
      "decision": "Model the dependency and exclusion explicitly in the supported engine, then test both valid and invalid combinations. Do not solve compatibility by changing prices.",
      "lab": [
        "Use the official configuration badge’s prepared org.",
        "Run one requirement, exclusion and validation example.",
        "Explain when the constraint-based approach is preferable."
      ],
      "proof": "A valid configuration plus an intentionally rejected one, with a clear reason and the correct engine boundary.",
      "traps": [
        "A price adjustment does not prove a configuration is valid.",
        "Do not assume every constraint feature existed in the stated exam release."
      ],
      "recall": "What is the difference between excluding an option and reporting an invalid combination?",
      "sources": [
        "get-started-with-product-configurator",
        "create-and-configure-a-product-configurator-flow",
        "use-product-configurator-with-business-rules-engine",
        "explore-product-configurator-with-constraint-rules-engine"
      ]
    },
    {
      "id": "cpq-pricing",
      "domain": "cpq",
      "title": "Read and debug a pricing procedure",
      "minutes": 12,
      "bridge": "Think in ordered server-side pricing steps and mapped inputs, rather than copying CPQ calculator event names.",
      "concepts": [
        {
          "title": "Build the price in stages",
          "body": "A pricing procedure executes an ordered set of elements. Establish list price, then apply the required adjustments in the intended order. Map element variables to the expected context tags and lookup inputs."
        },
        {
          "title": "Separate data from calculation",
          "body": "Price-book entries and adjustment records supply data; elements use it. A correct procedure can return the wrong amount when its data, selling model, currency, effective conditions or context values do not match the transaction."
        },
        {
          "title": "Test before broad rollout",
          "body": "Simulate representative inputs and inspect intermediate results. Follow the documented activation/default-procedure and pricing-data sync steps for the org. Test boundaries and no-match cases, not only the sample customer."
        }
      ],
      "scenario": "A $240 item receives a 10% discount and then a $12 adjustment. The team expects $204, but a different element order returns another amount.",
      "decision": "Write the intended calculation explicitly and inspect each stage. With the specified sequence: 240 × 0.90 − 12 = 204. Order and the chosen basis are requirements.",
      "lab": [
        "Inspect a list-price procedure in the pricing badge’s org.",
        "Predict two adjustments by hand, then simulate them.",
        "Trace a missing input and an unmatched lookup separately."
      ],
      "proof": "A pricing waterfall whose intermediate amounts reconcile with documented policy.",
      "traps": [
        "A correct final value for one scenario does not prove the procedure is correct.",
        "Do not assume a CPQ price rule or QCP is a drop-in native element."
      ],
      "recall": "How do you distinguish stale/missing pricing data from an incorrect element order?",
      "sources": [
        "create-a-pricing-procedure-with-the-list-price-element",
        "configure-pricing-for-products",
        "add-volume-and-manual-discounts"
      ]
    },
    {
      "id": "cpq-advanced",
      "domain": "cpq",
      "title": "Choose the pricing mechanism that matches the policy",
      "minutes": 12,
      "bridge": "Existing knowledge of discount schedules helps, but native mechanisms have distinct inputs and limitations.",
      "concepts": [
        {
          "title": "Start with the commercial driver",
          "body": "Quantity suggests volume tiers; selected characteristics suggest attribute-based adjustments; being sold within a bundle suggests bundle-based adjustment. Mark and map price-impacting attributes where required."
        },
        {
          "title": "Distinguish advanced mechanisms",
          "body": "Derived pricing relates a dependent product’s price to a source discovered by configured logic. Contract-based pricing applies agreed terms for the selected account/contract. Aggregate pricing rolls up supported line-level values; do not assume it automatically updates every header total."
        },
        {
          "title": "Model time and consumption explicitly",
          "body": "Subscription pricing and proration address recurring terms and partial periods. Usage rating needs measured resources and rate definitions. Document the date basis, period convention, units and rounding; do not import CPQ proration assumptions untested."
        }
      ],
      "scenario": "Support costs a percentage of an eligible device, with a negotiated customer exception and an off-cycle start date.",
      "decision": "Identify source discovery and derived-price logic, contract eligibility and proration as separate concerns. Define precedence and validate combinations, not just each feature alone.",
      "lab": [
        "Work through a derived or contract-pricing unit.",
        "Draw the inputs for attribute, volume, bundle and derived policies.",
        "Predict a partial-period example under an explicitly stated convention."
      ],
      "proof": "A mechanism-selection table plus a test of overlapping policies and effective dates.",
      "traps": [
        "Aggregate pricing is not a universal header-rollup feature.",
        "A changing attribute needs pricing setup before it can change the price."
      ],
      "recall": "Which mechanism addresses price dependency, and which addresses an agreed customer-specific exception?",
      "sources": [
        "implement-attribute-based-pricing",
        "set-up-bundle-based-pricing",
        "explore-derived-pricing-and-discovery-procedures",
        "implement-derived-pricing",
        "set-up-subscription-pricing-with-proration",
        "apply-aggregate-pricing",
        "configure-contract-based-pricing",
        "native-transaction-objects"
      ]
    },
    {
      "id": "cpq-transact",
      "domain": "cpq",
      "title": "Quote accurately, including with Agentforce",
      "minutes": 12,
      "bridge": "The new seller experience is not the SBQQ quote-line editor. Learn the business transaction and validation boundaries.",
      "concepts": [
        {
          "title": "Follow the transaction",
          "body": "Discover a product, configure its choices, set commercial details and calculate a quote. Verify the quote’s lines, dates, selling model and prices before downstream order processing. Persisted records and a completed business operation are separate concerns."
        },
        {
          "title": "Use Agentforce within guardrails",
          "body": "The quoting agent can assist with creating, changing and summarizing quotes using supported actions. It still relies on product rules, pricing setup, permissions and user-supplied business details. Review the proposed quote before sending it."
        },
        {
          "title": "Keep responsibilities explicit",
          "body": "Quote generation does not negotiate legal language, complete fulfillment or collect an invoice. For a customer request, decide which process and service should perform the next action instead of having the UI invent downstream state."
        }
      ],
      "scenario": "A seller asks an agent to quote a service with a discount. The output omits a required dependency and the account’s intended term.",
      "decision": "Validate configuration, collected inputs and authorized actions before accepting the output. An attractive AI response is not evidence that the commercial transaction is valid.",
      "lab": [
        "Use the quote or quoting-agent badge’s specified org.",
        "Create a quote, inspect each commercial choice and review totals.",
        "Repeat with an incomplete request and note what must be clarified."
      ],
      "proof": "A reviewed quote with valid products, quantities, dates and prices, plus a defined next step.",
      "traps": [
        "Agentforce does not bypass access or pricing rules.",
        "A successful prompt is not a substitute for business validation."
      ],
      "recall": "What must a seller verify after the agent generates a quote?",
      "sources": [
        "work-with-quotes",
        "discover-and-configure-products",
        "agent"
      ]
    },
    {
      "id": "contracts-legal",
      "domain": "contracts",
      "title": "Understand Salesforce Contracts as a legal lifecycle",
      "minutes": 12,
      "bridge": "A CPQ Contract record and a subscription term are not the whole of contract lifecycle management.",
      "concepts": [
        {
          "title": "Model the agreement process",
          "body": "Salesforce Contracts supports document authoring, negotiation, internal approval, signature/execution and activation. Contract types and state models determine applicable lifecycle behavior and available actions."
        },
        {
          "title": "Use governed content",
          "body": "Templates generate documents from business data. A clause library supplies approved language; versions and negotiations preserve the evolution of the agreement. Match permissions and allowed actions to the legal stage."
        },
        {
          "title": "Separate legal and commercial outcomes",
          "body": "An executed document expresses agreed terms, but order delivery and invoice payment still need their own processes. AI-assisted clause work needs the same legal ownership and review as manually drafted terms."
        }
      ],
      "scenario": "Legal wants sales agreements and nondisclosure agreements to follow different approval paths and permitted actions.",
      "decision": "Evaluate contract types and state models, with approved templates and clauses. Do not force every agreement through the same quote status field.",
      "lab": [
        "Map two agreement types from draft to activation.",
        "Specify permitted actions and accountable reviewers at each stage.",
        "Explain how a changed clause is tracked."
      ],
      "proof": "A lifecycle design that distinguishes authoring, approval, signature and activation, with review ownership.",
      "traps": [
        "Signature is not fulfillment.",
        "Contract-based price records and a contract document serve different purposes."
      ],
      "recall": "Which contract capability governs allowed actions at each legal stage?",
      "sources": [
        "meet-salesforce-contracts",
        "dive-into-salesforce-contracts-capabilities",
        "collaborate-with-salesforce-contracts"
      ]
    },
    {
      "id": "contracts-decompose",
      "domain": "contracts",
      "title": "Decompose a commercial order into fulfillment work",
      "minutes": 12,
      "bridge": "Order creation is familiar; translating the sale into downstream technical work may be new.",
      "concepts": [
        {
          "title": "Separate what was sold from how it is delivered",
          "body": "Commercial products are customer-facing. Technical products represent work or structures needed by downstream systems. Decomposition maps the commercial sale into the appropriate fulfillment requests."
        },
        {
          "title": "Do not overcomplicate simple orders",
          "body": "Dynamic Revenue Orchestrator can orchestrate simple orders without decomposition. Add decomposition when commercial-to-technical translation is actually required, rather than making it mandatory for every order."
        },
        {
          "title": "Retain traceability",
          "body": "A fulfillment team needs to relate technical work back to the originating order and commercial requirement. Agree system ownership, identifiers and expected results at each handoff."
        }
      ],
      "scenario": "A customer buys a single connectivity offer that requires device shipment, network activation and a service entitlement.",
      "decision": "Model the commercial offer once and decompose it into the required technical fulfillment. Avoid adding three unwanted customer-visible quote lines purely to drive operations.",
      "lab": [
        "Draw one commercial offer and its downstream fulfillment requirements.",
        "Identify which systems own each technical outcome.",
        "Compare with an order that needs no decomposition."
      ],
      "proof": "A justified decomposition design with a trace back to the original customer purchase.",
      "traps": [
        "Decomposition is not a discount calculation.",
        "A technical product is generally not a new customer-facing choice."
      ],
      "recall": "What does decomposition produce, and when can an order skip it?",
      "sources": [
        "meet-dynamic-revenue-orchestrator",
        "discover-order-decomposition",
        "define-an-order-decomposition"
      ]
    },
    {
      "id": "contracts-orchestrate",
      "domain": "contracts",
      "title": "Sequence fulfillment with dependencies and step types",
      "minutes": 12,
      "bridge": "Flow remains useful, but a generic Flow alone is not the visual orchestration model for every delivery stream.",
      "concepts": [
        {
          "title": "Design the plan",
          "body": "An orchestration plan groups work into lanes. Within-lane and cross-lane dependencies express the real prerequisites. Independent tasks may run in parallel; a downstream task must wait when its business prerequisite is unmet."
        },
        {
          "title": "Choose the supported step type",
          "body": "An Auto Task uses Flow for automated work. A Callout communicates with an external system. A Manual Task requires human work; milestones mark progress; pause steps wait for an external condition or work to complete."
        },
        {
          "title": "Set the correct scope",
          "body": "Decide whether a step is instantiated once per plan, bundle or line. Confirm the execution identity’s permissions and the completion signal. Avoid accidental duplicate shipping or premature billing through poor scope or dependency choices."
        }
      ],
      "scenario": "Two fulfillment lanes handle equipment and activation. Billing must wait until both are complete, but the lanes can otherwise progress independently.",
      "decision": "Keep independent work parallel and define the necessary cross-lane prerequisites for billing. Select step types by the actual work, not by label preference.",
      "lab": [
        "Draw two lanes with one cross-lane dependency.",
        "Assign a step type and scope to each task.",
        "Simulate completion in different orders."
      ],
      "proof": "Billing never starts early, and unrelated tasks are not unnecessarily serialized.",
      "traps": [
        "A milestone does not perform the external work itself.",
        "A run-as identity still needs the required access."
      ],
      "recall": "How would you prevent one invoice per line when the business requires one fulfillment-level action?",
      "sources": [
        "explore-order-orchestration",
        "design-a-simple-order-orchestration",
        "design-an-orchestration-plan",
        "define-dependencies-and-fulfillment-scenarios"
      ]
    },
    {
      "id": "contracts-recovery",
      "domain": "contracts",
      "title": "Handle fallout and operational risk",
      "minutes": 12,
      "bridge": "Go beyond “the order exists.” Learn how operations sees, diagnoses and recovers failed fulfillment.",
      "concepts": [
        {
          "title": "Observe the real state",
          "body": "Inspect fulfillment status, dependencies and downstream responses. A submitted order can still have incomplete, paused or failed work. Design operational views that expose the handoff that needs attention."
        },
        {
          "title": "Distinguish delay from failure",
          "body": "Service-level and jeopardy handling concerns timing risk; fallout management concerns fulfillment problems and recovery. Decide escalation ownership and what evidence confirms downstream success."
        },
        {
          "title": "Avoid blind retries",
          "body": "An external timeout does not prove the external operation failed. Use correlation identifiers, reconciliation and idempotent integration design where supported. Resume the correct work rather than submitting the whole commercial order again."
        }
      ],
      "scenario": "Provisioning times out after the downstream system has already created the service. Operations proposes resubmitting the entire order.",
      "decision": "Reconcile the downstream outcome using the transaction identifiers, then recover the failed step safely. Define escalation and completion evidence to prevent duplicate service.",
      "lab": [
        "Write a failure scenario for an external task.",
        "Specify a correlation key, escalation owner and safe retry rule.",
        "Explain how operations will see pending versus failed work."
      ],
      "proof": "A recovery runbook that protects completed tasks and reconciles external side effects.",
      "traps": [
        "A timeout is not proof of no downstream effect.",
        "Successful quote approval does not close fulfillment fallout."
      ],
      "recall": "Which evidence is required before retrying an ambiguous external call?",
      "sources": [
        "explore-order-orchestration",
        "execute-an-orchestration-plan"
      ]
    },
    {
      "id": "assets-history",
      "domain": "assets",
      "title": "Read asset actions and state periods",
      "minutes": 12,
      "bridge": "Do not treat a native managed asset as merely an SBQQ subscription with another label.",
      "concepts": [
        {
          "title": "Understand the managed asset",
          "body": "Assets represent purchased products or services, including subscriptions and bundles. The account’s managed-assets view helps understand what the customer owns and its current commercial state."
        },
        {
          "title": "Separate events from intervals",
          "body": "Asset Actions record dated changes. Asset State Periods represent intervals with a consistent quantity, amount and recurring-revenue state. Both matter when explaining history and effective-dated changes."
        },
        {
          "title": "Ask “as of when?”",
          "body": "Current quantity alone cannot answer a historical service or billing question. Locate the state for the relevant date and relate it to the action and transaction that caused the change. Avoid counting each historical period as a separate currently active entitlement."
        }
      ],
      "scenario": "A customer started with 12 licenses and increased to 17 halfway through the term. Support asks how many licenses existed before the increase.",
      "decision": "Use asset state periods for the date-specific quantity, and asset actions for the event that changed it. Do not overwrite history or infer the answer from today’s quantity.",
      "lab": [
        "Inspect an asset’s current details, actions and state periods.",
        "Choose dates before and after a change.",
        "Reconcile both answers with the originating transaction."
      ],
      "proof": "A dated history showing which quantity and value apply during each interval.",
      "traps": [
        "An action is an event; a state period is an interval.",
        "Total lifecycle amount, MRR and invoiced cash are different measures."
      ],
      "recall": "Which record concept answers what changed, and which answers what was true during a period?",
      "sources": [
        "provide-post-sales-support",
        "build-loyalty-through-post-sale-engagement",
        "native-asset-model",
        "native-transaction-objects"
      ]
    },
    {
      "id": "assets-amend",
      "domain": "assets",
      "title": "Amend an existing customer asset",
      "minutes": 12,
      "bridge": "Keep amendment intent, but learn the native asset-based flow and validate effective dates and quantities.",
      "concepts": [
        {
          "title": "Start from the installed base",
          "body": "Select the existing managed asset and the intended effective date. Determine whether the business is changing quantity, configuration or another supported commercial characteristic; do not model every change as an unrelated new sale."
        },
        {
          "title": "State the quantity semantics",
          "body": "“Add eight” and “set the total to eight” are different requirements. In the amendment experience, confirm whether the input represents a delta or a resulting quantity and inspect the generated transaction before activation."
        },
        {
          "title": "Complete and reconcile the lifecycle",
          "body": "A draft amendment quote is a proposal. Follow the supported quote/order processing and check resulting actions, periods and prices. Confirm proration and any billing impact rather than directly editing the asset’s current fields."
        }
      ],
      "scenario": "A customer owns 12 seats and requests five additional seats starting next month.",
      "decision": "Amend the existing asset effective next month, verify the intended resulting quantity of 17 and validate the commercial delta. Preserve the earlier state of 12.",
      "lab": [
        "Use the amendment badge’s prepared asset.",
        "Schedule a change and inspect the generated quote/order.",
        "After supported processing, compare before/after states and amounts."
      ],
      "proof": "A traceable effective-dated change without destroying the customer’s earlier history.",
      "traps": [
        "Editing the asset quantity directly is not equivalent to an amendment transaction.",
        "The generated quote does not by itself prove the asset changed."
      ],
      "recall": "How will you verify that the amended total and the charged change both match the request?",
      "sources": [
        "manage-customer-asset-amendments",
        "provide-post-sales-support"
      ]
    },
    {
      "id": "assets-renew",
      "domain": "assets",
      "title": "Renew with explicit terms and continuity",
      "minutes": 12,
      "bridge": "Do not assume CPQ renewal-opportunity automation and package fields define the native process.",
      "concepts": [
        {
          "title": "Identify the asset and renewal window",
          "body": "Start with the managed asset and its lifecycle end date. Confirm whether renewal follows the predefined term or a supported override. Decide which configuration and commercial terms should carry forward."
        },
        {
          "title": "Review the generated transaction",
          "body": "A renewal quote needs a correct start/end period, quantity, selling model and applicable pricing. Validate whether new negotiated terms apply; “renew” does not mean every old discount must continue forever."
        },
        {
          "title": "Prove continuity after processing",
          "body": "Complete the supported renewal order flow and reconcile the asset’s resulting dates, actions and state. Distinguish an extension for the next term from an in-term amendment."
        }
      ],
      "scenario": "A service ends on 30 June and the customer wants the next annual term, with a new agreed price.",
      "decision": "Use the renewal flow for the existing asset, establish the next-term dates and validate the selected pricing agreement. Reconcile the renewal transaction and asset history.",
      "lab": [
        "Inspect an asset approaching expiry in the renewal badge’s org.",
        "Preview a renewal term and the generated quote.",
        "Explain how you would detect a gap or overlap before activation."
      ],
      "proof": "A renewal design with explicit continuity checks and correct next-term commercial conditions.",
      "traps": [
        "Do not create a separate unrelated asset merely to imitate renewal.",
        "A future renewal and an immediate upsell answer different requests."
      ],
      "recall": "Which dates and pricing conditions would you verify before activating a renewal?",
      "sources": [
        "manage-customer-asset-renewals-and-cancellations",
        "configure-contract-based-pricing"
      ]
    },
    {
      "id": "assets-cancel",
      "domain": "assets",
      "title": "Cancel safely and connect the financial effects",
      "minutes": 12,
      "bridge": "Cancelling an installed subscription is an effective-dated commercial event, not a record-deletion exercise.",
      "concepts": [
        {
          "title": "Choose the business event",
          "body": "An amendment changes an existing asset, a renewal extends future service and a cancellation ends it. Establish the requested effective date, notice rules and permitted outcome before selecting the process."
        },
        {
          "title": "Preserve the history",
          "body": "Use the supported cancellation transaction to record how service ends. Keep preceding periods and the action that caused the change. Direct deletion loses auditability and may leave financial processes inconsistent."
        },
        {
          "title": "Reconcile finance separately",
          "body": "Validate any prorated amount, credit or refund under the agreement and configured policies. A cancellation does not automatically prove cash was returned. Coordinate with Billing and payment operations."
        }
      ],
      "scenario": "A prepaid annual service ends early. Support wants to delete the asset and tell the customer that a refund is complete.",
      "decision": "Execute the supported effective-dated cancellation, then verify the resulting financial adjustment and payment/refund process. Retain the original service history.",
      "lab": [
        "Write three customer requests and classify each as amend, renew or cancel.",
        "For cancellation, list the asset and finance evidence needed.",
        "Verify how a past-period report should still represent the service."
      ],
      "proof": "A cancellation checklist that retains history and distinguishes service termination, credit and cash movement.",
      "traps": [
        "Credit memo and refund are not interchangeable.",
        "A future end date must not erase prior service."
      ],
      "recall": "What proves the service ended, what proves a credit exists, and what proves money moved?",
      "sources": [
        "manage-customer-asset-renewals-and-cancellations",
        "navigate-the-full-billing-lifecycle"
      ]
    },
    {
      "id": "invoice-policy",
      "domain": "invoices",
      "title": "Policies, treatments and billing profiles",
      "minutes": 12,
      "bridge": "Native Billing is not the legacy Salesforce Billing managed package. Learn its setup responsibilities before using familiar terminology.",
      "concepts": [
        {
          "title": "Define how the charge should bill",
          "body": "A billing policy governs whether a product is billable and relevant advance/arrears behavior. Billing treatments and treatment items describe how and when transaction amounts are billed, including milestone allocations."
        },
        {
          "title": "Supply customer and legal context",
          "body": "Billing profiles hold customer billing preferences such as bill-to details and payment terms. Legal entities and tax policies/treatments provide the relevant organizational and tax context. Validate the actual contracted capabilities and integration design."
        },
        {
          "title": "Keep amounts and due dates distinct",
          "body": "Pricing determines the commercial amount. Billing determines invoicing behavior. Payment terms affect when an invoice is due; they do not redefine the customer’s subscription term or rate."
        }
      ],
      "scenario": "A services project bills 30% at kickoff and 70% at acceptance, with payment due 45 days after each invoice.",
      "decision": "Model the milestone billing allocations separately from payment terms. Do not replace the project’s product price or subscription term to simulate invoice timing.",
      "lab": [
        "Design a billing policy/treatment for the project.",
        "Specify customer profile, payment terms and legal/tax ownership.",
        "Explain which configuration controls each date and amount."
      ],
      "proof": "A trace from commercial price to invoice timing to due date, without conflating the three.",
      "traps": [
        "Invoice cadence is not product selling model.",
        "A billing profile is not a price-discount rule."
      ],
      "recall": "Which records describe invoice behavior versus the customer’s billing preferences?",
      "sources": [
        "explore-billing-features-and-roles",
        "generate-invoices"
      ]
    },
    {
      "id": "invoice-schedules",
      "domain": "invoices",
      "title": "From order product to billing schedule and invoice",
      "minutes": 12,
      "bridge": "Follow the native billing chain rather than assuming order activation itself means an invoice has been sent and paid.",
      "concepts": [
        {
          "title": "Understand the intermediate state",
          "body": "Billing schedules represent how the order product is billed over time. Schedule groups organize related schedules. Invoice generation consumes eligible billing information under configured rules."
        },
        {
          "title": "Preview and reconcile",
          "body": "Use supported invoice-preview capabilities before finalizing when appropriate. Verify bill-to details, currency, service dates, amounts, tax and grouping. Do not infer correct billing from a correct quote alone."
        },
        {
          "title": "Choose advance or arrears deliberately",
          "body": "Advance bills before the service period; arrears bills after it. Milestone and ramp scenarios have their own timing requirements. Use the supported billing lifecycle rather than manual invoice-date edits as the primary solution."
        }
      ],
      "scenario": "A monthly subscription has the correct annual quote total, but invoices are issued at the wrong time.",
      "decision": "Inspect billing policy, treatment and generated schedules, then preview eligible charges. A pricing change is not the first remedy for an invoice-timing defect.",
      "lab": [
        "In a supported billing training org, trace an order product to its schedules.",
        "Identify the service period, invoice event and due date.",
        "Compare an advance and an arrears scenario."
      ],
      "proof": "A schedule-to-invoice explanation with reconciled dates and amounts; payment remains a separate event.",
      "traps": [
        "An order, a schedule and an invoice are not the same record.",
        "Do not assume a price calculation collects money."
      ],
      "recall": "Where would you investigate an amount that is right but billed in the wrong period?",
      "sources": [
        "get-started-with-billing-revenue-cloud",
        "generate-invoices",
        "explore-billing-features-and-roles"
      ]
    },
    {
      "id": "invoice-usage",
      "domain": "invoices",
      "title": "Follow consumption into invoice-ready summaries",
      "minutes": 12,
      "bridge": "A CPQ quantity field is not a meter. Usage-based selling needs a traceable measurement and rating process.",
      "concepts": [
        {
          "title": "Define the resource and entitlement",
          "body": "Identify what is measured, its unit, the sellable offer and entitlement/grant policy. Rates turn measured usage into charges; wallets help track balances and consumption against entitlements."
        },
        {
          "title": "Track the processing chain",
          "body": "Consumption Management captures timestamped usage records and creates summaries for later processing. Understand source identifiers, customer/product attribution, units and billing period before checking the final amount."
        },
        {
          "title": "Handle exceptions explicitly",
          "body": "Design for late data, duplicates, corrections and overage policy. Validate reconciliation from source usage through summaries to invoicing. A configured price book is not sufficient evidence that usage was captured or rated."
        }
      ],
      "scenario": "A customer disputes a usage invoice after the integration resends the same source batch.",
      "decision": "Trace source identifiers and processed summaries to detect duplicate consumption. Reconcile the measured units and entitlement/rate policy before changing the invoice.",
      "lab": [
        "Draw source usage → processing/summaries → invoice.",
        "Define an identifier, unit and timestamp for each input.",
        "Explain a duplicate and a late-arriving usage test."
      ],
      "proof": "A usage audit trail that explains the customer’s billed units and treatment of included entitlements.",
      "traps": [
        "A wallet balance is not an invoice or cash balance.",
        "Usage rating and subscription proration answer different questions."
      ],
      "recall": "What evidence connects a disputed invoice amount to the original units consumed?",
      "sources": [
        "get-to-know-usage-management",
        "set-up-and-sell-products",
        "manage-wallets-and-track-consumption"
      ]
    },
    {
      "id": "invoice-finance",
      "domain": "invoices",
      "title": "Credits, payments and financial reconciliation",
      "minutes": 12,
      "bridge": "Your quote-to-cash understanding helps; keep operational billing states separate from booked and recognized revenue.",
      "concepts": [
        {
          "title": "Distinguish the financial documents",
          "body": "An invoice requests payment. A credit memo adjusts an amount owed. A payment records funds received, and a refund returns funds. Collections and write-offs address different receivables outcomes."
        },
        {
          "title": "Keep policy and approval ownership",
          "body": "Coordinate correction, tax, refund and write-off controls with finance. Use the supported document lifecycle and audit trail instead of deleting posted history to make totals appear right."
        },
        {
          "title": "Read the right measures",
          "body": "Use separate metrics for quoted/booked value, invoices, credits, outstanding balances and payments. Invoice creation alone does not establish accounting revenue recognition; agree the accounting system and reconciliation boundary."
        }
      ],
      "scenario": "A customer receives a credit memo after a cancellation. Sales says the customer has already been refunded.",
      "decision": "Confirm whether a refund transaction was actually processed. Reconcile the credit, payment application and any returned funds before communicating the result.",
      "lab": [
        "Create a design ledger with an invoice, credit, payment and refund.",
        "Explain how each changes the customer’s balance or cash.",
        "Define a billing-dispute dashboard without double-counting documents."
      ],
      "proof": "A clear audit trail that distinguishes a billing correction from a cash movement.",
      "traps": [
        "A credit is not proof of a refund.",
        "Revenue recognition is not inferred just because an invoice exists."
      ],
      "recall": "Which document would you inspect to prove the amount owed changed, and which proves cash returned?",
      "sources": [
        "navigate-the-full-billing-lifecycle",
        "explore-billing-features-and-roles"
      ]
    }
  ],
  "questions": [
    {
      "id": "p01",
      "lesson": "platform-map",
      "domain": "platform",
      "stem": "An SBQQ-certified architect starts a native Revenue Management implementation. Which assumption is safest?",
      "options": [
        "Reassess the target data model and service boundaries",
        "Reuse SBQQ quote records as the native transaction model",
        "Install the CPQ package to enable every native feature",
        "Treat Industries CPQ as an interchangeable interface"
      ],
      "correct": [
        0
      ],
      "explanation": "Transfer process expertise, then validate the native implementation rather than assuming package compatibility.",
      "reasons": [
        "Native architecture requires a new mapping of behavior.",
        "Package records are not the native quote model.",
        "Package installation does not provision all native services.",
        "It is a distinct product and architecture."
      ],
      "difficulty": "Foundation",
      "sources": [
        "product-identity",
        "data-model",
        "manage-orders",
        "get-started-with-billing-revenue-cloud"
      ]
    },
    {
      "id": "p02",
      "lesson": "platform-context",
      "domain": "platform",
      "stem": "A pricing simulation receives no customer segment, although the Account field is populated. What should be inspected first?",
      "options": [
        "Change the discount percentage before checking the runtime input",
        "Add the Account field to the quote PDF",
        "Copy the segment onto a custom SBQQ quote-line field",
        "The source mapping, context tag and hydrated input"
      ],
      "correct": [
        3
      ],
      "explanation": "Trace the input boundary before changing calculation logic.",
      "reasons": [
        "A missing input should be traced before changing policy.",
        "A merge field does not hydrate the pricing context.",
        "The native service needs its own mapped context input.",
        "The missing value must reach the consuming context."
      ],
      "difficulty": "Applied",
      "sources": [
        "get-to-know-context-service",
        "explore-context-service-components-and-processes"
      ]
    },
    {
      "id": "p03",
      "lesson": "platform-context",
      "domain": "platform",
      "stem": "Which TWO statements correctly distinguish Context Service design time and runtime?",
      "options": [
        "An instance is a permanently stored replacement for all source records",
        "A definition describes structure and mappings",
        "An instance contains data for process execution",
        "Changing context data proves the database was updated"
      ],
      "correct": [
        1,
        2
      ],
      "explanation": "Keep the logical definition, hydrated data and persisted business records distinct.",
      "reasons": [
        "Context data is transient unless persisted as appropriate.",
        "It is design-time metadata.",
        "It is the runtime representation.",
        "Persistence is a separate operation."
      ],
      "difficulty": "Applied",
      "sources": [
        "get-to-know-context-service",
        "explore-context-service-components-and-processes"
      ]
    },
    {
      "id": "p04",
      "lesson": "platform-context",
      "domain": "platform",
      "stem": "A service changes a value in a context instance. A later record query still returns the old value. Which missing step is most relevant?",
      "options": [
        "Create another quote document",
        "Add the product to another category",
        "Change a contract state label",
        "Persist the intended changes through the configured mapping"
      ],
      "correct": [
        3
      ],
      "explanation": "Check the supported persistence operation and mapping before assuming a transaction was saved.",
      "reasons": [
        "Document creation is unrelated to the update boundary.",
        "Discovery grouping does not persist context changes.",
        "Legal state labels do not write this context.",
        "Updating transient context is not database persistence."
      ],
      "difficulty": "Applied",
      "sources": [
        "get-to-know-context-service",
        "explore-context-service-components-and-processes"
      ]
    },
    {
      "id": "p05",
      "lesson": "platform-rules",
      "domain": "platform",
      "stem": "An eligibility service must return values from one matching lookup row. Which BRE tool most directly matches this shape?",
      "options": [
        "Decision matrix",
        "A product classification",
        "A billing treatment",
        "A contract state model"
      ],
      "correct": [
        0
      ],
      "explanation": "Match the decision’s inputs and outputs to the BRE tool.",
      "reasons": [
        "It returns outputs from a matching row.",
        "Classification reuses attributes; it does not execute the lookup.",
        "It describes invoicing behavior rather than this decision.",
        "It governs agreement stages, not lookup outcomes."
      ],
      "difficulty": "Foundation",
      "sources": [
        "get-to-know-business-rules-engine",
        "build-decisions-with-lookup-tables",
        "orchestrate-rules-with-expression-sets",
        "automate-business-processes"
      ]
    },
    {
      "id": "p06",
      "lesson": "platform-rules",
      "domain": "platform",
      "stem": "A decision requires ordered calculations and lookup steps reusable from a flow. Which capability is most suitable?",
      "options": [
        "A decision matrix alone, with no sequencing logic",
        "An expression set",
        "A new Flow branch per consumer with copied formulas",
        "A product classification containing the output value"
      ],
      "correct": [
        1
      ],
      "explanation": "An expression set handles the decision logic; Flow can coordinate its use.",
      "reasons": [
        "A lookup alone does not implement the ordered calculations.",
        "It sequences reusable decision and calculation elements.",
        "That duplicates rather than centralizes the decision.",
        "A static characteristic is not the executable decision."
      ],
      "difficulty": "Applied",
      "sources": [
        "get-to-know-business-rules-engine",
        "build-decisions-with-lookup-tables",
        "orchestrate-rules-with-expression-sets",
        "automate-business-processes"
      ]
    },
    {
      "id": "p07",
      "lesson": "platform-access",
      "domain": "platform",
      "stem": "A native quote report joins every header to four lines and sums the header amount on each row. Which correction addresses the inflated total?",
      "options": [
        "Use a line-count-based price adjustment to offset the report total",
        "Sum each historical asset period into the same metric",
        "Aggregate using the intended header grain",
        "Count only quotes that have invoices but keep the same joined sum"
      ],
      "correct": [
        2
      ],
      "explanation": "Define metric grain before joining one-to-many relationships.",
      "reasons": [
        "That changes commercial prices to hide a reporting defect.",
        "That mixes a different time grain into the result.",
        "The join repeats the header value.",
        "Filtering does not remove repeated header amounts."
      ],
      "difficulty": "Applied",
      "sources": [
        "licenses",
        "catalog-api",
        "data-model",
        "provide-post-sales-support",
        "navigate-the-full-billing-lifecycle"
      ]
    },
    {
      "id": "p08",
      "lesson": "platform-access",
      "domain": "platform",
      "stem": "Which TWO checks matter when a seller cannot use a licensed feature?",
      "options": [
        "Whether another administrator can see the app",
        "Permissions and record/object/field access for that seller",
        "Whether the seller knows the CPQ calculator sequence",
        "Required feature enablement and license assignments"
      ],
      "correct": [
        1,
        3
      ],
      "explanation": "Diagnose entitlement, feature setup and the actual execution identity separately.",
      "reasons": [
        "Another user’s visibility does not prove seller access.",
        "Actual persona access must be verified.",
        "Knowledge does not grant native access.",
        "Entitlement and prerequisites may block access."
      ],
      "difficulty": "Applied",
      "sources": [
        "licenses",
        "catalog-api",
        "data-model",
        "provide-post-sales-support",
        "navigate-the-full-billing-lifecycle"
      ]
    },
    {
      "id": "p09",
      "lesson": "platform-map",
      "domain": "platform",
      "stem": "A customer accepts a correctly priced quote. What can be concluded without additional evidence?",
      "options": [
        "The invoice was paid",
        "The commercial proposal was accepted",
        "Every fulfillment task completed",
        "The legal agreement was signed"
      ],
      "correct": [
        1
      ],
      "explanation": "Commercial acceptance does not establish downstream delivery, legal execution or collection.",
      "reasons": [
        "Payment is a separate financial event.",
        "Further lifecycle stages need their own confirmation.",
        "Acceptance does not prove delivery.",
        "Quote acceptance is not proof of contract execution."
      ],
      "difficulty": "Foundation",
      "sources": [
        "product-identity",
        "data-model",
        "manage-orders",
        "get-started-with-billing-revenue-cloud"
      ]
    },
    {
      "id": "p10",
      "lesson": "platform-access",
      "domain": "platform",
      "stem": "An external channel must discover catalog products and request valid prices. Which design is strongest?",
      "options": [
        "Share an unrestricted administrator identity with every buyer",
        "Use supported business services with explicit access and error handling",
        "Reimplement every price rule in browser JavaScript",
        "Insert arbitrary quote lines and assume they are validated"
      ],
      "correct": [
        1
      ],
      "explanation": "Use the platform’s supported business capabilities and a governed integration identity.",
      "reasons": [
        "That violates the intended access boundary.",
        "This preserves service semantics across channels.",
        "Duplicated logic creates divergence and maintenance risk.",
        "Record writes alone do not prove business validity."
      ],
      "difficulty": "Applied",
      "sources": [
        "licenses",
        "catalog-api",
        "data-model",
        "provide-post-sales-support",
        "navigate-the-full-billing-lifecycle"
      ]
    },
    {
      "id": "p11",
      "lesson": "platform-context",
      "domain": "platform",
      "stem": "What is the role of a context tag?",
      "options": [
        "A direct replacement for every source field API name",
        "An activation flag for a pricing procedure",
        "A stable alias for a node or attribute used by consumers",
        "A persisted copy of the field value in every quote"
      ],
      "correct": [
        2
      ],
      "explanation": "Tags help consumers refer to the logical data model.",
      "reasons": [
        "Tags are aliases within a configured context, not universal schema renames.",
        "Procedure activation is a separate concern.",
        "Tags identify context values for consuming logic.",
        "A tag identifies logical information rather than creating records."
      ],
      "difficulty": "Foundation",
      "sources": [
        "get-to-know-context-service",
        "explore-context-service-components-and-processes"
      ]
    },
    {
      "id": "p12",
      "lesson": "platform-rules",
      "domain": "platform",
      "stem": "A guided experience and a pricing process need the same reusable business decision. Which approach best reduces drift?",
      "options": [
        "Define a shared decision with clear inputs and outputs",
        "Maintain matching formulas in every consuming flow",
        "Put one calculated result in a product attribute for every customer",
        "Recompute the policy independently in each channel integration"
      ],
      "correct": [
        0
      ],
      "explanation": "Separate reusable decisions from the experiences that invoke them.",
      "reasons": [
        "Both consumers can use the governed decision.",
        "Duplicated policy can drift.",
        "That does not model the reusable customer-dependent decision.",
        "That creates competing sources of business logic."
      ],
      "difficulty": "Applied",
      "sources": [
        "get-to-know-business-rules-engine",
        "build-decisions-with-lookup-tables",
        "orchestrate-rules-with-expression-sets",
        "automate-business-processes"
      ]
    },
    {
      "id": "p13",
      "lesson": "platform-access",
      "domain": "platform",
      "stem": "Finance asks for billed value and collected cash. What should the dashboard do?",
      "options": [
        "Count every asset state period as a paid invoice",
        "Define and reconcile separate invoice and payment metrics",
        "Use quote total as both measures",
        "Use current MRR as collected cash"
      ],
      "correct": [
        1
      ],
      "explanation": "Choose the correct lifecycle record and dates for each financial metric.",
      "reasons": [
        "Historical asset intervals are not payments.",
        "Issuing an invoice and receiving cash are different events.",
        "A quote proves neither billing nor collection.",
        "MRR is a recurring run-rate measure."
      ],
      "difficulty": "Applied",
      "sources": [
        "licenses",
        "catalog-api",
        "data-model",
        "provide-post-sales-support",
        "navigate-the-full-billing-lifecycle"
      ]
    },
    {
      "id": "p14",
      "lesson": "platform-rules",
      "domain": "platform",
      "stem": "A decision must provide multiple matching outcomes for the same input set. Which BRE capability should be evaluated?",
      "options": [
        "Decision table",
        "Invoice numbering",
        "Contract signature",
        "Product category hierarchy"
      ],
      "correct": [
        0
      ],
      "explanation": "Choose the decision tool based on required matching behavior.",
      "reasons": [
        "It supports multiple matching outcomes.",
        "Numbering does not evaluate business decisions.",
        "It executes an agreement rather than returning rule outcomes.",
        "It organizes discovery."
      ],
      "difficulty": "Applied",
      "sources": [
        "get-to-know-business-rules-engine",
        "build-decisions-with-lookup-tables",
        "orchestrate-rules-with-expression-sets",
        "automate-business-processes"
      ]
    },
    {
      "id": "p15",
      "lesson": "platform-map",
      "domain": "platform",
      "stem": "An org has an installed package with the SBQQ namespace. What does this establish?",
      "options": [
        "It has every native Revenue Management capability enabled",
        "It has Salesforce CPQ installed",
        "It is necessarily Industries CPQ",
        "Its existing QCP runs inside native pricing procedures"
      ],
      "correct": [
        1
      ],
      "explanation": "Confirm product identity before following setup instructions.",
      "reasons": [
        "Package presence does not establish native entitlement.",
        "SBQQ identifies the CPQ managed package.",
        "Industries CPQ uses a distinct product/package family.",
        "Native pricing is a different execution model."
      ],
      "difficulty": "Foundation",
      "sources": [
        "product-identity",
        "data-model",
        "manage-orders",
        "get-started-with-billing-revenue-cloud"
      ]
    },
    {
      "id": "r01",
      "lesson": "readiness-org",
      "domain": "readiness",
      "stem": "An official badge requires a special Revenue Management Developer Edition. The learner has a normal Playground. What should they do?",
      "options": [
        "Install SBQQ to reproduce the exercise automatically",
        "Follow that badge’s supported org signup instructions",
        "Assume every Playground includes native revenue services",
        "Skip licensing checks because they are an administrator"
      ],
      "correct": [
        1
      ],
      "explanation": "Use the org specified by the exercise, not merely any available Salesforce org.",
      "reasons": [
        "That installs a different product.",
        "Prepared org capabilities and sample data are required.",
        "Ordinary Playgrounds may lack required capabilities.",
        "Administrator access does not create entitlement."
      ],
      "difficulty": "Foundation",
      "sources": [
        "setup",
        "licenses",
        "manage-customer-asset-amendments",
        "explore-salesforce-pricing"
      ]
    },
    {
      "id": "r02",
      "lesson": "readiness-org",
      "domain": "readiness",
      "stem": "Which TWO items belong in a pre-build readiness checklist?",
      "options": [
        "A promise that every SKU will be supported in the first sprint",
        "Only the administrator’s successful login",
        "Required licenses, feature prerequisites and persona access",
        "Evidence that a minimal end-to-end slice works"
      ],
      "correct": [
        2,
        3
      ],
      "explanation": "Prove prerequisites and a representative working path before scaling.",
      "reasons": [
        "That is scope expansion, not readiness evidence.",
        "Login does not validate the revenue lifecycle.",
        "These determine whether the capability can operate.",
        "A thin slice exposes missing prerequisites early."
      ],
      "difficulty": "Applied",
      "sources": [
        "setup",
        "licenses",
        "manage-customer-asset-amendments",
        "explore-salesforce-pricing"
      ]
    },
    {
      "id": "r03",
      "lesson": "readiness-discovery",
      "domain": "readiness",
      "stem": "Sales, finance and operations have conflicting first-release priorities. What should the consultant do first?",
      "options": [
        "Build the seller UI before discussing downstream work",
        "Promise every requested customization immediately",
        "Agree measurable cross-team outcomes and decision ownership",
        "Let the loudest stakeholder define all requirements"
      ],
      "correct": [
        2
      ],
      "explanation": "Anchor discovery in business outcomes, boundaries and accountable owners.",
      "reasons": [
        "That can lock in unresolved handoff problems.",
        "That avoids rather than resolves scope and risk.",
        "A shared lifecycle goal resolves competing scope choices.",
        "It ignores accountability across the lifecycle."
      ],
      "difficulty": "Applied",
      "sources": [
        "setup",
        "trail",
        "collaborate-with-salesforce-contracts"
      ]
    },
    {
      "id": "r04",
      "lesson": "readiness-discovery",
      "domain": "readiness",
      "stem": "Which scope statement is most testable?",
      "options": [
        "Reproduce all existing CPQ screens before agreeing financial reconciliation",
        "Enable every available revenue feature in the first release",
        "Complete seller configuration and defer all downstream ownership decisions",
        "Deliver one subscription sale through fulfilled order and reconciled invoice, with named acceptance owners"
      ],
      "correct": [
        3
      ],
      "explanation": "A scope needs explicit inclusions, dependencies and acceptance evidence.",
      "reasons": [
        "UI parity alone does not define a successful lifecycle.",
        "Feature volume is not a bounded outcome.",
        "That leaves critical release boundaries undefined.",
        "It defines boundaries and measurable completion."
      ],
      "difficulty": "Foundation",
      "sources": [
        "setup",
        "trail",
        "collaborate-with-salesforce-contracts"
      ]
    },
    {
      "id": "r05",
      "lesson": "readiness-delivery",
      "domain": "readiness",
      "stem": "New-sale demos pass, but renewals fail because existing asset history is missing. What is the right release response?",
      "options": [
        "Resolve data dependencies and add lifecycle acceptance tests",
        "Hide the Renew action after go-live",
        "Declare UAT complete from the quote demo",
        "Delete all old assets to simplify renewal testing"
      ],
      "correct": [
        0
      ],
      "explanation": "UAT must represent the lifecycle the release promises to support.",
      "reasons": [
        "Renewal readiness is not established by new-sale success.",
        "It conceals rather than resolves a scoped requirement.",
        "The failed lifecycle remains untested.",
        "That destroys the installed base and history."
      ],
      "difficulty": "Applied",
      "sources": [
        "uat",
        "adoption",
        "manage-customer-asset-renewals-and-cancellations",
        "explore-order-orchestration"
      ]
    },
    {
      "id": "r06",
      "lesson": "readiness-delivery",
      "domain": "readiness",
      "stem": "Which TWO tests strengthen product-to-cash acceptance?",
      "options": [
        "A failed external fulfillment call and recovery",
        "Only the quote PDF logo and colors",
        "An effective-dated amendment and resulting asset/billing checks",
        "Only the administrator opening each app"
      ],
      "correct": [
        0,
        2
      ],
      "explanation": "Test both exceptions and post-sale changes using business evidence.",
      "reasons": [
        "It validates an important handoff and exception.",
        "Presentation alone does not prove business correctness.",
        "It tests cross-stage commercial consistency.",
        "App visibility is not lifecycle acceptance."
      ],
      "difficulty": "Applied",
      "sources": [
        "uat",
        "adoption",
        "manage-customer-asset-renewals-and-cancellations",
        "explore-order-orchestration"
      ]
    },
    {
      "id": "r07",
      "lesson": "readiness-migration",
      "domain": "readiness",
      "stem": "A team proposes copying CPQ price rules and QCP code unchanged into native Revenue Management. What should the consultant recommend?",
      "options": [
        "Approve it because both products calculate prices",
        "Replace every rule with a PDF template",
        "Reassess each requirement against native pricing and extension points",
        "Migrate only record IDs and ignore behavior"
      ],
      "correct": [
        2
      ],
      "explanation": "Treat the move as an architectural redesign with reconciliation.",
      "reasons": [
        "Shared purpose does not imply compatible implementation.",
        "Templates do not implement pricing logic.",
        "Execution models and supported configuration differ.",
        "Correct behavior and relationships remain necessary."
      ],
      "difficulty": "Applied",
      "sources": [
        "migration",
        "data-model",
        "differences"
      ]
    },
    {
      "id": "r08",
      "lesson": "readiness-migration",
      "domain": "readiness",
      "stem": "Which TWO questions must a transactional migration plan answer?",
      "options": [
        "How commercial values, dates and quantities will be reconciled",
        "Which color every old page should retain",
        "How open transactions and active customer lifecycle history are handled",
        "How to avoid involving finance entirely"
      ],
      "correct": [
        0,
        2
      ],
      "explanation": "Define scope and prove that the migrated data supports future commercial operations.",
      "reasons": [
        "Record counts alone are insufficient.",
        "Branding does not determine transactional integrity.",
        "Future operations depend on these relationships.",
        "Financial reconciliation requires business ownership."
      ],
      "difficulty": "Applied",
      "sources": [
        "migration",
        "data-model",
        "differences"
      ]
    },
    {
      "id": "r09",
      "lesson": "readiness-discovery",
      "domain": "readiness",
      "stem": "A requirement has no accountable owner and conflicts with an approved release boundary. What is the strongest next action?",
      "options": [
        "Add it to development without updating the scope baseline",
        "Resolve ownership and assess it through change control",
        "Ask the developer to choose the business priority alone",
        "Defer all ownership decisions until the go-live meeting"
      ],
      "correct": [
        1
      ],
      "explanation": "Use governance to evaluate value, cost and risk before changing scope.",
      "reasons": [
        "Unapproved work increases delivery risk.",
        "Scope and decision rights need explicit agreement.",
        "Technical implementation does not resolve stakeholder accountability.",
        "That leaves scope and acceptance unclear during delivery."
      ],
      "difficulty": "Applied",
      "sources": [
        "setup",
        "trail",
        "collaborate-with-salesforce-contracts"
      ]
    },
    {
      "id": "r10",
      "lesson": "readiness-org",
      "domain": "readiness",
      "stem": "A capability is missing from an experienced admin’s org. What should be verified before custom-building it?",
      "options": [
        "Assume System Administrator bypasses every permission-set license",
        "Product entitlement, feature availability and prerequisites",
        "Install Salesforce CPQ and reuse its package objects",
        "Enable the same custom fields used in the previous CPQ org"
      ],
      "correct": [
        1
      ],
      "explanation": "Separate product readiness from user skill and custom development.",
      "reasons": [
        "Administrative access does not provision entitlement.",
        "Missing setup or licensing may explain the gap.",
        "That introduces a different product rather than validating native readiness.",
        "Schema parity does not provision the native service."
      ],
      "difficulty": "Applied",
      "sources": [
        "setup",
        "licenses",
        "manage-customer-asset-amendments",
        "explore-salesforce-pricing"
      ]
    },
    {
      "id": "r11",
      "lesson": "readiness-delivery",
      "domain": "readiness",
      "stem": "Which measure best supports an adoption review after go-live?",
      "options": [
        "Number of custom fields created",
        "Total logins without task or error data",
        "Successful task completion and process quality by persona",
        "Number of unused training slides"
      ],
      "correct": [
        2
      ],
      "explanation": "Measure whether users can perform their actual work reliably.",
      "reasons": [
        "Configuration volume is not adoption.",
        "Login volume alone does not establish success.",
        "It connects use to the intended business outcome.",
        "Training artifacts do not prove behavior changed."
      ],
      "difficulty": "Applied",
      "sources": [
        "uat",
        "adoption",
        "manage-customer-asset-renewals-and-cancellations",
        "explore-order-orchestration"
      ]
    },
    {
      "id": "r12",
      "lesson": "readiness-migration",
      "domain": "readiness",
      "stem": "An integration queries SBQQ quote-line records. What must a native migration plan include?",
      "options": [
        "Only changing the integration’s display name",
        "Assuming every native field has the same API name",
        "Remapping the data contract and reconciling target behavior",
        "Keeping the endpoint while deleting all package fields"
      ],
      "correct": [
        2
      ],
      "explanation": "Integration and reporting workstreams are part of the migration scope.",
      "reasons": [
        "The source schema remains incompatible.",
        "Names and semantics must be explicitly mapped.",
        "The native model does not use that package object as its quote line.",
        "That breaks the existing data contract."
      ],
      "difficulty": "Applied",
      "sources": [
        "migration",
        "data-model",
        "differences"
      ]
    },
    {
      "id": "c01",
      "lesson": "catalog-structure",
      "domain": "catalog",
      "stem": "Sellers need a Tablets category with Business and Consumer subcategories. Which capability fits?",
      "options": [
        "Product classifications used only as navigation folders",
        "Bundle components representing every category",
        "Catalog categories and parent-child category relationships",
        "A separate Product Selling Model for each subcategory"
      ],
      "correct": [
        2
      ],
      "explanation": "Use catalog structure for discovery, not unrelated lifecycle configuration.",
      "reasons": [
        "Classifications provide reusable characteristics, not this hierarchy.",
        "That confuses discovery with commercial composition.",
        "They structure product browsing.",
        "Selling behavior does not define category navigation."
      ],
      "difficulty": "Foundation",
      "sources": [
        "get-started-with-product-catalog-management",
        "create-product-categories-and-attributes"
      ]
    },
    {
      "id": "c02",
      "lesson": "catalog-attributes",
      "domain": "catalog",
      "stem": "Several device offerings share screen-size and connectivity characteristics. How should designers reduce repeated setup?",
      "options": [
        "Create a category and assume its members inherit every attribute",
        "Clone each product with independently defined characteristics",
        "Use a shared classification with reusable attributes",
        "Store common characteristics only in the quote-line description"
      ],
      "correct": [
        2
      ],
      "explanation": "Classifications and reusable attributes improve consistency across related products.",
      "reasons": [
        "Category membership is not classification inheritance.",
        "That duplicates definitions and maintenance.",
        "It provides a common product-characteristic structure.",
        "Free text is not a governed reusable attribute model."
      ],
      "difficulty": "Applied",
      "sources": [
        "work-with-product-classifications",
        "create-product-categories-and-attributes",
        "implement-attribute-based-pricing"
      ]
    },
    {
      "id": "c03",
      "lesson": "catalog-structure",
      "domain": "catalog",
      "stem": "Which TWO statements distinguish categories and classifications?",
      "options": [
        "Classifications provide shared attribute structures",
        "Categories organize product discovery",
        "A category is the same as a configured bundle",
        "A classification automatically grants a negotiated price"
      ],
      "correct": [
        0,
        1
      ],
      "explanation": "Choose the modeling capability based on navigation versus reusable characteristics.",
      "reasons": [
        "They support reusable product definition.",
        "They shape the browsing hierarchy.",
        "Grouping for browsing does not create component structure.",
        "Pricing needs its own configuration."
      ],
      "difficulty": "Foundation",
      "sources": [
        "get-started-with-product-catalog-management",
        "create-product-categories-and-attributes"
      ]
    },
    {
      "id": "c04",
      "lesson": "catalog-bundles",
      "domain": "catalog",
      "stem": "An offer always includes a device and fixed charger, with no seller choices. Which design best fits?",
      "options": [
        "An asset amendment",
        "A configurable bundle solely to add unnecessary choices",
        "A static bundle",
        "A billing schedule group"
      ],
      "correct": [
        2
      ],
      "explanation": "Select the simplest supported structure that expresses the commercial offer.",
      "reasons": [
        "That modifies an existing purchased asset.",
        "That adds complexity without a requirement.",
        "The offer fixes its runtime composition.",
        "That organizes billing schedules."
      ],
      "difficulty": "Foundation",
      "sources": [
        "build-a-simple-product",
        "create-a-product-bundle",
        "discover-order-decomposition"
      ]
    },
    {
      "id": "c05",
      "lesson": "catalog-bundles",
      "domain": "catalog",
      "stem": "A buyer can select an optional warranty and choose device capacity. Which design best fits?",
      "options": [
        "A configurable offering with components and attributes",
        "A static bundle with no configurable behavior",
        "A catalog category alone",
        "An invoice template alone"
      ],
      "correct": [
        0
      ],
      "explanation": "Runtime choices require supported configurable behavior, not just categorization.",
      "reasons": [
        "The choices are runtime configuration requirements.",
        "It would not meet the requested choices.",
        "It does not validate configuration choices.",
        "It formats documents rather than product selection."
      ],
      "difficulty": "Applied",
      "sources": [
        "build-a-simple-product",
        "create-a-product-bundle",
        "discover-order-decomposition"
      ]
    },
    {
      "id": "c06",
      "lesson": "catalog-selling",
      "domain": "catalog",
      "stem": "The same service is sold for a fixed term or as evergreen. What should be evaluated before cloning SKUs?",
      "options": [
        "Product Selling Models and their associated options/prices",
        "Create a category per term and treat category membership as selling behavior",
        "Use only invoice frequency to distinguish fixed-term and evergreen service",
        "Reuse the legacy Subscription Pricing field as the complete native design"
      ],
      "correct": [
        0
      ],
      "explanation": "Native selling models can support different commercial approaches on one product.",
      "reasons": [
        "They separate the product from how it is sold.",
        "Categories organize browsing rather than selling semantics.",
        "Billing cadence does not establish the selling model.",
        "Native selling models decouple this behavior into a separate model."
      ],
      "difficulty": "Foundation",
      "sources": [
        "build-a-simple-product",
        "selling-models",
        "set-up-and-sell-products"
      ]
    },
    {
      "id": "c07",
      "lesson": "catalog-selling",
      "domain": "catalog",
      "stem": "A new product has no price for its selected selling model. What is the most relevant check?",
      "options": [
        "Set an invoice schedule to the desired price",
        "Its selling-model association and corresponding price-book entry",
        "Assign the product to a different category",
        "Change the bundle default quantity until the total matches"
      ],
      "correct": [
        1
      ],
      "explanation": "A product record alone does not guarantee a valid price for every model.",
      "reasons": [
        "Schedules do not establish missing list-price data.",
        "The selected model needs appropriate pricing data.",
        "Discovery does not create the selected model price.",
        "Quantity changes hide rather than repair the missing price."
      ],
      "difficulty": "Applied",
      "sources": [
        "build-a-simple-product",
        "selling-models",
        "set-up-and-sell-products"
      ]
    },
    {
      "id": "c08",
      "lesson": "catalog-attributes",
      "domain": "catalog",
      "stem": "A configurable color attribute should add a surcharge, but changing color leaves price unchanged. What setup is missing or incorrect?",
      "options": [
        "Price-impacting attribute and related pricing logic/mapping",
        "Only make the attribute required and visible",
        "Add a price-book entry for the base model but no attribute logic",
        "Change the catalog category for the premium color"
      ],
      "correct": [
        0
      ],
      "explanation": "Connect the selected characteristic to an actual pricing mechanism.",
      "reasons": [
        "Configurability alone does not create a surcharge.",
        "Visibility and requirement do not implement the surcharge.",
        "The characteristic still lacks its adjustment mechanism.",
        "Category membership is not the stated price driver."
      ],
      "difficulty": "Applied",
      "sources": [
        "work-with-product-classifications",
        "create-product-categories-and-attributes",
        "implement-attribute-based-pricing"
      ]
    },
    {
      "id": "c09",
      "lesson": "catalog-bundles",
      "domain": "catalog",
      "stem": "A fulfillment system needs an internal activation task. How should the catalog design treat it?",
      "options": [
        "Make buyers choose a Salesforce permission set",
        "Use a category name as the activation instruction",
        "Evaluate a technical product mapped from the commercial offer",
        "Always expose it as a priced optional quote item"
      ],
      "correct": [
        2
      ],
      "explanation": "Separate what the customer buys from the work needed to deliver it.",
      "reasons": [
        "Access configuration is not a sellable component.",
        "Navigation text does not model fulfillment.",
        "Internal fulfillment can remain separate from customer-facing choices.",
        "Internal work is not automatically a commercial option."
      ],
      "difficulty": "Applied",
      "sources": [
        "build-a-simple-product",
        "create-a-product-bundle",
        "discover-order-decomposition"
      ]
    },
    {
      "id": "c10",
      "lesson": "catalog-attributes",
      "domain": "catalog",
      "stem": "Which TWO decisions belong to attribute design?",
      "options": [
        "Whether it is configurable and should influence price",
        "The invoice’s cash application status",
        "The external shipment’s actual delivery timestamp",
        "The characteristic’s type and permitted values"
      ],
      "correct": [
        0,
        3
      ],
      "explanation": "Attribute design concerns product characteristics, with explicit downstream pricing implications.",
      "reasons": [
        "These govern runtime behavior and pricing requirements.",
        "That is a financial process.",
        "That is fulfillment evidence.",
        "These define usable product information."
      ],
      "difficulty": "Applied",
      "sources": [
        "work-with-product-classifications",
        "create-product-categories-and-attributes",
        "implement-attribute-based-pricing"
      ]
    },
    {
      "id": "c11",
      "lesson": "catalog-structure",
      "domain": "catalog",
      "stem": "A product should be discoverable in a remote-work buying journey. The SKU already exists. What should be reviewed first?",
      "options": [
        "Create a product classification solely to simulate the browsing journey",
        "Clone the SKU without checking category options",
        "Change the product selling model to a new category label",
        "Its catalog/category membership and discovery availability"
      ],
      "correct": [
        3
      ],
      "explanation": "Solve the browsing requirement before introducing another product identity.",
      "reasons": [
        "Classification reuses attributes rather than defining the category path.",
        "That may create unnecessary duplication.",
        "Selling models describe how to sell, not where to browse.",
        "The requirement is primarily discoverability."
      ],
      "difficulty": "Applied",
      "sources": [
        "get-started-with-product-catalog-management",
        "create-product-categories-and-attributes"
      ]
    },
    {
      "id": "c12",
      "lesson": "catalog-selling",
      "domain": "catalog",
      "stem": "Which TWO are different commercial concepts?",
      "options": [
        "The selling model describing how an offering is sold",
        "A product category and its identical synonym, billing treatment",
        "A recorded payment and its identical synonym, product attribute",
        "The billing treatment describing when amounts are billed"
      ],
      "correct": [
        0,
        3
      ],
      "explanation": "Selling, billing and collection are connected but distinct decisions.",
      "reasons": [
        "It governs the selling approach.",
        "They are not synonymous.",
        "These belong to different lifecycle concerns.",
        "It governs invoicing behavior."
      ],
      "difficulty": "Applied",
      "sources": [
        "build-a-simple-product",
        "selling-models",
        "set-up-and-sell-products"
      ]
    },
    {
      "id": "c13",
      "lesson": "catalog-bundles",
      "domain": "catalog",
      "stem": "A bundle must always include a base device but allow optional support. Which model expresses this directly?",
      "options": [
        "Payment terms and credit memos",
        "Quote header names only",
        "Required and optional product components",
        "Asset renewal dates only"
      ],
      "correct": [
        2
      ],
      "explanation": "Use component structure for what the offer includes.",
      "reasons": [
        "These concern receivables, not bundle composition.",
        "A label does not enforce component behavior.",
        "They define composition and permitted choices.",
        "They concern post-sale continuity."
      ],
      "difficulty": "Applied",
      "sources": [
        "build-a-simple-product",
        "create-a-product-bundle",
        "discover-order-decomposition"
      ]
    },
    {
      "id": "c14",
      "lesson": "catalog-selling",
      "domain": "catalog",
      "stem": "A product charges for measured storage consumption. What is needed beyond a recurring list price?",
      "options": [
        "Only a larger quote quantity entered once",
        "Only a contract PDF",
        "Usage resources, units, rates and entitlement/grant policy",
        "Only a new category name"
      ],
      "correct": [
        2
      ],
      "explanation": "Recurring fees and measured consumption require different supporting inputs.",
      "reasons": [
        "That does not capture ongoing measured usage.",
        "A document does not meter consumption.",
        "Consumption must be measured and rated.",
        "Discovery grouping does not rate usage."
      ],
      "difficulty": "Applied",
      "sources": [
        "build-a-simple-product",
        "selling-models",
        "set-up-and-sell-products"
      ]
    },
    {
      "id": "q01",
      "lesson": "cpq-pricing",
      "domain": "cpq",
      "stem": "A procedure starts at $180, applies a 20% discount, then subtracts $9. Under that explicitly stated sequence, what is the result?",
      "options": [
        "$162",
        "$135",
        "$144",
        "$136.80"
      ],
      "correct": [
        1
      ],
      "explanation": "Reproduce the specified sequence and basis; do not assume an undocumented discount order.",
      "reasons": [
        "That subtracts only the fixed adjustment twice.",
        "180 × 0.80 − 9 = 135.",
        "That omits the fixed adjustment.",
        "That subtracts the fixed adjustment before the percentage."
      ],
      "difficulty": "Applied",
      "sources": [
        "create-a-pricing-procedure-with-the-list-price-element",
        "configure-pricing-for-products",
        "add-volume-and-manual-discounts"
      ]
    },
    {
      "id": "q02",
      "lesson": "cpq-pricing",
      "domain": "cpq",
      "stem": "A new price-book entry is correct, but the expected pricing data is not reflected in the configured service. What should be checked before rewriting logic?",
      "options": [
        "The CPQ calculator’s On After Calculate event",
        "The documented activation/default setup and pricing-data synchronization",
        "The asset’s latest renewal action",
        "The quote’s PDF template merge field"
      ],
      "correct": [
        1
      ],
      "explanation": "Separate service setup and available pricing data from the calculation itself.",
      "reasons": [
        "Legacy package execution events are not the native procedure model.",
        "The service must use the intended active configuration and data.",
        "That does not establish current list-price synchronization.",
        "Presentation is downstream of calculation."
      ],
      "difficulty": "Applied",
      "sources": [
        "create-a-pricing-procedure-with-the-list-price-element",
        "configure-pricing-for-products",
        "add-volume-and-manual-discounts"
      ]
    },
    {
      "id": "q03",
      "lesson": "cpq-advanced",
      "domain": "cpq",
      "stem": "A device’s selected capacity changes its surcharge. Which approach most directly fits?",
      "options": [
        "Attribute-based pricing with the relevant price-impacting attribute",
        "Contract pricing applied to every buyer",
        "Derived pricing based only on a different product’s price",
        "Volume tiers based only on the number of devices"
      ],
      "correct": [
        0
      ],
      "explanation": "Choose the mechanism that matches what changes the price.",
      "reasons": [
        "The commercial driver is a selected characteristic.",
        "The policy is attribute-driven, not negotiated by customer.",
        "The requirement is not a source-product relationship.",
        "Quantity is not the stated driver."
      ],
      "difficulty": "Applied",
      "sources": [
        "implement-attribute-based-pricing",
        "set-up-bundle-based-pricing",
        "explore-derived-pricing-and-discovery-procedures",
        "implement-derived-pricing",
        "set-up-subscription-pricing-with-proration",
        "apply-aggregate-pricing",
        "configure-contract-based-pricing"
      ]
    },
    {
      "id": "q04",
      "lesson": "cpq-advanced",
      "domain": "cpq",
      "stem": "A support product costs a percentage of the price of the eligible primary product. Which mechanism should be evaluated?",
      "options": [
        "A fixed list price copied annually",
        "An asset state-period report",
        "Derived pricing with appropriate source discovery",
        "A volume tier using only support quantity"
      ],
      "correct": [
        2
      ],
      "explanation": "Derived pricing requires finding the appropriate source and applying the dependency.",
      "reasons": [
        "It would not track the primary product’s price.",
        "It explains history rather than calculating this price.",
        "The dependent price comes from another product.",
        "Quantity alone does not identify the source price."
      ],
      "difficulty": "Applied",
      "sources": [
        "implement-attribute-based-pricing",
        "set-up-bundle-based-pricing",
        "explore-derived-pricing-and-discovery-procedures",
        "implement-derived-pricing",
        "set-up-subscription-pricing-with-proration",
        "apply-aggregate-pricing",
        "configure-contract-based-pricing"
      ]
    },
    {
      "id": "q05",
      "lesson": "cpq-advanced",
      "domain": "cpq",
      "stem": "A customer has negotiated headset prices under a selected agreement. Which setup should be evaluated?",
      "options": [
        "Contract Item Prices and applicable adjustments in the pricing procedure",
        "Copying the SBQQ contracted-price record without remapping",
        "A universal public list-price reduction",
        "A category named after the customer"
      ],
      "correct": [
        0
      ],
      "explanation": "Customer-specific contract pricing requires the intended agreement context and native pricing data.",
      "reasons": [
        "This expresses negotiated contract-based terms.",
        "The native data model and procedure must be configured.",
        "That gives the exception to unrelated customers.",
        "Navigation membership is not contract pricing."
      ],
      "difficulty": "Applied",
      "sources": [
        "implement-attribute-based-pricing",
        "set-up-bundle-based-pricing",
        "explore-derived-pricing-and-discovery-procedures",
        "implement-derived-pricing",
        "set-up-subscription-pricing-with-proration",
        "apply-aggregate-pricing",
        "configure-contract-based-pricing"
      ]
    },
    {
      "id": "q06",
      "lesson": "cpq-configure",
      "domain": "cpq",
      "stem": "Selecting a premium module must automatically require a compatible installation service. What configuration behavior fits?",
      "options": [
        "A volume discount on all services",
        "An exclusion of the installation service",
        "A validation message only after order fulfillment",
        "A requirement relationship/rule in the supported configurator"
      ],
      "correct": [
        3
      ],
      "explanation": "Enforce product dependency during configuration with the appropriate supported rule mechanism.",
      "reasons": [
        "Price changes do not enforce the dependency.",
        "That would prevent the required component.",
        "That catches the issue after the required configuration boundary.",
        "It expresses the necessary dependency."
      ],
      "difficulty": "Applied",
      "sources": [
        "get-started-with-product-configurator",
        "create-and-configure-a-product-configurator-flow",
        "use-product-configurator-with-business-rules-engine",
        "explore-product-configurator-with-constraint-rules-engine"
      ]
    },
    {
      "id": "q07",
      "lesson": "cpq-configure",
      "domain": "cpq",
      "stem": "Which TWO cases justify testing beyond default product selections?",
      "options": [
        "Only changing the catalog’s display name",
        "A nested component requiring another product",
        "Only accepting the prepopulated sample quote total",
        "Two mutually incompatible options selected together"
      ],
      "correct": [
        1,
        3
      ],
      "explanation": "Test valid and invalid relationships, including interactions beyond the default configuration.",
      "reasons": [
        "That does not test product relationships.",
        "It tests dependencies across configuration structure.",
        "That does not exercise invalid combinations.",
        "It tests exclusion/validation behavior."
      ],
      "difficulty": "Applied",
      "sources": [
        "get-started-with-product-configurator",
        "create-and-configure-a-product-configurator-flow",
        "use-product-configurator-with-business-rules-engine",
        "explore-product-configurator-with-constraint-rules-engine"
      ]
    },
    {
      "id": "q08",
      "lesson": "cpq-configure",
      "domain": "cpq",
      "stem": "A manufacturer has many interacting compatibility relationships. Maintaining independent rules is becoming unmanageable. What should the consultant evaluate?",
      "options": [
        "Moving compatibility checks entirely into invoice generation",
        "Duplicating every possible combination as an ungoverned SKU",
        "Constraint-based configuration with the supported engine and release",
        "Removing all rules and relying on seller memory"
      ],
      "correct": [
        2
      ],
      "explanation": "Evaluate constraints for complex configuration spaces, while checking actual capability availability.",
      "reasons": [
        "Validation would occur too late.",
        "That can make the model explode in size.",
        "It can model interdependent valid combinations.",
        "It does not enforce valid combinations."
      ],
      "difficulty": "Applied",
      "sources": [
        "get-started-with-product-configurator",
        "create-and-configure-a-product-configurator-flow",
        "use-product-configurator-with-business-rules-engine",
        "explore-product-configurator-with-constraint-rules-engine"
      ]
    },
    {
      "id": "q09",
      "lesson": "cpq-pricing",
      "domain": "cpq",
      "stem": "A discount element receives the correct input but runs before the intended list-price basis is established. What is the most direct fix?",
      "options": [
        "Correct the element sequence and mappings to match policy",
        "Adjust the final output manually for the sample quote only",
        "Apply a second discount to compensate for the first incorrect step",
        "Change the lookup data to force one expected result"
      ],
      "correct": [
        0
      ],
      "explanation": "Intermediate pricing steps must use the correct input and run in the intended order.",
      "reasons": [
        "The dependency is inside the procedure.",
        "That does not fix the procedure dependency.",
        "Compensation obscures the policy and may fail other cases.",
        "That hides an execution-order defect."
      ],
      "difficulty": "Applied",
      "sources": [
        "create-a-pricing-procedure-with-the-list-price-element",
        "configure-pricing-for-products",
        "add-volume-and-manual-discounts"
      ]
    },
    {
      "id": "q10",
      "lesson": "cpq-advanced",
      "domain": "cpq",
      "stem": "A consultant uses Aggregate Price and assumes supported child totals will automatically populate every quote header total. What should be verified?",
      "options": [
        "Assume every CPQ header rollup has an identical native target",
        "The feature’s supported aggregation scope and output mapping",
        "Move the aggregate element earlier without checking outputs",
        "Write the displayed child total into every quote line"
      ],
      "correct": [
        1
      ],
      "explanation": "Read the supported scope and explicitly validate where rolled-up values are written.",
      "reasons": [
        "Package behavior is not evidence of native feature scope.",
        "Line-level rollups do not imply a universal header rollup.",
        "Ordering alone does not expand the supported target scope.",
        "That can multiply totals instead of implementing the intended rollup."
      ],
      "difficulty": "Applied",
      "sources": [
        "implement-attribute-based-pricing",
        "set-up-bundle-based-pricing",
        "explore-derived-pricing-and-discovery-procedures",
        "implement-derived-pricing",
        "set-up-subscription-pricing-with-proration",
        "apply-aggregate-pricing",
        "configure-contract-based-pricing"
      ]
    },
    {
      "id": "q11",
      "lesson": "cpq-advanced",
      "domain": "cpq",
      "stem": "A partial service period is priced incorrectly after a CPQ migration. Which TWO checks are most relevant?",
      "options": [
        "The CPQ certificate held by the sales user",
        "The native proration convention and effective dates",
        "The applicable pricing elements and mapped duration inputs",
        "The assumption that all CPQ proration settings transfer unchanged"
      ],
      "correct": [
        1,
        2
      ],
      "explanation": "Validate the native date convention and calculation rather than importing legacy settings untested.",
      "reasons": [
        "Certification does not define date arithmetic.",
        "Time basis determines the partial-period amount.",
        "The procedure must receive and use those inputs.",
        "That assumption is precisely what needs validation."
      ],
      "difficulty": "Applied",
      "sources": [
        "implement-attribute-based-pricing",
        "set-up-bundle-based-pricing",
        "explore-derived-pricing-and-discovery-procedures",
        "implement-derived-pricing",
        "set-up-subscription-pricing-with-proration",
        "apply-aggregate-pricing",
        "configure-contract-based-pricing"
      ]
    },
    {
      "id": "q12",
      "lesson": "cpq-transact",
      "domain": "cpq",
      "stem": "An agent creates a quote after a vague request. The seller has not confirmed the term or required components. What should happen next?",
      "options": [
        "Send it because AI output is automatically authoritative",
        "Disable configuration checks to let the agent finish",
        "Treat it as a fulfilled order immediately",
        "Clarify missing requirements and review the configured/priced quote"
      ],
      "correct": [
        3
      ],
      "explanation": "Agent-assisted quoting still depends on valid inputs, rules and review.",
      "reasons": [
        "Agent output still needs business validation.",
        "That removes the commercial guardrails.",
        "Quote generation is not fulfillment.",
        "The seller must validate commercial correctness."
      ],
      "difficulty": "Applied",
      "sources": [
        "work-with-quotes",
        "discover-and-configure-products",
        "agent"
      ]
    },
    {
      "id": "q13",
      "lesson": "cpq-transact",
      "domain": "cpq",
      "stem": "A quoting-agent user receives access errors while an administrator succeeds. Which investigation is best?",
      "options": [
        "Check the user’s agent access and required data/action permissions",
        "Make every seller a system administrator",
        "Copy the administrator’s quote PDF",
        "Remove all pricing guardrails"
      ],
      "correct": [
        0
      ],
      "explanation": "Verify the user’s authorized capabilities instead of broadly elevating access.",
      "reasons": [
        "The actual persona may lack the needed access.",
        "That bypasses least-privilege design.",
        "A document copy does not grant authorized actions.",
        "Pricing policy is not the access remedy."
      ],
      "difficulty": "Applied",
      "sources": [
        "work-with-quotes",
        "discover-and-configure-products",
        "agent"
      ]
    },
    {
      "id": "q14",
      "lesson": "cpq-advanced",
      "domain": "cpq",
      "stem": "A component should receive a discount only when purchased inside a specific bundle. Which mechanism most directly reflects the policy?",
      "options": [
        "A customer-specific payment term",
        "Bundle-based adjustment",
        "A universal list-price reduction",
        "A renewal-only asset action"
      ],
      "correct": [
        1
      ],
      "explanation": "Preserve the distinction between standalone and in-bundle pricing.",
      "reasons": [
        "Payment due dates do not express bundle discounts.",
        "The adjustment depends on the purchase context.",
        "It also changes standalone sales.",
        "The requirement concerns new transaction pricing."
      ],
      "difficulty": "Applied",
      "sources": [
        "implement-attribute-based-pricing",
        "set-up-bundle-based-pricing",
        "explore-derived-pricing-and-discovery-procedures",
        "implement-derived-pricing",
        "set-up-subscription-pricing-with-proration",
        "apply-aggregate-pricing",
        "configure-contract-based-pricing"
      ]
    },
    {
      "id": "q15",
      "lesson": "cpq-pricing",
      "domain": "cpq",
      "stem": "The pricing procedure works for one currency but a second scenario returns no list price. What should be inspected first?",
      "options": [
        "Matching price-book/selling-model data and context inputs",
        "Rewrite the list-price formula before checking the failing data combination",
        "Reuse the previous currency amount without matching currency data",
        "Change the quote display currency without checking service inputs"
      ],
      "correct": [
        0
      ],
      "explanation": "A no-match input/data problem needs different troubleshooting from an incorrect formula.",
      "reasons": [
        "The failing lookup may lack the required combination.",
        "A lookup no-match does not establish a formula defect.",
        "That does not validate the required commercial price.",
        "Presentation does not prove the price lookup received the right input."
      ],
      "difficulty": "Applied",
      "sources": [
        "create-a-pricing-procedure-with-the-list-price-element",
        "configure-pricing-for-products",
        "add-volume-and-manual-discounts"
      ]
    },
    {
      "id": "o01",
      "lesson": "contracts-legal",
      "domain": "contracts",
      "stem": "Sales contracts and NDAs need different lifecycle stages and permitted actions. Which design best fits?",
      "options": [
        "Only a single quote-status picklist shared by all agreements",
        "A billing schedule for each draft clause",
        "Contract types and appropriate state models",
        "Product selling models for every legal approval stage"
      ],
      "correct": [
        2
      ],
      "explanation": "Use legal lifecycle capabilities for agreement-specific states and governance.",
      "reasons": [
        "That does not model distinct legal lifecycles.",
        "Billing schedules do not govern legal negotiation.",
        "These govern the agreement lifecycle and actions.",
        "Selling models govern commercial selling behavior."
      ],
      "difficulty": "Foundation",
      "sources": [
        "meet-salesforce-contracts",
        "dive-into-salesforce-contracts-capabilities",
        "collaborate-with-salesforce-contracts"
      ]
    },
    {
      "id": "o02",
      "lesson": "contracts-legal",
      "domain": "contracts",
      "stem": "Legal wants approved wording reused while preserving negotiated changes. Which TWO capabilities are relevant?",
      "options": [
        "Document version management",
        "Deleting previous versions after every redline",
        "A clause library and governed document templates",
        "A price-book entry per paragraph"
      ],
      "correct": [
        0,
        2
      ],
      "explanation": "Standardize content and preserve its evolution; signing and delivery remain separate stages.",
      "reasons": [
        "It preserves changes during negotiation.",
        "That removes the negotiation history.",
        "They standardize initial agreement content.",
        "Pricing data is not legal content governance."
      ],
      "difficulty": "Applied",
      "sources": [
        "meet-salesforce-contracts",
        "dive-into-salesforce-contracts-capabilities",
        "collaborate-with-salesforce-contracts"
      ]
    },
    {
      "id": "o03",
      "lesson": "contracts-decompose",
      "domain": "contracts",
      "stem": "A single commercial bundle requires hardware shipping and hidden license activation. What is the role of decomposition?",
      "options": [
        "Create two unrelated customer purchases",
        "Mark every invoice as paid",
        "Translate the commercial purchase into fulfillment requests/technical work",
        "Apply a bundle discount"
      ],
      "correct": [
        2
      ],
      "explanation": "Decomposition bridges commercial products and the technical work needed to fulfill them.",
      "reasons": [
        "That loses the single commercial intent.",
        "That requires financial processing.",
        "It maps what was sold to downstream delivery requirements.",
        "That is a pricing responsibility."
      ],
      "difficulty": "Foundation",
      "sources": [
        "meet-dynamic-revenue-orchestrator",
        "discover-order-decomposition",
        "define-an-order-decomposition"
      ]
    },
    {
      "id": "o04",
      "lesson": "contracts-decompose",
      "domain": "contracts",
      "stem": "A simple order can be fulfilled directly without commercial-to-technical translation. Must it always be decomposed first?",
      "options": [
        "Yes; otherwise no product can have a list price",
        "No; it must skip fulfillment entirely",
        "No; evaluate direct orchestration for the simple order",
        "Yes; all orchestration requires decomposition"
      ],
      "correct": [
        2
      ],
      "explanation": "Use decomposition when the fulfillment design needs it, rather than making it an unnecessary universal step.",
      "reasons": [
        "Pricing and decomposition are different concerns.",
        "Skipping decomposition does not mean skipping delivery.",
        "Simple orders can skip decomposition.",
        "The platform supports simple orchestration without it."
      ],
      "difficulty": "Applied",
      "sources": [
        "meet-dynamic-revenue-orchestrator",
        "discover-order-decomposition",
        "define-an-order-decomposition"
      ]
    },
    {
      "id": "o05",
      "lesson": "contracts-orchestrate",
      "domain": "contracts",
      "stem": "A provisioning task must call an external service. Which step type is most directly appropriate?",
      "options": [
        "Pause with no completion signal",
        "Callout",
        "Milestone alone",
        "Manual Task solely to avoid integration design"
      ],
      "correct": [
        1
      ],
      "explanation": "Choose the step type by the work and define the downstream completion evidence.",
      "reasons": [
        "Waiting does not perform provisioning.",
        "It invokes a third-party system.",
        "A marker does not execute the external operation.",
        "That substitutes human work for the stated automation."
      ],
      "difficulty": "Applied",
      "sources": [
        "explore-order-orchestration",
        "design-a-simple-order-orchestration",
        "design-an-orchestration-plan",
        "define-dependencies-and-fulfillment-scenarios"
      ]
    },
    {
      "id": "o06",
      "lesson": "contracts-orchestrate",
      "domain": "contracts",
      "stem": "Invoice generation must wait for delivery and activation in separate lanes. What should be configured?",
      "options": [
        "Dependencies from both required completion steps",
        "Use a scheduled delay instead of completion dependencies",
        "Generate an invoice independently in each lane",
        "Put the invoice step in a new lane without dependencies"
      ],
      "correct": [
        0
      ],
      "explanation": "Express the actual prerequisites instead of relying on timing assumptions.",
      "reasons": [
        "Cross-lane prerequisites express the business condition.",
        "Elapsed time is not evidence of fulfillment completion.",
        "That can bill early or duplicate the intended action.",
        "Lane placement alone does not enforce prerequisites."
      ],
      "difficulty": "Applied",
      "sources": [
        "explore-order-orchestration",
        "design-a-simple-order-orchestration",
        "design-an-orchestration-plan",
        "define-dependencies-and-fulfillment-scenarios"
      ]
    },
    {
      "id": "o07",
      "lesson": "contracts-orchestrate",
      "domain": "contracts",
      "stem": "A task should run once per fulfillment plan, but currently runs for each order line. What should be checked?",
      "options": [
        "Only the dependency sequence",
        "The fulfillment step scope",
        "Only the callout endpoint URL",
        "Only the product’s list price"
      ],
      "correct": [
        1
      ],
      "explanation": "Scope and dependencies are separate: one defines instances, the other defines prerequisites.",
      "reasons": [
        "Dependencies control prerequisites, not necessarily instance scope.",
        "Scope controls how often the step is instantiated.",
        "The endpoint does not determine plan-versus-line instantiation.",
        "The commercial amount does not set fulfillment step scope."
      ],
      "difficulty": "Applied",
      "sources": [
        "explore-order-orchestration",
        "design-a-simple-order-orchestration",
        "design-an-orchestration-plan",
        "define-dependencies-and-fulfillment-scenarios"
      ]
    },
    {
      "id": "o08",
      "lesson": "contracts-recovery",
      "domain": "contracts",
      "stem": "An external task times out. The remote system may already have provisioned the service. What is the safest next step?",
      "options": [
        "Delete the customer asset to reset the process",
        "Resubmit the whole order immediately",
        "Mark the order fulfilled without evidence",
        "Reconcile the remote result using identifiers, then recover the affected step"
      ],
      "correct": [
        3
      ],
      "explanation": "An ambiguous timeout needs reconciliation before retry.",
      "reasons": [
        "That destroys history and does not reconcile the call.",
        "That can duplicate provisioned service.",
        "A timeout does not prove completion.",
        "It avoids repeating a completed side effect."
      ],
      "difficulty": "Applied",
      "sources": [
        "explore-order-orchestration",
        "execute-an-orchestration-plan"
      ]
    },
    {
      "id": "o09",
      "lesson": "contracts-recovery",
      "domain": "contracts",
      "stem": "Which TWO concerns should be distinguished in fulfillment operations?",
      "options": [
        "Record creation as proof external delivery succeeded",
        "Quote acceptance as proof all tasks completed",
        "Actual fulfillment fallout and its recovery",
        "Timing/SLA risk and its escalation"
      ],
      "correct": [
        2,
        3
      ],
      "explanation": "Observe the real handoff state and give operations an accountable recovery process.",
      "reasons": [
        "A local record is not delivery evidence.",
        "Acceptance does not prove downstream success.",
        "A failure needs diagnosis and safe remediation.",
        "A task can be at risk without having failed."
      ],
      "difficulty": "Applied",
      "sources": [
        "explore-order-orchestration",
        "execute-an-orchestration-plan"
      ]
    },
    {
      "id": "a01",
      "lesson": "assets-history",
      "domain": "assets",
      "stem": "Which concept best answers “what changed on this date?” for a managed asset?",
      "options": [
        "Asset Action",
        "Asset State Period",
        "Only the current asset quantity",
        "The product’s current selling-model definition"
      ],
      "correct": [
        0
      ],
      "explanation": "Use the action for the event and the state period for the dated interval.",
      "reasons": [
        "It represents a dated lifecycle change.",
        "It describes the interval, not the change event.",
        "The current total does not identify the dated event.",
        "Product design is not the customer asset’s change history."
      ],
      "difficulty": "Foundation",
      "sources": [
        "provide-post-sales-support",
        "build-loyalty-through-post-sale-engagement"
      ]
    },
    {
      "id": "a02",
      "lesson": "assets-history",
      "domain": "assets",
      "stem": "Support needs the asset quantity as of three months ago, before an upsell. What should they inspect?",
      "options": [
        "Only the current asset quantity",
        "The most recent renewal quote only",
        "Sum all state periods as simultaneous quantities",
        "The asset state period covering that date"
      ],
      "correct": [
        3
      ],
      "explanation": "Answer a historical question from effective-dated state, not today’s totals.",
      "reasons": [
        "It omits the earlier state.",
        "It may not represent the period before the upsell.",
        "Intervals are not concurrent entitlements to sum indiscriminately.",
        "It represents quantity/value during that interval."
      ],
      "difficulty": "Applied",
      "sources": [
        "provide-post-sales-support",
        "build-loyalty-through-post-sale-engagement"
      ]
    },
    {
      "id": "a03",
      "lesson": "assets-amend",
      "domain": "assets",
      "stem": "A customer owns 20 seats and requests six more effective next month. Which plan best matches?",
      "options": [
        "Overwrite the asset quantity today and omit a transaction",
        "Create an unrelated new 26-seat sale without referencing the asset",
        "Renew the existing 20 seats immediately without changing quantity",
        "Amend the existing asset, verify total 26 and the effective-dated charge"
      ],
      "correct": [
        3
      ],
      "explanation": "Verify both the resulting entitlement and the change’s commercial amount/date.",
      "reasons": [
        "That loses the intended timing and history.",
        "That risks duplicating the existing entitlement.",
        "That does not implement the requested increase.",
        "The business intent is an installed-base increase."
      ],
      "difficulty": "Applied",
      "sources": [
        "manage-customer-asset-amendments",
        "provide-post-sales-support"
      ]
    },
    {
      "id": "a04",
      "lesson": "assets-amend",
      "domain": "assets",
      "stem": "A draft amendment quote has been generated. Which conclusion is safe?",
      "options": [
        "The customer was automatically refunded",
        "The asset necessarily reflects the final new quantity",
        "The proposal exists; processing and resulting asset state still need verification",
        "Historical state periods can now be deleted"
      ],
      "correct": [
        2
      ],
      "explanation": "Complete the supported transaction flow and reconcile asset history.",
      "reasons": [
        "That is a separate financial outcome.",
        "The transaction may not have been processed.",
        "Drafting is not proof of the completed lifecycle change.",
        "They remain important for audit and dates."
      ],
      "difficulty": "Applied",
      "sources": [
        "manage-customer-asset-amendments",
        "provide-post-sales-support"
      ]
    },
    {
      "id": "a05",
      "lesson": "assets-renew",
      "domain": "assets",
      "stem": "A subscription expires soon and the customer requests another year, with new agreed prices. What is the appropriate starting point?",
      "options": [
        "Reuse the old discount without checking the new agreement",
        "Cancel and delete all history before a new sale",
        "Directly extend the asset date without a transaction",
        "Renew the managed asset with verified next-term dates and pricing"
      ],
      "correct": [
        3
      ],
      "explanation": "Renewal requires explicit next-term dates, quantity and applicable pricing.",
      "reasons": [
        "The request includes changed commercial terms.",
        "That loses continuity and auditability.",
        "That bypasses the commercial lifecycle.",
        "It preserves the relationship to the existing service."
      ],
      "difficulty": "Applied",
      "sources": [
        "manage-customer-asset-renewals-and-cancellations",
        "configure-contract-based-pricing"
      ]
    },
    {
      "id": "a06",
      "lesson": "assets-cancel",
      "domain": "assets",
      "stem": "A customer ends prepaid service early. What TWO outcomes should be verified separately?",
      "options": [
        "That a cancellation request automatically settles every invoice",
        "That deleting the asset automatically returns cash",
        "The effective-dated service/asset cancellation",
        "The required credit/refund and payment processing"
      ],
      "correct": [
        2,
        3
      ],
      "explanation": "A service termination, credit and refund are related but distinct outcomes.",
      "reasons": [
        "The request does not prove financial settlement.",
        "Deletion is not a refund process.",
        "It proves when the service ends.",
        "Financial correction and cash movement need their own evidence."
      ],
      "difficulty": "Applied",
      "sources": [
        "manage-customer-asset-renewals-and-cancellations",
        "navigate-the-full-billing-lifecycle"
      ]
    },
    {
      "id": "a07",
      "lesson": "assets-history",
      "domain": "assets",
      "stem": "Why retain multiple asset state periods after an amendment?",
      "options": [
        "They preserve what quantity and value applied during different intervals",
        "Each period is a separate active product to bill in full today",
        "They prove the customer paid every invoice",
        "They replace the need for any asset actions"
      ],
      "correct": [
        0
      ],
      "explanation": "Use intervals for time-based state without treating every interval as a current entitlement.",
      "reasons": [
        "Historical state supports later analysis and changes.",
        "That would double-count history.",
        "Asset state does not establish payment.",
        "Events and intervals provide different evidence."
      ],
      "difficulty": "Foundation",
      "sources": [
        "provide-post-sales-support",
        "build-loyalty-through-post-sale-engagement"
      ]
    },
    {
      "id": "a08",
      "lesson": "assets-amend",
      "domain": "assets",
      "stem": "The request says “increase to eight seats,” but the UI expects an added quantity. What should the consultant do?",
      "options": [
        "Change the product’s list price to eight",
        "Enter eight without checking existing quantity",
        "Use renewal to avoid understanding the input",
        "Reconcile existing quantity and input semantics before processing"
      ],
      "correct": [
        3
      ],
      "explanation": "Always state the existing quantity, intended total, delta and effective date.",
      "reasons": [
        "That confuses price with quantity.",
        "That may add eight instead of setting eight.",
        "That does not fix the amendment semantics.",
        "A resulting total and a delta are different values."
      ],
      "difficulty": "Applied",
      "sources": [
        "manage-customer-asset-amendments",
        "provide-post-sales-support"
      ]
    },
    {
      "id": "a09",
      "lesson": "assets-renew",
      "domain": "assets",
      "stem": "Which TWO checks help prevent an invalid renewal?",
      "options": [
        "Verify the prior end date and intended next-term dates",
        "Treat a generated quote as proof the asset already renewed",
        "Verify the applicable commercial terms and generated transaction",
        "Assume renewal always preserves all historic discounts"
      ],
      "correct": [
        0,
        2
      ],
      "explanation": "A complete renewal includes date continuity and correct commercial treatment.",
      "reasons": [
        "This detects unintended gaps or overlaps.",
        "Processing and asset reconciliation are still needed.",
        "The new term may use different pricing.",
        "That ignores the new agreement and pricing policy."
      ],
      "difficulty": "Applied",
      "sources": [
        "manage-customer-asset-renewals-and-cancellations",
        "configure-contract-based-pricing"
      ]
    },
    {
      "id": "a10",
      "lesson": "assets-cancel",
      "domain": "assets",
      "stem": "A cancellation credit memo exists. Can support tell the customer that cash has been returned?",
      "options": [
        "Yes; an asset cancellation automatically settles payments",
        "Yes; a credit memo always proves a refund",
        "No; credit memos can never be involved in a refund process",
        "Only after confirming an actual refund/payment outcome"
      ],
      "correct": [
        3
      ],
      "explanation": "Communicate the financial state that is actually evidenced.",
      "reasons": [
        "Settlement needs separate verification.",
        "These are different financial events.",
        "They can be related, but are not identical.",
        "A credit changes the amount owed, not necessarily cash."
      ],
      "difficulty": "Applied",
      "sources": [
        "manage-customer-asset-renewals-and-cancellations",
        "navigate-the-full-billing-lifecycle"
      ]
    },
    {
      "id": "a11",
      "lesson": "assets-history",
      "domain": "assets",
      "stem": "A report sums current recurring revenue together with every historical state period. Why is the result suspect?",
      "options": [
        "It mixes current state with historical intervals",
        "Every historical period is always a new current sale",
        "Recurring revenue cannot be reported at all",
        "Asset actions must always be invoices"
      ],
      "correct": [
        0
      ],
      "explanation": "Define the reporting date and grain before aggregating asset history.",
      "reasons": [
        "That can count the same lifecycle repeatedly.",
        "Periods describe changes over time.",
        "It can be reported with the correct definitions.",
        "The objects have different roles."
      ],
      "difficulty": "Applied",
      "sources": [
        "provide-post-sales-support",
        "build-loyalty-through-post-sale-engagement"
      ]
    },
    {
      "id": "a12",
      "lesson": "assets-cancel",
      "domain": "assets",
      "stem": "A customer wants more licenses now, an extension next year and termination of another service. How should requests be classified?",
      "options": [
        "All three are unrelated new sales",
        "All three are immediate cancellations",
        "Amendment, renewal and cancellation respectively",
        "All three are invoice-template changes"
      ],
      "correct": [
        2
      ],
      "explanation": "Choose the process by business intent and effective date.",
      "reasons": [
        "That loses installed-base intent.",
        "Only the final request terminates service.",
        "Each expresses a different lifecycle event.",
        "Document formatting does not implement these events."
      ],
      "difficulty": "Foundation",
      "sources": [
        "manage-customer-asset-renewals-and-cancellations",
        "navigate-the-full-billing-lifecycle"
      ]
    },
    {
      "id": "a13",
      "lesson": "assets-history",
      "domain": "assets",
      "stem": "Which TWO kinds of offerings can a managed-asset design represent?",
      "options": [
        "Only a tax payment receipt",
        "Purchased subscriptions or services",
        "Only the CPQ package’s subscription object",
        "Purchased products and relevant bundles"
      ],
      "correct": [
        1,
        3
      ],
      "explanation": "Start from the customer’s purchased offering and its lifecycle requirements.",
      "reasons": [
        "That is a financial record, not the full managed offering.",
        "Managed assets are not limited to physical equipment.",
        "Native assets are a different model.",
        "The installed base can include these offerings."
      ],
      "difficulty": "Foundation",
      "sources": [
        "provide-post-sales-support",
        "build-loyalty-through-post-sale-engagement"
      ]
    },
    {
      "id": "i01",
      "lesson": "invoice-policy",
      "domain": "invoices",
      "stem": "A project bills 25% upfront and 75% on acceptance, each due in 30 days. Which design separates the concerns correctly?",
      "options": [
        "A catalog category per due date",
        "Billing treatment items for milestone allocations, payment terms for due dates",
        "A 75% quote discount followed by manual invoice edits",
        "A 30-day product subscription term for every milestone"
      ],
      "correct": [
        1
      ],
      "explanation": "Model billing allocations separately from when payment is due.",
      "reasons": [
        "Browsing structure does not implement milestone billing.",
        "The two concerns are invoice events and payment timing.",
        "That changes commercial amounts instead of scheduling them.",
        "That confuses service term with payment due dates."
      ],
      "difficulty": "Applied",
      "sources": [
        "explore-billing-features-and-roles",
        "generate-invoices"
      ]
    },
    {
      "id": "i02",
      "lesson": "invoice-policy",
      "domain": "invoices",
      "stem": "The right amount is billed to the wrong contact with incorrect payment terms. What should be inspected first?",
      "options": [
        "Customer billing profile and its applied preferences",
        "The product’s compatibility constraints",
        "The asset’s original category",
        "The volume-discount tiers"
      ],
      "correct": [
        0
      ],
      "explanation": "Troubleshoot customer billing data rather than unrelated commercial calculations.",
      "reasons": [
        "It supplies customer-specific invoicing details.",
        "Those validate product combinations.",
        "It does not determine billing contact or terms.",
        "The amount is already correct."
      ],
      "difficulty": "Foundation",
      "sources": [
        "explore-billing-features-and-roles",
        "generate-invoices"
      ]
    },
    {
      "id": "i03",
      "lesson": "invoice-schedules",
      "domain": "invoices",
      "stem": "A correct annual quote should generate monthly invoices, but the invoice timing is wrong. Where is the most relevant investigation?",
      "options": [
        "Changing the customer’s product configuration",
        "Changing list price solely to fix dates",
        "Billing policy/treatment and the generated billing schedules",
        "Deleting the order and every asset period"
      ],
      "correct": [
        2
      ],
      "explanation": "Follow order-product billing configuration through schedules to invoice eligibility.",
      "reasons": [
        "Configuration is not the first timing remedy.",
        "That changes the amount without fixing timing.",
        "They determine invoicing behavior over time.",
        "That destroys evidence without diagnosing the schedule."
      ],
      "difficulty": "Applied",
      "sources": [
        "get-started-with-billing-revenue-cloud",
        "generate-invoices",
        "explore-billing-features-and-roles"
      ]
    },
    {
      "id": "i04",
      "lesson": "invoice-usage",
      "domain": "invoices",
      "stem": "A usage invoice doubled after a source batch was resent. What evidence is most useful?",
      "options": [
        "Only the current wallet balance without history",
        "Only the quote’s recurring list price",
        "Source identifiers, usage records and processed summaries",
        "Only the invoice template text"
      ],
      "correct": [
        2
      ],
      "explanation": "Reconcile source consumption through processing before changing valid rates or prices.",
      "reasons": [
        "A balance alone may not explain duplicate processing.",
        "It does not show the actual consumed units.",
        "They allow duplicate measurement to be traced.",
        "Presentation does not establish usage provenance."
      ],
      "difficulty": "Applied",
      "sources": [
        "get-to-know-usage-management",
        "set-up-and-sell-products",
        "manage-wallets-and-track-consumption"
      ]
    },
    {
      "id": "i05",
      "lesson": "invoice-finance",
      "domain": "invoices",
      "stem": "Which TWO statements correctly distinguish financial events?",
      "options": [
        "A refund returns funds",
        "A credit memo adjusts an amount owed",
        "An invoice proves revenue recognition is complete",
        "A quote total proves cash was collected"
      ],
      "correct": [
        0,
        1
      ],
      "explanation": "Do not infer accounting or cash outcomes from a different lifecycle document.",
      "reasons": [
        "It represents cash returned to the customer.",
        "It is a billing correction document.",
        "Accounting treatment requires separate policy and evidence.",
        "A proposal is not a payment."
      ],
      "difficulty": "Foundation",
      "sources": [
        "navigate-the-full-billing-lifecycle",
        "explore-billing-features-and-roles"
      ]
    },
    {
      "id": "i06",
      "lesson": "invoice-usage",
      "domain": "invoices",
      "stem": "An offer includes a usage allowance with overage pricing. Which model supports validation of consumption and charges?",
      "options": [
        "A price book without any usage capture",
        "A static quote quantity permanently used as the meter",
        "A monthly invoice date used as the usage unit",
        "Resources/units, entitlement policy, usage records and applicable rates"
      ],
      "correct": [
        3
      ],
      "explanation": "Model the measurable resource, entitlement and rating flow rather than treating an invoice as the meter.",
      "reasons": [
        "No evidence connects the charge to consumption.",
        "That does not track subsequent actual usage.",
        "A billing date does not measure consumption.",
        "Together they explain measured usage and its treatment."
      ],
      "difficulty": "Applied",
      "sources": [
        "get-to-know-usage-management",
        "set-up-and-sell-products",
        "manage-wallets-and-track-consumption"
      ]
    },
    {
      "id": "transfer-platform-map",
      "lesson": "platform-map",
      "domain": "platform",
      "stem": "An analyst needs the committed amendment and the installed quantity effective two months ago. Which pair of evidence sources best answers the two different questions?",
      "options": [
        "Contract status and the account’s most recently modified asset.",
        "The latest quote lines and the current Asset quantity.",
        "The original order total and the latest invoice total.",
        "Processed amendment order lines and the effective asset state/history."
      ],
      "correct": [
        3
      ],
      "explanation": "Committed change and effective installed state require transaction lineage and dated lifecycle evidence.",
      "reasons": [
        "Status and last-modified ordering do not define effective historical quantity.",
        "A proposed offer and today’s quantity do not establish a past committed position.",
        "Financial totals do not establish seat quantities or the specific amendment.",
        "Committed change and effective installed state require transaction lineage and dated lifecycle evidence."
      ],
      "difficulty": "Transfer",
      "assessment": "transfer",
      "sources": [
        "product-identity",
        "data-model",
        "manage-orders",
        "get-started-with-billing-revenue-cloud"
      ]
    },
    {
      "id": "transfer-platform-context",
      "lesson": "platform-context",
      "domain": "platform",
      "stem": "A pricing simulation returns the intended regional discount when Region is entered manually. A saved quote receives no discount although Account.Region is populated. What is the best next investigation?",
      "options": [
        "Compare live hydration/mapping/tag inputs and selected procedure with the simulation.",
        "Add the same discount as a manual adjustment on every affected quote.",
        "Refresh the discount table first because Account.Region exists.",
        "Persist the manually simulated context directly into the Account record."
      ],
      "correct": [
        0
      ],
      "explanation": "Typed simulation inputs bypass live hydration. Trace the actual definition, mappings, tags, access and consuming procedure.",
      "reasons": [
        "Typed simulation inputs bypass live hydration. Trace the actual definition, mappings, tags, access and consuming procedure.",
        "This can hide the defect and duplicate discounts once the real mapping is fixed.",
        "Existing source data does not prove it reaches the runtime decision; a refresh may be needed but is not established as the cause.",
        "Runtime context and source persistence are separate concerns; overwriting Account does not repair the missing service input."
      ],
      "difficulty": "Transfer",
      "assessment": "transfer",
      "sources": [
        "get-to-know-context-service",
        "explore-context-service-components-and-processes"
      ]
    },
    {
      "id": "transfer-platform-rules",
      "lesson": "platform-rules",
      "domain": "platform",
      "stem": "A policy must apply consistently in guided sales and a partner API. Currently it exists only in a screen flow. Which design best meets the requirement?",
      "options": [
        "Add the screen flow to the seller Lightning page and leave the API unchanged.",
        "Duplicate the screen’s formulas in the partner application and compare results quarterly.",
        "Use an after-save Flow to correct every partner price after the API reports success.",
        "Expose shared decision logic through supported transaction services and let the screen collect inputs."
      ],
      "correct": [
        3
      ],
      "explanation": "Shared service-level decision behavior can be used by both channels, with UI guidance kept separate.",
      "reasons": [
        "Page assignment only addresses the UI channel.",
        "Duplicated policy implementations can diverge between releases.",
        "After-success correction leaves a period of invalid results and does not replace supported synchronous transaction validation.",
        "Shared service-level decision behavior can be used by both channels, with UI guidance kept separate."
      ],
      "difficulty": "Transfer",
      "assessment": "transfer",
      "sources": [
        "get-to-know-business-rules-engine",
        "build-decisions-with-lookup-tables",
        "orchestrate-rules-with-expression-sets",
        "automate-business-processes"
      ]
    },
    {
      "id": "transfer-platform-access",
      "lesson": "platform-access",
      "domain": "platform",
      "stem": "A quote-to-lines report repeats header amounts three times, while a fixed-running-user dashboard exposes records sellers should not see. Choose two appropriate corrections.",
      "options": [
        "Review dashboard running-user/viewer behavior and verify seller visibility.",
        "Hide line detail rows while continuing to sum repeated quote amounts.",
        "Rebuild the revenue aggregation at the intended quote grain.",
        "Remove QuoteLineItem field access from sellers to correct both issues."
      ],
      "correct": [
        2,
        0
      ],
      "explanation": "The aggregation must count each quote amount once at the intended grain.",
      "reasons": [
        "Dashboard security context must be tested with known visible and hidden records.",
        "Hiding display rows does not necessarily change the aggregation grain.",
        "The aggregation must count each quote amount once at the intended grain.",
        "Removing line access can break sales work and does not correct the underlying aggregate or dashboard context."
      ],
      "difficulty": "Transfer",
      "assessment": "transfer",
      "sources": [
        "licenses",
        "catalog-api",
        "data-model",
        "provide-post-sales-support",
        "navigate-the-full-billing-lifecycle"
      ]
    },
    {
      "id": "transfer-readiness-org",
      "lesson": "readiness-org",
      "domain": "readiness",
      "stem": "In the configurator badge’s new training org, products exist but discovery and eligibility are not ready. What is the most appropriate readiness action?",
      "options": [
        "Follow that badge’s index rebuild, pricing sync and qualification-table refresh prerequisites, checking completion.",
        "Copy CPQ package permission sets into the new org and retry.",
        "Clone all sample products so that the index detects new records.",
        "Grant Modify All Data to sellers because the administrator can view Product2."
      ],
      "correct": [
        0
      ],
      "explanation": "The badge identifies separate preparation steps for discovery, pricing and qualification data; product existence alone is insufficient.",
      "reasons": [
        "The badge identifies separate preparation steps for discovery, pricing and qualification data; product existence alone is insufficient.",
        "Legacy package permissions do not establish native feature entitlement or setup.",
        "Cloning valid products creates duplicate modeling rather than proving prerequisites.",
        "Broad access neither builds the index nor refreshes decision data, and admin visibility is not runtime readiness."
      ],
      "difficulty": "Transfer",
      "assessment": "transfer",
      "sources": [
        "setup",
        "licenses",
        "manage-customer-asset-amendments",
        "explore-salesforce-pricing"
      ]
    },
    {
      "id": "transfer-readiness-discovery",
      "lesson": "readiness-discovery",
      "domain": "readiness",
      "stem": "Sales wants provisioning on quote acceptance; legal requires signature; finance bills only after service acceptance. What should discovery produce first?",
      "options": [
        "Separate decision gates with accountable business owners and cross-product acceptance tests.",
        "One Flow owned by the sales admin, using quote acceptance for all downstream events.",
        "Three independent departmental automations with no shared event contract.",
        "An estimate based on the assumption that legal execution equals service acceptance."
      ],
      "correct": [
        0
      ],
      "explanation": "The events have different business meanings. Agree ownership, dependencies and exceptions before implementing handoffs.",
      "reasons": [
        "The events have different business meanings. Agree ownership, dependencies and exceptions before implementing handoffs.",
        "A single trigger cannot legitimately replace distinct policy requirements.",
        "Uncoordinated automation can release work at incompatible times.",
        "The assumption collapses two different acceptance events and creates delivery risk."
      ],
      "difficulty": "Transfer",
      "assessment": "transfer",
      "sources": [
        "setup",
        "trail",
        "collaborate-with-salesforce-contracts"
      ]
    },
    {
      "id": "transfer-readiness-delivery",
      "lesson": "readiness-delivery",
      "domain": "readiness",
      "stem": "A deployment validates successfully, but production quoting finds no matching prices. Which next step best respects release readiness?",
      "options": [
        "Declare the issue an adoption problem because deployment tests passed.",
        "Copy the net prices from UAT quotes into production quote lines.",
        "Roll back every metadata change immediately without inspecting the failing service.",
        "Check target-org reference data, mappings, selected versions and sync requirements, then reconcile affected transactions."
      ],
      "correct": [
        3
      ],
      "explanation": "Metadata success does not prove all runtime dependencies. Diagnose the actual price lookup and recover through the agreed release process.",
      "reasons": [
        "A failed business transaction is not resolved by training attendance.",
        "Copied outputs bypass the pricing model and mask configuration defects.",
        "Rollback can be appropriate, but choosing it blindly may not restore missing reference data or reconcile affected quotes.",
        "Metadata success does not prove all runtime dependencies. Diagnose the actual price lookup and recover through the agreed release process."
      ],
      "difficulty": "Transfer",
      "assessment": "transfer",
      "sources": [
        "uat",
        "adoption",
        "manage-customer-asset-renewals-and-cancellations",
        "explore-order-orchestration"
      ]
    },
    {
      "id": "transfer-readiness-migration",
      "lesson": "readiness-migration",
      "domain": "readiness",
      "stem": "A CPQ migration pilot displays correct current quantities but fails its first renewal. What does that show?",
      "options": [
        "Current quantity reconciliation did not prove native lifecycle readiness and relationships.",
        "All data should be reimported using the same mapping with validation disabled.",
        "Renewals are unrelated to migration scope and should be excluded from UAT.",
        "The old subscription end date should be removed to force a new sale."
      ],
      "correct": [
        0
      ],
      "explanation": "A valid installed base needs the supported state, dates, relationships and transaction readiness required for later servicing.",
      "reasons": [
        "A valid installed base needs the supported state, dates, relationships and transaction readiness required for later servicing.",
        "Repeating an unproven mapping does not address the missing lifecycle behavior.",
        "Future servicing is a key acceptance test if it is in migration scope.",
        "Removing commercial history changes the business meaning rather than producing a valid renewal."
      ],
      "difficulty": "Transfer",
      "assessment": "transfer",
      "sources": [
        "migration",
        "data-model",
        "differences"
      ]
    },
    {
      "id": "transfer-catalog-structure",
      "lesson": "catalog-structure",
      "domain": "catalog",
      "stem": "The same offer should appear under Software and Services, reuse support-level characteristics, and be sold only to eligible regions. Which design best separates responsibilities?",
      "options": [
        "Create a separate Product2 for each region and navigation path regardless of commercial identity.",
        "Use attribute categories to grant catalog access and category labels to set support price.",
        "Use catalog/category associations for discovery, classification/attributes for reuse and qualification for regional eligibility.",
        "Create one classification per navigation category and use its label as the regional restriction."
      ],
      "correct": [
        2
      ],
      "explanation": "Navigation, reusable characteristics and contextual eligibility are distinct responsibilities.",
      "reasons": [
        "Duplicating products is unnecessary unless the business actually has distinct offers and adds maintenance burden.",
        "Attribute grouping and discovery labels do not by themselves provide access control or pricing logic.",
        "Navigation, reusable characteristics and contextual eligibility are distinct responsibilities.",
        "A classification label is not the same as a qualification rule or navigation hierarchy."
      ],
      "difficulty": "Transfer",
      "assessment": "transfer",
      "sources": [
        "get-started-with-product-catalog-management",
        "create-product-categories-and-attributes"
      ]
    },
    {
      "id": "transfer-catalog-attributes",
      "lesson": "catalog-attributes",
      "domain": "catalog",
      "stem": "A bundle component needs a different support-level default, while the standalone product should retain its existing default. What is the best approach?",
      "options": [
        "Create a new classification solely to hide the old default from the seller.",
        "Apply a manual discount without changing the configured support-level value.",
        "Change the shared attribute definition default and assume it applies only to the bundle.",
        "Use the supported component-context attribute override and retest both contexts."
      ],
      "correct": [
        3
      ],
      "explanation": "A scoped override preserves reuse while representing the bundle-specific behavior; verify rules and pricing that consume it.",
      "reasons": [
        "Classification duplication does not automatically express the intended component override.",
        "Changing price does not correct the product’s configured characteristic.",
        "A shared definition change can affect other products/contexts.",
        "A scoped override preserves reuse while representing the bundle-specific behavior; verify rules and pricing that consume it."
      ],
      "difficulty": "Transfer",
      "assessment": "transfer",
      "sources": [
        "work-with-product-classifications",
        "create-product-categories-and-attributes",
        "implement-attribute-based-pricing"
      ]
    },
    {
      "id": "transfer-catalog-bundles",
      "lesson": "catalog-bundles",
      "domain": "catalog",
      "stem": "Support should start selected but remain removable; the base device must always be included with a fixed quantity. Which setup should be verified?",
      "options": [
        "Set the parent bundle quantity to one and leave all component properties at defaults.",
        "Make both components required because they are initially selected.",
        "Separate default inclusion, required inclusion and allowed quantity changes on component relationships.",
        "Make support a technical product so it cannot be removed from the commercial bundle."
      ],
      "correct": [
        2
      ],
      "explanation": "Initial selection, mandatory validity and quantity editability are independent behavior settings.",
      "reasons": [
        "A parent quantity alone does not prove required/default/editability behavior for children.",
        "A required support component contradicts the removable requirement.",
        "Initial selection, mandatory validity and quantity editability are independent behavior settings.",
        "Technical fulfillment modeling does not express optional commercial selection."
      ],
      "difficulty": "Transfer",
      "assessment": "transfer",
      "sources": [
        "build-a-simple-product",
        "create-a-product-bundle",
        "discover-order-decomposition"
      ]
    },
    {
      "id": "transfer-catalog-selling",
      "lesson": "catalog-selling",
      "domain": "catalog",
      "stem": "A customer commits for one year, receives monthly invoices and pays each within 45 days. Which interpretation is correct?",
      "options": [
        "A 45-day selling model with twelve renewals per year.",
        "Twelve one-time products because there are twelve invoices.",
        "Evergreen commitment because billing is monthly, with a 45-day subscription term.",
        "Term-defined commitment, independent monthly billing cadence and net-45 payment terms."
      ],
      "correct": [
        3
      ],
      "explanation": "Commitment duration, invoice timing and payment due terms answer separate questions.",
      "reasons": [
        "This conflates payment due dates with the service term and invents a renewal schedule.",
        "An invoice count does not require separate one-time commercial products.",
        "Monthly invoicing does not determine evergreen behavior, and payment terms do not define the subscription duration.",
        "Commitment duration, invoice timing and payment due terms answer separate questions."
      ],
      "difficulty": "Transfer",
      "assessment": "transfer",
      "sources": [
        "build-a-simple-product",
        "selling-models",
        "set-up-and-sell-products"
      ]
    },
    {
      "id": "transfer-cpq-configure",
      "lesson": "cpq-configure",
      "domain": "cpq",
      "stem": "A cloned configurator Flow previews correctly in Flow Builder, but the assigned product still opens the old UI. Choose two checks most directly related to the runtime assignment.",
      "options": [
        "Change the product’s price-book entry currency.",
        "Verify the Product Configuration Flow identifier/status and its product/classification assignment.",
        "Rebuild every bundle from scratch.",
        "Verify the intended Flow version is active."
      ],
      "correct": [
        3,
        1
      ],
      "explanation": "An edited but inactive Flow version is not proof of the intended live experience.",
      "reasons": [
        "Currency can affect pricing but does not establish which configurator Flow is assigned.",
        "The configuration-flow record and assignment connect the Flow definition to the runtime product.",
        "Rebuilding the catalog does not address the unverified Flow-to-product linkage.",
        "An edited but inactive Flow version is not proof of the intended live experience."
      ],
      "difficulty": "Transfer",
      "assessment": "transfer",
      "sources": [
        "get-started-with-product-configurator",
        "create-and-configure-a-product-configurator-flow",
        "use-product-configurator-with-business-rules-engine",
        "explore-product-configurator-with-constraint-rules-engine"
      ]
    },
    {
      "id": "transfer-cpq-pricing",
      "lesson": "cpq-pricing",
      "domain": "cpq",
      "stem": "A procedure applies a 10% unit discount to 240 and then a fixed 12 per-unit reduction. Quantity is 5. Ignore tax and proration. Which expected line total and test are correct?",
      "options": [
        "1026; fixed reductions must always execute before percentage discounts.",
        "1080; the fixed reduction should only affect the header.",
        "960; both reductions should be calculated against the original amount.",
        "1020; reversing the adjustments should be tested as a separate policy producing 1026."
      ],
      "correct": [
        3
      ],
      "explanation": "240 × 0.9 − 12 = 204 per unit, then × 5 = 1020. Reversed order yields 205.20 × 5 = 1026.",
      "reasons": [
        "1026 is the reversed order, not the stated sequence; the commercial policy chooses ordering.",
        "The stated fixed adjustment is per unit, so omitting it gives the wrong amount.",
        "The arithmetic and adjustment basis do not match the specified procedure.",
        "240 × 0.9 − 12 = 204 per unit, then × 5 = 1020. Reversed order yields 205.20 × 5 = 1026."
      ],
      "difficulty": "Transfer",
      "assessment": "transfer",
      "sources": [
        "create-a-pricing-procedure-with-the-list-price-element",
        "configure-pricing-for-products",
        "add-volume-and-manual-discounts"
      ]
    },
    {
      "id": "transfer-cpq-advanced",
      "lesson": "cpq-advanced",
      "domain": "cpq",
      "stem": "A support product is normally derived as 15% of an eligible device price. A customer contract fixes support at 100 instead. What must be configured and tested?",
      "options": [
        "Only aggregate pricing because any dependent product amount is a rollup.",
        "Only the 15% formula because selecting a contract always overrides all pricing automatically.",
        "Source discovery, derived formula, contract context/eligibility and explicit replacement precedence.",
        "A 100 manual discount after every derived calculation."
      ],
      "correct": [
        2
      ],
      "explanation": "Each mechanism has different inputs, and the contract’s replacement policy must be explicit and verified across eligible/ineligible cases.",
      "reasons": [
        "Aggregation and discovering/calculating a dependent price are different responsibilities.",
        "Automatic precedence is not established merely by selecting a contract.",
        "Each mechanism has different inputs, and the contract’s replacement policy must be explicit and verified across eligible/ineligible cases.",
        "A discount of 100 does not mean the final price is fixed at 100."
      ],
      "difficulty": "Transfer",
      "assessment": "transfer",
      "sources": [
        "implement-attribute-based-pricing",
        "set-up-bundle-based-pricing",
        "explore-derived-pricing-and-discovery-procedures",
        "implement-derived-pricing",
        "set-up-subscription-pricing-with-proration",
        "apply-aggregate-pricing",
        "configure-contract-based-pricing"
      ]
    },
    {
      "id": "transfer-cpq-transact",
      "lesson": "cpq-transact",
      "domain": "cpq",
      "stem": "A quoting agent confidently says it created the usual renewal, but the request did not identify the existing asset or next term. What is the best validation approach?",
      "options": [
        "Accept the answer if the generated summary matches the customer’s terminology.",
        "Grant admin privileges and retry the same incomplete request.",
        "Create a new sale with the same product because all transaction types are interchangeable.",
        "Resolve the intended asset/term and inspect persisted quote transaction type, dates, quantities and pricing."
      ],
      "correct": [
        3
      ],
      "explanation": "Correct transaction intent and persisted commercial evidence are required; a fluent summary does not prove them.",
      "reasons": [
        "Language quality does not establish a valid saved transaction.",
        "Broad privileges cannot supply missing business intent or dates.",
        "A new sale can duplicate entitlements and does not preserve renewal semantics.",
        "Correct transaction intent and persisted commercial evidence are required; a fluent summary does not prove them."
      ],
      "difficulty": "Transfer",
      "assessment": "transfer",
      "sources": [
        "work-with-quotes",
        "discover-and-configure-products",
        "agent"
      ]
    },
    {
      "id": "transfer-contracts-legal",
      "lesson": "contracts-legal",
      "domain": "contracts",
      "stem": "Enterprise agreements require approved security clauses and approval of the final negotiated version before signature. Which solution most directly addresses this?",
      "options": [
        "Use an orchestration milestone named Legal Approved without controlling contract transitions.",
        "Activate the contract first so approvals do not delay order creation.",
        "Configure the applicable contract type/lifecycle and template/clause/version governance with approval/signature gates.",
        "Place a note on the quote and allow signature whenever the quote is accepted."
      ],
      "correct": [
        2
      ],
      "explanation": "The requirements concern legal lifecycle and the exact document version that receives approval and signature.",
      "reasons": [
        "A delivery marker alone does not establish legal document governance.",
        "Activating before required approvals bypasses the stated control.",
        "The requirements concern legal lifecycle and the exact document version that receives approval and signature.",
        "An informal note and quote acceptance do not enforce legal approval."
      ],
      "difficulty": "Transfer",
      "assessment": "transfer",
      "sources": [
        "meet-salesforce-contracts",
        "dive-into-salesforce-contracts-capabilities",
        "collaborate-with-salesforce-contracts"
      ]
    },
    {
      "id": "transfer-contracts-decompose",
      "lesson": "contracts-decompose",
      "domain": "contracts",
      "stem": "An offer needs hardware shipping and network activation, while a separate training order needs one manual approval. Which architecture is best justified?",
      "options": [
        "Require technical products for every order even when no transformation is needed.",
        "Avoid orchestration because decomposition itself guarantees execution order.",
        "Use product option groups as the only representation of external provisioning work.",
        "Use appropriate technical decomposition for distinct delivery outputs; orchestrate the simple training order directly if supported."
      ],
      "correct": [
        3
      ],
      "explanation": "Decomposition identifies delivery work; simple orders need not introduce unnecessary transformation before orchestration.",
      "reasons": [
        "Uniform technical decomposition can add complexity without meeting a new requirement.",
        "Decomposition defines outputs, not the entire sequence and completion behavior.",
        "Commercial selection structure does not itself execute fulfillment work.",
        "Decomposition identifies delivery work; simple orders need not introduce unnecessary transformation before orchestration."
      ],
      "difficulty": "Transfer",
      "assessment": "transfer",
      "sources": [
        "meet-dynamic-revenue-orchestrator",
        "discover-order-decomposition",
        "define-an-order-decomposition"
      ]
    },
    {
      "id": "transfer-contracts-orchestrate",
      "lesson": "contracts-orchestrate",
      "domain": "contracts",
      "stem": "Three order lines need separate provisioning, followed by one completion email after all required provisioning succeeds. What should the design specify?",
      "options": [
        "Once-per-plan provisioning and per-line email notifications.",
        "Appropriate per-line provisioning scope, once-per-plan notification scope and explicit dependencies.",
        "Per-line provisioning with a notification triggered when the first line completes.",
        "One lane per line and an email placed visually below them, with no dependency rules."
      ],
      "correct": [
        1
      ],
      "explanation": "Execution counts and sequencing require both scope and dependency configuration; verify line-versus-quantity semantics.",
      "reasons": [
        "These scopes reverse the required cardinality.",
        "Execution counts and sequencing require both scope and dependency configuration; verify line-versus-quantity semantics.",
        "The first completed line is not evidence that all required work succeeded.",
        "Visual layout alone does not enforce completion conditions."
      ],
      "difficulty": "Transfer",
      "assessment": "transfer",
      "sources": [
        "explore-order-orchestration",
        "design-a-simple-order-orchestration",
        "design-an-orchestration-plan",
        "define-dependencies-and-fulfillment-scenarios"
      ]
    },
    {
      "id": "transfer-contracts-recovery",
      "lesson": "contracts-recovery",
      "domain": "contracts",
      "stem": "A provisioning callout times out after the remote system may have accepted it. What should happen before retrying?",
      "options": [
        "Retry the whole order immediately because a timeout proves no external change occurred.",
        "Reconcile remote state using correlation evidence and use the supported replay-safe recovery path.",
        "Mark the step successful without checking the remote system.",
        "Cancel all assets to prevent duplicated fulfillment."
      ],
      "correct": [
        1
      ],
      "explanation": "A timeout has an ambiguous outcome; reconciliation and designed idempotency/recovery prevent duplicate external effects.",
      "reasons": [
        "The response may have been lost after successful execution.",
        "A timeout has an ambiguous outcome; reconciliation and designed idempotency/recovery prevent duplicate external effects.",
        "Unverified success can release downstream work without actual fulfillment.",
        "Canceling unrelated lifecycle state is not a proportionate or evidence-based recovery."
      ],
      "difficulty": "Transfer",
      "assessment": "transfer",
      "sources": [
        "explore-order-orchestration",
        "execute-an-orchestration-plan"
      ]
    },
    {
      "id": "transfer-assets-history",
      "lesson": "assets-history",
      "domain": "assets",
      "stem": "An asset had 10 seats, then +4 effective July 1 and −2 effective October 1. Today is in November. Which evidence should an August installed-base report use?",
      "options": [
        "The sum of state quantities 10 + 14 + 12.",
        "The latest action delta of −2.",
        "The effective state for August, expected to show 14 under the stated timeline.",
        "The current quantity of 12 because it includes all completed actions."
      ],
      "correct": [
        2
      ],
      "explanation": "A historical report needs state effective on the requested date, reconciled to the source changes.",
      "reasons": [
        "State periods are interval balances, not additive movements.",
        "A change delta is not an installed balance and is outside the requested period.",
        "A historical report needs state effective on the requested date, reconciled to the source changes.",
        "Today’s state answers a different date."
      ],
      "difficulty": "Transfer",
      "assessment": "transfer",
      "sources": [
        "provide-post-sales-support",
        "build-loyalty-through-post-sale-engagement"
      ]
    },
    {
      "id": "transfer-assets-amend",
      "lesson": "assets-amend",
      "domain": "assets",
      "stem": "The native amendment UI uses Quantity as a delta. Start Quantity is 10 and the customer wants 14 total effective July 1. What is correct?",
      "options": [
        "Enter 14, because Quantity always means the desired final installed base.",
        "Enter +4 and mark the quote studied; no order processing is needed.",
        "Edit Asset.Quantity to 14 and remove earlier state periods.",
        "Enter +4, verify End Quantity 14 and complete the resulting order processing."
      ],
      "correct": [
        3
      ],
      "explanation": "Start plus change equals end; the supported quote/order lifecycle and effective state must also be verified.",
      "reasons": [
        "Entering 14 as a delta requests 24 rather than 14.",
        "A saved amendment quote is not evidence of processed installed-state change.",
        "Directly overwriting quantity/history bypasses transaction lineage and historical accuracy.",
        "Start plus change equals end; the supported quote/order lifecycle and effective state must also be verified."
      ],
      "difficulty": "Transfer",
      "assessment": "transfer",
      "sources": [
        "manage-customer-asset-amendments",
        "provide-post-sales-support"
      ]
    },
    {
      "id": "transfer-assets-renew",
      "lesson": "assets-renew",
      "domain": "assets",
      "stem": "A customer wants two more seats immediately and another year of service after the current term. What is the safest modeling approach?",
      "options": [
        "Use the amendment delta as the renewal’s final quantity without inspecting the UI.",
        "Extend the original quote end date and assume it creates both transactions.",
        "Generate two new sales and remove the original asset history.",
        "Separate the in-term amendment from the future renewal and verify dates, quantities and supported sequencing."
      ],
      "correct": [
        3
      ],
      "explanation": "The requests affect different periods and transaction intents; verify each supported lifecycle outcome.",
      "reasons": [
        "Delta and total semantics must be checked in the relevant transaction UI.",
        "Editing a historical offer is not equivalent to processing valid changes.",
        "New sales can duplicate entitlement and deleting history destroys evidence.",
        "The requests affect different periods and transaction intents; verify each supported lifecycle outcome."
      ],
      "difficulty": "Transfer",
      "assessment": "transfer",
      "sources": [
        "manage-customer-asset-renewals-and-cancellations",
        "configure-contract-based-pricing"
      ]
    },
    {
      "id": "transfer-assets-cancel",
      "lesson": "assets-cancel",
      "domain": "assets",
      "stem": "A canceled prepaid service qualifies for a credit. The customer expects money back. Which statement is most accurate?",
      "options": [
        "Delete the original invoice so no refund reconciliation is required.",
        "A canceled asset is sufficient evidence that cash was refunded.",
        "A credit memo necessarily transfers funds through the payment gateway.",
        "Verify cancellation state, credit allocation and a separately authorized refund process."
      ],
      "correct": [
        3
      ],
      "explanation": "Service state, financial adjustment and cash return are separate evidence paths.",
      "reasons": [
        "Deleting historical evidence does not legitimately settle or reconcile cash.",
        "Ending service does not prove a payment reversal.",
        "A credit changes the financial obligation; refund execution is a distinct process.",
        "Service state, financial adjustment and cash return are separate evidence paths."
      ],
      "difficulty": "Transfer",
      "assessment": "transfer",
      "sources": [
        "manage-customer-asset-renewals-and-cancellations",
        "navigate-the-full-billing-lifecycle"
      ]
    },
    {
      "id": "transfer-invoice-policy",
      "lesson": "invoice-policy",
      "domain": "invoices",
      "stem": "A 12000 project bills 25% at kickoff and 75% at acceptance, net-30 after each invoice. Ignore tax. Which setup interpretation is correct?",
      "options": [
        "Preserve price 12000; allocate 3000/9000 through supported milestone treatment and apply payment terms separately.",
        "Issue both invoices immediately because payment terms control milestone eligibility.",
        "Change the product price to 3000 and let net-30 create the remaining 9000.",
        "Use a three-month selling model because kickoff is 25% of the project."
      ],
      "correct": [
        0
      ],
      "explanation": "Commercial amount, milestone invoice eligibility/allocation and due dates are separate concerns.",
      "reasons": [
        "Commercial amount, milestone invoice eligibility/allocation and due dates are separate concerns.",
        "Net-30 defines due timing, not fulfillment or milestone completion.",
        "Payment terms do not create missing commercial charges.",
        "Allocation percentage does not define subscription duration."
      ],
      "difficulty": "Transfer",
      "assessment": "transfer",
      "sources": [
        "explore-billing-features-and-roles",
        "generate-invoices"
      ]
    },
    {
      "id": "transfer-invoice-schedules",
      "lesson": "invoice-schedules",
      "domain": "invoices",
      "stem": "An invoice preview includes June and July schedule amounts, but the run should invoice June only. What is the best next step?",
      "options": [
        "Shorten the service term to end in June.",
        "Generate the invoice and delete the July line without investigating the schedules.",
        "Treat the preview as proof that both months have already been invoiced.",
        "Validate schedule eligibility and run cutoff/filter criteria before generating the invoice."
      ],
      "correct": [
        3
      ],
      "explanation": "Preview exposes selection/configuration errors before actual invoicing; reconcile intended eligible and excluded items.",
      "reasons": [
        "Changing the service term alters the commercial agreement to fix a billing selection issue.",
        "Manual output edits can mask a repeatable eligibility defect.",
        "Preview is not the same as generated/posted financial evidence.",
        "Preview exposes selection/configuration errors before actual invoicing; reconcile intended eligible and excluded items."
      ],
      "difficulty": "Transfer",
      "assessment": "transfer",
      "sources": [
        "get-started-with-billing-revenue-cloud",
        "generate-invoices",
        "explore-billing-features-and-roles"
      ]
    },
    {
      "id": "transfer-invoice-usage",
      "lesson": "invoice-usage",
      "domain": "invoices",
      "stem": "An allowance includes 1000 calls, eligible usage is 1250 calls and overage is 0.02 per call. A retry sends the same batch again. What should validation prove?",
      "options": [
        "The wallet balance proves revenue recognition and no billing reconciliation is needed.",
        "Liability is 25 because the allowance affects only invoice due dates.",
        "Liability is 30 because all received batches must be counted independently.",
        "Liability is 5 before other charges, and the designed ingestion/reprocessing prevents duplicate consumption."
      ],
      "correct": [
        3
      ],
      "explanation": "Only 250 calls exceed the allowance: 250 × 0.02 = 5. Replay handling must be reconciled using the supported design.",
      "reasons": [
        "Wallet/usage state is distinct from recognition and invoiced liability.",
        "An allowance affects charge eligibility, not payment due timing.",
        "A duplicate transport batch is not automatically new business consumption.",
        "Only 250 calls exceed the allowance: 250 × 0.02 = 5. Replay handling must be reconciled using the supported design."
      ],
      "difficulty": "Transfer",
      "assessment": "transfer",
      "sources": [
        "get-to-know-usage-management",
        "set-up-and-sell-products",
        "manage-wallets-and-track-consumption"
      ]
    },
    {
      "id": "transfer-invoice-finance",
      "lesson": "invoice-finance",
      "domain": "invoices",
      "stem": "An invoice is 500, an applied credit is 80 and an applied payment is 300. Ignore tax and prior balances. Which statement is correct?",
      "options": [
        "Collected cash is 380 because a credit is a payment.",
        "Open receivable is 120; the credit and payment represent different events.",
        "Open receivable is 200 because credits do not affect obligations.",
        "Recognized revenue must be 120 because it equals the outstanding balance."
      ],
      "correct": [
        1
      ],
      "explanation": "500 − 80 − 300 = 120. A credit reduces obligation; a payment settles it.",
      "reasons": [
        "A credit is not collected cash.",
        "500 − 80 − 300 = 120. A credit reduces obligation; a payment settles it.",
        "An applied valid credit reduces the amount owed.",
        "Open receivable does not establish recognized revenue."
      ],
      "difficulty": "Transfer",
      "assessment": "transfer",
      "sources": [
        "navigate-the-full-billing-lifecycle",
        "explore-billing-features-and-roles"
      ]
    }
  ],
  "sources": {
    "set-up-your-product-offerings": {
      "title": "Set Up Your Product Offerings",
      "url": "https://trailhead.salesforce.com/content/learn/modules/revenue-cloud-design/set-up-your-product-offerings",
      "kind": "Trailhead unit",
      "checked": "2026-10-20"
    },
    "define-your-product-configuration-experience": {
      "title": "Define Your Product Configuration Experience",
      "url": "https://trailhead.salesforce.com/content/learn/modules/revenue-cloud-design/define-your-product-configuration-experience",
      "kind": "Trailhead unit",
      "checked": "2026-10-20"
    },
    "configure-pricing-for-products": {
      "title": "Configure Product Pricing",
      "url": "https://trailhead.salesforce.com/content/learn/modules/revenue-cloud-design/configure-pricing-for-products",
      "kind": "Trailhead unit",
      "checked": "2026-10-20"
    },
    "manage-orders": {
      "title": "Manage Orders",
      "url": "https://trailhead.salesforce.com/content/learn/modules/revenue-cloud-design/manage-orders",
      "kind": "Trailhead unit",
      "checked": "2026-10-20"
    },
    "generate-invoices": {
      "title": "Generate Invoices",
      "url": "https://trailhead.salesforce.com/content/learn/modules/revenue-cloud-design/generate-invoices",
      "kind": "Trailhead unit",
      "checked": "2026-10-20"
    },
    "get-to-know-context-service": {
      "title": "Get to Know Context Service",
      "url": "https://trailhead.salesforce.com/content/learn/modules/context-service-basics/get-to-know-context-service",
      "kind": "Trailhead unit",
      "checked": "2026-10-20"
    },
    "explore-context-service-components-and-processes": {
      "title": "Explore Context Service Components and Processes",
      "url": "https://trailhead.salesforce.com/content/learn/modules/context-service-basics/explore-context-service-components-and-processes",
      "kind": "Trailhead unit",
      "checked": "2026-10-20"
    },
    "get-to-know-business-rules-engine": {
      "title": "Get to Know Business Rules Engine",
      "url": "https://trailhead.salesforce.com/content/learn/modules/business-rules-engine/get-to-know-business-rules-engine",
      "kind": "Trailhead unit",
      "checked": "2026-10-20"
    },
    "build-decisions-with-lookup-tables": {
      "title": "Build Decisions with Lookup Tables",
      "url": "https://trailhead.salesforce.com/content/learn/modules/business-rules-engine/build-decisions-with-lookup-tables",
      "kind": "Trailhead unit",
      "checked": "2026-10-20"
    },
    "orchestrate-rules-with-expression-sets": {
      "title": "Orchestrate Rules with Expression Sets",
      "url": "https://trailhead.salesforce.com/content/learn/modules/business-rules-engine/orchestrate-rules-with-expression-sets",
      "kind": "Trailhead unit",
      "checked": "2026-10-20"
    },
    "automate-business-processes": {
      "title": "Implement Rules in Business Processes",
      "url": "https://trailhead.salesforce.com/content/learn/modules/business-rules-engine/automate-business-processes",
      "kind": "Trailhead unit",
      "checked": "2026-10-20"
    },
    "get-started-with-product-catalog-management": {
      "title": "Get Started with Product Catalog Management",
      "url": "https://trailhead.salesforce.com/content/learn/modules/product-catalog-management-with-revenue-cloud/get-started-with-product-catalog-management",
      "kind": "Trailhead unit",
      "checked": "2026-10-20"
    },
    "create-product-categories-and-attributes": {
      "title": "Create Product Categories and Attributes",
      "url": "https://trailhead.salesforce.com/content/learn/modules/product-catalog-management-with-revenue-cloud/create-product-categories-and-attributes",
      "kind": "Trailhead unit",
      "checked": "2026-10-20"
    },
    "work-with-product-classifications": {
      "title": "Work with Product Classifications",
      "url": "https://trailhead.salesforce.com/content/learn/modules/product-catalog-management-with-revenue-cloud/work-with-product-classifications",
      "kind": "Trailhead unit",
      "checked": "21 October 2026"
    },
    "build-a-simple-product": {
      "title": "Build a Simple Product",
      "url": "https://trailhead.salesforce.com/content/learn/modules/product-catalog-management-with-revenue-cloud/build-a-simple-product",
      "kind": "Trailhead unit",
      "checked": "2026-10-20"
    },
    "create-a-product-bundle": {
      "title": "Create a Product Bundle",
      "url": "https://trailhead.salesforce.com/content/learn/modules/product-catalog-management-with-revenue-cloud/create-a-product-bundle",
      "kind": "Trailhead unit",
      "checked": "2026-10-20"
    },
    "get-started-with-product-configurator": {
      "title": "Get Started with Product Configurator",
      "url": "https://trailhead.salesforce.com/content/learn/modules/product-configuration-with-revenue-cloud/get-started-with-product-configurator",
      "kind": "Trailhead unit",
      "checked": "2026-10-20"
    },
    "create-and-configure-a-product-configurator-flow": {
      "title": "Create and Configure a Product Configurator Flow",
      "url": "https://trailhead.salesforce.com/content/learn/modules/product-configuration-with-revenue-cloud/create-and-configure-a-product-configurator-flow",
      "kind": "Trailhead unit",
      "checked": "2026-10-20"
    },
    "use-product-configurator-with-business-rules-engine": {
      "title": "Use Product Configurator with Business Rules Engine",
      "url": "https://trailhead.salesforce.com/content/learn/modules/product-configuration-with-revenue-cloud/use-product-configurator-with-business-rules-engine",
      "kind": "Trailhead unit",
      "checked": "2026-10-20"
    },
    "explore-product-configurator-with-constraint-rules-engine": {
      "title": "Explore Product Configurator with Constraint Rules Engine",
      "url": "https://trailhead.salesforce.com/content/learn/modules/product-configuration-with-revenue-cloud/explore-product-configurator-with-constraint-rules-engine",
      "kind": "Trailhead unit",
      "checked": "2026-10-20"
    },
    "explore-salesforce-pricing": {
      "title": "Explore Salesforce Pricing",
      "url": "https://trailhead.salesforce.com/content/learn/modules/price-management-with-revenue-cloud/explore-salesforce-pricing",
      "kind": "Trailhead unit",
      "checked": "2026-10-20"
    },
    "create-a-pricing-procedure-with-the-list-price-element": {
      "title": "Create a Pricing Procedure with the List Price Element",
      "url": "https://trailhead.salesforce.com/content/learn/modules/price-management-with-revenue-cloud/create-a-pricing-procedure-with-the-list-price-element",
      "kind": "Trailhead unit",
      "checked": "2026-10-20"
    },
    "add-volume-and-manual-discounts": {
      "title": "Add Volume and Manual Discounts",
      "url": "https://trailhead.salesforce.com/content/learn/modules/price-management-with-revenue-cloud/add-volume-and-manual-discounts",
      "kind": "Trailhead unit",
      "checked": "21 October 2026"
    },
    "implement-attribute-based-pricing": {
      "title": "Implement Attribute-Based Pricing",
      "url": "https://trailhead.salesforce.com/content/learn/modules/price-management-with-revenue-cloud/implement-attribute-based-pricing",
      "kind": "Trailhead unit",
      "checked": "2026-10-20"
    },
    "set-up-bundle-based-pricing": {
      "title": "Set Up Bundle-Based Pricing",
      "url": "https://trailhead.salesforce.com/content/learn/modules/price-management-with-revenue-cloud/set-up-bundle-based-pricing",
      "kind": "Trailhead unit",
      "checked": "2026-10-20"
    },
    "explore-derived-pricing-and-discovery-procedures": {
      "title": "Explore Derived Pricing and Discovery Procedures",
      "url": "https://trailhead.salesforce.com/content/learn/modules/advanced-price-management-with-revenue-cloud/explore-derived-pricing-and-discovery-procedures",
      "kind": "Trailhead unit",
      "checked": "2026-10-20"
    },
    "implement-derived-pricing": {
      "title": "Implement Derived Pricing",
      "url": "https://trailhead.salesforce.com/content/learn/modules/advanced-price-management-with-revenue-cloud/implement-derived-pricing",
      "kind": "Trailhead unit",
      "checked": "2026-10-20"
    },
    "set-up-subscription-pricing-with-proration": {
      "title": "Set Up Subscription Pricing with Proration",
      "url": "https://trailhead.salesforce.com/content/learn/modules/advanced-price-management-with-revenue-cloud/set-up-subscription-pricing-with-proration",
      "kind": "Trailhead unit",
      "checked": "21 October 2026"
    },
    "apply-aggregate-pricing": {
      "title": "Apply Aggregate Pricing",
      "url": "https://trailhead.salesforce.com/content/learn/modules/advanced-price-management-with-revenue-cloud/apply-aggregate-pricing",
      "kind": "Trailhead unit",
      "checked": "2026-10-20"
    },
    "configure-contract-based-pricing": {
      "title": "Configure Contract-Based Pricing",
      "url": "https://trailhead.salesforce.com/content/learn/modules/advanced-price-management-with-revenue-cloud/configure-contract-based-pricing",
      "kind": "Trailhead unit",
      "checked": "2026-10-20"
    },
    "get-started-with-transaction-management": {
      "title": "Get Started with Transaction Management",
      "url": "https://trailhead.salesforce.com/content/learn/modules/efficient-sales-with-revenue-cloud/get-started-with-transaction-management",
      "kind": "Trailhead unit",
      "checked": "2026-10-20"
    },
    "discover-and-configure-products": {
      "title": "Discover and Configure Products",
      "url": "https://trailhead.salesforce.com/content/learn/modules/efficient-sales-with-revenue-cloud/discover-and-configure-products",
      "kind": "Trailhead unit",
      "checked": "2026-10-20"
    },
    "work-with-quotes": {
      "title": "Work with Quotes",
      "url": "https://trailhead.salesforce.com/content/learn/modules/efficient-sales-with-revenue-cloud/work-with-quotes",
      "kind": "Trailhead unit",
      "checked": "2026-10-20"
    },
    "create-and-fulfill-orders": {
      "title": "Create Orders",
      "url": "https://trailhead.salesforce.com/content/learn/modules/efficient-sales-with-revenue-cloud/create-and-fulfill-orders",
      "kind": "Trailhead unit",
      "checked": "2026-10-20"
    },
    "get-to-know-usage-management": {
      "title": "Get to Know Usage Management",
      "url": "https://trailhead.salesforce.com/content/learn/modules/usage-management-foundations/get-to-know-usage-management",
      "kind": "Trailhead unit",
      "checked": "2026-10-20"
    },
    "explore-components-and-personas": {
      "title": "Explore Components and Personas",
      "url": "https://trailhead.salesforce.com/content/learn/modules/usage-management-foundations/explore-components-and-personas",
      "kind": "Trailhead unit",
      "checked": "2026-10-20"
    },
    "set-up-and-sell-products": {
      "title": "Set Up and Sell Products",
      "url": "https://trailhead.salesforce.com/content/learn/modules/usage-management-foundations/set-up-and-sell-products",
      "kind": "Trailhead unit",
      "checked": "2026-10-20"
    },
    "manage-wallets-and-track-consumption": {
      "title": "Manage Wallets and Track Consumption",
      "url": "https://trailhead.salesforce.com/content/learn/modules/usage-management-foundations/manage-wallets-and-track-consumption",
      "kind": "Trailhead unit",
      "checked": "2026-10-20"
    },
    "build-loyalty-through-post-sale-engagement": {
      "title": "Build Loyalty Through Post-Sale Engagement",
      "url": "https://trailhead.salesforce.com/content/learn/modules/asset-lifecycle-management-with-revenue-cloud/build-loyalty-through-post-sale-engagement",
      "kind": "Trailhead unit",
      "checked": "2026-10-20"
    },
    "provide-post-sales-support": {
      "title": "Provide Post-Sales Support",
      "url": "https://trailhead.salesforce.com/content/learn/modules/asset-lifecycle-management-with-revenue-cloud/provide-post-sales-support",
      "kind": "Trailhead unit",
      "checked": "2026-10-20"
    },
    "manage-customer-asset-amendments": {
      "title": "Manage Customer Asset Amendments",
      "url": "https://trailhead.salesforce.com/content/learn/modules/asset-lifecycle-management-with-revenue-cloud/manage-customer-asset-amendments",
      "kind": "Trailhead unit",
      "checked": "21 October 2026"
    },
    "manage-customer-asset-renewals-and-cancellations": {
      "title": "Manage Customer Asset Renewals and Cancellations",
      "url": "https://trailhead.salesforce.com/content/learn/modules/asset-lifecycle-management-with-revenue-cloud/manage-customer-asset-renewals-and-cancellations",
      "kind": "Trailhead unit",
      "checked": "2026-10-20"
    },
    "get-started-with-billing-revenue-cloud": {
      "title": "Get Started with Billing",
      "url": "https://trailhead.salesforce.com/content/learn/modules/billing-basics-in-revenue-cloud/get-started-with-billing-revenue-cloud",
      "kind": "Trailhead unit",
      "checked": "2026-10-20"
    },
    "explore-billing-features-and-roles": {
      "title": "Explore Billing Features and Roles",
      "url": "https://trailhead.salesforce.com/content/learn/modules/billing-basics-in-revenue-cloud/explore-billing-features-and-roles",
      "kind": "Trailhead unit",
      "checked": "21 October 2026"
    },
    "navigate-the-full-billing-lifecycle": {
      "title": "Navigate the Full Billing Lifecycle",
      "url": "https://trailhead.salesforce.com/content/learn/modules/billing-basics-in-revenue-cloud/navigate-the-full-billing-lifecycle",
      "kind": "Trailhead unit",
      "checked": "2026-10-20"
    },
    "meet-dynamic-revenue-orchestrator": {
      "title": "Meet Dynamic Revenue Orchestrator",
      "url": "https://trailhead.salesforce.com/content/learn/modules/dynamic-revenue-orchestrator-foundations/meet-dynamic-revenue-orchestrator",
      "kind": "Trailhead unit",
      "checked": "2026-10-20"
    },
    "discover-order-decomposition": {
      "title": "Discover Order Decomposition",
      "url": "https://trailhead.salesforce.com/content/learn/modules/dynamic-revenue-orchestrator-foundations/discover-order-decomposition",
      "kind": "Trailhead unit",
      "checked": "2026-10-20"
    },
    "explore-order-orchestration": {
      "title": "Explore Order Orchestration",
      "url": "https://trailhead.salesforce.com/content/learn/modules/dynamic-revenue-orchestrator-foundations/explore-order-orchestration",
      "kind": "Trailhead unit",
      "checked": "2026-10-20"
    },
    "meet-salesforce-contracts": {
      "title": "Meet Salesforce Contracts",
      "url": "https://trailhead.salesforce.com/content/learn/modules/salesforce-contracts-foundations/meet-salesforce-contracts",
      "kind": "Trailhead unit",
      "checked": "2026-10-20"
    },
    "dive-into-salesforce-contracts-capabilities": {
      "title": "Dive into Salesforce Contracts Capabilities",
      "url": "https://trailhead.salesforce.com/content/learn/modules/salesforce-contracts-foundations/dive-into-salesforce-contracts-capabilities",
      "kind": "Trailhead unit",
      "checked": "2026-10-20"
    },
    "collaborate-with-salesforce-contracts": {
      "title": "Collaborate with Salesforce Contracts",
      "url": "https://trailhead.salesforce.com/content/learn/modules/salesforce-contracts-foundations/collaborate-with-salesforce-contracts",
      "kind": "Trailhead unit",
      "checked": "2026-10-20"
    },
    "transform-your-business-with-salesforce-contracts": {
      "title": "Transform Your Business with Salesforce Contracts",
      "url": "https://trailhead.salesforce.com/content/learn/modules/salesforce-contracts-foundations/transform-your-business-with-salesforce-contracts",
      "kind": "Trailhead unit",
      "checked": "2026-10-20"
    },
    "design-a-simple-order-orchestration": {
      "title": "Design a Simple Order Orchestration",
      "url": "https://trailhead.salesforce.com/content/learn/modules/simple-order-orchestration-with-revenue-cloud/design-a-simple-order-orchestration",
      "kind": "Trailhead unit",
      "checked": "2026-10-20"
    },
    "configure-and-execute-a-simple-order-orchestration": {
      "title": "Configure and Execute a Simple Order Orchestration",
      "url": "https://trailhead.salesforce.com/content/learn/modules/simple-order-orchestration-with-revenue-cloud/configure-and-execute-a-simple-order-orchestration",
      "kind": "Trailhead unit",
      "checked": "2026-10-20"
    },
    "define-an-order-decomposition": {
      "title": "Define an Order Decomposition",
      "url": "https://trailhead.salesforce.com/content/learn/modules/complex-order-decomposition-and-orchestration-with-revenue-cloud/define-an-order-decomposition",
      "kind": "Trailhead unit",
      "checked": "2026-10-20"
    },
    "design-an-orchestration-plan": {
      "title": "Design an Orchestration Plan",
      "url": "https://trailhead.salesforce.com/content/learn/modules/complex-order-decomposition-and-orchestration-with-revenue-cloud/design-an-orchestration-plan",
      "kind": "Trailhead unit",
      "checked": "2026-10-20"
    },
    "define-dependencies-and-fulfillment-scenarios": {
      "title": "Define Dependencies and Fulfillment Scenarios",
      "url": "https://trailhead.salesforce.com/content/learn/modules/complex-order-decomposition-and-orchestration-with-revenue-cloud/define-dependencies-and-fulfillment-scenarios",
      "kind": "Trailhead unit",
      "checked": "2026-10-20"
    },
    "execute-an-orchestration-plan": {
      "title": "Execute an Orchestration Plan",
      "url": "https://trailhead.salesforce.com/content/learn/modules/complex-order-decomposition-and-orchestration-with-revenue-cloud/execute-an-orchestration-plan",
      "kind": "Trailhead unit",
      "checked": "2026-10-20"
    },
    "exam": {
      "title": "Official certification exam guide",
      "url": "https://help.salesforce.com/s/articleView?id=005298978&language=en_US&type=1",
      "kind": "Salesforce Help",
      "checked": "21 October 2026",
      "status": "Read"
    },
    "trail": {
      "title": "Official certification preparation trail",
      "url": "https://trailhead.salesforce.com/content/learn/trails/prepare-for-your-salesforce-revenue-cloud-consultant-exam",
      "kind": "Trailhead trail",
      "checked": "2026-10-20",
      "status": "Read"
    },
    "credential": {
      "title": "Current credential listing",
      "url": "https://trailhead.salesforce.com/credentials/revenuemanagementconsultant",
      "kind": "Trailhead credential",
      "checked": "2026-10-20",
      "status": "Read"
    },
    "differences": {
      "title": "Revenue Management versus Salesforce CPQ",
      "url": "https://help.salesforce.com/s/articleView?id=ind.rev_migration_revenue_differences_from_cpq.htm&language=en_US&type=5",
      "kind": "Salesforce Help",
      "checked": "2026-10-20",
      "status": "Read"
    },
    "data-model": {
      "title": "Migration data-model changes",
      "url": "https://help.salesforce.com/s/articleView?id=ind.rev_migration_architecture_data_model.htm&language=en_US&type=5",
      "kind": "Salesforce Help",
      "checked": "2026-10-20",
      "status": "Read"
    },
    "product-identity": {
      "title": "Which revenue product am I using?",
      "url": "https://help.salesforce.com/s/articleView?id=ind.rev_which_product.htm&language=en_US&type=5",
      "kind": "Salesforce Help",
      "checked": "2026-10-20",
      "status": "Read"
    },
    "selling-models": {
      "title": "Product selling model migration",
      "url": "https://help.salesforce.com/s/articleView?id=ind.rev_product_selling_models_migration.htm&language=en_US&type=5",
      "kind": "Salesforce Help",
      "checked": "2026-10-20",
      "status": "Read"
    },
    "migration": {
      "title": "Transactional data migration scope",
      "url": "https://help.salesforce.com/s/articleView?id=ind.rev_migration_transaction_data_scope_approaches.htm&language=en_US&type=5",
      "kind": "Salesforce Help",
      "checked": "2026-10-20",
      "status": "Read"
    },
    "licenses": {
      "title": "Feature availability by license",
      "url": "https://help.salesforce.com/s/articleView?language=en_US&id=ind.revenue_licenses_areas_and_features.htm&type=5",
      "kind": "Salesforce Help",
      "checked": "2026-10-20",
      "status": "Official trail reference; Help body did not render during review"
    },
    "setup": {
      "title": "Implementation setup reference",
      "url": "https://help.salesforce.com/s/articleView?language=en_US&id=ind.setup_revenue_cloud.htm&type=5",
      "kind": "Salesforce Help",
      "checked": "2026-10-20",
      "status": "Official trail reference; Help body did not render during review"
    },
    "agent": {
      "title": "Build a quoting agent",
      "url": "https://trailhead.salesforce.com/content/learn/projects/quick-start-build-an-agent-to-create-quotes-fast/build-your-first-agentforce-quoting-agent",
      "kind": "Trailhead project",
      "checked": "2026-10-20",
      "status": "Read"
    },
    "catalog-api": {
      "title": "Catalog business API resources",
      "url": "https://developer.salesforce.com/docs/revenue/revenue-management/guide/product-catalog-management-api-resources.html",
      "kind": "Developer documentation",
      "checked": "2026-10-20",
      "status": "Read"
    },
    "uat": {
      "title": "User acceptance testing",
      "url": "https://trailhead.salesforce.com/content/learn/modules/user-acceptance-testing-video",
      "kind": "Trailhead module",
      "checked": "2026-10-20",
      "status": "Official preparation trail reference"
    },
    "adoption": {
      "title": "Salesforce adoption strategies",
      "url": "https://trailhead.salesforce.com/content/learn/modules/salesforce-adoption-strategies",
      "kind": "Trailhead module",
      "checked": "2026-10-20",
      "status": "Official preparation trail reference"
    },
    "context-create": {
      "title": "Create a context definition",
      "url": "https://help.salesforce.com/s/articleView?id=ind.context_service_create_context_definitions.htm&language=en_US&type=5",
      "kind": "Salesforce Help",
      "checked": "21 October 2026",
      "status": "Read"
    },
    "context-flow": {
      "title": "Context Service invocable actions in Flow",
      "url": "https://help.salesforce.com/s/articleView?id=ind.call_context_service_invocable_actions_from_flow.htm&language=en_US&type=5",
      "kind": "Salesforce Help",
      "checked": "21 October 2026",
      "status": "Read"
    },
    "context-bre": {
      "title": "How BRE and Context Service work together",
      "url": "https://trailhead.salesforce.com/content/learn/modules/automated-compliance-with-business-rules-engine-and-context-service/get-to-know-business-rules-engine-and-context-service",
      "kind": "Trailhead",
      "checked": "21 October 2026",
      "status": "Read"
    },
    "native-transaction-objects": {
      "title": "Native transaction-management object reference",
      "url": "https://developer.salesforce.com/docs/revenue/revenue-management/guide/quote-and-order-capture-standard-objects.html",
      "kind": "Developer reference",
      "checked": "21 October 2026",
      "status": "Read"
    },
    "native-selling-option": {
      "title": "ProductSellingModelOption object and relationships",
      "url": "https://developer.salesforce.com/docs/revenue/revenue-management/guide/sforce-api-objects-productsellingmodeloption.html",
      "kind": "Developer reference",
      "checked": "21 October 2026",
      "status": "Read"
    },
    "native-asset-model": {
      "title": "Managed asset data-model diagram",
      "url": "https://developer.salesforce.com/docs/platform/data-models/guide/transaction-management-asset.html",
      "kind": "Developer data model",
      "checked": "21 October 2026",
      "status": "Read"
    }
  },
  "bridge": [
    {
      "topic": "Product identity",
      "before": "Salesforce CPQ is the SBQQ managed package. Your existing certificate validates that product.",
      "after": "This track targets the native Revenue Cloud product, now called Revenue Management / Agentforce Revenue Management. Verify the exact product before applying setup instructions.",
      "lesson": "platform-map"
    },
    {
      "topic": "Objects and integrations",
      "before": "Package quote, quote-line, product-option and subscription objects drive much of the solution.",
      "after": "Learn the native model and relationships. Quote and QuoteLineItem are starting points; existing SBQQ integrations, reports and automation need explicit remapping.",
      "lesson": "readiness-migration"
    },
    {
      "topic": "Product variation",
      "before": "Configuration attributes and custom fields often describe product variations.",
      "after": "Use reusable attribute definitions and classifications. Keep browsing categories distinct from attribute reuse and bundle structure.",
      "lesson": "catalog-attributes"
    },
    {
      "topic": "One product, several selling approaches",
      "before": "Subscription behavior is closely associated with product configuration in CPQ.",
      "after": "Product Selling Models separate the offering from how it is sold. Check model options and corresponding prices before cloning a SKU.",
      "lesson": "catalog-selling"
    },
    {
      "topic": "Calculator and pricing rules",
      "before": "Price rules, evaluation events and potentially QCP code shape calculations.",
      "after": "Trace context inputs, ordered pricing elements, lookup data, output mappings and setup/synchronization. Validate each intermediate amount.",
      "lesson": "cpq-pricing"
    },
    {
      "topic": "Selection rules",
      "before": "You know how product rules enforce dependencies and valid combinations.",
      "after": "Select the supported configurator engine and guided experience. Learn native rule/constraint setup rather than copying package execution assumptions.",
      "lesson": "cpq-configure"
    },
    {
      "topic": "Installed-base changes",
      "before": "Subscriptions and CPQ amendment/renewal processes are familiar.",
      "after": "Learn managed assets, dated actions and state periods. Reconcile the generated transaction and the resulting effective-dated state.",
      "lesson": "assets-history"
    },
    {
      "topic": "Beyond the quote",
      "before": "Order creation may be the boundary of the CPQ implementation.",
      "after": "Separate legal lifecycle, fulfillment decomposition/orchestration, assets and Billing. A successful quote is only one stage.",
      "lesson": "contracts-decompose"
    },
    {
      "topic": "Agent-assisted selling",
      "before": "The seller directly drives the quote editor and its business logic.",
      "after": "Agentforce can assist through authorized actions and platform guardrails. Missing requirements, invalid choices and commercial review remain important.",
      "lesson": "cpq-transact"
    }
  ],
  "glossary": [
    [
      "Context definition",
      "Design-time logical structure, attributes and mappings for a process."
    ],
    [
      "Context instance",
      "Runtime data hydrated into the logical context."
    ],
    [
      "Context tag",
      "Alias a consuming service uses to address context information."
    ],
    [
      "Hydration",
      "Loading source data into a runtime context."
    ],
    [
      "Expression set",
      "Ordered decision/calculation elements in Business Rules Engine."
    ],
    [
      "Decision matrix",
      "A lookup that returns outputs from a matching row."
    ],
    [
      "Decision table",
      "A decision tool supporting multiple matching outcomes."
    ],
    [
      "Product classification",
      "Reusable product attribute structure."
    ],
    [
      "Attribute category",
      "Grouping of related product characteristics."
    ],
    [
      "Product category",
      "Grouping used to organize product discovery."
    ],
    [
      "Product Selling Model",
      "How a product is sold, such as one-time, term-defined or evergreen."
    ],
    [
      "Pricing procedure",
      "Ordered pricing elements calculating a commercial amount."
    ],
    [
      "Derived pricing",
      "A dependent product’s price calculated from an identified source."
    ],
    [
      "Proration",
      "Applying a defined time convention to partial periods."
    ],
    [
      "Decomposition",
      "Translation of a commercial order into fulfillment requirements."
    ],
    [
      "Orchestration",
      "Coordination of delivery work, dependencies and completion."
    ],
    [
      "Fallout",
      "A fulfillment problem needing diagnosis and recovery."
    ],
    [
      "Asset action",
      "A dated change in a managed asset’s lifecycle."
    ],
    [
      "Asset state period",
      "Interval during which relevant asset quantity/value state is consistent."
    ],
    [
      "Billing treatment",
      "Configuration describing how transaction amounts are billed."
    ],
    [
      "Billing profile",
      "Customer-specific billing preferences and details."
    ],
    [
      "Billing schedule",
      "Representation of how an order product is billed over time."
    ],
    [
      "Wallet",
      "Usage entitlement/balance tracking; not an invoice or cash account."
    ],
    [
      "Credit memo",
      "Document adjusting an amount owed; not proof of cash returned."
    ]
  ],
  "mockAllocation": {
    "platform": 11,
    "readiness": 8,
    "catalog": 10,
    "cpq": 11,
    "contracts": 6,
    "assets": 10,
    "invoices": 4
  },
  "contentRevision": "2026-10-21-foundations-1"
};
