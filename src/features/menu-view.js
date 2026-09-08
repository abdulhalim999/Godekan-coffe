/** Меню: фильтры по категориям, поиск и сетка карточек. */
import { delegate, el, icon, qs, render } from '../core/dom.js';
import { price } from '../core/format.js';
import { createStore } from '../core/store.js';
import { BADGES } from '../data/menu.js';
import { cart, cartStore, selectQty } from './cart.js';
import { toast } from './toast.js';

const CATEGORY_ICON = {
  all: 'ornament', coffee: 'cup', author: 'star',
  tea: 'leaf', bakery: 'bread', breakfast: 'sun', dessert: 'honey',
};

export function initMenu({ categories, items }) {
  const filtersEl = qs('#menu-filters');
  const gridEl = qs('#menu-grid');
  const emptyEl = qs('#menu-empty');
  const searchEl = qs('#menu-search');
  const countEl = qs('#menu-count');

  const ui = createStore({ category: 'all', query: '' });

  // ── Фильтры ────────────────────────────────────────────────────────────
  render(
    filtersEl,
    categories.map((category) =>
      el('button', {
        class: 'chip', type: 'button', role: 'tab',
        dataset: { category: category.id },
        'aria-selected': String(category.id === 'all'),
      }, [icon(CATEGORY_ICON[category.id] ?? 'ornament', 'icon chip__icon'), category.title])),
  );

  delegate(filtersEl, 'click', '[data-category]', (_event, target) => {
    ui.set({ category: target.dataset.category });
    target.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
  });

  // клавиатурная навигация по вкладкам-фильтрам
  filtersEl.addEventListener('keydown', (event) => {
    if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
    const chips = [...filtersEl.querySelectorAll('.chip')];
    const index = chips.indexOf(document.activeElement);
    if (index < 0) return;
    event.preventDefault();
    const next = chips[(index + (event.key === 'ArrowRight' ? 1 : -1) + chips.length) % chips.length];
    next.focus();
    next.click();
  });

  // ── Поиск ──────────────────────────────────────────────────────────────
  let debounce;
  searchEl?.addEventListener('input', (event) => {
    clearTimeout(debounce);
    const value = event.target.value;
    debounce = setTimeout(() => ui.set({ query: value.trim().toLowerCase() }), 150);
  });

  // ── Добавление в корзину ───────────────────────────────────────────────
  delegate(gridEl, 'click', '[data-action]', (_event, target) => {
    const { action, id } = target.dataset;
    const item = items.find((entry) => entry.id === id);
    if (!item) return;

    if (action === 'add') {
      cart.add(item);
      toast(`«${item.name}» — в корзине`, { tone: 'success' });
    }
    if (action === 'inc') cart.increment(id, 1);
    if (action === 'dec') cart.increment(id, -1);
  });

  // ── Отрисовка ──────────────────────────────────────────────────────────
  function visible() {
    const { category, query } = ui.get();
    return items.filter((item) => {
      const byCategory = category === 'all' || item.category === category;
      const byQuery = !query
        || item.name.toLowerCase().includes(query)
        || item.desc.toLowerCase().includes(query);
      return byCategory && byQuery;
    });
  }

  function draw() {
    const list = visible();
    const { category } = ui.get();

    filtersEl.querySelectorAll('.chip').forEach((chip) => {
      chip.setAttribute('aria-selected', String(chip.dataset.category === category));
    });

    render(gridEl, list.map(cardView));
    emptyEl.hidden = list.length > 0;
    if (countEl) countEl.textContent = String(list.length);
  }

  ui.subscribe(draw, { immediate: false });
  // перерисовываем карточки, когда меняется корзина (кнопка → степпер)
  cartStore.subscribe(draw, { immediate: false });
  draw();
}

function cardView(item) {
  const qty = selectQty(item.id);

  return el('article', { class: 'card', 'data-id': item.id }, [
    el('div', { class: 'card__thumb', 'aria-hidden': 'true' }, [
      el('span', { class: 'card__pattern' }),
      icon(CATEGORY_ICON[item.category] ?? 'cup', 'icon card__icon'),
    ]),

    el('div', { class: 'card__body' }, [
      item.badges?.length && el('div', { class: 'card__badges' },
        item.badges.map((key) =>
          el('span', { class: `badge badge--${BADGES[key]?.tone ?? 'accent'}` },
            BADGES[key]?.label ?? key))),

      el('h3', { class: 'card__title' }, item.name),
      item.volume && el('p', { class: 'card__meta' }, item.volume),
      el('p', { class: 'card__desc' }, item.desc),

      el('div', { class: 'card__footer' }, [
        el('span', { class: 'card__price' }, price(item.price)),
        qty > 0
          ? el('div', { class: 'stepper stepper--card' }, [
              el('button', {
                class: 'stepper__btn', type: 'button',
                dataset: { action: 'dec', id: item.id },
                'aria-label': `Убрать одну «${item.name}»`,
              }, '−'),
              el('span', { class: 'stepper__value' }, String(qty)),
              el('button', {
                class: 'stepper__btn', type: 'button',
                dataset: { action: 'inc', id: item.id },
                'aria-label': `Добавить одну «${item.name}»`,
              }, '+'),
            ])
          : el('button', {
              class: 'btn btn--ghost btn--sm', type: 'button',
              dataset: { action: 'add', id: item.id },
              'aria-label': `Добавить «${item.name}» в корзину`,
            }, [icon('plus'), 'В заказ']),
      ]),
    ]),
  ]);
}
