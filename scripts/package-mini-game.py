"""Package the licensed adventure modules without site data or credentials."""
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
ROOT = Path(__file__).resolve().parents[1]
FILES = ['src/lib/min-architecture.js', 'public/game-art/architecture/manifest.json', 'src/lib/min-world-assets.js', 'public/game-art/items/manifest.json', 'src/lib/min-interactions.js', 'src/lib/min-chatter.js', 'src/lib/min-terrain.js', 'public/game-art/terrain/manifest.json', 'src/lib/min-pet-portrait.js', 'src/lib/min-pets.js', 'src/lib/min-effects.js', 'src/lib/min-portals.js', 'src/lib/min-drag.js', 'src/lib/min-kitchen-data.js', 'src/lib/min-kitchen.js', 'src/components/MiniKitchen.astro', 'src/lib/min-resource-data.js', 'src/lib/min-gathering.js', 'src/lib/min-adventure.js', 'src/lib/min-emotes.js', 'src/lib/min-cafe.js', 'src/lib/min-worlds.js', 'src/lib/min-farming.js', 'src/lib/min-farm-ui.js', 'src/components/MiniFarm.astro', 'src/components/MiniCafe.astro', 'src/components/MiniAdventure.astro', 'game/LICENSE', 'game/README.md']
with ZipFile(ROOT / 'public/game-source/mini-adventure-source.zip', 'w', ZIP_DEFLATED) as archive:
    for name in FILES:
        archive.write(ROOT / name, name)
    styles = (ROOT / 'src/world-theme.css').read_text().split('/* Mini’s playable meadow and social emotes. */', 1)[1]
    archive.writestr('src/adventure.css', styles)
print('Packaged Mini adventure source.')
