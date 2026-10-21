// "La grandeza del amor de Dios": una ilustración y un versículo distintos cada día (ciclo de 14 días).
// Citas según traducciones castellanas habituales; pueden variar ligeramente según la edición.

export type Scene = 'cross' | 'door' | 'shepherd' | 'hands' | 'heart' | 'sunrise' | 'dove' | 'night' | 'vine' | 'anchor';

export type LoveDay = { scene: Scene; title: string; verse: string; source: string; thought: string };

export const LOVE_DAYS: LoveDay[] = [
  {
    scene: 'cross',
    title: 'Te ha dado a su Hijo',
    verse: 'Tanto amó Dios al mundo, que entregó a su Hijo único, para que todo el que cree en él no perezca, sino que tenga vida eterna.',
    source: 'Jn 3,16',
    thought: 'No tienes que ganarte su amor: ya te lo ha dado entero en la Cruz.',
  },
  {
    scene: 'door',
    title: 'El Padre sale a tu encuentro',
    verse: 'Cuando todavía estaba lejos, su padre lo vio y se conmovió; echó a correr, se le echó al cuello y lo cubrió de besos.',
    source: 'Lc 15,20',
    thought: 'Antes de que termines de pedir perdón, Él ya ha corrido hacia ti.',
  },
  {
    scene: 'shepherd',
    title: 'Da la vida por ti',
    verse: 'Yo soy el buen pastor. El buen pastor da la vida por las ovejas.',
    source: 'Jn 10,11',
    thought: 'Te conoce por tu nombre y no se cansa de buscarte.',
  },
  {
    scene: 'hands',
    title: 'No te olvidará',
    verse: '¿Puede una madre olvidarse de su criatura? Pues aunque ella se olvide, yo no te olvidaré. Mira, te llevo tatuado en las palmas de mis manos.',
    source: 'Is 49,15-16',
    thought: 'Tu nombre está escrito en sus manos. Ninguna caída lo borra.',
  },
  {
    scene: 'heart',
    title: 'Te amó siendo pecador',
    verse: 'Dios nos demostró su amor en que, siendo nosotros todavía pecadores, Cristo murió por nosotros.',
    source: 'Rom 5,8',
    thought: 'No te ama cuando eres perfecto: te ama ahora, para hacerte libre.',
  },
  {
    scene: 'sunrise',
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
    scene: 'anchor',
    title: 'Nada te separará',
    verse: 'Ni la muerte ni la vida, ni lo presente ni lo futuro… ni criatura alguna podrá separarnos del amor de Dios manifestado en Cristo Jesús.',
    source: 'Rom 8,38-39',
    thought: 'Tu ancla está en Él. Las olas pasan; su amor permanece.',
  },
  {
    scene: 'shepherd',
    title: 'Te carga sobre sus hombros',
    verse: 'Va tras la oveja perdida hasta que la encuentra. Y cuando la encuentra, se la carga sobre los hombros, lleno de alegría.',
    source: 'Lc 15,4-5',
    thought: 'Cuando ya no puedes más, no te riñe: te lleva.',
  },
  {
    scene: 'door',
    title: 'Ven a descansar',
    verse: 'Venid a mí todos los que estáis cansados y agobiados, y yo os aliviaré.',
    source: 'Mt 11,28',
    thought: 'Lo que buscas en la pantalla —descanso, consuelo— está en Él.',
  },
  {
    scene: 'hands',
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
];

/** La ilustración de hoy (cambia a medianoche, hora local). */
export function loveForDate(d: Date): LoveDay {
  const days = Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 86_400_000);
  return LOVE_DAYS[((days % LOVE_DAYS.length) + LOVE_DAYS.length) % LOVE_DAYS.length];
}
