/**
 * Оформление заказа: модальное окно с формой, валидацией и экраном «принято».
 * Отправка имитируется (submitOrder) — точка подключения к бэкенду одна.
 */
import { el, qs, qsa, render } from '../core/dom.js';
import { createOverlay } from '../core/overlay.js';
import { formatPhone, isValidPhone, orderNumber, positions, price } from '../core/format.js';
import { cart, cartStore, selectCount, selectTotals } from './cart.js';
import { toast } from './toast.js';

const METHOD_LABEL = {
  inhouse: 'В зале',
  pickup: 'Самовывоз',
  delivery: 'Доставка',
};

export function initOrder() {
  const root = qs('#order');
  const form = qs('#order-form', root);
  const success = qs('#order-success', root);
  const linesEl = qs('#order-lines', root);
  const totalsEl = qs('#order-totals', root);
  const addressField = qs('[data-field="address"]', form);
  const submitBtn = qs('#order-submit', form);

  const overlay = createOverlay(root, {
    initialFocus: '#order-name',
    onClose: () => resetView(),
  });

  function currentMethod() {
    return qs('input[name="method"]:checked', form)?.value ?? 'pickup';
  }

  function resetView() {
    form.hidden = false;
    success.hidden = true;
  }

  // ── Живое состояние формы ──────────────────────────────────────────────
  form.addEventListener('change', (event) => {
    if (event.target.name === 'method') drawSummary();
  });

  const phoneInput = qs('#order-phone', form);
  phoneInput.addEventListener('input', () => {
    const start = phoneInput.selectionStart === phoneInput.value.length;
    phoneInput.value = formatPhone(phoneInput.value);
    if (start) phoneInput.setSelectionRange(phoneInput.value.length, phoneInput.value.length);
    clearError(phoneInput);
  });

  form.addEventListener('input', (event) => {
    if (event.target.matches('input, textarea, select')) clearError(event.target);
  });

  // ── Отрисовка состава заказа ───────────────────────────────────────────
  function drawSummary() {
    const state = cartStore.get();
    const method = currentMethod();
    const totals = selectTotals(method, state);

    addressField.hidden = method !== 'delivery';
    qs('#order-address', form).required = method === 'delivery';

    render(linesEl, state.lines.map((line) =>
      el('li', { class: 'order-line' }, [
        el('span', { class: 'order-line__name' }, `${line.name} × ${line.qty}`),
        el('span', { class: 'order-line__sum' }, price(line.price * line.qty)),
      ])));

    render(totalsEl, [
      row('Позиции', positions(selectCount(state))),
      totals.delivery > 0 && row('Доставка', price(totals.delivery)),
      method === 'delivery' && totals.delivery === 0 && selectCount(state) > 0
        && row('Доставка', 'бесплатно', 'is-accent'),
      method === 'delivery' && totals.leftToFree > 0
        && el('p', { class: 'order-hint' },
          `До бесплатной доставки — ${price(totals.leftToFree)}`),
      el('div', { class: 'order-total' }, [
        el('span', {}, 'Итого'),
        el('strong', {}, price(totals.total)),
      ]),
    ]);

    submitBtn.disabled = selectCount(state) === 0;
  }

  cartStore.subscribe(() => {
    if (overlay.isOpen) drawSummary();
  }, { immediate: false });

  // ── Отправка ───────────────────────────────────────────────────────────
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!validate(form, currentMethod())) return;

    submitBtn.disabled = true;
    submitBtn.classList.add('is-loading');

    const data = Object.fromEntries(new FormData(form));
    const state = cartStore.get();
    const number = await submitOrder({
      ...data,
      lines: state.lines,
      totals: selectTotals(currentMethod(), state),
    });

    submitBtn.classList.remove('is-loading');
    submitBtn.disabled = false;

    // экран подтверждения
    qs('#order-number', success).textContent = number;
    qs('#order-method-note', success).textContent = noteFor(currentMethod(), data);
    form.hidden = true;
    success.hidden = false;
    qs('#order-success-close', success)?.focus({ preventScroll: true });

    cart.clear();
    form.reset();
    toast('Заказ принят — мы позвоним для подтверждения', { tone: 'success' });
  });

  qsa('[data-order-close]', root).forEach((btn) =>
    btn.addEventListener('click', () => overlay.close()));

  return {
    open() {
      if (selectCount() === 0) {
        toast('Корзина пуста — выберите что-нибудь из меню');
        qs('#menu')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
      resetView();
      drawSummary();
      overlay.open();
    },
  };
}

// ── Вспомогательное ───────────────────────────────────────────────────────

function row(label, value, cls = '') {
  return el('div', { class: `order-row ${cls}` }, [
    el('span', {}, label),
    el('span', {}, value),
  ]);
}

function noteFor(method, data) {
  if (method === 'delivery') return `Курьер приедет по адресу: ${data.address}`;
  if (method === 'pickup') return 'Заберёте на стойке — скажите номер заказа';
  return 'Ждём вас в зале. Столик придержим 20 минут';
}

function setError(input, message) {
  const field = input.closest('.field');
  field?.classList.add('has-error');
  input.setAttribute('aria-invalid', 'true');
  const hint = field?.querySelector('.field__error');
  if (hint) hint.textContent = message;
}

function clearError(input) {
  const field = input.closest('.field');
  field?.classList.remove('has-error');
  input.removeAttribute('aria-invalid');
}

function validate(form, method) {
  const name = qs('#order-name', form);
  const phone = qs('#order-phone', form);
  const address = qs('#order-address', form);
  let firstInvalid = null;

  const fail = (input, message) => {
    setError(input, message);
    firstInvalid ??= input;
  };

  if (name.value.trim().length < 2) fail(name, 'Как к вам обращаться?');
  if (!isValidPhone(phone.value)) fail(phone, 'Нужен номер из 11 цифр');
  if (method === 'delivery' && address.value.trim().length < 5) {
    fail(address, 'Укажите улицу и дом');
  }

  firstInvalid?.focus();
  return !firstInvalid;
}

/**
 * Здесь появится POST /api/orders. Пока — имитация сети.
 * @returns {Promise<string>} номер заказа
 */
async function submitOrder(payload) {
  console.info('[Годекан] заказ отправлен', payload);
  await new Promise((resolve) => setTimeout(resolve, 700));
  return orderNumber();
}
