/**
 * Тема: светлая / тёмная / системная.
 * Выбор хранится в localStorage; до отрисовки его применяет инлайн-скрипт
 * в <head> (см. index.html) — поэтому мигания белым не бывает.
 */
import { createStore } from '../core/store.js';

const STORAGE_KEY = 'godekan.theme';
const ORDER = ['light', 'dark', 'system'];

const LABELS = {
  light: 'Светлая тема',
  dark: 'Тёмная тема',
  system: 'Как в системе',
};

const META_COLOR = { light: '#f4ece0', dark: '#15120f' };

const media = window.matchMedia('(prefers-color-scheme: dark)');

export const themeStore = createStore(
  { mode: readStoredMode() },
  { persist: { key: STORAGE_KEY } },
);

function readStoredMode() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const mode = raw ? JSON.parse(raw).mode : null;
    return ORDER.includes(mode) ? mode : 'system';
  } catch {
    return 'system';
  }
}

/** Фактическая тема с учётом системной настройки. */
export function resolved(mode = themeStore.get().mode) {
  return mode === 'system' ? (media.matches ? 'dark' : 'light') : mode;
}

function apply(mode) {
  const theme = resolved(mode);
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute('content', META_COLOR[theme]);
}

/**
 * @param {HTMLButtonElement} button — переключатель в шапке
 */
export function initTheme(button) {
  themeStore.subscribe(({ mode }) => {
    apply(mode);

    if (!button) return;
    const theme = resolved(mode);
    button.dataset.mode = mode;
    button.setAttribute('aria-label', `${LABELS[mode]}. Переключить`);
    button.title = LABELS[mode];
    button.querySelector('.theme-toggle__label').textContent =
      mode === 'system' ? 'Авто' : theme === 'dark' ? 'Ночь' : 'День';
  });

  // Система сменила тему, пока выбран режим «как в системе»
  media.addEventListener('change', () => {
    if (themeStore.get().mode === 'system') apply('system');
  });

  button?.addEventListener('click', () => {
    const next = ORDER[(ORDER.indexOf(themeStore.get().mode) + 1) % ORDER.length];
    themeStore.set({ mode: next });
  });
}
