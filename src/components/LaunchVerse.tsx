import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { Animated, Modal, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { loveForDate, randomLove, type LoveDay } from '../content/love';
import { useFont } from '../lib/fontScale';
import { useStore } from '../lib/store';
import { themed } from '../lib/theme';
import { SCENE_META } from './art/scenes';
import { SceneFull } from './LoveIllustration';
import { Pressable } from './Tap';
import { Text } from './Text';
import { C, serif } from './ui';
import { useConfirm } from './useConfirm';

export const LAUNCH_VERSE_KEY = 'vigilia:ui:launchVerse';
let shownThisSession = false; // no se repite al cambiar de tema ni al volver a la app

/** Al abrir la app, un versículo a pantalla completa sobre una ilustración. */
export function LaunchVerse({ onDone }: { onDone: () => void }) {
  const { ready, state, now } = useStore();
  const insets = useSafeAreaInsets();
  const { fs } = useFont();
  const [verse, setVerse] = useState<LoveDay | null>(null);
  const [fade] = useState(() => new Animated.Value(0));
  const amen = useConfirm(true);

  useEffect(() => {
    if (!ready) return;
    if (shownThisSession || !state.profile) {
      onDone();
      return;
    }
    shownThisSession = true;
    let cancelled = false;
    AsyncStorage.getItem(LAUNCH_VERSE_KEY)
      .catch(() => null)
      .then((v) => {
        if (cancelled) return;
        if (v === 'off') onDone();
        else {
          setVerse(randomLove(loveForDate(new Date())));
          Animated.timing(fade, { toValue: 1, duration: 900, useNativeDriver: true }).start();
        }
      });
    return () => {
      cancelled = true;
    };
    // Solo al arrancar
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  if (!verse) return null;
  const dark = SCENE_META[verse.scene].dark;
  const ink = dark ? '#EFE9DA' : C.ink;
  const close = () => {
    setVerse(null);
    onDone();
  };
  return (
    <Modal visible animationType="fade" onRequestClose={close} statusBarTranslucent>
      <View style={[styles.root, { backgroundColor: SCENE_META[verse.scene].bg }]}>
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          <SceneFull id={verse.scene} />
        </View>
        <Animated.View style={[styles.top, { paddingTop: insets.top + 48, opacity: fade }]}>
          <Text style={[styles.label, { color: dark ? '#BDB6A4' : C.muted }]}>PALABRA PARA HOY · {now.getDate()}/{now.getMonth() + 1}</Text>
          <Text style={[styles.verse, { color: ink, fontSize: fs(24), lineHeight: fs(33) }]}>«{verse.verse}»</Text>
          <Text style={[styles.source, { color: dark ? '#BDB6A4' : C.muted }]}>{verse.source}</Text>
        </Animated.View>
        <Animated.View style={[styles.bottom, { paddingBottom: insets.bottom + 24, opacity: fade }]}>
          <Pressable
            onPress={() => amen.run(close)}
            feedback={false}
            accessibilityRole="button"
            style={[styles.btn, amen.flashing && { backgroundColor: C.green }]}
          >
            <Text style={styles.btnText}>{amen.flashing ? '✓  Amén' : 'Amén'}</Text>
          </Pressable>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = themed(() =>
  StyleSheet.create({
    root: { flex: 1, justifyContent: 'space-between' },
    top: { paddingHorizontal: 30, alignItems: 'center', gap: 12, maxWidth: 600, width: '100%', alignSelf: 'center' },
    label: { fontSize: 11, letterSpacing: 2.5 },
    verse: { fontFamily: serif, fontStyle: 'italic', textAlign: 'center' },
    source: { fontSize: 14, fontWeight: '300', letterSpacing: 0.5 },
    bottom: { alignItems: 'center' },
    btn: { borderRadius: 28, paddingVertical: 15, paddingHorizontal: 54, backgroundColor: C.navy },
    btnText: { color: C.onNavy, fontSize: 16, letterSpacing: 0.5 },
  }),
);
