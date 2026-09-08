/**
 * Общее поведение оверлеев (корзина, модалка заказа):
 * ловушка фокуса, Escape, возврат фокуса, блокировка прокрутки.
 * Один контроллер на оверлей — переиспользуется и корзиной, и модалкой.
 */
import { lockScroll, qsa } from './dom.js';

const FOCUSABLE = [
  'a[href]', 'button:not([disabled])', 'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])', 'textarea:not([disabled])', '[tabindex]:not([tabindex="-1"])',
].join(',');

/**
 * @param {HTMLElement} root — контейнер оверлея с [hidden]
 * @param {{ onClose?: () => void, initialFocus?: string }} [options]
 */
export function createOverlay(root, { onClose, initialFocus } = {}) {
  let lastActive = null;
  let open = false;

  function focusables() {
    return qsa(FOCUSABLE, root).filter((node) => node.offsetParent !== null);
  }

  function onKeydown(event) {
    if (event.key === 'Escape') {
      event.preventDefault();
      controller.close();
      return;
    }
    if (event.key !== 'Tab') return;

    const items = focusables();
    if (items.length === 0) return;

    const first = items[0];
    const last = items[items.length - 1];
    const active = document.activeElement;

    if (event.shiftKey && (active === first || !root.contains(active))) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  }

  const controller = {
    get isOpen() {
      return open;
    },

    open() {
      if (open) return;
      open = true;
      lastActive = document.activeElement;
      root.hidden = false;
      // следующий кадр — чтобы сработал CSS-переход появления
      requestAnimationFrame(() => root.classList.add('is-open'));
      lockScroll(true);
      document.addEventListener('keydown', onKeydown);

      const target = (initialFocus && root.querySelector(initialFocus)) || focusables()[0];
      target?.focus({ preventScroll: true });
    },

    close() {
      if (!open) return;
      open = false;
      root.classList.remove('is-open');
      document.removeEventListener('keydown', onKeydown);
      lockScroll(false);

      const finish = () => {
        root.hidden = true;
      };
      const duration = Number.parseFloat(getComputedStyle(root).transitionDuration) * 1000;
      if (duration > 0) setTimeout(finish, duration);
      else finish();

      lastActive?.focus?.({ preventScroll: true });
      onClose?.();
    },

    toggle() {
      open ? controller.close() : controller.open();
    },
  };

  // клик по подложке закрывает оверлей
  root.addEventListener('mousedown', (event) => {
    if (event.target.matches('[data-overlay-backdrop]')) controller.close();
  });

  return controller;
}
