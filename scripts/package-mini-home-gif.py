"""Mechanically extract generated scene frames and encode a transparent GIF."""
from pathlib import Path
from PIL import Image
ROOT=Path(__file__).resolve().parents[1]
source=Image.open(ROOT/'artwork/mini/home-planning-atlas.png').convert('RGBA')
OUT=ROOT/'public/mini/home';OUT.mkdir(parents=True,exist_ok=True)
cells=[]
for i in range(8):
 col=i%4;row=i//4
 cells.append(source.crop((round(col*source.width/4),round(row*source.height/2),round((col+1)*source.width/4),round((row+1)*source.height/2))))
# One common alpha crop preserves relative registration across the sequence.
bounds=[frame.getchannel('A').point(lambda a:255 if a>128 else 0).getbbox() for frame in cells]
bounds=[b for b in bounds if b]
box=(min(b[0] for b in bounds),min(b[1] for b in bounds),max(b[2] for b in bounds),max(b[3] for b in bounds))
frames=[]
for i,cell in enumerate(cells):
 frame=cell.crop(box);scale=min(368/frame.width,368/frame.height)
 frame=frame.resize((round(frame.width*scale),round(frame.height*scale)),Image.Resampling.NEAREST)
 canvas=Image.new('RGBA',(384,384));canvas.alpha_composite(frame,((384-frame.width)//2,(384-frame.height)//2));canvas.save(OUT/f'planning-frame-{i}.png',optimize=True);frames.append(canvas)
frames[5].save(OUT/'planning-still.png',optimize=True)
palette=source.convert('RGB').quantize(colors=255,method=Image.Quantize.MEDIANCUT,dither=Image.Dither.NONE)
encoded=[]
for rgba in frames:
 indexed=rgba.convert('RGB').quantize(palette=palette,dither=Image.Dither.NONE)
 colors=indexed.getpalette();colors=colors[:765]+[0,0,0];indexed.putpalette(colors)
 mask=rgba.getchannel('A').point(lambda a:255 if a<=128 else 0)
 indexed.paste(255,mask=mask);indexed.info['transparency']=255;encoded.append(indexed)
encoded[0].save(OUT/'planning.gif',save_all=True,append_images=encoded[1:],duration=[700,400,450,500,850,850,550,700],loop=0,transparency=255,disposal=2,optimize=False)
print(f'Encoded eight-frame, 5-second GIF: {(OUT/"planning.gif").stat().st_size:,} bytes')
