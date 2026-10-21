# Exam coverage and learning-depth audit

Reviewed 21 October 2026 for Salesforce experts who know managed-package CPQ well and are new to native Revenue Management. This is an editorial audit, not an official Salesforce assessment or evidence of learner exam outcomes.

## Verdict

The previous guide covered the seven domain headings but was too shallow to treat as a standalone preparation curriculum. Its core concept explanations were approximately 75–108 words per lesson. Good introductory distinctions were present, but several objectives that say **configure** or **implement** were represented mostly by descriptions and generic design tasks. The earlier “I can explain this” checks were measures of confidence, not validated comprehension. Some original distractors were easy to reject without knowing the native product.

The revision gives every published objective an explicit learning route, deeper native instruction, application practice and acceptance evidence. It provides a substantially stronger study companion. It still requires the linked official instruction and actual org practice; objective mapping cannot establish that every possible exam detail is present. Passing a repeated local quiz is not equivalent to passing an unfamiliar exam.

## Exam scope verified

The [official exam guide](https://help.salesforce.com/s/articleView?id=005298978&language=en_US&type=1), reopened on 21 October, lists seven domains and 19 objective statements. It still lists Summer ’25 alignment, 60 scored questions, up to five unscored questions, 105 minutes, 63% passing and no prerequisite. Product units may include newer features. The audit preserves that distinction instead of inventing a later exam release.

The objective titles in the application are paraphrases. Weights are the official domain weights; objective counts are not question counts. `learning.js` is the canonical 19-objective-to-lesson/evidence map. `#coverage` presents it with actual self-check and question-attempt counts, explicitly without an automatic mastery claim.

## Material gaps and changes

| Area | Previous gap | Added instruction and evidence |
|---|---|---|
| Platform | Record names and services without a sufficiently concrete execution trace | Record-responsibility reference; hydration/mapping/tag/persistence diagnosis; tool-selection reference; actual persona/page/Flow assignment sequence; reporting grain, KPI and visibility cases |
| Readiness | High-level project advice without observable readiness gates | Capability/access matrix, badge-specific indexing/sync/table prerequisites, scoped end-to-end slice, decision owners, acceptance criteria, dependency deployment, recovery and migration servicing tests |
| Catalog | Concepts without enough separation of discovery, reuse and runtime behavior | Catalog/category versus classification/attribute responsibilities, qualification checks, component default/required/editability cases, context overrides and selling-model/price-entry setup sequence |
| CPQ | Too many advanced mechanisms compressed into a short summary | Assigned/activated configurator flow chain; rule validation; ordered waterfall arithmetic; advanced mechanism decision reference; source discovery, contract precedence and subscription multiplier examples; manual/agent parity tests |
| Contracts/orders | Description without enough lifecycle and execution evidence | Contract type/state/template/clause/version/approval design; commercial-to-technical output mapping; workspace, task types, scope and dependencies; integration timeout/reconciliation recovery |
| Assets | Lifecycle definitions without sufficient temporal and arithmetic transfer | State/event/source reference; effective-date timeline; delta-versus-total worked amendments; quote/order processing gates; separate renewal and cancellation cases; billing versus cash consequences |
| Invoices | Billing vocabulary without a sufficiently complete allocation and reconciliation chain | Requirement-to-configuration reference; milestone allocations and due terms; schedule eligibility/cutoff examples; usage allowance/rate/unit arithmetic and duplicate controls; invoice/credit/payment/refund reconciliation |

All 28 existing lesson IDs and dictionary links remain stable. Each receives an explicit outcome, expanded explanation, implementation sequence, worked example, a different scenario to solve, a reasoning rubric and hands-on acceptance evidence. Eight responsive references support comparisons. Existing lesson sources apply to the added explanations; exact UI instructions and capability prerequisites remain with the linked official units.

## Pedagogical design

**Use prior knowledge without assuming product familiarity.** The CPQ contrast remains an entry point, followed by the native record/service responsible for the requirement. The guide does not reteach generic Salesforce administration; it explains where native Revenue Management changes the implementation decision.

**Move from explanation to independent reasoning.** Each lesson uses a worked example followed by a different case. The answer rubric is closed initially. Learners write a locally saved explanation before revealing it, compare the causal reasoning, correct omissions, and retry later. This is self-assessed retrieval, not AI marking. Dictionary links support explanatory text and revealed rubrics; they do not add hints to quiz options/stems or independent retrieval prompts.

**Make implementation evidence observable.** Acceptance criteria name the record, trace, interval, amount or denied action to inspect. A design can be completed on paper while a hands-on check remains open. “Saved quote” and “processed asset change,” “preview” and “invoice,” and “credit” and “refund” are deliberately separated.

**Test plausible alternatives and transfer.** The bank adds 28 original transfer questions, one per lesson. They use near-miss native designs, quantities, dates, precedence, execution identities and evidence boundaries. A separate 14-question transfer mode samples two per domain from these additions; standard diagnostic/domain/mock modes can use the full 112-question bank. Feedback explains each alternative. The original easier questions remain useful for foundations, and the finite-bank limitation is explicit.

**Connect the lifecycle.** The eight-stage Northstar capstone moves from catalog and context through price, quote, contracts/orders, asset changes, billing and release readiness. Its prompts require a proposed design and predicted results before opening the reasoning. The 60–90 minute estimate is for a paper design, not a promise to configure a whole implementation in that time.

**Use delayed retrieval and calibration.** The learning-method panel suggests revisiting without notes the next day, around three days later and a week later, with a changed input selected by a colleague. Those intervals are an editorial starting schedule, not an empirically optimal prescription or an automated reminder feature. The interface distinguishes self-checks, hands-on evidence and question accuracy.

The design follows general recommendations on spaced review, alternating worked examples with independent problems, and explanatory retrieval in the [Institute of Education Sciences practice guide](https://ies.ed.gov/ncee/wwc/PracticeGuide/1). That research is a rationale for the design; it does not validate this particular website, audience or Salesforce exam outcomes.

## Source and precision controls

The existing official-unit research corpus spans 58 Trailhead units. During this revision, detailed unit text was revisited for procedure inputs/outputs, configurator assignment/setup, amendment delta semantics, advanced pricing, orchestration and billing. The exam guide and selected current units (classifications, amendments, discounts, subscription/proration and billing features) were reopened through the research browser on 21 October. This does not imply every linked page was independently revalidated on that date.

Important implementation details are anchored to these official resources:

- [Configurator Flow and assignment](https://trailhead.salesforce.com/content/learn/modules/product-configuration-with-revenue-cloud/create-and-configure-a-product-configurator-flow)
- [Pricing procedure setup and mappings](https://trailhead.salesforce.com/content/learn/modules/price-management-with-revenue-cloud/create-a-pricing-procedure-with-the-list-price-element)
- [Derived pricing](https://trailhead.salesforce.com/content/learn/modules/advanced-price-management-with-revenue-cloud/implement-derived-pricing) and [contract-based pricing](https://trailhead.salesforce.com/content/learn/modules/advanced-price-management-with-revenue-cloud/configure-contract-based-pricing)
- [Subscription pricing and proration](https://trailhead.salesforce.com/content/learn/modules/advanced-price-management-with-revenue-cloud/set-up-subscription-pricing-with-proration)
- [Amendment start/delta/end quantities and order path](https://trailhead.salesforce.com/content/learn/modules/asset-lifecycle-management-with-revenue-cloud/manage-customer-asset-amendments)
- [Orchestration workspace and steps](https://trailhead.salesforce.com/content/learn/modules/complex-order-decomposition-and-orchestration-with-revenue-cloud/design-an-orchestration-plan)
- [Billing responsibilities](https://trailhead.salesforce.com/content/learn/modules/billing-basics-in-revenue-cloud/explore-billing-features-and-roles)

Worked numbers are original examples. The 30-day proration calculation explicitly states a teaching convention; it is not a universal claim about native policy. Date boundaries, licensing and supported pricing combinations must be verified in the target org/current documentation. The existing setup/license Help references whose bodies did not render retain their disclosed limitations. No exact entitlement matrix is inferred from them.

## Persistence and verification

The additive release preserves all 84 earlier question objects, IDs, option indices and correct sets, and deliberately retains the bank compatibility version. `contentRevision` identifies the expanded content independently. Legacy active mocks retain answers, ordering, flags and original deadlines. New `retrieval` drafts are validated against known lesson IDs plus `capstone`, limited to 4000 characters each, escaped at rendering and included in study backups. Companion storage is separate.

Verification includes the existing study, mobile and dictionary suites plus `tests/revenue-learning.cjs`: all objective/lesson/source links, all 28 expanded routes, hidden rubrics, legacy progress preservation, draft persistence/escaping, backup round trips, balanced transfer sampling, exact-set scoring, feedback/resume and expanded layouts at 320/390/768/1280 pixels. Accessibility checks use axe with WCAG A/AA and 2.1 AA rules, plus enlarged text spacing and reflow checks. Browser automation does not substitute for physical-device testing or executing exercises in an authenticated Salesforce org.

## Remaining preparation obligations

Complete the official units and their required training-org exercises; retain the acceptance evidence. Resolve current setup/licensing and supported-feature questions for the actual org. Ask a colleague to vary inputs or pose an unfamiliar case. Recheck the official guide before registering. No learners have yet been observed using this revision through an exam, so effectiveness and pass-rate claims would be unsupported.
