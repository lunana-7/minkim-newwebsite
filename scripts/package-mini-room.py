from pathlib import Path
from PIL import Image
from collections import deque
ROOT=Path(__file__).resolve().parents[1]
Image.open(ROOT/'artwork/mini/room/room.png').save(ROOT/'public/room-art/dessert-room.webp',quality=91,method=6)
atlas=Image.open(ROOT/'artwork/mini/room/furniture.png').convert('RGBA')
for name,box in [('sofa',(0,0,576,490)),('table',(576,0,1030,460)),('chair',(1030,0,1536,500)),('shelf',(0,480,550,1024)),('plant',(560,490,1024,1024)),('cart',(1024,480,1536,1024))]:
 # Coordinates use the inspected 1536 × 1024 generated atlas.
 box=tuple(round(v*(atlas.width/1536 if i%2==0 else atlas.height/1024)) for i,v in enumerate(box))
 cell=atlas.crop(box);alpha=cell.getchannel('A');px=alpha.load();seen=set();parts=[]
 for y in range(cell.height):
  for x in range(cell.width):
   if px[x,y]<=128 or (x,y) in seen:continue
   q=deque([(x,y)]);seen.add((x,y));component=[]
   while q:
    a,b=q.popleft();component.append((a,b))
    for dx,dy in [(-1,-1),(0,-1),(1,-1),(-1,0),(1,0),(-1,1),(0,1),(1,1)]:
     nx,ny=a+dx,b+dy
     if 0<=nx<cell.width and 0<=ny<cell.height and (nx,ny) not in seen and px[nx,ny]>128:seen.add((nx,ny));q.append((nx,ny))
   parts.append(component)
 keep=Image.new('L',cell.size);mask=keep.load()
 for x,y in max(parts,key=len):
  for dx in [-1,0,1]:
   for dy in [-1,0,1]:
    if 0<=x+dx<cell.width and 0<=y+dy<cell.height:mask[x+dx,y+dy]=px[x+dx,y+dy]
 cell.putalpha(keep);cell.crop(keep.getbbox()).save(ROOT/f'public/room-art/{name}.png',optimize=True)
print('Packaged dessert room and six transparent furniture sprites.')
