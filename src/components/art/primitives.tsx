import { Circle, G, Path } from 'react-native-svg';

// Utilidades para un dibujo de línea "a mano": curvas suaves con pequeñas irregularidades deterministas.

export const INK = '#1D2758';
export const SEA = '#2E6DB4';
export const PAPER = '#EFEADB';
export const WOOD = '#7A5A35';
export const OCHRE = '#B08A4E';
export const WOOL = ['#D9CCB2', '#CDBE9F', '#C2B08E', '#B9A684', '#E2D7C1'];
export const OLIVE = '#7A8A52';
export const BRICK = '#B4442E';
export const WHITE = '#FBFAF6';

/** Generador pseudoaleatorio con semilla (el dibujo es siempre igual). */
export function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Pt = [number, number];

/** Curva suave (Catmull-Rom → Bézier) que pasa por los puntos. */
export function smooth(pts: Pt[], closed = false): string {
  if (pts.length < 2) return '';
  const p = closed ? [pts[pts.length - 1], ...pts, pts[0], pts[1]] : [pts[0], ...pts, pts[pts.length - 1]];
  let d = `M${p[1][0].toFixed(1)} ${p[1][1].toFixed(1)}`;
  for (let i = 1; i < p.length - 2; i++) {
    const [x0, y0] = p[i - 1];
    const [x1, y1] = p[i];
    const [x2, y2] = p[i + 1];
    const [x3, y3] = p[i + 2];
    const c1x = x1 + (x2 - x0) / 6;
    const c1y = y1 + (y2 - y0) / 6;
    const c2x = x2 - (x3 - x1) / 6;
    const c2y = y2 - (y3 - y1) / 6;
    d += ` C${c1x.toFixed(1)} ${c1y.toFixed(1)} ${c2x.toFixed(1)} ${c2y.toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}`;
  }
  return closed ? d + ' Z' : d;
}

/** Línea horizontal ondulada de borde a borde. */
export function waveLine(y: number, amp: number, r: () => number, x0 = -30, x1 = 390, step = 28): string {
  const f1 = 0.012 + r() * 0.01;
  const f2 = 0.03 + r() * 0.02;
  const p1 = r() * 6.28;
  const p2 = r() * 6.28;
  const pts: Pt[] = [];
  for (let x = x0; x <= x1; x += step) {
    pts.push([x, y + amp * Math.sin(x * f1 + p1) + amp * 0.35 * Math.sin(x * f2 + p2) + (r() - 0.5) * amp * 0.2]);
  }
  return smooth(pts);
}

/** Línea con forma de colina (campana) y un temblor leve. */
export function hillLine(y: number, cx: number, h: number, w: number, r: () => number, x0 = -30, x1 = 390): string {
  const pts: Pt[] = [];
  for (let x = x0; x <= x1; x += 24) {
    const k = (x - cx) / w;
    pts.push([x, y - h * Math.exp(-k * k) + (r() - 0.5) * 2.2]);
  }
  return smooth(pts);
}

/** Línea "temblorosa" entre dos puntos. */
export function wobble(x1: number, y1: number, x2: number, y2: number, r: () => number, j = 1.2): string {
  const pts: Pt[] = [];
  const n = Math.max(2, Math.round(Math.hypot(x2 - x1, y2 - y1) / 18));
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const e = i === 0 || i === n ? 0 : (r() - 0.5) * j * 2;
    pts.push([x1 + (x2 - x1) * t + e, y1 + (y2 - y1) * t + e]);
  }
  return smooth(pts);
}

/** Muchas líneas de mar, alternando tinta y azul (como un grabado). */
export function Sea({ y0, n, gap, seed, amp = 5, grow = 0.25 }: { y0: number; n: number; gap: number; seed: number; amp?: number; grow?: number }) {
  const r = rng(seed);
  return (
    <G>
      {Array.from({ length: n }, (_, i) => (
        <Path
          key={i}
          d={waveLine(y0 + i * gap, amp + i * grow, r)}
          stroke={i % 2 ? SEA : INK}
          strokeWidth={1.3}
          fill="none"
          strokeLinecap="round"
        />
      ))}
    </G>
  );
}

/** Figura de Jesús: túnica blanca, sin rasgos, como en las ilustraciones de referencia. */
export function Christ({ x, y, s = 1, arm = 0, sitting }: { x: number; y: number; s?: number; arm?: number; sitting?: boolean }) {
  const robe = sitting
    ? 'M-3 -18 C-5 -12 -6 -6 -6 0 L9 0 C9 -3 6 -4 4 -6 C4 -10 3 -14 3 -18 Z'
    : 'M-3 -27 C-5 -16 -7 -6 -8.5 0 L8.5 0 C7 -6 5 -16 3 -27 Z';
  const head = sitting ? -21 : -30.5;
  return (
    <G transform={`translate(${x} ${y}) scale(${s})`}>
      <Path d={robe} fill={WHITE} stroke="#D6CDB8" strokeWidth={0.6} />
      <Circle cx={0} cy={head} r={3.3} fill={WHITE} stroke="#D6CDB8" strokeWidth={0.6} />
      {arm !== 0 && (
        <Path d={`M${arm > 0 ? 2 : -2} -22 Q${arm * 7} -20 ${arm * 12} -16`} stroke={WHITE} strokeWidth={2.6} strokeLinecap="round" fill="none" />
      )}
    </G>
  );
}

/** Persona diminuta en tinta (discípulos, multitud). */
export function Person({ x, y, s = 1, color = INK }: { x: number; y: number; s?: number; color?: string }) {
  return (
    <G transform={`translate(${x} ${y}) scale(${s})`}>
      <Path d="M-1.6 0 L-1.2 -9 Q0 -10.5 1.2 -9 L1.6 0 Z" fill={color} />
      <Circle cx={0} cy={-11.6} r={1.7} fill={color} />
    </G>
  );
}

/** Oveja de lana con cabeza oscura. */
export function Sheep({ x, y, s = 1, wool, flip, head = '#7A5A35' }: { x: number; y: number; s?: number; wool: string; flip?: boolean; head?: string }) {
  return (
    <G transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      <Path d="M-6 3 L-6 7 M-2 3.5 L-2 7.5 M3 3.5 L3 7.5 M6 3 L6 7" stroke="#6B5A42" strokeWidth={0.9} strokeLinecap="round" />
      <Path d="M-9 0 C-10 -5 -5 -7 -2 -6 C1 -8 6 -7 7 -4 C10 -3 10 3 6 4 C2 6 -4 6 -7 4 C-10 3 -10 1 -9 0 Z" fill={wool} />
      <Path d="M7 -4 C9 -6 12 -5 12.5 -2.5 C13 0 11 1 9 0.5 C8 0 7 -2 7 -4 Z" fill={head} />
      <Path d="M8 -4.5 L7 -6.5" stroke={head} strokeWidth={1.4} strokeLinecap="round" />
    </G>
  );
}
