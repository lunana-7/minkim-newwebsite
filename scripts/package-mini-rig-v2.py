"""Register existing approved artwork by height and ground pivot, never by hair width.
Mechanical export only: alpha trim, uniform nearest-neighbor scale, padding.
"""
from pathlib import Path
from PIL import Image
from collections import deque
import json
ROOT=Path(__file__).resolve().parents[1]
atlas=Image.open(ROOT/'artwork/mini/unified-looks-atlas.png').convert('RGBA')
out=ROOT/'public/mini/rig-v2';thumbs=ROOT/'public/mini/rig-v2-thumbnails'
out.mkdir(exist_ok=True);thumbs.mkdir(exist_ok=True)
manifest={'version':2,'canvas':[192,192],'groundPivot':[96,190],'visibleHeight':180,'legSplit':96,'legTop':164,'legacyOverlayOffset':[32,0],'filter':'nearest','sprites':{}}
for row,hair in enumerate(['ombre','bob','twintails']):
 for col,outfit in enumerate(['classic','berry','ocean','meadow']):
  cell=atlas.crop((round(col*atlas.width/4),round(row*atlas.height/3),round((col+1)*atlas.width/4),round((row+1)*atlas.height/3)))
  # Keep the main connected sprite; neighboring hair fragments can cross AI atlas cells.
  alpha=cell.getchannel('A'); pixels=alpha.load(); seen=set(); components=[]
  for y in range(cell.height):
   for x in range(cell.width):
    if pixels[x,y]<=128 or (x,y) in seen:continue
    q=deque([(x,y)]);seen.add((x,y));component=[]
    while q:
     a,b=q.popleft();component.append((a,b))
     for dx,dy in [(-1,-1),(0,-1),(1,-1),(-1,0),(1,0),(-1,1),(0,1),(1,1)]:
      nx,ny=a+dx,b+dy
      if 0<=nx<cell.width and 0<=ny<cell.height and (nx,ny) not in seen and pixels[nx,ny]>128:seen.add((nx,ny));q.append((nx,ny))
    components.append(component)
  main=max(components,key=len);keep=Image.new('L',cell.size);mask=keep.load()
  for x,y in main:
   for dx in [-1,0,1]:
    for dy in [-1,0,1]:
     if 0<=x+dx<cell.width and 0<=y+dy<cell.height:mask[x+dx,y+dy]=pixels[x+dx,y+dy]
  cell.putalpha(keep)
  bbox=keep.getbbox()
  art=cell.crop(bbox);scale=180/art.height
  width=round(art.width*scale)
  if width>188:raise ValueError(f'{hair}/{outfit} exceeds the padded registration canvas')
  art=art.resize((width,180),Image.Resampling.NEAREST)
  frame=Image.new('RGBA',(192,192));frame.alpha_composite(art,((192-width)//2,10))
  name=f'{hair}-{outfit}';frame.save(out/(name+'.png'),optimize=True)
  thumb=Image.new('RGBA',(80,80));small=art.resize((round(width/3),60),Image.Resampling.NEAREST);thumb.alpha_composite(small,((80-small.width)//2,10));thumb.save(thumbs/(name+'.png'),optimize=True)
  manifest['sprites'][name]={'rect':[0,0,192,192],'alphaBounds':list(frame.getbbox()),'pivot':[96,190],'headAnchor':[106,86],'handAnchor':[140,132]}
# Reference frame is registered in the same world, retaining the exact original walk animation.
walks=[Image.open(ROOT/f'public/mini/walk/frame-{i}.png').convert('RGBA') for i in range(6)]
scale=min(180/max(im.height for im in walks),180/max(im.width for im in walks))
for i,im in enumerate(walks):
 art=im.resize((round(im.width*scale),round(im.height*scale)),Image.Resampling.NEAREST);frame=Image.new('RGBA',(192,192));frame.alpha_composite(art,((192-art.width)//2,190-art.height));frame.save(out/f'walk-{i}.png',optimize=True)
(out/'manifest.json').write_text(json.dumps(manifest,indent=2))
print('Exported 12 registered looks and six original walk frames on a common 192px canvas.')
