# Houses and gateways

Built-in ImageGen created six original architecture sprites: café, ice cream shop, bakery, farmhouse, produce market and woodland library. Seven gateways match meadow, forest, harbor, secret forest, desert, farm and market destinations. True alpha transparency is retained, with original sources and prompts in `artwork/mini/architecture`.

`package-mini-architecture.py` crops cells and records each foundation/door. `min-architecture.js` loads registered PNGs, draws buildings at existing NPC door coordinates and gateways at existing world-link coordinates. The generated art replaces the old rectangles; Portal travel uses ↑ while standing in front of the gateway; walking past or clicking it does not trigger travel. Portal particles and soft light animate without altering the stone frame. Reduced motion removes the glow pulse.

Mini's route now flips only her artwork using `--min-route-facing`. Hint text, reward labels and parachute graphics no longer inherit a mirrored parent transform.
