import { firebaseConfigured, getFirebaseServices } from './firebase.js';
import { getProfile, normalizeProfile, replaceProfile, selectPlayer, subscribeProfile } from './min-profile.js';
let account = { user: null, configured: firebaseConfigured, state: 'device', message: 'Saved on this device.' };
const listeners = new Set();
let started = false, ready = false, loading = false, timer, inFlight = null, needsSave = false;
function notify(patch) { account = { ...account, ...patch }; listeners.forEach(listener => listener({ ...account })); }
export function getAccount() { return { ...account }; }
export function subscribeAccount(listener) { listeners.add(listener); listener(getAccount()); return () => listeners.delete(listener); }
export async function saveToCloud() {
  clearTimeout(timer);
  if (!account.user || !ready) return false;
  needsSave = true;
  if (inFlight) return inFlight;
  inFlight = (async () => {
  try {
    const { db, storeSDK } = await getFirebaseServices();
    while (needsSave && account.user && ready) {
      needsSave = false;
      const uid = account.user.uid;
      const profile = getProfile();
      notify({ state: 'saving', message: 'Saving your look and progress…' });
      await storeSDK.setDoc(storeSDK.doc(db, 'players', uid), { game: profile, updatedAt: storeSDK.serverTimestamp() }, { merge: true });
      if (account.user?.uid === uid) notify({ state: 'saved', message: 'Your look and points are saved to your account.' });
    }
    return true;
  } catch {
    needsSave = false;
    notify({ state: 'error', message: 'Saved on this device. Cloud save will retry when you reconnect.' });
    return false;
  } finally { inFlight = null; }
  })();
  return inFlight;
}
async function loadUser(user, guestProgress = null) {
  loading = true; ready = false;
  notify({ state: 'loading', message: 'Loading your saved look and points…' });
  try {
    const { db, storeSDK } = await getFirebaseServices();
    const saved = await storeSDK.getDoc(storeSDK.doc(db, 'players', user.uid));
    if (account.user?.uid !== user.uid) return;
    // Read local progress after the network call, so edits made while loading win.
    const local = getProfile();
    const cloud = saved.exists() ? normalizeProfile(saved.data().game) : null;
    if (cloud && cloud.updatedAt >= local.updatedAt) replaceProfile(cloud);
    if (!cloud && local.updatedAt === 0 && guestProgress) replaceProfile({ ...guestProgress, updatedAt: Date.now() });
    loading = false; ready = true;
    if (!cloud || local.updatedAt > cloud.updatedAt) await saveToCloud();
    else notify({ state: 'saved', message: 'Your saved look and points are ready.' });
  } catch {
    if (account.user?.uid !== user.uid) return;
    loading = false;
    // A failed initial read must never overwrite an existing cloud profile.
    notify({ state: 'error', message: 'Your local save is ready. Reconnect to load your cloud progress.' });
  }
}
export async function startCloudSync() {
  if (started) return;
  started = true;
  if (!firebaseConfigured) return;
  const { auth, authSDK } = await getFirebaseServices();
  authSDK.onAuthStateChanged(auth, async user => {
    clearTimeout(timer); ready = false; loading = true;
    const guestProgress = !account.user ? getProfile() : null;
    notify({ user, state: user ? 'loading' : 'device', message: user ? 'Loading your saved look and points…' : 'Saved on this device.' });
    selectPlayer(user?.uid);
    if (!user) { loading = false; return; }
    await loadUser(user, guestProgress);
  });
  subscribeProfile(() => {
    if (!ready || loading || !account.user) return;
    clearTimeout(timer); timer = setTimeout(saveToCloud, 1000);
  });
  window.addEventListener('online', () => {
    if (!account.user) return;
    if (ready) saveToCloud();
    else if (!loading) loadUser(account.user);
  });
}
export async function signInPlayer() {
  if (!firebaseConfigured) { notify({ state: 'device', message: 'Google sign-in is not connected yet. Your look and points are saved here.' }); return false; }
  try {
    const { auth, provider, authSDK } = await getFirebaseServices();
    await authSDK.signInWithPopup(auth, provider); return true;
  } catch (error) {
    const messages = { 'auth/popup-closed-by-user': 'Sign-in was closed. Your local progress is still saved.', 'auth/unauthorized-domain': 'Sign-in is not available on this site address yet.', 'auth/popup-blocked': 'Please allow the Google sign-in window and try again.', 'auth/operation-not-allowed': 'Google sign-in has not been enabled for this site yet.' };
    notify({ state: 'error', message: messages[error.code] || 'Google sign-in did not finish. Please try again.' }); return false;
  }
}
export async function signOutPlayer() {
  const services = await getFirebaseServices();
  if (!services) return;
  await saveToCloud(); await services.authSDK.signOut(services.auth);
}
