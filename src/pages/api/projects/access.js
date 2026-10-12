import { PRIVATE_PROJECT_HEADERS, projectAccessCookie, validateProjectPassword } from '../../../lib/project-access.js';
export const prerender = false;

function sameOrigin(request) {
  const origin = request.headers.get('origin');
  return !origin || origin === new URL(request.url).origin;
}

export async function POST({ request }) {
  if (!sameOrigin(request)) return Response.json({ error: 'Please unlock from this website.' }, { status: 403, headers: PRIVATE_PROJECT_HEADERS });
  let password;
  try { password = (await request.json()).password; } catch {}
  const matches = validateProjectPassword(password);
  if (matches === 'unconfigured') return Response.json({ error: 'Project access is not configured yet.' }, { status: 503, headers: PRIVATE_PROJECT_HEADERS });
  if (!matches) return Response.json({ error: 'That password did not match. Please try again.' }, { status: 401, headers: PRIVATE_PROJECT_HEADERS });
  return Response.json({ ok: true }, { headers: { ...PRIVATE_PROJECT_HEADERS, 'Set-Cookie': projectAccessCookie(request) } });
}

export async function DELETE({ request }) {
  if (!sameOrigin(request)) return new Response(null, { status: 403, headers: PRIVATE_PROJECT_HEADERS });
  return Response.json({ ok: true }, { headers: { ...PRIVATE_PROJECT_HEADERS, 'Set-Cookie': projectAccessCookie(request, true) } });
}
