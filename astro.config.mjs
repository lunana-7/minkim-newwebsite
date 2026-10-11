import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';

export default defineConfig({
  site: 'https://minkim.dev',
  trailingSlash: 'never',
  output: 'server',
  adapter: vercel(),
});
