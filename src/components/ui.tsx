import type { ReactNode } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFont } from '../lib/fontScale';

// Paleta minimalista: fondo marfil, tinta azul noche y un único acento dorado.
export const C = {
  bg: '#FAF8F4',
  card: '#FFFFFF',
  ink: '#1E2235',
  muted: '#7A7E8C',
  navy: '#1F2A52',
  navySoft: '#3A4778',
  gold: '#B8912A',
  goldSoft: '#F5EDD6',
  red: '#B3261E',
  redSoft: '#FBEAE8',
  green: '#2E7D4F',
  line: '#ECE7DC',
  night: '#141B38',
};

export const serif = Platform.select({ ios: 'Georgia', android: 'serif', default: 'Georgia, "Times New Roman", serif' });

export function Screen({
  children,
  scroll = true,
  fabSpace,
  edges = ['top', 'left', 'right'],
}: {
  children: ReactNode;
  scroll?: boolean;
  fabSpace?: boolean | number; // deja hueco abajo para los botones flotantes
  edges?: ('top' | 'left' | 'right' | 'bottom')[];
}) {
  const pad = typeof fabSpace === 'number' ? fabSpace : fabSpace ? 110 : 0;
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }} edges={edges}>
      {scroll ? (
        <ScrollView contentContainerStyle={[s.screen, pad ? { paddingBottom: pad } : null]} keyboardShouldPersistTaps="handled">
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
  const { t } = useFont();
  return <Text style={t(s.h1)}>{children}</Text>;
}
export function H2({ children }: { children: ReactNode }) {
  const { t } = useFont();
  return <Text style={t(s.h2)}>{children}</Text>;
}
export function P({ children, muted, style }: { children: ReactNode; muted?: boolean; style?: any }) {
  const { t } = useFont();
  return <Text style={t([s.p, muted && { color: C.muted }, style])}>{children}</Text>;
}
export function Label({ children, color }: { children: ReactNode; color?: string }) {
  const { t } = useFont();
  return <Text style={t([s.label, color ? { color } : null])}>{children}</Text>;
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
  const { t } = useFont();
  const bg = { primary: C.navy, gold: C.gold, danger: C.red, ghost: 'transparent' }[kind];
  const fg = kind === 'primary' || kind === 'danger' ? '#fff' : C.navy;
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        s.btn,
        { backgroundColor: bg, opacity: disabled ? 0.4 : pressed ? 0.8 : 1 },
        kind === 'ghost' && { borderWidth: 1, borderColor: C.line, backgroundColor: C.card },
        style,
      ]}
    >
      <Text style={t([s.btnText, { color: fg }])}>{title}</Text>
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
  const { fs } = useFont();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: !!active }}
      onPress={onPress}
      style={[s.chip, active && { backgroundColor: C.navy, borderColor: C.navy }]}
    >
      <Text style={{ color: active ? '#fff' : C.ink, fontSize: fs(14) }}>{label}</Text>
    </Pressable>
  );
}

export const inputStyle = {
  backgroundColor: '#fff',
  borderWidth: 1,
  borderColor: C.line,
  borderRadius: 14,
  padding: 12,
  fontSize: 16,
  color: C.ink,
  marginBottom: 12,
} as const;

/** Bloque de cita bíblica o de un santo, con tipografía serif. */
export function Quote({ text, source, dark }: { text: string; source?: string; dark?: boolean }) {
  const { fs } = useFont();
  return (
    <View style={{ gap: 6 }}>
      <Text
        style={{ fontFamily: serif, fontSize: fs(18), lineHeight: fs(27), fontStyle: 'italic', color: dark ? '#fff' : C.navy }}
      >
        «{text}»
      </Text>
      {source ? <Text style={{ color: dark ? C.goldSoft : C.muted, fontWeight: '600', fontSize: fs(13) }}>{source}</Text> : null}
    </View>
  );
}

/** Tarjeta-acceso con icono. */
export function Tile({
  icon,
  title,
  subtitle,
  done,
  onPress,
}: {
  icon: string;
  title: string;
  subtitle: string;
  done?: boolean;
  onPress: () => void;
}) {
  const { t } = useFont();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      onPress={onPress}
      style={({ pressed }) => [s.tile, pressed && { transform: [{ scale: 0.97 }] }]}
    >
      <Text style={{ fontSize: 26 }}>{icon}</Text>
      <Text style={t(s.tileTitle)}>{title}</Text>
      <Text style={t([s.tileSub, done && { color: C.green, fontWeight: '700' }])}>{done ? '✓ Hecho' : subtitle}</Text>
    </Pressable>
  );
}

/** Fila de lista limpia: icono en círculo, título, subtítulo y estado. */
export function ListRow({
  icon,
  title,
  subtitle,
  done,
  onPress,
  last,
}: {
  icon: string;
  title: string;
  subtitle?: string;
  done?: boolean;
  onPress: () => void;
  last?: boolean;
}) {
  const { t } = useFont();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      onPress={onPress}
      style={({ pressed }) => [s.row, !last && s.rowLine, pressed && { opacity: 0.6 }]}
    >
      <View style={[s.rowIcon, done && { backgroundColor: '#E6F2EA' }]}>
        <Text style={{ fontSize: 18 }}>{done ? '✓' : icon}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={t(s.rowTitle)}>{title}</Text>
        {subtitle ? (
          <Text style={t(s.rowSub)} numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      <Text style={s.rowChevron}>›</Text>
    </Pressable>
  );
}

export function SectionTitle({ children }: { children: ReactNode }) {
  const { t } = useFont();
  return <Text style={t(s.section)}>{children}</Text>;
}

/** Selector de secciones tipo "pestañas" dentro de una pantalla. */
export function Segmented<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  const { t } = useFont();
  return (
    <View style={s.seg}>
      {options.map((o) => {
        const active = o.value === value;
        return (
          <Pressable
            key={o.value}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            onPress={() => onChange(o.value)}
            style={[s.segItem, active && s.segActive]}
          >
            <Text style={t([s.segText, active && { color: C.navy }])} numberOfLines={1}>
              {o.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const s = StyleSheet.create({
  screen: { padding: 20, paddingBottom: 40, gap: 16, maxWidth: 640, width: '100%', alignSelf: 'center' },
  card: {
    backgroundColor: C.card,
    borderRadius: 20,
    padding: 18,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: C.line,
    gap: 8,
  },
  h1: { fontSize: 28, fontWeight: '700', color: C.navy, letterSpacing: -0.3 },
  h2: { fontSize: 19, fontWeight: '700', color: C.navy },
  p: { fontSize: 16, lineHeight: 24, color: C.ink },
  label: { fontSize: 12, fontWeight: '600', color: C.muted, letterSpacing: 1.2, textTransform: 'uppercase' },
  btn: { paddingVertical: 15, paddingHorizontal: 18, borderRadius: 16, alignItems: 'center' },
  btnText: { fontSize: 16, fontWeight: '600' },
  barBg: { height: 4, borderRadius: 2, backgroundColor: C.line, overflow: 'hidden' },
  barFill: { height: 4, borderRadius: 2 },
  seg: { flexDirection: 'row', backgroundColor: '#F0ECE3', borderRadius: 14, padding: 3, gap: 3 },
  segItem: { flex: 1, paddingVertical: 9, borderRadius: 11, alignItems: 'center' },
  segActive: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  segText: { fontWeight: '600', color: C.muted, fontSize: 14 },
  tile: {
    flexBasis: '47%',
    flexGrow: 1,
    backgroundColor: '#fff',
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: C.line,
    padding: 16,
    gap: 4,
    minHeight: 112,
  },
  tileTitle: { fontSize: 16, fontWeight: '700', color: C.navy },
  tileSub: { fontSize: 13, color: C.muted },
  row: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 12 },
  rowLine: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: C.line },
  rowIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F4F1EA', alignItems: 'center', justifyContent: 'center' },
  rowTitle: { fontSize: 16, fontWeight: '600', color: C.ink },
  rowSub: { fontSize: 13, color: C.muted, marginTop: 1 },
  rowChevron: { fontSize: 24, color: '#C9C4B8', fontWeight: '300' },
  section: { fontSize: 12, fontWeight: '600', color: C.muted, letterSpacing: 1.4, textTransform: 'uppercase', marginTop: 8 },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 13,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: C.line,
    backgroundColor: '#fff',
  },
});
