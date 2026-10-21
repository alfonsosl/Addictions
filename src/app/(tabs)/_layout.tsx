import { Redirect } from 'expo-router';
import { Tabs } from 'expo-router/js-tabs';
import { ActivityIndicator, View } from 'react-native';
import { Icon, type IconName } from '../../components/icons';
import { C } from '../../components/ui';
import { useStore } from '../../lib/store';

function icon(name: IconName) {
  return function TabIcon({ focused }: { focused: boolean }) {
    return <Icon name={name} color={focused ? C.navy : C.muted} />;
  };
}

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
        tabBarStyle: { backgroundColor: C.bg, borderTopColor: C.line, elevation: 0 },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        sceneStyle: { backgroundColor: C.bg },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Inicio', tabBarIcon: icon('home') }} />
      <Tabs.Screen name="evangelio" options={{ title: 'Evangelio', tabBarIcon: icon('book') }} />
      <Tabs.Screen name="rezar" options={{ title: 'Rezar', tabBarIcon: icon('candle') }} />
      <Tabs.Screen name="camino" options={{ title: 'Camino', tabBarIcon: icon('mountain') }} />
      <Tabs.Screen name="ayuda" options={{ title: 'Ayuda', tabBarIcon: icon('compass') }} />
    </Tabs>
  );
}
