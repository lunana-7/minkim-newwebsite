import {drawItem,cropStage,preloadItems} from './min-world-assets.js';
import {drawBuilding,drawPortalArt,preloadArchitecture} from './min-architecture.js';
import { initGameInteractions,openInteraction,closeInteraction,currentInteraction } from './min-interactions.js';
import { drawTerrain, worldPlatforms, meadowStars, JUMP_SPEED, GRAVITY } from './min-terrain.js';
import { drawPet, petName } from './min-pets.js';
import { drawWorldEffect } from './min-effects.js';
import { portalsFor, portalArrival, NPC_LOOKS, npcImage } from './min-portals.js';
import { RESOURCES, worldNodes, nodeReadyAt } from './min-resource-data.js';
import { gatherNode } from './min-gathering.js';
import { WORLDS } from './min-worlds.js';
import { cropReadyAt, CROPS } from './min-farming.js';
import { getProfile, updateProfile, subscribeProfile, collectAdventureStar, completeAdventureQuest } from './min-profile.js';
import { getEmote, playEmote, stopEmote, EMOTES, emoteAllowsMovement } from './min-emotes.js';
import { subscribeAccount } from './min-cloud.js';
const WORLD = 3600, FLOOR = 408;
const stars = meadowStars;
const popcount = mask => mask.toString(2).replace(/0/g,'').length;
export function initAdventure() {
  const canvas = document.getElementById('adventure-canvas'); if (!canvas) return;
  initGameInteractions();
  const ctx = canvas.getContext('2d'), source = document.querySelector('.min-appearance-adventure');
  const overlay = document.getElementById('adventure-overlay'), message = document.getElementById('adventure-message');
  let profile = getProfile(), paused = true, camera = 0, previous = 0, saveAt = 0, lastX = profile.adventure.x, accountId = null;
  const player = { x: profile.adventure.x, y: FLOOR - 74, w:50, h:74, vy:0, facing:1, grounded:true };
  const pet={x:Math.max(36,player.x-65),feet:FLOOR,vy:0,facing:1,moving:false,grounded:true};
  const backdrops=new Map();preloadArchitecture();preloadItems();
  function worldArt(id){if(!backdrops.has(id)){const image=new Image();image.src=WORLDS[id].image;backdrops.set(id,image);}return backdrops.get(id);}
  let backdrop=worldArt(profile.map), talkingTo=null, gathering=null, portalUntil=0;
  const npcImages=new Map();
  function npcArt(npc){const path=npcImage(npc);if(!npcImages.has(path)){const image=new Image();image.src=path;npcImages.set(path,image);}return npcImages.get(path);}
  const keys = new Set(); let coyoteUntil = 0, jumpUntil = 0, alive = true;
  function say(text) { message.textContent = text; }
  function sync(next) {
    const changed=profile.map!==next.map,petChanged=profile.pet.kind!==next.pet.kind;profile=next;backdrop=worldArt(next.map);
    if(changed){gathering=null;player.x=90;player.y=FLOOR-player.h;player.vy=0;camera=0;lastX=-1;keys.clear();document.getElementById('adventure-npc-dialog').hidden=true;if(currentInteraction()&&!['farm','market'].includes(currentInteraction()))closeInteraction('travel',false);}
    if(changed||petChanged){pet.x=Math.max(36,player.x-65);pet.feet=FLOOR;pet.vy=0;pet.grounded=true;pet.moving=false;}
    document.querySelectorAll('[data-world-go]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.worldGo===next.map)));
    document.getElementById('adventure-map-title').textContent=WORLDS[next.map].name+' map';
    document.getElementById('adventure-meadow-stops').hidden=next.map!=='sunny';
    const directory=document.getElementById('adventure-npc-directory');
    if(directory.dataset.world!==next.map){directory.dataset.world=next.map;updateRoute(next.map);directory.replaceChildren();for(const npc of WORLDS[next.map].npcs){const button=document.createElement('button');button.type='button';button.textContent=`${npc.name} · ${npc.role}`;button.addEventListener('click',()=>{player.x=Math.max(36,npc.x-65);player.y=FLOOR-player.h;player.vy=0;save();openNpc(npc);});directory.append(button);}}

    const portalDirectory=document.getElementById('adventure-portal-directory');
    if(portalDirectory.dataset.world!==next.map){portalDirectory.dataset.world=next.map;portalDirectory.replaceChildren();for(const portal of portalsFor(next.map)){const button=document.createElement('button');button.type='button';button.textContent=`◈ Walk to ${WORLDS[portal.to].name} portal`;button.addEventListener('click',()=>{closeInteraction('travel');gathering=null;player.x=portal.x-50;player.y=FLOOR-player.h;player.vy=0;keys.clear();save();paused=false;overlay.hidden=true;previous=performance.now();say(`Portal to ${WORLDS[portal.to].name}: stand in front of it and press ↑ to enter.`);canvas.scrollIntoView({behavior:'smooth',block:'center'});canvas.focus({preventScroll:true});});portalDirectory.append(button);}}
    for(const npc of WORLDS[next.map].npcs)npcArt(npc);
    if(next.activeActivity)gathering=null;
    const resources=document.getElementById('adventure-resource-directory');
    if(resources.dataset.world!==next.map){resources.dataset.world=next.map;resources.replaceChildren();for(const node of worldNodes(next.map)){const item=RESOURCES[node.resource],button=document.createElement('button');button.type='button';const icon=document.createElement('img');icon.src=`/game-art/items/resource-${node.resource}.png`;icon.alt='';icon.className='gathering-directory-icon';button.append(icon,document.createTextNode(` ${item.name} · ${node.x}`));button.addEventListener('click',()=>{closeInteraction('travel');gathering=null;player.x=node.x-60;player.y=FLOOR-player.h;player.vy=0;keys.clear();save();paused=false;overlay.hidden=true;previous=performance.now();say(`${item.action} ${item.name.toLowerCase()} here: press G or click the resource.`);canvas.focus({preventScroll:true});});resources.append(button);}if(!resources.childElementCount)resources.textContent='No wild gathering here. Explore the forests, harbor or desert.';}
    document.querySelectorAll('[data-adventure-emote]').forEach(button => { button.disabled = Boolean(profile.activeActivity); });
    const count = popcount(profile.adventure.collected);
    document.getElementById('adventure-stars').textContent = count;
    document.getElementById('adventure-quest').textContent = profile.adventure.questComplete ? 'Pippin’s wish · complete ✓' : `Pippin’s wish · ${Math.min(count,6)} / 6`;
  }
  const unsubscribe = subscribeProfile(sync);
  const unsubscribeAccount = subscribeAccount(account => {
    const id = account.user?.uid || 'guest';
    if (accountId !== null && id !== accountId) { profile = getProfile(); player.x = profile.adventure.x; player.y = FLOOR - player.h; player.vy = 0; lastX = player.x; closeInteraction('account-change',false); pet.x = Math.max(36,player.x-65); pet.feet = FLOOR; pet.vy = 0; pet.grounded = true; pause(); }
    accountId = id;
  });
  function updateRoute(id){
    const svg=document.getElementById('adventure-route-diagram'),ns='http://www.w3.org/2000/svg';svg.replaceChildren();svg.setAttribute('aria-label',WORLDS[id].name+' local trail with connected world portals and residents');
    function element(tag,attrs,text){const el=document.createElementNS(ns,tag);for(const[k,v]of Object.entries(attrs))el.setAttribute(k,String(v));if(text)el.textContent=text;svg.append(el);return el;}
    element('path',{d:'M90 130H3485',stroke:'#a5be8d','stroke-width':26,'stroke-dasharray':'35 20'});
    for(const portal of portalsFor(id)){element('path',{d:`M${portal.x} 85l40 45-40 45-40-45z`,fill:'#c7b1dc',stroke:'#877094','stroke-width':7});element('text',{x:Math.max(260,Math.min(3300,portal.x)),y:49,fill:'#645340','font-family':'Nunito,sans-serif','font-size':46,'text-anchor':'middle'},WORLDS[portal.to].name);}
    for(const npc of WORLDS[id].npcs){element('rect',{x:npc.x-24,y:106,width:48,height:48,fill:'#f4ddb3',stroke:'#977654','stroke-width':6});element('text',{x:npc.x,y:223,fill:'#645340','font-family':'Nunito,sans-serif','font-size':54,'text-anchor':'middle'},npc.name);}
    const marker=element('g',{id:'adventure-map-marker',transform:`translate(${Math.round(player.x)} 55)`});const pin=document.createElementNS(ns,'path');pin.setAttribute('fill','#c77994');pin.setAttribute('d','M-24-22h48v30L0 36-24 8z');marker.append(pin);
  }
  function save() {
    if (Math.abs(lastX - player.x) < 2) return;
    lastX = Math.round(player.x);
    updateProfile({ adventure: { ...getProfile().adventure, x: lastX } });
  }
  function pause() { gathering=null; paused = true; keys.clear(); save(); overlay.hidden = false; document.getElementById('adventure-play').textContent = 'Continue adventure →'; }
  function jump() { if(!emoteAllowsMovement())stopEmote();jumpUntil = performance.now() + 140; }
  let dropUntil=0,dropSurface=-1;
  function dropDown(){if(paused||!player.grounded||player.y+player.h>=FLOOR||profile.activeActivity||gathering)return;dropSurface=player.y+player.h;dropUntil=performance.now()+300;player.y+=5;player.vy=70;player.grounded=false;coyoteUntil=0;jumpUntil=0;}
  function enterCafe() { if(profile.map!=='sunny')updateProfile({map:'sunny',adventure:{...getProfile().adventure,x:650}});player.x=650;player.y=FLOOR-player.h;player.vy=0;save(); say('Welcome to Maple Cup Café. Your window seat is ready.'); window.dispatchEvent(new Event('min-cafe-open')); }
  document.getElementById('adventure-cafe').addEventListener('click', enterCafe);
  let interactionWasPlaying=false;
  window.addEventListener('min-interaction-open',()=>{interactionWasPlaying=!paused;gathering=null;paused=true;keys.clear();jumpUntil=0;save();overlay.hidden=true;document.getElementById('adventure-play').textContent='Continue adventure →';});
  window.addEventListener('min-interaction-close',event=>{talkingTo=null;keys.clear();if(!event.detail.resume)return;paused=!interactionWasPlaying;previous=performance.now();overlay.hidden=interactionWasPlaying;canvas.focus({preventScroll:true});say('Back in the world. Your visit and progress are saved.');});
  const mapPanel=document.getElementById('adventure-world-map'), mapToggle=document.getElementById('adventure-map-toggle');
  mapToggle.addEventListener('click',()=>openInteraction('map'));
  window.addEventListener('min-interaction-open',event=>mapToggle.setAttribute('aria-expanded',String(event.detail.id==='map')));
  window.addEventListener('min-interaction-close',()=>mapToggle.setAttribute('aria-expanded','false'));
  window.addEventListener('min-interaction-change',event=>mapToggle.setAttribute('aria-expanded',String(event.detail.id==='map')));
  document.querySelectorAll('[data-adventure-travel]').forEach(button=>button.addEventListener('click',()=>{closeInteraction('travel');gathering=null;player.x=Number(button.dataset.adventureTravel);player.y=FLOOR-player.h;player.vy=0;keys.clear();save();say(`Arrived at ${button.textContent}.`);if(player.x===650)enterCafe();else{paused=false;previous=performance.now();overlay.hidden=true;canvas.focus({preventScroll:true});}}));
  function travel(id,arrival=90) {if(!WORLDS[id])return;const visit=currentInteraction(),stayInPlace=['farm','market'].includes(visit)&&['farm','market'].includes(id);if(visit&&!stayInPlace)closeInteraction('travel',false);gathering=null;keys.clear();portalUntil=performance.now()+1100;updateProfile({map:id,adventure:{...getProfile().adventure,x:arrival}});player.x=arrival;player.y=FLOOR-player.h;player.vy=0;lastX=arrival;camera=Math.max(0,Math.min(WORLD-canvas.width,arrival-canvas.width*.4));paused=Boolean(currentInteraction());previous=performance.now();overlay.hidden=true;document.getElementById('adventure-npc-dialog').hidden=true;say(`${WORLDS[id].name}: ${WORLDS[id].description}`);canvas.classList.remove('portal-arrival');requestAnimationFrame(()=>canvas.classList.add('portal-arrival'));if(stayInPlace)openInteraction(id);else canvas.focus({preventScroll:true});}
  function nearbyPortal(){return portalsFor(profile.map).find(portal=>Math.abs(player.x+25-portal.x)<58&&Math.abs(player.y+player.h-FLOOR)<18);}
  const shopDoors=[{id:'icecream',x:450,name:'Cloud Scoop'},{id:'bakery',x:1500,name:'Honeycrumb'}];
  function nearbyShopDoor(){return profile.map==='market'&&Math.abs(player.y+player.h-FLOOR)<18?shopDoors.find(door=>Math.abs(player.x+25-door.x)<52):null;}
  function enterShop(door=nearbyShopDoor()){if(!door){say('Stand in front of a shop door, then press Enter.');return;}if(profile.activeActivity||gathering){say('Finish this activity before entering the shop.');return;}window.dispatchEvent(new CustomEvent('min-kitchen-open',{detail:door.id}));}
  window.addEventListener('min-kitchen-entering',event=>{const door=shopDoors.find(item=>item.id===event.detail);if(!door)return;if(profile.map!=='market')travel('market',door.x-25);else{player.x=door.x-25;player.y=FLOOR-player.h;player.vy=0;save();}camera=Math.max(0,Math.min(WORLD-canvas.width,player.x-canvas.width*.4));});
  function enterPortal(portal=nearbyPortal()){if(!portal||portal.from!==profile.map||Math.abs(player.x+25-portal.x)>=58||Math.abs(player.y+player.h-FLOOR)>=18){say('Walk close to a glowing portal. Map → World portals shows its location.');return;}if(paused||currentInteraction()||profile.activeActivity||gathering||performance.now()<portalUntil)return;const from=profile.map;travel(portal.to,portalArrival(from,portal.to));say(`Through the portal: ${WORLDS[from].name} → ${WORLDS[portal.to].name}. The return portal is behind you.`);}
  document.getElementById('adventure-portal').addEventListener('click',()=>enterPortal());
  document.querySelectorAll('.adventure-world-tabs [data-world-go],#adventure-world-map [data-world-go]').forEach(button=>button.addEventListener('click',()=>travel(button.dataset.worldGo)));
  window.addEventListener('min-world-travel',event=>travel(event.detail));
  function questTalk(){if(profile.adventure.questComplete){playEmote('heart');return 'Thank you, Mini! Your star keeper badge is earned.';}if(completeAdventureQuest(Math.round(player.x))){playEmote('cake');return 'Six stars! Here is a cake and 50 points. You earned your star keeper badge.';}return `Could you bring me six stars? You have ${popcount(profile.adventure.collected)} so far.`;}
  let dialoguePages=[],dialoguePage=0,dialogueLabel='',dialogueText='',dialogueCursor=0,dialogueTimer=null;
  function showDialogue(){clearInterval(dialogueTimer);const chars=Array.from(dialoguePages[dialoguePage]||'');dialogueText=chars.join('');dialogueCursor=0;const line=document.getElementById('adventure-npc-line');line.textContent='';document.getElementById('adventure-npc-page').textContent=`${dialoguePage+1} / ${dialoguePages.length} · Enter to continue`;document.getElementById('adventure-npc-back').disabled=dialoguePage===0;document.getElementById('adventure-npc-action').textContent=dialoguePage<dialoguePages.length-1?'Next →':dialogueLabel;
   if(matchMedia('(prefers-reduced-motion: reduce)').matches){line.textContent=dialogueText;dialogueCursor=chars.length;return;}
   dialogueTimer=setInterval(()=>{dialogueCursor=Math.min(chars.length,dialogueCursor+2);line.textContent=chars.slice(0,dialogueCursor).join('');if(dialogueCursor===chars.length)clearInterval(dialogueTimer);},24);
  }
  document.getElementById('adventure-npc-back').addEventListener('click',()=>{if(dialoguePage>0){dialoguePage--;showDialogue();}});
  window.addEventListener('min-interaction-close',()=>clearInterval(dialogueTimer));
  function openNpc(npc){gathering=null;talkingTo=npc;keys.clear();save();overlay.hidden=true;const dialog=document.getElementById('adventure-npc-dialog');dialog.hidden=false;document.getElementById('adventure-npc-name').textContent=npc.name;document.getElementById('adventure-npc-portrait').src=npcImage(npc);document.getElementById('adventure-npc-role').textContent=npc.role;const line=npc.action==='quest'?questTalk():npc.line;dialoguePages=line.match(/[^.!?]+[.!?]+|[^.!?]+$/g)?.map(s=>s.trim()).filter(Boolean)||[line];dialoguePage=0;const labels={quest:'Thanks, Pippin! ♡',cafe:'Take a café seat ☕',farm:'Open my farm ♧',market:'Visit the market →',wiki:'Explore the Wiki ↗',map:'Open world map ♧',icecream:'Work at Cloud Scoop 🍦',bakery:'Work at Honeycrumb 🍰'};dialogueLabel=labels[npc.action]||'See you soon!';if(dialoguePages.length===1)dialoguePages.push(npc.action==='quest'?'A little kindness makes this world brighter.':`Ready? ${dialogueLabel}`);showDialogue();openInteraction('npc');document.getElementById('adventure-npc-action').focus({preventScroll:true});}
  function closeNpc(){closeInteraction();}
  document.getElementById('adventure-npc-close').addEventListener('click',closeNpc);
  document.getElementById('adventure-npc-action').addEventListener('click',()=>{if(!talkingTo)return;if(dialogueCursor<Array.from(dialogueText).length){clearInterval(dialogueTimer);dialogueCursor=Array.from(dialogueText).length;document.getElementById('adventure-npc-line').textContent=dialogueText;return;}if(dialoguePage<dialoguePages.length-1){dialoguePage++;showDialogue();return;}const action=talkingTo.action;closeNpc();if(action==='cafe')enterCafe();if(action==='farm'||action==='market'){if(profile.map!==action)travel(action);window.dispatchEvent(new Event('min-farm-open'));}if(action==='map')openInteraction('map');if(action==='icecream'||action==='bakery')window.dispatchEvent(new CustomEvent('min-kitchen-open',{detail:action}));if(action==='wiki')window.location.assign('/wiki');});
  function talk(){const door=nearbyShopDoor();if(door){enterShop(door);return;}const npc=WORLDS[profile.map].npcs.filter(npc=>Math.abs(player.x+25-npc.x)<130&&Math.abs(player.y+player.h-FLOOR)<100).sort((a,b)=>Math.abs(player.x+25-a.x)-Math.abs(player.x+25-b.x))[0];if(npc)openNpc(npc);else if(nearNode())startGather();else say(nearbyPortal()?'Press ↑ to enter this portal. Enter talks to a nearby resident.':'Walk closer to a resident or shop door, then press Enter.');}
  function nearNode(){return worldNodes(profile.map).find(node=>Math.abs(player.x+25-node.x)<110&&Math.abs(player.y+player.h-FLOOR)<18);}
  function startGather(node=nearNode()){
    if(gathering){say('Gathering in progress…');return;}if(profile.activeActivity){say('Mini is finishing her coffee, meal or study session. Try again when she finishes.');return;}if(!emoteAllowsMovement())stopEmote();
    if(!node||node.world!==profile.map||Math.abs(player.x+25-node.x)>=110||Math.abs(player.y+player.h-FLOOR)>=18){say('Walk close to a resource on the ground, then press G. Map → Gathering stops shows where to go.');return;}
    const wait=nodeReadyAt(node,profile.gathering)-Date.now();if(wait>0){say(`This spot is regrowing. Come back in ${Math.ceil(wait/1000)} seconds.`);return;}
    paused=false;overlay.hidden=true;keys.clear();jumpUntil=0;gathering={node,started:performance.now(),world:profile.map};say(`${RESOURCES[node.resource].action} ${RESOURCES[node.resource].name.toLowerCase()}…`);
  }
  document.getElementById('adventure-gather').addEventListener('click',()=>startGather());
  // Gathering should work even after a click moves focus to a button or another part of the page.
  window.addEventListener('keydown',event=>{
    if(event.key.toLowerCase()!=='g'||event.repeat||event.defaultPrevented||event.ctrlKey||event.metaKey||event.altKey||currentInteraction())return;
    if(event.target instanceof Element && event.target.closest('input,textarea,select,[contenteditable="true"]'))return;
    if(document.getElementById('min-companion-menu')?.hidden===false)return;
    event.preventDefault();
    startGather();
  },{capture:true});
  document.getElementById('adventure-play').addEventListener('click', () => { paused = false; previous = performance.now(); overlay.hidden = true; canvas.focus({ preventScroll:true }); });
  document.getElementById('adventure-pause').addEventListener('click', pause);
  document.getElementById('adventure-jump').addEventListener('click', jump);
  document.getElementById('adventure-drop').addEventListener('click',dropDown);
  document.getElementById('adventure-talk').addEventListener('click', talk);
  document.querySelectorAll('[data-adventure-hold]').forEach(button => {
    const key = button.dataset.adventureHold;
    button.addEventListener('click', () => { if (!paused && emoteAllowsMovement() && !profile.activeActivity && !gathering) { player.facing = key === 'right' ? 1 : -1; player.x = Math.max(36, Math.min(WORLD - player.w - 36, player.x + player.facing * 16)); } });
    button.addEventListener('pointerdown', event => { event.preventDefault(); button.setPointerCapture(event.pointerId); keys.add(key); });
    for (const type of ['pointerup','pointercancel','lostpointercapture']) button.addEventListener(type, () => keys.delete(key));
  });
  document.querySelectorAll('[data-adventure-emote]').forEach(button => button.addEventListener('click', () => { playEmote(button.dataset.adventureEmote); say(EMOTES[button.dataset.adventureEmote].message); }));
  const shell=canvas.closest('.mini-adventure');
  const expandButton=document.getElementById('adventure-expand');
  function expanded(){return document.fullscreenElement===shell||shell.classList.contains('adventure-expanded');}
  function syncExpandButton(){const isExpanded=expanded();expandButton.setAttribute('aria-pressed',String(isExpanded));expandButton.setAttribute('aria-label',isExpanded?'Exit full screen':'Expand game screen');expandButton.textContent=isExpanded?'↙ Exit full screen':'⛶ Full screen';}
  async function toggleExpanded(){
    if(document.fullscreenElement===shell){await document.exitFullscreen();return;}
    if(shell.classList.contains('adventure-expanded')){shell.classList.remove('adventure-expanded');document.body.classList.remove('adventure-scroll-lock');syncExpandButton();return;}
    try{if(!shell.requestFullscreen)throw new Error('Fullscreen unavailable');await shell.requestFullscreen();}
    catch{shell.classList.add('adventure-expanded');document.body.classList.add('adventure-scroll-lock');syncExpandButton();}
  }
  expandButton.addEventListener('click',toggleExpanded);
  document.addEventListener('fullscreenchange',syncExpandButton);
  function resume(){if(currentInteraction())return;paused=false;previous=performance.now();overlay.hidden=true;canvas.focus({preventScroll:true});}
  // Toolbar focus stays within the game, so its buttons cannot swallow field shortcuts.
  shell.addEventListener('keydown',event=>{
    if(event.defaultPrevented||event.ctrlKey||event.metaKey||event.altKey||event.target.closest('#adventure-expand')||currentInteraction()||event.target.closest('input,textarea,select,a,[contenteditable="true"]'))return;
    const key=event.key.toLowerCase();
    if(!['arrowleft','arrowright','a','d',' ','arrowup','w','arrowdown','s','enter','escape'].includes(key))return;
    event.preventDefault();
    if(key==='escape'){if(expanded()){toggleExpanded();return;}pause();return;}
    if(paused){if(!event.repeat&&['enter',' '].includes(key))resume();else say('Game paused. Press Enter or Space to continue.');return;}
    if(profile.activeActivity){say('Mini is finishing her coffee, meal or study session. Controls return when it finishes.');return;}
    if(!emoteAllowsMovement())stopEmote();
    if(key==='arrowleft'||key==='a')keys.add('left');
    if(key==='arrowright'||key==='d')keys.add('right');
    if(!event.repeat&&key===' ')jump();
    if(!event.repeat&&['arrowup','w'].includes(key)){const portal=nearbyPortal();if(portal)enterPortal(portal);else jump();}
    if(!event.repeat&&['arrowdown','s'].includes(key))dropDown();
    if(!event.repeat&&key==='enter')talk();
  });
  shell.addEventListener('click',event=>{if(!currentInteraction()&&overlay.hidden&&event.target.closest('.adventure-toolbar,.adventure-emotes,.adventure-world-tabs'))canvas.focus({preventScroll:true});});
  function release(event) { const key = event.key.toLowerCase(); if (key === 'arrowleft' || key === 'a') keys.delete('left'); if (key === 'arrowright' || key === 'd') keys.delete('right'); }
  window.addEventListener('keyup', release);
  window.addEventListener('blur', pause);
  document.addEventListener('visibilitychange', () => { if (document.hidden) pause(); });
  canvas.addEventListener('pointerdown', event => {
    canvas.focus({preventScroll:true});
    const rect = canvas.getBoundingClientRect(), x = (event.clientX - rect.left) * canvas.width / rect.width + camera, y = (event.clientY - rect.top) * 480 / rect.height;
    const clickedPortal=portalsFor(profile.map).find(portal=>Math.abs(x-portal.x)<38&&y>FLOOR-110);if(clickedPortal){say('Stand in front of the portal, then press ↑ to enter. On touchscreens, use the Enter portal button.');return;}
    const clickedDoor=profile.map==='market'&&shopDoors.find(door=>Math.abs(x-door.x)<43&&y>FLOOR-155);if(clickedDoor){if(Math.abs(player.x+25-clickedDoor.x)<52)enterShop(clickedDoor);else say(`Walk to ${clickedDoor.name}’s door, then press Enter.`);return;}
    const resource=worldNodes(profile.map).find(node=>Math.abs(x-node.x)<42&&y>FLOOR-105);
    if(resource){startGather(resource);return;}
    if (gathering)return;
    if (x >= player.x - 12 && x <= player.x + player.w + 12 && y >= player.y - 12 && y <= player.y + player.h) {
      if (profile.activeActivity) { say('Mini is finishing a little activity. Try an emote in a moment!'); return; }
      const choices = ['hello','cake','icecream','heart']; const kind = choices[Math.floor(Math.random() * choices.length)]; playEmote(kind); say(EMOTES[kind].message);
    } else {const npc=WORLDS[profile.map].npcs.find(npc=>Math.abs(x-npc.x)<45&&y>FLOOR-100);if(npc)openNpc(npc);else if(profile.map==='farm'&&y>FLOOR-50){const index=Math.floor((x-900)/95);if(index>=0&&index<6)window.dispatchEvent(new CustomEvent('min-farm-plot',{detail:index}));}}
  });
  const resize = new ResizeObserver(() => { const rect = canvas.getBoundingClientRect(); canvas.width = Math.max(1, Math.round(rect.width * 480 / Math.max(1,rect.height))); canvas.height = 480; }); resize.observe(canvas);
  function physics(dt, now) {
    const platforms=worldPlatforms(profile.map);
    const moving = !gathering && emoteAllowsMovement() && !profile.activeActivity;
    const direction = moving ? Number(keys.has('right')) - Number(keys.has('left')) : 0;
    if (direction) player.facing = direction;
    player.x = Math.max(36,Math.min(WORLD - player.w - 36, player.x + direction * 235 * dt));
    if (player.grounded) coyoteUntil = now + 100;
    if (jumpUntil > now && coyoteUntil > now && moving) { player.vy = -JUMP_SPEED; player.grounded = false; jumpUntil = 0; coyoteUntil = 0; }
    const before = player.y + player.h;
    player.vy += GRAVITY * dt; player.y += player.vy * dt; player.grounded = false;
    if(player.y<8){player.y=8;player.vy=Math.max(0,player.vy);}
    if (player.y + player.h >= FLOOR) { player.y = FLOOR - player.h; player.vy = 0; player.grounded = true; }
    if (player.vy >= 0) for (const p of platforms) {
      if(now<dropUntil&&p.y===dropSurface)continue;
      if (player.x + player.w - 8 > p.x && player.x + 8 < p.x + p.w && before <= p.y + 3 && player.y + player.h >= p.y) { player.y = p.y - player.h; player.vy = 0; player.grounded = true; break; }
    }
    source.dataset.controlledPose = !player.grounded ? 'jump' : direction ? 'walk' : 'idle';
    if(profile.map==='sunny') for (let i = 0; i < stars.length; i++) {
      if (profile.adventure.collected & (1 << i)) continue;
      const s = stars[i];
      if (Math.hypot(player.x + player.w / 2 - s.x, player.y + player.h / 2 - s.y) < 43 && collectAdventureStar(i, Math.round(player.x))) say(`Star collected! +5 points · ${popcount(getProfile().adventure.collected)} / 16`);
    }
    if (now - saveAt > 2000) { save(); saveAt = now; }
  }
  function rect(color,x,y,w,h) { ctx.fillStyle=color; ctx.fillRect(Math.round(x),Math.round(y),w,h); }
  function star(x,y){drawItem(ctx,'prop-star',x,y+11,22);}
  function drawNpc(npc,now){const x=npc.x-camera,y=FLOOR,bob=Math.round(Math.sin(now/450));const image=npcArt(npc),look=NPC_LOOKS[npc.id]||NPC_LOOKS.pippin;ctx.save();ctx.translate(0,bob);ctx.imageSmoothingEnabled=false;if(image.complete&&image.naturalWidth)ctx.drawImage(image,x-37,y-74,74,74);
    const props={chef:['prop-chefhat',x,y-72,17],apron:['prop-apron',x+2,y-8,24],book:['prop-book',x+15,y-16,17],satchel:['prop-satchel',x+16,y-11,19],crystal:['resource-crystal',x+17,y-15,19],scarf:['prop-scarf',x+3,y-22,13],flower:['prop-flower',x+15,y-60,12],star:['prop-star',x+15,y-63,15],sailor:['prop-sailorcap',x,y-72,12]};
    const prop=props[look.accessory];if(prop)drawItem(ctx,...prop);if(look.accessory==='chef')drawItem(ctx,'prop-apron',x+2,y-8,24);
    ctx.textAlign='center';ctx.font='15px "Pixelify Sans",sans-serif';rect('#fff6e5',x-43,y-108,86,21);ctx.fillStyle='#64503d';ctx.fillText(npc.name,x,y-93);if(Math.abs(player.x-npc.x)<130){ctx.fillStyle='#fff5d8';ctx.font='13px "Pixelify Sans",sans-serif';ctx.strokeStyle='#534638';ctx.lineWidth=3;ctx.strokeText('Enter · talk',x,y-119);ctx.fillText('Enter · talk',x,y-119);}ctx.restore();}
  function drawPortal(portal,now){const x=portal.x-camera,y=FLOOR;ctx.save();drawPortalArt(ctx,portal.to,x,y,now,matchMedia('(prefers-reduced-motion: reduce)').matches);for(let i=0;i<5;i++){const a=x-15+(i%3)*13,b=y-15-((now/35+i*19)%70);rect('#fff4df',a,b,3,5);}ctx.font='13px "Pixelify Sans",sans-serif';ctx.textAlign='center';const label=WORLDS[portal.to].name;rect('#fff6e5',x-ctx.measureText(label).width/2-7,y-183,ctx.measureText(label).width+14,21);ctx.fillStyle='#665271';ctx.fillText(label,x,y-169);if(Math.abs(player.x+25-portal.x)<58){ctx.fillStyle='#fff4dc';ctx.strokeStyle='#655371';ctx.lineWidth=3;ctx.strokeText('↑ · enter portal',x,y-194);ctx.fillText('↑ · enter portal',x,y-194);}ctx.restore();}
  function drawFarm(){for(let i=0;i<6;i++){const x=939+i*95-camera,plot=profile.farm.plots[i];drawItem(ctx,'prop-soil',x,FLOOR,23,78);if(plot){const stage=cropStage(plot,cropReadyAt(plot));drawItem(ctx,`crop-${plot.crop}-${stage}`,x,FLOOR-4,stage==='sprout'?24:46);if(stage==='ripe'){ctx.fillStyle='#fff1bd';ctx.font='13px "Pixelify Sans",sans-serif';ctx.textAlign='center';ctx.fillText('Harvest!',x,FLOOR-55);}}}}
  function drawResource(node,now){const item=RESOURCES[node.resource],x=node.x-camera,y=FLOOR,wait=nodeReadyAt(node,profile.gathering)-Date.now();ctx.save();if(wait>0)ctx.globalAlpha=.4;const heights={wood:135,acorn:66,shell:33,fish:35,mushroom:52,crystal:66,ore:54,cactus:91,herb:43};drawItem(ctx,'resource-'+node.resource,x,y,heights[node.resource]);ctx.globalAlpha=1;ctx.textAlign='center';ctx.font='13px "Pixelify Sans",sans-serif';ctx.fillStyle='#fff4dc';ctx.strokeStyle='#514742';ctx.lineWidth=3;const text=wait>0?`Regrowing · ${Math.ceil(wait/1000)}s`:Math.abs(player.x+25-node.x)<110?`G · ${item.action}`:item.name;ctx.strokeText(text,x,y-heights[node.resource]-12);ctx.fillText(text,x,y-heights[node.resource]-12);ctx.restore();}
  function drawGathering(now){if(!gathering)return;const item=RESOURCES[gathering.node.resource],x=player.x-camera+25,y=player.y-16,progress=Math.min(1,(now-gathering.started)/1400);rect('#fff4dc',x-38,y-10,76,8);rect('#94b282',x-36,y-8,72*progress,4);ctx.save();ctx.translate(x+24,player.y+40);ctx.rotate(Math.sin(now/110)*.65);const tools={axe:'axe',pickaxe:'pickaxe',rod:'rod',hand:'glove'};drawItem(ctx,'prop-'+tools[item.tool],0,10,item.tool==='rod'?65:37);ctx.restore();}
  function followPet(dt){
    pet.moving=false;if(profile.pet.kind==='none'||paused)return;
    if(profile.pet.follow&&Math.abs(player.x-pet.x)>460){pet.x=Math.max(36,player.x-65);pet.feet=player.y+player.h;pet.vy=0;}
    if(profile.pet.follow){const target=Math.max(36,Math.min(WORLD-40,player.x+25-player.facing*65)),delta=target-pet.x;if(Math.abs(delta)>6){const step=Math.sign(delta)*Math.min(Math.abs(delta),270*dt);pet.x+=step;pet.facing=Math.sign(delta);pet.moving=true;}
      if(pet.grounded&&player.y+player.h<pet.feet-28&&Math.abs(player.x-pet.x)<220){pet.vy=-JUMP_SPEED;pet.grounded=false;}}
    if(profile.pet.follow&&pet.grounded&&player.y+player.h>pet.feet+28){pet.feet+=5;pet.vy=70;}
    const before=pet.feet;pet.vy+=GRAVITY*dt;pet.feet+=pet.vy*dt;pet.grounded=false;
    if(pet.feet>=FLOOR){pet.feet=FLOOR;pet.vy=0;pet.grounded=true;}
    if(pet.vy>=0)for(const platform of worldPlatforms(profile.map)){if(pet.x+15>platform.x&&pet.x-15<platform.x+platform.w&&before<=platform.y+3&&pet.feet>=platform.y){pet.feet=platform.y;pet.vy=0;pet.grounded=true;break;}}
  }
  function draw(now) {
    const night = profile.map==='night', forest=profile.map==='forest';
    if (backdrop.complete && backdrop.naturalWidth) {
      const tileWidth = backdrop.naturalWidth / backdrop.naturalHeight * 480;
      const offset = camera * .18 % tileWidth;
      ctx.imageSmoothingEnabled = false;
      for (let x=-offset; x<canvas.width; x+=tileWidth) ctx.drawImage(backdrop,Math.floor(x),0,Math.ceil(tileWidth),480);

    } else {ctx.fillStyle='#31455f';ctx.fillRect(0,0,canvas.width,480);}
    drawTerrain(ctx,profile.map,camera,canvas.width,FLOOR,worldPlatforms(profile.map));
    if(profile.map==='sunny')for(let i=0;i<stars.length;i++)if(!(profile.adventure.collected&(1<<i)))star(stars[i].x-camera,stars[i].y+Math.sin(now/250+i)*3);
    for(let i=0;i<14;i++)drawItem(ctx,'prop-flower',i*265+100-camera,FLOOR-2,12);
    if(profile.map==='sunny')drawBuilding(ctx,'cafe',650-camera,FLOOR);
    if(profile.map==='forest')drawBuilding(ctx,'library',970-camera,FLOOR);
    if(profile.map==='farm')drawBuilding(ctx,'farm',600-camera,FLOOR);
    if(profile.map==='market'){drawBuilding(ctx,'icecream',450-camera,FLOOR);drawBuilding(ctx,'bakery',1500-camera,FLOOR);drawBuilding(ctx,'market',850-camera,FLOOR);}
    if(profile.map==='market')for(const door of shopDoors){const x=door.x-camera;if(Math.abs(player.x+25-door.x)<95){ctx.save();ctx.textAlign='center';ctx.font='14px "Pixelify Sans",sans-serif';const label='Enter · '+door.name;const width=ctx.measureText(label).width+20;rect('#fff5dc',x-width/2,FLOOR-197,width,25);ctx.fillStyle='#5e5146';ctx.fillText(label,x,FLOOR-180);ctx.restore();}}
    for(const portal of portalsFor(profile.map))drawPortal(portal,now);
    for(const node of worldNodes(profile.map))drawResource(node,now);
    for(const npc of WORLDS[profile.map].npcs)drawNpc(npc,now);
    if(profile.map==='farm')drawFarm();
    if(profile.pet.kind!=='none'){drawPet(ctx,profile.pet,now,{x:pet.x-camera,feet:pet.feet,scale:1,moving:pet.moving,jumping:!pet.grounded,facing:pet.facing,reduced:window.matchMedia('(prefers-reduced-motion: reduce)').matches});ctx.textAlign='center';ctx.font='12px "Pixelify Sans",sans-serif';ctx.fillStyle='#fff3dc';ctx.strokeStyle='#51463c';ctx.lineWidth=3;ctx.strokeText(petName(profile.pet),pet.x-camera,pet.feet-39);ctx.fillText(petName(profile.pet),pet.x-camera,pet.feet-39);}
    drawWorldEffect(ctx,profile.effect,now,player.x-camera+player.w/2,player.y+player.h,player.h,window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    const art=source.querySelector('canvas');ctx.imageSmoothingEnabled=false;
    ctx.save();ctx.translate(Math.round(player.x-camera+player.w/2),Math.round(player.y+player.h));ctx.scale(player.facing,1);
    if(source.dataset.rigReady==='true')ctx.drawImage(art,-player.h/2,-player.h,player.h,player.h);
    else {rect('#fff0d4',-14,-60,28,40);rect('#765340',-16,-74,32,25);}
    ctx.restore();
    drawGathering(now);
    const emote=getEmote(); if(emote){const text=EMOTES[emote.kind].icon+' '+(emote.kind==='hello'?'Hello!':emote.kind==='cake'?'For you!':emote.kind==='icecream'?'One scoop!':'♡');ctx.font='15px "Pixelify Sans",sans-serif';const x=player.x-camera+25,y=player.y-22;rect('#fff8e9',x-45,y-17,90,28);ctx.fillStyle='#73523f';ctx.fillText(text,x,y+2);}
    ctx.textAlign='left';ctx.font='16px "Pixelify Sans",sans-serif';ctx.fillStyle=night?'#fff0d4':'#53664a';ctx.fillText(WORLDS[profile.map].name,18,25);
  }
  function tick(now) {
    if(!alive)return;
    const dt=Math.min(.033,Math.max(0,(now-previous)/1000));previous=now;
    if(gathering&&!paused&&now-gathering.started>=1400){const node=gathering.node;gathering=null;const result=gatherNode(node.id);if(result){playEmote('heart');say(`Gathered ${result.amount} ${result.name.toLowerCase()}! +1 point · Sell your finds at Berry Market.`);}}
    if(!paused)physics(dt,now); else source.dataset.controlledPose='idle';
    followPet(dt);
    const closePortal=nearbyPortal(),portalButton=document.getElementById('adventure-portal');portalButton.disabled=paused||!closePortal||Boolean(profile.activeActivity)||Boolean(gathering);portalButton.textContent=closePortal?`↑ Enter ${WORLDS[closePortal.to].name}`:'↑ Enter portal';
    const keyStatus=document.getElementById('adventure-key-status'),resource=nearNode(),door=nearbyShopDoor(),local=WORLDS[profile.map].npcs.find(n=>Math.abs(player.x+25-n.x)<130&&Math.abs(player.y+player.h-FLOOR)<100);const help=paused?'Enter · continue':profile.activeActivity?'Mini is taking a little break':gathering?'Gathering…':closePortal?'↑ · enter portal':door?`Enter · ${door.name}`:local?`Enter · talk to ${local.name}`:resource?`G · ${RESOURCES[resource.resource].action}`:'← → · move | Space · jump';if(keyStatus.textContent!==help)keyStatus.textContent=help;
    const target=Math.max(0,Math.min(WORLD-canvas.width,player.x-canvas.width*.4));camera+=(target-camera)*Math.min(1,dt*9);draw(now);
    if (!mapPanel.hidden) {
      document.getElementById('adventure-map-marker').setAttribute('transform',`translate(${Math.round(player.x)} 55)`);
      const stops=[{x:90,name:'Arrival'},...portalsFor(profile.map).map(portal=>({x:portal.x,name:WORLDS[portal.to].name+' portal'})),...WORLDS[profile.map].npcs.map(npc=>({x:npc.x,name:npc.name}))];
      const closest=stops.reduce((a,b)=>Math.abs(b.x-player.x)<Math.abs(a.x-player.x)?b:a);
      document.getElementById('adventure-map-location').textContent=`Mini: ${Math.round(player.x)} / ${WORLD} · nearest: ${closest.name}`;
    }
    requestAnimationFrame(tick);
  }
  window.addEventListener('pagehide',()=>{save();alive=false;resize.disconnect();unsubscribe();unsubscribeAccount();window.removeEventListener('keyup',release);});
  requestAnimationFrame(tick);
}
