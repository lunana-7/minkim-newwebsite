import { projectDetails } from '../../../project-details.js';
import { hasProjectAccess, PRIVATE_PROJECT_HEADERS } from '../../../lib/project-access.js';
export const prerender = false;

export async function GET({ params, request }) {
  if (!hasProjectAccess(request)) return Response.json({ error: 'Unlock the Projects section first.' }, { status: 401, headers: PRIVATE_PROJECT_HEADERS });
  const project = projectDetails[params.slug];
  if (!project) return new Response('Not found', { status: 404, headers: PRIVATE_PROJECT_HEADERS });
  return Response.json(project, { headers: PRIVATE_PROJECT_HEADERS });
}
