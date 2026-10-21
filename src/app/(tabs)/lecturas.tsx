import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Linking, Pressable, Text, View } from 'react-native';
import { Button, C, Card, H1, H2, Label, P, Screen } from '../../components/ui';
import { LECTIO_STEPS } from '../../content/prayers';
import { DAY_MS } from '../../lib/game';
import { fetchReadings, officialLinks, type DayReadings } from '../../lib/readings';
import { useStore } from '../../lib/store';

export default function Lecturas() {
  const { state, today, markReading } = useStore();
  const [offset, setOffset] = useState(0); // días respecto a hoy
  const [data, setData] = useState<DayReadings | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState<string>('GSP');
  const date = new Date(Date.now() + offset * DAY_MS);
  const read = state.readingsRead.includes(today);

  const load = useCallback(async (d: Date) => {
    setLoading(true);
    setError(false);
    try {
      setData(await fetchReadings(d));
    } catch {
      setData(null);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(new Date(Date.now() + offset * DAY_MS));
  }, [offset, load]);

  const dateLabel = date.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <Screen>
      <H1>Lecturas del día</H1>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Pressable onPress={() => setOffset(offset - 1)} hitSlop={10}>
          <Text style={{ fontSize: 22, color: C.navy }}>‹</Text>
        </Pressable>
        <Pressable onPress={() => setOffset(0)}>
          <Text style={{ color: C.navy, fontWeight: '700', textTransform: 'capitalize' }}>
            {offset === 0 ? `Hoy · ${dateLabel}` : dateLabel}
          </Text>
        </Pressable>
        <Pressable onPress={() => setOffset(offset + 1)} hitSlop={10}>
          <Text style={{ fontSize: 22, color: C.navy }}>›</Text>
        </Pressable>
      </View>

      {loading && <ActivityIndicator color={C.navy} style={{ marginTop: 24 }} />}

      {!loading && data && (
        <>
          {data.liturgicalTitle ? (
            <Card style={{ backgroundColor: C.navy, borderColor: C.navy }}>
              <Text style={{ color: C.gold, fontSize: 12, fontWeight: '700', letterSpacing: 1 }}>LITURGIA</Text>
              <Text style={{ color: '#fff', fontSize: 17, fontWeight: '700' }}>{data.liturgicalTitle}</Text>
            </Card>
          ) : null}
          {data.readings.map((r) => (
            <Card key={r.key}>
              <Pressable onPress={() => setOpen(open === r.key ? '' : r.key)}>
                <Label>{r.label}</Label>
                <H2>{r.reference || r.label}</H2>
              </Pressable>
              {open === r.key ? <P>{r.text}</P> : <P muted>Toca para leer</P>}
            </Card>
          ))}
          <Text style={{ color: C.muted, fontSize: 12 }}>Fuente: {data.source}</Text>
        </>
      )}

      {!loading && error && (
        <Card>
          <H2>No se pudieron descargar las lecturas</H2>
          <P muted>Comprueba tu conexión o léelas en una fuente oficial:</P>
          <Button title="Reintentar" kind="ghost" onPress={() => load(date)} />
        </Card>
      )}

      <Card>
        <Label>Leer en la web</Label>
        {officialLinks(date).map((l) => (
          <Pressable key={l.url} onPress={() => Linking.openURL(l.url)}>
            <Text style={{ color: C.navySoft, fontSize: 16, paddingVertical: 6, textDecorationLine: 'underline' }}>
              {l.label}
            </Text>
          </Pressable>
        ))}
      </Card>

      <Card style={{ backgroundColor: C.goldSoft, borderColor: C.gold }}>
        <Label>Ora con el Evangelio · Lectio Divina</Label>
        {LECTIO_STEPS.map((s) => (
          <P key={s.title}>
            <Text style={{ fontWeight: '700' }}>{s.title}: </Text>
            {s.text}
          </P>
        ))}
      </Card>

      {offset === 0 && (
        <Button
          title={read ? '✓ Lecturas de hoy meditadas' : 'He leído y meditado las lecturas (+10)'}
          kind={read ? 'ghost' : 'gold'}
          disabled={read}
          onPress={markReading}
        />
      )}
    </Screen>
  );
}
