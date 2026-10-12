import { getCollection } from 'astro:content';
import { wikiEntries } from '../../wiki.js';
import { wikiDepth } from '../../wiki-depth.js';
import { wikiResearch } from '../../wiki-research.js';

const readable = value => String(value || '')
  .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
  .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
  .replace(/[#*_>`~|]/g, ' ')
  .replace(/\s+/g, ' ').trim();
const textFields = value => {
  if (typeof value === 'string') return value;
  if (Array.isArray(value)) return value.map(textFields).join(' ');
  if (value && typeof value === 'object') return Object.values(value).map(textFields).join(' ');
  return '';
};

export async function GET() {
  const posts = await getCollection('blog');
  const searchIndex = [
    ...posts.map(post => ({ title: post.data.title, url: `/blog/${post.id.replace(/\.(md|mdx)$/, '')}`, type: 'Blog', excerpt: post.data.excerpt, tags: post.data.tags, content: readable(post.body) })),
    ...wikiEntries.map(entry => ({ title: entry.title, url: `/wiki/${entry.slug}`, type: 'Wiki', excerpt: entry.summary, tags: [entry.category, ...(entry.aliases || []), ...entry.related, ...(entry.slug === 'policy-information-point' ? ['PIP', 'PDP', 'PEP', 'PAP'] : [])], content: readable(textFields([entry.question, entry.definition, entry.sourceNote, entry.scope, entry.practical, entry.example, entry.pitfalls, wikiDepth[entry.slug], wikiResearch[entry.slug]])) })),
  ];
  return Response.json(searchIndex, { headers: { 'Cache-Control': 'public, max-age=300' } });
}
