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

export type State = {
  version: 1;
  profile: Profile | null;
  streakStart: string | null; // ISO del inicio de la racha actual
  creditedDays: number; // días limpios ya premiados en la racha actual
  bestStreakDays: number;
  talents: number;
  missionsByDate: Record<string, string[]>;
  readingsRead: string[]; // claves de fecha
  examens: Record<string, { gratitude: string; struggle: string; resolution: string }>;
  victories: string[]; // ISO: tentaciones vencidas con el botón de pánico
  relapses: Relapse[];
  confessions: string[]; // ISO
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
};

// Recompensas (talentos — Mt 25,14-30: hacer fructificar lo recibido)
export const REWARDS = {
  cleanDay: 10,
  victory: 20,
  reading: 10,
  examen: 10,
  confession: 30,
  fullDayBonus: 15,
} as const;

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
  examen: { gratitude: string; struggle: string; resolution: string },
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
  { days: 7, icon: '🕯️', title: 'Una semana', text: 'Siete días completos. Tu cerebro empieza a notar el cambio.' },
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
