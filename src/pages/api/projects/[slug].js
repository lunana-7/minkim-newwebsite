import { createHmac, timingSafeEqual } from 'node:crypto';
import { projectDetails } from '../../../project-details.js';

export const prerender = false;

const cookieName = 'project_access';
const cookieAge = 60 * 60 * 24 * 14;

function sign(value, secret) {
  return createHmac('sha256', secret).update(value).digest('base64url');
}

function hasValidAccess(request, secret) {
  const cookie = request.headers.get('cookie') || '';
  const value = cookie.split(';').map(part => part.trim()).find(part => part.startsWith(`${cookieName}=`))?.slice(cookieName.length + 1);
  if (!value) return false;
  const [expires, signature] = value.split('.');
  if (!expires || !signature || Number(expires) < Date.now()) return false;
  const expected = sign(expires, secret);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function GET({ params, request }) {
  const project = projectDetails[params.slug];
  if (!project) return new Response('Not found', { status: 404 });
  if (project.access === 'password') {
    const secret = import.meta.env.PROJECT_ACCESS_SECRET;
    if (!secret || !hasValidAccess(request, secret)) return new Response('Password required', { status: 401 });
  }
  return Response.json(project, { headers: { 'Cache-Control': 'private, no-store' } });
}

export async function POST({ params, request }) {
  if (!projectDetails[params.slug] || projectDetails[params.slug].access !== 'password') return new Response('Not found', { status: 404 });
  const password = import.meta.env.PROJECTS_PASSWORD;
  const secret = import.meta.env.PROJECT_ACCESS_SECRET;
  if (!password || !secret) return Response.json({ error: 'Password access is not configured yet.' }, { status: 503 });

  let submitted = '';
  try {
    submitted = String((await request.json()).password || '');
  } catch {}
  const a = Buffer.from(submitted);
  const b = Buffer.from(password);
  const matches = a.length === b.length && timingSafeEqual(a, b);
  if (!matches) return Response.json({ error: 'That password did not match. Please try again.' }, { status: 401 });

  const expires = String(Date.now() + cookieAge * 1000);
  const signature = sign(expires, secret);
  return Response.json({ ok: true }, {
    headers: {
      'Set-Cookie': `${cookieName}=${expires}.${signature}; Path=/; Max-Age=${cookieAge}; HttpOnly; Secure; SameSite=Lax`,
      'Cache-Control': 'no-store'
    }
  });
}
