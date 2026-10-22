import { useState } from 'react';
import { themed } from '../lib/theme';
import { ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import { Pressable } from '../components/Tap';
import { SCENE_META, type SceneId } from '../components/art/scenes';
import { SceneFull } from '../components/LoveIllustration';
import { Text } from '../components/Text';
import { C } from '../components/ui';
import { LOVE_DAYS } from '../content/love';

const CAPTIONS: Record<SceneId, string> = {
  sea: 'Me tendió la mano',
  flock: 'Me ha encontrado',
  cross: 'Me amó y se entregó por mí',
  path: 'El Padre salió corriendo',
  mountain: 'Bienaventurados los limpios de corazón',
  field: 'Mirad los lirios del campo',
  night: 'Nos ha nacido un Salvador',
  vine: 'Permaneced en mi amor',
  well: 'Agua viva',
  bread: 'El pan de vida',
  light: 'La luz del mundo',
  dove: 'Tú eres mi Hijo amado',
  tomb: 'No está aquí: ha resucitado',
  heart: 'Eres precioso a mis ojos',
  shepherd: 'El Señor es mi pastor',
  storm: '¡Silencio, enmudece!',
  nets: 'Echad la red',
  mary: 'Hágase en mí según tu palabra',
  lamb: 'El Cordero de Dios',
  garden: 'No se haga mi voluntad, sino la tuya',
  tree: 'Como árbol junto a la acequia',
  stars: 'Mira al cielo y cuenta las estrellas',
  eagle: 'Alas como de águila',
};

/** Galería de ilustraciones a pantalla completa (para rezar con ellas). */
export default function Galeria() {
  const { width } = useWindowDimensions();
  const ids = Object.keys(SCENE_META) as SceneId[];
  const [i, setI] = useState(0);
  const w = Math.min(width, 640);
  const id = ids[i];
  const verse = LOVE_DAYS.find((d) => d.scene === id);
  const dark = SCENE_META[id].dark;
  return (
    <View style={{ flex: 1, backgroundColor: SCENE_META[id].bg }}>
      <View style={StyleSheet.absoluteFill}>
        <SceneFull id={id} />
      </View>
      <ScrollView contentContainerStyle={[styles.wrap, { width: w }]}>
        <Text style={[styles.caption, dark && { color: '#F3EEDF' }]}>{CAPTIONS[id]}</Text>
        {verse ? (
          <Text style={[styles.src, dark && { color: '#C9C2AE' }]}>
            {verse.source}
          </Text>
        ) : null}
      </ScrollView>
      <View style={styles.nav}>
        <Pressable accessibilityLabel="Anterior" onPress={() => setI((i + ids.length - 1) % ids.length)} style={styles.btn}>
          <Text style={styles.btnText}>‹</Text>
        </Pressable>
        <Text style={[styles.count, dark && { color: '#F3EEDF' }]}>
          {i + 1} / {ids.length}
        </Text>
        <Pressable accessibilityLabel="Siguiente" onPress={() => setI((i + 1) % ids.length)} style={styles.btn}>
          <Text style={styles.btnText}>›</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = themed(() =>
  StyleSheet.create({
  wrap: { alignSelf: 'center', paddingTop: 96, alignItems: 'center', gap: 4 },
  caption: { fontSize: 20, fontWeight: '300', color: C.ink, letterSpacing: 0.5, textAlign: 'center' },
  src: { fontSize: 13, color: C.muted, fontWeight: '300' },
  nav: { position: 'absolute', bottom: 28, left: 0, right: 0, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 24 },
  btn: { width: 48, height: 48, borderRadius: 24, backgroundColor: C.overlay, alignItems: 'center', justifyContent: 'center', borderWidth: StyleSheet.hairlineWidth, borderColor: C.line },
  btnText: { fontSize: 26, color: C.navy, fontWeight: '300' },
  count: { color: C.muted, fontWeight: '300' },
  }),
);
