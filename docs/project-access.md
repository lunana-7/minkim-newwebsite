# Project archive access

A single shared password now unlocks the entire Projects section for 14 days in the reader’s browser.

- `/work` renders only the archive entrance before the password is accepted. The full catalog and all experience groups are rendered only after access is granted.
- Direct `/projects/[slug]` visits redirect to that entrance, then return to the requested project after unlocking.
- `/api/projects/[slug]` requires the same access for every project.
- `/api/projects/access` accepts the archive password and sets a signed, HttpOnly cookie. DELETE clears that cookie.
- The archive and details use private/no-store caching and noindex headers.
- About links to the archive entrance without embedding individual project previews.

Set the shared password in the server environment variable named `password`. The older `PROJECTS_PASSWORD` name remains supported as a fallback. A separate `PROJECT_ACCESS_SECRET` is optional; without it, the server derives a signing key from the password. A long, random signing secret is recommended for stronger cookie protection, especially when the shared password is short. Keep these values private; do not put them in frontend code. HTTPS uses Secure cookies; local HTTP preview omits Secure. Changing the signing secret revokes existing access; if no separate secret is set, changing the password also revokes existing access.

After changing either environment variable in Vercel, redeploy the project so the server function receives the new value.

The **Lock archive** button returns the browser to the entrance. Previously unlocked readers can browse all projects with the existing valid cookie. There are no separate project passwords or repeated project-level forms.
