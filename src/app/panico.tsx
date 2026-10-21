import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Animated, Easing, Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { C } from '../components/ui';
import { PRAYERS } from '../content/prayers';
import { streakDays } from '../lib/game';
import { useStore } from '../lib/store';

// Flujo de emergencia: 1) Para y respira  2) Reza  3) Muévete  4) Recuerda tu porqué  5) Surfea la ola
const STEPS = ['Respira', 'Reza', 'Muévete', 'Tu porqué', 'Espera'];

const PHASES = [
  { label: 'Inspira', scale: 1 },
  { label: 'Mantén', scale: 1 },
  { label: 'Espira', scale: 0.55 },
  { label: 'Mantén', scale: 0.55 },
];
const PHASE_S = 4; // respiración cuadrada 4-4-4-4

const ACTIONS = [
  '🚶 Levántate ahora y sal de la habitación',
  '📵 Deja el móvil en otra habitación o apágalo',
  '💧 Lávate la cara con agua fría',
  '💪 Haz 20 flexiones o sentadillas',
  '🌳 Sal a dar un paseo de 10 minutos',
  '🗣️ Ve a donde haya otras personas',
];

export default function Panic() {
  const { state, now, addVictory } = useStore();
  const [step, setStep] = useState(0);
  const days = streakDays(state, now);
  const p = state.profile;

  const win = () => {
    addVictory();
    router.back();
  };

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.topBar}>
        <Text style={styles.stepText}>
          {step + 1}/{STEPS.length} · {STEPS[step]}
        </Text>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Text style={styles.close}>Cerrar ✕</Text>
        </Pressable>
      </View>
      <View style={styles.dots}>
        {STEPS.map((_, i) => (
          <View key={i} style={[styles.dot, i <= step && { backgroundColor: C.gold }]} />
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.body}>
        {step === 0 && <Breathing />}

        {step === 1 && (
          <>
            <Text style={styles.title}>Reza, aunque sea con pocas palabras</Text>
            <Text style={styles.prayer}>{PRAYERS[0].text}</Text>
            <Text style={styles.subtitle}>{PRAYERS[1].title}</Text>
            <Text style={styles.prayerSmall}>{PRAYERS[1].text}</Text>
          </>
        )}

        {step === 2 && (
          <>
            <Text style={styles.title}>Huye: no dialogues con la tentación</Text>
            <Text style={styles.text}>«Él, dejando el manto en sus manos, salió huyendo» (Gn 39,12). Elige una y hazla YA:</Text>
            {ACTIONS.map((a) => (
              <View key={a} style={styles.action}>
                <Text style={styles.actionText}>{a}</Text>
              </View>
            ))}
            {p?.ifThen.length ? (
              <View style={styles.plans}>
                <Text style={styles.subtitle}>Tus planes</Text>
                {p.ifThen.map((x, i) => (
                  <Text key={i} style={styles.planText}>
                    Si {x.when}, entonces {x.then}.
                  </Text>
                ))}
              </View>
            ) : null}
            {p?.contactPhone ? (
              <View style={{ flexDirection: 'row', gap: 10 }}>
                <Pressable style={[styles.callBtn, { flex: 1 }]} onPress={() => Linking.openURL(`tel:${p.contactPhone}`)}>
                  <Text style={styles.callText}>📞 Llamar a {p.contactName || 'mi contacto'}</Text>
                </Pressable>
                <Pressable
                  style={[styles.callBtn, { flex: 1, backgroundColor: C.navySoft }]}
                  onPress={() =>
                    Linking.openURL(`sms:${p.contactPhone}?body=${encodeURIComponent('Estoy teniendo una lucha ahora. ¿Puedes rezar por mí o llamarme?')}`)
                  }
                >
                  <Text style={styles.callText}>💬 Enviar mensaje</Text>
                </Pressable>
              </View>
            ) : (
              <Text style={styles.textMuted}>Añade un contacto de confianza en Ajustes para poder llamarle desde aquí.</Text>
            )}
          </>
        )}

        {step === 3 && (
          <>
            <Text style={styles.title}>Recuerda por qué luchas</Text>
            {p?.why ? <Text style={styles.why}>«{p.why}»</Text> : null}
            <Text style={styles.big}>{days}</Text>
            <Text style={styles.text}>días de libertad. No los cambies por unos minutos que dejan vacío.</Text>
            <Text style={styles.text}>
              La pornografía promete descanso y deja más soledad. Lo que de verdad buscas —amor, paz, sentido— está en
              Dios y en las personas reales.
            </Text>
            <Text style={styles.quote}>«Fiel es Dios… con la tentación os dará también la salida» (1 Cor 10,13)</Text>
          </>
        )}

        {step === 4 && <UrgeTimer />}
      </ScrollView>

      <View style={styles.footer}>
        {step < STEPS.length - 1 ? (
          <Pressable style={styles.next} onPress={() => setStep(step + 1)}>
            <Text style={styles.nextText}>Siguiente →</Text>
          </Pressable>
        ) : null}
        <Pressable style={styles.win} onPress={win}>
          <Text style={styles.winText}>✝️ He vencido esta tentación (+20 talentos)</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

function Breathing() {
  const [scale] = useState(() => new Animated.Value(0.55));
  const [t, setT] = useState(0); // segundos transcurridos
  const phase = Math.floor(t / PHASE_S) % PHASES.length;
  const left = PHASE_S - (t % PHASE_S);
  const cycles = Math.floor(t / (PHASE_S * PHASES.length));

  useEffect(() => {
    Animated.timing(scale, {
      toValue: PHASES[phase].scale,
      duration: PHASE_S * 1000,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, [phase, scale]);

  useEffect(() => {
    const id = setInterval(() => setT((x) => x + 1), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <View style={{ alignItems: 'center', gap: 16 }}>
      <Text style={styles.title}>Para. Respira despacio.</Text>
      <Text style={styles.text}>No tienes que decidir nada ahora. Solo respira con el círculo.</Text>
      <View style={styles.circleWrap}>
        <Animated.View style={[styles.circle, { transform: [{ scale }] }]} />
        <View style={styles.circleCenter}>
          <Text style={styles.phase}>{PHASES[phase].label}</Text>
          <Text style={styles.phaseCount}>{left}</Text>
        </View>
      </View>
      <Text style={styles.textMuted}>Ciclos completados: {cycles} · Intenta llegar a 3</Text>
    </View>
  );
}

function UrgeTimer() {
  const TOTAL = 10 * 60;
  const [left, setLeft] = useState(TOTAL);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setLeft((l) => Math.max(0, l - 1)), 1000);
    return () => clearInterval(id);
  }, [running]);

  const mm = String(Math.floor(left / 60)).padStart(2, '0');
  const ss = String(left % 60).padStart(2, '0');

  return (
    <View style={{ alignItems: 'center', gap: 14 }}>
      <Text style={styles.title}>Surfea la ola 🌊</Text>
      <Text style={styles.text}>
        El impulso sube, llega a un pico y baja. Si no lo alimentas, pasa. Espera 10 minutos haciendo otra cosa: reza
        un misterio del Rosario, camina, habla con alguien.
      </Text>
      <Text style={styles.timer}>
        {mm}:{ss}
      </Text>
      {left === 0 ? (
        <Text style={styles.text}>La ola ha pasado. Da gracias a Dios: has sido fiel.</Text>
      ) : (
        <Pressable style={styles.next} onPress={() => setRunning(!running)}>
          <Text style={styles.nextText}>{running ? 'Pausar' : 'Empezar 10 minutos'}</Text>
        </Pressable>
      )}
      <Text style={styles.prayerSmall}>{PRAYERS[3].text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#141B38' },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 8 },
  stepText: { color: C.goldSoft, fontWeight: '700' },
  close: { color: '#fff', opacity: 0.7 },
  dots: { flexDirection: 'row', gap: 6, paddingHorizontal: 20, marginTop: 10 },
  dot: { flex: 1, height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.2)' },
  body: { padding: 20, gap: 14, maxWidth: 640, width: '100%', alignSelf: 'center' },
  title: { color: '#fff', fontSize: 24, fontWeight: '800', textAlign: 'center' },
  subtitle: { color: C.gold, fontSize: 16, fontWeight: '700', marginTop: 8 },
  text: { color: '#fff', fontSize: 17, lineHeight: 25, textAlign: 'center', opacity: 0.92 },
  textMuted: { color: '#fff', opacity: 0.6, textAlign: 'center' },
  prayer: { color: '#fff', fontSize: 19, lineHeight: 30, textAlign: 'center' },
  prayerSmall: { color: '#fff', opacity: 0.85, fontSize: 15, lineHeight: 23, fontStyle: 'italic' },
  quote: { color: C.goldSoft, fontStyle: 'italic', textAlign: 'center', fontSize: 16 },
  why: { color: C.goldSoft, fontSize: 20, lineHeight: 28, textAlign: 'center', fontStyle: 'italic' },
  big: { color: '#fff', fontSize: 80, fontWeight: '900', textAlign: 'center' },
  action: { backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 14, padding: 14 },
  actionText: { color: '#fff', fontSize: 17 },
  plans: { gap: 6, borderLeftWidth: 3, borderLeftColor: C.gold, paddingLeft: 12 },
  planText: { color: '#fff', fontSize: 15, lineHeight: 22 },
  callBtn: { backgroundColor: C.green, borderRadius: 14, padding: 14, alignItems: 'center' },
  callText: { color: '#fff', fontWeight: '700' },
  circleWrap: { width: 240, height: 240, alignItems: 'center', justifyContent: 'center' },
  circle: { position: 'absolute', width: 240, height: 240, borderRadius: 120, backgroundColor: 'rgba(201,162,39,0.35)', borderWidth: 2, borderColor: C.gold },
  circleCenter: { alignItems: 'center' },
  phase: { color: '#fff', fontSize: 24, fontWeight: '700' },
  phaseCount: { color: C.goldSoft, fontSize: 40, fontWeight: '900' },
  timer: { color: '#fff', fontSize: 64, fontWeight: '900', fontVariant: ['tabular-nums'] },
  footer: { padding: 16, gap: 10, maxWidth: 640, width: '100%', alignSelf: 'center' },
  next: { backgroundColor: C.gold, borderRadius: 14, padding: 16, alignItems: 'center' },
  nextText: { color: C.navy, fontWeight: '800', fontSize: 17 },
  win: { borderWidth: 1.5, borderColor: C.gold, borderRadius: 14, padding: 14, alignItems: 'center' },
  winText: { color: C.goldSoft, fontWeight: '700' },
});
