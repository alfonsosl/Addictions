import { useLocalSearchParams } from 'expo-router';
import { C, Card, H1, Label, P, Screen } from '../../components/ui';
import { REFLECTIONS } from '../../content/reflections';

export default function ReflectionScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const r = REFLECTIONS.find((x) => x.id === id) ?? REFLECTIONS[0];
  return (
    <Screen>
      <H1>{r.title}</H1>
      <Card style={{ backgroundColor: C.navy, borderColor: C.navy }}>
        <P style={{ color: '#fff', fontStyle: 'italic', fontSize: 18, lineHeight: 27 }}>«{r.quote}»</P>
        <P style={{ color: C.gold, fontWeight: '700' }}>{r.source}</P>
      </Card>
      <P>{r.body}</P>
      <Card style={{ backgroundColor: C.goldSoft, borderColor: C.gold }}>
        <Label>Propósito para hoy</Label>
        <P>{r.action}</P>
      </Card>
      <P muted style={{ fontSize: 14 }}>
        Quédate un minuto en silencio con esta frase. Pregúntale al Señor: ¿qué me quieres decir hoy?
      </P>
    </Screen>
  );
}
