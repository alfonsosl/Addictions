// Examen de conciencia nocturno, basado en el examen ignaciano (San Ignacio de Loyola, Ejercicios Espirituales, n.º 43)
// y en las preguntas habituales de preparación a la confesión, adaptado a la lucha por la pureza.

export const EXAMEN_PREP = [
  'Busca un sitio tranquilo y, si puedes, deja el móvil en modo avión al terminar.',
  'Haz despacio la señal de la cruz.',
  'Respira hondo tres veces: estás en presencia de Dios, que te mira con amor.',
];

export const EXAMEN_LIGHT_PRAYER =
  'Ven, Espíritu Santo, ilumina mi mente y mi corazón. Ayúdame a ver mi día como Tú lo ves: con verdad y con misericordia. Muéstrame dónde has estado conmigo y dónde no te he dejado entrar. Amén.';

export const REVIEW_PROMPTS = [
  { icon: '🌅', title: 'La mañana', text: '¿Cómo me levanté? ¿Ofrecí el día? ¿Qué pasó en las primeras horas?' },
  { icon: '☀️', title: 'La tarde', text: 'Trabajo, estudio, personas con las que hablé. ¿Dónde sentí paz? ¿Dónde inquietud?' },
  { icon: '🌆', title: 'La noche', text: '¿Cómo usé el tiempo libre y las pantallas? ¿Cómo llego ahora a la cama?' },
];

/** Estados de riesgo del día (HALT ampliado). */
export const HALT_OPTIONS = ['Hambre', 'Enfado', 'Soledad', 'Cansancio', 'Aburrimiento', 'Estrés', 'Tristeza', 'Ansiedad'];

export type ExamenArea = { id: string; title: string; icon: string; questions: { id: string; text: string }[] };

export const EXAMEN_AREAS: ExamenArea[] = [
  {
    id: 'dios',
    title: 'Con Dios',
    icon: '✝️',
    questions: [
      { id: 'd1', text: '¿He rezado hoy, aunque fuera poco? ¿He ofrecido el día?' },
      { id: 'd2', text: '¿He confiado en Dios en la tentación, o he querido luchar solo?' },
      { id: 'd3', text: '¿He puesto algo (el móvil, el placer, la comodidad) por delante de Él?' },
    ],
  },
  {
    id: 'pureza',
    title: 'Pureza y custodia del corazón',
    icon: '🤍',
    questions: [
      { id: 'p1', text: '¿He custodiado la mirada en la calle, en redes, series o internet?' },
      { id: 'p2', text: '¿Me he expuesto a ocasiones que podía evitar (móvil en la cama, horas muertas, ciertas webs o apps)?' },
      { id: 'p3', text: '¿He dialogado con la tentación en lugar de huir enseguida?' },
      { id: 'p4', text: '¿He consentido pensamientos o imágenes impuras?' },
    ],
  },
  {
    id: 'projimo',
    title: 'Con los demás',
    icon: '🤝',
    questions: [
      { id: 'o1', text: '¿He mirado y tratado a las personas como personas, nunca como objetos?' },
      { id: 'o2', text: '¿He sido paciente y amable en casa, en el trabajo, con los amigos?' },
      { id: 'o3', text: '¿He criticado, mentido o guardado rencor?' },
      { id: 'o4', text: '¿He sido sincero con mi compañero de camino o me he aislado?' },
    ],
  },
  {
    id: 'yo',
    title: 'Conmigo mismo',
    icon: '🌱',
    questions: [
      { id: 'y1', text: '¿He cumplido mis deberes (trabajo, estudio) o me he dejado llevar por la pereza?' },
      { id: 'y2', text: '¿He cuidado el cuerpo: descanso, comida, ejercicio?' },
      { id: 'y3', text: '¿Me he tratado con dureza o desesperanza en lugar de con la mirada de Dios?' },
    ],
  },
];

export const CONTRITION_ACT =
  'Señor mío Jesucristo, Dios y hombre verdadero, Creador, Padre y Redentor mío; por ser Vos quien sois, bondad infinita, y porque os amo sobre todas las cosas, me pesa de todo corazón haberos ofendido. También me pesa porque podéis castigarme con las penas del infierno. Ayudado de vuestra divina gracia, propongo firmemente nunca más pecar, confesarme y cumplir la penitencia que me fuere impuesta. Amén.';

export const SHORT_CONTRITION = 'Jesús, Hijo de Dios, ten compasión de mí, que soy un pecador.';

export const RESOLUTION_IDEAS = [
  'Mañana, al despertar, ofreceré el día antes de mirar el móvil.',
  'Si me siento solo, entonces escribiré a mi compañero de camino.',
  'Si estoy cansado por la noche, entonces dejaré el móvil fuera del dormitorio.',
  'Rezaré un misterio del Rosario a media tarde.',
  'Buscaré confesarme esta semana.',
];

export const SLEEP_CHECKLIST = [
  { id: 'movil', text: 'El móvil fuera del dormitorio o lejos de la cama' },
  { id: 'alarma', text: 'Alarma puesta para no empezar el día con prisas' },
  { id: 'luz', text: 'Pantallas apagadas y luz baja' },
  { id: 'agua', text: 'Agua bendita o una señal de la cruz antes de acostarme' },
];

export const NIGHT_PRAYERS = [
  {
    title: 'Bajo tu amparo',
    text: 'Bajo tu amparo nos acogemos, santa Madre de Dios; no deseches las súplicas que te dirigimos en nuestras necesidades, antes bien, líbranos de todo peligro, ¡oh Virgen gloriosa y bendita!',
  },
  {
    title: 'Jaculatoria antes de dormir',
    text: 'Jesús, José y María, os doy el corazón y el alma mía. Jesús, José y María, asistidme en mi última agonía. Jesús, José y María, con vos descanse en paz el alma mía.',
  },
  { title: 'Encomienda', text: 'En tus manos, Señor, encomiendo mi espíritu (Sal 31,6; Lc 23,46).' },
];

export const EXAMEN_STEP_TITLES = ['Presencia', 'Gratitud', 'Repaso', 'Examen', 'Perdón', 'Propósito', 'Descanso'];
