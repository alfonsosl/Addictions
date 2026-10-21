import { Redirect } from 'expo-router';
import { Tabs } from 'expo-router/js-tabs';
import { ActivityIndicator, Text, View } from 'react-native';
import { C } from '../../components/ui';
import { useStore } from '../../lib/store';

function TabIcon({ emoji, focused }: { emoji: string; focused: boolean }) {
  return <Text style={{ fontSize: focused ? 24 : 21, opacity: focused ? 1 : 0.5 }}>{emoji}</Text>;
}

function icon(emoji: string) {
  return function Icon({ focused }: { focused: boolean }) {
    return <TabIcon emoji={emoji} focused={focused} />;
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
        tabBarStyle: { backgroundColor: '#fff', borderTopColor: C.line },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '700' },
        sceneStyle: { backgroundColor: C.bg },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Inicio', tabBarIcon: icon('🏠') }} />
      <Tabs.Screen name="evangelio" options={{ title: 'Evangelio', tabBarIcon: icon('📖') }} />
      <Tabs.Screen name="rezar" options={{ title: 'Rezar', tabBarIcon: icon('🙏') }} />
      <Tabs.Screen name="camino" options={{ title: 'Camino', tabBarIcon: icon('⛰️') }} />
      <Tabs.Screen name="ayuda" options={{ title: 'Ayuda', tabBarIcon: icon('🧭') }} />
    </Tabs>
  );
}
