---
title: "Paper Review: What Should Agentic AI Governance Actually Govern?"
date: "2026-10-12"
readingTime: "7 min read"
tags: ["agentic-ai", "ai-governance", "paper-review"]
excerpt: "A review of Raji and Bashir's literature survey through the practical questions of agent identity, delegated authority, human accountability, memory, and execution controls."
bannerType: "geometric-grid"
---

Imagine asking an AI agent to “plan my business trip.” A system that suggests an itinerary and one that books flights and changes your calendar receive the same request, but create different risks. The second system can access external services, spend money, and affect other people's schedules and personal information.

Mubarak Raji and Masooda Bashir's [*Towards Agentic AI Governance: A Preliminary Assessment*](https://arxiv.org/pdf/2607.07612) starts from this distinction. Governing AI that can plan and act autonomously requires us to **define what counts as an agent, identify whose authority it acts under, and control both personal data and execution**. This review summarizes the paper's main arguments and considers how to translate them into an operational approach to AI agents.

## What kind of study is this?

The authors searched literature published from 2020 to 2025 through Google Scholar, the ACM Digital Library, SSRN, JSTOR, AAAI, and other repositories. They narrowed an initial pool of more than 3,000 records by topic and scope, excluding work on physical autonomous systems and other forms of AI. Their final analysis covered **21 peer-reviewed articles**. The focus is the ethics, accountability, and governance of software-based AI agents rather than self-driving vehicles or drones.

The paper does not experimentally test whether a particular control works. It is an early literature review that brings scattered debates together and identifies questions for future research and governance design.

## First, what should count as an agent?

The paper distinguishes two ways of understanding agentic AI. The first sees it as **a system that can independently plan and carry out multiple steps toward a goal**. From this perspective, autonomy, adaptation to a changing environment, interaction with external systems, coordination among agents, and continuity of state and memory over time all matter. These are characteristics drawn from the literature, not a single checklist that every agent must satisfy.

The second view treats an agent as **an actor carrying out delegated work on someone else's behalf**. Here, the relationship matters more than technical complexity. Who set the goal? How much discretion was delegated? If something goes wrong, who must explain the decision and take responsibility?

That distinction is useful because the label “agent” alone tells us little about risk. A tool that reads documents and drafts text needs different permissions and oversight from one that can modify customer accounts. **This is my application of the paper's classification to operational decisions.**

## Where does delegated authority end?

The paper uses the human principal–agent relationship to examine questions of authority and accountability. If a user says, “Book the best trip for me,” that cannot reasonably mean unlimited approval of any airfare, disclosure of personal information, or refund terms. An agent must operate between explicitly permitted actions and discretion inferred from context.

The literature offers different approaches. Kolt emphasizes visibility into what an agent knows and does as a basis for assigning responsibility. Lior emphasizes the responsibility of parties that exercise meaningful control, such as developers and deployers. O'Keefe and colleagues propose designing AI to refuse unlawful actions even when a user requests them. The paper also discusses proposals to grant AI limited legal personhood alongside objections that accountability should remain with people and organizations. The authors find no consensus on this question.

Translated into operations, authority cannot live only in a sentence in a long policy document. For each task, we should be able to identify **who delegated it, which tools and data the agent may access, when the permission expires, and which actions require human approval**.

## Memory extends the privacy lifecycle

An agent may retain state and previous interactions so it can continue a task across multiple steps. Privacy questions therefore extend beyond the moment of collection. We also need to know why stored information is reused later, how long it remains available, and how a deletion request affects both memory and task records.

The paper argues that existing privacy principles—including purpose limitation, data minimization, retention limits, transparency, and deletion rights—can apply to agents. It also observes that persistent memory and autonomous reuse call for additional design tied to real data flows. For example, if an agent retrieves customer information from long-term memory for a different goal, there should be a way to check whether the new use fits the original purpose of collection.

## Operational directions from Singapore's framework

The authors discuss Singapore's [*Model AI Governance Framework for Agentic AI*](https://www.imda.gov.sg/-/media/imda/files/about/emerging-tech-and-research/artificial-intelligence/mgf-for-agentic-ai.pdf), released by IMDA in January 2026, as an example of governance designed specifically for agents. The framework identifies risks such as erroneous, unauthorized, or unfair actions, data breaches, and disruption to connected systems. It recommends four directions:

| Direction | Operational question |
| --- | --- |
| Assess and bound risks upfront | Which actions and tools are allowed, and where must the agent stop? |
| Make humans meaningfully accountable | Who approves, oversees, and intervenes when something goes wrong? |
| Implement technical controls and processes | How are policies applied during execution, and how are failures handled? |
| Enable end-user responsibility | Can users understand the agent's capabilities and limits? |

The central idea is that increasing autonomy should not obscure human accountability. Whether these four directions work effectively in a particular product still needs to be tested.

## The question I took away: identity, authority, and observability

The most useful question I took from this paper is:

> On whose behalf is this agent acting, what is it allowed to do, and who can inspect and take responsibility for its actions?

The paper establishes why that question matters. The following table is **my interpretation for product and operational design**; the paper neither validates this structure nor presents it as a standard.

| Design element | Information and controls to retain |
| --- | --- |
| Agent identity | Agent ID, owning team, intended purpose, execution environment |
| Delegation and permissions | Requester, task scope, permitted tools and data, expiration, approval conditions |
| Execution controls | Authorization before tool calls, approval for high-risk actions, stop and cancel paths |
| Observability and evidence | Task ID, approval decisions, tool calls and results, exceptions and failures |
| Personal-data lifecycle | Collection purpose, memory storage and reuse rules, retention period, deletion method |

These pieces need to connect so that, after an incident, we can explain not only *what happened* but *why it was allowed*. A large volume of logs will not reconstruct responsibility if the delegation relationship and decision criteria are missing. Avoiding unnecessary personal data and secrets in those records is part of the design, too.

## Contributions and open questions

The paper's strength is that it does not collapse agent governance into a single ethical principle. It connects **definitions, autonomy, delegation, accountability, privacy, and stakeholder participation**. Its call to include countries and communities in the Global Majority also matters: legal concepts of delegation and responsibility vary across jurisdictions.

The limits are clear. The review is restricted to 21 peer-reviewed articles, and its discussion of agency relationships relies largely on common-law concepts. It does not provide empirical evidence about which approval processes, permission models, or observability practices work in enterprise settings. The authors point to actual developer governance practices and the collection, use, storage, and deletion of personal data by agents as areas for further study.

I read this paper as **a map of design questions**, rather than a finished checklist. The next step is to turn those questions into agent registration records, execution permissions, approval points, data-lifecycle rules, and operational evidence—and then verify that those controls work in practice.

### Sources

- Mubarak Raji and Masooda Bashir, [*Towards Agentic AI Governance: A Preliminary Assessment*](https://arxiv.org/pdf/2607.07612), 2026.
- Singapore Infocomm Media Development Authority, [*Model AI Governance Framework for Agentic AI*, version 1.0](https://www.imda.gov.sg/-/media/imda/files/about/emerging-tech-and-research/artificial-intelligence/mgf-for-agentic-ai.pdf), 22 January 2026.
