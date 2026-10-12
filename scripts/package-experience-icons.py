"""Mechanically extract a generated 5x2 transparent icon atlas."""
from pathlib import Path
from PIL import Image
ROOT=Path(__file__).resolve().parents[1]
art=Image.open(ROOT/'artwork/experience-map/icons-atlas.png').convert('RGBA')
ids=['krafton','pacvue','memoria','uiuc','independent','tradies','btaa','asu-research','asu-foundation','community']
for i,name in enumerate(ids):
 col=i%5;row=i//5
 icon=art.crop((round(col*art.width/5),round(row*art.height/2),round((col+1)*art.width/5),round((row+1)*art.height/2)))
 bbox=icon.getchannel('A').point(lambda a:255 if a>128 else 0).getbbox()
 if not bbox:raise ValueError(name)
 icon=icon.crop(bbox);icon.thumbnail((88,88),Image.Resampling.NEAREST)
 canvas=Image.new('RGBA',(96,96));canvas.alpha_composite(icon,((96-icon.width)//2,(96-icon.height)//2));canvas.save(ROOT/f'public/experience-map/icons/{name}.png',optimize=True)
print('Packaged 10 distinct experience icons.')
