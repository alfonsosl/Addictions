import { Link, router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { DailyLove } from '../../components/LoveIllustration';
import { HomeActions } from '../../components/overlays';
import { C, Card, Label, ListRow, P, ProgressBar, Screen, SectionTitle } from '../../components/ui';
import { MISSIONS } from '../../content/missions';
import { PRAYERS } from '../../content/prayers';
import { reflectionForDate } from '../../content/reflections';
import { useFont } from '../../lib/fontScale';
import { BADGES, DAY_MS, examenKey, levelFor, nextBadge, streakDays, streakMs } from '../../lib/game';
import { useStore } from '../../lib/store';

export default function Home() {
  const { state, now, today } = useStore();
  const { t } = useFont();
  const days = streakDays(state, now);
  const rest = streakMs(state, now) % DAY_MS;
  const hours = Math.floor(rest / 3_600_000);
  const minutes = Math.floor((rest % 3_600_000) / 60_000);
  const { level, next, progress } = levelFor(state.talents);
  const badge = nextBadge(days);
  const prevDays = BADGES.filter((b) => b.days < (badge?.days ?? 0)).pop()?.days ?? 0;
  const reflection = reflectionForDate(now);
  const doneMissions = state.missionsByDate[today] ?? [];
  const name = state.profile?.name;
  const h = now.getHours();
  const isNight = h >= 20 || h < 4;
  const examenDone = !!state.examens[examenKey(now)];
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
              <Text style={{ fontSize: 17, color: C.navy }}>⚙︎</Text>
            </Pressable>
          </Link>
        </View>

        {/* Contador */}
        <Pressable onPress={() => router.push('/camino')} style={styles.counter} accessibilityLabel={`${days} días en libertad`}>
          <Text style={styles.counterDays}>{days}</Text>
          <Text style={t(styles.counterUnit)}>{days === 1 ? 'día en libertad' : 'días en libertad'}</Text>
          <Text style={t(styles.counterSub)}>
            {hours} h {minutes} min · mejor racha {Math.max(state.bestStreakDays, days)} d
          </Text>
          {badge && (
            <View style={styles.counterBadge}>
              <ProgressBar value={(days - prevDays) / (badge.days - prevDays)} />
              <Text style={t(styles.counterNext)}>
                {badge.icon} {badge.title} · faltan {badge.days - days} {badge.days - days === 1 ? 'día' : 'días'}
              </Text>
            </View>
          )}
        </Pressable>

        {isNight && !examenDone && (
          <Pressable onPress={() => router.push('/examen/guiado')} style={styles.night}>
            <Text style={{ fontSize: 26 }}>🌙</Text>
            <View style={{ flex: 1 }}>
              <Text style={t(styles.nightTitle)}>Es hora del examen</Text>
              <Text style={t(styles.nightSub)}>Diez minutos con Dios antes de dormir</Text>
            </View>
            <Text style={styles.nightArrow}>›</Text>
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
  date: { fontSize: 13, color: C.muted, fontWeight: '500' },
  hello: { fontSize: 24, fontWeight: '700', color: C.navy, letterSpacing: -0.3, marginTop: 2 },
  settings: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: C.line,
  },
  counter: { alignItems: 'center', paddingVertical: 18, gap: 2 },
  counterDays: { color: C.navy, fontSize: 96, fontWeight: '200', lineHeight: 104, letterSpacing: -2 },
  counterUnit: { color: C.navy, fontSize: 17, fontWeight: '600' },
  counterSub: { color: C.muted, fontSize: 13, marginTop: 2 },
  counterBadge: { width: '70%', marginTop: 14, gap: 8 },
  counterNext: { color: C.muted, fontSize: 13, textAlign: 'center' },
  night: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: C.night,
    borderRadius: 20,
    padding: 16,
  },
  nightTitle: { color: '#fff', fontWeight: '700', fontSize: 17 },
  nightSub: { color: '#fff', opacity: 0.7, fontSize: 13, marginTop: 2 },
  nightArrow: { color: '#fff', fontSize: 28, fontWeight: '300', opacity: 0.8 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  talents: { color: C.gold, fontWeight: '700', fontSize: 14 },
  rule: { color: C.green, fontWeight: '700', fontSize: 14 },
  small: { color: C.muted, fontSize: 13 },
  why: { borderLeftWidth: 2, borderLeftColor: C.gold, paddingLeft: 14, gap: 4, marginVertical: 4 },
});
