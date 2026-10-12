export const EMOTES = {
  hello: { label: 'Say hello', icon: '👋', message: 'Hello! I’m Mini. Nice to see you!', duration: 3200 },
  cake: { label: 'Give a cake', icon: '🍰', message: 'A little cake for you. Make a wish!', duration: 4200 },
  icecream: { label: 'Give ice cream', icon: '🍦', message: 'One scoop of happiness, coming up!', duration: 4200 },
  heart: { label: 'Send a heart', icon: '♡', message: 'A little love for your day.', duration: 3200 },
};
let active = null, timer;
export function getEmote() { return active && active.endsAt > Date.now() ? active : null; }
export function playEmote(kind) {
  if (!EMOTES[kind]) return;
  active = { kind, endsAt: Date.now() + EMOTES[kind].duration };
  clearTimeout(timer);
  window.dispatchEvent(new CustomEvent('min-emote-change', { detail: active }));
  timer = setTimeout(() => { active = null; window.dispatchEvent(new CustomEvent('min-emote-change', { detail: null })); }, EMOTES[kind].duration);
}
export function drawEmoteProp(context, kind, time) {
  const pixel = (color, x, y, w, h) => { context.fillStyle = color; context.fillRect(x, y, w, h); };
  if (kind === 'cake') {
    pixel('#885a45', 88, 132, 35, 4); pixel('#e6b27e', 92, 114, 26, 18);
    pixel('#fff0d8', 92, 113, 26, 5); pixel('#f5a9bb', 92, 120, 26, 5);
    pixel('#fff0d8', 92, 126, 26, 5); pixel('#c94857', 102, 107, 6, 6);
    pixel('#769558', 105, 103, 2, 4);
  } else if (kind === 'icecream') {
    pixel('#d9a16a', 98, 118, 18, 6); pixel('#d9a16a', 101, 124, 12, 6); pixel('#b47c4f', 104, 130, 6, 6);
    pixel('#fff3d8', 98, 105, 18, 13); pixel('#fff3d8', 102, 97, 10, 9);
    pixel('#f0a6b5', 99, 110, 16, 4); pixel('#fff9eb', 104, 100, 5, 8);
  } else if (kind === 'heart') {
    const dy = Math.floor(time / 200) % 3;
    pixel('#d887a2', 91, 29 - dy, 6, 6); pixel('#d887a2', 101, 29 - dy, 6, 6);
    pixel('#d887a2', 91, 35 - dy, 16, 5); pixel('#d887a2', 95, 40 - dy, 8, 4); pixel('#d887a2', 97, 44 - dy, 4, 3);
  } else if (kind === 'hello') {
    const dy = Math.floor(time / 180) % 2 * 3;
    pixel('#f8d4ae', 100, 83 + dy, 12, 14); pixel('#f8d4ae', 102, 76 + dy, 3, 12);
    pixel('#f8d4ae', 106, 74 + dy, 3, 12); pixel('#f8d4ae', 110, 77 + dy, 3, 12);
    pixel('#ad7758', 99, 87 + dy, 2, 10); pixel('#e0b782', 110, 91 + dy, 3, 6);
    pixel('#d7aa64', 116, 79, 3, 3); pixel('#d7aa64', 121, 84, 3, 3);
  }
}
