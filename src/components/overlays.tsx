import { router } from 'expo-router';
import { useEffect, useState, type ReactNode } from 'react';
import { Animated, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { haptic, useStore } from '../lib/store';
import { Button, C, Screen } from './ui';

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
          <Text style={{ fontSize: 20 }}>{toast.icon}</Text>
          <Text style={styles.toastText}>{toast.text}</Text>
        </View>
      ) : null}
    </Animated.View>
  );
}

/** Celebración a pantalla completa cuando se consigue una insignia. */
export function BadgeCelebration() {
  const { newBadge, dismissBadge } = useStore();
  const [scale] = useState(() => new Animated.Value(0.3));
  useEffect(() => {
    if (newBadge) {
      scale.setValue(0.3);
      Animated.spring(scale, { toValue: 1, friction: 4, useNativeDriver: true }).start();
    }
  }, [newBadge, scale]);
  if (!newBadge) return null;
  return (
    <Modal transparent animationType="fade" visible onRequestClose={dismissBadge}>
      <View style={styles.backdrop}>
        <View style={styles.celebrate}>
          <Text style={styles.celebrateLabel}>¡NUEVA INSIGNIA!</Text>
          <Animated.Text style={{ fontSize: 84, transform: [{ scale }] }}>{newBadge.icon}</Animated.Text>
          <Text style={styles.celebrateTitle}>{newBadge.title}</Text>
          <Text style={styles.celebrateDays}>{newBadge.days} días en libertad</Text>
          <Text style={styles.celebrateText}>{newBadge.text}</Text>
          <Button title="Gracias, Señor 🙏" kind="gold" onPress={dismissBadge} style={{ alignSelf: 'stretch' }} />
        </View>
      </View>
    </Modal>
  );
}

/** Botón SOS flotante: siempre a un toque en todas las pestañas (en Inicio ya hay uno grande). */
export function PanicFab() {
  const [pulse] = useState(() => new Animated.Value(1));
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.08, duration: 900, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 900, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);
  return (
    <Animated.View style={[styles.fabWrap, { transform: [{ scale: pulse }] }]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Botón de pánico"
        onPress={() => {
          haptic('heavy');
          router.push('/panico');
        }}
        style={styles.fab}
      >
        <Text style={styles.fabText}>🆘 SOS</Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
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
  toastText: { color: '#fff', fontWeight: '700', fontSize: 15, flexShrink: 1 },
  backdrop: { flex: 1, backgroundColor: 'rgba(15,20,45,0.75)', alignItems: 'center', justifyContent: 'center', padding: 24 },
  celebrate: { backgroundColor: C.bg, borderRadius: 28, padding: 24, alignItems: 'center', gap: 8, width: '100%', maxWidth: 420 },
  celebrateLabel: { color: C.gold, fontWeight: '900', letterSpacing: 2 },
  celebrateTitle: { fontSize: 26, fontWeight: '900', color: C.navy, textAlign: 'center' },
  celebrateDays: { color: C.muted, fontWeight: '700' },
  celebrateText: { fontSize: 16, lineHeight: 23, color: C.ink, textAlign: 'center', marginBottom: 8 },
  fabWrap: { position: 'absolute', right: 16, bottom: 16 },
  fab: {
    backgroundColor: C.red,
    borderRadius: 32,
    paddingVertical: 14,
    paddingHorizontal: 20,
    shadowColor: C.red,
    shadowOpacity: 0.45,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  fabText: { color: '#fff', fontWeight: '900', fontSize: 17 },
});

/** Pantalla de pestaña con el botón SOS flotante siempre visible. */
export function TabScreen({ children }: { children: ReactNode }) {
  return (
    <View style={{ flex: 1 }}>
      <Screen fabSpace>{children}</Screen>
      <PanicFab />
    </View>
  );
}
