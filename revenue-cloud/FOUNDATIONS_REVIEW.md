# Teaching before exercises: follow-up content review

21 October 2026. The user’s pasted Context Service lesson exposed a real gap in the preceding depth revision: it added outcomes, implementation tasks, scenarios and rubrics, but still expected learners to reason with an insufficiently taught native technical model. Salesforce and CPQ expertise does not supply prior knowledge of Context Service, native selling-model records or asset history.

## What changed

All 28 lessons now have a full explanatory chapter before the earlier recap, implementation work and assessment. The chapter teaches rather than asking the learner to perform more research or solve another question:

1. **Explain it like I'm 15:** a plain-language story, explicit translation into native terminology and a limit on the analogy.
2. **Actual objects and components:** definitions labeled by kind, distinguishing native objects, configuration records/metadata, services, UI tools, runtime values and project artifacts. An exact API object name is not implied for every descriptive label.
3. **How the technology works:** connected explanation of the problem, responsibilities, relationships and execution behavior. All lessons have at least three substantive explanatory sections; the Context Service chapter has six.
4. **Complete demonstration:** a narrated sequence with supplied inputs, actions/results and interpretation. These steps are visible, with no answer reveal needed, before the learner encounters an independent exercise.
5. **Official references:** sources supporting the model, with links for exact release/setup details. External reading supplements rather than substitutes for the on-page explanation.

`foundations.js` holds the authored chapters; `foundations-ui.js` renders them. The former short concepts are an optional recap. Within-lesson controls focus and scroll to explanatory sections or application without changing the route, storage or quiz session. Main explanations are not hidden in accordions. Existing assessment, dictionary routes, lesson IDs and progress remain intact.

## Context Service example, specifically

The new chapter introduces why a logical data abstraction exists, then distinguishes definition, node, attribute, mapping, tag, instance and instance identifier. It explains design-time versus runtime, repeated line data, hydration, consumer variable mappings, runtime update and explicit supported persistence. It explains standard/extended definitions and how to identify the actual caller/configuration.

An original Northstar example follows a custom account segment and two differently quantified quote lines. A visual representation map and conceptual populated data shape connect source records to logical structure, aliases, runtime values and pricing. Source fields and tag/node names used for teaching are labeled illustrative, not shipped API payloads or required schema. The calculation shows why typed simulation can return 540 while missing live segment hydration yields the example’s default 600. The lesson teaches the boundaries before asking the learner to diagnose them.

The explanation contains approximately 990 new narrative words for Context Service, excluding comparison/example labels and the pre-existing material. Other chapters typically add several hundred words of actual teaching; the purpose is causal explanation, not a target word count.

## Audience and precision

The intended reader knows Salesforce records, automation and CPQ commercial reasoning. The added material explains native product responsibilities and technology rather than assuming that familiarity with CPQ means familiarity with these services. Familiar analogies are followed by the professional model and its limits, so simplification does not replace accuracy.

For technical precision, the review distinguishes a label from an API name. For example, the developer object reference names the negotiated tier object **ContractItemPriceAdjTier**; the foundation chapter uses that exact name where it identifies the object. Generic UI/business labels elsewhere are marked as such. The examples do not imply universal record cardinalities, entitlement matrices, 30-day proration defaults, auto-deduplication, automatically safe retries or cancellation-triggered cash refunds.

## Sources

The existing official-unit corpus and per-lesson source mapping support the chapters. Six additional primary references were opened and added to the searchable source library, bringing it to 78:

- [Create a context definition](https://help.salesforce.com/s/articleView?id=ind.context_service_create_context_definitions.htm&language=en_US&type=5)
- [Context Service invocable actions from Flow](https://help.salesforce.com/s/articleView?id=ind.call_context_service_invocable_actions_from_flow.htm&language=en_US&type=5)
- [BRE and Context Service working together](https://trailhead.salesforce.com/content/learn/modules/automated-compliance-with-business-rules-engine-and-context-service/get-to-know-business-rules-engine-and-context-service)
- [Native transaction-management objects](https://developer.salesforce.com/docs/revenue/revenue-management/guide/quote-and-order-capture-standard-objects.html)
- [ProductSellingModelOption and its relationships](https://developer.salesforce.com/docs/revenue/revenue-management/guide/sforce-api-objects-productsellingmodeloption.html)
- [Managed asset data model](https://developer.salesforce.com/docs/platform/data-models/guide/transaction-management-asset.html)

The two Context Service Basics units were also reopened. Current documentation may include capabilities newer than the exam guide’s stated Summer ’25 baseline. The chapters do not claim that every current feature is examined or available in every org. The previously disclosed inaccessible general setup/license source bodies remain disclosed; these new references do not retrospectively resolve that limitation.

## Verification and limitations

No questions were added in this revision. All 112 question objects and the compatibility version are unchanged. Lesson/source revisions are tracked separately from the question bank. Existing reasoning drafts, timed attempts, original deadlines, notes and checks continue to use their existing contracts.

`tests/revenue-foundations.cjs` checks every lesson’s teaching route, visible instruction before retrieval, source integrity, object/component definitions, complete examples, the context representation trace and read-only section navigation. It checks dictionary links in technical explanations while keeping stories and conceptual data unannotated. Representative technical chapters are tested at 320/390/768/1280 pixels, with expanded content, increased text spacing and axe accessibility checks. Existing study, learning and dictionary suites check persistence, assessment and tooltip/history behavior. An enlarged-text overflow in a long custom field name was found and fixed by allowing the explanatory chapter’s text to wrap.

The improvement addresses insufficient teaching before practice; it does not establish exhaustive exam sufficiency or measured learner outcomes. No authenticated Salesforce implementation was performed. Exact setup and hands-on acceptance still require the appropriate official training org and supported release documentation.
