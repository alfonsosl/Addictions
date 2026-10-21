import { Link } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { C, Card, Chip, H1, H2, Label, P, Screen } from '../../components/ui';
import { PRAYERS } from '../../content/prayers';
import { REFLECTIONS } from '../../content/reflections';
import { STRATEGIES } from '../../content/strategies';

type Tab = 'estrategias' | 'oraciones' | 'reflexiones';

export default function Arsenal() {
  const [tab, setTab] = useState<Tab>('estrategias');
  const [open, setOpen] = useState<string | null>(null);
  const toggle = (id: string) => setOpen(open === id ? null : id);

  return (
    <Screen>
      <H1>Arsenal</H1>
      <P muted>«Revestíos de la armadura de Dios» (Ef 6,11). Medios espirituales y estrategias con respaldo.</P>
      <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
        <Chip label="🧠 Estrategias" active={tab === 'estrategias'} onPress={() => setTab('estrategias')} />
        <Chip label="🙏 Oraciones" active={tab === 'oraciones'} onPress={() => setTab('oraciones')} />
        <Chip label="✨ Reflexiones" active={tab === 'reflexiones'} onPress={() => setTab('reflexiones')} />
      </View>

      {tab === 'estrategias' &&
        STRATEGIES.map((s) => (
          <Pressable key={s.id} onPress={() => toggle(s.id)}>
            <Card>
              <H2>
                {s.icon} {s.title}
              </H2>
              <P muted>{s.summary}</P>
              {open === s.id && (
                <>
                  {s.steps.map((st, i) => (
                    <P key={i}>
                      {i + 1}. {st}
                    </P>
                  ))}
                  <View style={{ backgroundColor: C.bg, borderRadius: 12, padding: 10 }}>
                    <Label>Fundamento</Label>
                    <Text style={{ color: C.muted, fontSize: 14, lineHeight: 20 }}>{s.evidence}</Text>
                  </View>
                </>
              )}
            </Card>
          </Pressable>
        ))}

      {tab === 'oraciones' &&
        PRAYERS.map((p) => (
          <Pressable key={p.id} onPress={() => toggle(p.id)}>
            <Card>
              <H2>{p.title}</H2>
              <P muted>{p.when}</P>
              {open === p.id && <P style={{ fontStyle: 'italic' }}>{p.text}</P>}
            </Card>
          </Pressable>
        ))}

      {tab === 'reflexiones' &&
        REFLECTIONS.map((r) => (
          <Link key={r.id} href={{ pathname: '/reflexion/[id]', params: { id: r.id } }} asChild>
            <Pressable>
              <Card>
                <H2>{r.title}</H2>
                <P muted>
                  «{r.quote}» ({r.source})
                </P>
              </Card>
            </Pressable>
          </Link>
        ))}
    </Screen>
  );
}
