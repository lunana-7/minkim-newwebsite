import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
import { readFile } from 'node:fs/promises';
const root = fileURLToPath(new URL('../', import.meta.url));
const manifest = JSON.parse(await readFile(`${root}artwork/blog/manifest.json`, 'utf8'));
for (const asset of manifest.assets) {
  const base = `${root}public/blog-art/${asset.slug}`;
  await sharp(`${base}.png`).webp({ quality: 92, effort: 6 }).toFile(`${base}.webp`);
  await sharp(`${base}.png`).resize({ width: 480, kernel: 'nearest' }).webp({ quality: 92, effort: 6 }).toFile(`${base}-thumb.webp`);
}
console.log('Packaged three article covers and three smaller journal thumbnails.');
