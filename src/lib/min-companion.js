import { ACTIVITIES, getProfile, startActivity, completeActivity, subscribeProfile } from './min-profile.js';
import { initAppearances, renderAppearances } from './min-appearance.js';
import { EMOTES, getEmote, playEmote } from './min-emotes.js';
import { startCloudSync, subscribeAccount } from './min-cloud.js';
let initialized = false;
export function initMini() {
  if (initialized) return; initialized = true;
  const walker = document.getElementById('mini-walker');
  const trigger = document.getElementById('min-companion-trigger');
  const menu = document.getElementById('min-companion-menu');
  const speech = document.getElementById('min-speech');
  const rewardBubble = document.getElementById('min-reward-bubble');
  let lastReward = '', lastPose = null;
  initAppearances(); startCloudSync().catch(() => {});
  function openMenu() {
    menu.hidden = false; trigger.setAttribute('aria-expanded', 'true');
    walker.classList.add('is-paused', 'is-greeting');
    const rect = walker.getBoundingClientRect();
    const width = Math.min(320, innerWidth - 24);
    menu.style.left = `${Math.max(12, Math.min(innerWidth - width - 12, rect.left + rect.width / 2 - width / 2))}px`;
    if (!getProfile().activeActivity) playEmote('hello');
    renderAppearances(); update();
    menu.querySelector('button').focus();
    setTimeout(() => walker.classList.remove('is-greeting'), 600);
  }
  function closeMenu() {
    menu.hidden = true; trigger.setAttribute('aria-expanded', 'false');
    walker.classList.toggle('is-paused', Boolean(getProfile().activeActivity));
    renderAppearances(); trigger.focus({ preventScroll: true });
  }
  trigger.addEventListener('click', () => menu.hidden ? openMenu() : closeMenu());
  document.getElementById('min-menu-close').addEventListener('click', closeMenu);
  document.querySelectorAll('[data-min-open-menu]').forEach(button => button.addEventListener('click', event => { event.stopPropagation(); openMenu(); }));
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && !menu.hidden) closeMenu(); });
  document.addEventListener('click', event => { if (!menu.hidden && !menu.contains(event.target) && !trigger.contains(event.target)) closeMenu(); });
  document.querySelectorAll('[data-min-activity]').forEach(button => button.addEventListener('click', () => {
    lastReward = ''; startActivity(button.dataset.minActivity);
  }));
  document.querySelectorAll('[data-min-emote]').forEach(button => button.addEventListener('click', () => { if (!getProfile().activeActivity) playEmote(button.dataset.minEmote); }));
  window.addEventListener('min-emote-change', update);
  function update() {
    const profile = getProfile();
    const activity = profile.activeActivity;
    const emote = getEmote();
    document.querySelectorAll('[data-min-points]').forEach(element => { element.textContent = profile.points.toLocaleString(); });
    document.querySelectorAll('[data-min-level]').forEach(element => { element.textContent = `Level ${Math.floor(profile.points / 100) + 1}`; });
    document.querySelectorAll('[data-min-activity]').forEach(button => { button.disabled = Boolean(activity); });
    document.querySelectorAll('[data-min-completed]').forEach(element => { element.textContent = profile.completedActivities[element.dataset.minCompleted]; });
    walker.classList.toggle('is-paused', Boolean(activity) || Boolean(emote) || !menu.hidden);
    document.getElementById('min-activity-progress').hidden = !activity;
    if (activity) {
      const info = ACTIVITIES[activity.kind];
      speech.textContent = info.message;
      const remaining = Math.max(0, activity.endsAt - Date.now());
      const percent = Math.min(100, 100 * (Date.now() - activity.startedAt) / info.duration);
      document.getElementById('min-activity-meter').value = percent;
      document.getElementById('min-activity-countdown').textContent = `${info.shortLabel} · ${Math.ceil(remaining / 1000)}s`;
      document.querySelectorAll('[data-min-game-progress]').forEach(element => { element.textContent = `${info.shortLabel} · ${Math.ceil(remaining / 1000)}s left`; });
      if (remaining === 0) {
        // Set the completion message before the store notifies subscribers.
        lastReward = `${info.done} +${info.reward} points.`;
        const completed = completeActivity(activity.id);
        if (completed) {
          rewardBubble.textContent = `+${completed.reward} ✦`; rewardBubble.classList.remove('is-visible');
          requestAnimationFrame(() => rewardBubble.classList.add('is-visible'));
          setTimeout(() => rewardBubble.classList.remove('is-visible'), 2200);
        }
        return;
      }
    } else {
      speech.textContent = emote ? EMOTES[emote.kind].message : lastReward || 'A coffee, a bowl, or a little studying?';
      document.querySelectorAll('[data-min-game-progress]').forEach(element => { element.textContent = lastReward || 'Pick a little activity to earn points.'; });
    }
    document.querySelectorAll('[data-min-emote]').forEach(button => { button.disabled = Boolean(activity); });
    const pose = activity?.kind || emote?.kind || 'idle';
    if (lastPose !== pose) { lastPose = pose; renderAppearances(profile); }
  }
  subscribeProfile(update);
  const interval = setInterval(update, 250);
  window.addEventListener('pagehide', () => clearInterval(interval));
  subscribeAccount(account => {
    document.getElementById('min-save-caption').textContent = account.user ? account.message : 'Look & progress saved on this device';
  });
}
