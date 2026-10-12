import { drawWorldEffect } from './min-effects.js';
import { drawItem } from './min-world-assets.js';
import { getProfile } from './min-profile.js';
import { STORY, ALIGNMENT_VENUES } from './alignment-story.js';
import { firebaseConfigured, getFirebaseServices } from './firebase.js';
import { startCloudSync, subscribeAccount, signInPlayer, signOutPlayer } from './min-cloud.js';

const WIDTH=960, HEIGHT=540, FLOOR=468, WORLD=2200, BUILDING_X=650, GUIDE_X=640, PORTAL_X=1950;
const ALL_BEACONS=(1<<STORY.chapters.length)-1;

export function initAlignmentWorld(){
 const $=id=>document.getElementById(id),shell=$('alignment-shell'),canvas=$('alignment-canvas');if(!shell)return;
 const ctx=canvas.getContext('2d'),keys=new Set(),images=new Map(),peers=new Map();
 const player={x:100,y:0,vy:0,facing:1};
 let uid=null,session=0,ready=false,canCloudSave=false,alive=true,last=0,presenceAt=0,saveTimer,stopPeers=null;
 let progress=normalize({}),dialogPage=0,dialogAnswered=false;
 const art=path=>{if(!images.has(path)){const image=new Image();image.src=path;images.set(path,image);}return images.get(path);};
 art('/game-art/alignment/portal.webp');for(let i=0;i<6;i++)art(`/mini/rig-v2/walk-${i}.png`);
 function normalize(p={}){return {region:Math.min(STORY.chapters.length-1,Math.max(0,Math.floor(Number(p.region)||0))),mask:Math.min(ALL_BEACONS,Math.max(0,Math.floor(Number(p.mask)||0))),xp:Math.min(1000000,Math.max(0,Math.floor(Number(p.xp)||0))),x:Math.min(WORLD-50,Math.max(30,Math.floor(Number(p.x)||100))),place:p.place==='inside'?'inside':'outside',updatedAt:Math.max(0,Math.floor(Number(p.updatedAt)||0))};}
 const count=()=>progress.mask.toString(2).replace(/0/g,'').length;
 const chapter=()=>STORY.chapters[progress.region];
 const venue=()=>ALIGNMENT_VENUES[chapter().venue];
 const unlocked=i=>i===0||Boolean(progress.mask&(1<<(i-1)));
 const completed=()=>Boolean(progress.mask&(1<<progress.region));
 const inside=()=>progress.place==='inside';
 function hint(message){$('alignment-hint').textContent=message;}
 function hud(){
  $('alignment-beacons').textContent=`${count()} / ${STORY.chapters.length} trust beacons · ${progress.xp} insight XP`;
  $('alignment-player').textContent=uid?`Alignment Steward · ${count()===STORY.chapters.length?'Lantern Protocol restored':'Chapter '+(progress.region+1)}`:ready?`Guest Steward · Chapter ${progress.region+1}`:'Visitor · enter to play';
  document.querySelectorAll('[data-alignment-region]').forEach(button=>{const i=Number(button.dataset.alignmentRegion);button.disabled=!ready||!unlocked(i);button.setAttribute('aria-pressed',String(i===progress.region));});
  for(const id of ['alignment-talk','alignment-jump'])$(id).disabled=!ready;
  document.querySelectorAll('[data-alignment-move]').forEach(button=>button.disabled=!ready);
 }
 async function save(){
  if(!ready)return;progress.x=Math.round(player.x);progress.updatedAt=Date.now();
  try{localStorage.setItem('alignment-progress:'+(uid||'guest'),JSON.stringify(progress));}catch{$('alignment-save').textContent='Browser storage unavailable · progress lasts for this visit';return;}
  hud();
  if(!uid||!canCloudSave){$('alignment-save').textContent=uid?'Saved on this device · cloud pending':'Guest story saved in this browser';return;}
  const savingUid=uid,data={...progress};
  try{const {db,storeSDK:s}=await getFirebaseServices();await s.setDoc(s.doc(db,'alignmentProgress',savingUid),{...data,serverUpdatedAt:s.serverTimestamp()});if(uid===savingUid)$('alignment-save').textContent='Story saved';}
  catch{if(uid===savingUid)$('alignment-save').textContent='Saved on this device · retry on next change';}
 }
 function scheduleSave(){clearTimeout(saveTimer);saveTimer=setTimeout(save,500);}
 async function presence(){if(!uid||!ready||!canCloudSave)return;try{const{db,storeSDK:s}=await getFirebaseServices();await s.setDoc(s.doc(db,'alignmentPresence',uid),{region:progress.region,x:Math.round(player.x),alias:'Steward '+uid.slice(-4),updatedAt:s.serverTimestamp()});}catch{$('alignment-presence').textContent='Presence reconnecting';}}
 function showCurrentPlace(){const c=chapter(),v=venue();art(c.art);art(c.npc);art(v.building);art(v.room);hint(inside()?`Inside ${v.name} · walk to ${c.host.split(' · ')[0]} and press Enter.`:`Walk to ${v.name} and press Enter at the door.`);hud();}
 function closeDialogue(){if($('alignment-dialog').hidden)return;$('alignment-dialog').hidden=true;keys.clear();canvas.focus({preventScroll:true});hint(completed()&&!inside()?'The next portal is open. Walk right and press ↑.':inside()?'Walk to the left exit or speak with the guide again.':'Explore the world and visit the school or company.');}
 function showDialoguePage(){
  const c=chapter(),pages=[c.story,...c.lesson],atQuestion=dialogPage>=pages.length;
  $('alignment-dialog-story').textContent=atQuestion?`${c.host.split(' · ')[0]}: Let's try one decision together.`:pages[dialogPage];
  $('alignment-concept').hidden=!atQuestion;$('alignment-concept').textContent=c.concept;
  $('alignment-question').hidden=!atQuestion;$('alignment-question').textContent=c.question;
  $('alignment-options').hidden=!atQuestion;$('alignment-source').hidden=!atQuestion;$('alignment-career').hidden=!atQuestion;
  $('alignment-source').href=c.source;$('alignment-career').textContent='Related work: '+c.career;
  $('alignment-feedback').textContent=atQuestion&&dialogAnswered?c.feedback:'';
  $('alignment-dialog-next').hidden=atQuestion&&!dialogAnswered;
  $('alignment-dialog-next').textContent=atQuestion?'Return to the world →':`Next · ${dialogPage+1}/${pages.length} →`;
  if(atQuestion)for(const button of $('alignment-options').querySelectorAll('button'))button.disabled=dialogAnswered;
 }
 function openDialogue(){
  const c=chapter();dialogPage=0;dialogAnswered=completed();keys.clear();$('alignment-dialog').hidden=false;
  $('alignment-host').textContent=c.host;$('alignment-term').textContent=c.term;$('alignment-portrait').src=c.npc;
  const options=$('alignment-options');options.replaceChildren(...c.options.map((label,index)=>{const button=document.createElement('button');button.type='button';button.textContent=label;button.addEventListener('click',()=>{
    if(index!==c.correct){$('alignment-feedback').textContent=`${c.host.split(' · ')[0]}: That misses an important part. Read the idea above and try again.`;return;}
    if(!completed()){progress.mask|=1<<progress.region;progress.xp+=100;scheduleSave();}
    dialogAnswered=true;$('alignment-feedback').textContent=c.feedback;$('alignment-dialog-next').hidden=false;$('alignment-dialog-next').textContent='Return to the world →';for(const choice of options.querySelectorAll('button'))choice.disabled=true;hud();
  });return button;}));
  showDialoguePage();$('alignment-dialog-next').focus({preventScroll:true});
 }
 function nextDialogue(){if($('alignment-dialog').hidden)return;const pages=chapter().lesson.length+1;if(dialogPage<pages){dialogPage++;showDialoguePage();if(dialogPage===pages)$('alignment-options').querySelector('button')?.focus({preventScroll:true});return;}if(dialogAnswered)closeDialogue();}
 function enterBuilding(){progress.place='inside';player.x=120;player.y=0;player.vy=0;keys.clear();showCurrentPlace();scheduleSave();canvas.focus({preventScroll:true});}
 function leaveBuilding(){progress.place='outside';player.x=BUILDING_X+110;player.y=0;player.vy=0;keys.clear();showCurrentPlace();scheduleSave();canvas.focus({preventScroll:true});}
 function travel(i){if(!ready||!unlocked(i))return;progress.region=i;progress.place='outside';player.x=100;player.y=0;player.vy=0;keys.clear();$('alignment-dialog').hidden=true;showCurrentPlace();scheduleSave();canvas.focus({preventScroll:true});}
 function interact(){
  if(!ready)return;if(!$('alignment-dialog').hidden){nextDialogue();return;}
  if(inside()){if(player.x<200){leaveBuilding();return;}if(Math.abs(player.x-GUIDE_X)<145){openDialogue();return;}hint(`Walk beside ${chapter().host.split(' · ')[0]} and press Enter to talk, or go left to exit.`);return;}
  if(Math.abs(player.x-BUILDING_X)<145){enterBuilding();return;}
  if(Math.abs(player.x-PORTAL_X)<125){if(progress.region<STORY.chapters.length-1&&unlocked(progress.region+1)){travel(progress.region+1);}else hint(completed()?'All beacons restored. Visit any unlocked chapter from the chapter bar.':'Learn with the guide inside the building to unlock this portal.');return;}
  hint(`Walk to ${venue().name}'s door and press Enter. The portal is farther to the right.`);
 }
 function jump(){if(ready&&player.y===0&&$('alignment-dialog').hidden)player.vy=410;}

 subscribeAccount(async account=>{
  if((account.user?.uid||null)===uid){if(!account.user)$('alignment-account-status').textContent=firebaseConfigured?account.message:'Enter as a guest now. Google cloud saves await Firebase setup.';return;}
  if(ready)save();clearTimeout(saveTimer);const version=++session;uid=account.user?.uid||null;ready=false;canCloudSave=false;keys.clear();stopPeers?.();stopPeers=null;peers.clear();
  $('alignment-login-gate').hidden=Boolean(uid);$('alignment-login').hidden=Boolean(uid);$('alignment-logout').hidden=!uid;$('alignment-dialog').hidden=true;hud();
  if(!uid){progress=normalize({});player.x=100;$('alignment-save').textContent='Enter to play · browser saves available';$('alignment-presence').textContent='Shared presence connects after sign-in.';return;}
  const owner=uid;try{progress=normalize(JSON.parse(localStorage.getItem('alignment-progress:'+owner)||localStorage.getItem('alignment-progress:guest')||'{}'));}catch{progress=normalize({});}
  $('alignment-save').textContent='Loading story…';
  try{const{db,storeSDK:s}=await getFirebaseServices();const snapshot=await s.getDoc(s.doc(db,'alignmentProgress',owner));if(version!==session)return;const cloud=snapshot.exists()?normalize(snapshot.data()):null;if(cloud&&cloud.updatedAt>=progress.updatedAt)progress=cloud;canCloudSave=true;stopPeers=s.onSnapshot(s.query(s.collection(db,'alignmentPresence'),s.limit(50)),snapshot=>{peers.clear();for(const doc of snapshot.docs){const p=doc.data();if(doc.id!==uid&&p.updatedAt?.toMillis()>Date.now()-60000)peers.set(doc.id,p);}},()=>{$('alignment-presence').textContent='Shared presence unavailable';});}
  catch{if(version!==session)return;$('alignment-save').textContent='Cloud unavailable · local account save';}
  if(version!==session)return;ready=true;player.x=progress.x;player.y=0;player.vy=0;$('alignment-login-gate').hidden=true;showCurrentPlace();if(canCloudSave)$('alignment-save').textContent='Story ready';canvas.focus({preventScroll:true});
 });
 startCloudSync().catch(()=>{});$('alignment-login').addEventListener('click',signInPlayer);$('alignment-logout').addEventListener('click',signOutPlayer);
 $('alignment-account-status').textContent=firebaseConfigured?'Enter as a guest, or sign in to save across devices.':'Enter as a guest now. Google cloud saves await Firebase setup.';
 function enterGuest(){if(uid||ready)return;session++;canCloudSave=false;try{progress=normalize(JSON.parse(localStorage.getItem('alignment-progress:guest')||'{}'));}catch{progress=normalize({});}if(!unlocked(progress.region))progress.region=0;player.x=progress.x;player.y=0;player.vy=0;keys.clear();ready=true;$('alignment-login-gate').hidden=true;$('alignment-presence').textContent='Solo guest world · saved in this browser';$('alignment-dialog').hidden=true;showCurrentPlace();save();canvas.focus({preventScroll:true});canvas.scrollIntoView({block:'center',behavior:'instant'});}
 $('alignment-enter').addEventListener('click',enterGuest);try{if(localStorage.getItem('alignment-progress:guest'))$('alignment-enter').textContent='Continue my adventure →';}catch{}
 $('alignment-fullscreen').addEventListener('click',async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else if(shell.requestFullscreen)await shell.requestFullscreen();else shell.classList.toggle('alignment-expanded');}catch{shell.classList.toggle('alignment-expanded');}});
 document.addEventListener('fullscreenchange',()=>{$('alignment-fullscreen').textContent=document.fullscreenElement?'Exit full screen ↙':'Full screen ↗';});
 document.querySelectorAll('[data-alignment-region]').forEach(button=>button.addEventListener('click',()=>travel(Number(button.dataset.alignmentRegion))));
 $('alignment-talk').addEventListener('click',interact);$('alignment-jump').addEventListener('click',jump);$('alignment-dialog-next').addEventListener('click',nextDialogue);$('alignment-dialog-close').addEventListener('click',closeDialogue);
 canvas.addEventListener('keydown',event=>{const key=event.key.toLowerCase();if(['arrowleft','arrowright','a','d',' ','arrowup','enter','escape'].includes(key))event.preventDefault();if(['arrowleft','a'].includes(key))keys.add(-1);if(['arrowright','d'].includes(key))keys.add(1);if(!event.repeat&&key===' ')jump();if(!event.repeat&&key==='arrowup'){if(!inside()&&(Math.abs(player.x-BUILDING_X)<145||Math.abs(player.x-PORTAL_X)<125))interact();else jump();}if(!event.repeat&&key==='enter')interact();if(key==='escape'){keys.clear();closeDialogue();}});
 $('alignment-dialog').addEventListener('keydown',event=>{if(event.key==='Escape'){event.preventDefault();closeDialogue();}});
 window.addEventListener('keyup',event=>{if(['arrowleft','a'].includes(event.key.toLowerCase()))keys.delete(-1);if(['arrowright','d'].includes(event.key.toLowerCase()))keys.delete(1);});window.addEventListener('blur',()=>keys.clear());
 document.addEventListener('keydown',event=>{if(event.key==='Escape')shell.classList.remove('alignment-expanded');});
 document.querySelectorAll('[data-alignment-move]').forEach(button=>{const direction=Number(button.dataset.alignmentMove);button.addEventListener('pointerdown',event=>{event.preventDefault();button.setPointerCapture(event.pointerId);if(ready)keys.add(direction);});for(const type of ['pointerup','pointercancel','lostpointercapture'])button.addEventListener(type,()=>keys.delete(direction));button.addEventListener('click',()=>{if(ready){player.x=Math.max(30,Math.min(inside()?900:WORLD-50,player.x+direction*24));canvas.focus({preventScroll:true});}});});
 canvas.addEventListener('click',event=>{if(!ready||!$('alignment-dialog').hidden)return;const rect=canvas.getBoundingClientRect(),x=(event.clientX-rect.left)*WIDTH/rect.width+(inside()?0:Math.max(0,Math.min(WORLD-WIDTH,player.x-350)));if(inside()){if(Math.abs(x-GUIDE_X)<90&&Math.abs(player.x-GUIDE_X)<145)interact();else if(x<170&&player.x<200)interact();}else if((Math.abs(x-BUILDING_X)<120&&Math.abs(player.x-BUILDING_X)<145)||(Math.abs(x-PORTAL_X)<90&&Math.abs(player.x-PORTAL_X)<125))interact();});

 function drawImage(path,x,y,width,height){const image=art(path);if(image.complete&&image.naturalWidth)ctx.drawImage(image,Math.round(x),Math.round(y),Math.round(width),Math.round(height));}
 function ground(isInside){if(isInside){ctx.fillStyle='#e9dfc28c';ctx.fillRect(0,FLOOR-3,WIDTH,5);return;}const dark=chapter().venue==='company'?'#444550':'#614c39',top=chapter().venue==='company'?'#9bb6ab':'#9ec575';ctx.fillStyle=dark;ctx.fillRect(0,FLOOR,WIDTH,HEIGHT-FLOOR);ctx.fillStyle=top;ctx.fillRect(0,FLOOR-7,WIDTH,8);ctx.fillStyle='#bfa98a';for(let x=0;x<WIDTH;x+=44){ctx.fillRect(x+(Math.floor(x/44)%2)*10,FLOOR+20,30,3);ctx.fillRect(x+12,FLOOR+52,28,3);}}
 function label(text,x,y){ctx.save();ctx.font='18px "Pixelify Sans",sans-serif';ctx.textAlign='center';ctx.lineWidth=4;ctx.strokeStyle='#24343b';ctx.fillStyle='#fff5dc';ctx.strokeText(text,x,y);ctx.fillText(text,x,y);ctx.restore();}
 function draw(t){
  if(!alive)return;const dt=Math.min(.033,(t-last)/1000||0);last=t;const canMove=ready&&$('alignment-dialog').hidden&&!document.hidden;
  if(canMove){const direction=Number(keys.has(1))-Number(keys.has(-1));if(direction){player.x=Math.max(30,Math.min(inside()?900:WORLD-50,player.x+direction*230*dt));player.facing=direction;}player.y=Math.max(0,player.y+player.vy*dt);player.vy-=1000*dt;if(player.y===0)player.vy=0;}
  const c=chapter(),v=venue(),room=inside(),camera=room?0:Math.max(0,Math.min(WORLD-WIDTH,player.x-350));
  ctx.imageSmoothingEnabled=false;ctx.fillStyle='#1d2b38';ctx.fillRect(0,0,WIDTH,HEIGHT);drawImage(room?v.room:c.art,0,0,WIDTH,HEIGHT);
  if(!room){ctx.fillStyle='#12212a38';ctx.fillRect(0,0,WIDTH,FLOOR);drawImage(v.building,BUILDING_X-camera-175,FLOOR-280,350,280);drawImage('/game-art/alignment/portal.webp',PORTAL_X-camera-85,FLOOR-225,170,225);ground(false);
   for(const [id,x,height]of [['prop-flower',115,30],['prop-book',365,32],['prop-flower',980,29],['prop-star',1335,22],['prop-flower',1740,27]])drawItem(ctx,id,x-camera,FLOOR,height);
   label(v.name,BUILDING_X-camera,FLOOR-287);label(progress.region===STORY.chapters.length-1?'Lantern Core':unlocked(progress.region+1)?'↑ Next portal':'Locked · learn first',PORTAL_X-camera,FLOOR-234);
   if(ready&&Math.abs(player.x-BUILDING_X)<145)label('Enter · go inside',BUILDING_X-camera,FLOOR-110);
   if(ready&&Math.abs(player.x-PORTAL_X)<125)label(unlocked(progress.region+1)?'↑ · enter portal':'Restore this beacon first',PORTAL_X-camera,FLOOR-114);
  }else{ground(true);drawItem(ctx,'prop-book',190,FLOOR,30);drawItem(ctx,'prop-satchel',820,FLOOR,31);drawItem(ctx,'prop-star',735,FLOOR-92,18);const npc=art(c.npc);if(npc.complete&&npc.naturalWidth)ctx.drawImage(npc,GUIDE_X-53,FLOOR-116+Math.sin(t/400)*2,106,116);label(c.host.split(' · ')[0],GUIDE_X,FLOOR-122);label('← Exit',92,FLOOR-93);if(ready&&Math.abs(player.x-GUIDE_X)<145)label('Enter · talk',GUIDE_X,FLOOR-40);}
  for(const peer of peers.values())if(!room&&peer.region===progress.region){const sprite=art('/mini/rig-v2/walk-0.png');if(sprite.complete&&sprite.naturalWidth){ctx.globalAlpha=.7;ctx.drawImage(sprite,peer.x-camera-16,FLOOR-94,94,94);ctx.globalAlpha=1;}label(peer.alias,peer.x-camera,FLOOR-102);}
  drawWorldEffect(ctx,getProfile().effect,t,player.x-camera,FLOOR-player.y,94,window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const moving=canMove&&keys.size>0,sprite=art(`/mini/rig-v2/walk-${moving?Math.floor(t/120)%6:0}.png`);if(sprite.complete&&sprite.naturalWidth){ctx.save();ctx.translate(player.x-camera,FLOOR-player.y);ctx.scale(player.facing,1);ctx.drawImage(sprite,-47,-94,94,94);ctx.restore();}
  ctx.fillStyle='#fff4dd';ctx.font='25px "Pixelify Sans",sans-serif';ctx.fillText(room?v.name:c.name,24,39);ctx.font='15px "Nunito",sans-serif';ctx.fillText(room?v.focus:'A / D or arrows · Space to jump · Enter at a door · ↑ at a portal',24,65);
  if(ready&&t-presenceAt>5000){presenceAt=t;presence();scheduleSave();}if(canCloudSave)$('alignment-presence').textContent=`${[...peers.values()].filter(peer=>peer.region===progress.region).length+1} steward(s) in this region`;
  requestAnimationFrame(draw);
 }
 hud();requestAnimationFrame(draw);
 window.addEventListener('pagehide',()=>{alive=false;clearTimeout(saveTimer);stopPeers?.();save();});
}
