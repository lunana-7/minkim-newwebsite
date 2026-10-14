import catalog from "./data/project-catalog.json";

export const experiences = catalog.experiences;
export const projectCatalog = catalog.projects.map(({ slug, title, tag, experience, year, role, description, access }) => ({ slug, title, tag, experience, year, role, description, access }));

const featuredSlugs = ["ax-spend-gate", "six-for-26-dashboard", "action-lab-human-ai-decisions", "deployment-studio", "rewindai-uist-poster", "tradies-social-product", "btaa-data-analytics-community"];
export const projectHighlights = featuredSlugs.map(slug => projectCatalog.find(project => project.slug === slug));

export const projectAliases = {
  "krafton-ai-governance": "/work#krafton",
  "pacvue-executive-intelligence": "/work#pacvue",
  "memoria-ai-memory-deployment": "/work#memoria"
};
