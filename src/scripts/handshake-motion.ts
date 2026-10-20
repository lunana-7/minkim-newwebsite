// Animate only when an element enters the viewport; content stays visible if JS fails.
const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
const running = new Set<Animation>();
let observer: IntersectionObserver | undefined;
const selectors = [
  '.hero h1', '.hero .intro', '.context > .label', '.context > h2',
  '.section-head', '.career-opening', '.career-chapters > li', '.career-next',
  '.fit-stats', '.fit-card', '.fit-pitch', '.fit-plan > li',
  '.day-route', '.day-timeline > li', '.day-routing',
  '.reading-card', '.pipeline > li', '.policy-band h2', '.three-grid > article',
  '#calibration > h2', '#analysis > h2', '.lab-grid', '.calibration-grid',
  '.scenario-layout', '#analysis > .two-grid', '.days > li', '.closing'
].join(',');
const targets = Array.from(document.querySelectorAll<HTMLElement>(selectors));
const revealed = new WeakSet<Element>();
function setupReveals() {
  observer?.disconnect();
  if (preference.matches || !('IntersectionObserver' in window)) return;
  observer = new IntersectionObserver(entries => {
    const visible = entries.filter(entry => entry.isIntersecting);
    visible.forEach((entry, index) => {
      const element = entry.target as HTMLElement;
      observer?.unobserve(element);
      if (revealed.has(element)) return;
      revealed.add(element);
      if (element.contains(document.activeElement)) return;
      const animation = element.animate(
        [{ opacity: 0, transform: 'translateY(24px)' }, { opacity: 1, transform: 'translateY(0)' }],
        { duration: 650, delay: Math.min(index, 3) * 65, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'backwards' }
      );
      running.add(animation);
      animation.finished.then(() => running.delete(animation), () => running.delete(animation));
    });
  }, { threshold: 0, rootMargin: '0px 0px -35px 0px' });
  targets.forEach(element => { if (!revealed.has(element)) observer?.observe(element); });
}
setupReveals();
preference.addEventListener('change', () => {
  running.forEach(animation => animation.cancel());
  running.clear();
  setupReveals();
});

const progress = document.createElement('div');
progress.className = 'reading-progress';
progress.setAttribute('aria-hidden', 'true');
document.body.append(progress);
let scheduled = false;
function updateProgress() {
  const length = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.transform = `scaleX(${length > 0 ? Math.min(1, Math.max(0, window.scrollY / length)) : 0})`;
  scheduled = false;
}
function scheduleProgress() {
  if (!scheduled) { scheduled = true; window.requestAnimationFrame(updateProgress); }
}
window.addEventListener('scroll', scheduleProgress, { passive: true });
window.addEventListener('resize', scheduleProgress);
if ('ResizeObserver' in window) new ResizeObserver(scheduleProgress).observe(document.body);
updateProgress();
