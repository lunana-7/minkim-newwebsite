"""Package generated modular atlases into aligned game layers and thumbnails.

All exported layers use the same 128x192 registration canvas. Only mechanical
cell extraction, alpha cropping, nearest-neighbor resizing, and layer masking
happen here; original AI artwork is retained in artwork/mini.
"""
from pathlib import Path
from PIL import Image, ImageDraw
import json
ROOT=Path(__file__).resolve().parents[1]
SOURCE=ROOT/'artwork/mini'; OUT=ROOT/'public/mini/layers'; THUMBS=ROOT/'public/mini/thumbnails'
OUT.mkdir(parents=True,exist_ok=True);THUMBS.mkdir(parents=True,exist_ok=True)
SIZE=(128,192)
B={'body':(36,112,56,80),'arm-left':(36,123,12,35),'arm-right':(80,123,12,35),'face':(17,39,94,75),'eyes':(38,74,52,22),'clothes':(28,115,72,60),
   'hair-ombre':(8,6,112,166),'hair-bob':(2,8,124,113),'hair-twintails':(5,7,118,165),
   'hat-beret':(32,10,64,29),'hat-flower':(92,57,17,17),'hat-crown':(37,15,55,26),
   'prop-coffee':(53,91,25,29),'prop-tuna':(46,119,37,32),'prop-study':(42,128,44,33)}
def blank(): return Image.new('RGBA',SIZE)
def cell(family,index,count):
    atlas=Image.open(SOURCE/f'{family}-atlas.png').convert('RGBA');w,h=atlas.size
    piece=atlas.crop((round(index*w/count),0,round((index+1)*w/count),h))
    # Alpha-based trimming removes equal cell padding, not art content.
    bounds=piece.getchannel('A').point(lambda a:255 if a>128 else 0).getbbox()
    if not bounds: raise ValueError(f'Empty cell: {family}/{index}')
    return piece.crop(bounds)
def registered(piece,bounds):
    x,y,w,h=bounds;result=blank()
    result.alpha_composite(piece.resize((w,h),Image.Resampling.NEAREST),(x,y))
    return result
def thumbnail(art,name,bounds=None):
    if bounds: art=art.crop(bounds)
    bbox=art.getchannel('A').getbbox()
    result=Image.new('RGBA',(64,64))
    if bbox:
      crop=art.crop(bbox);scale=min(58/crop.width,58/crop.height)
      crop=crop.resize((max(1,round(crop.width*scale)),max(1,round(crop.height*scale))),Image.Resampling.NEAREST)
      result.alpha_composite(crop,((64-crop.width)//2,(64-crop.height)//2))
    result.save(THUMBS/f'{name}.png',optimize=True)
def save(art,name): art.save(OUT/f'{name}.png',optimize=True)
for i,name in enumerate(['body','arm-left','arm-right']): save(registered(cell('body',i,3),B[name]),name)
for family,names,bound in [('faces',['soft','rosy','freckles'],'face'),('eyes',['brown','hazel','blue'],'eyes')]:
    for i,name in enumerate(names):
      art=registered(cell(family,i,3),B[bound]);id=f'{bound}-{name}';save(art,id);thumbnail(art,id)
for i,name in enumerate(['classic','berry','ocean','meadow']):
    art=registered(cell('clothes-core',i,4),B['clothes'])
    left,right=blank(),blank()
    if name in ['berry','meadow']:
      offset=0 if name=='berry' else 2
      left=registered(cell('sleeves',offset,4),(32,118,18,30))
      right=registered(cell('sleeves',offset+1,4),(78,118,18,30))
    preview=art.copy();preview.alpha_composite(left);preview.alpha_composite(right)
    thumbnail(preview,f'clothes-{name}')
    save(art,f'clothes-{name}');save(left,f'sleeve-{name}-left');save(right,f'sleeve-{name}-right')
for i,name in enumerate(['ombre','bob','twintails']):
    art=registered(cell('hair',i,3),B[f'hair-{name}'])
    back=art.copy();front=art.copy()
    # Hair behind the shoulders is distinct from the cap/fringe and front sides.
    split_y=96 if name=='bob' else 113
    mask=ImageDraw.Draw(back);mask.rectangle((0,0,127,split_y-1),fill=(0,0,0,0))
    mask=ImageDraw.Draw(front);mask.rectangle((31,split_y,97,191),fill=(0,0,0,0))
    save(back,f'hair-{name}-back');save(front,f'hair-{name}-front');thumbnail(art,f'hair-{name}-front')
for family,prefix,names in [('hats','hat',['beret','flower','crown']),('props','prop',['coffee','tuna','study'])]:
    for i,name in enumerate(names):
      id=f'{prefix}-{name}';art=registered(cell(family,i,3),B[id]);save(art,id);thumbnail(art,id)
# Face thumbnails include neutral eyes so the blush/freckle options read naturally.
eyes=Image.open(OUT/'eyes-brown.png')
for name in ['soft','rosy','freckles']:
    face=Image.open(OUT/f'face-{name}.png');face.alpha_composite(eyes);thumbnail(face,f'face-{name}')
print(f'Exported {len(list(OUT.glob("*.png")))} registered PNG layers and {len(list(THUMBS.glob("*.png")))} thumbnails.')
