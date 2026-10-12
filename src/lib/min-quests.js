import { getProfile, updateProfile, subscribeProfile } from './min-profile.js';
import { currentInteraction } from './min-interactions.js';

const starCount=mask=>mask.toString(2).replace(/0/g,'').length;

function questEntries(profile) {
  const stars=starCount(profile.adventure.collected);
  const served=profile.jobs.icecream.completed+profile.jobs.bakery.completed;
  return [
    {id:'pippin',kind:'Main quest',title:'Pippin’s wish',image:'/game-art/items/prop-star.png',progress:Math.min(stars,6),target:6,
      complete:profile.adventure.questComplete,
      next:profile.adventure.questComplete?'Pippin gave Mini the Star Keeper badge.':stars>=6?'Return to Pippin in Maple Meadow and press Enter to talk.':'Find glowing stars across the world, then visit Pippin in Maple Meadow.',
      reward:'Reward: 50 points and the Star Keeper badge.'},
    {id:'star-trail',kind:'World goal',title:'Star trail',image:'/game-art/items/prop-star.png',progress:Math.min(stars,16),target:16,
      complete:stars>=16,next:stars>=16?'Every hidden star has been found.':'Explore all seven worlds and collect the stars along each trail.',reward:'Exploration goal · stars award points when collected.'},
    {id:'gatherer',kind:'World goal',title:'A full gathering pouch',image:'/game-art/items/resource-herb.png',progress:Math.min(profile.gathering.collected,12),target:12,
      complete:profile.gathering.collected>=12,next:profile.gathering.collected>=12?'Mini has gathered plenty from the wild.':'Walk near a resource and press G. Try the meadow, forest, harbor, or desert.',reward:'Progress counts every resource gathered, including ones later sold.'},
    {id:'harvester',kind:'World goal',title:'First harvest',image:'/game-art/items/crop-carrot-harvest.png',progress:Math.min(profile.farm.harvested,6),target:6,
      complete:profile.farm.harvested>=6,next:profile.farm.harvested>=6?'Mini’s farm has grown its first big harvest.':'Plant seeds at Mini’s Farm, water the plots, and harvest ripe crops.',reward:'Progress counts crops harvested, including ones later sold.'},
    {id:'dessert-maker',kind:'World goal',title:'Sweet service',image:'/game-art/items/dessert-cake-strawberry.png',progress:Math.min(served,3),target:3,
      complete:served>=3,next:served>=3?'Three guests have enjoyed Mini’s desserts.':'Take orders at Cloud Scoop or Honeycrumb, make each treat, and serve it.',reward:'Each completed order pays coins and career XP; matching orders earn tips.'},
  ];
}

export function initQuestJournal() {
  const panel=document.getElementById('adventure-quests');
  if(!panel)return;
  const shell=panel.closest('.mini-adventure');
  const toggle=document.getElementById('adventure-quests-toggle');
  const close=document.getElementById('adventure-quests-close');
  const list=document.getElementById('adventure-quest-list');
  const count=document.getElementById('adventure-quest-count');
  const hud=document.getElementById('adventure-quest');

  function render(profile) {
    const quests=questEntries(profile),tracked=quests.find(item=>item.id===profile.trackedQuest)||quests[0];
    hud.textContent=tracked.complete?`${tracked.title} · complete ✓`:tracked.id==='pippin'&&tracked.progress===6?'Pippin’s wish · return to Pippin':`${tracked.title} · ${tracked.progress} / ${tracked.target}`;
    count.textContent=`${quests.filter(item=>item.complete).length} / ${quests.length} goals complete`;
    if(panel.hidden)return;
    list.replaceChildren();
    const ordered=[...quests].sort((a,b)=>Number(b.id===tracked.id)-Number(a.id===tracked.id)||Number(a.complete)-Number(b.complete));
    for(const quest of ordered) {
      const card=document.createElement('article');card.className='adventure-quest-card';card.classList.toggle('is-complete',quest.complete);
      const image=document.createElement('img');image.src=quest.image;image.alt='';
      const body=document.createElement('div');
      const overline=document.createElement('span');overline.className='game-kicker';overline.textContent=quest.kind;
      const title=document.createElement('h3');title.textContent=quest.title;
      const status=document.createElement('strong');status.className='adventure-quest-status';status.textContent=quest.complete?'Complete ✓':quest.id==='pippin'&&quest.progress===6?'Ready to turn in':`${quest.progress} / ${quest.target}`;
      const progress=document.createElement('div');progress.className='adventure-quest-progress';progress.setAttribute('role','progressbar');progress.setAttribute('aria-label',quest.title);progress.setAttribute('aria-valuemin','0');progress.setAttribute('aria-valuemax',String(quest.target));progress.setAttribute('aria-valuenow',String(quest.progress));
      const fill=document.createElement('span');fill.style.width=`${quest.progress/quest.target*100}%`;progress.append(fill);
      const next=document.createElement('p');next.textContent=quest.next;
      const reward=document.createElement('small');reward.textContent=quest.reward;
      const track=document.createElement('button');track.type='button';track.dataset.trackQuest=quest.id;track.setAttribute('aria-pressed',String(quest.id===tracked.id));track.textContent=quest.id===tracked.id?'Tracking ✓':'Track quest';
      track.addEventListener('click',()=>{updateProfile({trackedQuest:quest.id});list.querySelector(`[data-track-quest="${quest.id}"]`)?.focus({preventScroll:true});});
      body.append(overline,title,status,progress,next,reward,track);card.append(image,body);list.append(card);
    }
  }
  function setOpen(open) {
    if(open&&currentInteraction())return;
    panel.hidden=!open;
    shell.dataset.questsOpen=String(open);
    toggle.setAttribute('aria-expanded',String(open));
    window.dispatchEvent(new CustomEvent('min-quests-toggle',{detail:{open}}));
    if(open){render(getProfile());close.focus({preventScroll:true});}
    else document.getElementById('adventure-canvas')?.focus({preventScroll:true});
  }
  toggle.addEventListener('click',()=>setOpen(panel.hidden));
  close.addEventListener('click',()=>setOpen(false));
  window.addEventListener('min-inventory-toggle',event=>{if(event.detail.open&&!panel.hidden)setOpen(false);});
  window.addEventListener('min-interaction-open',()=>{if(!panel.hidden)setOpen(false);});
  window.addEventListener('keydown',event=>{
    if(event.defaultPrevented||event.repeat||event.ctrlKey||event.metaKey||event.altKey||event.target instanceof Element&&event.target.closest('input,textarea,select,[contenteditable="true"]'))return;
    const key=event.key.toLowerCase();
    if(key==='q'||key==='escape'&&!panel.hidden){event.preventDefault();event.stopImmediatePropagation();setOpen(key==='q'?panel.hidden:false);}
  },{capture:true});
  subscribeProfile(render);
}
