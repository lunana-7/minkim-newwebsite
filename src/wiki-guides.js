import identity from './wiki-guides/identity.js';
import execution from './wiki-guides/execution.js';
import data from './wiki-guides/data.js';
import assurance from './wiki-guides/assurance.js';
import security from './wiki-guides/security.js';
import foundations from './wiki-guides/foundations.js';
import { compileGuides } from './wiki-guides/shared.js';

const guides = compileGuides([...identity, ...execution, ...data, ...assurance, ...security, ...foundations]);
export const guideWikiEntries = guides.entries;
export const guideWikiDepth = guides.depth;
export const guideWikiResearch = guides.research;
