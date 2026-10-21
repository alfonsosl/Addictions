import { router } from 'expo-router';
import { Glyph } from '../../components/icons';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Text } from '../../components/Text';
import { TabScreen } from '../../components/overlays';
import { C, Card, H1, H2, P, Segmented, serif } from '../../components/ui';
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
          { value: 'oraciones', label: 'Oraciones' },
          { value: 'pastores', label: 'Sacerdotes' },
          { value: 'reflexiones', label: 'Biblia' },
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
          <Row icon="🌙" title="Examen de la noche" subtitle="Siete pasos antes de dormir" onPress={() => router.push('/examen')} />
          <Row icon="image" title="Ilustraciones" subtitle="Contempla una escena del Evangelio en silencio" onPress={() => router.push('/galeria')} />
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
                <Text style={{ color: C.muted, fontWeight: '300', fontSize: 13 }}>{r.source}</Text>
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
      <View style={styles.rowIcon}>
        <Glyph e={icon} size={22} color={C.navy} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontWeight: '500', color: C.ink, fontSize: 16 }}>{title}</Text>
        <Text style={{ color: C.muted, fontSize: 13 }} numberOfLines={2}>
          {subtitle}
        </Text>
      </View>
      <Glyph e="chevron" size={18} color={C.muted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  author: { color: C.muted, fontWeight: '500', fontSize: 12, letterSpacing: 1.5, textTransform: 'uppercase' },
  quote: { fontFamily: serif, fontStyle: 'italic', color: C.ink, fontSize: 18, lineHeight: 25 },
  more: { color: C.blue, fontWeight: '400' },
  rowIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', borderWidth: StyleSheet.hairlineWidth, borderColor: C.line },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: C.card,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: C.line,
    padding: 14,
  },
});
