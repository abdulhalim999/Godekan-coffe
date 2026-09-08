/** Минимальные DOM-утилиты. Без зависимостей, без виртуального дерева. */

/** @type {(sel: string, root?: ParentNode) => HTMLElement|null} */
export const qs = (sel, root = document) => root.querySelector(sel);

/** @type {(sel: string, root?: ParentNode) => HTMLElement[]} */
export const qsa = (sel, root = document) => Array.from(root.querySelectorAll(sel));

/**
 * Создаёт элемент. Атрибуты: обычные строки, `class`, `dataset`, `on*` — слушатели.
 * @param {string} tag
 * @param {Record<string, any>} [attrs]
 * @param {Array<Node|string>|Node|string} [children]
 * @returns {HTMLElement}
 */
export function el(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);

  for (const [key, value] of Object.entries(attrs)) {
    if (value === null || value === undefined || value === false) continue;

    if (key === 'class') node.className = value;
    else if (key === 'dataset') Object.assign(node.dataset, value);
    else if (key === 'html') node.innerHTML = value;
    else if (key.startsWith('on') && typeof value === 'function') {
      node.addEventListener(key.slice(2).toLowerCase(), value);
    } else if (value === true) node.setAttribute(key, '');
    else node.setAttribute(key, String(value));
  }

  for (const child of [].concat(children)) {
    if (child === null || child === undefined || child === false) continue;
    node.append(child instanceof Node ? child : document.createTextNode(String(child)));
  }

  return node;
}

/** Иконка из спрайта в index.html. */
export function icon(name, cls = 'icon') {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('class', cls);
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');
  const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
  use.setAttribute('href', `#i-${name}`);
  svg.append(use);
  return svg;
}

/** Полная замена содержимого узла. */
export function render(root, ...children) {
  root.replaceChildren(...children.flat().filter(Boolean));
  return root;
}

/** Делегирование событий: один слушатель на контейнер. */
export function delegate(root, type, selector, handler) {
  root.addEventListener(type, (event) => {
    const target = event.target.closest(selector);
    if (target && root.contains(target)) handler(event, target);
  });
}

/** Блокировка прокрутки фона при открытых оверлеях (с учётом ширины скроллбара). */
let scrollLocks = 0;
export function lockScroll(lock) {
  scrollLocks = Math.max(0, scrollLocks + (lock ? 1 : -1));
  const locked = scrollLocks > 0;
  const gap = window.innerWidth - document.documentElement.clientWidth;
  document.documentElement.classList.toggle('is-scroll-locked', locked);
  document.body.style.paddingRight = locked && gap > 0 ? `${gap}px` : '';
}

/** Пользователь просил меньше анимации. */
export const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;
