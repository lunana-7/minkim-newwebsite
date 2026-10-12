import { getProfile, updateProfile, subscribeProfile } from './min-profile.js';
import { drawPet, petName } from './min-pets.js';
import { careForPet, currentPetCare, petFeeling } from './min-pet-care.js';

const ACTION_LINES = {
  feed: name => `${name} enjoyed a hearty meal. Nom nom!`,
  treat: name => `${name} got a special little treat!`,
  play: name => `${name} chased the ball and had so much fun!`,
  rest: name => `${name} curled up for a cozy nap. Zzz…`,
  groom: name => `${name} feels fresh and loved. ✦`,
  pet: name => `${name} leaned into your hand. ♡`
};

export function initPetGarden() {
  const pick = document.getElementById('pet-pick');
  if (!pick) return;
  const home = document.getElementById('pet-home');
  const stage = document.getElementById('pet-stage');
  const canvas = document.getElementById('pet-canvas');
  const ctx = canvas.getContext('2d');
  const message = document.getElementById('pet-message');
  const bubble = document.getElementById('pet-stage-bubble');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let profile = getProfile();
  let activeAction = 'idle';
  let animationTimer = 0;
  let frame = 0;
  let alive = true;

  function render() {
    const pet = profile.pet;
    const hasPet = pet.kind !== 'none';
    pick.hidden = hasPet;
    home.hidden = !hasPet;
    if (!hasPet) return;
    const name = petName(pet);
    stage.dataset.petKind=pet.kind;
    const care = currentPetCare(profile.petCare);
    const feeling = petFeeling(care);
    document.getElementById('pet-name-heading').textContent = name;
    document.getElementById('pet-room-label').textContent = pet.kind === 'cat' ? '’s cat room' : '’s cozy corner';
    document.getElementById('pet-feeling').textContent = `${feeling.label} ♡`;
    document.getElementById('pet-feeling-line').textContent = feeling.line;
    document.getElementById('pet-friend').setAttribute('aria-label', `Pet ${name}, your ${pet.kind}`);
    document.getElementById('pet-treat-art').src = pet.kind === 'dog' ? '/pet-art/treat-bone.svg' : '/game-art/items/resource-fish.png';
    for (const field of ['hunger', 'energy', 'mood', 'health', 'bond']) {
      document.querySelector(`[data-pet-stat="${field}"]`).value = care[field];
      document.querySelector(`[data-pet-value="${field}"]`).textContent = `${care[field]} / 100`;
    }
    document.getElementById('pet-meals').textContent = care.meals;
    document.getElementById('pet-play-times').textContent = care.playTimes;
    document.getElementById('pet-care-times').textContent = care.careTimes;
  }

  function interact(action) {
    if (profile.pet.kind === 'none') return;
    const outcome = careForPet(profile.petCare, action);
    if (outcome.message) { message.textContent = outcome.message; return; }
    const name = petName(profile.pet);
    updateProfile({ petCare: outcome.care });
    message.textContent = ACTION_LINES[action](name);
    activeAction = action;
    stage.dataset.action = action;
    bubble.textContent = action === 'rest' ? 'Zzz…' : action === 'feed' || action === 'treat' ? 'Yum!' : action === 'play' ? 'Yippee!' : action === 'pet' ? profile.pet.kind === 'cat' ? 'Meow ♡' : 'Woof ♡' : '♡';
    bubble.classList.add('is-visible');
    clearTimeout(animationTimer);
    animationTimer = setTimeout(() => { activeAction = 'idle'; stage.dataset.action = 'idle'; bubble.classList.remove('is-visible'); }, 1700);
  }

  document.querySelectorAll('[data-pet-choose]').forEach(button => button.addEventListener('click', () => {
    const kind = button.dataset.petChoose;
    updateProfile({ pet: { ...getProfile().pet, kind, follow: true, name: '' } });
    message.textContent = `Welcome, ${petName(getProfile().pet)}! Your little story starts here. ♡`;
  }));
  document.querySelectorAll('[data-pet-action]').forEach(button => button.addEventListener('click', () => interact(button.dataset.petAction)));
  document.getElementById('pet-friend').addEventListener('click', () => interact('pet'));
  const unsubscribe = subscribeProfile(next => { profile = next; render(); });
  const clock = setInterval(render, 30000);

  function paint(now) {
    if (!alive) return;
    if (profile.pet.kind !== 'none' && !document.hidden) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawPet(ctx, profile.pet, now, { x: 100, feet: 214, scale: 4.8, moving: activeAction === 'play' || activeAction === 'feed', facing: activeAction === 'play' ? -1 : 1, reduced: reduced.matches });
    }
    frame = requestAnimationFrame(paint);
  }
  frame = requestAnimationFrame(paint);
  window.addEventListener('pagehide', () => { alive = false; clearInterval(clock); clearTimeout(animationTimer); cancelAnimationFrame(frame); unsubscribe(); }, { once: true });
}
