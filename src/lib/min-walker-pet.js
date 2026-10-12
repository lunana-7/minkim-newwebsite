import { getProfile, subscribeProfile } from './min-profile.js';
import { drawPet, petName } from './min-pets.js';

export function initWalkerPet({ walker, menu }) {
  const button = document.getElementById('min-walker-pet');
  if (!button) return;
  const canvas = button.querySelector('canvas');
  const ctx = canvas.getContext('2d');
  const speech = button.querySelector('.min-walker-pet-speech');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let pet = getProfile().pet;
  let alive = true;
  let frame = 0;
  let soundTimer = 0;
  let nextSoundTimer = 0;
  let side = 'right';
  let lastWalkerX = null;
  let travelFacing = 1;

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
  const unsubscribe = subscribeProfile(profile => {
    const previousKind = pet.kind;
    pet = profile.pet;
    button.hidden = pet.kind === 'none' || !pet.follow;
    button.setAttribute('aria-label', `${petName(pet)}, Mini’s ${pet.kind}. Click to hear ${sound()}`);
    if (button.hidden || previousKind !== pet.kind) hideSound();
  });
  button.addEventListener('click', showSound);

  function paint(now) {
    if (!alive) return;
    if (!button.hidden) {
      const box = walker.getBoundingClientRect();
      if (lastWalkerX !== null && Math.abs(box.left - lastWalkerX) > .15) travelFacing = Math.sign(box.left - lastWalkerX);
      lastWalkerX = box.left;
      const width = button.getBoundingClientRect().width;
      if (box.right + width > innerWidth - 8) side = 'left';
      else if (box.left - width < 8) side = 'right';
      walker.classList.toggle('is-pet-left', side === 'left');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawPet(ctx, pet, now, {
        x: 32, feet: 80, scale: 2,
        moving: !reduced.matches && !walker.classList.contains('is-paused'),
        facing: travelFacing,
        reduced: reduced.matches
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
  }, { once: true });
}
