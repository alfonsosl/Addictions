import type { IconName } from '../components/icons';

// Virtudes para crecer: no basta con dejar un vicio, hay que ocupar su lugar con un bien
// («No te dejes vencer por el mal; antes bien, vence el mal con el bien», Rom 12,21).
// Siete virtudes frente a los pecados capitales (Catecismo, n.º 1866) y la fortaleza, que las sostiene.
// Citas bíblicas según traducciones castellanas habituales.

export type VirtueAction = { id: string; text: string; hint?: string };

export type Virtue = {
  id: string;
  name: string;
  vice: string; // vicio al que se opone
  icon: IconName;
  summary: string;
  why: string; // por qué ayuda a salir de la adicción
  verse: string;
  source: string;
  catechism: string;
  actions: VirtueAction[];
};

export const VIRTUES: Virtue[] = [
  {
    id: 'castidad',
    name: 'Castidad',
    vice: 'lujuria',
    icon: 'heart',
    summary: 'Integrar la sexualidad en la persona: amar con todo el ser, sin usar a nadie.',
    why: 'La pornografía enseña a mirar a las personas como objetos. La castidad reeduca la mirada y el corazón para amar de verdad. No es represión: es libertad para amar.',
    verse: 'Bienaventurados los limpios de corazón, porque ellos verán a Dios.',
    source: 'Mt 5,8',
    catechism: 'Catecismo, n.º 2337-2350',
    actions: [
      { id: 'mirada', text: 'Custodiar la mirada', hint: 'Si algo te atrae de forma desordenada, aparta la vista en los dos primeros segundos.' },
      { id: 'avemarias', text: 'Tres Avemarías por la pureza', hint: 'Al levantarte o al acostarte.' },
      { id: 'movil', text: 'Móvil fuera del dormitorio', hint: 'Cárgalo en otra habitación.' },
      { id: 'redes', text: 'Saltar contenido sugerente', hint: 'En redes y series: pasa, silencia o deja de seguir.' },
      { id: 'personas', text: 'Ver a cada persona como hija de Dios', hint: 'Bendice en silencio a quien veas por la calle.' },
      { id: 'ofrecer', text: 'Ofrecer el cuerpo a Dios al acostarte', hint: '«Ofreced vuestros cuerpos como sacrificio vivo» (Rom 12,1).' },
    ],
  },
  {
    id: 'templanza',
    name: 'Templanza',
    vice: 'gula y todo exceso',
    icon: 'drop',
    summary: 'Moderar la atracción de los placeres y usar los bienes con equilibrio.',
    why: 'La adicción vive de «un poco más». Cada pequeño «no» a un placer legítimo (comida, pantalla, comodidad) entrena la voluntad para el «no» que importa.',
    verse: 'Los atletas se privan de todo; ellos, para ganar una corona que se marchita; nosotros, una que no se marchita.',
    source: '1 Cor 9,25',
    catechism: 'Catecismo, n.º 1809',
    actions: [
      { id: 'sacrificio', text: 'Un pequeño sacrificio en la comida', hint: 'Sin azúcar en el café, sin repetir, sin picar.' },
      { id: 'pantalla', text: 'Límite de pantalla', hint: 'Pon un temporizador a las redes.' },
      { id: 'ayuno', text: 'Una hora sin móvil', hint: 'Ayuno digital: déjalo en otra habitación.' },
      { id: 'dormir', text: 'Acostarme a mi hora', hint: 'El cansancio es terreno de la tentación.' },
      { id: 'ducha', text: 'Terminar la ducha con agua fría', hint: 'Un minuto: dominio de uno mismo.' },
      { id: 'compras', text: 'No darme un capricho que podía evitar' },
    ],
  },
  {
    id: 'fortaleza',
    name: 'Fortaleza',
    vice: 'cobardía y desánimo',
    icon: 'shield',
    summary: 'Firmeza en las dificultades y constancia en buscar el bien.',
    why: 'Habrá días duros y quizá caídas. La fortaleza es levantarse siempre, sin pactar con la tentación ni rendirse al «ya da igual».',
    verse: 'Todo lo puedo en aquel que me conforta.',
    source: 'Flp 4,13',
    catechism: 'Catecismo, n.º 1808',
    actions: [
      { id: 'huir', text: 'Huir a la primera, sin dialogar', hint: 'Levántate y cambia de lugar en cuanto notes el impulso.' },
      { id: 'ejercicio', text: '20 minutos de ejercicio', hint: 'El cuerpo entrenado ayuda a la voluntad.' },
      { id: 'dificil', text: 'Hacer primero lo que más me cuesta' },
      { id: 'levantarse', text: 'Levantarme a la primera', hint: 'Sin «cinco minutos más».' },
      { id: 'pedir', text: 'Pedir ayuda cuando la necesito', hint: 'Escribir a mi compañero de camino.' },
      { id: 'perseverar', text: 'Rezar aunque no tenga ganas' },
    ],
  },
  {
    id: 'humildad',
    name: 'Humildad',
    vice: 'soberbia',
    icon: 'pray',
    summary: 'Verse con verdad: todo lo bueno es don de Dios, y sin Él no podemos nada.',
    why: 'La soberbia dice «yo puedo solo» y «a mí no me pasará». La humildad reconoce la debilidad, pide ayuda y confía en la gracia: así se vence.',
    verse: 'Dios resiste a los soberbios y da su gracia a los humildes.',
    source: '1 Pe 5,5',
    catechism: 'Catecismo, n.º 2559',
    actions: [
      { id: 'debilidad', text: 'Reconocer mi debilidad ante Dios', hint: '«Señor, sin ti no puedo».' },
      { id: 'contar', text: 'Contar mi lucha a mi compañero o director', hint: 'La vergüenza crece en el secreto.' },
      { id: 'perdon', text: 'Pedir perdón a alguien' },
      { id: 'servir', text: 'Un servicio escondido', hint: 'Algo bueno que nadie vea.' },
      { id: 'escuchar', text: 'Escuchar sin interrumpir' },
      { id: 'gracias', text: 'Dar gracias por lo bueno del día', hint: 'Todo es don.' },
    ],
  },
  {
    id: 'paciencia',
    name: 'Paciencia y mansedumbre',
    vice: 'ira',
    icon: 'wave',
    summary: 'Soportar con serenidad lo que no depende de mí y responder con calma.',
    why: 'El enfado y la frustración son disparadores frecuentes («HALT»). Quien aprende a esperar el impulso de la ira aprende también a dejar pasar la ola de la tentación.',
    verse: 'Más vale el paciente que el héroe; el dueño de sí, más que el conquistador de ciudades.',
    source: 'Prov 16,32',
    catechism: 'Catecismo, n.º 1832',
    actions: [
      { id: 'respirar', text: 'Respirar antes de responder', hint: 'Diez segundos y una jaculatoria.' },
      { id: 'quejas', text: 'Un día sin quejarme' },
      { id: 'tono', text: 'Hablar con calma en casa' },
      { id: 'contrariedad', text: 'Ofrecer una contrariedad', hint: 'Un atasco, una espera, una molestia.' },
      { id: 'conmigo', text: 'Ser paciente conmigo tras un fallo', hint: 'Sin castigarme: volver a empezar.' },
      { id: 'rezar', text: 'Rezar por quien me irrita' },
    ],
  },
  {
    id: 'caridad',
    name: 'Caridad',
    vice: 'envidia',
    icon: 'people',
    summary: 'Amar a Dios sobre todas las cosas y al prójimo como a uno mismo.',
    why: 'La adicción encierra en uno mismo y aísla. La caridad saca de ese encierro: quien se da a los demás encuentra la alegría que la pantalla prometía y no daba.',
    verse: 'El amor es paciente, es servicial; el amor no tiene envidia, no presume, no se engríe.',
    source: '1 Cor 13,4',
    catechism: 'Catecismo, n.º 1822-1829',
    actions: [
      { id: 'detalle', text: 'Un detalle con alguien de casa' },
      { id: 'llamar', text: 'Llamar a alguien que está solo' },
      { id: 'alegrarme', text: 'Alegrarme del bien de otro', hint: 'Contra la envidia: felicítale.' },
      { id: 'hablar-bien', text: 'Hablar bien de los ausentes' },
      { id: 'rezar-otro', text: 'Rezar por una persona concreta' },
      { id: 'tiempo', text: 'Dedicar tiempo sin mirar el móvil', hint: 'Presencia de verdad con quien estás.' },
    ],
  },
  {
    id: 'diligencia',
    name: 'Diligencia',
    vice: 'pereza y acedia',
    icon: 'sunrise',
    summary: 'Hacer bien y con amor lo que toca, en el momento que toca.',
    why: 'El aburrimiento y las horas muertas son la puerta más común a la caída. Un día con orden y tareas llenas de sentido deja poco espacio a la tentación.',
    verse: 'Todo lo que hagáis, hacedlo de corazón, como para el Señor y no para los hombres.',
    source: 'Col 3,23',
    catechism: 'Catecismo, n.º 2094 y 2733',
    actions: [
      { id: 'plan', text: 'Planificar el día por la mañana', hint: 'Tres tareas importantes.' },
      { id: 'trabajo', text: 'Trabajar o estudiar sin distracciones', hint: 'Bloques de 45 minutos con el móvil lejos.' },
      { id: 'ofrecer-trabajo', text: 'Ofrecer el trabajo a Dios' },
      { id: 'ocio', text: 'Ocio sano planeado', hint: 'Deporte, lectura, amigos: no dejar huecos vacíos.' },
      { id: 'terminar', text: 'Terminar lo que empiezo' },
      { id: 'oracion', text: 'Mi rato de oración a su hora', hint: 'Aunque sean 10 minutos.' },
    ],
  },
  {
    id: 'generosidad',
    name: 'Generosidad',
    vice: 'avaricia',
    icon: 'sprout',
    summary: 'Dar con alegría: tiempo, bienes y atención, sin apegarse a nada.',
    why: 'La adicción es querer para mí, ya, sin dar nada a cambio. La generosidad invierte esa lógica y libera el corazón del apego.',
    verse: 'Hay más dicha en dar que en recibir.',
    source: 'Hch 20,35',
    catechism: 'Catecismo, n.º 2544-2547',
    actions: [
      { id: 'limosna', text: 'Dar una limosna', hint: 'A alguien que lo necesita o a tu parroquia.' },
      { id: 'tiempo-otros', text: 'Regalar mi tiempo a alguien' },
      { id: 'desprenderme', text: 'Desprenderme de algo que no necesito' },
      { id: 'compartir', text: 'Compartir algo mío' },
      { id: 'voluntariado', text: 'Buscar un voluntariado', hint: 'Cáritas, comedor social, visitas a mayores.' },
      { id: 'sonrisa', text: 'Dar lo mejor de mí, también el buen humor' },
    ],
  },
];

export const virtueById = (id: string) => VIRTUES.find((v) => v.id === id);
