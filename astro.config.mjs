import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';

export default defineConfig({
  site: 'https://www.datamin.org',
  trailingSlash: 'never',
  output: 'server',
  adapter: vercel(),
});
