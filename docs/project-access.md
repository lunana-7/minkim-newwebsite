# Project archive access

A single shared password now unlocks the entire Projects section for 14 days in the reader’s browser.

- `/work` renders only the archive entrance before the password is accepted. The full catalog and all experience groups are rendered only after access is granted.
- Direct `/projects/[slug]` visits redirect to that entrance, then return to the requested project after unlocking.
- `/api/projects/[slug]` requires the same access for every project.
- `/api/projects/access` accepts the archive password and sets a signed, HttpOnly cookie. DELETE clears that cookie.
- The archive and details use private/no-store caching and noindex headers.
- About links to the archive entrance without embedding individual project previews.

The existing `PROJECTS_PASSWORD` and `PROJECT_ACCESS_SECRET` environment values are reused. Keep them private; do not put them in frontend code. HTTPS uses Secure cookies; local HTTP preview omits Secure. Changing the signing secret revokes existing access.

The **Lock archive** button returns the browser to the entrance. Previously unlocked readers can browse all projects with the existing valid cookie. There are no separate project passwords or repeated project-level forms.
