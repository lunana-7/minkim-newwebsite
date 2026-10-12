import manifest from '../../public/game-art/architecture/manifest.json';
const cache=new Map();
function asset(item){if(!item)return null;if(!cache.has(item.path)){const im=new Image();im.src=item.path;cache.set(item.path,im);}return cache.get(item.path);}
export function drawBuilding(ctx,kind,x,floor){const item=manifest.buildings[kind],im=asset(item);if(!im?.complete||!im.naturalWidth)return;const scale=item.displayHeight/item.height;ctx.imageSmoothingEnabled=false;ctx.drawImage(im,Math.round(x-item.door*scale),Math.round(floor-item.displayHeight),Math.round(item.width*scale),item.displayHeight);}
export function drawPortalArt(ctx,world,x,floor,time,reduced=false){const item=manifest.portals[world],im=asset(item);if(!im?.complete||!im.naturalWidth)return;const h=item.displayHeight,w=Math.round(item.width*h/item.height);ctx.imageSmoothingEnabled=false;ctx.drawImage(im,Math.round(x-w/2),floor-h,w,h);
 // A moving light inside the baked gateway preserves its stone frame and collision.
 if(!reduced){ctx.save();ctx.globalAlpha=.22+.13*Math.sin(time/480);const glow=ctx.createRadialGradient(x,floor-74,2,x,floor-74,35);glow.addColorStop(0,'#fff5dd');glow.addColorStop(1,'#fff5dd00');ctx.fillStyle=glow;ctx.fillRect(x-35,floor-109,70,70);ctx.restore();}
}
export function preloadArchitecture(){for(const group of Object.values(manifest))for(const item of Object.values(group))asset(item);}
