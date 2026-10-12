# Generated pixel art and shop rooms

Mini's World uses original bitmap art made with built-in ImageGen. The original crops, resource nodes, tools, dessert props, pet walk frames, empty soil bed, calm homepage backdrop and two shop interiors are in `artwork/mini/items/`. The exact generation prompts are in `artwork/mini/items/prompts.json`.

`scripts/package-mini-items.py` crops the transparent source atlases into 82 registered PNG sprites while preserving their alpha and saves the three scenes as WebP. `public/game-art/items/manifest.json` maps IDs to paths and dimensions. The script only slices and packages generated art; it does not paint or edit it. Pet frames share a row registration rectangle so walking paws hold the same baseline.

The farm shows an empty soil bed or the appropriate crop growth stage. Market cards and the gathering pouch show the same harvested crop and resource sprites used in the side-scrolling world. The world also draws generated resource nodes, gathering tools, NPC accessories, pets and collectible stars. Cloud Scoop and Honeycrumb use generated indoor backgrounds and food props during order steps. Mini's existing full outfit sprite walks to a door and reappears inside wearing the chosen look.

The illustrated art is separate from the MIT game-code license. The source ZIP includes code and the image manifest; using it elsewhere requires supplying artwork under its own permission terms.
