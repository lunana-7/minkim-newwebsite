import { openInteraction,closeInteraction } from './min-interactions.js';
import { KITCHENS,ticketFor } from './min-kitchen-data.js';
import {getProfile,updateProfile,subscribeProfile} from './min-profile.js';
import {drawItem,itemImage,preloadItems} from './min-world-assets.js';
export function initKitchen(){
 const panel=document.getElementById('mini-kitchen');if(!panel)return;
 const $=id=>document.getElementById(id),canvas=$('kitchen-canvas'),ctx=canvas.getContext('2d');let shop='icecream',alive=true,lastRender='',pointer={x:325,y:180};
 const rooms={icecream:new Image(),bakery:new Image()};for(const id of Object.keys(rooms))rooms[id].src=`/game-art/items/${id}-interior.webp`;preloadItems();
 const message=text=>$('kitchen-message').textContent=text;
 const patchActive=patch=>{const p=getProfile();if(p.jobs.active?.job!==shop)return;updateProfile({jobs:{...p.jobs,active:{...p.jobs.active,...patch}}});};
 function open(id){if(!KITCHENS[id])return;window.dispatchEvent(new CustomEvent('min-kitchen-entering',{detail:id}));shop=id;lastRender='';render(getProfile());openInteraction('kitchen');}
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
  const ticket=ticketFor(shop,career.completed);$('kitchen-ticket').textContent=career.hired?`${k.flavors[ticket.flavor]} ${shop==='icecream'?'ice cream in a cone':'layer cake'} · ${k.base[ticket.base]} · ${k.toppings[ticket.topping]}`:'Apply to receive your first order.';
  const signature=JSON.stringify([shop,p.jobs]);if(signature===lastRender)return;lastRender=signature;
  $('kitchen-steps').replaceChildren(...k.steps.map((name,i)=>{const li=document.createElement('li');li.textContent=name;li.className=a?.stage===i?'current':a&&a.stage>i?'done':'';return li;}));
  $('kitchen-process').hidden=!a||a.stage!==2;const choices=$('kitchen-choice-area');choices.replaceChildren();
  function group(label,field,items){const fieldset=document.createElement('fieldset'),legend=document.createElement('legend');legend.textContent=label;fieldset.append(legend);items.forEach((name,i)=>{const button=document.createElement('button');button.type='button';button.textContent=name;button.setAttribute('aria-pressed',String(a[field]===i));button.addEventListener('click',()=>choose(field,i));fieldset.append(button);});choices.append(fieldset);}
  if(!a){$('kitchen-step-title').textContent=career.hired?'Ready for your next customer?':'Become a dessert maker';if(!other)$('kitchen-step-help').textContent='Follow the order ticket, prepare the recipe, and earn wages and career XP.';$('kitchen-action').textContent='Start customer order →';return;}
  $('kitchen-step-title').textContent=`${a.stage+1}. ${k.steps[a.stage]}`;
  const helps=shop==='icecream'?['Measure the dairy base and choose the flavor requested on the ticket.','Whisk six times until sugar and flavor are blended into the base.','Choose a cold machine setting near −6°C. Start chilling and churning.','Scoop three rounded portions into a waffle cone and add the requested topping.','Your cone is ready! Serve the customer to receive your wages.']:['Choose the sponge ingredients and flavor requested on the ticket.','Fold the batter six times. Keep it smooth and light.','Set the oven near 175°C and start baking the sponge.','The sponge is cooled. Pipe three layers of cream and add the requested topping.','Your decorated cake is ready! Serve it to the customer.'];
  $('kitchen-step-help').textContent=helps[a.stage];
  if(a.stage===0){group('Measured base','base',k.base);group('Flavor','flavor',k.flavors);}
  if(a.stage===3)group('Finishing touch','topping',k.toppings);
  $('kitchen-action').textContent=a.stage===0?'Pour measured ingredients →':a.stage===1?`${shop==='icecream'?'Whisk':'Fold'} · ${a.mix}/6`:a.stage===2?(a.startedAt?'Finish processing →':shop==='icecream'?'Start chill & churn →':'Start baking →'):a.stage===3?`${shop==='icecream'?'Scoop':'Pipe cream'} · ${a.decor}/3`:'Serve customer →';
  if(a.stage===2){const slider=$('kitchen-temperature');slider.min=String(k.min);slider.max=String(k.max);slider.step='1';slider.value=String(a.temperature);slider.disabled=Boolean(a.startedAt);$('kitchen-temperature-label').textContent=a.temperature+k.unit;}
 }
 const unsub=subscribeProfile(render);
 $('kitchen-temperature').addEventListener('input',event=>patchActive({temperature:Number(event.target.value)}));
 $('kitchen-abandon').addEventListener('click',()=>{const p=getProfile();if(p.jobs.active?.job!==shop)return;updateProfile({jobs:{...p.jobs,active:null}});message('Order discarded. The shop has supplied fresh ingredients for your next try.');});
 $('kitchen-action').addEventListener('click',()=>{
  const p=getProfile(),career=p.jobs[shop],k=KITCHENS[shop],a=p.jobs.active;if(!career.hired||a&&a.job!==shop)return;
  if(!a){updateProfile({jobs:{...p.jobs,active:{job:shop,stage:0,base:0,flavor:0,topping:0,mix:0,decor:0,temperature:shop==='icecream'?-2:160,startedAt:0,quality:100}}});message('Read your ticket and choose your ingredients.');return;}
  if(a.stage===0){patchActive({stage:1});message('Ingredients poured into the bowl.');}
  if(a.stage===1){const mix=Math.min(6,a.mix+1);patchActive({mix,stage:mix===6?2:1});message(mix===6?'The mixture is smooth. Time to process it.':'The mixture swirls around your spoon.');}
  if(a.stage===2){if(!a.startedAt){patchActive({startedAt:Date.now()});message(k.process);return;}if(Date.now()-a.startedAt<k.duration){message('The machine is still working. Watch the progress bar.');return;}const error=Math.abs(a.temperature-k.target);patchActive({stage:3,quality:Math.max(45,100-error*(shop==='icecream'?4:2))});message(shop==='icecream'?'The frozen base is ready to scoop.':'The sponge is baked and cooled, ready for frosting.');}
  if(a.stage===3){const decor=Math.min(3,a.decor+1);patchActive({decor,stage:decor===3?4:3});message(shop==='icecream'?'A rounded scoop joins your cone.':'A fresh layer of cream goes onto the cake.');}
  if(a.stage===4){const ticket=ticketFor(shop,career.completed),accuracy=['base','flavor','topping'].reduce((n,key)=>n+Number(a[key]===ticket[key]),0),score=Math.round(a.quality*.4+accuracy*20),coins=12+Math.round(score*.25),xp=10+Math.round(score*.15);
   updateProfile({points:p.points+Math.round(score/10),farm:{...p.farm,coins:p.farm.coins+coins},jobs:{...p.jobs,active:null,[shop]:{...career,completed:career.completed+1,xp:career.xp+xp,best:Math.max(career.best,score)}}});message(`${k.host}: ${score>=85?'Beautiful work!':score>=60?'A lovely treat.':'Let’s follow the ticket more closely next time.'} Quality ${score}% · +${coins} coins · +${xp} career XP.`);
  }
 });
 canvas.addEventListener('pointermove',event=>{const r=canvas.getBoundingClientRect();pointer={x:(event.clientX-r.left)*640/r.width,y:(event.clientY-r.top)*360/r.height};});
 canvas.addEventListener('click',()=>{const a=getProfile().jobs.active;if(a?.job===shop&&[1,3].includes(a.stage))$('kitchen-action').click();});
 function drawPortion(id,x,feet,height,fraction){const im=itemImage(id);if(!im?.complete||!im.naturalWidth)return;const sourceY=Math.round(im.naturalHeight*(1-fraction)),sliceHeight=im.naturalHeight-sourceY,width=height*im.naturalWidth/im.naturalHeight;ctx.drawImage(im,0,sourceY,im.naturalWidth,sliceHeight,Math.round(x-width/2),Math.round(feet-height*fraction),Math.round(width),Math.round(height*fraction));}
 function draw(now){if(!alive)return;const p=getProfile(),k=KITCHENS[shop],a=p.jobs.active?.job===shop?p.jobs.active:null,room=rooms[shop];ctx.imageSmoothingEnabled=false;
  if(room.complete&&room.naturalWidth)ctx.drawImage(room,0,0,640,360);else{ctx.fillStyle=shop==='icecream'?'#d5e1df':'#efdfca';ctx.fillRect(0,0,640,360);}
  const flavor=['vanilla','strawberry','chocolate'][a?.flavor||0];
  if(!a||a.stage<2){drawItem(ctx,'dessert-bowl',336,286,112);if(a?.stage===1){ctx.save();ctx.translate(386,222);ctx.rotate(Math.sin(now/170)*.22);drawItem(ctx,'dessert-whisk',0,30,88);ctx.restore();}}
  else if(a.stage===2){drawItem(ctx,shop==='icecream'?'dessert-machine':'dessert-oven',336,304,162);if(a.startedAt){const sparkle=335+Math.sin(now/240)*62;drawItem(ctx,'prop-star',sparkle,120,16);}}
  else{const id=`dessert-${shop==='icecream'?'cone':'cake'}-${flavor}`,fraction=a.stage===4?1:Math.min(1,.42+a.decor*.19);drawPortion(id,337,305,177,fraction);if(a.stage===4)for(let i=0;i<4;i++)drawItem(ctx,'prop-star',268+i*43,126+Math.sin(now/250+i)*10,16);}
  if(a?.stage===3){const x=Math.max(240,Math.min(425,pointer.x)),y=Math.max(125,Math.min(255,pointer.y));drawItem(ctx,shop==='icecream'?'dessert-whisk':'dessert-piping',x,y+12,47);}
  if(a?.stage===2){const progress=a.startedAt?Math.min(1,(Date.now()-a.startedAt)/k.duration):0;$('kitchen-process-fill').style.width=progress*100+'%';$('kitchen-process-status').textContent=progress===1?'Ready! Finish processing to continue.':a.startedAt?`${Math.ceil((k.duration-(Date.now()-a.startedAt))/1000)} seconds remaining`:'Set the machine, then start.';}
  $('kitchen-visual-caption').textContent=a?`${k.steps[a.stage]} · click the workbench to ${shop==='icecream'?'whisk or scoop':'fold or pipe cream'}.`:'Mini’s next sweet creation begins here.';
  requestAnimationFrame(draw);
 }
 requestAnimationFrame(draw);window.addEventListener('pagehide',()=>{alive=false;unsub();});
}
