# World terrain and climbing

Seven map palettes each have a generated ground sprite and floating platform sprite. The alpha atlas and prompt are kept in artwork/mini; package-mini-terrain.py extracts and registers the cells. Surface metadata places rendered grass or paving at the same feet/collision baseline. Ground scrolls with the physical camera; its soil continues to the viewport bottom. Platform end shapes remain un-stretched.

Every world now has 17–18 platforms across three trails. Four ascending tiers reach y=96 from the floor at y=408. Consecutive rises are at most 80 pixels; jump speed 650 with gravity 1400 yields about 151 pixels of rise. No double jump is required. A visible ceiling keeps Mini in frame. The jump buffer and coyote window remain in use. Down/S or the Drop button skips only the current platform; the next one can catch Mini. Pets use the same layout and gravity.

Meadow stars are positioned along the new routes using the existing sixteen bit indices, so previously collected progress stays collected. Resources, NPCs and portals remain at ground level. The new terrain module is included in the scoped MIT source bundle; generated artwork is separate.
