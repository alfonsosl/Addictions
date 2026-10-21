import { router } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { TabScreen } from '../../components/overlays';
import { Button, C, Card, H1, H2, Label, P, ProgressBar, Segmented, serif } from '../../components/ui';
import { chapterId, GOSPELS, nextUnread, RECOMMENDED, TOTAL_CHAPTERS } from '../../content/gospels';
import { LECTIO_STEPS } from '../../content/prayers';
import { PRIEST_SITES } from '../../content/priests';
import { DAY_MS, dateKey } from '../../lib/game';
import { fetchReadings, officialLinks, type DayReadings } from '../../lib/readings';
import { useStore } from '../../lib/store';

type Mode = 'hoy' | 'evangelios';

export default function Evangelio() {
  const [mode, setMode] = useState<Mode>('hoy');
  return (
    <TabScreen>
      <H1>Evangelio</H1>
      <Segmented
        value={mode}
        onChange={setMode}
        options={[
          { value: 'hoy', label: '📅 Hoy' },
          { value: 'evangelios', label: '📚 Los 4 Evangelios' },
        ]}
      />
      {mode === 'hoy' ? <Today /> : <AllGospels />}
    </TabScreen>
  );
}

function Today() {
  const { state, now, today, markReading } = useStore();
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

  return (
    <>
      <View style={styles.dateBar}>
        <Pressable onPress={() => setOffset(offset - 1)} hitSlop={10} style={styles.arrow} accessibilityLabel="Día anterior">
          <Text style={styles.arrowText}>‹</Text>
        </Pressable>
        <Pressable onPress={() => setOffset(0)} style={{ flex: 1, alignItems: 'center' }}>
          <Text style={styles.dateText}>{offset === 0 ? `Hoy, ${dateLabel}` : dateLabel}</Text>
          {offset !== 0 && <Text style={{ color: C.muted, fontSize: 12 }}>Toca para volver a hoy</Text>}
        </Pressable>
        <Pressable onPress={() => setOffset(offset + 1)} hitSlop={10} style={styles.arrow} accessibilityLabel="Día siguiente">
          <Text style={styles.arrowText}>›</Text>
        </Pressable>
      </View>

      {loading && <ActivityIndicator color={C.navy} style={{ marginTop: 24 }} />}

      {!loading && data && (
        <>
          {data.liturgicalTitle ? <Text style={styles.liturgy}>{data.liturgicalTitle}</Text> : null}

          {gospel && (
            <Card style={{ borderColor: C.gold, borderWidth: 2 }}>
              <Label>✝️ Evangelio del día</Label>
              <H2>{gospel.reference}</H2>
              <Text style={styles.scripture}>{gospel.text}</Text>
            </Card>
          )}

          {data.commentary && (
            <Card style={{ backgroundColor: C.navy, borderColor: C.navy }}>
              <Text style={styles.lightLabel}>COMENTARIO DEL DÍA</Text>
              {data.commentary.title ? (
                <Text style={{ color: '#fff', fontSize: 18, fontWeight: '800' }}>{data.commentary.title}</Text>
              ) : null}
              <Text style={{ color: C.gold, fontWeight: '700' }}>{data.commentary.author}</Text>
              {data.commentary.source ? (
                <Text style={{ color: '#fff', opacity: 0.7, fontSize: 13 }}>{data.commentary.source}</Text>
              ) : null}
              <Text style={[styles.scripture, { color: '#fff' }]}>{data.commentary.text}</Text>
            </Card>
          )}

          {others.map((r) => (
            <Card key={r.key}>
              <Pressable onPress={() => setOpen(open === r.key ? '' : r.key)} style={styles.rowBetween}>
                <View style={{ flex: 1 }}>
                  <Label>{r.label}</Label>
                  <Text style={{ fontWeight: '700', color: C.navy }}>{r.reference || r.label}</Text>
                </View>
                <Text style={{ color: C.muted, fontSize: 20 }}>{open === r.key ? '▾' : '▸'}</Text>
              </Pressable>
              {open === r.key && <Text style={styles.scripture}>{r.text}</Text>}
            </Card>
          ))}
          <Text style={{ color: C.muted, fontSize: 12 }}>Lecturas y comentario: {data.source}</Text>
        </>
      )}

      {!loading && error && (
        <Card>
          <H2>No se pudieron descargar las lecturas</H2>
          <P muted>Las lecturas del día necesitan conexión. Sin internet puedes leer los cuatro Evangelios completos en la pestaña «Los 4 Evangelios». Con conexión, también en estas webs:</P>
          {officialLinks(date).map((l) => (
            <LinkRow key={l.url} label={l.label} url={l.url} />
          ))}
          <Button title="Reintentar" kind="ghost" onPress={retry} />
        </Card>
      )}

      {offset === 0 && (
        <Button
          title={read ? '✓ Ya has meditado el Evangelio de hoy' : '✓ He leído y meditado (+10 talentos)'}
          kind={read ? 'ghost' : 'gold'}
          disabled={read}
          onPress={markReading}
        />
      )}

      <Card>
        <Label>🎙️ Más comentarios de sacerdotes</Label>
        {PRIEST_SITES.map((l) => (
          <LinkRow key={l.url} label={l.label} url={l.url} />
        ))}
      </Card>

      <Card style={{ backgroundColor: C.goldSoft, borderColor: C.gold }}>
        <Label>Cómo orar con el Evangelio · Lectio Divina</Label>
        {LECTIO_STEPS.map((s) => (
          <P key={s.title}>
            <Text style={{ fontWeight: '800' }}>{s.title}: </Text>
            {s.text}
          </P>
        ))}
      </Card>
    </>
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
        <Text style={{ color: C.green, fontWeight: '700', fontSize: 13 }}>✓ Texto completo disponible sin conexión</Text>
        {next ? (
          <Button
            title={`▶ Continuar: ${next.book.short} ${next.ch}`}
            kind="gold"
            onPress={() =>
              router.push({ pathname: '/capitulo/[book]/[ch]', params: { book: next.book.id, ch: String(next.ch) } })
            }
          />
        ) : (
          <P>🎉 ¡Has leído los cuatro Evangelios completos!</P>
        )}
      </Card>

      <Label>⭐ Para la lucha por la pureza</Label>
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
              <Text style={{ fontWeight: '800', color: C.navy }}>
                {done ? '✓ ' : ''}
                {g.short} {r.ch}
              </Text>
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
              <Text style={{ fontSize: 30, marginRight: 10 }}>{g.icon}</Text>
              <View style={{ flex: 1 }}>
                <H2>{g.short}</H2>
                <Text style={{ color: C.muted, fontSize: 13 }}>
                  {g.chapters.length} capítulos · {read} leídos
                </Text>
              </View>
              <Text style={{ color: C.muted, fontSize: 20 }}>{isOpen ? '▾' : '▸'}</Text>
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
      <Text style={{ color: C.navySoft, fontSize: 15, fontWeight: '600' }}>↗ {label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  dateBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 14, borderWidth: 1, borderColor: C.line, padding: 6 },
  arrow: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center', borderRadius: 10, backgroundColor: C.bg },
  arrowText: { fontSize: 24, color: C.navy, fontWeight: '700' },
  dateText: { color: C.navy, fontWeight: '800', textTransform: 'capitalize' },
  liturgy: { color: C.navySoft, fontWeight: '700', textAlign: 'center', fontSize: 15 },
  scripture: { fontFamily: serif, fontSize: 18, lineHeight: 29, color: C.ink },
  lightLabel: { color: C.gold, letterSpacing: 1, fontSize: 12, fontWeight: '800' },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  reco: { flexBasis: '47%', flexGrow: 1, backgroundColor: '#fff', borderRadius: 14, borderWidth: 1.5, borderColor: C.line, padding: 10 },
  chGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  ch: { width: 46, height: 46, borderRadius: 12, backgroundColor: C.bg, borderWidth: 1, borderColor: C.line, alignItems: 'center', justifyContent: 'center' },
  chDone: { backgroundColor: C.green, borderColor: C.green },
  chText: { fontWeight: '800', color: C.navy, fontSize: 16 },
});
