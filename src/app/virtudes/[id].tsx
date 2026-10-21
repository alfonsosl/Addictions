import { Stack, useLocalSearchParams } from 'expo-router';
import { themed } from '../../lib/theme';
import { StyleSheet, View } from 'react-native';
import { Glyph } from '../../components/icons';
import { Pressable } from '../../components/Tap';
import { Text } from '../../components/Text';
import { Button, C, P, ProgressBar, Screen, SectionTitle, serif } from '../../components/ui';
import { VirtueCheck, VirtueHeat } from '../../components/VirtueTracker';
import { virtueById, VIRTUES } from '../../content/virtues';
import { useFont } from '../../lib/fontScale';
import { MAX_VIRTUE_ACTIONS, MAX_VIRTUES, VIRTUE_LEVELS, virtueStats } from '../../lib/game';
import { useStore } from '../../lib/store';

export default function VirtueDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { state, now, setVirtueFocus, toggleVirtueAction } = useStore();
  const { t } = useFont();
  const v = virtueById(id ?? '') ?? VIRTUES[0];
  const active = state.virtues.focus.includes(v.id);
  const chosen = state.virtues.actions[v.id] ?? [];
  const st = virtueStats(state, v.id, now);
  const full = !active && state.virtues.focus.length >= MAX_VIRTUES;

  return (
    <Screen edges={['left', 'right', 'bottom']}>
      <Stack.Screen options={{ title: v.name }} />
      <View style={styles.hero}>
        <View style={styles.bigIcon}>
          <Glyph e={v.icon} size={38} color={C.navy} width={1.2} />
        </View>
        <Text style={t(styles.title)}>{v.name}</Text>
        <Text style={t(styles.vice)}>FRENTE A LA {v.vice.toUpperCase()}</Text>
        <Text style={t(styles.summary)}>{v.summary}</Text>
      </View>

      <View style={styles.quote}>
        <Text style={t(styles.verse)}>«{v.verse}»</Text>
        <Text style={t(styles.source)}>
          {v.source} · {v.catechism}
        </Text>
      </View>

      <SectionTitle>Por qué te ayuda</SectionTitle>
      <P>{v.why}</P>

      {active && (
        <>
          <SectionTitle>Hoy</SectionTitle>
          <View style={styles.card}>
            {chosen.length ? (
              chosen.map((a) => <VirtueCheck key={a} virtueId={v.id} actionId={a} />)
            ) : (
              <P muted>Elige abajo al menos un propósito.</P>
            )}
          </View>

          <SectionTitle>Tu crecimiento</SectionTitle>
          <View style={styles.card}>
            <View style={styles.stats}>
              <Stat n={st.total} label="propósitos cumplidos" />
              <Stat n={st.week} label="esta semana" />
              <Stat n={st.streak} label={st.streak === 1 ? 'día seguido' : 'días seguidos'} />
            </View>
            <View style={styles.levels}>
              {VIRTUE_LEVELS.map((l) => (
                <View key={l.name} style={{ alignItems: 'center', flex: 1, gap: 4 }}>
                  <View style={[styles.levelDot, st.total >= l.min && styles.levelDotOn]} />
                  <Text style={[styles.levelName, st.level.name === l.name && { color: C.ink }]}>{l.name}</Text>
                </View>
              ))}
            </View>
            <ProgressBar value={st.progress} color={C.navy} />
            <Text style={t(styles.small)}>{st.next ? `${st.next.min - st.total} más para «${st.next.name}». ${st.level.text}` : st.level.text}</Text>
            <Text style={t(styles.small)}>Últimas cuatro semanas</Text>
            <VirtueHeat days={st.days} />
          </View>
        </>
      )}

      <SectionTitle>{active ? `Tus propósitos (máximo ${MAX_VIRTUE_ACTIONS})` : 'Propósitos que te propondremos'}</SectionTitle>
      <View style={styles.card}>
        {v.actions.map((a) => {
          const on = chosen.includes(a.id) || (!active && v.actions.indexOf(a) < MAX_VIRTUE_ACTIONS);
          const locked = active && !on && chosen.length >= MAX_VIRTUE_ACTIONS;
          return (
            <Pressable
              key={a.id}
              disabled={!active || locked}
              onPress={() => toggleVirtueAction(v.id, a.id)}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: on, disabled: !active || locked }}
              style={[styles.option, locked && { opacity: 0.45 }]}
              feedback={false}
            >
              <View style={[styles.optBox, on && styles.optBoxOn]}>{on && <Glyph e="✓" size={13} color={C.onNavy} width={2.2} />}</View>
              <View style={{ flex: 1 }}>
                <Text style={t(styles.optText)}>{a.text}</Text>
                {a.hint ? <Text style={t(styles.optHint)}>{a.hint}</Text> : null}
              </View>
            </Pressable>
          );
        })}
      </View>

      {active ? (
        <Button title="Dejar de trabajar esta virtud" kind="ghost" onPress={() => setVirtueFocus(v.id, false)} />
      ) : (
        <Button
          title={full ? `Ya trabajas ${MAX_VIRTUES} virtudes` : `Empezar a crecer en ${v.name.toLowerCase()}`}
          confirm="¡En marcha!"
          celebrate
          disabled={full}
          onPress={() => setVirtueFocus(v.id, true)}
        />
      )}
      {active && <P muted style={{ fontSize: 13 }}>Tu progreso se guarda aunque la dejes: podrás retomarla cuando quieras.</P>}
    </Screen>
  );
}

function Stat({ n, label }: { n: number; label: string }) {
  return (
    <View style={{ flex: 1, alignItems: 'center' }}>
      <Text style={styles.statN}>{n}</Text>
      <Text style={styles.statL}>{label}</Text>
    </View>
  );
}

const styles = themed(() =>
  StyleSheet.create({
  hero: { alignItems: 'center', gap: 6, paddingTop: 8 },
  bigIcon: { width: 76, height: 76, borderRadius: 38, borderWidth: 1, borderColor: C.line, alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  title: { fontSize: 30, fontWeight: '300', color: C.ink, textAlign: 'center' },
  vice: { fontSize: 11, letterSpacing: 2.5, color: C.muted },
  summary: { fontSize: 16, lineHeight: 23, color: C.ink, textAlign: 'center', fontWeight: '300', marginTop: 4 },
  quote: { borderLeftWidth: 1.5, borderLeftColor: C.blue, paddingLeft: 14, gap: 4 },
  verse: { fontFamily: serif, fontStyle: 'italic', fontSize: 18, lineHeight: 26, color: C.ink },
  source: { color: C.muted, fontSize: 12, fontWeight: '300' },
  card: { backgroundColor: C.card, borderRadius: 20, padding: 16, gap: 8, borderWidth: StyleSheet.hairlineWidth, borderColor: C.line },
  stats: { flexDirection: 'row' },
  statN: { fontSize: 30, fontWeight: '300', color: C.ink },
  statL: { fontSize: 11, color: C.muted, textAlign: 'center' },
  levels: { flexDirection: 'row', marginTop: 8 },
  levelDot: { width: 12, height: 12, borderRadius: 6, borderWidth: 1, borderColor: C.muted },
  levelDotOn: { backgroundColor: C.navy, borderColor: C.navy },
  levelName: { fontSize: 11, color: C.muted },
  small: { fontSize: 12, color: C.muted, fontWeight: '300' },
  option: { flexDirection: 'row', gap: 12, paddingVertical: 8, alignItems: 'flex-start' },
  optBox: { width: 22, height: 22, borderRadius: 6, borderWidth: 1.2, borderColor: C.muted, alignItems: 'center', justifyContent: 'center', marginTop: 1 },
  optBoxOn: { backgroundColor: C.navy, borderColor: C.navy },
  optText: { fontSize: 15, color: C.ink },
  optHint: { fontSize: 12, color: C.muted, fontWeight: '300' },
  }),
);
