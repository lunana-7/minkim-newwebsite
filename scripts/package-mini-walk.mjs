// Isolate each original walking frame from neighbouring-cell fragments.
// Preserve artwork and native proportions; only trim transparent padding.
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('../', import.meta.url));
const source = `${root}public/pixel-min-walk.png`;
const meta = await sharp(source).metadata();
await mkdir(`${root}public/mini/walk`, { recursive: true });
for (let frame = 0; frame < 6; frame++) {
  const left = Math.round(frame * meta.width / 6), right = Math.round((frame + 1) * meta.width / 6);
  const { data, info } = await sharp(source).extract({ left, top: 0, width: right - left, height: meta.height }).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height } = info;
  const visited = new Uint8Array(width * height); let largest = [];
  for (let i = 0; i < visited.length; i++) {
    if (visited[i] || data[i * 4 + 3] <= 128) continue;
    const component = [i]; visited[i] = 1;
    for (let q = 0; q < component.length; q++) {
      const current = component[q], x = current % width, y = Math.floor(current / width);
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
        const nx = x + dx, ny = y + dy;
        if (nx < 0 || nx >= width || ny < 0 || ny >= height) continue;
        const next = ny * width + nx;
        if (!visited[next] && data[next * 4 + 3] > 128) { visited[next] = 1; component.push(next); }
      }
    }
    if (component.length > largest.length) largest = component;
  }
  const mask = new Uint8Array(width * height); let x0 = width, y0 = height, x1 = 0, y1 = 0;
  for (const i of largest) { mask[i] = 1; const x = i % width, y = Math.floor(i / width); x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y); }
  for (let i = 0; i < mask.length; i++) if (!mask[i]) data[i * 4 + 3] = 0;
  await sharp(data, { raw: { width, height, channels: 4 } }).extract({ left: x0, top: y0, width: x1 - x0 + 1, height: y1 - y0 + 1 }).png().toFile(`${root}public/mini/walk/frame-${frame}.png`);
}
console.log('Saved six original walking poses without adjacent-frame fragments.');
