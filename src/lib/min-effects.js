export const MINI_EFFECTS=[{id:'none',name:'No effect',icon:'—'},{id:'sparkles',name:'Pixel sparkles',icon:'✧'},{id:'hearts',name:'Floating hearts',icon:'♡'},{id:'stars',name:'Star orbit',icon:'✦'},{id:'fireflies',name:'Firefly friends',icon:'·'},{id:'aurora',name:'Aurora ribbons',icon:'≈'}];
export const EFFECT_COLORS=[{id:'gold',name:'Honey gold',hex:'#f4d38b'},{id:'berry',name:'Berry pink',hex:'#e8a2b8'},{id:'lavender',name:'Dream lavender',hex:'#c2afe8'},{id:'mint',name:'Meadow mint',hex:'#b5d4a2'},{id:'ice',name:'Moonlight blue',hex:'#a5d8e8'}];
export const DEFAULT_EFFECT={kind:'none',color:'gold',intensity:2};
export function normalizeEffect(effect){return {kind:MINI_EFFECTS.some(e=>e.id===effect?.kind)?effect.kind:'none',color:EFFECT_COLORS.some(c=>c.id===effect?.color)?effect.color:'gold',intensity:[1,2,3].includes(effect?.intensity)?effect.intensity:2};}
// Native pixel effects occupy a padded 192 × 256 canvas around the registered character.
export function drawMiniEffect(ctx,effect,time,reduced=false){if(!effect||effect.kind==='none')return;const color=EFFECT_COLORS.find(c=>c.id===effect.color)?.hex||EFFECT_COLORS[0].hex,n=effect.intensity*3,t=reduced?0:time;ctx.save();ctx.fillStyle=color;
 const px=(x,y,w,h)=>ctx.fillRect(Math.round(x),Math.round(y),w,h);
 const star=(x,y,size)=>{px(x,y-size,2,size*2+2);px(x-size,y,size*2+2,2);px(x-2,y-2,6,6);};
 const heart=(x,y)=>{px(x,y,3,3);px(x+5,y,3,3);px(x,y+3,8,3);px(x+2,y+6,4,2);px(x+3,y+8,2,1);};
 for(let i=0;i<n;i++){const p=((t/3400+i/n)%1),side=i%2?1:-1,x=96+side*(63+(i%3)*7),y=224-p*184;
  ctx.globalAlpha=reduced ? .6 : Math.max(.15,Math.sin(p*Math.PI)*.9);
  if(effect.kind==='hearts')heart(x-4,y);
  if(effect.kind==='sparkles')star(x+Math.sin(t/550+i)*3,y,2+i%2);
  if(effect.kind==='stars'){const angle=t/1800+i*Math.PI*2/n;star(96+Math.cos(angle)*76,134+Math.sin(angle)*111,3);}
  if(effect.kind==='fireflies'){const fx=x+Math.sin(t/500+i)*8,fy=y+Math.cos(t/600+i)*5;ctx.globalAlpha=.14;px(fx-4,fy-4,10,10);ctx.globalAlpha=.8;px(fx,fy,2,2);}
 }
 if(effect.kind==='aurora'){const layers=effect.intensity+1;for(let j=0;j<layers;j++)for(let i=0;i<23;i++){ctx.globalAlpha=.12+j*.035;const y=28+i*9,x=96+Math.sin(t/1800+i*.23+j*.6)*(69+j*3);if(Math.abs(x-96)>52||y<43||y>218)px(x,y,7,8);}}
 ctx.restore();}
export function drawWorldEffect(ctx,effect,time,x,feet,height,reduced=false){if(effect?.kind==='none')return;const scale=height/192;ctx.save();ctx.translate(x-96*scale,feet-224*scale);ctx.scale(scale,scale);drawMiniEffect(ctx,effect,time,reduced);ctx.restore();}
