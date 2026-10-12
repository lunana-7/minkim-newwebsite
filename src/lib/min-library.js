import { LIBRARY_BOOKS } from './min-library-data.js';
import { getProfile, updateProfile, subscribeProfile } from './min-profile.js';
import { getAccount, subscribeAccount, signInPlayer } from './min-cloud.js';
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

const dialogues={
  sage:['Welcome in. This shelf starts with the NIST AI Risk Management Framework.','Try reading Govern, Map, Measure, and Manage as a cycle. For agents, ask who may approve an action and who can stop it.','If you prefer security examples, the OWASP guide focuses on agentic applications.'],
  moss:['I am comparing the AI RMF with the Generative AI Profile.','A policy is easier to use when it names an owner, an evidence trail, and a review date.'],
  fern:['I wander between the shelves looking for practical safeguards.','For every agent tool, I ask: what can it access, who granted that access, and what happens when it fails?']
};
const INK={rose:'#c66b83',gold:'#e5b64e',blue:'#5d9bb7'};

export function initLibrary(){
  const root=document.getElementById('mini-library');if(!root||root.dataset.ready)return;root.dataset.ready='true';
  const reader=root.querySelector('#library-reader'),pdfCanvas=reader.querySelector('#library-pdf-canvas'),inkCanvas=reader.querySelector('#library-ink-canvas');
  const surface=reader.querySelector('#library-pdf-surface'),scroll=reader.querySelector('#library-pdf-scroll'),loading=reader.querySelector('#library-pdf-loading');
  const annotationList=reader.querySelector('#library-annotation-list'),annotationStatus=reader.querySelector('#library-annotation-status');
  let filter='all',currentBook=null,dialogue=null,dialoguePage=0,pdfDocument=null,renderTask=null,renderEpoch=0,bookEpoch=0;
  let pageNumber=1,pageTotal=0,zoom=1,tool='read',color='rose',activeStroke=null,activePointerId=null,pageSize={width:1,height:1},opener=null;

  function item(id){return getProfile().library?.books?.[id]||{status:'to-read',favorite:false,annotations:[]};}
  function annotations(){return currentBook?item(currentBook.id).annotations||[]:[];}
  function change(id,patch){const profile=getProfile(),books=profile.library?.books||{};updateProfile({library:{books:{...books,[id]:{...item(id),...patch}}}});}
  function canAnnotate(){const account=getAccount();return Boolean(account.user)&&['saved','saving'].includes(account.state);}
  function notice(value){annotationStatus.textContent=value;}

  function renderShelf(){
    const books=LIBRARY_BOOKS.map(book=>({book,state:item(book.id)}));
    root.querySelector('#library-counts').textContent=`${books.filter(({state})=>state.status==='read').length} read · ${books.filter(({state})=>state.status==='reading').length} reading · ${books.filter(({state})=>state.favorite).length} favorites`;
    for(const {book,state} of books){const card=root.querySelector(`[data-library-book="${book.id}"]`);card.hidden=filter!=='all'&&!(filter==='favorite'?state.favorite:state.status===filter);const favorite=card.querySelector('[data-library-favorite]');favorite.textContent=state.favorite?'♥':'♡';favorite.setAttribute('aria-pressed',String(state.favorite));favorite.setAttribute('aria-label',`${state.favorite?'Remove':'Add'} ${book.title} ${state.favorite?'from':'to'} favorites`);card.querySelector('[data-library-status]').value=state.status;}
    if(currentBook){renderAnnotationList();drawInk();}
  }
  function renderAccount(){
    const account=getAccount(),line=reader.querySelector('#library-annotation-account'),login=reader.querySelector('#library-annotation-login');
    login.hidden=Boolean(account.user);login.disabled=!account.configured;
    line.textContent=account.state==='error'?account.message:account.user?account.state==='loading'?'Loading your Google reading shelf…':`Signed in as ${account.user.displayName||account.user.email||'reader'} · annotations sync to your Google account.`:account.configured?'Sign in with Google to save pen marks, highlights and notes.':'Google sign-in needs site configuration before annotations can be saved.';
    reader.querySelector('#library-note-add').disabled=!canAnnotate();reader.querySelector('#library-note-text').disabled=!canAnnotate();
    if(!canAnnotate()&&tool!=='read')setTool('read');
    if(currentBook)renderAnnotationList();
  }
  subscribeProfile(renderShelf);subscribeAccount(renderAccount);
  reader.querySelector('#library-annotation-login').addEventListener('click',()=>signInPlayer());
  root.querySelectorAll('[data-library-filter]').forEach(button=>button.addEventListener('click',()=>{filter=button.dataset.libraryFilter;root.querySelectorAll('[data-library-filter]').forEach(other=>other.setAttribute('aria-pressed',String(other===button)));renderShelf();}));
  root.querySelectorAll('[data-library-favorite]').forEach(button=>button.addEventListener('click',()=>change(button.dataset.libraryFavorite,{favorite:!item(button.dataset.libraryFavorite).favorite})));
  root.querySelectorAll('[data-library-status]').forEach(select=>select.addEventListener('change',()=>change(select.dataset.libraryStatus,{status:select.value})));

  function setTool(next){
    if(next!=='read'&&!canAnnotate()){notice('Sign in with Google to annotate this PDF.');reader.querySelector('#library-annotation-login').focus({preventScroll:true});return;}
    tool=next;reader.querySelectorAll('[data-library-tool]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.libraryTool===next)));
    inkCanvas.style.pointerEvents=next==='read'?'none':'auto';inkCanvas.style.touchAction=next==='read'?'auto':'none';inkCanvas.style.cursor=next==='read'?'auto':'crosshair';
  }
  reader.querySelectorAll('[data-library-tool]').forEach(button=>button.addEventListener('click',()=>setTool(button.dataset.libraryTool)));
  reader.querySelectorAll('[data-library-color]').forEach(button=>button.addEventListener('click',()=>{color=button.dataset.libraryColor;reader.querySelectorAll('[data-library-color]').forEach(other=>other.setAttribute('aria-pressed',String(other===button)));}));

  function drawInk(){
    const context=inkCanvas.getContext('2d'),ratio=Math.min(2,window.devicePixelRatio||1);
    context.setTransform(1,0,0,1,0,0);context.clearRect(0,0,inkCanvas.width,inkCanvas.height);context.setTransform(ratio,0,0,ratio,0,0);
    for(const mark of [...annotations().filter(entry=>entry.page===pageNumber&&entry.type!=='note'),...(activeStroke?[activeStroke]:[])]){
      if(!mark.points?.length)continue;context.beginPath();context.moveTo(mark.points[0][0]*pageSize.width,mark.points[0][1]*pageSize.height);
      for(const [x,y] of mark.points.slice(1))context.lineTo(x*pageSize.width,y*pageSize.height);
      context.strokeStyle=INK[mark.color]||INK.rose;context.globalAlpha=mark.type==='highlight'?.36:.95;
      context.lineWidth=mark.type==='highlight'?18:3;context.lineCap='round';context.lineJoin='round';context.stroke();
    }
    context.globalAlpha=1;
  }
  function pointerPoint(event){const bounds=inkCanvas.getBoundingClientRect();return[Math.max(0,Math.min(1,(event.clientX-bounds.left)/bounds.width)),Math.max(0,Math.min(1,(event.clientY-bounds.top)/bounds.height))];}
  inkCanvas.addEventListener('pointerdown',event=>{if(tool==='read'||!canAnnotate()||!currentBook||!pdfDocument)return;event.preventDefault();activePointerId=event.pointerId;inkCanvas.setPointerCapture(event.pointerId);activeStroke={id:crypto.randomUUID(),type:tool,page:pageNumber,color,points:[pointerPoint(event)],text:'',createdAt:Date.now()};});
  inkCanvas.addEventListener('pointermove',event=>{if(!activeStroke||event.pointerId!==activePointerId||activeStroke.points.length>=160)return;const point=pointerPoint(event),last=activeStroke.points.at(-1);if(Math.hypot(point[0]-last[0],point[1]-last[1])>.002){activeStroke.points.push(point);drawInk();}});
  function finishStroke(event){if(!activeStroke||event.pointerId!==activePointerId)return;const stroke=activeStroke;activeStroke=null;activePointerId=null;if(inkCanvas.hasPointerCapture(event.pointerId))inkCanvas.releasePointerCapture(event.pointerId);if(stroke.points.length===1)stroke.points.push([Math.min(1,stroke.points[0][0]+.001),stroke.points[0][1]]);saveAnnotation(stroke);}
  inkCanvas.addEventListener('pointerup',finishStroke);inkCanvas.addEventListener('pointercancel',()=>{activeStroke=null;activePointerId=null;drawInk();});

  function saveAnnotation(entry){
    if(!currentBook||!canAnnotate()){notice('Sign in with Google to save annotations.');drawInk();return;}
    change(currentBook.id,{annotations:[...annotations(),entry].slice(-50)});
    notice(`${entry.type==='note'?'Page note':'Page mark'} saved on this device. Cloud sync is starting…`);
  }
  reader.querySelector('#library-note-add').addEventListener('click',()=>{const field=reader.querySelector('#library-note-text'),value=field.value.trim();if(!value){notice('Write a note first.');return;}saveAnnotation({id:crypto.randomUUID(),type:'note',page:pageNumber,text:value.slice(0,600),color,points:[],createdAt:Date.now()});if(canAnnotate())field.value='';});
  function renderAnnotationList(){
    annotationList.replaceChildren();if(!currentBook)return;
    const entries=[...annotations()].sort((a,b)=>Number(b.page===pageNumber)-Number(a.page===pageNumber)||b.createdAt-a.createdAt);
    if(!entries.length){const empty=document.createElement('p');empty.textContent='No annotations yet. Choose Pen or Highlight, or write a page note.';annotationList.append(empty);return;}
    for(const entry of entries){const card=document.createElement('article');card.className='library-annotation-card';if(entry.page===pageNumber)card.classList.add('is-current');const header=document.createElement('div'),jump=document.createElement('button'),remove=document.createElement('button');jump.type='button';jump.textContent=`Page ${entry.page} · ${entry.type==='note'?'Note':entry.type==='pen'?'Pen mark':'Highlight'}`;jump.addEventListener('click',()=>showPage(entry.page));remove.type='button';remove.textContent='×';remove.setAttribute('aria-label',`Delete annotation on page ${entry.page}`);remove.disabled=!canAnnotate();remove.addEventListener('click',()=>{change(currentBook.id,{annotations:annotations().filter(mark=>mark.id!==entry.id)});notice('Annotation removed.');});header.append(jump,remove);card.append(header);if(entry.type==='note'){const body=document.createElement('p');body.textContent=entry.text;card.append(body);}annotationList.append(card);}
  }

  async function showPage(requested){
    if(!pdfDocument)return;pageNumber=Math.max(1,Math.min(pdfDocument.numPages,Number(requested)||1));const epoch=++renderEpoch;
    reader.querySelector('#library-page-number').value=String(pageNumber);reader.querySelector('#library-page-prev').disabled=pageNumber<=1;reader.querySelector('#library-page-next').disabled=pageNumber>=pageTotal;
    reader.querySelector('#library-zoom-label').textContent=`${Math.round(zoom*100)}%`;loading.hidden=false;loading.textContent='Rendering page…';
    const previousTask=renderTask;previousTask?.cancel();renderTask=null;
    try{
      if(previousTask)await previousTask.promise.catch(()=>{});
      const page=await pdfDocument.getPage(pageNumber);if(epoch!==renderEpoch)return;
      const fit=Math.min(1.55,Math.max(.5,(scroll.clientWidth-32)/page.getViewport({scale:1}).width));
      const viewport=page.getViewport({scale:fit*zoom}),ratio=Math.min(2,window.devicePixelRatio||1);
      pageSize={width:viewport.width,height:viewport.height};surface.style.width=`${viewport.width}px`;surface.style.height=`${viewport.height}px`;
      for(const canvas of [pdfCanvas,inkCanvas]){canvas.width=Math.ceil(viewport.width*ratio);canvas.height=Math.ceil(viewport.height*ratio);canvas.style.width=`${viewport.width}px`;canvas.style.height=`${viewport.height}px`;}
      const context=pdfCanvas.getContext('2d');renderTask=page.render({canvasContext:context,canvas:pdfCanvas,viewport,transform:[ratio,0,0,ratio,0,0]});
      await renderTask.promise;if(epoch!==renderEpoch)return;loading.hidden=true;drawInk();renderAnnotationList();scroll.scrollTop=0;
    }catch(error){if(epoch!==renderEpoch||error?.name==='RenderingCancelledException')return;loading.hidden=false;loading.textContent='This page could not be rendered. Open the original PDF above.';}
  }
  reader.querySelector('#library-page-prev').addEventListener('click',()=>showPage(pageNumber-1));reader.querySelector('#library-page-next').addEventListener('click',()=>showPage(pageNumber+1));
  reader.querySelector('#library-page-number').addEventListener('change',event=>showPage(event.target.value));
  reader.querySelector('#library-zoom-out').addEventListener('click',()=>{zoom=Math.max(.6,Math.round((zoom-.2)*10)/10);showPage(pageNumber);});
  reader.querySelector('#library-zoom-in').addEventListener('click',()=>{zoom=Math.min(2.4,Math.round((zoom+.2)*10)/10);showPage(pageNumber);});
  let resizeTimer=0;window.addEventListener('resize',()=>{if(currentBook&&pdfDocument){clearTimeout(resizeTimer);resizeTimer=setTimeout(()=>showPage(pageNumber),180);}});

  function closeBook(){
    if(!currentBook)return;bookEpoch++;renderEpoch++;renderTask?.cancel();renderTask=null;pdfDocument?.destroy();pdfDocument=null;
    reader.hidden=true;root.append(reader);root.classList.remove('is-reading');document.body.classList.remove('is-library-reading');
    currentBook=null;activeStroke=null;activePointerId=null;setTool('read');opener?.focus({preventScroll:true});opener=null;
  }
  reader.querySelector('#library-reader-close').addEventListener('click',closeBook);
  reader.querySelector('#library-reader-finish').addEventListener('click',()=>{if(currentBook)change(currentBook.id,{status:'read'});closeBook();});
  window.addEventListener('keydown',event=>{if(event.key==='Escape'&&currentBook){event.preventDefault();event.stopImmediatePropagation();closeBook();}},{capture:true});

  async function openBook(book,sourceButton){
    if(!book.pdf){change(book.id,{status:'reading'});window.open(book.source,'_blank','noopener,noreferrer');return;}
    if(currentBook)closeBook();currentBook=book;opener=sourceButton||null;pageNumber=1;pageTotal=0;zoom=1;
    change(book.id,{status:'reading'});reader.querySelector('#library-reader-title').textContent=book.title;reader.querySelector('#library-reader-prompt').textContent=book.prompt;
    const source=reader.querySelector('#library-reader-source'),download=reader.querySelector('#library-reader-download');source.href=book.source;download.href=book.pdf;download.hidden=false;
    document.body.append(reader);reader.hidden=false;root.classList.add('is-reading');document.body.classList.add('is-library-reading');
    setTool('read');renderAccount();renderAnnotationList();loading.hidden=false;loading.textContent='Opening PDF…';reader.querySelector('#library-reader-close').focus({preventScroll:true});
    const epoch=++bookEpoch;
    try{
      const pdfjs=await import('pdfjs-dist/build/pdf.mjs');if(epoch!==bookEpoch)return;pdfjs.GlobalWorkerOptions.workerSrc=pdfWorkerUrl;
      const documentTask=pdfjs.getDocument({url:book.pdf});const documentResult=await documentTask.promise;
      if(epoch!==bookEpoch){documentResult.destroy();return;}
      pdfDocument=documentResult;pageTotal=pdfDocument.numPages;reader.querySelector('#library-page-total').textContent=String(pageTotal);showPage(1);
    }catch{if(epoch===bookEpoch){loading.textContent='This PDF could not be opened here. Use “Open PDF separately” above.';notice('The original PDF link is still available.');}}
  }
  root.querySelectorAll('[data-library-open]').forEach(button=>button.addEventListener('click',()=>{const book=LIBRARY_BOOKS.find(entry=>entry.id===button.dataset.libraryOpen);if(book)openBook(book,button);}));
  const linkedBook=new URLSearchParams(location.search).get('book');if(linkedBook){const book=LIBRARY_BOOKS.find(entry=>entry.id===linkedBook);if(book)openBook(book,root.querySelector(`[data-library-open="${linkedBook}"]`));}

  const box=root.querySelector('#library-npc-dialog');
  function showDialoguePage(){box.querySelector('#library-npc-line').textContent=dialogue[dialoguePage];box.querySelector('#library-npc-next').textContent=dialoguePage<dialogue.length-1?'Next →':'Thanks ♡';}
  root.querySelectorAll('[data-library-npc]').forEach(button=>button.addEventListener('click',()=>{const name=button.dataset.libraryNpc;dialogue=dialogues[name];dialoguePage=0;box.querySelector('#library-npc-name').textContent=name[0].toUpperCase()+name.slice(1);box.hidden=false;showDialoguePage();box.querySelector('#library-npc-next').focus({preventScroll:true});}));
  box.querySelector('#library-npc-next').addEventListener('click',()=>{if(++dialoguePage>=dialogue.length){box.hidden=true;return;}showDialoguePage();});box.querySelector('#library-npc-dismiss').addEventListener('click',()=>box.hidden=true);
  window.addEventListener('min-interaction-close',event=>{if(event.detail.id==='library'){closeBook();box.hidden=true;}});
}
