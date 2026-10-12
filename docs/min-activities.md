# Min's companion activities

The shared character appears on every page and on the game/home screens. Click Min or use the keyboard to open her activity menu. Coffee (8 seconds), a tuna bowl (10 seconds), and studying (15 seconds) earn 10, 15, and 25 points once each session finishes.

`src/lib/min-profile.js` owns the versioned player profile (schema 3) and activity completion. It migrates the previous `min-world-save` wardrobe, saves after every change, resumes unfinished sessions on navigation, and isolates local saves per Firebase player. Points are personal game progress, not a competitive or financial balance.

`src/lib/min-appearance.js` composes independent matching PNG layers for hair, eyes, face, clothes, arms, sleeves, hats and props. Every pose uses the same selected parts; there is no full-image recolor or clothing polygon. `src/lib/min-cloud.js` handles Google sign-in, loads the newest saved profile, and automatically saves outfit, map, points, and activity counts to the player's own Firestore document. A failed initial cloud read never overwrites an existing cloud profile.

## Activity artwork

Asset: `public/pixel-min-activities.png` (2172 × 724 RGBA PNG).

Generated using the built-in image generation tool, with `public/pixel-min.png` as the identity reference. The game normalizes the three cells to consistent portrait frames at runtime.

### Generation prompt

Use this exact pixel chibi Min character as identity reference: long black hair fading to brown, large brown eyes, cream gingham dress and white sneakers. Create a horizontal sprite strip with exactly THREE evenly sized cells on truly transparent background, no lettering or labels. Each cell contains one full body character, same face/hair/outfit/scale, padded and fully visible, feet on a consistent baseline. LEFT: Min happily drinking coffee, lifting a tiny steaming coffee cup to her mouth. MIDDLE: Min eating a tuna rice bowl, holding a clear little bowl with pink tuna and rice and using chopsticks. RIGHT: Min studying, looking at an open book held in her hands, small glasses if cute but keep identity. Sharp low resolution pixel art with clean edges, cozy RPG character asset. No ground, no scenery, no additional people, no watermarks. Three DISTINCT ACTION POSES, retain cream gingham dress on all. The character head and body proportions must match reference. Cells same width, silhouettes centered, enough transparent padding that hair and props never cross cell boundaries.


The current character art kit and full generation prompts are documented in `artwork/mini/README.md`. Earlier full-character activity illustrations are retained as reference artwork.

The bottom companion uses the original six-frame, three-quarter walking artwork again, as requested. `scripts/package-mini-walk.mjs` isolates the main silhouette of each frame from adjacent-cell fragments. Frames share a single uniform scale and a common foot baseline. The game, home portrait and companion activities still use the saved modular appearance.

The wardrobe’s **Walking Mini** choice lets a reader switch between the restored original walking Mini (default) and their saved modular look. This presentation preference is stored in the browser under `min-walking-look`; it does not reset the player’s outfit, points, or account.
