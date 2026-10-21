export type Prayer = { id: string; title: string; text: string; when: string };

export const PRAYERS: Prayer[] = [
  {
    id: 'jaculatorias',
    title: 'Jaculatorias para el momento de la tentación',
    when: 'Repítelas despacio, en voz baja, mientras te levantas y cambias de lugar.',
    text:
      'Jesús, en ti confío.\n' +
      'Señor Jesucristo, Hijo de Dios, ten piedad de mí, pecador.\n' +
      'Oh Dios, crea en mí un corazón puro (Sal 51,12).\n' +
      'Madre mía, no me dejes.\n' +
      'San José, custodio de la pureza, ruega por mí.',
  },
  {
    id: 'san-miguel',
    title: 'Oración a San Miguel Arcángel',
    when: 'Compuesta por León XIII. Para la lucha espiritual.',
    text:
      'San Miguel Arcángel, defiéndenos en la lucha; sé nuestro amparo contra la perversidad y asechanzas del demonio. ' +
      'Que Dios manifieste sobre él su poder, es nuestra humilde súplica. Y tú, Príncipe de la Milicia Celestial, ' +
      'con el poder que Dios te ha conferido, arroja al infierno a Satanás y a los demás espíritus malignos ' +
      'que vagan por el mundo para la perdición de las almas. Amén.',
  },
  {
    id: 'bendita-pureza',
    title: 'Bendita sea tu pureza',
    when: 'Oración mariana tradicional por la pureza. Ideal al levantarte y al acostarte.',
    text:
      'Bendita sea tu pureza y eternamente lo sea, pues todo un Dios se recrea en tan graciosa belleza. ' +
      'A ti, celestial Princesa, Virgen sagrada María, yo te ofrezco en este día alma, vida y corazón. ' +
      'Mírame con compasión, no me dejes, Madre mía. Amén.',
  },
  {
    id: 'ave-maria',
    title: 'Avemaría',
    when: 'Si no puedes rezar otra cosa, reza un Avemaría tras otro.',
    text:
      'Dios te salve, María, llena eres de gracia, el Señor es contigo. Bendita tú eres entre todas las mujeres, ' +
      'y bendito es el fruto de tu vientre, Jesús. Santa María, Madre de Dios, ruega por nosotros, pecadores, ' +
      'ahora y en la hora de nuestra muerte. Amén.',
  },
  {
    id: 'anima-christi',
    title: 'Alma de Cristo (Anima Christi)',
    when: 'Para después de comulgar o en cualquier momento de debilidad.',
    text:
      'Alma de Cristo, santifícame. Cuerpo de Cristo, sálvame. Sangre de Cristo, embriágame. ' +
      'Agua del costado de Cristo, lávame. Pasión de Cristo, confórtame. ¡Oh buen Jesús, óyeme! ' +
      'Dentro de tus llagas, escóndeme. No permitas que me aparte de ti. Del maligno enemigo, defiéndeme. ' +
      'En la hora de mi muerte, llámame, y mándame ir a ti, para que con tus santos te alabe, ' +
      'por los siglos de los siglos. Amén.',
  },
  {
    id: 'ofrecimiento',
    title: 'Ofrecimiento de obras (mañana)',
    when: 'Al despertar, antes de mirar el móvil.',
    text:
      'Señor, te ofrezco este día: mis pensamientos, palabras, obras, alegrías y sufrimientos. ' +
      'Guarda mis ojos y mi corazón. Que todo lo que haga hoy sea para tu gloria y el bien de los demás. ' +
      'María, Madre mía, cúbreme con tu manto. Amén.',
  },
  {
    id: 'contricion',
    title: 'Acto de contrición',
    when: 'Tras una caída: antes de dormir, y mientras buscas confesarte.',
    text:
      'Señor mío Jesucristo, Dios y hombre verdadero, Creador, Padre y Redentor mío; por ser tú quien eres, ' +
      'Bondad infinita, y porque te amo sobre todas las cosas, me pesa de todo corazón haberte ofendido. ' +
      'Propongo firmemente nunca más pecar, apartarme de todas las ocasiones de ofenderte, confesarme ' +
      'y cumplir la penitencia que me fuere impuesta. Confío en que me perdonarás por tu infinita misericordia. Amén.',
  },
];

/** Examen de conciencia ignaciano, versión breve (5 pasos). */
export const EXAMEN_STEPS = [
  { title: '1. Presencia', text: 'Ponte en presencia de Dios. Pide luz al Espíritu Santo para ver tu día con sus ojos.' },
  { title: '2. Gratitud', text: 'Da gracias por tres cosas concretas de hoy, por pequeñas que sean.' },
  { title: '3. Revisión', text: '¿Dónde estuvo Dios hoy? ¿En qué momentos me sentí débil, solo, cansado o tentado? ¿Por qué?' },
  { title: '4. Perdón', text: 'Pide perdón con confianza por lo que no estuvo bien. Él no se cansa de perdonar.' },
  { title: '5. Propósito', text: 'Un propósito concreto y pequeño para mañana (“si me pasa X, haré Y”).' },
];

/** Pasos de la Lectio Divina para orar con el Evangelio del día. */
export const LECTIO_STEPS = [
  { title: 'Lectio', text: 'Lee despacio el Evangelio. ¿Qué dice el texto?' },
  { title: 'Meditatio', text: '¿Qué me dice a mí hoy? Quédate con una frase.' },
  { title: 'Oratio', text: '¿Qué le digo yo a Dios? Háblale con sinceridad.' },
  { title: 'Contemplatio', text: 'Quédate en silencio un minuto, mirándole.' },
  { title: 'Actio', text: '¿A qué me compromete hoy? Un gesto concreto.' },
];
