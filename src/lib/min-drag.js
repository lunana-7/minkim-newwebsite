// Viewport companion physics. Surfaces are real, visible page panels; no saved look is changed.
export function initMiniDrag({walker,trigger,menu,onChange}) {
 const track=walker.parentElement,rig=walker.querySelector('[data-min-appearance]');
 const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
 const reduced=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
 const surfaces='.page-sidebar,.page-main,.page-footer,.post-card,.home-hero,.game-screen,.wardrobe,.about-archive-invite,.language-path,.mini-room';
 let state='floor',pointer=null,suppressClick=false,frame=0,previous=0,velocity=0,elapsed=0,surface=null,ledge=0,side=1,facing=1;
 let grab={x:0,y:0},position={x:0,y:0},down={x:0,y:0};
 const canopy=document.createElement('span');canopy.className='mini-parachute';canopy.setAttribute('aria-hidden','true');
 canopy.innerHTML='<svg viewBox="0 0 96 100" shape-rendering="crispEdges"><path fill="#725776" d="M8 30h8v-8h8v-8h12V8h24v6h12v8h8v8h8v14H8z"/><path fill="#f0aabc" d="M12 30h8v-8h8v-6h12v-4h16v4h12v6h8v8h8v10H12z"/><path fill="#fff0ce" d="M40 12h16v8h8v20H32V20h8z"/><path fill="#b5cb9e" d="M20 30h8v10H12V30zm48 0h16v10H68z"/><path fill="none" stroke="#fff0ce" stroke-width="2" d="M12 40L40 90M32 40L44 90M64 40L52 90M84 40L56 90"/><path fill="#e6ac74" d="M40 87h16v4H40z"/></svg>';
 walker.append(canopy);
 const feet=()=>walker.offsetHeight*190/192;
 const floor=()=>Math.max(8,innerHeight-feet()-13);
 function place(x,y){position={x:clamp(x,4,Math.max(4,innerWidth-walker.offsetWidth-4)),y:clamp(y,4,Math.max(4,innerHeight-feet()-8))};walker.style.left=position.x+'px';walker.style.top=position.y+'px';walker.style.setProperty('--held-facing',String(facing));}
 function setState(next){state=next;elapsed=0;delete walker.dataset.canopy;walker.dataset.travel=next;walker.classList.toggle('is-held',next==='held');walker.classList.toggle('is-dropping',['climb','parachute'].includes(next));walker.classList.toggle('is-perched',next==='perched');track.classList.toggle('is-lifting',next!=='floor');rig.dataset.interactionPose=next==='floor'||next==='perched'?'':next;trigger.setAttribute('aria-label',next==='held'?'Mini is being held — release to put her down':next==='climb'?'Mini is climbing down':next==='parachute'?'Mini is floating down with her parachute':'Open Min’s activities — drag to pick her up');onChange();}
 function restore(){surface=null;setState('floor');delete rig.dataset.interactionPose;const width=Math.max(1,innerWidth-walker.offsetWidth-32),ratio=clamp((position.x-16)/width,0,1),phase=facing>0?ratio*.4999:1-ratio*.5;walker.style.animationDelay=`${-44*phase}s`;for(const name of ['left','top','--held-facing'])walker.style.removeProperty(name);if(document.activeElement===trigger)trigger.blur();}
 function candidates(){return [...document.querySelectorAll(surfaces)].filter(el=>!el.closest('dialog,[hidden]')).map(el=>{const r=el.getBoundingClientRect();let top=r.top;if(top<feet()+6&&el.matches('.page-sidebar')){const header=el.querySelector('.nav-header-mobile');if(header)top=header.getBoundingClientRect().bottom+8;}return {el,ledge:top-r.top,originalTop:r.top,rect:{left:r.left,right:r.right,top,width:r.width,height:r.height}};}).filter(({rect:r})=>r.width>walker.offsetWidth+28&&r.height>24&&r.top>=feet()+6&&r.top<innerHeight-15);}
 function landing(near=28){const x=position.x+walker.offsetWidth/2,y=position.y+feet();return candidates().filter(({rect:r,ledge,originalTop})=>x>=r.left+18&&x<=r.right-18&&(Math.abs(r.top-y)<=near||(ledge>0&&Math.abs(position.y+grab.y-originalTop)<=near))).sort((a,b)=>Math.abs(a.rect.top-y)-Math.abs(b.rect.top-y))[0];}
 function perch(target){surface=target.el;ledge=target.ledge||0;position.x=clamp(position.x,target.rect.left+16,target.rect.right-walker.offsetWidth-16);setState('perched');place(position.x,target.rect.top-feet());}
 function float(){velocity=0;setState('parachute');}
 function release(){if(pointer===null)return;const id=pointer;pointer=null;if(trigger.hasPointerCapture(id))trigger.releasePointerCapture(id);if(state!=='held')return;const target=landing(38);if(target)perch(target);else if(position.y>=floor()-3)restore();else float();}
 trigger.addEventListener('pointerdown',event=>{if(!event.isPrimary||event.button!==0)return;event.preventDefault();suppressClick=false;const r=walker.getBoundingClientRect();if(state==='floor'){facing=parseFloat(getComputedStyle(walker).getPropertyValue('--min-route-facing'))||1;}pointer=event.pointerId;down={x:event.clientX,y:event.clientY};grab={x:event.clientX-r.left,y:event.clientY-r.top};position={x:r.left,y:r.top};trigger.setPointerCapture(pointer);});
 trigger.addEventListener('pointermove',event=>{if(pointer!==event.pointerId)return;if(state!=='held'&&Math.hypot(event.clientX-down.x,event.clientY-down.y)<5)return;if(state!=='held'){suppressClick=true;menu.hidden=true;trigger.setAttribute('aria-expanded','false');walker.classList.remove('is-greeting');setState('held');}event.preventDefault();place(event.clientX-grab.x,event.clientY-grab.y);});
 for(const name of ['pointerup','pointercancel','lostpointercapture'])trigger.addEventListener(name,release);
 trigger.addEventListener('click',event=>{if(suppressClick){event.preventDefault();event.stopImmediatePropagation();suppressClick=false;}},true);
 trigger.addEventListener('dragstart',event=>event.preventDefault());
 window.addEventListener('keydown',event=>{if(event.key==='Escape'&&state==='held'){event.preventDefault();release();}});
 window.addEventListener('blur',release);
 function animate(now){const dt=Math.min(.04,(now-(previous||now))/1000);previous=now;
  if(!document.hidden&&pointer===null&&menu.hidden&&!document.querySelector('dialog[open],.mini-interaction-screen:not([hidden])')){
   if(state==='perched'){
    const box=surface?.getBoundingClientRect();const r=box?{left:box.left,right:box.right,top:box.top+ledge}:null;
    if(!surface?.isConnected||!r||r.top<feet()+4||r.top>innerHeight-12)float();
    else {const left=Math.max(4,r.left+16),right=Math.min(innerWidth-walker.offsetWidth-4,r.right-walker.offsetWidth-16);if(left>=right)float();else{
     const paused=walker.classList.contains('is-paused');
     place(clamp(position.x+(paused||reduced()?0:facing*38*dt),left,right),r.top-feet());
     if(!paused&&!reduced()&&(facing>0?position.x>=right-1:position.x<=left+1)){side=facing;setState('climb');}
    }}
   }else if(state==='climb'){
    elapsed+=dt;const r=surface?.getBoundingClientRect();if(!r||!surface.isConnected){float();}else{facing=-side;place(side>0?r.right-walker.offsetWidth*.35:r.left-walker.offsetWidth*.65,position.y+66*dt);if(elapsed>.85||position.y>=floor()-80){surface=null;float();}}
   }else if(state==='parachute'){
    elapsed+=dt;if(elapsed>.28)walker.dataset.canopy='open';velocity=Math.min(105,velocity+160*dt);const oldFeet=position.y+feet();place(position.x+Math.sin(elapsed*2.4)*12*dt,Math.min(floor(),position.y+velocity*dt));
    const x=position.x+walker.offsetWidth/2,newFeet=position.y+feet();
    const target=candidates().filter(({el,rect:r})=>el!==surface&&x>r.left+18&&x<r.right-18&&r.top>=oldFeet-1&&r.top<=newFeet+1).sort((a,b)=>a.rect.top-b.rect.top)[0];
    if(target)perch(target);else if(position.y>=floor()-1)restore();
   }
  }
  frame=requestAnimationFrame(animate);
 }
 frame=requestAnimationFrame(animate);window.addEventListener('pagehide',()=>cancelAnimationFrame(frame),{once:true});
 // Surface walks are free to pause for greetings, cakes, or an activity.
 return ()=>['held','climb','parachute'].includes(state);
}
