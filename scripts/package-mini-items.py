"""Register generated pixel art cells without painting or altering the artwork."""
from pathlib import Path
from PIL import Image
import json

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / 'artwork/mini/items'
TARGET = ROOT / 'public/game-art/items'
TARGET.mkdir(parents=True, exist_ok=True)
manifest = {}


def save(name, image):
    filename = f'{name}.png'
    image.save(TARGET / filename, optimize=True)
    manifest[name] = {'path': f'/game-art/items/{filename}', 'width': image.width, 'height': image.height}


def cells(file, rows):
    image = Image.open(SOURCE / file).convert('RGBA')
    for row_index, row in enumerate(rows):
        for col_index, name in enumerate(row):
            left = round(col_index * image.width / len(row))
            right = round((col_index + 1) * image.width / len(row))
            top = round(row_index * image.height / len(rows))
            bottom = round((row_index + 1) * image.height / len(rows))
            cell = image.crop((left, top, right, bottom))
            mask = cell.getchannel('A').point(lambda alpha: 255 if alpha > 10 else 0)
            box = mask.getbbox()
            if box:
                cell = cell.crop(box)
            save(name, cell)


cells('crops-atlas.png', [
    [f'crop-carrot-{stage}' for stage in ('sprout', 'growing', 'ripe', 'harvest')],
    [f'crop-wheat-{stage}' for stage in ('sprout', 'growing', 'ripe', 'harvest')],
    [f'crop-strawberry-{stage}' for stage in ('sprout', 'growing', 'ripe', 'harvest')],
])
cells('resources-atlas.png', [
    ['resource-wood', 'resource-acorn', 'resource-shell'],
    ['resource-fish', 'resource-mushroom', 'resource-crystal'],
    ['resource-ore', 'resource-cactus', 'resource-herb'],
])
cells('props-atlas.png', [
    ['prop-axe', 'prop-pickaxe', 'prop-rod', 'prop-glove'],
    ['prop-basket', 'prop-seed', 'prop-soil-sprouts', 'prop-wateringcan'],
    ['prop-chefhat', 'prop-apron', 'prop-book', 'prop-satchel'],
    ['prop-scarf', 'prop-flower', 'prop-star', 'prop-sailorcap'],
])
cells('desserts-atlas.png', [
    ['dessert-cone-vanilla', 'dessert-cone-strawberry', 'dessert-cone-chocolate', 'dessert-bowl'],
    ['dessert-cake-vanilla', 'dessert-cake-strawberry', 'dessert-cake-chocolate', 'dessert-whisk'],
    ['dessert-machine', 'dessert-oven', 'dessert-piping', 'dessert-tray'],
])

soil = Image.open(SOURCE / 'empty-soil-atlas.png').convert('RGBA')
box = soil.getchannel('A').point(lambda alpha: 255 if alpha > 10 else 0).getbbox()
save('prop-soil', soil.crop(box) if box else soil)

pets = Image.open(SOURCE / 'pets-atlas.png').convert('RGBA')
for row, (kind, coat) in enumerate([(kind, coat) for kind in ('cat', 'dog') for coat in ('cream', 'ginger', 'cocoa', 'midnight')]):
    frames = [pets.crop((round(col * pets.width / 4), round(row * pets.height / 8),
                         round((col + 1) * pets.width / 4), round((row + 1) * pets.height / 8)))
              for col in range(4)]
    # Use one crop rectangle per animation row so paws and heads hold their ground registration.
    boxes = [frame.getchannel('A').point(lambda alpha: 255 if alpha > 10 else 0).getbbox() for frame in frames]
    union = (min(b[0] for b in boxes if b), min(b[1] for b in boxes if b),
             max(b[2] for b in boxes if b), max(b[3] for b in boxes if b))
    for col, frame in enumerate(frames):
        save(f'pet-{kind}-{coat}-{col}', frame.crop(union))

for name in ('hero-dreamy', 'icecream-interior', 'bakery-interior'):
    Image.open(SOURCE / f'{name}.png').convert('RGB').save(TARGET / f'{name}.webp', 'WEBP', quality=87, method=6)

(TARGET / 'manifest.json').write_text(json.dumps(manifest, indent=2) + '\n')
print(f'Packaged {len(manifest)} generated pixel objects and three scenes.')
