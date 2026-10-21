import AsyncStorage from '@react-native-async-storage/async-storage';
import { useConfirm } from './useConfirm';
import { useEffect, useState } from 'react';
import { Animated, Modal, StyleSheet, View } from 'react-native';
import { Pressable } from './Tap';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { dateKey, streakDays } from '../lib/game';
import { haptic, useStore } from '../lib/store';
import type { SceneId } from './art/scenes';
import { Glyph } from './icons';
import { SceneCard } from './LoveIllustration';
import { Text } from './Text';
import { C, serif } from './ui';

const KEY = 'vigilia:welcome:last';
/** A partir de cuántos días seguidos se muestra el aviso al abrir la app. */
export const WELCOME_MIN_DAYS = 3;

type Message = { scene: SceneId; caption: string; text: string; verse: string; source: string };

export function messageFor(days: number): Message {
  if (days < 7)
    return {
      scene: 'path',
      caption: 'Has vuelto a casa',
      text: 'Has empezado a caminar de vuelta. El Padre ya ha salido a tu encuentro.',
      verse: 'Cuando todavía estaba lejos, su padre lo vio y se conmovió.',
      source: 'Lc 15,20',
    };
  if (days < 14)
    return {
      scene: 'sea',
      caption: 'Su mano está tendida',
      text: 'Más de una semana. Cuando la ola suba, no mires el viento: mírale a Él.',
      verse: 'Al punto Jesús extendió la mano y lo agarró.',
      source: 'Mt 14,31',
    };
  if (days < 30)
    return {
      scene: 'flock',
      caption: 'Te ha encontrado',
      text: 'No has llegado hasta aquí solo: Él te lleva sobre sus hombros.',
      verse: 'Alegraos conmigo: he encontrado la oveja que se me había perdido.',
      source: 'Lc 15,6',
    };
  if (days < 90)
    return {
      scene: 'mountain',
      caption: 'Un corazón limpio',
      text: 'Tu mirada se está sanando. Sigue subiendo con Él, paso a paso.',
      verse: 'Bienaventurados los limpios de corazón, porque ellos verán a Dios.',
      source: 'Mt 5,8',
    };
  return {
    scene: 'light',
    caption: 'Eres luz',
    text: 'Tu libertad ya no es solo tuya: puede iluminar a otros que luchan.',
    verse: 'Vosotros sois la luz del mundo.',
    source: 'Mt 5,14',
  };
}

/** Lámina a pantalla completa con ilustración, número grande y versículo. */
export function MilestoneModal({
  visible,
  onClose,
  scene,
  label,
  big,
  unit,
  caption,
  text,
  verse,
  source,
}: {
  visible: boolean;
  onClose: () => void;
  scene: SceneId;
  label: string;
  big: string;
  unit: string;
  caption: string;
  text: string;
  verse?: string;
  source?: string;
}) {
  const insets = useSafeAreaInsets();
  const thanks = useConfirm(true);
  const [fade] = useState(() => new Animated.Value(0));
  useEffect(() => {
    if (visible) {
      fade.setValue(0);
      Animated.timing(fade, { toValue: 1, duration: 700, useNativeDriver: true }).start();
    }
  }, [visible, fade]);
  return (
    <Modal visible={visible} animationType="fade" onRequestClose={onClose} statusBarTranslucent>
      <View style={[styles.root, { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 20 }]}>
        <Pressable onPress={onClose} hitSlop={12} accessibilityLabel="Cerrar" style={[styles.close, { top: insets.top + 12 }]}>
          <Glyph e="close" size={20} color={C.muted} />
        </Pressable>
        <Animated.View style={[styles.inner, { opacity: fade }]}>
          <Text style={styles.label}>{label}</Text>
          <Text style={styles.big}>{big}</Text>
          <Text style={styles.unit}>{unit}</Text>
          <View style={styles.art}>
            <SceneCard id={scene} height={250} radius={0} />
          </View>
          <Text style={styles.caption}>{caption}</Text>
          <Text style={styles.text}>{text}</Text>
          {verse ? <Text style={styles.verse}>«{verse}»</Text> : null}
          {source ? <Text style={styles.source}>{source}</Text> : null}
        </Animated.View>
        <Pressable onPress={() => thanks.run(onClose)} style={[styles.btn, thanks.flashing && { backgroundColor: C.green }]} accessibilityRole="button" feedback={false}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            {thanks.flashing && <Glyph e="✓" size={18} color={C.bg} width={2} />}
            <Text style={styles.btnText}>{thanks.flashing ? 'Amén' : 'Gracias, Señor'}</Text>
          </View>
        </Pressable>
      </View>
    </Modal>
  );
}

/** Al abrir la app, si llevas varios días seguidos sin caer, te lo recuerda (una vez al día). */
export function StreakWelcome() {
  const { ready, state, now, newBadge } = useStore();
  const days = streakDays(state, now);
  const [shownFor, setShownFor] = useState<number | null>(null);
  const today = dateKey(now);
  const eligible = ready && !!state.profile && days >= WELCOME_MIN_DAYS && !newBadge;

  useEffect(() => {
    if (!eligible) return;
    let cancelled = false;
    (async () => {
      try {
        if ((await AsyncStorage.getItem(KEY)) === today) return;
        await AsyncStorage.setItem(KEY, today);
      } catch {}
      if (!cancelled) {
        haptic('success');
        setShownFor(days);
      }
    })();
    return () => {
      cancelled = true;
    };
    // Solo al entrar (o al cambiar de día); no cada minuto.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eligible, today]);

  if (shownFor === null) return null;
  const m = messageFor(shownFor);
  return (
    <MilestoneModal
      visible
      onClose={() => setShownFor(null)}
      scene={m.scene}
      label="TU RACHA"
      big={String(shownFor)}
      unit="días seguidos sin caer"
      caption={m.caption}
      text={m.text}
      verse={m.verse}
      source={m.source}
    />
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg, justifyContent: 'space-between' },
  close: { position: 'absolute', right: 18, zIndex: 2, padding: 6 },
  inner: { alignItems: 'center', gap: 4, paddingHorizontal: 28, maxWidth: 560, width: '100%', alignSelf: 'center' },
  label: { color: C.muted, letterSpacing: 3, fontSize: 12, fontWeight: '400' },
  big: { fontSize: 96, lineHeight: 104, fontWeight: '300', color: C.ink },
  unit: { fontSize: 16, color: C.ink, fontWeight: '300', letterSpacing: 0.5 },
  art: { alignSelf: 'stretch', marginHorizontal: -28, marginVertical: 14 },
  caption: { fontSize: 20, color: C.ink, fontWeight: '300', letterSpacing: 0.5 },
  text: { fontSize: 15, lineHeight: 22, color: C.muted, fontWeight: '300', textAlign: 'center', marginTop: 4 },
  verse: { fontFamily: serif, fontStyle: 'italic', fontSize: 18, lineHeight: 26, color: C.ink, textAlign: 'center', marginTop: 12 },
  source: { color: C.muted, fontSize: 13, fontWeight: '300' },
  btn: { marginHorizontal: 24, borderRadius: 28, paddingVertical: 16, alignItems: 'center', backgroundColor: C.navy, maxWidth: 520, width: '88%', alignSelf: 'center' },
  btnText: { color: C.bg, fontSize: 16, fontWeight: '400', letterSpacing: 0.5 },
});
