// Reflexiones a partir de palabras de sacerdotes, obispos y papas.
// Las citas son breves y llevan su fuente (derecho de cita); el comentario y el propósito son propios de la app.
// Cada cita se ha contrastado en internet (oct. 2026); "note" indica cuando la atribución es tradicional.

export type PriestReflection = {
  id: string;
  author: string;
  role: string;
  quote: string;
  source: string;
  url: string;
  note?: string;
  body: string;
  action: string;
};

export const PRIEST_REFLECTIONS: PriestReflection[] = [
  {
    id: 'agustin',
    author: 'San Agustín',
    role: 'Obispo de Hipona y Doctor de la Iglesia',
    quote: 'Da lo que mandas y manda lo que quieras.',
    source: 'Confesiones, X, 29',
    url: 'https://www.cervantesvirtual.com/obra-visor/confesiones--0/html/?indice=1',
    body:
      'Agustín escribe esta oración justo cuando habla de la continencia. Había vivido años atrapado por la carne y sabía que no podía ' +
      'liberarse solo. No pide a Dios que rebaje la exigencia: le pide la fuerza para cumplirla. La pureza es un don que se pide.',
    action: 'Repite hoy varias veces: «Señor, dame lo que me pides».',
  },
  {
    id: 'escriva',
    author: 'San Josemaría Escrivá',
    role: 'Sacerdote, fundador del Opus Dei',
    quote: 'No tengas la cobardía de ser «valiente»: ¡huye!',
    source: 'Camino, capítulo «Santa pureza»',
    url: 'https://opusdei.org/es-cr/page/camino/',
    body:
      'En esta lucha el valiente no es el que se queda a ver si aguanta, sino el que se va. Quedarse «a probar» es orgullo; ' +
      'huir es humildad y realismo. Cada vez que te levantas y sales de la habitación, estás ganando.',
    action: 'Al primer impulso, sal del lugar donde estás. Sin negociar.',
  },
  {
    id: 'francisco-perdon',
    author: 'Papa Francisco',
    role: 'Obispo de Roma',
    quote: 'Dios no se cansa nunca de perdonar, somos nosotros los que nos cansamos de acudir a su misericordia.',
    source: 'Exhortación Evangelii Gaudium, n. 3 (2013)',
    url: 'https://www.vatican.va/content/francesco/es/apost_exhortations/documents/papa-francesco_esortazione-ap_20131124_evangelii-gaudium.html',
    body:
      'Después de muchas caídas aparece la tentación más peligrosa: «Dios ya estará harto de mí». Es mentira. ' +
      'El que se cansa eres tú, no Él. Volver a la confesión una y otra vez no es hipocresía: es fe en su misericordia.',
    action: 'Si tienes algo pendiente, busca hoy cuándo puedes confesarte.',
  },
  {
    id: 'francisco-porno',
    author: 'Papa Francisco',
    role: 'Obispo de Roma',
    quote: 'El corazón puro, el que recibe a Jesús cada día, no puede recibir esta información pornográfica.',
    source: 'Encuentro con seminaristas y sacerdotes en Roma, 24-X-2022 (según ACI Prensa)',
    url: 'https://www.aciprensa.com/noticias/96389/el-papa-francisco-advierte-a-sacerdotes-sobre-la-pornografia-el-diablo-entra-por-ahi',
    body:
      'El Papa habló con claridad a seminaristas y sacerdotes: la pornografía digital es un vicio que tienen muchos, también consagrados, ' +
      'y debilita el corazón. Su consejo fue práctico: borrarla del móvil para no tener la tentación al alcance de la mano.',
    action: 'Revisa hoy tu móvil: borra lo que te hace caer y activa un filtro.',
  },
  {
    id: 'benedicto',
    author: 'Benedicto XVI',
    role: 'Papa',
    quote: '¡No tengáis miedo de Cristo! Él no quita nada, y lo da todo.',
    source: 'Homilía de inicio de pontificado, 24-IV-2005',
    url: 'https://www.vatican.va/content/benedict-xvi/es/homilies/2005/documents/hf_ben-xvi_hom_20050424_inizio-pontificato.html',
    body:
      'Quizá temes que dejar la pornografía sea perder algo. Benedicto XVI, dirigiéndose a los jóvenes, dice lo contrario: ' +
      'quien se entrega a Cristo no pierde nada de lo que hace la vida libre, bella y grande. Lo que dejas es una cadena; lo que recibes es libertad.',
    action: 'Escribe una cosa buena que has ganado desde que empezaste este camino.',
  },
  {
    id: 'jp2',
    author: 'San Juan Pablo II',
    role: 'Papa',
    quote: 'La pureza es gloria del cuerpo humano ante Dios.',
    source: 'Audiencia general, 18-III-1981 (Teología del Cuerpo)',
    url: 'https://www.vatican.va/content/john-paul-ii/es/audiences/1981/documents/hf_jp-ii_aud_19810318.html',
    body:
      'Para Juan Pablo II la pureza no es desprecio del cuerpo, sino su gloria. Comentando que el cuerpo es templo del Espíritu Santo, ' +
      'explica que la pureza permite que Dios sea glorificado en nosotros y en nuestras relaciones. No es una renuncia triste: es dignidad.',
    action: 'Lee 1 Cor 6,12-20 y da gracias a Dios por tu cuerpo.',
  },
  {
    id: 'ligorio',
    author: 'San Alfonso María de Ligorio',
    role: 'Obispo y Doctor de la Iglesia',
    quote: 'Quien ora, se salva; quien no ora, se condena.',
    source: 'Del gran medio de la oración (1759), citado por Benedicto XVI, audiencia 1-VIII-2012',
    url: 'https://www.vatican.va/content/benedict-xvi/es/audiences/2012/documents/hf_ben-xvi_aud_20120801.html',
    body:
      'San Alfonso consideraba este tratado el más útil de sus escritos. Su idea es sencilla: sin oración es casi imposible perseverar; ' +
      'con oración, la gracia llega. En la tentación, la oración no es un adorno: es el arma principal.',
    action: 'Fija hoy un momento concreto de oración (mañana y noche) y cúmplelo.',
  },
  {
    id: 'pio',
    author: 'San Pío de Pietrelcina (Padre Pío)',
    role: 'Sacerdote capuchino',
    quote: 'Ora, espera y no te preocupes.',
    source: 'Frase que repetía a menudo; resume su carta de 1917 a Antonietta Vona',
    url: 'https://www.aciprensa.com/noticias/las-15-frases-mas-emblematicas-del-padre-pio-76725',
    note: 'Atribución tradicional; no hay un texto original con esta redacción exacta.',
    body:
      'La ansiedad es uno de los grandes disparadores. Padre Pío, que pasó horas y horas confesando, proponía un camino sencillo: ' +
      'rezar, confiar y soltar la preocupación. La lucha es seria, pero no se gana con angustia, sino con confianza.',
    action: 'Cuando te agobies hoy, para 1 minuto: un Avemaría y «Jesús, en ti confío».',
  },
];

/** Webs con comentarios diarios del Evangelio escritos por sacerdotes. */
export const PRIEST_SITES = [
  { label: 'evangeli.net — comentario diario de un sacerdote', url: 'https://evangeli.net/evangelio' },
  { label: 'Vatican News — homilías y Evangelio del día', url: 'https://www.vaticannews.va/es/evangelio-de-hoy.html' },
  { label: 'Opus Dei — meditaciones diarias', url: 'https://opusdei.org/es/meditation/' },
];
