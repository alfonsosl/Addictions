import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { virtueById } from '../content/virtues';
import { useFont } from '../lib/fontScale';
import { virtueStats } from '../lib/game';
import { useStore } from '../lib/store';
import { Glyph } from './icons';
import { Pressable } from './Tap';
import { Text } from './Text';
import { C, ProgressBar } from './ui';

/** Casilla de un propósito de virtud: se marca con un toque y vibra al cumplirlo. */
export function VirtueCheck({ virtueId, actionId, dark, dateKey }: { virtueId: string; actionId: string; dark?: boolean; dateKey?: string }) {
  const { state, today, logVirtue } = useStore();
  const { t } = useFont();
  const v = virtueById(virtueId);
  const a = v?.actions.find((x) => x.id === actionId);
  if (!v || !a) return null;
  const key = dateKey ?? today;
  const done = (state.virtueLog[key] ?? []).includes(`${virtueId}:${actionId}`);
  const ink = dark ? '#fff' : C.ink;
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked: done }}
      accessibilityLabel={a.text}
      onPress={() => logVirtue(virtueId, actionId, key)}
      feedback={false}
      style={styles.check}
    >
      <View style={[styles.box, dark && styles.boxDark, done && (dark ? styles.boxOnDark : styles.boxOn)]}>
        {done && <Glyph e="✓" size={15} color={dark ? C.night : '#fff'} width={2.2} />}
      </View>
      <View style={{ flex: 1 }}>
        <Text style={t([styles.checkText, { color: ink }, done && !dark && { color: C.muted }])}>{a.text}</Text>
        {a.hint ? <Text style={t([styles.hint, dark && { color: 'rgba(255,255,255,0.6)' }])}>{a.hint}</Text> : null}
      </View>
    </Pressable>
  );
}

/** Últimos 28 días: un punto por día, más intenso cuantos más propósitos se cumplieron. */
export function VirtueHeat({ days }: { days: { key: string; count: number }[] }) {
  return (
    <View style={styles.heat}>
      {days.map((d, i) => (
        <View
          key={d.key}
          style={[
            styles.cell,
            d.count > 0 && { backgroundColor: C.navy, opacity: Math.min(1, 0.35 + d.count * 0.22), borderColor: C.navy },
            i === days.length - 1 && { borderColor: C.blue, borderWidth: 1.5 },
          ]}
        />
      ))}
    </View>
  );
}

/** Tarjeta de una virtud en la que trabajas: nivel, propósitos de hoy y seguimiento. */
export function VirtueCard({ virtueId }: { virtueId: string }) {
  const { state, now } = useStore();
  const { t } = useFont();
  const v = virtueById(virtueId);
  if (!v) return null;
  const st = virtueStats(state, virtueId, now);
  const actions = state.virtues.actions[virtueId] ?? [];
  return (
    <View style={styles.card}>
      <Pressable
        onPress={() => router.push({ pathname: '/virtudes/[id]', params: { id: virtueId } })}
        style={styles.head}
        accessibilityLabel={`Ver ${v.name}`}
      >
        <View style={styles.icon}>
          <Glyph e={v.icon} size={22} color={C.navy} width={1.4} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={t(styles.name)}>{v.name}</Text>
          <Text style={t(styles.sub)}>
            {st.level.name} · {st.today.length}/{actions.length} hoy · {st.streak} {st.streak === 1 ? 'día seguido' : 'días seguidos'}
          </Text>
        </View>
        <Glyph e="chevron" size={18} color={C.muted} />
      </Pressable>
      <ProgressBar value={st.progress} color={C.navy} />
      <Text style={t(styles.levelText)}>
        {st.next ? `${st.next.min - st.total} propósitos cumplidos más para «${st.next.name}»` : st.level.text}
      </Text>
      <View style={{ gap: 2 }}>
        {actions.map((a) => (
          <VirtueCheck key={a} virtueId={virtueId} actionId={a} />
        ))}
      </View>
      <VirtueHeat days={st.days} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: C.card, borderRadius: 20, padding: 16, gap: 10, borderWidth: StyleSheet.hairlineWidth, borderColor: C.line },
  head: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  icon: { width: 42, height: 42, borderRadius: 21, borderWidth: StyleSheet.hairlineWidth, borderColor: C.line, alignItems: 'center', justifyContent: 'center' },
  name: { fontSize: 18, color: C.ink, fontWeight: '400' },
  sub: { fontSize: 13, color: C.muted, fontWeight: '300' },
  levelText: { fontSize: 12, color: C.muted, fontWeight: '300', marginTop: -4 },
  check: { flexDirection: 'row', gap: 12, alignItems: 'flex-start', paddingVertical: 8 },
  box: { width: 24, height: 24, borderRadius: 12, borderWidth: 1.2, borderColor: C.muted, alignItems: 'center', justifyContent: 'center', marginTop: 1 },
  boxOn: { backgroundColor: C.green, borderColor: C.green },
  boxDark: { borderColor: 'rgba(255,255,255,0.45)' },
  boxOnDark: { backgroundColor: '#E6DCC4', borderColor: '#E6DCC4' },
  checkText: { fontSize: 15, lineHeight: 21, color: C.ink },
  hint: { fontSize: 12, lineHeight: 17, color: C.muted, fontWeight: '300', marginTop: 1 },
  heat: { flexDirection: 'row', flexWrap: 'wrap', gap: 5, marginTop: 2 },
  cell: { width: 14, height: 14, borderRadius: 4, borderWidth: StyleSheet.hairlineWidth, borderColor: C.line },
});
