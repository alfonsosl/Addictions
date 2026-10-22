import type { SceneId } from '../components/art/scenes';

// Ilustración de fondo para cada capítulo de los Evangelios, según su escena principal.
// Si un capítulo no tiene una escena propia, se usa la del Evangelio entero.
const BOOK_DEFAULT: Record<string, SceneId> = { mt: 'mountain', mc: 'sea', lc: 'path', jn: 'light' };

const BY_CHAPTER: Record<string, SceneId> = {
  // Mateo
  'mt-1': 'night', 'mt-2': 'stars', 'mt-3': 'dove', 'mt-4': 'sea', 'mt-5': 'mountain', 'mt-6': 'field', 'mt-7': 'mountain',
  'mt-8': 'storm', 'mt-9': 'path', 'mt-10': 'field', 'mt-11': 'well', 'mt-13': 'tree', 'mt-14': 'sea', 'mt-15': 'bread',
  'mt-17': 'mountain', 'mt-18': 'flock', 'mt-20': 'vine', 'mt-21': 'vine', 'mt-25': 'light', 'mt-26': 'garden', 'mt-27': 'cross', 'mt-28': 'tomb',
  // Marcos
  'mc-1': 'dove', 'mc-2': 'path', 'mc-4': 'storm', 'mc-5': 'sea', 'mc-6': 'bread', 'mc-8': 'bread', 'mc-9': 'mountain', 'mc-10': 'path',
  'mc-12': 'vine', 'mc-14': 'garden', 'mc-15': 'cross', 'mc-16': 'tomb',
  // Lucas
  'lc-1': 'mary', 'lc-2': 'night', 'lc-3': 'dove', 'lc-5': 'nets', 'lc-6': 'mountain', 'lc-8': 'field', 'lc-9': 'bread',
  'lc-10': 'path', 'lc-11': 'light', 'lc-12': 'field', 'lc-13': 'tree', 'lc-15': 'flock', 'lc-19': 'tree', 'lc-22': 'garden', 'lc-23': 'cross', 'lc-24': 'tomb',
  // Juan
  'jn-1': 'light', 'jn-2': 'vine', 'jn-3': 'night', 'jn-4': 'well', 'jn-6': 'bread', 'jn-7': 'well', 'jn-8': 'light', 'jn-9': 'light',
  'jn-10': 'shepherd', 'jn-11': 'tomb', 'jn-12': 'field', 'jn-13': 'bread', 'jn-14': 'path', 'jn-15': 'vine', 'jn-17': 'heart',
  'jn-19': 'cross', 'jn-20': 'tomb', 'jn-21': 'nets',
};

export function sceneForChapter(book: string, ch: number): SceneId {
  return BY_CHAPTER[`${book}-${ch}`] ?? BOOK_DEFAULT[book] ?? 'light';
}

const BOOK_NAMES: [RegExp, string][] = [
  [/^(san\s+)?(mt|mat|mateo)\b/i, 'mt'],
  [/^(san\s+)?(mc|mr|mar|marcos)\b/i, 'mc'],
  [/^(san\s+)?(lc|luc|lucas)\b/i, 'lc'],
  [/^(san\s+)?(jn|juan)\b/i, 'jn'],
];

/** Escena para una cita del Evangelio del día («Lc 15,1-10», «San Juan 3:16»…). */
export function sceneForReference(ref: string | undefined, fallback: SceneId = 'light'): SceneId {
  if (!ref) return fallback;
  const r = ref.trim().replace(/^evangelio\s+(seg[uú]n\s+)?/i, '');
  for (const [re, book] of BOOK_NAMES) {
    const m = r.match(re);
    if (m) {
      const ch = parseInt(r.slice(m[0].length).match(/\d+/)?.[0] ?? '', 10);
      return Number.isNaN(ch) ? BOOK_DEFAULT[book] : sceneForChapter(book, ch);
    }
  }
  return fallback;
}
