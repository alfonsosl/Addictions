import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { StyleSheet, type StyleProp, type TextStyle } from 'react-native';

const KEY = 'vigilia:ui:font';
const OLD_READER_KEY = 'vigilia:reader:font'; // versión 1.0: solo el lector de Evangelios

export const FONT_SCALES = [
  { label: 'Pequeña', scale: 0.9 },
  { label: 'Normal', scale: 1 },
  { label: 'Grande', scale: 1.15 },
  { label: 'Muy grande', scale: 1.3 },
  { label: 'Máxima', scale: 1.5 },
];

type Ctx = { idx: number; scale: number; setIdx: (i: number) => void };
const FontContext = createContext<Ctx>({ idx: 1, scale: 1, setIdx: () => {} });

export function FontScaleProvider({ children }: { children: ReactNode }) {
  const [idx, setIdxState] = useState(1);

  useEffect(() => {
    (async () => {
      try {
        const v = (await AsyncStorage.getItem(KEY)) ?? (await AsyncStorage.getItem(OLD_READER_KEY));
        const n = parseInt(v ?? '', 10);
        if (!Number.isNaN(n)) setIdxState(Math.min(FONT_SCALES.length - 1, Math.max(0, n)));
      } catch {}
    })();
  }, []);

  const setIdx = useCallback((i: number) => {
    const n = Math.min(FONT_SCALES.length - 1, Math.max(0, i));
    setIdxState(n);
    AsyncStorage.setItem(KEY, String(n)).catch(() => {});
  }, []);

  const value = useMemo(() => ({ idx, scale: FONT_SCALES[idx].scale, setIdx }), [idx, setIdx]);
  return <FontContext.Provider value={value}>{children}</FontContext.Provider>;
}

/**
 * Tamaño de letra elegido en Ajustes.
 * - `fs(16)` → tamaño escalado.
 * - `t(style)` → el mismo estilo con fontSize y lineHeight escalados.
 */
export function useFont() {
  const ctx = useContext(FontContext);
  return useMemo(() => {
    const k = ctx.scale;
    const fs = (n: number) => Math.round(n * k);
    const t = (style: StyleProp<TextStyle>): TextStyle => {
      const f = StyleSheet.flatten(style) ?? {};
      return {
        ...f,
        ...(f.fontSize ? { fontSize: fs(f.fontSize) } : null),
        ...(f.lineHeight ? { lineHeight: fs(f.lineHeight) } : null),
      };
    };
    return { ...ctx, fs, t };
  }, [ctx]);
}
