import { getProfile, updateProfile, subscribeProfile, collectAdventureStar, completeAdventureQuest } from './min-profile.js';
import { getEmote, playEmote, EMOTES } from './min-emotes.js';
import { subscribeAccount } from './min-cloud.js';
const WORLD = 3600, FLOOR = 408;
const platforms = [
  [240,338,190], [510,264,150], [790,332,190], [1110,310,160],
  [1450,340,190], [1740,265,170], [2040,335,150], [2320,310,170],
  [2620,338,180], [2880,263,150], [3190,335,150],
].map(([x,y,w]) => ({x,y,w}));
const stars = [[170,360],[325,292],[575,219],[880,287],[1050,360],[1190,265],[1360,360],[1540,295],[1820,220],[1980,360],[2110,290],[2400,265],[2520,360],[2700,293],[2950,218],[3270,290]].map(([x,y]) => ({x,y}));
const popcount = mask => mask.toString(2).replace(/0/g,'').length;
export function initAdventure() {
  const canvas = document.getElementById('adventure-canvas'); if (!canvas) return;
  const ctx = canvas.getContext('2d'), source = document.querySelector('.min-appearance-adventure');
  const overlay = document.getElementById('adventure-overlay'), message = document.getElementById('adventure-message');
  let profile = getProfile(), paused = true, camera = 0, previous = 0, saveAt = 0, lastX = profile.adventure.x, accountId = null;
  const player = { x: profile.adventure.x, y: FLOOR - 74, w:50, h:74, vy:0, facing:1, grounded:true };
  const backdrop = new Image(); backdrop.src = '/game-art/maple-meadow.webp';
  const keys = new Set(); let coyoteUntil = 0, jumpUntil = 0, alive = true;
  function say(text) { message.textContent = text; }
  function sync(next) {
    profile = next;
    document.querySelectorAll('[data-adventure-emote]').forEach(button => { button.disabled = Boolean(profile.activeActivity); });
    const count = popcount(profile.adventure.collected);
    document.getElementById('adventure-stars').textContent = count;
    document.getElementById('adventure-quest').textContent = profile.adventure.questComplete ? 'Pippin’s wish · complete ✓' : `Pippin’s wish · ${Math.min(count,6)} / 6`;
  }
  const unsubscribe = subscribeProfile(sync);
  const unsubscribeAccount = subscribeAccount(account => {
    const id = account.user?.uid || 'guest';
    if (accountId !== null && id !== accountId) { profile = getProfile(); player.x = profile.adventure.x; player.y = FLOOR - player.h; player.vy = 0; lastX = player.x; pause(); }
    accountId = id;
  });
  function save() {
    if (Math.abs(lastX - player.x) < 2) return;
    lastX = Math.round(player.x);
    updateProfile({ adventure: { ...getProfile().adventure, x: lastX } });
  }
  function pause() { paused = true; keys.clear(); save(); overlay.hidden = false; document.getElementById('adventure-play').textContent = 'Continue adventure →'; }
  function jump() { jumpUntil = performance.now() + 140; }
  function talk() {
    if (Math.abs(player.x - 1240) > 125) { say('Pippin is waiting by the big tree, near the middle of the meadow. Follow the platforms to the right.'); return; }
    if (profile.adventure.questComplete) { playEmote('heart'); say('Pippin: Thank you, Mini! The meadow is brighter with you here. The cloud gate is open.'); return; }
    if (completeAdventureQuest(Math.round(player.x))) { playEmote('cake'); say('Pippin: Six stars! Here is a cake for you. +50 points! The cloud gate is now open.'); }
    else say(`Pippin: Could you bring me six stars? You have ${popcount(profile.adventure.collected)} so far. Each star gives you 5 points!`);
  }
  document.getElementById('adventure-play').addEventListener('click', () => { paused = false; previous = performance.now(); overlay.hidden = true; canvas.focus({ preventScroll:true }); });
  document.getElementById('adventure-pause').addEventListener('click', pause);
  document.getElementById('adventure-jump').addEventListener('click', jump);
  document.getElementById('adventure-talk').addEventListener('click', talk);
  document.querySelectorAll('[data-adventure-hold]').forEach(button => {
    const key = button.dataset.adventureHold;
    button.addEventListener('click', () => { if (!paused && !getEmote() && !profile.activeActivity) { player.facing = key === 'right' ? 1 : -1; player.x = Math.max(36, Math.min(WORLD - player.w - 36, player.x + player.facing * 16)); } });
    button.addEventListener('pointerdown', event => { event.preventDefault(); button.setPointerCapture(event.pointerId); keys.add(key); });
    for (const type of ['pointerup','pointercancel','lostpointercapture']) button.addEventListener(type, () => keys.delete(key));
  });
  document.querySelectorAll('[data-adventure-emote]').forEach(button => button.addEventListener('click', () => { playEmote(button.dataset.adventureEmote); say(EMOTES[button.dataset.adventureEmote].message); }));
  canvas.addEventListener('keydown', event => {
    const key = event.key.toLowerCase();
    if (['arrowleft','arrowright','a','d',' ','arrowup','w','e','escape'].includes(key)) event.preventDefault();
    if (key === 'arrowleft' || key === 'a') keys.add('left');
    if (key === 'arrowright' || key === 'd') keys.add('right');
    if (!event.repeat && [' ','arrowup','w'].includes(key)) jump();
    if (!event.repeat && key === 'e') talk();
    if (key === 'escape') pause();
  });
  function release(event) { const key = event.key.toLowerCase(); if (key === 'arrowleft' || key === 'a') keys.delete('left'); if (key === 'arrowright' || key === 'd') keys.delete('right'); }
  window.addEventListener('keyup', release);
  window.addEventListener('blur', pause);
  document.addEventListener('visibilitychange', () => { if (document.hidden) pause(); });
  canvas.addEventListener('pointerdown', event => {
    canvas.focus({preventScroll:true});
    const rect = canvas.getBoundingClientRect(), x = (event.clientX - rect.left) * canvas.width / rect.width + camera, y = (event.clientY - rect.top) * 480 / rect.height;
    if (x >= player.x - 12 && x <= player.x + player.w + 12 && y >= player.y - 12 && y <= player.y + player.h) {
      if (profile.activeActivity) { say('Mini is finishing a little activity. Try an emote in a moment!'); return; }
      const choices = ['hello','cake','icecream','heart']; const kind = choices[Math.floor(Math.random() * choices.length)]; playEmote(kind); say(EMOTES[kind].message);
    } else if (Math.abs(x - 1240) < 65 && y > 290) talk();
  });
  const resize = new ResizeObserver(() => { const rect = canvas.getBoundingClientRect(); canvas.width = Math.max(1, Math.round(rect.width * 480 / Math.max(1,rect.height))); canvas.height = 480; }); resize.observe(canvas);
  function physics(dt, now) {
    const moving = !getEmote() && !profile.activeActivity;
    const direction = moving ? Number(keys.has('right')) - Number(keys.has('left')) : 0;
    if (direction) player.facing = direction;
    player.x = Math.max(36,Math.min(WORLD - player.w - 36, player.x + direction * 235 * dt));
    if (player.grounded) coyoteUntil = now + 100;
    if (jumpUntil > now && coyoteUntil > now && moving) { player.vy = -530; player.grounded = false; jumpUntil = 0; coyoteUntil = 0; }
    const before = player.y + player.h;
    player.vy += 1400 * dt; player.y += player.vy * dt; player.grounded = false;
    if (player.y + player.h >= FLOOR) { player.y = FLOOR - player.h; player.vy = 0; player.grounded = true; }
    if (player.vy >= 0) for (const p of platforms) {
      if (player.x + player.w - 8 > p.x && player.x + 8 < p.x + p.w && before <= p.y + 3 && player.y + player.h >= p.y) { player.y = p.y - player.h; player.vy = 0; player.grounded = true; break; }
    }
    source.dataset.controlledPose = !player.grounded ? 'jump' : direction ? 'walk' : 'idle';
    for (let i = 0; i < stars.length; i++) {
      if (profile.adventure.collected & (1 << i)) continue;
      const s = stars[i];
      if (Math.hypot(player.x + player.w / 2 - s.x, player.y + player.h / 2 - s.y) < 43 && collectAdventureStar(i, Math.round(player.x))) say(`Star collected! +5 points · ${popcount(getProfile().adventure.collected)} / 16`);
    }
    if (player.x > 3440 && profile.adventure.questComplete) { player.x = 90; player.y = FLOOR - player.h; player.vy = 0; playEmote('icecream'); say('A meadow adventure complete! Enjoy an ice cream. Your stars, points, and completed quest are saved.'); save(); }
    if (now - saveAt > 2000) { save(); saveAt = now; }
  }
  function rect(color,x,y,w,h) { ctx.fillStyle=color; ctx.fillRect(Math.round(x),Math.round(y),w,h); }
  function tree(x, y, scale=1) {
    ctx.save(); ctx.translate(Math.round(x-camera*.45),y); ctx.scale(scale,scale);
    rect('#95714f',-7,-62,14,66); rect('#6f9463',-50,-111,100,47); rect('#7faa71',-39,-141,78,44); rect('#97bc83',-23,-164,46,35); rect('#557951',-45,-78,37,12); ctx.restore();
  }
  function star(x,y) { ctx.fillStyle='#ffe5a1'; ctx.beginPath(); for(let n=0;n<10;n++){const angle=-Math.PI/2+n*Math.PI/5,r=n%2?5:11; const px=x+Math.cos(angle)*r,py=y+Math.sin(angle)*r; n?ctx.lineTo(px,py):ctx.moveTo(px,py);}ctx.closePath();ctx.fill();rect('#b98b4e',x-2,y-2,4,4); }
  function pippin(now) {
    const x=1240-camera,y=FLOOR;
    rect('#806044',x-14,y-40,28,34);rect('#fff0d3',x-19,y-67,38,32);rect('#fff0d3',x-17,y-76,11,15);rect('#fff0d3',x+6,y-76,11,15);
    rect('#eaa1ad',x-14,y-72,5,7);rect('#eaa1ad',x+9,y-72,5,7);rect('#584337',x-10,y-56,4,4);rect('#584337',x+6,y-56,4,4);rect('#cc8293',x-2,y-48,4,3);
    rect('#a4bc89',x-11,y-34,22,23);rect('#eabf80',x-16,y-7,12,5);rect('#eabf80',x+4,y-7,12,5);
    ctx.font='18px "Pixelify Sans", sans-serif';ctx.textAlign='center';ctx.fillStyle='#fff5dc';ctx.fillText('Pippin',x,y-89);
    if(Math.abs(player.x-1240)<125){rect('#fff7e7',x-95,y-133,190,29);ctx.fillStyle='#634d3a';ctx.font='14px "Nunito",sans-serif';ctx.fillText(profile.adventure.questComplete?'Thank you, Mini! ♡':'6 stars → a cake +50 points',x,y-114);}
  }
  function draw(now) {
    const night = profile.map==='night', forest=profile.map==='forest';
    if (backdrop.complete && backdrop.naturalWidth) {
      const tileWidth = backdrop.naturalWidth / backdrop.naturalHeight * 480;
      const offset = camera * .18 % tileWidth;
      ctx.imageSmoothingEnabled = false;
      for (let x=-offset; x<canvas.width; x+=tileWidth) ctx.drawImage(backdrop,Math.floor(x),0,Math.ceil(tileWidth),480);
      if (night) { ctx.fillStyle='#263653'; ctx.globalAlpha=.58; ctx.fillRect(0,0,canvas.width,480); ctx.globalAlpha=1; }
      if (forest) { ctx.fillStyle='#48735b'; ctx.globalAlpha=.15; ctx.fillRect(0,0,canvas.width,480); ctx.globalAlpha=1; }
    } else {
      rect(night?'#31455f':forest?'#cee6d9':'#d3eaf0',0,0,canvas.width,480);
      rect(night?'#77809f':'#edf0d4',0,235,canvas.width,173);
      rect(night?'#fff1bd':'#ffe6a4',canvas.width-83,47,30,30);
      for(let i=0;i<9;i++){const x=i*180-camera*.18;rect(night?'#8b96ac':'#fff9e8',x,99+(i%2)*45,64,14);rect(night?'#8b96ac':'#fff9e8',x+12,89+(i%2)*45,35,15);}
      for(let i=0;i<12;i++){const x=i*190-camera*.25;rect(night?'#5d7782':'#b9d1a2',x,285+(i%3)*24,190,130);rect(night?'#5d7782':'#b9d1a2',x+25,263+(i%3)*24,115,30);}
      for(let i=0;i<12;i++)tree(i*310+90,400,1+(i%3)*.15);
    }
    rect(night?'#6e856e':'#a5c585',0,FLOOR,canvas.width,72);rect(night?'#8baa80':'#bad79c',0,FLOOR,canvas.width,8);rect('#9a795b',0,FLOOR+13,canvas.width,59);
    for(let i=0;i<canvas.width/28;i++){rect('#b18b66',i*28-Math.floor(camera%28),FLOOR+21,16,5);rect('#c39c70',i*28+7-Math.floor(camera%28),FLOOR+44,13,5);}
    for(const p of platforms){rect('#987452',p.x-camera,p.y,p.w,15);rect('#bad69b',p.x-camera,p.y,p.w,6);rect('#718e61',p.x-camera,p.y+6,p.w,3);}
    for(let i=0;i<stars.length;i++)if(!(profile.adventure.collected&(1<<i)))star(stars[i].x-camera,stars[i].y+Math.sin(now/250+i)*3);
    for(let i=0;i<14;i++){const x=i*265+100-camera;rect('#72995f',x,FLOOR-8,2,8);rect(i%2?'#e6a4b2':'#ffdf91',x-3,FLOOR-12,8,5);}
    pippin(now);
    const gate=3485-camera;rect('#c9bc93',gate-24,FLOOR-108,12,108);rect('#c9bc93',gate+24,FLOOR-108,12,108);rect('#c9bc93',gate-24,FLOOR-108,60,12);
    rect(profile.adventure.questComplete?'#b7dce0':'#8ba48e',gate-11,FLOOR-88,34,88);
    ctx.font='15px "Pixelify Sans",sans-serif';ctx.fillStyle=night?'#fff4da':'#465b49';ctx.textAlign='center';ctx.fillText(profile.adventure.questComplete?'Cloud gate · open':'Finish Pippin’s wish',gate+6,FLOOR-119);
    const art=source.querySelector('canvas');ctx.imageSmoothingEnabled=false;
    ctx.save();ctx.translate(Math.round(player.x-camera+player.w/2),Math.round(player.y+player.h));ctx.scale(player.facing,1);
    if(source.dataset.rigReady==='true')ctx.drawImage(art,-player.w/2,-player.h,player.w,player.h);
    else {rect('#fff0d4',-14,-60,28,40);rect('#765340',-16,-74,32,25);}
    ctx.restore();
    const emote=getEmote(); if(emote){const text=EMOTES[emote.kind].icon+' '+(emote.kind==='hello'?'Hello!':emote.kind==='cake'?'For you!':emote.kind==='icecream'?'One scoop!':'♡');ctx.font='15px "Pixelify Sans",sans-serif';const x=player.x-camera+25,y=player.y-22;rect('#fff8e9',x-45,y-17,90,28);ctx.fillStyle='#73523f';ctx.fillText(text,x,y+2);}
    ctx.textAlign='left';ctx.font='16px "Pixelify Sans",sans-serif';ctx.fillStyle=night?'#fff0d4':'#53664a';ctx.fillText(forest?'Cloudwood trail':night?'Moonlit meadow':'Maple Meadow · star trail',18,25);
  }
  function tick(now) {
    if(!alive)return;
    const dt=Math.min(.033,Math.max(0,(now-previous)/1000));previous=now;
    if(!paused)physics(dt,now); else source.dataset.controlledPose='idle';
    const target=Math.max(0,Math.min(WORLD-canvas.width,player.x-canvas.width*.4));camera+=(target-camera)*Math.min(1,dt*9);draw(now);
    requestAnimationFrame(tick);
  }
  window.addEventListener('pagehide',()=>{save();alive=false;resize.disconnect();unsubscribe();unsubscribeAccount();window.removeEventListener('keyup',release);});
  requestAnimationFrame(tick);
}
