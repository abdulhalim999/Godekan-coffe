/**
 * Состояние корзины и операции над ним. Никакого DOM — только данные.
 * Сохраняется в localStorage, поэтому переживает перезагрузку страницы.
 */
import { createStore } from '../core/store.js';

const DELIVERY_FEE = 200;
const FREE_DELIVERY_FROM = 1500;

/** @typedef {{id:string,name:string,price:number,qty:number,volume?:string}} CartLine */

export const cartStore = createStore(
  /** @type {{ lines: CartLine[] }} */ ({ lines: [] }),
  {
    persist: { key: 'godekan.cart' },
    migrate: (raw) => ({
      lines: Array.isArray(raw?.lines)
        ? raw.lines.filter((l) => l && typeof l.id === 'string' && l.qty > 0)
        : [],
    }),
  },
);

export const cart = {
  /** @param {{id:string,name:string,price:number,volume?:string}} item */
  add(item, qty = 1) {
    cartStore.set(({ lines }) => {
      const existing = lines.find((line) => line.id === item.id);
      return {
        lines: existing
          ? lines.map((line) =>
              line.id === item.id ? { ...line, qty: Math.min(99, line.qty + qty) } : line)
          : [...lines, { id: item.id, name: item.name, price: item.price, volume: item.volume, qty }],
      };
    });
  },

  setQty(id, qty) {
    cartStore.set(({ lines }) => ({
      lines: qty <= 0
        ? lines.filter((line) => line.id !== id)
        : lines.map((line) => (line.id === id ? { ...line, qty: Math.min(99, qty) } : line)),
    }));
  },

  increment: (id, step = 1) => {
    const line = cartStore.get().lines.find((l) => l.id === id);
    if (line) cart.setQty(id, line.qty + step);
  },

  remove: (id) => cart.setQty(id, 0),

  clear: () => cartStore.set({ lines: [] }),
};

// ── Селекторы ─────────────────────────────────────────────────────────────

export const selectCount = (state = cartStore.get()) =>
  state.lines.reduce((sum, line) => sum + line.qty, 0);

export const selectSubtotal = (state = cartStore.get()) =>
  state.lines.reduce((sum, line) => sum + line.price * line.qty, 0);

export const selectQty = (id, state = cartStore.get()) =>
  state.lines.find((line) => line.id === id)?.qty ?? 0;

/**
 * Итог с учётом способа получения.
 * @param {'pickup'|'delivery'|'inhouse'} method
 */
export function selectTotals(method = 'pickup', state = cartStore.get()) {
  const subtotal = selectSubtotal(state);
  const delivery =
    method === 'delivery' && subtotal > 0 && subtotal < FREE_DELIVERY_FROM ? DELIVERY_FEE : 0;
  return {
    subtotal,
    delivery,
    total: subtotal + delivery,
    freeDeliveryFrom: FREE_DELIVERY_FROM,
    leftToFree: Math.max(0, FREE_DELIVERY_FROM - subtotal),
  };
}
