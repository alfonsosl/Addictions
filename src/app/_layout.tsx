import { useFonts } from 'expo-font';
import { useState } from 'react';
import { LaunchVerse } from '../components/LaunchVerse';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { BadgeCelebration, ToastHost } from '../components/overlays';
import { StreakWelcome } from '../components/StreakWelcome';
import { C } from '../components/ui';
import { NotificationRouter } from '../lib/notifications';
import { FontScaleProvider } from '../lib/fontScale';
import { ThemeProvider, themeIsDark } from '../lib/theme';
import { StoreProvider } from '../lib/store';

export default function RootLayout() {
  // Tipografías reducidas a los caracteres que usa la app (scripts/fonts/subset.py): ~460 KB en total.
  const [fontsLoaded, fontError] = useFonts({
    Jost_300Light: require('../../assets/fonts/Jost_300Light.ttf'),
    Jost_400Regular: require('../../assets/fonts/Jost_400Regular.ttf'),
    Jost_500Medium: require('../../assets/fonts/Jost_500Medium.ttf'),
    Jost_600SemiBold: require('../../assets/fonts/Jost_600SemiBold.ttf'),
    EBGaramond_400Regular: require('../../assets/fonts/EBGaramond_400Regular.ttf'),
    EBGaramond_400Regular_Italic: require('../../assets/fonts/EBGaramond_400Regular_Italic.ttf'),
    EBGaramond_500Medium: require('../../assets/fonts/EBGaramond_500Medium.ttf'),
    EBGaramond_500Medium_Italic: require('../../assets/fonts/EBGaramond_500Medium_Italic.ttf'),
    EBGaramond_600SemiBold: require('../../assets/fonts/EBGaramond_600SemiBold.ttf'),
  });
  // Las fuentes van dentro de la app: cargan al instante y sin conexión. Si fallaran, se usa la del sistema.
  if (!fontsLoaded && !fontError) return <View style={{ flex: 1, backgroundColor: C.bg }} />;
  return (
    <SafeAreaProvider>
      <ThemeProvider>
      <FontScaleProvider>
      <StoreProvider>
        <RootStack />
      </StoreProvider>
      </FontScaleProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

/** Navegación principal. Va en su propio componente para leer los colores del tema actual. */
function RootStack() {
  // Primero el versículo de inicio; después, si toca, el aviso de racha.
  const [launched, setLaunched] = useState(false);
  return (
    <>
      <StatusBar style={themeIsDark() ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: C.bg },
          headerTitleStyle: { fontFamily: 'Jost_400Regular', fontSize: 17 },
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
        <Stack.Screen name="virtudes/index" options={{ title: 'Virtudes' }} />
        <Stack.Screen name="virtudes/[id]" options={{ title: 'Virtud' }} />
        <Stack.Screen name="galeria" options={{ title: 'Ilustraciones', headerTransparent: true, headerTitle: '' }} />
      </Stack>
      <ToastHost />
      <BadgeCelebration />
      <LaunchVerse onDone={() => setLaunched(true)} />
      {launched && <StreakWelcome />}
      <NotificationRouter />
    </>
  );
}
