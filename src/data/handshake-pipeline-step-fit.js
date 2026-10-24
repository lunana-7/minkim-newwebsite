// Past-work evidence and prospective learning priorities, aligned to displayed steps.
export const pipelineStepFit = [
 [
  ['Krafton · AI tool intake','Clarified use context and risk-based review routes.','Project safety policies and scope boundaries.','ai-tool-intake'],
  ['Krafton · Classification review','Analyzed category gaps across 800+ approval requests.','Safety taxonomies and ambiguous-label rules.','spendgate-impact-review'],
  ['Krafton · AI use guidance','Wrote context-specific guidance for AI use.','Positive, negative and borderline annotation examples.','ai-use-guidelines'],
  ['Krafton · Workshop & playbook','Taught colleagues with worked examples and office hours.','Reviewer calibration and agreement measures.','slack-automation-workshop'],
  ['Krafton · Workflow analysis','Compared outcomes using matched review windows.','Annotation tooling, audit sampling and severity checks.','spendgate-impact-review']
 ],
 [
  ['Pacvue · Product enablement','Reviewed onboarding and actual-usage measures.','Contributor screening and task-readiness criteria.','chatgpt-ads-enablement'],
  ['Krafton · Multilingual survey','Coordinated instructions and participation in three languages.','Project onboarding and reviewer calibration.','enterprise-ai-survey'],
  ['Krafton · Operating charter','Defined workstream ownership and reporting cadence.','Batch allocation, task access and availability planning.','finops-operating-charter'],
  ['Pacvue · Weekly reporting','Reconciled reporting definitions and open source questions.','Accepted throughput, rework and reviewer capacity.','weekly-performance-review'],
  ['Krafton · Committee operations','Coordinated review materials and committee action items.','Contributor support and delivery escalation procedures.','ai-safety-committee']
 ],
 [
  ['Krafton · Survey analysis','Structured multilingual records and comparable categories.','Annotation record schemas and missing-data checks.','ai-survey-analysis'],
  ['Krafton · Impact review','Used matched windows and examined classification coverage.','Risk-based sampling and rare-error coverage.','spendgate-impact-review'],
  ['Krafton · Reliability criteria','Defined evidence for reliability decisions.','Reference-label validation and severity-weighted QA.','software-reliability-levels']
 ],
 [
  ['Krafton · Survey analysis','Preserved language differences while organizing responses.','Independent annotation and rationale capture.','ai-survey-analysis'],
  ['Krafton · Classification review','Distinguished ambiguous requests from category gaps.','Agreement versus correctness and policy-grounded adjudication.','spendgate-impact-review']
 ],
 [
  ['Krafton · Evaluation framework','Defined task-specific comparison measures.','Safety objectives, harm categories and evaluation limits.','model-value-framework'],
  ['Human–AI research','Contributed rules and information states across 30+ conditions.','Representative safety cases and held-out evaluation design.',null],
  ['Human–AI research','Compared 10+ model candidates and investigated inconsistent runs.','Reproducible safety runs and sensitive-data handling.',null],
  ['Krafton · Model comparison','Deployed an interface for inspecting model comparison evidence.','Human grading rubrics and automated-grader validation.','ai-model-matrix'],
  ['Krafton · Automation analysis','Refined categories across 2k+ multilingual cases.','False positives, false negatives and category-level safety metrics.','ai-survey-analysis']
 ],
 [
  ['Krafton · Approval analysis','Identified unresolved workflow issues in approval records.','Capturing sensitive edge cases with sufficient context.','ax-spend-gate'],
  ['Krafton · Classification review','Separated category coverage gaps from ambiguous requests.','Clustering safety-policy ambiguity and recurring disagreements.','spendgate-impact-review'],
  ['Krafton · AI use guidance','Explained how review needs change with use context.','Policy-boundary examples and exception documentation.','ai-use-guidelines'],
  ['Krafton · Committee operations','Prepared policy research and coordinated functional review.','Authorized adjudication routes and decision logging.','ai-safety-committee'],
  ['Krafton · Workflow improvements','Developed guidance and notification wording from review findings.','Rubric versioning and post-change calibration.','ax-spend-gate']
 ],
 [
  ['Krafton · Governance framework','Connected risk boundaries with lifecycle and decision owners.','Authorized red-team scope and stop conditions.','ai-four-layer-framework'],
  ['Human–AI research','Designed conditions to examine changes in model behavior.','Adversarial safety scenario design with specialist supervision.',null],
  ['Human–AI research','Investigated prompt, information-state and rule effects.','Controlled testing, logging and sensitive-content procedures.',null],
  ['Krafton · Classification analysis','Examined ambiguous cases and coverage gaps.','Failure reproduction, severity and red-team evidence standards.','spendgate-impact-review'],
  ['Krafton · Measurement design','Defined comparison criteria and their limitations.','Turning validated failures into regression cases.','model-value-framework']
 ],
 [
  ['Krafton · Requirements intake','Turned fragmented requests into clear review inputs.','Lab acceptance criteria and dataset delivery requirements.','ai-tool-intake'],
  ['Krafton · Cost forecasts','Made resource assumptions and scenarios explicit.','Annotation capacity, rework costs and delivery economics.','ai-budget-forecast'],
  ['Pacvue · Executive dashboard','Built progress views with KPI definitions and follow-up needs.','Annotation launch monitoring and quality gates.','six-for-26-dashboard'],
  ['Krafton · Cost reporting','Separated observed costs from projected savings.','Quality, timing and scope trade-offs with delivery owners.','q2-ai-cost-report'],
  ['Pacvue · Product dashboards','Delivered dashboards with refresh guidance and handover structure.','Dataset acceptance, correction review and retrospectives.','prodcomm-growth-dashboard']
 ]
];
export const pipelineDecisionFit = {
 2:['Krafton · Impact review','Made comparison limits and unresolved classification issues visible.','Batch acceptance thresholds and corrective-review procedures.','spendgate-impact-review'],
 3:['Krafton · Committee operations','Prepared decision materials and coordinated functional review.','Adjudicator authority, rationale records and recalibration.','ai-safety-committee']
};

// Proposed actions, aligned with the visible workflow steps.
export const pipelineStepActions = [
 [
  'Confirm the policy version, intended use and acceptance criteria with the project owner.',
  'Write label definitions and escalation rules; have the policy owner resolve unclear boundaries.',
  'Prepare contrasting examples with rationales and get them reviewed before rollout.',
  'Coordinate a shared review sample, compare rationales and record approved clarifications.',
  'Track review quality by category and route recurring errors into corrective review.'
 ],
 [
  'Match task requirements to contributor expertise and confirm readiness with operations.',
  'Coordinate access, instructions and a practice sample; resolve onboarding questions.',
  'Organize assignments around availability, task difficulty and required independent judgments.',
  'Track accepted work, turnaround and rework together to identify delivery risks early.',
  'Bring capacity or quality issues to the owner with evidence and practical options.'
 ],
 [
  'Check that submissions include task IDs, rubric versions and required rationales.',
  'Agree on category and risk coverage with the quality owner before drawing a sample.',
  'Record mismatches against reviewed references and separate errors from unresolved cases.'
 ],
 [
  'Keep each reviewer’s label, rationale and guidance version available for comparison.',
  'Group disagreements by cause and bring representative examples to the review owner.'
 ],
 [
  'Clarify the target behavior, policy boundary and evaluation question with the lead.',
  'Help organize ordinary, borderline and challenging cases against a coverage plan.',
  'Coordinate run settings and preserve model, prompt and case versions for reproducibility.',
  'Apply approved grading guidance within my assigned scope and escalate uncertain judgments.',
  'Summarize failures by category with denominators, examples and follow-up questions.'
 ],
 [
  'Collect recurring questions with the exact policy wording and relevant case context.',
  'Group cases by the unresolved boundary and distinguish missing context from a policy gap.',
  'Prepare contrasting cases that show which facts change the proposed judgment.',
  'Send a focused question to the authorized owner and track its resolution.',
  'Publish approved changes with version notes and coordinate a fresh calibration sample.'
 ],
 [
  'Confirm authorized targets, methods, access limits and stop conditions with the specialist lead.',
  'Help translate known risk areas into reviewable scenarios under specialist guidance.',
  'Support controlled runs and capture reproducible evidence within the approved scope.',
  'Organize findings and reproduction details for specialist validation and severity review.',
  'Prepare validated cases for the evaluation owner to consider as regression coverage.'
 ],
 [
  'Record the agreed deliverables, quality criteria and unresolved scope questions.',
  'Estimate work and review effort with operations, making rework assumptions explicit.',
  'Keep progress, quality issues and accountable owners visible in delivery updates.',
  'Present timing, quality and cost options to the owner and track the agreed decision.',
  'Coordinate acceptance checks, document limitations and turn feedback into next actions.'
 ]
];
export const pipelineDecisionActions = {
 2:'Present the QA evidence to the authorized owner, track the batch decision and coordinate corrective review when required.',
 3:'Route disputed cases to the authorized adjudicator, record the rationale and coordinate approved guidance updates.'
};
