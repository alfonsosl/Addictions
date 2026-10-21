# Vigilia

App móvil (iOS / Android, también web) para ayudar a dejar la pornografía desde la fe católica.

> «Velad y orad para no caer en tentación; el espíritu está pronto, pero la carne es débil.» (Mt 26,41)

## Funcionalidades

Cinco pestañas, con el **botón SOS siempre a un toque**: grande en Inicio y flotante en el resto.

| Pantalla | Qué hace |
|---|---|
| **Inicio** | Contador, **botón de pánico arriba del todo**, «Tu día con Dios» (Evangelio, reflexión, oración del momento, examen), nivel y regla de vida, «mi porqué». |
| **🆘 Botón de pánico** | Respiración guiada → oración → acciones de huida, tus planes «si… entonces…» y llamar/SMS al compañero → tu porqué → temporizador de 10 min. |
| **Evangelio · Hoy** | Lecturas del día, **comentario del día con su autor** (santos, papas y sacerdotes), enlaces a comentarios de sacerdotes (evangeli.net, Vatican News, Opus Dei) y *Lectio Divina*. |
| **Evangelio · Los 4 Evangelios** | Índice completo de Mateo, Marcos, Lucas y Juan (89 capítulos titulados), capítulos recomendados para la lucha, progreso de lectura y +5 talentos por capítulo. El texto se lee en la Biblia católica de la USCCB (en español), dentro de la app. |
| **Rezar** | 7 oraciones; **8 reflexiones a partir de palabras de sacerdotes, obispos y papas** (San Agustín, San Josemaría, Francisco, Benedicto XVI, Juan Pablo II, San Alfonso, Padre Pío), cada una con su fuente; 21 reflexiones bíblicas. |
| **Camino** | Regla de vida, examen, estadísticas, insignias (con celebración al conseguirlas) y niveles. |
| **Ayuda** | Tus planes, 10 estrategias con su fundamento y teléfonos de crisis (024 / 112). |

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
- **Citas**: siguen traducciones castellanas habituales y pueden variar ligeramente según la edición. Las citas de sacerdotes y papas son breves, llevan su fuente y se contrastaron en internet; la de Padre Pío es de atribución tradicional (se indica en la app).
- **Comentarios de sacerdotes**: no se copian homilías completas (tienen derechos de autor). El comentario diario se carga en directo desde su fuente, con el autor, y hay enlaces a otras webs.

## Texto completo sin conexión

`src/content/gospels.ts` → `OFFLINE_TEXT` acepta el texto de los cuatro Evangelios (`{ mt: [[versículo1, versículo2, …], …], mc: …, lc: …, jn: … }`). Si está relleno, la app muestra el texto directamente, sin conexión. Debe ser una traducción católica **de dominio público** (p. ej. Torres Amat, 1823) o con licencia para distribuirla. No uses la Biblia de Jerusalén, la de la CEE, la de Navarra ni la de la USCCB: tienen derechos de autor.
- **Ideas para más adelante**: recordatorios (expo-notifications), bloqueo con PIN o biometría, modo oscuro, exportar/importar datos y Rosario guiado.

Esta app acompaña, pero no sustituye a la dirección espiritual ni a la ayuda psicológica profesional.
