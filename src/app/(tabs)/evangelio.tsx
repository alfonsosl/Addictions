import { router } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { useEffect, useState, type ReactNode } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import { Text } from '../../components/Text';
import type { SceneId } from '../../components/art/scenes';
import { Glyph } from '../../components/icons';
import { IllustratedScroll } from '../../components/IllustratedScroll';
import { PanicFab, TabScreen } from '../../components/overlays';
import { Button, C, Card, H2, Label, P, ProgressBar, Segmented, serif } from '../../components/ui';
import { sceneForReference } from '../../content/gospelScenes';
import { SceneCard } from '../../components/LoveIllustration';
import { loveForDate } from '../../content/love';
import { useFont } from '../../lib/fontScale';
import { chapterId, GOSPELS, nextUnread, RECOMMENDED, TOTAL_CHAPTERS } from '../../content/gospels';
import { LECTIO_STEPS } from '../../content/prayers';
import { PRIEST_SITES } from '../../content/priests';
import { DAY_MS, dateKey } from '../../lib/game';
import { fetchReadings, officialLinks, type DayReadings } from '../../lib/readings';
import { useStore } from '../../lib/store';

type Mode = 'hoy' | 'evangelios';

// Escena que representa a cada Evangelio en la lista.
const BOOK_SCENE: Record<string, SceneId> = { mt: 'mountain', mc: 'sea', lc: 'flock', jn: 'vine' };

export default function Evangelio() {
  const [mode, setMode] = useState<Mode>('hoy');
  const tabs = (dark: boolean) => (
    <>
      <Text style={[styles.h1, dark && { color: '#F3EEDF' }]}>Evangelio</Text>
      <Segmented
        value={mode}
        onChange={setMode}
        options={[
          { value: 'hoy', label: 'Hoy' },
          { value: 'evangelios', label: 'Los 4 Evangelios' },
        ]}
      />
    </>
  );
  if (mode === 'hoy') return <Today tabs={tabs} />;
  return (
    <TabScreen>
      {tabs(false)}
      <AllGospels />
    </TabScreen>
  );
}

function Today({ tabs }: { tabs: (dark: boolean) => ReactNode }) {
  const { state, now, today, markReading } = useStore();
  const { fs } = useFont();
  const [offset, setOffset] = useState(0);
  const [attempt, setAttempt] = useState(0);
  // Resultado de la última descarga, etiquetado con su fecha: mientras no coincide, se está cargando.
  const [result, setResult] = useState<{ key: string; data: DayReadings | null } | null>(null);
  const [open, setOpen] = useState<string>('GSP');
  const date = new Date(now.getTime() + offset * DAY_MS);
  const key = `${dateKey(date)}#${attempt}`;
  const loading = result?.key !== key;
  const data = loading ? null : result.data;
  const error = !loading && !result.data;
  const read = state.readingsRead.includes(today);

  useEffect(() => {
    let cancelled = false;
    const d = new Date(Date.now() + offset * DAY_MS);
    const k = `${dateKey(d)}#${attempt}`;
    fetchReadings(d)
      .then((r) => !cancelled && setResult({ key: k, data: r }))
      .catch(() => !cancelled && setResult({ key: k, data: null }));
    return () => {
      cancelled = true;
    };
  }, [offset, attempt]);

  const retry = () => setAttempt((a) => a + 1);

  const dateLabel = date.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
  const gospel = data?.readings.find((r) => r.key === 'GSP');
  const others = data?.readings.filter((r) => r.key !== 'GSP') ?? [];
  // Sin lecturas (o mientras cargan), la ilustración del amor de Dios de ese día.
  const scene = sceneForReference(gospel?.reference, loveForDate(date).scene);

  return (
    <View style={{ flex: 1 }}>
      <IllustratedScroll
        scene={scene}
        bottomSpace={110}
        header={(dark) => {
          const ink = dark ? '#F3EEDF' : C.ink;
          return (
            <>
              {tabs(dark)}
              <View style={styles.dateBar}>
                <Pressable onPress={() => setOffset(offset - 1)} hitSlop={10} style={styles.arrow} accessibilityLabel="Día anterior">
                  <View style={{ transform: [{ rotate: '180deg' }] }}>
                    <Glyph e="chevron" size={18} color={ink} />
                  </View>
                </Pressable>
                <Pressable onPress={() => setOffset(0)} style={{ flex: 1, alignItems: 'center' }}>
                  <Text style={[styles.dateText, { color: ink }]}>{offset === 0 ? `Hoy, ${dateLabel}` : dateLabel.charAt(0).toUpperCase() + dateLabel.slice(1)}</Text>
                  {offset !== 0 && <Text style={{ color: dark ? '#CFC7B2' : C.muted, fontSize: 12 }}>Toca para volver a hoy</Text>}
                </Pressable>
                <Pressable onPress={() => setOffset(offset + 1)} hitSlop={10} style={styles.arrow} accessibilityLabel="Día siguiente">
                  <Glyph e="chevron" size={18} color={ink} />
                </Pressable>
              </View>
              {loading && <ActivityIndicator color={ink} style={{ marginTop: 24 }} />}
              {gospel && (
                <View style={{ alignItems: 'center', gap: 6, marginTop: 18 }}>
                  {data?.liturgicalTitle ? <Text style={[styles.liturgy, { color: dark ? '#CFC7B2' : C.muted }]}>{data.liturgicalTitle}</Text> : null}
                  <Text style={[styles.heroRef, { color: ink, fontSize: fs(34), lineHeight: fs(40) }]}>{gospel.reference}</Text>
                  <Text style={[styles.heroLabel, { color: dark ? '#CFC7B2' : C.muted }]}>EVANGELIO DEL DÍA</Text>
                </View>
              )}
            </>
          );
        }}
      >
        {!loading && data && (
          <>
            {gospel && <Text style={[styles.scripture, { fontSize: fs(19), lineHeight: fs(30) }]}>{gospel.text}</Text>}

            {offset === 0 && (
              <Button
                title={read ? 'Ya has meditado el Evangelio de hoy' : 'He leído y meditado (+10 talentos)'}
                kind={read ? 'ghost' : 'primary'}
                disabled={read}
                onPress={markReading}
              />
            )}

            {data.commentary && (
              <View style={styles.comment}>
                <Label>Comentario del día</Label>
                {data.commentary.title ? <Text style={styles.commentTitle}>{data.commentary.title}</Text> : null}
                <Text style={{ color: C.blue }}>{data.commentary.author}</Text>
                {data.commentary.source ? <Text style={{ color: C.muted, fontSize: 13 }}>{data.commentary.source}</Text> : null}
                <Text style={[styles.scripture, { fontSize: fs(18), lineHeight: fs(28) }]}>{data.commentary.text}</Text>
              </View>
            )}

            {others.map((r) => (
              <View key={r.key} style={styles.other}>
                <Pressable onPress={() => setOpen(open === r.key ? '' : r.key)} style={styles.rowBetween}>
                  <View style={{ flex: 1 }}>
                    <Label>{r.label}</Label>
                    <Text style={{ color: C.ink, fontSize: 16 }}>{r.reference || r.label}</Text>
                  </View>
                  <View style={{ transform: [{ rotate: open === r.key ? '90deg' : '0deg' }] }}>
                    <Glyph e="chevron" size={18} color={C.muted} />
                  </View>
                </Pressable>
                {open === r.key && <Text style={[styles.scripture, { fontSize: fs(18), lineHeight: fs(28) }]}>{r.text}</Text>}
              </View>
            ))}
            <Text style={{ color: C.muted, fontSize: 12 }}>Lecturas y comentario: {data.source}</Text>
          </>
        )}

        {!loading && error && (
          <Card>
            <H2>No se pudieron descargar las lecturas</H2>
            <P muted>
              Las lecturas del día necesitan conexión. Sin internet puedes leer los cuatro Evangelios completos en «Los 4
              Evangelios». Con conexión, también en estas webs:
            </P>
            {officialLinks(date).map((l) => (
              <LinkRow key={l.url} label={l.label} url={l.url} />
            ))}
            <Button title="Reintentar" kind="ghost" onPress={retry} />
          </Card>
        )}

        <View style={styles.other}>
          <Label>Más comentarios de sacerdotes</Label>
          {PRIEST_SITES.map((l) => (
            <LinkRow key={l.url} label={l.label} url={l.url} />
          ))}
        </View>

        <View style={styles.other}>
          <Label>Cómo orar con el Evangelio · Lectio Divina</Label>
          {LECTIO_STEPS.map((s) => (
            <P key={s.title}>
              <Text style={{ fontWeight: '500' }}>{s.title}: </Text>
              {s.text}
            </P>
          ))}
        </View>
      </IllustratedScroll>
      <PanicFab />
    </View>
  );
}

function AllGospels() {
  const { state } = useStore();
  const [openBook, setOpenBook] = useState<string | null>(null);
  const readCount = state.chaptersRead.length;
  const next = nextUnread(state.chaptersRead);

  return (
    <>
      <Card>
        <View style={styles.rowBetween}>
          <Label>Tu lectura de los Evangelios</Label>
          <Text style={{ color: C.navy, fontWeight: '800' }}>
            {readCount}/{TOTAL_CHAPTERS}
          </Text>
        </View>
        <ProgressBar value={readCount / TOTAL_CHAPTERS} color={C.gold} />
        <P muted style={{ fontSize: 14 }}>
          Un capítulo al día: en {TOTAL_CHAPTERS} días habrás leído los cuatro Evangelios. Cada capítulo suma +5 talentos.
        </P>
        <Text style={{ color: C.green, fontSize: 13 }}>Texto completo disponible sin conexión</Text>
        {next ? (
          <Button
            title={`Continuar: ${next.book.short} ${next.ch}`}
            kind="primary"
            onPress={() =>
              router.push({ pathname: '/capitulo/[book]/[ch]', params: { book: next.book.id, ch: String(next.ch) } })
            }
          />
        ) : (
          <P>¡Has leído los cuatro Evangelios completos!</P>
        )}
      </Card>

      <Label>Para la lucha por la pureza</Label>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {RECOMMENDED.map((r) => {
          const g = GOSPELS.find((x) => x.id === r.book)!;
          const done = state.chaptersRead.includes(chapterId(r.book, r.ch));
          return (
            <Pressable
              key={`${r.book}${r.ch}`}
              style={[styles.reco, done && { borderColor: C.green }]}
              onPress={() => router.push({ pathname: '/capitulo/[book]/[ch]', params: { book: r.book, ch: String(r.ch) } })}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                {done && <Glyph e="✓" size={14} color={C.green} />}
                <Text style={{ fontWeight: '500', color: C.navy }}>
                  {g.short} {r.ch}
                </Text>
              </View>
              <Text style={{ color: C.muted, fontSize: 12 }}>{r.why}</Text>
            </Pressable>
          );
        })}
      </View>

      {GOSPELS.map((g) => {
        const read = g.chapters.filter((_, i) => state.chaptersRead.includes(chapterId(g.id, i + 1))).length;
        const isOpen = openBook === g.id;
        return (
          <Card key={g.id}>
            <Pressable onPress={() => setOpenBook(isOpen ? null : g.id)} style={styles.rowBetween}>
              <View style={{ marginRight: 12 }}>
                <SceneCard id={BOOK_SCENE[g.id]} height={54} radius={12} />
              </View>
              <View style={{ flex: 1 }}>
                <H2>{g.short}</H2>
                <Text style={{ color: C.muted, fontSize: 13 }}>
                  {g.chapters.length} capítulos · {read} leídos
                </Text>
              </View>
              <View style={{ transform: [{ rotate: isOpen ? '90deg' : '0deg' }] }}>
                <Glyph e="chevron" size={18} color={C.muted} />
              </View>
            </Pressable>
            {isOpen && (
              <>
                <P muted style={{ fontSize: 14 }}>
                  {g.intro}
                </P>
                <View style={styles.chGrid}>
                  {g.chapters.map((_, i) => {
                    const done = state.chaptersRead.includes(chapterId(g.id, i + 1));
                    return (
                      <Pressable
                        key={i}
                        accessibilityLabel={`${g.short} capítulo ${i + 1}`}
                        style={[styles.ch, done && styles.chDone]}
                        onPress={() =>
                          router.push({ pathname: '/capitulo/[book]/[ch]', params: { book: g.id, ch: String(i + 1) } })
                        }
                      >
                        <Text style={[styles.chText, done && { color: '#fff' }]}>{i + 1}</Text>
                      </Pressable>
                    );
                  })}
                </View>
              </>
            )}
          </Card>
        );
      })}
    </>
  );
}

function LinkRow({ label, url }: { label: string; url: string }) {
  return (
    <Pressable onPress={() => WebBrowser.openBrowserAsync(url).catch(() => {})} style={{ paddingVertical: 6 }}>
      <Text style={{ color: C.blue, fontSize: 15 }}>↗ {label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  h1: { fontSize: 30, fontWeight: '300', color: C.ink, letterSpacing: 0.5, textAlign: 'center' },
  dateBar: { flexDirection: 'row', alignItems: 'center', paddingVertical: 2 },
  arrow: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  dateText: { color: C.ink, fontWeight: '400' },
  liturgy: { color: C.muted, textAlign: 'center', fontSize: 14, fontWeight: '300' },
  heroRef: { fontFamily: serif, textAlign: 'center' },
  heroLabel: { fontSize: 11, letterSpacing: 2.5, fontWeight: '400' },
  scripture: { fontFamily: serif, fontSize: 18, lineHeight: 29, color: C.ink },
  comment: { gap: 6, paddingTop: 10, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: C.line },
  commentTitle: { fontFamily: serif, fontSize: 21, color: C.ink },
  other: { gap: 6, paddingTop: 12, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: C.line },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  reco: { flexBasis: '47%', flexGrow: 1, backgroundColor: C.card, borderRadius: 14, borderWidth: StyleSheet.hairlineWidth, borderColor: C.line, padding: 10 },
  chGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  ch: { width: 46, height: 46, borderRadius: 23, borderWidth: StyleSheet.hairlineWidth, borderColor: C.line, alignItems: 'center', justifyContent: 'center' },
  chDone: { backgroundColor: C.navy, borderColor: C.navy },
  chText: { fontWeight: '400', color: C.navy, fontSize: 16 },
});
