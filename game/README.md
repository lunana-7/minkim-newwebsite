# Mini’s meadow game engine

The original game engine, emote module, Astro interface, and adventure styles are available under the scoped MIT license in this folder. Download the source from `/game-source/mini-adventure-source.zip`.

This is an integration source bundle for the existing Astro website, not a standalone build. The host supplies `MiniAvatar`, the profile store, cloud/account adapter, character renderer, shared theme variables, and assets. The full working integration is in this repository.

Required profile methods: `getProfile`, `updateProfile`, `subscribeProfile`, `collectAdventureStar`, and `completeAdventureQuest`. The profile contains `points`, `map`, `activeActivity`, and `adventure: { x, collected, questComplete }`. An account adapter supplies `subscribeAccount`; a local-only host can provide a guest subscription.

The engine expects a hidden rendered character canvas in `.min-appearance-adventure` and `/game-art/maple-meadow.webp` as its backdrop. Replace these with your own artwork when reusing the code. Preserve the registered square character canvas and a logical world height of 480.

No passwords, project case studies, Firebase settings, player saves, or private report data are included in the downloadable bundle.

## Café and study timer

Maple Cup Café is reachable at x=650, with E at its door or Visit café. The route map supports explicit travel between landmarks. `MiniCafe.astro` and `min-cafe.js` provide seated study, configurable focus/break timers and an optional Spotify embed. The host profile adapter must expose `getPlayerId()` and a `study` field `{sessions, seconds}`. Timers and the last 30 session records stay in owner-specific browser storage; aggregate study totals use profile schema 5. Spotify playback requires user interaction and is controlled by Spotify. Generated café background art is separate from this source license.

## Worlds, locals and farming

`min-worlds.js` defines five worlds and ten NPCs. `min-farming.js`, `min-farm-ui.js` and `MiniFarm.astro` implement planting, watering, harvest, seed purchases and produce sales. The host profile adapter must preserve schema 6 `farm`: coins; three-crop seed and produce inventories; six nullable plots `{crop, plantedAt, watered}`; and harvested/sold totals. The world allowlist adds `farm` and `market`. These new modules are covered by the scoped MIT license. Generated map/social art remains outside the code license.

## Gathering expansion

Seven worlds now include Secret Forest and Sunpetal Desert. `min-resource-data.js` defines nine resources and fourteen nodes; `min-gathering.js` handles pouch inventory and market sales. Host profile schema 7 must preserve `gathering: {inventory, cooldowns, collected}`; cooldowns contain timestamp keys for every node. Provide the two new world assets and `world-map.webp`. See `docs/mini-gathering.md` in the host repository. Gathering is G or nearby resource click, with automatic included tools, a 1.4-second action and thirty-second regeneration. New modules are covered by the scoped MIT license; generated art is excluded.

## Dessert careers

`MiniKitchen.astro`, `min-kitchen.js` and `min-kitchen-data.js` add two jobs: ice cream maker and cake baker. The host must preserve schema 8 `jobs`: `icecream` and `bakery` career records `{hired,completed,xp,best}` and a nullable active recipe `{job,stage,base,flavor,topping,mix,decor,temperature,startedAt,quality}`. Provide the existing profile adapter, MiniAvatar and farm coin UI hooks. All three new code files are covered by the scoped MIT license. See `docs/mini-dessert-careers.md` in the host repository.

## Liftable companion

`min-drag.js` exposes `initMiniDrag({walker,trigger,menu,onChange})`, returning a held-or-dropping status function. It expects a `[data-min-appearance]` child and a `.pixel-walker-track` parent. The renderer responds to `data-interaction-pose=held/fall`; the host drawing module provides the struggle animation. Coordinates remain temporary. This module is covered by the scoped MIT license.

## Portals and resident looks

`min-portals.js` centralizes the nine bidirectional links between seven worlds, physical portal positions, reciprocal arrival offsets and resident appearance choices. Supply the registered `/mini/rig-v2/` assets for NPCs. Portals use native canvas pixel graphics, optional E/click entry and automatic ground-level crossing. Arrival cooldown prevents bouncing between regions. This module is covered by the scoped MIT license; artwork is excluded.

## Cosmetic effects

`min-effects.js` defines five native pixel effect types plus None, five color presets and three intensities. Host profile schema 9 adds `effect: {kind,color,intensity}`. `drawMiniEffect` uses a padded 192 × 256 canvas; `drawWorldEffect` scales to world character coordinates. The host shared renderer supplies the padded layer and reduced-motion flag. This module is covered by the scoped MIT license. These are cosmetic effects without economy rewards.

## Registered character geometry

Runtime character canvases are 192 × 192, grounded at (96,190). World renderers draw a square at character height and preserve the narrower collision box separately. Do not fit full character art into the old 50 × 74 render rectangle. The host exporter `scripts/package-mini-rig-v2.py` preserves height and isolates each atlas sprite; manifest anchors live in `/mini/rig-v2/manifest.json`.

## Pet companions

`min-pets.js` draws generated cat and dog walk frames through `min-world-assets.js` and normalizes schema 10 `pet: {kind,color,accessory,name,follow}`. Four coats, two accessories and a 16-character name are available. `min-pet-portrait.js` binds the wardrobe preview to the host profile. The adventure follows Mini with a small gap, animates paws and tails, jumps toward raised platforms, and relocates pets when changing worlds. Turning Follow Mini off leaves the pet where it is. Reduced motion holds the still frame. Pet selections use the existing owner profile; positions are temporary. The code is MIT licensed; generated frames are separate artwork.

## Illustrated terrain and high trails

`min-terrain.js` uses generated terrain registration in `public/game-art/terrain/manifest.json`, with distinct ground and platform sprites for all seven regions. Supply the fourteen PNGs when integrating; generated artwork is excluded from the MIT code license. Ground texture scrolls with world position and continues below the walking cap. Floating platforms preserve their end silhouettes while stretching the central section. There are three climbing trails with four tiers (330,250,170,96), plus descending steps. Jump speed is 650 and gravity 1400: approximately 151 logical pixels of rise, enough for each 80-pixel step. Up/Space jumps, Down/S drops through the current platform; touch controls include Drop. Mini stays within the visible ceiling. Farm and market support climbing too. Existing star bits remain intact while meadow star positions match the new paths.

## Full outfit walking

The host character renderer now supplies complete six-frame walking sequences for all twelve looks. Provide `/mini/walk-cycles/{hair}-{outfit}-{0..5}.png` alongside the still sprites. The default ombre/classic retains its approved original cycle. Browser companion, adventure and wardrobe preview share these frames. Generated atlases and prompts are in artwork/mini/walk-cycles and are separate from the source license.

## Occasional greetings

`min-chatter.js` provides friendly timed bubbles attached to the site companion. The host supplies the walker, menu, held-state function, `min-ambient-speech` element and `min-chatter-toggle` checkbox. It pauses messages during activities, emotes, dragging, input and hidden tabs; the preference stays in browser storage. This native module is covered by the scoped MIT code license.

## In-game visits

`min-interactions.js` switches café, farm, market, kitchen, map and resident conversations inside the existing adventure viewport. The host provides the hidden labelled `mini-interaction-screen`, its persistent World return button and scrollable content. Place sections mount inside that screen; the field canvas keeps its size and is inert/hidden during a visit. Events pause and resume field movement while keeping saved activity data. Escape or the World button returns to the field. There is no modal dialog, backdrop or body scroll lock. Native module code is included in the scoped MIT license.

## Page rooftops and parachutes

`min-drag.js` lets the site companion land on real card and footer tops and the sidebar header ledge, then walk with her selected full outfit frames. At an edge she climbs briefly and opens an original pixel parachute. Another visible panel can catch her; the bottom route resumes after landing on the floor. Positions are temporary and track scroll/resize. Menus and activities pause walking; reduced motion disables automatic rooftop travel. The native SVG canopy and controller are included in the scoped MIT source license. Host appearance rendering supplies walking/climbing and held/floating poses.

## Generated architecture

`min-architecture.js` draws six original buildings and seven destination-themed portals from registered transparent PNGs in `/game-art/architecture/`. Doors and foundations align with existing NPC and portal coordinates. Supply the PNGs alongside the included manifest; generated artwork is separate from the MIT code license. Portal light animation respects reduced motion. The source atlases and built-in ImageGen prompts are stored in `artwork/mini/architecture`.

## Deliberate portal entry

Portals do not auto-enter. At ground level within 58 logical pixels of a gateway, press Up/W or use the explicit Enter Portal touch button. Up/W jumps away from gateways; Space always jumps. Enter talks to residents and enters nearby shop doors. Clicking a gateway explains the controls without travelling. Existing cooldown prevents accidental return travel on arrival.

## Keyboard focus and interaction

Field shortcuts are delegated across the adventure section, so a focused toolbar button does not swallow Enter, G or Up. Inputs, links, open place screens and modifier shortcuts retain native behavior. Enter/Space resumes the field; Enter talks or opens a shop door, G gathers, Up/W enters a nearby portal or jumps elsewhere. Explicit field actions dismiss temporary stopping emotes, while timed profile activities remain unchanged. The contextual key badge shows the nearby action. Opening places clears held movement and their native Enter buttons still work.

## Generated item art and walk-in shops

`min-world-assets.js` loads the item manifest. Crops have sprout, growing and ripe frames; farm plots, resources, tools, market goods, pets, kitchen props and desserts use registered PNG assets. The original atlases and ImageGen prompts are in `artwork/mini/items`, and `scripts/package-mini-items.py` registers the transparent cells. Coco and Honey stand apart from their buildings on the Berry Market trail. Enter at a shop door opens its illustrated interior and preserves the established order, wage and XP logic. The kitchen fills the game viewport; closing it puts Mini back at the door.

## Compact RPG windows and dialogue

Activities float in a compact in-game window with an expand control, leaving the field visible. The map shows a wide atlas with folded optional trail details. Opening windows does not scroll the document. NPC dialogue uses a large portrait and paged typewriter text at the bottom; Next/Enter reveals, advances, then confirms the resident action. Previous revisits pages. Reduced motion bypasses text reveal. Timers clear on conversation close. The host game page can use a wider desktop layout.
