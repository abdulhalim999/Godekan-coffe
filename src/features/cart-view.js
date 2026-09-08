/** Панель корзины, счётчики в шапке и нижняя панель заказа на мобильных. */
import { delegate, el, icon, qs, qsa, render } from '../core/dom.js';
import { createOverlay } from '../core/overlay.js';
import { positions, price } from '../core/format.js';
import { cart, cartStore, selectCount, selectSubtotal } from './cart.js';

export function initCartView({ onCheckout }) {
  const root = qs('#cart');
  const list = qs('#cart-lines', root);
  const empty = qs('#cart-empty', root);
  const summary = qs('#cart-summary', root);
  const subtotalEl = qs('#cart-subtotal', root);
  const checkoutBtn = qs('#cart-checkout', root);
  const orderBar = qs('#order-bar');

  const overlay = createOverlay(root, { initialFocus: '#cart-close' });

  // открытие/закрытие
  qsa('[data-cart-open]').forEach((btn) => btn.addEventListener('click', () => overlay.open()));
  qsa('[data-cart-close]', root).forEach((btn) => btn.addEventListener('click', () => overlay.close()));

  // действия внутри списка — через делегирование
  delegate(list, 'click', '[data-action]', (_event, target) => {
    const { action, id } = target.dataset;
    if (action === 'inc') cart.increment(id, 1);
    if (action === 'dec') cart.increment(id, -1);
    if (action === 'remove') cart.remove(id);
  });

  qs('#cart-clear', root)?.addEventListener('click', () => cart.clear());
  checkoutBtn.addEventListener('click', () => {
    overlay.close();
    onCheckout?.();
  });

  cartStore.subscribe((state) => {
    const count = selectCount(state);
    const subtotal = selectSubtotal(state);

    render(list, state.lines.map(lineView));
    empty.hidden = count > 0;
    summary.hidden = count === 0;
    subtotalEl.textContent = price(subtotal);

    // счётчики в шапке
    qsa('[data-cart-count]').forEach((node) => {
      node.textContent = String(count);
      node.hidden = count === 0;
    });
    qsa('[data-cart-open]').forEach((node) => {
      node.setAttribute('aria-label', count ? `Корзина, ${positions(count)}` : 'Корзина пуста');
    });

    // нижняя панель на мобильных
    if (orderBar) {
      orderBar.classList.toggle('is-visible', count > 0);
      qs('[data-bar-count]', orderBar).textContent = positions(count);
      qs('[data-bar-total]', orderBar).textContent = price(subtotal);
    }
  });

  return overlay;
}

function lineView(line) {
  return el('li', { class: 'cart-line', 'data-id': line.id }, [
    el('div', { class: 'cart-line__thumb', 'aria-hidden': 'true' }, icon('cup', 'icon icon--lg')),
    el('div', { class: 'cart-line__body' }, [
      el('p', { class: 'cart-line__name' }, line.name),
      line.volume && el('p', { class: 'cart-line__meta' }, line.volume),
      el('p', { class: 'cart-line__price' }, price(line.price * line.qty)),
    ]),
    el('div', { class: 'cart-line__controls' }, [
      el('div', { class: 'stepper' }, [
        el('button', {
          class: 'stepper__btn', type: 'button',
          dataset: { action: 'dec', id: line.id },
          'aria-label': `Убрать одну «${line.name}»`,
        }, '−'),
        el('span', { class: 'stepper__value', 'aria-live': 'polite' }, String(line.qty)),
        el('button', {
          class: 'stepper__btn', type: 'button',
          dataset: { action: 'inc', id: line.id },
          'aria-label': `Добавить одну «${line.name}»`,
        }, '+'),
      ]),
      el('button', {
        class: 'cart-line__remove', type: 'button',
        dataset: { action: 'remove', id: line.id },
        'aria-label': `Удалить «${line.name}» из корзины`,
      }, icon('trash')),
    ]),
  ]);
}
