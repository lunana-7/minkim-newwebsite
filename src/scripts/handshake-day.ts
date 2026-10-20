const studio = document.querySelector<HTMLElement>('[data-day-studio]');
if (studio) {
  const tabs = Array.from(studio.querySelectorAll<HTMLButtonElement>('[data-day-step]'));
  const scenes = Array.from(studio.querySelectorAll<HTMLElement>('[data-day-scene]'));
  const play = studio.querySelector<HTMLButtonElement>('.day-play')!;
  const status = studio.querySelector<HTMLElement>('[data-day-status]')!;
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let current = 0;
  let timer: ReturnType<typeof setInterval> | undefined;
  let animations: Animation[] = [];
  function pause() {
    clearInterval(timer);
    timer = undefined;
    play.textContent = '▶ Play the day';
    play.setAttribute('aria-pressed', 'false');
    studio!.classList.remove('is-playing');
  }
  function show(index: number) {
    animations.forEach(animation => animation.cancel());
    animations = [];
    current = (index + tabs.length) % tabs.length;
    tabs.forEach((tab, i) => {
      tab.setAttribute('aria-selected', String(i === current));
      tab.tabIndex = i === current ? 0 : -1;
      tab.classList.toggle('is-past', i < current);
      scenes[i].hidden = i !== current;
    });
    studio!.style.setProperty('--day-position', String(current));
    status.textContent = `${tabs[current].querySelector('b')!.textContent} · ${tabs[current].lastElementChild!.textContent} · ${current + 1} of ${tabs.length}`;
    if (!motion.matches) {
      scenes[current].querySelectorAll('[data-scene-reveal]').forEach((element, i) => {
        animations.push(element.animate([
          { opacity: 0, transform: 'translateY(14px)' },
          { opacity: 1, transform: 'translateY(0)' }
        ], { duration: 500, delay: i * 55, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'backwards' }));
      });
    }
  }
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => { pause(); show(i); });
    tab.addEventListener('keydown', event => {
      let next = i;
      if (event.key === 'ArrowRight') next = (i + 1) % tabs.length;
      else if (event.key === 'ArrowLeft') next = (i - 1 + tabs.length) % tabs.length;
      else if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = tabs.length - 1;
      else return;
      event.preventDefault(); pause(); show(next); tabs[next].focus();
    });
  });
  studio.querySelector('[data-day-prev]')!.addEventListener('click', () => { pause(); show(current - 1); });
  studio.querySelector('[data-day-next]')!.addEventListener('click', () => { pause(); show(current + 1); });
  play.addEventListener('click', () => {
    if (timer) { pause(); return; }
    if (current === tabs.length - 1) show(0);
    play.textContent = 'Ⅱ Pause the day';
    play.setAttribute('aria-pressed', 'true');
    studio!.classList.add('is-playing');
    timer = setInterval(() => {
      if (current === tabs.length - 1) { pause(); return; }
      show(current + 1);
    }, 8000);
  });
  document.addEventListener('visibilitychange', () => { if (document.hidden) pause(); });
  new IntersectionObserver(entries => { if (!entries[0].isIntersecting) pause(); }).observe(studio);
  motion.addEventListener('change', () => { pause(); animations.forEach(animation => animation.cancel()); });
  studio.addEventListener('focusin', event => { if (event.target !== play) pause(); });
}
