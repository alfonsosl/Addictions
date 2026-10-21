// Reflexiones diarias. Las citas bíblicas siguen traducciones castellanas habituales
// (pueden variar ligeramente según la edición). Revisa con tu Biblia.

export type Reflection = {
  id: string;
  title: string;
  quote: string;
  source: string;
  body: string;
  action: string; // propósito concreto del día
};

export const REFLECTIONS: Reflection[] = [
  {
    id: 'limpios',
    title: 'Verán a Dios',
    quote: 'Bienaventurados los limpios de corazón, porque ellos verán a Dios.',
    source: 'Mt 5,8',
    body:
      'La pureza no es una lista de prohibiciones: es una promesa. Jesús no dice “bienaventurados los que nunca fallan”, ' +
      'sino los limpios de corazón, los que dejan que Él limpie su mirada. La pornografía enseña a mirar a las personas como objetos; ' +
      'la pureza te devuelve la capacidad de ver a cada persona —y a Dios— tal como es.',
    action: 'Hoy, cuando mires a alguien, piensa: “Es un hijo/hija de Dios, amado por Él”.',
  },
  {
    id: 'salida',
    title: 'Siempre hay salida',
    quote: 'Fiel es Dios, que no permitirá que seáis tentados por encima de vuestras fuerzas; al contrario, con la tentación os dará también la salida.',
    source: '1 Cor 10,13',
    body:
      'Ninguna tentación es invencible. Dios no promete que no habrá tentación, sino que siempre habrá una puerta. ' +
      'A menudo la salida es muy concreta: levantarte, salir de la habitación, llamar a alguien, dejar el móvil. ' +
      'La salida casi nunca está en “aguantar mirando”: está en moverse.',
    action: 'Identifica tu “puerta de salida” para esta noche y escríbela en tus planes “si… entonces…”.',
  },
  {
    id: 'templo',
    title: 'Templo del Espíritu',
    quote: '¿No sabéis que vuestro cuerpo es templo del Espíritu Santo, que habita en vosotros? … Glorificad, pues, a Dios con vuestro cuerpo.',
    source: '1 Cor 6,19-20',
    body:
      'Tu cuerpo no es un enemigo ni algo sucio. Es tan valioso que Dios ha querido habitar en él. ' +
      'Por eso merece cuidado: dormir bien, hacer ejercicio, comer con orden. Cuidar el cuerpo es también una forma de oración ' +
      'y una de las mejores defensas contra la tentación.',
    action: 'Haz hoy 20 minutos de ejercicio y acuéstate a una hora razonable, sin el móvil.',
  },
  {
    id: 'gracia',
    title: 'Te basta mi gracia',
    quote: 'Te basta mi gracia, porque mi fuerza se realiza en la debilidad.',
    source: '2 Cor 12,9',
    body:
      'Pablo pidió tres veces que se le quitara su “aguijón”. Dios no se lo quitó: le dio su gracia. ' +
      'Quizá te frustre no estar ya “curado”. Pero la lucha diaria, humilde, es precisamente el lugar donde Dios actúa. ' +
      'No luchas para que Él te quiera: luchas porque ya te quiere.',
    action: 'Di hoy, en tu momento más débil: “Señor, te basta mi debilidad para mostrar tu fuerza”.',
  },
  {
    id: 'prodigo',
    title: 'Todavía estaba lejos',
    quote: 'Cuando todavía estaba lejos, su padre lo vio y se conmovió; y, echando a correr, se le echó al cuello y lo cubrió de besos.',
    source: 'Lc 15,20',
    body:
      'El hijo pródigo había preparado un discurso de vergüenza. El padre ni lo deja terminar. ' +
      'Así es Dios contigo después de cada caída. La vergüenza te dice “escóndete”; el Padre te dice “vuelve”. ' +
      'La confesión no es un tribunal: es ese abrazo.',
    action: 'Si has caído, busca hoy horario de confesiones en tu parroquia. Si no, reza por quien esté lejos.',
  },
  {
    id: 'velad',
    title: 'Velad y orad',
    quote: 'Velad y orad para no caer en tentación; el espíritu está pronto, pero la carne es débil.',
    source: 'Mt 26,41',
    body:
      'Jesús une dos cosas: velar (estar atento, prevenir) y orar (pedir ayuda). La mayoría de las caídas no empiezan con la pornografía, ' +
      'sino mucho antes: cansancio, soledad, aburrimiento, el móvil en la cama. Velar es reconocer esas señales a tiempo.',
    action: 'Esta noche deja el móvil cargando fuera del dormitorio.',
  },
  {
    id: 'jose',
    title: 'José huyó',
    quote: 'Él, dejando el manto en sus manos, salió huyendo afuera.',
    source: 'Gn 39,12',
    body:
      'José, el hijo de Jacob, no se quedó a dialogar con la tentación: huyó, aunque perdiera el manto. ' +
      'En esta lucha, huir no es de cobardes; es de sabios. San Pablo lo repite: “Huid de la fornicación” (1 Cor 6,18). ' +
      'La victoria se gana en los primeros segundos.',
    action: 'Cuando notes el primer impulso, aplica la regla de los 3 segundos: levántate y cambia de lugar.',
  },
  {
    id: 'david',
    title: 'Una mirada que se detuvo',
    quote: 'Una tarde, David se levantó de su lecho y se paseaba por la terraza… y vio desde allí a una mujer que se estaba bañando.',
    source: '2 Sam 11,2',
    body:
      'David estaba ocioso, en casa, cuando debía estar con su ejército. Vio, y siguió mirando. ' +
      'El pecado grave empezó con una mirada que se detuvo y una ociosidad que no se vigiló. ' +
      'Pero David también nos dejó el Salmo 51: después de caer, se puede volver a Dios con un corazón quebrantado.',
    action: 'Planifica las horas “vacías” de hoy (tarde, noche): ¿qué harás exactamente?',
  },
  {
    id: 'corazon-puro',
    title: 'Crea en mí un corazón puro',
    quote: 'Oh Dios, crea en mí un corazón puro, renuévame por dentro con espíritu firme.',
    source: 'Sal 51,12',
    body:
      '“Crea” es el mismo verbo del Génesis: solo Dios crea. La pureza no es solo fruto de tu esfuerzo; es obra de Dios en ti. ' +
      'Tú pones la disponibilidad, la lucha y los medios; Él pone el corazón nuevo.',
    action: 'Reza el Salmo 51 entero hoy, despacio.',
  },
  {
    id: 'no-hago',
    title: 'El bien que quiero',
    quote: 'No hago el bien que quiero, sino que obro el mal que no quiero.',
    source: 'Rom 7,19',
    body:
      'Si te reconoces en estas palabras, estás en buena compañía: las escribió san Pablo. ' +
      'La adicción tiene una parte que escapa a la voluntad; por eso no basta con “querer más fuerte”. ' +
      'Hacen falta medios: oración, sacramentos, compañía, hábitos y, si es necesario, ayuda profesional.',
    action: 'Elige hoy un medio nuevo que no estés usando (un compañero, un filtro, un horario).',
  },
  {
    id: 'pensadlo',
    title: 'Todo lo que es puro',
    quote: 'Todo lo que es verdadero, noble, justo, puro, amable, laudable… tenedlo en cuenta.',
    source: 'Flp 4,8',
    body:
      'No basta con vaciar la mente; hay que llenarla. La mente que se queda vacía y aburrida vuelve a lo de siempre. ' +
      'Llena tus horas con cosas buenas: un buen libro, música, deporte, amigos, servicio a otros, un proyecto creativo.',
    action: 'Apunta tres actividades buenas que te gusten para usarlas cuando estés aburrido.',
  },
  {
    id: 'no-te-condeno',
    title: 'Tampoco yo te condeno',
    quote: 'Tampoco yo te condeno. Anda, y en adelante no peques más.',
    source: 'Jn 8,11',
    body:
      'Jesús dice dos cosas a la vez, y las dos importan. Primero: no te condeno. Después: no peques más. ' +
      'La misericordia no rebaja la exigencia; la hace posible. Sin la primera frase, la segunda aplasta; sin la segunda, la primera no libera.',
    action: 'Perdónate hoy algo que todavía te pesa, y da un paso concreto hacia adelante.',
  },
  {
    id: 'inquieto',
    title: 'Corazón inquieto',
    quote: 'Nos hiciste, Señor, para ti, y nuestro corazón está inquieto hasta que descanse en ti.',
    source: 'San Agustín, Confesiones I,1',
    body:
      'Agustín conoció bien la esclavitud de la carne y luchó años antes de ser libre. Descubrió que detrás de cada búsqueda desordenada ' +
      'hay una sed de amor infinito que nada creado puede llenar. La pornografía promete ese descanso y deja más vacío. Solo Dios sacia.',
    action: 'Cuando sientas el vacío, dilo en voz alta: “Señor, lo que de verdad busco eres Tú”.',
  },
  {
    id: 'cuerpo-teologia',
    title: 'El cuerpo revela',
    quote: 'El cuerpo, y solo él, es capaz de hacer visible lo que es invisible: lo espiritual y lo divino.',
    source: 'San Juan Pablo II, Teología del Cuerpo (20-II-1980)',
    body:
      'La Iglesia no desprecia la sexualidad: la considera tan grande que no puede reducirse a consumo. ' +
      'El Catecismo define la castidad como “la integración lograda de la sexualidad en la persona” (CIC 2337). ' +
      'No es represión: es unidad interior, ser dueño de ti para poder entregarte de verdad.',
    action: 'Lee los números 2337-2347 del Catecismo sobre la castidad.',
  },
  {
    id: 'dominio',
    title: 'Obra de toda una vida',
    quote: 'El dominio de sí es una obra que dura toda la vida.',
    source: 'Catecismo de la Iglesia Católica, 2342',
    body:
      'El Catecismo es realista: la castidad no se conquista de una vez para siempre, y supone un esfuerzo reiterado en todas las edades. ' +
      'Eso libera de la presión de la perfección inmediata. No tienes que ganar la guerra hoy: solo este día, esta batalla.',
    action: 'Hoy concéntrate solo en las próximas 24 horas. Mañana será otro día.',
  },
  {
    id: 'dos-mejor',
    title: 'Si uno cae, el otro lo levanta',
    quote: 'Mejor dos que uno solo… Si uno cae, lo levanta su compañero. ¡Ay del que está solo y cae, sin tener quien lo levante!',
    source: 'Ecl 4,9-10',
    body:
      'La adicción crece en el secreto y se debilita a la luz. Tener a alguien de confianza —un amigo, tu director espiritual, ' +
      'un grupo de apoyo— a quien contar tus luchas es uno de los medios más eficaces. No es un fracaso pedir ayuda: es sabiduría.',
    action: 'Escribe hoy a la persona de confianza que tengas configurada (o elige una).',
  },
  {
    id: 'libres',
    title: 'Para la libertad',
    quote: 'Para la libertad nos ha liberado Cristo. Manteneos, pues, firmes, y no os dejéis someter de nuevo al yugo de la esclavitud.',
    source: 'Gál 5,1',
    body:
      'La meta no es solo “no ver”. La meta es la libertad: poder mirar, amar, descansar y trabajar sin una cadena. ' +
      'Cada día limpio es un día de libertad recuperada. Lo que estás haciendo vale la pena.',
    action: 'Escribe una cosa que has recuperado (tiempo, paz, relaciones) desde que empezaste.',
  },
  {
    id: 'resistid',
    title: 'Resistid y huirá',
    quote: 'Someteos, pues, a Dios; resistid al diablo y huirá de vosotros. Acercaos a Dios y él se acercará a vosotros.',
    source: 'Sant 4,7-8',
    body:
      'La tentación es como una ola: sube, llega a un pico y baja. Si no la alimentas, pasa. ' +
      'Mientras resistes, acércate a Dios: una jaculatoria, un Avemaría, una mirada al crucifijo. Él se acerca a quien se acerca.',
    action: 'Usa hoy el botón de pánico la primera vez que notes un impulso, aunque sea pequeño.',
  },
  {
    id: 'renovacion',
    title: 'Renovad la mente',
    quote: 'No os amoldéis a este mundo, sino transformaos por la renovación de la mente.',
    source: 'Rom 12,2',
    body:
      'El hábito de la pornografía ha entrenado tu mente durante mucho tiempo; desentrenarla también lleva tiempo. ' +
      'Cada vez que eliges no mirar, refuerzas un camino nuevo. Es lento, pero es real: la mente se renueva con la repetición.',
    action: 'Revisa tus redes: deja de seguir cuentas que te provocan.',
  },
  {
    id: 'puerta',
    title: 'El pecado acecha a la puerta',
    quote: 'El pecado acecha a la puerta y te codicia, pero tú debes dominarlo.',
    source: 'Gn 4,7',
    body:
      'Dios advierte a Caín antes de que caiga: hay una puerta y hay alguien que espera. ' +
      'Tú conoces tus puertas: la cama con el móvil, la navegación sin rumbo, la soledad del domingo por la noche. ' +
      'Cierra la puerta antes de que llamen.',
    action: 'Instala o revisa un filtro de contenidos en tus dispositivos.',
  },
  {
    id: 'misericordia',
    title: 'Nueva cada mañana',
    quote: 'La misericordia del Señor no termina, no se acaba su compasión: se renueva cada mañana.',
    source: 'Lam 3,22-23',
    body:
      'Da igual cómo fue ayer. Hoy, al despertar, la misericordia de Dios ya está ahí, intacta. ' +
      'Empieza cada mañana ofreciendo el día antes de mirar el móvil. Los primeros minutos marcan el tono de la jornada.',
    action: 'Mañana, antes de tocar el móvil, reza el ofrecimiento de obras.',
  },
];

export function reflectionForDate(d: Date): Reflection {
  const startOfYear = new Date(d.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((d.getTime() - startOfYear.getTime()) / 86_400_000);
  return REFLECTIONS[dayOfYear % REFLECTIONS.length];
}
