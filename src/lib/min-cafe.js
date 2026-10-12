import { getProfile, getPlayerId, updateProfile, subscribeProfile } from './min-profile.js';
import { subscribeAccount } from './min-cloud.js';

export function initCafe() {
  const cafe = document.getElementById('mini-cafe'); if (!cafe) return;
  const labels = { focus:'Focus', short:'Short break', long:'Long break' };
  const defaults = () => ({ mode:'focus', lengths:{ focus:25, short:5, long:15 }, remaining:1500000, deadline:null, duration:1500000, history:[] });
  const key = () => `min-cafe-timer:${getPlayerId()}`;
  let state, owner = getPlayerId(), interval, unsubscribe, accountUnsubscribe;
  const now = () => Date.now();
  function read() {
    const base = defaults();
    try {
      const value = JSON.parse(localStorage.getItem(key()) || 'null');
      if (!value || !Object.hasOwn(labels,value.mode)) return base;
      const lengths = Object.fromEntries(Object.entries(base.lengths).map(([kind,fallback]) => [kind, Math.max(1,Math.min(kind==='focus'?120:kind==='short'?30:60,Number(value.lengths?.[kind]) || fallback))]));
      const duration = Math.max(60000,Math.min(7200000,Number(value.duration) || lengths[value.mode]*60000));
      return { mode:value.mode,lengths,duration,remaining:Math.max(0,Math.min(duration,Number(value.remaining) || 0)),deadline:Number.isFinite(value.deadline)?value.deadline:null,history:Array.isArray(value.history)?value.history.filter(item => Number.isFinite(item.at)&&Number.isFinite(item.minutes)).slice(-30):[] };
    } catch { return base; }
  }
  function persist() { try { localStorage.setItem(key(),JSON.stringify(state)); } catch {} }
  function remaining() { return state.deadline === null ? state.remaining : Math.max(0,state.deadline-now()); }
  function render() {
    if (owner !== getPlayerId()) { owner=getPlayerId();state=read();history(); }
    const seconds = Math.ceil(remaining()/1000), running = state.deadline !== null;
    document.getElementById('cafe-timer').textContent = `${String(Math.floor(seconds/60)).padStart(2,'0')}:${String(seconds%60).padStart(2,'0')}`;
    document.getElementById('cafe-timer-start').textContent = running ? 'Pause' : remaining() === 0 ? `Start another ${labels[state.mode].toLowerCase()}` : `Start / resume ${labels[state.mode].toLowerCase()}`;
    document.querySelectorAll('[data-cafe-mode]').forEach(button => { button.setAttribute('aria-pressed',String(button.dataset.cafeMode===state.mode)); button.disabled = running; });
    cafe.classList.toggle('is-focusing',running && state.mode==='focus');
    const mini = cafe.querySelector('[data-min-appearance]'); mini.dataset.controlledPose = running && state.mode==='focus' ? 'cafe-study' : 'seated';
    document.getElementById('cafe-room-caption').textContent = running ? state.mode==='focus' ? 'Mini is studying with you. One page at a time. ♡' : 'A little rest, a warm cup. ♡' : 'Your window seat is ready. ♡';
    const stats = getProfile().study;
    document.getElementById('cafe-focus-count').textContent = stats.sessions;
    document.getElementById('cafe-focus-total').textContent = Math.floor(stats.seconds/60);
  }
  function history() {
    const list = document.getElementById('cafe-study-history'); list.replaceChildren();
    const entries = [...state.history].reverse().slice(0,5);
    for (const item of entries) { const li=document.createElement('li'); li.textContent=`${new Date(item.at).toLocaleString(undefined,{month:'short',day:'numeric',hour:'numeric',minute:'2-digit'})} · ${item.minutes} min focus ✓`;list.append(li); }
    if (!entries.length) { const li=document.createElement('li');li.textContent='No sessions yet. Your first little win starts here.';list.append(li); }
  }
  function finish() {
    // Re-read before committing so a second tab cannot credit the same timer twice.
    const latest = read();
    if (latest.deadline === null || latest.deadline > now()) { state=latest;render();return; }
    state=latest;state.deadline=null;state.remaining=0;
    if (state.mode==='focus') { state.history.push({at:now(),minutes:state.duration/60000});state.history=state.history.slice(-30);persist();const stats=getProfile().study;updateProfile({study:{sessions:stats.sessions+1,seconds:stats.seconds+Math.round(state.duration/1000)}});history(); }
    else persist();
    document.getElementById('cafe-timer-status').textContent = state.mode==='focus' ? 'Focus complete! Saved to your study totals. Choose a short break, or a long break after four sessions. ♡' : 'Break complete. Ready for another little focus session?';
    render();
  }
  state=read();history();render();
  window.addEventListener('min-cafe-open',()=>{ cafe.hidden=false;document.getElementById('cafe-title').focus({preventScroll:true});cafe.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'}); });
  document.getElementById('cafe-leave').addEventListener('click',()=>{cafe.hidden=true;window.dispatchEvent(new Event('min-cafe-close'));document.getElementById('adventure-canvas').scrollIntoView({block:'center'});document.getElementById('adventure-canvas').focus({preventScroll:true});});
  document.getElementById('cafe-timer-start').addEventListener('click',()=>{ if(state.deadline!==null){state.remaining=remaining();state.deadline=null;}else{if(!state.remaining){state.duration=state.lengths[state.mode]*60000;state.remaining=state.duration;}state.deadline=now()+state.remaining;}persist();document.getElementById('cafe-timer-status').textContent=state.deadline?`${labels[state.mode]} in progress.`:'Timer paused. Your remaining time is saved.';render(); });
  document.getElementById('cafe-timer-reset').addEventListener('click',()=>{state.deadline=null;state.duration=state.lengths[state.mode]*60000;state.remaining=state.duration;persist();render();document.getElementById('cafe-timer-status').textContent='Timer reset. Completed sessions are kept.';});
  document.querySelectorAll('[data-cafe-mode]').forEach(button=>button.addEventListener('click',()=>{if(state.deadline!==null)return;state.mode=button.dataset.cafeMode;state.duration=state.lengths[state.mode]*60000;state.remaining=state.duration;persist();render();document.getElementById('cafe-timer-status').textContent=`${labels[state.mode]} ready.`;}));
  for(const kind of Object.keys(labels)) document.getElementById(`cafe-${kind}-minutes`).value=state.lengths[kind];
  document.getElementById('cafe-settings-save').addEventListener('click',()=>{if(state.deadline!==null){document.getElementById('cafe-timer-status').textContent='Pause the timer before changing session lengths.';return;}for(const kind of Object.keys(labels)){const input=document.getElementById(`cafe-${kind}-minutes`);if(!input.reportValidity())return;}for(const kind of Object.keys(labels))state.lengths[kind]=Number(document.getElementById(`cafe-${kind}-minutes`).value);state.duration=state.lengths[state.mode]*60000;state.remaining=state.duration;persist();render();});
  document.getElementById('cafe-load-spotify').addEventListener('click',event=>{window.dispatchEvent(new Event('min-cafe-music'));const frame=document.createElement('iframe');frame.src='https://open.spotify.com/embed/playlist/37i9dQZF1DWWQRwui0ExPn?utm_source=generator&theme=0';frame.title='Spotify lofi beats playlist';frame.width='100%';frame.height='352';frame.allow='autoplay; encrypted-media; fullscreen; picture-in-picture';frame.loading='lazy';document.getElementById('cafe-spotify-player').replaceChildren(frame);event.currentTarget.hidden=true;});
  unsubscribe=subscribeProfile(render);
  accountUnsubscribe=subscribeAccount(()=>{if(owner===getPlayerId())return;owner=getPlayerId();state=read();history();render();});
  window.addEventListener('storage',event=>{if(event.key===key()){state=read();history();render();}});
  interval=setInterval(()=>{if(state.deadline!==null&&remaining()===0)finish();else render();},500);
  window.addEventListener('pagehide',()=>{clearInterval(interval);unsubscribe();accountUnsubscribe();});
}
