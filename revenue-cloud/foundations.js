/* Original explanatory chapters. Object/service distinctions and sources: FOUNDATIONS_REVIEW.md. */
window.RC_FOUNDATIONS = {
  "revision": "2026-10-21-foundations-1",
  "lessons": {
    "platform-map": {
      "simple": {
        "analogy": "Imagine a school selling a year of access to its sports club. The brochure describes the choices. A written offer says what your family could buy. The accepted purchase tells staff what to provide. A membership record says what you may use now. A bill says what you owe, and a receipt shows what you paid. They concern the same purchase, but each answers a different question.",
        "translation": "Revenue Management connects these commercial, operational and financial stages. Its native Salesforce records and business services carry the transaction through them. Your familiar CPQ quoting knowledge covers part of that journey, while assets, fulfillment and invoicing require additional models.",
        "limit": "The brochure-to-receipt story is a mental model, not a mandatory sequence of one record per stage. A real implementation may split orders, combine billing or use external fulfillment and finance systems."
      },
      "entities": [
        {
          "name": "Product2",
          "kind": "Salesforce object",
          "description": "The identity of an offer; its record is not a customer purchase."
        },
        {
          "name": "Quote / QuoteLineItem",
          "kind": "Salesforce objects",
          "description": "A proposed transaction header and its product lines, including the applicable configuration and pricing context."
        },
        {
          "name": "Order / OrderItem",
          "kind": "Salesforce objects",
          "description": "The committed transaction and individual lines that downstream processing acts on."
        },
        {
          "name": "Asset",
          "kind": "Salesforce object",
          "description": "The customer’s managed installed product or service identity, with associated lifecycle history."
        },
        {
          "name": "Invoice and payment",
          "kind": "Financial record families",
          "description": "The obligation billed and the separately recorded settlement; these are different business events."
        }
      ],
      "sections": [
        {
          "title": "Why a quote cannot represent the entire lifecycle",
          "body": "A quote is useful for constructing an offer: customer, products, quantities, configuration, price context and service dates. Before acceptance, it can change or never become a sale. Treating a quote line as proof of delivered service or paid money confuses intent with execution. An accepted transaction must go through the supported order and downstream processing needed by the solution. Each transition can have validation, permission and integration requirements."
        },
        {
          "title": "How the records stay connected",
          "body": "A line refers to a product and appropriate commercial context, while its parent supplies transaction-wide information. Later records retain source relationships so teams can explain how a change arose. For example, an asset action can be traced to the transaction that added seats. The relationship is more important than copying the same amount into every record: it allows reconciliation even when one commercial offer produces several delivery or billing events."
        },
        {
          "title": "What carries over from CPQ",
          "body": "Carry forward requirement discovery, bundle design, commercial arithmetic and approval reasoning. Relearn the implementation mechanisms. Native Quote and QuoteLineItem are not the managed-package SBQQ quote objects with a new label. The standard data model, selling-model options, pricing procedures and managed asset history change where information lives and how it is processed."
        },
        {
          "title": "Recognize a relationship field in a real record",
          "body": "A lookup stores an identifier linking one record to another. For familiar native examples, Quote.AccountId identifies the customer, QuoteLineItem.QuoteId identifies its parent quote, and a line’s PricebookEntryId selects the applicable price entry. Quantity and UnitPrice describe different facts from those identifiers. A relationship ID does not mean the related product is already delivered or paid. Use the linked object reference and the target org’s schema for exact fields and writable behavior; UI labels, context tags and API names are different naming layers."
        }
      ],
      "walkthrough": [
        {
          "title": "Offer",
          "body": "Northstar receives a quote for 10 support seats. This proves an offer was constructed, not that 10 users were provisioned."
        },
        {
          "title": "Commit and provide",
          "body": "The supported accepted transaction creates/processes its order; the applicable fulfillment and asset processes establish the customer’s service."
        },
        {
          "title": "Bill and collect",
          "body": "Billing produces eligible invoice charges. A payment later settles them. A failed payment does not retrospectively mean the quote was never priced."
        }
      ],
      "sources": [
        "product-identity",
        "data-model",
        "manage-orders",
        "get-started-with-billing-revenue-cloud",
        "native-transaction-objects"
      ]
    },
    "platform-context": {
      "simple": {
        "analogy": "Think of a chef preparing one order. Ingredients live in different cupboards, but the chef wants one tray containing the exact ingredients needed now. A packing plan says which compartments the tray has. Labels say what is in them. A shopping list says which cupboard supplies each ingredient. Filling the tray is different from changing what is stored in the cupboards.",
        "translation": "The tray is a runtime context instance. The packing plan is the context definition. Compartments are nodes, individual values sit in attributes, mappings connect them to source data, and tags are names a consuming service can use to find them. Hydration fills the working instance; persistence writes intended changes back through the supported process.",
        "limit": "This is a data-service analogy. A context is not a new customer database, a Salesforce page layout or a copy of every record. The exact structure, mappings, operations and access depend on the consuming feature."
      },
      "entities": [
        {
          "name": "Context Service",
          "kind": "Platform service",
          "description": "Builds and serves a logical working view of data for a business operation; it is not one ordinary customer sObject."
        },
        {
          "name": "Context definition",
          "kind": "Design-time configuration",
          "description": "The declared structure and associated metadata used to create an instance. It contains no Northstar-specific values by itself."
        },
        {
          "name": "Node",
          "kind": "Context structure element",
          "description": "A grouping such as a transaction header or a collection of transaction lines. A line node can have multiple occurrences."
        },
        {
          "name": "Attribute",
          "kind": "Context value definition",
          "description": "A typed value on a node, such as quantity or customer segment; an attribute definition and its populated value are different things."
        },
        {
          "name": "Context mapping",
          "kind": "Design-time connection",
          "description": "Connects source objects/fields to nodes/attributes for the intended read/write behavior."
        },
        {
          "name": "Context tag",
          "kind": "Alias within a definition",
          "description": "A stable name by which consuming logic locates a node or attribute. A tag is not the source field itself."
        },
        {
          "name": "Context instance / context ID",
          "kind": "Runtime data and identifier",
          "description": "The populated working data for an invocation and the identifier used to interact with it; do not confuse this with a Quote ID."
        }
      ],
      "sections": [
        {
          "title": "The problem this service solves",
          "body": "Pricing may need data from a quote header, several lines, the account and configured product choices. Eligibility may need some of the same data. If every consumer separately queries every field and knows the source schema, a source-model change can require changes throughout the solution. A context provides an agreed logical structure between those sources and consumers. This is data abstraction: the consumer asks for the business input it understands, while the configured mapping explains where that input comes from."
        },
        {
          "title": "Design time: define the shape before supplying values",
          "body": "Suppose our teaching model has a Customer node with a Segment attribute and a Lines node with Product and Quantity attributes. Customer.Segment is a logical attribute; Account.CustomerSegment__c is an illustrative custom source field. A mapping connects them, and a tag such as CustomerSegment identifies the value for a consumer. Those example names are not a shipped schema. Nodes provide hierarchy and repeated records; attributes hold values within an occurrence. Two lines need two quantities, not a single header quantity copied indiscriminately."
        },
        {
          "title": "Runtime: build, read, change and save are separate operations",
          "body": "A supported caller supplies the definition/mapping and relevant source inputs to build a context. Hydration loads the mapped values, giving a particular instance containing Northstar and its lines. A service can query the instance or its tagged values and update runtime values. A persist operation, using the appropriate output mapping and supported transaction handling, is what writes intended data back. Reading a value, changing it in memory and seeing the database updated are three different observations. Input and output mappings can differ; calculation outputs should not be written into arbitrary source fields."
        },
        {
          "title": "How this connects to pricing and Flow",
          "body": "A pricing procedure has input/output variables. Its configuration maps these variables to the appropriate context tags, so a quantity lookup or discount calculation sees the right value for the right line. A Flow or other supported caller can orchestrate context operations and consuming actions where available. The caller must preserve the correct context identity and pass the inputs the action expects. This is why a procedure simulation using manually entered values does not prove that live source-to-context hydration works."
        },
        {
          "title": "Standard definitions, extensions and the place to inspect",
          "body": "Salesforce supplies standard definitions for supported business features. A custom extension inherits the standard components and adds the required custom structure; inherited standard components are not freely editable. A clone is a separate configuration choice, with different maintenance implications from an extension. In the supported org, inspect Context Definitions, the structure, tags and mappings, then the caller and its actual runtime inputs. Record which active configuration was used rather than assuming that the definition you opened is the one the transaction invoked."
        },
        {
          "title": "Understanding the failure before changing a rule",
          "body": "If the source field is populated but the context value is empty, the problem can lie in the source selection, access, mapping, node occurrence, version or caller inputs. If the populated value reaches the decision but the result is wrong, inspect decision eligibility, lookup data and calculations. If the runtime result is right but the saved record is wrong, investigate the output mapping/persist or transaction completion. These are distinct boundaries. A discount-table change cannot reliably repair a value that never reached the calculation."
        }
      ],
      "walkthrough": [
        {
          "title": "1 · Source records",
          "body": "Teaching data: Account Northstar has CustomerSegment__c = Education. Quote Q-104 has two lines: Support, quantity 10; Onboarding, quantity 1. These identifiers and the custom field are illustrative."
        },
        {
          "title": "2 · Configured structure",
          "body": "The teaching definition describes Customer.Segment and repeated Lines.Product/Quantity. Its mapping links the account field and the quote-line fields to those attributes. The consumer expects a segment alias and a quantity for each line."
        },
        {
          "title": "3 · Hydrated instance",
          "body": "After build/hydration, this instance contains Segment = Education, Support quantity = 10 and Onboarding quantity = 1. The definition did not become a quote; it supplied the structure for these values."
        },
        {
          "title": "4 · Consumer reads and computes",
          "body": "For this example policy, Education receives 10% off Support only. The pricing consumer reads the segment and the relevant line values. A 60 unit price becomes 54; 10 seats total 540 before any other adjustments."
        },
        {
          "title": "5 · Runtime output versus saved output",
          "body": "The computed 540 can appear in the working result. The supported pricing/transaction process must map and save its intended outputs before the quote record proves that amount. Merely changing the runtime segment must not be treated as a request to overwrite Account.CustomerSegment__c."
        },
        {
          "title": "6 · A concrete broken case",
          "body": "If the line quantities hydrate but Segment is empty, the calculation can correctly take its default branch for missing segment and return 600. Entering Education manually in simulation then returns 540. This demonstrates correct calculation for supplied inputs, while leaving live hydration unproved."
        }
      ],
      "sources": [
        "get-to-know-context-service",
        "explore-context-service-components-and-processes",
        "context-create",
        "context-flow",
        "context-bre"
      ],
      "mappingExample": {
        "caption": "One illustrative value, from source to consumer",
        "rows": [
          [
            "Source record/field",
            "Account.CustomerSegment__c = Education",
            "Stored business data. CustomerSegment__c is an example custom field, not a required shipped field."
          ],
          [
            "Logical node.attribute",
            "Customer.Segment",
            "The teaching model’s place for the value; not an instruction to create Customer__c."
          ],
          [
            "Tag / consumer alias",
            "CustomerSegment",
            "The example alias the consuming input is configured to use; not a second copy of the source field."
          ],
          [
            "Runtime instance value",
            "This instance: Education",
            "A hydrated value for this invocation; another customer can use the same definition with a different value."
          ],
          [
            "Pricing result",
            "Support: 60 × 0.90 × 10 = 540",
            "The original example’s commercial result before other adjustments; saving uses the supported pricing/transaction output path."
          ]
        ]
      },
      "shape": {
        "caption": "Conceptual populated data — teaching notation, not an API request or shipped schema",
        "text": "Context instance for quote Q-104\n  Customer\n    Segment: Education\n  Lines\n    [1] Product: Support       Quantity: 10\n    [2] Product: Onboarding    Quantity: 1\n\nConsumer reads the configured segment and each relevant line.\nThe definition is the reusable shape; this is one populated instance."
      }
    },
    "platform-rules": {
      "simple": {
        "analogy": "A school trip has several jobs: a form asks for your details, a rulebook decides whether you qualify for a discount, a calculator works out the price, and a teacher manages approvals. Putting the rulebook on the form does not mean a phone booking automatically follows the same rules.",
        "translation": "Flow and Omnistudio can guide interactions and coordinate actions. Business Rules Engine supplies reusable decision/calculation tools. Context Service supplies the logical data those tools consume. Supported APIs expose business behavior to other channels.",
        "limit": "These are responsibilities, not rigid rules that only one tool can ever perform a calculation. Choose the supported pattern that keeps the commercial policy consistent across the channels in scope."
      },
      "entities": [
        {
          "name": "Decision matrix",
          "kind": "BRE decision configuration",
          "description": "A configured lookup from inputs to outputs, suited to the documented matching pattern."
        },
        {
          "name": "Decision table",
          "kind": "BRE decision configuration",
          "description": "Evaluates configured matching data with the required output behavior; verify expected matches and cardinality."
        },
        {
          "name": "Expression set",
          "kind": "BRE calculation/decision procedure",
          "description": "An ordered set of expressions and decisions that can use lookup tools and produce outputs."
        },
        {
          "name": "Flow",
          "kind": "Salesforce automation",
          "description": "Orchestrates supported actions and user/process steps; it can call business logic rather than duplicating it."
        },
        {
          "name": "Omnistudio",
          "kind": "Experience/integration tools",
          "description": "Can deliver guided interactions using the relevant components and services; an OmniScript is not itself a customer quote."
        }
      ],
      "sections": [
        {
          "title": "What a reusable decision actually contains",
          "body": "A decision has an input contract, a policy and an output contract. For example, CustomerTier and Region may produce EligibleDiscountPercent and a reason. Decide what happens when inputs are missing, no row matches or more than one condition applies. These are business outcomes, not implementation afterthoughts. A decision that returns a number without its applicability conditions can be reused incorrectly by another channel."
        },
        {
          "title": "Lookup data versus calculation order",
          "body": "A lookup can return a configured percentage such as 10. It does not necessarily apply that percentage to every line or choose when it stacks with another adjustment. An expression set can combine decision steps and calculations in order. The pricing/configuration service consuming these results supplies additional semantics. A discount percentage in a table is therefore not a complete pricing procedure, just as a CPQ discount schedule was not the whole quote calculation sequence."
        },
        {
          "title": "How the user experience connects",
          "body": "A screen or guided interaction gathers missing information and presents results. A Flow or supported integration invokes the reusable logic with real inputs. The result must be interpreted and applied at the correct transaction boundary. If the UI alone blocks a bad combination but an integration accepts it, the design has validated a screen path rather than all required transaction paths. Identify the supported validation service for each channel instead of simply making a field invisible."
        }
      ],
      "walkthrough": [
        {
          "title": "Inputs",
          "body": "Northstar is Education tier in EMEA. A common eligibility decision receives both values, whether collected by UI or supplied through the approved transaction service."
        },
        {
          "title": "Decision",
          "body": "The configured policy returns eligible = true and discount = 10%, with the applicable reason."
        },
        {
          "title": "Application",
          "body": "The supported pricing flow applies that result to qualifying lines. An ineligible region returns its defined no-discount outcome; an empty region must not silently masquerade as a known eligible region."
        }
      ],
      "sources": [
        "get-to-know-business-rules-engine",
        "build-decisions-with-lookup-tables",
        "orchestrate-rules-with-expression-sets",
        "automate-business-processes",
        "context-bre"
      ]
    },
    "platform-access": {
      "simple": {
        "analogy": "A sports centre membership can let you book the pool, but you still need permission for the staff office and a key to the particular room. Seeing a sign on a door does not mean you can open it. A scoreboard can also reveal information you were not meant to see if someone publishes the manager’s view.",
        "translation": "Org entitlement and feature enablement make capabilities available. User licenses/permission-set licenses and permissions allow the intended operations. Object, field and record access control the data. Lightning assignment chooses the experience, and dashboard execution context affects what a viewer sees.",
        "limit": "The layers are not literally physical keys, and Salesforce execution contexts vary by action. Always identify the real user or integration identity and the feature’s documented authorization behavior."
      },
      "entities": [
        {
          "name": "Permission-set license",
          "kind": "User entitlement assignment",
          "description": "Enables assignment/use of the corresponding licensed capabilities where required; it is not a full data-access policy."
        },
        {
          "name": "Permission set",
          "kind": "Access configuration",
          "description": "Grants specific permissions to a user; it does not override every license or sharing restriction."
        },
        {
          "name": "Lightning record page",
          "kind": "UI metadata",
          "description": "Arranges supported components/actions for assigned apps/personas; page visibility is not service authorization."
        },
        {
          "name": "Report / dashboard",
          "kind": "Reporting metadata and runtime view",
          "description": "Defines records, aggregation and presentation, with explicit grain, filters and execution visibility."
        }
      ],
      "sections": [
        {
          "title": "Separate experience selection from access",
          "body": "A seller can see a revenue component because a Lightning page is assigned to the relevant app/profile/record type, yet fail when invoking its action. Diagnose the action’s identity, feature prerequisites and required data access. Conversely, granting a permission does not automatically put a component on the correct page. These are two configuration concerns that happen to appear together in the user experience."
        },
        {
          "title": "Understand the report’s unit of counting",
          "body": "The grain is what one row represents: a quote, a line, an asset interval or an invoice. Suppose a quote for 1000 has three lines. A joined dataset that repeats the header on each line contains three copies of 1000, not 3000 of business value. Hiding detail rows does not necessarily repair the aggregate. Define the fact being measured and choose a report structure that counts that fact once."
        },
        {
          "title": "Define context and time before trusting the KPI",
          "body": "A customer-focused dashboard needs the relevant account, visibility rules, status filters and date basis. Booked revenue, current recurring run rate, invoices issued and cash collected are different facts. A historical active-seat metric also needs effective asset state for the chosen date. Context-aware reporting does not mean every transient Context Service instance is a persistent reportable sObject; use the appropriate stored business evidence."
        }
      ],
      "walkthrough": [
        {
          "title": "Access example",
          "body": "A seller sees the quote page but cannot invoke pricing. Verify entitlement/feature setup, user assignments, object/field access, record visibility and action execution context in that order of responsibility."
        },
        {
          "title": "Reporting example",
          "body": "Two quote headers are 1000 and 2000, with three lines each. The correct header total is 3000, not the repeated-row sum of 9000."
        },
        {
          "title": "Visibility example",
          "body": "A dashboard run as a privileged fixed user needs a deliberate sharing/visibility design. Test it with a seller who can see one known account and cannot see another."
        }
      ],
      "sources": [
        "licenses",
        "catalog-api",
        "data-model",
        "provide-post-sales-support",
        "navigate-the-full-billing-lifecycle"
      ]
    },
    "readiness-org": {
      "simple": {
        "analogy": "Buying a kitchen does not mean it is ready to serve dinner: electricity, supplies, trained staff and a working till still matter. The useful test is whether one real meal can be ordered and served, not whether someone can open the front door.",
        "translation": "Native revenue readiness includes the correct org/product, contracted capabilities, enabled features, permissions, reference data and supporting service setup. A small successful transaction proves more than an installed app icon.",
        "limit": "There is no universal license bundle or setup checklist for every Revenue Management implementation. Capability availability and training-org prerequisites must come from the current official guidance for that feature."
      },
      "entities": [
        {
          "name": "Org entitlement / feature setting",
          "kind": "Org-level capability",
          "description": "Whether the environment is provisioned and enabled for the intended native service."
        },
        {
          "name": "Persona access matrix",
          "kind": "Implementation artifact",
          "description": "Connects each job to required capabilities, data operations and evidence of allowed/denied access."
        },
        {
          "name": "Search index",
          "kind": "Runtime discovery support",
          "description": "A searchable representation that may need building/refreshing; existing product records alone do not prove discovery readiness."
        },
        {
          "name": "Pricing sync / decision refresh",
          "kind": "Service preparation processes",
          "description": "Make relevant configuration/reference data available to the documented runtime; they are distinct from indexing."
        }
      ],
      "sections": [
        {
          "title": "Why a CPQ org is not automatically the right starting point",
          "body": "Managed-package CPQ and native Revenue Management are different products with different objects, services and entitlements. A familiar CPQ sandbox can be useful for migration discovery but does not establish that native pricing, asset servicing or billing is available. Likewise, one Trailhead special Developer Edition can have the sample data needed by one badge and not another. Start by identifying the product and the required environment."
        },
        {
          "title": "What a readiness dependency looks like",
          "body": "A seller must be able to discover an eligible offer before configuring and pricing it. Discovery can depend on catalog data, active dates, qualification rules and index readiness. Pricing can independently depend on compatible price entries, context/procedure setup and synced lookup data. A completed index rebuild cannot prove a discount table is refreshed. Keep evidence per dependency instead of one vague checkbox saying “setup complete.”"
        },
        {
          "title": "What a thin slice proves",
          "body": "Choose one product, one persona and one straightforward transaction. Discover, configure, price and save it; then extend to the required order/asset/billing stages. Record the actual inputs, outputs and errors. A working admin transaction is only a partial test if normal sellers or downstream operators lack access. The slice is a dependency probe and a planning baseline, not a claim that every product and exception is implemented."
        }
      ],
      "walkthrough": [
        {
          "title": "Environment",
          "body": "Use the special org specified by the configurator badge, rather than assuming a general Playground contains its features and sample products."
        },
        {
          "title": "Preparation",
          "body": "Follow the badge’s index rebuild, pricing-data sync and qualification/disqualification table refresh. Check each process’s own result."
        },
        {
          "title": "Proof",
          "body": "A seller discovers the expected product, configures a valid choice, receives the predicted price and saves the intended transaction. Any downstream capability remains a separate gate until tested."
        }
      ],
      "sources": [
        "setup",
        "licenses",
        "manage-customer-asset-amendments",
        "explore-salesforce-pricing"
      ]
    },
    "readiness-discovery": {
      "simple": {
        "analogy": "A band cannot plan a concert by asking only the guitarist. Someone owns the songs, someone the venue, someone the budget and someone safety. A successful plan says what will happen, who can decide, and what counts as ready.",
        "translation": "Revenue discovery connects sales, product, legal, delivery, finance, security and integration requirements. A scope of work turns those decisions into bounded deliverables and acceptance criteria; a project plan sequences dependencies and owners.",
        "limit": "A responsibility chart is not the decision itself. Naming finance as an owner does not resolve a disputed billing policy until that owner agrees and records the rule."
      },
      "entities": [
        {
          "name": "Scope of work",
          "kind": "Project agreement",
          "description": "Deliverables, boundaries, assumptions, dependencies, acceptance and change control."
        },
        {
          "name": "RACI / decision ownership",
          "kind": "Governance artifact",
          "description": "Who performs work, owns a decision, contributes and must be informed."
        },
        {
          "name": "Acceptance criterion",
          "kind": "Observable outcome",
          "description": "A business result that can be demonstrated with specific inputs and evidence."
        },
        {
          "name": "Risk / decision log",
          "kind": "Project control",
          "description": "Unresolved policy, technical or dependency issues with impact, owner and next action."
        }
      ],
      "sections": [
        {
          "title": "Translate vague outcomes into transaction rules",
          "body": "“Make sales faster” is a goal, not a configurator design. Ask which product/customer/channel is in scope, which choices must be validated, which price exceptions require approval and which event commits the transaction. Write an example of success and a meaningful rejection case. Existing CPQ rules provide useful evidence, but may encode historical workarounds rather than the policy the business now wants."
        },
        {
          "title": "Separate the owners of handoffs",
          "body": "Legal can define execution conditions, operations can define provisioning completion and finance can define invoice eligibility. Those events may be related without being identical. A single “Approved” status cannot safely replace every department’s gate unless the business explicitly agrees to that model. Define the event producer, consumer, evidence and exception owner at each boundary."
        },
        {
          "title": "Bound scope without breaking the lifecycle",
          "body": "A phase can support one offer and one customer segment while still proving the whole required transaction. State exclusions such as advanced consumption or a specific external channel explicitly. Estimate dependent work such as reference-data preparation and access configuration, not just visible screens. New policy requests should enter change control with acceptance impact rather than quietly expanding a flow."
        }
      ],
      "walkthrough": [
        {
          "title": "Requirement",
          "body": "Northstar wants a signed contract before activation, and invoices only after service acceptance."
        },
        {
          "title": "Ownership",
          "body": "Legal owns signature policy, operations owns activation/acceptance evidence and finance owns the billing gate."
        },
        {
          "title": "Acceptance",
          "body": "A signed but unaccepted service may activate under the agreed policy, yet must not generate the acceptance-based invoice. Test this precise state rather than a generic “happy path.”"
        }
      ],
      "sources": [
        "setup",
        "trail",
        "collaborate-with-salesforce-contracts"
      ]
    },
    "readiness-delivery": {
      "simple": {
        "analogy": "A theatre rehearsal checks more than whether each actor knows a line. Props must arrive first, lighting cues must follow the action, and someone needs a plan if the microphone fails. Opening night also needs staff who know what to do.",
        "translation": "A revenue release combines configuration/metadata, business data, environment prerequisites and operational processes. Component tests, end-to-end tests, UAT, deployment verification and adoption each answer different readiness questions.",
        "limit": "A rehearsal analogy does not imply every deployment is easily reversible. Financial and external-system effects can require reconciliation and forward recovery rather than deleting records or rolling back metadata."
      },
      "entities": [
        {
          "name": "Deployment manifest / dependency inventory",
          "kind": "Release artifact",
          "description": "The configuration and data to move, supported transport methods, sequence and environment-specific references."
        },
        {
          "name": "UAT",
          "kind": "Business validation process",
          "description": "Representative users prove agreed outcomes, including exceptions and authorization."
        },
        {
          "name": "Cutover reconciliation",
          "kind": "Operational control",
          "description": "Compares intended and actual quantities, amounts, states and outstanding work across the transition."
        },
        {
          "name": "Adoption measures",
          "kind": "Operating evidence",
          "description": "Successful supported usage, error rates, support load and recovery, not attendance alone."
        }
      ],
      "sections": [
        {
          "title": "Why metadata deployment is not business readiness",
          "body": "A procedure may deploy while its price entries, lookup data or target-org permissions are missing. Configuration records and reference data do not always share the same supported migration mechanism as metadata. Inventory each dependency, identify its transport/setup method and replace environment-specific references deliberately. A successful deployment job proves transport, not correct runtime selection or financial outcomes."
        },
        {
          "title": "What each test layer should establish",
          "body": "A component test checks a rule or integration in isolation. An end-to-end case checks how catalog, quote, order, assets and billing interact. UAT asks business users whether the outcomes match policy. Include invalid combinations, boundary quantities/dates, denied access, integration failures and duplicate/retry situations. A high test count cannot compensate for omitting the scenario that releases money or entitlements incorrectly."
        },
        {
          "title": "What happens after go-live",
          "body": "Define monitoring, escalation and recovery owners before release. Train operators using real failure symptoms and evidence, not only screen navigation. Reconcile completed transactions and unresolved work after cutover, and track whether intended personas can actually complete their jobs. Pilot outcomes can justify widening rollout; a missing critical control should stop expansion even if the visible UI looks finished."
        }
      ],
      "walkthrough": [
        {
          "title": "Transport",
          "body": "A pricing procedure arrives in production but its matching price entries were not prepared. The deployment succeeded while the commercial transaction cannot."
        },
        {
          "title": "Diagnose",
          "body": "Compare the selected procedure, live context and target reference data with the working baseline. Avoid manually copying output prices onto quotes."
        },
        {
          "title": "Recover",
          "body": "Use the agreed release/recovery process, identify affected transactions and retest the real seller path with finance/operations reconciliation where relevant."
        }
      ],
      "sources": [
        "uat",
        "adoption",
        "manage-customer-asset-renewals-and-cancellations",
        "explore-order-orchestration"
      ]
    },
    "readiness-migration": {
      "simple": {
        "analogy": "Moving house is not just copying the labels on old boxes. You must decide what to keep, what goes into storage and whether important things still work in the new rooms. A lamp in the new house is not useful if its plug does not fit.",
        "translation": "CPQ migration maps business meaning and future behavior into the native model. Products, open transactions, active installed base and archival history can need different migration decisions and verification.",
        "limit": "This analogy does not prescribe a supported migration tool or allow arbitrary database insertion. Use official scope/tooling guidance for the target org and release."
      },
      "entities": [
        {
          "name": "Reference configuration",
          "kind": "Catalog/commercial data",
          "description": "Products, relationships, attributes, selling options and relevant price agreements."
        },
        {
          "name": "Open transaction",
          "kind": "Operational data",
          "description": "An offer/order still requiring execution or future servicing, not merely a reportable historical row."
        },
        {
          "name": "Installed-base baseline",
          "kind": "Lifecycle data",
          "description": "Effective customer quantities, dates, relationships and price context needed for supported future changes."
        },
        {
          "name": "Archive",
          "kind": "Historical access design",
          "description": "Preserved evidence for search, analytics or compliance without pretending all old records are operational native transactions."
        }
      ],
      "sections": [
        {
          "title": "Why field mapping is only the beginning",
          "body": "A legacy subscription can contain product, quantity and dates, yet a native managed asset needs the appropriate lifecycle state and relationships for supported amendments and renewals. Copying visible values can make a screen look correct while leaving the next transaction invalid. Map the operation the customer must perform after cutover, then identify the native data and supported creation path that operation requires."
        },
        {
          "title": "Decide historical scope from business obligations",
          "body": "Finance may need prior invoices and payments, service teams may need active entitlements, and sales may need searchable prior quotes. These are different needs and do not automatically require replaying every historical transaction in the new operational engine. Document archival versus operational scope, legal retention, reporting reconciliation and the customer-facing servicing implications."
        },
        {
          "title": "Prove behavior with a representative customer",
          "body": "Choose a pilot with a normal purchase, a partial-term change and a future renewal. Reconcile current and historical quantities, service dates, agreed prices and outstanding balances. Then perform the supported native follow-up operations. A matching row count is weak evidence if the first customer amendment fails or produces a duplicate entitlement."
        }
      ],
      "walkthrough": [
        {
          "title": "Baseline",
          "body": "Northstar has 10 seats today, an approved increase to 14 next month, and an unpaid historical invoice."
        },
        {
          "title": "Separate meanings",
          "body": "Current state, future-dated change and receivable must each retain their intended meaning; one current quantity field cannot represent all three."
        },
        {
          "title": "Acceptance",
          "body": "After cutover, the planned amendment and renewal must work through supported native processing, while finance can reconcile the outstanding obligation and prior payments."
        }
      ],
      "sources": [
        "migration",
        "data-model",
        "differences"
      ]
    },
    "catalog-structure": {
      "simple": {
        "analogy": "A streaming service has a library, shelves such as comedy and drama, and information about each film. Putting a film on the comedy shelf does not change its language or decide whether your subscription can watch it.",
        "translation": "Catalogs and categories organize the assortment and discovery. Classifications and attributes describe reusable product characteristics. Qualification/disqualification applies eligibility to the current selling context.",
        "limit": "A catalog is not a record-sharing policy, and a category label does not implement customer eligibility or commercial pricing on its own."
      },
      "entities": [
        {
          "name": "Catalog",
          "kind": "Catalog configuration/data",
          "description": "The assortment presented for a selling context."
        },
        {
          "name": "Product category",
          "kind": "Discovery structure",
          "description": "A navigation grouping in the catalog, with supported product associations and hierarchy."
        },
        {
          "name": "Product classification",
          "kind": "Reusable product model",
          "description": "Shared characteristics inherited/applied to related products."
        },
        {
          "name": "Attribute category",
          "kind": "Presentation grouping",
          "description": "Organizes product characteristics, rather than catalog navigation."
        },
        {
          "name": "Qualification / disqualification",
          "kind": "Business decision setup",
          "description": "Determines applicable offers from relevant transaction/customer inputs."
        }
      ],
      "sections": [
        {
          "title": "Why navigation and product identity should be separate",
          "body": "Customers may find the same support offer through several browsing routes. Creating duplicate products purely for each menu path fragments maintenance and reporting. Use the supported catalog/category associations for discovery placement, while preserving product identity unless the business truly has distinct offers. Availability still depends on the relevant product/catalog state and selling context."
        },
        {
          "title": "What a classification does instead",
          "body": "A classification is useful when many products share characteristic definitions, such as support level, language or deployment region. The classification is a reusable modeling structure; it is not simply another shelf in the catalog. Attribute categories then group the visible characteristics so configuration screens remain understandable. Learning these three uses of grouping avoids importing a CPQ product-family label as a universal replacement."
        },
        {
          "title": "From configured data to discoverable offer",
          "body": "A product record can exist while a seller cannot discover it. Investigate the applicable assortment/category association, active/effective state, eligibility inputs/rules, permissions and search/index readiness. Discovery is a runtime behavior over configured data, not a direct guarantee provided by a successful Product2 insert. Different channels must use the supported discovery behavior appropriate to their context."
        }
      ],
      "walkthrough": [
        {
          "title": "Model",
          "body": "Northstar Support is one commercial offer with a shared Support classification and a Support Level attribute."
        },
        {
          "title": "Place",
          "body": "The offer appears in the appropriate supported Software and Services discovery routes without inventing two different support identities."
        },
        {
          "title": "Qualify",
          "body": "A regional eligibility decision uses the actual customer/transaction input. An ineligible region does not become eligible merely because the product is visible in the admin product list."
        }
      ],
      "sources": [
        "get-started-with-product-catalog-management",
        "create-product-categories-and-attributes"
      ]
    },
    "catalog-attributes": {
      "simple": {
        "analogy": "A school uniform form asks for size and colour. The question “size” is defined once, the available sizes constrain valid answers, and each student chooses a value. A special team kit can have a different default without redefining everyone’s uniform.",
        "translation": "An attribute definition establishes the characteristic and its data type/values. Classification reuse applies common characteristics to products. A configured instance contains selected values. Supported product/component overrides specialize behavior in context.",
        "limit": "A product attribute is not necessarily a newly created custom field on Product2. Learn the native attribute model and mappings rather than assuming every visible option is a physical product field."
      },
      "entities": [
        {
          "name": "Attribute definition",
          "kind": "Reusable configuration/data",
          "description": "Meaning, type and relevant value constraints for a characteristic."
        },
        {
          "name": "Product attribute definition",
          "kind": "Product-model association",
          "description": "Applies the characteristic and relevant settings to a product context."
        },
        {
          "name": "Classification",
          "kind": "Reusable product structure",
          "description": "Shares characteristics across related offers."
        },
        {
          "name": "Selected attribute value",
          "kind": "Transaction configuration",
          "description": "The customer’s actual choice, which rules and pricing may consume."
        },
        {
          "name": "Attribute adjustment",
          "kind": "Pricing configuration",
          "description": "Connects qualifying attribute values to price behavior; visibility alone does not create pricing."
        }
      ],
      "sections": [
        {
          "title": "Definition, default and selection are three different things",
          "body": "The definition says that Support Level is a constrained choice with Standard and Priority values. A default says which value starts selected in the applicable product context. The transaction selection says what this customer actually chose. Validation decides which choices/combinations are allowed. Confusing these layers can cause administrators to change a shared default when they only intended to change one bundle component."
        },
        {
          "title": "Why inheritance needs deliberate override scope",
          "body": "Shared classification attributes reduce duplication. They also mean a broad change can affect many offers. A supported override lets a product or component context specialize an inherited setting where allowed. For example, a bundle can start with Priority support while the standalone product starts with Standard. Verify both experiences and any dependent rules rather than editing the shared definition and hoping the change stays local."
        },
        {
          "title": "How a characteristic affects money",
          "body": "A price-impacting choice needs a path into pricing: the selected value must reach the expected context, match applicable adjustment data and be consumed by the procedure. A correct configuration UI and an unchanged price are therefore not contradictory. The characteristic may be valid but not configured to affect price, or the pricing path may not receive it. Compare the waterfall using the same product and quantity with only the characteristic changed."
        }
      ],
      "walkthrough": [
        {
          "title": "Define",
          "body": "Support Level permits Standard and Priority; Northstar selects Priority. This identifies a choice, not an amount."
        },
        {
          "title": "Price",
          "body": "The example policy adds 20 to a 60 base unit price for Priority. Its mapped input and adjustment produce 80 when the supported procedure runs."
        },
        {
          "title": "Compare",
          "body": "With Standard, the same example has no Priority adjustment and remains 60. If both outcomes are 60, inspect the value-to-pricing path rather than merely renaming the UI label."
        }
      ],
      "sources": [
        "work-with-product-classifications",
        "create-product-categories-and-attributes",
        "implement-attribute-based-pricing"
      ]
    },
    "catalog-bundles": {
      "simple": {
        "analogy": "A meal deal can require one main, start with fries selected and let you remove an optional drink. “Already ticked” and “you must buy it” mean different things. The cashier’s choices are also different from the kitchen’s cooking tasks.",
        "translation": "Commercial bundle relationships control component grouping, inclusion, defaults and quantity behavior. Configuration rules enforce valid combinations. Technical decomposition later translates a committed sale into delivery work when needed.",
        "limit": "A bundle is not automatically a fixed-price package or a one-to-one fulfillment plan. Price allocation and technical delivery depend on separate configuration and policy."
      },
      "entities": [
        {
          "name": "Parent Product2",
          "kind": "Sellable product identity",
          "description": "The bundle offer the customer selects."
        },
        {
          "name": "Product component group",
          "kind": "Bundle organization",
          "description": "Groups related component choices within the structure."
        },
        {
          "name": "ProductRelatedComponent",
          "kind": "Native relationship object",
          "description": "Represents the component relationship in the parent structure with applicable behavior/settings."
        },
        {
          "name": "Configuration rule",
          "kind": "Business configuration",
          "description": "Expresses requirements, exclusions, validation or supported defaulting behavior."
        },
        {
          "name": "Technical product",
          "kind": "Fulfillment model",
          "description": "Represents delivery needs where decomposition requires them, not merely an optional commercial choice."
        }
      ],
      "sections": [
        {
          "title": "Understand independent component properties",
          "body": "Required means the final configuration must include the component. Included by default means it starts selected. Allowed quantity changes determine whether the user may alter its quantity as supported. These can be combined, but they are not synonyms. A support option can be preselected yet removable; a required base device can be included automatically with restricted quantity. Preview both the initial screen and the final save/reconfigure behavior."
        },
        {
          "title": "Static structure versus runtime choice",
          "body": "Some offers have a fixed included composition; others expose choices and attributes at runtime. A configurable bundle needs valid component relationships plus rules that handle interactions. A visual group alone does not prevent incompatible selections. For example, selecting one warranty may exclude another, while a device choice may require a specific accessory. The configuration engine needs the actual scope, conditions and actions."
        },
        {
          "title": "Keep selection structure separate from execution structure",
          "body": "One sellable workstation can require shipping, provisioning and installation across different systems. Conversely, a simple commercial line may need only one internal approval. Decomposition and orchestration should be designed from these delivery needs. Reusing the commercial option hierarchy as an execution engine without defining mappings and dependencies leaves operational behavior unspecified."
        }
      ],
      "walkthrough": [
        {
          "title": "Base component",
          "body": "The workstation requires one base unit and includes it initially; sellers cannot remove it."
        },
        {
          "title": "Optional support",
          "body": "Support starts selected but is not required. The seller may remove it, subject to any separately defined policy."
        },
        {
          "title": "Invalid case",
          "body": "Two mutually exclusive warranties are selected. The configured rule must reject or prevent the combination with a useful message, rather than relying on the order team to notice."
        }
      ],
      "sources": [
        "build-a-simple-product",
        "create-a-product-bundle",
        "discover-order-decomposition"
      ]
    },
    "catalog-selling": {
      "simple": {
        "analogy": "You can buy a bicycle once, rent a locker for a school year, or keep a club membership until you cancel. Paying the school-year locker fee monthly does not change the fact that you committed for a year.",
        "translation": "One-time, term-defined and evergreen selling models describe commercial duration/continuation. A product’s selling-model options connect it to supported ways to sell it, with corresponding price context. Invoice frequency and payment due terms are separate.",
        "limit": "The same English word “monthly” can describe a price basis, a service period or invoice timing. Always say which one you mean; the label alone does not configure the lifecycle."
      },
      "entities": [
        {
          "name": "ProductSellingModel",
          "kind": "Native object",
          "description": "Defines the commercial selling behavior and applicable term information."
        },
        {
          "name": "ProductSellingModelOption",
          "kind": "Native association object",
          "description": "Connects a product to an available selling model and related supported settings."
        },
        {
          "name": "PricebookEntry",
          "kind": "Native object",
          "description": "Supplies product price context for the applicable price book and compatible selling option."
        },
        {
          "name": "Service dates / pricing term",
          "kind": "Transaction and pricing information",
          "description": "Identify actual duration and the period the quoted unit price represents."
        },
        {
          "name": "Billing cadence / payment terms",
          "kind": "Billing configuration",
          "description": "Control invoice timing and due dates independently from commitment."
        }
      ],
      "sections": [
        {
          "title": "How an option differs from a product",
          "body": "A product identifies what is sold. Its supported selling-model options identify ways that product can be sold. For example, commercial policy may offer a fixed-term commitment or an ongoing arrangement with different terms and prices. The transaction must select compatible context; a price entry or term that belongs to another option cannot be assumed to apply just because the product name matches."
        },
        {
          "title": "Price basis versus actual duration",
          "body": "A 60 monthly unit price for a one-year service is not the same numeric basis as a 720 annual unit price, even when they imply the same full-year amount under simple assumptions. Subscription pricing uses the appropriate duration/multiplier and quantity with the chosen base period. Missing units can produce twelvefold errors. Proration then handles partial periods under the configured convention."
        },
        {
          "title": "Commercial duration versus money timing",
          "body": "A fixed annual service can generate monthly invoices, and each invoice can have net-30 terms. The service may already be legally committed even though some invoices are not yet issued or paid. Evergreen describes continuation until a qualifying end/cancellation, not simply a monthly invoice. Choose the selling behavior from the business agreement and billing behavior from the collection/invoice policy."
        }
      ],
      "walkthrough": [
        {
          "title": "Commercial choice",
          "body": "Northstar commits to 10 seats for 12 months at 60 per seat per month."
        },
        {
          "title": "Simple arithmetic",
          "body": "Before discounts/tax and assuming twelve full monthly periods, commercial value is 10 × 60 × 12 = 7200."
        },
        {
          "title": "Separate billing",
          "body": "Monthly invoicing and net-30 terms determine when portions are billed and due; they do not turn the agreement into twelve unrelated one-time purchases."
        }
      ],
      "sources": [
        "build-a-simple-product",
        "selling-models",
        "set-up-and-sell-products",
        "native-selling-option"
      ]
    },
    "cpq-configure": {
      "simple": {
        "analogy": "A custom bicycle builder lets you choose a frame, wheels and brakes. The screen arranges the choices, while the safety rules decide which combinations work. Changing the screen to two columns does not make incompatible brakes safe.",
        "translation": "The configurator experience combines a Flow definition and UI components with data handling and configuration logic. Product Configuration Flow records and assignments connect the intended experience to products/classifications. Rules apply business-valid combinations.",
        "limit": "UI guidance and transaction validity are related but separate. A disabled choice on one screen is not evidence that every API or integration rejects it."
      },
      "entities": [
        {
          "name": "Flow definition / active version",
          "kind": "Salesforce metadata",
          "description": "The actual guided screen/process and its configured components."
        },
        {
          "name": "Data Manager",
          "kind": "Configurator component responsibility",
          "description": "Connects the experience to its underlying context data; it is not the catalog definition itself."
        },
        {
          "name": "Product Configuration Flow",
          "kind": "Native configuration record",
          "description": "Identifies the Flow used for the supported configuration experience."
        },
        {
          "name": "Product Configuration Flow Assignment",
          "kind": "Association record",
          "description": "Connects that configuration experience to the intended product or classification."
        },
        {
          "name": "Product configuration rule / rule library",
          "kind": "Rule configuration",
          "description": "Applies scoped conditions/actions such as validation, exclusion, requirements or defaults."
        }
      ],
      "sections": [
        {
          "title": "What actually opens when a rep configures a product",
          "body": "The seller is not merely editing Product2. The runtime needs the product’s composition and attributes, the transaction context and the assigned configuration experience. The default configurator Flow supplies relevant UI components; a supported custom Flow can adjust that experience. The assignment chain matters: an edited Flow in Flow Builder is not automatically the Flow selected for every product."
        },
        {
          "title": "How the documented assignment chain works",
          "body": "In the official training org, save the default Flow as a new Flow, make the intended change and activate it. The Product Configuration Flow record refers to its Flow identifier and active configuration status. An assignment connects that record to the product or classification. If preview still uses the old screen, inspect each link in this chain. Keep the actual Flow definition/version distinct from the record that references it."
        },
        {
          "title": "What the rule engine contributes",
          "body": "A rule has applicability/scope, conditions and actions. Requirement logic adds or requires dependent choices; exclusion logic prevents incompatible options; validation identifies an unacceptable combination. Defaulting can suggest an attribute value without making it mandatory. The training path also includes rule-library activation and feature prerequisites. Current constraint-based capabilities are a related implementation option, but availability and exam-release relevance must be checked rather than assumed."
        }
      ],
      "walkthrough": [
        {
          "title": "Experience",
          "body": "The Support bundle is assigned to the active Northstar Configurator Flow through its configuration-flow record and assignment."
        },
        {
          "title": "Rule",
          "body": "For this teaching policy, Premium support requires an onboarding component. A scoped requirement expresses that dependency."
        },
        {
          "title": "Result",
          "body": "Choosing Premium produces the required onboarding behavior; changing the layout alone would not. Test save/reconfigure as well as the initial screen."
        }
      ],
      "sources": [
        "get-started-with-product-configurator",
        "create-and-configure-a-product-configurator-flow",
        "use-product-configurator-with-business-rules-engine",
        "explore-product-configurator-with-constraint-rules-engine"
      ]
    },
    "cpq-pricing": {
      "simple": {
        "analogy": "A shop receipt is built in steps: start with the shelf price, apply the sale, apply the coupon if allowed, then calculate the total. Taking 10% off before a fixed coupon can produce a different answer from doing it afterwards.",
        "translation": "A pricing procedure is an ordered sequence of pricing elements with mapped inputs and outputs. The price waterfall shows the calculation path. Price entries and adjustment data supply values; context supplies the transaction inputs.",
        "limit": "The receipt analogy does not define a universal discount order. Replacement, stacking, tax, proration and rounding depend on the actual commercial policy and supported configuration."
      },
      "entities": [
        {
          "name": "Pricing procedure / version",
          "kind": "Calculation configuration",
          "description": "The ordered executable pricing design selected for the transaction."
        },
        {
          "name": "Pricing element",
          "kind": "Procedure step",
          "description": "Performs a defined task, such as list-price lookup or a supported adjustment."
        },
        {
          "name": "Pricing Setting",
          "kind": "Common setup element",
          "description": "Establishes procedure-wide mappings such as line and amount outputs."
        },
        {
          "name": "Context variable mapping",
          "kind": "Configuration connection",
          "description": "Links element inputs/outputs to the intended context tags."
        },
        {
          "name": "Price waterfall",
          "kind": "Runtime calculation evidence",
          "description": "Shows intermediate calculation results so the first divergence can be found."
        }
      ],
      "sections": [
        {
          "title": "Where the initial price comes from",
          "body": "List Price uses matching commercial context rather than simply reading whichever amount a developer finds on a product. Product, price book, selling model and relevant transaction inputs must be compatible with the lookup. An absent match can be a data/context problem, not evidence that a discount formula is wrong. Price entries and adjustment data must also be available to the configured runtime through the required sync/refresh processes."
        },
        {
          "title": "Why ordered elements need clear contracts",
          "body": "One element can produce a value consumed by the next. Know whether an amount is per unit or extended for quantity, and whether a percentage applies to list or the current running price. Output mappings determine where later steps and the transaction receive results. Applying a fixed reduction once to a header is not the same as applying it to each unit; importing a familiar CPQ field name without checking this basis can change money."
        },
        {
          "title": "How to read simulation evidence",
          "body": "Supply known inputs and predict every intermediate result before simulating. The waterfall reveals where expectation first differs: lookup, adjustment eligibility, arithmetic, duration or output. Simulation with typed inputs tests calculation behavior for those supplied values. The live quote additionally tests hydration, procedure/version selection, available data, access and save behavior. Passing the first does not automatically pass the second."
        }
      ],
      "walkthrough": [
        {
          "title": "Inputs",
          "body": "Example unit list price 240, quantity 5, percentage discount 10, then fixed reduction 12 per unit; ignore tax and proration."
        },
        {
          "title": "Waterfall",
          "body": "240 − 24 = 216; 216 − 12 = 204; 204 × 5 = 1020."
        },
        {
          "title": "Different order",
          "body": "(240 − 12) × 0.90 × 5 = 1026. Both are coherent calculations, but only the first matches the specified business policy."
        }
      ],
      "sources": [
        "create-a-pricing-procedure-with-the-list-price-element",
        "configure-pricing-for-products",
        "add-volume-and-manual-discounts"
      ]
    },
    "cpq-advanced": {
      "simple": {
        "analogy": "A school trip ticket might cost less for a large group, more for an optional activity, a percentage of another package, or a special negotiated amount for one school. Those are different reasons for a price, so they need different information.",
        "translation": "Advanced native pricing mechanisms address distinct commercial drivers: selected attributes, bundle membership, volume, discovered source products, negotiated contracts, duration and supported aggregation. Choosing the correct mechanism requires understanding its inputs and precedence.",
        "limit": "The platform does not infer which overlapping commercial promise should win. A named pricing feature is not a complete policy until eligibility, ordering, replacement/stacking and date/unit conventions are explicit."
      },
      "entities": [
        {
          "name": "Adjustment schedule / tiers",
          "kind": "Pricing data",
          "description": "Configured changes based on the applicable quantity, attribute or bundle conditions."
        },
        {
          "name": "Derived-price relationship and discovery",
          "kind": "Pricing configuration",
          "description": "Defines a dependent amount and identifies the eligible source product/context used to calculate it."
        },
        {
          "name": "ContractItemPrice",
          "kind": "Native negotiated-pricing object",
          "description": "Represents agreed product pricing in the applicable contract context."
        },
        {
          "name": "ContractItemPriceAdjTier",
          "kind": "Native tier object",
          "description": "Represents supported negotiated tier adjustments associated with contract item pricing."
        },
        {
          "name": "Proration policy / multiplier",
          "kind": "Time-pricing configuration and result",
          "description": "Defines partial-period behavior and the duration factor used by subscription calculation."
        },
        {
          "name": "Aggregate pricing element",
          "kind": "Calculation capability",
          "description": "Summarizes supported values/groupings; not an arbitrary guarantee of every header rollup."
        }
      ],
      "sections": [
        {
          "title": "Adjustment versus derived price",
          "body": "An adjustment changes a price under a condition: a selected support level, bundle context or quantity tier. Derived pricing makes one product’s price depend on a discovered source amount. For example, support may be 15% of eligible equipment. The formula is only half the setup: discovery must identify which equipment counts. With no eligible source or multiple candidates, the expected behavior must be defined and tested; otherwise a correct percentage can still use the wrong base."
        },
        {
          "title": "Contract price is a contextual commercial agreement",
          "body": "Native contract pricing can represent an agreed base and optional tiers. The transaction needs the relevant account/contract context and eligible data, with the procedure configured to consume it. “There is a contract” is not enough to establish that its price applies to this product, date and transaction. If a fixed agreement replaces derived pricing, implement replacement; do not blindly add a fixed discount after the derived result. The official unit’s conditional contract-pricing pattern illustrates why applicability must be explicit."
        },
        {
          "title": "Proration is a duration calculation with units",
          "body": "A multiplier converts an actual service duration into the number/fraction of base pricing periods under the applicable policy. A 60-per-month price multiplied by 1.5 monthly periods yields 90 per unit under a simple stated convention; 60-per-year multiplied by 1.5 annual periods means something else. Actual partial-month boundaries, allowed partial periods and rounding follow configuration. Quantity and the duration-adjusted unit amount then feed the supported subscription calculation."
        },
        {
          "title": "Aggregate and usage are not substitute mechanisms",
          "body": "Aggregate pricing addresses supported summarization/grouping needs; verify current supported fields and combinations rather than treating it as a universal header updater. Usage pricing instead needs measurements, units, entitlements and rates. A monthly subscription can include usage, but the duration-based seat charge and consumption-based overage are separate amounts with different evidence. Combining them requires deliberate policy and downstream billing, not one generic percentage rule."
        }
      ],
      "walkthrough": [
        {
          "title": "Derived case",
          "body": "Equipment is 800. The stated support policy is 15% of that eligible amount, so support is 120."
        },
        {
          "title": "Contract exception",
          "body": "For one eligible contract the agreed fixed support price is 100 instead. This case requires explicit replacement rather than taking 100 off 120."
        },
        {
          "title": "Time case",
          "body": "A separate 60-per-seat monthly subscription has 3 seats and, under this teaching example’s stated 30-day convention, 10 chargeable days: 60 × 3 × 10/30 = 60. The 30-day convention is illustrative, not a native default claim."
        }
      ],
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
    "cpq-transact": {
      "simple": {
        "analogy": "Telling a shop assistant “my usual order” is convenient only if the assistant identifies the right customer, items and dates. A confident spoken answer is not a receipt, and a receipt for the wrong order is still wrong.",
        "translation": "A human seller or quoting agent must use correctly configured catalog, configuration, pricing and transaction capabilities. Persisted quote records, validation and required approvals establish the actual commercial result.",
        "limit": "Agentforce is an interaction/action layer over supported capabilities, not an exception to product eligibility, authorization or pricing rules. Supported actions and prerequisites depend on the configured agent and org."
      },
      "entities": [
        {
          "name": "Quote / QuoteLineItem",
          "kind": "Native transaction objects",
          "description": "The saved offer header and product-line facts, including relevant dates and prices."
        },
        {
          "name": "Transaction Line Editor",
          "kind": "Seller experience",
          "description": "The interface for reviewing/editing supported transaction line information; not itself a separate price policy."
        },
        {
          "name": "Agent topic / action",
          "kind": "Agent configuration",
          "description": "Controls the supported task and callable behavior, required inputs and instructions."
        },
        {
          "name": "Execution identity",
          "kind": "Authorization context",
          "description": "The actual identity/context under which an action accesses records and invokes services."
        },
        {
          "name": "Approval / confirmation",
          "kind": "Business control",
          "description": "The relevant authorization or user acknowledgment required by the transaction policy."
        }
      ],
      "sections": [
        {
          "title": "The minimum meaning of an accurate quote",
          "body": "An accurate amount attached to the wrong customer, selling model or dates is not an accurate quote. The offer must identify who is buying, what is configured, how much, for what period, in which commercial context and subject to which controls. A saved line needs compatible product/price references and a valid calculation. Inspect persisted facts rather than judging only a PDF or an agent summary."
        },
        {
          "title": "How the agent path depends on the manual path",
          "body": "First establish a known-good supported seller transaction. The agent then needs the configured topic/action and required inputs to invoke the appropriate supported behavior. If catalog discovery or live pricing is broken, an agent cannot repair it by describing the intended outcome. Compare manual and agent results using the same customer/product/date inputs and inspect records and error handling."
        },
        {
          "title": "Why missing intent should produce clarification",
          "body": "A request to renew, amend or purchase is not interchangeable. “Add five to our usual plan” needs the relevant asset, effective date and total-versus-delta semantics. An agent that creates a new sale to avoid those questions can duplicate service. Its instructions and action design should collect missing inputs, respect available supported operations and stop or clarify when the request cannot be safely resolved."
        }
      ],
      "walkthrough": [
        {
          "title": "Request",
          "body": "Northstar asks for renewal plus two seats, but does not identify the relevant service term."
        },
        {
          "title": "Clarify and resolve",
          "body": "Resolve the intended customer/assets, current ending period, next term and quantity. Confirm the agent supports the required transaction action."
        },
        {
          "title": "Verify",
          "body": "Inspect saved quote type/context, lines, dates, quantities, pricing and approvals. A pleasant answer saying “done” is not enough evidence."
        }
      ],
      "sources": [
        "work-with-quotes",
        "discover-and-configure-products",
        "agent"
      ]
    },
    "contracts-legal": {
      "simple": {
        "analogy": "Agreeing on a school trip price, signing the permission form and actually boarding the coach are different events. The final signed form must be the version everyone approved, not an old draft.",
        "translation": "Salesforce Contracts manages the legal agreement lifecycle and document collaboration. Contract types, states/transitions, templates, clauses, versions and approvals govern legal execution. Order and fulfillment logic separately govern delivery.",
        "limit": "Not every org uses the same contract states, signature provider or document capability. Treat a proposed lifecycle as a business design to configure through supported features, not a universal out-of-the-box state sequence."
      },
      "entities": [
        {
          "name": "Contract",
          "kind": "Native agreement record",
          "description": "Identifies the agreement and relevant status/relationships; does not itself execute every delivery task."
        },
        {
          "name": "Contract type / state model",
          "kind": "Lifecycle configuration",
          "description": "Defines the applicable legal process and supported transitions/conditions."
        },
        {
          "name": "Template / clause",
          "kind": "Document configuration",
          "description": "Provides reusable agreement content and governed language."
        },
        {
          "name": "Document version",
          "kind": "Agreement evidence",
          "description": "Preserves the wording/revision being reviewed or executed."
        },
        {
          "name": "Contract item pricing",
          "kind": "Commercial data",
          "description": "Represents supported negotiated prices separately from merely including a number in a document."
        }
      ],
      "sections": [
        {
          "title": "Legal acceptance is a controlled sequence",
          "body": "The business may require authoring, review, negotiation, approval, signature and activation. Decide which actors may initiate each transition and which evidence is required. Some cases may need exceptions or different contract types. A sales-stage update or quote acceptance is not inherently legal execution; it becomes a gate only through an agreed supported process with the right evidence."
        },
        {
          "title": "Why content and version governance matter",
          "body": "A template can insert consistent structure and clauses, but negotiation changes the actual agreement. If approval applies to one version and signature uses another, a green status alone can conceal a material control failure. Track which final version was approved and executed, who may change protected clauses and whether changes require reapproval. Collaboration is useful only if the final agreement can be identified unambiguously."
        },
        {
          "title": "How contracts connect downstream",
          "body": "The agreement may determine permitted service dates, pricing exceptions or cancellation rights. Operational systems need an explicit handoff condition and applicable terms, rather than parsing a PDF informally. The supported order/fulfillment design can wait for the required contract event, while billing can wait for a different event such as service acceptance. Native negotiated-pricing records also need their own eligibility and procedure setup."
        }
      ],
      "walkthrough": [
        {
          "title": "Draft",
          "body": "Northstar’s enterprise contract uses the required security clause and follows the applicable review/approval process."
        },
        {
          "title": "Execution",
          "body": "A negotiated revision is approved in its final form and signed through the configured supported process."
        },
        {
          "title": "Handoff",
          "body": "Provisioning is released only when its agreed legal gate is satisfied. Signing alone is not proof that service has already been activated or invoiced."
        }
      ],
      "sources": [
        "meet-salesforce-contracts",
        "dive-into-salesforce-contracts-capabilities",
        "collaborate-with-salesforce-contracts"
      ]
    },
    "contracts-decompose": {
      "simple": {
        "analogy": "You buy one “internet setup” package, but the supplier must ship a router and activate a connection. The customer bought one understandable offer; the delivery teams need two different work instructions.",
        "translation": "Order decomposition translates commercial products/order structure into the technical fulfillment products or work units required by delivery. Mappings transfer relevant parameters. Orchestration then controls execution and dependencies.",
        "limit": "Not every sale requires decomposition. A simple order may already contain sufficient information for supported direct orchestration, and technical outputs need not mirror each option in the commercial bundle."
      },
      "entities": [
        {
          "name": "Commercial product / order line",
          "kind": "Sales and commitment data",
          "description": "What the customer agreed to buy."
        },
        {
          "name": "Technical product",
          "kind": "Fulfillment model",
          "description": "What a delivery system/team needs to fulfill, where the solution uses decomposition."
        },
        {
          "name": "Decomposition rule / mapping",
          "kind": "Transformation configuration",
          "description": "Determines applicable outputs and how information is translated."
        },
        {
          "name": "Attribute mapping",
          "kind": "Transformation connection",
          "description": "Transfers values such as location, plan choice or device configuration to delivery inputs."
        },
        {
          "name": "Fulfillment plan/work",
          "kind": "Execution data",
          "description": "The resulting work that orchestration subsequently sequences and tracks."
        }
      ],
      "sections": [
        {
          "title": "Why the commercial and technical models differ",
          "body": "A seller needs understandable choices; a provisioning API needs precise service parameters; a warehouse needs a shipping instruction. Exposing every technical parameter as an independent customer option can make quoting unusable. Decomposition allows a commercial offer to remain coherent while producing the right downstream units. The design must still state how those units retain source lineage and quantities."
        },
        {
          "title": "A mapping must express more than product names",
          "body": "For each applicable input, specify output identity, quantity/grouping and required attributes. A router delivery may need a destination while a network activation needs a service identifier. Missing or incorrectly combined attributes can cause failure even when the expected technical product names appear. Also consider what a later commercial amendment should do to existing fulfillment work."
        },
        {
          "title": "Where transformation stops and execution starts",
          "body": "Generating shipping and activation outputs does not say whether activation waits for delivery, whether a human must approve, or what happens after a timeout. Those are orchestration concerns. Keep the expected decomposition result test separate from the execution plan test so you can tell whether the wrong work was generated or the right work was sequenced incorrectly."
        }
      ],
      "walkthrough": [
        {
          "title": "Input",
          "body": "One Connectivity Bundle order line includes router delivery and a service plan."
        },
        {
          "title": "Transformation",
          "body": "The example decomposition produces the required shipping and activation units, carrying the destination and plan parameters to the relevant outputs."
        },
        {
          "title": "Execution boundary",
          "body": "The plan explicitly determines their dependencies. A separate simple training line may go directly to a supported manual approval without an invented technical catalog."
        }
      ],
      "sources": [
        "meet-dynamic-revenue-orchestrator",
        "discover-order-decomposition",
        "define-an-order-decomposition"
      ]
    },
    "contracts-orchestrate": {
      "simple": {
        "analogy": "A relay race needs more than a list of runners. Each runner needs to know when to start, who hands over the baton and whether the job happens once for the team or for each lap.",
        "translation": "Dynamic Revenue Orchestrator uses configured fulfillment workspaces, step groups, step definitions, scopes and dependencies to coordinate delivery. Runtime work records track the actual order execution.",
        "limit": "Visual swimlane position alone does not create a dependency. Also distinguish a transaction line from its quantity: three units on one line are not automatically three independent task instances."
      },
      "entities": [
        {
          "name": "Fulfillment workspace",
          "kind": "Design configuration",
          "description": "Contains the supported orchestration structure and reusable step groups/definitions."
        },
        {
          "name": "Step group / swimlane",
          "kind": "Organization configuration",
          "description": "Groups work by functional stream such as shipping or activation."
        },
        {
          "name": "Fulfillment step definition",
          "kind": "Execution configuration",
          "description": "Defines task type, handler/integration or assignee and applicable behavior."
        },
        {
          "name": "Scope",
          "kind": "Execution-cardinality configuration",
          "description": "Determines the supported plan, bundle or line level at which work runs."
        },
        {
          "name": "Dependency",
          "kind": "Execution gate",
          "description": "Defines which predecessor condition must be satisfied before work proceeds."
        },
        {
          "name": "Runtime task/plan instance",
          "kind": "Operational records",
          "description": "The actual execution status and evidence for a particular order."
        }
      ],
      "sections": [
        {
          "title": "What the task type means",
          "body": "An automated task performs configured automation such as a Flow. A callout invokes the relevant integration. A manual task needs an assigned person to perform/confirm work. A milestone marks progress and a pause represents waiting as configured. These types are not interchangeable labels: selecting one determines what handler, assignment or evidence the process needs. A milestone called “Invoice sent” does not itself guarantee an email was actually delivered."
        },
        {
          "title": "Scope answers how often; dependencies answer when",
          "body": "A line-scoped activation may need to run for each applicable line, while a consolidated notification runs once for the plan. Even correct scope does not ensure ordering. The notification must depend on the required completion condition, including all relevant work. Conversely, perfect dependencies cannot stop a notification from running once per line if its scope is wrong."
        },
        {
          "title": "Why multi-line and denied-access cases matter",
          "body": "A one-line happy path can hide duplicate plan-level tasks and missing fan-in dependencies. Test at least two applicable lines, a nonapplicable line and an incomplete predecessor. Verify the execution identity’s required access and what a failed handler does. Actual timestamps, task counts and status evidence are stronger than a diagram that merely looks plausible."
        }
      ],
      "walkthrough": [
        {
          "title": "Inputs",
          "body": "An order has two separate service lines that each require activation."
        },
        {
          "title": "Scoped work",
          "body": "The supported plan produces activation work for each applicable line and one consolidated notification at the chosen plan scope."
        },
        {
          "title": "Gate",
          "body": "The notification waits for both required activations. It does not fire merely because the first line succeeds or because the email box is drawn below the activation lane."
        }
      ],
      "sources": [
        "explore-order-orchestration",
        "design-a-simple-order-orchestration",
        "design-an-orchestration-plan",
        "define-dependencies-and-fulfillment-scenarios"
      ]
    },
    "contracts-recovery": {
      "simple": {
        "analogy": "You order food online and the app times out after you press Pay. That does not tell you whether the restaurant received the order or your card was charged. Pressing Pay five more times might make the problem worse.",
        "translation": "A timeout is an ambiguous integration outcome. Recovery needs correlation identifiers, external-state reconciliation and supported replay behavior. Jeopardy concerns delivery timing risk; fallout concerns failed execution needing resolution.",
        "limit": "Idempotency must be designed and confirmed for the relevant API and operation. It is not a universal promise that every revenue action or retry automatically has no duplicate effects."
      },
      "entities": [
        {
          "name": "Jeopardy",
          "kind": "Operational risk signal",
          "description": "Indicates actual/predicted schedule risk under configured monitoring."
        },
        {
          "name": "Fallout / failed step",
          "kind": "Execution exception",
          "description": "An operation failed or needs resolution, rather than simply running late."
        },
        {
          "name": "Correlation identifier",
          "kind": "Integration data",
          "description": "Links the internal request to the external operation for tracing/reconciliation."
        },
        {
          "name": "Idempotency key / replay policy",
          "kind": "Integration contract",
          "description": "Defines how repeated attempts refer to the same business operation where supported."
        },
        {
          "name": "Recovery runbook",
          "kind": "Operating procedure",
          "description": "Evidence, responsible owner, supported corrective action and reconciliation checks."
        }
      ],
      "sections": [
        {
          "title": "Timing risk and failure need different responses",
          "body": "A delivery can be running correctly yet threaten its target date because a predecessor is delayed. Another delivery can fail immediately on invalid business data. The first may require escalation or resequencing; the second needs correction before an appropriate retry. Treating both as “click retry” misses the cause and can increase operational noise."
        },
        {
          "title": "Why a lost response is not a failed business action",
          "body": "Networks and remote systems have independent states. A remote activation can complete before its response is lost. The internal task may display a timeout while the customer already has service. Use the correlation evidence to inspect the remote result and then follow the designed reconciliation/completion path. Do not invent success, but do not infer absence of work from an absent response."
        },
        {
          "title": "Recovery preserves completed work and consistency",
          "body": "A supported retry should target the appropriate failed work after resolving the cause. Replaying the whole order can repeat shipping, provisioning or customer communication that already succeeded. Recovery acceptance includes checking both local and remote state, downstream releases and any financial side effects. Log the correction and owner so the next operator can understand what happened."
        }
      ],
      "walkthrough": [
        {
          "title": "Failure symptom",
          "body": "Activation request A-17 times out locally."
        },
        {
          "title": "Reconcile",
          "body": "The remote service is queried using A-17’s correlation evidence and reports that the service was activated."
        },
        {
          "title": "Resolve",
          "body": "Use the configured supported completion/recovery path and verify that the next task proceeds once. Do not issue another independent activation merely to clear the timeout screen."
        }
      ],
      "sources": [
        "explore-order-orchestration",
        "execute-an-orchestration-plan"
      ]
    },
    "assets-history": {
      "simple": {
        "analogy": "A library keeps your membership, a list of changes to it and a timeline of what you were allowed to borrow during each period. “Added two books” is a change; “may borrow fourteen books” is a state. They are not numbers to add together.",
        "translation": "Asset is the managed installed identity. AssetAction captures a lifecycle event, AssetStatePeriod captures effective state over an interval, and AssetActionSource relates the change to its source transaction.",
        "limit": "This is managed revenue lifecycle behavior, not a claim that creating any generic Asset record automatically creates complete revenue history. Verify supported processing and actual populated fields in the org."
      },
      "entities": [
        {
          "name": "Asset",
          "kind": "Native object",
          "description": "Identifies the customer’s managed product/service and relationships."
        },
        {
          "name": "AssetAction",
          "kind": "Native lifecycle object",
          "description": "Records an event/change, with the relevant action context."
        },
        {
          "name": "AssetStatePeriod",
          "kind": "Native lifecycle object",
          "description": "Represents the state applicable during an interval, rather than a movement to sum."
        },
        {
          "name": "AssetActionSource",
          "kind": "Native lineage object",
          "description": "Provides the source transaction context for the lifecycle event."
        },
        {
          "name": "Effective date",
          "kind": "Business-time information",
          "description": "When a state/change applies, distinct from record creation or last-modified time."
        }
      ],
      "sections": [
        {
          "title": "Identity, event and interval answer different questions",
          "body": "The asset identifies the service being managed. The action explains what changed. The state period explains what was in force at a point in business time. Source lineage explains why the change exists. An analyst asking “how many seats in August?” needs effective state, while an operator asking “which transaction added them?” needs the action/source chain. The latest record modification is not a substitute for either question."
        },
        {
          "title": "Future and historical state can coexist",
          "body": "A change can be scheduled today for next month. The system can know about the future event without making the new quantity effective immediately. Historical periods also need to remain interpretable after later changes. Correct reporting applies the actual interval boundary conventions and avoids counting multiple periods as simultaneous active balances. Do not fabricate end-date inclusivity rules; inspect the supported lifecycle behavior."
        },
        {
          "title": "Monetary state is not automatically billed or paid",
          "body": "An installed quantity or recurring run-rate measure describes entitlement/commercial state. Invoice totals describe billed obligations and payment records describe settlement. Even where monetary fields exist on lifecycle objects, verify their generated values and meaning rather than assuming a field is automatically populated or equivalent to invoice amount. Reconciliation connects these facts without collapsing them."
        }
      ],
      "walkthrough": [
        {
          "title": "January",
          "body": "Northstar has 10 seats in the applicable starting state."
        },
        {
          "title": "July",
          "body": "A +4 action effective July 1 creates the supported transition to 14. An August historical view should use that applicable state."
        },
        {
          "title": "October",
          "body": "A −2 change produces 12 from the applicable October boundary. Summing the three state quantities 10 + 14 + 12 would count different intervals, not actual concurrent seats."
        }
      ],
      "sources": [
        "provide-post-sales-support",
        "build-loyalty-through-post-sale-engagement",
        "native-asset-model",
        "native-transaction-objects"
      ]
    },
    "assets-amend": {
      "simple": {
        "analogy": "If your group has 10 tickets and needs 14, you ask for four more, not fourteen more. A change form must make clear whether its number means “add this many” or “make the final total this many.”",
        "translation": "The documented native amendment exercise uses Start Quantity, Quantity as delta and End Quantity. The supported asset action produces an amendment quote, followed by order creation/activation and the required lifecycle processing.",
        "limit": "Do not assume every quantity field on every screen has delta semantics. This explanation refers to the documented amendment UI; inspect the actual field and transaction type you are using."
      },
      "entities": [
        {
          "name": "Managed asset",
          "kind": "Installed-base identity",
          "description": "The existing product/service selected for a supported amendment."
        },
        {
          "name": "Amendment quote / lines",
          "kind": "Proposed change transaction",
          "description": "Express the requested effective change and calculated commercial consequences."
        },
        {
          "name": "Start Quantity / Quantity / End Quantity",
          "kind": "Amendment UI values",
          "description": "In the documented exercise, starting balance, change amount and resulting balance."
        },
        {
          "name": "Amendment order / lines",
          "kind": "Committed change transaction",
          "description": "The order produced from the accepted amendment quote for supported processing."
        },
        {
          "name": "Asset action / state periods",
          "kind": "Lifecycle result",
          "description": "The recorded change and resulting effective installed state after processing."
        }
      ],
      "sections": [
        {
          "title": "What an amendment changes",
          "body": "An amendment changes an existing service during its relevant lifecycle, using an effective date and supported operation. It should preserve the connection to what the customer already owns rather than create an unrelated sale of the desired final quantity. Quantity, configuration, price and term consequences depend on the transaction and policy. A simple quantity example teaches only one part of this behavior."
        },
        {
          "title": "Why the delta matters",
          "body": "In the official quantity-change exercise, Start Quantity is the current baseline, Quantity is the increase/decrease and End Quantity reflects the result. Ten plus four gives fourteen. Ten plus fourteen gives twenty-four. A negative three from fourteen gives eleven. A correct end balance is necessary, but you must also inspect effective date, eligibility and calculated amounts; quantity arithmetic alone cannot determine prorated charges or credits."
        },
        {
          "title": "Why saving the quote is not completion",
          "body": "The quote records the proposed change. The documented path creates and activates the resulting order, followed by the applicable transaction/asset processing. Check statuses and generated lifecycle evidence before concluding the installed base changed. A future effective date can also explain why a current-state view still shows the old quantity. Editing Asset directly to make the screen match risks breaking the source and history chain."
        }
      ],
      "walkthrough": [
        {
          "title": "Select and date",
          "body": "Northstar’s existing 10-seat service is selected for an amendment effective July 1."
        },
        {
          "title": "Propose",
          "body": "Quantity delta +4 yields End Quantity 14 in this amendment UI. Verify price/date output before creating the order."
        },
        {
          "title": "Commit and observe",
          "body": "Process the supported order and inspect the action/source and applicable state period. Prior service remains historical evidence; the new 14-seat state applies at the configured effective boundary."
        }
      ],
      "sources": [
        "manage-customer-asset-amendments",
        "provide-post-sales-support"
      ]
    },
    "assets-renew": {
      "simple": {
        "analogy": "Extending your school locker for next year is different from changing how much space you use this year. The new booking needs its own dates and agreed terms, even if you keep the same locker.",
        "translation": "Renewal continues eligible installed products into a subsequent term through the supported renewal quote/order process. It requires correct asset selection, next-term dates, quantities and price policy.",
        "limit": "Renewal eligibility, term overrides and pricing behavior depend on the supported configuration. Do not assume all renewals simply copy an old price or that every renewal field uses amendment delta semantics."
      },
      "entities": [
        {
          "name": "Eligible asset / current term",
          "kind": "Lifecycle input",
          "description": "The service and ending period that the customer intends to continue."
        },
        {
          "name": "Renewal quote / lines",
          "kind": "Proposed next-term transaction",
          "description": "The offered future duration, quantity and pricing context."
        },
        {
          "name": "Renewal order",
          "kind": "Committed transaction",
          "description": "The accepted renewal that must undergo supported processing."
        },
        {
          "name": "Next-term state",
          "kind": "Lifecycle result",
          "description": "Effective service information for the subsequent period."
        },
        {
          "name": "Negotiated price / renewal policy",
          "kind": "Commercial inputs",
          "description": "Defines whether and how prior or newly agreed pricing applies."
        }
      ],
      "sections": [
        {
          "title": "Renewal intent includes a time boundary",
          "body": "The key distinction is continuation into a later period. Identify exactly which assets are eligible and where the current service period ends under the org’s date conventions. The next term should match the agreed start/end with no accidental gap or overlap. Extending a date on the historical quote does not itself create the supported renewed transaction and lifecycle evidence."
        },
        {
          "title": "Renewal quantity and price are deliberate decisions",
          "body": "The customer may renew at a different quantity or rate. Understand the quantity semantics on the actual renewal screen rather than copying a positive delta from an amendment exercise. Check selected selling model, term, price agreement and applicable eligibility. A new contract price should not be assumed to override without configured context/procedure behavior, and an old price should not be assumed valid forever."
        },
        {
          "title": "Interaction with current and scheduled changes",
          "body": "A customer can request an immediate seat increase and a later renewal. Those are different effective periods and transaction intents. Evaluate supported sequencing and existing future changes so the new transaction does not unintentionally omit, duplicate or override them. Acceptance includes current/history views, future state and billing schedule behavior, not just an extended end date on a screen."
        }
      ],
      "walkthrough": [
        {
          "title": "Current term",
          "body": "Northstar has 10 seats through the agreed annual boundary."
        },
        {
          "title": "New offer",
          "body": "The renewal offers 12 seats for the next 12 months using the applicable commercial policy; 12 is not blindly treated as +12."
        },
        {
          "title": "Completion",
          "body": "After supported order processing, inspect the future term and continuity while preserving the old period and its source transaction."
        }
      ],
      "sources": [
        "manage-customer-asset-renewals-and-cancellations",
        "configure-contract-based-pricing"
      ]
    },
    "assets-cancel": {
      "simple": {
        "analogy": "Canceling a club membership stops future access under the agreement. It does not erase the months you used, and it does not by itself put money back in your bank account.",
        "translation": "Cancellation changes the managed service lifecycle at the effective date. Billing adjustments, credits and refunds are separate consequences determined by contract, policy, prior invoicing and payments.",
        "limit": "There is no universal “cancel equals refund” rule. Some charges can remain valid, fees may apply and unused prepaid service may have a different policy from arrears charges."
      },
      "entities": [
        {
          "name": "Cancellation quote/order",
          "kind": "Lifecycle transaction",
          "description": "The supported requested/committed end or reduction of service."
        },
        {
          "name": "Effective asset state/history",
          "kind": "Entitlement evidence",
          "description": "Shows when access/service ends while preserving earlier periods."
        },
        {
          "name": "Billing schedule",
          "kind": "Planned billing evidence",
          "description": "Future eligible charges that may need supported adjustment as part of processing."
        },
        {
          "name": "Credit memo",
          "kind": "Financial adjustment",
          "description": "Reduces an applicable invoiced obligation according to policy."
        },
        {
          "name": "Refund",
          "kind": "Cash-return transaction",
          "description": "Returns funds through the separate authorized payment process where appropriate."
        }
      ],
      "sections": [
        {
          "title": "Service effect comes first, but is not the whole outcome",
          "body": "Identify the asset, applicable quantity and effective date, then use the supported cancellation process. Preserve historical service: a service that ended today still existed last month. Validate whether the requested operation ends all service or affects only a supported portion. The resulting lifecycle state should agree with the actual business end, not with whichever invoice date is easiest to edit."
        },
        {
          "title": "Prepaid and arrears cases can differ",
          "body": "If the customer already paid for unused future service, policy may allow a credit and later refund or account application. If billing is in arrears, service already delivered may still be owed even after cancellation. Future schedules and posted invoices require different treatment. The existence of a canceled asset cannot determine all these amounts without the date, charge and settlement history."
        },
        {
          "title": "Credit is not money returned",
          "body": "A credit changes an obligation or eligible account balance through its supported allocation. A refund is a separately authorized transaction moving previously received funds. Check each record and status rather than announcing a refund when only a credit was created. Reconcile partial failures: the service can be canceled successfully even while a financial adjustment or refund remains unresolved."
        }
      ],
      "walkthrough": [
        {
          "title": "Service",
          "body": "Northstar cancels from the agreed date; earlier entitlement periods remain intact."
        },
        {
          "title": "Finance",
          "body": "Under this example policy, an unused prepaid portion qualifies for a 30 credit. Verify its allocation against the relevant financial obligation."
        },
        {
          "title": "Cash",
          "body": "If 30 should actually be returned, inspect the authorized refund and payment/gateway reconciliation. A credit record alone is not proof the customer received funds."
        }
      ],
      "sources": [
        "manage-customer-asset-renewals-and-cancellations",
        "navigate-the-full-billing-lifecycle"
      ]
    },
    "invoice-policy": {
      "simple": {
        "analogy": "A school charges 120 for a trip. The price is one decision. Asking for 30 now and 90 after confirmation is another. Giving families 30 days to pay each bill is a third. Changing the payment deadline does not change the trip’s price.",
        "translation": "Pricing sets the commercial amount. Billing policy/treatments and supported schedules determine billability and invoicing behavior. Billing profiles, legal/tax setup and payment terms supply customer, issuer, calculation and due-date context.",
        "limit": "These layers interact through the supported billing model; they are not independent spreadsheets or a guarantee that every requested allocation is available without the appropriate capability."
      },
      "entities": [
        {
          "name": "Billing policy",
          "kind": "Billing configuration",
          "description": "Defines applicable billability and supported billing behavior for the offering."
        },
        {
          "name": "Billing treatment / treatment item",
          "kind": "Billing configuration/data",
          "description": "Describes how the applicable charge is treated/allocated for invoicing, including supported milestone behavior."
        },
        {
          "name": "Billing profile",
          "kind": "Customer billing data",
          "description": "Bill-to address/contact, payment terms and relevant preferences."
        },
        {
          "name": "Legal entity / tax setup",
          "kind": "Organization and tax configuration",
          "description": "Identifies the invoicing organization and applicable tax process/context."
        },
        {
          "name": "Payment terms",
          "kind": "Due-date configuration",
          "description": "Determines when payment is due under the invoice terms, not when the service is provided."
        }
      ],
      "sections": [
        {
          "title": "Start with the commercial charge",
          "body": "A product price and its negotiated adjustments determine what the customer has agreed to pay before the relevant tax and later financial adjustments. Billing should not fabricate a different commercial price merely to achieve a payment schedule. For example, representing only the first milestone as the product’s entire price loses the rest of the agreed value and makes subsequent lifecycle changes difficult to reconcile."
        },
        {
          "title": "Then define invoice eligibility and allocation",
          "body": "Whether a charge is billable, whether it is invoiced in advance/arrears and whether supported milestone allocations apply belong to the billing design. A treatment/allocation needs clear triggering evidence and amounts/percentages. For milestones, the configured allocations should reconcile to the intended charge; they should not accidentally total 120% or omit the final 10%. Tax and legal context must be applied through the appropriate configured process."
        },
        {
          "title": "Finally define the recipient and due date",
          "body": "The customer’s billing profile supplies the relevant billing preferences, while legal-entity and tax configuration identify issuer/jurisdiction context. Payment terms define the due timing for generated invoices. These do not select a subscription duration or determine whether an uncompleted milestone is invoiceable. A billing profile that is correct today also does not prove every existing posted invoice should be recalculated retroactively."
        }
      ],
      "walkthrough": [
        {
          "title": "Price",
          "body": "Northstar buys a 12000 project, before tax."
        },
        {
          "title": "Allocation",
          "body": "This example bills 25% at kickoff and 75% at acceptance: 3000 and 9000. Each milestone needs the agreed eligibility evidence."
        },
        {
          "title": "Due timing",
          "body": "Net-30 applies to each generated invoice’s payment deadline. It does not cause acceptance or make the 9000 eligible at kickoff."
        }
      ],
      "sources": [
        "explore-billing-features-and-roles",
        "generate-invoices"
      ]
    },
    "invoice-schedules": {
      "simple": {
        "analogy": "A calendar reminder saying “send a bill next month” is not the bill, and the bill is not a payment receipt. You can review the calendar before sending anything to catch an incorrect date or amount.",
        "translation": "Billing schedules represent planned invoiceable charges and dates. Schedule groups organize related schedules. Invoice preview and generation select eligible billing work; payments later settle the resulting obligation.",
        "limit": "The analogy is about stages, not a claim that billing is just a calendar. Actual eligibility, statuses, grouping, processing and amendment behavior follow the supported product configuration."
      },
      "entities": [
        {
          "name": "OrderItem / order product",
          "kind": "Committed transaction input",
          "description": "The sold line whose supported billing processing produces applicable schedules."
        },
        {
          "name": "Billing schedule",
          "kind": "Native billing record",
          "description": "Represents how relevant charge amounts are billed over time."
        },
        {
          "name": "Billing schedule group",
          "kind": "Native billing grouping",
          "description": "Organizes related schedules associated with the order-product billing model."
        },
        {
          "name": "Invoice preview",
          "kind": "Review operation/result",
          "description": "Shows expected invoice output for the selected scope without proving final posted billing."
        },
        {
          "name": "Invoice / invoice lines",
          "kind": "Financial records",
          "description": "The generated customer obligation and its charge details."
        }
      ],
      "sections": [
        {
          "title": "How a planned charge becomes an invoice",
          "body": "The transaction’s supported billing processing creates the relevant schedules based on its product, dates and billing configuration. A run then selects eligible amounts using scope/cutoff and status rules. Generated invoice lines retain the relevant connection to those charges. A successful order is therefore not the same event as an issued invoice, and a future schedule amount is not automatically current receivable."
        },
        {
          "title": "Advance, arrears and partial periods",
          "body": "Advance billing invoices before the applicable service period; arrears invoices after the applicable period under the configured rules. Service dates, eligibility dates, invoice dates and due dates can all differ legitimately. Partial starts/ends and lifecycle amendments need validation against the actual schedule behavior. Do not change a one-year product commitment to three months merely because finance wants quarterly invoices."
        },
        {
          "title": "Why preview and repeat-run checks matter",
          "body": "Preview lets finance reconcile amounts, customer/legal context, discounts, dates and excluded future items before generation. After generation, inspect invoice and schedule status/amounts so later runs do not unintentionally rebill the same obligation. Corrections and reruns need supported behavior and reconciliation; deleting a line from a visible document can leave underlying billing state wrong."
        }
      ],
      "walkthrough": [
        {
          "title": "Planned amounts",
          "body": "Northstar has 100 scheduled for June and 100 for July under this example arrangement."
        },
        {
          "title": "June run",
          "body": "The agreed cutoff should select June’s 100 only. A preview of 200 exposes a scope/date/eligibility issue before final generation."
        },
        {
          "title": "After generation",
          "body": "Inspect the June invoice and the schedules. July remains future billing work; neither schedule creation nor invoice generation proves a payment was collected."
        }
      ],
      "sources": [
        "get-started-with-billing-revenue-cloud",
        "generate-invoices",
        "explore-billing-features-and-roles"
      ]
    },
    "invoice-usage": {
      "simple": {
        "analogy": "A phone plan includes 1000 messages and charges for extras. The phone must count the right messages, recognize the allowance and apply the correct per-message rate. Receiving the same usage file twice should not mean you sent everything twice.",
        "translation": "Usage management connects measured resources/units to customer entitlements, grants or wallets, consumption records/summaries, rating and eventual billing. Each stage has a different job and evidence.",
        "limit": "An allowance or wallet is not automatically cash in a bank account. Replay protection, late usage and adjustments depend on the designed supported ingestion/rating process, not a universal automatic deduplication promise."
      },
      "entities": [
        {
          "name": "Usage resource / unit of measure",
          "kind": "Measurement model",
          "description": "Defines what is consumed and in what units, such as calls or storage."
        },
        {
          "name": "Entitlement / resource grant",
          "kind": "Commercial allowance data",
          "description": "Defines the customer’s eligible consumption rights and applicable period."
        },
        {
          "name": "Wallet",
          "kind": "Usage/commitment arrangement",
          "description": "Tracks supported consumption/credit behavior; its meaning depends on configuration."
        },
        {
          "name": "Usage record / summary",
          "kind": "Measured consumption data",
          "description": "Individual or aggregated quantities attributed to the right customer/service/time/resource."
        },
        {
          "name": "Rate / rating result",
          "kind": "Commercial calculation",
          "description": "Applies eligible pricing/rate rules to measured consumption to derive liability."
        },
        {
          "name": "Billing schedule / invoice",
          "kind": "Financial downstream records",
          "description": "Represent when eligible rated charges are planned/invoiced, distinct from raw measurement."
        }
      ],
      "sections": [
        {
          "title": "Measurement must identify the business event",
          "body": "A usage value needs the correct customer/service identity, resource, unit and timestamp/period. “1250” without units could mean calls, bytes or thousands of calls. Ingestion also needs a stable way to identify replayed or corrected events according to the integration design. Aggregating incorrect identities or units just creates a more compact wrong result."
        },
        {
          "title": "Allowance and rating determine what is chargeable",
          "body": "A grant can cover eligible usage in the applicable period. The remaining quantity is then rated under the configured rules, potentially including tiers or overage. Actual ordering/allocation behavior must follow the supported configuration. A resource grant from another service or period cannot be assumed to cover all consumption just because it belongs to the same account."
        },
        {
          "title": "Billing and reconciliation finish the chain",
          "body": "A correctly rated amount still needs the supported path into billing and invoice eligibility. Late events, corrected measurements and replayed batches require explicit handling so consumption and financial liability agree. Track the record-to-summary-to-rated-charge lineage. Do not equate usage rating with revenue recognition or assume a wallet balance alone establishes the invoice total."
        }
      ],
      "walkthrough": [
        {
          "title": "Measure",
          "body": "Northstar consumed 1250 eligible API calls during the stated period."
        },
        {
          "title": "Allow and rate",
          "body": "Under this example, 1000 are included and each extra call costs 0.02: (1250 − 1000) × 0.02 = 5 before other charges/tax."
        },
        {
          "title": "Replay",
          "body": "The same input batch is retransmitted. The designed supported process must identify/reconcile the replay rather than counting it as 1250 new calls; verify this behavior rather than assuming it."
        }
      ],
      "sources": [
        "get-to-know-usage-management",
        "set-up-and-sell-products",
        "manage-wallets-and-track-consumption"
      ]
    },
    "invoice-finance": {
      "simple": {
        "analogy": "You owe a friend 50. They forgive 8 of the debt and you pay 30. You now owe 12. The forgiven 8 is not money you paid, and a later repayment to you would be another event.",
        "translation": "An invoice establishes a billed obligation, an applied credit reduces it, a payment settles it and a refund returns funds. Allocation/application links determine how these events affect a particular outstanding balance.",
        "limit": "Real finance includes currency, tax, status, legal entities and accounting policies. The simple debt arithmetic below deliberately excludes those complexities and does not determine recognized revenue."
      },
      "entities": [
        {
          "name": "Invoice / invoice line",
          "kind": "Financial obligation",
          "description": "The amount billed and its component charges under relevant status rules."
        },
        {
          "name": "Credit memo / application",
          "kind": "Financial adjustment",
          "description": "The supported reduction allocated to the relevant obligation."
        },
        {
          "name": "Payment / application",
          "kind": "Settlement evidence",
          "description": "Funds received and how they settle invoices; received and applied need not mean the same thing."
        },
        {
          "name": "Refund",
          "kind": "Cash-return evidence",
          "description": "An authorized return of funds, including relevant processing status."
        },
        {
          "name": "Open receivable",
          "kind": "Derived balance",
          "description": "The unsettled applicable obligation as of a defined date after relevant adjustments/applications."
        },
        {
          "name": "Accounting/recognition evidence",
          "kind": "Separate finance scope",
          "description": "Records and policies establishing ledger/recognition outcomes where those capabilities are in scope."
        }
      ],
      "sections": [
        {
          "title": "Why status and application matter",
          "body": "A payment can exist without being applied to this particular invoice. A credit can be issued but allocated elsewhere or not yet completed. To compute the open amount, use the applicable successful adjustments and settlements under the actual finance model, not every record whose account happens to match. Reconcile dates and statuses when producing an as-of report."
        },
        {
          "title": "Credit, cash and refund solve different problems",
          "body": "A credit corrects/reduces an obligation according to policy; it is not an incoming payment. A payment records funds and its application settles eligible debt. A refund returns funds and must be separately authorized/processed. A cancellation can initiate relevant financial consequences without making every step instantaneous or successful. Keep failed refund processing visible even if the underlying service was correctly canceled."
        },
        {
          "title": "Receivable is not recognized revenue",
          "body": "Outstanding debt, collected cash, billed charges and accounting recognition measure different things. A paid annual invoice does not by itself describe when the related service is delivered or revenue is recognized. Financial accounting capabilities and external ledger integrations require their own policy, configuration and reconciliation. For a scenario question, identify the event actually requested rather than choosing a finance object by familiar wording."
        }
      ],
      "walkthrough": [
        {
          "title": "Invoice",
          "body": "Northstar is invoiced 500, ignoring tax and prior balances."
        },
        {
          "title": "Adjustment and settlement",
          "body": "An applied credit of 80 leaves an adjusted obligation of 420. An applied payment of 300 leaves 120 open."
        },
        {
          "title": "Interpretation",
          "body": "Collected cash in this example is 300, not 380. The open 120 is a receivable, not a proof of recognized revenue. Any subsequent refund requires separate evidence."
        }
      ],
      "sources": [
        "navigate-the-full-billing-lifecycle",
        "explore-billing-features-and-roles"
      ]
    }
  }
};
