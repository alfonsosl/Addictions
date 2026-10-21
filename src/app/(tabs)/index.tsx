import * as Haptics from 'expo-haptics';
import { Link, router } from 'expo-router';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { Button, C, Card, H2, Label, P, ProgressBar, Screen } from '../../components/ui';
import { MISSIONS } from '../../content/missions';
import { reflectionForDate } from '../../content/reflections';
import { BADGES, DAY_MS, levelFor, nextBadge, streakDays, streakMs } from '../../lib/game';
import { useStore } from '../../lib/store';

export default function Home() {
  const { state, now, today } = useStore();
  const days = streakDays(state, now);
  const rest = streakMs(state, now) % DAY_MS;
  const hours = Math.floor(rest / 3_600_000);
  const minutes = Math.floor((rest % 3_600_000) / 60_000);
  const { level, next, progress } = levelFor(state.talents);
  const badge = nextBadge(days);
  const prevDays = BADGES.filter((b) => b.days < (badge?.days ?? 0)).pop()?.days ?? 0;
  const reflection = reflectionForDate(now);
  const done = (state.missionsByDate[today] ?? []).length;
  const name = state.profile?.name;

  const panic = () => {
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy).catch(() => {});
    router.push('/panico');
  };

  return (
    <Screen>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Label>{greeting(now)}</Label>
          <Text style={styles.hello}>{name ? `Paz contigo, ${name}` : 'Paz contigo'}</Text>
        </View>
        <Link href="/ajustes" asChild>
          <Pressable hitSlop={12} accessibilityLabel="Ajustes">
            <Text style={{ fontSize: 24 }}>⚙️</Text>
          </Pressable>
        </Link>
      </View>

      <View style={styles.counter}>
        <Text style={styles.counterLabel}>DÍAS EN LIBERTAD</Text>
        <Text style={styles.counterDays}>{days}</Text>
        <Text style={styles.counterSub}>
          {hours} h {minutes} min · mejor racha: {Math.max(state.bestStreakDays, days)} días
        </Text>
        {badge && (
          <View style={{ width: '100%', marginTop: 14, gap: 6 }}>
            <ProgressBar value={(days - prevDays) / (badge.days - prevDays)} track="rgba(255,255,255,0.18)" />
            <Text style={styles.counterNext}>
              Próxima insignia: {badge.icon} {badge.title} ({badge.days} días) · faltan {badge.days - days}
            </Text>
          </View>
        )}
      </View>

      <Pressable onPress={panic} style={({ pressed }) => [styles.panic, pressed && { transform: [{ scale: 0.98 }] }]}>
        <Text style={styles.panicTitle}>🆘  Botón de pánico</Text>
        <Text style={styles.panicSub}>Siento la tentación ahora</Text>
      </Pressable>

      <Card>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Label>Nivel</Label>
          <Text style={{ color: C.gold, fontWeight: '800' }}>{state.talents} talentos</Text>
        </View>
        <H2>{level.name}</H2>
        <P muted>{level.motto}</P>
        <ProgressBar value={progress} color={C.navy} />
        {next && (
          <Text style={{ color: C.muted, fontSize: 13 }}>
            {next.min - state.talents} talentos para «{next.name}»
          </Text>
        )}
      </Card>

      <Link href={{ pathname: '/reflexion/[id]', params: { id: reflection.id } }} asChild>
        <Pressable>
          <Card style={{ backgroundColor: C.navy, borderColor: C.navy }}>
            <Text style={[styles.lightLabel]}>REFLEXIÓN DE HOY</Text>
            <Text style={{ color: '#fff', fontSize: 19, fontWeight: '700' }}>{reflection.title}</Text>
            <Text style={{ color: C.goldSoft, fontStyle: 'italic', lineHeight: 22 }}>
              «{reflection.quote}» ({reflection.source})
            </Text>
            <Text style={{ color: '#fff', opacity: 0.8 }}>Leer y meditar →</Text>
          </Card>
        </Pressable>
      </Link>

      <Link href="/camino" asChild>
        <Pressable>
          <Card>
            <Label>Regla de vida de hoy</Label>
            <P>
              {done} de {MISSIONS.length} misiones completadas
            </P>
            <ProgressBar value={done / MISSIONS.length} color={C.green} />
          </Card>
        </Pressable>
      </Link>

      {state.profile?.why ? (
        <Card style={{ backgroundColor: C.goldSoft, borderColor: C.gold }}>
          <Label>Mi porqué</Label>
          <P>{state.profile.why}</P>
        </Card>
      ) : null}

      <Button title="He caído — quiero levantarme" kind="ghost" onPress={() => router.push('/caida')} />
    </Screen>
  );
}

function greeting(d: Date) {
  const h = d.getHours();
  if (h < 6) return 'Noche: vigila y ora';
  if (h < 13) return 'Buenos días';
  if (h < 20) return 'Buenas tardes';
  return 'Buenas noches';
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  hello: { fontSize: 24, fontWeight: '800', color: C.navy },
  counter: {
    backgroundColor: C.navy,
    borderRadius: 24,
    padding: 22,
    alignItems: 'center',
  },
  counterLabel: { color: C.goldSoft, letterSpacing: 2, fontSize: 12, fontWeight: '700' },
  counterDays: { color: '#fff', fontSize: 88, fontWeight: '900', lineHeight: 96 },
  counterSub: { color: '#fff', opacity: 0.85 },
  counterNext: { color: '#fff', opacity: 0.85, fontSize: 13, textAlign: 'center' },
  panic: {
    backgroundColor: C.red,
    borderRadius: 20,
    paddingVertical: 20,
    alignItems: 'center',
    shadowColor: C.red,
    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  panicTitle: { color: '#fff', fontSize: 22, fontWeight: '900' },
  panicSub: { color: '#fff', opacity: 0.9, marginTop: 2 },
  lightLabel: { color: C.gold, letterSpacing: 1, fontSize: 12, fontWeight: '700' },
});
