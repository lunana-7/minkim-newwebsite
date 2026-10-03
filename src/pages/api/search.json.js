import { getCollection } from 'astro:content';

export async function GET() {
  const posts = await getCollection('blog');
  const searchIndex = posts.map(post => ({
    title: post.data.title,
    slug: post.id.replace(/\.(md|mdx)$/, ''),
    excerpt: post.data.excerpt,
    tags: post.data.tags,
    date: post.data.date,
  }));

  return new Response(JSON.stringify(searchIndex), {
    headers: { 'Content-Type': 'application/json' },
  });
}
