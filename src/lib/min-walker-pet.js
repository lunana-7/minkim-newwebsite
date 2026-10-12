import { getProfile, subscribeProfile } from './min-profile.js';
import { drawPet, petName } from './min-pets.js';

export function initWalkerPet({ walker, menu }) {
  const button = document.getElementById('min-walker-pet');
  if (!button) return;
  document.body.append(button);
  const canvas = button.querySelector('canvas');
  const ctx = canvas.getContext('2d');
  const speech = button.querySelector('.min-walker-pet-speech');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let pet = getProfile().pet;
  let alive = true;
  let frame = 0;
  let soundTimer = 0;
  let nextSoundTimer = 0;
  let position = null;
  let lastPaint = 0;
  let lastWalkerX = null;
  let facing = 1;
  let side = 'right';
  let pointer = null;
  let dragged = false;
  let suppressClick = false;
  let releasedAt = 0;

  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const sound = () => pet.kind === 'cat' ? 'Meow!' : 'Woof woof!';
  function hideSound() {
    clearTimeout(soundTimer);
    speech.classList.remove('is-visible');
  }
  function showSound() {
    if (button.hidden || document.hidden || !menu.hidden) return;
    speech.textContent = sound();
    speech.classList.add('is-visible');
    clearTimeout(soundTimer);
    soundTimer = setTimeout(hideSound, 2300);
  }
  function scheduleSound() {
    clearTimeout(nextSoundTimer);
    nextSoundTimer = setTimeout(() => {
      if (document.getElementById('min-chatter-toggle')?.checked && !walker.classList.contains('is-chatting')) showSound();
      if (alive) scheduleSound();
    }, 22000 + Math.random() * 18000);
  }
  function place(x, y) {
    const width = button.offsetWidth, height = button.offsetHeight;
    position = { x: clamp(x, 4, Math.max(4, innerWidth - width - 4)), y: clamp(y, 4, Math.max(4, innerHeight - height - 4)) };
    button.style.left = `${position.x}px`;
    button.style.top = `${position.y}px`;
  }
  function followTarget() {
    const box = walker.getBoundingClientRect();
    const width = button.offsetWidth, height = button.offsetHeight;
    if (lastWalkerX !== null && Math.abs(box.left - lastWalkerX) > .2) facing = Math.sign(box.left - lastWalkerX);
    lastWalkerX = box.left;
    if (box.right + width > innerWidth - 8) side = 'left';
    else if (box.left - width < 8) side = 'right';
    return {
      x: clamp(side === 'right' ? box.right - 3 : box.left - width + 3, 4, Math.max(4, innerWidth - width - 4)),
      y: clamp(box.bottom - height + 4, 4, Math.max(4, innerHeight - height - 4))
    };
  }

  const unsubscribe = subscribeProfile(profile => {
    const previousKind = pet.kind;
    pet = profile.pet;
    button.hidden = pet.kind === 'none' || !pet.follow;
    button.setAttribute('aria-label', `${petName(pet)}, Mini’s ${pet.kind}. Drag to place separately; ${sound()} on click`);
    button.title = `Drag ${petName(pet)} to a spot. ${petName(pet)} will follow Mini again.`;
    if (button.hidden || previousKind !== pet.kind) hideSound();
    if (previousKind !== pet.kind) position = null;
  });

  button.addEventListener('pointerdown', event => {
    if (!event.isPrimary || event.button !== 0 || button.hidden) return;
    event.preventDefault();
    hideSound();
    const rect = button.getBoundingClientRect();
    pointer = { id:event.pointerId, startX:event.clientX, startY:event.clientY, offsetX:event.clientX - rect.left, offsetY:event.clientY - rect.top };
    dragged = false;
    suppressClick = false;
    button.setPointerCapture(event.pointerId);
  });
  button.addEventListener('pointermove', event => {
    if (!pointer || event.pointerId !== pointer.id) return;
    if (!dragged && Math.hypot(event.clientX - pointer.startX, event.clientY - pointer.startY) < 5) return;
    dragged = true;
    event.preventDefault();
    button.classList.add('is-pet-held');
    place(event.clientX - pointer.offsetX, event.clientY - pointer.offsetY);
  });
  function release(event) {
    if (!pointer || event.pointerId !== pointer.id) return;
    const id = pointer.id;
    pointer = null;
    if (button.hasPointerCapture(id)) button.releasePointerCapture(id);
    if (dragged) {
      suppressClick = true;
      releasedAt = performance.now();
      button.classList.remove('is-pet-held');
    }
  }
  for (const type of ['pointerup', 'pointercancel', 'lostpointercapture']) button.addEventListener(type, release);
  button.addEventListener('click', event => {
    if (suppressClick) { event.preventDefault(); suppressClick = false; return; }
    showSound();
  });
  button.addEventListener('dragstart', event => event.preventDefault());

  function paint(now) {
    if (!alive) return;
    const dt = Math.min(.05, (now - (lastPaint || now)) / 1000);
    lastPaint = now;
    if (!button.hidden) {
      const target = followTarget();
      if (!position) place(target.x, target.y);
      const waiting = pointer || now - releasedAt < 1100;
      if (!waiting && !document.hidden) {
        const dx = target.x - position.x, dy = target.y - position.y;
        const distance = Math.hypot(dx, dy);
        if (distance > 1) {
          const step = Math.min(distance, 165 * dt);
          if (Math.abs(dx) > .5) facing = Math.sign(dx);
          place(position.x + dx / distance * step, position.y + dy / distance * step);
        }
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawPet(ctx, pet, now, {
        x:32, feet:80, scale:2,
        moving:!reduced.matches && !pointer && (Math.hypot(target.x - position.x, target.y - position.y) > 2 || !walker.classList.contains('is-paused')),
        facing, reduced:reduced.matches
      });
    }
    frame = requestAnimationFrame(paint);
  }
  frame = requestAnimationFrame(paint);
  scheduleSound();
  window.addEventListener('pagehide', () => {
    alive = false;
    cancelAnimationFrame(frame);
    clearTimeout(nextSoundTimer);
    hideSound();
    unsubscribe();
  }, { once:true });
}
