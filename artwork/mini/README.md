# Mini's modular pixel-art kit

**Legacy artwork history:** the original modular experiment used a **128 × 192** registration canvas. Current runtime uses the registered v2 sprites described at the end of this document. Hair, eyes, face, clothes, headwear, arms, sleeves and props can be replaced without painting over a finished character. The same parts are used for the game, homepage and walking companion.

## Files

- Runtime layers: `public/mini/layers/` — 33 transparent PNGs.
- Wardrobe previews: `public/mini/thumbnails/` — 19 transparent thumbnails.
- Source artwork: the nine `*-atlas.png` files in this directory.
- Original generation prompts: [manifest.json](manifest.json) and [sleeve-manifest.json](sleeve-manifest.json).
- Asset names and wardrobe choices: `src/lib/min-assets.js`.
- Character composition and poses: `src/lib/min-appearance.js`.
- Repeatable exporter: `scripts/package-mini-assets.py`.

All source atlases were generated with the built-in image generation tool using Min's original pixel character as the style and identity reference. The sleeve correction uses the generated clothes as its reference. The exporter trims each atlas cell's transparent padding, scales pixels with nearest-neighbor sampling, and places each part on the registration canvas. No full-character color filter or flat shirt overlay is used.

## Registration and order

The head is centered at x=64; eyes occupy the same rectangle on all faces. Hair is split into a foreground cap/fringe and background length. All clothes share the neck and waist anchors. Cardigan torsos and sleeves are separate assets; each sleeve rotates around its shoulder and exposes only the hand beneath the cuff.

Draw order: back hair → body/legs → clothes → face → eyes → arms/sleeves → front hair → headwear → activity prop. Walking alternates feet and arm swing, with a one-pixel torso/hair movement. Coffee, tuna bowl and study poses use the same selected parts and change arm angles plus the held prop.

## Adding or replacing a part

1. Keep an exported replacement as a transparent 128 × 192 PNG with the existing registration and pixel scale.
2. Replace the matching file, or add an ID to `MINI_OPTIONS` and the profile/rules allowlists.
3. For an atlas edit, retain its cell count/order and run `python3 scripts/package-mini-assets.py`.
4. Update the asset URL version in `min-assets.js` so browsers fetch the replacement.
5. Check the piece at idle, walking, and all three activities.

Profile schema 3 saves `hair`, `eyes`, `face`, `outfit`, and `hat` separately. Earlier wardrobe/points saves migrate to the default ombre hair, brown eyes and soft face while retaining clothes, points, activities and map. Firestore rules validate the new choices; cloud provisioning remains separate from the art kit.

## Proportion correction

Face layers now use a slimmer oval silhouette at 82×81 registration, centered at (23,33); eyes remain at 52×22. The original round atlas is retained as `faces-round-atlas.png`; the refinement prompt is in `face-refinement.json`. Chestnut bob hair uses 124×113 to retain its natural width. The browser canvas is constrained to its native 2:3 aspect ratio. The bottom walker uses the original six-frame artwork while game/home/activity characters retain the modular wardrobe.

## Unified original Mini (current runtime)

The previous separate face/body rig is now replaced by one shared character renderer based on the exact original walking Mini. Original classic/ombre uses the preserved six frames. Outfit and hair choices use the matching 4x3 full-look atlas, with the original walking character as the face and proportion reference. All portraits, walking, activity, cafe and game views use this identity. Code-native emote and activity props animate on top. Runtime look assets: `public/mini/looks`; selection previews: `public/mini/look-thumbnails`. `scripts/package-unified-mini.py` extracts the sheet without painting or stretching it. Prompt and source details: `unified-style.json`.

## Fixed homepage planning GIF

The homepage now uses `public/mini/home/planning.gif`, an eight-frame loop of original Mini drawing notes, linking a flowchart, reviewing it and erasing the board. It is independent of saved wardrobe appearance. A static complete-diagram frame is used for reduced-motion preferences. The clickable illustration still opens Mini's shared activity menu. Generated scene atlas: `home-planning-atlas.png`; generation prompt: `home-planning.json`; repeatable mechanical GIF encoder: `scripts/package-mini-home-gif.py`.

## Runtime registration v2

Current runtime art is in `public/mini/rig-v2`, exported by `scripts/package-mini-rig-v2.py` from the retained unified look atlas. Use the 192px square registration manifest, 180px visible height and (96,190) pivot. The older 128px full-look/layer exporters are provenance and are not the current runtime pipeline. See `docs/mini-sprite-registration.md`.
