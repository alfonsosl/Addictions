import AsyncStorage from '@react-native-async-storage/async-storage';

// Lecturas del día según el calendario litúrgico católico.
// Fuente: feed público de Evangelizo (evangeliodeldia.org). Si falla (sin red, cambio de API),
// la pantalla ofrece enlaces a fuentes oficiales.

export type Reading = { key: 'FR' | 'PS' | 'SR' | 'GSP'; label: string; reference: string; text: string };
export type Commentary = { title: string; author: string; source: string; text: string };
export type DayReadings = {
  date: string;
  liturgicalTitle: string;
  readings: Reading[];
  commentary: Commentary | null;
  source: string;
};

const FEED = 'https://feed.evangelizo.org/v2/reader.php';
const LABELS: Record<Reading['key'], string> = {
  FR: 'Primera lectura',
  PS: 'Salmo responsorial',
  SR: 'Segunda lectura',
  GSP: 'Evangelio',
};

function yyyymmdd(d: Date) {
  return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
}

function clean(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

async function get(params: Record<string, string>, timeoutMs = 10_000): Promise<string> {
  const qs = new URLSearchParams({ lang: 'SP', ...params }).toString();
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(`${FEED}?${qs}`, { signal: ctrl.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return clean(await res.text());
  } finally {
    clearTimeout(t);
  }
}

export async function fetchReadings(d: Date): Promise<DayReadings> {
  const date = yyyymmdd(d);
  const cacheKey = `vigilia:readings:v2:${date}`;
  try {
    const cached = await AsyncStorage.getItem(cacheKey);
    if (cached) return JSON.parse(cached);
  } catch {}

  const keys: Reading['key'][] = ['FR', 'PS', 'SR', 'GSP'];
  const opt = (params: Record<string, string>) => get({ date, ...params }).catch(() => '');
  // Comentario del día al Evangelio (santos, papas y sacerdotes), con su autor y su fuente.
  const commentaryP = Promise.all([
    opt({ type: 'comment_t' }),
    opt({ type: 'comment_a' }),
    opt({ type: 'comment_s' }),
    opt({ type: 'comment' }),
  ]);
  const [liturgicalTitle, ...parts] = await Promise.all([
    opt({ type: 'liturgic_t' }),
    ...keys.flatMap((content) => [
      get({ date, type: 'reading_lt', content }).catch(() => ''),
      get({ date, type: 'reading', content }).catch(() => ''),
    ]),
  ]);

  const readings: Reading[] = [];
  keys.forEach((key, i) => {
    const reference = parts[i * 2];
    const text = parts[i * 2 + 1];
    if (text) readings.push({ key, label: LABELS[key], reference, text });
  });
  if (!readings.some((r) => r.key === 'GSP')) throw new Error('No se pudo obtener el Evangelio');

  const [cTitle, cAuthor, cSource, cText] = await commentaryP;
  const commentary = cText ? { title: cTitle, author: cAuthor, source: cSource, text: cText } : null;
  const result: DayReadings = { date, liturgicalTitle, readings, commentary, source: 'evangeliodeldia.org' };
  try {
    await AsyncStorage.setItem(cacheKey, JSON.stringify(result));
  } catch {}
  return result;
}

/** Enlaces a fuentes oficiales para leer en el navegador (también como respaldo). */
export function officialLinks(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return [
    { label: 'Vatican News — Evangelio de hoy', url: `https://www.vaticannews.va/es/evangelio-de-hoy/${y}/${m}/${day}.html` },
    { label: 'Evangelio del día (Evangelizo)', url: 'https://evangeliodeldia.org/SP/gospel' },
    { label: 'evangeli.net — Evangelio y comentario', url: 'https://evangeli.net/evangelio' },
  ];
}
