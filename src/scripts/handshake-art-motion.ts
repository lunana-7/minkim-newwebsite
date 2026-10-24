const artPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
const motionButton = document.querySelector<HTMLButtonElement>('.motion-toggle');
let manuallyPaused = false;
const panelAnimations = new Set<Animation>();
function syncMotion() {
 document.body.classList.toggle('motion-paused', manuallyPaused || document.hidden || artPreference.matches);
 motionButton?.setAttribute('aria-pressed',String(manuallyPaused));
 motionButton?.setAttribute('aria-label',manuallyPaused?'Resume decorative animations':'Pause decorative animations');
 if(motionButton)motionButton.innerHTML=manuallyPaused?'▶ <span>Resume motion</span>':'Ⅱ <span>Pause motion</span>';
 if(manuallyPaused || artPreference.matches)panelAnimations.forEach(a=>a.cancel());
}
motionButton?.addEventListener('click',()=>{manuallyPaused=!manuallyPaused;syncMotion();});
document.addEventListener('visibilitychange',syncMotion);artPreference.addEventListener('change',syncMotion);
const artObserver = new IntersectionObserver(entries=>entries.forEach(entry=>entry.target.classList.toggle('art-in-view',entry.isIntersecting)),{rootMargin:'40px'});
document.querySelectorAll('[data-art-motion]').forEach(art=>artObserver.observe(art));
// Animate newly selected content without changing its layout or visibility logic.
const panelObserver = new MutationObserver(records=>{
 if(manuallyPaused || artPreference.matches || document.hidden)return;
 records.forEach(record=>{const target=record.target as HTMLElement;if(target.hidden || target.getAttribute('aria-hidden')==='true')return;
 const animation=target.animate([{opacity:.35,transform:'translateY(12px)'},{opacity:1,transform:'translateY(0)'}],{duration:360,easing:'cubic-bezier(.2,.75,.2,1)'});
 panelAnimations.add(animation);animation.finished.then(()=>panelAnimations.delete(animation),()=>panelAnimations.delete(animation));
 });
});
document.querySelectorAll('.stakeholder-detail,.ops-stage,.ops-case,.business-stage-detail,.pipeline-panel').forEach(panel=>panelObserver.observe(panel,{attributes:true,attributeFilter:['hidden']}));
syncMotion();

// Pointer depth is scoped to decorative artwork; copy and diagrams stay still.
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
document.querySelectorAll<HTMLElement>('[data-art-motion]').forEach(art=>{
 const surface=art.closest<HTMLElement>('.hero,.personal-note,.art-interlude');
 if(!surface)return;
 let pending=0,mouseX=0,mouseY=0;
 function resetDepth(){
  cancelAnimationFrame(pending);pending=0;
  ['--art-x','--art-y','--art-rx','--art-ry'].forEach(key=>art.style.removeProperty(key));
 }
 surface.addEventListener('pointermove',event=>{
  if(!finePointer.matches||manuallyPaused||artPreference.matches||document.hidden||!art.classList.contains('art-in-view'))return;
  mouseX=event.clientX;mouseY=event.clientY;
  if(pending)return;
  pending=requestAnimationFrame(()=>{
   pending=0;
   if(manuallyPaused||artPreference.matches||document.hidden)return;
   const bounds=surface.getBoundingClientRect();
   const x=Math.max(-1,Math.min(1,(mouseX-bounds.left)/bounds.width*2-1));
   const y=Math.max(-1,Math.min(1,(mouseY-bounds.top)/bounds.height*2-1));
   art.style.setProperty('--art-x',`${x*9}px`);art.style.setProperty('--art-y',`${y*7}px`);
   art.style.setProperty('--art-rx',`${-y*5}deg`);art.style.setProperty('--art-ry',`${x*7}deg`);
  });
 },{passive:true});
 surface.addEventListener('pointerleave',resetDepth);
 motionButton?.addEventListener('click',resetDepth);artPreference.addEventListener('change',resetDepth);
});
