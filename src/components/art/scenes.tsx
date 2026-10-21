import { memo, type ReactElement } from 'react';
import { Circle, Ellipse, G, Path, Rect } from 'react-native-svg';
import {
  BRICK,
  Christ,
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
  | 'heart';

export type SceneMeta = { focus: number; dark?: boolean; bg: string };

export const SCENE_META: Record<SceneId, SceneMeta> = {
  sea: { focus: 440, bg: PAPER },
  flock: { focus: 500, bg: PAPER },
  cross: { focus: 380, bg: PAPER },
  path: { focus: 380, bg: PAPER },
  mountain: { focus: 370, bg: PAPER },
  field: { focus: 430, bg: PAPER },
  night: { focus: 330, bg: '#1D2758', dark: true },
  vine: { focus: 360, bg: PAPER },
  well: { focus: 420, bg: PAPER },
  bread: { focus: 360, bg: PAPER },
  light: { focus: 340, bg: PAPER },
  dove: { focus: 380, bg: PAPER },
  tomb: { focus: 400, bg: PAPER },
  heart: { focus: 340, bg: PAPER },
};

const edge = (color: string, w = 1.3) => ({ stroke: color, strokeWidth: w, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const });
const stroke = (color: string, w = 1.3) => ({ ...edge(color, w), fill: 'none' });

function SeaScene() {
  return (
    <G>
      <Sea y0={455} n={20} gap={10} seed={7} amp={5} />
      {/* Barca con los discípulos */}
      <G transform="translate(60 452)">
        {[-14, -10, -6, 2, 6, 10, 14, 18, 22, 26].map((x, i) => (
          <Person key={i} x={x + 30} y={-6} s={0.75} color="#222" />
        ))}
        <Path d="M0 -6 L96 -10 Q90 6 70 10 L22 10 Q6 8 0 -6 Z" fill="#E9DFC9" {...edge(WOOD, 1)} />
        <Path d="M4 -1 L92 -4 M9 4 L86 2" {...stroke(WOOD, 0.8)} />
        <Path d="M48 -8 L50 -64" {...stroke(WOOD, 1.2)} />
        <Path d="M36 -52 L64 -60" {...stroke(WOOD, 1.1)} />
        <Path d="M51 -58 Q66 -52 68 -38 Q60 -40 51 -38 Z" fill={WHITE} {...{ stroke: '#D6CDB8', strokeWidth: 0.6 }} />
      </G>
      {/* Jesús tiende la mano a Pedro, que se hunde (Mt 14,31) */}
      <Christ x={262} y={449} s={0.95} arm={-1} />
      <G transform="translate(244 452)">
        <Path d="M-3 0 Q-2 -6 0 -7 Q2 -6 3 0 Z" fill="#222" />
        <Circle cx={0} cy={-9} r={1.8} fill="#222" />
        <Path d="M1 -6 Q4 -11 6 -14" {...stroke('#222', 1.4)} />
      </G>
    </G>
  );
}

function FlockScene() {
  const r = rng(3);
  const sheep: ReactElement[] = [];
  for (let row = 0; row < 8; row++) {
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
      <G transform="translate(196 548)">
        <Path d="M-40 4 Q0 2 34 5" {...stroke('#BDB29C', 0.8)} />
        <Christ x={4} y={0} s={1.05} sitting />
        <Sheep x={-14} y={-4} s={1.1} wool={WHITE} head="#2A2A2A" />
        <Path d="M14 2 L36 4" {...stroke('#D6CDB8', 0.9)} />
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
        <Path key={i} d={waveLine(380 + i * 30, 2 + i * 0.6, r)} {...stroke(i % 2 ? '#B9AE95' : '#CFC5AE', 1)} />
      ))}
      {/* El camino de vuelta a casa (Lc 15,20) */}
      <Path d={smooth([[150, 640], [168, 560], [150, 480], [190, 420], [214, 372]])} {...stroke(INK, 1.3)} />
      <Path d={smooth([[230, 640], [214, 560], [196, 480], [214, 420], [222, 372]])} {...stroke(INK, 1.3)} />
      <G transform="translate(226 368)">
        <Path d="M-14 0 L-14 -16 L0 -26 L14 -16 L14 0 Z" fill="#E9DFC9" {...edge(WOOD, 1)} />
        <Rect x={-3} y={-10} width={6} height={10} fill={OCHRE} />
      </G>
      <Christ x={205} y={404} s={0.8} arm={-1} />
      <Person x={188} y={422} s={0.85} color="#222" />
    </G>
  );
}

function MountainScene() {
  const r = rng(13);
  const crowd: ReactElement[] = [];
  for (let i = 0; i < 44; i++) {
    const row = Math.floor(i / 11);
    crowd.push(<Person key={i} x={78 + (i % 11) * 20 + (r() - 0.5) * 6 + row * 4} y={478 + row * 13} s={0.55 + r() * 0.1} color={r() > 0.5 ? INK : '#3B3B3B'} />);
  }
  return (
    <G>
      {Array.from({ length: 10 }, (_, i) => (
        <Path key={i} d={hillLine(470 - i * 2 + i * 9, 180, 120 - i * 11, 70 + i * 9, r)} {...stroke(i % 2 ? SEA : INK, 1.1)} />
      ))}
      <Christ x={180} y={352} s={0.9} />
      {crowd}
      {Array.from({ length: 5 }, (_, i) => (
        <Path key={`g${i}`} d={waveLine(540 + i * 22, 3, r)} {...stroke('#C9BEA6', 1)} />
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
    if (i % 9 === 0) grass.push(<G key={`f${i}`}><Circle cx={x + lean} cy={y - h - 2} r={2.6} fill={WHITE} stroke="#D6CDB8" strokeWidth={0.5} /><Circle cx={x + lean} cy={y - h - 2} r={0.9} fill={OCHRE} /></G>);
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
  const r = rng(19);
  const stars: ReactElement[] = [];
  for (let i = 0; i < 70; i++) stars.push(<Circle key={i} cx={r() * 360} cy={r() * 380} r={0.5 + r() * 1.1} fill={PAPER} opacity={0.5 + r() * 0.5} />);
  return (
    <G>
      {stars}
      {/* La estrella de Belén (Lc 2) */}
      <G transform="translate(214 220)" {...stroke('#E9D9A8', 1)}>
        <Path d="M0 -26 L0 26 M-26 0 L26 0 M-9 -9 L9 9 M-9 9 L9 -9" />
        <Path d="M0 26 L-30 250" opacity={0.25} />
        <Path d="M0 26 L26 250" opacity={0.25} />
      </G>
      <Circle cx={214} cy={220} r={3} fill="#F3E6B8" />
      <Path d="M70 120 A22 22 0 1 0 98 150 A17 17 0 1 1 70 120 Z" fill="#F3E6B8" />
      {Array.from({ length: 10 }, (_, i) => (
        <Path key={i} d={hillLine(470 + i * 17, 150, 40 - i * 2, 150, r)} {...stroke(i % 2 ? '#6E8FC6' : PAPER, 1)} opacity={0.8} />
      ))}
      <G transform="translate(196 452)">
        <Path d="M-22 0 L-22 -18 L0 -32 L22 -18 L22 0" {...stroke(PAPER, 1.2)} />
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
        <Path key={i} d={waveLine(440 + i * 34, 2, r)} {...stroke('#CFC5AE', 1)} />
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
        <Person x={0} y={0} s={1.15} color="#2A2A2A" />
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
          stroke="#CFC5AE"
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
        <Path key={i} d={hillLine(430 + i * 15, 120, 70 - i * 4, 110 + i * 8, r)} {...stroke(i % 2 ? '#9C8F74' : WOOD, 1.1)} />
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
};

/** Contenido de la escena (sin el <Svg>), memorizado: el dibujo es determinista. */
export const SceneArt = memo(function SceneArt({ id }: { id: SceneId }) {
  const S = SCENES[id];
  return (
    <G>
      <Rect x={-200} y={-200} width={760} height={1040} fill={SCENE_META[id].bg} />
      <S />
    </G>
  );
});
