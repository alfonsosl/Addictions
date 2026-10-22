import { useState, type ReactNode } from 'react';
import { themed } from '../lib/theme';
import { Animated, StyleSheet, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SCENE_META, type SceneId } from './art/scenes';
import { SceneFull } from './LoveIllustration';
import { Text } from './Text';
import { C } from './ui';

/**
 * Pantalla con una ilustración a toda página:
 * - al principio se ve en grande, detrás del título (como un fondo de pantalla);
 * - el texto va siempre sobre una hoja lisa que sube por encima del dibujo, para leer sin interferencias.
 */
export function IllustratedScroll({
  scene,
  header,
  children,
  bottomSpace = 40,
  heroRatio = 0.8,
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
  // Sube el dibujo para que su motivo quede a ~52 % de la altura, por encima de la hoja de lectura.
  const canvas = height + hero * 0.2; // alto del dibujo (algo más que la pantalla, por el desplazamiento)
  const k = canvas / 640;
  const meta = SCENE_META[scene];
  let lift = Math.max(0, meta.focus * k - height * 0.52);
  if (meta.top !== undefined) lift = Math.min(lift, Math.max(0, meta.top * k - height * 0.34));

  // La ilustración se atenúa un poco y se desplaza más despacio que la hoja (efecto de profundidad).
  const bgOpacity = scrollY.interpolate({ inputRange: [0, hero], outputRange: [1, 0.55], extrapolate: 'clamp' });
  const bgShift = scrollY.interpolate({ inputRange: [0, hero], outputRange: [0, -hero * 0.18], extrapolate: 'clamp' });
  const hintOpacity = scrollY.interpolate({ inputRange: [0, 60], outputRange: [1, 0], extrapolate: 'clamp' });

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <Animated.View
        pointerEvents="none"
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: -lift,
          height: canvas + lift,
          backgroundColor: meta.bg,
          opacity: bgOpacity,
          transform: [{ translateY: bgShift }],
        }}
      >
        <View style={{ height: canvas }}>
          <SceneFull id={scene} />
        </View>
      </Animated.View>
      <Animated.ScrollView
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
        scrollEventThrottle={16}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View style={[styles.hero, { minHeight: hero, paddingTop: insets.top + 56 }]}>
          <View style={styles.inner}>{header(dark)}</View>
          <Animated.View style={[styles.hint, { opacity: hintOpacity }]}>
            <Text style={[styles.hintText, dark && { color: '#D9D2BF' }]}>Desliza para leer</Text>
            <Text style={[styles.hintArrow, dark && { color: '#D9D2BF' }]}>⌄</Text>
          </Animated.View>
        </View>
        <View style={[styles.sheet, { minHeight: height - insets.top, paddingBottom: bottomSpace + 24, flexGrow: 1 }]}>
          <View style={styles.grabber} />
          <View style={[styles.inner, styles.body]}>{children}</View>
        </View>
      </Animated.ScrollView>
    </View>
  );
}

const styles = themed(() =>
  StyleSheet.create({
  hero: { justifyContent: 'space-between', paddingBottom: 12 },
  inner: { paddingHorizontal: 22, maxWidth: 640, width: '100%', alignSelf: 'center', gap: 16 },
  sheet: {
    backgroundColor: C.bg,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 10,
    paddingBottom: 24,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: -4 },
    elevation: 8,
  },
  grabber: { alignSelf: 'center', width: 40, height: 4, borderRadius: 2, backgroundColor: C.line, marginBottom: 14 },
  body: { paddingTop: 4 },
  hint: { alignItems: 'center' },
  hintText: { color: C.muted, fontSize: 12, letterSpacing: 2, fontWeight: '300', textTransform: 'uppercase' },
  hintArrow: { color: C.muted, fontSize: 20, marginTop: -4 },
  }),
);
