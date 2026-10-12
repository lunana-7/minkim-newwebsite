# Mini’s pet companions

The game wardrobe has a Pets tab with None, Cat and Dog; cream, ginger, cocoa and midnight coats; berry bow or sage bandana; a short name and a Follow Mini switch. Choices save immediately in the current player profile.

Original canvas sprites share a 40 × 32 native frame and paw baseline. Four walking phases, alternating paws, tail wag/curl, blink and sitting pose are drawn from the same silhouette. The adventure places pets behind Mini, changes facing with travel, jumps toward platforms and resets placement on world/account changes. A large distance recovery only applies while following. Turning follow off keeps the companion at its current location until world travel.

Schema 10 validates allowed types, coats and accessories, a 16-character string and a boolean. Existing profiles get no pet by default. Cloud rules are prepared in firestore.rules; Firebase configuration and deployment remain pending, so the currently available save is browser-local. The separate Alignment World prototype does not render companions yet.

The renderer honors reduced motion by disabling cosmetic bobbing and wagging. Pet placement is temporary and is not persisted. Original native sprite code is included in the scoped MIT source bundle.
