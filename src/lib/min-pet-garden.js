import { getProfile, updateProfile, subscribeProfile } from './min-profile.js';
import { drawPet, petName } from './min-pets.js';
import { careForPet, currentPetCare, petFeeling, PET_SKILLS, trainPetSkill } from './min-pet-care.js';

const ACTION_LINES = {
  feed: name => `${name} enjoyed a hearty meal. Nom nom!`,
  treat: name => `${name} got a special little treat!`,
  play: name => `${name} chased the ball and had so much fun!`,
  rest: name => `${name} curled up for a cozy nap. Zzz…`,
  groom: name => `${name} feels fresh and loved. ✦`,
  pet: name => `${name} leaned into your hand. ♡`,
  walk: name => `${name} explored every corner on a little walk!`
};
const LOCATION_NAMES = { room: 'cozy room', garden: 'garden', meadow: 'meadow' };
const clampPosition = value => Math.max(.17, Math.min(.82, value));

export function initPetGarden() {
  const pick = document.getElementById('pet-pick');
  if (!pick) return;
  const home = document.getElementById('pet-home');
  const stage = document.getElementById('pet-stage');
  const friend = document.getElementById('pet-friend');
  const canvas = document.getElementById('pet-canvas');
  const ctx = canvas.getContext('2d');
  const message = document.getElementById('pet-message');
  const bubble = document.getElementById('pet-stage-bubble');
  const sparkles = stage.querySelector('.pet-stage-sparkles');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let profile = getProfile();
  let activeAction = 'idle';
  let petX = .5;
  let destination = .5;
  let facing = 1;
  let onArrival = null;
  let animationTimer = 0;
  let frame = 0;
  let lastPaint = 0;
  let nextWander = performance.now() + 5500;
  let alive = true;

  function placePet() {
    const left = `${(petX * 100).toFixed(2)}%`;
    friend.style.left = left;
    bubble.style.left = left;
    sparkles.style.left = left;
  }

  function render() {
    const pet = profile.pet;
    const hasPet = pet.kind !== 'none';
    pick.hidden = hasPet;
    home.hidden = !hasPet;
    if (!hasPet) return;
    const name = petName(pet);
    stage.dataset.petKind=pet.kind;
    const care = currentPetCare(profile.petCare);
    stage.dataset.location = care.location;
    const feeling = petFeeling(care);
    document.getElementById('pet-name-heading').textContent = name;
    document.getElementById('pet-room-label').textContent = pet.kind === 'cat' ? '’s cat room' : '’s cozy corner';
    document.getElementById('pet-room-nav-label').textContent = pet.kind === 'cat' ? 'Cat room' : 'Cozy room';
    document.getElementById('pet-feeling').textContent = `${feeling.label} ♡`;
    document.getElementById('pet-feeling-line').textContent = feeling.line;
    friend.setAttribute('aria-label', `Pet ${name}, your ${pet.kind}`);
    document.getElementById('pet-treat-art').src = pet.kind === 'dog' ? '/pet-art/treat-bone.svg' : '/game-art/items/resource-fish.png';
    document.querySelectorAll('[data-pet-location]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.petLocation === care.location)));
    for (const field of ['hunger', 'energy', 'mood', 'health', 'bond']) {
      document.querySelector(`[data-pet-stat="${field}"]`).value = care[field];
      document.querySelector(`[data-pet-value="${field}"]`).textContent = `${care[field]} / 100`;
    }
    for (const id of Object.keys(PET_SKILLS)) {
      const level = care.skills[id];
      document.querySelector(`[data-pet-skill-progress="${id}"]`).textContent = `${'● '.repeat(level)}${'○ '.repeat(3 - level)}`.trim();
      document.querySelector(`[data-pet-skill-cta="${id}"]`).textContent = level === 3 ? 'Show trick ↗' : `Practice ${level}/3 →`;
      document.querySelector(`[data-pet-skill="${id}"]`).classList.toggle('is-mastered', level === 3);
    }
    document.getElementById('pet-meals').textContent = care.meals;
    document.getElementById('pet-play-times').textContent = care.playTimes;
    document.getElementById('pet-care-times').textContent = care.careTimes;
  }

  function showAction(action, line, duration = 1900) {
    clearTimeout(animationTimer);
    activeAction = action;
    stage.dataset.action = action;
    if (line) message.textContent = line;
    bubble.textContent = action === 'rest' ? 'Zzz…' : action === 'feed' || action === 'treat' ? 'Nom nom!' : action === 'play' ? 'Yippee!' : action === 'walk' ? '✦' : action.startsWith('skill-') ? 'Ta-da!' : action === 'pet' ? profile.pet.kind === 'cat' ? 'Meow ♡' : 'Woof ♡' : '♡';
    bubble.classList.add('is-visible');
    animationTimer = setTimeout(() => {
      activeAction = 'idle';
      stage.dataset.action = 'idle';
      bubble.classList.remove('is-visible');
      nextWander = performance.now() + 4500;
    }, duration);
  }

  function travelTo(x, callback, line = '') {
    clearTimeout(animationTimer);
    bubble.classList.remove('is-visible');
    destination = clampPosition(x);
    onArrival = callback;
    if (line) message.textContent = line;
    if (Math.abs(destination - petX) > .008 && !reduced.matches) {
      facing = destination > petX ? 1 : -1;
      activeAction = 'walk';
      stage.dataset.action = 'walk';
    } else {
      petX = destination;
      placePet();
      const done = onArrival;
      onArrival = null;
      if (done) done();
      else { activeAction = 'idle'; stage.dataset.action = 'idle'; }
    }
  }

  function interact(action) {
    if (profile.pet.kind === 'none') return;
    const outcome = careForPet(profile.petCare, action);
    if (outcome.message) { message.textContent = outcome.message; return; }
    const name = petName(profile.pet);
    const target = { feed: .72, treat: .72, play: .63, rest: .21, groom: .5, pet: petX, walk: petX < .5 ? .78 : .2 }[action];
    travelTo(target, () => {
      const result = careForPet(profile.petCare, action);
      if (result.message) { message.textContent = result.message; activeAction = 'idle'; stage.dataset.action = 'idle'; return; }
      updateProfile({ petCare: result.care });
      showAction(action, ACTION_LINES[action](name), action === 'rest' ? 2700 : 1900);
    }, action === 'walk' ? `${name} is going for a walk…` : `${name} is heading over…`);
  }

  function practice(skill) {
    if (profile.pet.kind === 'none' || !PET_SKILLS[skill]) return;
    const name = petName(profile.pet);
    travelTo(.5, () => {
      const alreadyLearned = profile.petCare.skills?.[skill] === 3;
      const result = trainPetSkill(profile.petCare, skill);
      if (result.message) { message.textContent = result.message; activeAction = 'idle'; stage.dataset.action = 'idle'; return; }
      if (!alreadyLearned) updateProfile({ petCare: result.care });
      const line = alreadyLearned ? `${name} showed you ${PET_SKILLS[skill].name.toLowerCase()}!` : result.mastered ? `${name} learned ${PET_SKILLS[skill].name.toLowerCase()}! A new trick unlocked. ✦` : `${name} practiced ${PET_SKILLS[skill].name.toLowerCase()} — ${result.care.skills[skill]} of 3 lessons complete.`;
      showAction(`skill-${skill}`, line, 2100);
    }, `${name} is coming to the practice spot…`);
  }

  function visit(location) {
    if (profile.pet.kind === 'none' || !LOCATION_NAMES[location]) return;
    const care = currentPetCare(profile.petCare);
    updateProfile({ petCare: { ...care, location } });
    clearTimeout(animationTimer);
    onArrival = null;
    petX = destination = .5;
    activeAction = 'idle';
    stage.dataset.action = 'idle';
    bubble.classList.remove('is-visible');
    placePet();
    nextWander = performance.now() + 3000;
    message.textContent = `${petName(profile.pet)} arrived at the ${LOCATION_NAMES[location]}. Tap the ground to explore!`;
  }

  document.querySelectorAll('[data-pet-choose]').forEach(button => button.addEventListener('click', () => {
    const kind = button.dataset.petChoose;
    updateProfile({ pet: { ...getProfile().pet, kind, follow: true, name: '' } });
    message.textContent = `Welcome, ${petName(getProfile().pet)}! Your little story starts here. ♡`;
  }));
  document.querySelectorAll('[data-pet-location]').forEach(button => button.addEventListener('click', () => visit(button.dataset.petLocation)));
  document.querySelectorAll('[data-pet-action]').forEach(button => button.addEventListener('click', () => interact(button.dataset.petAction)));
  document.querySelectorAll('[data-pet-skill]').forEach(button => button.addEventListener('click', () => practice(button.dataset.petSkill)));
  friend.addEventListener('click', () => interact('pet'));
  stage.addEventListener('click', event => {
    if (event.target.closest('button') || profile.pet.kind === 'none') return;
    const bounds = stage.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width;
    travelTo(x, () => showAction('idle', `${petName(profile.pet)} found a new little spot. ✦`, 1100), `${petName(profile.pet)} is exploring…`);
  });
  placePet();
  const unsubscribe = subscribeProfile(next => { profile = next; render(); });
  const clock = setInterval(render, 30000);

  function paint(now) {
    if (!alive) return;
    const elapsed = lastPaint ? Math.min(.06, (now - lastPaint) / 1000) : 0;
    lastPaint = now;
    if (profile.pet.kind !== 'none' && !document.hidden) {
      if (activeAction === 'walk') {
        const delta = destination - petX;
        const step = elapsed * .23;
        if (Math.abs(delta) <= step || reduced.matches) {
          petX = destination;
          placePet();
          const done = onArrival;
          onArrival = null;
          if (done) done();
          else { activeAction = 'idle'; stage.dataset.action = 'idle'; nextWander = now + 4500; }
        } else {
          petX += Math.sign(delta) * step;
          placePet();
        }
      } else if (activeAction === 'idle' && now >= nextWander && !reduced.matches) {
        nextWander = now + 8000;
        travelTo(.22 + Math.random() * .55, null);
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawPet(ctx, profile.pet, now, { x: 100, feet: 214, scale: 4.8, moving: activeAction === 'walk' || activeAction === 'play', facing, reduced: reduced.matches });
    }
    frame = requestAnimationFrame(paint);
  }
  frame = requestAnimationFrame(paint);
  window.addEventListener('pagehide', () => { alive = false; clearInterval(clock); clearTimeout(animationTimer); cancelAnimationFrame(frame); unsubscribe(); }, { once: true });
}
