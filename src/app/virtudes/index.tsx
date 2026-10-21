import { router } from 'expo-router';
import { themed } from '../../lib/theme';
import { StyleSheet, View } from 'react-native';
import { Glyph } from '../../components/icons';
import { SceneCard } from '../../components/LoveIllustration';
import { Pressable } from '../../components/Tap';
import { Text } from '../../components/Text';
import { C, P, Screen, SectionTitle, serif } from '../../components/ui';
import { VirtueCard } from '../../components/VirtueTracker';
import { VIRTUES } from '../../content/virtues';
import { useFont } from '../../lib/fontScale';
import { MAX_VIRTUES, virtueStats } from '../../lib/game';
import { useStore } from '../../lib/store';

export default function Virtudes() {
  const { state, now } = useStore();
  const { t } = useFont();
  const focus = state.virtues.focus;

  return (
    <Screen edges={['left', 'right', 'bottom']}>
      <SceneCard id="vine" height={170} />
      <View style={{ gap: 8 }}>
        <Text style={t(styles.title)}>Crecer en virtudes</Text>
        <Text style={t(styles.verse)}>«No te dejes vencer por el mal; antes bien, vence el mal con el bien.»</Text>
        <Text style={t(styles.source)}>Rom 12,21</Text>
        <P muted>
          Salir de una adicción no es solo dejar algo: es llenar ese hueco con un bien. Cada vicio se vence con su virtud
          contraria. Elige hasta {MAX_VIRTUES}, ponte propósitos pequeños y márcalos cada día; también desde el examen de la
          noche.
        </P>
      </View>

      {focus.length > 0 && (
        <>
          <SectionTitle>En las que estás trabajando</SectionTitle>
          {focus.map((id) => (
            <VirtueCard key={id} virtueId={id} />
          ))}
        </>
      )}

      <SectionTitle>{focus.length ? 'Otras virtudes' : 'Elige en qué crecer'}</SectionTitle>
      <View style={styles.list}>
        {VIRTUES.filter((v) => !focus.includes(v.id)).map((v, i, arr) => {
          const st = virtueStats(state, v.id, now);
          return (
            <Pressable
              key={v.id}
              onPress={() => router.push({ pathname: '/virtudes/[id]', params: { id: v.id } })}
              style={[styles.row, i < arr.length - 1 && styles.rowLine]}
            >
              <View style={styles.icon}>
                <Glyph e={v.icon} size={22} color={C.navy} width={1.4} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={t(styles.name)}>{v.name}</Text>
                <Text style={t(styles.sub)}>
                  Frente a la {v.vice}
                  {st.total ? ` · ${st.level.name}` : ''}
                </Text>
              </View>
              <Glyph e="chevron" size={18} color={C.muted} />
            </Pressable>
          );
        })}
      </View>
      <P muted style={{ fontSize: 13 }}>
        Las siete primeras se oponen a los pecados capitales (Catecismo, n.º 1866); la fortaleza las sostiene a todas. Cada
        propósito cumplido suma talentos.
      </P>
    </Screen>
  );
}

const styles = themed(() =>
  StyleSheet.create({
  title: { fontSize: 28, fontWeight: '300', color: C.ink },
  verse: { fontFamily: serif, fontStyle: 'italic', fontSize: 18, lineHeight: 26, color: C.ink },
  source: { color: C.muted, fontSize: 13, fontWeight: '300', marginTop: -4 },
  list: { backgroundColor: C.card, borderRadius: 20, paddingHorizontal: 16, borderWidth: StyleSheet.hairlineWidth, borderColor: C.line },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12 },
  rowLine: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: C.line },
  icon: { width: 42, height: 42, borderRadius: 21, borderWidth: StyleSheet.hairlineWidth, borderColor: C.line, alignItems: 'center', justifyContent: 'center' },
  name: { fontSize: 17, color: C.ink },
  sub: { fontSize: 13, color: C.muted, fontWeight: '300' },
  }),
);
