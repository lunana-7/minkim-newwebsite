# Min’s World journal covers

Three original pixel-art illustrations, generated using the built-in image_gen tool. The complete prompt set and source paths are saved in [manifest.json](./manifest.json).

| Post | Illustration | Final cover |
| --- | --- | --- |
| Governing Agentic AI Before It Reaches Runtime | Permission checkpoint, human review, bounded tool access | `public/blog-art/governing-agentic-ai-in-production.webp` |
| AI Governance Is an Operating Model, Not a Policy Binder | Village with intake, design, measurement, and operations stations | `public/blog-art/ai-governance-as-an-operating-model.webp` |
| Agent Identity Is Not User Identity | Separate human, workload, and task badges linked to a locked chest | `public/blog-art/agent-identity-is-not-user-identity.webp` |

Full-resolution PNG originals are alongside the WebP covers. Each `-thumb.webp` is a smaller derivative for journal and homepage cards. `scripts/package-blog-art.mjs` performs delivery encoding and thumbnail sizing; it leaves the generated originals unchanged.

Alt text is stored in each post’s frontmatter. Covers appear on the article page and thumbnails on the journal and homepage.
