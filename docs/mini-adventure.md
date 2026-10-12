# Mini’s Maple Meadow adventure

An original, open-source side-scrolling browser game using Mini’s existing character assets. The visual direction is a cozy platform RPG; the code, characters, scenery, quest, and synthesized music do not use MapleStory game assets.

## Play

Open `/game` and choose **Enter the meadow**. Move with arrow keys or A/D, jump with Space/Up/W, and talk with E. Touch controls are provided. Click Mini or use the emote buttons to say hello, give cake, give ice cream, or send a heart.

Collect up to 16 stars (5 points each). Bring six stars to Pippin near x=1240 to complete the wish, receive 50 points, and open the cloud gate at the far end. Stars and the quest reward are recorded once per profile. The gate returns Mini to the start without resetting earned progress. Pausing and leaving the page save position. The game uses the original Mini walk by default; **Walking Mini → My saved look** uses the modular wardrobe.

## Source

- `src/components/MiniAdventure.astro`: accessible game shell, controls, and character render source.
- `src/lib/min-adventure.js`: camera, movement, jump buffering, platform collisions, collectible stars, NPC, portal, and canvas scenery.
- `src/lib/min-emotes.js`: shared social gestures and pixel props.
- `src/lib/min-appearance.js`: original walking sprites and modular character poses.
- `src/lib/min-profile.js`: schema 4 migration, persistent adventure state, and rewards.

`adventure` stores `x`, a 16-bit collected-star mask, and `questComplete`. Schema 2/3 saves migrate without losing outfits, points, or activity counts. Local saves remain separated by guest/player identity. Existing Firebase sync carries these fields when configured; the updated Firestore rules must be deployed with the feature. Firebase provisioning is still pending the previously requested terms approval. Browser saves are currently available.

This is a playable first chapter with one quest, not a multiplayer MMO, combat system, or full commercial RPG. Personal client-saved points are not a secure competitive economy.

The original forest backdrop was generated with the built-in image_gen tool. The final files are `public/game-art/maple-meadow.png` and its web delivery copy `public/game-art/maple-meadow.webp`. The full generation prompt and source path are in `artwork/mini/adventure-background.json`. Pixel emote props are native canvas artwork.

## Shared character identity (October 11, 2026)

All appearances now use the original six-frame walk character as their identity reference. Classic dress + original ombre hair retain those exact frames. Home portraits, activity previews, cafe seating, emotes and the adventure use the same renderer; no state switches into the earlier front-facing modular doll. The wardrobe offers 12 complete looks from a generated 4x3 sheet, generated with the original face and proportions as the reference. Custom looks animate a six-phase leg stride and body bob; the original look keeps its original full walk sequence. Eye color and cheek accents change without replacing the face shape. A single shared look follows the player; the old original/styled walker selector is removed.

Original look can be restored with Use original Mini, preserving points, quest and study progress. Artwork prompt: `artwork/mini/unified-style.json`; source atlas: `artwork/mini/unified-looks-atlas.png`; packaging: `scripts/package-unified-mini.py`. Older modular art is retained as source history, but is no longer the character renderer.
