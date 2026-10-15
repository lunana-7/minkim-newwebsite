// Source scopes are explained in each article's research notes. The surrounding
// workflow examples and operational recommendations are original editorial analysis.
export const sources = {
  spiffe: { name: 'SPIFFE: Concepts and verifiable workload identity', url: 'https://spiffe.io/docs/latest/spiffe-about/spiffe-concepts/' },
  federation: { name: 'Google Cloud: Workload Identity Federation', url: 'https://cloud.google.com/iam/docs/workload-identity-federation' },
  audience: { name: 'IETF RFC 8707: Resource Indicators for OAuth 2.0', url: 'https://www.rfc-editor.org/rfc/rfc8707' },
  dpop: { name: 'IETF RFC 9449: Demonstrating Proof of Possession', url: 'https://www.rfc-editor.org/rfc/rfc9449' },
  mtls: { name: 'IETF RFC 8705: Mutual TLS and Certificate-Bound Access Tokens', url: 'https://www.rfc-editor.org/rfc/rfc8705' },
  capability: { name: 'W3C TAG: Good Practices for Capability URLs (Working Draft)', url: 'https://www.w3.org/TR/capability-urls/' },
  controls: { name: 'NIST SP 800-53 Rev. 5: Security and Privacy Controls', url: 'https://csrc.nist.gov/pubs/sp/800/53/r5/upd1/final' },
  jit: { name: 'Microsoft Entra: Privileged Identity Management overview', url: 'https://learn.microsoft.com/en-us/entra/id-governance/privileged-identity-management/pim-configure' },
  authorization: { name: 'OWASP: Authorization Cheat Sheet', url: 'https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html' },
  circuit: { name: 'Microsoft Azure Architecture Center: Circuit Breaker pattern', url: 'https://learn.microsoft.com/en-us/azure/architecture/patterns/circuit-breaker' },
  retry: { name: 'Amazon Builders’ Library: Timeouts, retries, and backoff with jitter', url: 'https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/' },
  http: { name: 'IETF RFC 9110: HTTP Semantics, conditional requests', url: 'https://www.rfc-editor.org/rfc/rfc9110.html' },
  race: { name: 'MITRE CWE-367: Time-of-check Time-of-use Race Condition', url: 'https://cwe.mitre.org/data/definitions/367.html' },
  outbox: { name: 'AWS Prescriptive Guidance: Transactional outbox pattern', url: 'https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/transactional-outbox.html' },
  bulkhead: { name: 'Microsoft Azure Architecture Center: Bulkhead pattern', url: 'https://learn.microsoft.com/en-us/azure/architecture/patterns/bulkhead' },
  lineage: { name: 'W3C: PROV Overview (2013 Working Group Note)', url: 'https://www.w3.org/TR/prov-overview/' },
  privacy: { name: 'NIST: Privacy Framework', url: 'https://www.nist.gov/privacy-framework' },
  secrets: { name: 'OWASP: Secrets Management Cheat Sheet', url: 'https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html' },
  poisoning: { name: 'OWASP LLM04:2025: Data and Model Poisoning', url: 'https://genai.owasp.org/llmrisk/llm042025-data-and-model-poisoning/' },
  injection: { name: 'OWASP: LLM Prompt Injection Prevention Cheat Sheet', url: 'https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html' },
  context: { name: 'Liu et al.: Lost in the Middle: How Language Models Use Long Contexts', url: 'https://arxiv.org/abs/2307.03172' },
  judge: { name: 'Zheng et al.: Judging LLM-as-a-Judge with MT-Bench and Chatbot Arena', url: 'https://arxiv.org/abs/2306.05685' },
  contamination: { name: 'Investigating Data Contamination for Pre-training Language Models (2024)', url: 'https://arxiv.org/abs/2401.06059' },
  calibration: { name: 'Guo et al.: On Calibration of Modern Neural Networks (2017)', url: 'https://arxiv.org/abs/1706.04599' },
  cards: { name: 'Mitchell et al.: Model Cards for Model Reporting', url: 'https://arxiv.org/abs/1810.03993' },
  factsheets: { name: 'Arnold et al.: FactSheets: Increasing Trust in AI Services', url: 'https://arxiv.org/abs/1808.07261' },
  assurance: { name: 'NASA: Understanding Assurance Cases', url: 'https://shemesh.larc.nasa.gov/arg/uac.html' },
  exercise: { name: 'NIST SP 800-61 Rev. 3: Incident Response Recommendations', url: 'https://csrc.nist.gov/pubs/sp/800/61/r3/final' },
  ssrf: { name: 'OWASP: Server Side Request Forgery Prevention Cheat Sheet', url: 'https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html' },
  schema: { name: 'JSON Schema: Object validation reference', url: 'https://json-schema.org/understanding-json-schema/reference/object' },
  packages: { name: 'We Have a Package for You! Package Hallucinations by Code Generating LLMs', url: 'https://arxiv.org/abs/2406.10279' },
  ssdf: { name: 'NIST SP 800-218: Secure Software Development Framework v1.1', url: 'https://csrc.nist.gov/pubs/sp/800/218/final' },
  robustness: { name: 'Madry et al.: Towards Deep Learning Models Resistant to Adversarial Attacks', url: 'https://arxiv.org/abs/1706.06083' },
  reward: { name: 'Skalse et al.: Defining and Characterizing Reward Hacking', url: 'https://arxiv.org/abs/2209.13085' },
  rmf: { name: 'NIST AI RMF: Core functions and subcategories', url: 'https://airc.nist.gov/airmf-resources/airmf/5-sec-core/' },
  govern: { name: 'NIST AI RMF Playbook: Govern', url: 'https://airc.nist.gov/airmf-resources/playbook/govern/' },
  oecd: { name: 'OECD: AI Principles', url: 'https://www.oecd.org/en/topics/sub-issues/ai-principles.html' },
  requirements: { name: 'NASA Systems Engineering Handbook: Requirements Management', url: 'https://www.nasa.gov/reference/6-2-requirements-management/' },
  datasets: { name: 'Gebru et al.: Datasheets for Datasets', url: 'https://arxiv.org/abs/1803.09010' },
  dp: { name: 'NIST SP 800-226: Evaluating Differential Privacy Guarantees', url: 'https://csrc.nist.gov/pubs/sp/800/226/final' },
};

export function compileGuides(records) {
  const entries = records.map(({ body, questions, notes, sourceKeys, ...entry }) => ({
    ...entry, kind: 'Working governance definition', reviewedAt: '2026-10-15',
    glyph: entry.category === 'Identity & access' ? '⚿' : entry.category === 'Data & memory' ? '▧' : '◈',
    sources: sourceKeys.map(key => sources[key]),
  }));
  const depth = Object.fromEntries(records.map(entry => [entry.slug, {
    definition: [entry.body[0]], scope: [entry.body[1]], practice: [entry.body[2]],
    example: [entry.body[3]], pitfalls: [entry.body[4]], questions: entry.questions,
  }]));
  const research = Object.fromEntries(records.map(entry => [entry.slug, entry.notes.map(([key, title, text]) => ({ source: sources[key], title, text }))]));
  return { entries, depth, research };
}
