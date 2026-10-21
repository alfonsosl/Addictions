import { router, Stack, useLocalSearchParams } from 'expo-router';
import { Text } from 'react-native';
import { Button, C, Card, P, Screen, serif } from '../../components/ui';
import { PRAYERS } from '../../content/prayers';
import { useFont } from '../../lib/fontScale';
import { useStore } from '../../lib/store';

export default function PrayerScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { state, today, toggleMission } = useStore();
  const { fs } = useFont();
  const p = PRAYERS.find((x) => x.id === id) ?? PRAYERS[0];
  const isMorning = p.id === 'ofrecimiento';
  const offered = (state.missionsByDate[today] ?? []).includes('ofrecimiento');

  return (
    <Screen edges={['left', 'right', 'bottom']}>
      <Stack.Screen options={{ title: p.title }} />
      <P muted>{p.when}</P>
      <Card>
        <Text style={{ fontFamily: serif, fontSize: fs(21), lineHeight: fs(34), color: C.ink }}>{p.text}</Text>
      </Card>
      {isMorning && !offered ? (
        <Button
          title="🌄 He ofrecido mi día (+5)"
          kind="gold"
          onPress={() => {
            toggleMission('ofrecimiento');
            router.back();
          }}
        />
      ) : (
        <Button title="Amén 🙏" kind="gold" onPress={() => router.back()} />
      )}
    </Screen>
  );
}
