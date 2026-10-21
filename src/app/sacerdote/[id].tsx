import { useLocalSearchParams } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { Text } from 'react-native';
import { Button, C, Card, H1, Label, P, Quote, Screen } from '../../components/ui';
import { PRIEST_REFLECTIONS } from '../../content/priests';

export default function PriestScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const r = PRIEST_REFLECTIONS.find((x) => x.id === id) ?? PRIEST_REFLECTIONS[0];
  return (
    <Screen edges={['left', 'right', 'bottom']}>
      <Label>{r.role}</Label>
      <H1>{r.author}</H1>
      <Card style={{ backgroundColor: C.navy, borderColor: C.navy }}>
        <Quote text={r.quote} source={r.source} dark />
      </Card>
      {r.note ? <Text style={{ color: C.muted, fontSize: 13 }}>ℹ️ {r.note}</Text> : null}
      <P>{r.body}</P>
      <Card style={{ backgroundColor: C.goldSoft, borderColor: C.gold }}>
        <Label>Propósito para hoy</Label>
        <P>{r.action}</P>
      </Card>
      <Button title="↗ Ver la fuente original" kind="ghost" onPress={() => WebBrowser.openBrowserAsync(r.url).catch(() => {})} />
    </Screen>
  );
}
