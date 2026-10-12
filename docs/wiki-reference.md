# Agentic AI governance wiki

25 term pages, across six subjects. The public portal has subject links, three reading paths, an alphabetical term index and a searchable categorized directory. Search covers titles, aliases, acronyms and definition text. The global Blog/Wiki search also includes aliases.

Each article includes breadcrumb navigation, an information box, local contents, definition with numbered source references, scope, editorial application patterns, an illustrative scenario, common pitfalls, related terms, incoming links, references and same-subject navigation. First mentions of known terms link to their definitions. No generated user claims or deployment stories are added.

Core entries: `src/wiki.js`. Additional entries: `src/wiki-expanded.js`. Article template: `src/pages/wiki/[slug].astro`. Portal: `src/pages/wiki/index.astro`. Inline linking: `src/components/WikiText.astro`.

## Editorial conventions

- Use primary sources. Current references include NIST, OASIS XACML, IETF RFCs, OWASP, OpenTelemetry, SPIFFE and official MCP documentation. Core vendor perspectives are labeled.
- Paraphrase definitions, identify the definition's scope, and give links to supporting documents.
- Mark governance or architectural syntheses as working definitions.
- Practical patterns and scenarios are editorial synthesis; illustrative cases are not reported deployments.
- XACML decisions remain Permit, Deny, NotApplicable and Indeterminate. Human approval is an application workflow.
- Authentication, authorization, delegation, task cancellation and token revocation remain distinct.
- Review dated protocol documentation when updating an article.
- Add aliases for searchable acronyms; keep slugs stable and related links resolvable.

Reviewed October 11, 2026. Sources are linked individually in every article rather than presenting one framework as universal compliance guidance.
