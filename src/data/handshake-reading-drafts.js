// Draft reflections for Min to review and personalize; no reading is marked complete by default.
const reflections = {
 'afterquery-human-data':['Understand why expert judgment remains valuable as training workflows become more automated.', 'I would distinguish the quantity of submitted work from the usefulness of the signal it produces. The article makes me ask whether a task, rubric or automated check rewards the behavior the lab actually wants. For a Safety SPA, I would connect that question to expert matching, reviewer guidance, quality checks and accepted delivery.'],
 company: ['Understand the human workflow behind Handshake AI’s service.', 'I see contributor support as part of the quality system. A strong domain expert can still produce inconsistent judgments when task expectations or escalation paths are unclear.'],
 behavior: ['Practice translating a behavior policy into a defensible case decision.', 'The distinction I want to explain is between recognizing a sensitive subject and deciding whether a particular response crosses a policy boundary. Context, requested assistance and applicable exceptions need to appear in the rationale.'],
 usage: ['Learn to distinguish service-use restrictions from response-level evaluation.', 'Before labeling a case, I would establish what is being assessed: the use case, the assistant’s answer or compliance with a project rubric. Mixing those questions can create disagreement that better training alone will not fix.'],
 evaluation: ['Learn how to scope an evaluation that supports an actual decision.', 'I would begin with the decision the evaluation must support and work backward to cases, criteria and acceptance conditions. Otherwise a detailed score can answer a different question from the one the customer intended.'],
 agreement: ['Understand how to investigate disagreement without jumping to a performance conclusion.', 'I would treat a disagreement cluster as a diagnostic queue. Comparing the cases and rationales can show whether we need missing context, a clearer example, a policy decision or individual feedback.'],
 metrics: ['Be able to explain which errors an aggregate metric hides.', 'I want to make the positive class and denominator explicit. A high overall accuracy can coexist with poor detection of rare violations, so I would inspect error direction and category-level results before recommending an action.'],
 'agent-evals': ['Understand how task design, execution evidence and grading interact.', 'The first question after a failed result should be what failed. I would distinguish the agent’s action from a broken environment, missing evidence or a grader that checks the wrong property.'],
 sql: ['Prepare to turn operational questions into reproducible analysis.', 'I would establish what one row represents and verify join cardinality before calculating a rate. A task with multiple review events should not accidentally become several independent examples.'],
 datasheets: ['Learn what needs to accompany a labeled dataset at delivery.', 'I see documentation as part of the handoff. A customer needs to understand selection, labels, review decisions and exclusions to judge whether the dataset fits its intended use.'],
 'model-cards': ['Learn to communicate the conditions under which a model result is meaningful.', 'I would present a result together with the version, intended use and evaluated conditions. Where coverage is limited, the claim should stay limited too.'],
 'agreement-survey': ['Build a more precise vocabulary for reviewer reliability.', 'I would choose an agreement statistic after understanding the annotation design. Rater assignment, missing labels and category balance affect what a coefficient can tell us; I would also keep consistency separate from correctness.'],
 helm: ['Understand evaluation as a comparison across several relevant dimensions.', 'I would avoid assuming that the highest overall score is the best operating choice. The decision may depend on robustness, coverage, efficiency or a particular failure slice.'],
 xstest: ['Include unnecessary refusal in my understanding of safety quality.', 'A useful safety evaluation needs benign contrasts as well as unsafe cases. I would look for models that react to a keyword rather than interpreting the actual request.'],
 harmbench: ['Learn what makes an adversarial finding reproducible and comparable.', 'I would ask for the target version, permitted methods, attempt budget and success definition before interpreting a red-team result. The scope of the claim needs to match the scope of the test.'],
 instructgpt: ['Understand what different forms of human feedback are used for.', 'A demonstration, a preference and a policy-compliance label are distinct signals. I would clarify the intended downstream use before asking reviewers to produce one of them.'],
 dpo: ['Understand why preference quality matters across different training approaches.', 'A simpler training objective does not make an ambiguous comparison useful. Reviewers still need to know which property they are ranking and how to handle a genuine trade-off.'],
 'constitutional-ai': ['Understand how human choices remain present in automated feedback.', 'I would inspect the principles and judging instructions behind an automated evaluator. Automating individual judgments makes it especially useful to test whether the same blind spot is repeated across many cases.'],
 'nist-genai': ['Connect evaluation work with a broader risk-management process.', 'An evaluation finding should reach an owner who can make a decision. I would connect the evidence to the affected use, mitigation options and a follow-up measure rather than stopping at a report.'],
 'model-collapse': ['Think critically about generated data and coverage.', 'Fluent examples can still omit rare cases. I would ask about provenance, filtering and distribution coverage, then validate fitness for the intended use rather than assuming generated data is either always useful or always unreliable.'],
 'data-statements': ['Understand what multilingual evaluation does and does not represent.', 'Translation alone does not establish local relevance. I would ask which language varieties, populations and communication contexts are represented, and make limits on generalization explicit.'],
 'handshake-water': ['Understand Handshake’s data-centric research perspective.', 'My interpretation is that the value of human data depends on how tasks, expertise and review are organized. I would want to understand the intended signal and retain enough context to make that signal usable.'],
 'handshake-expertise': ['Understand how Handshake describes the role of expert judgment.', 'The operational task is to help specialists express judgments that others can inspect and apply. I would connect expertise with clear criteria, evidence and a way to resolve uncertainty.'],
 'handshake-gandalf': ['Study a concrete example of Handshake’s evaluation research.', 'I would ask what a grader can actually observe. If correctness depends on a workbook, file or tool state, a transcript-only judgment may miss the evidence needed to assess it.'],
 'handshake-project-matching': ['Understand the difference between matching, readiness and active capacity.', 'For planning purposes, I would distinguish an eligible profile from an onboarded contributor who can work on the actual task. That makes bottlenecks and delivery assumptions easier to discuss.'],
 'handshake-fellow-journey': ['Understand the contributor journey before coordinating project work.', 'Each stage needs a clear next action and ownership. An invitation, selection decision and approval to start tasking should be understandable as different states.'],
 'handshake-project-start': ['Learn how onboarding establishes task expectations.', 'Access is only one part of readiness. I would check that contributors can use the tools, interpret example work and ask questions before unclear assumptions spread through a batch.'],
 'handshake-platform-work': ['Understand where work happens and how issues are routed.', 'A missing assignment, a broken tool and an unclear criterion need different owners. I would capture the expected behavior and evidence before sending the issue to the right support route.'],
 'handshake-account-integrity': ['Understand the role of attribution and authorized access.', 'Knowing who performed a task is part of work integrity, while label correctness needs its own checks. I would preserve attribution and use the approved route for account concerns.'],
 'gemini-policy': ['Compare another model builder’s output guidelines with the policy concepts I am studying.', 'I would read a Gemini case against Gemini’s stated guidelines and context. Similar topic names across vendors do not establish identical boundaries or exceptions.'],
 'gemini-filters': ['Understand what a safety filter result can and cannot establish.', 'I would separate the rating, the filtering decision and the response the user actually sees. An estimated probability is also different from the severity of a possible consequence.'],
 'google-use-policy': ['Compare product behavior rules with restrictions on use.', 'A response can look acceptable in isolation while serving a prohibited use. I would make the applicable service and intended use explicit before assigning the case to a policy category.'],
 'deepmind-frontier': ['Understand how capability evaluation can inform governance decisions.', 'I would distinguish a frontier capability concern from an individual response-policy violation. Both require evidence, but their thresholds, owners and consequences can differ.'],
 'meta-llama-guard': ['Understand the taxonomy behind an automated safeguard.', 'Before interpreting a mismatch, I would compare the classifier categories with the project rubric. Different definitions can create apparent model errors that are really mapping problems.'],
 'meta-cyberseceval': ['Learn how a security evaluation defines its threat model.', 'I would keep the tested actor, environment and behavior visible in the result. A system passing one security test does not establish protection against every other threat.'],
 'palantir-evals': ['Understand how an enterprise platform structures repeatable workflow evaluation.', 'A comparison needs stable test cases and explicit evaluator versions. I would look at case-level changes and run variability to distinguish an improvement from a changed measurement setup.'],
 'palantir-governance': ['Connect governance principles with controls in an operating workflow.', 'A human checkpoint needs evidence and real authority to be meaningful. I would specify what the reviewer sees, what decision is required and how intervention is recorded.'],
 'scale-seal': ['Understand how an evaluation provider connects research, tools and human review.', 'I would assess a rater-assistance tool by its effect on judgments, not only speed. It could reduce effort while still reinforcing a shared misunderstanding.'],
 'scale-test-vision': ['Understand how evaluation and red teaming support different decisions.', 'I would confirm whether the project measures known performance, searches for new weaknesses or tests a mitigation. That choice changes staffing, methods and how findings should be interpreted.']
};
const experienceByCategory = {
 'Company understanding':'I coordinated multilingual survey communications and translated enterprise AI workflow friction into clearer guidance and executive decision materials.',
 'Safety policy':'I drafted enterprise AI use guidelines and adoption criteria covering internal use, production assets, IP transfers and user data, and designed review paths across AI oversight, Legal, Security and business units.',
 'Evaluation design':'I contributed to human–AI research across 10+ model candidates and 30+ experimental conditions, specifying rules and diagnosing information-state, prompt and rule issues.',
 'Labeling quality':'I analyzed 800+ approval requests, separated classifier coverage gaps from genuine ambiguity, and turned recurring issues into guidance recommendations.',
 'Operations & analysis':'I processed 2k+ multilingual automation cases in Python and built dashboards with explicit task, workflow and organizational measures. My earlier research work also included a shared MySQL database.',
 'Dataset documentation':'I reconciled multilingual records, refined categories and documented measurement limitations across 2k+ automation cases.',
 'Human feedback & training':'My human–AI research experience involved defining scenarios, observable constraints and expected behavior. This gives me a foundation for asking whether feedback captures the intended signal.',
 'Risk & governance':'I designed governance responsibilities and proposed controls linking agent and API use to purpose, ownership, access and lifecycle review.'
};
export const noteFieldLabels = {
 why:'Why I chose this reading',
 learned:'My takeaway and reflection',
 experience:'Connection to my experience',
 apply:'How I would apply it in the role',
 pitch:'How I would explain it in the interview',
 question:'Question I want to discuss'
};
export function makeReadingDraft(reading) {
 const reflection=reflections[reading.id];
 if(!reflection) throw new Error(`Missing reading reflection: ${reading.id}`);
 const experience=reading.fit||experienceByCategory[reading.category];
 return {
  id:reading.id,number:reading.number,title:reading.title,publisher:reading.publisher,
  url:reading.url,second:reading.second||null,category:reading.category,
  sourceSummary:reading.summary,takeaway:reading.takeaway,
  fields:{why:reflection[0],learned:`${reading.summary}\n\n${reflection[1]}`,experience,
   apply:reading.action,
   pitch:`The point I would bring into the interview is this: ${reading.takeaway}\n\n${reflection[1]}\n\nMy relevant foundation: ${experience}\n\nIn this role, my proposed next step would be to ${reading.action.charAt(0).toLowerCase()+reading.action.slice(1)}`,
   question:reading.question}
 };
}
