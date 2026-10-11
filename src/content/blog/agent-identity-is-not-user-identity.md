---
title: "Agent Identity Is Not User Identity"
date: "2026-10-11"
readingTime: "8 min read"
tags: ["agent-identity", "agentic-ai", "security"]
excerpt: "When an AI agent acts through tools, systems need to distinguish the agent, the person it serves, and the authority delegated to a specific task."
bannerType: "math-grid"
---

An AI agent can be started by a person, run as a service, and call several other services before it returns a result. Which identity should appear on those actions?

The answer should not be “whichever credential was easiest to reuse.” A human user, an agent process, and a task delegation are different security facts. Collapsing them makes authorization and investigation harder.

## Keep three identities distinct

**The human identity** answers who requested or approved the work. **The agent identity** answers which software process made a particular tool call. **The task or delegation identity** records what the agent was asked to do and what authority it received for that request.

An application can preserve these relationships in its audit trail: human subject → agent identity → task identifier → tool action → result or approval. This keeps attribution without implying that the person personally performed every machine action.

## Give the agent a verifiable workload identity

An agent should authenticate as its own workload, with access tied to that identity and environment. The open [SPIFFE standard](https://spiffe.io/docs/latest/spiffe-specs/) defines portable identities for software systems. A [SPIFFE ID](https://spiffe.io/docs/latest/spiffe-specs/spiffe-id/) names a workload, while an SVID lets it present that identity in a cryptographically verifiable form. The [SPIFFE Workload API](https://spiffe.io/docs/latest/spiffe-specs/spiffe_workload_api/) describes how workloads can retrieve identities and trust bundles.

The practical benefit is that a service can verify which workload is calling without embedding a long-lived shared password in every application. SPIFFE is infrastructure for workload identity; it does not decide whether an agent’s business purpose is appropriate or what the agent may do.

## Bind authority to the task

Authentication answers who is calling. Authorization answers what that caller may do. An authenticated agent should still receive only the narrow permissions required for its current task.

For each delegation, make the scope explicit: allowed tools, data boundary, expiration, action limits, and whether a person must approve a consequential step. Enforce those rules at the tool or resource boundary. Instructions in a prompt can guide behavior, but they are not a substitute for access control.

When OAuth tokens are involved, the [OAuth 2.0 Security Best Current Practice, RFC 9700](https://datatracker.ietf.org/doc/html/rfc9700) discusses audience-restricted access tokens: a resource server should check that a token was intended for it. This is one useful safeguard against a token being accepted by an unintended service. Apply the relevant protocol guidance for your architecture and identity provider.

## Make credentials short-lived and attributable

Avoid giving every agent a static credential with broad access. Prefer credentials that can be rotated or revoked, limit their scope, and connect issuance to a known workload and task. Where the infrastructure supports it, make the identity lifecycle automatic so that a stopped or redeployed agent does not keep old access indefinitely.

Logs should include both the verified workload and the user or service that delegated work, along with the task, tool, resource, decision, and time. Do not place raw secrets or unnecessary personal data in those records. The goal is to reconstruct meaningful actions while minimizing what the log itself exposes.

## Plan for handoffs and failure

Agents increasingly delegate subtasks to other agents or services. Each handoff should carry a traceable parent task and an explicit statement of the authority being passed along. A child process should not silently inherit every permission held by its parent.

Set clear rules for expiry, retries, cancellation, and human takeover. If an agent is paused, its credentials and queued actions should have predictable behavior. If the human request is withdrawn, downstream work should stop where technically possible.

## Identity is a foundation, not the whole governance program

An agent identity can improve attribution and access control, but it cannot prove that the agent’s output is correct, that its goal is legitimate, or that its use is fair. Those questions still need context, measurement, oversight, and review.

The goal is not to make every agent more human-like. It is to make each software actor identifiable, bounded, and accountable within the systems it can affect.
