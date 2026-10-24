export const readingWorkstreams = [
 {id:'policy-annotation',label:'Policy annotation & playbooks',description:'Translate policy boundaries into label definitions, contrasting examples and usable reviewer instructions.'},
 {id:'reviewer-operations',label:'Reviewer operations',description:'Match expertise to tasks, establish readiness, support contributors and resolve workflow blockers.'},
 {id:'quality-assurance',label:'Quality assurance & error analysis',description:'Inspect reference labels, measure errors, diagnose failure patterns and scope corrective review.'},
 {id:'adjudication',label:'Calibration & adjudication',description:'Investigate disagreement, compare rationales and route unresolved judgments to authorized owners.'},
 {id:'safety-evaluation',label:'Safety evaluation & red teaming',description:'Design representative tests, validate graders and distinguish known-case measurement from failure discovery.'},
 {id:'policy-feedback',label:'Policy gaps & escalation',description:'Surface unclear boundaries and connect evidence to policy, governance and mitigation decisions.'},
 {id:'delivery',label:'Delivery & stakeholder decisions',description:'Clarify acceptance criteria, communicate limitations and manage quality, capacity, timing and cost trade-offs.'},
 {id:'human-data',label:'Human data & model training',description:'Understand how demonstrations, preferences and curated examples enter training and evaluation.'},
 {id:'company',label:'Handshake business & research',description:'Understand Handshake’s contributor model and research perspective, then connect them to the role.'}
];
// Membership is intentionally many-to-many: one source can support several responsibilities.
const membership = {
 'afterquery-human-data':['human-data','quality-assurance','delivery'],
 company:['company','reviewer-operations','delivery'],
 behavior:['policy-annotation','adjudication','policy-feedback'],
 usage:['policy-annotation','policy-feedback'],
 evaluation:['safety-evaluation','quality-assurance','delivery'],
 agreement:['adjudication','quality-assurance','reviewer-operations'],
 metrics:['quality-assurance','safety-evaluation','delivery'],
 'agent-evals':['safety-evaluation','quality-assurance'],
 sql:['quality-assurance','delivery'],
 datasheets:['delivery','quality-assurance','human-data'],
 'model-cards':['delivery','safety-evaluation','quality-assurance'],
 'agreement-survey':['adjudication','quality-assurance'],
 helm:['safety-evaluation','delivery'],
 xstest:['safety-evaluation','policy-annotation'],
 harmbench:['safety-evaluation','quality-assurance'],
 instructgpt:['human-data','reviewer-operations'],
 dpo:['human-data','quality-assurance'],
 'constitutional-ai':['human-data','policy-annotation','quality-assurance'],
 'nist-genai':['policy-feedback','delivery'],
 'model-collapse':['human-data','quality-assurance'],
 'data-statements':['quality-assurance','policy-annotation','human-data'],
 'handshake-water':['company','human-data','quality-assurance'],
 'handshake-expertise':['company','human-data','reviewer-operations'],
 'handshake-gandalf':['company','safety-evaluation','quality-assurance'],
 'handshake-project-matching':['reviewer-operations','delivery','company'],
 'handshake-fellow-journey':['reviewer-operations','delivery','company'],
 'handshake-project-start':['reviewer-operations','quality-assurance','adjudication'],
 'handshake-platform-work':['reviewer-operations','quality-assurance','delivery'],
 'handshake-account-integrity':['reviewer-operations','policy-feedback'],
 'gemini-policy':['policy-annotation','adjudication','policy-feedback'],
 'gemini-filters':['quality-assurance','policy-annotation','safety-evaluation'],
 'google-use-policy':['policy-annotation','policy-feedback'],
 'deepmind-frontier':['policy-feedback','safety-evaluation','delivery'],
 'meta-llama-guard':['policy-annotation','quality-assurance'],
 'meta-cyberseceval':['safety-evaluation','policy-feedback'],
 'palantir-evals':['safety-evaluation','quality-assurance'],
 'palantir-governance':['policy-feedback','delivery'],
 'scale-seal':['safety-evaluation','reviewer-operations','quality-assurance'],
 'scale-test-vision':['safety-evaluation','delivery','reviewer-operations']
};
export function workstreamsForReading(id){
 const ids=membership[id];
 if(!ids)throw new Error(`Missing reading workstream: ${id}`);
 return ids.map(id=>{
  const stream=readingWorkstreams.find(stream=>stream.id===id);
  if(!stream)throw new Error(`Unknown reading workstream: ${id}`);
  return stream;
 });
}
