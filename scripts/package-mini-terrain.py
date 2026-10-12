"""Extract generated terrain cells without changing their pixel artwork."""
from pathlib import Path
from PIL import Image
import json
ROOT=Path(__file__).resolve().parents[1]
im=Image.open(ROOT/'artwork/mini/terrain-atlas.png').convert('RGBA')
rows=[('sunny',70,240,128),('forest',270,462,328),('night',490,656,513),('secret',690,886,743),('desert',900,1086,957),('farm',1110,1290,1160),('market',1320,1512,1346)]
out=ROOT/'public/game-art/terrain';out.mkdir(parents=True,exist_ok=True)
meta={}
for name,y0,y1,surface in rows:
 meta[name]={}
 for kind,x0,x1 in [('ground',0,560),('platform',560,1024)]:
  cell=im.crop((x0,y0,x1,y1));bounds=cell.getchannel('A').point(lambda a:255 if a>64 else 0).getbbox()
  sprite=cell.crop(bounds);sprite.save(out/f'{name}-{kind}.png')
  # Platform cap varies slightly: use the corresponding ground cap as registration.
  meta[name][kind]={'path':f'/game-art/terrain/{name}-{kind}.png','width':sprite.width,'height':sprite.height,'surface':max(0,surface-y0-bounds[1])}
(out/'manifest.json').write_text(json.dumps(meta,indent=2)+'\n')
print('Packaged fourteen registered terrain sprites.')
