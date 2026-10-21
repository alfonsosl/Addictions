import { router } from 'expo-router';
import { useState } from 'react';
import { TextInput } from 'react-native';
import { Button, Card, inputStyle, Label, P, Screen } from '../components/ui';
import { EXAMEN_STEPS } from '../content/prayers';
import { useStore } from '../lib/store';

export default function Examen() {
  const { state, today, saveExamen } = useStore();
  const prev = state.examens[today];
  const [gratitude, setGratitude] = useState(prev?.gratitude ?? '');
  const [struggle, setStruggle] = useState(prev?.struggle ?? '');
  const [resolution, setResolution] = useState(prev?.resolution ?? '');

  return (
    <Screen>
      <P muted>Cinco minutos antes de dormir, con el móvil ya fuera del dormitorio si puedes.</P>
      {EXAMEN_STEPS.map((s) => (
        <Card key={s.title}>
          <Label>{s.title}</Label>
          <P>{s.text}</P>
          {s.title.startsWith('2') && (
            <TextInput style={inputStyle} multiline placeholder="Gracias, Señor, por…" value={gratitude} onChangeText={setGratitude} />
          )}
          {s.title.startsWith('3') && (
            <TextInput style={inputStyle} multiline placeholder="Hoy me costó…" value={struggle} onChangeText={setStruggle} />
          )}
          {s.title.startsWith('5') && (
            <TextInput style={inputStyle} multiline placeholder="Mañana, si…, entonces…" value={resolution} onChangeText={setResolution} />
          )}
        </Card>
      ))}
      <P muted style={{ fontSize: 14 }}>Lo que escribas se guarda solo en este dispositivo.</P>
      <Button
        title={prev ? 'Guardar cambios' : 'Terminar examen (+10)'}
        kind="gold"
        onPress={() => {
          saveExamen({ gratitude: gratitude.trim(), struggle: struggle.trim(), resolution: resolution.trim() });
          router.back();
        }}
      />
    </Screen>
  );
}
