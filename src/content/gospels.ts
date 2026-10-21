// Los cuatro Evangelios: índice de capítulos y texto completo sin conexión.
// Texto: La Sagrada Biblia, traducción de Félix Torres Amat (1823-1825), edición de 1882. Dominio público.
// Se genera con scripts/gospels/build.py (ver README, «Texto de los Evangelios»).
import GOSPEL_TEXT_JSON from './gospel-text.json';

export type GospelBook = {
  id: 'mt' | 'mc' | 'lc' | 'jn';
  name: string;
  short: string;
  slug: string; // slug de bible.usccb.org
  icon: string;
  intro: string;
  chapters: string[]; // título de cada capítulo (índice 0 = capítulo 1)
};

export const GOSPELS: GospelBook[] = [
  {
    id: 'mt',
    name: 'Evangelio según san Mateo',
    short: 'Mateo',
    slug: 'matthew',
    icon: '👤',
    intro: 'Jesús, el Mesías prometido, que enseña con autoridad en el Sermón del monte.',
    chapters: [
      'Genealogía y nacimiento de Jesús',
      'Los Magos de Oriente; huida a Egipto',
      'Juan el Bautista; bautismo de Jesús',
      'Tentaciones en el desierto; primeros discípulos',
      'Sermón del monte: Bienaventuranzas, sal y luz',
      'La limosna, la oración (Padrenuestro) y el ayuno',
      'No juzguéis; la puerta estrecha; la casa sobre roca',
      'Curaciones; Jesús calma la tempestad',
      'Vocación de Mateo; curaciones; la hija de Jairo',
      'Misión de los Doce',
      '«Venid a mí todos los que estáis cansados»',
      'Señor del sábado; la señal de Jonás',
      'Parábolas del Reino: sembrador, cizaña, tesoro',
      'Muerte del Bautista; panes; Jesús camina sobre el agua',
      'Lo que mancha al hombre; la mujer cananea',
      'Confesión de Pedro; primer anuncio de la Pasión',
      'La Transfiguración',
      'La oveja perdida; perdonar setenta veces siete',
      'El matrimonio; el joven rico',
      'Los obreros de la viña; el que quiera ser grande, que sirva',
      'Entrada en Jerusalén; purificación del templo',
      'El banquete de bodas; el mandamiento principal',
      'Advertencias a escribas y fariseos',
      'Discurso sobre el fin de los tiempos: velad',
      'Las diez vírgenes; los talentos; el juicio final',
      'Última Cena; Getsemaní; prendimiento',
      'Pasión y muerte de Jesús',
      'Resurrección y envío misionero',
    ],
  },
  {
    id: 'mc',
    name: 'Evangelio según san Marcos',
    short: 'Marcos',
    slug: 'mark',
    icon: '🦁',
    intro: 'El Evangelio más breve y directo: Jesús, Hijo de Dios, en acción.',
    chapters: [
      'Bautismo, tentaciones y primeros milagros',
      'El paralítico; vocación de Leví; el sábado',
      'Elección de los Doce; la verdadera familia de Jesús',
      'Parábolas del Reino; Jesús calma la tempestad',
      'El endemoniado de Gerasa; la hija de Jairo',
      'Rechazo en Nazaret; panes; Jesús sobre el agua',
      'Lo que sale del corazón; la sirofenicia; el sordomudo',
      'Segunda multiplicación; confesión de Pedro',
      'La Transfiguración; el niño endemoniado',
      'El matrimonio; los niños; el joven rico; Bartimeo',
      'Entrada en Jerusalén; la higuera; el templo',
      'Los viñadores; el mandamiento principal; la viuda pobre',
      'Discurso sobre el fin: «Velad»',
      'Unción en Betania; Última Cena; Getsemaní',
      'Pasión y muerte de Jesús',
      'Resurrección',
    ],
  },
  {
    id: 'lc',
    name: 'Evangelio según san Lucas',
    short: 'Lucas',
    slug: 'luke',
    icon: '🐂',
    intro: 'El Evangelio de la misericordia: el hijo pródigo, el buen samaritano, Zaqueo.',
    chapters: [
      'Anunciaciones; la Visitación; el Magníficat',
      'Nacimiento de Jesús; presentación en el templo',
      'Predicación del Bautista; genealogía',
      'Tentaciones; Jesús en Nazaret; curaciones',
      'Pesca milagrosa; el leproso; el paralítico',
      'Elección de los Doce; Bienaventuranzas; amar a los enemigos',
      'El centurión; la viuda de Naín; la pecadora perdonada',
      'El sembrador; la tempestad; la hija de Jairo',
      'Misión de los Doce; panes; Transfiguración',
      'Los setenta y dos; el buen samaritano; Marta y María',
      'El Padrenuestro; «pedid y se os dará»',
      'Confianza en la Providencia; estad vigilantes',
      'Llamada a la conversión; la puerta estrecha',
      'Los últimos puestos; el gran banquete',
      'La oveja perdida, la moneda y el hijo pródigo',
      'El administrador astuto; el rico y Lázaro',
      'El perdón; los diez leprosos',
      'La viuda insistente; el fariseo y el publicano',
      'Zaqueo; las minas; entrada en Jerusalén',
      'La autoridad de Jesús; la resurrección de los muertos',
      'La ofrenda de la viuda; el fin de los tiempos',
      'Última Cena; Getsemaní; negaciones de Pedro',
      'Pasión y muerte; el buen ladrón',
      'Resurrección; Emaús; Ascensión',
    ],
  },
  {
    id: 'jn',
    name: 'Evangelio según san Juan',
    short: 'Juan',
    slug: 'john',
    icon: '🦅',
    intro: 'El Evangelio del amor: «Dios es amor» hecho carne en Jesús.',
    chapters: [
      'Prólogo: el Verbo se hizo carne; primeros discípulos',
      'Las bodas de Caná; purificación del templo',
      'Nicodemo: nacer de nuevo',
      'La samaritana; el hijo del funcionario',
      'El paralítico de Betesda; el Hijo y el Padre',
      'El pan de vida',
      'Jesús en la fiesta de las Tiendas',
      'La adúltera; «la verdad os hará libres»',
      'El ciego de nacimiento',
      'El Buen Pastor',
      'Resurrección de Lázaro',
      'Unción en Betania; el grano de trigo',
      'Lavatorio de los pies; el mandamiento nuevo',
      '«Yo soy el camino, la verdad y la vida»',
      'La vid y los sarmientos',
      'El Espíritu Santo; la tristeza se convertirá en alegría',
      'La oración sacerdotal de Jesús',
      'Prendimiento; Jesús ante Anás y Pilato',
      'Crucifixión y muerte',
      'Resurrección; Tomás',
      'Aparición junto al lago; «¿Me amas?»',
    ],
  },
];

/** Capítulos especialmente útiles en la lucha por la pureza. */
export const RECOMMENDED: { book: GospelBook['id']; ch: number; why: string }[] = [
  { book: 'mt', ch: 4, why: 'Cómo vence Jesús la tentación' },
  { book: 'mt', ch: 5, why: '«Bienaventurados los limpios de corazón»' },
  { book: 'lc', ch: 15, why: 'La misericordia del Padre tras la caída' },
  { book: 'jn', ch: 8, why: '«Tampoco yo te condeno… la verdad os hará libres»' },
  { book: 'mt', ch: 26, why: '«Velad y orad para no caer en tentación»' },
  { book: 'jn', ch: 15, why: '«Sin mí no podéis hacer nada»' },
];

export const TOTAL_CHAPTERS = GOSPELS.reduce((n, g) => n + g.chapters.length, 0); // 89

export const chapterId = (book: string, ch: number) => `${book}-${ch}`;

export function onlineUrl(book: GospelBook, ch: number) {
  return `https://bible.usccb.org/es/bible/${book.slug}/${ch}`;
}

/** Texto de cada Evangelio: [capítulo][versículo]. "" = versículo perdido en la digitalización. */
export const GOSPEL_TEXT = GOSPEL_TEXT_JSON as Record<GospelBook['id'], string[][]>;

export const TEXT_CREDIT =
  'La Sagrada Biblia, trad. de Félix Torres Amat (1823-1825), ed. de 1882. Dominio público. ' +
  'Digitalización del proyecto biblia-elim, revisada para Vigilia frente a la Vulgata. ' +
  'Ortografía original con acentos modernizados en «a, e, o, u» y «Jesús».';

/** Primer capítulo sin leer, en orden canónico (para «Continuar leyendo»). */
export function nextUnread(read: string[]): { book: GospelBook; ch: number } | null {
  for (const g of GOSPELS) {
    for (let i = 1; i <= g.chapters.length; i++) if (!read.includes(chapterId(g.id, i))) return { book: g, ch: i };
  }
  return null;
}
