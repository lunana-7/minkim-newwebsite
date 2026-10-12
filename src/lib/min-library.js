import { LIBRARY_BOOKS } from './min-library-data.js';
import { getProfile, updateProfile, subscribeProfile } from './min-profile.js';
const dialogues={
  sage:['Welcome in. This shelf starts with the NIST AI Risk Management Framework.','Try reading Govern, Map, Measure, and Manage as a cycle. For agents, ask who may approve an action and who can stop it.','If you prefer security examples, the OWASP guide focuses on agentic applications.'],
  moss:['I am comparing the AI RMF with the Generative AI Profile.','A policy is easier to use when it names an owner, an evidence trail, and a review date.'],
  fern:['I wander between the shelves looking for practical safeguards.','For every agent tool, I ask: what can it access, who granted that access, and what happens when it fails?']
};
export function initLibrary(){
  const root=document.getElementById('mini-library');if(!root||root.dataset.ready)return;root.dataset.ready='true';
  let filter='all',currentBook=null,dialogue=null,page=0;
  const reader=root.querySelector('#library-reader'),frame=root.querySelector('#library-pdf-frame');
  function item(id){return getProfile().library?.books?.[id]||{status:'to-read',favorite:false};}
  function change(id,patch){const profile=getProfile(),books=profile.library?.books||{};updateProfile({library:{books:{...books,[id]:{...item(id),...patch}}}});}
  function render(){
    const books=LIBRARY_BOOKS.map(book=>({book,state:item(book.id)}));
    root.querySelector('#library-counts').textContent=`${books.filter(({state})=>state.status==='read').length} read · ${books.filter(({state})=>state.status==='reading').length} reading · ${books.filter(({state})=>state.favorite).length} favorites`;
    for(const {book,state} of books){const card=root.querySelector(`[data-library-book="${book.id}"]`);card.hidden=filter!=='all'&&!(filter==='favorite'?state.favorite:state.status===filter);const favorite=card.querySelector('[data-library-favorite]');favorite.textContent=state.favorite?'♥':'♡';favorite.setAttribute('aria-pressed',String(state.favorite));favorite.setAttribute('aria-label',`${state.favorite?'Remove':'Add'} ${book.title} ${state.favorite?'from':'to'} favorites`);card.querySelector('[data-library-status]').value=state.status;}
  }
  subscribeProfile(render);
  root.querySelectorAll('[data-library-filter]').forEach(button=>button.addEventListener('click',()=>{filter=button.dataset.libraryFilter;root.querySelectorAll('[data-library-filter]').forEach(other=>other.setAttribute('aria-pressed',String(other===button)));render();}));
  root.querySelectorAll('[data-library-favorite]').forEach(button=>button.addEventListener('click',()=>change(button.dataset.libraryFavorite,{favorite:!item(button.dataset.libraryFavorite).favorite})));
  root.querySelectorAll('[data-library-status]').forEach(select=>select.addEventListener('change',()=>change(select.dataset.libraryStatus,{status:select.value})));
  function closeBook(){reader.hidden=true;root.classList.remove('is-reading');frame.removeAttribute('src');currentBook=null;}
  root.querySelector('#library-reader-close').addEventListener('click',closeBook);
  root.querySelector('#library-reader-finish').addEventListener('click',()=>{if(currentBook)change(currentBook.id,{status:'read'});closeBook();});
  root.querySelectorAll('[data-library-open]').forEach(button=>button.addEventListener('click',()=>{
    const book=LIBRARY_BOOKS.find(entry=>entry.id===button.dataset.libraryOpen);if(!book)return;
    if(!book.pdf){change(book.id,{status:'reading'});window.open(book.source,'_blank','noopener,noreferrer');return;}
    currentBook=book;change(book.id,{status:'reading'});reader.querySelector('#library-reader-title').textContent=book.title;reader.querySelector('#library-reader-prompt').textContent=book.prompt;
    const source=reader.querySelector('#library-reader-source'),download=reader.querySelector('#library-reader-download');source.href=book.source;download.href=book.pdf;download.hidden=false;frame.src=`${book.pdf}#toolbar=1&view=FitH`;reader.hidden=false;root.classList.add('is-reading');root.scrollIntoView({block:'nearest'});reader.querySelector('#library-reader-close').focus({preventScroll:true});
  }));
  const box=root.querySelector('#library-npc-dialog');
  function showPage(){box.querySelector('#library-npc-line').textContent=dialogue[page];box.querySelector('#library-npc-next').textContent=page<dialogue.length-1?'Next →':'Thanks ♡';}
  root.querySelectorAll('[data-library-npc]').forEach(button=>button.addEventListener('click',()=>{const name=button.dataset.libraryNpc;dialogue=dialogues[name];page=0;box.querySelector('#library-npc-name').textContent=name[0].toUpperCase()+name.slice(1);box.hidden=false;showPage();box.querySelector('#library-npc-next').focus({preventScroll:true});}));
  box.querySelector('#library-npc-next').addEventListener('click',()=>{if(++page>=dialogue.length){box.hidden=true;return;}showPage();});
  box.querySelector('#library-npc-dismiss').addEventListener('click',()=>box.hidden=true);
  window.addEventListener('min-interaction-close',event=>{if(event.detail.id==='library'){closeBook();box.hidden=true;}});
}
