import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    date: z.string(),
    readingTime: z.string().optional().default('5 min read'),
    tags: z.array(z.string()).default([]),
    excerpt: z.string(),
    bannerType: z.string().default('geometric-grid'),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
