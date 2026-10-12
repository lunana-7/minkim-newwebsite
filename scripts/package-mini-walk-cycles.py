"""Register complete generated walk poses on the existing 192px ground pivot."""
from pathlib import Path
from PIL import Image
import json
from collections import deque
ROOT=Path(__file__).resolve().parents[1];out=ROOT/'public/mini/walk-cycles'
out.mkdir(exist_ok=True)
manifest={'version':1,'canvas':[192,192],'pivot':[96,190],'frameMs':120,'cycles':{}}
# Reject poses whose cardigan coverage differs; substitute the matching passing/contact pose.
accepted={('ombre','berry'):[0,4,2,0,4,5],('twintails','berry'):[0,4,2,0,4,5],('bob','meadow'):[0,4,2,3,4,5]}
for hair in ['ombre','bob','twintails']:
 atlas=Image.open(ROOT/f'artwork/mini/walk-cycles/{hair}-atlas.png').convert('RGBA')
 for row,outfit in enumerate(['classic','berry','ocean','meadow']):
  crops=[]
  for col in range(6):
   cell=atlas.crop((round(col*atlas.width/6),round(row*atlas.height/4),round((col+1)*atlas.width/6),round((row+1)*atlas.height/4)))
   pixels=cell.getchannel('A').load();seen=set();components=[]
   for y in range(cell.height):
    for x in range(cell.width):
     if pixels[x,y]<=128 or (x,y) in seen:continue
     queue=deque([(x,y)]);seen.add((x,y));component=[]
     while queue:
      a,b=queue.popleft();component.append((a,b))
      for dx,dy in [(-1,-1),(0,-1),(1,-1),(-1,0),(1,0),(-1,1),(0,1),(1,1)]:
       nx,ny=a+dx,b+dy
       if 0<=nx<cell.width and 0<=ny<cell.height and (nx,ny) not in seen and pixels[nx,ny]>128:seen.add((nx,ny));queue.append((nx,ny))
     components.append(component)
   mask=Image.new('L',cell.size);keep=mask.load()
   for x,y in max(components,key=len):
    for dx in [-1,0,1]:
     for dy in [-1,0,1]:
      if 0<=x+dx<cell.width and 0<=y+dy<cell.height:keep[x+dx,y+dy]=pixels[x+dx,y+dy]
   cell.putalpha(mask);crops.append(cell.crop(mask.getbbox()))
  indices=accepted.get((hair,outfit),list(range(6)));scale=min(180/max(crops[i].height for i in indices),184/max(crops[i].width for i in indices))
  paths=[]
  for frame,index in enumerate(indices):
   art=crops[index].resize((round(crops[index].width*scale),round(crops[index].height*scale)),Image.Resampling.NEAREST)
   canvas=Image.new('RGBA',(192,192));canvas.alpha_composite(art,((192-art.width)//2,190-art.height))
   name=f'{hair}-{outfit}-{frame}.png'
   if hair=='ombre' and outfit=='classic':canvas=Image.open(ROOT/f'public/mini/rig-v2/walk-{frame}.png').convert('RGBA')
   canvas.save(out/name,optimize=True);paths.append('/mini/walk-cycles/'+name)
  manifest['cycles'][f'{hair}-{outfit}']={'frames':paths,'sourceFrames':indices,'scale':scale}
(out/'manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
print('Exported 12 complete six-frame walk cycles; default Mini retains the original six frames.')
