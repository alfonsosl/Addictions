import { router, Stack, useLocalSearchParams } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Button, C, Card, H1, Label, P, Screen, serif } from '../../../components/ui';
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

  // El tamaño de letra es el mismo de toda la app (Ajustes); A−/A+ lo cambia también aquí.
  const { idx, setIdx, fs } = useFont();
  const changeSize = (d: number) => setIdx(idx + d);
  const fontSize = fs(18);

  const go = (n: number) => router.replace({ pathname: '/capitulo/[book]/[ch]', params: { book: book.id, ch: String(n) } });

  return (
    <Screen edges={['left', 'right', 'bottom']}>
      <Stack.Screen options={{ title: `${book.short} ${ch}` }} />
      <View style={styles.topRow}>
        <View style={{ flex: 1 }}>
          <Label>{book.name}</Label>
          <H1>Capítulo {ch}</H1>
        </View>
        <View style={styles.fontCtl}>
          <Pressable onPress={() => changeSize(-1)} hitSlop={8} accessibilityLabel="Letra más pequeña" style={styles.fontBtn}>
            <Text style={{ fontSize: 14, fontWeight: '800', color: C.navy }}>A−</Text>
          </Pressable>
          <Pressable onPress={() => changeSize(1)} hitSlop={8} accessibilityLabel="Letra más grande" style={styles.fontBtn}>
            <Text style={{ fontSize: 19, fontWeight: '800', color: C.navy }}>A+</Text>
          </Pressable>
        </View>
      </View>
      <Text style={{ fontFamily: serif, fontSize: fs(19), color: C.navySoft, fontStyle: 'italic' }}>{book.chapters[ch - 1]}</Text>

      {reco && (
        <Card style={{ backgroundColor: C.goldSoft, borderColor: C.gold }}>
          <P>⭐ Recomendado para tu lucha: {reco.why}</P>
        </Card>
      )}

      <Card>
        {verses.map((v, i) =>
          v ? (
            <Text key={i} style={{ fontFamily: serif, fontSize, lineHeight: fontSize * 1.6, color: C.ink, marginBottom: 6 }}>
              <Text style={[styles.num, { fontSize: Math.round(fontSize * 0.65) }]}>{i + 1} </Text>
              {v}
            </Text>
          ) : (
            <Text key={i} style={styles.gap}>
              {i + 1} · Versículo no disponible en esta edición digital.
            </Text>
          ),
        )}
      </Card>

      <Button
        title={done ? '✓ Capítulo leído' : '✓ He leído este capítulo (+5)'}
        kind={done ? 'ghost' : 'gold'}
        disabled={done}
        onPress={() => markChapter(id)}
      />

      <View style={{ flexDirection: 'row', gap: 10 }}>
        <Button title="‹ Anterior" kind="ghost" disabled={ch <= 1} onPress={() => go(ch - 1)} style={{ flex: 1 }} />
        <Button
          title="Siguiente ›"
          kind="ghost"
          disabled={ch >= book.chapters.length}
          onPress={() => go(ch + 1)}
          style={{ flex: 1 }}
        />
      </View>

      <Card>
        <Label>Para orar con este capítulo</Label>
        <P>1. Antes de leer: «Habla, Señor, que tu siervo escucha» (1 Sam 3,9).</P>
        <P>2. Lee despacio. Quédate con una frase.</P>
        <P>3. Dile a Jesús qué te ha tocado y qué vas a hacer hoy.</P>
      </Card>

      <Text style={styles.credit}>
        {TEXT_CREDIT} Los corchetes [ ] indican palabras restauradas por el editor; […], texto perdido.
      </Text>
      <Pressable onPress={() => WebBrowser.openBrowserAsync(onlineUrl(book, ch)).catch(() => {})}>
        <Text style={styles.link}>
          {hasGaps ? '↗ Completar este capítulo en una traducción moderna (USCCB, online)' : '↗ Comparar con una traducción moderna (USCCB, online)'}
        </Text>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  topRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 10 },
  fontCtl: { flexDirection: 'row', gap: 6 },
  fontBtn: {
    width: 44,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: C.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  num: { color: C.gold, fontWeight: '800' },
  gap: { color: C.muted, fontStyle: 'italic', fontSize: 14, marginBottom: 6 },
  credit: { color: C.muted, fontSize: 12, lineHeight: 17 },
  link: { color: C.navySoft, fontWeight: '600', paddingVertical: 6 },
});
