/**
 * Витрина ассортимента (демо-данные).
 * Единственный источник правды для меню. При подключении бэкенда
 * достаточно переписать fetchMenu() — контракт и UI останутся прежними.
 */

/** @typedef {'coffee'|'author'|'tea'|'bakery'|'breakfast'|'dessert'} CategoryId */

export const CATEGORIES = [
  { id: 'all', title: 'Всё меню', icon: 'ornament' },
  { id: 'coffee', title: 'Кофе', icon: 'cup' },
  { id: 'author', title: 'Авторские', icon: 'star' },
  { id: 'tea', title: 'Чай и травы', icon: 'leaf' },
  { id: 'bakery', title: 'Горская выпечка', icon: 'bread' },
  { id: 'breakfast', title: 'Завтраки', icon: 'sun' },
  { id: 'dessert', title: 'Десерты', icon: 'honey' },
];

/** Метки-бейджи для карточек. */
export const BADGES = {
  hit: { label: 'Хит', tone: 'accent' },
  new: { label: 'Новинка', tone: 'gold' },
  veg: { label: 'Веган', tone: 'green' },
  spicy: { label: 'Острое', tone: 'red' },
};

/** @type {Array<{id:string,name:string,category:CategoryId,price:number,volume?:string,desc:string,badges?:string[]}>} */
export const MENU = [
  // ── Кофе ────────────────────────────────────────────────────────────────
  {
    id: 'esp-godekan', category: 'coffee', name: 'Эспрессо «Годекан»', price: 180, volume: '40 мл',
    desc: 'Плотный, тёмный, с нотой чёрного шоколада и грецкого ореха. Фирменный бленд.',
    badges: ['hit'],
  },
  {
    id: 'esp-double', category: 'coffee', name: 'Двойной эспрессо', price: 230, volume: '80 мл',
    desc: 'Для тех, кто пришёл говорить долго.',
  },
  {
    id: 'americano', category: 'coffee', name: 'Американо', price: 210, volume: '250 мл',
    desc: 'Мягкий прозрачный вкус с лёгкой кислинкой горного мёда.',
  },
  {
    id: 'cappuccino', category: 'coffee', name: 'Капучино', price: 280, volume: '250 мл',
    desc: 'Бархатная пена, тёплая карамель и щепотка корицы по желанию.',
    badges: ['hit'],
  },
  {
    id: 'flat-white', category: 'coffee', name: 'Флэт-уайт', price: 300, volume: '200 мл',
    desc: 'Двойная порция и тонкий слой молока — вкус зерна на первом плане.',
  },
  {
    id: 'latte', category: 'coffee', name: 'Латте', price: 290, volume: '350 мл',
    desc: 'Спокойный и молочный, как утро в ауле.',
  },
  {
    id: 'turka', category: 'coffee', name: 'Кофе на песке', price: 320, volume: '100 мл',
    desc: 'Варим в турке на раскалённом песке, с кардамоном. Подаём с ледяной водой и халвой.',
    badges: ['hit'],
  },

  // ── Авторские ───────────────────────────────────────────────────────────
  {
    id: 'raf-chabrec', category: 'author', name: 'Раф на чабреце', price: 340, volume: '300 мл',
    desc: 'Сливочный раф, настоянный на горном тимьяне и цветочном мёде.',
    badges: ['hit'],
  },
  {
    id: 'urbech-latte', category: 'author', name: 'Латте с урбечом', price: 350, volume: '350 мл',
    desc: 'Урбеч из абрикосовой косточки, миндальная горчинка, финиковый сироп.',
    badges: ['new'],
  },
  {
    id: 'cocoa-urbech', category: 'author', name: 'Какао с урбечом', price: 330, volume: '300 мл',
    desc: 'Густое какао с льняным урбечом и морской солью.',
  },
  {
    id: 'raf-halva', category: 'author', name: 'Раф «Халва»', price: 350, volume: '300 мл',
    desc: 'Подсолнечная халва, взбитая со сливками, — вкус из сельского магазина.',
    badges: ['new'],
  },
  {
    id: 'bumbar', category: 'author', name: 'Бумбар-кофе', price: 360, volume: '250 мл',
    desc: 'Эспрессо, топлёное молоко, курага и грецкий орех. Наша выдумка.',
  },

  // ── Чай и травы ─────────────────────────────────────────────────────────
  {
    id: 'mountain-tea', category: 'tea', name: 'Горный чай', price: 260, volume: 'чайник 500 мл',
    desc: 'Чабрец, душица, зверобой, шиповник — собраны на склонах.',
    badges: ['veg'],
  },
  {
    id: 'ivan-tea', category: 'tea', name: 'Иван-чай с мёдом', price: 240, volume: 'чайник 500 мл',
    desc: 'Ферментированный кипрей, липовый мёд, долька лимона.',
    badges: ['veg'],
  },
  {
    id: 'oblepiha', category: 'tea', name: 'Облепиховый', price: 280, volume: 'чайник 500 мл',
    desc: 'Кислый и яркий, с имбирём и апельсином. Греет с первого глотка.',
  },
  {
    id: 'kalmyk', category: 'tea', name: 'Калмыцкий чай', price: 250, volume: '300 мл',
    desc: 'Солёный чай на молоке с маслом и чёрным перцем. На любителя — и таких много.',
  },
  {
    id: 'sherbet', category: 'tea', name: 'Домашний щербет', price: 220, volume: '400 мл',
    desc: 'Холодный напиток на кураге, изюме и мяте.',
    badges: ['veg'],
  },

  // ── Горская выпечка ─────────────────────────────────────────────────────
  {
    id: 'chudu-tvorog', category: 'bakery', name: 'Чуду с творогом и зеленью', price: 320, volume: '1 шт.',
    desc: 'Тонкое тесто, домашний творог, кинза и зелёный лук. Со сливочным маслом.',
    badges: ['hit'],
  },
  {
    id: 'chudu-meat', category: 'bakery', name: 'Чуду с мясом', price: 380, volume: '1 шт.',
    desc: 'Рубленая говядина с луком и перцем, тесто раскатано вручную.',
  },
  {
    id: 'chudu-pumpkin', category: 'bakery', name: 'Чуду с тыквой', price: 300, volume: '1 шт.',
    desc: 'Сладковатая тыква с грецким орехом.',
    badges: ['veg'],
  },
  {
    id: 'kurze', category: 'bakery', name: 'Курзе с мясом', price: 460, volume: '8 шт.',
    desc: 'Косичка ручной лепки, бульон внутри. Подаём со сметаной и уксусным соусом.',
    badges: ['hit'],
  },
  {
    id: 'hinkal', category: 'bakery', name: 'Аварский хинкал', price: 620, volume: 'порция',
    desc: 'Пышные галушки, отварная говядина, чесночный соус и бульон в пиале.',
  },
  {
    id: 'botishal', category: 'bakery', name: 'Ботишал', price: 340, volume: '1 шт.',
    desc: 'Лепёшка с творогом и картофелем, обжаренная на сухой сковороде.',
  },

  // ── Завтраки ────────────────────────────────────────────────────────────
  {
    id: 'kasha', category: 'breakfast', name: 'Каша на топлёном молоке', price: 290, volume: '300 г',
    desc: 'Овсяная, с грушей, урбечом и корицей. До 12:00 — кофе за полцены.',
  },
  {
    id: 'eggs-kurdyuk', category: 'breakfast', name: 'Яичница с курдюком', price: 380, volume: '250 г',
    desc: 'Три яйца, вяленое мясо, томаты, зелёный лук, горячая лепёшка.',
    badges: ['hit'],
  },
  {
    id: 'tvorog-med', category: 'breakfast', name: 'Творог с мёдом и урбечом', price: 310, volume: '250 г',
    desc: 'Домашний творог, горный мёд, урбеч и грецкий орех.',
  },
  {
    id: 'shakshuka', category: 'breakfast', name: 'Шакшука по-горски', price: 420, volume: '300 г',
    desc: 'Яйца в томатах с аджикой и сулугуни. Остро и бодро.',
    badges: ['spicy'],
  },

  // ── Десерты ─────────────────────────────────────────────────────────────
  {
    id: 'bahlava', category: 'dessert', name: 'Бахлава медовая', price: 240, volume: '2 шт.',
    desc: 'Слоёное тесто, орехи, мёд. Печём каждое утро.',
    badges: ['hit'],
  },
  {
    id: 'halva', category: 'dessert', name: 'Халва домашняя', price: 180, volume: '120 г',
    desc: 'Мучная халва на топлёном масле — плотная и тёплая.',
  },
  {
    id: 'urbech-set', category: 'dessert', name: 'Урбеч-сет с лепёшкой', price: 350, volume: '3 вида',
    desc: 'Лён, абрикосовая косточка, конопля. С мёдом, маслом и горячей лепёшкой.',
    badges: ['veg'],
  },
  {
    id: 'chak-chak', category: 'dessert', name: 'Чак-чак', price: 220, volume: '150 г',
    desc: 'Хрустящие палочки в медовом сиропе.',
    badges: ['veg'],
  },
  {
    id: 'tiramisu', category: 'dessert', name: 'Тирамису «Горец»', price: 360, volume: '160 г',
    desc: 'Классика, но с кофе на песке и урбечом вместо какао сверху.',
    badges: ['new'],
  },
  {
    id: 'abrikos', category: 'dessert', name: 'Абрикосовый пирог', price: 280, volume: '150 г',
    desc: 'Песочное тесто и сушёные абрикосы из Гуниба.',
  },
];

/**
 * Асинхронная точка входа — здесь появится fetch('/api/menu').
 * @returns {Promise<{categories: typeof CATEGORIES, items: typeof MENU}>}
 */
export async function fetchMenu() {
  return { categories: CATEGORIES, items: MENU };
}
