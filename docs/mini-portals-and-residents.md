# Connected worlds and residents

The seven regions now contain physical portals along their side-scrolling trails. Stand at ground level in front of a portal and press ↑ (or W) to cross. The nearby Enter Portal button provides the same deliberate action on touchscreens. Passing through or clicking the portal does not change worlds; E is reserved for talking. Travel carries the existing player profile and saves the arrival position. A short arrival glow marks crossing; reduced-motion mode disables that effect.

## Bidirectional routes

- Maple Meadow ↔ Cloudwood Forest / Moonlit Harbor / Mini’s Farm / Berry Market.
- Cloudwood Forest ↔ Secret Forest.
- Secret Forest ↔ Sunpetal Desert.
- Sunpetal Desert ↔ Moonlit Harbor.
- Mini’s Farm ↔ Berry Market.
- Berry Market ↔ Moonlit Harbor.

Every destination has a matching return portal. Arrival offsets Mini away from the doorway, with a 1.1-second portal cooldown to prevent repeated crossings. Active activities or gathering prevent portal entry. All routes are open; Pippin’s star quest remains optional and still awards cake and points. The old looping cloud gate has been replaced by connected travel.

The illustrated world map shows the route network, the current region has a World Portals directory, and the local trail distinguishes portals (violet diamonds) from residents (cream squares). Map shortcuts remain available. The directory moves Mini within the current trail to a portal approach; crossing then uses the same physical doorway interaction.

## Resident style

Sixteen residents use the existing unified Mini-style look sprites at the same 50 × 74 logical gameplay size as the player. Each has a configured hair/outfit combination and role accessory: chef cap, apron, book, satchel, crystal, scarf, flower, star or sailor cap. Names, roles and existing quests/shop interactions remain. Dialog portraits match their in-world outfit. No new third-party character art is used.

`min-portals.js` centralizes route links, portal placement, reciprocal arrivals and NPC looks. Native pixel portal frames, sparkles and accessories are drawn by `min-adventure.js`. This code module is included in the scoped MIT source archive; character artwork remains outside the code license.
