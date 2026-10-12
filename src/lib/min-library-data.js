export const LIBRARY_BOOKS = [
  {
    id:'ai-rmf', title:'AI Risk Management Framework', short:'AI RMF 1.0', author:'NIST · 2023', topic:'Governance foundations',
    description:'A practical framework for governing, mapping, measuring, and managing AI risks across an organization.',
    prompt:'As you read, ask who owns each risk decision and what evidence would show a control is working.',
    pdf:'/library-pdf/nist-ai-rmf.pdf', source:'https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-ai-rmf-10',
    cover:'✦'
  },
  {
    id:'genai-profile', title:'Generative AI Profile', short:'GenAI Profile', author:'NIST · 2024', topic:'Generative AI governance',
    description:'A companion to the AI RMF with suggested actions for generative AI risks across the lifecycle.',
    prompt:'Look for actions that apply to agent permissions, evaluation, monitoring, and human oversight.',
    pdf:'/library-pdf/nist-generative-ai-profile.pdf', source:'https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence',
    cover:'◇'
  },
  {
    id:'agent-identity', title:'AI Agent Identity & Authorization', short:'Agent Identity', author:'NIST NCCoE · 2026 concept paper', topic:'Agentic AI governance',
    description:'A short concept paper on identifying agents, limiting delegated authority, and recording their actions. It poses open questions rather than final requirements.',
    prompt:'While reading, sketch who grants each agent permission, what it may do, and how you would revoke or audit that access.',
    pdf:'/library-pdf/nist-agent-identity.pdf', source:'https://www.nccoe.nist.gov/sites/default/files/2026-02/accelerating-the-adoption-of-software-and-ai-agent-identity-and-authorization-concept-paper.pdf',
    cover:'◈'
  },
  {
    id:'agentic-top10', title:'Top 10 for Agentic Applications', short:'Agentic Top 10', author:'OWASP · 2026', topic:'Agent security',
    description:'A focused guide to the most critical security risks in autonomous and agentic AI applications.',
    prompt:'For each risk, imagine what boundary an agent crosses and which control would stop or detect it.',
    pdf:null, source:'https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/',
    cover:'♧'
  }
];
export const LIBRARY_IDS = LIBRARY_BOOKS.map(book=>book.id);
