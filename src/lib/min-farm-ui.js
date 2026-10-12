import { getProfile, subscribeProfile } from './min-profile.js';
import { CROPS,cropReadyAt,plantCrop,waterCrop,harvestCrop,buySeed,sellProduce } from './min-farming.js';
export function initFarming() {
 const farm=document.getElementById('mini-farm-panel'),market=document.getElementById('mini-market-panel');if(!farm)return;
 function selected(){return document.querySelector('input[name="farm-seed"]:checked')?.value || 'carrot';}
 function render(){const p=getProfile(),f=p.farm;farm.hidden=p.map!=='farm';market.hidden=p.map!=='market';
 document.querySelectorAll('[data-farm-coins]').forEach(e=>e.textContent=f.coins.toLocaleString());document.querySelectorAll('[data-farm-harvested]').forEach(e=>e.textContent=f.harvested);document.querySelectorAll('[data-farm-sold]').forEach(e=>e.textContent=f.sold);
 document.querySelectorAll('[data-farm-seeds]').forEach(e=>e.textContent=f.seeds[e.dataset.farmSeeds]);document.querySelectorAll('[data-farm-produce]').forEach(e=>e.textContent=f.produce[e.dataset.farmProduce]);
 document.querySelectorAll('[data-market-sell]').forEach(e=>e.disabled=!f.produce[e.dataset.marketSell]);document.querySelectorAll('[data-market-buy]').forEach(e=>e.disabled=f.coins<CROPS[e.dataset.marketBuy].seedPrice);
 document.querySelectorAll('[data-farm-plot]').forEach(button=>{const index=Number(button.dataset.farmPlot),plot=f.plots[index],ready=plot&&Date.now()>=cropReadyAt(plot);button.classList.toggle('is-ready',Boolean(ready));button.classList.toggle('is-watered',Boolean(plot?.watered));
 const status=button.querySelector('.farm-plot-state'),art=button.querySelector('.farm-crop-art');
 if(!plot){status.textContent='Empty · plant a seed';art.replaceChildren();button.setAttribute('aria-label',`Plot ${index+1}, empty. Plant ${CROPS[selected()].name}.`);return;}
 const name=CROPS[plot.crop].name,seconds=Math.max(0,Math.ceil((cropReadyAt(plot)-Date.now())/1000));status.textContent=ready?`${name} ready · harvest`:`${name} · ${seconds}s ${plot.watered?'· watered':'· click to water'}`;button.setAttribute('aria-label',`Plot ${index+1}, ${status.textContent}`);
 const ns='http://www.w3.org/2000/svg';art.replaceChildren();for(const x of [17,31,45]){const leaf=document.createElementNS(ns,'path');leaf.setAttribute('fill','#6c985c');leaf.setAttribute('d',`M${x-3} 28h6v-10h-3v3h-4v3h1z`);art.append(leaf);if(ready){const fruit=document.createElementNS(ns,'rect');fruit.setAttribute('x',x-4);fruit.setAttribute('y',plot.crop==='wheat'?12:25);fruit.setAttribute('width','8');fruit.setAttribute('height',plot.crop==='carrot'?'12':'7');fruit.setAttribute('fill',CROPS[plot.crop].color);art.append(fruit);}}
 });}
 function plotAction(index){const plot=getProfile().farm.plots[index];const text=!plot?plantCrop(index,selected()):Date.now()>=cropReadyAt(plot)?harvestCrop(index):waterCrop(index);document.getElementById('farm-message').textContent=text;render();}
 document.querySelectorAll('[data-farm-plot]').forEach(button=>button.addEventListener('click',()=>plotAction(Number(button.dataset.farmPlot))));document.querySelectorAll('input[name="farm-seed"]').forEach(input=>input.addEventListener('change',render));
 document.querySelectorAll('[data-market-buy]').forEach(b=>b.addEventListener('click',()=>document.getElementById('market-message').textContent=buySeed(b.dataset.marketBuy)));document.querySelectorAll('[data-market-sell]').forEach(b=>b.addEventListener('click',()=>document.getElementById('market-message').textContent=sellProduce(b.dataset.marketSell)));
 document.querySelectorAll('[data-world-go]').forEach(button=>button.addEventListener('click',()=>window.dispatchEvent(new CustomEvent('min-world-travel',{detail:button.dataset.worldGo}))));
 window.addEventListener('min-farm-open',()=>{render();const title=document.getElementById(getProfile().map==='farm'?'farm-title':'market-title');title.focus({preventScroll:true});title.closest('section').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});});
 window.addEventListener('min-farm-plot',event=>plotAction(event.detail));
 const unsub=subscribeProfile(render),timer=setInterval(render,1000);window.addEventListener('pagehide',()=>{clearInterval(timer);unsub();});
}
