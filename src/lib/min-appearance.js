import { getProfile, subscribeProfile } from './min-profile.js';
import { getEmote, drawEmoteProp } from './min-emotes.js';
import { MINI_SIZE, miniLayerPaths } from './min-assets.js';
const decoded = new Map();
let originalWalk = null;
export function getWalkingLook() {
  try { return localStorage.getItem('min-walking-look') === 'styled' ? 'styled' : 'original'; } catch { return 'original'; }
}
export function setWalkingLook(value) {
  try { localStorage.setItem('min-walking-look', value === 'styled' ? 'styled' : 'original'); } catch {}
  paint();
}
let loaded = null, profile = null, revision = 0, initialized = false, lastFrame = 0;
const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
function image(path) {
  if (!path) return Promise.resolve(null);
  if (!decoded.has(path)) decoded.set(path, new Promise((resolve, reject) => {
    const asset = new Image(); asset.onload = () => resolve(asset); asset.onerror = reject; asset.src = path;
  }));
  return decoded.get(path);
}
function arm(context, artwork, sleeve, side, angle, clothed) {
  context.save();
  const shoulder = side === 'left' ? 42 : 86;
  context.translate(shoulder, 123); context.rotate(angle * Math.PI / 180); context.translate(-shoulder, -123);
  if (clothed) {
    // Only the hand is exposed outside a long sleeve; no duplicate bare arm.
    context.drawImage(artwork, 0, 148, 128, 11, side === 'left' ? -4 : 4, 148, 128, 11);
  } else context.drawImage(artwork, 0, 0);
  if (sleeve) context.drawImage(sleeve, 0, 0);
  context.restore();
}
function body(context, artwork, walking, frame) {
  if (!walking) { context.drawImage(artwork, 0, 0); return; }
  context.drawImage(artwork, 0, 0, 128, 164, 0, 0, 128, 164);
  const leftLift = [0, 1, 2, 1, 0, 0][frame], rightLift = [2, 1, 0, 0, 0, 1][frame];
  context.drawImage(artwork, 0, 164, 64, 28, -leftLift / 2, 164 - leftLift, 64, 28);
  context.drawImage(artwork, 64, 164, 64, 28, 64 + rightLift / 2, 164 - rightLift, 64, 28);
}
function draw(context, parts, pose, time) {
  const animated = !reducedMotion();
  const frame = animated ? Math.floor(time / 120) % 6 : 0;
  const walking = pose === 'walk' && animated;
  const bob = walking && (frame === 1 || frame === 4) ? -1 : 0;
  const sway = walking ? [0, 1, 1, 0, -1, -1][frame] : 0;
  context.clearRect(0, 0, MINI_SIZE.width, MINI_SIZE.height); context.imageSmoothingEnabled = false;
  context.save(); context.translate(0, bob);
  context.drawImage(parts.hairBack, sway, 0);
  body(context, parts.body, walking, frame);
  context.drawImage(parts.clothes, 0, 0);
  context.drawImage(parts.face, 0, 0);
  context.drawImage(parts.eyes, 0, pose === 'study' ? 1 : 0);
  let left = walking ? [12, 5, -10, -12, -5, 10][frame] : 0;
  let right = -left;
  if (pose === 'coffee') { left = -135; right = 135; }
  if (pose === 'tuna') { left = -132; right = 42; }
  if (pose === 'study') { left = -20; right = 20; }
  if (pose === 'jump') { left = -35; right = 35; }
  if (pose === 'hello') { right = -105 - (frame % 2) * 20; }
  if (pose === 'cake' || pose === 'icecream') { right = -65; }
  const clothed = ['berry','meadow'].includes(parts.outfit);
  arm(context, parts.leftArm, parts.leftSleeve, 'left', left, clothed); arm(context, parts.rightArm, parts.rightSleeve, 'right', right, clothed);
  context.drawImage(parts.hairFront, sway, 0);
  if (parts.hat) context.drawImage(parts.hat, 0, 0);
  if (parts.prop && ['coffee','tuna','study'].includes(pose)) {
    context.drawImage(parts.prop, 0, animated && pose === 'coffee' && frame < 3 ? -1 : 0);
  }
  context.restore();
}
function drawOriginalWalk(context, pose, time) {
  const moving = pose === 'walk' && !reducedMotion();
  const frame = originalWalk[moving ? Math.floor(time / 120) % 6 : pose === 'jump' ? 2 : 0];
  // One scale across all six poses keeps the face and body from pulsing.
  const scale = Math.min(116 / Math.max(...originalWalk.map(art => art.width)), 180 / Math.max(...originalWalk.map(art => art.height)));
  const width = Math.round(frame.width * scale), height = Math.round(frame.height * scale);
  context.clearRect(0, 0, MINI_SIZE.width, MINI_SIZE.height); context.imageSmoothingEnabled = false;
  context.drawImage(frame, Math.round((MINI_SIZE.width - width) / 2), MINI_SIZE.height - height - 2, width, height);
}
function paint(time = performance.now()) {
  if (!loaded || !profile) return;
  for (const element of document.querySelectorAll('[data-min-appearance]')) {
    const emote = getEmote();
    const pose = profile.activeActivity?.kind || emote?.kind || element.dataset.controlledPose || (element.classList.contains('min-appearance-companion') && document.getElementById('min-companion-menu')?.hidden ? 'walk' : 'idle');
    element.dataset.pose = pose;
    const context = element.querySelector('canvas').getContext('2d');
    if (originalWalk && getWalkingLook() === 'original' && (element.classList.contains('min-appearance-companion') || element.classList.contains('min-appearance-adventure')) && !profile.activeActivity) drawOriginalWalk(context, pose, time);
    else draw(context, loaded, pose, time);
    if (emote && !profile.activeActivity) drawEmoteProp(context, emote.kind, time);
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
