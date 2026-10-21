import { router } from 'expo-router';
import { Glyph } from '../../components/icons';
import { useState } from 'react';
import { Linking, View } from 'react-native';
import { Pressable } from '../../components/Tap';
import { Text } from '../../components/Text';
import { TabScreen } from '../../components/overlays';
import { Button, C, Card, H1, H2, Label, P } from '../../components/ui';
import { STRATEGIES } from '../../content/strategies';
import { useStore } from '../../lib/store';

export default function Ayuda() {
  const { state } = useStore();
  const [open, setOpen] = useState<string | null>(STRATEGIES[0].id);
  const plans = state.profile?.ifThen ?? [];

  return (
    <TabScreen>
      <H1>Ayuda</H1>
      <P muted>«Revestíos de la armadura de Dios» (Ef 6,11). Estrategias probadas, explicadas paso a paso.</P>

      <Card>
        <Label>Mis planes «si… entonces…»</Label>
        {plans.length ? (
          plans.map((p, i) => (
            <P key={i}>
              • Si {p.when}, entonces <Text style={{ fontWeight: '600' }}>{p.then}</Text>.
            </P>
          ))
        ) : (
          <P muted>Aún no tienes planes.</P>
        )}
        <Button title="Editar mis planes" kind="ghost" onPress={() => router.push('/ajustes')} />
      </Card>

      {STRATEGIES.map((s) => {
        const isOpen = open === s.id;
        return (
          <Pressable key={s.id} onPress={() => setOpen(isOpen ? null : s.id)}>
            <Card style={isOpen ? { borderColor: C.navy } : undefined}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <Glyph e={s.icon} size={26} color={C.navy} width={1.3} />
                <View style={{ flex: 1 }}>
                  <H2>{s.title}</H2>
                </View>
                <View style={{ transform: [{ rotate: isOpen ? '90deg' : '0deg' }] }}>
                  <Glyph e="chevron" size={18} color={C.muted} />
                </View>
              </View>
              <P muted>{s.summary}</P>
              {isOpen && (
                <>
                  {s.steps.map((st, i) => (
                    <View key={i} style={{ flexDirection: 'row', gap: 10 }}>
                      <Text style={{ color: C.gold, fontWeight: '500', fontSize: 16, width: 18 }}>{i + 1}</Text>
                      <P style={{ flex: 1 }}>{st}</P>
                    </View>
                  ))}
                  <View style={{ backgroundColor: C.bg, borderRadius: 12, padding: 10 }}>
                    <Label>Fundamento</Label>
                    <Text style={{ color: C.muted, fontSize: 14, lineHeight: 20 }}>{s.evidence}</Text>
                  </View>
                </>
              )}
            </Card>
          </Pressable>
        );
      })}

      <Card style={{ borderColor: C.red }}>
        <Label color={C.red}>Si estás en crisis</Label>
        <P>Si tienes ideas de hacerte daño, no estás solo: pide ayuda ahora.</P>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <Button title="Llamar al 024" kind="danger" onPress={() => Linking.openURL('tel:024')} style={{ flex: 1 }} />
          <Button title="Llamar al 112" kind="ghost" onPress={() => Linking.openURL('tel:112')} style={{ flex: 1 }} />
        </View>
        <Text style={{ color: C.muted, fontSize: 12 }}>024: línea de atención a la conducta suicida (España), gratuita, 24 h.</Text>
      </Card>

      <Button title="He caído — quiero levantarme" kind="ghost" onPress={() => router.push('/caida')} />
    </TabScreen>
  );
}
