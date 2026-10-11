// Server-only case-study content. Never import this module into browser scripts.
import catalog from './data/project-catalog.json';
export const projectDetails = Object.fromEntries(catalog.projects.map(project => [project.slug, project]));
