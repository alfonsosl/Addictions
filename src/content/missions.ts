// "Regla de vida" diaria: misiones que suman talentos.

export type Mission = { id: string; icon: string; title: string; hint: string; reward: number };

export const MISSIONS: Mission[] = [
  { id: 'ofrecimiento', icon: '🌄', title: 'Ofrecimiento de la mañana', hint: 'Antes de mirar el móvil.', reward: 5 },
  { id: 'evangelio', icon: '📖', title: 'Leer el Evangelio del día', hint: 'Pestaña Evangelio.', reward: 5 },
  { id: 'rosario', icon: '📿', title: 'Rosario o una decena', hint: 'Pide a María la pureza.', reward: 5 },
  { id: 'ejercicio', icon: '🏃', title: '20 min de ejercicio', hint: 'Cuida el templo del Espíritu.', reward: 5 },
  { id: 'contacto', icon: '🤝', title: 'Hablar con tu compañero', hint: 'Un mensaje basta: “Hoy bien”.', reward: 5 },
  { id: 'movil', icon: '📵', title: 'Móvil fuera del dormitorio', hint: 'Cierra la puerta principal.', reward: 5 },
  { id: 'examen', icon: '🌙', title: 'Examen de conciencia', hint: 'Antes de dormir, 5 minutos.', reward: 5 },
];
