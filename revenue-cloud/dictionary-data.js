/* Original definitions and CPQ distinctions. See DICTIONARY_RESEARCH.md for scope. */
window.RC_DICTIONARY_DATA = {
  "version": "2026-10-20.2",
  "checked": "20 October 2026",
  "categories": [
    {
      "id": "platform",
      "label": "Platform & context"
    },
    {
      "id": "rules",
      "label": "Rules & configuration"
    },
    {
      "id": "catalog",
      "label": "Catalog & selling models"
    },
    {
      "id": "pricing",
      "label": "Pricing & commercial amounts"
    },
    {
      "id": "transactions",
      "label": "Transactions & contracts"
    },
    {
      "id": "fulfillment",
      "label": "Fulfillment & orchestration"
    },
    {
      "id": "assets",
      "label": "Assets & lifecycle changes"
    },
    {
      "id": "usage",
      "label": "Usage, entitlements & rating"
    },
    {
      "id": "billing",
      "label": "Billing & financial documents"
    },
    {
      "id": "metrics",
      "label": "Metrics & reporting"
    },
    {
      "id": "delivery",
      "label": "Implementation & integration"
    },
    {
      "id": "legacy",
      "label": "Legacy CPQ comparisons"
    }
  ],
  "entries": [
    {
      "id": "account",
      "term": "Account",
      "aliases": [
        "Customer account",
        "Billing account"
      ],
      "definition": "The business/customer relationship record providing context for relevant selling, assets and billing.",
      "note": "The owning customer account, bill-to account, legal entity and contact are different roles. Confirm which relationship each process actually consumes.",
      "category": "transactions",
      "kind": "Concept / object landmark",
      "lesson": "platform-map",
      "sources": [
        "work-with-quotes",
        "explore-billing-features-and-roles"
      ],
      "related": [
        "billing-arrangement",
        "billing-profile",
        "legal-entity"
      ],
      "checked": "2026-10-20",
      "autoLink": false
    },
    {
      "id": "accounting-period",
      "term": "Accounting period",
      "aliases": [
        "Accounting periods",
        "Period close"
      ],
      "definition": "The defined span used for financial recording and reporting, such as a month or quarter.",
      "note": "Do not confuse accounting periods with subscription terms or consumption aggregation windows.",
      "category": "billing",
      "kind": "General concept in revenue context",
      "lesson": "invoice-policy",
      "sources": [
        "explore-billing-features-and-roles",
        "navigate-the-full-billing-lifecycle",
        "generate-invoices",
        "glossary-billing"
      ],
      "related": [
        "subledger",
        "effective-date",
        "revenue-recognition"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "accounts-receivable",
      "term": "Accounts receivable",
      "aliases": [
        "AR",
        "A/R",
        "Receivables"
      ],
      "definition": "Amounts owed by customers for relevant issued financial obligations.",
      "note": "Balances need invoice, credit and payment reconciliation. They are not interchangeable with bookings or recognized revenue.",
      "category": "billing",
      "kind": "General concept in revenue context",
      "lesson": "invoice-policy",
      "sources": [
        "explore-billing-features-and-roles",
        "navigate-the-full-billing-lifecycle",
        "generate-invoices",
        "glossary-billing"
      ],
      "related": [
        "invoice",
        "payment-application",
        "subledger"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "advance-billing",
      "term": "Advance billing",
      "aliases": [
        "Bill in advance",
        "In advance"
      ],
      "definition": "Invoicing before the service period under the applicable billing policy.",
      "note": "Advance timing is distinct from an upfront payment and from the accounting policy for recognizing revenue.",
      "category": "billing",
      "kind": "Native concept",
      "lesson": "invoice-policy",
      "sources": [
        "explore-billing-features-and-roles",
        "navigate-the-full-billing-lifecycle",
        "generate-invoices",
        "glossary-billing"
      ],
      "related": [
        "arrears-billing",
        "payment",
        "revenue-recognition"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "agentforce-quoting",
      "term": "Agentforce Quoting",
      "aliases": [
        "Quoting Agent",
        "Agentforce",
        "Quote Management subagent"
      ],
      "definition": "Agent-assisted creation, modification or summarization of quotes using supported actions and authorized business data.",
      "note": "Inputs, product rules, pricing guardrails and review remain necessary. A fluent response is not evidence of a valid commercial result.",
      "category": "transactions",
      "kind": "Native concept",
      "lesson": "contracts-legal",
      "sources": [
        "agent"
      ],
      "related": [
        "product-configurator",
        "salesforce-pricing",
        "execution-identity"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "aggregate-pricing",
      "term": "Aggregate pricing",
      "aliases": [
        "Aggregate Price",
        "Aggregate Price element"
      ],
      "definition": "Combining supported line-level values according to configured aggregation rules.",
      "note": "Do not infer that every quote header total is automatically populated. Verify supported scope, restrictions and output mappings.",
      "category": "pricing",
      "kind": "Native concept",
      "lesson": "cpq-pricing",
      "sources": [
        "apply-aggregate-pricing"
      ],
      "related": [
        "pricing-element",
        "reporting-grain",
        "product-bundle"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "allowed-values",
      "term": "Allowed values",
      "aliases": [
        "Attribute values",
        "Picklist values"
      ],
      "definition": "The permitted choices for a defined characteristic, such as supported capacities or finishes.",
      "note": "A value’s being selectable does not prove it is compatible with every other option or priced differently.",
      "category": "catalog",
      "kind": "Native concept",
      "lesson": "catalog-attributes",
      "sources": [
        "create-product-categories-and-attributes",
        "work-with-product-classifications",
        "build-a-simple-product",
        "create-a-product-bundle"
      ],
      "related": [
        "product-attribute",
        "product-configuration",
        "price-impacting-attribute"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "amendment",
      "term": "Amendment",
      "aliases": [
        "Amendments",
        "Amend",
        "Amending"
      ],
      "definition": "A supported change to an existing customer asset or agreement, such as an effective-dated quantity or configuration change.",
      "note": "Verify existing quantity, requested delta, resulting total and financial treatment; direct field editing is not equivalent to the transaction.",
      "category": "assets",
      "kind": "Native concept",
      "lesson": "assets-history",
      "sources": [
        "provide-post-sales-support",
        "manage-customer-asset-amendments",
        "manage-customer-asset-renewals-and-cancellations"
      ],
      "related": [
        "upsell",
        "downsell",
        "effective-date"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "annual-contract-value",
      "term": "Annual contract value",
      "aliases": [
        "ACV"
      ],
      "definition": "An agreement’s value normalized to an annual basis under the organization’s reporting convention.",
      "note": "Definitions vary, particularly for one-time charges and usage. Agree the metric before comparing it with ARR or TCV.",
      "category": "metrics",
      "kind": "General metric",
      "lesson": "platform-access",
      "sources": [
        "provide-post-sales-support",
        "navigate-the-full-billing-lifecycle"
      ],
      "related": [
        "total-contract-value",
        "annual-recurring-revenue",
        "reporting-grain"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "annual-recurring-revenue",
      "term": "Annual recurring revenue",
      "aliases": [
        "ARR"
      ],
      "definition": "A normalized annual run-rate measure for qualifying recurring business.",
      "note": "A common approach annualizes monthly recurring revenue, but the organization must define inclusion and normalization rules explicitly.",
      "category": "metrics",
      "kind": "General metric",
      "lesson": "platform-access",
      "sources": [
        "provide-post-sales-support",
        "navigate-the-full-billing-lifecycle"
      ],
      "related": [
        "monthly-recurring-revenue",
        "annual-contract-value",
        "cash-collected"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "approval",
      "term": "Approval",
      "aliases": [
        "Approvals"
      ],
      "definition": "An authorized review/decision permitting a supported commercial or legal process to proceed.",
      "note": "Distinguish price-exception approval, contract approval and fulfillment completion; one does not automatically establish the others.",
      "category": "transactions",
      "kind": "Native concept",
      "lesson": "contracts-legal",
      "sources": [
        "work-with-quotes",
        "create-and-fulfill-orders",
        "dive-into-salesforce-contracts-capabilities"
      ],
      "related": [
        "manual-discount",
        "contract-state-model",
        "orchestration-plan"
      ],
      "checked": "2026-10-20",
      "autoLink": false
    },
    {
      "id": "arrears-billing",
      "term": "Arrears billing",
      "aliases": [
        "Bill in arrears",
        "In arrears"
      ],
      "definition": "Invoicing after the relevant service or consumption period.",
      "note": "It does not mean the customer is overdue; overdue status depends on the invoice’s payment terms and settlement.",
      "category": "billing",
      "kind": "Native concept",
      "lesson": "invoice-policy",
      "sources": [
        "explore-billing-features-and-roles",
        "navigate-the-full-billing-lifecycle",
        "generate-invoices",
        "glossary-billing"
      ],
      "related": [
        "advance-billing",
        "payment-terms",
        "collections"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "asset-action",
      "term": "Asset Action",
      "aliases": [
        "Asset actions",
        "AssetAction"
      ],
      "definition": "A dated event recording a change such as an initial sale, amendment, renewal or cancellation of an asset.",
      "note": "Use an action to answer what changed; use the relevant state periods to answer what was true during a date interval.",
      "category": "assets",
      "kind": "Native concept",
      "lesson": "assets-history",
      "sources": [
        "provide-post-sales-support",
        "manage-customer-asset-amendments",
        "manage-customer-asset-renewals-and-cancellations"
      ],
      "related": [
        "asset-state-period",
        "asset-action-source",
        "effective-date"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "asset-action-source",
      "term": "Asset Action Source",
      "aliases": [
        "AssetActionSource",
        "Asset action sources"
      ],
      "definition": "A relationship record tracing an asset action to the transaction source responsible for the change.",
      "note": "Source relationships support auditability; copying only a current asset total can lose lifecycle lineage.",
      "category": "assets",
      "kind": "Native concept",
      "lesson": "assets-history",
      "sources": [
        "glossary-transactions",
        "data-model"
      ],
      "related": [
        "asset-action",
        "order-product",
        "reconciliation"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "asset-state-period",
      "term": "Asset State Period",
      "aliases": [
        "Asset state periods",
        "AssetStatePeriod"
      ],
      "definition": "An interval representing the asset’s relevant quantity and commercial state for that span of time.",
      "note": "Do not sum all historical periods as simultaneous entitlements. Validate actual field behavior rather than assuming every amount field is populated automatically.",
      "category": "assets",
      "kind": "Native concept",
      "lesson": "assets-history",
      "sources": [
        "provide-post-sales-support",
        "manage-customer-asset-amendments",
        "manage-customer-asset-renewals-and-cancellations"
      ],
      "related": [
        "asset-action",
        "monthly-recurring-revenue",
        "effective-date"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "attribute-category",
      "term": "Attribute category",
      "aliases": [
        "Attribute categories"
      ],
      "definition": "A logical grouping of related product characteristics for organization and reuse.",
      "note": "It groups attributes, while a product category groups offerings for discovery. Keep the two hierarchies distinct.",
      "category": "catalog",
      "kind": "Native concept",
      "lesson": "catalog-attributes",
      "sources": [
        "create-product-categories-and-attributes",
        "work-with-product-classifications",
        "build-a-simple-product",
        "create-a-product-bundle"
      ],
      "related": [
        "product-attribute",
        "product-category",
        "product-classification"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "attribute-inheritance",
      "term": "Attribute inheritance",
      "aliases": [
        "Inherited attributes"
      ],
      "definition": "The process by which a product receives characteristic definitions from its associated classification.",
      "note": "Supported product-level refinements do not justify duplicating the common definition across every SKU.",
      "category": "catalog",
      "kind": "Native concept",
      "lesson": "catalog-attributes",
      "sources": [
        "create-product-categories-and-attributes",
        "work-with-product-classifications",
        "build-a-simple-product",
        "create-a-product-bundle"
      ],
      "related": [
        "product-classification",
        "allowed-values",
        "product-attribute"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "attribute-based-pricing",
      "term": "Attribute-based pricing",
      "aliases": [
        "Attribute based pricing",
        "Attribute-Based Price",
        "Attribute-based adjustment"
      ],
      "definition": "Pricing adjustments driven by selected characteristics, such as capacity or material.",
      "note": "The product needs the appropriate price-impacting attributes, data and pricing step. Configurability alone does not create an adjustment.",
      "category": "pricing",
      "kind": "Native concept",
      "lesson": "cpq-pricing",
      "sources": [
        "implement-attribute-based-pricing"
      ],
      "related": [
        "price-impacting-attribute",
        "pricing-procedure",
        "allowed-values"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "auto-task",
      "term": "Auto Task",
      "aliases": [
        "Auto tasks"
      ],
      "definition": "A fulfillment step type using Salesforce Flow to perform supported automated work.",
      "note": "It differs from a third-party callout or a human task; verify run-as access and what establishes successful completion.",
      "category": "fulfillment",
      "kind": "Native concept",
      "lesson": "contracts-orchestrate",
      "sources": [
        "discover-order-decomposition",
        "explore-order-orchestration",
        "define-dependencies-and-fulfillment-scenarios"
      ],
      "related": [
        "flow",
        "callout",
        "manual-task"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "billing-arrangement",
      "term": "Billing arrangement",
      "aliases": [
        "Billing arrangements"
      ],
      "definition": "A configuration allocating transaction billing to the owning or other billing accounts, potentially splitting it among accounts.",
      "note": "It governs who is invoiced, not which technical team fulfills the order. Current availability and setup are release-sensitive.",
      "category": "billing",
      "kind": "Native concept",
      "lesson": "invoice-policy",
      "sources": [
        "glossary-billing",
        "navigate-the-full-billing-lifecycle"
      ],
      "related": [
        "billing-profile",
        "invoice",
        "order-product"
      ],
      "checked": "2026-10-20",
      "releaseNote": "Current product learning: confirm availability in your licensed org and release. This entry is not a claim that the feature appears on the exam’s stated Summer ’25 blueprint.",
      "autoLink": true
    },
    {
      "id": "billing-frequency",
      "term": "Billing frequency",
      "aliases": [
        "Billing cadence",
        "Invoice cadence"
      ],
      "definition": "How often the relevant charges are invoiced, such as monthly or annually.",
      "note": "Keep it distinct from service duration, pricing term and payment terms; validate how the chosen model derives or configures it.",
      "category": "billing",
      "kind": "Native concept",
      "lesson": "invoice-policy",
      "sources": [
        "explore-billing-features-and-roles",
        "navigate-the-full-billing-lifecycle",
        "generate-invoices",
        "glossary-billing"
      ],
      "related": [
        "subscription-pricing",
        "payment-terms",
        "billing-schedule"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "billing-policy",
      "term": "Billing policy",
      "aliases": [
        "Billing policies"
      ],
      "definition": "Configuration governing whether and how an offering participates in invoicing, including applicable advance/arrears behavior.",
      "note": "It serves a different purpose from commercial price calculation or the customer’s payment due date.",
      "category": "billing",
      "kind": "Native concept",
      "lesson": "invoice-policy",
      "sources": [
        "explore-billing-features-and-roles",
        "navigate-the-full-billing-lifecycle",
        "generate-invoices",
        "glossary-billing"
      ],
      "related": [
        "billing-treatment",
        "payment-terms",
        "salesforce-pricing"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "billing-profile",
      "term": "Billing profile",
      "aliases": [
        "Billing profiles"
      ],
      "definition": "Customer-specific billing preferences such as billing contact/address and payment terms.",
      "note": "A profile does not calculate a volume discount or establish the quantity the customer consumed.",
      "category": "billing",
      "kind": "Native concept",
      "lesson": "invoice-policy",
      "sources": [
        "explore-billing-features-and-roles",
        "navigate-the-full-billing-lifecycle",
        "generate-invoices",
        "glossary-billing"
      ],
      "related": [
        "payment-terms",
        "billing-arrangement",
        "invoice"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "billing-schedule",
      "term": "Billing schedule",
      "aliases": [
        "Billing schedules"
      ],
      "definition": "A representation of how the relevant order-product amount is billed over time.",
      "note": "Trace schedule dates and amounts separately from the quote’s price and from the invoice’s payment due date.",
      "category": "billing",
      "kind": "Native concept",
      "lesson": "invoice-policy",
      "sources": [
        "explore-billing-features-and-roles",
        "navigate-the-full-billing-lifecycle",
        "generate-invoices",
        "glossary-billing"
      ],
      "related": [
        "billing-schedule-group",
        "order-product",
        "billing-frequency"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "billing-schedule-group",
      "term": "Billing schedule group",
      "aliases": [
        "Billing schedule groups"
      ],
      "definition": "A grouping of related billing schedules for the relevant order-product lifecycle.",
      "note": "Amendment or cancellation processing can create additional related schedules; grouping supports reconciliation rather than proving all charges are invoiced.",
      "category": "billing",
      "kind": "Native concept",
      "lesson": "invoice-policy",
      "sources": [
        "explore-billing-features-and-roles",
        "navigate-the-full-billing-lifecycle",
        "generate-invoices",
        "glossary-billing"
      ],
      "related": [
        "billing-schedule",
        "amendment",
        "cancellation"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "billing-treatment",
      "term": "Billing treatment",
      "aliases": [
        "Billing treatments"
      ],
      "definition": "Configuration describing how a transaction amount is to be billed under the applicable schedule or milestones.",
      "note": "A treatment describes invoicing behavior, while a product selling model describes how the offering is sold.",
      "category": "billing",
      "kind": "Native concept",
      "lesson": "invoice-policy",
      "sources": [
        "explore-billing-features-and-roles",
        "navigate-the-full-billing-lifecycle",
        "generate-invoices",
        "glossary-billing"
      ],
      "related": [
        "billing-treatment-item",
        "product-selling-model",
        "billing-schedule"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "billing-treatment-item",
      "term": "Billing treatment item",
      "aliases": [
        "Billing treatment items"
      ],
      "definition": "A component of a billing treatment defining relevant amounts or timing for a billing event, including milestone allocations.",
      "note": "For example, staged allocations and payment terms are separate controls; do not simulate billing timing by changing the product price.",
      "category": "billing",
      "kind": "Native concept",
      "lesson": "invoice-policy",
      "sources": [
        "explore-billing-features-and-roles",
        "navigate-the-full-billing-lifecycle",
        "generate-invoices",
        "glossary-billing"
      ],
      "related": [
        "billing-treatment",
        "milestone-billing",
        "payment-terms"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "billings",
      "term": "Billings",
      "aliases": [
        "Billed value",
        "Invoiced amount"
      ],
      "definition": "The amount invoiced in the defined reporting scope and period.",
      "note": "Specify how credits and taxes are treated. An invoice-based measure is different from a quote amount or cash receipt.",
      "category": "metrics",
      "kind": "General metric",
      "lesson": "platform-access",
      "sources": [
        "provide-post-sales-support",
        "navigate-the-full-billing-lifecycle"
      ],
      "related": [
        "invoice",
        "bookings",
        "cash-collected"
      ],
      "checked": "2026-10-20",
      "autoLink": false
    },
    {
      "id": "bookings",
      "term": "Bookings",
      "aliases": [
        "Booked value",
        "Booked revenue"
      ],
      "definition": "The value recorded when a qualifying commercial commitment is booked under the organization’s policy.",
      "note": "Bookings, invoices, accounting recognition and collected cash occur at different boundaries and must not be substituted for each other.",
      "category": "metrics",
      "kind": "General metric",
      "lesson": "platform-access",
      "sources": [
        "provide-post-sales-support",
        "navigate-the-full-billing-lifecycle"
      ],
      "related": [
        "billings",
        "cash-collected",
        "revenue-recognition"
      ],
      "checked": "2026-10-20",
      "autoLink": false
    },
    {
      "id": "bundle-based-pricing",
      "term": "Bundle-based pricing",
      "aliases": [
        "Bundle based pricing",
        "Bundle Based Price"
      ],
      "definition": "An adjustment applying because a product is purchased in a qualifying bundle context.",
      "note": "An equivalent standalone sale need not receive the same adjustment. Test parent/child context and eligible components.",
      "category": "pricing",
      "kind": "Native concept",
      "lesson": "cpq-pricing",
      "sources": [
        "set-up-bundle-based-pricing"
      ],
      "related": [
        "product-bundle",
        "price-adjustment-schedule",
        "pricing-procedure"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "business-api",
      "term": "Business API",
      "aliases": [
        "Business APIs",
        "Composable APIs"
      ],
      "definition": "An interface exposing a business capability such as catalog discovery or pricing, with its supported inputs and behavior.",
      "note": "Direct record creation is not automatically equivalent to the business operation. Validate access, errors, limits and lifecycle semantics.",
      "category": "platform",
      "kind": "Native concept",
      "lesson": "platform-context",
      "sources": [
        "catalog-api",
        "get-to-know-context-service"
      ],
      "related": [
        "headless",
        "transaction-management",
        "idempotency"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "business-object-transformation",
      "term": "Business object transformation",
      "aliases": [
        "Object transformation"
      ],
      "definition": "Mapping data representing one business object into the structure of another, such as a quote-to-order transformation.",
      "note": "Transformation and persistence are different responsibilities. Successful conversion must still preserve the intended commercial relationships.",
      "category": "platform",
      "kind": "Native concept",
      "lesson": "platform-context",
      "sources": [
        "get-to-know-context-service"
      ],
      "related": [
        "context-mapping",
        "persistence",
        "order"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "business-rules-engine",
      "term": "Business Rules Engine",
      "aliases": [
        "BRE"
      ],
      "definition": "A platform capability for defining and invoking business decisions and calculations with supported rule tools.",
      "note": "It is not a new label for SBQQ price rules. Separate reusable decisions from the flows and experiences that call them.",
      "category": "rules",
      "kind": "Native concept",
      "lesson": "cpq-configure",
      "sources": [
        "get-to-know-business-rules-engine",
        "use-product-configurator-with-business-rules-engine",
        "explore-product-configurator-with-constraint-rules-engine"
      ],
      "related": [
        "expression-set",
        "decision-matrix",
        "decision-table"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "callout",
      "term": "Callout",
      "aliases": [
        "Callouts",
        "Call-out"
      ],
      "definition": "A fulfillment step or integration action invoking an external system.",
      "note": "A timeout can leave an ambiguous outcome. Reconcile identifiers and side effects before retrying.",
      "category": "fulfillment",
      "kind": "Native concept",
      "lesson": "contracts-orchestrate",
      "sources": [
        "discover-order-decomposition",
        "explore-order-orchestration",
        "define-dependencies-and-fulfillment-scenarios"
      ],
      "related": [
        "auto-task",
        "idempotency",
        "fallout"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "cancellation",
      "term": "Cancellation",
      "aliases": [
        "Cancellations",
        "Cancel"
      ],
      "definition": "A supported effective-dated ending of an existing service or asset relationship.",
      "note": "Preserve prior history. Service termination, a credit and actual return of money require distinct evidence.",
      "category": "assets",
      "kind": "Native concept",
      "lesson": "assets-history",
      "sources": [
        "manage-customer-asset-renewals-and-cancellations",
        "navigate-the-full-billing-lifecycle"
      ],
      "related": [
        "effective-date",
        "credit-memo",
        "refund"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "cardinality",
      "term": "Cardinality",
      "aliases": [
        "Quantity limits",
        "Local cardinality",
        "Group cardinality"
      ],
      "definition": "Rules defining permitted numbers or quantities of components or selections in a product structure.",
      "note": "Distinguish limits on a component relationship from limits applying to a whole group. Check the supported model and release.",
      "category": "catalog",
      "kind": "Native concept",
      "lesson": "catalog-attributes",
      "sources": [
        "glossary-catalog",
        "create-a-product-bundle"
      ],
      "related": [
        "component-group",
        "product-component",
        "product-configurator"
      ],
      "checked": "2026-10-20",
      "releaseNote": "Current product learning: confirm availability in your licensed org and release. This entry is not a claim that the feature appears on the exam’s stated Summer ’25 blueprint.",
      "autoLink": true
    },
    {
      "id": "cash-collected",
      "term": "Cash collected",
      "aliases": [
        "Collected cash",
        "Cash collection"
      ],
      "definition": "Funds actually received under the relevant payment and reporting policy.",
      "note": "A correct quote, an invoice or recurring-revenue run rate does not prove money was collected.",
      "category": "metrics",
      "kind": "General metric",
      "lesson": "platform-access",
      "sources": [
        "provide-post-sales-support",
        "navigate-the-full-billing-lifecycle"
      ],
      "related": [
        "payment",
        "accounts-receivable",
        "revenue-recognition"
      ],
      "checked": "2026-10-20",
      "autoLink": false
    },
    {
      "id": "churn",
      "term": "Churn",
      "aliases": [
        "Customer churn",
        "Revenue churn"
      ],
      "definition": "Loss of customer relationships or recurring revenue under a defined reporting policy.",
      "note": "Specify customer-count versus revenue churn, the time window and the inclusion rules. An effective-dated cancellation and cash collection have different measurement effects.",
      "category": "metrics",
      "kind": "General metric",
      "lesson": "assets-cancel",
      "sources": [
        "navigate-the-full-billing-lifecycle",
        "manage-customer-asset-renewals-and-cancellations"
      ],
      "related": [
        "cancellation",
        "monthly-recurring-revenue",
        "reporting-grain"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "clause-library",
      "term": "Clause library",
      "aliases": [
        "Clause libraries"
      ],
      "definition": "A governed collection of approved contract language reusable during authoring.",
      "note": "Using approved wording does not eliminate review of negotiated changes or the need to preserve document versions.",
      "category": "transactions",
      "kind": "Native concept",
      "lesson": "contracts-legal",
      "sources": [
        "work-with-quotes",
        "create-and-fulfill-orders",
        "dive-into-salesforce-contracts-capabilities"
      ],
      "related": [
        "document-template",
        "document-version",
        "salesforce-contracts"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "co-termination",
      "term": "Co-termination",
      "aliases": [
        "Co-term",
        "Coterm",
        "Co-terminating"
      ],
      "definition": "Aligning the end dates of related services or terms under an explicit commercial policy.",
      "note": "Do not infer automatic support for every alignment scenario. Validate how dates, partial periods and renewals behave in the selected product/release.",
      "category": "assets",
      "kind": "Native concept",
      "lesson": "assets-history",
      "sources": [
        "provide-post-sales-support",
        "manage-customer-asset-amendments",
        "manage-customer-asset-renewals-and-cancellations"
      ],
      "related": [
        "effective-date",
        "proration",
        "renewal"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "coexistence",
      "term": "Coexistence",
      "aliases": [
        "Phased coexistence"
      ],
      "definition": "A deliberate operating model in which legacy and native capabilities run alongside one another within defined boundaries.",
      "note": "Clarify transaction ownership, integration contracts, data synchronization and financial reconciliation instead of assuming both systems can act independently on the same sale.",
      "category": "delivery",
      "kind": "Implementation concept",
      "lesson": "readiness-delivery",
      "sources": [
        "migration",
        "setup",
        "uat",
        "adoption",
        "catalog-api"
      ],
      "related": [
        "salesforce-cpq",
        "native-billing",
        "cutover"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "collections",
      "term": "Collections",
      "aliases": [
        "Collection"
      ],
      "definition": "The operational process of following up and resolving outstanding amounts owed.",
      "note": "Collections concerns receivables and customer payment behavior; it is not the same as contract renewal or usage capture.",
      "category": "billing",
      "kind": "Native concept",
      "lesson": "invoice-policy",
      "sources": [
        "explore-billing-features-and-roles",
        "navigate-the-full-billing-lifecycle",
        "generate-invoices",
        "glossary-billing"
      ],
      "related": [
        "dunning",
        "accounts-receivable",
        "payment-terms"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "commercial-product",
      "term": "Commercial product",
      "aliases": [
        "Commercial products"
      ],
      "definition": "A customer-facing offering describing what the buyer purchases.",
      "note": "Do not expose internal provisioning tasks merely because operations needs them. Map commercial intent to technical fulfillment separately.",
      "category": "catalog",
      "kind": "Native concept",
      "lesson": "catalog-attributes",
      "sources": [
        "create-product-categories-and-attributes",
        "work-with-product-classifications",
        "build-a-simple-product",
        "create-a-product-bundle"
      ],
      "related": [
        "technical-product",
        "decomposition",
        "product-bundle"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "compensatory-step",
      "term": "Compensatory step",
      "aliases": [
        "Compensatory steps",
        "Compensation"
      ],
      "definition": "Supported fulfillment work introduced to reconcile changes to an existing plan or its completed work.",
      "note": "Compensation is a designed response to changed fulfillment, not a universal database rollback or permission to repeat every task.",
      "category": "fulfillment",
      "kind": "Native concept",
      "lesson": "contracts-orchestrate",
      "sources": [
        "glossary-dro",
        "explore-order-orchestration"
      ],
      "related": [
        "orchestration-plan",
        "fallout",
        "reconciliation"
      ],
      "checked": "2026-10-20",
      "releaseNote": "Current product learning: confirm availability in your licensed org and release. This entry is not a claim that the feature appears on the exam’s stated Summer ’25 blueprint.",
      "autoLink": true
    },
    {
      "id": "component-group",
      "term": "Component group",
      "aliases": [
        "Product component group",
        "Component groups"
      ],
      "definition": "A grouping within a product hierarchy for organizing and constraining component selections.",
      "note": "Group-level limits are not automatically the same as the quantity allowed on one specific component.",
      "category": "catalog",
      "kind": "Native concept",
      "lesson": "catalog-attributes",
      "sources": [
        "create-product-categories-and-attributes",
        "work-with-product-classifications",
        "build-a-simple-product",
        "create-a-product-bundle"
      ],
      "related": [
        "cardinality",
        "product-component",
        "product-bundle"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "configurable-bundle",
      "term": "Configurable bundle",
      "aliases": [
        "Configurable bundles"
      ],
      "definition": "A bundle permitting supported runtime choices in optional components, quantities or attributes.",
      "note": "The model must still enforce required components, valid ranges and compatibility constraints.",
      "category": "catalog",
      "kind": "Native concept",
      "lesson": "catalog-attributes",
      "sources": [
        "create-product-categories-and-attributes",
        "work-with-product-classifications",
        "build-a-simple-product",
        "create-a-product-bundle"
      ],
      "related": [
        "static-bundle",
        "product-component",
        "cardinality"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "configurable-product",
      "term": "Configurable product",
      "aliases": [
        "Configurable products"
      ],
      "definition": "A product whose supported attributes or composition can be adjusted during the selling experience.",
      "note": "Configurability is distinct from a product’s simple-versus-bundle structure and from price impact.",
      "category": "catalog",
      "kind": "Native concept",
      "lesson": "catalog-attributes",
      "sources": [
        "create-product-categories-and-attributes",
        "work-with-product-classifications",
        "build-a-simple-product",
        "create-a-product-bundle"
      ],
      "related": [
        "simple-product",
        "configurable-bundle",
        "price-impacting-attribute"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "configuration-rule-library",
      "term": "Configuration rule library",
      "aliases": [
        "Rule library",
        "Rule libraries"
      ],
      "definition": "A governed collection of rules used by the supported rule-based configurator setup.",
      "note": "Activation and version selection matter; an authored rule is not automatically the rule executed by the experience.",
      "category": "rules",
      "kind": "Native concept",
      "lesson": "cpq-configure",
      "sources": [
        "get-to-know-business-rules-engine",
        "use-product-configurator-with-business-rules-engine",
        "explore-product-configurator-with-constraint-rules-engine"
      ],
      "related": [
        "business-rules-engine",
        "product-configurator",
        "expression-set"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "validation-rule",
      "term": "Configuration validation rule",
      "aliases": [
        "Validation rules",
        "Validation rule"
      ],
      "definition": "In product configuration, logic detecting and rejecting an invalid selection or combination.",
      "note": "This dictionary usage concerns configurator behavior; it is not automatically a standard object-level Salesforce validation rule.",
      "category": "rules",
      "kind": "Native concept",
      "lesson": "cpq-configure",
      "sources": [
        "get-to-know-business-rules-engine",
        "use-product-configurator-with-business-rules-engine",
        "explore-product-configurator-with-constraint-rules-engine"
      ],
      "related": [
        "exclusion-rule",
        "requirement-rule",
        "product-configurator"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "cpq",
      "term": "Configure, price, quote",
      "aliases": [
        "CPQ",
        "Configure price quote"
      ],
      "definition": "The business function of selecting a valid offering, calculating its commercial price and preparing a customer proposal.",
      "note": "CPQ is a capability category. In this study room, Salesforce CPQ means the SBQQ product, while native Revenue Management provides its own configuration, pricing and transaction capabilities.",
      "category": "platform",
      "kind": "Business concept",
      "lesson": "platform-map",
      "sources": [
        "product-identity",
        "get-started-with-product-configurator"
      ],
      "related": [
        "salesforce-cpq",
        "product-configurator",
        "salesforce-pricing"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "constraint-modeling-language",
      "term": "Constraint Modeling Language",
      "aliases": [
        "CML"
      ],
      "definition": "A language used to model product classes, attributes and configuration constraints in the constraint-based approach.",
      "note": "It is distinct from Apex and from the legacy CPQ calculator plugin. Learn its role before assuming implementation details.",
      "category": "rules",
      "kind": "Native concept",
      "lesson": "cpq-configure",
      "sources": [
        "get-to-know-business-rules-engine",
        "use-product-configurator-with-business-rules-engine",
        "explore-product-configurator-with-constraint-rules-engine"
      ],
      "related": [
        "constraint-rules-engine",
        "product-classification",
        "quote-calculator-plugin"
      ],
      "checked": "2026-10-20",
      "releaseNote": "Current product learning: confirm availability in your licensed org and release. This entry is not a claim that the feature appears on the exam’s stated Summer ’25 blueprint.",
      "autoLink": true
    },
    {
      "id": "constraint-rules-engine",
      "term": "Constraint Rules Engine",
      "aliases": [
        "CRE",
        "Constraint-based configuration",
        "Constraint based configuration"
      ],
      "definition": "An engine modeling valid product combinations through relationships and constraints rather than only independent if/then rules.",
      "note": "Useful for interdependent configurations, but exact availability and supported modeling capabilities are release-sensitive.",
      "category": "rules",
      "kind": "Native concept",
      "lesson": "cpq-configure",
      "sources": [
        "get-to-know-business-rules-engine",
        "use-product-configurator-with-business-rules-engine",
        "explore-product-configurator-with-constraint-rules-engine"
      ],
      "related": [
        "constraint-modeling-language",
        "product-configurator",
        "configuration-rule-library"
      ],
      "checked": "2026-10-20",
      "releaseNote": "Current product learning: confirm availability in your licensed org and release. This entry is not a claim that the feature appears on the exam’s stated Summer ’25 blueprint.",
      "autoLink": true
    },
    {
      "id": "consumption-management",
      "term": "Consumption Management",
      "aliases": [
        "Consumption processing"
      ],
      "definition": "The capture and processing of customer usage into traceable records and summaries for later treatment.",
      "note": "Separate raw measurement, aggregation, rating and invoice generation; not every intermediate record is invoice-ready.",
      "category": "usage",
      "kind": "Native concept",
      "lesson": "invoice-usage",
      "sources": [
        "get-to-know-usage-management",
        "set-up-and-sell-products",
        "manage-wallets-and-track-consumption",
        "glossary-rate"
      ],
      "related": [
        "usage-record",
        "ratable-summary",
        "liable-summary"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "context-attribute",
      "term": "Context attribute",
      "aliases": [
        "Context attributes"
      ],
      "definition": "A value defined on a context node for use by a consuming process.",
      "note": "This is different from a catalog product characteristic. Its source, tag and runtime value must be understood.",
      "category": "platform",
      "kind": "Native concept",
      "lesson": "platform-context",
      "sources": [
        "explore-context-service-components-and-processes"
      ],
      "related": [
        "product-attribute",
        "context-tag",
        "context-node"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "context-definition",
      "term": "Context definition",
      "aliases": [
        "Context definitions"
      ],
      "definition": "Design-time metadata describing the structure and mappings used to supply information to a process.",
      "note": "A definition is not a populated quote or a permanent duplicate of every source record.",
      "category": "platform",
      "kind": "Native concept",
      "lesson": "platform-context",
      "sources": [
        "get-to-know-context-service",
        "explore-context-service-components-and-processes"
      ],
      "related": [
        "context-structure",
        "context-instance",
        "context-mapping"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "context-instance",
      "term": "Context instance",
      "aliases": [
        "Context instances"
      ],
      "definition": "A runtime instantiation of the context definition containing the data used by a process.",
      "note": "Treat runtime state and stored business records separately; a changed transient value is not proof of a database update.",
      "category": "platform",
      "kind": "Native concept",
      "lesson": "platform-context",
      "sources": [
        "get-to-know-context-service",
        "explore-context-service-components-and-processes"
      ],
      "related": [
        "context-definition",
        "hydration",
        "persistence"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "context-mapping",
      "term": "Context mapping",
      "aliases": [
        "Context mappings"
      ],
      "definition": "Configuration connecting logical context nodes and attributes to source objects and fields.",
      "note": "Read and write mappings can serve different purposes. A correct source value does not prove the consuming context received it.",
      "category": "platform",
      "kind": "Native concept",
      "lesson": "platform-context",
      "sources": [
        "explore-context-service-components-and-processes"
      ],
      "related": [
        "context-tag",
        "hydration",
        "persistence"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "context-node",
      "term": "Context node",
      "aliases": [
        "Context nodes"
      ],
      "definition": "A logical entity or grouping in a context structure, with attributes and possible child relationships.",
      "note": "A node can map to source data without being an independently persisted Salesforce business object.",
      "category": "platform",
      "kind": "Native concept",
      "lesson": "platform-context",
      "sources": [
        "explore-context-service-components-and-processes"
      ],
      "related": [
        "context-attribute",
        "context-mapping",
        "context-structure"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "context-service",
      "term": "Context Service",
      "aliases": [
        "Context Services"
      ],
      "definition": "A platform service that supplies a logical data model and runtime data to consuming business processes.",
      "note": "Trace source data, mappings, tags and runtime values before diagnosing a calculation as a rule defect.",
      "category": "platform",
      "kind": "Native concept",
      "lesson": "platform-context",
      "sources": [
        "get-to-know-context-service",
        "explore-context-service-components-and-processes"
      ],
      "related": [
        "context-definition",
        "context-instance",
        "context-mapping"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "context-structure",
      "term": "Context structure",
      "aliases": [
        "Context structures"
      ],
      "definition": "The arrangement of nodes and attributes within a context definition.",
      "note": "Model the business relationships the consumer requires; do not confuse the logical structure with the physical source schema.",
      "category": "platform",
      "kind": "Native concept",
      "lesson": "platform-context",
      "sources": [
        "explore-context-service-components-and-processes"
      ],
      "related": [
        "context-node",
        "context-attribute",
        "context-definition"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "context-tag",
      "term": "Context tag",
      "aliases": [
        "Context tags"
      ],
      "definition": "An alias through which consuming logic identifies a context node or attribute.",
      "note": "A tag does not automatically create a source field or populate itself; mappings and hydration supply the value.",
      "category": "platform",
      "kind": "Native concept",
      "lesson": "platform-context",
      "sources": [
        "explore-context-service-components-and-processes",
        "create-a-pricing-procedure-with-the-list-price-element"
      ],
      "related": [
        "context-mapping",
        "hydration",
        "pricing-variable"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "contract",
      "term": "Contract",
      "aliases": [
        "Contracts"
      ],
      "definition": "A business agreement recording relevant commercial/legal terms between parties.",
      "note": "A Contract record, a signed document, item pricing and asset relationships serve related but different purposes.",
      "category": "transactions",
      "kind": "Native concept",
      "lesson": "contracts-legal",
      "sources": [
        "work-with-quotes",
        "create-and-fulfill-orders",
        "dive-into-salesforce-contracts-capabilities"
      ],
      "related": [
        "salesforce-contracts",
        "contract-item-price",
        "asset"
      ],
      "checked": "2026-10-20",
      "autoLink": false
    },
    {
      "id": "contract-item-price",
      "term": "Contract Item Price",
      "aliases": [
        "ContractItemPrice",
        "Contract item prices"
      ],
      "definition": "A native record representing agreed item-level commercial pricing associated with a contract.",
      "note": "It serves pricing; it is not the contract’s clause library or the legacy CPQ contracted-price object.",
      "category": "pricing",
      "kind": "Native concept",
      "lesson": "cpq-pricing",
      "sources": [
        "configure-contract-based-pricing",
        "data-model"
      ],
      "related": [
        "contract-based-pricing",
        "legacy-contracted-price",
        "salesforce-contracts"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "contract-state-model",
      "term": "Contract state model",
      "aliases": [
        "State model",
        "Contract state models"
      ],
      "definition": "Configuration governing an agreement’s lifecycle stages and available operations under the applicable contract type.",
      "note": "An approval, signature and activation are not interchangeable states or proof of downstream delivery.",
      "category": "transactions",
      "kind": "Native concept",
      "lesson": "contracts-legal",
      "sources": [
        "work-with-quotes",
        "create-and-fulfill-orders",
        "dive-into-salesforce-contracts-capabilities"
      ],
      "related": [
        "contract-type",
        "electronic-signature",
        "approval"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "contract-type",
      "term": "Contract type",
      "aliases": [
        "Contract types"
      ],
      "definition": "A classification of agreements with the relevant document and lifecycle behavior, such as a sales agreement or NDA.",
      "note": "Different agreement types can require different stages and permitted operations; avoid modeling all legal work as one quote status.",
      "category": "transactions",
      "kind": "Native concept",
      "lesson": "contracts-legal",
      "sources": [
        "work-with-quotes",
        "create-and-fulfill-orders",
        "dive-into-salesforce-contracts-capabilities"
      ],
      "related": [
        "contract-state-model",
        "salesforce-contracts",
        "document-template"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "contract-based-pricing",
      "term": "Contract-based pricing",
      "aliases": [
        "Contract based pricing",
        "Contract pricing"
      ],
      "definition": "Applying negotiated prices or adjustments using the relevant account/contract context and supported native pricing records.",
      "note": "Do not assume selecting a legal document alone loads all negotiated prices. Validate agreement context, eligibility and procedure behavior.",
      "category": "pricing",
      "kind": "Native concept",
      "lesson": "cpq-pricing",
      "sources": [
        "configure-contract-based-pricing"
      ],
      "related": [
        "contract-item-price",
        "contract",
        "pricing-procedure"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "obligation",
      "term": "Contractual obligation",
      "aliases": [
        "Obligation management",
        "Obligations"
      ],
      "definition": "A commitment under an agreement, such as delivery, payment or renewal-related duties.",
      "note": "Legal commitments need owners and follow-through; a signed document does not prove those commitments were met.",
      "category": "transactions",
      "kind": "Native concept",
      "lesson": "contracts-legal",
      "sources": [
        "work-with-quotes",
        "create-and-fulfill-orders",
        "dive-into-salesforce-contracts-capabilities"
      ],
      "related": [
        "salesforce-contracts",
        "service-level-agreement",
        "payment-terms"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "cost-book",
      "term": "Cost book",
      "aliases": [
        "CostBook",
        "Cost books"
      ],
      "definition": "A collection of relevant product cost data used in the supported commercial model.",
      "note": "Cost is not the list or net selling price. Native CostBook/CostBookEntry structure differs from the legacy CPQ cost-book representation.",
      "category": "pricing",
      "kind": "Concept / object landmark",
      "lesson": "cpq-pricing",
      "sources": [
        "data-model"
      ],
      "related": [
        "cost-book-entry",
        "price-book",
        "net-price"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "cost-book-entry",
      "term": "Cost-book entry",
      "aliases": [
        "CostBookEntry",
        "Cost book entry"
      ],
      "definition": "An individual cost-data record associated with its relevant cost book.",
      "note": "A cost record does not by itself establish a quote price or margin rule; validate the consuming pricing behavior and data mapping.",
      "category": "pricing",
      "kind": "Concept / object landmark",
      "lesson": "cpq-pricing",
      "sources": [
        "data-model"
      ],
      "related": [
        "cost-book",
        "price-book-entry",
        "pricing-procedure"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "legacy-contracted-price",
      "term": "CPQ contracted price",
      "aliases": [
        "Contracted price",
        "ContractedPrices"
      ],
      "definition": "The legacy CPQ mechanism/records for customer-specific contracted pricing.",
      "note": "Native Contract Item Price and procedure setup must be mapped explicitly rather than assuming identical storage or eligibility behavior.",
      "category": "legacy",
      "kind": "Legacy product / comparison",
      "lesson": "readiness-migration",
      "sources": [
        "differences",
        "data-model",
        "product-identity",
        "migration"
      ],
      "related": [
        "contract-item-price",
        "contract-based-pricing",
        "salesforce-cpq"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "legacy-price-rule",
      "term": "CPQ price rule",
      "aliases": [
        "Price rule",
        "Price rules"
      ],
      "definition": "A managed-package CPQ configuration for changing relevant calculation values under its conditions and evaluation sequence.",
      "note": "The native pricing procedure and element model has different execution semantics; preserve commercial intent rather than blindly copying records.",
      "category": "legacy",
      "kind": "Legacy product / comparison",
      "lesson": "readiness-migration",
      "sources": [
        "differences",
        "data-model",
        "product-identity",
        "migration"
      ],
      "related": [
        "pricing-procedure",
        "quote-calculator-plugin",
        "pricing-element"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "legacy-product-option",
      "term": "CPQ Product Option",
      "aliases": [
        "SBQQ Product Option",
        "Product Option"
      ],
      "definition": "A managed-package record used to represent component relationships in CPQ bundles.",
      "note": "Native catalog component structures require explicit modeling and migration of relationships; a renamed label does not make the records compatible.",
      "category": "legacy",
      "kind": "Legacy product / comparison",
      "lesson": "readiness-migration",
      "sources": [
        "differences",
        "data-model",
        "product-identity",
        "migration"
      ],
      "related": [
        "product-component",
        "product-bundle",
        "sbqq"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "credit-memo",
      "term": "Credit memo",
      "aliases": [
        "Credit note",
        "Credit memos"
      ],
      "definition": "A financial document reducing or adjusting the relevant amount owed.",
      "note": "A credit does not itself prove a cash refund occurred. Follow its application and any separate payment/refund transactions.",
      "category": "billing",
      "kind": "Native concept",
      "lesson": "invoice-policy",
      "sources": [
        "explore-billing-features-and-roles",
        "navigate-the-full-billing-lifecycle",
        "generate-invoices",
        "glossary-billing"
      ],
      "related": [
        "debit-memo",
        "refund",
        "payment-application"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "cross-lane-dependency",
      "term": "Cross-lane dependency",
      "aliases": [
        "Cross lane dependency",
        "Cross-lane dependencies"
      ],
      "definition": "A prerequisite connecting tasks located in different lanes of an orchestration plan.",
      "note": "Independent streams may run in parallel while a later task waits for the required outcomes from both.",
      "category": "fulfillment",
      "kind": "Native concept",
      "lesson": "contracts-orchestrate",
      "sources": [
        "discover-order-decomposition",
        "explore-order-orchestration",
        "define-dependencies-and-fulfillment-scenarios"
      ],
      "related": [
        "fulfillment-lane",
        "fulfillment-dependency",
        "milestone"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "cross-plan-dependency",
      "term": "Cross-plan dependency",
      "aliases": [
        "Cross plan dependency"
      ],
      "definition": "A prerequisite connecting steps in different fulfillment plans.",
      "note": "It is broader than a relationship between lanes in the same plan. Validate identifiers and supported coordination behavior.",
      "category": "fulfillment",
      "kind": "Native concept",
      "lesson": "contracts-orchestrate",
      "sources": [
        "glossary-dro",
        "explore-order-orchestration"
      ],
      "related": [
        "fulfillment-dependency",
        "cross-lane-dependency",
        "orchestration-plan"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "cross-sell",
      "term": "Cross-sell",
      "aliases": [
        "Cross sell",
        "Cross-selling"
      ],
      "definition": "Selling an additional distinct offering within an existing customer relationship.",
      "note": "Differentiate a new related purchase from changing the quantity of an installed offering; choose the supported transaction accordingly.",
      "category": "assets",
      "kind": "Native concept",
      "lesson": "assets-history",
      "sources": [
        "provide-post-sales-support",
        "manage-customer-asset-amendments",
        "manage-customer-asset-renewals-and-cancellations"
      ],
      "related": [
        "upsell",
        "amendment",
        "installed-base"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "currency",
      "term": "Currency",
      "aliases": [
        "Multi-currency",
        "Multicurrency"
      ],
      "definition": "The monetary denomination of commercial or financial values, with applicable price data and conversion conventions.",
      "note": "Changing a displayed currency is not proof that the correct price entry or accounting exchange-rate treatment was used.",
      "category": "pricing",
      "kind": "General concept in revenue context",
      "lesson": "cpq-pricing",
      "sources": [
        "create-a-pricing-procedure-with-the-list-price-element",
        "add-volume-and-manual-discounts",
        "configure-pricing-for-products"
      ],
      "related": [
        "price-book-entry",
        "legal-entity",
        "rounding"
      ],
      "checked": "2026-10-20",
      "autoLink": false
    },
    {
      "id": "cutover",
      "term": "Cutover",
      "aliases": [
        "Go-live",
        "Go live"
      ],
      "definition": "The planned transition to the new operating solution, including open transactions, data dependencies and support/recovery arrangements.",
      "note": "Define how existing customers continue to amend, renew and receive correct invoices; successful record loading alone is not enough.",
      "category": "delivery",
      "kind": "Implementation concept",
      "lesson": "readiness-delivery",
      "sources": [
        "migration",
        "setup",
        "uat",
        "adoption",
        "catalog-api"
      ],
      "related": [
        "coexistence",
        "reconciliation",
        "user-acceptance-testing"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "debit-memo",
      "term": "Debit memo",
      "aliases": [
        "Debit note",
        "Debit memos"
      ],
      "definition": "A financial adjustment document increasing the amount owed under the supported billing process.",
      "note": "It is not an extra payment receipt. Confirm supported tax and posting treatment for the org/release.",
      "category": "billing",
      "kind": "Native concept",
      "lesson": "invoice-policy",
      "sources": [
        "glossary-billing",
        "navigate-the-full-billing-lifecycle"
      ],
      "related": [
        "credit-memo",
        "invoice",
        "accounts-receivable"
      ],
      "checked": "2026-10-20",
      "releaseNote": "Current product learning: confirm availability in your licensed org and release. This entry is not a claim that the feature appears on the exam’s stated Summer ’25 blueprint.",
      "autoLink": true
    },
    {
      "id": "decision-explainer",
      "term": "Decision Explainer",
      "aliases": [
        "Explainability"
      ],
      "definition": "A capability for presenting explanations of supported business-rule results.",
      "note": "An explanation helps a user understand a decision; it does not replace validating inputs, rule versions and expected outcomes.",
      "category": "rules",
      "kind": "Native concept",
      "lesson": "cpq-configure",
      "sources": [
        "get-to-know-business-rules-engine"
      ],
      "related": [
        "business-rules-engine",
        "expression-set",
        "pricing-waterfall"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "decision-matrix",
      "term": "Decision matrix",
      "aliases": [
        "Decision matrices"
      ],
      "definition": "A lookup tool that matches inputs to a row and returns that row’s outputs.",
      "note": "Distinguish a single-row lookup from requirements needing multiple matching outcomes or a multi-step calculation.",
      "category": "rules",
      "kind": "Native concept",
      "lesson": "cpq-configure",
      "sources": [
        "get-to-know-business-rules-engine",
        "build-decisions-with-lookup-tables"
      ],
      "related": [
        "decision-table",
        "expression-set",
        "business-rules-engine"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "accountability",
      "term": "Decision ownership",
      "aliases": [
        "RACI",
        "Accountable owner"
      ],
      "definition": "Explicit responsibility and accountability for decisions and handoffs across sales, catalog, legal, operations and finance.",
      "note": "The last developer to edit a field is not automatically the accountable business owner. Agree who accepts each outcome.",
      "category": "delivery",
      "kind": "Implementation concept",
      "lesson": "readiness-delivery",
      "sources": [
        "migration",
        "setup",
        "uat",
        "adoption",
        "catalog-api"
      ],
      "related": [
        "scope-of-work",
        "reconciliation",
        "cutover"
      ],
      "checked": "2026-10-20",
      "autoLink": false
    },
    {
      "id": "decision-table",
      "term": "Decision table",
      "aliases": [
        "Decision tables"
      ],
      "definition": "A rule lookup supporting multiple matching outcomes for a set of inputs, including rules sourced from Salesforce records.",
      "note": "Check matching behavior and the consumer’s expectations rather than assuming every table behaves like a CPQ discount schedule.",
      "category": "rules",
      "kind": "Native concept",
      "lesson": "cpq-configure",
      "sources": [
        "get-to-know-business-rules-engine",
        "build-decisions-with-lookup-tables"
      ],
      "related": [
        "decision-matrix",
        "expression-set",
        "pricing-procedure"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "decomposition-rule",
      "term": "Decomposition rule",
      "aliases": [
        "Decomposition rules"
      ],
      "definition": "Logic determining the technical fulfillment representation derived from a commercial product.",
      "note": "It answers what delivery work is required, not the order in which every fulfillment task will execute.",
      "category": "fulfillment",
      "kind": "Native concept",
      "lesson": "contracts-orchestrate",
      "sources": [
        "discover-order-decomposition",
        "explore-order-orchestration",
        "define-dependencies-and-fulfillment-scenarios"
      ],
      "related": [
        "decomposition",
        "orchestration-plan",
        "technical-product"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "derived-pricing",
      "term": "Derived pricing",
      "aliases": [
        "Derived price",
        "Derived Price"
      ],
      "definition": "Calculating one product’s price from an identified source product and a defined relationship.",
      "note": "Finding the correct source is separate from applying the formula. A price dependency is not the same as a bundle discount.",
      "category": "pricing",
      "kind": "Native concept",
      "lesson": "cpq-pricing",
      "sources": [
        "explore-derived-pricing-and-discovery-procedures",
        "implement-derived-pricing"
      ],
      "related": [
        "pricing-discovery",
        "contract-based-pricing",
        "pricing-element"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "document-template",
      "term": "Document template",
      "aliases": [
        "Document templates",
        "Contract template"
      ],
      "definition": "A governed document structure combining approved content with relevant business data.",
      "note": "A template controls presentation and content; it does not itself validate pricing, record a signature or fulfill an order.",
      "category": "transactions",
      "kind": "Native concept",
      "lesson": "contracts-legal",
      "sources": [
        "work-with-quotes",
        "create-and-fulfill-orders",
        "dive-into-salesforce-contracts-capabilities"
      ],
      "related": [
        "clause-library",
        "document-version",
        "invoice-template"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "document-version",
      "term": "Document version",
      "aliases": [
        "Version management",
        "Document versions"
      ],
      "definition": "A tracked iteration of an agreement document during its lifecycle.",
      "note": "Preserve negotiation and approval history rather than overwriting every earlier version after a redline.",
      "category": "transactions",
      "kind": "Native concept",
      "lesson": "contracts-legal",
      "sources": [
        "work-with-quotes",
        "create-and-fulfill-orders",
        "dive-into-salesforce-contracts-capabilities"
      ],
      "related": [
        "clause-library",
        "contract-state-model",
        "salesforce-contracts"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "downsell",
      "term": "Downsell",
      "aliases": [
        "Downselling"
      ],
      "definition": "A commercial reduction in an existing offering’s quantity or value.",
      "note": "It is not necessarily a full cancellation. Verify effective dates, resulting entitlement and the applicable billing adjustment.",
      "category": "assets",
      "kind": "Native concept",
      "lesson": "assets-history",
      "sources": [
        "provide-post-sales-support",
        "manage-customer-asset-amendments",
        "manage-customer-asset-renewals-and-cancellations"
      ],
      "related": [
        "amendment",
        "cancellation",
        "credit-memo"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "dunning",
      "term": "Dunning",
      "aliases": [
        "Dunning orchestration"
      ],
      "definition": "A structured process of reminders and escalation for overdue receivables.",
      "note": "Availability and automation vary by offering/release; a reminder does not itself settle the invoice.",
      "category": "billing",
      "kind": "Native concept",
      "lesson": "invoice-policy",
      "sources": [
        "glossary-billing",
        "navigate-the-full-billing-lifecycle"
      ],
      "related": [
        "collections",
        "payment-terms",
        "accounts-receivable"
      ],
      "checked": "2026-10-20",
      "releaseNote": "Current product learning: confirm availability in your licensed org and release. This entry is not a claim that the feature appears on the exam’s stated Summer ’25 blueprint.",
      "autoLink": true
    },
    {
      "id": "dynamic-revenue-orchestrator",
      "term": "Dynamic Revenue Orchestrator",
      "aliases": [
        "DRO"
      ],
      "definition": "Native capabilities coordinating order fulfillment, including supported decomposition, orchestration and operational recovery.",
      "note": "It extends beyond creating an order record. Simple orders can be orchestrated without mandatory decomposition.",
      "category": "fulfillment",
      "kind": "Native concept",
      "lesson": "contracts-orchestrate",
      "sources": [
        "discover-order-decomposition",
        "explore-order-orchestration",
        "define-dependencies-and-fulfillment-scenarios"
      ],
      "related": [
        "decomposition",
        "orchestration-plan",
        "fallout"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "effective-date",
      "term": "Effective date",
      "aliases": [
        "Effective dates",
        "Effective-dated",
        "Effective dated"
      ],
      "definition": "The date on which a commercial change or state is intended to take effect.",
      "note": "Distinguish request date, processing date, service period and invoice date. Correct dates are essential to amendments and proration.",
      "category": "assets",
      "kind": "Native concept",
      "lesson": "assets-history",
      "sources": [
        "provide-post-sales-support",
        "manage-customer-asset-amendments",
        "manage-customer-asset-renewals-and-cancellations"
      ],
      "related": [
        "amendment",
        "asset-state-period",
        "proration"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "electronic-signature",
      "term": "Electronic signature",
      "aliases": [
        "E-signature",
        "Signature",
        "Contract execution"
      ],
      "definition": "The supported process by which parties execute an agreement electronically.",
      "note": "A signed agreement is not the same as order fulfillment or invoice payment; validate the actual integration and lifecycle state.",
      "category": "transactions",
      "kind": "Native concept",
      "lesson": "contracts-legal",
      "sources": [
        "work-with-quotes",
        "create-and-fulfill-orders",
        "dive-into-salesforce-contracts-capabilities"
      ],
      "related": [
        "contract-state-model",
        "obligation",
        "order"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "evergreen",
      "term": "Evergreen selling model",
      "aliases": [
        "Evergreen",
        "Evergreen subscription"
      ],
      "definition": "An ongoing selling approach continuing until ended under its applicable terms.",
      "note": "Evergreen is not a promise of a fixed renewal end date or an invoice frequency by itself.",
      "category": "catalog",
      "kind": "Native concept",
      "lesson": "catalog-attributes",
      "sources": [
        "create-product-categories-and-attributes",
        "work-with-product-classifications",
        "build-a-simple-product",
        "create-a-product-bundle"
      ],
      "related": [
        "term-defined",
        "product-selling-model",
        "cancellation"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "exclusion-rule",
      "term": "Exclusion rule",
      "aliases": [
        "Exclusion rules"
      ],
      "definition": "Configuration logic preventing incompatible or mutually exclusive selections.",
      "note": "A price surcharge is not an exclusion. Test that the prohibited combination is actually prevented in the supported channel.",
      "category": "rules",
      "kind": "Native concept",
      "lesson": "cpq-configure",
      "sources": [
        "get-to-know-business-rules-engine",
        "use-product-configurator-with-business-rules-engine",
        "explore-product-configurator-with-constraint-rules-engine"
      ],
      "related": [
        "validation-rule",
        "requirement-rule",
        "product-configuration"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "execution-identity",
      "term": "Execution identity",
      "aliases": [
        "Run-as user",
        "Run as user"
      ],
      "definition": "The user or integration identity under whose access a process or fulfillment step executes.",
      "note": "An administrator succeeding does not prove the intended sales or integration persona can perform the same action.",
      "category": "platform",
      "kind": "Native concept",
      "lesson": "platform-context",
      "sources": [
        "explore-order-orchestration",
        "agent"
      ],
      "related": [
        "permission-set",
        "permission-set-license",
        "record-access"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "expression-set",
      "term": "Expression set",
      "aliases": [
        "Expression sets"
      ],
      "definition": "An ordered set of decision or calculation steps, including supported conditions and lookups.",
      "note": "Use it to organize reusable decision logic; the consuming process still supplies inputs and handles the result.",
      "category": "rules",
      "kind": "Native concept",
      "lesson": "cpq-configure",
      "sources": [
        "get-to-know-business-rules-engine",
        "orchestrate-rules-with-expression-sets"
      ],
      "related": [
        "business-rules-engine",
        "decision-table",
        "pricing-procedure"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "fallout",
      "term": "Fallout management",
      "aliases": [
        "Fallout",
        "Fulfillment failure"
      ],
      "definition": "Diagnosis and recovery of problems preventing successful fulfillment.",
      "note": "A failed task and a delayed task are different situations. Preserve completed downstream work and reconcile ambiguous side effects.",
      "category": "fulfillment",
      "kind": "Native concept",
      "lesson": "contracts-orchestrate",
      "sources": [
        "discover-order-decomposition",
        "explore-order-orchestration",
        "define-dependencies-and-fulfillment-scenarios"
      ],
      "related": [
        "jeopardy",
        "idempotency",
        "reconciliation"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "feature-entitlement",
      "term": "Feature entitlement",
      "aliases": [
        "Licensing",
        "Product entitlement"
      ],
      "definition": "The organization’s licensed right to use a capability, subject to the applicable product, edition and prerequisites.",
      "note": "Do not infer Billing, orchestration or Agentforce availability solely from an administrator profile or a CPQ license.",
      "category": "platform",
      "kind": "Native concept",
      "lesson": "platform-context",
      "sources": [
        "licenses",
        "product-identity"
      ],
      "related": [
        "permission-set-license",
        "implementation-readiness",
        "revenue-management"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "field-level-security",
      "term": "Field-level security",
      "aliases": [
        "FLS",
        "Field level security"
      ],
      "definition": "Controls determining which object fields a user can read or edit.",
      "note": "A screen or integration can encounter missing field access even when the user can open the record.",
      "category": "platform",
      "kind": "Native concept",
      "lesson": "platform-context",
      "sources": [
        "agent",
        "licenses"
      ],
      "related": [
        "permission-set",
        "record-access",
        "execution-identity"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "flow",
      "term": "Flow",
      "aliases": [
        "Salesforce Flow",
        "Flows"
      ],
      "definition": "Salesforce automation used to coordinate supported processes and user interactions.",
      "note": "Flow can invoke a decision or service; copying pricing logic into every flow creates competing policy implementations.",
      "category": "rules",
      "kind": "Native concept",
      "lesson": "cpq-configure",
      "sources": [
        "get-to-know-business-rules-engine",
        "use-product-configurator-with-business-rules-engine",
        "explore-product-configurator-with-constraint-rules-engine"
      ],
      "related": [
        "omnistudio",
        "business-api",
        "auto-task"
      ],
      "checked": "2026-10-20",
      "autoLink": false
    },
    {
      "id": "fulfillment-dependency",
      "term": "Fulfillment dependency",
      "aliases": [
        "Dependencies",
        "Prerequisite",
        "Dependency"
      ],
      "definition": "A relationship requiring specified fulfillment work to complete before dependent work can proceed.",
      "note": "Express real business prerequisites rather than using arbitrary elapsed-time delays as completion evidence.",
      "category": "fulfillment",
      "kind": "Native concept",
      "lesson": "contracts-orchestrate",
      "sources": [
        "discover-order-decomposition",
        "explore-order-orchestration",
        "define-dependencies-and-fulfillment-scenarios"
      ],
      "related": [
        "cross-lane-dependency",
        "cross-plan-dependency",
        "orchestration-plan"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "fulfillment-lane",
      "term": "Fulfillment lane",
      "aliases": [
        "Swimlane",
        "Swimlanes",
        "Orchestration lane"
      ],
      "definition": "A grouping of orchestration work, often by responsible team or system.",
      "note": "Lane placement alone does not enforce execution order; configure the actual within-lane and cross-lane dependencies.",
      "category": "fulfillment",
      "kind": "Native concept",
      "lesson": "contracts-orchestrate",
      "sources": [
        "discover-order-decomposition",
        "explore-order-orchestration",
        "define-dependencies-and-fulfillment-scenarios"
      ],
      "related": [
        "orchestration-plan",
        "cross-lane-dependency",
        "fulfillment-step"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "fulfillment-request",
      "term": "Fulfillment request",
      "aliases": [
        "Fulfillment requests",
        "Suborder",
        "Suborders"
      ],
      "definition": "A representation of work resulting from fulfillment planning or decomposition for downstream delivery.",
      "note": "Maintain traceability to the customer’s order and commercial lines rather than treating technical work as unrelated new sales.",
      "category": "fulfillment",
      "kind": "Native concept",
      "lesson": "contracts-orchestrate",
      "sources": [
        "discover-order-decomposition",
        "explore-order-orchestration",
        "define-dependencies-and-fulfillment-scenarios"
      ],
      "related": [
        "decomposition",
        "order-product",
        "orchestration-plan"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "fulfillment-scope",
      "term": "Fulfillment scope",
      "aliases": [
        "Step scope",
        "Fulfillment step scope"
      ],
      "definition": "The level controlling how often a step is instantiated, such as once per plan, bundle or line.",
      "note": "Scope is distinct from dependencies. Incorrect scope can duplicate a shipment, provisioning call or invoice action.",
      "category": "fulfillment",
      "kind": "Native concept",
      "lesson": "contracts-orchestrate",
      "sources": [
        "discover-order-decomposition",
        "explore-order-orchestration",
        "define-dependencies-and-fulfillment-scenarios"
      ],
      "related": [
        "fulfillment-step",
        "fulfillment-dependency",
        "orchestration-plan"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "fulfillment-step",
      "term": "Fulfillment step",
      "aliases": [
        "Fulfillment step definition",
        "Fulfillment steps"
      ],
      "definition": "An individual definition of work or a marker/wait operation within an orchestration design.",
      "note": "Its type, scope, access and completion signal are separate design decisions. A definition is not evidence of a successful runtime task.",
      "category": "fulfillment",
      "kind": "Native concept",
      "lesson": "contracts-orchestrate",
      "sources": [
        "discover-order-decomposition",
        "explore-order-orchestration",
        "define-dependencies-and-fulfillment-scenarios"
      ],
      "related": [
        "fulfillment-scope",
        "auto-task",
        "callout"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "fulfillment-step-group",
      "term": "Fulfillment step group",
      "aliases": [
        "Step group",
        "Fulfillment step groups"
      ],
      "definition": "A reusable grouping of fulfillment step definitions within the supported orchestration design.",
      "note": "Reuse can simplify design, but dependencies and instantiation scope still need validation in each plan.",
      "category": "fulfillment",
      "kind": "Native concept",
      "lesson": "contracts-orchestrate",
      "sources": [
        "discover-order-decomposition",
        "explore-order-orchestration",
        "define-dependencies-and-fulfillment-scenarios"
      ],
      "related": [
        "fulfillment-step",
        "orchestration-plan",
        "fulfillment-scope"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "grant-binding",
      "term": "Grant binding",
      "aliases": [
        "Binding object",
        "Grant bindings"
      ],
      "definition": "Association of usage entitlements with a target such as an account, contract or asset under the configured binding policy.",
      "note": "Binding determines the scope in which resources can be pooled or tracked; it is distinct from pricing the resource.",
      "category": "usage",
      "kind": "Native concept",
      "lesson": "invoice-usage",
      "sources": [
        "get-to-know-usage-management",
        "set-up-and-sell-products",
        "manage-wallets-and-track-consumption",
        "glossary-rate"
      ],
      "related": [
        "usage-grant",
        "wallet",
        "usage-commitment"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "headless",
      "term": "Headless",
      "aliases": [
        "API-first",
        "API first"
      ],
      "definition": "Using business capabilities through interfaces independently of a particular user interface.",
      "note": "A portal can call shared services, but it still needs authentication, authorization and valid business inputs.",
      "category": "platform",
      "kind": "Native concept",
      "lesson": "platform-context",
      "sources": [
        "differences",
        "catalog-api"
      ],
      "related": [
        "business-api",
        "execution-identity",
        "product-configurator"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "hydration",
      "term": "Hydration",
      "aliases": [
        "Hydrate",
        "Hydrated"
      ],
      "definition": "Loading source data into a runtime context instance according to its definition and mappings.",
      "note": "Loading data is not the same as calculating a price or persisting a transaction.",
      "category": "platform",
      "kind": "Native concept",
      "lesson": "platform-context",
      "sources": [
        "get-to-know-context-service",
        "explore-context-service-components-and-processes"
      ],
      "related": [
        "context-instance",
        "persistence",
        "context-mapping"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "idempotency",
      "term": "Idempotency",
      "aliases": [
        "Idempotent"
      ],
      "definition": "An integration property in which repeating the same logical request does not create unintended duplicate business effects.",
      "note": "Design and test it for the actual downstream operation; a timeout alone cannot tell you whether remote provisioning already happened.",
      "category": "delivery",
      "kind": "Implementation concept",
      "lesson": "readiness-delivery",
      "sources": [
        "migration",
        "setup",
        "uat",
        "adoption",
        "catalog-api"
      ],
      "related": [
        "callout",
        "reconciliation",
        "fallout"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "implementation-readiness",
      "term": "Implementation readiness",
      "aliases": [
        "Readiness"
      ],
      "definition": "Evidence that the required entitlements, features, data, access, owners and environments are ready for the planned solution.",
      "note": "A working administrator demo is not proof that every persona and lifecycle handoff can operate in the target environment.",
      "category": "delivery",
      "kind": "Implementation concept",
      "lesson": "readiness-delivery",
      "sources": [
        "migration",
        "setup",
        "uat",
        "adoption",
        "catalog-api"
      ],
      "related": [
        "feature-entitlement",
        "user-acceptance-testing",
        "scope-of-work"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "industries-cpq",
      "term": "Industries CPQ",
      "aliases": [
        "Vlocity",
        "CME CPQ"
      ],
      "definition": "The Industries managed-package configuration/pricing offering, distinct from both SBQQ CPQ and native Revenue Management.",
      "note": "Similar business vocabulary does not make the architectures, objects or setup steps interchangeable.",
      "category": "legacy",
      "kind": "Legacy product / comparison",
      "lesson": "readiness-migration",
      "sources": [
        "differences",
        "data-model",
        "product-identity",
        "migration"
      ],
      "related": [
        "salesforce-cpq",
        "revenue-management",
        "product-configurator"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "installed-base",
      "term": "Installed base",
      "aliases": [
        "Installed-base",
        "Customer assets"
      ],
      "definition": "The customer’s purchased products or services and their relevant active/lifecycle state.",
      "note": "Identify the applicable date and scope. A historical period or proposed quote is not automatically an active entitlement today.",
      "category": "assets",
      "kind": "Native concept",
      "lesson": "assets-history",
      "sources": [
        "provide-post-sales-support",
        "manage-customer-asset-amendments",
        "manage-customer-asset-renewals-and-cancellations"
      ],
      "related": [
        "asset",
        "asset-state-period",
        "amendment"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "invoice",
      "term": "Invoice",
      "aliases": [
        "Invoices"
      ],
      "definition": "A financial document requesting payment for eligible charges under the billing process.",
      "note": "Creating an invoice does not prove it has been paid, that service was delivered or that accounting revenue recognition is complete.",
      "category": "billing",
      "kind": "Native concept",
      "lesson": "invoice-policy",
      "sources": [
        "explore-billing-features-and-roles",
        "navigate-the-full-billing-lifecycle",
        "generate-invoices",
        "glossary-billing"
      ],
      "related": [
        "invoice-line",
        "payment",
        "revenue-recognition"
      ],
      "checked": "2026-10-20",
      "autoLink": false
    },
    {
      "id": "invoice-line",
      "term": "Invoice line item",
      "aliases": [
        "Invoice line",
        "Invoice lines"
      ],
      "definition": "A line on an invoice representing the relevant charge and its financial details.",
      "note": "Its dates, amount, tax and source need reconciliation. A quote line and an invoice line have different lifecycle roles.",
      "category": "billing",
      "kind": "Native concept",
      "lesson": "invoice-policy",
      "sources": [
        "explore-billing-features-and-roles",
        "navigate-the-full-billing-lifecycle",
        "generate-invoices",
        "glossary-billing"
      ],
      "related": [
        "quote-line",
        "invoice",
        "tax-treatment"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "invoice-preview",
      "term": "Invoice preview",
      "aliases": [
        "Invoice previews"
      ],
      "definition": "A supported review of expected charges before the relevant invoice is finalized.",
      "note": "A preview is not a posted financial document or a payment; use it to verify amounts, dates and customer billing details.",
      "category": "billing",
      "kind": "Native concept",
      "lesson": "invoice-policy",
      "sources": [
        "explore-billing-features-and-roles",
        "navigate-the-full-billing-lifecycle",
        "generate-invoices",
        "glossary-billing"
      ],
      "related": [
        "invoice",
        "billing-profile",
        "billing-schedule"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "invoice-run",
      "term": "Invoice run",
      "aliases": [
        "Invoice batch",
        "Automated invoice run"
      ],
      "definition": "A scheduled or on-demand process creating eligible invoices for a defined scope.",
      "note": "Define eligibility, grouping, dates and error handling; running a batch is not proof every intended invoice posted successfully.",
      "category": "billing",
      "kind": "Native concept",
      "lesson": "invoice-policy",
      "sources": [
        "explore-billing-features-and-roles",
        "navigate-the-full-billing-lifecycle",
        "generate-invoices",
        "glossary-billing"
      ],
      "related": [
        "invoice",
        "reconciliation",
        "fallout"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "invoice-template",
      "term": "Invoice template",
      "aliases": [
        "Invoice PDF",
        "Invoice document template"
      ],
      "definition": "A document template used to present invoice information, such as charges, service periods and balances.",
      "note": "Presentation does not fix incorrect billing data, price calculation or tax policy.",
      "category": "billing",
      "kind": "Native concept",
      "lesson": "invoice-policy",
      "sources": [
        "explore-billing-features-and-roles",
        "navigate-the-full-billing-lifecycle",
        "generate-invoices",
        "glossary-billing"
      ],
      "related": [
        "document-template",
        "invoice-line",
        "invoice"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "jeopardy",
      "term": "Jeopardy handling",
      "aliases": [
        "Jeopardy",
        "SLA risk"
      ],
      "definition": "Handling the risk that fulfillment will miss its expected service-level timing.",
      "note": "Timing risk does not always mean a task has already failed. Define escalation ownership separately from technical recovery.",
      "category": "fulfillment",
      "kind": "Native concept",
      "lesson": "contracts-orchestrate",
      "sources": [
        "discover-order-decomposition",
        "explore-order-orchestration",
        "define-dependencies-and-fulfillment-scenarios"
      ],
      "related": [
        "service-level-agreement",
        "fallout",
        "manual-task"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "legal-entity",
      "term": "Legal entity",
      "aliases": [
        "Legal entities"
      ],
      "definition": "The business entity or operating jurisdiction providing the applicable legal/accounting context for financial transactions.",
      "note": "Validate currency, tax and accounting requirements; an Account’s name alone does not replace legal-entity setup.",
      "category": "billing",
      "kind": "Native concept",
      "lesson": "invoice-policy",
      "sources": [
        "explore-billing-features-and-roles",
        "navigate-the-full-billing-lifecycle",
        "generate-invoices",
        "glossary-billing"
      ],
      "related": [
        "tax-policy",
        "accounting-period",
        "accounts-receivable"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "liable-summary",
      "term": "Liable summary",
      "aliases": [
        "Liable summaries"
      ],
      "definition": "A usage-processing summary representing amounts owed after the applicable processing and rating steps.",
      "note": "Verify the handoff and eligible billing behavior. An intermediate liable amount is not automatically a posted invoice or payment.",
      "category": "usage",
      "kind": "Native concept",
      "lesson": "invoice-usage",
      "sources": [
        "get-to-know-usage-management",
        "set-up-and-sell-products",
        "manage-wallets-and-track-consumption",
        "glossary-rate"
      ],
      "related": [
        "ratable-summary",
        "invoice",
        "consumption-management"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "list-price",
      "term": "List price",
      "aliases": [
        "List prices"
      ],
      "definition": "The starting commercial price supplied by the applicable pricing data before relevant adjustments.",
      "note": "A starting amount is not necessarily the final unit price or the total billed across a service lifecycle.",
      "category": "pricing",
      "kind": "Native concept",
      "lesson": "cpq-pricing",
      "sources": [
        "create-a-pricing-procedure-with-the-list-price-element",
        "add-volume-and-manual-discounts",
        "configure-pricing-for-products"
      ],
      "related": [
        "net-price",
        "price-book-entry",
        "pricing-waterfall"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "asset",
      "term": "Managed asset",
      "aliases": [
        "Asset",
        "Assets",
        "Managed assets",
        "Customer Asset Lifecycle Management",
        "CALM"
      ],
      "definition": "A representation of a product or service a customer has purchased and that can participate in supported post-sale lifecycle operations.",
      "note": "Native managed assets are not merely SBQQ subscription records with a new label. Preserve relationships and effective-dated history.",
      "category": "assets",
      "kind": "Native concept",
      "lesson": "assets-history",
      "sources": [
        "provide-post-sales-support",
        "manage-customer-asset-amendments",
        "manage-customer-asset-renewals-and-cancellations"
      ],
      "related": [
        "asset-action",
        "asset-state-period",
        "installed-base"
      ],
      "checked": "2026-10-20",
      "autoLink": false
    },
    {
      "id": "manual-discount",
      "term": "Manual discount",
      "aliases": [
        "Manual discounts"
      ],
      "definition": "A supported adjustment entered by an authorized user rather than determined entirely from an automatic rule.",
      "note": "Its calculation basis, sequence and approval limits still need governance; manual input is not permission to bypass policy.",
      "category": "pricing",
      "kind": "Native concept",
      "lesson": "cpq-pricing",
      "sources": [
        "create-a-pricing-procedure-with-the-list-price-element",
        "add-volume-and-manual-discounts",
        "configure-pricing-for-products"
      ],
      "related": [
        "approval",
        "pricing-waterfall",
        "net-price"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "manual-task",
      "term": "Manual Task",
      "aliases": [
        "Manual tasks"
      ],
      "definition": "A fulfillment step requiring human work, input or verification.",
      "note": "It needs an owner and reliable completion evidence. Do not use it to conceal an unresolved integration requirement.",
      "category": "fulfillment",
      "kind": "Native concept",
      "lesson": "contracts-orchestrate",
      "sources": [
        "discover-order-decomposition",
        "explore-order-orchestration",
        "define-dependencies-and-fulfillment-scenarios"
      ],
      "related": [
        "auto-task",
        "fulfillment-step",
        "service-level-agreement"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "milestone",
      "term": "Milestone",
      "aliases": [
        "Milestones"
      ],
      "definition": "A marker for a significant fulfillment outcome or grouping of progress in an orchestration plan.",
      "note": "A milestone does not by itself perform shipping or provisioning. Fulfillment milestones and milestone-based billing must be linked deliberately.",
      "category": "fulfillment",
      "kind": "Native concept",
      "lesson": "contracts-orchestrate",
      "sources": [
        "discover-order-decomposition",
        "explore-order-orchestration",
        "define-dependencies-and-fulfillment-scenarios"
      ],
      "related": [
        "fulfillment-dependency",
        "milestone-billing",
        "orchestration-plan"
      ],
      "checked": "2026-10-20",
      "autoLink": false
    },
    {
      "id": "milestone-billing",
      "term": "Milestone-based billing",
      "aliases": [
        "Milestone billing",
        "Milestone-based"
      ],
      "definition": "Invoicing specified amounts when defined project or service milestones become eligible.",
      "note": "A fulfillment milestone must have an intentional connection to billing eligibility; a marker alone does not establish the charge.",
      "category": "billing",
      "kind": "Native concept",
      "lesson": "invoice-policy",
      "sources": [
        "explore-billing-features-and-roles",
        "navigate-the-full-billing-lifecycle",
        "generate-invoices",
        "glossary-billing"
      ],
      "related": [
        "billing-treatment-item",
        "milestone",
        "billing-schedule"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "monthly-recurring-revenue",
      "term": "Monthly recurring revenue",
      "aliases": [
        "MRR",
        "Current MRR"
      ],
      "definition": "A normalized monthly run-rate measure for the recurring portion of business under a defined policy.",
      "note": "It is not the amount invoiced or collected that month. Specify inclusions, dates and the asset/transaction grain.",
      "category": "metrics",
      "kind": "General metric",
      "lesson": "platform-access",
      "sources": [
        "provide-post-sales-support",
        "navigate-the-full-billing-lifecycle"
      ],
      "related": [
        "annual-recurring-revenue",
        "total-lifecycle-amount",
        "reporting-grain"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "mdq",
      "term": "Multi-dimensional quoting",
      "aliases": [
        "MDQ",
        "Multidimensional quoting"
      ],
      "definition": "A legacy CPQ approach for representing time-segmented commercial quoting.",
      "note": "Do not assume its package segment records transfer directly to native ramp deals; reconcile segment dates, quantities and pricing behavior.",
      "category": "legacy",
      "kind": "Legacy product / comparison",
      "lesson": "readiness-migration",
      "sources": [
        "differences",
        "data-model",
        "product-identity",
        "migration"
      ],
      "related": [
        "ramp-deal",
        "effective-date",
        "subscription-pricing"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "native-billing",
      "term": "Native Billing",
      "aliases": [
        "Revenue Management Billing",
        "Revenue Cloud Billing",
        "Billing"
      ],
      "definition": "The Salesforce-platform billing capabilities associated with the native revenue offering.",
      "note": "Do not assume setup or objects from the Salesforce Billing managed package apply unchanged; confirm the exact product and entitlement.",
      "category": "billing",
      "kind": "Native concept",
      "lesson": "invoice-policy",
      "sources": [
        "get-started-with-billing-revenue-cloud",
        "glossary-billing"
      ],
      "related": [
        "legacy-billing",
        "billing-policy",
        "invoice"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "net-price",
      "term": "Net price",
      "aliases": [
        "Net prices"
      ],
      "definition": "The amount remaining after the applicable pricing adjustments at the defined calculation level.",
      "note": "Clarify whether the value is per unit, per line or a transaction total; net price does not establish payment.",
      "category": "pricing",
      "kind": "Native concept",
      "lesson": "cpq-pricing",
      "sources": [
        "create-a-pricing-procedure-with-the-list-price-element",
        "add-volume-and-manual-discounts",
        "configure-pricing-for-products"
      ],
      "related": [
        "unit-price",
        "pricing-waterfall",
        "cash-collected"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "omnistudio",
      "term": "Omnistudio",
      "aliases": [
        "OmniStudio",
        "Omniscript",
        "OmniScript"
      ],
      "definition": "A toolkit for building guided digital experiences and related data interactions.",
      "note": "It can host a revenue experience, but is not itself synonymous with the catalog, pricing engine or transaction data model.",
      "category": "rules",
      "kind": "Native concept",
      "lesson": "cpq-configure",
      "sources": [
        "get-to-know-business-rules-engine",
        "create-and-configure-a-product-configurator-flow"
      ],
      "related": [
        "flow",
        "product-configurator",
        "context-service"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "one-time",
      "term": "One-time selling model",
      "aliases": [
        "One time",
        "One-time"
      ],
      "definition": "A selling approach for a nonrecurring purchase rather than ongoing service for a term.",
      "note": "One-time selling behavior does not imply the charge must be collected in a single payment or invoice.",
      "category": "catalog",
      "kind": "Native concept",
      "lesson": "catalog-attributes",
      "sources": [
        "create-product-categories-and-attributes",
        "work-with-product-classifications",
        "build-a-simple-product",
        "create-a-product-bundle"
      ],
      "related": [
        "term-defined",
        "evergreen",
        "billing-treatment"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "opportunity",
      "term": "Opportunity",
      "aliases": [
        "Opportunities"
      ],
      "definition": "The sales-pipeline record tracking the potential commercial deal.",
      "note": "An opportunity can relate to a quote, but pipeline stage is not evidence that an order was delivered, an asset changed or an invoice was paid.",
      "category": "transactions",
      "kind": "Concept / object landmark",
      "lesson": "cpq-transact",
      "sources": [
        "work-with-quotes",
        "data-model"
      ],
      "related": [
        "quote",
        "order",
        "bookings"
      ],
      "checked": "2026-10-20",
      "autoLink": false
    },
    {
      "id": "orchestration-plan",
      "term": "Orchestration plan",
      "aliases": [
        "Fulfillment plan",
        "Orchestration plans"
      ],
      "definition": "The coordinated set of fulfillment tasks and dependencies used to deliver an order.",
      "note": "Lanes organize work, while dependencies enforce prerequisites. A visual plan still needs valid execution and completion evidence.",
      "category": "fulfillment",
      "kind": "Native concept",
      "lesson": "contracts-orchestrate",
      "sources": [
        "discover-order-decomposition",
        "explore-order-orchestration",
        "define-dependencies-and-fulfillment-scenarios"
      ],
      "related": [
        "fulfillment-lane",
        "fulfillment-dependency",
        "fulfillment-scope"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "order",
      "term": "Order",
      "aliases": [
        "Orders"
      ],
      "definition": "A transaction representing the accepted purchase and the basis for relevant downstream delivery and financial processing.",
      "note": "Submission or activation is not proof all external work succeeded. Verify actual fulfillment, asset and billing outcomes.",
      "category": "transactions",
      "kind": "Native concept",
      "lesson": "contracts-legal",
      "sources": [
        "work-with-quotes",
        "create-and-fulfill-orders",
        "dive-into-salesforce-contracts-capabilities"
      ],
      "related": [
        "order-product",
        "orchestration-plan",
        "billing-schedule"
      ],
      "checked": "2026-10-20",
      "autoLink": false
    },
    {
      "id": "decomposition",
      "term": "Order decomposition",
      "aliases": [
        "Decomposition"
      ],
      "definition": "Translation of commercial order intent into the technical products or fulfillment requirements needed downstream.",
      "note": "Use it where the delivery model requires translation; do not add needless decomposition to every simple order.",
      "category": "fulfillment",
      "kind": "Native concept",
      "lesson": "contracts-orchestrate",
      "sources": [
        "discover-order-decomposition",
        "explore-order-orchestration",
        "define-dependencies-and-fulfillment-scenarios"
      ],
      "related": [
        "commercial-product",
        "technical-product",
        "fulfillment-request"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "order-product",
      "term": "Order product",
      "aliases": [
        "OrderItem",
        "Order line",
        "Order products"
      ],
      "definition": "A line item on an order describing an offering and its relevant transaction information.",
      "note": "It connects commercial intent to downstream work and billing; it is not itself a fulfilled service or paid invoice.",
      "category": "transactions",
      "kind": "Native concept",
      "lesson": "contracts-legal",
      "sources": [
        "work-with-quotes",
        "create-and-fulfill-orders",
        "dive-into-salesforce-contracts-capabilities"
      ],
      "related": [
        "order",
        "fulfillment-request",
        "billing-schedule"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "overage",
      "term": "Overage",
      "aliases": [
        "Overage pricing",
        "Usage overage"
      ],
      "definition": "Consumption beyond the applicable included allowance, treated under the configured overage policy.",
      "note": "Excess usage might incur charges or another defined response; never assume every offering blocks access or uses the same rate.",
      "category": "usage",
      "kind": "Native concept",
      "lesson": "invoice-usage",
      "sources": [
        "get-to-know-usage-management",
        "set-up-and-sell-products",
        "manage-wallets-and-track-consumption",
        "glossary-rate"
      ],
      "related": [
        "entitlement",
        "rate-card",
        "wallet"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "pause-step",
      "term": "Pause step",
      "aliases": [
        "Pause task",
        "Pause steps"
      ],
      "definition": "A supported orchestration step waiting for a condition or external work before proceeding.",
      "note": "Specify the completion signal and recovery behavior; indefinite waiting is not a fulfillment strategy.",
      "category": "fulfillment",
      "kind": "Native concept",
      "lesson": "contracts-orchestrate",
      "sources": [
        "discover-order-decomposition",
        "explore-order-orchestration",
        "define-dependencies-and-fulfillment-scenarios"
      ],
      "related": [
        "fulfillment-step",
        "callout",
        "fallout"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "payment",
      "term": "Payment",
      "aliases": [
        "Payments"
      ],
      "definition": "A record or event representing funds received and processed under the applicable payment process.",
      "note": "Receiving funds and applying them to a specific invoice are related but distinct actions.",
      "category": "billing",
      "kind": "Native concept",
      "lesson": "invoice-policy",
      "sources": [
        "explore-billing-features-and-roles",
        "navigate-the-full-billing-lifecycle",
        "generate-invoices",
        "glossary-billing"
      ],
      "related": [
        "payment-application",
        "refund",
        "cash-collected"
      ],
      "checked": "2026-10-20",
      "autoLink": false
    },
    {
      "id": "payment-application",
      "term": "Payment application",
      "aliases": [
        "Apply payment",
        "Payment allocation"
      ],
      "definition": "Allocation of a payment or supported balance to an invoice or receivable.",
      "note": "An unapplied payment may exist even while a specific invoice remains outstanding; reconcile both states.",
      "category": "billing",
      "kind": "General concept in revenue context",
      "lesson": "invoice-policy",
      "sources": [
        "explore-billing-features-and-roles",
        "navigate-the-full-billing-lifecycle",
        "generate-invoices",
        "glossary-billing"
      ],
      "related": [
        "payment",
        "invoice",
        "accounts-receivable"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "payment-terms",
      "term": "Payment terms",
      "aliases": [
        "Payment term",
        "Net 30",
        "Net 60"
      ],
      "definition": "The convention determining when an invoiced amount becomes due.",
      "note": "A due date is not the subscription’s service duration, the selling model or the invoice cadence.",
      "category": "billing",
      "kind": "Native concept",
      "lesson": "invoice-policy",
      "sources": [
        "explore-billing-features-and-roles",
        "navigate-the-full-billing-lifecycle",
        "generate-invoices",
        "glossary-billing"
      ],
      "related": [
        "billing-profile",
        "billing-frequency",
        "term-defined"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "permission-set",
      "term": "Permission set",
      "aliases": [
        "Permission sets"
      ],
      "definition": "A collection of user permissions granting supported operations and data access.",
      "note": "Assignment cannot provision a product the organization does not own, and it does not bypass record-sharing constraints.",
      "category": "platform",
      "kind": "Native concept",
      "lesson": "platform-context",
      "sources": [
        "agent",
        "licenses"
      ],
      "related": [
        "permission-set-license",
        "field-level-security",
        "record-access"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "permission-set-license",
      "term": "Permission set license",
      "aliases": [
        "PSL",
        "Permission set licenses"
      ],
      "definition": "A license assignment that makes an entitled product capability available for an eligible user.",
      "note": "It is distinct from a permission set. Product entitlement, feature enablement and user access all need verification.",
      "category": "platform",
      "kind": "Native concept",
      "lesson": "platform-context",
      "sources": [
        "licenses",
        "agent"
      ],
      "related": [
        "permission-set",
        "execution-identity",
        "feature-entitlement"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "persistence",
      "term": "Persistence",
      "aliases": [
        "Persist",
        "Persisting"
      ],
      "definition": "Writing intended runtime changes to their configured persistent data targets.",
      "note": "An application may change in-memory data without saving it. Identify the supported write operation and mapping explicitly.",
      "category": "platform",
      "kind": "Native concept",
      "lesson": "platform-context",
      "sources": [
        "get-to-know-context-service",
        "explore-context-service-components-and-processes"
      ],
      "related": [
        "context-instance",
        "context-mapping",
        "business-object-transformation"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "price-adjustment-schedule",
      "term": "Price adjustment schedule",
      "aliases": [
        "Price adjustment schedules"
      ],
      "definition": "A definition organizing supported price adjustments and their qualifying conditions.",
      "note": "Choose the appropriate type for quantity, attributes or bundle context rather than copying a CPQ discount schedule unexamined.",
      "category": "pricing",
      "kind": "Native concept",
      "lesson": "cpq-pricing",
      "sources": [
        "create-a-pricing-procedure-with-the-list-price-element",
        "add-volume-and-manual-discounts",
        "configure-pricing-for-products"
      ],
      "related": [
        "volume-discount",
        "attribute-based-pricing",
        "bundle-based-pricing"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "price-book",
      "term": "Price book",
      "aliases": [
        "Price books",
        "Pricebook",
        "Pricebook2"
      ],
      "definition": "A collection of commercial price entries used for selling offerings.",
      "note": "The appropriate product, currency and selling-model combination still needs valid entries and compatible pricing configuration.",
      "category": "pricing",
      "kind": "Native concept",
      "lesson": "cpq-pricing",
      "sources": [
        "create-a-pricing-procedure-with-the-list-price-element",
        "add-volume-and-manual-discounts",
        "configure-pricing-for-products"
      ],
      "related": [
        "price-book-entry",
        "list-price",
        "product-selling-model"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "price-book-entry",
      "term": "Price-book entry",
      "aliases": [
        "Price book entry",
        "PricebookEntry",
        "Price-book entries"
      ],
      "definition": "A record associating a product with a price book and applicable commercial price information.",
      "note": "Native selling-model and currency requirements must be validated; an existing product does not imply every price combination exists.",
      "category": "pricing",
      "kind": "Native concept",
      "lesson": "cpq-pricing",
      "sources": [
        "create-a-pricing-procedure-with-the-list-price-element",
        "add-volume-and-manual-discounts",
        "configure-pricing-for-products"
      ],
      "related": [
        "price-book",
        "selling-model-option",
        "list-price"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "price-impacting-attribute",
      "term": "Price-impacting attribute",
      "aliases": [
        "Price impacting attribute",
        "Price-impacting attributes"
      ],
      "definition": "A product characteristic configured to participate in determining price adjustments.",
      "note": "Visibility and configurability are not sufficient: pricing logic and mapped values must actually use the characteristic.",
      "category": "catalog",
      "kind": "Native concept",
      "lesson": "catalog-attributes",
      "sources": [
        "create-product-categories-and-attributes",
        "work-with-product-classifications",
        "build-a-simple-product",
        "create-a-product-bundle"
      ],
      "related": [
        "attribute-based-pricing",
        "product-attribute",
        "pricing-variable"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "pricing-data-sync",
      "term": "Pricing data synchronization",
      "aliases": [
        "Sync Pricing Data",
        "Pricing-data sync",
        "Pricing data sync"
      ],
      "definition": "The documented synchronization step making relevant pricing configuration and data available to the consuming capability.",
      "note": "Use it where required by the setup; do not apply it as a universal cure for incorrect inputs or formulas.",
      "category": "pricing",
      "kind": "Native concept",
      "lesson": "cpq-pricing",
      "sources": [
        "create-a-pricing-procedure-with-the-list-price-element",
        "add-volume-and-manual-discounts",
        "configure-pricing-for-products"
      ],
      "related": [
        "pricing-recipe",
        "price-book-entry",
        "simulation"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "pricing-discovery",
      "term": "Pricing discovery procedure",
      "aliases": [
        "Discovery procedure",
        "Pricing discovery"
      ],
      "definition": "Logic identifying relevant records or source products used by a pricing calculation.",
      "note": "The derived formula may be correct while discovery selects the wrong source; test both stages.",
      "category": "pricing",
      "kind": "Native concept",
      "lesson": "cpq-pricing",
      "sources": [
        "explore-derived-pricing-and-discovery-procedures"
      ],
      "related": [
        "derived-pricing",
        "pricing-variable",
        "rating-discovery"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "pricing-element",
      "term": "Pricing element",
      "aliases": [
        "Pricing elements"
      ],
      "definition": "A supported step in a pricing procedure performing an operation such as lookup, adjustment or aggregation.",
      "note": "Choose and order elements around the commercial policy; do not assume CPQ evaluation events are equivalent.",
      "category": "pricing",
      "kind": "Native concept",
      "lesson": "cpq-pricing",
      "sources": [
        "create-a-pricing-procedure-with-the-list-price-element",
        "add-volume-and-manual-discounts",
        "configure-pricing-for-products"
      ],
      "related": [
        "pricing-procedure",
        "list-price",
        "aggregate-pricing"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "pricing-procedure",
      "term": "Pricing procedure",
      "aliases": [
        "Pricing procedures"
      ],
      "definition": "An ordered sequence of pricing elements used to calculate the intended transaction price.",
      "note": "Order, mapped inputs, data matches and output destinations all matter. A correct result for one quote is not sufficient testing.",
      "category": "pricing",
      "kind": "Native concept",
      "lesson": "cpq-pricing",
      "sources": [
        "create-a-pricing-procedure-with-the-list-price-element",
        "add-volume-and-manual-discounts",
        "configure-pricing-for-products"
      ],
      "related": [
        "pricing-element",
        "pricing-waterfall",
        "pricing-variable"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "pricing-recipe",
      "term": "Pricing recipe",
      "aliases": [
        "Pricing recipes"
      ],
      "definition": "Pricing setup defining the applicable pricing configuration used with the supported procedure and data.",
      "note": "Follow the current org’s default, activation and synchronization requirements; a saved draft is not proof the intended setup is executing.",
      "category": "pricing",
      "kind": "Native concept",
      "lesson": "cpq-pricing",
      "sources": [
        "create-a-pricing-procedure-with-the-list-price-element",
        "add-volume-and-manual-discounts",
        "configure-pricing-for-products"
      ],
      "related": [
        "pricing-procedure",
        "pricing-data-sync",
        "simulation"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "pricing-variable",
      "term": "Pricing variable",
      "aliases": [
        "Input variable",
        "Output variable",
        "Context variables"
      ],
      "definition": "An input, intermediate value or output used by a pricing step and mapped to the required context information.",
      "note": "A named variable without a valid runtime value cannot implement the intended policy. Trace its source and mapping.",
      "category": "pricing",
      "kind": "Native concept",
      "lesson": "cpq-pricing",
      "sources": [
        "create-a-pricing-procedure-with-the-list-price-element",
        "add-volume-and-manual-discounts",
        "configure-pricing-for-products"
      ],
      "related": [
        "context-tag",
        "context-mapping",
        "pricing-procedure"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "pricing-waterfall",
      "term": "Pricing waterfall",
      "aliases": [
        "Price waterfall",
        "Pricing waterfalls"
      ],
      "definition": "The sequence of intermediate amounts and adjustments explaining how a final commercial price was reached.",
      "note": "Inspect stages and calculation bases, not only the final number. Keep it distinct from the consumption-rating waterfall.",
      "category": "pricing",
      "kind": "Native concept",
      "lesson": "cpq-pricing",
      "sources": [
        "create-a-pricing-procedure-with-the-list-price-element",
        "add-volume-and-manual-discounts",
        "configure-pricing-for-products"
      ],
      "related": [
        "pricing-procedure",
        "net-price",
        "rating-waterfall"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "simulation",
      "term": "Procedure simulation",
      "aliases": [
        "Simulation",
        "Simulate"
      ],
      "definition": "Running representative inputs through a supported procedure to inspect expected calculations before broader use.",
      "note": "Include boundary, no-match and overlapping-policy cases. One successful sample does not establish complete business correctness.",
      "category": "pricing",
      "kind": "Native concept",
      "lesson": "cpq-pricing",
      "sources": [
        "create-a-pricing-procedure-with-the-list-price-element",
        "add-volume-and-manual-discounts",
        "configure-pricing-for-products"
      ],
      "related": [
        "pricing-waterfall",
        "rating-procedure",
        "user-acceptance-testing"
      ],
      "checked": "2026-10-20",
      "autoLink": false
    },
    {
      "id": "product-attribute",
      "term": "Product attribute",
      "aliases": [
        "Product attributes",
        "Dynamic attribute",
        "Dynamic attributes",
        "Attribute definition"
      ],
      "definition": "A reusable characteristic such as capacity, connectivity or finish used to describe and configure offerings.",
      "note": "A catalog characteristic differs from a context attribute or a custom field used in managed-package CPQ configuration.",
      "category": "catalog",
      "kind": "Native concept",
      "lesson": "catalog-attributes",
      "sources": [
        "create-product-categories-and-attributes",
        "work-with-product-classifications",
        "build-a-simple-product",
        "create-a-product-bundle"
      ],
      "related": [
        "context-attribute",
        "price-impacting-attribute",
        "product-classification"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "product-bundle",
      "term": "Product bundle",
      "aliases": [
        "Bundle",
        "Bundled product",
        "Product bundles"
      ],
      "definition": "An offering with a hierarchy of included or selectable component products.",
      "note": "A bundle is not just several products in the same category. Required/optional composition and pricing need explicit design.",
      "category": "catalog",
      "kind": "Native concept",
      "lesson": "catalog-attributes",
      "sources": [
        "create-product-categories-and-attributes",
        "work-with-product-classifications",
        "build-a-simple-product",
        "create-a-product-bundle"
      ],
      "related": [
        "static-bundle",
        "configurable-bundle",
        "product-component"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "catalog",
      "term": "Product catalog",
      "aliases": [
        "Catalogs",
        "Catalog"
      ],
      "definition": "A collection of offerings organized for discovery, typically through categories and subcategories.",
      "note": "Browse organization, bundle composition and pricing are separate decisions even when they appear together to a seller.",
      "category": "catalog",
      "kind": "Native concept",
      "lesson": "catalog-attributes",
      "sources": [
        "create-product-categories-and-attributes",
        "work-with-product-classifications",
        "build-a-simple-product",
        "create-a-product-bundle"
      ],
      "related": [
        "product-category",
        "product-bundle",
        "price-book"
      ],
      "checked": "2026-10-20",
      "autoLink": false
    },
    {
      "id": "product-catalog-management",
      "term": "Product Catalog Management",
      "aliases": [
        "PCM"
      ],
      "definition": "Capabilities for defining, organizing and exposing products, attributes, classifications and relationships for selling.",
      "note": "Catalog design determines what an offer is and how it is discovered; it is not simply a renamed Product Family field.",
      "category": "catalog",
      "kind": "Native concept",
      "lesson": "catalog-attributes",
      "sources": [
        "create-product-categories-and-attributes",
        "work-with-product-classifications",
        "build-a-simple-product",
        "create-a-product-bundle"
      ],
      "related": [
        "catalog",
        "product-classification",
        "product-bundle"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "product-category",
      "term": "Product category",
      "aliases": [
        "Product categories",
        "Catalog category",
        "Catalog categories"
      ],
      "definition": "A browsing group for products within a catalog hierarchy.",
      "note": "A category is not a classification template or a bundle. Category membership does not by itself calculate a price.",
      "category": "catalog",
      "kind": "Native concept",
      "lesson": "catalog-attributes",
      "sources": [
        "create-product-categories-and-attributes",
        "work-with-product-classifications",
        "build-a-simple-product",
        "create-a-product-bundle"
      ],
      "related": [
        "product-classification",
        "attribute-category",
        "catalog"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "product-classification",
      "term": "Product classification",
      "aliases": [
        "Product classifications",
        "Classification"
      ],
      "definition": "A reusable template defining a group of dynamic attributes for similar products.",
      "note": "Products can share characteristic structure while differing in their allowed values. This is different from a browsing category.",
      "category": "catalog",
      "kind": "Native concept",
      "lesson": "catalog-attributes",
      "sources": [
        "create-product-categories-and-attributes",
        "work-with-product-classifications",
        "build-a-simple-product",
        "create-a-product-bundle"
      ],
      "related": [
        "product-attribute",
        "attribute-inheritance",
        "product-category"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "product-component",
      "term": "Product component",
      "aliases": [
        "Bundle component",
        "Components",
        "Product components",
        "ProductRelatedComponent"
      ],
      "definition": "An item participating in a bundle relationship, potentially with required/optional status and quantity behavior.",
      "note": "The native relationship model differs from SBQQ Product Option records; migrate the business structure explicitly.",
      "category": "catalog",
      "kind": "Native concept",
      "lesson": "catalog-attributes",
      "sources": [
        "create-product-categories-and-attributes",
        "work-with-product-classifications",
        "build-a-simple-product",
        "create-a-product-bundle"
      ],
      "related": [
        "product-bundle",
        "cardinality",
        "legacy-product-option"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "product-configuration",
      "term": "Product configuration",
      "aliases": [
        "Product configurations"
      ],
      "definition": "The selected combination of a product’s components, attributes and relevant quantities.",
      "note": "A configuration must satisfy its dependencies and restrictions independently of whether a user can see the options.",
      "category": "rules",
      "kind": "Native concept",
      "lesson": "cpq-configure",
      "sources": [
        "get-to-know-business-rules-engine",
        "use-product-configurator-with-business-rules-engine",
        "explore-product-configurator-with-constraint-rules-engine"
      ],
      "related": [
        "product-configurator",
        "product-component",
        "exclusion-rule"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "product-configurator",
      "term": "Product Configurator",
      "aliases": [
        "Configurator",
        "Product Configurators"
      ],
      "definition": "The experience and capabilities for selecting product components and attributes and validating the resulting configuration.",
      "note": "Choose the supported rules/constraint approach for the org and release. A valid price alone does not prove compatible products.",
      "category": "rules",
      "kind": "Native concept",
      "lesson": "cpq-configure",
      "sources": [
        "get-to-know-business-rules-engine",
        "use-product-configurator-with-business-rules-engine",
        "explore-product-configurator-with-constraint-rules-engine"
      ],
      "related": [
        "validation-rule",
        "requirement-rule",
        "constraint-rules-engine"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "product-discovery",
      "term": "Product discovery",
      "aliases": [
        "Guided selection",
        "Faceted search"
      ],
      "definition": "The process of finding suitable offerings using catalogs, filters and relevant context.",
      "note": "Finding a product does not prove that a chosen configuration, price or selling model is valid.",
      "category": "catalog",
      "kind": "Native concept",
      "lesson": "catalog-attributes",
      "sources": [
        "glossary-catalog",
        "create-a-product-bundle"
      ],
      "related": [
        "catalog",
        "product-qualification",
        "product-configurator"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "fulfillment-scenario",
      "term": "Product fulfillment scenario",
      "aliases": [
        "Fulfillment scenario",
        "Fulfillment scenarios"
      ],
      "definition": "Configuration selecting the applicable fulfillment behavior for a product or transaction circumstance.",
      "note": "Confirm scenario conditions and the resulting plan rather than assuming one static process fits every commercial request.",
      "category": "fulfillment",
      "kind": "Native concept",
      "lesson": "contracts-orchestrate",
      "sources": [
        "discover-order-decomposition",
        "explore-order-orchestration",
        "define-dependencies-and-fulfillment-scenarios"
      ],
      "related": [
        "orchestration-plan",
        "decomposition-rule",
        "effective-date"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "product-qualification",
      "term": "Product qualification",
      "aliases": [
        "Qualification rules",
        "Product qualification rules"
      ],
      "definition": "Evaluation of whether an offering is available or eligible in the buyer’s current context.",
      "note": "Discoverability and eligibility do not replace configuration compatibility or authorization to access customer data.",
      "category": "catalog",
      "kind": "Native concept",
      "lesson": "catalog-attributes",
      "sources": [
        "glossary-catalog",
        "create-a-product-bundle"
      ],
      "related": [
        "product-discovery",
        "product-configurator",
        "record-access"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "product-record",
      "term": "Product record",
      "aliases": [
        "Product2",
        "Products"
      ],
      "definition": "The product/service definition used as a foundation for the offering in the native catalog.",
      "note": "Product identity, configurable characteristics, selling-model options and transactional lines are different parts of the model. A Product2 record alone does not make every selling scenario ready.",
      "category": "catalog",
      "kind": "Concept / object landmark",
      "lesson": "catalog-selling",
      "sources": [
        "build-a-simple-product",
        "data-model"
      ],
      "related": [
        "simple-product",
        "product-selling-model",
        "product-attribute"
      ],
      "checked": "2026-10-20",
      "autoLink": false
    },
    {
      "id": "product-selling-model",
      "term": "Product Selling Model",
      "aliases": [
        "PSM",
        "Product Selling Models"
      ],
      "definition": "A model defining how an offering is sold, for example one-time, term-defined or evergreen.",
      "note": "It separates what the product is from the selling approach. It does not itself define every invoicing or consumption rule.",
      "category": "catalog",
      "kind": "Native concept",
      "lesson": "catalog-attributes",
      "sources": [
        "create-product-categories-and-attributes",
        "work-with-product-classifications",
        "build-a-simple-product",
        "create-a-product-bundle"
      ],
      "related": [
        "selling-model-option",
        "one-time",
        "term-defined",
        "evergreen"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "selling-model-option",
      "term": "Product Selling Model Option",
      "aliases": [
        "PSMO",
        "Selling-model option",
        "Selling model option"
      ],
      "definition": "The association making a selling model available for a product.",
      "note": "Also validate the corresponding price data; offering a model does not guarantee an appropriate price-book entry exists.",
      "category": "catalog",
      "kind": "Native concept",
      "lesson": "catalog-attributes",
      "sources": [
        "create-product-categories-and-attributes",
        "work-with-product-classifications",
        "build-a-simple-product",
        "create-a-product-bundle"
      ],
      "related": [
        "product-selling-model",
        "price-book-entry",
        "subscription-pricing"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "product-specification",
      "term": "Product specification",
      "aliases": [
        "Product specification type"
      ],
      "definition": "A supported classification of product definition used to distinguish relevant kinds of offerings and their behavior.",
      "note": "Confirm specification types and record-type setup for the native model; do not infer commercial visibility only from a product name.",
      "category": "catalog",
      "kind": "Concept / object landmark",
      "lesson": "catalog-bundles",
      "sources": [
        "glossary-catalog",
        "discover-order-decomposition"
      ],
      "related": [
        "commercial-product",
        "technical-product",
        "product-record"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "product-subcategory",
      "term": "Product subcategory",
      "aliases": [
        "Subcategory",
        "Subcategories",
        "Catalog subcategory"
      ],
      "definition": "A category placed beneath another category in the discovery hierarchy.",
      "note": "Use the parent relationship for navigation structure, not to imply inheritance of product attributes or component requirements.",
      "category": "catalog",
      "kind": "Native concept",
      "lesson": "catalog-attributes",
      "sources": [
        "create-product-categories-and-attributes",
        "work-with-product-classifications",
        "build-a-simple-product",
        "create-a-product-bundle"
      ],
      "related": [
        "product-category",
        "attribute-inheritance",
        "product-component"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "product-variant",
      "term": "Product variant",
      "aliases": [
        "Product variants",
        "Variation product"
      ],
      "definition": "A related offering differing from a shared core design in specific characteristics.",
      "note": "Distinguish a separately modeled variant from selecting an attribute value on the same configurable offer; current support is release-dependent.",
      "category": "catalog",
      "kind": "Native concept",
      "lesson": "catalog-attributes",
      "sources": [
        "glossary-catalog",
        "create-a-product-bundle"
      ],
      "related": [
        "product-attribute",
        "simple-product",
        "product-classification"
      ],
      "checked": "2026-10-20",
      "releaseNote": "Current product learning: confirm availability in your licensed org and release. This entry is not a claim that the feature appears on the exam’s stated Summer ’25 blueprint.",
      "autoLink": true
    },
    {
      "id": "product-to-cash",
      "term": "Product-to-cash",
      "aliases": [
        "P2C",
        "Product to cash"
      ],
      "definition": "The business lifecycle from defining an offering through selling, delivery, post-sale changes and financial collection.",
      "note": "It is broader than generating a quote. A price can be correct while fulfillment, asset history or invoicing still fails.",
      "category": "platform",
      "kind": "Native concept",
      "lesson": "platform-context",
      "sources": [
        "get-started-with-transaction-management",
        "get-started-with-billing-revenue-cloud"
      ],
      "related": [
        "quote-to-cash",
        "transaction-management",
        "native-billing"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "proration",
      "term": "Proration",
      "aliases": [
        "Prorate",
        "Prorated"
      ],
      "definition": "Applying a defined time-based convention to an amount for a partial period.",
      "note": "Confirm dates, units, rounding and the native convention; legacy CPQ proration settings are not automatically portable.",
      "category": "pricing",
      "kind": "Native concept",
      "lesson": "cpq-pricing",
      "sources": [
        "set-up-subscription-pricing-with-proration"
      ],
      "related": [
        "subscription-pricing",
        "effective-date",
        "rounding"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "quote",
      "term": "Quote",
      "aliases": [
        "Quotes"
      ],
      "definition": "A commercial proposal capturing the customer’s selected offerings, quantities, terms and prices.",
      "note": "A quote is not evidence of legal execution, delivery or payment. Native Quote records differ from SBQQ package quote records.",
      "category": "transactions",
      "kind": "Native concept",
      "lesson": "contracts-legal",
      "sources": [
        "work-with-quotes",
        "create-and-fulfill-orders",
        "dive-into-salesforce-contracts-capabilities"
      ],
      "related": [
        "quote-line",
        "contract",
        "order"
      ],
      "checked": "2026-10-20",
      "autoLink": false
    },
    {
      "id": "quote-calculator-plugin",
      "term": "Quote Calculator Plugin",
      "aliases": [
        "QCP",
        "Calculator plugin"
      ],
      "definition": "A legacy Salesforce CPQ extension mechanism for custom quote-calculation behavior.",
      "note": "Do not assume the same implementation runs inside native server-side pricing procedures; reassess the requirement and supported extensions.",
      "category": "legacy",
      "kind": "Legacy product / comparison",
      "lesson": "readiness-migration",
      "sources": [
        "differences",
        "data-model",
        "product-identity",
        "migration"
      ],
      "related": [
        "legacy-price-rule",
        "pricing-procedure",
        "salesforce-pricing"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "quote-line",
      "term": "Quote line item",
      "aliases": [
        "QuoteLineItem",
        "Quote line",
        "Quote lines",
        "Quote line items"
      ],
      "definition": "A line-level commercial record within a quote, containing the relevant offering and transaction details.",
      "note": "Trace quantity, model, attributes, dates and price at the intended line grain; do not assume SBQQ field semantics carry over.",
      "category": "transactions",
      "kind": "Native concept",
      "lesson": "contracts-legal",
      "sources": [
        "work-with-quotes",
        "create-and-fulfill-orders",
        "dive-into-salesforce-contracts-capabilities"
      ],
      "related": [
        "quote",
        "order-product",
        "reporting-grain"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "quote-to-cash",
      "term": "Quote-to-cash",
      "aliases": [
        "Q2C",
        "Quote to cash"
      ],
      "definition": "The lifecycle beginning with a customer quote and continuing through the relevant agreement, delivery, billing and payment processes.",
      "note": "Product-to-cash also emphasizes designing and managing the offering before a quote exists.",
      "category": "platform",
      "kind": "Native concept",
      "lesson": "platform-context",
      "sources": [
        "get-started-with-transaction-management",
        "create-and-fulfill-orders",
        "get-started-with-billing-revenue-cloud"
      ],
      "related": [
        "product-to-cash",
        "quote",
        "invoice"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "ramp-deal",
      "term": "Ramp deal",
      "aliases": [
        "Ramp deals",
        "Ramp segment"
      ],
      "definition": "A commercial arrangement with planned changes in quantity or price across defined periods.",
      "note": "Preserve segment dates and the configured price basis. A ramped commercial term is not merely changing the invoice’s due date.",
      "category": "pricing",
      "kind": "Native concept",
      "lesson": "cpq-pricing",
      "sources": [
        "glossary-transactions",
        "navigate-the-full-billing-lifecycle"
      ],
      "related": [
        "effective-date",
        "subscription-pricing",
        "billing-schedule"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "ratable-summary",
      "term": "Ratable summary",
      "aliases": [
        "Ratable summaries"
      ],
      "definition": "A consumption summary prepared for the supported rating process to determine charges.",
      "note": "Ratable refers to rate calculation here; do not confuse it with accounting revenue recognition merely because the words sound similar.",
      "category": "usage",
      "kind": "Native concept",
      "lesson": "invoice-usage",
      "sources": [
        "get-to-know-usage-management",
        "set-up-and-sell-products",
        "manage-wallets-and-track-consumption",
        "glossary-rate"
      ],
      "related": [
        "rating-procedure",
        "liable-summary",
        "revenue-recognition"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "rate-card",
      "term": "Rate card",
      "aliases": [
        "Rate cards"
      ],
      "definition": "A definition organizing the applicable per-resource rates and related qualifying conditions.",
      "note": "Match resource, unit, effective conditions and price-book context; a rate card is not a record of actual consumption.",
      "category": "usage",
      "kind": "Native concept",
      "lesson": "invoice-usage",
      "sources": [
        "get-to-know-usage-management",
        "set-up-and-sell-products",
        "manage-wallets-and-track-consumption",
        "glossary-rate"
      ],
      "related": [
        "rate-card-entry",
        "rate-tier",
        "usage-resource"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "rate-card-entry",
      "term": "Rate card entry",
      "aliases": [
        "Rate card entries"
      ],
      "definition": "An individual rate definition associated with its rate card and relevant qualifying/effective conditions.",
      "note": "A correct entry is insufficient if discovery selects the wrong resource, card or period.",
      "category": "usage",
      "kind": "Native concept",
      "lesson": "invoice-usage",
      "sources": [
        "glossary-rate",
        "set-up-and-sell-products"
      ],
      "related": [
        "rate-card",
        "rating-discovery",
        "effective-date"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "rate-management",
      "term": "Rate Management",
      "aliases": [
        "Rating",
        "Usage rating"
      ],
      "definition": "Capabilities for defining and calculating the charges/rates applicable to measured usage resources.",
      "note": "A product’s recurring commercial fee and the rated cost of consumed units are related but distinct calculations.",
      "category": "usage",
      "kind": "Native concept",
      "lesson": "invoice-usage",
      "sources": [
        "get-to-know-usage-management",
        "set-up-and-sell-products",
        "manage-wallets-and-track-consumption",
        "glossary-rate"
      ],
      "related": [
        "rate-card",
        "rating-procedure",
        "salesforce-pricing"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "rating-discovery",
      "term": "Rating discovery procedure",
      "aliases": [
        "Rating discovery"
      ],
      "definition": "The process selecting relevant rate cards, entries and adjustments for the applicable resources and commercial context.",
      "note": "Correct rate arithmetic cannot compensate for selecting the wrong rate source.",
      "category": "usage",
      "kind": "Native concept",
      "lesson": "invoice-usage",
      "sources": [
        "glossary-rate",
        "set-up-and-sell-products"
      ],
      "related": [
        "rate-card-entry",
        "rating-procedure",
        "pricing-discovery"
      ],
      "checked": "2026-10-20",
      "releaseNote": "Current product learning: confirm availability in your licensed org and release. This entry is not a claim that the feature appears on the exam’s stated Summer ’25 blueprint.",
      "autoLink": true
    },
    {
      "id": "rating-procedure",
      "term": "Rating procedure",
      "aliases": [
        "Rating procedures"
      ],
      "definition": "A configured sequence of rate-calculation steps producing the relevant net rate for a usage resource.",
      "note": "It is distinct from a product pricing procedure, though both depend on correct context, lookups and ordered operations.",
      "category": "usage",
      "kind": "Native concept",
      "lesson": "invoice-usage",
      "sources": [
        "glossary-rate",
        "set-up-and-sell-products"
      ],
      "related": [
        "rating-discovery",
        "rating-waterfall",
        "pricing-procedure"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "rating-waterfall",
      "term": "Rating waterfall",
      "aliases": [
        "Rate waterfall"
      ],
      "definition": "A breakdown explaining the steps and adjustments used to calculate a usage resource’s rate.",
      "note": "Use it to investigate a rated amount while keeping it distinct from the quote’s product-pricing waterfall.",
      "category": "usage",
      "kind": "Native concept",
      "lesson": "invoice-usage",
      "sources": [
        "glossary-rate",
        "set-up-and-sell-products"
      ],
      "related": [
        "rating-procedure",
        "pricing-waterfall",
        "rounding"
      ],
      "checked": "2026-10-20",
      "releaseNote": "Current product learning: confirm availability in your licensed org and release. This entry is not a claim that the feature appears on the exam’s stated Summer ’25 blueprint.",
      "autoLink": true
    },
    {
      "id": "reconciliation",
      "term": "Reconciliation",
      "aliases": [
        "Reconcile",
        "Reconciling"
      ],
      "definition": "Comparing related transactions, states or financial amounts to establish that the intended business outcome is consistent across boundaries.",
      "note": "Record counts alone are insufficient. Check lineage, quantities, dates, amounts and ambiguous downstream results.",
      "category": "delivery",
      "kind": "Implementation concept",
      "lesson": "readiness-delivery",
      "sources": [
        "migration",
        "setup",
        "uat",
        "adoption",
        "catalog-api"
      ],
      "related": [
        "asset-action-source",
        "payment-application",
        "cutover"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "record-access",
      "term": "Record access",
      "aliases": [
        "Record sharing",
        "Sharing access"
      ],
      "definition": "The authorization boundary determining which individual business records a user can access.",
      "note": "Object permissions and record visibility are separate. Diagnose both for customer-specific revenue transactions.",
      "category": "platform",
      "kind": "Native concept",
      "lesson": "platform-context",
      "sources": [
        "agent",
        "licenses"
      ],
      "related": [
        "permission-set",
        "field-level-security",
        "execution-identity"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "refund",
      "term": "Refund",
      "aliases": [
        "Refunds"
      ],
      "definition": "The return of funds to the customer through the applicable payment process.",
      "note": "A cancellation or credit memo is not proof money moved back. Confirm the actual refund outcome.",
      "category": "billing",
      "kind": "Native concept",
      "lesson": "invoice-policy",
      "sources": [
        "explore-billing-features-and-roles",
        "navigate-the-full-billing-lifecycle",
        "generate-invoices",
        "glossary-billing"
      ],
      "related": [
        "credit-memo",
        "payment",
        "cancellation"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "renewal",
      "term": "Renewal",
      "aliases": [
        "Renewals",
        "Renew"
      ],
      "definition": "A transaction continuing an existing service relationship into a subsequent term under applicable conditions.",
      "note": "Check continuity, quantity and current negotiated terms. A renewal proposal is not proof that the asset has already been extended.",
      "category": "assets",
      "kind": "Native concept",
      "lesson": "assets-history",
      "sources": [
        "manage-customer-asset-renewals-and-cancellations"
      ],
      "related": [
        "term-defined",
        "asset",
        "contract-based-pricing"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "reporting-grain",
      "term": "Reporting grain",
      "aliases": [
        "Record grain",
        "Metric grain",
        "Data grain"
      ],
      "definition": "The unit of analysis represented by one reported row or aggregated measure, such as a quote, line, invoice or asset period.",
      "note": "Joining one header to several lines can repeat its amount. Define dates and grain before aggregating revenue metrics.",
      "category": "metrics",
      "kind": "General metric",
      "lesson": "platform-access",
      "sources": [
        "provide-post-sales-support",
        "navigate-the-full-billing-lifecycle"
      ],
      "related": [
        "quote-line",
        "asset-state-period",
        "monthly-recurring-revenue"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "requirement-rule",
      "term": "Requirement rule",
      "aliases": [
        "Requirement rules"
      ],
      "definition": "Configuration logic expressing a dependency on another product or attribute when a condition is met.",
      "note": "Use it for required installation or compatible components rather than relying on the seller to remember them.",
      "category": "rules",
      "kind": "Native concept",
      "lesson": "cpq-configure",
      "sources": [
        "get-to-know-business-rules-engine",
        "use-product-configurator-with-business-rules-engine",
        "explore-product-configurator-with-constraint-rules-engine"
      ],
      "related": [
        "exclusion-rule",
        "validation-rule",
        "product-component"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "revenue-management",
      "term": "Revenue Management",
      "aliases": [
        "Revenue Cloud",
        "Agentforce Revenue Management",
        "RLM",
        "RCA",
        "Revenue Lifecycle Management",
        "Revenue Cloud Advanced"
      ],
      "definition": "Salesforce’s native product-to-cash offering, currently also branded Agentforce Revenue Management.",
      "note": "Revenue Cloud has also named older offerings. Confirm the actual product and license; the name alone does not establish native versus managed-package architecture.",
      "category": "platform",
      "kind": "Native concept",
      "lesson": "platform-context",
      "sources": [
        "product-identity",
        "differences"
      ],
      "related": [
        "salesforce-cpq",
        "industries-cpq",
        "product-to-cash"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "revenue-recognition",
      "term": "Revenue recognition",
      "aliases": [
        "Recognized revenue",
        "Recognised revenue"
      ],
      "definition": "The accounting determination of when and how earned revenue is recognized under the applicable policy.",
      "note": "It cannot be inferred solely from quote acceptance, invoice creation or cash collection. Agree the accounting-system boundary with finance.",
      "category": "billing",
      "kind": "General concept in revenue context",
      "lesson": "invoice-policy",
      "sources": [
        "explore-billing-features-and-roles",
        "navigate-the-full-billing-lifecycle",
        "generate-invoices",
        "glossary-billing"
      ],
      "related": [
        "bookings",
        "billings",
        "cash-collected"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "rounding",
      "term": "Rounding",
      "aliases": [
        "Rounding policy",
        "Rounding values"
      ],
      "definition": "The convention determining numeric precision and how intermediate or final values are rounded.",
      "note": "Agree the calculation stage, unit and rule; per-unit rounding can produce a different total from rounding once at the end.",
      "category": "pricing",
      "kind": "General concept in revenue context",
      "lesson": "cpq-pricing",
      "sources": [
        "create-a-pricing-procedure-with-the-list-price-element",
        "add-volume-and-manual-discounts",
        "configure-pricing-for-products"
      ],
      "related": [
        "unit-price",
        "proration",
        "unit-of-measure"
      ],
      "checked": "2026-10-20",
      "autoLink": false
    },
    {
      "id": "legacy-billing",
      "term": "Salesforce Billing managed package",
      "aliases": [
        "Legacy Salesforce Billing",
        "Billing managed package"
      ],
      "definition": "The older Salesforce Billing package offering, distinct from native Revenue Management Billing.",
      "note": "Confirm which product owns billing in a migration or coexistence design. Do not apply one product’s object/setup guidance to the other without validation.",
      "category": "legacy",
      "kind": "Legacy product / comparison",
      "lesson": "readiness-migration",
      "sources": [
        "differences",
        "data-model",
        "product-identity",
        "migration"
      ],
      "related": [
        "native-billing",
        "coexistence",
        "invoice"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "salesforce-contracts",
      "term": "Salesforce Contracts",
      "aliases": [
        "Contract Lifecycle Management",
        "CLM"
      ],
      "definition": "Capabilities supporting contract authoring, negotiation, approval, execution and lifecycle governance.",
      "note": "It goes beyond CPQ’s subscription term and Contract record. Confirm licensing and the legal process the solution must support.",
      "category": "transactions",
      "kind": "Native concept",
      "lesson": "contracts-legal",
      "sources": [
        "work-with-quotes",
        "create-and-fulfill-orders",
        "dive-into-salesforce-contracts-capabilities"
      ],
      "related": [
        "contract-state-model",
        "clause-library",
        "contract-type"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "salesforce-cpq",
      "term": "Salesforce CPQ",
      "aliases": [
        "SteelBrick",
        "CPQ managed package"
      ],
      "definition": "The managed-package CPQ product identified by the SBQQ namespace.",
      "note": "Its objects, rules and calculator extensions are distinct from native Revenue Management. The generic CPQ business function should not be confused with this specific product.",
      "category": "legacy",
      "kind": "Legacy product / comparison",
      "lesson": "readiness-migration",
      "sources": [
        "differences",
        "data-model",
        "product-identity",
        "migration"
      ],
      "related": [
        "revenue-management",
        "industries-cpq",
        "sbqq"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "salesforce-pricing",
      "term": "Salesforce Pricing",
      "aliases": [
        "Price Management"
      ],
      "definition": "The native capability for calculating commercial prices through supported procedures, elements and pricing data.",
      "note": "It is distinct from the SBQQ calculator and from rating actual measured consumption.",
      "category": "pricing",
      "kind": "Native concept",
      "lesson": "cpq-pricing",
      "sources": [
        "create-a-pricing-procedure-with-the-list-price-element",
        "add-volume-and-manual-discounts",
        "configure-pricing-for-products"
      ],
      "related": [
        "pricing-procedure",
        "rate-management",
        "legacy-price-rule"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "sbqq",
      "term": "SBQQ namespace",
      "aliases": [
        "SBQQ",
        "SBQQ__"
      ],
      "definition": "The managed-package namespace associated with Salesforce CPQ records and fields.",
      "note": "An SBQQ quote or line is not a native Quote or QuoteLineItem. Integrations and reports require explicit migration mapping.",
      "category": "legacy",
      "kind": "Legacy product / comparison",
      "lesson": "readiness-migration",
      "sources": [
        "differences",
        "data-model",
        "product-identity",
        "migration"
      ],
      "related": [
        "salesforce-cpq",
        "quote-line",
        "coexistence"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "scope-of-work",
      "term": "Scope of work",
      "aliases": [
        "SOW",
        "Scope statement"
      ],
      "definition": "The agreed delivery boundary, including outcomes, inclusions, exclusions, dependencies and acceptance responsibilities.",
      "note": "A list of setup tasks without business completion evidence is not a sufficient scope for a product-to-cash implementation.",
      "category": "delivery",
      "kind": "Implementation concept",
      "lesson": "readiness-delivery",
      "sources": [
        "migration",
        "setup",
        "uat",
        "adoption",
        "catalog-api"
      ],
      "related": [
        "implementation-readiness",
        "user-acceptance-testing",
        "accountability"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "service-level-agreement",
      "term": "Service-level agreement",
      "aliases": [
        "SLA",
        "Service level agreement"
      ],
      "definition": "An agreed expectation for service outcomes or timing used to govern delivery.",
      "note": "Specify the measured event, clock and escalation; a task being created is not proof the SLA outcome occurred.",
      "category": "fulfillment",
      "kind": "Native concept",
      "lesson": "contracts-orchestrate",
      "sources": [
        "discover-order-decomposition",
        "explore-order-orchestration",
        "define-dependencies-and-fulfillment-scenarios"
      ],
      "related": [
        "jeopardy",
        "obligation",
        "fulfillment-step"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "simple-product",
      "term": "Simple product",
      "aliases": [
        "Standalone product",
        "Simple products"
      ],
      "definition": "An offering without an associated bundle hierarchy of component products.",
      "note": "Simple is about structure. A standalone product can still have configurable attributes or different selling models.",
      "category": "catalog",
      "kind": "Native concept",
      "lesson": "catalog-attributes",
      "sources": [
        "create-product-categories-and-attributes",
        "work-with-product-classifications",
        "build-a-simple-product",
        "create-a-product-bundle"
      ],
      "related": [
        "product-bundle",
        "configurable-product",
        "product-selling-model"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "static-bundle",
      "term": "Static bundle",
      "aliases": [
        "Static bundles"
      ],
      "definition": "A bundle whose supported runtime composition and configuration are fixed for the buyer or seller.",
      "note": "Choose static behavior when the commercial offer needs no runtime choices rather than exposing unnecessary configuration.",
      "category": "catalog",
      "kind": "Native concept",
      "lesson": "catalog-attributes",
      "sources": [
        "create-product-categories-and-attributes",
        "work-with-product-classifications",
        "build-a-simple-product",
        "create-a-product-bundle"
      ],
      "related": [
        "configurable-bundle",
        "product-bundle",
        "product-configuration"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "sku",
      "term": "Stock-keeping unit",
      "aliases": [
        "SKU",
        "SKUs"
      ],
      "definition": "A business identifier for a distinct stock or commercial offering under the company’s catalog convention.",
      "note": "Do not duplicate SKUs solely to simulate a supported selling-model or attribute choice; agree when a variation truly needs a separate commercial identity.",
      "category": "catalog",
      "kind": "Concept / object landmark",
      "lesson": "catalog-selling",
      "sources": [
        "build-a-simple-product",
        "selling-models"
      ],
      "related": [
        "product-record",
        "product-variant",
        "product-selling-model"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "subledger",
      "term": "Subledger",
      "aliases": [
        "AR subledger",
        "Accounts receivable subledger"
      ],
      "definition": "Detailed financial records supporting the relevant control accounts and downstream accounting processes.",
      "note": "It supports audit and reconciliation; it does not mean every accounting policy or external general-ledger integration is automatically solved.",
      "category": "billing",
      "kind": "General concept in revenue context",
      "lesson": "invoice-policy",
      "sources": [
        "explore-billing-features-and-roles",
        "navigate-the-full-billing-lifecycle",
        "generate-invoices",
        "glossary-billing"
      ],
      "related": [
        "accounts-receivable",
        "accounting-period",
        "reconciliation"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "subscription-pricing",
      "term": "Subscription pricing",
      "aliases": [
        "Subscription Pricing element"
      ],
      "definition": "Pricing recurring service using the configured selling/pricing term and relevant time inputs.",
      "note": "A subscription price is not itself an invoice schedule. Partial periods require explicit proration treatment.",
      "category": "pricing",
      "kind": "Native concept",
      "lesson": "cpq-pricing",
      "sources": [
        "set-up-subscription-pricing-with-proration"
      ],
      "related": [
        "product-selling-model",
        "proration",
        "billing-frequency"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "tax-policy",
      "term": "Tax policy",
      "aliases": [
        "Tax policies"
      ],
      "definition": "Configuration selecting applicable tax treatment for the relevant billing transaction.",
      "note": "Tax policy, tax treatment and the actual calculated tax are different parts of the design and evidence chain.",
      "category": "billing",
      "kind": "Native concept",
      "lesson": "invoice-policy",
      "sources": [
        "explore-billing-features-and-roles",
        "navigate-the-full-billing-lifecycle",
        "generate-invoices",
        "glossary-billing"
      ],
      "related": [
        "tax-treatment",
        "legal-entity",
        "invoice-line"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "tax-treatment",
      "term": "Tax treatment",
      "aliases": [
        "Tax treatments"
      ],
      "definition": "Configuration describing how tax is calculated or obtained for an applicable transaction scenario.",
      "note": "Check jurisdiction, product treatment and any external engine. A quoted amount does not guarantee a posted invoice’s tax is correct.",
      "category": "billing",
      "kind": "Native concept",
      "lesson": "invoice-policy",
      "sources": [
        "explore-billing-features-and-roles",
        "navigate-the-full-billing-lifecycle",
        "generate-invoices",
        "glossary-billing"
      ],
      "related": [
        "tax-policy",
        "invoice",
        "legal-entity"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "technical-product",
      "term": "Technical product",
      "aliases": [
        "Technical products"
      ],
      "definition": "A product representation used to model downstream fulfillment needs, generally not a buyer-facing offering.",
      "note": "Technical products help express how to deliver a commercial sale; they are not automatically additional priced choices.",
      "category": "catalog",
      "kind": "Native concept",
      "lesson": "catalog-attributes",
      "sources": [
        "create-product-categories-and-attributes",
        "work-with-product-classifications",
        "build-a-simple-product",
        "create-a-product-bundle"
      ],
      "related": [
        "commercial-product",
        "decomposition",
        "fulfillment-request"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "term-defined",
      "term": "Term-defined selling model",
      "aliases": [
        "Term defined",
        "Term-defined",
        "Fixed-term"
      ],
      "definition": "A selling approach with a defined service or subscription duration.",
      "note": "The service term, pricing term, billing cadence and payment due date are related but distinct business choices.",
      "category": "catalog",
      "kind": "Native concept",
      "lesson": "catalog-attributes",
      "sources": [
        "create-product-categories-and-attributes",
        "work-with-product-classifications",
        "build-a-simple-product",
        "create-a-product-bundle"
      ],
      "related": [
        "product-selling-model",
        "evergreen",
        "proration"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "rate-tier",
      "term": "Tiered rate",
      "aliases": [
        "Tier rate card",
        "Rate tier",
        "Tier-based rate discount"
      ],
      "definition": "A usage-rate approach using defined consumption bands or thresholds.",
      "note": "Confirm whether the configured calculation is banded or volume-based and which quantities are included; the distinction affects totals.",
      "category": "usage",
      "kind": "Native concept",
      "lesson": "invoice-usage",
      "sources": [
        "glossary-rate",
        "set-up-and-sell-products"
      ],
      "related": [
        "volume-discount",
        "rate-card",
        "rating-procedure"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "token-resource",
      "term": "Token resource",
      "aliases": [
        "Token",
        "Tokens"
      ],
      "definition": "A credit-point or token-based resource used in the supported usage/charging model.",
      "note": "A commercial usage token is not an OAuth access token. Define its consumption and conversion rules explicitly.",
      "category": "usage",
      "kind": "Native concept",
      "lesson": "invoice-usage",
      "sources": [
        "get-to-know-usage-management",
        "set-up-and-sell-products",
        "manage-wallets-and-track-consumption",
        "glossary-rate"
      ],
      "related": [
        "usage-commitment",
        "unit-of-measure",
        "usage-resource"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "total-contract-value",
      "term": "Total contract value",
      "aliases": [
        "TCV"
      ],
      "definition": "The defined commercial value of an agreement across its relevant committed term.",
      "note": "State whether one-time fees, usage estimates, taxes or optional renewals are included. TCV is not automatically ARR or cash collected.",
      "category": "metrics",
      "kind": "General metric",
      "lesson": "platform-access",
      "sources": [
        "provide-post-sales-support",
        "navigate-the-full-billing-lifecycle"
      ],
      "related": [
        "annual-contract-value",
        "bookings",
        "revenue-recognition"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "total-lifecycle-amount",
      "term": "Total lifecycle amount",
      "aliases": [
        "Lifecycle amount",
        "TotalLifecycleAmount"
      ],
      "definition": "The asset-level measure of commercial amount accumulated across its relevant lifecycle activity.",
      "note": "It is distinct from a current monthly run rate, invoice total or cash collected; verify the actual field and calculation semantics.",
      "category": "assets",
      "kind": "Native concept",
      "lesson": "assets-history",
      "sources": [
        "provide-post-sales-support",
        "manage-customer-asset-amendments",
        "manage-customer-asset-renewals-and-cancellations"
      ],
      "related": [
        "asset-action",
        "monthly-recurring-revenue",
        "cash-collected"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "transaction-management",
      "term": "Transaction Management",
      "aliases": [
        "Quote and Order Capture",
        "QOC"
      ],
      "definition": "Native capabilities supporting the commercial transaction journey, including quote/order experiences and related lifecycle processes.",
      "note": "Do not equate it with the SBQQ quote-line editor or assume record insertion invokes every required business operation.",
      "category": "transactions",
      "kind": "Native concept",
      "lesson": "contracts-legal",
      "sources": [
        "work-with-quotes",
        "create-and-fulfill-orders",
        "dive-into-salesforce-contracts-capabilities"
      ],
      "related": [
        "quote",
        "order",
        "business-api"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "unit-of-measure",
      "term": "Unit of measure",
      "aliases": [
        "UoM",
        "Units of measure",
        "Measurement unit"
      ],
      "definition": "The unit in which a relevant quantity is represented, such as requests, GB or minutes.",
      "note": "Conversion and rounding must be deliberate. A monetary currency and a physical/consumption unit serve different purposes.",
      "category": "usage",
      "kind": "General concept in revenue context",
      "lesson": "invoice-usage",
      "sources": [
        "get-to-know-usage-management",
        "set-up-and-sell-products",
        "manage-wallets-and-track-consumption",
        "glossary-rate"
      ],
      "related": [
        "usage-resource",
        "rounding",
        "currency"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "unit-price",
      "term": "Unit price",
      "aliases": [
        "Unit prices"
      ],
      "definition": "The price applying to one unit at a specified stage of a calculation.",
      "note": "State the basis: list, adjusted or net. Multiplying a unit amount requires the intended quantity, period and rounding policy.",
      "category": "pricing",
      "kind": "Native concept",
      "lesson": "cpq-pricing",
      "sources": [
        "create-a-pricing-procedure-with-the-list-price-element",
        "add-volume-and-manual-discounts",
        "configure-pricing-for-products"
      ],
      "related": [
        "list-price",
        "net-price",
        "unit-of-measure"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "upsell",
      "term": "Upsell",
      "aliases": [
        "Upselling"
      ],
      "definition": "A commercial increase in the value or quantity of an existing customer relationship or offering.",
      "note": "Determine whether the transaction changes an existing managed asset or is a distinct purchase; do not assume the label determines record behavior.",
      "category": "assets",
      "kind": "Native concept",
      "lesson": "assets-history",
      "sources": [
        "provide-post-sales-support",
        "manage-customer-asset-amendments",
        "manage-customer-asset-renewals-and-cancellations"
      ],
      "related": [
        "amendment",
        "cross-sell",
        "asset-action"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "usage-anchor",
      "term": "Usage anchor product",
      "aliases": [
        "Anchor",
        "Anchor product"
      ],
      "definition": "The main sellable offering in a usage model, around which the relevant resources and entitlements are defined.",
      "note": "A usage anchor is not a hyperlink or fulfillment milestone; interpret the term in its consumption-model context.",
      "category": "usage",
      "kind": "Native concept",
      "lesson": "invoice-usage",
      "sources": [
        "get-to-know-usage-management",
        "set-up-and-sell-products",
        "manage-wallets-and-track-consumption",
        "glossary-rate"
      ],
      "related": [
        "usage-pack",
        "usage-resource",
        "usage-grant"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "usage-commitment",
      "term": "Usage commitment",
      "aliases": [
        "Monetary commitment",
        "Quantity commitment",
        "Token commitment"
      ],
      "definition": "A commercial commitment expressed in monetary, quantity or token terms under a usage offering’s policy.",
      "note": "It differs from actual consumption. Validate how committed amounts, allowances and overage are applied and reconciled.",
      "category": "usage",
      "kind": "Native concept",
      "lesson": "invoice-usage",
      "sources": [
        "get-to-know-usage-management",
        "set-up-and-sell-products",
        "manage-wallets-and-track-consumption",
        "glossary-rate"
      ],
      "related": [
        "usage-resource",
        "entitlement",
        "token-resource"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "usage-details",
      "term": "Usage Details",
      "aliases": [
        "Usage detail"
      ],
      "definition": "Granular consumption information participating in the supported usage-processing audit trail.",
      "note": "Use the detailed inputs to explain aggregated quantities; a summary alone may not reveal the origin of a disputed charge.",
      "category": "usage",
      "kind": "Native concept",
      "lesson": "invoice-usage",
      "sources": [
        "get-to-know-usage-management",
        "set-up-and-sell-products",
        "manage-wallets-and-track-consumption",
        "glossary-rate"
      ],
      "related": [
        "usage-record",
        "usage-summary",
        "reconciliation"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "entitlement",
      "term": "Usage entitlement",
      "aliases": [
        "Entitlements",
        "Entitlement"
      ],
      "definition": "The permitted allowance or rights to consume a resource under the applicable offering and policy.",
      "note": "This is a usage-management concept here, not automatically a Service Cloud entitlement process or a cash balance.",
      "category": "usage",
      "kind": "Native concept",
      "lesson": "invoice-usage",
      "sources": [
        "get-to-know-usage-management",
        "set-up-and-sell-products",
        "manage-wallets-and-track-consumption",
        "glossary-rate"
      ],
      "related": [
        "usage-grant",
        "wallet",
        "overage"
      ],
      "checked": "2026-10-20",
      "autoLink": false
    },
    {
      "id": "usage-grant",
      "term": "Usage grant",
      "aliases": [
        "Product Usage Grant",
        "Usage grants"
      ],
      "definition": "A configured allocation of a usage resource provided by an offering under its applicable policies.",
      "note": "Grant scope, renewal/refresh and overage treatment need explicit design; an allowance is not automatically a final invoice charge.",
      "category": "usage",
      "kind": "Native concept",
      "lesson": "invoice-usage",
      "sources": [
        "get-to-know-usage-management",
        "set-up-and-sell-products",
        "manage-wallets-and-track-consumption",
        "glossary-rate"
      ],
      "related": [
        "entitlement",
        "grant-binding",
        "usage-resource"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "usage-management",
      "term": "Usage Management",
      "aliases": [
        "Usage-based selling",
        "Consumption-based selling"
      ],
      "definition": "Capabilities for modeling consumption-based offerings and tracking the usage and entitlements that support charging.",
      "note": "A static quote quantity is not a meter. Model the resource, unit, measurement, allowance and applicable rating/billing treatment.",
      "category": "usage",
      "kind": "Native concept",
      "lesson": "invoice-usage",
      "sources": [
        "get-to-know-usage-management",
        "set-up-and-sell-products",
        "manage-wallets-and-track-consumption",
        "glossary-rate"
      ],
      "related": [
        "usage-resource",
        "consumption-management",
        "rate-management"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "usage-pack",
      "term": "Usage pack",
      "aliases": [
        "Pack",
        "Pack product"
      ],
      "definition": "An add-on offering supplying additional usage-resource capacity or units under the configured usage model.",
      "note": "Check grant scope and pricing rather than treating the pack as a direct edit to the customer’s wallet balance.",
      "category": "usage",
      "kind": "Native concept",
      "lesson": "invoice-usage",
      "sources": [
        "get-to-know-usage-management",
        "set-up-and-sell-products",
        "manage-wallets-and-track-consumption",
        "glossary-rate"
      ],
      "related": [
        "usage-anchor",
        "usage-grant",
        "wallet"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "usage-record",
      "term": "Usage record",
      "aliases": [
        "Usage records"
      ],
      "definition": "A timestamped measurement attributed to the relevant customer, offering/resource and units.",
      "note": "Source identifiers and time boundaries are essential for detecting duplicate, corrected or late-arriving consumption.",
      "category": "usage",
      "kind": "Native concept",
      "lesson": "invoice-usage",
      "sources": [
        "get-to-know-usage-management",
        "set-up-and-sell-products",
        "manage-wallets-and-track-consumption",
        "glossary-rate"
      ],
      "related": [
        "usage-details",
        "usage-summary",
        "idempotency"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "usage-resource",
      "term": "Usage resource",
      "aliases": [
        "Usage resources"
      ],
      "definition": "The measurable resource being consumed, such as storage, API calls or service credits.",
      "note": "Define the resource separately from the commercial product that sells access to it, and specify consistent units.",
      "category": "usage",
      "kind": "Native concept",
      "lesson": "invoice-usage",
      "sources": [
        "get-to-know-usage-management",
        "set-up-and-sell-products",
        "manage-wallets-and-track-consumption",
        "glossary-rate"
      ],
      "related": [
        "unit-of-measure",
        "usage-grant",
        "usage-record"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "usage-summary",
      "term": "Usage summary",
      "aliases": [
        "Usage summaries"
      ],
      "definition": "An aggregation of consumption over a defined resource/customer/time scope for the relevant processing need.",
      "note": "The grouping period and unit must be explicit. A usage summary is not proof that cash was collected or revenue recognized.",
      "category": "usage",
      "kind": "Native concept",
      "lesson": "invoice-usage",
      "sources": [
        "get-to-know-usage-management",
        "set-up-and-sell-products",
        "manage-wallets-and-track-consumption",
        "glossary-rate"
      ],
      "related": [
        "usage-record",
        "ratable-summary",
        "reporting-grain"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "user-acceptance-testing",
      "term": "User acceptance testing",
      "aliases": [
        "UAT"
      ],
      "definition": "Business-persona validation that the solution satisfies agreed representative requirements and acceptance criteria.",
      "note": "Unit tests and a happy-path quote do not replace testing amendments, downstream failures, billing and required data dependencies.",
      "category": "delivery",
      "kind": "Implementation concept",
      "lesson": "readiness-delivery",
      "sources": [
        "migration",
        "setup",
        "uat",
        "adoption",
        "catalog-api"
      ],
      "related": [
        "implementation-readiness",
        "reconciliation",
        "cutover"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "volume-discount",
      "term": "Volume discount",
      "aliases": [
        "Volume discounts",
        "Volume-based discount"
      ],
      "definition": "A price adjustment driven by the qualifying quantity under configured tiers or thresholds.",
      "note": "Boundary cases and the quantity basis matter. Do not assume the rule treats all units and graduated bands identically.",
      "category": "pricing",
      "kind": "Native concept",
      "lesson": "cpq-pricing",
      "sources": [
        "create-a-pricing-procedure-with-the-list-price-element",
        "add-volume-and-manual-discounts",
        "configure-pricing-for-products"
      ],
      "related": [
        "price-adjustment-schedule",
        "rate-tier",
        "pricing-procedure"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "wallet",
      "term": "Wallet",
      "aliases": [
        "Wallets",
        "Wallet Management"
      ],
      "definition": "A view or structure for tracking usage entitlement balances, consumption and relevant transactions.",
      "note": "It is not a payment bank account, a general-ledger cash balance or an invoice. Check the underlying consumption history.",
      "category": "usage",
      "kind": "Native concept",
      "lesson": "invoice-usage",
      "sources": [
        "get-to-know-usage-management",
        "set-up-and-sell-products",
        "manage-wallets-and-track-consumption",
        "glossary-rate"
      ],
      "related": [
        "entitlement",
        "consumption-management",
        "usage-summary"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    },
    {
      "id": "write-off",
      "term": "Write-off",
      "aliases": [
        "Write off",
        "Write-offs"
      ],
      "definition": "A governed financial treatment for an amount not expected to be collected.",
      "note": "It is not a refund or a routine way to hide billing errors; follow finance approval and accounting policy.",
      "category": "billing",
      "kind": "General concept in revenue context",
      "lesson": "invoice-policy",
      "sources": [
        "explore-billing-features-and-roles",
        "navigate-the-full-billing-lifecycle",
        "generate-invoices",
        "glossary-billing"
      ],
      "related": [
        "accounts-receivable",
        "credit-memo",
        "collections"
      ],
      "checked": "2026-10-20",
      "autoLink": true
    }
  ],
  "sources": {
    "glossary-hub": {
      "title": "Revenue Management glossary",
      "url": "https://help.salesforce.com/s/articleView?id=ind.revenue_impl_glossary.htm&language=en_US&type=5",
      "checked": "2026-10-20",
      "kind": "Official Salesforce Help glossary"
    },
    "glossary-catalog": {
      "title": "Product Catalog Management essentials",
      "url": "https://help.salesforce.com/s/articleView?id=product_catalog_management_essentials.htm&language=en_US&type=5",
      "checked": "2026-10-20",
      "kind": "Official Salesforce Help glossary"
    },
    "glossary-pricing": {
      "title": "Salesforce Pricing essentials",
      "url": "https://help.salesforce.com/s/articleView?id=ind.pricing_essentials.htm&language=en_US&type=5",
      "checked": "2026-10-20",
      "kind": "Official Salesforce Help glossary"
    },
    "glossary-rate": {
      "title": "Rate Management essentials",
      "url": "https://help.salesforce.com/s/articleView?id=ind.rate_management_essentials.htm&language=en_US&type=5",
      "checked": "2026-10-20",
      "kind": "Official Salesforce Help glossary"
    },
    "glossary-config": {
      "title": "Product Configurator essentials",
      "url": "https://help.salesforce.com/s/articleView?id=ind.product_configurator_essentials.htm&language=en_US&type=5",
      "checked": "2026-10-20",
      "kind": "Official Salesforce Help glossary"
    },
    "glossary-transactions": {
      "title": "Transaction Management essentials",
      "url": "https://help.salesforce.com/s/articleView?id=ind.transaction_management_essentials.htm&language=en_US&type=5",
      "checked": "2026-10-20",
      "kind": "Official Salesforce Help glossary"
    },
    "glossary-dro": {
      "title": "Dynamic Revenue Orchestrator essentials",
      "url": "https://help.salesforce.com/s/articleView?id=sf.dynamic_revenue_orchestration_essentials.htm&language=en_US&type=5",
      "checked": "2026-10-20",
      "kind": "Official Salesforce Help glossary"
    },
    "glossary-usage": {
      "title": "Usage Management essentials",
      "url": "https://help.salesforce.com/s/articleView?id=ind.usage_management_essentials.htm&language=en_US&type=5",
      "checked": "2026-10-20",
      "kind": "Official Salesforce Help glossary"
    },
    "glossary-billing": {
      "title": "Billing essentials",
      "url": "https://help.salesforce.com/s/articleView?id=ind.invoice_management_essentials.htm&language=en_US&type=5",
      "checked": "2026-10-20",
      "kind": "Official Salesforce Help glossary"
    },
    "glossary-general": {
      "title": "General revenue terms",
      "url": "https://help.salesforce.com/s/articleView?id=ind.general_terms.htm&language=en_US&type=5",
      "checked": "2026-10-20",
      "kind": "Official Salesforce Help glossary"
    }
  }
};
