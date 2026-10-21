import { router, Stack, useLocalSearchParams } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { Text, View } from 'react-native';
import { Button, C, Card, H1, Label, P, Screen, serif } from '../../../components/ui';
import { chapterId, GOSPELS, OFFLINE_TEXT, onlineUrl, RECOMMENDED } from '../../../content/gospels';
import { useStore } from '../../../lib/store';

export default function Chapter() {
  const params = useLocalSearchParams<{ book: string; ch: string }>();
  const { state, markChapter } = useStore();
  const book = GOSPELS.find((g) => g.id === params.book) ?? GOSPELS[0];
  const ch = Math.min(book.chapters.length, Math.max(1, parseInt(params.ch ?? '1', 10) || 1));
  const id = chapterId(book.id, ch);
  const done = state.chaptersRead.includes(id);
  const verses = OFFLINE_TEXT[book.id]?.[ch - 1];
  const reco = RECOMMENDED.find((r) => r.book === book.id && r.ch === ch);

  const go = (n: number) => router.replace({ pathname: '/capitulo/[book]/[ch]', params: { book: book.id, ch: String(n) } });

  return (
    <Screen edges={['left', 'right', 'bottom']}>
      <Stack.Screen options={{ title: `${book.short} ${ch}` }} />
      <Label>{book.name}</Label>
      <H1>Capítulo {ch}</H1>
      <Text style={{ fontFamily: serif, fontSize: 20, color: C.navySoft, fontStyle: 'italic' }}>{book.chapters[ch - 1]}</Text>
      {reco && (
        <Card style={{ backgroundColor: C.goldSoft, borderColor: C.gold }}>
          <P>⭐ Recomendado para tu lucha: {reco.why}</P>
        </Card>
      )}

      {verses ? (
        <Card>
          {verses.map((v, i) => (
            <Text key={i} style={{ fontFamily: serif, fontSize: 18, lineHeight: 29, color: C.ink }}>
              <Text style={{ color: C.gold, fontWeight: '800', fontSize: 13 }}>{i + 1} </Text>
              {v}
            </Text>
          ))}
        </Card>
      ) : (
        <Card>
          <P>Lee el capítulo completo en la Biblia católica oficial de la Conferencia Episcopal de EE. UU. (en español).</P>
          <Button
            title="📖 Leer el capítulo completo"
            kind="gold"
            onPress={() => WebBrowser.openBrowserAsync(onlineUrl(book, ch)).catch(() => {})}
          />
          <Text style={{ color: C.muted, fontSize: 12 }}>Se abre dentro de la app. Necesita conexión.</Text>
        </Card>
      )}

      <Card>
        <Label>Antes y después de leer</Label>
        <P>1. Pide luz: «Habla, Señor, que tu siervo escucha» (1 Sam 3,9).</P>
        <P>2. Lee despacio. Quédate con una frase.</P>
        <P>3. Dile a Jesús qué te ha tocado y qué vas a hacer hoy.</P>
      </Card>

      <Button
        title={done ? '✓ Capítulo leído' : '✓ He leído este capítulo (+5)'}
        kind={done ? 'ghost' : 'primary'}
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
    </Screen>
  );
}
