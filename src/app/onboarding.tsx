import { router } from 'expo-router';
import { SceneCard } from '../components/LoveIllustration';
import { useState } from 'react';
import { View } from 'react-native';
import { TextInput } from '../components/Text';
import { Button, C, Card, Chip, H1, H2, inputStyle, Label, P, Screen, serif } from '../components/ui';
import { DAY_MS } from '../lib/game';
import { useStore } from '../lib/store';

const STEPS = 4;

export default function Onboarding() {
  const { start } = useStore();
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [why, setWhy] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [daysAgo, setDaysAgo] = useState('0');

  const finish = () => {
    const n = Math.max(0, parseInt(daysAgo, 10) || 0);
    start(
      {
        name: name.trim(),
        why: why.trim(),
        contactName: contactName.trim(),
        contactPhone: contactPhone.trim(),
        ifThen: [
          { when: 'estoy solo en la cama con el móvil', then: 'lo dejo cargando fuera del dormitorio' },
          { when: 'siento el primer impulso', then: 'me levanto, pulso el botón de pánico y rezo un Avemaría' },
          { when: 'estoy aburrido o cansado', then: 'salgo a caminar o llamo a un amigo' },
        ],
      },
      new Date(Date.now() - n * DAY_MS),
    );
    router.replace('/');
  };

  return (
    <Screen>
      <View style={{ flexDirection: 'row', gap: 6, marginTop: 8 }}>
        {Array.from({ length: STEPS }).map((_, i) => (
          <View key={i} style={{ flex: 1, height: 4, borderRadius: 2, backgroundColor: i <= step ? C.gold : C.line }} />
        ))}
      </View>

      {step === 0 && (
        <>
          <View style={{ marginTop: 8, marginHorizontal: -4 }}>
            <SceneCard id="light" height={220} />
          </View>
          <H1>Vigilia</H1>
          <P style={{ fontFamily: serif, fontStyle: 'italic', color: C.ink, fontSize: 18 }}>
            «Velad y orad para no caer en tentación; el espíritu está pronto, pero la carne es débil.» (Mt 26,41)
          </P>
          <P>
            Vigilia te acompaña para dejar la pornografía y crecer en libertad interior desde la fe católica: lecturas
            del día, oración, estrategias probadas y un camino en forma de juego.
          </P>
          <Card>
            <Label>Tu privacidad</Label>
            <P>Todo se guarda solo en este dispositivo. Sin cuentas, sin servidores, sin rastreo.</P>
          </Card>
          <Card>
            <Label>Cómo funciona el juego</Label>
            <P>• Cada día limpio y cada buena acción suman talentos (Mt 25).</P>
            <P>• Los talentos te hacen subir de nivel: de Catecúmeno a Apóstol.</P>
            <P>• Si caes, la racha se reinicia, pero tu nivel y tus talentos se conservan. Caer no es volver al principio.</P>
          </Card>
          <Button title="Empezar" kind="gold" onPress={() => setStep(1)} />
        </>
      )}

      {step === 1 && (
        <>
          <H2>¿Cómo te llamas?</H2>
          <TextInput style={inputStyle} placeholder="Tu nombre (opcional)" value={name} onChangeText={setName} />
          <H2>Tu porqué</H2>
          <P muted>
            ¿Por qué quieres ser libre? Lo verás en los momentos de tentación. Escríbelo con el corazón.
          </P>
          <TextInput
            style={[inputStyle, { minHeight: 110, textAlignVertical: 'top' }]}
            multiline
            placeholder="Ej.: Quiero amar de verdad a mi futura esposa, mirar a los demás con limpieza y estar cerca de Dios."
            value={why}
            onChangeText={setWhy}
          />
          <Button title="Siguiente" onPress={() => setStep(2)} />
        </>
      )}

      {step === 2 && (
        <>
          <H2>No camines solo</H2>
          <P muted>
            Elige a una persona de confianza (amigo, sacerdote, director espiritual) a quien poder llamar en un momento
            difícil. Aparecerá en el botón de pánico. Puedes añadirla más tarde.
          </P>
          <TextInput style={inputStyle} placeholder="Nombre" value={contactName} onChangeText={setContactName} />
          <TextInput
            style={inputStyle}
            placeholder="Teléfono"
            keyboardType="phone-pad"
            value={contactPhone}
            onChangeText={setContactPhone}
          />
          <Button title="Siguiente" onPress={() => setStep(3)} />
        </>
      )}

      {step === 3 && (
        <>
          <H2>¿Desde cuándo llevas sin verla?</H2>
          <P muted>Si empiezas hoy, deja 0. Si ya llevas algunos días, indícalo.</P>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {['0', '1', '3', '7', '14', '30'].map((d) => (
              <Chip key={d} label={d === '0' ? 'Hoy' : `${d} días`} active={daysAgo === d} onPress={() => setDaysAgo(d)} />
            ))}
          </View>
          <TextInput
            style={inputStyle}
            keyboardType="number-pad"
            value={daysAgo}
            onChangeText={(t) => setDaysAgo(t.replace(/\D/g, ''))}
          />
          <Card style={{ backgroundColor: C.goldSoft, borderColor: C.gold }}>
            <P>
              Ofrece este camino a Dios. Una oración para empezar: «Señor, no puedo solo. Dame tu gracia y enséñame a
              usar los medios. María, Madre mía, acompáñame».
            </P>
          </Card>
          <Button title="Comenzar mi camino" kind="gold" onPress={finish} />
        </>
      )}

      {step > 0 && <Button title="Atrás" kind="ghost" onPress={() => setStep(step - 1)} />}
    </Screen>
  );
}
