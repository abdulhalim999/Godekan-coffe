/** Шапка: мобильное меню, подсветка активного раздела, тень при прокрутке. */
import { lockScroll, qs, qsa } from '../core/dom.js';

export function initNav() {
  const header = qs('#header');
  const toggle = qs('#nav-toggle');
  const nav = qs('#nav');
  const links = qsa('a[href^="#"]', nav);

  // ── Мобильное меню ─────────────────────────────────────────────────────
  const setOpen = (open) => {
    nav.classList.toggle('is-open', open);
    toggle.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
    lockScroll(open);
  };

  toggle.addEventListener('click', () => setOpen(!nav.classList.contains('is-open')));
  links.forEach((link) => link.addEventListener('click', () => setOpen(false)));

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && nav.classList.contains('is-open')) {
      setOpen(false);
      toggle.focus();
    }
  });

  // возврат к десктопной раскладке гасит мобильное состояние
  const desktop = window.matchMedia('(min-width: 60rem)');
  desktop.addEventListener('change', (event) => {
    if (event.matches) setOpen(false);
  });

  // ── Тень шапки ─────────────────────────────────────────────────────────
  const onScroll = () => header.classList.toggle('is-stuck', window.scrollY > 8);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // ── Подсветка активного раздела ────────────────────────────────────────
  const sections = links
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  if (sections.length) {
    const spy = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        links.forEach((link) => {
          const active = link.getAttribute('href') === `#${entry.target.id}`;
          link.classList.toggle('is-active', active);
          if (active) link.setAttribute('aria-current', 'true');
          else link.removeAttribute('aria-current');
        });
      }
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

    sections.forEach((section) => spy.observe(section));
  }
}
