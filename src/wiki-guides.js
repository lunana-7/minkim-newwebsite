import economics from './wiki-guides/economics.js';
import efficiency from './wiki-guides/efficiency.js';
import design from './wiki-guides/design.js';
import identity from './wiki-guides/identity.js';
import execution from './wiki-guides/execution.js';
import data from './wiki-guides/data.js';
import assurance from './wiki-guides/assurance.js';
import security from './wiki-guides/security.js';
import foundations from './wiki-guides/foundations.js';
import { compileGuides } from './wiki-guides/shared.js';

const guides = compileGuides([...identity, ...execution, ...data, ...assurance, ...security, ...foundations, ...economics, ...efficiency, ...design]);
export const guideWikiEntries = guides.entries;
export const guideWikiDepth = guides.depth;
export const guideWikiResearch = guides.research;
