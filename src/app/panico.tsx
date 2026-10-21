import { router } from 'expo-router';
import { useConfirm } from '../components/useConfirm';
import { Glyph } from '../components/icons';
import { useEffect, useState } from 'react';
import { Animated, Easing, Linking, ScrollView, StyleSheet, View } from 'react-native';
import { Pressable } from '../components/Tap';
import { Text } from '../components/Text';
import { SafeAreaView } from 'react-native-safe-area-context';
import { C, serif } from '../components/ui';
import { PRAYERS } from '../content/prayers';
import { useFont } from '../lib/fontScale';
import { streakDays } from '../lib/game';
import { useStore } from '../lib/store';

// Flujo de emergencia: 1) Para y respira  2) Reza  3) Muévete  4) Recuerda tu porqué  5) Surfea la ola
const CREAM = '#EFEADB';
const STEPS = ['Respira', 'Reza', 'Muévete', 'Tu porqué', 'Espera'];

const PHASES = [
  { label: 'Inspira', scale: 1 },
  { label: 'Mantén', scale: 1 },
  { label: 'Espira', scale: 0.55 },
  { label: 'Mantén', scale: 0.55 },
];
const PHASE_S = 4; // respiración cuadrada 4-4-4-4

const ACTIONS: [string, string][] = [
  ['🚶', 'Levántate ahora y sal de la habitación'],
  ['📵', 'Deja el móvil en otra habitación o apágalo'],
  ['💧', 'Lávate la cara con agua fría'],
  ['🏃', 'Haz 20 flexiones o sentadillas'],
  ['🌳', 'Sal a dar un paseo de 10 minutos'],
  ['🤝', 'Ve a donde haya otras personas'],
];

export default function Panic() {
  const { t } = useFont();
  const { state, now, addVictory } = useStore();
  const [step, setStep] = useState(0);
  const days = streakDays(state, now);
  const p = state.profile;

  const victory = useConfirm(true);
  const win = () => {
    addVictory();
    router.back();
  };

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.topBar}>
        <Text style={t(styles.stepText)}>
          {step + 1}/{STEPS.length} · {STEPS[step]}
        </Text>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Text style={styles.close}>Cerrar ✕</Text>
        </Pressable>
      </View>
      <View style={styles.dots}>
        {STEPS.map((_, i) => (
          <View key={i} style={[styles.dot, i <= step && { backgroundColor: CREAM }]} />
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.body}>
        {step === 0 && <Breathing />}

        {step === 1 && (
          <>
            <Text style={t(styles.title)}>Reza, aunque sea con pocas palabras</Text>
            <Text style={t(styles.prayer)}>{PRAYERS[0].text}</Text>
            <Text style={t(styles.subtitle)}>{PRAYERS[1].title}</Text>
            <Text style={t(styles.prayerSmall)}>{PRAYERS[1].text}</Text>
          </>
        )}

        {step === 2 && (
          <>
            <Text style={t(styles.title)}>Huye: no dialogues con la tentación</Text>
            <Text style={t(styles.text)}>«Él, dejando el manto en sus manos, salió huyendo» (Gn 39,12). Elige una y hazla YA:</Text>
            {ACTIONS.map(([icon, a]) => (
              <View key={a} style={styles.action}>
                <Glyph e={icon} size={22} color={CREAM} />
                <Text style={[t(styles.actionText), { flex: 1 }]}>{a}</Text>
              </View>
            ))}
            {p?.ifThen.length ? (
              <View style={styles.plans}>
                <Text style={t(styles.subtitle)}>Tus planes</Text>
                {p.ifThen.map((x, i) => (
                  <Text key={i} style={t(styles.planText)}>
                    Si {x.when}, entonces {x.then}.
                  </Text>
                ))}
              </View>
            ) : null}
            {p?.contactPhone ? (
              <View style={{ flexDirection: 'row', gap: 10 }}>
                <Pressable style={[styles.callBtn, { flex: 1 }]} onPress={() => Linking.openURL(`tel:${p.contactPhone}`)}>
                  <Text style={t(styles.callText)}>Llamar a {p.contactName || 'mi contacto'}</Text>
                </Pressable>
                <Pressable
                  style={[styles.callBtn, { flex: 1, backgroundColor: C.navySoft }]}
                  onPress={() =>
                    Linking.openURL(`sms:${p.contactPhone}?body=${encodeURIComponent('Estoy teniendo una lucha ahora. ¿Puedes rezar por mí o llamarme?')}`)
                  }
                >
                  <Text style={t(styles.callText)}>Enviar mensaje</Text>
                </Pressable>
              </View>
            ) : (
              <Text style={t(styles.textMuted)}>Añade un contacto de confianza en Ajustes para poder llamarle desde aquí.</Text>
            )}
          </>
        )}

        {step === 3 && (
          <>
            <Text style={t(styles.title)}>Recuerda por qué luchas</Text>
            {p?.why ? <Text style={t(styles.why)}>«{p.why}»</Text> : null}
            <Text style={styles.big}>{days}</Text>
            <Text style={t(styles.text)}>días de libertad. No los cambies por unos minutos que dejan vacío.</Text>
            <Text style={t(styles.text)}>
              La pornografía promete descanso y deja más soledad. Lo que de verdad buscas —amor, paz, sentido— está en
              Dios y en las personas reales.
            </Text>
            <Text style={t(styles.quote)}>«Fiel es Dios… con la tentación os dará también la salida» (1 Cor 10,13)</Text>
          </>
        )}

        {step === 4 && <UrgeTimer />}
      </ScrollView>

      <View style={styles.footer}>
        {step < STEPS.length - 1 ? (
          <Pressable style={styles.next} onPress={() => setStep(step + 1)}>
            <Text style={t(styles.nextText)}>Siguiente</Text>
          </Pressable>
        ) : null}
        <Pressable style={[styles.win, victory.flashing && styles.winDone]} onPress={() => victory.run(win)} feedback={false}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            {victory.flashing && <Glyph e="✓" size={18} color={C.night} width={2} />}
            <Text style={[t(styles.winText), victory.flashing && { color: C.night }]}>
              {victory.flashing ? '¡Gracias, Señor! Has vencido' : 'He vencido esta tentación (+20 talentos)'}
            </Text>
          </View>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

function Breathing() {
  const { t } = useFont();
  const [scale] = useState(() => new Animated.Value(0.55));
  const [secs, setSecs] = useState(0); // segundos transcurridos
  const phase = Math.floor(secs / PHASE_S) % PHASES.length;
  const left = PHASE_S - (secs % PHASE_S);
  const cycles = Math.floor(secs / (PHASE_S * PHASES.length));

  useEffect(() => {
    Animated.timing(scale, {
      toValue: PHASES[phase].scale,
      duration: PHASE_S * 1000,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, [phase, scale]);

  useEffect(() => {
    const id = setInterval(() => setSecs((x) => x + 1), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <View style={{ alignItems: 'center', gap: 16 }}>
      <Text style={t(styles.title)}>Para. Respira despacio.</Text>
      <Text style={t(styles.text)}>No tienes que decidir nada ahora. Solo respira con el círculo.</Text>
      <View style={styles.circleWrap}>
        <Animated.View style={[styles.circle, { transform: [{ scale }] }]} />
        <View style={styles.circleCenter}>
          <Text style={styles.phase}>{PHASES[phase].label}</Text>
          <Text style={styles.phaseCount}>{left}</Text>
        </View>
      </View>
      <Text style={t(styles.textMuted)}>Ciclos completados: {cycles} · Intenta llegar a 3</Text>
    </View>
  );
}

function UrgeTimer() {
  const { t } = useFont();
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
      <Text style={t(styles.title)}>Surfea la ola</Text>
      <Text style={t(styles.text)}>
        El impulso sube, llega a un pico y baja. Si no lo alimentas, pasa. Espera 10 minutos haciendo otra cosa: reza
        un misterio del Rosario, camina, habla con alguien.
      </Text>
      <Text style={styles.timer}>
        {mm}:{ss}
      </Text>
      {left === 0 ? (
        <Text style={t(styles.text)}>La ola ha pasado. Da gracias a Dios: has sido fiel.</Text>
      ) : (
        <Pressable style={styles.next} onPress={() => setRunning(!running)}>
          <Text style={t(styles.nextText)}>{running ? 'Pausar' : 'Empezar 10 minutos'}</Text>
        </Pressable>
      )}
      <Text style={t(styles.prayerSmall)}>{PRAYERS[3].text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.night },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 8 },
  stepText: { color: CREAM, fontWeight: '700' },
  close: { color: '#fff', opacity: 0.7 },
  dots: { flexDirection: 'row', gap: 6, paddingHorizontal: 20, marginTop: 10 },
  dot: { flex: 1, height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.2)' },
  body: { padding: 20, gap: 14, maxWidth: 640, width: '100%', alignSelf: 'center' },
  title: { color: '#fff', fontFamily: serif, fontSize: 26, fontWeight: '500', textAlign: 'center' },
  subtitle: { color: CREAM, fontSize: 16, fontWeight: '700', marginTop: 8 },
  text: { color: '#fff', fontSize: 17, lineHeight: 25, textAlign: 'center', opacity: 0.92 },
  textMuted: { color: '#fff', opacity: 0.6, textAlign: 'center' },
  prayer: { color: '#fff', fontSize: 19, lineHeight: 30, textAlign: 'center' },
  prayerSmall: { color: '#fff', opacity: 0.85, fontSize: 15, lineHeight: 23, fontStyle: 'italic' },
  quote: { color: CREAM, fontStyle: 'italic', textAlign: 'center', fontSize: 16 },
  why: { color: CREAM, fontSize: 20, lineHeight: 28, textAlign: 'center', fontStyle: 'italic' },
  big: { color: '#fff', fontSize: 80, fontWeight: '300', textAlign: 'center' },
  action: { flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: StyleSheet.hairlineWidth, borderColor: 'rgba(239,234,219,0.35)', borderRadius: 14, padding: 14 },
  actionText: { color: '#fff', fontSize: 17, fontWeight: '300' },
  plans: { gap: 6, borderLeftWidth: 3, borderLeftColor: CREAM, paddingLeft: 12 },
  planText: { color: '#fff', fontSize: 15, lineHeight: 22 },
  callBtn: { backgroundColor: C.green, borderRadius: 14, padding: 14, alignItems: 'center' },
  callText: { color: '#fff', fontWeight: '700' },
  circleWrap: { width: 240, height: 240, alignItems: 'center', justifyContent: 'center' },
  circle: { position: 'absolute', width: 240, height: 240, borderRadius: 120, backgroundColor: 'rgba(46,109,180,0.25)', borderWidth: 1, borderColor: CREAM },
  circleCenter: { alignItems: 'center' },
  phase: { color: '#fff', fontSize: 24, fontWeight: '700' },
  phaseCount: { color: CREAM, fontSize: 40, fontWeight: '300' },
  timer: { color: '#fff', fontSize: 64, fontWeight: '300', fontVariant: ['tabular-nums'] },
  footer: { padding: 16, gap: 10, maxWidth: 640, width: '100%', alignSelf: 'center' },
  next: { backgroundColor: CREAM, borderRadius: 14, padding: 16, alignItems: 'center' },
  nextText: { color: C.navy, fontWeight: '500', fontSize: 17 },
  winDone: { backgroundColor: CREAM },
  win: { borderWidth: 1.5, borderColor: CREAM, borderRadius: 14, padding: 14, alignItems: 'center' },
  winText: { color: CREAM, fontWeight: '700' },
});
