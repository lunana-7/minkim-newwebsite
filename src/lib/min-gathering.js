import { getProfile, updateProfile, subscribeProfile } from './min-profile.js';
import { RESOURCES,GATHER_NODES,nodeReadyAt } from './min-resource-data.js';
export function gatherNode(id) {
 const p=getProfile(),node=GATHER_NODES.find(n=>n.id===id);if(!node||node.world!==p.map)return null;
 if(Date.now()<nodeReadyAt(node,p.gathering))return null;
 const item=RESOURCES[node.resource],g=p.gathering;
 updateProfile({points:p.points+1,gathering:{...g,collected:g.collected+item.amount,inventory:{...g.inventory,[node.resource]:g.inventory[node.resource]+item.amount},cooldowns:{...g.cooldowns,[id]:Date.now()}}});return {name:item.name,amount:item.amount};
}
export function sellGathered(id) {
 const p=getProfile(),item=RESOURCES[id];if(!item||p.map!=='market')return '';
 const amount=p.gathering.inventory[id];if(!amount)return 'Gather this resource before selling it.';
 const earned=amount*item.price;
 updateProfile({farm:{...p.farm,coins:p.farm.coins+earned},gathering:{...p.gathering,inventory:{...p.gathering.inventory,[id]:0}}});return `Sold ${amount} ${item.name.toLowerCase()} for ${earned} farm coins!`;
}
export function initGatheringPouch(){
 const unsub=subscribeProfile(p=>{document.querySelectorAll('[data-gather-count]').forEach(e=>e.textContent=p.gathering.inventory[e.dataset.gatherCount]);document.querySelectorAll('[data-gather-sell]').forEach(b=>b.disabled=!p.gathering.inventory[b.dataset.gatherSell]);document.querySelectorAll('[data-gather-total]').forEach(e=>e.textContent=p.gathering.collected);});
 document.querySelectorAll('[data-gather-sell]').forEach(button=>button.addEventListener('click',()=>{document.getElementById('market-message').textContent=sellGathered(button.dataset.gatherSell);}));
 window.addEventListener('pagehide',unsub);
}
