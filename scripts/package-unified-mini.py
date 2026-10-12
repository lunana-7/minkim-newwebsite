"""Extract the generated 4x3 look atlas; retain original walk art unchanged."""
from pathlib import Path
from PIL import Image
ROOT=Path(__file__).resolve().parents[1]
atlas=Image.open(ROOT/'artwork/mini/unified-looks-atlas.png').convert('RGBA')
OUT=ROOT/'public/mini/looks';THUMB=ROOT/'public/mini/look-thumbnails'
OUT.mkdir(parents=True,exist_ok=True);THUMB.mkdir(parents=True,exist_ok=True)
for row,hair in enumerate(['ombre','bob','twintails']):
 for col,outfit in enumerate(['classic','berry','ocean','meadow']):
  art=atlas.crop((round(col*atlas.width/4),round(row*atlas.height/3),round((col+1)*atlas.width/4),round((row+1)*atlas.height/3)))
  bounds=art.getchannel('A').point(lambda a:255 if a>128 else 0).getbbox()
  if not bounds:raise ValueError('Empty sprite')
  art=art.crop(bounds);scale=min(124/art.width,180/art.height)
  art=art.resize((round(art.width*scale),round(art.height*scale)),Image.Resampling.NEAREST)
  canvas=Image.new('RGBA',(128,192));canvas.alpha_composite(art,((128-art.width)//2,190-art.height))
  name=f'{hair}-{outfit}.png';canvas.save(OUT/name,optimize=True)
  thumb=Image.new('RGBA',(64,64));crop=canvas.crop(canvas.getbbox());scale=min(60/crop.width,60/crop.height);crop=crop.resize((round(crop.width*scale),round(crop.height*scale)),Image.Resampling.NEAREST);thumb.alpha_composite(crop,((64-crop.width)//2,(64-crop.height)//2));thumb.save(THUMB/name,optimize=True)
# A mechanically cropped original portrait keeps all brand portraits recognizable.
original=Image.open(ROOT/'public/mini/walk/frame-0.png').convert('RGBA')
head=original.crop((0,0,original.width,round(original.height*.54)))
bounds=head.getbbox();head=head.crop(bounds)
for size,name in [(64,'favicon-mini.png'),(32,'favicon-mini-32.png'),(16,'favicon-mini-16.png'),(180,'apple-touch-icon.png')]:
 art=head.copy();art.thumbnail((size-2,size-2),Image.Resampling.NEAREST);canvas=Image.new('RGBA',(size,size));canvas.alpha_composite(art,((size-art.width)//2,(size-art.height)//2));canvas.save(ROOT/'public'/name)
Image.open(ROOT/'public/favicon-mini-32.png').save(ROOT/'public/favicon.ico',sizes=[(16,16),(32,32)])
head.save(OUT/'original-head.png')
print('Packaged 12 matching looks and original Mini portraits.')
