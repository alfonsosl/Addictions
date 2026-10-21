import { useState, type ReactNode } from 'react';
import { Animated, StyleSheet, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SCENE_META, type SceneId } from './art/scenes';
import { SceneFull } from './LoveIllustration';
import { Text } from './Text';
import { C } from './ui';

/**
 * Pantalla con una ilustración a toda página:
 * - al principio se ve en grande, detrás del título (como un fondo de pantalla);
 * - al desplazarte, se desvanece hasta quedar como un fondo muy tenue que no estorba la lectura.
 */
export function IllustratedScroll({
  scene,
  header,
  children,
  bottomSpace = 40,
  heroRatio = 0.74,
}: {
  scene: SceneId;
  header: (dark: boolean) => ReactNode;
  children: ReactNode;
  bottomSpace?: number;
  heroRatio?: number;
}) {
  const { height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const [scrollY] = useState(() => new Animated.Value(0));
  const hero = Math.round(height * heroRatio);
  const dark = !!SCENE_META[scene].dark;

  // Se atenúa antes de que el texto llegue a la ilustración; las escenas nocturnas, aún más.
  const bgOpacity = scrollY.interpolate({ inputRange: [0, hero * 0.45], outputRange: [1, dark ? 0.07 : 0.12], extrapolate: 'clamp' });
  const bgShift = scrollY.interpolate({ inputRange: [0, hero], outputRange: [0, -hero * 0.18], extrapolate: 'clamp' });
  const hintOpacity = scrollY.interpolate({ inputRange: [0, 60], outputRange: [1, 0], extrapolate: 'clamp' });

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <Animated.View
        pointerEvents="none"
        style={{ position: 'absolute', top: 0, left: 0, right: 0, height: height + hero * 0.2, opacity: bgOpacity, transform: [{ translateY: bgShift }] }}
      >
        <SceneFull id={scene} />
      </Animated.View>
      <Animated.ScrollView
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
        scrollEventThrottle={16}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: bottomSpace }}
      >
        <View style={[styles.hero, { minHeight: hero, paddingTop: insets.top + 56 }]}>
          <View style={styles.inner}>{header(dark)}</View>
          <Animated.View style={[styles.hint, { opacity: hintOpacity }]}>
            <Text style={[styles.hintText, dark && { color: '#D9D2BF' }]}>Desliza para leer</Text>
            <Text style={[styles.hintArrow, dark && { color: '#D9D2BF' }]}>⌄</Text>
          </Animated.View>
        </View>
        <View style={[styles.inner, styles.body]}>{children}</View>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: { justifyContent: 'space-between', paddingBottom: 12 },
  inner: { paddingHorizontal: 22, maxWidth: 640, width: '100%', alignSelf: 'center', gap: 16 },
  body: { paddingTop: 8 },
  hint: { alignItems: 'center' },
  hintText: { color: C.muted, fontSize: 12, letterSpacing: 2, fontWeight: '300', textTransform: 'uppercase' },
  hintArrow: { color: C.muted, fontSize: 20, marginTop: -4 },
});
