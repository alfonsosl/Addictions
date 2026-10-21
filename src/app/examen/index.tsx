import { router } from 'expo-router';
import { themed } from '../../lib/theme';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Pressable } from '../../components/Tap';
import { Text } from '../../components/Text';
import { LoveArt } from '../../components/LoveIllustration';
import { Button, C, Card, H1, Label, P, Screen, SectionTitle } from '../../components/ui';
import { EXAMEN_AREAS, SLEEP_CHECKLIST } from '../../content/examen';
import { useFont } from '../../lib/fontScale';
import { dateKey, examenKey, examenStreak } from '../../lib/game';
import { useStore } from '../../lib/store';

const QUESTION_TEXT = Object.fromEntries(EXAMEN_AREAS.flatMap((a) => a.questions.map((q) => [q.id, q.text])));
const MONTHS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
const WEEKDAYS = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'];

function fmt(key: string) {
  const [y, m, d] = key.split('-').map(Number);
  const dt = new Date(y, m - 1, d);
  return `${WEEKDAYS[dt.getDay()]} ${d} ${MONTHS[m - 1]}`;
}

export default function ExamenHome() {
  const { state, now } = useStore();
  const { t } = useFont();
  const tonight = examenKey(now);
  const done = state.examens[tonight];
  const streak = examenStreak(state, now);
  const total = Object.keys(state.examens).length;
  // Noche anterior a la de hoy (a las 2:00, «hoy» sigue siendo la noche de ayer).
  const prevNight = new Date(now.getTime() - (now.getHours() < 4 ? 5 * 3_600_000 : 0));
  prevNight.setDate(prevNight.getDate() - 1);
  const lastResolution = state.examens[dateKey(prevNight)]?.resolution ?? '';
  const history = Object.entries(state.examens)
    .sort((a, b) => (a[0] < b[0] ? 1 : -1))
    .slice(0, 30);
  const [open, setOpen] = useState<string | null>(null);

  return (
    <Screen edges={['left', 'right', 'bottom']}>
      <LoveArt scene="night" height={150} />
      <View style={{ gap: 6 }}>
        <Label>San Ignacio de Loyola</Label>
        <H1>Examen de la noche</H1>
        <P muted>
          Diez minutos para mirar el día con Dios: dar gracias, ver con verdad, pedir perdón y descansar en su amor.
        </P>
      </View>

      <View style={styles.stats}>
        <Stat n={streak} label={streak === 1 ? 'noche seguida' : 'noches seguidas'} />
        <Stat n={total} label="exámenes" />
      </View>

      {lastResolution ? (
        <View style={styles.reso}>
          <Label color={C.gold}>Tu propósito de ayer</Label>
          <P>{lastResolution}</P>
        </View>
      ) : null}

      <Button
        title={done ? 'Hecho esta noche · repasar o editar' : 'Empezar el examen de esta noche'}
        kind={done ? 'ghost' : 'primary'}
        onPress={() => router.push('/examen/guiado')}
      />

      <SectionTitle>Cómo es</SectionTitle>
      <Card>
        {[
          ['1', 'Presencia', 'Ponte ante Dios y pide luz al Espíritu Santo.'],
          ['2', 'Gratitud', 'Tres cosas concretas de hoy.'],
          ['3', 'Repaso', 'Mañana, tarde y noche: dónde estuvo Dios, cuándo flaqueaste.'],
          ['4', 'Examen', 'Preguntas sobre Dios, la pureza, los demás y uno mismo.'],
          ['5', 'Perdón', 'Acto de contrición, y confesión si hace falta.'],
          ['6', 'Propósito', 'Un plan «si… entonces…» para mañana.'],
          ['7', 'Descanso', 'Rutina antes de dormir y oración a la Virgen.'],
        ].map(([n, title, text]) => (
          <View key={n} style={styles.stepRow}>
            <Text style={styles.stepNum}>{n}</Text>
            <View style={{ flex: 1 }}>
              <Text style={t(styles.stepTitle)}>{title}</Text>
              <Text style={t(styles.stepText)}>{text}</Text>
            </View>
          </View>
        ))}
      </Card>

      {history.length > 0 && (
        <>
          <SectionTitle>Tus noches</SectionTitle>
          <Card style={{ paddingVertical: 4 }}>
            {history.map(([key, e], i) => {
              const isOpen = open === key;
              return (
                <Pressable
                  key={key}
                  onPress={() => setOpen(isOpen ? null : key)}
                  style={[styles.hist, i < history.length - 1 && styles.histLine]}
                >
                  <View style={styles.histHead}>
                    <Text style={t(styles.histDate)}>{fmt(key)}</Text>
                    <Text style={t(styles.histMeta)} numberOfLines={1}>
                      {e.resolution || e.gratitude.split('\n')[0] || 'Examen hecho'}
                    </Text>
                    <Text style={styles.chev}>{isOpen ? '⌃' : '⌄'}</Text>
                  </View>
                  {isOpen && (
                    <View style={{ gap: 8, marginTop: 8 }}>
                      {e.gratitude ? <Detail label="Gracias por" text={e.gratitude} /> : null}
                      {e.godToday ? <Detail label="Dios estuvo" text={e.godToday} /> : null}
                      {e.struggle ? <Detail label="Me costó" text={e.struggle} /> : null}
                      {e.halt?.length ? <Detail label="Me sentí" text={e.halt.join(', ')} /> : null}
                      {e.marked?.length ? (
                        <Detail label="Puse en sus manos" text={e.marked.map((id) => `• ${QUESTION_TEXT[id] ?? id}`).join('\n')} />
                      ) : null}
                      {e.resolution ? <Detail label="Propósito" text={e.resolution} /> : null}
                      {e.sleep ? (
                        <Detail label="Antes de dormir" text={`${e.sleep.length}/${SLEEP_CHECKLIST.length} hábitos`} />
                      ) : null}
                    </View>
                  )}
                </Pressable>
              );
            })}
          </Card>
        </>
      )}
      <P muted style={{ fontSize: 13 }}>
        Todo lo que escribes se guarda solo en este teléfono.
      </P>
    </Screen>
  );
}

function Stat({ n, label }: { n: number; label: string }) {
  const { t } = useFont();
  return (
    <View style={styles.stat}>
      <Text style={styles.statN}>{n}</Text>
      <Text style={t(styles.statL)}>{label}</Text>
    </View>
  );
}

function Detail({ label, text }: { label: string; text: string }) {
  const { t } = useFont();
  return (
    <View>
      <Text style={t(styles.dLabel)}>{label}</Text>
      <Text style={t(styles.dText)}>{text}</Text>
    </View>
  );
}

const styles = themed(() =>
  StyleSheet.create({
  stats: { flexDirection: 'row', gap: 12 },
  stat: {
    flex: 1,
    backgroundColor: C.card,
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: C.line,
  },
  statN: { fontSize: 34, fontWeight: '300', color: C.navy },
  statL: { fontSize: 13, color: C.muted },
  reso: { borderLeftWidth: 2, borderLeftColor: C.gold, paddingLeft: 14, gap: 4 },
  stepRow: { flexDirection: 'row', gap: 12, paddingVertical: 6 },
  stepNum: { width: 24, height: 24, borderRadius: 12, backgroundColor: C.goldSoft, textAlign: 'center', lineHeight: 24, color: C.navy, fontWeight: '700', fontSize: 13, overflow: 'hidden' },
  stepTitle: { fontSize: 15, fontWeight: '700', color: C.ink },
  stepText: { fontSize: 14, color: C.muted, lineHeight: 20 },
  hist: { paddingVertical: 12 },
  histLine: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: C.line },
  histHead: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  histDate: { fontSize: 14, fontWeight: '700', color: C.navy, width: 86 },
  histMeta: { flex: 1, fontSize: 14, color: C.muted },
  chev: { color: C.muted, fontSize: 16 },
  dLabel: { fontSize: 12, fontWeight: '600', color: C.muted, textTransform: 'uppercase', letterSpacing: 1 },
  dText: { fontSize: 15, lineHeight: 22, color: C.ink },
  }),
);
