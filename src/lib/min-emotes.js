export const EMOTES = {
  hello: { label: 'Say hello', icon: '👋', asset: '/mini/emotes/hello.png', message: 'Hello! I’m Mini. Nice to see you!', duration: 3200 },
  cake: { label: 'Give a cake', icon: '🍰', asset: '/mini/emotes/cake.png', message: 'A little cake for you. Make a wish!', duration: 10000 },
  icecream: { label: 'Give ice cream', icon: '🍦', asset: '/mini/emotes/icecream.png', message: 'One scoop of happiness, coming up!', duration: 4200 },
  heart: { label: 'Send a heart', icon: '♡', asset: '/mini/emotes/heart.png', message: 'A little love for your day.', duration: 3200 },
};
let active = null, timer;
const emoteImages = new Map();
function emoteImage(kind) {
  if (!emoteImages.has(kind)) {
    const image = new Image();
    image.src = EMOTES[kind].asset;
    emoteImages.set(kind, image);
  }
  return emoteImages.get(kind);
}
export function getEmote() { return active && active.endsAt > Date.now() ? active : null; }
// Every emote is drawn over the walking pose, so Mini can keep moving.
export function emoteAllowsMovement() { return true; }
export function stopEmote(){if(!active)return;clearTimeout(timer);active=null;window.dispatchEvent(new CustomEvent('min-emote-change',{detail:null}));}
export function playEmote(kind) {
  if (!EMOTES[kind]) return;
  active = { kind, endsAt: Date.now() + EMOTES[kind].duration };
  clearTimeout(timer);
  window.dispatchEvent(new CustomEvent('min-emote-change', { detail: active }));
  timer = setTimeout(() => { active = null; window.dispatchEvent(new CustomEvent('min-emote-change', { detail: null })); }, EMOTES[kind].duration);
}
export function drawEmoteProp(context, kind, time, moving = false) {
  if (!EMOTES[kind]) return;
  const image = emoteImage(kind);
  if (!image.complete || !image.naturalWidth) return;
  context.save();
  context.imageSmoothingEnabled = false;
  if (kind === 'cake') {
    const bob = moving ? [0,-1,-2,-1,0,-1][Math.floor(time / 120) % 6] : 0;
    context.drawImage(image, 83, 96 + bob, 50, 50);
  } else if (kind === 'icecream') {
    context.drawImage(image, 89, 91, 44, 53);
  } else if (kind === 'heart') {
    const dy = Math.floor(time / 200) % 3;
    context.drawImage(image, 81, 19 - dy, 42, 42);
  } else if (kind === 'hello') {
    const dy = Math.floor(time / 180) % 2 * 3;
    context.drawImage(image, 88, 65 + dy, 44, 44);
  }
  context.restore();
}
