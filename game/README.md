# Mini’s meadow game engine

The original game engine, emote module, Astro interface, and adventure styles are available under the scoped MIT license in this folder. Download the source from `/game-source/mini-adventure-source.zip`.

This is an integration source bundle for the existing Astro website, not a standalone build. The host supplies `MiniAvatar`, the profile store, cloud/account adapter, character renderer, shared theme variables, and assets. The full working integration is in this repository.

Required profile methods: `getProfile`, `updateProfile`, `subscribeProfile`, `collectAdventureStar`, and `completeAdventureQuest`. The profile contains `points`, `map`, `activeActivity`, and `adventure: { x, collected, questComplete }`. An account adapter supplies `subscribeAccount`; a local-only host can provide a guest subscription.

The engine expects a hidden rendered character canvas in `.min-appearance-adventure` and `/game-art/maple-meadow.webp` as its backdrop. Replace these with your own artwork when reusing the code. Preserve a 2:3 character aspect ratio and a logical world height of 480.

No passwords, project case studies, Firebase settings, player saves, or private report data are included in the downloadable bundle.
