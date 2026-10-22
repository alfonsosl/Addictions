import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LAUNCH_VERSE_KEY } from '../components/LaunchVerse';
import { THEME_OPTIONS, useTheme } from '../lib/theme';
import { useEffect, useState } from 'react';
import { Alert, Platform, Switch, View } from 'react-native';
import { Pressable } from '../components/Tap';
import { Text, TextInput } from '../components/Text';
import { Button, C, Card, H2, inputStyle, Label, P, Screen } from '../components/ui';
import { FONT_SCALES, useFont } from '../lib/fontScale';
import type { Profile } from '../lib/game';
import { useReminders, type Reminder } from '../lib/notifications';
import { useStore } from '../lib/store';

export default function Ajustes() {
  const { state, updateProfile, resetAll } = useStore();
  const [p, setP] = useState<Profile>(
    state.profile ?? { name: '', why: '', contactName: '', contactPhone: '', ifThen: [] },
  );
  const set = (k: keyof Profile, v: any) => setP((x) => ({ ...x, [k]: v }));
  const font = useFont();
  const reminders = useReminders();
  const theme = useTheme();
  const [launchVerse, setLaunchVerse] = useState(true);
  useEffect(() => {
    AsyncStorage.getItem(LAUNCH_VERSE_KEY)
      .then((v) => setLaunchVerse(v !== 'off'))
      .catch(() => {});
  }, []);
  const toggleLaunchVerse = (on: boolean) => {
    setLaunchVerse(on);
    AsyncStorage.setItem(LAUNCH_VERSE_KEY, on ? 'on' : 'off').catch(() => {});
  };

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
        <Label>Tamaño de letra</Label>
        <View style={{ flexDirection: 'row', gap: 8, alignItems: 'flex-end' }}>
          {FONT_SCALES.map((f, i) => {
            const on = font.idx === i;
            return (
              <Pressable
                key={f.label}
                accessibilityRole="radio"
                accessibilityState={{ selected: on }}
                accessibilityLabel={`Letra ${f.label}`}
                onPress={() => font.setIdx(i)}
                style={{
                  flex: 1,
                  height: 56,
                  borderRadius: 14,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderWidth: 1,
                  borderColor: on ? C.navy : C.line,
                  backgroundColor: on ? C.navy : C.card,
                }}
              >
                <Text style={{ fontSize: Math.round(16 * f.scale), fontWeight: '700', color: on ? C.onNavy : C.navy }}>A</Text>
              </Pressable>
            );
          })}
        </View>
        <P muted style={{ fontSize: 14 }}>
          {FONT_SCALES[font.idx].label} · Se aplica a toda la app, también al lector del Evangelio.
        </P>
        <P>«Lámpara es tu palabra para mis pasos, luz en mi sendero» (Sal 119,105).</P>
      </Card>

      <Card>
        <Label>Apariencia</Label>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {THEME_OPTIONS.map((o) => {
            const on = theme.pref === o.value;
            return (
              <Pressable
                key={o.value}
                accessibilityRole="radio"
                accessibilityState={{ selected: on }}
                onPress={() => theme.setPref(o.value)}
                style={{
                  flexBasis: '47%',
                  flexGrow: 1,
                  borderRadius: 14,
                  padding: 12,
                  borderWidth: 1,
                  borderColor: on ? C.navy : C.line,
                  backgroundColor: on ? C.navy : C.card,
                  gap: 2,
                }}
              >
                <Text style={{ fontSize: 15, color: on ? C.onNavy : C.ink }}>{o.label}</Text>
                <Text style={{ fontSize: 12, fontWeight: '300', color: on ? C.onNavy : C.muted }}>{o.hint}</Text>
              </Pressable>
            );
          })}
        </View>
        <P muted style={{ fontSize: 13 }}>
          El modo oscuro usa tonos cálidos y suaves, sin blancos puros, para leer de noche sin cansar la vista.
        </P>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingTop: 6 }}>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 16, color: C.ink }}>Versículo al abrir la app</Text>
            <Text style={{ fontSize: 13, color: C.muted, fontWeight: '300' }}>Una palabra de Dios cada vez que entras</Text>
          </View>
          <Switch
            accessibilityLabel="Versículo al abrir la app"
            value={launchVerse}
            onValueChange={toggleLaunchVerse}
            trackColor={{ true: C.navy, false: C.line }}
            thumbColor={C.card}
          />
        </View>
      </Card>

      <Card>
        <Label>Recordatorios</Label>
        {reminders.supported ? (
          <>
            <ReminderRow
              title="Evangelio del día"
              subtitle="Cada día, para leer y meditar"
              value={reminders.settings.gospel}
              onChange={(patch) => reminders.update('gospel', patch)}
            />
            <ReminderRow
              title="Examen de la noche"
              subtitle="Antes de dormir"
              value={reminders.settings.examen}
              onChange={(patch) => reminders.update('examen', patch)}
            />
            {reminders.denied && (
              <P style={{ color: C.red, fontSize: 14 }}>
                Las notificaciones están desactivadas para Vigilia. Actívalas en los ajustes del teléfono.
              </P>
            )}
            <P muted style={{ fontSize: 13 }}>Se programan en el propio teléfono: funcionan sin conexión.</P>
          </>
        ) : (
          <P muted style={{ fontSize: 14 }}>Los recordatorios funcionan en la app del móvil (Android o iPhone).</P>
        )}
      </Card>

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

      <Button title="Guardar" confirm="Guardado" celebrate kind="gold" onPress={save} />

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

const pad = (n: number) => String(n).padStart(2, '0');

function ReminderRow({
  title,
  subtitle,
  value,
  onChange,
}: {
  title: string;
  subtitle: string;
  value: Reminder;
  onChange: (patch: Partial<Reminder>) => void;
}) {
  const step = (d: number) => {
    const total = (value.hour * 60 + value.minute + d + 24 * 60) % (24 * 60);
    onChange({ hour: Math.floor(total / 60), minute: total % 60 });
  };
  return (
    <View style={{ paddingVertical: 8, gap: 8 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 16, color: C.ink }}>{title}</Text>
          <Text style={{ fontSize: 13, color: C.muted, fontWeight: '300' }}>{subtitle}</Text>
        </View>
        <Switch
          accessibilityLabel={`Recordatorio: ${title}`}
          value={value.on}
          onValueChange={(on) => onChange({ on })}
          trackColor={{ true: C.navy, false: C.line }}
          thumbColor={C.card}
        />
      </View>
      {value.on && (
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
          <Pressable onPress={() => step(-15)} accessibilityLabel="15 minutos antes" style={[timeBtn, { borderColor: C.line }]}>
            <Text style={{ fontSize: 20, color: C.navy }}>−</Text>
          </Pressable>
          <Text style={{ fontSize: 28, fontWeight: '300', color: C.ink, minWidth: 90, textAlign: 'center' }}>
            {pad(value.hour)}:{pad(value.minute)}
          </Text>
          <Pressable onPress={() => step(15)} accessibilityLabel="15 minutos después" style={[timeBtn, { borderColor: C.line }]}>
            <Text style={{ fontSize: 20, color: C.navy }}>+</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const timeBtn = {
  width: 40,
  height: 40,
  borderRadius: 20,
  borderWidth: 1,
  alignItems: 'center',
  justifyContent: 'center',
} as const;
