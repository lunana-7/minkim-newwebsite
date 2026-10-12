// Draw small, registered pixel accessories and matching close-up wardrobe icons.
// The 128 × 192 canvas shares the placement used by the existing hat layers.
import { mkdir, writeFile } from 'node:fs/promises';

const layerDir = new URL('../public/mini/layers/', import.meta.url);
const thumbDir = new URL('../public/mini/thumbnails/', import.meta.url);
await Promise.all([mkdir(layerDir, { recursive: true }), mkdir(thumbDir, { recursive: true })]);

const accessories = {
  ribbon: {
    crop: '78 34 38 40',
    art: `<path fill="#55374b" d="M89 47h8v-5h6v-4h10v5h3v13h-4v5h-9v-4h-6v7h-7v-7h-7v4h-7V48h7v-5h6z"/>
      <path fill="#de83a4" d="M83 48h7v-3h8v5h5v-5h4v-4h5v5h2v8h-3v4h-5v-5h-6v2h-6v-3h-7v5h-5z"/>
      <path fill="#f5b5c6" d="M84 48h7v-3h7v3h-7v5h-7zm23-5h5v4h-5v4h-4v-5h4z"/>
      <path fill="#ae5276" d="M83 55h6v-3h7v4h-5v3h-8zm21-2h7v4h-5v-3h-3v9h-4v-9z"/>
      <path fill="#fff0dc" d="M98 49h6v6h-6z"/><path fill="#e5bd79" d="M99 50h4v4h-4z"/>`,
  },
  strawberry: {
    crop: '87 30 29 38',
    offsetY: -13,
    art: `<path fill="#634844" d="M91 57h4v-5h5v-4h7v4h5v5h4v12h-4v6h-5v4h-9v-4h-5v-6h-3V57z"/>
      <path fill="#cf526b" d="M94 58h5v-4h9v4h5v11h-4v5h-10v-4h-5z"/>
      <path fill="#f28ca0" d="M95 58h4v-3h8v3h-6v5h-6z"/>
      <path fill="#9b3d53" d="M105 66h7v4h-4v4h-7v-3h4z"/>
      <path fill="#507956" d="M94 52h6v-5h4v5h6v4h-6v3h-5v-3h-5z"/>
      <path fill="#a9c483" d="M98 50h4v4h-4z"/>
      <path fill="#ffe5aa" d="M98 62h2v3h-2zm7 0h2v3h-2zm-4 7h2v3h-2z"/>
      <path fill="#d9a66c" d="M88 74h7v3h-7z"/>`,
  },
  moon: {
    crop: '30 8 73 41',
    art: `<path fill="#59465b" d="M34 33h8v-6h8v-4h12v-3h16v3h11v4h8v6h4v7h-7v-4h-8v-4H48v4h-8v4h-7z"/>
      <path fill="#e5be7d" d="M36 32h8v-5h8v-3h12v-3h12v3h11v3h8v5h4v4h-7v-4h-9v-4H52v4h-9v4h-7z"/>
      <path fill="#fff0be" d="M39 31h8v-4h11v-3h18v3h11v4h7v2h-11v-4H51v4H39z"/>
      <path fill="#765a8b" d="M62 18h4v-7h5v4h-2v4h-3v4h-4z"/>
      <path fill="#d3c3ee" d="M65 13h4v3h-2v3h-3v-3h1z"/>
      <path fill="#fff5d9" d="M73 12h4v5h-4zm-4-4h3v3h-3zM50 22h3v3h-3zm34 0h3v3h-3z"/>
      <path fill="#bc94d0" d="M47 29h5v4h-5zm37 0h5v4h-5z"/>`,
  },
  wreath: {
    crop: '24 10 80 45',
    art: `<path fill="#465947" d="M27 39h8v-9h7v-7h11v-5h23v4h12v7h9v10h-7v-7h-8v-6H49v4h-8v8h-7v7h-7z"/>
      <path fill="#7c9f67" d="M29 36h8v-8h9v-6h9v-4h10v4h10v-3h9v7h9v9h-6v-7h-9v-4h-9v3H53v-2h-8v7h-9v7h-7z"/>
      <path fill="#b7ce8b" d="M35 29h7v-6h8v4h-8v7h-7zm24-10h10v4H59zm20 2h7v7h-5v-4h-2z"/>
      <path fill="#e2a8bd" d="M40 26h4v-4h4v4h4v4h-4v4h-4v-4h-4zm34-5h4v-4h4v4h4v4h-4v4h-4v-4h-4z"/>
      <path fill="#fff1c7" d="M44 26h4v4h-4zm34-5h4v4h-4z"/>
      <path fill="#faf3de" d="M87 31h3v3h-3zM55 18h3v3h-3z"/>`,
  },
  cloud: {
    crop: '24 6 82 44',
    art: `<path fill="#4b5269" d="M25 31h7v-9h8v-8h11V9h33v4h11v8h8v12h4v12H94v-4H37v4H25z"/>
      <path fill="#a4b8d6" d="M28 31h7v-9h8v-7h10v-4h29v4h11v8h7v10h4v8H96v-5H37v5h-9z"/>
      <path fill="#d8dff0" d="M33 29h7v-8h10v-7h25v4h10v7h9v6h-8v-7H52v3H39v8h-6z"/>
      <path fill="#7089b0" d="M28 37h73v6H28zm9-7h7v7h-7zm52-3h8v9h-8z"/>
      <path fill="#fff4e7" d="M53 17h14v3H53zm-11 7h7v3h-7z"/>
      <path fill="#f0aebf" d="M64 36h10v5H64z"/>`,
  },
  pearl: {
    crop: '84 37 34 33',
    offsetY: -6,
    art: `<path fill="#634b55" d="M86 58h4v-6h5v-4h15v4h6v7h-4v6h-6v4H94v-4h-8z"/>
      <path fill="#d0a267" d="M88 57h5v-5h5v-2h9v3h6v5h-5v5H94v-4h-6z"/>
      <path fill="#fff5e7" d="M91 55h6v6h-6zm7-4h7v7h-7zm8 4h6v6h-6z"/>
      <path fill="#e9cccb" d="M92 59h5v2h-5zm8-2h5v2h-5zm8 2h4v2h-4z"/>
      <path fill="#aa788c" d="M98 61h8v5h-8z"/>`,
  },
  cat: {
    crop: '27 2 75 45',
    art: `<path fill="#604955" d="M30 8h7v-5h8v5h5v12h26V8h6V3h9v5h7v27h-7v-7h-9v-5H48v4h-9v8h-9z"/>
      <path fill="#ead4b8" d="M33 9h7V6h4v4h4v13h30V10h5V6h6v4h6v24h-6v-8h-8v-6H47v6h-9v8h-5z"/>
      <path fill="#f3a8b5" d="M37 12h5v5h4v7h-7v-6h-2zm47 0h5v6h3v7h-7v-7h-1z"/>
      <path fill="#fff1df" d="M34 28h8v-6h7v-3h29v3h8v6h7v6h-7v-5H41v5h-7z"/>
      <path fill="#bd9b86" d="M42 30h44v4H42z"/>`,
  },
};

function svg(viewBox, art) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" width="${viewBox === '0 0 128 192' ? 128 : 64}" height="${viewBox === '0 0 128 192' ? 192 : 64}" shape-rendering="crispEdges" aria-hidden="true">${art}</svg>\n`;
}
for (const [name, { crop, art, offsetY = 0 }] of Object.entries(accessories)) {
  const alignedArt = offsetY ? `<g transform="translate(0 ${offsetY})">${art}</g>` : art;
  await Promise.all([
    writeFile(new URL(`hat-${name}.svg`, layerDir), svg('0 0 128 192', alignedArt)),
    writeFile(new URL(`hat-${name}.svg`, thumbDir), svg(crop, alignedArt)),
  ]);
}
