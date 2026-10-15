import { operationsWikiResearch } from './wiki-operations.js';
// Source-grounded details for the execution-controls articles. The agent examples
// are editorial applications of the linked specifications, not normative rules.
const xacml = { name: 'OASIS XACML 3.0', url: 'https://docs.oasis-open.org/xacml/3.0/xacml-3.0-core-spec-os-en.html' };
const zeroTrust = { name: 'NIST SP 800-207', url: 'https://csrc.nist.gov/pubs/sp/800/207/final' };
const aiRmf = { name: 'NIST AI RMF Core', url: 'https://airc.nist.gov/airmf-resources/airmf/5-sec-core/' };
const agency = { name: 'OWASP LLM06:2025', url: 'https://genai.owasp.org/llmrisk/llm062025-excessive-agency/' };
const revocation = { name: 'IETF RFC 7009', url: 'https://www.rfc-editor.org/rfc/rfc7009' };
const spiffe = { name: 'SPIFFE concepts', url: 'https://spiffe.io/docs/latest/spiffe-about/spiffe-concepts/' };
const injection = { name: 'OWASP LLM01:2025', url: 'https://genai.owasp.org/llmrisk/llm01-prompt-injection/' };
const telemetry = { name: 'OpenTelemetry observability primer', url: 'https://opentelemetry.io/docs/concepts/observability-primer/' };
const telemetrySignals = { name: 'OpenTelemetry signals', url: 'https://opentelemetry.io/docs/concepts/signals/' };
const telemetryLogs = { name: 'OpenTelemetry logs', url: 'https://opentelemetry.io/docs/concepts/signals/logs/' };
const genAiAttributes = { name: 'OpenTelemetry GenAI attributes', url: 'https://opentelemetry.io/docs/specs/semconv/registry/attributes/gen-ai/' };
const otelOverview = { name: 'OpenTelemetry: What is OpenTelemetry?', url: 'https://opentelemetry.io/docs/what-is-opentelemetry/' };
const otelCollector = { name: 'OpenTelemetry: Collector', url: 'https://opentelemetry.io/docs/collector/' };
const otelPropagation = { name: 'OpenTelemetry: Context propagation', url: 'https://opentelemetry.io/docs/concepts/context-propagation/' };
const snowflakeSemantics = { name: 'Snowflake: Common AI Pitfalls in Financial Services and How to Fix Them', url: 'https://www.snowflake.com/en/blog/semantic-layer-ai-risk-finance/' };
const ossie = { name: 'Apache Ossie (incubating)', url: 'https://ossie.apache.org/' };
const fibo = { name: 'EDM Association: FIBO', url: 'https://edmcouncil.org/frameworks/industry-models/fibo/' };
const note = (title, text, source) => ({ title, text, source });

export const wikiResearch = {
  ...operationsWikiResearch,
  'open-telemetry': [
    note('Know what OTel provides', 'OpenTelemetry is a toolkit and specification for generating, collecting and exporting telemetry. It does not itself provide the backend that stores traces or the dashboard used to analyze them. Select a compatible backend separately.', otelOverview),
    note('Place the Collector deliberately', 'The Collector can receive, process and export telemetry. A pipeline can centralize routing and filtering, but its configuration determines which signals reach the backend. Review that pipeline when investigating a missing span or log.', otelCollector),
    note('Carry context across boundaries', 'Trace and span identifiers are propagated so services can create related spans for one request. For agent workflows, also carrying an application-level run identifier is a design choice that helps connect technical traces to a task record. Treat incoming trace context and outgoing baggage as data crossing a trust boundary.', otelPropagation),
    note('Minimize generative-AI content', 'OpenTelemetry generative-AI conventions include attributes for model operations and may describe sensitive prompt or response content. Decide which attributes are enabled, redacted, sampled and retained before collecting them; operational timing and outcomes may be useful without storing raw content.', genAiAttributes),
  ],
  'semantic-interoperability': [
    note('Separate exchange from agreement', 'The supplied Snowflake article distinguishes moving semantic models between platforms from agreeing on the business meaning of each term. Its “position” example illustrates why the same label can produce different results when settlement and timing rules differ. Treat this as an industry perspective and verify each local definition.', snowflakeSemantics),
    note('Recognize the current project name', 'Apache Ossie is the current name of the project formerly known as Open Semantic Interchange (OSI). It develops a vendor-neutral specification for exchanging semantic models across analytics, AI and BI tools. Exchange does not by itself resolve competing business definitions.', ossie),
    note('Use a domain vocabulary deliberately', 'The EDM Association describes FIBO as a formal, machine-readable model of financial concepts and relationships. It can provide a reference for mapping, but a team still has to document how its local fields and calculations correspond to those concepts.', fibo),
  ],
  'ai-governance': [
    note('Make ownership operational', 'NIST AI RMF Govern 1.5 addresses ongoing monitoring and periodic review with defined roles, while Govern 1.6 addresses inventory mechanisms. Link a system record to a reachable owner, the last review decision and the event that will trigger reassessment; a list of names alone does not show that oversight works.', aiRmf),
    note('Review the whole use case', 'The AI RMF Map function asks teams to document intended scope, benefits, costs and human oversight. A model update, new population or new downstream action can change risk even if the interface looks the same. Record those changes against the approved use rather than assuming an old decision covers them.', aiRmf),
  ],
  'agent-identity': [
    note('Identify the running workload', 'SPIFFE distinguishes a workload identity from the machine on which it runs. A SPIFFE ID names the workload within a trust domain, and an SVID provides verifiable evidence for that identity. In an agent system, maintain a separate link from this technical identity to the owner, deployment and delegated task.', spiffe),
    note('Plan credential rotation', 'SPIFFE’s Workload API provides short-lived identity documents and rotating trust material. The receiving service must still verify the presented identity and decide whether it may perform the requested action. Authentication of the workload is only one input to task authorization.', spiffe),
  ],
  'prompt-injection': [
    note('Include non-text surfaces', 'OWASP describes indirect injection through external files and websites and notes that images can carry hidden instructions in multimodal workflows. Map every route by which retrieved text, media or tool output enters the model; visually harmless content can still affect behavior if the model parses it.', injection),
    note('Measure the effect at the action boundary', 'OWASP recommends separating untrusted content, limiting privileges, requiring approval for high-risk actions and adversarial testing. In a realistic evaluation, record whether an attacker changed the final answer, caused an attempted tool call or reached a committed external effect. These are different outcomes and need different controls.', injection),
  ],
  'observability': [
    note('Connect a task across services', 'OpenTelemetry describes a distributed trace as a request path made of spans. For an agent workflow, carrying a task or run identifier across model calls, policy checks and tools is an implementation pattern that lets an operator reconstruct where time, retries and failures occurred.', telemetry),
    note('Use logs with context', 'A timestamped log message may not identify the request or operation that produced it. OpenTelemetry explains that logs become more useful when associated with a span or correlated with a trace. Capture only the attributes needed to answer operating questions, and keep sensitive prompt content out of routine telemetry when possible.', telemetry),
  ],
  'telemetry': [
    note('Match the signal to the question', 'OpenTelemetry identifies traces, metrics and logs as different telemetry signals. An agent operator can use a trace to follow one run, metrics to notice a change across runs, and logs to inspect a specific event. The agent-specific examples are an application of that taxonomy.', telemetrySignals),
    note('Preserve correlation', 'OpenTelemetry logs can carry trace and span identifiers so an event can be associated with the operation that produced it. A separate task or run identifier can connect model, policy and tool steps in an agent workflow when those services share it.', telemetryLogs),
    note('Limit sensitive content', 'OpenTelemetry notes that generative-AI attributes may contain sensitive information. Treat prompt and response capture as a deliberate decision with access, redaction and retention rules; routine health telemetry often needs only status, timing and identifiers.', genAiAttributes),
  ],
  'runtime-governance': [
    note('Evaluate the concrete request', 'An initial approval describes a workflow, but a later tool call has its own actor, operation, resource and context. Re-evaluate consequential access when those facts are known, and retain the policy version and outcome with the action record. NIST’s zero trust architecture describes policy decisions and enforcement close to resource access; applying that pattern to an agent is an architectural choice.', zeroTrust),
    note('Distinguish uncertainty from denial', 'XACML separates Permit, Deny, NotApplicable and Indeterminate. The enforcement point must define what each result means for this service. A high-impact action should not proceed merely because a required attribute or decision service is unavailable; a deny-biased enforcement point denies every result other than Permit.', xacml),
  ],
  'policy-information-point': [
    note('Trace the source of each fact', 'A PIP supplies attribute values; the context handler can collect them for a decision request. For an agent action, distinguish a verified identity or current approval from a value merely stated in a prompt or tool response. Record issuer and observation time so a reviewer can judge which facts were actually available.', xacml),
    note('Define missing-data behavior', 'In XACML, a required missing attribute can lead to Indeterminate and identify information needed for a refined request. A service may retry with authoritative data, stop the operation, or escalate. Treating the absent value as permission would be a separate and potentially unsafe policy choice.', xacml),
  ],
  'policy-decision-point': [
    note('Keep all four outcomes visible', 'The PDP returns Permit, Deny, NotApplicable or Indeterminate. NotApplicable means no evaluated policy applied; Indeterminate means evaluation could not produce a definitive result. Neither is a synonym for a successful approval, and the PEP needs an explicit rule for handling both.', xacml),
    note('Inspect policy combination', 'When several rules or policies apply, the configured combining algorithm determines the final result. Review overlapping rules and policy targets with realistic requests, including cases where one branch is missing data. A valid individual rule does not prove the combined decision is the one the team intended.', xacml),
  ],
  'policy-enforcement-point': [
    note('Enforce obligations, not only the decision', 'XACML can return obligations alongside a decision. A PEP permits access with a Permit obligation only when it understands and can discharge that obligation; advice is supplemental and may be ignored. In an agent workflow, an approval or recording step must be implemented by the service that commits the action if it is intended to be mandatory.', xacml),
    note('Cover alternate action paths', 'A control at one tool wrapper is insufficient if another route can reach the same resource. OWASP recommends limiting the extensions an agent can call and executing downstream operations in the user’s authorized scope. Inventory effective routes to reads, writes and outbound delivery, then place enforcement where bypass is not possible.', agency),
  ],
  'policy-administration-point': [
    note('Policy publication changes behavior', 'The PAP creates policies and policy sets, which are made available to the PDP. A change to a target or combining algorithm can change which requests are permitted even when no tool code changes. Keep an owner, review record, effective version and rollback route for policy publication.', xacml),
    note('Review applicability as well as wording', 'XACML uses targets to decide which requests a rule, policy or policy set applies to. Test edge cases around resource identifiers, tenant scope and operation names when changing policy. A rule that reads correctly but never matches a production request cannot enforce the intended boundary.', xacml),
  ],
  'human-approval': [
    note('Make oversight an operating process', 'NIST AI RMF Map 3.5 calls for processes for human oversight to be defined, assessed and documented. For each review point, identify the reviewer, information shown, authority to reject or intervene, and how the team learns whether oversight worked after deployment.', aiRmf),
    note('Bind approval to the action', 'OWASP recommends user approval before high-impact actions and notes that the approval routine can live in a downstream service or extension. An application design should bind that approval to the proposed recipient, resource, amount or payload; if those material details change, request a new decision before execution.', agency),
  ],
  'tool-boundary': [
    note('Treat tool arguments as the real request', 'A friendly tool label does not describe every possible effect. Review the concrete method, resource identifier, destination and parameters before the external service acts. OWASP advises minimizing exposed extensions and preserving the user’s authorization scope in downstream calls.', agency),
    note('Separate a proposal from a committed effect', 'An agent may draft a command, email or transaction without authority to execute it. The service that performs the side effect can act as the enforcement point: it requests a decision and blocks a call that does not satisfy the applicable policy. This is an application of XACML’s PEP role, not a requirement to use XACML itself.', xacml),
  ],
  'revocation': [
    note('Expect propagation and token differences', 'RFC 7009 specifies token revocation and notes that invalidation may take time to reach every server. It also warns that revoking a refresh token does not always immediately invalidate associated access tokens. Record which token types and services the agent actually uses and measure the residual access window.', revocation),
    note('Cancel work beyond the visible interface', 'Revoking a credential and cancelling a task are related but distinct operations. As an implementation pattern, stop queued jobs and child tasks, recheck authority before a consequential commit, and distinguish already completed side effects from work still preventable. A closed chat window alone does not establish that downstream work has stopped.', revocation),
  ],
};
