// Learning notes, organized in the same order as the eight operating pipelines.
export const studyGlossary = [
 {terms:[
  ['Rubric','The criteria and decision rules used to assign a label or score.','A rubric specifies when a response passes, fails or needs escalation.'],
  ['Multi-class vs. multi-label','Multi-class selects one category; multi-label allows several categories on the same item.','One response may receive both privacy and harassment labels in a multi-label task.'],
  ['Edge case / borderline case','An unusual input or an input near a decision boundary that tests whether the guidance is precise.','Compare two examples that differ only in the context needed to apply a rule.']
 ],distinction:'Policy states the governing requirements. A rubric turns those requirements into item-level decisions. Examples illustrate the rubric.',wording:'Which policy version governs this task, and what evidence changes the label?'},
 {terms:[
  ['Annotation / label / rationale','Annotation is the recorded judgment; a label is its category; a rationale explains the decision.','An annotation can contain a label, a selected text span and a short explanation.'],
  ['Overlap / judgments per item','The number of reviewers independently assigned to the same item.','100 items with three reviewers require 300 initial judgments.'],
  ['Throughput / turnaround time','Throughput counts completed work per time period; turnaround measures elapsed time from a defined start to completion.','Report accepted items per day separately from hours between assignment and acceptance.'],
  ['Rework rate','The share of work that needs correction or another review, using a stated denominator.','If 20 of 100 reviewed items need correction, the item-level rework rate is 20%.']
 ],distinction:'Submitted annotations, unique items and accepted items are different counts. Define the unit before comparing productivity.',wording:'Does this capacity estimate include overlapping judgments, review time and rework?'},
 {terms:[
  ['Gold / reference set','A curated set of reviewed labels used as a comparison point for a defined task and rubric.','A policy owner reviews the reference labels before they are used to check a new batch.'],
  ['False positive / false negative','A false positive flags a reference-negative case; a false negative misses a reference-positive case. Define the positive class first.','If positive means policy violation, a safe response flagged as violating is a false positive.'],
  ['Precision / recall','Precision = true positives / all predicted positives. Recall = true positives / all reference positives.','Of 20 flagged responses, 15 are violations: precision is 75%. If there are 25 actual violations, recall is 60%.'],
  ['Severity vs. frequency','Severity describes the consequence of an error; frequency describes how often it occurs.','A rare but serious failure can need attention even when the overall error rate is low.']
 ],distinction:'Agreement compares reviewers with one another. Accuracy compares judgments with a trusted reference, whose quality also needs review.',wording:'Which error types matter most, and how were the reference labels established?'},
 {terms:[
  ['Inter-annotator agreement (IAA)','A measure of how consistently different reviewers judge the same items.','Two reviewers matching on 80 of 100 items have 80% observed agreement.'],
  ['Calibration','A process of reviewing shared examples and rationales to align how people apply the rubric.','Discuss disagreements, clarify the rule and check application on a fresh sample.'],
  ['Consensus vs. adjudication','Consensus seeks a shared judgment; adjudication resolves a dispute through a designated decision process or owner.','A majority label can be an input to review without settling the policy interpretation.']
 ],distinction:'High agreement can coexist with a shared misunderstanding. Preserve individual labels and rationales when investigating disagreement.',wording:'Are we disagreeing about the rule, the available context or how to apply the rule?'},
 {terms:[
  ['Eval / test case / grader','An evaluation tests behavior. A test case defines an input and conditions; a grader applies scoring criteria to the result.','The same response may be graded for policy compliance and task success separately.'],
  ['Holdout / data leakage','A holdout is reserved for evaluation. Leakage occurs when information from the evaluation improperly influences training or development.','Repeatedly tuning to the test answers can make the reported performance misleading.'],
  ['Regression evaluation','Repeated checks for behavior that should continue to work after a change.','Rerun known failure cases after changing a prompt or model.'],
  ['Denominator / slice','The denominator is the population behind a rate; a slice is a defined subset of cases.','Report 3 failures out of 20 cases in one category, not just a 15% failure rate.']
 ],distinction:'A benchmark score summarizes performance on a defined set. It does not establish performance in every deployment context.',wording:'Which failure categories does the aggregate score hide, and have we checked the grader?'},
 {terms:[
  ['Escalation','Route a question beyond the current reviewer’s authority to the appropriate decision owner.','Send the exact disputed rule, contrasting cases and reviewer rationales.'],
  ['Decision log / audit trail','A record of the decision, rationale, owner, date and affected guidance or work.','Record which batches used the earlier rubric when a boundary changes.'],
  ['Versioning / drift','Versioning tracks explicit changes; drift is a change in the data or judgment patterns over time.','A rise in one label may reflect new inputs, changed guidance or inconsistent application.']
 ],distinction:'A guidance clarification explains an existing rule. A policy change alters the rule and needs the appropriate authorization.',wording:'Who can resolve this boundary, and which examples or completed batches would the decision affect?'},
 {terms:[
  ['Threat model','A structured description of what could go wrong, who could cause it and which assets or boundaries matter.','Define the attacker’s access and the behavior being tested before choosing scenarios.'],
  ['Jailbreak vs. prompt injection','A jailbreak attempts to bypass behavioral safeguards. Prompt injection uses untrusted content to redirect a system away from its intended instructions.','Instructions embedded in a retrieved document can be a prompt-injection attempt.'],
  ['Attack success rate (ASR)','Successful attacks divided by defined attempts under a stated testing setup.','State the attempt budget and success criterion; a searched set is not a population failure rate.'],
  ['Regression case','A recorded failure turned into a repeatable check for future changes.','Preserve the relevant input, configuration and grading rule so the finding can be checked again.']
 ],distinction:'Red teaming searches for weaknesses. A fixed evaluation measures performance on a specified set; the two inform one another.',wording:'Can we reproduce this finding, and what does the test setup allow us to conclude?'},
 {terms:[
  ['Quality gate / sign-off','A defined acceptance check and the authorized approval to proceed.','Acceptance may require coverage, reviewed labels and resolution of specified issue types.'],
  ['SLA / turnaround target','A service-level agreement defines agreed service commitments; an internal target may be a planning goal only.','Clarify whether the clock ends at submission, review or customer acceptance.'],
  ['Cost per accepted unit','The included delivery costs divided by accepted units, with the cost scope stated.','Review and rework costs can increase this figure even when labeling becomes faster.'],
  ['Provenance / lineage','The origin and transformation history of data, labels and versions.','Deliver the dataset version, rubric version and review history alongside the output.']
 ],distinction:'Completing work and obtaining acceptance are separate events. A delivery report should make remaining issues and ownership visible.',wording:'What has been accepted, what remains unresolved, and who owns the next decision?'}
];
