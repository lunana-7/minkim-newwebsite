# Mini’s customizable pixel effects

In `/game`, open Style Min → Effects. Choose pixel sparkles, floating hearts, orbiting stars, fireflies or aurora ribbons. No effect turns the layer off. Five colors are available: honey gold, berry pink, dream lavender, meadow mint and moonlight blue. The intensity slider selects Gentle, Dreamy or Lively. Changes preview immediately and use the existing profile's automatic browser persistence; Save my look includes effects when cloud saving is configured.

Profile schema 9 adds `effect: {kind, color, intensity}`. Older saves receive `none / gold / 2`. This preserves appearance, activities, farming, careers and quests. Prepared Firestore rules allow only the defined kinds, colors and integer intensities; cloud provisioning/rule deployment remains pending the earlier Firebase terms approval.

The shared MiniAvatar component uses a 192px square character and a separate padded effect canvas that leaves the character's face and silhouette unchanged. It is not a new character asset. Particles stay around the outline and do not intercept pointer input. They accompany the bottom walker, dragging, activity portraits, About character, café and kitchen character, and wardrobe preview. The original fixed homepage planning GIF remains its own animation.

The cozy adventure draws the same native effect function around the player's position, including movement, jumping and carrying cake. The Alignment World browser prototype uses the selected cosmetic effect; the uncompiled Unity source does not yet implement that effect renderer. NPCs do not inherit the player's cosmetic setting.

Reduced-motion preferences show a static effect arrangement. None is the default. There are no points or currency costs. `min-effects.js` provides options, normalization and native pixel drawing and is included in the scoped MIT source bundle.
