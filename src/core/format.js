/** Форматирование чисел и склонения. */

const rub = new Intl.NumberFormat('ru-RU', {
  style: 'currency',
  currency: 'RUB',
  maximumFractionDigits: 0,
});

/** 320 → «320 ₽» */
export const price = (value) => rub.format(value).replace(/\s/g, ' ');

const pluralRules = new Intl.PluralRules('ru-RU');

/**
 * Склонение по числу.
 * @param {number} count
 * @param {{one: string, few: string, many: string}} forms
 */
export function plural(count, forms) {
  const rule = pluralRules.select(count);
  return forms[rule] ?? forms.many;
}

/** «3 позиции» */
export const positions = (n) =>
  `${n} ${plural(n, { one: 'позиция', few: 'позиции', many: 'позиций' })}`;

/** Номер заказа вида ГД-4821. */
export function orderNumber() {
  return `ГД-${Math.floor(1000 + Math.random() * 9000)}`;
}

/** Нормализация телефона к виду +7 (999) 123-45-67 по мере ввода. */
export function formatPhone(input) {
  const digits = input.replace(/\D/g, '').replace(/^8/, '7').slice(0, 11);
  if (!digits) return '';
  const body = digits.startsWith('7') ? digits.slice(1) : digits;
  const parts = [
    body.slice(0, 3),
    body.slice(3, 6),
    body.slice(6, 8),
    body.slice(8, 10),
  ].filter(Boolean);

  let out = '+7';
  if (parts[0]) out += ` (${parts[0]}`;
  if (parts[0]?.length === 3) out += ')';
  if (parts[1]) out += ` ${parts[1]}`;
  if (parts[2]) out += `-${parts[2]}`;
  if (parts[3]) out += `-${parts[3]}`;
  return out;
}

export const isValidPhone = (value) => value.replace(/\D/g, '').length === 11;
