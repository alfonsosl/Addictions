import { router } from 'expo-router';
import { themed } from '../lib/theme';
import { Glyph } from './icons';
import { useEffect, useState, type ReactNode } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { Pressable } from './Tap';
import { Text } from './Text';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { haptic, useStore } from '../lib/store';
import { MilestoneModal, messageFor } from './StreakWelcome';
import { C, Screen } from './ui';

/** Aviso breve de recompensa ("+5 talentos"). */
export function ToastHost() {
  const { toast } = useStore();
  const insets = useSafeAreaInsets();
  const [y] = useState(() => new Animated.Value(-120));

  useEffect(() => {
    Animated.spring(y, { toValue: toast ? 0 : -120, useNativeDriver: true, friction: 8 }).start();
  }, [toast, y]);

  return (
    <Animated.View pointerEvents="none" style={[styles.toastWrap, { top: insets.top + 8, transform: [{ translateY: y }] }]}>
      {toast ? (
        <View style={styles.toast}>
          <Glyph e={toast.icon} size={20} color={C.bg} />
          <Text style={styles.toastText}>{toast.text}</Text>
        </View>
      ) : null}
    </Animated.View>
  );
}

/** Celebración a pantalla completa cuando se consigue una insignia. */
export function BadgeCelebration() {
  const { newBadge, dismissBadge } = useStore();
  if (!newBadge) return null;
  const m = messageFor(newBadge.days);
  return (
    <MilestoneModal
      visible
      onClose={dismissBadge}
      scene={m.scene}
      label="NUEVA INSIGNIA"
      big={String(newBadge.days)}
      unit={newBadge.days === 1 ? 'día en libertad' : 'días en libertad'}
      caption={newBadge.title}
      text={newBadge.text}
    />
  );
}

function usePulse(to: number, ms: number) {
  const [pulse] = useState(() => new Animated.Value(1));
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: to, duration: ms, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: ms, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [pulse, to, ms]);
  return pulse;
}

function openPanic() {
  haptic('heavy');
  router.push('/panico');
}

/** Botón SOS flotante para el resto de pestañas. */
export function PanicFab() {
  const pulse = usePulse(1.06, 1000);
  return (
    <Animated.View style={[styles.fabWrap, { transform: [{ scale: pulse }] }]}>
      <Pressable accessibilityRole="button" accessibilityLabel="Botón de pánico" onPress={openPanic} style={styles.fab}>
        <Text style={styles.fabText}>SOS</Text>
      </Pressable>
    </Animated.View>
  );
}

/** Barra flotante de Inicio: «He caído» y «Pánico», siempre visibles sobre el contenido. */
export function HomeActions() {
  const pulse = usePulse(1.04, 1100);
  return (
    <View pointerEvents="box-none" style={styles.barWrap}>
      <View style={styles.bar}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="He caído, quiero levantarme"
          onPress={() => {
            haptic('light');
            router.push('/caida');
          }}
          style={({ pressed }) => [styles.fall, pressed && { opacity: 0.7 }]}
        >
          <Text style={styles.fallIcon}>↺</Text>
          <Text style={styles.fallText}>He caído</Text>
        </Pressable>
        <Animated.View style={{ flex: 1.5, transform: [{ scale: pulse }] }}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Botón de pánico"
            onPress={openPanic}
            style={({ pressed }) => [styles.panic, pressed && { opacity: 0.9 }]}
          >
            <View style={styles.panicDot} />
            <Text style={styles.panicText}>Pánico</Text>
          </Pressable>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = themed(() =>
  StyleSheet.create({
  toastWrap: { position: 'absolute', left: 0, right: 0, alignItems: 'center', zIndex: 100 },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: C.navy,
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 24,
    maxWidth: 420,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  toastText: { color: C.onNavy, fontWeight: '700', fontSize: 15, flexShrink: 1 },
  fabWrap: { position: 'absolute', right: 20, bottom: 20 },
  fab: {
    backgroundColor: C.red,
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: C.bg,
    shadowColor: C.red,
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  fabText: { color: '#fff', fontWeight: '800', fontSize: 16, letterSpacing: 1 },
  barWrap: { position: 'absolute', left: 0, right: 0, bottom: 14, alignItems: 'center', paddingHorizontal: 16 },
  bar: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
    maxWidth: 520,
    padding: 8,
    borderRadius: 30,
    backgroundColor: C.overlay,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: C.line,
    shadowColor: '#1F2A52',
    shadowOpacity: 0.16,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },
  fall: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 22,
    paddingVertical: 14,
    backgroundColor: C.chip,
  },
  fallIcon: { fontSize: 18, color: C.navy, fontWeight: '700' },
  fallText: { color: C.navy, fontWeight: '700', fontSize: 16 },
  panic: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderRadius: 22,
    paddingVertical: 14,
    backgroundColor: C.red,
    shadowColor: C.red,
    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  panicDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: C.card },
  panicText: { color: '#fff', fontWeight: '800', fontSize: 17, letterSpacing: 0.5 },
  }),
);

/** Pantalla de pestaña con el botón SOS flotante siempre visible. */
export function TabScreen({ children }: { children: ReactNode }) {
  return (
    <View style={{ flex: 1 }}>
      <Screen fabSpace>{children}</Screen>
      <PanicFab />
    </View>
  );
}
