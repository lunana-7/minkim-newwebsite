import { openInteraction } from './min-interactions.js';
import { getProfile, subscribeProfile } from './min-profile.js';
import { CROPS,cropReadyAt,plantCrop,waterCrop,harvestCrop,buySeed,sellProduce } from './min-farming.js';
import { itemPath,cropStage } from './min-world-assets.js';
export function initFarming() {
 const farm=document.getElementById('mini-farm-panel'),market=document.getElementById('mini-market-panel');if(!farm)return;
 function selected(){return document.querySelector('input[name="farm-seed"]:checked')?.value || 'carrot';}
 function render(){const p=getProfile(),f=p.farm;
 document.querySelectorAll('[data-farm-coins]').forEach(e=>e.textContent=f.coins.toLocaleString());document.querySelectorAll('[data-farm-harvested]').forEach(e=>e.textContent=f.harvested);document.querySelectorAll('[data-farm-sold]').forEach(e=>e.textContent=f.sold);
 document.querySelectorAll('[data-farm-seeds]').forEach(e=>e.textContent=f.seeds[e.dataset.farmSeeds]);document.querySelectorAll('[data-farm-produce]').forEach(e=>e.textContent=f.produce[e.dataset.farmProduce]);
 document.querySelectorAll('[data-market-sell]').forEach(e=>e.disabled=!f.produce[e.dataset.marketSell]);document.querySelectorAll('[data-market-buy]').forEach(e=>e.disabled=f.coins<CROPS[e.dataset.marketBuy].seedPrice);
 document.querySelectorAll('[data-farm-plot]').forEach(button=>{const index=Number(button.dataset.farmPlot),plot=f.plots[index],ready=plot&&Date.now()>=cropReadyAt(plot);button.classList.toggle('is-ready',Boolean(ready));button.classList.toggle('is-watered',Boolean(plot?.watered));
 const status=button.querySelector('.farm-plot-state'),art=button.querySelector('.farm-crop-art');
 if(!plot){status.textContent='Empty · plant a seed';art.hidden=true;art.removeAttribute('src');button.setAttribute('aria-label',`Plot ${index+1}, empty. Plant ${CROPS[selected()].name}.`);return;}
 const name=CROPS[plot.crop].name,seconds=Math.max(0,Math.ceil((cropReadyAt(plot)-Date.now())/1000));status.textContent=ready?`${name} ready · harvest`:`${name} · ${seconds}s ${plot.watered?'· watered':'· click to water'}`;button.setAttribute('aria-label',`Plot ${index+1}, ${status.textContent}`);
 art.hidden=false;art.src=itemPath(`crop-${plot.crop}-${cropStage(plot,cropReadyAt(plot))}`);
 });}
 function plotAction(index){const plot=getProfile().farm.plots[index];const text=!plot?plantCrop(index,selected()):Date.now()>=cropReadyAt(plot)?harvestCrop(index):waterCrop(index);document.getElementById('farm-message').textContent=text;render();}
 document.querySelectorAll('[data-farm-plot]').forEach(button=>button.addEventListener('click',()=>plotAction(Number(button.dataset.farmPlot))));document.querySelectorAll('input[name="farm-seed"]').forEach(input=>input.addEventListener('change',render));
 document.querySelectorAll('[data-market-buy]').forEach(b=>b.addEventListener('click',()=>document.getElementById('market-message').textContent=buySeed(b.dataset.marketBuy)));document.querySelectorAll('[data-market-sell]').forEach(b=>b.addEventListener('click',()=>document.getElementById('market-message').textContent=sellProduce(b.dataset.marketSell)));
 document.querySelectorAll('#mini-farm-panel [data-world-go],#mini-market-panel [data-world-go]').forEach(button=>button.addEventListener('click',()=>{window.dispatchEvent(new CustomEvent('min-world-travel',{detail:button.dataset.worldGo}));openInteraction(button.dataset.worldGo);}));
 window.addEventListener('min-farm-open',()=>{render();openInteraction(getProfile().map==='market'?'market':'farm');});
 document.querySelectorAll('[data-farm-visit]').forEach(button=>button.addEventListener('click',()=>{const id=button.dataset.farmVisit;if(getProfile().map!==id)window.dispatchEvent(new CustomEvent('min-world-travel',{detail:id}));openInteraction(id);}));
 window.addEventListener('min-farm-plot',event=>{render();openInteraction('farm');document.querySelector(`[data-farm-plot="${event.detail}"]`)?.focus({preventScroll:true});});
 const unsub=subscribeProfile(render),timer=setInterval(render,1000);window.addEventListener('pagehide',()=>{clearInterval(timer);unsub();});
}
