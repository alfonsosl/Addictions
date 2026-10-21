import { Link, router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { C, Card, Label, P, ProgressBar, Quote, Screen, SectionTitle, Tile } from '../../components/ui';
import { MISSIONS } from '../../content/missions';
import { PRAYERS } from '../../content/prayers';
import { reflectionForDate } from '../../content/reflections';
import { BADGES, DAY_MS, levelFor, nextBadge, streakDays, streakMs } from '../../lib/game';
import { haptic, useStore } from '../../lib/store';

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
  const doneMissions = state.missionsByDate[today] ?? [];
  const name = state.profile?.name;
  const h = now.getHours();
  const prayerOfMoment = h < 12 ? PRAYERS.find((p) => p.id === 'ofrecimiento')! : PRAYERS.find((p) => p.id === 'bendita-pureza')!;

  return (
    <Screen>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Label>{greeting(now)}</Label>
          <Text style={styles.hello}>{name ? `Paz contigo, ${name}` : 'Paz contigo'}</Text>
        </View>
        <Link href="/ajustes" asChild>
          <Pressable hitSlop={12} accessibilityLabel="Ajustes" style={styles.settings}>
            <Text style={{ fontSize: 20 }}>⚙️</Text>
          </Pressable>
        </Link>
      </View>

      {/* Contador */}
      <View style={styles.counter}>
        <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 10 }}>
          <Text style={styles.counterDays}>{days}</Text>
          <View style={{ paddingBottom: 12 }}>
            <Text style={styles.counterUnit}>{days === 1 ? 'día' : 'días'}</Text>
            <Text style={styles.counterUnit}>en libertad</Text>
          </View>
        </View>
        <Text style={styles.counterSub}>
          + {hours} h {minutes} min · Mejor racha: {Math.max(state.bestStreakDays, days)} d
        </Text>
        {badge && (
          <View style={{ width: '100%', marginTop: 12, gap: 6 }}>
            <ProgressBar value={(days - prevDays) / (badge.days - prevDays)} track="rgba(255,255,255,0.18)" />
            <Text style={styles.counterNext}>
              {badge.icon} {badge.title}: faltan {badge.days - days} {badge.days - days === 1 ? 'día' : 'días'}
            </Text>
          </View>
        )}
      </View>

      {/* Botón de pánico: siempre arriba, sin tener que desplazarse */}
      <PanicButton />

      <SectionTitle>Tu día con Dios</SectionTitle>
      <View style={styles.grid}>
        <Tile
          icon="📖"
          title="Evangelio de hoy"
          subtitle="Lecturas y comentario"
          done={state.readingsRead.includes(today)}
          onPress={() => router.push('/evangelio')}
        />
        <Tile
          icon="✨"
          title="Reflexión"
          subtitle={reflection.title}
          onPress={() => router.push({ pathname: '/reflexion/[id]', params: { id: reflection.id } })}
        />
        <Tile
          icon="🙏"
          title={h < 12 ? 'Ofrece el día' : 'Reza a María'}
          subtitle={prayerOfMoment.title}
          onPress={() => router.push({ pathname: '/oracion/[id]', params: { id: prayerOfMoment.id } })}
        />
        <Tile
          icon="🌙"
          title="Examen"
          subtitle="5 min antes de dormir"
          done={doneMissions.includes('examen')}
          onPress={() => router.push('/examen')}
        />
      </View>

      <Pressable onPress={() => router.push({ pathname: '/reflexion/[id]', params: { id: reflection.id } })}>
        <Card style={{ backgroundColor: C.navy, borderColor: C.navy }}>
          <Text style={styles.lightLabel}>PALABRA PARA HOY</Text>
          <Quote text={reflection.quote} source={reflection.source} dark />
        </Card>
      </Pressable>

      <Pressable onPress={() => router.push('/camino')}>
        <Card>
          <View style={styles.rowBetween}>
            <Label>Nivel · {level.name}</Label>
            <Text style={{ color: C.gold, fontWeight: '800' }}>🪙 {state.talents}</Text>
          </View>
          <ProgressBar value={progress} color={C.navy} />
          <Text style={{ color: C.muted, fontSize: 13 }}>
            {next ? `${next.min - state.talents} talentos para «${next.name}»` : level.motto}
          </Text>
          <View style={[styles.rowBetween, { marginTop: 6 }]}>
            <Label>Regla de vida</Label>
            <Text style={{ color: C.green, fontWeight: '800' }}>
              {doneMissions.length}/{MISSIONS.length}
            </Text>
          </View>
          <ProgressBar value={doneMissions.length / MISSIONS.length} color={C.green} />
          <Text style={{ color: C.navySoft, fontWeight: '700', marginTop: 4 }}>Ver mis misiones de hoy →</Text>
        </Card>
      </Pressable>

      {state.profile?.why ? (
        <Card style={{ backgroundColor: C.goldSoft, borderColor: C.gold }}>
          <Label>💛 Mi porqué</Label>
          <P>{state.profile.why}</P>
        </Card>
      ) : null}

      <Pressable onPress={() => router.push('/caida')} style={styles.fall}>
        <Text style={{ color: C.navySoft, fontWeight: '700' }}>He caído — quiero levantarme</Text>
      </Pressable>
    </Screen>
  );
}

function PanicButton() {
  const [pulse] = useState(() => new Animated.Value(0));
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 1100, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0, duration: 1100, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);
  const scale = pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.025] });

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Botón de pánico"
        onPress={() => {
          haptic('heavy');
          router.push('/panico');
        }}
        style={({ pressed }) => [styles.panic, pressed && { opacity: 0.9 }]}
      >
        <Text style={{ fontSize: 34 }}>🆘</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.panicTitle}>BOTÓN DE PÁNICO</Text>
          <Text style={styles.panicSub}>Pulsa si sientes la tentación ahora</Text>
        </View>
        <Text style={styles.panicArrow}>›</Text>
      </Pressable>
    </Animated.View>
  );
}

function greeting(d: Date) {
  const h = d.getHours();
  if (h < 6) return '🌙 Noche · vigila y ora';
  if (h < 13) return '☀️ Buenos días';
  if (h < 20) return '🌤️ Buenas tardes';
  return '🌙 Buenas noches';
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  hello: { fontSize: 24, fontWeight: '800', color: C.navy },
  settings: { backgroundColor: '#fff', borderRadius: 20, padding: 8, borderWidth: 1, borderColor: C.line },
  counter: { backgroundColor: C.navy, borderRadius: 24, padding: 20, paddingTop: 12, alignItems: 'center' },
  counterDays: { color: '#fff', fontSize: 84, fontWeight: '900', lineHeight: 92 },
  counterUnit: { color: C.goldSoft, fontSize: 16, fontWeight: '700' },
  counterSub: { color: '#fff', opacity: 0.85 },
  counterNext: { color: '#fff', opacity: 0.85, fontSize: 13, textAlign: 'center' },
  panic: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: C.red,
    borderRadius: 22,
    paddingVertical: 18,
    paddingHorizontal: 18,
    shadowColor: C.red,
    shadowOpacity: 0.4,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 5 },
    elevation: 6,
  },
  panicTitle: { color: '#fff', fontSize: 20, fontWeight: '900', letterSpacing: 0.5 },
  panicSub: { color: '#fff', opacity: 0.92, marginTop: 2 },
  panicArrow: { color: '#fff', fontSize: 36, fontWeight: '300' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  lightLabel: { color: C.gold, letterSpacing: 1, fontSize: 12, fontWeight: '800' },
  fall: { alignItems: 'center', paddingVertical: 12 },
});
