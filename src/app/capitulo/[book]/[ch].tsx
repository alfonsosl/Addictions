import { router, Stack, useLocalSearchParams } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { StyleSheet, View } from 'react-native';
import { Pressable } from '../../../components/Tap';
import { SCENE_META } from '../../../components/art/scenes';
import { IllustratedScroll } from '../../../components/IllustratedScroll';
import { Text } from '../../../components/Text';
import { Button, C, P, serif } from '../../../components/ui';
import { sceneForChapter } from '../../../content/gospelScenes';
import { chapterId, GOSPEL_TEXT, GOSPELS, onlineUrl, RECOMMENDED, TEXT_CREDIT } from '../../../content/gospels';
import { useFont } from '../../../lib/fontScale';
import { useStore } from '../../../lib/store';

export default function Chapter() {
  const params = useLocalSearchParams<{ book: string; ch: string }>();
  const { state, markChapter } = useStore();
  const book = GOSPELS.find((g) => g.id === params.book) ?? GOSPELS[0];
  const ch = Math.min(book.chapters.length, Math.max(1, parseInt(params.ch ?? '1', 10) || 1));
  const id = chapterId(book.id, ch);
  const done = state.chaptersRead.includes(id);
  const verses = GOSPEL_TEXT[book.id]?.[ch - 1] ?? [];
  const hasGaps = verses.some((v) => !v);
  const reco = RECOMMENDED.find((r) => r.book === book.id && r.ch === ch);
  const scene = sceneForChapter(book.id, ch);

  // El tamaño de letra es el mismo de toda la app (Ajustes); A−/A+ lo cambia también aquí.
  const { idx, setIdx, fs } = useFont();
  const fontSize = fs(19);

  const go = (n: number) => router.replace({ pathname: '/capitulo/[book]/[ch]', params: { book: book.id, ch: String(n) } });

  return (
    <>
      <Stack.Screen options={{ title: '', headerTransparent: true, headerTintColor: SCENE_META[scene].dark ? '#F3EEDF' : C.navy }} />
      <IllustratedScroll
        key={id}
        scene={scene}
        header={(dark) => {
          const ink = dark ? '#F3EEDF' : C.ink;
          return (
            <View style={{ alignItems: 'center', gap: 6 }}>
              <Text style={[styles.book, { color: dark ? '#CFC7B2' : C.muted }]}>{book.name.toUpperCase()}</Text>
              <Text style={[styles.chNum, { color: ink }]}>{ch}</Text>
              <Text style={[styles.chTitle, { color: ink, fontSize: fs(21), lineHeight: fs(28) }]}>{book.chapters[ch - 1]}</Text>
              <View style={styles.fontCtl}>
                <Pressable onPress={() => setIdx(idx - 1)} hitSlop={8} accessibilityLabel="Letra más pequeña" style={[styles.fontBtn, dark && styles.fontBtnDark]}>
                  <Text style={{ fontSize: 14, color: ink }}>A−</Text>
                </Pressable>
                <Pressable onPress={() => setIdx(idx + 1)} hitSlop={8} accessibilityLabel="Letra más grande" style={[styles.fontBtn, dark && styles.fontBtnDark]}>
                  <Text style={{ fontSize: 19, color: ink }}>A+</Text>
                </Pressable>
              </View>
            </View>
          );
        }}
      >
        {reco && (
          <View style={styles.reco}>
            <Text style={styles.recoLabel}>PARA TU LUCHA</Text>
            <P>{reco.why}</P>
          </View>
        )}

        <View>
          {verses.map((v, i) =>
            v ? (
              <Text key={i} style={{ fontFamily: serif, fontSize, lineHeight: fontSize * 1.6, color: C.ink, marginBottom: 6 }}>
                <Text style={[styles.num, { fontSize: Math.round(fontSize * 0.62) }]}>{i + 1}  </Text>
                {v}
              </Text>
            ) : (
              <Text key={i} style={styles.gap}>
                {i + 1} · Versículo no disponible en esta edición digital.
              </Text>
            ),
          )}
        </View>

        <Button
          title={done ? 'Capítulo leído' : 'He leído este capítulo (+5)'}
          kind={done ? 'ghost' : 'primary'}
          disabled={done}
          celebrate
          confirm="Capítulo leído"
          onPress={() => markChapter(id)}
        />

        <View style={{ flexDirection: 'row', gap: 10 }}>
          <Button title="‹ Anterior" kind="ghost" disabled={ch <= 1} onPress={() => go(ch - 1)} style={{ flex: 1 }} />
          <Button title="Siguiente ›" kind="ghost" disabled={ch >= book.chapters.length} onPress={() => go(ch + 1)} style={{ flex: 1 }} />
        </View>

        <View style={styles.pray}>
          <Text style={styles.recoLabel}>PARA ORAR CON ESTE CAPÍTULO</Text>
          <P>1. Antes de leer: «Habla, Señor, que tu siervo escucha» (1 Sam 3,9).</P>
          <P>2. Lee despacio. Quédate con una frase.</P>
          <P>3. Dile a Jesús qué te ha tocado y qué vas a hacer hoy.</P>
        </View>

        <Text style={styles.credit}>
          {TEXT_CREDIT} Los corchetes [ ] indican palabras restauradas por el editor; […], texto perdido.
        </Text>
        <Pressable onPress={() => WebBrowser.openBrowserAsync(onlineUrl(book, ch)).catch(() => {})}>
          <Text style={styles.link}>
            {hasGaps ? '↗ Completar este capítulo en una traducción moderna (USCCB, online)' : '↗ Comparar con una traducción moderna (USCCB, online)'}
          </Text>
        </Pressable>
      </IllustratedScroll>
    </>
  );
}

const styles = StyleSheet.create({
  book: { fontSize: 12, letterSpacing: 2.5, fontWeight: '400' },
  chNum: { fontSize: 64, fontWeight: '300', lineHeight: 72 },
  chTitle: { fontFamily: serif, fontStyle: 'italic', textAlign: 'center', maxWidth: 320 },
  fontCtl: { flexDirection: 'row', gap: 8, marginTop: 10 },
  fontBtn: {
    width: 46,
    height: 38,
    borderRadius: 19,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: C.line,
    backgroundColor: 'rgba(247,243,232,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fontBtnDark: { backgroundColor: 'rgba(255,255,255,0.08)', borderColor: 'rgba(255,255,255,0.3)' },
  num: { color: C.blue, fontWeight: '500', fontFamily: undefined },
  gap: { color: C.muted, fontStyle: 'italic', fontSize: 14, marginBottom: 6 },
  reco: { borderLeftWidth: 1.5, borderLeftColor: C.blue, paddingLeft: 14, gap: 4 },
  recoLabel: { color: C.muted, fontSize: 11, letterSpacing: 2, fontWeight: '500' },
  pray: { gap: 4, paddingTop: 8 },
  credit: { color: C.muted, fontSize: 12, lineHeight: 17 },
  link: { color: C.blue, paddingVertical: 6 },
});
