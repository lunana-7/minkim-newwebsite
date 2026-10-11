# Min's World: Google login and cloud saves

The game works without an account and keeps a local save in the current browser. To enable Google sign-in and saves that follow a player between devices:

1. Create a Firebase project and register a Web app.
2. In Firebase Authentication, enable the Google provider. Add the production domain and `localhost` to Authorized domains.
3. Create a Firestore database and apply the rules in `firestore.rules`. The rules let a signed-in player read and write only their own `players/{uid}` document.
4. Copy the Web app's API key, Auth domain, Project ID, and App ID into the `PUBLIC_FIREBASE_*` values in local `.env` and the hosting provider's environment settings.
5. Rebuild and deploy the site.

Firebase's Web app configuration is public client configuration. The Firestore rules are the access boundary: do not publish the game with broader player-document permissions.

The background music is an original Web Audio chiptune loop composed in the page. It is started only after a player presses the music button.

## Current prototype

The page includes Min's pixel avatar, four outfits, three headwear choices plus no headwear, three map palettes, local progress, Google account sign-in, and Firestore cloud saves. The game is structured as an expandable, original project; it does not include MapleStory art, maps, music, or other Nexon assets.
