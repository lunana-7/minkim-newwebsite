import { openInteraction,closeInteraction } from './min-interactions.js';
import { KITCHENS,ticketFor,customerFor,prepSteps } from './min-kitchen-data.js';
import {getProfile,updateProfile,subscribeProfile} from './min-profile.js';
import {drawItem,itemImage,preloadItems} from './min-world-assets.js';
import { npcImage } from './min-portals.js';
export function initKitchen(){
 const panel=document.getElementById('mini-kitchen');if(!panel)return;
 const $=id=>document.getElementById(id),canvas=$('kitchen-canvas'),ctx=canvas.getContext('2d');let shop='icecream',alive=true,lastRender='',pointer={x:325,y:180},dragging=false,dragDistance=0,lastPointer=null,fx=null;
 const rooms={icecream:new Image(),bakery:new Image()};for(const id of Object.keys(rooms))rooms[id].src=`/game-art/items/${id}-interior.webp`;preloadItems();
 const whiskingMini=new Image();whiskingMini.src='/game-art/items/icecream-whisking-mini.png';
 const guestArt=new Map();function guestImage(guest){const path=npcImage(guest);if(!guestArt.has(path)){const image=new Image();image.src=path;guestArt.set(path,image);}return guestArt.get(path);}
 const message=text=>$('kitchen-message').textContent=text;
 const patchActive=patch=>{const p=getProfile();if(p.jobs.active?.job!==shop)return;updateProfile({jobs:{...p.jobs,active:{...p.jobs.active,...patch}}});};
 function open(id){if(!KITCHENS[id])return;window.dispatchEvent(new CustomEvent('min-kitchen-entering',{detail:id}));shop=id;fx=null;dragging=false;lastRender='';render(getProfile());openInteraction('kitchen');}
 window.addEventListener('min-kitchen-open',event=>open(event.detail));document.querySelectorAll('[data-kitchen-open]').forEach(b=>b.addEventListener('click',()=>open(b.dataset.kitchenOpen)));
 $('kitchen-close').addEventListener('click',()=>{closeInteraction();});
 $('kitchen-hire').addEventListener('click',()=>{const p=getProfile();updateProfile({jobs:{...p.jobs,[shop]:{...p.jobs[shop],hired:true}}});message(`Welcome! You are now an apprentice ${KITCHENS[shop].job.toLowerCase()}. Your first shift starts here.`);});
 function choose(field,value){patchActive({[field]:value});}
 function render(p){const k=KITCHENS[shop],career=p.jobs[shop],a=p.jobs.active?.job===shop?p.jobs.active:null;
  $('kitchen-title').textContent=k.name;$('kitchen-job-label').textContent=k.job.toUpperCase();$('kitchen-career').textContent=`${career.hired?'Level '+(1+Math.floor(career.xp/100))+' '+k.job:'Help wanted'} · ${career.completed} orders · ${career.xp} XP · Best ${career.best}%`;
  panel.dataset.stage=a?String(a.stage):'welcome';panel.dataset.shop=shop;
  $('kitchen-hire').hidden=career.hired;document.querySelectorAll('.kitchen-shop-tabs button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.kitchenOpen===shop)));
  $('kitchen-action').hidden=!career.hired;$('kitchen-abandon').hidden=!a;
  const other=p.jobs.active&&!a;$('kitchen-action').disabled=Boolean(other);
  if(other){$('kitchen-step-help').textContent='Finish or discard your order at the other shop before starting a new one.';}
  const ticket=ticketFor(shop,career.completed),guest=customerFor(shop,career.completed);
  $('kitchen-customer-name').textContent=guest.name;
  $('kitchen-customer-line').textContent=guest.line;
  $('kitchen-customer-portrait').src=npcImage(guest);
  $('kitchen-ticket').textContent=career.hired?`${k.flavors[ticket.flavor]} ${shop==='icecream'?'ice cream in a cone':'layer cake'} · ${k.base[ticket.base]} · ${k.toppings[ticket.topping]}`:'Apply to receive your first order.';
  $('kitchen-queue').textContent=`Now serving ${guest.name} · next: ${customerFor(shop,career.completed+1).name} · ${career.completed} guests served. Match the ticket for a tip.`;
  const signature=JSON.stringify([shop,p.jobs]);if(signature===lastRender)return;lastRender=signature;
  $('kitchen-steps').replaceChildren(...k.steps.map((name,i)=>{const li=document.createElement('li');li.textContent=name;li.className=a?.stage===i?'current':a&&a.stage>i?'done':'';return li;}));
  $('kitchen-process').hidden=!a||a.stage!==2;const choices=$('kitchen-choice-area');choices.replaceChildren();
  function group(label,field,items){const fieldset=document.createElement('fieldset'),legend=document.createElement('legend');legend.textContent=label;fieldset.append(legend);items.forEach((name,i)=>{const button=document.createElement('button');button.type='button';button.textContent=name;button.disabled=a.stage===0&&a.prep>0;button.setAttribute('aria-pressed',String(a[field]===i));button.addEventListener('click',()=>choose(field,i));fieldset.append(button);});choices.append(fieldset);}
  if(!a){$('kitchen-step-title').textContent=career.hired?'Ready for your next customer?':'Become a dessert maker';if(!other)$('kitchen-step-help').textContent='Follow the order ticket, prepare the recipe, and earn wages and career XP.';$('kitchen-action').textContent='Start customer order →';return;}
  $('kitchen-step-title').textContent=`${a.stage+1}. ${k.steps[a.stage]}`;
  const helps=shop==='icecream'?['Choose the order ingredients, then tap the bowl to pour each one.','Drag the whisk through the bowl six times, or use the action button.','Drag the valve or slider near −6°C, then chill and churn.','Tap the cone three times to scoop ice cream, then finish with the requested topping.','Tap the counter or button to hand the cone to your customer.']:['Choose the order ingredients, then tap the bowl to add flour, crack an egg, and add sugar.','Drag the whisk through the batter six times, or use the action button.','Drag the oven valve or slider near 175°C, then bake.','Tap the cake three times to pipe cream and add the requested topping.','Tap the counter or button to serve the cake to your customer.'];
  $('kitchen-step-help').textContent=helps[a.stage];
  if(a.stage===0){group('Measured base','base',k.base);group('Flavor','flavor',k.flavors);}
  if(a.stage===3)group('Finishing touch','topping',k.toppings);
  $('kitchen-action').textContent=a.stage===0?`${prepSteps(shop,a.base)[a.prep] || 'Ingredients ready'} · ${a.prep}/3`:a.stage===1?`Whisk · ${a.mix}/6`:a.stage===2?(a.startedAt?'Finish processing →':shop==='icecream'?'Start chill & churn →':'Start baking →'):a.stage===3?`${shop==='icecream'?'Scoop':'Pipe cream'} · ${a.decor}/3`:`Serve ${guest.name} →`;
  if(a.stage===2){const slider=$('kitchen-temperature');slider.min=String(k.min);slider.max=String(k.max);slider.step='1';slider.value=String(a.temperature);slider.disabled=Boolean(a.startedAt);$('kitchen-temperature-label').textContent=a.temperature+k.unit;}
 }
 const unsub=subscribeProfile(render);
 $('kitchen-temperature').addEventListener('input',event=>patchActive({temperature:Number(event.target.value)}));
 $('kitchen-abandon').addEventListener('click',()=>{const p=getProfile();if(p.jobs.active?.job!==shop)return;updateProfile({jobs:{...p.jobs,active:null}});message('Order discarded. The shop has supplied fresh ingredients for your next try.');});
 $('kitchen-action').addEventListener('click',()=>{
  const p=getProfile(),career=p.jobs[shop],k=KITCHENS[shop],a=p.jobs.active;if(!career.hired||a&&a.job!==shop)return;
  if(!a){updateProfile({jobs:{...p.jobs,active:{job:shop,stage:0,base:0,flavor:0,topping:0,prep:0,mix:0,decor:0,temperature:shop==='icecream'?-2:160,startedAt:0,quality:100}}});message(`${customerFor(shop,career.completed).name} is waiting! Read the ticket and prepare the ingredients.`);return;}
  if(a.stage===0){const steps=prepSteps(shop,a.base),prep=Math.min(3,a.prep+1);fx={kind:shop==='bakery'&&a.prep===1&&a.base!==2?'egg':shop==='bakery'&&a.prep===0?'flour':'pour',start:performance.now(),x:pointer.x,y:pointer.y};patchActive({prep,stage:prep===3?1:0});message(`${steps[a.prep]}! ${prep===3?'Now whisk the mixture.':''}`);}
  if(a.stage===1){const mix=Math.min(6,a.mix+1);fx={kind:'whisk',start:performance.now(),x:pointer.x,y:pointer.y};patchActive({mix,stage:mix===6?2:1});message(mix===6?'The mixture is smooth. Adjust the machine valve.':'The mixture swirls around your whisk.');}
  if(a.stage===2){if(!a.startedAt){patchActive({startedAt:Date.now()});message(k.process);return;}if(Date.now()-a.startedAt<k.duration){message('The machine is still working. Watch the progress bar.');return;}const error=Math.abs(a.temperature-k.target);patchActive({stage:3,quality:Math.max(45,100-error*(shop==='icecream'?4:2))});message(shop==='icecream'?'The frozen base is ready to scoop.':'The sponge is baked and cooled, ready for frosting.');}
  if(a.stage===3){const decor=Math.min(3,a.decor+1);fx={kind:'finish',start:performance.now(),x:pointer.x,y:pointer.y};patchActive({decor,stage:decor===3?4:3});message(shop==='icecream'?'A rounded scoop joins your cone.':'A fresh layer of cream goes onto the cake.');}
  if(a.stage===4){const ticket=ticketFor(shop,career.completed),guest=customerFor(shop,career.completed),accuracy=['base','flavor','topping'].reduce((n,key)=>n+Number(a[key]===ticket[key]),0),score=Math.round(a.quality*.4+accuracy*20),tip=score>=85?8:score>=65?4:0,coins=12+Math.round(score*.25)+tip,xp=10+Math.round(score*.15);
   fx={kind:'serve',start:performance.now(),x:470,y:180,shop,flavor:a.flavor,guest};updateProfile({points:p.points+Math.round(score/10),farm:{...p.farm,coins:p.farm.coins+coins},jobs:{...p.jobs,active:null,[shop]:{...career,completed:career.completed+1,xp:career.xp+xp,best:Math.max(career.best,score)}}});message(`${guest.name}: ${score>=85?'This is perfect!':score>=60?'Thank you, Mini!':'I’ll try another flavor next time.'} Quality ${score}% · +${coins} coins${tip?` (including ${tip} tip)`:''} · +${xp} XP. Next customer is ready!`);
  }
 });
 function point(event){const r=canvas.getBoundingClientRect();return {x:(event.clientX-r.left)*640/r.width,y:(event.clientY-r.top)*360/r.height};}
 function turnValve(x){const a=getProfile().jobs.active;if(a?.job!==shop||a.stage!==2||a.startedAt)return;const k=KITCHENS[shop],temperature=Math.round(k.min+Math.max(0,Math.min(1,(x-235)/200))*(k.max-k.min));if(temperature!==a.temperature)patchActive({temperature});}
 canvas.addEventListener('pointerdown',event=>{pointer=point(event);const a=getProfile().jobs.active;if(a?.job!==shop)return;if(a.stage===1||a.stage===2){dragging=true;dragDistance=0;lastPointer=pointer;canvas.setPointerCapture(event.pointerId);if(a.stage===2)turnValve(pointer.x);}});
 canvas.addEventListener('pointermove',event=>{pointer=point(event);if(!dragging||!lastPointer)return;const a=getProfile().jobs.active;if(a?.job!==shop){dragging=false;return;}if(a.stage===2)turnValve(pointer.x);if(a.stage===1&&pointer.x>175&&pointer.x<500){dragDistance+=Math.hypot(pointer.x-lastPointer.x,pointer.y-lastPointer.y);if(dragDistance>=28){dragDistance=0;$('kitchen-action').click();}}lastPointer=pointer;});
 for(const type of ['pointerup','pointercancel','lostpointercapture'])canvas.addEventListener(type,()=>{dragging=false;lastPointer=null;});
 canvas.addEventListener('click',()=>{const a=getProfile().jobs.active;if(a?.job===shop&&[0,3,4].includes(a.stage))$('kitchen-action').click();});
 function drawPortion(id,x,feet,height,fraction){const im=itemImage(id);if(!im?.complete||!im.naturalWidth)return;const sourceY=Math.round(im.naturalHeight*(1-fraction)),sliceHeight=im.naturalHeight-sourceY,width=height*im.naturalWidth/im.naturalHeight;ctx.drawImage(im,0,sourceY,im.naturalWidth,sliceHeight,Math.round(x-width/2),Math.round(feet-height*fraction),Math.round(width),Math.round(height*fraction));}
 function drawActionEffect(now){if(!fx||now-fx.start>850)return;const t=(now-fx.start)/850;ctx.save();ctx.globalAlpha=1-t;
  if(fx.kind==='serve'){const id=`dessert-${fx.shop==='icecream'?'cone':'cake'}-${['vanilla','strawberry','chocolate'][fx.flavor]}`;const image=itemImage(id),x=337+t*190,y=250-Math.sin(t*Math.PI)*80;if(image?.complete&&image.naturalWidth)drawItem(ctx,id,x,y,70);for(let i=0;i<3;i++)drawItem(ctx,'prop-star',440+i*27,120+Math.sin(now/150+i)*10,13);}
  else if(fx.kind==='egg'){const fall=Math.min(1,t*1.6);ctx.fillStyle='#fff0d1';ctx.fillRect(312-fall*18,135+fall*18,16,12);ctx.fillRect(345+fall*18,135+fall*18,16,12);ctx.fillStyle='#ffd75e';ctx.beginPath();ctx.arc(336,145+fall*92,12*(1-t*.7),0,Math.PI*2);ctx.fill();}
  else if(fx.kind==='flour'){ctx.fillStyle='#fff4df';for(let i=0;i<14;i++){const x=290+(i*19)%90,y=120+((i*31+Math.floor(t*110))%125);ctx.fillRect(x,y,5,5);}}
  else if(fx.kind==='pour'){ctx.fillStyle='#f7e7bb';ctx.fillRect(327,123,18,112*t);ctx.fillStyle='#fff8e3';ctx.fillRect(329,123,5,112*t);}
  else {for(let i=0;i<5;i++)drawItem(ctx,'prop-star',285+i*26,170-t*55+Math.sin(now/140+i)*9,13);}
  ctx.restore();
 }
 function draw(now){if(!alive)return;const p=getProfile(),k=KITCHENS[shop],a=p.jobs.active?.job===shop?p.jobs.active:null,room=rooms[shop];ctx.imageSmoothingEnabled=false;
  if(room.complete&&room.naturalWidth)ctx.drawImage(room,0,0,640,360);else{ctx.fillStyle=shop==='icecream'?'#d5e1df':'#efdfca';ctx.fillRect(0,0,640,360);}
  const flavor=['vanilla','strawberry','chocolate'][a?.flavor||0],guest=fx?.kind==='serve'&&now-fx.start<850?fx.guest:customerFor(shop,p.jobs[shop].completed),guestSprite=guestImage(guest);
  if(guestSprite.complete&&guestSprite.naturalWidth){ctx.globalAlpha=.92;ctx.drawImage(guestSprite,492,174+Math.sin(now/430)*2,74,74);ctx.globalAlpha=1;}
  if(!a||a.stage<2){
   const icecreamWhisking=shop==='icecream'&&a?.stage===1&&whiskingMini.complete&&whiskingMini.naturalWidth;
   if(icecreamWhisking){
    const bob=dragging?Math.sin(now/70)*2:Math.sin(now/280);
    ctx.drawImage(whiskingMini,176,16+bob,330,330);
    ctx.fillStyle='#fff4d9';
    for(let i=0;i<4;i++){const angle=now/190+i*Math.PI/2;ctx.fillRect(Math.round(390+Math.cos(angle)*32),Math.round(205+Math.sin(angle)*13),5,5);}
    ctx.fillStyle='#fff9df';ctx.font='18px "Pixelify Sans",sans-serif';ctx.textAlign='center';ctx.fillText(`Whisk ${a.mix}/6`,392,102);
   }else{
    drawItem(ctx,'dessert-bowl',336,286,112);
    if(a?.stage===0){ctx.fillStyle='#fff0d2';ctx.font='18px "Pixelify Sans",sans-serif';ctx.textAlign='center';ctx.fillText(`${a.prep}/3 ingredients`,336,157);}
    if(a?.stage===1){ctx.save();ctx.translate(dragging?pointer.x:386,dragging?pointer.y:222);ctx.rotate(Math.sin(now/100)*.4);drawItem(ctx,'dessert-whisk',0,30,88);ctx.restore();ctx.strokeStyle='#fff4d0';ctx.lineWidth=3;ctx.beginPath();ctx.arc(335,232,18+Math.sin(now/160)*5,0,Math.PI*1.6);ctx.stroke();}
   }
  }
  else if(a.stage===2){drawItem(ctx,shop==='icecream'?'dessert-machine':'dessert-oven',336,304,162);if(a.startedAt){const sparkle=335+Math.sin(now/240)*62;drawItem(ctx,'prop-star',sparkle,120,16);ctx.fillStyle=shop==='icecream'?'#d9fcff':'#ffdc91';for(let i=0;i<4;i++)ctx.fillRect(280+i*32,163+Math.sin(now/180+i)*8,6,6);}else{const k=KITCHENS[shop],angle=((a.temperature-k.min)/(k.max-k.min))*Math.PI*1.3-Math.PI*.65;ctx.fillStyle='#fff1d8';ctx.fillRect(266,317,141,7);ctx.fillStyle='#e9a2a8';ctx.fillRect(266+((a.temperature-k.min)/(k.max-k.min))*135,308,12,24);ctx.fillStyle='#fff1d8';ctx.font='18px "Pixelify Sans",sans-serif';ctx.textAlign='center';ctx.fillText(`Turn valve · ${a.temperature}${k.unit}`,337,145);ctx.save();ctx.translate(336,213);ctx.rotate(angle);ctx.fillStyle='#d7e8c6';ctx.fillRect(-4,-28,8,30);ctx.restore();}}
  else{const id=`dessert-${shop==='icecream'?'cone':'cake'}-${flavor}`,fraction=a.stage===4?1:Math.min(1,.42+a.decor*.19);drawPortion(id,337,305,177,fraction);if(a.stage===4)for(let i=0;i<4;i++)drawItem(ctx,'prop-star',268+i*43,126+Math.sin(now/250+i)*10,16);}
  if(a?.stage===3){const x=Math.max(240,Math.min(425,pointer.x)),y=Math.max(125,Math.min(255,pointer.y));drawItem(ctx,shop==='icecream'?'dessert-bowl':'dessert-piping',x,y+12,47);}
  drawActionEffect(now);
  if(a?.stage===2){const progress=a.startedAt?Math.min(1,(Date.now()-a.startedAt)/k.duration):0;$('kitchen-process-fill').style.width=progress*100+'%';$('kitchen-process-status').textContent=progress===1?'Ready! Finish processing to continue.':a.startedAt?`${Math.ceil((k.duration-(Date.now()-a.startedAt))/1000)} seconds remaining`:'Set the machine, then start.';}
  $('kitchen-visual-caption').textContent=a?`${k.steps[a.stage]} · ${a.stage===0?'tap the bowl to add ingredients':a.stage===1?'drag the whisk across the bowl':a.stage===2?'drag the valve or use the slider':a.stage===3?'tap to add each scoop or cream layer':'tap to serve the customer'}.`:'A new guest is waiting for a sweet creation.';
  requestAnimationFrame(draw);
 }
 requestAnimationFrame(draw);window.addEventListener('pagehide',()=>{alive=false;unsub();});
}
