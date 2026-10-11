export const firebaseConfig = {
  apiKey: import.meta.env.PUBLIC_FIREBASE_API_KEY,
  authDomain: import.meta.env.PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.PUBLIC_FIREBASE_PROJECT_ID,
  appId: import.meta.env.PUBLIC_FIREBASE_APP_ID
};
export const firebaseConfigured = Object.values(firebaseConfig).every(value => typeof value === 'string' && value.length > 0);
let services;
export async function getFirebaseServices() {
  if (!firebaseConfigured) return null;
  services ||= Promise.all([import('firebase/app'), import('firebase/auth'), import('firebase/firestore')]).then(([appSDK, authSDK, storeSDK]) => {
    const app = appSDK.getApps().length ? appSDK.getApps()[0] : appSDK.initializeApp(firebaseConfig);
    const provider = new authSDK.GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    return { auth: authSDK.getAuth(app), db: storeSDK.getFirestore(app), provider, authSDK, storeSDK };
  });
  return services;
}
