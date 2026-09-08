/** Всплывающие уведомления. Одна живая область с aria-live. */
import { el, qs } from '../core/dom.js';

let region;

function ensureRegion() {
  if (region) return region;
  region = qs('#toasts') ?? document.body.appendChild(
    el('div', { id: 'toasts', class: 'toasts', role: 'status', 'aria-live': 'polite' }),
  );
  return region;
}

/**
 * @param {string} message
 * @param {{ timeout?: number, tone?: 'default'|'success' }} [options]
 */
export function toast(message, { timeout = 2600, tone = 'default' } = {}) {
  const node = el('div', { class: `toast toast--${tone}` }, message);
  ensureRegion().append(node);

  requestAnimationFrame(() => node.classList.add('is-visible'));

  setTimeout(() => {
    node.classList.remove('is-visible');
    node.addEventListener('transitionend', () => node.remove(), { once: true });
    setTimeout(() => node.remove(), 500);
  }, timeout);
}
