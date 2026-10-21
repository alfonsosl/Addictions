import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  initialState,
  tick,
  relapse,
  toggleMission,
  levelFor,
  unlockedBadges,
  nextBadge,
  topTriggers,
  markReading,
  saveExamen,
  examenKey,
  examenStreak,
  setVirtueFocus,
  toggleVirtueAction,
  logVirtue,
  virtueStats,
  markChapter,
  REWARDS,
  DAY_MS,
} from '../src/lib/game.ts';

const start = new Date('2026-01-01T08:00:00Z');
const at = (days: number) => new Date(start.getTime() + days * DAY_MS);

test('tick premia cada día limpio una sola vez', () => {
  let s = { ...initialState, streakStart: start.toISOString() };
  s = tick(s, at(3.5));
  assert.equal(s.talents, 3 * REWARDS.cleanDay);
  assert.equal(s.bestStreakDays, 3);
  const again = tick(s, at(3.9));
  assert.equal(again, s, 'idempotente dentro del mismo día');
});

test('una caída reinicia la racha pero conserva talentos y mejor racha', () => {
  let s = tick({ ...initialState, streakStart: start.toISOString() }, at(10));
  s = relapse(s, at(10.2), ['Soledad'], '');
  assert.equal(s.talents, 10 * REWARDS.cleanDay);
  assert.equal(s.bestStreakDays, 10);
  assert.equal(s.creditedDays, 0);
  assert.equal(s.relapses.length, 1);
  assert.equal(s.relapses[0].streakDays, 10);
  s = tick(s, at(12.3));
  assert.equal(s.talents, 12 * REWARDS.cleanDay, '2 días nuevos tras la caída');
  assert.equal(s.bestStreakDays, 10);
});

test('misiones: marcar/desmarcar y bonus de día completo', () => {
  let s = initialState;
  s = toggleMission(s, '2026-01-01', 'a', 5, 2);
  assert.equal(s.talents, 5);
  s = toggleMission(s, '2026-01-01', 'b', 5, 2);
  assert.equal(s.talents, 10 + REWARDS.fullDayBonus);
  s = toggleMission(s, '2026-01-01', 'b', 5, 2);
  assert.equal(s.talents, 5);
});

test('lecturas y examen solo premian una vez por día', () => {
  let s = markReading(initialState, 'd');
  s = markReading(s, 'd');
  assert.equal(s.talents, REWARDS.reading);
  const ex = { gratitude: 'x', struggle: '', resolution: '' };
  s = saveExamen(s, 'd', ex);
  s = saveExamen(s, 'd', ex);
  assert.equal(s.talents, REWARDS.reading + REWARDS.examen);
});

test('niveles e insignias', () => {
  assert.equal(levelFor(0).level.name, 'Catecúmeno');
  assert.equal(levelFor(150).level.name, 'Peregrino');
  assert.equal(levelFor(200).progress, 0.5);
  assert.equal(levelFor(99999).next, null);
  assert.equal(unlockedBadges(7).length, 3);
  assert.equal(nextBadge(7)?.days, 14);
  assert.equal(nextBadge(365), null);
});

test('disparadores más frecuentes', () => {
  const r = (t: string[]) => ({ at: '', streakDays: 0, triggers: t, note: '' });
  const top = topTriggers([r(['Soledad', 'Noche']), r(['Soledad']), r(['Estrés'])]);
  assert.deepEqual(top[0], { trigger: 'Soledad', count: 2 });
});

test('capítulos del Evangelio: premio una sola vez', () => {
  let s = markChapter(initialState, 'jn-15');
  s = markChapter(s, 'jn-15');
  assert.equal(s.talents, REWARDS.chapter);
  assert.deepEqual(s.chaptersRead, ['jn-15']);
});

test('el examen de madrugada cuenta para la noche anterior', () => {
  assert.equal(examenKey(new Date(2026, 9, 21, 1, 30)), '2026-10-20');
  assert.equal(examenKey(new Date(2026, 9, 21, 23, 0)), '2026-10-21');
});

test('racha de exámenes: noches seguidas, sin romperse si hoy aún no se ha hecho', () => {
  const ex = { gratitude: '', struggle: '', resolution: '' };
  let s = { ...initialState };
  s = saveExamen(s, '2026-10-18', ex);
  s = saveExamen(s, '2026-10-19', ex);
  s = saveExamen(s, '2026-10-20', ex);
  assert.equal(examenStreak(s, new Date(2026, 9, 21, 12, 0)), 3);
  s = saveExamen(s, '2026-10-21', ex);
  assert.equal(examenStreak(s, new Date(2026, 9, 21, 23, 0)), 4);
  assert.equal(examenStreak(s, new Date(2026, 9, 23, 12, 0)), 0);
});

test('virtudes: máximo 3, propósitos por defecto y seguimiento con talentos', () => {
  let s = { ...initialState };
  s = setVirtueFocus(s, 'castidad', true, ['a', 'b', 'c', 'd'], '2026-10-20');
  assert.deepEqual(s.virtues.actions.castidad, ['a', 'b', 'c']);
  s = setVirtueFocus(s, 'templanza', true, ['x'], 'k');
  s = setVirtueFocus(s, 'humildad', true, ['y'], 'k');
  s = setVirtueFocus(s, 'caridad', true, ['z'], 'k');
  assert.equal(s.virtues.focus.length, 3);
  // no se pueden elegir más de 3 propósitos
  assert.equal(toggleVirtueAction(s, 'castidad', 'd').virtues.actions.castidad.length, 3);
  s = toggleVirtueAction(s, 'castidad', 'c');
  s = toggleVirtueAction(s, 'castidad', 'd');
  assert.deepEqual(s.virtues.actions.castidad, ['a', 'b', 'd']);
  // marcar suma talentos; desmarcar los quita
  s = logVirtue(s, '2026-10-20', 'castidad', 'a');
  s = logVirtue(s, '2026-10-21', 'castidad', 'a');
  s = logVirtue(s, '2026-10-21', 'castidad', 'b');
  assert.equal(s.talents, 3 * REWARDS.virtue);
  const st = virtueStats(s, 'castidad', new Date(2026, 9, 21, 20, 0));
  assert.equal(st.total, 3);
  assert.equal(st.streak, 2);
  assert.deepEqual(st.today, ['a', 'b']);
  assert.equal(st.level.name, 'Semilla');
  s = logVirtue(s, '2026-10-21', 'castidad', 'b');
  assert.equal(s.talents, 2 * REWARDS.virtue);
  // la racha no se rompe si hoy aún no has marcado nada
  assert.equal(virtueStats(s, 'castidad', new Date(2026, 9, 22, 9, 0)).streak, 2);
});
