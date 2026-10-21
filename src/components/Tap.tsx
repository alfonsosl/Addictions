import { useRef, useState, type ComponentProps } from 'react';
import { Animated, Pressable as RNPressable, StyleSheet, type GestureResponderEvent, type PressableStateCallbackType, type StyleProp, type ViewStyle } from 'react-native';
import { haptic } from '../lib/store';

const AnimatedPressable = Animated.createAnimatedComponent(RNPressable);

type Props = ComponentProps<typeof RNPressable> & {
  /** Vibración al pulsar: 'light' (por defecto), 'success', 'heavy' o false. */
  feedback?: 'light' | 'success' | 'heavy' | false;
  /** Cuánto se encoge al pulsar (1 = nada). */
  pressScale?: number;
};

/**
 * Pressable con respuesta inmediata al tocar: se encoge y se atenúa un poco al apoyar el dedo
 * y vibra levemente al soltar. Así el usuario sabe que ha pulsado antes de que pase nada.
 */
export function Pressable({ style, onPressIn, onPressOut, onPress, feedback = 'light', pressScale = 0.96, disabled, ...rest }: Props) {
  const [scale] = useState(() => new Animated.Value(1));
  const [pressed, setPressed] = useState(false);
  const last = useRef(0);

  const animate = (to: number) =>
    Animated.spring(scale, { toValue: to, useNativeDriver: true, speed: 40, bounciness: to === 1 ? 8 : 0 }).start();

  const resolved = typeof style === 'function' ? style({ pressed, hovered: false } as PressableStateCallbackType) : style;
  const flat = StyleSheet.flatten(resolved as StyleProp<ViewStyle>) ?? {};
  const baseTransform = Array.isArray(flat.transform) ? flat.transform : [];

  return (
    <AnimatedPressable
      {...rest}
      disabled={disabled}
      onPressIn={(e: GestureResponderEvent) => {
        setPressed(true);
        animate(pressScale);
        onPressIn?.(e);
      }}
      onPressOut={(e: GestureResponderEvent) => {
        setPressed(false);
        animate(1);
        onPressOut?.(e);
      }}
      onPress={(e: GestureResponderEvent) => {
        // Evita dobles pulsaciones accidentales
        const t = Date.now();
        if (t - last.current < 350) return;
        last.current = t;
        if (feedback) haptic(feedback);
        onPress?.(e);
      }}
      style={[flat, pressed && !disabled ? { opacity: (flat.opacity ?? 1) * 0.85 } : null, { transform: [...baseTransform, { scale }] }]}
    />
  );
}
