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
| **Evangelio · Los 4 Evangelios** | **Texto completo sin conexión** de Mateo, Marcos, Lucas y Juan (traducción católica de Torres Amat), 89 capítulos titulados, lector con tamaño de letra ajustable, «Continuar leyendo», capítulos recomendados para la lucha, progreso y +5 talentos por capítulo. |
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

## Instalar en el móvil

- **Android**: descarga el APK de la última versión en
  [Releases](https://github.com/alfonsosl/Addictions/releases/latest) →
  `Vigilia.apk` (enlace directo: https://github.com/alfonsosl/Addictions/releases/latest/download/Vigilia.apk)
  y ábrelo. Android pedirá permiso para «instalar apps de origen desconocido».
  El APK lo compila automáticamente GitHub Actions (`.github/workflows/android-apk.yml`) en cada cambio.
- **iPhone**: Apple no permite instalar apps sin pasar por su sistema. Opciones: probar con la app **Expo Go**
  (`npm install && npx expo start` en tu ordenador y escanear el QR) o publicar en TestFlight con una cuenta
  de Apple Developer (99 €/año) mediante `npx eas-cli@latest build -p ios`.

## Desarrollo

```bash
npm install
npm start            # abre con Expo Go (escanea el QR) o en un emulador
npm run web          # versión web
npm run typecheck
npm run lint
npm test
```

Para publicar en las tiendas: `npx eas-cli@latest build` (ver la documentación de EAS).

## Limitaciones y pendientes

- **Lecturas**: se descargan del feed público de Evangelizo (`feed.evangelizo.org`). No se ha podido probar desde el entorno de desarrollo (la red estaba bloqueada), así que hay que verificarlo en un dispositivo. Necesitan conexión; sin red, la app muestra enlaces a fuentes oficiales y remite a los Evangelios completos, que sí funcionan offline. Antes de publicar conviene revisar los términos de uso del feed o buscar un acuerdo con la fuente.
- **Citas**: siguen traducciones castellanas habituales y pueden variar ligeramente según la edición. Las citas de sacerdotes y papas son breves, llevan su fuente y se contrastaron en internet; la de Padre Pío es de atribución tradicional (se indica en la app).
- **Comentarios de sacerdotes**: no se copian homilías completas (tienen derechos de autor). El comentario diario se carga en directo desde su fuente, con el autor, y hay enlaces a otras webs.
- **Ideas para más adelante**: recordatorios (expo-notifications), bloqueo con PIN o biometría, modo oscuro, exportar/importar datos y Rosario guiado.

## Texto de los Evangelios (sin conexión)

- **Traducción**: *La Sagrada Biblia*, de Félix Torres Amat (1823-1825), traducida de la Vulgata; edición de 1882. Es católica y de **dominio público** (el traductor murió en 1847).
- **Origen digital**: módulo «TorresAmat» del proyecto [biblia-elim](https://github.com/OmarGonD/biblia-elim) (`modulos/sqlite/TorresAmat.sqlite`), obtenido por OCR del facsímil de Internet Archive y marcado por sus autores como dominio público y **sin revisar**.
- **Revisión hecha para Vigilia**: los cuatro Evangelios se han leído completos y se han aplicado **1.261 correcciones** documentadas en `scripts/gospels/corrections.tsv`:
  - erratas del OCR («celesWww» → «celestial», «Elba» → «E iba»…);
  - cabeceras de página, pies de grabado y notas al pie colados en el texto;
  - versículos fusionados o descolocados, recolocados con la Vulgata Clementina como guía ([`@bible-api/bible-api-version-vulgate`](https://www.npmjs.com/package/@bible-api/bible-api-version-vulgate), MIT-0).
- **Marcas editoriales**: `[palabra]` = palabra restaurada (perdida en el OCR, asegurada por la Vulgata o por un pasaje paralelo); `[…]` = texto perdido. **No se ha inventado texto.**
- **Ortografía**: se conserva la de 1882 (Phariséos, Christo, corazon…), salvo los acentos de «á, é, ó, ú» sueltas y «Jesus» → «Jesús».
- **Versículos perdidos**: 12 de 3.777 (0,3 %): Mt 9,1; Mc 11,23; Jn 1,44.50.51; 3,35; 8,1-2; 10,1; 15,1-3. La app lo indica y ofrece un enlace a la Biblia de la USCCB online.
- **Numeración**: la de la Vulgata (en algunos capítulos difiere en un versículo de las Biblias modernas, p. ej. Mc 8-9, Jn 6).

Regenerar el texto:

```bash
python3 scripts/gospels/build.py --sqlite RUTA/TorresAmat.sqlite --vulgate RUTA/vulgate.json
npm test   # comprueba capítulos, versículos perdidos y restos del OCR
```

Las traducciones modernas (Jerusalén, CEE, Navarra, USCCB…) tienen derechos de autor y no pueden incluirse en la app.

Esta app acompaña, pero no sustituye a la dirección espiritual ni a la ayuda psicológica profesional.
