# Expanded wiki article prose

All 25 existing wiki articles now have original operational commentary in each of five substantive sections: definition, scope, practice, example analysis and pitfalls. A sixth section supplies topic-specific review questions. Paragraphs are short, with concrete actors, actions, decisions and failure conditions. Agent Inventory has a longer treatment and a ten-row suggested record schema.

`src/wiki-depth.js` separates operational interpretation from the existing concise definitions and reference data. `WikiSectionLinks.astro` adds direct primary-document reading links and links to existing concept pages inside each section. `WikiText.astro` continues first-mention concept linking within prose. Article search includes the additional prose, not just summaries.

The top information card is replaced by a compact metadata line. Contents is folded initially. Scope definitions are readable stacked text rather than a grid of large cards. The bottom A–Z index remains folded by default.

Research sources checked October 11, 2026: NIST AI RMF Core and CSRC glossary/ABAC/incident-response pages; OASIS XACML 3.0; IETF RFCs 8693 and 7009; OWASP 2025 prompt-injection and excessive-agency entries; SPIFFE concepts; OpenTelemetry primer; MCP introduction/security documentation; and the linked Palo Alto Networks identity, governance and gateway pages. Vendor viewpoints, standards and editorial patterns retain distinct labels. Each added practical pattern is Min's editorial synthesis and not a new mandatory standard requirement. Examples are illustrative.

The expanded inventory schema is intentionally labeled a suggested design rather than a NIST-provided template. The material does not assert compliance, guarantee safety or represent reported customer deployments.
