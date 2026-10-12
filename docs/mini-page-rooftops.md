# Mini’s page rooftops

The bottom companion can be picked up with pointer capture and placed on a visible card, footer, main panel, or sidebar ledge. Her feet snap within 38 pixels of the top edge. Panels too close to the viewport ceiling are skipped so her head stays visible; the sidebar uses its brand header ledge when its outer top has insufficient room.

Mini walks with the existing six registered frames for her selected outfit. At the edge she takes alternating climbing steps for 0.85 seconds, then opens an original pixel parachute, sways, and descends gently. Crossing another visible panel top lands her there; otherwise she returns to her existing bottom route. Her original face, accessories, and saved player profile are preserved.

Positions are temporary. The renderer follows the actual panel bounding rectangle on scroll and resize. Menus, activities, stationary emotes, and game dialogs pause surface walking; open dialogs pause descent too. Pick her up again during walking, climbing, or floating. Reduced motion disables automatic rooftop walking and swaying while retaining user-directed placement and a gentle descent.

Implementation: `src/lib/min-drag.js`, shared character rendering in `min-appearance.js`, and the companion styles in `world-theme.css`. The parachute is an original code-native SVG included in the MIT game source bundle.
