import type { ComponentProps } from 'react';
import {
  StyleSheet,
  Text as RNText,
  TextInput as RNTextInput,
  type TextStyle,
} from 'react-native';

// Tipografías (empaquetadas en la app, funcionan sin conexión):
// - Jost: sans fina y limpia para la interfaz.
// - EB Garamond: serif clásica para el Evangelio, oraciones y citas.
export const FONTS = {
  light: 'Jost_300Light',
  regular: 'Jost_400Regular',
  medium: 'Jost_500Medium',
  semibold: 'Jost_600SemiBold',
  serif: 'EBGaramond_400Regular',
  serifItalic: 'EBGaramond_400Regular_Italic',
  serifMedium: 'EBGaramond_500Medium',
  serifMediumItalic: 'EBGaramond_500Medium_Italic',
  serifSemibold: 'EBGaramond_600SemiBold',
};

/** Marca para pedir la serif en un estilo: `fontFamily: serif`. */
export const serif = FONTS.serif;

function weightOf(w: TextStyle['fontWeight']): number {
  if (w === 'bold') return 700;
  if (w === 'normal' || w == null) return 400;
  return typeof w === 'number' ? w : parseInt(w, 10) || 400;
}

/** Elige el archivo de fuente según peso, cursiva y familia (con fuentes propias, fontWeight no basta en Android). */
export function familyFor(style: TextStyle | undefined): string {
  const w = weightOf(style?.fontWeight);
  const italic = style?.fontStyle === 'italic';
  if (style?.fontFamily?.startsWith('EBGaramond')) {
    if (w >= 600) return FONTS.serifSemibold;
    if (w >= 500) return italic ? FONTS.serifMediumItalic : FONTS.serifMedium;
    return italic ? FONTS.serifItalic : FONTS.serif;
  }
  if (w >= 600) return FONTS.semibold;
  if (w >= 500) return FONTS.medium;
  if (w <= 300) return FONTS.light;
  return FONTS.regular;
}

export function Text({ style, ...rest }: ComponentProps<typeof RNText>) {
  const f = StyleSheet.flatten(style) as TextStyle | undefined;
  return <RNText {...rest} style={[style, { fontFamily: familyFor(f), fontWeight: 'normal' }]} />;
}

export function TextInput({ style, ...rest }: ComponentProps<typeof RNTextInput>) {
  const f = StyleSheet.flatten(style) as TextStyle | undefined;
  return <RNTextInput {...rest} style={[style, { fontFamily: familyFor(f), fontWeight: 'normal' }]} />;
}
