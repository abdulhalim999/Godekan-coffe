/**
 * Точка входа. Собирает независимые модули и связывает их между собой.
 * Порядок: тема → навигация → данные меню → корзина → заказ → анимации.
 */
import { qs, qsa } from './core/dom.js';
import { fetchMenu } from './data/menu.js';
import { initTheme } from './features/theme.js';
import { initNav } from './features/nav.js';
import { initMenu } from './features/menu-view.js';
import { initCartView } from './features/cart-view.js';
import { initOrder } from './features/order.js';
import { initReveal } from './features/reveal.js';

async function bootstrap() {
  initTheme(qs('#theme-toggle'));
  initNav();

  const order = initOrder();
  initCartView({ onCheckout: () => order.open() });

  // Любая кнопка «Оформить заказ» на странице
  qsa('[data-order-open]').forEach((btn) =>
    btn.addEventListener('click', () => order.open()));

  const { categories, items } = await fetchMenu();
  initMenu({ categories, items });

  initReveal();

  qs('#year').textContent = String(new Date().getFullYear());
  document.documentElement.classList.add('is-ready');
}

bootstrap().catch((error) => {
  console.error('[Годекан] не удалось запустить приложение', error);
  document.documentElement.classList.add('is-ready');
});
