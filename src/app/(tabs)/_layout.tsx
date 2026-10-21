import { Redirect } from 'expo-router';
import { Tabs } from 'expo-router/js-tabs';
import { ActivityIndicator, Text, View } from 'react-native';
import { C } from '../../components/ui';
import { useStore } from '../../lib/store';

const icon = (e: string) => ({ focused }: { focused: boolean }) => (
  <Text style={{ fontSize: 22, opacity: focused ? 1 : 0.55 }}>{e}</Text>
);

export default function TabsLayout() {
  const { ready, state } = useStore();
  if (!ready)
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: C.bg }}>
        <ActivityIndicator color={C.navy} />
      </View>
    );
  if (!state.profile) return <Redirect href="/onboarding" />;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: C.navy,
        tabBarInactiveTintColor: C.muted,
        tabBarStyle: { backgroundColor: '#fff', borderTopColor: C.line },
        sceneStyle: { backgroundColor: C.bg },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Inicio', tabBarIcon: icon('🏠') }} />
      <Tabs.Screen name="lecturas" options={{ title: 'Lecturas', tabBarIcon: icon('📖') }} />
      <Tabs.Screen name="camino" options={{ title: 'Camino', tabBarIcon: icon('⛰️') }} />
      <Tabs.Screen name="arsenal" options={{ title: 'Arsenal', tabBarIcon: icon('🛡️') }} />
    </Tabs>
  );
}
