"""Package the licensed adventure modules without site data or credentials."""
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
ROOT = Path(__file__).resolve().parents[1]
FILES = ['src/lib/min-adventure.js', 'src/lib/min-emotes.js', 'src/lib/min-cafe.js', 'src/components/MiniCafe.astro', 'src/components/MiniAdventure.astro', 'game/LICENSE', 'game/README.md']
with ZipFile(ROOT / 'public/game-source/mini-adventure-source.zip', 'w', ZIP_DEFLATED) as archive:
    for name in FILES:
        archive.write(ROOT / name, name)
    styles = (ROOT / 'src/world-theme.css').read_text().split('/* Mini’s playable meadow and social emotes. */', 1)[1]
    archive.writestr('src/adventure.css', styles)
print('Packaged Mini adventure source.')
