# Firebase setup status

Firebase project `min-s-world` is registered with a web app named **Min's World Website**. The local `.env` has the public Firebase web configuration and stays outside Git. The default Firestore database exists in the US multi-region `nam5`. Production mode was used at creation, and the repository's owner-scoped `firestore.rules` have been published. Authentication already lists `localhost` and `minkim.dev` as authorized domains.

Google sign-in is awaiting a public support email. Firebase currently offers only the account used to create the project; selecting it would expose that personal address on Google sign-in screens. The site's public contact address is `aqeoon@gmail.com`, but it is not selectable until it is added and verified for this Firebase project. The Google provider remains disabled until that choice is resolved. The site can still run in guest mode with browser saves.

Production builds also need the four `PUBLIC_FIREBASE_*` values from `.env.example` set in the hosting environment. Do not claim cloud sync is live until the Google provider, hosting configuration and a real sign-in/save flow are confirmed.
