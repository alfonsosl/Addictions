import Svg, { Circle, Path } from 'react-native-svg';

// Iconos de línea fina para la barra de pestañas.
export type IconName = 'home' | 'book' | 'candle' | 'mountain' | 'compass';

export function Icon({ name, color, size = 24 }: { name: IconName; color: string; size?: number }) {
  const p = { stroke: color, strokeWidth: 1.7, fill: 'none', strokeLinecap: 'round', strokeLinejoin: 'round' } as const;
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      {name === 'home' && (
        <>
          <Path d="M3.5 10.5 12 3.5l8.5 7" {...p} />
          <Path d="M5.5 9v11h13V9" {...p} />
          <Path d="M12 12.5v5M9.8 14.6h4.4" {...p} />
        </>
      )}
      {name === 'book' && (
        <>
          <Path d="M12 6.5C10 5 7 4.5 3.5 5v13.5C7 18 10 18.5 12 20c2-1.5 5-2 8.5-1.5V5C17 4.5 14 5 12 6.5Z" {...p} />
          <Path d="M12 6.5V20" {...p} />
        </>
      )}
      {name === 'candle' && (
        <>
          <Path d="M12 3c-1.6 2-2.2 3.3-2.2 4.4A2.2 2.2 0 0 0 12 9.6a2.2 2.2 0 0 0 2.2-2.2C14.2 6.3 13.6 5 12 3Z" {...p} />
          <Path d="M9 12h6v8.5H9z" {...p} />
          <Path d="M6.5 20.5h11" {...p} />
        </>
      )}
      {name === 'mountain' && (
        <>
          <Path d="M2.5 19.5 9 8.5l4 6.5 2.5-3.5 6 8H2.5Z" {...p} />
          <Path d="M17 3.5v4M15 5.5h4" {...p} />
        </>
      )}
      {name === 'compass' && (
        <>
          <Circle cx="12" cy="12" r="8.5" {...p} />
          <Path d="m15.5 8.5-2 5-5 2 2-5 5-2Z" {...p} />
        </>
      )}
    </Svg>
  );
}
