const clamp = value => Math.max(0, Math.min(100, Math.round(Number(value) || 0)));

export function normalizePetCare(value, now = Date.now()) {
  return {
    hunger: clamp(value?.hunger ?? 82),
    energy: clamp(value?.energy ?? 78),
    mood: clamp(value?.mood ?? 82),
    health: clamp(value?.health ?? 92),
    bond: clamp(value?.bond ?? 40),
    meals: Math.max(0, Math.floor(Number(value?.meals) || 0)),
    playTimes: Math.max(0, Math.floor(Number(value?.playTimes) || 0)),
    careTimes: Math.max(0, Math.floor(Number(value?.careTimes) || 0)),
    updatedAt: Number.isFinite(value?.updatedAt) && value.updatedAt > 0 ? Math.min(value.updatedAt, now) : now
  };
}

export function currentPetCare(saved, now = Date.now()) {
  const care = normalizePetCare(saved, now);
  const hours = Math.min(24, Math.max(0, now - care.updatedAt) / 3600000);
  const hunger = Math.max(12, care.hunger - hours * 5);
  const energy = Math.max(15, care.energy - hours * 3);
  const mood = Math.max(18, care.mood - hours * 2.5);
  const healthLoss = (hunger < 28 ? 2 : 0) + (energy < 25 ? 1 : 0);
  return {
    ...care,
    hunger: clamp(hunger),
    energy: clamp(energy),
    mood: clamp(mood),
    health: Math.max(35, clamp(care.health - hours * healthLoss)),
    bond: Math.max(20, clamp(care.bond - hours * .4)),
    updatedAt: now
  };
}

export function petFeeling(care) {
  if (care.health < 55) return { label: 'Needs care', line: 'A meal and a cozy rest would help.' };
  if (care.hunger < 30) return { label: 'Hungry', line: 'That little tummy is ready for food.' };
  if (care.energy < 28) return { label: 'Sleepy', line: 'A quiet nap sounds lovely.' };
  if (care.mood < 40) return { label: 'A little lonely', line: 'Some playtime would brighten the day.' };
  if (care.mood >= 80 && care.bond >= 65) return { label: 'Over the moon', line: 'Your little friend feels loved!' };
  return { label: 'Content', line: 'A cozy day together.' };
}

const changes = {
  feed: { hunger: 27, energy: 3, mood: 5, health: 3, bond: 3, meals: 1 },
  treat: { hunger: 9, mood: 13, bond: 7, meals: 1 },
  play: { hunger: -8, energy: -13, mood: 23, health: 2, bond: 10, playTimes: 1 },
  rest: { energy: 29, health: 7, mood: 5, careTimes: 1 },
  groom: { mood: 12, health: 4, bond: 11, careTimes: 1 },
  pet: { mood: 7, bond: 5, careTimes: 1 }
};

export function careForPet(saved, action, now = Date.now()) {
  const care = currentPetCare(saved, now);
  if (action === 'play' && care.energy < 15) return { care, message: 'A little rest first, then we can play again.' };
  if (action === 'feed' && care.hunger > 94) return { care, message: 'That tummy is full. Try playing instead!' };
  const change = changes[action];
  if (!change) return { care, message: '' };
  const next = { ...care, updatedAt: now };
  for (const field of ['hunger', 'energy', 'mood', 'health', 'bond']) next[field] = clamp(care[field] + (change[field] || 0));
  for (const field of ['meals', 'playTimes', 'careTimes']) next[field] = care[field] + (change[field] || 0);
  return { care: next, message: '' };
}
