import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { TabScreen } from '../../components/overlays';
import { C, Card, H1, H2, P, Segmented } from '../../components/ui';
import { PRAYERS } from '../../content/prayers';
import { PRIEST_REFLECTIONS } from '../../content/priests';
import { REFLECTIONS } from '../../content/reflections';

type Mode = 'oraciones' | 'pastores' | 'reflexiones';

export default function Rezar() {
  const [mode, setMode] = useState<Mode>('oraciones');
  return (
    <TabScreen>
      <H1>Rezar</H1>
      <Segmented
        value={mode}
        onChange={setMode}
        options={[
          { value: 'oraciones', label: '🙏 Oraciones' },
          { value: 'pastores', label: '⛪ Sacerdotes' },
          { value: 'reflexiones', label: '✨ Biblia' },
        ]}
      />

      {mode === 'oraciones' && (
        <>
          <P muted>Toca una oración para rezarla con calma.</P>
          {PRAYERS.map((p) => (
            <Row
              key={p.id}
              title={p.title}
              subtitle={p.when}
              onPress={() => router.push({ pathname: '/oracion/[id]', params: { id: p.id } })}
            />
          ))}
          <Row icon="🌙" title="Examen de conciencia" subtitle="Cinco pasos antes de dormir" onPress={() => router.push('/examen')} />
        </>
      )}

      {mode === 'pastores' && (
        <>
          <P muted>Palabras de santos sacerdotes, obispos y papas sobre la pureza, la oración y la misericordia, con su fuente.</P>
          {PRIEST_REFLECTIONS.map((r) => (
            <Pressable key={r.id} onPress={() => router.push({ pathname: '/sacerdote/[id]', params: { id: r.id } })}>
              <Card>
                <Text style={styles.author}>{r.author}</Text>
                <Text style={styles.quote}>«{r.quote}»</Text>
                <Text style={styles.more}>Leer reflexión →</Text>
              </Card>
            </Pressable>
          ))}
        </>
      )}

      {mode === 'reflexiones' && (
        <>
          <P muted>Una reflexión bíblica distinta cada día. Puedes leer cualquiera cuando quieras.</P>
          {REFLECTIONS.map((r) => (
            <Pressable key={r.id} onPress={() => router.push({ pathname: '/reflexion/[id]', params: { id: r.id } })}>
              <Card>
                <H2>{r.title}</H2>
                <Text style={styles.quote}>«{r.quote}»</Text>
                <Text style={{ color: C.muted, fontWeight: '700', fontSize: 13 }}>{r.source}</Text>
              </Card>
            </Pressable>
          ))}
        </>
      )}
    </TabScreen>
  );
}

function Row({ icon = '🙏', title, subtitle, onPress }: { icon?: string; title: string; subtitle: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.row, pressed && { opacity: 0.7 }]}>
      <Text style={{ fontSize: 24 }}>{icon}</Text>
      <View style={{ flex: 1 }}>
        <Text style={{ fontWeight: '800', color: C.navy, fontSize: 16 }}>{title}</Text>
        <Text style={{ color: C.muted, fontSize: 13 }} numberOfLines={2}>
          {subtitle}
        </Text>
      </View>
      <Text style={{ color: C.muted, fontSize: 22 }}>›</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  author: { color: C.gold, fontWeight: '800', fontSize: 13, letterSpacing: 0.5, textTransform: 'uppercase' },
  quote: { fontStyle: 'italic', color: C.navy, fontSize: 16, lineHeight: 23 },
  more: { color: C.navySoft, fontWeight: '700' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: C.line,
    padding: 14,
  },
});
