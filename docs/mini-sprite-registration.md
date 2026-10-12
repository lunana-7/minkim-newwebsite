# Mini sprite registration v2

## Failure and correction

The legacy full-look exporter used `min(124 / width, 180 / height)` separately on every cell. Wide twin-tail hair therefore shrank the entire character to fit a narrow width. The previous runtime also had an earlier head overlay path (already removed), which must never return: a complete character sprite already contains its face. The supplied screenshots show the visible consequences of head compositing and inconsistent registration.

Runtime sprites now use a **192 × 192** canvas, **180px** visible character height and **(96,190)** ground pivot. The exporter uses height alone as the uniform scale and rejects content wider than the padded canvas. This preserves the whole character's aspect ratio. Each source atlas cell is isolated by its largest connected opaque sprite component to remove neighboring-cell hair fragments. Source artwork stays in `artwork/mini/unified-looks-atlas.png`; legacy exports remain for provenance. The existing original six walking frames are registered once onto the same pivot and retained as the default walk animation.

## Contracts

- `/mini/rig-v2/manifest.json`: sprite rectangles, alpha bounds, ground pivot, head/hand anchors, leg split and legacy accessory offset.
- `scripts/package-mini-rig-v2.py`: mechanical connected-component isolation, uniform nearest-neighbor resize, padding, thumbnails and manifest export.
- `min-assets.js`: runtime paths and canvas dimensions. These point to rig-v2, not the legacy narrow exports.
- `min-appearance.js`: one full character draw; eye tint, cheek details and accessories are optional overlays. No face image is layered over a full character. Legacy hats/props have one explicit 32px horizontal registration offset.
- Character canvas displays at **1:1 intrinsic aspect**. In-world copies use square render rectangles, anchored at the feet; the physical movement hitbox stays 50 × 74.
- NPCs use the same registered art and render scale. Alignment World browser portraits and prepared Unity resource files were updated to the same geometry. Unity source is still uncompiled.
- FX remain on a separate padded canvas and do not change character proportions.

This follows the general sprite workflow of explicit rectangles, consistent pixels-per-unit/pivots and registered sprite swaps. It does not claim to reproduce a proprietary studio's internal pipeline. Reference: Unity Sprite Editor, https://docs.unity.com/en-us/engine/6000.6/manual/unity2d/sprite/sprite-editor-window-reference/reference; Unity Sprite Swap, https://docs.unity.cn/Packages/com.unity.2d.animation@9.2/manual/CharacterParts.html.

The custom-look walking pose still uses the existing lightweight leg translation/bob animation. A future animation production pass can replace those poses with artist-authored equipment layers per action without changing the registration contract. This repair addresses face duplication, width-driven size changes and sprite-cell bleed; it is not a claim that a complete studio-grade asset library has been authored.
