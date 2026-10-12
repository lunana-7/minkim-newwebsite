import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string().optional().default('Untitled Reflection'),
    date: z.string().optional().default(new Date().toISOString().slice(0, 10)),
    readingTime: z.string().optional().default('3 min read'),
    tags: z.array(z.string()).default([]),
    excerpt: z.string().optional().default('A reflection by Min Kim.'),
    bannerType: z.string().default('geometric-grid'),
    coverImage: z.string().optional(),
    coverAlt: z.string().optional(),
    coverThumbnail: z.string().optional(),
    draft: z.boolean().default(false),
  }).default({}),
});

export const collections = { blog };
