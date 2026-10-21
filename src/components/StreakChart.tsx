import { StyleSheet, View } from 'react-native';
import Svg, { Circle, G, Line, Path } from 'react-native-svg';
import { BADGES, DAY_MS, dateKey, nextBadge, streakDays, streakMs, type State } from '../lib/game';
import { useFont } from '../lib/fontScale';
import { rng, smooth } from './art/primitives';
import { Text } from './Text';
import { C } from './ui';

const SIZE = 230;
const R = 98;
const R2 = 84;

/** Circunferencia "dibujada a mano" (con un temblor mínimo). */
function handCircle(r: number, seed: number) {
  const rand = rng(seed);
  const pts: [number, number][] = [];
  for (let i = 0; i < 36; i++) {
    const a = (i / 36) * Math.PI * 2;
    const rr = r + (rand() - 0.5) * 1.6;
    pts.push([SIZE / 2 + rr * Math.cos(a), SIZE / 2 + rr * Math.sin(a)]);
  }
  return smooth(pts, true);
}

function arc(r: number, frac: number) {
  const f = Math.max(0.0001, Math.min(0.9999, frac));
  const a0 = -Math.PI / 2;
  const a1 = a0 + f * Math.PI * 2;
  const cx = SIZE / 2;
  const x0 = cx + r * Math.cos(a0);
  const y0 = cx + r * Math.sin(a0);
  const x1 = cx + r * Math.cos(a1);
  const y1 = cx + r * Math.sin(a1);
  return `M${x0} ${y0} A${r} ${r} 0 ${f > 0.5 ? 1 : 0} 1 ${x1} ${y1}`;
}

/** Posición (0–1) de un hito en una escala logarítmica de 1 a 365 días. */
const pos = (d: number) => Math.log(1 + d) / Math.log(366);

export function StreakChart({ state, now }: { state: State; now: Date }) {
  const { fs } = useFont();
  const days = streakDays(state, now);
  const ms = streakMs(state, now);
  const hoursFrac = (ms % DAY_MS) / DAY_MS;
  const badge = nextBadge(days);
  const prev = BADGES.filter((b) => b.days <= days).pop();
  const from = prev?.days ?? 0;
  const progress = badge ? (days - from + hoursFrac) / (badge.days - from) : 1;
  const hours = Math.floor((ms % DAY_MS) / 3_600_000);
  const best = Math.max(state.bestStreakDays, days);

  // Últimos 14 días: limpio (dentro de la racha), caída, o antes de empezar.
  const start = state.streakStart ? new Date(state.streakStart) : null;
  const relapseDays = new Set(state.relapses.map((r) => dateKey(new Date(r.at))));
  const last = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(now);
    d.setDate(d.getDate() - (13 - i));
    const k = dateKey(d);
    const fall = relapseDays.has(k);
    const clean = !!start && k >= dateKey(start) && !fall;
    return { k, clean, fall, today: i === 13, wd: 'DLMXJVS'[d.getDay()] };
  });

  return (
    <View style={styles.wrap}>
      <View style={{ width: SIZE, height: SIZE }}>
        <Svg width={SIZE} height={SIZE}>
          <Path d={handCircle(R, 3)} stroke={C.line} strokeWidth={1.2} fill="none" />
          <Path d={handCircle(R2, 5)} stroke={C.line} strokeWidth={1} fill="none" />
          {/* Progreso hacia la siguiente insignia */}
          <Path d={arc(R, progress)} stroke={C.navy} strokeWidth={3} strokeLinecap="round" fill="none" />
          {/* Horas del día en curso */}
          <Path d={arc(R2, hoursFrac)} stroke={C.blue} strokeWidth={1.6} strokeLinecap="round" fill="none" opacity={0.8} />
          {/* Marcas de cada día del tramo actual (si son pocos) */}
          {badge && badge.days - from <= 30 && (
            <G>
              {Array.from({ length: badge.days - from }, (_, i) => {
                const a = -Math.PI / 2 + ((i + 1) / (badge.days - from)) * Math.PI * 2;
                const c = SIZE / 2;
                return (
                  <Line
                    key={i}
                    x1={c + (R + 5) * Math.cos(a)}
                    y1={c + (R + 5) * Math.sin(a)}
                    x2={c + (R + 10) * Math.cos(a)}
                    y2={c + (R + 10) * Math.sin(a)}
                    stroke={i < days - from ? C.navy : C.line}
                    strokeWidth={1.2}
                    strokeLinecap="round"
                  />
                );
              })}
            </G>
          )}
        </Svg>
        <View style={styles.center} pointerEvents="none">
          <Text style={styles.days}>{days}</Text>
          <Text style={[styles.unit, { fontSize: fs(15) }]}>{days === 1 ? 'día en libertad' : 'días en libertad'}</Text>
          <Text style={[styles.sub, { fontSize: fs(12) }]}>+ {hours} h</Text>
        </View>
      </View>

      {badge && (
        <Text style={[styles.next, { fontSize: fs(14) }]}>
          {badge.title} · {badge.days - days === 1 ? 'falta 1 día' : `faltan ${badge.days - days} días`}
        </Text>
      )}

      {/* Camino de hitos */}
      <View style={styles.track}>
        <Svg width="100%" height={34}>
          <Line x1="4%" y1={14} x2="96%" y2={14} stroke={C.line} strokeWidth={1.2} />
          <Line x1="4%" y1={14} x2={`${4 + 92 * pos(Math.min(days, 365))}%`} y2={14} stroke={C.navy} strokeWidth={2} strokeLinecap="round" />
          {BADGES.map((b) => {
            const x = `${4 + 92 * pos(b.days)}%`;
            const ok = best >= b.days;
            const isNext = badge?.days === b.days;
            return (
              <Circle
                key={b.days}
                cx={x}
                cy={14}
                r={isNext ? 5 : 3.5}
                fill={ok ? C.navy : C.bg}
                stroke={isNext ? C.blue : ok ? C.navy : C.muted}
                strokeWidth={1.2}
              />
            );
          })}
        </Svg>
        <View style={styles.trackLabels}>
          {[1, 7, 30, 90, 365].map((d) => (
            <Text key={d} style={[styles.trackLabel, { left: `${4 + 92 * pos(d)}%` }]}>
              {d === 365 ? '1 año' : `${d} d`}
            </Text>
          ))}
        </View>
      </View>

      {/* Últimos 14 días */}
      <View style={styles.daysRow}>
        {last.map((d) => (
          <View key={d.k} style={styles.dayCol}>
            <View
              style={[
                styles.dayDot,
                d.clean && { backgroundColor: C.navy, borderColor: C.navy },
                d.fall && { borderColor: C.red, backgroundColor: C.redSoft },
                d.today && { borderWidth: 1.5, borderColor: C.blue },
              ]}
            />
            <Text style={styles.dayLetter}>{d.wd}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', gap: 10, paddingTop: 6 },
  center: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' },
  days: { fontSize: 76, fontWeight: '300', color: C.ink, lineHeight: 84 },
  unit: { color: C.ink, fontWeight: '400', marginTop: -4 },
  sub: { color: C.muted, fontWeight: '300', marginTop: 2 },
  next: { color: C.muted, fontWeight: '300' },
  track: { width: '100%', marginTop: 4 },
  trackLabels: { height: 16, marginTop: -6 },
  trackLabel: { position: 'absolute', fontSize: 10, color: C.muted, fontWeight: '300', transform: [{ translateX: -10 }] },
  daysRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', paddingHorizontal: 4, marginTop: 4 },
  dayCol: { alignItems: 'center', gap: 4 },
  dayDot: { width: 12, height: 12, borderRadius: 6, borderWidth: 1, borderColor: C.line },
  dayLetter: { fontSize: 9, color: C.muted, fontWeight: '300' },
});
