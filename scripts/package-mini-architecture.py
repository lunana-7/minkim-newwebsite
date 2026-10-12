"""Crop generated transparent atlas cells and register each door and foundation."""
from pathlib import Path
from PIL import Image
import json
root=Path(__file__).resolve().parents[1]
source=root/'artwork/mini/architecture';out=root/'public/game-art/architecture'
out.mkdir(parents=True,exist_ok=True)
manifest={'buildings':{},'portals':{}}
buildings=Image.open(source/'buildings-atlas.png').convert('RGBA')
for name,box,door,height in [
 ('cafe',(0,0,520,488),320,176),('icecream',(520,0,1030,488),726,176),('bakery',(1030,0,1536,488),1199,176),
 ('farm',(0,488,520,1024),273,178),('market',(520,488,1030,1024),883,162),('library',(1030,488,1536,1024),1333,190)]:
 cell=buildings.crop(box);bounds=cell.getchannel('A').getbbox();sprite=cell.crop(bounds);sprite.save(out/f'{name}.png')
 manifest['buildings'][name]={'path':f'/game-art/architecture/{name}.png','width':sprite.width,'height':sprite.height,'door':door-box[0]-bounds[0],'displayHeight':height}
portals=Image.open(source/'portals-atlas.png').convert('RGBA')
for i,name in enumerate(['sunny','forest','night','secret','desert','farm','market']):
 col=i%4;row=i//4;box=(col*362,0 if row==0 else 539,(col+1)*362,539 if row==0 else 1086)
 cell=portals.crop(box);bounds=cell.getchannel('A').getbbox();sprite=cell.crop(bounds);sprite.save(out/f'portal-{name}.png')
 manifest['portals'][name]={'path':f'/game-art/architecture/portal-{name}.png','width':sprite.width,'height':sprite.height,'displayHeight':154}
(out/'manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
print('Packaged six buildings and seven portals with original alpha.')
