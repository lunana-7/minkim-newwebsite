# Mini’s gathering worlds

The illustrated world map in `/game` connects seven destinations: Maple Meadow, Cloudwood Forest, Moonlit Harbor, Secret Forest, Sunpetal Desert, Mini’s Farm and Berry Market. Select a landmark to travel. The local trail and gathering directory show destinations within the current region.

## Play

Walk to a resource and press **G**, use **Gather / G**, or click its pixel object. Gathering takes 1.4 seconds with a moving hand, axe, pickaxe or fishing rod and a progress bar. Each spot regenerates after 30 seconds. Pausing, changing player, opening a conversation, changing worlds or starting an activity cancels the action. Tools are included; no purchase required.

- Meadow: herbs.
- Timber forest: timber and acorns.
- Harbor: seashells and fish.
- Secret Forest: moon mushrooms and forest crystals.
- Desert: ore and cactus fruit.

There are 14 resource spots and nine resource types. Every collection awards one point. The pouch shows inventory and lifetime gathered count. At Berry Market, **Sell all** exchanges all held units of one resource for farm coins. Those coins also buy farming seeds.

## Saving and implementation

Profile schema 7 adds `gathering.inventory`, `gathering.cooldowns` (timestamp per node) and `gathering.collected`. Existing saves receive empty resource inventories without resetting appearance, farm, study or adventure. The world allowlist includes `secret` and `desert`. Firestore validation has been prepared for these fields but Firebase provisioning remains pending the requested terms approval. Until connected, progress saves in this browser.

This is a client-side prototype economy, not a server-authoritative multiplayer economy. System-clock changes can affect regeneration, as with farming growth timers. Game coins have no monetary value.

Resource configuration is in `min-resource-data.js`, inventory operations in `min-gathering.js`, and movement/gathering rendering in `min-adventure.js`. These code modules are included in the scoped MIT source bundle. Generated artwork remains outside that code license.
