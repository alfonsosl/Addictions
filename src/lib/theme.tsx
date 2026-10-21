import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, usePathname } from 'expo-router';
import { createContext, Fragment, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { setArtPalette } from '../components/art/primitives';

// Paletas. La clara imita el papel crema de las ilustraciones; la oscura es cálida,
// de bajo contraste y sin blancos puros, para leer de noche sin cansar la vista.
const LIGHT = {
  bg: '#EFEADB',
  card: '#F7F3E8',
  ink: '#1D2440',
  muted: '#857E6E',
  navy: '#1D2758',
  navySoft: '#2E6DB4',
  blue: '#2E6DB4',
  gold: '#9C7A45',
  goldSoft: '#E6DCC4',
  tan: '#C9B796',
  brown: '#7A5A35',
  red: '#B4442E',
  redSoft: '#F2DDD3',
  green: '#6B7D45',
  line: '#DBD2BE',
  night: '#1B2350',
  onNavy: '#FFFFFF', // texto sobre fondos azul marino
  onGold: '#1D2758',
  chip: '#F0ECE3', // fondo de controles segmentados y botones suaves
  overlay: 'rgba(247,243,232,0.95)', // barras y botones flotantes
  faint: '#C9C4B8',
};

const DARK: typeof LIGHT = {
  bg: '#121626',
  card: '#1A1F33',
  ink: '#DDD6C6',
  muted: '#968F80',
  navy: '#AFC0E6',
  navySoft: '#7FA3D6',
  blue: '#7FA3D6',
  gold: '#C2A26B',
  goldSoft: '#2C2C33',
  tan: '#8F8672',
  brown: '#A88B66',
  red: '#C0533C',
  redSoft: '#3A2422',
  green: '#8FA066',
  line: '#2C3248',
  night: '#0D1124',
  onNavy: '#121626',
  onGold: '#121626',
  chip: '#232940',
  overlay: 'rgba(26,31,51,0.96)',
  faint: '#4A5068',
};

export type Palette = typeof LIGHT;

/** Colores actuales. Es un objeto mutable: se actualiza al cambiar de tema. */
export const C: Palette = { ...LIGHT };

let version = 0;
let isDark = false;

export function applyTheme(dark: boolean) {
  if (dark === isDark && version > 0) return;
  isDark = dark;
  Object.assign(C, dark ? DARK : LIGHT);
  setArtPalette(dark);
  version++;
}
applyTheme(false);

export const themeIsDark = () => isDark;

/**
 * Hoja de estilos que se recalcula cuando cambia el tema.
 * Uso: `const styles = themed(() => StyleSheet.create({ ... }))`.
 */
export function themed<T extends object>(make: () => T): T {
  let cache: T | null = null;
  let v = -1;
  const cur = () => {
    if (!cache || v !== version) {
      cache = make();
      v = version;
    }
    return cache as Record<string | symbol, unknown>;
  };
  return new Proxy({} as T, {
    get: (_t, key) => cur()[key],
    has: (_t, key) => key in cur(),
    ownKeys: () => Reflect.ownKeys(cur()),
    getOwnPropertyDescriptor: (_t, key) => {
      const c = cur();
      return key in c ? { enumerable: true, configurable: true, writable: false, value: c[key] } : undefined;
    },
  });
}

// ---------- Preferencia del usuario ----------

export type ThemePref = 'system' | 'night' | 'light' | 'dark';
export const THEME_OPTIONS: { value: ThemePref; label: string; hint: string }[] = [
  { value: 'system', label: 'Automático', hint: 'Como el teléfono' },
  { value: 'night', label: 'Por la noche', hint: 'Oscuro de 21:00 a 7:00' },
  { value: 'light', label: 'Claro', hint: 'Siempre claro' },
  { value: 'dark', label: 'Oscuro', hint: 'Siempre oscuro' },
];

const KEY = 'vigilia:ui:theme';
const isNightHour = (d: Date) => d.getHours() >= 21 || d.getHours() < 7;

type Ctx = { pref: ThemePref; dark: boolean; setPref: (p: ThemePref) => void; toggle: () => void };
const ThemeContext = createContext<Ctx>({ pref: 'system', dark: false, setPref: () => {}, toggle: () => {} });

export function ThemeProvider({ children }: { children: ReactNode }) {
  const scheme = useColorScheme();
  const pathname = usePathname();
  const [pref, setPrefState] = useState<ThemePref | null>(null);
  const [night, setNight] = useState(() => isNightHour(new Date()));
  const lastPath = useRef(pathname);
  const shown = useRef<boolean | null>(null);

  useEffect(() => {
    lastPath.current = pathname;
  }, [pathname]);

  useEffect(() => {
    AsyncStorage.getItem(KEY)
      .then((v) => setPrefState((v as ThemePref) ?? 'system'))
      .catch(() => setPrefState('system'));
    const id = setInterval(() => setNight(isNightHour(new Date())), 60_000);
    return () => clearInterval(id);
  }, []);

  const p = pref ?? 'system';
  const dark = p === 'dark' || (p === 'night' && night) || (p === 'system' && scheme === 'dark');
  applyTheme(dark);

  // Al cambiar de tema se vuelve a montar la app (para recalcular todos los estilos)
  // y se regresa a la pantalla en la que estabas.
  useEffect(() => {
    if (shown.current !== null && shown.current !== dark) {
      const back = lastPath.current;
      if (back && back !== '/') setTimeout(() => router.push(back as never), 60);
    }
    shown.current = dark;
  }, [dark]);

  const value = useMemo<Ctx>(
    () => ({
      pref: p,
      dark,
      setPref: (np) => {
        setPrefState(np);
        AsyncStorage.setItem(KEY, np).catch(() => {});
      },
      toggle: () => {
        const np: ThemePref = dark ? 'light' : 'dark';
        setPrefState(np);
        AsyncStorage.setItem(KEY, np).catch(() => {});
      },
    }),
    [p, dark],
  );

  if (pref === null) return null;
  return (
    <ThemeContext.Provider value={value}>
      <Fragment key={dark ? 'dark' : 'light'}>{children}</Fragment>
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
