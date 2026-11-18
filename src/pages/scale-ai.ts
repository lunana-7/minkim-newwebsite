import type { APIRoute } from 'astro';
import html from '../data/scale-ai/HFC_Growth_Operations.html?raw';

export const prerender = false;

// Preserve the original document, including its inline styles and scripts.
export const GET: APIRoute = () => new Response(html, {
  headers: {
    'Content-Type': 'text/html; charset=utf-8',
    'X-Robots-Tag': 'noindex, nofollow, noarchive',
  },
});
