import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Platform, Pressable, Text, TextInput, View } from 'react-native';
import { Button, C, Card, H2, inputStyle, Label, P, Screen } from '../components/ui';
import type { Profile } from '../lib/game';
import { useStore } from '../lib/store';

export default function Ajustes() {
  const { state, updateProfile, resetAll } = useStore();
  const [p, setP] = useState<Profile>(
    state.profile ?? { name: '', why: '', contactName: '', contactPhone: '', ifThen: [] },
  );
  const set = (k: keyof Profile, v: any) => setP((x) => ({ ...x, [k]: v }));

  const save = () => {
    updateProfile({ ...p, ifThen: p.ifThen.filter((x) => x.when.trim() || x.then.trim()) });
    router.back();
  };

  const confirmReset = () => {
    const doIt = () => {
      resetAll();
      router.replace('/onboarding');
    };
    if (Platform.OS === 'web') {
      if (globalThis.confirm?.('¿Borrar todos los datos? No se puede deshacer.')) doIt();
    } else {
      Alert.alert('Borrar todos los datos', 'No se puede deshacer.', [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Borrar', style: 'destructive', onPress: doIt },
      ]);
    }
  };

  return (
    <Screen edges={['left', 'right', 'bottom']}>
      <Card>
        <Label>Nombre</Label>
        <TextInput style={inputStyle} value={p.name} onChangeText={(v) => set('name', v)} />
        <Label>Mi porqué</Label>
        <TextInput
          style={[inputStyle, { minHeight: 90, textAlignVertical: 'top' }]}
          multiline
          value={p.why}
          onChangeText={(v) => set('why', v)}
        />
      </Card>

      <Card>
        <Label>Compañero de camino</Label>
        <TextInput style={inputStyle} placeholder="Nombre" value={p.contactName} onChangeText={(v) => set('contactName', v)} />
        <TextInput
          style={inputStyle}
          placeholder="Teléfono"
          keyboardType="phone-pad"
          value={p.contactPhone}
          onChangeText={(v) => set('contactPhone', v)}
        />
      </Card>

      <Card>
        <H2>Mis planes «si… entonces…»</H2>
        <P muted style={{ fontSize: 14 }}>Decide ahora qué harás en tus momentos de riesgo. Repásalos cada mañana.</P>
        {p.ifThen.map((x, i) => (
          <View key={i} style={{ borderTopWidth: i ? 1 : 0, borderTopColor: C.line, paddingTop: i ? 10 : 0 }}>
            <Text style={{ fontWeight: '700', color: C.navy }}>Si…</Text>
            <TextInput
              style={inputStyle}
              value={x.when}
              onChangeText={(v) => set('ifThen', p.ifThen.map((y, j) => (j === i ? { ...y, when: v } : y)))}
            />
            <Text style={{ fontWeight: '700', color: C.navy }}>entonces…</Text>
            <TextInput
              style={inputStyle}
              value={x.then}
              onChangeText={(v) => set('ifThen', p.ifThen.map((y, j) => (j === i ? { ...y, then: v } : y)))}
            />
            <Pressable onPress={() => set('ifThen', p.ifThen.filter((_, j) => j !== i))}>
              <Text style={{ color: C.red, marginBottom: 6 }}>Eliminar</Text>
            </Pressable>
          </View>
        ))}
        <Button title="+ Añadir plan" kind="ghost" onPress={() => set('ifThen', [...p.ifThen, { when: '', then: '' }])} />
      </Card>

      <Button title="Guardar" kind="gold" onPress={save} />

      <Card>
        <Label>Privacidad</Label>
        <P muted style={{ fontSize: 14 }}>
          Todos tus datos están solo en este dispositivo. Vigilia no usa cuentas ni envía información a ningún servidor
          (salvo la descarga de las lecturas del día).
        </P>
        <Button title="Borrar todos los datos" kind="danger" onPress={confirmReset} />
      </Card>
    </Screen>
  );
}
