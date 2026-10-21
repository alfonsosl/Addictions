import { useLocalSearchParams } from 'expo-router';
import { C, Card, H1, Label, P, Quote, Screen } from '../../components/ui';
import { REFLECTIONS } from '../../content/reflections';

export default function ReflectionScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const r = REFLECTIONS.find((x) => x.id === id) ?? REFLECTIONS[0];
  return (
    <Screen edges={['left', 'right', 'bottom']}>
      <H1>{r.title}</H1>
      <Card style={{ backgroundColor: C.navy, borderColor: C.navy }}>
        <Quote text={r.quote} source={r.source} dark />
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
