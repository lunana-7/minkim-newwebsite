import { drawMiniEffect } from './min-effects.js';
import { getProfile, subscribeProfile } from './min-profile.js';
import { getEmote, drawEmoteProp, emoteAllowsMovement } from './min-emotes.js';
import { MINI_SIZE, miniLayerPaths, miniWalkPaths } from './min-assets.js';
const decoded = new Map();
let originalWalk = null;
let caughtCanvas;
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
  const look=parts.look||profile;
  if((moving||pose==='jump')&&parts.walk){context.drawImage(parts.walk[pose==='jump'?2:frame],0,0);}
  else if(look.hair==='ombre'&&look.outfit==='classic'){drawOriginalWalk(context,pose,time);}
  else context.drawImage(parts.skin,0,0);
  decorateFace(context,look);
  if(parts.hat)context.drawImage(parts.hat,32,-3);
  if(activity) {
    const kind=pose==='cafe-study'?'study':pose;
    const prop=kind==='study'?parts.studyProp:kind==='coffee'?parts.coffeeProp:parts.prop;
    if(prop){context.save();context.translate(32,-8);drawActivity(context,prop,kind,lift,cycle,time,animated);context.restore();}
  }
  context.restore();
}
function decorateFace(context, look) {
  // Color/cheek choices preserve the same outline, eye size and expression.
  if(look.eyes!=='brown') {
    const data=context.getImageData(0,0,192,192),pixels=data.data;
    for(const [x0,y0,x1,y1] of [[88,74,109,88],[132,74,145,88]]) for(let y=y0;y<y1;y++)for(let x=x0;x<x1;x++){
      const i=(y*192+x)*4,r=pixels[i],g=pixels[i+1],b=pixels[i+2];
      if(pixels[i+3]&&r>35&&r<150&&g<110&&b<95&&r>g*1.12){
        if(look.eyes==='blue'){pixels[i]=Math.round(r*.55);pixels[i+1]=Math.min(180,Math.round(g*1.4));pixels[i+2]=Math.min(210,Math.round(b*1.8+45));}
        else {pixels[i]=Math.round(r*.8);pixels[i+1]=Math.min(170,Math.round(g*1.4+12));pixels[i+2]=Math.round(b*.8);}
      }
    }
    context.putImageData(data,0,0);
  }
  if(look.face==='rosy'){context.globalAlpha=.35;context.fillStyle='#e995a0';context.fillRect(85,88,9,4);context.fillRect(134,86,6,4);context.globalAlpha=1;}
  if(look.face==='freckles'){context.fillStyle='#b47d61';for(const [x,y] of [[87,88],[91,90],[95,88],[135,86],[138,88]])context.fillRect(x,y,1,1);}
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
  // All walk frames are baked to the same canvas and ground pivot.
  context.imageSmoothingEnabled=false;context.drawImage(frame,0,0);
}
function drawStruggle(context,time){
  if(reducedMotion())return;
  caughtCanvas ||= Object.assign(document.createElement('canvas'),{width:192,height:192});
  const copy=caughtCanvas.getContext('2d');copy.clearRect(0,0,192,192);copy.drawImage(context.canvas,0,0);
  const kick=Math.sin(time/85),other=Math.sin(time/85+Math.PI);
  context.clearRect(0,164,192,28);context.imageSmoothingEnabled=false;
  context.drawImage(caughtCanvas,0,164,96,28,Math.round(kick*3),164-Math.round(Math.max(0,kick)*9),96,28);
  context.drawImage(caughtCanvas,96,164,96,28,96+Math.round(other*3),164-Math.round(Math.max(0,other)*9),96,28);
  // Tiny flailing hands stay below the face; the original head and hair stay intact.
  context.fillStyle='#f8d4ae';context.fillRect(60,124-Math.round(kick*4),8,6);context.fillRect(139,123-Math.round(other*4),8,6);
  context.fillStyle='#a9d6e1';context.fillRect(22,70+Math.round(Math.sin(time/180)*3),3,7);context.fillRect(20,74+Math.round(Math.sin(time/180)*3),7,3);
}
function paint(time = performance.now()) {
  if (!loaded || !profile) return;
  for (const element of document.querySelectorAll('[data-min-appearance]')) {
    const emote = getEmote();
    const previewKind = element.closest('[data-min-activity-preview]')?.dataset.minActivityPreview;
    const interaction=element.dataset.interactionPose;
    const pose = interaction==='held'||interaction==='parachute'||interaction==='fall' ? 'idle' : interaction==='climb' ? 'walk' : previewKind ? (profile.activeActivity?.kind === previewKind ? previewKind : 'idle') : profile.activeActivity?.kind || (!emoteAllowsMovement(emote) ? emote.kind : null) || element.dataset.controlledPose || (element.classList.contains('min-appearance-companion') && document.getElementById('min-companion-menu')?.hidden ? 'walk' : 'idle');
    element.dataset.pose = pose;
    const context = element.querySelector('canvas').getContext('2d');
    draw(context, loaded, pose, time);
    if(interaction==='held'||interaction==='parachute')drawStruggle(context,time);
    if (emote && !profile.activeActivity && !previewKind && !interaction) {context.save();context.translate(32,0);drawEmoteProp(context, emote.kind, reducedMotion() ? 0 : time, pose === 'walk');context.restore();}
    const fx=element.querySelector('.min-effect-canvas');if(fx){const fxContext=fx.getContext('2d');fxContext.clearRect(0,0,192,256);drawMiniEffect(fxContext,profile.effect,time,reducedMotion());}
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
    if (!originalWalk) originalWalk = await Promise.all(Array.from({ length: 6 }, (_, frame) => image(`/mini/rig-v2/walk-${frame}.png?v=rig-2-final`)));
    const [entries,walk] = await Promise.all([Promise.all(Object.entries(paths).map(async ([name,path])=>[name,await image(path)])),Promise.all(miniWalkPaths(next).map(image))]);
    if (token !== revision) return;
    loaded = { ...Object.fromEntries(entries), outfit: next.outfit,walk,look:{...next} }; paint();
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
