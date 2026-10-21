import { router } from 'expo-router';
import { themed } from '../../lib/theme';
import { Glyph } from '../../components/icons';
import { StyleSheet, View } from 'react-native';
import { Pressable } from '../../components/Tap';
import { Text } from '../../components/Text';
import { TabScreen } from '../../components/overlays';
import { Button, C, Card, H1, H2, Label, P, ProgressBar } from '../../components/ui';
import { TOTAL_CHAPTERS } from '../../content/gospels';
import { MISSIONS } from '../../content/missions';
import { virtueById } from '../../content/virtues';
import { BADGES, LEVELS, REWARDS, levelFor, streakDays, topTriggers, virtueStats } from '../../lib/game';
import { useStore } from '../../lib/store';

export default function Camino() {
  const { state, now, today, toggleMission } = useStore();
  const done = state.missionsByDate[today] ?? [];
  const best = Math.max(state.bestStreakDays, streakDays(state, now));
  const { index } = levelFor(state.talents);
  const triggers = topTriggers(state.relapses);

  return (
    <TabScreen>
      <H1>Tu camino</H1>

      <Card>
        <View style={styles.row}>
          <Label>Regla de vida · hoy</Label>
          <Text style={{ color: C.muted }}>
            {done.length}/{MISSIONS.length}
          </Text>
        </View>
        <ProgressBar value={done.length / MISSIONS.length} color={C.green} />
        {MISSIONS.map((m) => {
          const ok = done.includes(m.id);
          return (
            <Pressable
              key={m.id}
              style={styles.mission}
              onPress={() => (m.id === 'examen' && !ok ? router.push('/examen') : toggleMission(m.id))}
            >
              <View style={[styles.check, ok && { backgroundColor: C.green, borderColor: C.green }]}>
                {ok && <Glyph e="✓" size={16} color={C.onNavy} width={2} />}
              </View>
              <Glyph e={m.icon} size={22} color={ok ? C.muted : C.navy} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.mTitle, ok && { textDecorationLine: 'line-through', color: C.muted }]}>{m.title}</Text>
                <Text style={styles.mHint}>{m.hint}</Text>
              </View>
              <Text style={styles.reward}>+{m.reward}</Text>
            </Pressable>
          );
        })}
        <P muted style={{ fontSize: 13 }}>Completa todas para un bonus de +{REWARDS.fullDayBonus} talentos.</P>
      </Card>

      <Pressable onPress={() => router.push('/virtudes')}>
        <Card>
          <View style={styles.row}>
            <Label>Virtudes</Label>
            <Glyph e="chevron" size={16} color={C.muted} />
          </View>
          {state.virtues.focus.length ? (
            state.virtues.focus.map((id) => {
              const v = virtueById(id);
              const st = virtueStats(state, id, now);
              return (
                <View key={id} style={{ gap: 4, paddingVertical: 4 }}>
                  <View style={styles.row}>
                    <Text style={styles.mTitle}>{v?.name}</Text>
                    <Text style={styles.mHint}>{st.level.name} · {st.week} esta semana</Text>
                  </View>
                  <ProgressBar value={st.progress} color={C.navy} />
                </View>
              );
            })
          ) : (
            <P muted style={{ fontSize: 14 }}>Vence cada vicio con su virtud contraria: elige una y ponte propósitos.</P>
          )}
        </Card>
      </Pressable>

      <Button title="Hacer el examen de la noche" onPress={() => router.push('/examen')} />

      <View style={styles.stats}>
        <Stat n={state.talents} label="talentos" />
        <Stat n={best} label="mejor racha" />
        <Stat n={state.victories.length} label="tentaciones vencidas" />
        <Stat n={state.confessions.length} label="confesiones" />
        <Stat n={state.chaptersRead.length} label={`de ${TOTAL_CHAPTERS} capítulos del Evangelio`} />
        <Stat n={state.readingsRead.length} label="días con el Evangelio de hoy" />
      </View>

      <Card>
        <Label>Insignias</Label>
        <View style={styles.badges}>
          {BADGES.map((b) => {
            const ok = best >= b.days;
            return (
              <View key={b.days} style={[styles.badge, !ok && { opacity: 0.35 }]}>
                <Glyph e={ok ? b.icon : '🔒'} size={30} color={ok ? C.navy : C.muted} width={1.3} />
                <Text style={styles.badgeTitle}>{b.title}</Text>
                <Text style={styles.badgeDays}>{b.days} d</Text>
              </View>
            );
          })}
        </View>
        {BADGES.filter((b) => best >= b.days)
          .slice(-1)
          .map((b) => (
            <P key={b.days} muted style={{ fontSize: 14 }}>
              Última: {b.title}. {b.text}
            </P>
          ))}
      </Card>

      <Card>
        <Label>Niveles</Label>
        {LEVELS.map((l, i) => (
          <View key={l.name} style={[styles.level, i === index && styles.levelActive]}>
            <View style={{ width: 28 }}>
              {i <= index ? <Glyph e={i < index ? '✓' : '⭐'} size={18} color={i < index ? C.green : C.gold} /> : <View style={styles.dot} />}
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.mTitle, i > index && { color: C.muted }]}>{l.name}</Text>
              <Text style={styles.mHint}>{l.motto}</Text>
            </View>
            <Text style={styles.mHint}>{l.min}</Text>
          </View>
        ))}
      </Card>

      {triggers.length > 0 && (
        <Card>
          <Label>Tus disparadores más frecuentes</Label>
          {triggers.map((t) => (
            <P key={t.trigger}>
              • {t.trigger} ({t.count})
            </P>
          ))}
          <P muted style={{ fontSize: 14 }}>
            Prepara un plan «si… entonces…» para cada uno en Ajustes.
          </P>
        </Card>
      )}

      <Card>
        <H2>Cómo ganar talentos</H2>
        <P>• Cada día limpio: +{REWARDS.cleanDay}</P>
        <P>• Vencer una tentación con el botón de pánico: +{REWARDS.victory}</P>
        <P>• Meditar las lecturas: +{REWARDS.reading} · Examen de conciencia: +{REWARDS.examen}</P>
        <P>• Leer un capítulo de los Evangelios: +{REWARDS.chapter}</P>
        <P>• Cumplir un propósito de virtud: +{REWARDS.virtue}</P>
        <P>• Confesarte: +{REWARDS.confession}</P>
        <P muted style={{ fontSize: 14 }}>
          Los talentos nunca se pierden: una caída reinicia la racha, no tu camino. «Has sido fiel en lo poco» (Mt 25,21).
        </P>
      </Card>
    </TabScreen>
  );
}

function Stat({ n, label }: { n: number; label: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statN}>{n}</Text>
      <Text style={styles.statL}>{label}</Text>
    </View>
  );
}

const styles = themed(() =>
  StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  mission: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8 },
  check: { width: 24, height: 24, borderRadius: 12, borderWidth: 1.2, borderColor: C.line, alignItems: 'center', justifyContent: 'center' },
  mTitle: { fontSize: 16, fontWeight: '600', color: C.ink },
  mHint: { fontSize: 13, color: C.muted },
  reward: { color: C.gold, fontWeight: '500' },
  stats: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  stat: { flexGrow: 1, flexBasis: '45%', backgroundColor: C.card, borderRadius: 16, padding: 14, borderWidth: StyleSheet.hairlineWidth, borderColor: C.line },
  dot: { width: 8, height: 8, borderRadius: 4, borderWidth: 1, borderColor: C.muted, marginLeft: 5 },
  statN: { fontSize: 30, fontWeight: '300', color: C.navy },
  statL: { color: C.muted, fontSize: 13 },
  badges: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  badge: { width: '30%', flexGrow: 1, alignItems: 'center', padding: 8, borderRadius: 14, backgroundColor: C.bg },
  badgeTitle: { fontSize: 12, fontWeight: '700', color: C.ink, textAlign: 'center' },
  badgeDays: { fontSize: 11, color: C.muted },
  level: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 8, paddingHorizontal: 6, borderRadius: 12 },
  levelActive: { backgroundColor: C.goldSoft },
  }),
);
