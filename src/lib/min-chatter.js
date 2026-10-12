import { getProfile,subscribeProfile } from './min-profile.js';
import { getEmote } from './min-emotes.js';

const greetings=["I’m glad you’re here! ♡","A little adventure is better with you.","You make this little world brighter.","Take your time. I’ll walk with you.","A tiny break? You’ve earned one.","There’s always something lovely to discover."];
const routeLines={
  '/game':["Let’s take the scenic route!","A pocketful of stars, and a friend to meet."],
  '/language':["One new word is a little win!","Let’s learn a little together."],
  '/wiki':["One little idea at a time.","Curiosity looks good on you!"],
  '/blog':["I’m happy you’re reading with me.","A cozy corner for a new idea."],
  '/projects':["Let’s explore what Min has made!"],
  '/about':["Welcome to my little corner of the world!"],
  '/support':["Thanks for visiting my coffee corner!"],
};

export function initMiniChatter({walker,menu,isLifted}) {
  const bubble=document.getElementById('min-ambient-speech'),toggle=document.getElementById('min-chatter-toggle');
  if(!bubble||!toggle)return;
  const storageKey='min-world-chatter';let enabled=true,timer,hideTimer,frame,alive=true,lastLine='',first=true;
  try{enabled=localStorage.getItem(storageKey)!=='off';}catch{}
  toggle.checked=enabled;
  function busy(){return document.hidden||Boolean(document.querySelector('dialog[open],.mini-interaction-screen:not([hidden])'))||!menu.hidden||isLifted()||Boolean(getProfile().activeActivity)||Boolean(getEmote())||document.getElementById('min-reward-bubble')?.classList.contains('is-visible')||Boolean(document.activeElement?.closest('input,textarea,select,[contenteditable="true"]'));}
  function hide(){bubble.hidden=true;walker.classList.remove('is-chatting');cancelAnimationFrame(frame);clearTimeout(hideTimer);}
  function position(){if(!alive||bubble.hidden)return;if(busy()){hide();return;}const rect=walker.getBoundingClientRect(),box=bubble.getBoundingClientRect(),left=Math.max(8,Math.min(innerWidth-box.width-8,rect.left+rect.width/2-box.width/2));bubble.style.left=`${left}px`;bubble.style.setProperty('--mini-speech-tail',`${Math.max(18,Math.min(box.width-24,rect.left+rect.width/2-left-5))}px`);bubble.style.top=`${Math.max(8,rect.top-box.height-8)}px`;frame=requestAnimationFrame(position);}
  function schedule(delay=35000+Math.random()*20000){clearTimeout(timer);if(alive&&enabled&&!document.hidden)timer=setTimeout(show,delay);}
  function show(){if(!alive||!enabled)return;if(busy()){schedule(8000);return;}const route=Object.keys(routeLines).find(path=>location.pathname===path||location.pathname.startsWith(path+'/'));const pool=[...greetings,...(routeLines[route]||[])].filter(line=>line!==lastLine);const line=first?greetings[0]:pool[Math.floor(Math.random()*pool.length)];first=false;lastLine=line;bubble.textContent=line;bubble.hidden=false;walker.classList.add('is-chatting');position();hideTimer=setTimeout(hide,5500);schedule();}
  toggle.addEventListener('change',()=>{enabled=toggle.checked;try{localStorage.setItem(storageKey,enabled?'on':'off');}catch{}hide();enabled?schedule(1200):clearTimeout(timer);});
  const onStorage=event=>{if(event.key!==storageKey)return;enabled=event.newValue!=='off';toggle.checked=enabled;hide();enabled?schedule(9000):clearTimeout(timer);};
  const visibility=()=>{if(document.hidden){hide();clearTimeout(timer);}else schedule(9000);};
  window.addEventListener('storage',onStorage);document.addEventListener('visibilitychange',visibility);
  const unsubscribe=subscribeProfile(()=>{if(busy())hide();});window.addEventListener('min-emote-change',hide);
  schedule(9000);
  window.addEventListener('pagehide',()=>{alive=false;hide();clearTimeout(timer);unsubscribe();window.removeEventListener('storage',onStorage);document.removeEventListener('visibilitychange',visibility);window.removeEventListener('min-emote-change',hide);});
  return {hide};
}
