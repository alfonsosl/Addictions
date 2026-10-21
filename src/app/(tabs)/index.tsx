import { Link, router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { Pressable } from '../../components/Tap';
import { Text } from '../../components/Text';
import { Glyph } from '../../components/icons';
import { DailyLove } from '../../components/LoveIllustration';
import { StreakChart } from '../../components/StreakChart';
import { HomeActions } from '../../components/overlays';
import { C, Card, Label, ListRow, P, ProgressBar, Screen, SectionTitle } from '../../components/ui';
import { MISSIONS } from '../../content/missions';
import { PRAYERS } from '../../content/prayers';
import { reflectionForDate } from '../../content/reflections';
import { useFont } from '../../lib/fontScale';
import { examenKey, levelFor, streakDays } from '../../lib/game';
import { useStore } from '../../lib/store';

export default function Home() {
  const { state, now, today } = useStore();
  const { t } = useFont();
  const days = streakDays(state, now);
  const { level, next, progress } = levelFor(state.talents);
  const reflection = reflectionForDate(now);
  const doneMissions = state.missionsByDate[today] ?? [];
  const name = state.profile?.name;
  const h = now.getHours();
  const isNight = h >= 20 || h < 4;
  const examenDone = !!state.examens[examenKey(now)];
  const virtueTotal = state.virtues.focus.reduce((a, v) => a + (state.virtues.actions[v]?.length ?? 0), 0);
  const virtueDone = (state.virtueLog[today] ?? []).filter((x) => state.virtues.focus.includes(x.split(':')[0])).length;
  const virtueSubtitle = state.virtues.focus.length
    ? `${virtueDone} de ${virtueTotal} propósitos hoy`
    : 'Elige una virtud en la que crecer';
  const prayerOfMoment = h < 12 ? PRAYERS.find((p) => p.id === 'ofrecimiento')! : PRAYERS.find((p) => p.id === 'bendita-pureza')!;

  return (
    <View style={{ flex: 1 }}>
      <Screen fabSpace={120}>
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Text style={t(styles.date)}>{longDate(now)}</Text>
            <Text style={t(styles.hello)}>{name ? `Paz contigo, ${name}` : 'Paz contigo'}</Text>
          </View>
          <Link href="/ajustes" asChild>
            <Pressable hitSlop={12} accessibilityLabel="Ajustes" style={styles.settings}>
              <Glyph e="gear" size={20} color={C.navy} />
            </Pressable>
          </Link>
        </View>

        {/* Contador en forma de gráfico */}
        <Pressable onPress={() => router.push('/camino')} accessibilityLabel={`${days} días en libertad`}>
          <StreakChart state={state} now={now} />
        </Pressable>

        {isNight && !examenDone && (
          <Pressable onPress={() => router.push('/examen/guiado')} style={styles.night}>
            <Glyph e="🌙" size={26} color="#EFEADB" width={1.3} />
            <View style={{ flex: 1 }}>
              <Text style={t(styles.nightTitle)}>Es hora del examen</Text>
              <Text style={t(styles.nightSub)}>Diez minutos con Dios antes de dormir</Text>
            </View>
            <Glyph e="chevron" size={20} color="#EFEADB" />
          </Pressable>
        )}

        {/* Ilustración diaria del amor de Dios */}
        <DailyLove date={now} />

        <SectionTitle>Tu día con Dios</SectionTitle>
        <Card style={{ paddingVertical: 4 }}>
          <ListRow
            icon="📖"
            title="Evangelio de hoy"
            subtitle="Lecturas y comentario"
            done={state.readingsRead.includes(today)}
            onPress={() => router.push('/evangelio')}
          />
          <ListRow
            icon="✨"
            title="Reflexión"
            subtitle={reflection.title}
            onPress={() => router.push({ pathname: '/reflexion/[id]', params: { id: reflection.id } })}
          />
          <ListRow
            icon="🙏"
            title={h < 12 ? 'Ofrece el día' : 'Reza a María'}
            subtitle={prayerOfMoment.title}
            onPress={() => router.push({ pathname: '/oracion/[id]', params: { id: prayerOfMoment.id } })}
          />
          <ListRow
            icon="sprout"
            title="Virtudes"
            subtitle={virtueSubtitle}
            done={virtueTotal > 0 && virtueDone >= virtueTotal}
            onPress={() => router.push('/virtudes')}
          />
          <ListRow
            icon="🌙"
            title="Examen de la noche"
            subtitle="Antes de dormir"
            done={examenDone}
            onPress={() => router.push('/examen')}
            last
          />
        </Card>

        <Pressable onPress={() => router.push('/camino')}>
          <Card>
            <View style={styles.rowBetween}>
              <Label>{level.name}</Label>
              <Text style={t(styles.talents)}>{state.talents} talentos</Text>
            </View>
            <ProgressBar value={progress} color={C.navy} />
            <Text style={t(styles.small)}>{next ? `${next.min - state.talents} para «${next.name}»` : level.motto}</Text>
            <View style={[styles.rowBetween, { marginTop: 10 }]}>
              <Label>Regla de vida</Label>
              <Text style={t(styles.rule)}>
                {doneMissions.length}/{MISSIONS.length}
              </Text>
            </View>
            <ProgressBar value={doneMissions.length / MISSIONS.length} color={C.green} />
          </Card>
        </Pressable>

        {state.profile?.why ? (
          <View style={styles.why}>
            <Label color={C.gold}>Mi porqué</Label>
            <P>{state.profile.why}</P>
          </View>
        ) : null}
      </Screen>
      <HomeActions />
    </View>
  );
}

const MONTHS = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
const WEEKDAYS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
function longDate(d: Date) {
  return `${WEEKDAYS[d.getDay()]}, ${d.getDate()} de ${MONTHS[d.getMonth()]}`;
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  date: { fontSize: 13, color: C.muted, fontWeight: '300', letterSpacing: 0.5 },
  hello: { fontSize: 26, fontWeight: '300', color: C.ink, letterSpacing: 0.2, marginTop: 2 },
  settings: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: C.line,
  },
  night: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: C.night,
    borderRadius: 20,
    padding: 16,
  },
  nightTitle: { color: '#fff', fontWeight: '400', fontSize: 17 },
  nightSub: { color: '#fff', opacity: 0.7, fontSize: 13, marginTop: 2 },
  nightArrow: { color: '#fff', fontSize: 28, fontWeight: '300', opacity: 0.8 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  talents: { color: C.gold, fontWeight: '400', fontSize: 14 },
  rule: { color: C.green, fontWeight: '400', fontSize: 14 },
  small: { color: C.muted, fontSize: 13 },
  why: { borderLeftWidth: 2, borderLeftColor: C.gold, paddingLeft: 14, gap: 4, marginVertical: 4 },
});
