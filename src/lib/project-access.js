import { createHmac, timingSafeEqual } from 'node:crypto';

export const PROJECT_COOKIE = 'project_access';
export const PROJECT_COOKIE_AGE = 60 * 60 * 24 * 14;
export const PRIVATE_PROJECT_HEADERS = { 'Cache-Control': 'private, no-store', Vary: 'Cookie', 'X-Robots-Tag': 'noindex, nofollow' };

function sign(value, secret) {
  return createHmac('sha256', secret).update(value).digest('base64url');
}

export function hasProjectAccess(request) {
  const secret = import.meta.env.PROJECT_ACCESS_SECRET;
  if (!secret) return false;
  const raw = request.headers.get('cookie') || '';
  const value = raw.split(';').map(part => part.trim()).find(part => part.startsWith(`${PROJECT_COOKIE}=`))?.slice(PROJECT_COOKIE.length + 1);
  if (!value) return false;
  const [expires, signature, extra] = value.split('.');
  const expiry = Number(expires);
  if (extra || !signature || !Number.isFinite(expiry) || expiry <= Date.now()) return false;
  const actual = Buffer.from(signature), expected = Buffer.from(sign(expires, secret));
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

export function validateProjectPassword(submitted) {
  const password = process.env.password || import.meta.env.password || import.meta.env.PROJECTS_PASSWORD;
  const secret = import.meta.env.PROJECT_ACCESS_SECRET;
  if (!password || !secret) return 'unconfigured';
  if (typeof submitted !== 'string' || submitted.length > 1024) return false;
  const actual = Buffer.from(submitted), expected = Buffer.from(password);
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

export function projectAccessCookie(request, clear = false) {
  const expires = String(Date.now() + PROJECT_COOKIE_AGE * 1000);
  const value = clear ? '' : `${expires}.${sign(expires, import.meta.env.PROJECT_ACCESS_SECRET)}`;
  const secure = new URL(request.url).protocol === 'https:' ? '; Secure' : '';
  return `${PROJECT_COOKIE}=${value}; Path=/; Max-Age=${clear ? 0 : PROJECT_COOKIE_AGE}; HttpOnly${secure}; SameSite=Lax`;
}

export function projectReturnPath(value) {
  if (typeof value !== 'string' || !/^\/projects\/[a-z0-9-]+$/.test(value)) return '/work';
  return value;
}
