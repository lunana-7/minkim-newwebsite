export const MINI_EFFECTS=[{id:'none',name:'No effect',icon:'—'},{id:'sparkles',name:'Pixel sparkles',icon:'✧'},{id:'hearts',name:'Floating hearts',icon:'♡'},{id:'stars',name:'Star orbit',icon:'✦'},{id:'fireflies',name:'Firefly friends',icon:'·'},{id:'aurora',name:'Aurora ribbons',icon:'≈'},{id:'petals',name:'Cherry blossom rain',icon:'❀'},{id:'magic',name:'Magic circle',icon:'✴'},{id:'crystals',name:'Crystal glow',icon:'◆'},{id:'butterflies',name:'Dream butterflies',icon:'ʚɞ'}];
export const EFFECT_COLORS=[{id:'gold',name:'Honey gold',hex:'#f4d38b'},{id:'berry',name:'Berry pink',hex:'#e8a2b8'},{id:'lavender',name:'Dream lavender',hex:'#c2afe8'},{id:'mint',name:'Meadow mint',hex:'#b5d4a2'},{id:'ice',name:'Moonlight blue',hex:'#a5d8e8'}];
export const DEFAULT_EFFECT={kind:'none',color:'gold',intensity:2};
export function normalizeEffect(effect){return {kind:MINI_EFFECTS.some(e=>e.id===effect?.kind)?effect.kind:'none',color:EFFECT_COLORS.some(c=>c.id===effect?.color)?effect.color:'gold',intensity:[1,2,3].includes(effect?.intensity)?effect.intensity:2};}
function drawFancyEffect(ctx,effect,time,reduced){
 const color=EFFECT_COLORS.find(item=>item.id===effect.color)?.hex||EFFECT_COLORS[0].hex;
 const t=reduced?0:time,intensity=effect.intensity||2;
 const px=(x,y,w,h,fill=color)=>{ctx.fillStyle=fill;ctx.fillRect(Math.round(x),Math.round(y),w,h);};
 const star=(x,y,size=2,fill=color)=>{px(x,y-size,2,size*2+2,fill);px(x-size,y,size*2+2,2,fill);px(x-1,y-1,4,4,'#fff6dc');};
 ctx.save();
 if(effect.kind==='petals'){
  const count=6+intensity*5;
  for(let i=0;i<count;i++){
   const phase=i*.618034%1,fall=(phase*264+(reduced?0:t/(52+i%4*8)))%264;
   const x=16+i*47%161+Math.sin(t/1050+i*2.4)*12,y=fall-16;
   ctx.globalAlpha=reduced ? .75 : .65+.25*Math.sin(t/440+i)**2;
   px(x-3,y,8,2,'#a96786');px(x-5,y+2,11,3,i%2?'#f2a4be':'#f9c4d0');
   px(x-2,y+5,6,2,'#e98faa');px(x,y+1,3,2,'#fff0e9');
   if(i%4===0){ctx.globalAlpha=.75;star(x+9,y-11,1,color);}
  }
 }else if(effect.kind==='magic'){
  const turn=reduced?0:t/2100;
  // The segmented floor circle and outer runes keep the face unobscured.
  for(let i=0;i<64;i++){
   const a=i*Math.PI*2/64+turn,x=96+Math.cos(a)*69,y=211+Math.sin(a)*15;
   ctx.globalAlpha=i%4===0 ? .95 : .58;
   px(x,y,i%4===0?6:3,2,i%4===0?'#fff0cf':color);
  }
  const count=4+intensity*2;
  for(let i=0;i<count;i++){
   const a=i*Math.PI*2/count-turn*.7,x=96+Math.cos(a)*79,y=120+Math.sin(a)*91;
   ctx.globalAlpha=.55+.25*Math.sin(t/460+i)**2;
   if(i%2===0)star(x,y,3,color);
   else {px(x-2,y-6,5,3,color);px(x-5,y-3,11,6,color);px(x-2,y+3,5,3,'#fff0cf');}
  }
  ctx.globalAlpha=.55;
  for(let i=0;i<intensity*3;i++){
   const a=i*2.4+turn*1.6,x=96+Math.cos(a)*53,y=192-(i*33+t/48)%158;
   px(x,y,3,3,'#fff0cf');
  }
 }else if(effect.kind==='crystals'){
  const count=2+intensity*2;
  for(let i=0;i<count;i++){
   const a=i*Math.PI*2/count+t/2600;
   const x=96+Math.cos(a)*(70+i%2*8),y=132+Math.sin(a)*82+Math.sin(t/370+i)*5;
   ctx.globalAlpha=.18;px(x-11,y-13,24,26,color);ctx.globalAlpha=.85;
   px(x-3,y-10,7,2,'#654e77');px(x-6,y-8,13,4,color);
   px(x-8,y-4,17,10,color);px(x-5,y+6,11,4,'#9070b2');
   px(x-2,y+10,5,3,'#654e77');px(x-4,y-5,3,9,'#fff6e8');
   px(x+3,y-4,2,9,'#dcc7f5');
   if(i%2===0)star(x+13,y-18,2,'#fff2d5');
  }
 }else if(effect.kind==='butterflies'){
  const count=2+intensity*2;
  for(let i=0;i<count;i++){
   const a=i*2.6+t/(1500+i*120),x=96+Math.cos(a)*(70+i%2*12);
   const y=119+Math.sin(a*1.3)*74+Math.sin(t/420+i)*8;
   const wing=reduced?1:Math.floor(t/140+i)%2*3;
   ctx.globalAlpha=.9;
   px(x-7,y-3-wing,6,5,'#f5d6e5');px(x+2,y-3-wing,6,5,'#f5d6e5');
   px(x-9,y+2,7,4,color);px(x+3,y+2,7,4,color);
   px(x,y-2,2,10,'#6b526f');px(x-2,y-5,2,3,'#6b526f');px(x+3,y-5,2,3,'#6b526f');
   if(i%2===0){ctx.globalAlpha=.55;star(x+10,y-10,1,'#fff0d8');}
  }
 }
 ctx.restore();
}
// Native pixel effects occupy a padded 192 × 256 canvas around the registered character.
export function drawMiniEffect(ctx,effect,time,reduced=false){if(!effect||effect.kind==='none')return;if(['petals','magic','crystals','butterflies'].includes(effect.kind)){drawFancyEffect(ctx,effect,time,reduced);return;}const color=EFFECT_COLORS.find(c=>c.id===effect.color)?.hex||EFFECT_COLORS[0].hex,n=effect.intensity*3,t=reduced?0:time;ctx.save();ctx.fillStyle=color;
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
