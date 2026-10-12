# Mini’s world expansion

Five playable maps: Maple Meadow, Cloudwood Forest, Moonlit Harbor, Mini’s Farm, Berry Market. Each has an independent background. The meadow retains its star quest and café. Forest and harbor retain platform movement; the farm and market have open walking ground. World travel is available in the top world selector. The detailed map shows current position, landmarks and a Meet the locals directory; choosing a local moves Mini nearby and opens the conversation. Farm plots can also be clicked in the world scene.

## Locals

- Meadow: Pippin (star keeper), Mabel (café host).
- Forest: Sage (library/Wiki guide), Fern (trail guide).
- Harbor: Marina (harbor guide), Kip (market messenger).
- Farm: Clover (farm mentor), Pip (orchard neighbor).
- Market: Bram (produce merchant), Poppy (seed grower).

NPCs use code-native pixel sprites with bunny, cat, fox and owl designs, a small idle bob, name labels and proximity talk prompts. Press Enter nearby, click the NPC or use the map directory. Conversations provide actions for quests, café, farm, market, map or Wiki.

## Farming economy

New profiles and migrated older profiles receive 100 farm coins, 6 carrot seeds, 2 wheat seeds and 2 strawberry seeds. There are six plots. Plant consumes one seed. Watering is allowed once per crop, shortens total growth time by 25%, and adds one harvested unit. Harvest clears the plot, adds produce and awards 2 game points. Growth uses saved wall-clock timestamps and continues while the visitor explores or closes the page. No fake completion time is injected.

| Crop | Growth | Watered growth | Seed cost | Sale per unit | Yield |
| --- | --- | --- | --- | --- | --- |
| Carrot | 60s | 45s | 3 coins | 10 coins | 2, or 3 watered |
| Wheat | 90s | 67.5s | 5 coins | 14 coins | 2, or 3 watered |
| Strawberry | 120s | 90s | 8 coins | 22 coins | 2, or 3 watered |

Buy seed buys one; Sell harvest sells all held units of that crop. Farm coins are game currency, separate from points. All farm data is part of owner-specific player profile schema 6. Normalization preserves earlier outfit, quest, study and activity data. Firestore rules validate the new fields and maps but have not been deployed; Firebase provisioning is still pending the existing required terms approval. Browser-local saving currently works. The prototype uses client state; it is not a server-authoritative economy or a multiplayer market.

## Assets and sharing

Source/optimized map pairs: `public/game-art/cloudwood-forest.{png,webp}`, `moonlit-harbor`, `mini-farm`, `berry-market`.

Game-style sharing card: `public/social/mins-world.png` (1200×630), full-resolution source `mins-world-source.png`. Title: MIN’S WORLD; subtitle: AI GOVERNANCE · PROJECTS · PIXEL ADVENTURES. Layout Open Graph and Twitter large-image tags reference this card with the configured site origin. Local changes are not deployed; external link previews require deploying the asset/metadata and may be cached by sharing services.

All image-generation prompts are in `artwork/mini/world-expansion.json`. Code-native NPCs, map diagram and crop icons extend the existing canvas/SVG system. No game art or third-party music is copied.
