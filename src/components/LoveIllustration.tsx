import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Defs, Ellipse, G, Line, LinearGradient, Path, Rect, Stop } from 'react-native-svg';
import { loveForDate, type Scene } from '../content/love';
import { useFont } from '../lib/fontScale';
import { C, serif } from './ui';

// Ilustraciones vectoriales sencillas (línea y formas planas), sin imágenes: funcionan sin conexión.
const GOLD = '#C9A227';
const GOLD_L = '#EBD48A';
const NAVY = '#1F2A52';
const NIGHT = ['#151C3B', '#2B3768'];
const DAWN = ['#FBEBD0', '#FAF6EE'];

function Sky({ id, colors }: { id: string; colors: string[] }) {
  return (
    <>
      <Defs>
        <LinearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={colors[0]} />
          <Stop offset="1" stopColor={colors[1]} />
        </LinearGradient>
      </Defs>
      <Rect x="0" y="0" width="320" height="200" fill={`url(#${id})`} />
    </>
  );
}

function Rays({ cx, cy, r1, r2, n = 12, color = GOLD, opacity = 0.35, from = 0, to = 360 }: any) {
  const lines = [];
  for (let i = 0; i < n; i++) {
    const a = ((from + ((to - from) * i) / (n - (to - from === 360 ? 0 : 1))) * Math.PI) / 180;
    lines.push(
      <Line
        key={i}
        x1={cx + r1 * Math.cos(a)}
        y1={cy + r1 * Math.sin(a)}
        x2={cx + r2 * Math.cos(a)}
        y2={cy + r2 * Math.sin(a)}
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        opacity={opacity}
      />,
    );
  }
  return <G>{lines}</G>;
}

function Stars({ pts }: { pts: [number, number, number][] }) {
  return (
    <G>
      {pts.map(([x, y, r], i) => (
        <Circle key={i} cx={x} cy={y} r={r} fill="#fff" opacity={0.75} />
      ))}
    </G>
  );
}

const STARS: [number, number, number][] = [
  [30, 30, 1.4], [70, 55, 1], [110, 22, 1.6], [150, 48, 1], [205, 20, 1.2], [245, 52, 1.6],
  [285, 28, 1], [300, 70, 1.3], [20, 80, 1], [180, 70, 1], [90, 90, 1.2], [265, 95, 1],
];

function SceneArt({ scene }: { scene: Scene }) {
  switch (scene) {
    case 'cross':
      return (
        <>
          <Sky id="g-cross" colors={DAWN} />
          <Circle cx="160" cy="118" r="62" fill={GOLD_L} opacity={0.45} />
          <Circle cx="160" cy="118" r="40" fill={GOLD_L} opacity={0.6} />
          <Rays cx={160} cy={118} r1={72} r2={98} n={9} from={190} to={350} />
          <Path d="M0 168 Q160 128 320 168 L320 200 L0 200 Z" fill={NAVY} opacity={0.12} />
          <Path d="M0 182 Q120 160 320 186 L320 200 L0 200 Z" fill={NAVY} opacity={0.18} />
          <Rect x="155" y="58" width="10" height="94" rx="2" fill={NAVY} />
          <Rect x="134" y="80" width="52" height="9" rx="2" fill={NAVY} />
        </>
      );
    case 'door':
      return (
        <>
          <Sky id="g-door" colors={NIGHT} />
          <Stars pts={STARS} />
          <Rect x="0" y="150" width="320" height="50" fill="#121835" />
          <Path d="M100 84 L160 42 L220 84 Z" fill="#26305C" />
          <Rect x="110" y="82" width="100" height="70" fill="#2F3B6E" />
          <Rect x="124" y="96" width="16" height="14" rx="2" fill={GOLD_L} opacity={0.8} />
          <Rect x="180" y="96" width="16" height="14" rx="2" fill={GOLD_L} opacity={0.8} />
          <Rect x="148" y="106" width="24" height="46" rx="2" fill={GOLD_L} />
          <Path d="M148 152 L172 152 L214 200 L106 200 Z" fill={GOLD_L} opacity={0.28} />
          <Path d="M40 200 Q70 180 110 178 T150 160" stroke={GOLD_L} strokeWidth={2} strokeDasharray="4 6" fill="none" opacity={0.6} />
        </>
      );
    case 'shepherd':
      return (
        <>
          <Sky id="g-shep" colors={DAWN} />
          <Circle cx="250" cy="60" r="22" fill={GOLD_L} opacity={0.7} />
          <Path d="M0 150 Q100 120 200 140 T320 135 L320 200 L0 200 Z" fill="#DCE3D0" />
          <Path d="M0 172 Q140 150 320 170 L320 200 L0 200 Z" fill="#C8D3B8" />
          <Path d="M214 182 L214 78 Q214 52 236 52 Q258 52 258 74" stroke={NAVY} strokeWidth={6} strokeLinecap="round" fill="none" />
          {[
            [118, 152],
            [160, 160],
          ].map(([x, y], i) => (
            <G key={i}>
              <Circle cx={x - 12} cy={y} r="11" fill="#fff" />
              <Circle cx={x} cy={y - 6} r="12" fill="#fff" />
              <Circle cx={x + 12} cy={y} r="11" fill="#fff" />
              <Circle cx={x} cy={y + 4} r="11" fill="#fff" />
              <Ellipse cx={x + 24} cy={y - 4} rx="7" ry="9" fill={NAVY} />
              <Line x1={x - 8} y1={y + 12} x2={x - 8} y2={y + 22} stroke={NAVY} strokeWidth={3} strokeLinecap="round" />
              <Line x1={x + 8} y1={y + 12} x2={x + 8} y2={y + 22} stroke={NAVY} strokeWidth={3} strokeLinecap="round" />
            </G>
          ))}
        </>
      );
    case 'hands': {
      // Palma abierta con un corazón: «te llevo tatuado en las palmas de mis manos».
      const skin = { fill: '#F2DCC0', stroke: NAVY, strokeWidth: 2.5 } as const;
      return (
        <>
          <Sky id="g-hands" colors={DAWN} />
          <Rays cx={160} cy={110} r1={70} r2={96} n={14} />
          <Rect x="138" y="150" width="44" height="60" rx="8" {...skin} />
          <Rect x="114" y="98" width="17" height="56" rx="8.5" {...skin} transform="rotate(-35 122 150)" />
          <Rect x="124" y="50" width="17" height="66" rx="8.5" {...skin} />
          <Rect x="143" y="38" width="17" height="76" rx="8.5" {...skin} />
          <Rect x="162" y="42" width="17" height="72" rx="8.5" {...skin} />
          <Rect x="181" y="56" width="16" height="60" rx="8" {...skin} />
          <Rect x="120" y="94" width="80" height="72" rx="28" {...skin} />
          <Path
            d="M160 146 C140 132 136 118 146 113 C152 110 158 114 160 119 C162 114 168 110 174 113 C184 118 180 132 160 146 Z"
            fill="#B3261E"
          />
        </>
      );
    }
    case 'heart':
      return (
        <>
          <Sky id="g-heart" colors={DAWN} />
          <Rays cx={160} cy={110} r1={64} r2={90} n={16} />
          <Path
            d="M160 172 C104 136 96 88 128 80 C146 76 156 88 160 98 C164 88 174 76 192 80 C224 88 216 136 160 172 Z"
            fill="#B3261E"
          />
          <Path d="M118 104 Q139 114 160 104 Q181 114 202 104" stroke="#5B3A1E" strokeWidth={3} fill="none" strokeLinecap="round" />
          <Path d="M118 110 Q139 100 160 110 Q181 100 202 110" stroke="#5B3A1E" strokeWidth={3} fill="none" strokeLinecap="round" />
          {[126, 140, 154, 168, 182, 196].map((x, i) => (
            <Line key={i} x1={x} y1={101 + (i % 2) * 2} x2={x + (i % 2 ? 4 : -4)} y2={95 + (i % 2) * 2} stroke="#5B3A1E" strokeWidth={2} strokeLinecap="round" />
          ))}
          <Path d="M160 80 C148 66 156 52 160 38 C166 52 172 66 160 80 Z" fill={GOLD} />
          <Rect x="158" y="18" width="4" height="22" rx="1" fill={NAVY} />
          <Rect x="152" y="24" width="16" height="4" rx="1" fill={NAVY} />
        </>
      );
    case 'sunrise':
      return (
        <>
          <Sky id="g-sun" colors={['#F9DDB0', '#FBF4E8']} />
          <Circle cx="160" cy="140" r="44" fill={GOLD} opacity={0.85} />
          <Rays cx={160} cy={140} r1={56} r2={84} n={9} from={190} to={350} opacity={0.5} />
          <Path d="M0 140 Q80 110 160 140 T320 128 L320 200 L0 200 Z" fill={NAVY} opacity={0.25} />
          <Path d="M0 160 Q110 134 210 160 T320 156 L320 200 L0 200 Z" fill={NAVY} opacity={0.45} />
          <Path d="M0 180 Q160 160 320 182 L320 200 L0 200 Z" fill={NAVY} />
          <Path d="M70 60 q6 -6 12 0 q6 -6 12 0" stroke={NAVY} strokeWidth={2} fill="none" strokeLinecap="round" />
          <Path d="M100 44 q5 -5 10 0 q5 -5 10 0" stroke={NAVY} strokeWidth={2} fill="none" strokeLinecap="round" />
        </>
      );
    case 'dove':
      return (
        <>
          <Sky id="g-dove" colors={['#E7EEF8', '#FAF8F4']} />
          {[-60, -30, 0, 30, 60].map((dx, i) => (
            <Line key={i} x1={160} y1={0} x2={160 + dx * 2.2} y2={200} stroke={GOLD} strokeWidth={10} opacity={0.12} />
          ))}
          <Path
            d="M160 100 C150 92 132 76 104 74 C120 88 130 100 146 108 C132 112 120 120 112 132 C128 128 142 124 154 120 C162 132 176 140 194 140 C186 130 182 122 182 114 C196 108 208 98 214 90 C198 94 186 96 176 96 C184 82 198 70 220 62 C192 62 172 78 160 100 Z"
            fill="#fff"
            stroke={NAVY}
            strokeWidth={2}
            strokeLinejoin="round"
          />
          <Circle cx="186" cy="104" r="2" fill={NAVY} />
        </>
      );
    case 'night':
      return (
        <>
          <Sky id="g-night" colors={NIGHT} />
          <Stars pts={STARS} />
          <Circle cx="240" cy="62" r="26" fill={GOLD_L} />
          <Circle cx="252" cy="54" r="24" fill="#18204A" />
          <Path d="M0 160 L60 118 L110 150 L170 100 L240 156 L280 130 L320 150 L320 200 L0 200 Z" fill="#0F1530" />
          <Path d="M0 180 Q160 160 320 182 L320 200 L0 200 Z" fill="#0A0F25" />
        </>
      );
    case 'vine':
      return (
        <>
          <Sky id="g-vine" colors={DAWN} />
          <Path d="M20 170 C80 120 120 180 170 120 S260 60 300 40" stroke="#6B4E2E" strokeWidth={5} fill="none" strokeLinecap="round" />
          {[
            [70, 140, -30],
            [130, 150, 20],
            [180, 110, -40],
            [240, 76, 10],
            [280, 52, -20],
          ].map(([x, y, r], i) => (
            <Ellipse key={i} cx={x} cy={y} rx="16" ry="8" fill="#6E9A4A" transform={`rotate(${r} ${x} ${y})`} />
          ))}
          {[
            [150, 135],
            [220, 92],
          ].map(([x, y], i) => (
            <G key={i}>
              {[
                [0, 0], [10, 0], [20, 0], [5, 9], [15, 9], [10, 18],
              ].map(([dx, dy], j) => (
                <Circle key={j} cx={x + dx} cy={y + 10 + dy} r="5.5" fill="#4A3A78" />
              ))}
            </G>
          ))}
        </>
      );
    case 'anchor':
      return (
        <>
          <Sky id="g-anchor" colors={['#DCE7F2', '#F7F6F2']} />
          <Circle cx="160" cy="44" r="10" stroke={NAVY} strokeWidth={5} fill="none" />
          <Line x1="160" y1="54" x2="160" y2="150" stroke={NAVY} strokeWidth={6} strokeLinecap="round" />
          <Line x1="134" y1="74" x2="186" y2="74" stroke={NAVY} strokeWidth={6} strokeLinecap="round" />
          <Path d="M112 122 Q118 156 160 156 Q202 156 208 122" stroke={NAVY} strokeWidth={6} fill="none" strokeLinecap="round" />
          <Path d="M104 128 L112 116 L122 126" stroke={NAVY} strokeWidth={5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <Path d="M216 128 L208 116 L198 126" stroke={NAVY} strokeWidth={5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <Path d="M0 172 q20 -10 40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0" stroke="#5A7FA8" strokeWidth={3} fill="none" />
          <Path d="M0 186 q20 -10 40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0" stroke="#5A7FA8" strokeWidth={3} fill="none" opacity={0.6} />
        </>
      );
  }
}

export function LoveArt({ scene, height = 180 }: { scene: Scene; height?: number }) {
  return (
    <View style={{ height, borderRadius: 16, overflow: 'hidden' }}>
      <Svg width="100%" height="100%" viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice">
        <SceneArt scene={scene} />
      </Svg>
    </View>
  );
}

/** Tarjeta diaria: «La grandeza del amor de Dios». */
export function DailyLove({ date, compact, onPress }: { date: Date; compact?: boolean; onPress?: () => void }) {
  const day = loveForDate(date);
  const { fs } = useFont();
  return (
    <Pressable accessibilityRole="summary" onPress={onPress} disabled={!onPress} style={styles.card}>
      <LoveArt scene={day.scene} height={compact ? 140 : 180} />
      <View style={{ gap: 6, paddingHorizontal: 4 }}>
        <Text style={[styles.label, { fontSize: fs(11) }]}>EL AMOR DE DIOS, HOY</Text>
        <Text style={[styles.title, { fontSize: fs(19) }]}>{day.title}</Text>
        <Text style={[styles.verse, { fontSize: fs(17), lineHeight: fs(26) }]}>«{day.verse}»</Text>
        <Text style={[styles.source, { fontSize: fs(13) }]}>{day.source}</Text>
        {!compact && <Text style={[styles.thought, { fontSize: fs(14), lineHeight: fs(20) }]}>{day.thought}</Text>}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: C.card,
    borderRadius: 22,
    padding: 10,
    paddingBottom: 16,
    gap: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: C.line,
  },
  label: { color: C.gold, fontWeight: '700', letterSpacing: 1.4 },
  title: { color: C.navy, fontWeight: '700' },
  verse: { fontFamily: serif, fontStyle: 'italic', color: C.ink },
  source: { color: C.muted, fontWeight: '600' },
  thought: { color: C.navySoft, marginTop: 2 },
});
