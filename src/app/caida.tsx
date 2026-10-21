import { router } from 'expo-router';
import { useState } from 'react';
import { Linking, TextInput, View } from 'react-native';
import { Button, C, Card, Chip, H2, inputStyle, Label, P, Screen } from '../components/ui';
import { PRAYERS } from '../content/prayers';
import { TRIGGERS } from '../content/strategies';
import { streakDays } from '../lib/game';
import { useStore } from '../lib/store';

export default function Relapse() {
  const { state, now, relapse, addConfession } = useStore();
  const [step, setStep] = useState(0);
  const [triggers, setTriggers] = useState<string[]>([]);
  const [note, setNote] = useState('');
  const days = streakDays(state, now);
  const contricion = PRAYERS.find((x) => x.id === 'contricion')!;

  const toggle = (t: string) => setTriggers((ts) => (ts.includes(t) ? ts.filter((x) => x !== t) : [...ts, t]));

  if (step === 0)
    return (
      <Screen edges={['left', 'right', 'bottom']}>
        <H2>Mírale a Él, no a tu caída</H2>
        <Card style={{ backgroundColor: C.goldSoft, borderColor: C.gold }}>
          <P style={{ fontStyle: 'italic' }}>
            «Cuando todavía estaba lejos, su padre lo vio y se conmovió; y, echando a correr, se le echó al cuello y lo
            cubrió de besos.» (Lc 15,20)
          </P>
        </Card>
        <P>
          Has luchado {days} {days === 1 ? 'día' : 'días'}. Eso no se pierde: tus talentos, tu nivel y tu mejor racha se
          conservan. Lo único que se reinicia es el contador.
        </P>
        <P>
          El mayor peligro ahora no es la caída, sino pensar «ya da igual». Ese pensamiento lleva a más caídas. Hoy mismo
          puedes volver a empezar.
        </P>
        <Button title="Entender qué pasó" onPress={() => setStep(1)} />
        <Button title="Volver, no he caído" kind="ghost" onPress={() => router.back()} />
      </Screen>
    );

  if (step === 1)
    return (
      <Screen edges={['left', 'right', 'bottom']}>
        <H2>¿Qué lo desencadenó?</H2>
        <P muted>Sin juzgarte: solo para aprender. Elige todo lo que aplique.</P>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {TRIGGERS.map((t) => (
            <Chip key={t} label={t} active={triggers.includes(t)} onPress={() => toggle(t)} />
          ))}
        </View>
        <Label>¿Qué harás distinto la próxima vez?</Label>
        <TextInput
          style={[inputStyle, { minHeight: 90, textAlignVertical: 'top' }]}
          multiline
          placeholder="Si me vuelve a pasar…, entonces…"
          value={note}
          onChangeText={setNote}
        />
        <Button
          title="Registrar y volver a empezar"
          onPress={() => {
            relapse(triggers, note.trim());
            setStep(2);
          }}
        />
      </Screen>
    );

  return (
    <Screen edges={['left', 'right', 'bottom']}>
      <H2>Levántate y vuelve a casa</H2>
      <P>Tu nueva racha ya ha comenzado. Tres pasos para hoy:</P>
      <Card>
        <Label>1 · Acto de contrición</Label>
        <P style={{ fontStyle: 'italic' }}>{contricion.text}</P>
      </Card>
      <Card>
        <Label>2 · Confiésate cuanto antes</Label>
        <P>
          La confesión no es un tribunal: es el abrazo del Padre. Busca horario en tu parroquia o en la web de tu
          diócesis.
        </P>
        <Button
          title="Buscar confesiones cerca"
          kind="ghost"
          onPress={() => Linking.openURL('https://www.google.com/maps/search/iglesia+cat%C3%B3lica+confesiones')}
        />
        <Button
          title="✝️ Ya me he confesado (+30 talentos)"
          kind="gold"
          onPress={() => {
            addConfession();
            router.back();
          }}
        />
      </Card>
      <Card>
        <Label>3 · Díselo a alguien</Label>
        <P>Cuéntaselo a tu compañero de camino. La vergüenza crece en el secreto y se debilita a la luz.</P>
      </Card>
      <Button title="Volver al inicio" onPress={() => router.back()} />
    </Screen>
  );
}
