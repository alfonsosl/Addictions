import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DailyLove } from '../../components/LoveIllustration';
import { C, serif } from '../../components/ui';
import {
  CONTRITION_ACT,
  EXAMEN_AREAS,
  EXAMEN_LIGHT_PRAYER,
  EXAMEN_PREP,
  EXAMEN_STEP_TITLES,
  HALT_OPTIONS,
  NIGHT_PRAYERS,
  RESOLUTION_IDEAS,
  REVIEW_PROMPTS,
  SHORT_CONTRITION,
  SLEEP_CHECKLIST,
} from '../../content/examen';
import { useFont } from '../../lib/fontScale';
import { examenKey } from '../../lib/game';
import { haptic, useStore } from '../../lib/store';

const toggle = (list: string[], v: string) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

export default function ExamenGuiado() {
  const { state, now, saveExamen } = useStore();
  const { t, fs } = useFont();
  const prev = state.examens[examenKey(now)];
  const [step, setStep] = useState(0);
  const [grat, setGrat] = useState<string[]>(() => {
    const g = (prev?.gratitude ?? '').split('\n');
    return [g[0] ?? '', g[1] ?? '', g[2] ?? ''];
  });
  const [godToday, setGodToday] = useState(prev?.godToday ?? '');
  const [struggle, setStruggle] = useState(prev?.struggle ?? '');
  const [halt, setHalt] = useState<string[]>(prev?.halt ?? []);
  const [marked, setMarked] = useState<string[]>(prev?.marked ?? []);
  const [resolution, setResolution] = useState(prev?.resolution ?? '');
  const [sleep, setSleep] = useState<string[]>(prev?.sleep ?? []);
  const last = EXAMEN_STEP_TITLES.length - 1;

  const finish = () => {
    saveExamen({
      gratitude: grat.map((x) => x.trim()).filter(Boolean).join('\n'),
      godToday: godToday.trim(),
      struggle: struggle.trim(),
      halt,
      marked,
      resolution: resolution.trim(),
      sleep,
    });
    router.dismissTo('/examen');
  };

  const input = (value: string, onChange: (v: string) => void, placeholder: string, multiline = true) => (
    <TextInput
      style={[styles.input, { fontSize: fs(16) }, multiline && { minHeight: 70, textAlignVertical: 'top' }]}
      placeholder={placeholder}
      placeholderTextColor="rgba(255,255,255,0.4)"
      value={value}
      onChangeText={onChange}
      multiline={multiline}
    />
  );

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.topBar}>
        <Text style={t(styles.stepText)}>
          {step + 1}/{EXAMEN_STEP_TITLES.length} · {EXAMEN_STEP_TITLES[step]}
        </Text>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Text style={styles.close}>Cerrar ✕</Text>
        </Pressable>
      </View>
      <View style={styles.dots}>
        {EXAMEN_STEP_TITLES.map((_, i) => (
          <View key={i} style={[styles.dot, i <= step && { backgroundColor: C.goldSoft }]} />
        ))}
      </View>

      <ScrollView key={step} contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
        {step === 0 && (
          <>
            <Text style={styles.moon}>🌙</Text>
            <Text style={t(styles.title)}>Ponte en presencia de Dios</Text>
            {EXAMEN_PREP.map((x, i) => (
              <Text key={i} style={t(styles.text)}>
                {x}
              </Text>
            ))}
            <Text style={t(styles.prayer)}>{EXAMEN_LIGHT_PRAYER}</Text>
          </>
        )}

        {step === 1 && (
          <>
            <Text style={t(styles.title)}>Da gracias</Text>
            <Text style={t(styles.text)}>Todo es don. Nombra tres cosas concretas de hoy, por pequeñas que sean.</Text>
            {grat.map((g, i) =>
              <View key={i}>{input(g, (v) => setGrat(grat.map((x, j) => (j === i ? v : x))), `${i + 1}. Gracias, Señor, por…`, false)}</View>,
            )}
          </>
        )}

        {step === 2 && (
          <>
            <Text style={t(styles.title)}>Repasa el día con Él</Text>
            <Text style={t(styles.text)}>Como quien ve una película a su lado, sin juzgarte: solo mirando.</Text>
            {REVIEW_PROMPTS.map((r) => (
              <View key={r.title} style={styles.box}>
                <Text style={t(styles.boxTitle)}>
                  {r.icon} {r.title}
                </Text>
                <Text style={t(styles.boxText)}>{r.text}</Text>
              </View>
            ))}
            <Text style={t(styles.subtitle)}>¿Dónde has visto a Dios hoy?</Text>
            {input(godToday, setGodToday, 'En una conversación, en un detalle, en una ayuda…')}
            <Text style={t(styles.subtitle)}>¿Cuándo me sentí débil o tentado? ¿Por qué?</Text>
            {input(struggle, setStruggle, 'Hoy me costó…')}
            <Text style={t(styles.subtitle)}>Hoy me he sentido…</Text>
            <View style={styles.chips}>
              {HALT_OPTIONS.map((h) => {
                const on = halt.includes(h);
                return (
                  <Pressable key={h} onPress={() => setHalt(toggle(halt, h))} style={[styles.chip, on && styles.chipOn]}>
                    <Text style={[styles.chipText, { fontSize: fs(14) }, on && { color: C.night }]}>{h}</Text>
                  </Pressable>
                );
              })}
            </View>
            <Text style={t(styles.hint)}>Conocer tus momentos de riesgo te ayuda a preparar el plan de mañana.</Text>
          </>
        )}

        {step === 3 && (
          <>
            <Text style={t(styles.title)}>Examina tu corazón</Text>
            <Text style={t(styles.text)}>
              No es para angustiarte, sino para ver con verdad. Marca lo que quieras poner en manos de Dios.
            </Text>
            {EXAMEN_AREAS.map((a) => (
              <View key={a.id} style={styles.box}>
                <Text style={t(styles.boxTitle)}>
                  {a.icon} {a.title}
                </Text>
                {a.questions.map((q) => {
                  const on = marked.includes(q.id);
                  return (
                    <Pressable
                      key={q.id}
                      accessibilityRole="checkbox"
                      accessibilityState={{ checked: on }}
                      onPress={() => {
                        haptic('light');
                        setMarked(toggle(marked, q.id));
                      }}
                      style={styles.q}
                    >
                      <View style={[styles.check, on && styles.checkOn]}>{on && <Text style={styles.checkMark}>✓</Text>}</View>
                      <Text style={[t(styles.boxText), { flex: 1 }]}>{q.text}</Text>
                    </Pressable>
                  );
                })}
              </View>
            ))}
            <Text style={t(styles.hint)}>Lo que marques se guarda solo en este dispositivo.</Text>
          </>
        )}

        {step === 4 && (
          <>
            <Text style={t(styles.title)}>Pide perdón con confianza</Text>
            <Text style={t(styles.text)}>
              {marked.length
                ? `Has puesto ${marked.length} ${marked.length === 1 ? 'cosa' : 'cosas'} en sus manos. Él no se cansa de perdonar.`
                : 'Aunque no hayas marcado nada, pide perdón por lo que no ves. Él no se cansa de perdonar.'}
            </Text>
            <Text style={t(styles.label)}>ACTO DE CONTRICIÓN</Text>
            <Text style={t(styles.prayer)}>{CONTRITION_ACT}</Text>
            <Text style={t(styles.label)}>O, MÁS BREVE</Text>
            <Text style={t(styles.prayer)}>{SHORT_CONTRITION}</Text>
            <View style={styles.box}>
              <Text style={t(styles.boxText)}>
                Si has caído en algo grave, acude a la confesión en cuanto puedas. Mientras, un arrepentimiento por amor a Dios,
                con el propósito de confesarte, ya obtiene su perdón (Catecismo, n.º 1452).
              </Text>
            </View>
          </>
        )}

        {step === 5 && (
          <>
            <Text style={t(styles.title)}>Un propósito para mañana</Text>
            <Text style={t(styles.text)}>Pequeño y concreto. Mejor con la forma «si… entonces…».</Text>
            {input(resolution, setResolution, 'Mañana, si…, entonces…')}
            <Text style={t(styles.subtitle)}>Ideas</Text>
            {RESOLUTION_IDEAS.map((r) => (
              <Pressable key={r} onPress={() => setResolution(r)} style={styles.idea}>
                <Text style={t(styles.boxText)}>+ {r}</Text>
              </Pressable>
            ))}
          </>
        )}

        {step === 6 && (
          <>
            <Text style={t(styles.title)}>Descansa en su amor</Text>
            <Text style={t(styles.subtitle)}>Antes de dormir</Text>
            {SLEEP_CHECKLIST.map((c) => {
              const on = sleep.includes(c.id);
              return (
                <Pressable
                  key={c.id}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: on }}
                  onPress={() => setSleep(toggle(sleep, c.id))}
                  style={styles.q}
                >
                  <View style={[styles.check, on && styles.checkOn]}>{on && <Text style={styles.checkMark}>✓</Text>}</View>
                  <Text style={[t(styles.boxText), { flex: 1 }]}>{c.text}</Text>
                </Pressable>
              );
            })}
            {NIGHT_PRAYERS.map((p) => (
              <View key={p.title} style={{ gap: 6 }}>
                <Text style={t(styles.label)}>{p.title.toUpperCase()}</Text>
                <Text style={t(styles.prayer)}>{p.text}</Text>
              </View>
            ))}
            <DailyLove date={now} compact />
          </>
        )}
      </ScrollView>

      <View style={styles.footer}>
        {step > 0 && (
          <Pressable style={styles.back} onPress={() => setStep(step - 1)}>
            <Text style={styles.backText}>‹</Text>
          </Pressable>
        )}
        {step < last ? (
          <Pressable style={styles.next} onPress={() => setStep(step + 1)}>
            <Text style={[styles.nextText, { fontSize: fs(17) }]}>Siguiente</Text>
          </Pressable>
        ) : (
          <Pressable style={styles.next} onPress={finish}>
            <Text style={[styles.nextText, { fontSize: fs(17) }]}>{prev ? 'Guardar · Buenas noches' : 'Amén · Buenas noches (+10)'}</Text>
          </Pressable>
        )}
      </View>
    </SafeAreaView>
  );
}

const W = 'rgba(255,255,255,';
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.night },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 8 },
  stepText: { color: C.goldSoft, fontWeight: '600', fontSize: 14 },
  close: { color: '#fff', opacity: 0.7 },
  dots: { flexDirection: 'row', gap: 6, paddingHorizontal: 20, marginTop: 10 },
  dot: { flex: 1, height: 3, borderRadius: 2, backgroundColor: W + '0.15)' },
  body: { padding: 22, gap: 14, maxWidth: 640, width: '100%', alignSelf: 'center', paddingBottom: 40 },
  moon: { fontSize: 44, textAlign: 'center', marginTop: 8 },
  title: { color: '#fff', fontSize: 25, fontWeight: '700', textAlign: 'center', fontFamily: serif },
  subtitle: { color: C.goldSoft, fontSize: 15, fontWeight: '600', marginTop: 6 },
  label: { color: C.goldSoft, fontSize: 12, fontWeight: '700', letterSpacing: 1.4, marginTop: 6 },
  text: { color: '#fff', fontSize: 16, lineHeight: 24, textAlign: 'center', opacity: 0.88 },
  hint: { color: '#fff', opacity: 0.5, fontSize: 13, lineHeight: 18, textAlign: 'center' },
  prayer: { color: '#fff', fontSize: 18, lineHeight: 29, fontFamily: serif, fontStyle: 'italic', opacity: 0.95 },
  box: { backgroundColor: W + '0.06)', borderRadius: 16, padding: 14, gap: 8 },
  boxTitle: { color: '#fff', fontSize: 16, fontWeight: '700' },
  boxText: { color: '#fff', fontSize: 15, lineHeight: 22, opacity: 0.88 },
  input: {
    backgroundColor: W + '0.07)',
    borderRadius: 14,
    padding: 14,
    color: '#fff',
    borderWidth: 1,
    borderColor: W + '0.12)',
  },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: 20, borderWidth: 1, borderColor: W + '0.25)' },
  chipOn: { backgroundColor: C.goldSoft, borderColor: C.goldSoft },
  chipText: { color: '#fff' },
  q: { flexDirection: 'row', gap: 12, alignItems: 'flex-start', paddingVertical: 6 },
  check: {
    width: 24,
    height: 24,
    borderRadius: 7,
    borderWidth: 1.5,
    borderColor: W + '0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  checkOn: { backgroundColor: C.goldSoft, borderColor: C.goldSoft },
  checkMark: { color: C.night, fontWeight: '900', fontSize: 14 },
  idea: { borderWidth: 1, borderColor: W + '0.12)', borderRadius: 14, padding: 12 },
  footer: { flexDirection: 'row', gap: 10, padding: 16, maxWidth: 640, width: '100%', alignSelf: 'center' },
  back: { width: 56, borderRadius: 16, borderWidth: 1, borderColor: W + '0.25)', alignItems: 'center', justifyContent: 'center' },
  backText: { color: '#fff', fontSize: 28, fontWeight: '300' },
  next: { flex: 1, backgroundColor: C.goldSoft, borderRadius: 16, padding: 16, alignItems: 'center' },
  nextText: { color: C.night, fontWeight: '700' },
});
