import type { ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export const C = {
  bg: '#F7F3EA', // pergamino
  card: '#FFFFFF',
  ink: '#1E2235',
  muted: '#6B6F80',
  navy: '#1F2A52',
  navySoft: '#2E3C70',
  gold: '#C9A227',
  goldSoft: '#F3E6B8',
  red: '#B3261E',
  green: '#2E7D4F',
  line: '#E6DFCF',
};

export function Screen({ children, scroll = true }: { children: ReactNode; scroll?: boolean }) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }} edges={['top', 'left', 'right']}>
      {scroll ? (
        <ScrollView contentContainerStyle={s.screen} keyboardShouldPersistTaps="handled">
          {children}
        </ScrollView>
      ) : (
        <View style={[s.screen, { flex: 1 }]}>{children}</View>
      )}
    </SafeAreaView>
  );
}

export function Card({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[s.card, style]}>{children}</View>;
}

export function H1({ children }: { children: ReactNode }) {
  return <Text style={s.h1}>{children}</Text>;
}
export function H2({ children }: { children: ReactNode }) {
  return <Text style={s.h2}>{children}</Text>;
}
export function P({ children, muted, style }: { children: ReactNode; muted?: boolean; style?: any }) {
  return <Text style={[s.p, muted && { color: C.muted }, style]}>{children}</Text>;
}
export function Label({ children }: { children: ReactNode }) {
  return <Text style={s.label}>{children}</Text>;
}

type BtnKind = 'primary' | 'gold' | 'danger' | 'ghost';
export function Button({
  title,
  onPress,
  kind = 'primary',
  disabled,
  style,
}: {
  title: string;
  onPress: () => void;
  kind?: BtnKind;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const bg = { primary: C.navy, gold: C.gold, danger: C.red, ghost: 'transparent' }[kind];
  const fg = kind === 'ghost' ? C.navy : kind === 'gold' ? C.navy : '#fff';
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        s.btn,
        { backgroundColor: bg, opacity: disabled ? 0.4 : pressed ? 0.8 : 1 },
        kind === 'ghost' && { borderWidth: 1.5, borderColor: C.navy },
        style,
      ]}
    >
      <Text style={[s.btnText, { color: fg }]}>{title}</Text>
    </Pressable>
  );
}

export function ProgressBar({ value, color = C.gold, track }: { value: number; color?: string; track?: string }) {
  return (
    <View style={[s.barBg, track ? { backgroundColor: track } : null]}>
      <View style={[s.barFill, { width: `${Math.round(Math.min(1, Math.max(0, value)) * 100)}%`, backgroundColor: color }]} />
    </View>
  );
}

export function Chip({ label, active, onPress }: { label: string; active?: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={[s.chip, active && { backgroundColor: C.navy, borderColor: C.navy }]}>
      <Text style={{ color: active ? '#fff' : C.ink, fontSize: 14 }}>{label}</Text>
    </Pressable>
  );
}

export const inputStyle = {
  backgroundColor: '#fff',
  borderWidth: 1,
  borderColor: C.line,
  borderRadius: 12,
  padding: 12,
  fontSize: 16,
  color: C.ink,
  marginBottom: 12,
} as const;

const s = StyleSheet.create({
  screen: { padding: 16, paddingBottom: 40, gap: 14, maxWidth: 640, width: '100%', alignSelf: 'center' },
  card: {
    backgroundColor: C.card,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: C.line,
    gap: 8,
  },
  h1: { fontSize: 28, fontWeight: '800', color: C.navy },
  h2: { fontSize: 19, fontWeight: '700', color: C.navy },
  p: { fontSize: 16, lineHeight: 23, color: C.ink },
  label: { fontSize: 12, fontWeight: '700', color: C.muted, letterSpacing: 1, textTransform: 'uppercase' },
  btn: { paddingVertical: 14, paddingHorizontal: 18, borderRadius: 14, alignItems: 'center' },
  btnText: { fontSize: 16, fontWeight: '700' },
  barBg: { height: 10, borderRadius: 5, backgroundColor: C.line, overflow: 'hidden' },
  barFill: { height: 10, borderRadius: 5 },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: C.line,
    backgroundColor: '#fff',
  },
});
