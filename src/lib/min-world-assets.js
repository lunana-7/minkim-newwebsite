import manifest from '../../public/game-art/items/manifest.json';
const cache=new Map();
export function itemPath(id){return manifest[id]?.path||'';}
export function itemImage(id){const path=itemPath(id);if(!path)return null;if(!cache.has(path)){const image=new Image();image.src=path;cache.set(path,image);}return cache.get(path);}
export function drawItem(ctx,id,x,feet,height,width){const im=itemImage(id);if(!im?.complete||!im.naturalWidth)return;const w=width||height*im.naturalWidth/im.naturalHeight;ctx.imageSmoothingEnabled=false;ctx.drawImage(im,Math.round(x-w/2),Math.round(feet-height),Math.round(w),height);}
export function cropStage(plot,readyAt){if(!plot)return 'empty';const fraction=(Date.now()-plot.plantedAt)/Math.max(1,readyAt-plot.plantedAt);return fraction>=1?'ripe':fraction<.35?'sprout':'growing';}
export function preloadItems(){for(const id of Object.keys(manifest))itemImage(id);}
