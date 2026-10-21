# Vigilia

App móvil (iOS / Android, también web) para ayudar a dejar la pornografía desde la fe católica.

> «Velad y orad para no caer en tentación; el espíritu está pronto, pero la carne es débil.» (Mt 26,41)

## Funcionalidades

| Pantalla | Qué hace |
|---|---|
| **Inicio** | Contador de días/horas en libertad, mejor racha, nivel, próxima insignia, reflexión del día, «mi porqué» y acceso a «He caído». |
| **🆘 Botón de pánico** | Flujo de 5 pasos: respiración cuadrada 4-4-4-4 animada → oración (jaculatorias, San Miguel) → acciones físicas de huida + planes «si… entonces…» + llamar/SMS al compañero → recordar tu porqué y tus días → temporizador de 10 min «surfea la ola». «He vencido» suma talentos. |
| **Lecturas** | Lecturas del día del calendario litúrgico (1ª lectura, salmo, 2ª lectura, Evangelio), navegación por días, caché local, enlaces a Vatican News / Evangelizo / evangeli.net y guía de Lectio Divina. |
| **Camino** | Regla de vida diaria (7 misiones), examen de conciencia ignaciano, estadísticas, 10 insignias por racha, 8 niveles y disparadores más frecuentes. |
| **Arsenal** | 10 estrategias con su fundamento, 7 oraciones y 21 reflexiones bíblicas. |
| **Caída** | Sin culpa: el hijo pródigo, análisis de disparadores (HALT), acto de contrición, buscar confesión y registrar la confesión (+talentos). |
| **Ajustes** | Nombre, porqué, compañero de camino, planes «si… entonces…» y borrado de datos. |

### Mecánica de juego

- **Talentos** (Mt 25,14-30): +10 por día limpio, +20 por tentación vencida, +5 por misión, +15 por completar la regla de vida, +10 por lecturas, +10 por examen, +30 por confesión.
- **Niveles** por talentos acumulados: Catecúmeno → Peregrino → Discípulo → Centinela → Custodio del corazón → Miles Christi → Testigo → Apóstol de la pureza.
- **Insignias** por la mejor racha: 1, 3, 7, 14, 30, 40, 66, 90, 180 y 365 días.
- **Una caída reinicia la racha, nunca los talentos ni el nivel.** Está hecho a propósito para evitar el «efecto de violación de la abstinencia» (el «ya da igual» tras un desliz).

### Estrategias en las que se basa

| Estrategia | Fundamento |
|---|---|
| HALT (hambre, enfado, soledad, cansancio) | Programas de recuperación; modelo de prevención de recaídas (Marlatt y Gordon) |
| Planes «si… entonces…» | Intenciones de implementación, metaanálisis de Gollwitzer y Sheeran (2006) |
| Control de estímulos (filtros, móvil fuera del dormitorio) | Técnica conductual muy consolidada |
| «Surfear» el impulso | Prevención de recaídas basada en mindfulness (Bowen et al., 2014) |
| Rendición de cuentas y grupos | Apoyo social / ayuda mutua; Ecl 4,9-10 |
| Sacramentos, oración, dirección espiritual | Tradición católica (CIC 2337-2347) |
| Ejercicio y sueño | Evidencia en otras adicciones; en pornografía todavía es limitada |
| Hábitos ~66 días | Lally et al. (2010) |
| Ayuda profesional | CIE-11 6C72 (trastorno de conducta sexual compulsiva); en España, 024 y 112 |

## Privacidad

Todo se guarda en el propio dispositivo (AsyncStorage). No hay cuentas, servidores ni analítica. La única llamada de red es la descarga de las lecturas.

## Stack

- Expo SDK 58, React Native 0.88, TypeScript, Expo Router (`src/app/`)
- `@react-native-async-storage/async-storage` para los datos y `expo-haptics` para la vibración del botón de pánico
- Lógica del juego pura en `src/lib/game.ts`, con tests en `tests/game.test.ts`

```
src/
  app/            rutas (tabs: inicio, lecturas, camino, arsenal; pantallas: panico, caida, examen, ajustes, reflexion/[id], onboarding)
  components/     UI y tema
  content/        oraciones, reflexiones, estrategias, misiones
  lib/            game.ts (lógica), store.tsx (estado y persistencia), readings.ts (lecturas)
```

## Desarrollo

```bash
npm install
npm start            # abre con Expo Go (escanea el QR) o en un emulador
npm run web          # versión web
npm run typecheck
npm test
```

Para publicar en las tiendas: `npx eas-cli@latest build` (ver la documentación de EAS).

## Limitaciones y pendientes

- **Lecturas**: se descargan del feed público de Evangelizo (`feed.evangelizo.org`). No se ha podido probar desde el entorno de desarrollo (la red estaba bloqueada), así que hay que verificarlo en un dispositivo. Si falla, la app muestra enlaces a las fuentes oficiales. Antes de publicar conviene revisar los términos de uso del feed o buscar un acuerdo con la fuente.
- **Citas**: siguen traducciones castellanas habituales y pueden variar ligeramente según la edición.
- **Ideas para más adelante**: recordatorios (expo-notifications), bloqueo con PIN o biometría, modo oscuro, exportar/importar datos y Rosario guiado.

Esta app acompaña, pero no sustituye a la dirección espiritual ni a la ayuda psicológica profesional.
