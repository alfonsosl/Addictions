// Estrategias con respaldo (psicología de la conducta + tradición espiritual católica).
// "evidence" indica brevemente de dónde viene la recomendación y con qué grado de solidez.

export type Strategy = {
  id: string;
  icon: string;
  title: string;
  summary: string;
  steps: string[];
  evidence: string;
};

export const STRATEGIES: Strategy[] = [
  {
    id: 'halt',
    icon: '🔍',
    title: 'Conoce tus disparadores (HALT)',
    summary: 'Casi todas las caídas empiezan antes: con hambre, enfado, soledad o cansancio.',
    steps: [
      'Antes de un impulso, pregúntate: ¿tengo Hambre, estoy Enfadado, Solo (Lonely) o Cansado (Tired)?',
      'Atiende la necesidad real: come, habla con alguien, sal a caminar, vete a dormir.',
      'Registra tus caídas en la app: verás qué disparadores se repiten.',
    ],
    evidence:
      'HALT es una herramienta clásica de los programas de recuperación. La identificación de situaciones de alto riesgo es la base del modelo de prevención de recaídas (Marlatt y Gordon).',
  },
  {
    id: 'si-entonces',
    icon: '🧭',
    title: 'Planes “si… entonces…”',
    summary: 'Decide de antemano qué harás en tu situación de riesgo.',
    steps: [
      'Escribe frases concretas: “Si estoy solo en la cama con el móvil, entonces lo dejo en el pasillo”.',
      'Que la acción sea inmediata y física (moverte, salir, llamar).',
      'Repasa tus planes cada mañana. Los tienes en Ajustes.',
    ],
    evidence:
      'Las “intenciones de implementación” tienen un efecto medio-alto en el logro de metas según un metaanálisis de 94 estudios (Gollwitzer y Sheeran, 2006).',
  },
  {
    id: 'acceso',
    icon: '🚪',
    title: 'Cierra las puertas (control de estímulos)',
    summary: 'Es más fácil no entrar que salir. Reduce el acceso.',
    steps: [
      'Móvil y portátil fuera del dormitorio por la noche. Usa un despertador normal.',
      'Activa un filtro de contenidos (control parental del sistema, DNS con filtro o apps de rendición de cuentas).',
      'Desactiva la navegación privada y deja de seguir cuentas que te provocan.',
      'Que otra persona tenga las contraseñas del filtro.',
    ],
    evidence:
      'El control de estímulos es una de las técnicas conductuales más consolidadas en el cambio de hábitos: reducir las señales del entorno reduce la conducta.',
  },
  {
    id: 'ola',
    icon: '🌊',
    title: 'Surfea la ola del impulso',
    summary: 'El impulso sube, llega a un pico y baja. Si no lo alimentas, pasa.',
    steps: [
      'Nota el impulso sin juzgarte: “Esto es un impulso, no una orden”.',
      'Respira lento y observa dónde lo sientes en el cuerpo.',
      'Espera 10-15 minutos haciendo otra cosa. Usa el temporizador del botón de pánico.',
    ],
    evidence:
      '“Urge surfing” forma parte de la prevención de recaídas basada en mindfulness (MBRP), con resultados favorables en adicciones a sustancias (Bowen et al., 2014). En pornografía hay menos estudios específicos.',
  },
  {
    id: 'acompanado',
    icon: '🤝',
    title: 'No camines solo',
    summary: 'La adicción vive en el secreto. Ponla a la luz con alguien de confianza.',
    steps: [
      'Elige un compañero de rendición de cuentas (amigo, sacerdote, director espiritual).',
      'Acordad un mensaje breve y regular: “Hoy bien” / “Hoy he tenido lucha”.',
      'Busca un grupo de apoyo (por ejemplo, grupos de 12 pasos para adicción sexual o grupos católicos de tu diócesis).',
    ],
    evidence:
      'El apoyo social y los grupos de ayuda mutua se asocian a mejores resultados en recuperación de adicciones. “¡Ay del que está solo y cae!” (Ecl 4,10).',
  },
  {
    id: 'sacramentos',
    icon: '✝️',
    title: 'Sacramentos y oración diaria',
    summary: 'La gracia no es un extra: es el centro. Medios que la Iglesia recomienda.',
    steps: [
      'Confesión frecuente (por ejemplo, cada 2-4 semanas) y siempre tras una caída grave.',
      'Eucaristía: Misa dominical y, si puedes, algún día entre semana.',
      'Oración diaria: ofrecimiento de obras, Evangelio del día, Rosario o una decena, examen nocturno.',
      'Dirección espiritual con un sacerdote de confianza.',
    ],
    evidence:
      'Recomendaciones constantes de la tradición católica (CIC 2340: “el conocimiento de sí, la práctica de una ascesis adaptada… la obediencia a los mandamientos… y la oración”).',
  },
  {
    id: 'cuerpo',
    icon: '🏃',
    title: 'Cuida el cuerpo: ejercicio y sueño',
    summary: 'Un cuerpo agotado o sedentario es terreno fácil para la tentación.',
    steps: [
      'Ejercicio diario, aunque sean 20 minutos. Sirve también como “salida” en plena tentación.',
      'Horario fijo para acostarte. Sin pantallas los 30-60 minutos previos.',
      'Agua fría en la cara o una ducha en un momento crítico.',
    ],
    evidence:
      'El ejercicio reduce el craving en varias adicciones a sustancias; la evidencia en pornografía es aún limitada. El cansancio es un disparador clásico (HALT).',
  },
  {
    id: 'verguenza',
    icon: '💛',
    title: 'Caer no es volver al principio',
    summary: 'La vergüenza alimenta el ciclo. La misericordia lo rompe.',
    steps: [
      'Tras una caída, no te digas “ya da igual”. Ese pensamiento lleva a más caídas.',
      'Analiza qué pasó (disparador, hora, lugar) y ajusta tu plan.',
      'Acude a la confesión y vuelve a empezar hoy mismo. Tus talentos y tu nivel se conservan.',
    ],
    evidence:
      'El “efecto de violación de la abstinencia” (Marlatt) describe cómo la culpa y el “todo o nada” tras un desliz aumentan el riesgo de recaída completa.',
  },
  {
    id: 'sustituir',
    icon: '🎯',
    title: 'Sustituye, no solo quites',
    summary: 'Llena el hueco con cosas buenas, especialmente en tus horas de riesgo.',
    steps: [
      'Ten una lista de 5 actividades que te gusten y estén a mano (deporte, música, lectura, cocinar, llamar a un amigo).',
      'Sirve a otros: voluntariado, ayudar en casa, tu parroquia.',
      'Busca un proyecto que te ilusione: da propósito y ocupa la mente.',
    ],
    evidence:
      'La activación conductual y el refuerzo de actividades alternativas son componentes habituales de los tratamientos de adicciones.',
  },
  {
    id: 'profesional',
    icon: '🩺',
    title: 'Pide ayuda profesional si la necesitas',
    summary: 'Esta app acompaña, pero no sustituye a un psicólogo ni a un sacerdote.',
    steps: [
      'Si sientes que no puedes parar pese a intentarlo mucho, consulta con un psicólogo especializado en conductas compulsivas.',
      'Si hay depresión, ansiedad intensa o ideas de hacerte daño, pide ayuda ya. En España: 024 (línea de atención a la conducta suicida) o 112 en emergencias.',
      'Fe y psicología no se oponen: la gracia actúa también a través de buenos profesionales.',
    ],
    evidence:
      'La OMS incluye el “trastorno de conducta sexual compulsiva” en la CIE-11 (6C72). Existen tratamientos psicológicos específicos.',
  },
];

export const TRIGGERS = [
  'Soledad',
  'Cansancio',
  'Aburrimiento',
  'Estrés',
  'Enfado',
  'Tristeza',
  'Móvil en la cama',
  'Redes sociales',
  'Noche',
  'Alcohol',
  'Discusión',
  'Rechazo',
];
