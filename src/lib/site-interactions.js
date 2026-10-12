const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const interactiveSelector = 'a, button, summary, [role="button"]';

function sparkle(x, y) {
  if (reducedMotion.matches) return;
  const effect = document.createElement('span');
  effect.className = 'site-click-sparkle';
  effect.style.left = `${x}px`;
  effect.style.top = `${y}px`;
  effect.setAttribute('aria-hidden', 'true');
  effect.addEventListener('animationend', () => effect.remove(), { once: true });
  document.body.append(effect);
}

document.addEventListener('pointerdown', event => {
  if (!event.isPrimary || event.button !== 0 || !(event.target instanceof Element)) return;
  const target = event.target.closest(interactiveSelector);
  if (!target || target.matches(':disabled, [aria-disabled="true"]')) return;
  sparkle(event.clientX, event.clientY);
}, { passive: true });

document.addEventListener('click', event => {
  if (event.detail !== 0 || !(event.target instanceof Element)) return;
  const target = event.target.closest(interactiveSelector);
  if (!target || target.matches(':disabled, [aria-disabled="true"]')) return;
  const bounds = target.getBoundingClientRect();
  sparkle(bounds.left + bounds.width / 2, bounds.top + bounds.height / 2);
});
