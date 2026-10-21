// Lógica pura del "juego": rachas, talentos, niveles e insignias.
// Sin imports para poder testearla con `node --test` directamente.

export const DAY_MS = 86_400_000;

export type Relapse = {
  at: string; // ISO
  streakDays: number;
  triggers: string[];
  note: string;
};

export type Profile = {
  name: string;
  why: string;
  contactName: string;
  contactPhone: string;
  ifThen: { when: string; then: string }[];
};

/** Examen de conciencia de una noche. Los campos opcionales se añadieron en la v1.1. */
export type Examen = {
  gratitude: string;
  struggle: string;
  resolution: string;
  godToday?: string; // dónde ha estado Dios hoy
  halt?: string[]; // estados de riesgo del día (HALT…)
  marked?: string[]; // preguntas del examen marcadas para pedir perdón
  sleep?: string[]; // rutina antes de dormir cumplida
  at?: string; // ISO de cuándo se hizo
};

export type State = {
  version: 1;
  profile: Profile | null;
  streakStart: string | null; // ISO del inicio de la racha actual
  creditedDays: number; // días limpios ya premiados en la racha actual
  bestStreakDays: number;
  talents: number;
  missionsByDate: Record<string, string[]>;
  readingsRead: string[]; // claves de fecha
  examens: Record<string, Examen>;
  victories: string[]; // ISO: tentaciones vencidas con el botón de pánico
  relapses: Relapse[];
  confessions: string[]; // ISO
  chaptersRead: string[]; // "mt-5", "jn-15"…
  virtues: VirtuePlan;
  virtueLog: Record<string, string[]>; // fecha → ["castidad:mirada", …] propósitos cumplidos ese día
};

/** Plan de virtudes: en cuáles trabajas, con qué propósitos y desde cuándo. */
export type VirtuePlan = {
  focus: string[];
  actions: Record<string, string[]>;
  since: Record<string, string>; // virtud → fecha en que empezaste
};

export const initialState: State = {
  version: 1,
  profile: null,
  streakStart: null,
  creditedDays: 0,
  bestStreakDays: 0,
  talents: 0,
  missionsByDate: {},
  readingsRead: [],
  examens: {},
  victories: [],
  relapses: [],
  confessions: [],
  chaptersRead: [],
  virtues: { focus: [], actions: {}, since: {} },
  virtueLog: {},
};

// Recompensas (talentos — Mt 25,14-30: hacer fructificar lo recibido)
export const REWARDS = {
  cleanDay: 10,
  victory: 20,
  reading: 10,
  examen: 10,
  confession: 30,
  fullDayBonus: 15,
  chapter: 5,
  virtue: 3,
} as const;

/** Día al que pertenece el examen: hasta las 4:00 cuenta como la noche anterior. */
export function examenKey(d: Date): string {
  return dateKey(d.getHours() < 4 ? new Date(d.getTime() - 5 * 3_600_000) : d);
}

/** Noches seguidas con examen hasta `key` (o hasta la noche anterior si hoy aún no se ha hecho). */
export function examenStreak(state: State, now: Date): number {
  const d = new Date(now.getTime() - (now.getHours() < 4 ? 5 * 3_600_000 : 0));
  if (!state.examens[dateKey(d)]) d.setDate(d.getDate() - 1);
  let n = 0;
  while (state.examens[dateKey(d)]) {
    n++;
    d.setDate(d.getDate() - 1);
  }
  return n;
}

export function dateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function streakMs(state: State, now: Date): number {
  if (!state.streakStart) return 0;
  return Math.max(0, now.getTime() - new Date(state.streakStart).getTime());
}

export function streakDays(state: State, now: Date): number {
  return Math.floor(streakMs(state, now) / DAY_MS);
}

/** Premia los días limpios nuevos y actualiza la mejor racha. Idempotente. */
export function tick(state: State, now: Date): State {
  const days = streakDays(state, now);
  const best = Math.max(state.bestStreakDays, days);
  if (days <= state.creditedDays && best === state.bestStreakDays) return state;
  const newDays = Math.max(0, days - state.creditedDays);
  return {
    ...state,
    creditedDays: Math.max(state.creditedDays, days),
    bestStreakDays: best,
    talents: state.talents + newDays * REWARDS.cleanDay,
  };
}

/** Una caída reinicia la racha, pero NUNCA los talentos ni el nivel. */
export function relapse(state: State, now: Date, triggers: string[], note: string): State {
  const s = tick(state, now);
  return {
    ...s,
    relapses: [...s.relapses, { at: now.toISOString(), streakDays: streakDays(s, now), triggers, note }],
    streakStart: now.toISOString(),
    creditedDays: 0,
  };
}

export function toggleMission(
  state: State,
  key: string,
  missionId: string,
  reward: number,
  totalMissions: number,
): State {
  const done = state.missionsByDate[key] ?? [];
  const has = done.includes(missionId);
  const next = has ? done.filter((m) => m !== missionId) : [...done, missionId];
  let delta = has ? -reward : reward;
  // Bonus por completar toda la regla de vida del día
  const wasFull = done.length === totalMissions;
  const isFull = next.length === totalMissions;
  if (!wasFull && isFull) delta += REWARDS.fullDayBonus;
  if (wasFull && !isFull) delta -= REWARDS.fullDayBonus;
  return {
    ...state,
    missionsByDate: { ...state.missionsByDate, [key]: next },
    talents: Math.max(0, state.talents + delta),
  };
}

export function markReading(state: State, key: string): State {
  if (state.readingsRead.includes(key)) return state;
  return { ...state, readingsRead: [...state.readingsRead, key], talents: state.talents + REWARDS.reading };
}

export function markChapter(state: State, chapterId: string): State {
  if (state.chaptersRead.includes(chapterId)) return state;
  return { ...state, chaptersRead: [...state.chaptersRead, chapterId], talents: state.talents + REWARDS.chapter };
}

export function addVictory(state: State, now: Date): State {
  return { ...state, victories: [...state.victories, now.toISOString()], talents: state.talents + REWARDS.victory };
}

export function addConfession(state: State, now: Date): State {
  return {
    ...state,
    confessions: [...state.confessions, now.toISOString()],
    talents: state.talents + REWARDS.confession,
  };
}

export function saveExamen(
  state: State,
  key: string,
  examen: Examen,
): State {
  const isNew = !state.examens[key];
  return {
    ...state,
    examens: { ...state.examens, [key]: examen },
    talents: state.talents + (isNew ? REWARDS.examen : 0),
  };
}

// ---------- Niveles (dependen de talentos acumulados: nunca bajan) ----------

export type Level = { min: number; name: string; motto: string };

export const LEVELS: Level[] = [
  { min: 0, name: 'Catecúmeno', motto: 'Has decidido empezar. Eso ya es gracia.' },
  { min: 100, name: 'Peregrino', motto: 'Caminas, aunque el camino sea cuesta arriba.' },
  { min: 300, name: 'Discípulo', motto: 'Escuchas cada día la Palabra.' },
  { min: 700, name: 'Centinela', motto: '«Velad y orad para no caer en tentación».' },
  { min: 1500, name: 'Custodio del corazón', motto: 'Guardas tus ojos y tu mente con paz.' },
  { min: 3000, name: 'Miles Christi', motto: 'Soldado de Cristo: luchas con armas de luz.' },
  { min: 6000, name: 'Testigo', motto: 'Tu libertad ya ilumina a otros.' },
  { min: 10000, name: 'Apóstol de la pureza', motto: 'Acompañas a otros en el camino que tú recorriste.' },
];

export function levelFor(talents: number): { level: Level; index: number; next: Level | null; progress: number } {
  let index = 0;
  for (let i = 0; i < LEVELS.length; i++) if (talents >= LEVELS[i].min) index = i;
  const level = LEVELS[index];
  const next = LEVELS[index + 1] ?? null;
  const progress = next ? (talents - level.min) / (next.min - level.min) : 1;
  return { level, index, next, progress: Math.min(1, Math.max(0, progress)) };
}

// ---------- Insignias por racha (dependen de la mejor racha alcanzada) ----------

export type Badge = { days: number; icon: string; title: string; text: string };

export const BADGES: Badge[] = [
  { days: 1, icon: '🌱', title: 'Me levantaré', text: '«Me levantaré, iré a mi padre» (Lc 15,18). El primer día es el más valiente.' },
  { days: 3, icon: '🌅', title: 'Al tercer día', text: 'Tres días: la tradición de la Resurrección. Lo muerto empieza a vivir.' },
  { days: 7, icon: '🕯️', title: 'Una semana', text: 'Siete días completos. Has demostrado que, con Dios, es posible.' },
  { days: 14, icon: '🛡️', title: 'Escudo de la fe', text: '«Embrazad el escudo de la fe» (Ef 6,16). Dos semanas de lucha.' },
  { days: 30, icon: '⚓', title: 'Un mes', text: 'Treinta días. Has demostrado que es posible.' },
  { days: 40, icon: '🏜️', title: 'Cuarenta días', text: 'Como Cristo en el desierto (Mt 4,1-11): tentado y vencedor.' },
  { days: 66, icon: '🔁', title: 'Nuevo hábito', text: 'Un estudio (Lally et al., 2010) halló una media de 66 días para automatizar un hábito.' },
  { days: 90, icon: '⛰️', title: 'Noventa días', text: 'Hito clásico en los programas de recuperación. Tu libertad se consolida.' },
  { days: 180, icon: '🌳', title: 'Medio año', text: '«Será como árbol plantado junto a acequias» (Sal 1,3).' },
  { days: 365, icon: '👑', title: 'Un año de fidelidad', text: '«He combatido el buen combate» (2 Tim 4,7). Corona de un año.' },
];

export function unlockedBadges(best: number): Badge[] {
  return BADGES.filter((b) => best >= b.days);
}

export function nextBadge(current: number): Badge | null {
  return BADGES.find((b) => b.days > current) ?? null;
}

/** Cuenta los disparadores más frecuentes en las caídas. */
export function topTriggers(relapses: Relapse[], n = 3): { trigger: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const r of relapses) for (const t of r.triggers) counts.set(t, (counts.get(t) ?? 0) + 1);
  return [...counts.entries()]
    .map(([trigger, count]) => ({ trigger, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, n);
}

// ---------- Virtudes (vencer el mal con el bien, Rom 12,21) ----------

export const MAX_VIRTUES = 3;
export const MAX_VIRTUE_ACTIONS = 3;

/** Empieza o deja de trabajar una virtud. Al empezar, propone sus primeros propósitos. */
export function setVirtueFocus(state: State, virtueId: string, on: boolean, defaults: string[], key: string): State {
  const v = state.virtues;
  const has = v.focus.includes(virtueId);
  if (on === has) return state;
  if (on && v.focus.length >= MAX_VIRTUES) return state;
  return {
    ...state,
    virtues: {
      focus: on ? [...v.focus, virtueId] : v.focus.filter((x) => x !== virtueId),
      actions: on && !v.actions[virtueId]?.length ? { ...v.actions, [virtueId]: defaults.slice(0, MAX_VIRTUE_ACTIONS) } : v.actions,
      since: on ? { ...v.since, [virtueId]: key } : v.since,
    },
  };
}

/** Activa o quita un propósito de una virtud (máximo MAX_VIRTUE_ACTIONS). */
export function toggleVirtueAction(state: State, virtueId: string, actionId: string): State {
  const cur = state.virtues.actions[virtueId] ?? [];
  const has = cur.includes(actionId);
  if (!has && cur.length >= MAX_VIRTUE_ACTIONS) return state;
  const next = has ? cur.filter((a) => a !== actionId) : [...cur, actionId];
  return { ...state, virtues: { ...state.virtues, actions: { ...state.virtues.actions, [virtueId]: next } } };
}

/** Marca o desmarca un propósito como cumplido en una fecha (+/- talentos). */
export function logVirtue(state: State, key: string, virtueId: string, actionId: string): State {
  const id = `${virtueId}:${actionId}`;
  const day = state.virtueLog[key] ?? [];
  const has = day.includes(id);
  return {
    ...state,
    virtueLog: { ...state.virtueLog, [key]: has ? day.filter((x) => x !== id) : [...day, id] },
    talents: Math.max(0, state.talents + (has ? -REWARDS.virtue : REWARDS.virtue)),
  };
}

export type VirtueLevel = { min: number; name: string; text: string };

// Niveles de crecimiento (Mc 4,26-29: la semilla que crece sola).
export const VIRTUE_LEVELS: VirtueLevel[] = [
  { min: 0, name: 'Semilla', text: 'Has sembrado. Dios hace crecer.' },
  { min: 7, name: 'Brote', text: 'Ya asoma: la virtud empieza a verse.' },
  { min: 21, name: 'Raíz', text: 'Echa raíces: cuesta menos que al principio.' },
  { min: 50, name: 'Árbol', text: 'Firme ante el viento: es parte de ti.' },
  { min: 100, name: 'Fruto', text: 'Da fruto para otros (Jn 15,5).' },
];

export function virtueStats(state: State, virtueId: string, now: Date) {
  const prefix = `${virtueId}:`;
  const countOn = (key: string) => (state.virtueLog[key] ?? []).filter((x) => x.startsWith(prefix)).length;
  let total = 0;
  for (const k in state.virtueLog) total += countOn(k);
  // Últimos 28 días (el último es hoy)
  const days = Array.from({ length: 28 }, (_, i) => {
    const d = new Date(now);
    d.setDate(d.getDate() - (27 - i));
    const key = dateKey(d);
    return { key, count: countOn(key) };
  });
  // Días seguidos con al menos un propósito cumplido (hoy cuenta si ya lo has hecho)
  let streak = 0;
  for (let i = days.length - 1; i >= 0; i--) {
    if (days[i].count > 0) streak++;
    else if (i === days.length - 1) continue;
    else break;
  }
  const level = [...VIRTUE_LEVELS].reverse().find((l) => total >= l.min)!;
  const next = VIRTUE_LEVELS.find((l) => l.min > total) ?? null;
  const progress = next ? (total - level.min) / (next.min - level.min) : 1;
  const today = (state.virtueLog[dateKey(now)] ?? []).filter((x) => x.startsWith(prefix)).map((x) => x.slice(prefix.length));
  const week = days.slice(-7).reduce((a, d) => a + d.count, 0);
  return { total, days, streak, level, next, progress, today, week };
}
