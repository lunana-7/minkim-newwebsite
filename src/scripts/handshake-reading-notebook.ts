type Fields = Record<string,string>;
type Annotation = {id:string;field:string|null;start:number|null;end:number|null;quote:string;comment:string;color:'cyan'|'mint'|'amber'};
type Note = {fields:Fields;status:'draft'|'reading'|'read'|'ready';readDate:string;annotations:Annotation[];updatedAt:string|null};
type Draft = {id:string;number:string;title:string;publisher:string;url:string;second:string|null;category:string;sourceSummary:string;takeaway:string;fields:Fields};
const payloadElement=document.getElementById('reading-notebook-data');
if(payloadElement){
 const {drafts,labels}=JSON.parse(payloadElement.textContent!) as {drafts:Draft[];labels:Fields};
 const key='handshake-reading-notebook:v1';
 const states=new Map<string,Note>();
 const fieldKeys=Object.keys(labels);
 const statusLabels={draft:'Draft',reading:'Reading',read:'Read',ready:'Ready to discuss'};
 let persisted:Record<string,unknown>={};
 let storageAvailable=true;
 try { const parsed=JSON.parse(localStorage.getItem(key)||'{}'); if(parsed?.version===1&&parsed.notes&&typeof parsed.notes==='object')persisted=parsed.notes; } catch { storageAvailable=false; }
 for(const draft of drafts){
  const raw=persisted[draft.id] as Partial<Note>|undefined;
  const fields={...draft.fields};
  for(const field of fieldKeys)if(typeof raw?.fields?.[field]==='string')fields[field]=raw.fields[field].slice(0,16000);
  const annotations:Annotation[]=Array.isArray(raw?.annotations)?raw.annotations.filter((a:any)=>a&&typeof a.id==='string'&&typeof a.quote==='string'&&typeof a.comment==='string').slice(0,1000).map((a:any)=>({id:a.id,field:fieldKeys.includes(a.field)?a.field:null,start:Number.isInteger(a.start)?a.start:null,end:Number.isInteger(a.end)?a.end:null,quote:a.quote.slice(0,4000),comment:a.comment.slice(0,8000),color:['cyan','mint','amber'].includes(a.color)?a.color:'cyan'})):[];
  states.set(draft.id,{fields,status:raw?.status&&Object.hasOwn(statusLabels,raw.status)?raw.status:'draft',readDate:typeof raw?.readDate==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(raw.readDate)?raw.readDate:'',annotations,updatedAt:typeof raw?.updatedAt==='string'?raw.updatedAt:null});
 }
 const dialog=document.getElementById('reading-notebook') as HTMLDialogElement;
 const reader=dialog.querySelector<HTMLElement>('[data-note-reader]')!;
 const saveLabel=dialog.querySelector<HTMLElement>('[data-note-save-status]')!;
 const statusInput=dialog.querySelector<HTMLSelectElement>('[data-note-status]')!;
 const dateInput=dialog.querySelector<HTMLInputElement>('[data-note-read-date]')!;
 const quoteInput=dialog.querySelector<HTMLTextAreaElement>('#annotation-quote')!;
 const commentInput=dialog.querySelector<HTMLTextAreaElement>('#annotation-comment')!;
 const colorInput=dialog.querySelector<HTMLSelectElement>('#annotation-color')!;
 const originLabel=dialog.querySelector<HTMLElement>('[data-annotation-origin]')!;
 const annotationForm=dialog.querySelector<HTMLFormElement>('[data-annotation-form]')!;
 const cancelEdit=dialog.querySelector<HTMLButtonElement>('[data-annotation-cancel]')!;
 let current=drafts[0];
 let mode:'read'|'edit'='read';
 let anchor:{field:string;start:number;end:number}|null=null;
 let editingAnnotation:string|null=null;
 let opener:HTMLElement|null=null;
 let previousOverflow='';
 const state=()=>states.get(current.id)!;
 function updateCards(){
  drafts.forEach(draft=>{
   const note=states.get(draft.id)!;
   document.querySelectorAll<HTMLElement>(`[data-note-badge="${draft.id}"]`).forEach(badge=>{badge.textContent=statusLabels[note.status];badge.dataset.status=note.status;});
  });
 }
 function save(){
  state().updatedAt=new Date().toISOString();
  try{
   // Keep notes for readings that may have been removed from the current collection.
   const notes={...persisted,...Object.fromEntries(states)};
   localStorage.setItem(key,JSON.stringify({version:1,notes}));
   persisted=notes;storageAvailable=true;
   saveLabel.textContent='Saved in this browser';
  }catch{storageAvailable=false;saveLabel.textContent='Browser save unavailable · export your notes to keep them';}
  updateCards();
 }
 function renderReader(){
  reader.replaceChildren();
  for(const field of fieldKeys){
   const section=document.createElement('section');
   section.className='notebook-note-section';
   const h=document.createElement('h3');h.textContent=labels[field];
   const heading=document.createElement('div');heading.className='note-section-heading';
   const annotate=document.createElement('button');annotate.type='button';annotate.textContent='Annotate';annotate.setAttribute('aria-label',`Annotate ${labels[field]}`);
   annotate.addEventListener('click',()=>{
    const text=state().fields[field];anchor={field,start:0,end:Math.min(text.length,4000)};quoteInput.value=text.slice(0,4000);editingAnnotation=null;
    originLabel.textContent=`My note · ${labels[field]}`;cancelEdit.hidden=true;dialog.querySelector('[data-annotation-submit]')!.textContent='Add annotation +';commentInput.focus();
   });
   heading.append(h,annotate);
   const p=document.createElement('p');p.dataset.noteParagraph=field;
   const text=state().fields[field];
   const annotations=state().annotations.filter(a=>a.field===field&&a.start!==null&&a.end!==null&&a.start>=0&&a.end>a.start&&text.slice(a.start,a.end)===a.quote).sort((a,b)=>a.start!-b.start!);
   let position=0;
   for(const a of annotations){
    if(a.start!<position)continue;
    p.append(document.createTextNode(text.slice(position,a.start!)));
    const mark=document.createElement('mark');mark.className=`note-highlight note-highlight-${a.color}`;mark.textContent=a.quote;mark.title=a.comment;mark.dataset.annotationId=a.id;
    p.append(mark);position=a.end!;
   }
   p.append(document.createTextNode(text.slice(position)));
   section.append(heading,p);reader.append(section);
  }
 }
 function clearAnnotationForm(){
  annotationForm.reset();anchor=null;editingAnnotation=null;
  originLabel.textContent='Original reading · pasted passage';
  dialog.querySelector('[data-annotation-submit]')!.textContent='Add annotation +';
  cancelEdit.hidden=true;
 }
 function renderAnnotations(){
  const list=dialog.querySelector<HTMLElement>('[data-annotation-list]')!;list.replaceChildren();
  dialog.querySelector('[data-annotation-count]')!.textContent=String(state().annotations.length);
  if(!state().annotations.length){const p=document.createElement('p');p.className='small';p.textContent='Your comments and saved passages will appear here.';list.append(p);return;}
  for(const annotation of state().annotations){
   const card=document.createElement('article');card.className=`saved-annotation annotation-${annotation.color}`;
   const source=document.createElement('small');source.textContent=annotation.field?`My note · ${labels[annotation.field]}`:'Original reading · pasted passage';
   const q=document.createElement('blockquote');q.textContent=annotation.quote;
   const comment=document.createElement('p');comment.textContent=annotation.comment;
   const actions=document.createElement('div');
   const edit=document.createElement('button');edit.type='button';edit.textContent='Edit';edit.addEventListener('click',()=>{
    editingAnnotation=annotation.id;quoteInput.value=annotation.quote;commentInput.value=annotation.comment;colorInput.value=annotation.color;
    anchor=annotation.field&&annotation.start!==null&&annotation.end!==null?{field:annotation.field,start:annotation.start,end:annotation.end}:null;
    originLabel.textContent=source.textContent;dialog.querySelector('[data-annotation-submit]')!.textContent='Save annotation';cancelEdit.hidden=false;commentInput.focus();
   });
   const remove=document.createElement('button');remove.type='button';remove.textContent='Remove';remove.setAttribute('aria-label','Remove annotation');remove.addEventListener('click',()=>{
    state().annotations=state().annotations.filter(a=>a.id!==annotation.id);
    if(editingAnnotation===annotation.id)clearAnnotationForm();save();renderReader();renderAnnotations();
   });
   actions.append(edit,remove);card.append(source,q,comment,actions);list.append(card);
  }
 }
 function selectMode(next:'read'|'edit'){
  mode=next;
  dialog.querySelector<HTMLElement>('#note-reader')!.hidden=next!=='read';
  dialog.querySelector<HTMLElement>('#note-editor')!.hidden=next!=='edit';
  dialog.querySelectorAll<HTMLButtonElement>('[data-note-mode]').forEach(button=>{const active=button.dataset.noteMode===next;button.setAttribute('aria-selected',String(active));button.tabIndex=active?0:-1;});
  if(next==='read')renderReader();
 }
 function load(draft:Draft){
  current=draft;const note=state();clearAnnotationForm();
  dialog.querySelector('#notebook-title')!.textContent=draft.title;
  dialog.querySelector('[data-notebook-source]')!.textContent=`${draft.number} / ${draft.publisher}`;
  dialog.querySelector('[data-note-source-summary]')!.textContent=draft.sourceSummary;
  dialog.querySelector<HTMLAnchorElement>('[data-note-source-link]')!.href=draft.url;
  const second=dialog.querySelector<HTMLAnchorElement>('[data-note-second-link]')!;second.hidden=!draft.second;if(draft.second)second.href=draft.second;
  statusInput.value=note.status;dateInput.value=note.readDate;
  dialog.querySelectorAll<HTMLTextAreaElement>('[data-note-field]').forEach(input=>input.value=note.fields[input.dataset.noteField!]);
  saveLabel.textContent=!storageAvailable?'Browser save unavailable · export to keep changes':note.updatedAt?'Saved in this browser':'Prepared draft · review and personalize';
  renderReader();renderAnnotations();selectMode(mode);
  dialog.querySelector<HTMLElement>('.notebook-content')!.scrollTop=0;
 }
 document.querySelectorAll<HTMLButtonElement>('[data-open-reading-note]').forEach(button=>button.addEventListener('click',()=>{
  const draft=drafts.find(d=>d.id===button.dataset.openReadingNote);if(!draft)return;
  opener=button;load(draft);previousOverflow=document.body.style.overflow;document.body.style.overflow='hidden';dialog.showModal();
  dialog.querySelector<HTMLButtonElement>('.notebook-close')!.focus();
 }));
 dialog.querySelector('.notebook-close')!.addEventListener('click',()=>dialog.close());
 dialog.addEventListener('click',event=>{if(event.target===dialog){const rect=dialog.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)dialog.close();}});
 dialog.addEventListener('close',()=>{document.body.style.overflow=previousOverflow;window.getSelection()?.removeAllRanges();opener?.focus();});
 dialog.querySelector('[data-note-previous]')!.addEventListener('click',()=>load(drafts[(drafts.indexOf(current)-1+drafts.length)%drafts.length]));
 dialog.querySelector('[data-note-next]')!.addEventListener('click',()=>load(drafts[(drafts.indexOf(current)+1)%drafts.length]));
 statusInput.addEventListener('change',()=>{state().status=statusInput.value as Note['status'];save();});
 dateInput.addEventListener('input',()=>{state().readDate=dateInput.value;save();});
 dialog.querySelectorAll<HTMLTextAreaElement>('[data-note-field]').forEach(input=>input.addEventListener('input',()=>{state().fields[input.dataset.noteField!]=input.value;save();}));
 dialog.querySelectorAll<HTMLButtonElement>('[data-note-mode]').forEach(button=>{
  button.addEventListener('click',()=>selectMode(button.dataset.noteMode as 'read'|'edit'));
  button.addEventListener('keydown',event=>{if(['ArrowLeft','ArrowRight','Home','End'].includes(event.key)){event.preventDefault();const next=event.key==='Home'?'read':event.key==='End'?'edit':mode==='read'?'edit':'read';selectMode(next);dialog.querySelector<HTMLButtonElement>(`[data-note-mode="${next}"]`)!.focus();}});
 });
 function captureSelection(){
  const selection=window.getSelection();if(!selection||selection.isCollapsed||!selection.rangeCount)return;
  const range=selection.getRangeAt(0);
  const startElement=range.startContainer.nodeType===Node.ELEMENT_NODE?range.startContainer as Element:range.startContainer.parentElement;
  const paragraph=startElement?.closest<HTMLElement>('[data-note-paragraph]');
  if(!paragraph||!reader.contains(paragraph)||!paragraph.contains(range.endContainer))return;
  const before=range.cloneRange();before.selectNodeContents(paragraph);before.setEnd(range.startContainer,range.startOffset);
  const start=before.toString().length;const quote=range.toString();if(!quote.trim()||quote.length>4000)return;
  const field=paragraph.dataset.noteParagraph!;
  anchor={field,start,end:start+quote.length};quoteInput.value=quote;editingAnnotation=null;
  originLabel.textContent=`My note · ${labels[field]}`;cancelEdit.hidden=true;dialog.querySelector('[data-annotation-submit]')!.textContent='Add annotation +';
 }
 reader.addEventListener('pointerup',()=>requestAnimationFrame(captureSelection));reader.addEventListener('keyup',captureSelection);
 document.addEventListener('selectionchange',()=>{
  if(dialog.open&&mode==='read'&&!dialog.querySelector(':focus')?.matches('textarea,input,select'))captureSelection();
 });
 quoteInput.addEventListener('input',()=>{anchor=null;originLabel.textContent='Original reading · pasted passage';});
 cancelEdit.addEventListener('click',clearAnnotationForm);
 annotationForm.addEventListener('submit',event=>{
  event.preventDefault();if(!quoteInput.value.trim()||!commentInput.value.trim())return;
  const validAnchor=anchor&&state().fields[anchor.field].slice(anchor.start,anchor.end)===quoteInput.value?anchor:null;
  const annotation:Annotation={id:editingAnnotation||crypto.randomUUID(),field:validAnchor?.field||null,start:validAnchor?.start??null,end:validAnchor?.end??null,quote:quoteInput.value,comment:commentInput.value,color:colorInput.value as Annotation['color']};
  const index=state().annotations.findIndex(a=>a.id===annotation.id);if(index>=0)state().annotations[index]=annotation;else state().annotations.push(annotation);
  save();clearAnnotationForm();window.getSelection()?.removeAllRanges();renderReader();renderAnnotations();
 });
 function markdown(draft:Draft){
  const note=states.get(draft.id)!;
  const parts=[`# ${draft.number}. ${draft.title}`,`Source: [${draft.publisher}](${draft.url})`,...(draft.second?[`Additional source: ${draft.second}`]:[]),`Status: ${statusLabels[note.status]}`,`Date read: ${note.readDate||'Not recorded'}`];
  fieldKeys.forEach(field=>parts.push(`## ${labels[field]}\n\n${note.fields[field]}`));
  if(note.annotations.length){parts.push('## My annotations');note.annotations.forEach(a=>parts.push(`### ${a.field?labels[a.field]:'Original reading passage'}\n\n${a.quote.split('\n').map(line=>'> '+line).join('\n')}\n\n${a.comment}`));}
  return parts.join('\n\n');
 }
 function download(filename:string,content:string){
  const url=URL.createObjectURL(new Blob([content],{type:'text/markdown;charset=utf-8'}));const link=document.createElement('a');link.href=url;link.download=filename;document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
 }
 dialog.querySelector('[data-export-note]')!.addEventListener('click',()=>download(`handshake-reading-${current.id}.md`,markdown(current)));
 document.querySelector('[data-export-notebook]')!.addEventListener('click',()=>download('min-kim-handshake-reading-notes.md',`# Min Kim · Interview preparation reading log\n\nReading status is user-recorded. Prepared drafts are starting points for personal review.\n\n${drafts.map(markdown).join('\n\n---\n\n')}`));
 window.addEventListener('beforeprint',()=>{if(dialog.open)renderReader();});
 updateCards();
}
