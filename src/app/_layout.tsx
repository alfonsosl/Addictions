import { EBGaramond_400Regular, EBGaramond_400Regular_Italic, EBGaramond_500Medium, EBGaramond_500Medium_Italic, EBGaramond_600SemiBold } from '@expo-google-fonts/eb-garamond';
import { Jost_300Light, Jost_400Regular, Jost_500Medium, Jost_600SemiBold } from '@expo-google-fonts/jost';
import { useFonts } from 'expo-font';
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
  const [fontsLoaded, fontError] = useFonts({
    Jost_300Light,
    Jost_400Regular,
    Jost_500Medium,
    Jost_600SemiBold,
    EBGaramond_400Regular,
    EBGaramond_400Regular_Italic,
    EBGaramond_500Medium,
    EBGaramond_500Medium_Italic,
    EBGaramond_600SemiBold,
  });
  // Las fuentes van dentro de la app: cargan al instante y sin conexión. Si fallaran, se usa la del sistema.
  if (!fontsLoaded && !fontError) return <View style={{ flex: 1, backgroundColor: C.bg }} />;
  return (
    <SafeAreaProvider>
      <ThemeProvider>
      <FontScaleProvider>
      <StoreProvider>
        <RootStack />
        <ToastHost />
        <BadgeCelebration />
        <StreakWelcome />
        <NotificationRouter />
      </StoreProvider>
      </FontScaleProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

/** Navegación principal. Va en su propio componente para leer los colores del tema actual. */
function RootStack() {
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
    </>
  );
}
