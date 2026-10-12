# Alignment World: The Lantern Protocol

## Delivered foundation

A separate sidebar entry and `/alignment-world` route. The fictional city of Lumen has six story regions, Mini movement/jumping, guides, question quests, ordered unlocks and six trust beacons. A signed-in Google account is required for gameplay; there is no guest bypass. Story summaries and the introductory scene can be viewed without signing in. Fullscreen uses the browser Fullscreen API with an expanded page fallback and Escape exit.

The current website scene is a browser prototype, explicitly labeled. A Unity 6 project is prepared under `unity/AlignmentWorld`, including C# runtime, scene/resource build script, original art, campaign JSON, and a JavaScript save bridge. `public/alignment-world/unity-project.zip` is project source, NOT a compiled Unity player. No Unity Editor was found locally; this source has not been compiled or verified in Unity. The host swaps to a Unity loader only when a successful editor build writes a ready manifest. The website's Astro build cannot compile C# or produce Unity Web binaries.

## Story and learning

The learner is Mini, an Alignment Steward investigating an accelerating research loop and excessive AI authority. Six guides cover:

1. Origins Observatory: singularity hypothesis, historical discussion of von Neumann, uncertainty, architecture distinction.
2. Alignment Grove: objective/proxy gaps, alignment, reward hacking, evaluation and bounded research findings.
3. Recursive Forge: continual learning versus recursive self-improvement, independent evaluation, versioning and rollback.
4. Identity Harbor: identity, user representation, scoped delegation and attributable authority.
5. Governance Citadel: NIST Govern/Map/Measure/Manage, runtime enforcement, incident response and escalation.
6. Opportunity Guild: bounded pilots, measured benefit, stakeholder input and illustrative career/project paths.

Each correct decision restores one beacon, earns 100 insight XP and unlocks the next region. Incorrect answers invite another attempt without erasing progress. Sources appear inside dialogue and chapter cards. Singularity is not presented as inevitable; careers are examples, not hiring promises.

Sources: Vernor Vinge's 1993 essay, https://cmm.cenart.gob.mx/delanda/textos/tech_sing.pdf; NIST AI RMF, https://www.nist.gov/itl/ai-risk-management-framework; Anthropic's alignment-faking research, https://www.anthropic.com/research/alignment-faking; MIRI discussion of the intelligence-explosion hypothesis, https://intelligence.org/summary/.

## Login and data

Uses the existing Firebase Google authentication. Cloud configuration remains unset while the earlier Firebase Terms acceptance request is pending. Do not claim login or multiplayer is live. Rules were prepared, not deployed.

Own-user `alignmentProgress/{uid}` stores region, six-bit completed mask, XP, world X position and timestamps. Account-scoped local cache provides a browser backup. An initial failed cloud read prevents uploads until a successful read; reconnect by reloading/signing in after service recovery. Sign-out clears visible story state. It does not delete owned saves.

The browser prototype writes `alignmentPresence/{uid}` every five seconds once its authenticated cloud session is ready. Presence includes a pseudonymous callsign, chapter and X position. Authenticated players can read presence; each can write only their own record. Snapshot queries are capped at fifty entries, stale entries older than sixty seconds are ignored, and only peers in the same chapter are drawn. This is an initial shared-presence prototype, not an authoritative MMO simulation. Firestore scheduling, scale, collision synchronization, live events, moderation and server-authoritative quest validation remain production work. No email, name, credentials or ID tokens are sent to Unity.

The Unity runtime reports position/progress through the host bridge and accepts the signed-in host session. It currently implements the single-player story slice; Unity network peer rendering is not implemented. Source-side login gating and Firestore owner rules must be supplemented by authoritative world services for a serious persistent multiplayer launch.

## Build handoff

Unity official Web prerequisites: https://learn.unity.com/tutorial/getting-started-with-unity-web. Install a supported Unity 6 Editor and Web Build Support, open the project and run Alignment World → Build Web Player. The generated Web payload and ready manifest replace the browser prototype on the website. Unity source README describes the exact output folder. `.gitignore` excludes Unity caches and compiled payloads; package scripts exclude credentials/caches.
