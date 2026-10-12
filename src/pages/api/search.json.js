import { getCollection } from 'astro:content';
import { wikiEntries } from '../../wiki.js';

export async function GET() {
  const posts = await getCollection('blog');
  const searchIndex = [
    ...posts.map(post => ({ title: post.data.title, url: `/blog/${post.id.replace(/\.(md|mdx)$/, '')}`, type: 'Blog', excerpt: post.data.excerpt, tags: post.data.tags })),
    ...wikiEntries.map(entry => ({ title: entry.title, url: `/wiki/${entry.slug}`, type: 'Wiki', excerpt: entry.summary, tags: [entry.category, ...entry.related, ...(entry.slug === 'policy-information-point' ? ['PIP', 'PDP', 'PEP', 'PAP'] : [])] })),
  ];
  return Response.json(searchIndex);
}
