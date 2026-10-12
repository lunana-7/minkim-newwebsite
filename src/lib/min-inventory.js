import { getProfile, subscribeProfile } from './min-profile.js';
import { RESOURCES } from './min-resource-data.js';
import { CROPS } from './min-farming.js';
import { currentInteraction } from './min-interactions.js';
import { FRIENDS, affectionFor, callFriend } from './min-friendship.js';

const resourceNotes = {
  herb: ['A fragrant meadow find.', 'Sell at Berry Market.', 'Not a meal in this game.'],
  wood: ['Wood for the market stall.', 'Sell at Berry Market.', 'No.'],
  acorn: ['A little forest keepsake.', 'Sell at Berry Market.', 'Not prepared as food in this game.'],
  shell: ['A treasure from the shore.', 'Sell at Berry Market.', 'No.'],
  fish: ['A fresh harbor catch.', 'Sell at Berry Market.', 'Only after cooking; cooking is not available yet.'],
  mushroom: ['A glowing forest mushroom.', 'Sell at Berry Market.', 'No. Do not eat an unidentified mushroom.'],
  crystal: ['A bright forest crystal.', 'Sell at Berry Market.', 'No.'],
  ore: ['Stone gathered in the desert.', 'Sell at Berry Market.', 'No.'],
  cactus: ['Fruit from a desert cactus.', 'Sell at Berry Market.', 'Yes as food, but eating is not available yet.'],
};
const produceNotes = {
  carrot: 'Yes as food, but eating is not available yet.',
  wheat: 'Only after preparing it; cooking is not available yet.',
  strawberry: 'Yes as food, but eating is not available yet.',
};

function entries(profile) {
  const gathered = Object.entries(RESOURCES).map(([id, item]) => ({
    key:`resource-${id}`, name:item.name, count:profile.gathering.inventory[id] || 0,
    image:`/game-art/items/resource-${id}.png`, group:'Gathered',
    description:resourceNotes[id][0], use:`${resourceNotes[id][1]} ${item.price} farm coins each.`, edible:resourceNotes[id][2],
  }));
  const crops = Object.entries(CROPS).map(([id, item]) => ({
    key:`produce-${id}`, name:item.name, count:profile.farm.produce[id] || 0,
    image:`/game-art/items/crop-${id}-harvest.png`, group:'Harvest',
    description:`Harvested at Mini’s Farm.`, use:`Sell at Berry Market for ${item.sellPrice} farm coins each.`, edible:produceNotes[id],
  }));
  const seeds = Object.entries(CROPS).map(([id, item]) => ({
    key:`seed-${id}`, name:`${item.name} seed`, count:profile.farm.seeds[id] || 0,
    image:'/game-art/items/prop-seed.png', group:'Seeds',
    description:`Grows into ${item.name.toLowerCase()} at Mini’s Farm.`, use:'Plant in an empty farm plot.', edible:'No. Plant this seed.',
  }));
  return [...gathered, ...crops, ...seeds];
}

export function initInventory() {
  const panel=document.getElementById('adventure-inventory');
  if (!panel) return;
  const shell=panel.closest('.mini-adventure');
  const toggle=document.getElementById('adventure-inventory-toggle');
  const close=document.getElementById('adventure-inventory-close');
  const grid=document.getElementById('adventure-inventory-items');
  const detail=document.getElementById('adventure-inventory-detail');
  const count=document.getElementById('adventure-inventory-count');
  const coins=document.getElementById('adventure-inventory-coins');
  const friends=document.getElementById('adventure-friends');
  const itemBody=document.getElementById('adventure-inventory-body');
  const itemsTab=document.getElementById('adventure-items-tab');
  const friendsTab=document.getElementById('adventure-friends-tab');
  let selected='',page='items';

  function setPage(next) {
    page=next;itemBody.hidden=next!=='items';friends.hidden=next!=='friends';
    itemsTab.setAttribute('aria-selected',String(next==='items'));
    friendsTab.setAttribute('aria-selected',String(next==='friends'));
    if(next==='friends')renderFriends();
    else count.textContent=`${entries(getProfile()).reduce((sum,item)=>sum+item.count,0)} items in your bag`;
  }
  itemsTab.addEventListener('click',()=>setPage('items'));
  friendsTab.addEventListener('click',()=>setPage('friends'));

  function renderFriends(profile=getProfile()) {
    friends.replaceChildren();
    count.textContent=`${FRIENDS.filter(npc=>affectionFor(profile,npc.id)>=10).length} friends can join your adventure`;
    const intro=document.createElement('p');intro.className='adventure-friends-intro';intro.textContent='Give a resident one gathered or harvested item while talking. Friends with 10 hearts can join you anywhere.';friends.append(intro);
    const list=document.createElement('div');list.className='adventure-friends-grid';
    for(const npc of FRIENDS){
      const affection=affectionFor(profile,npc.id),following=profile.friendship.companion===npc.id;
      const card=document.createElement('article');card.className='adventure-friend-card';if(following)card.classList.add('is-following');
      const portrait=document.createElement('img');portrait.src=`/mini/npcs/${npc.id}.webp`;portrait.alt='';portrait.loading='lazy';
      const info=document.createElement('div');info.className='adventure-friend-info';
      const name=document.createElement('h3');name.textContent=npc.name;
      const role=document.createElement('small');role.textContent=`${npc.role} · ${npc.worldName}`;
      const hearts=document.createElement('span');hearts.className='adventure-friend-hearts';hearts.textContent=`♡ ${affection} / 100`;
      const meter=document.createElement('div');meter.className='adventure-friend-meter';meter.setAttribute('role','progressbar');meter.setAttribute('aria-label',`${npc.name} friendship`);meter.setAttribute('aria-valuenow',String(affection));meter.setAttribute('aria-valuemin','0');meter.setAttribute('aria-valuemax','100');const fill=document.createElement('span');fill.style.width=`${affection}%`;meter.append(fill);
      const action=document.createElement('button');action.type='button';action.textContent=following?'Send home':affection>=10?'Call to walk':'Meet & give a gift';
      if(affection>=10){action.addEventListener('click',()=>{callFriend(following?null:npc.id);setOpen(false);window.dispatchEvent(new CustomEvent('min-friend-called',{detail:{id:following?null:npc.id}}));});}
      else {action.disabled=true;action.title='Talk to this resident in their world and give a gift first.';}
      info.append(name,role,hearts,meter,action);card.append(portrait,info);list.append(card);
    }
    friends.append(list);
  }

  function show(item) {
    selected=item.key;
    grid.querySelectorAll('[data-inventory-item]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.inventoryItem===selected)));
    detail.replaceChildren();
    const image=document.createElement('img'); image.src=item.image; image.alt='';
    const tag=document.createElement('span'); tag.className='game-kicker'; tag.textContent=item.group;
    const title=document.createElement('h3'); title.textContent=item.name;
    const owned=document.createElement('p'); owned.className='inventory-owned'; owned.textContent=`In your bag: ${item.count}`;
    const description=document.createElement('p'); description.textContent=item.description;
    const use=document.createElement('p'); use.textContent=`Use: ${item.use}`;
    const edible=document.createElement('p'); edible.textContent=`Can Mini eat it? ${item.edible}`;
    detail.append(image,tag,title,owned,description,use,edible);
  }

  function render(profile=getProfile()) {
    const items=entries(profile);
    grid.replaceChildren();
    for(const group of ['Gathered','Harvest','Seeds']) {
      const section=document.createElement('section');
      const heading=document.createElement('h3'); heading.textContent=group;
      const list=document.createElement('div'); list.className='adventure-inventory-grid';
      for(const item of items.filter(entry=>entry.group===group).sort((a,b)=>Number(b.count>0)-Number(a.count>0))) {
        const button=document.createElement('button'); button.type='button'; button.dataset.inventoryItem=item.key;
        button.className='adventure-inventory-item'; button.classList.toggle('is-empty',item.count===0);
        button.setAttribute('aria-label',`${item.name}, ${item.count} in bag`);
        const image=document.createElement('img'); image.src=item.image; image.alt='';
        const quantity=document.createElement('strong'); quantity.textContent=String(item.count);
        button.append(image,quantity);
        button.addEventListener('pointerenter',()=>show(item));
        button.addEventListener('focus',()=>show(item));
        button.addEventListener('click',()=>show(item));
        list.append(button);
      }
      section.append(heading,list); grid.append(section);
    }
    count.textContent=`${items.reduce((sum,item)=>sum+item.count,0)} items in your bag`;
    coins.textContent=Number(profile.farm.coins || 0).toLocaleString('en-US');
    show(items.find(item=>item.key===selected) || items.find(item=>item.count>0) || items[0]);
    if(page==='friends')renderFriends(profile);
  }

  function setOpen(open) {
    if(open && currentInteraction()) return;
    panel.hidden=!open;
    shell.dataset.inventoryOpen=String(open);
    toggle.setAttribute('aria-expanded',String(open));
    window.dispatchEvent(new CustomEvent('min-inventory-toggle',{detail:{open}}));
    if(open){render();close.focus({preventScroll:true});}
    else document.getElementById('adventure-canvas')?.focus({preventScroll:true});
  }
  toggle.addEventListener('click',()=>setOpen(panel.hidden));
  close.addEventListener('click',()=>setOpen(false));
  window.addEventListener('min-interaction-open',()=>{if(!panel.hidden)setOpen(false);});
  window.addEventListener('min-quests-toggle',event=>{if(event.detail.open&&!panel.hidden)setOpen(false);});
  window.addEventListener('keydown',event=>{
    if(event.defaultPrevented||event.repeat||event.ctrlKey||event.metaKey||event.altKey||event.target instanceof Element&&event.target.closest('input,textarea,select,[contenteditable="true"]'))return;
    const key=event.key.toLowerCase();
    if(key==='i' || key==='escape'&&!panel.hidden){event.preventDefault();event.stopImmediatePropagation();setOpen(key==='i'?panel.hidden:false);}
  },{capture:true});
  subscribeProfile(profile=>{if(!panel.hidden)render(profile);});
  render();
}
