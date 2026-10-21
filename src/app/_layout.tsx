import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { BadgeCelebration, ToastHost } from '../components/overlays';
import { C } from '../components/ui';
import { FontScaleProvider } from '../lib/fontScale';
import { StoreProvider } from '../lib/store';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <FontScaleProvider>
      <StoreProvider>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: C.bg },
            headerTintColor: C.navy,
            headerShadowVisible: false,
            contentStyle: { backgroundColor: C.bg },
            headerBackButtonDisplayMode: 'minimal',
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="onboarding" options={{ headerShown: false, gestureEnabled: false }} />
          <Stack.Screen name="panico" options={{ headerShown: false, presentation: 'fullScreenModal', animation: 'fade' }} />
          <Stack.Screen name="caida" options={{ title: 'Levántate', presentation: 'modal' }} />
          <Stack.Screen name="examen/index" options={{ title: 'Examen' }} />
          <Stack.Screen name="examen/guiado" options={{ headerShown: false, presentation: 'fullScreenModal', animation: 'fade' }} />
          <Stack.Screen name="ajustes" options={{ title: 'Ajustes' }} />
          <Stack.Screen name="reflexion/[id]" options={{ title: 'Reflexión' }} />
          <Stack.Screen name="sacerdote/[id]" options={{ title: 'Palabra de un pastor' }} />
          <Stack.Screen name="capitulo/[book]/[ch]" options={{ title: 'Evangelio' }} />
          <Stack.Screen name="oracion/[id]" options={{ title: 'Oración' }} />
        </Stack>
        <ToastHost />
        <BadgeCelebration />
      </StoreProvider>
      </FontScaleProvider>
    </SafeAreaProvider>
  );
}
