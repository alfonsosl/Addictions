import { Pressable, StyleSheet, View } from 'react-native';
import Svg from 'react-native-svg';
import { loveForDate } from '../content/love';
import { useFont } from '../lib/fontScale';
import { SCENE_META, SceneArt, type SceneId } from './art/scenes';
import { Text } from './Text';
import { C, serif } from './ui';

const W = 360;
const H = 640;

/** Escena recortada en formato apaisado alrededor de su motivo (para tarjetas). */
export function SceneCard({ id, height = 190, radius = 18 }: { id: SceneId; height?: number; radius?: number }) {
  const m = SCENE_META[id];
  const vh = 225; // ventana 360×225 (16:10)
  const y = Math.max(0, Math.min(H - vh, m.focus - vh / 2));
  return (
    <View style={{ height, borderRadius: radius, overflow: 'hidden', backgroundColor: m.bg }}>
      <Svg width="100%" height="100%" viewBox={`0 ${y} ${W} ${vh}`} preserveAspectRatio="xMidYMid slice">
        <SceneArt id={id} />
      </Svg>
    </View>
  );
}

/** Escena completa en vertical, como fondo de pantalla. */
export function SceneFull({ id }: { id: SceneId }) {
  return (
    <Svg width="100%" height="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice">
      <SceneArt id={id} />
    </Svg>
  );
}

/** Escena apaisada (atajo). */
export function LoveArt({ scene, height = 180 }: { scene: SceneId; height?: number }) {
  return <SceneCard id={scene} height={height} />;
}

/** Tarjeta diaria: «El amor de Dios, hoy». */
export function DailyLove({ date, compact, onPress }: { date: Date; compact?: boolean; onPress?: () => void }) {
  const day = loveForDate(date);
  const { fs } = useFont();
  return (
    <Pressable accessibilityRole="summary" onPress={onPress} disabled={!onPress} style={styles.card}>
      <SceneCard id={day.scene} height={compact ? 150 : 210} />
      <View style={styles.body}>
        <Text style={[styles.label, { fontSize: fs(11) }]}>EL AMOR DE DIOS, HOY</Text>
        <Text style={[styles.verse, { fontSize: fs(18), lineHeight: fs(26) }, compact && { color: '#F3EEDF' }]}>{day.verse}</Text>
        <Text style={[styles.source, { fontSize: fs(13) }]}>{day.source}</Text>
        {!compact && <Text style={[styles.thought, { fontSize: fs(15), lineHeight: fs(21) }]}>{day.thought}</Text>}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { gap: 14 },
  body: { gap: 6, paddingHorizontal: 12, alignItems: 'center' },
  label: { color: C.muted, fontWeight: '500', letterSpacing: 2 },
  verse: { fontFamily: serif, fontStyle: 'italic', color: C.ink, textAlign: 'center' },
  source: { color: C.muted, fontWeight: '300', letterSpacing: 0.5 },
  thought: { color: C.navy, fontWeight: '300', textAlign: 'center', marginTop: 4 },
});
