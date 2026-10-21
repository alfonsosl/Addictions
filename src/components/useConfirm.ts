import { useEffect, useRef, useState } from 'react';
import { haptic } from '../lib/store';

/**
 * Confirmación visual antes de actuar: al pulsar, el botón cambia (✓) durante un instante
 * y después se ejecuta la acción. `celebrate` alarga la pausa y vibra como un "hecho".
 */
export function useConfirm(celebrate = false) {
  const [flashing, setFlashing] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);
  const run = (fn: () => void) => {
    if (flashing) return;
    setFlashing(true);
    haptic(celebrate ? 'success' : 'light');
    timer.current = setTimeout(
      () => {
        setFlashing(false);
        fn();
      },
      celebrate ? 650 : 200,
    );
  };
  return { flashing, run };
}
