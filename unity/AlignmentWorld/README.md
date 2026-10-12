# Alignment World: The Lantern Protocol

A Unity 6 project source for the site's separate AI alignment story world. It has six regions, Mini movement/jumping, guides, learning quests, sequential gates, a session lock and browser save bridge. It uses the existing original pixel art. It has NOT been compiled or run in Unity in this environment because no Unity Editor is installed.

## Build

1. Install a supported Unity 6 Editor with Web Build Support in Unity Hub. The recorded version is a project baseline; use your installed supported Unity 6 version and allow normal project upgrade if needed.
2. Open this folder from the repository. Let Unity import resources.
3. Select **Alignment World → Build Web Player**. The editor script creates the initial scene and exports to the repository's `public/alignment-world/Unity` directory. It writes a ready manifest only after the build succeeds. If you download the source ZIP separately, move the resulting Unity build to that website path and copy the manifest there.
4. Rebuild the Astro site. The host loads the Unity player from the manifest and switches its engine label from Browser prototype to Unity Web.

The production Firebase setup is still pending. The game remains locked until the website has a signed-in Google player. Do not bypass this with invented session IDs. Unity's SetSession method accepts the authenticated host session, and AlignmentBridge reports progress back to the host's own-user Firestore document. Tokens and credentials never belong in the Unity assets or source ZIP.

The runtime is an initial single-player story slice, not a complete MMO. Browser-prototype presence exists in the host page. Unity does not yet render network peers: build an authenticated authoritative world service and a Unity transport/presence adapter before shipping Unity multiplayer. Client-side quest choices are not an anti-cheat system. Add authoritative quest validation, moderation, load testing, accessibility and content review before a public persistent world launch.

Story scenes and career examples are fictional/illustrative. Each quest includes a source and labels hypotheses and working definitions. Generated art is project artwork, not included under a new blanket open-source license.
