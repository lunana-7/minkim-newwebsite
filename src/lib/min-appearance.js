import { getProfile, subscribeProfile } from './min-profile.js';
import { getEmote, drawEmoteProp } from './min-emotes.js';
import { MINI_SIZE, miniLayerPaths } from './min-assets.js';
const decoded = new Map();
let originalWalk = null;
// Compatibility exports: there is now one shared appearance, not two character styles.
export function getWalkingLook() { return 'styled'; }
export function setWalkingLook() { paint(); }
let loaded = null, profile = null, revision = 0, initialized = false, lastFrame = 0;
const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
function image(path) {
  if (!path) return Promise.resolve(null);
  if (!decoded.has(path)) decoded.set(path, new Promise((resolve, reject) => {
    const asset = new Image(); asset.onload = () => resolve(asset); asset.onerror = reject; asset.src = path;
  }));
  return decoded.get(path);
}
function draw(context, parts, pose, time) {
  const animated = !reducedMotion(), moving = pose === 'walk' && animated;
  const activity = ['coffee','tuna','study','cafe-study'].includes(pose);
  const cycle = animated ? (time % 2200) / 2200 : 0;
  const lift = activity && animated ? (1 - Math.cos(cycle * Math.PI * 2)) / 2 : 0;
  const frame = animated ? Math.floor(time / 120) % 6 : 0;
  context.clearRect(0,0,MINI_SIZE.width,MINI_SIZE.height);context.imageSmoothingEnabled=false;
  context.save();context.translate(0,activity ? -Math.round(lift*2) : 0);
  if (profile.hair === 'ombre' && profile.outfit === 'classic') {
    drawOriginalWalk(context,pose,time);
  } else {
    const bob=moving ? [0,-1,-2,-1,0,-1][frame] : 0;
    context.save();context.translate(0,bob);
    if (moving) {
      context.drawImage(parts.skin,0,0,128,164,0,0,128,164);
      const left=[0,2,4,2,0,0][frame],right=[4,2,0,0,0,2][frame];
      context.drawImage(parts.skin,0,164,64,28,-left/2,164-left,64,28);
      context.drawImage(parts.skin,64,164,64,28,64+right/2,164-right,64,28);
    } else context.drawImage(parts.skin,0,0);
    context.restore();
  }
  decorateFace(context, profile);
  if(parts.hat)context.drawImage(parts.hat,0,-3);
  if(activity) {
    const kind=pose==='cafe-study'?'study':pose;
    const prop=kind==='study'?parts.studyProp:parts.prop;
    if(prop){context.save();context.translate(0,-8);drawActivity(context,prop,kind,lift,cycle,time,animated);context.restore();}
  }
  context.restore();
}
function decorateFace(context, look) {
  // Color/cheek choices preserve the same outline, eye size and expression.
  if(look.eyes!=='brown') {
    const data=context.getImageData(0,0,128,192),pixels=data.data;
    for(const [x0,y0,x1,y1] of [[58,77,75,87],[99,75,108,85]]) for(let y=y0;y<y1;y++)for(let x=x0;x<x1;x++){
      const i=(y*128+x)*4,r=pixels[i],g=pixels[i+1],b=pixels[i+2];
      if(pixels[i+3]&&r>35&&r<150&&g<110&&b<95&&r>g*1.12){
        if(look.eyes==='blue'){pixels[i]=Math.round(r*.55);pixels[i+1]=Math.min(180,Math.round(g*1.4));pixels[i+2]=Math.min(210,Math.round(b*1.8+45));}
        else {pixels[i]=Math.round(r*.8);pixels[i+1]=Math.min(170,Math.round(g*1.4+12));pixels[i+2]=Math.round(b*.8);}
      }
    }
    context.putImageData(data,0,0);
  }
  if(look.face==='rosy'){context.globalAlpha=.35;context.fillStyle='#e995a0';context.fillRect(52,88,9,4);context.fillRect(100,86,6,4);context.globalAlpha=1;}
  if(look.face==='freckles'){context.fillStyle='#b47d61';for(const [x,y] of [[54,88],[58,90],[62,88],[101,86],[104,88]])context.fillRect(x,y,1,1);}
}
function drawActivity(context, prop, pose, lift, cycle, time, animated) {
  const pixel = (color, x, y, w, h) => { context.fillStyle = color; context.fillRect(Math.round(x), Math.round(y), w, h); };
  if (pose === 'coffee') {
    context.drawImage(prop, 0, -Math.round(lift * 15));
    // Steam curls drift above the cup as Mini raises it for a sip.
    for (let i = 0; i < 3; i++) {
      const drift = animated ? (time / 110 + i * 4) % 13 : i * 3;
      context.globalAlpha = .65 * (1 - drift / 16);
      pixel('#fff4df', 58 + i * 5 + Math.sin(drift) * 2, 97 - lift * 15 - drift, 2, 4);
    }
  } else if (pose === 'tuna') {
    // The bowl stays in one hand; chopsticks carry a bite toward her mouth.
    context.drawImage(prop, 0, 127, 128, 65, 0, 127, 128, 65);
    const biteX = 73 - lift * 10, biteY = 128 - lift * 27;
    pixel('#805337', biteX, biteY - 5, 20, 2);
    pixel('#d6a16a', biteX, biteY - 2, 20, 2);
    if (lift < .92) { pixel('#fff1d4', biteX - 2, biteY, 7, 4); pixel('#e7958f', biteX, biteY, 4, 2); }
    if (lift > .8 && animated) pixel('#dd7d82', 61, 104, frameMouth(time), 2);
  } else {
    context.drawImage(prop, 0, 0);
    // A bright page turns across the open book, then settles into place.
    if (animated && cycle > .45 && cycle < .85) {
      const page = (cycle - .45) / .4;
      context.fillStyle = '#fff0cf';
      context.beginPath(); context.moveTo(64, 137); context.lineTo(64 + Math.cos(page * Math.PI) * 15, 129 - Math.sin(page * Math.PI) * 6); context.lineTo(64 + Math.cos(page * Math.PI) * 15, 148); context.lineTo(64, 156); context.fill();
      pixel('#bd9a65', 63, 137, 1, 18);
    }
    pixel('#e8cc7e', 99, 72 - Math.round(lift * 4), 2, 7);
    pixel('#e8cc7e', 96, 75 - Math.round(lift * 4), 8, 2);
  }
  context.globalAlpha = 1;
  // Hearts rise in a staggered loop, staying clear of the face and hair.
  for (let i = 0; i < 3; i++) {
    const progress = animated ? (time / 2300 + i / 3) % 1 : .35 + i * .18;
    const x = i === 1 ? 8 : 103 + (i === 2 ? 8 : 0), y = 70 - progress * 48;
    context.globalAlpha = animated ? Math.sin(progress * Math.PI) * .9 : .7;
    pixel('#d887a2', x, y, 3, 3); pixel('#d887a2', x + 5, y, 3, 3);
    pixel('#eaa5b7', x, y + 3, 8, 3); pixel('#eaa5b7', x + 2, y + 6, 4, 2); pixel('#eaa5b7', x + 3, y + 8, 2, 1);
  }
  context.globalAlpha = 1;
}
function frameMouth(time) { return Math.floor(time / 140) % 2 ? 5 : 3; }
function drawOriginalWalk(context, pose, time) {
  const moving = pose === 'walk' && !reducedMotion();
  const frame = originalWalk[moving ? Math.floor(time / 120) % 6 : pose === 'jump' ? 2 : 0];
  // One scale across all six poses keeps the face and body from pulsing.
  const scale = Math.min(116 / Math.max(...originalWalk.map(art => art.width)), 180 / Math.max(...originalWalk.map(art => art.height)));
  const width = Math.round(frame.width * scale), height = Math.round(frame.height * scale);
  context.imageSmoothingEnabled = false;
  context.drawImage(frame, Math.round((MINI_SIZE.width - width) / 2), MINI_SIZE.height - height - 2, width, height);
}
function paint(time = performance.now()) {
  if (!loaded || !profile) return;
  for (const element of document.querySelectorAll('[data-min-appearance]')) {
    const emote = getEmote();
    const previewKind = element.closest('[data-min-activity-preview]')?.dataset.minActivityPreview;
    const pose = previewKind ? (profile.activeActivity?.kind === previewKind ? previewKind : 'idle') : profile.activeActivity?.kind || emote?.kind || element.dataset.controlledPose || (element.classList.contains('min-appearance-companion') && document.getElementById('min-companion-menu')?.hidden ? 'walk' : 'idle');
    element.dataset.pose = pose;
    const context = element.querySelector('canvas').getContext('2d');
    draw(context, loaded, pose, time);
    if (emote && !profile.activeActivity && !previewKind) drawEmoteProp(context, emote.kind, time);
    element.dataset.rigReady = 'true';
  }
}
export async function renderAppearances(next = getProfile()) {
  profile = next;
  const token = ++revision;
  for (const element of document.querySelectorAll('[data-min-appearance]')) {
    for (const field of ['outfit','hair','eyes','face','hat']) element.dataset[field] = next[field];
  }
  try {
    const paths = miniLayerPaths(next);
    if (!originalWalk) originalWalk = await Promise.all(Array.from({ length: 6 }, (_, frame) => image(`/mini/walk/frame-${frame}.png?v=walk-2`)));
    const entries = await Promise.all(Object.entries(paths).map(async ([name, path]) => [name, await image(path)]));
    if (token !== revision) return;
    loaded = { ...Object.fromEntries(entries), outfit: next.outfit }; paint();
  } catch {
    // Keep the complete previous character or original art if a layer is unavailable.
  }
}
function animate(time) {
  if (time - lastFrame > 80 && !document.hidden) { lastFrame = time; paint(time); }
  requestAnimationFrame(animate);
}
export function initAppearances() {
  if (initialized) return; initialized = true;
  subscribeProfile(renderAppearances); requestAnimationFrame(animate);
}
