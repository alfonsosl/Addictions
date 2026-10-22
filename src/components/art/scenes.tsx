import { memo, type ReactElement } from 'react';
import { Circle, Ellipse, G, Path, Rect } from 'react-native-svg';
import {
  BRICK,
  Christ,
  Glow,
  SKIN,
  FAINT,
  NIGHT,
  OUTLINE,
  hillLine,
  INK,
  OCHRE,
  OLIVE,
  PAPER,
  Person,
  rng,
  SEA,
  Sea,
  Sheep,
  smooth,
  waveLine,
  WHITE,
  wobble,
  WOOD,
  WOOL,
} from './primitives';

// Escenas en un lienzo vertical de 360×640 (formato fondo de pantalla).
// `focus` es la altura donde está el motivo: las tarjetas apaisadas recortan alrededor de ella.

export type SceneId =
  | 'sea'
  | 'flock'
  | 'cross'
  | 'path'
  | 'mountain'
  | 'field'
  | 'night'
  | 'vine'
  | 'well'
  | 'bread'
  | 'light'
  | 'dove'
  | 'tomb'
  | 'heart'
  | 'shepherd'
  | 'storm'
  | 'nets'
  | 'mary'
  | 'lamb'
  | 'garden'
  | 'tree'
  | 'stars'
  | 'eagle';

export type SceneMeta = { focus: number; top?: number; dark?: boolean; bg: string };

// Altura donde empieza el dibujo en escenas que llegan muy arriba (para no tapar el título).
const TOP: Partial<Record<SceneId, number>> = { flock: 250 };

const FOCUS: Record<SceneId, number> = {
  sea: 440, flock: 420, cross: 380, path: 380, mountain: 370, field: 430, night: 330,
  vine: 360, well: 420, bread: 360, light: 340, dove: 380, tomb: 400, heart: 340,
  shepherd: 420, storm: 370, nets: 460, mary: 400, lamb: 400, garden: 390, tree: 330, stars: 380, eagle: 330,
};

// El fondo se lee en cada acceso (cambia con el modo oscuro).
export const SCENE_META = Object.fromEntries(
  (Object.keys(FOCUS) as SceneId[]).map((id) => [
    id,
    {
      focus: FOCUS[id],
      top: TOP[id],
      get bg() {
        return id === 'night' || id === 'stars' ? NIGHT : PAPER;
      },
      get dark() {
        return id === 'night' || id === 'stars' || PAPER !== '#EFEADB';
      },
    },
  ]),
) as Record<SceneId, SceneMeta>;

const edge = (color: string, w = 1.3) => ({ stroke: color, strokeWidth: w, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const });
const stroke = (color: string, w = 1.3) => ({ ...edge(color, w), fill: 'none' });

function SeaScene() {
  return (
    <G>
      <Sea y0={455} n={20} gap={10} seed={7} amp={5} />
      {/* Barca con los discípulos */}
      <G transform="translate(60 452)">
        {[-14, -10, -6, 2, 6, 10, 14, 18, 22, 26].map((x, i) => (
          <Person key={i} x={x + 30} y={-6} s={0.75} color={INK} />
        ))}
        <Path d="M0 -6 L96 -10 Q90 6 70 10 L22 10 Q6 8 0 -6 Z" fill="#E9DFC9" {...edge(WOOD, 1)} />
        <Path d="M4 -1 L92 -4 M9 4 L86 2" {...stroke(WOOD, 0.8)} />
        <Path d="M48 -8 L50 -64" {...stroke(WOOD, 1.2)} />
        <Path d="M36 -52 L64 -60" {...stroke(WOOD, 1.1)} />
        <Path d="M51 -58 Q66 -52 68 -38 Q60 -40 51 -38 Z" fill={WHITE} {...{ stroke: OUTLINE, strokeWidth: 0.6 }} />
      </G>
      {/* Jesús tiende la mano a Pedro, que se hunde (Mt 14,31) */}
      <Christ x={262} y={449} s={0.95} arm={-1} />
      <G transform="translate(244 452)">
        <Path d="M-3 0 Q-2 -6 0 -7 Q2 -6 3 0 Z" fill={INK} />
        <Circle cx={0} cy={-9} r={1.8} fill={INK} />
        <Path d="M1 -6 Q4 -11 6 -14" {...stroke(INK, 1.4)} />
      </G>
    </G>
  );
}

function FlockScene() {
  const r = rng(3);
  const sheep: ReactElement[] = [];
  for (let row = 0; row < 6; row++) {
    for (let col = 0; col < 8; col++) {
      const x = 66 + col * 32 + (r() - 0.5) * 6;
      const y = 262 + row * 28 + (r() - 0.5) * 4;
      sheep.push(<Sheep key={`${row}-${col}`} x={x} y={y} s={0.95 + r() * 0.2} wool={WOOL[Math.floor(r() * WOOL.length)]} flip={r() > 0.8} />);
    }
  }
  return (
    <G>
      {sheep}
      {/* El pastor encuentra a la oveja perdida (Lc 15,4-6) */}
      <G transform="translate(196 480)">
        <Path d="M-40 4 Q0 2 34 5" {...stroke(FAINT, 0.8)} />
        <Christ x={4} y={0} s={1.05} sitting />
        <Sheep x={-14} y={-4} s={1.1} wool={WHITE} head={INK} />
        <Path d="M14 2 L36 4" {...stroke(OUTLINE, 0.9)} />
      </G>
    </G>
  );
}

function CrossScene() {
  const r = rng(11);
  return (
    <G>
      {[26, 38, 50, 64].map((rad, i) => (
        <Circle key={i} cx={180} cy={340} r={rad} {...stroke(OCHRE, 0.9)} opacity={0.7 - i * 0.12} />
      ))}
      {Array.from({ length: 14 }, (_, i) => (
        <Path key={i} d={hillLine(400 + i * 16, 180, 34 - i * 1.5, 120 + i * 10, r)} {...stroke(i % 2 ? SEA : INK, 1.2)} />
      ))}
      <Path d={wobble(180, 368, 180, 306, r, 0.6)} {...stroke(WOOD, 3)} />
      <Path d={wobble(164, 322, 196, 322, r, 0.4)} {...stroke(WOOD, 3)} />
    </G>
  );
}

function PathScene() {
  const r = rng(5);
  return (
    <G>
      {Array.from({ length: 9 }, (_, i) => (
        <Path key={i} d={waveLine(380 + i * 30, 2 + i * 0.6, r)} {...stroke(i % 2 ? FAINT : FAINT, 1)} />
      ))}
      {/* El camino de vuelta a casa (Lc 15,20) */}
      <Path d={smooth([[150, 640], [168, 560], [150, 480], [190, 420], [214, 372]])} {...stroke(INK, 1.3)} />
      <Path d={smooth([[230, 640], [214, 560], [196, 480], [214, 420], [222, 372]])} {...stroke(INK, 1.3)} />
      <G transform="translate(226 368)">
        <Path d="M-14 0 L-14 -16 L0 -26 L14 -16 L14 0 Z" fill="#E9DFC9" {...edge(WOOD, 1)} />
        <Rect x={-3} y={-10} width={6} height={10} fill={OCHRE} />
      </G>
      <Christ x={205} y={404} s={0.8} arm={-1} />
      <Person x={188} y={422} s={0.85} color={INK} />
    </G>
  );
}

function MountainScene() {
  const r = rng(13);
  const crowd: ReactElement[] = [];
  for (let i = 0; i < 44; i++) {
    const row = Math.floor(i / 11);
    crowd.push(<Person key={i} x={78 + (i % 11) * 20 + (r() - 0.5) * 6 + row * 4} y={478 + row * 13} s={0.55 + r() * 0.1} color={r() > 0.5 ? INK : INK} />);
  }
  return (
    <G>
      {Array.from({ length: 10 }, (_, i) => (
        <Path key={i} d={hillLine(470 - i * 2 + i * 9, 180, 120 - i * 11, 70 + i * 9, r)} {...stroke(i % 2 ? SEA : INK, 1.1)} />
      ))}
      <Christ x={180} y={352} s={0.9} />
      {crowd}
      {Array.from({ length: 5 }, (_, i) => (
        <Path key={`g${i}`} d={waveLine(540 + i * 22, 3, r)} {...stroke(FAINT, 1)} />
      ))}
    </G>
  );
}

function FieldScene() {
  const r = rng(17);
  const grass: ReactElement[] = [];
  for (let i = 0; i < 170; i++) {
    const x = r() * 360;
    const y = 430 + Math.pow(r(), 0.8) * 210;
    const h = 8 + r() * 16 + (y - 430) * 0.05;
    const lean = (r() - 0.5) * 8;
    grass.push(<Path key={i} d={`M${x.toFixed(1)} ${y.toFixed(1)} Q${(x + lean / 2).toFixed(1)} ${(y - h / 2).toFixed(1)} ${(x + lean).toFixed(1)} ${(y - h).toFixed(1)}`} {...stroke(r() > 0.3 ? OLIVE : '#9FA77A', 1)} />);
    if (i % 9 === 0) grass.push(<G key={`f${i}`}><Circle cx={x + lean} cy={y - h - 2} r={2.6} fill={WHITE} stroke={OUTLINE} strokeWidth={0.5} /><Circle cx={x + lean} cy={y - h - 2} r={0.9} fill={OCHRE} /></G>);
  }
  const birds = [[90, 260], [118, 248], [150, 270], [232, 232], [262, 246], [200, 300]].map(([x, y], i) => (
    <Path key={`b${i}`} d={`M${x - 6} ${y} Q${x - 3} ${y - 4} ${x} ${y} Q${x + 3} ${y - 4} ${x + 6} ${y}`} {...stroke(INK, 1.2)} />
  ));
  return (
    <G>
      <Circle cx={270} cy={350} r={30} {...stroke(OCHRE, 1)} />
      <Path d={waveLine(430, 3, r)} {...stroke(OLIVE, 1.1)} />
      {birds}
      {grass}
    </G>
  );
}

function NightScene() {
  // Tinta clara sobre el cielo nocturno (en modo oscuro, algo más apagada)
  const LIGHT = NIGHT === '#1D2758' ? '#EFEADB' : '#A8A290';
  const r = rng(19);
  const stars: ReactElement[] = [];
  for (let i = 0; i < 70; i++) stars.push(<Circle key={i} cx={r() * 360} cy={r() * 380} r={0.5 + r() * 1.1} fill={LIGHT} opacity={0.5 + r() * 0.5} />);
  return (
    <G>
      {stars}
      {/* La estrella de Belén (Lc 2) */}
      <G transform="translate(214 220)" {...stroke(NIGHT === '#1D2758' ? '#E9D9A8' : '#B9A777', 1)}>
        <Path d="M0 -26 L0 26 M-26 0 L26 0 M-9 -9 L9 9 M-9 9 L9 -9" />
        <Path d="M0 26 L-30 250" opacity={0.25} />
        <Path d="M0 26 L26 250" opacity={0.25} />
      </G>
      <Circle cx={214} cy={220} r={3} fill="#F3E6B8" />
      <Path d="M70 120 A22 22 0 1 0 98 150 A17 17 0 1 1 70 120 Z" fill="#F3E6B8" />
      {Array.from({ length: 10 }, (_, i) => (
        <Path key={i} d={hillLine(470 + i * 17, 150, 40 - i * 2, 150, r)} {...stroke(i % 2 ? '#6E8FC6' : LIGHT, 1)} opacity={0.8} />
      ))}
      <G transform="translate(196 452)">
        <Path d="M-22 0 L-22 -18 L0 -32 L22 -18 L22 0" {...stroke(LIGHT, 1.2)} />
        <Rect x={-5} y={-14} width={10} height={14} fill="#F3E6B8" />
      </G>
    </G>
  );
}

function VineScene() {
  const r = rng(23);
  const stem: [number, number][] = [[70, 640], [96, 560], [70, 480], [140, 430], [220, 400], [270, 330], [220, 270], [260, 220]];
  const leaves = [[92, 540, -30], [86, 470, 40], [160, 424, -20], [236, 380, 30], [262, 300, -40], [236, 256, 20]];
  return (
    <G>
      <Path d={smooth(stem)} {...stroke(WOOD, 2.2)} />
      <Path d={smooth([[140, 430], [120, 400], [126, 380]])} {...stroke(WOOD, 1)} />
      <Path d={smooth([[270, 330], [300, 330], [304, 312]])} {...stroke(WOOD, 1)} />
      {leaves.map(([x, y, rot], i) => (
        <G key={i} transform={`translate(${x} ${y}) rotate(${rot})`}>
          <Path d="M0 0 C6 -12 22 -12 30 0 C22 10 6 10 0 0 Z" fill="#DCE0C4" {...edge(OLIVE, 1)} />
          <Path d="M2 0 L26 0" {...stroke(OLIVE, 0.7)} />
        </G>
      ))}
      {[[190, 410], [232, 290]].map(([x, y], k) => (
        <G key={`c${k}`}>
          {[[0, 0], [8, 0], [16, 0], [4, 7], [12, 7], [8, 14], [-4, 7], [20, 7]].map(([dx, dy], j) => (
            <Circle key={j} cx={x + dx + (r() - 0.5)} cy={y + dy + 6} r={4.2} fill={k ? '#3C4A7E' : INK} opacity={0.9} />
          ))}
        </G>
      ))}
    </G>
  );
}

function WellScene() {
  const r = rng(29);
  return (
    <G>
      {Array.from({ length: 6 }, (_, i) => (
        <Path key={i} d={waveLine(440 + i * 34, 2, r)} {...stroke(FAINT, 1)} />
      ))}
      {/* Jesús junto al pozo de Jacob (Jn 4) */}
      <G transform="translate(176 438)">
        <Ellipse cx={0} cy={-34} rx={30} ry={7} fill="#E9DFC9" {...edge(WOOD, 1.1)} />
        <Ellipse cx={0} cy={-34} rx={22} ry={4} fill={SEA} opacity={0.5} />
        <Path d="M-30 -34 L-30 0 Q0 8 30 0 L30 -34" fill="#E3D7BE" {...edge(WOOD, 1.1)} />
        <Path d="M-30 -22 Q0 -14 30 -22 M-30 -10 Q0 -2 30 -10 M-12 -28 L-12 -18 M10 -27 L10 -17 M-2 -14 L-2 -4" {...stroke(WOOD, 0.7)} />
        <Path d="M-24 -38 L-24 -76 L24 -76 L24 -38 M0 -76 L0 -50" {...stroke(WOOD, 1)} />
      </G>
      <Christ x={226} y={440} s={1} sitting />
      <G transform="translate(126 440)">
        <Person x={0} y={0} s={1.15} color={INK} />
        <Path d="M3 -16 Q9 -18 9 -12 Q9 -8 4 -9" fill={OCHRE} />
      </G>
    </G>
  );
}

function BreadScene() {
  return (
    <G>
      {/* Cinco panes y dos peces (Jn 6,9) */}
      <G transform="translate(180 380)">
        <Path d="M-70 -10 Q-66 30 0 34 Q66 30 70 -10 Z" fill="#E3D4B4" {...edge(WOOD, 1.2)} />
        {[-50, -30, -10, 10, 30, 50].map((x) => (
          <Path key={x} d={`M${x} -8 Q${x + 4} 12 ${x} 28`} {...stroke(WOOD, 0.7)} />
        ))}
        <Path d="M-66 4 Q0 14 66 4 M-60 18 Q0 28 60 18" {...stroke(WOOD, 0.7)} />
        {[[-44, -16], [-18, -22], [8, -18], [34, -14], [-4, -34]].map(([x, y], i) => (
          <G key={i}>
            <Ellipse cx={x} cy={y} rx={15} ry={9} fill="#D8B98A" {...edge(WOOD, 0.9)} />
            <Path d={`M${x - 7} ${y - 2} Q${x} ${y - 6} ${x + 7} ${y - 2}`} {...stroke(WOOD, 0.7)} />
          </G>
        ))}
      </G>
      {[[118, 450, 0], [210, 462, 180]].map(([x, y, rot], i) => (
        <G key={`f${i}`} transform={`translate(${x} ${y}) rotate(${rot})`}>
          <Path d="M-22 0 C-12 -10 10 -10 16 0 C10 10 -12 10 -22 0 Z M16 0 L26 -8 L26 8 Z" fill="#E6EEF5" {...edge(SEA, 1)} />
          <Circle cx={-14} cy={-2} r={1.2} fill={INK} />
        </G>
      ))}
    </G>
  );
}

function LightScene() {
  const r = rng(31);
  return (
    <G>
      {Array.from({ length: 9 }, (_, i) => (
        <Circle key={i} cx={180} cy={318} r={22 + i * 15 + (r() - 0.5) * 3} {...stroke(i % 2 ? SEA : OCHRE, 0.9)} opacity={0.75 - i * 0.07} />
      ))}
      {/* Lámpara de aceite (Jn 8,12) */}
      <G transform="translate(180 356)">
        <Path d="M-34 0 Q-30 -16 0 -18 Q26 -18 40 -26 Q34 -6 18 0 Q0 6 -34 0 Z" fill="#D8B98A" {...edge(WOOD, 1.1)} />
        <Path d="M-34 0 Q-46 -4 -44 -14 Q-40 -8 -32 -8" {...stroke(WOOD, 1.1)} />
        <Path d="M38 -26 Q32 -40 38 -52 Q48 -40 42 -26 Z" fill={OCHRE} />
        <Path d="M-8 2 L8 2 L6 12 L-6 12 Z" fill="#D8B98A" {...edge(WOOD, 1)} />
      </G>
    </G>
  );
}

function DoveScene() {
  const r = rng(37);
  return (
    <G>
      {[-50, -25, 0, 25, 50].map((dx, i) => (
        <Path key={i} d={wobble(180 + dx * 0.15, 330, 180 + dx * 1.6, 440, r, 0.4)} {...stroke(OCHRE, 0.8)} opacity={0.6} />
      ))}
      {/* La paloma del Bautismo (Mt 3,16) */}
      <G transform="translate(180 300)">
        <Path
          d="M0 0 C-8 -6 -22 -16 -40 -16 C-28 -8 -20 -2 -10 4 C-18 8 -22 14 -22 20 C-14 14 -6 10 2 8 C8 14 18 16 28 14 C22 10 20 6 20 2 C28 -2 34 -8 36 -12 C28 -10 20 -8 14 -8 C20 -16 30 -24 44 -28 C26 -28 10 -16 0 0 Z"
          fill={WHITE}
          stroke={FAINT}
          strokeWidth={0.8}
        />
        <Circle cx={22} cy={-2} r={1.2} fill={INK} />
      </G>
      <Sea y0={452} n={9} gap={11} seed={41} amp={3} grow={0.15} />
      <Christ x={180} y={458} s={0.95} />
    </G>
  );
}

function TombScene() {
  const r = rng(43);
  return (
    <G>
      {Array.from({ length: 7 }, (_, i) => (
        <Path key={`s${i}`} d={wobble(280, 300, 280 + Math.cos((-160 + i * 25) * Math.PI / 180) * 90, 300 + Math.sin((-160 + i * 25) * Math.PI / 180) * 90, r, 0.3)} {...stroke(OCHRE, 0.9)} opacity={0.6} />
      ))}
      <Circle cx={280} cy={300} r={16} {...stroke(OCHRE, 1.1)} />
      {Array.from({ length: 8 }, (_, i) => (
        <Path key={i} d={hillLine(430 + i * 15, 120, 70 - i * 4, 110 + i * 8, r)} {...stroke(i % 2 ? FAINT : WOOD, 1.1)} />
      ))}
      {/* El sepulcro vacío (Jn 20,1) */}
      <Path d="M100 412 L100 384 Q120 360 140 384 L140 412 Z" fill={INK} />
      <Circle cx={168} cy={400} r={17} fill="#D9CDB4" {...edge(WOOD, 1.1)} />
      <Path d="M158 392 Q168 388 176 396 M160 406 Q168 410 178 404" {...stroke(WOOD, 0.7)} />
      {Array.from({ length: 40 }, (_, i) => {
        const x = r() * 360;
        const y = 540 + r() * 100;
        return <Path key={`g${i}`} d={`M${x} ${y} l${(r() - 0.5) * 4} -${6 + r() * 8}`} {...stroke(OLIVE, 1)} />;
      })}
    </G>
  );
}

function HeartScene() {
  const r = rng(47);
  return (
    <G>
      {Array.from({ length: 16 }, (_, i) => {
        const a = (i / 16) * Math.PI * 2;
        return <Path key={i} d={wobble(180 + Math.cos(a) * 66, 340 + Math.sin(a) * 66, 180 + Math.cos(a) * 92, 340 + Math.sin(a) * 92, r, 0.3)} {...stroke(OCHRE, 0.9)} opacity={0.55} />;
      })}
      {/* El Corazón de Cristo (Rom 5,8) */}
      <Path
        d="M180 392 C134 362 128 322 152 314 C166 310 176 318 180 328 C184 318 194 310 208 314 C232 322 226 362 180 392 Z"
        fill="#E7B9A9"
        {...edge(BRICK, 1.4)}
      />
      <Path d={waveLine(332, 2, r, 150, 210, 10)} {...stroke(WOOD, 1)} />
      <Path d={waveLine(337, 2, r, 150, 210, 10)} {...stroke(WOOD, 1)} />
      <Path d="M180 312 C172 302 176 292 180 282 C186 292 188 302 180 312 Z" fill={OCHRE} />
      <Path d="M180 282 L180 262 M173 268 L187 268" {...stroke(WOOD, 1.6)} />
    </G>
  );
}


function ShepherdScene() {
  const r = rng(53);
  return (
    <G>
      <Glow id="gl-shep" cx={250} cy={300} r={80} color={OCHRE} opacity={0.35} />
      <Circle cx={250} cy={300} r={26} {...stroke(OCHRE, 1)} />
      {Array.from({ length: 9 }, (_, i) => (
        <Path key={i} d={hillLine(470 + i * 20, 200, 50 - i * 3, 160 + i * 10, r)} {...stroke(i % 2 ? OLIVE : FAINT, 1.1)} />
      ))}
      {/* El Buen Pastor lleva la oveja sobre los hombros (Jn 10,11; Lc 15,5) */}
      <Path d="M206 470 L214 352 Q215 336 228 338 Q238 341 234 352" {...stroke(WOOD, 2)} />
      <Christ x={190} y={472} s={2.3} carry />
      <Sheep x={110} y={476} s={1.2} wool={WOOL[1]} />
      <Sheep x={80} y={486} s={1.05} wool={WOOL[3]} />
      <Sheep x={128} y={494} s={1.1} wool={WOOL[0]} />
    </G>
  );
}

function StormScene() {
  const r = rng(59);
  const rain: ReactElement[] = [];
  for (let i = 0; i < 46; i++) {
    const x = r() * 380 - 10;
    const y = 120 + r() * 230;
    rain.push(<Path key={i} d={`M${x} ${y} l-6 14`} {...stroke(SEA, 0.9)} opacity={0.5} />);
  }
  return (
    <G>
      {[90, 120, 150].map((y, i) => (
        <Path key={`c${i}`} d={waveLine(y, 10 + i * 2, r, -30, 390, 22)} {...stroke(INK, 1.4)} opacity={0.5 - i * 0.1} />
      ))}
      {rain}
      <Glow id="gl-storm" cx={196} cy={330} r={120} />
      <Sea y0={380} n={24} gap={11} seed={61} amp={13} grow={0.5} />
      {/* «¡Silencio, enmudece!» (Mc 4,39) */}
      <G transform="translate(120 382) rotate(-10)">
        {[0, 8, 16, 24, 40, 48].map((x, i) => (
          <Person key={i} x={x + 16} y={-4} s={0.7} />
        ))}
        <Path d="M0 -4 L96 -8 Q90 8 70 12 L22 12 Q6 10 0 -4 Z" fill="#E9DFC9" {...edge(WOOD, 1)} />
        <Path d="M4 1 L92 -2 M9 6 L86 4" {...stroke(WOOD, 0.8)} />
        <Path d="M54 -6 L56 -70" {...stroke(WOOD, 1.2)} />
      </G>
      <Christ x={198} y={372} s={1.25} arm={2} />
    </G>
  );
}

function NetsScene() {
  const r = rng(67);
  const fish: ReactElement[] = [];
  for (let i = 0; i < 26; i++) {
    const x = 70 + r() * 110;
    const y = 470 + r() * 70;
    fish.push(<Path key={i} d={`M${x - 6} ${y} q6 -4 12 0 q-6 4 -12 0 Z M${x + 6} ${y} l4 -3 l0 6 Z`} fill={SEA} opacity={0.75} />);
  }
  return (
    <G>
      <Glow id="gl-nets" cx={290} cy={360} r={110} />
      <Circle cx={292} cy={350} r={20} {...stroke(OCHRE, 1)} />
      <Sea y0={440} n={18} gap={11} seed={71} amp={3} grow={0.2} />
      {/* La red llena de peces (Jn 21,6) */}
      <Path d="M60 450 Q120 560 190 452" fill={PAPER} opacity={0.5} />
      {Array.from({ length: 8 }, (_, i) => (
        <Path key={`n${i}`} d={`M${66 + i * 16} 452 Q${76 + i * 14} 500 ${90 + i * 10} ${540 - Math.abs(i - 3.5) * 10}`} {...stroke(WOOD, 0.7)} />
      ))}
      {Array.from({ length: 5 }, (_, i) => (
        <Path key={`m${i}`} d={`M${64 + i * 6} ${466 + i * 16} Q125 ${480 + i * 18} ${186 - i * 8} ${466 + i * 16}`} {...stroke(WOOD, 0.7)} />
      ))}
      {fish}
      <G transform="translate(40 446)">
        {[10, 18, 26, 34].map((x, i) => (
          <Person key={i} x={x + 30} y={-6} s={0.75} />
        ))}
        <Path d="M0 -6 L100 -10 Q94 6 74 10 L22 10 Q6 8 0 -6 Z" fill="#E9DFC9" {...edge(WOOD, 1)} />
        <Path d="M50 -8 L52 -60" {...stroke(WOOD, 1.2)} />
      </G>
      {/* En la orilla, Jesús y unas brasas (Jn 21,9) */}
      <Path d={waveLine(436, 1.5, r, 240, 390, 20)} {...stroke(WOOD, 1.2)} />
      <Christ x={300} y={434} s={1.15} arm={-1} />
      <Path d="M262 432 q4 -10 8 0 q2 -8 6 0" fill={OCHRE} />
      <Path d="M268 424 q-4 -10 2 -18 q-4 -8 2 -16" {...stroke(FAINT, 1)} />
    </G>
  );
}

function MaryScene() {
  const r = rng(73);
  const stars = Array.from({ length: 12 }, (_, i) => {
    const a = (i / 12) * Math.PI * 2;
    return <Circle key={i} cx={180 + Math.cos(a) * 30} cy={352 + Math.sin(a) * 30} r={1.6} fill={OCHRE} />;
  });
  return (
    <G>
      <Glow id="gl-mary" cx={180} cy={360} r={150} />
      {Array.from({ length: 7 }, (_, i) => (
        <Path key={i} d={waveLine(500 + i * 20, 2, r)} {...stroke(i % 2 ? OLIVE : FAINT, 1)} />
      ))}
      <Circle cx={180} cy={352} r={19} {...stroke(OCHRE, 1.2)} />
      {stars}
      {/* «He aquí la esclava del Señor» (Lc 1,38) */}
      <G transform="translate(180 500) scale(2.6)">
        <Ellipse cx={0} cy={0.6} rx={11} ry={1.4} fill={INK} opacity={0.1} />
        <Path d="M-4 -58 C-14 -58 -16 -44 -15 -30 C-15 -18 -18 -8 -20 0 L20 0 C18 -8 15 -18 15 -30 C16 -44 14 -58 4 -58 Z" fill={SEA} />
        <Path d="M-6 -40 C-7 -26 -8 -12 -9 0 L9 0 C8 -12 7 -26 6 -40 Z" fill={WHITE} stroke={OUTLINE} strokeWidth={0.4} />
        <Ellipse cx={0} cy={-54} rx={3.8} ry={4.6} fill={SKIN} />
        <Path d="M-1.5 -36 L0 -30 L1.5 -36 Z" fill={SKIN} />
        <Path d="M-4 -60 C-10 -60 -12 -50 -11 -44 M4 -60 C10 -60 12 -50 11 -44" {...stroke(INK, 0.4)} opacity={0.5} />
      </G>
      {/* Lirios */}
      {[[76, 520], [96, 528], [270, 522], [290, 530]].map(([x, y], i) => (
        <G key={`l${i}`}>
          <Path d={`M${x} ${y} Q${x + 4} ${y - 40} ${x + 2} ${y - 70}`} {...stroke(OLIVE, 1.2)} />
          <Path d={`M${x + 2} ${y - 70} l-6 -10 l6 4 l6 -4 Z`} fill={WHITE} stroke={OUTLINE} strokeWidth={0.6} />
          <Path d={`M${x + 3} ${y - 40} q8 -4 12 -12`} {...stroke(OLIVE, 1)} />
        </G>
      ))}
    </G>
  );
}

function LambScene() {
  const r = rng(79);
  return (
    <G>
      <Glow id="gl-lamb" cx={180} cy={380} r={140} />
      {Array.from({ length: 10 }, (_, i) => (
        <Path key={i} d={hillLine(450 + i * 18, 180, 40 - i * 2.5, 120 + i * 12, r)} {...stroke(i % 2 ? OLIVE : FAINT, 1.1)} />
      ))}
      {/* «Este es el Cordero de Dios» (Jn 1,29) */}
      <Path d="M206 410 L206 300" {...stroke(WOOD, 1.6)} />
      <Path d="M201 306 L211 306" {...stroke(WOOD, 1.6)} />
      <Path d="M206 312 C226 308 236 318 250 312 L244 326 L250 340 C236 346 226 336 206 340 Z" fill={WHITE} stroke={OUTLINE} strokeWidth={0.8} />
      <Path d="M226 318 L226 334 M219 326 L233 326" {...stroke(BRICK, 1.6)} />
      <Circle cx={210} cy={388} r={13} {...stroke(OCHRE, 1.2)} />
      <G transform="translate(180 420) scale(2.8)">
        <Sheep x={0} y={0} s={1} wool={WHITE} head={SKIN} />
      </G>
    </G>
  );
}

function GardenScene() {
  const r = rng(83);
  const tree = (x: number, y: number, k: number) => (
    <G key={`t${x}`}>
      <Path d={`M${x} ${y} C${x - 6 * k} ${y - 30 * k} ${x + 8 * k} ${y - 50 * k} ${x - 2 * k} ${y - 80 * k}`} {...stroke(WOOD, 2.4 * k)} />
      <Path d={`M${x - 1 * k} ${y - 50 * k} C${x + 14 * k} ${y - 60 * k} ${x + 20 * k} ${y - 74 * k} ${x + 24 * k} ${y - 86 * k}`} {...stroke(WOOD, 1.4 * k)} />
      {Array.from({ length: 22 }, (_, i) => {
        const a = r() * Math.PI * 2;
        const d = r() * 30 * k;
        const cx = x + 4 * k + Math.cos(a) * d * 1.3;
        const cy = y - 92 * k + Math.sin(a) * d * 0.7;
        return <Ellipse key={i} cx={cx} cy={cy} rx={4 * k} ry={1.7 * k} transform={`rotate(${r() * 60 - 30} ${cx} ${cy})`} fill={OLIVE} opacity={0.75} />;
      })}
    </G>
  );
  return (
    <G>
      <Glow id="gl-gard" cx={260} cy={230} r={90} />
      <Path d="M246 210 A26 26 0 1 0 276 244 A20 20 0 1 1 246 210 Z" fill={OCHRE} opacity={0.8} />
      {Array.from({ length: 6 }, (_, i) => (
        <Path key={i} d={waveLine(470 + i * 26, 2, r)} {...stroke(FAINT, 1)} />
      ))}
      {tree(70, 470, 1.3)}
      {tree(300, 476, 1.1)}
      {/* Jesús ora en el huerto (Lc 22,41-42) */}
      <Path d="M150 470 C150 440 176 430 206 436 C226 440 232 458 230 470 Z" fill={FAINT} {...edge(WOOD, 1)} />
      <Christ x={190} y={438} s={1.4} kneel />
      <Path d="M190 380 L190 300" {...stroke(OCHRE, 0.8)} opacity={0.6} />
    </G>
  );
}

function TreeScene() {
  const r = rng(89);
  const leaves: ReactElement[] = [];
  for (let i = 0; i < 150; i++) {
    const a = r() * Math.PI * 2;
    const d = Math.sqrt(r()) * 100;
    const cx = 180 + Math.cos(a) * d * 1.25;
    const cy = 270 + Math.sin(a) * d * 0.75;
    leaves.push(<Ellipse key={i} cx={cx} cy={cy} rx={5} ry={2.2} transform={`rotate(${r() * 180} ${cx} ${cy})`} fill={r() > 0.4 ? OLIVE : '#A3AE7C'} opacity={0.85} />);
  }
  return (
    <G>
      <Glow id="gl-tree" cx={180} cy={280} r={170} />
      {/* El árbol junto a la acequia (Sal 1,3) y el grano de mostaza (Mt 13,31-32) */}
      <Path d="M172 470 C170 420 160 380 168 330 L192 330 C200 380 190 420 188 470 Z" fill={WOOD} />
      <Path d="M176 340 C150 320 120 300 100 280 M184 338 C210 316 240 300 262 278 M180 330 C178 300 182 270 180 240" {...stroke(WOOD, 3)} />
      {leaves}
      {[[120, 236], [236, 250], [182, 214]].map(([x, y], i) => (
        <Path key={`b${i}`} d={`M${x - 5} ${y} Q${x - 2} ${y - 4} ${x} ${y} Q${x + 2} ${y - 4} ${x + 5} ${y}`} {...stroke(INK, 1.2)} />
      ))}
      <Path d="M150 472 C160 476 200 476 210 472" {...stroke(WOOD, 1.2)} />
      <Sea y0={500} n={10} gap={12} seed={97} amp={3} grow={0.2} />
    </G>
  );
}

function StarsScene() {
  const r = rng(101);
  const stars: ReactElement[] = [];
  for (let i = 0; i < 160; i++) {
    const x = r() * 360;
    const y = r() * 430;
    const big = r() > 0.94;
    stars.push(
      big ? (
        <Path key={i} d={`M${x} ${y - 4} L${x} ${y + 4} M${x - 4} ${y} L${x + 4} ${y}`} {...stroke('#E9D9A8', 0.8)} />
      ) : (
        <Circle key={i} cx={x} cy={y} r={0.4 + r() * 1} fill="#E9E3D2" opacity={0.4 + r() * 0.6} />
      ),
    );
  }
  // Vía Láctea
  const milky: ReactElement[] = [];
  for (let i = 0; i < 140; i++) {
    const t = r();
    const x = t * 380 - 10;
    const y = 360 - t * 280 + (r() - 0.5) * 50;
    milky.push(<Circle key={`m${i}`} cx={x} cy={y} r={0.5 + r() * 0.6} fill="#E9E3D2" opacity={0.3} />);
  }
  return (
    <G>
      <Glow id="gl-stars" cx={180} cy={220} r={220} color="#3A4680" opacity={0.6} />
      {milky}
      {stars}
      {/* «Mira al cielo y cuenta las estrellas» (Gn 15,5) */}
      <Path d={hillLine(520, 150, 40, 120, r)} {...stroke('#8E8877', 1.2)} />
      <Path d="M-30 640 L-30 520 Q150 470 390 530 L390 640 Z" fill="#0E1330" />
      <Person x={150} y={484} s={1.3} color="#C9C3B2" />
      <Path d="M150.5 470 L156 462" {...stroke('#C9C3B2', 1.2)} />
    </G>
  );
}

function EagleScene() {
  const r = rng(107);
  return (
    <G>
      <Glow id="gl-eagle" cx={180} cy={300} r={170} />
      <Circle cx={250} cy={260} r={30} {...stroke(OCHRE, 1)} />
      {/* «Echan alas como las águilas» (Is 40,31) */}
      <G transform="translate(170 320)">
        <Path
          d="M0 0 C-20 -10 -50 -30 -96 -34 C-80 -26 -66 -18 -58 -10 C-74 -12 -86 -10 -96 -6 C-74 0 -46 4 -20 8 C-14 16 -6 22 0 24 C6 22 14 16 20 8 C46 4 74 0 96 -6 C86 -10 74 -12 58 -10 C66 -18 80 -26 96 -34 C50 -30 20 -10 0 0 Z"
          fill={WOOD}
          {...edge(INK, 0.8)}
        />
        <Path d="M-4 -2 C-4 -10 4 -10 4 -2" fill={WHITE} />
        <Path d="M-6 22 L0 34 L6 22" fill={WOOD} {...edge(INK, 0.8)} />
        <Path d="M-70 -22 L-40 -8 M-80 -14 L-48 -4 M70 -22 L40 -8 M80 -14 L48 -4" {...stroke(INK, 0.6)} opacity={0.5} />
      </G>
      {Array.from({ length: 8 }, (_, i) => (
        <Path key={i} d={hillLine(520 + i * 14, i % 2 ? 90 : 260, 110 - i * 10, 60 + i * 6, r)} {...stroke(i % 2 ? SEA : INK, 1.1)} />
      ))}
    </G>
  );
}

const SCENES: Record<SceneId, () => ReactElement> = {
  sea: SeaScene,
  flock: FlockScene,
  cross: CrossScene,
  path: PathScene,
  mountain: MountainScene,
  field: FieldScene,
  night: NightScene,
  vine: VineScene,
  well: WellScene,
  bread: BreadScene,
  light: LightScene,
  dove: DoveScene,
  tomb: TombScene,
  heart: HeartScene,
  shepherd: ShepherdScene,
  storm: StormScene,
  nets: NetsScene,
  mary: MaryScene,
  lamb: LambScene,
  garden: GardenScene,
  tree: TreeScene,
  stars: StarsScene,
  eagle: EagleScene,
};

/** Contenido de la escena (sin el <Svg>), memorizado: el dibujo es determinista. */
export const SceneArt = memo(function SceneArt({ id }: { id: SceneId }) {
  const S = SCENES[id];
  return (
    <G>
      <Rect x={-200} y={-200} width={760} height={1040} fill={SCENE_META[id].bg} />
      {id !== 'night' && id !== 'stars' && <Glow id={`g-${id}`} cx={180} cy={FOCUS[id] - 40} r={240} opacity={0.35} />}
      <S />
    </G>
  );
});
