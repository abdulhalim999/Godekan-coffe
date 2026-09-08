/**
 * Крошечный реактивный стор: неизменяемое состояние + подписки.
 * Достаточно для приложения такого размера и не тянет ни одной зависимости.
 */

/**
 * @template T
 * @param {T} initialState
 * @param {{ persist?: { key: string, storage?: Storage }, migrate?: (raw: any) => T }} [options]
 */
export function createStore(initialState, options = {}) {
  const { persist, migrate } = options;
  const listeners = new Set();

  let state = persist ? restore(persist, initialState, migrate) : initialState;

  function notify(prev) {
    for (const listener of listeners) listener(state, prev);
  }

  return {
    /** @returns {T} */
    get: () => state,

    /**
     * Принимает объект-патч или редьюсер. Всегда создаёт новый объект состояния.
     * @param {Partial<T> | ((prev: T) => Partial<T>)} patch
     */
    set(patch) {
      const prev = state;
      const next = typeof patch === 'function' ? patch(prev) : patch;
      state = Object.freeze({ ...prev, ...next });
      if (persist) save(persist, state);
      notify(prev);
      return state;
    },

    /** @param {(state: T, prev: T) => void} listener */
    subscribe(listener, { immediate = true } = {}) {
      listeners.add(listener);
      if (immediate) listener(state, state);
      return () => listeners.delete(listener);
    },
  };
}

function restore(persist, fallback, migrate) {
  try {
    const storage = persist.storage ?? localStorage;
    const raw = storage.getItem(persist.key);
    if (!raw) return Object.freeze(fallback);
    const parsed = JSON.parse(raw);
    return Object.freeze(migrate ? migrate(parsed) : { ...fallback, ...parsed });
  } catch {
    return Object.freeze(fallback);
  }
}

function save(persist, state) {
  try {
    (persist.storage ?? localStorage).setItem(persist.key, JSON.stringify(state));
  } catch {
    /* приватный режим или переполнение — не критично */
  }
}
