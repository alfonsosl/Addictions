// "La grandeza del amor de Dios": una ilustración y un versículo distintos cada día (ciclo de 16 días).
// Citas según traducciones castellanas habituales; pueden variar ligeramente según la edición.

import type { SceneId } from '../components/art/scenes';

export type LoveDay = { scene: SceneId; title: string; verse: string; source: string; thought: string };

export const LOVE_DAYS: LoveDay[] = [
  {
    scene: 'cross',
    title: 'Te ha dado a su Hijo',
    verse: 'Tanto amó Dios al mundo, que entregó a su Hijo único, para que todo el que cree en él no perezca, sino que tenga vida eterna.',
    source: 'Jn 3,16',
    thought: 'No tienes que ganarte su amor: ya te lo ha dado entero en la Cruz.',
  },
  {
    scene: 'path',
    title: 'El Padre sale a tu encuentro',
    verse: 'Cuando todavía estaba lejos, su padre lo vio y se conmovió; echó a correr, se le echó al cuello y lo cubrió de besos.',
    source: 'Lc 15,20',
    thought: 'Antes de que termines de pedir perdón, Él ya ha corrido hacia ti.',
  },
  {
    scene: 'flock',
    title: 'Da la vida por ti',
    verse: 'Yo soy el buen pastor. El buen pastor da la vida por las ovejas.',
    source: 'Jn 10,11',
    thought: 'Te conoce por tu nombre y no se cansa de buscarte.',
  },
  {
    scene: 'sea',
    title: 'Su mano está tendida',
    verse: 'Al punto Jesús extendió la mano, lo agarró y le dijo: «¡Hombre de poca fe! ¿Por qué has dudado?».',
    source: 'Mt 14,31',
    thought: 'Cuando empiezas a hundirte, no tienes que salir solo: grítale y te agarrará.',
  },
  {
    scene: 'heart',
    title: 'Te amó siendo pecador',
    verse: 'Dios nos demostró su amor en que, siendo nosotros todavía pecadores, Cristo murió por nosotros.',
    source: 'Rom 5,8',
    thought: 'No te ama cuando eres perfecto: te ama ahora, para hacerte libre.',
  },
  {
    scene: 'field',
    title: 'Nueva cada mañana',
    verse: 'La misericordia del Señor no se acaba, no se agota su compasión: se renueva cada mañana. ¡Qué grande es tu fidelidad!',
    source: 'Lam 3,22-23',
    thought: 'Hoy es un día nuevo. Su misericordia también.',
  },
  {
    scene: 'dove',
    title: 'Él te amó primero',
    verse: 'En esto consiste el amor: no en que nosotros hayamos amado a Dios, sino en que él nos amó y nos envió a su Hijo.',
    source: '1 Jn 4,10',
    thought: 'Tu lucha es una respuesta a un amor que llegó antes.',
  },
  {
    scene: 'night',
    title: 'Con amor eterno',
    verse: 'Con amor eterno te he amado; por eso te he atraído con misericordia.',
    source: 'Jer 31,3',
    thought: 'Incluso de noche, incluso en tus peores horas, su amor no se apaga.',
  },
  {
    scene: 'vine',
    title: 'Permanece en su amor',
    verse: 'Como el Padre me ha amado, así os he amado yo; permaneced en mi amor.',
    source: 'Jn 15,9',
    thought: 'Unido a Él, como el sarmiento a la vid, darás fruto.',
  },
  {
    scene: 'tomb',
    title: 'Nada te separará',
    verse: 'Ni la muerte ni la vida, ni lo presente ni lo futuro… ni criatura alguna podrá separarnos del amor de Dios manifestado en Cristo Jesús.',
    source: 'Rom 8,38-39',
    thought: 'Tu ancla está en Él. Las olas pasan; su amor permanece.',
  },
  {
    scene: 'flock',
    title: 'Te carga sobre sus hombros',
    verse: 'Va tras la oveja perdida hasta que la encuentra. Y cuando la encuentra, se la carga sobre los hombros, lleno de alegría.',
    source: 'Lc 15,4-5',
    thought: 'Cuando ya no puedes más, no te riñe: te lleva.',
  },
  {
    scene: 'well',
    title: 'Ven a descansar',
    verse: 'Venid a mí todos los que estáis cansados y agobiados, y yo os aliviaré.',
    source: 'Mt 11,28',
    thought: 'Lo que buscas en la pantalla —descanso, consuelo— está en Él.',
  },
  {
    scene: 'field',
    title: 'Ternura de Padre',
    verse: 'Como un padre siente ternura por sus hijos, siente el Señor ternura por los que le temen; porque él sabe de qué estamos hechos.',
    source: 'Sal 103,13-14',
    thought: 'Conoce tu fragilidad mejor que tú, y la mira con ternura.',
  },
  {
    scene: 'heart',
    title: 'Eres precioso para Él',
    verse: 'Porque eres precioso a mis ojos, eres estimado y yo te amo.',
    source: 'Is 43,4',
    thought: 'Tu dignidad no depende de tu racha: eres hijo amado.',
  },
  {
    scene: 'mountain',
    title: 'Más firme que los montes',
    verse: 'Aunque los montes cambien de lugar y las colinas se tambaleen, mi amor no se apartará de tu lado.',
    source: 'Is 54,10',
    thought: 'Tu fidelidad tiembla; la suya no. Apóyate en Él.',
  },
  {
    scene: 'light',
    title: 'La luz no se apaga',
    verse: 'Yo soy la luz del mundo; el que me sigue no caminará en tinieblas, sino que tendrá la luz de la vida.',
    source: 'Jn 8,12',
    thought: 'Lo que se hace en la oscuridad pierde su fuerza cuando lo llevas a la luz.',
  },
  {
    scene: 'bread',
    title: 'Él sacia tu hambre',
    verse: 'Yo soy el pan de vida. El que viene a mí no tendrá hambre, y el que cree en mí no tendrá sed jamás.',
    source: 'Jn 6,35',
    thought: 'El hambre de tu corazón tiene nombre: es hambre de Él.',
  },
];

/** La ilustración de hoy (cambia a medianoche, hora local). */
export function loveForDate(d: Date): LoveDay {
  const days = Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 86_400_000);
  return LOVE_DAYS[((days % LOVE_DAYS.length) + LOVE_DAYS.length) % LOVE_DAYS.length];
}
