import manifest from '../../public/game-art/terrain/manifest.json';

export const JUMP_SPEED = 650;
export const GRAVITY = 1400;
// Four reachable tiers, connected by short gaps. Feet and collision use the cap.
export function worldPlatforms(world) {
  const shift = {sunny:0,forest:20,night:35,secret:45,desert:10,farm:0,market:25}[world] || 0;
  const result = [];
  for (const base of [220,1320,2420]) {
    for (const [dx,y,w] of [[0,330,180],[185,250,180],[370,170,180],[555,96,190],[790,180,160],[975,270,130]]) {
      if(base+dx+w+shift<3560) result.push({x:base+dx+shift,y,w});
    }
  }
  return result.sort((a,b)=>a.y-b.y);
}
export const meadowStars = [
  {x:170,y:360},
  ...[220,1320,2420].flatMap(base=>[[90,286],[275,206],[460,126],[650,52],[870,136]].map(([dx,y])=>({x:base+dx,y}))),
];
const images = new Map();
function artwork(path) {
  if (!images.has(path)) { const im = new Image(); im.src = path; images.set(path,im); }
  return images.get(path);
}
export function drawTerrain(ctx,world,camera,width,floor,platforms) {
  const skin=manifest[world] || manifest.sunny, ground=artwork(skin.ground.path), platform=artwork(skin.platform.path);
  ctx.imageSmoothingEnabled=false;
  if(ground.complete&&ground.naturalWidth) {
    const tile=256, scale=tile/skin.ground.width, cap=skin.ground.surface*scale;
    // Continue the soil texture below the crop rather than a generic brown fill.
    const soilY=Math.min(skin.ground.height-8,skin.ground.surface+25);
    for(let x=-Math.floor(camera%tile);x<width;x+=tile) {
      ctx.drawImage(ground,0,soilY,ground.naturalWidth,ground.naturalHeight-soilY,x,floor,tile,480-floor);
      ctx.drawImage(ground,x,Math.round(floor-cap),tile,Math.ceil(skin.ground.height*scale));
    }
  } else { ctx.fillStyle={night:'#738a91',desert:'#d9ae77',market:'#b39271',secret:'#536d69'}[world]||'#947151';ctx.fillRect(0,floor,width,480-floor); }
  for(const p of platforms) {
    if(p.x-camera>width||p.x+p.w-camera<0)continue;
    if(platform.complete&&platform.naturalWidth) {
      // Preserve cap details and end silhouettes: center stretches, ends do not.
      const h=46,scale=h/skin.platform.height, cap=skin.platform.surface*scale, end=65,edge=Math.min(p.w/3,end*scale);
      const y=Math.round(p.y-cap),x=Math.round(p.x-camera),sw=platform.naturalWidth,sh=platform.naturalHeight;
      ctx.drawImage(platform,0,0,end,sh,x,y,edge,h);
      ctx.drawImage(platform,end,0,sw-end*2,sh,x+edge,y,p.w-edge*2,h);
      ctx.drawImage(platform,sw-end,0,end,sh,x+p.w-edge,y,edge,h);
    } else {ctx.fillStyle='#829d70';ctx.fillRect(p.x-camera,p.y,p.w,8);}
  }
}
