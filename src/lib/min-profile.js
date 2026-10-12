export const OUTFITS = ['classic', 'berry', 'ocean', 'meadow'];
export const HAIRS = ['ombre', 'bob', 'twintails'];
export const EYES = ['brown', 'hazel', 'blue'];
export const FACES = ['soft', 'rosy', 'freckles'];
export const HATS = ['none', 'beret', 'flower', 'crown'];
export const MAPS = ['sunny', 'night', 'forest', 'farm', 'market'];
export const ACTIVITIES = {
  coffee: { label: 'Drink coffee', shortLabel: 'Coffee break', reward: 10, duration: 8000, message: 'A warm cup and a little recharge.', done: 'Coffee break complete!' },
  tuna: { label: 'Eat a tuna bowl', shortLabel: 'Tuna bowl time', reward: 15, duration: 10000, message: 'Tuna, rice, and a happy little lunch.', done: 'That was delicious!' },
  study: { label: 'Study together', shortLabel: 'Study session', reward: 25, duration: 15000, message: 'One page at a time. Let’s focus!', done: 'A little wiser, a little brighter.' }
};
const newFarm = () => ({ coins:100, seeds:{carrot:6,wheat:2,strawberry:2}, produce:{carrot:0,wheat:0,strawberry:0}, plots:Array(6).fill(null), harvested:0, sold:0 });
const DEFAULT = { schemaVersion: 6, outfit: 'classic', hair: 'ombre', eyes: 'brown', face: 'soft', hat: 'none', map: 'sunny', points: 0, completedActivities: { coffee: 0, tuna: 0, study: 0 }, activeActivity: null, adventure: { x: 90, collected: 0, questComplete: false }, study: { sessions: 0, seconds: 0 }, farm:newFarm(), updatedAt: 0 };
let owner = 'guest';
let current;
const listeners = new Set();
const key = () => `min-world-profile:${owner}`;
const safeNumber = (value, max = 1000000000) => Number.isFinite(value) ? Math.min(max, Math.max(0, Math.floor(value))) : 0;
export function normalizeProfile(value = {}) {
  const activity = value?.activeActivity;
  const f=value?.farm || newFarm();
  const inventory = field => Object.fromEntries(['carrot','wheat','strawberry'].map(crop=>[crop,safeNumber(f[field]?.[crop],1000000)]));
  const farm = { coins:safeNumber(f.coins),seeds:inventory('seeds'),produce:inventory('produce'),harvested:safeNumber(f.harvested),sold:safeNumber(f.sold),plots:Array.from({length:6},(_,index)=>{const plot=f.plots?.[index];return plot&&['carrot','wheat','strawberry'].includes(plot.crop)&&Number.isFinite(plot.plantedAt)&&plot.plantedAt>=0?{crop:plot.crop,plantedAt:Math.floor(plot.plantedAt),watered:plot.watered===true}:null;}) };
  return {
    ...DEFAULT,
    outfit: OUTFITS.includes(value?.outfit) ? value.outfit : 'classic',
    hair: HAIRS.includes(value?.hair) ? value.hair : 'ombre',
    eyes: EYES.includes(value?.eyes) ? value.eyes : 'brown',
    face: FACES.includes(value?.face) ? value.face : 'soft',
    hat: HATS.includes(value?.hat) ? value.hat : 'none',
    map: MAPS.includes(value?.map) ? value.map : 'sunny',
    points: safeNumber(value?.points),
    completedActivities: Object.fromEntries(Object.keys(ACTIVITIES).map(name => [name, safeNumber(value?.completedActivities?.[name])])),
    activeActivity: activity && ACTIVITIES[activity.kind] && typeof activity.id === 'string' && Number.isFinite(activity.startedAt) && Number.isFinite(activity.endsAt) && activity.endsAt - activity.startedAt === ACTIVITIES[activity.kind].duration
      ? { id: activity.id.slice(0, 100), kind: activity.kind, startedAt: activity.startedAt, endsAt: activity.endsAt } : null,
    adventure: { x: Math.max(36, Math.min(3560, safeNumber(value?.adventure?.x ?? 90, 3560))), collected: safeNumber(value?.adventure?.collected, 65535), questComplete: value?.adventure?.questComplete === true },
    farm,
    study: { sessions: safeNumber(value?.study?.sessions), seconds: safeNumber(value?.study?.seconds) },
    updatedAt: Number.isFinite(value?.updatedAt) ? Math.max(0, value.updatedAt) : 0
  };
}
function read() {
  try {
    const existing = localStorage.getItem(key());
    if (existing) return normalizeProfile(JSON.parse(existing));
    if (owner === 'guest') {
      const legacy = localStorage.getItem('min-world-save');
      if (legacy) return normalizeProfile(JSON.parse(legacy));
    }
  } catch {}
  return normalizeProfile();
}
function emit() { for (const listener of listeners) listener(getProfile()); }
function persist() {
  try { localStorage.setItem(key(), JSON.stringify(current)); } catch {}
  emit();
}
export function getPlayerId() { return owner; }
export function getProfile() {
  current ||= read();
  return structuredClone(current);
}
export function updateProfile(patch) {
  current = normalizeProfile({ ...getProfile(), ...patch, updatedAt: Date.now() });
  persist();
  return getProfile();
}
export function replaceProfile(profile) { current = normalizeProfile(profile); persist(); }
export function selectPlayer(uid) { owner = uid || 'guest'; current = read(); emit(); return getProfile(); }
export function subscribeProfile(listener) { listeners.add(listener); listener(getProfile()); return () => listeners.delete(listener); }
export function startActivity(kind) {
  if (!ACTIVITIES[kind] || getProfile().activeActivity) return false;
  const now = Date.now();
  updateProfile({ activeActivity: { id: crypto.randomUUID(), kind, startedAt: now, endsAt: now + ACTIVITIES[kind].duration } });
  return true;
}
export function completeActivity(id, now = Date.now()) {
  const profile = getProfile();
  const activity = profile.activeActivity;
  if (!activity || activity.id !== id || now < activity.endsAt) return null;
  const reward = ACTIVITIES[activity.kind].reward;
  updateProfile({ activeActivity: null, points: profile.points + reward, completedActivities: { ...profile.completedActivities, [activity.kind]: profile.completedActivities[activity.kind] + 1 } });
  return { kind: activity.kind, reward };
}
if (typeof window !== 'undefined') window.addEventListener('storage', event => { if (event.key === key()) { current = read(); emit(); } });

export function collectAdventureStar(index, x) {
  const profile = getProfile();
  if (index < 0 || index > 15 || (profile.adventure.collected & (1 << index))) return false;
  updateProfile({ points: profile.points + 5, adventure: { ...profile.adventure, x, collected: profile.adventure.collected | (1 << index) } });
  return true;
}
export function completeAdventureQuest(x) {
  const profile = getProfile();
  const stars = profile.adventure.collected.toString(2).replace(/0/g, '').length;
  if (profile.adventure.questComplete || stars < 6) return false;
  updateProfile({ points: profile.points + 50, adventure: { ...profile.adventure, x, questComplete: true } });
  return true;
}
