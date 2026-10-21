import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { MISSIONS } from '../content/missions';
import * as G from './game';

const KEY = 'vigilia:state:v1';

type Actions = {
  start: (profile: G.Profile, streakStart: Date) => void;
  updateProfile: (profile: G.Profile) => void;
  toggleMission: (missionId: string) => void;
  markReading: () => void;
  addVictory: () => void;
  relapse: (triggers: string[], note: string) => void;
  addConfession: () => void;
  saveExamen: (e: { gratitude: string; struggle: string; resolution: string }) => void;
  resetAll: () => void;
};

type Ctx = { state: G.State; now: Date; ready: boolean; today: string } & Actions;

const StoreContext = createContext<Ctx | null>(null);

function ensureMission(s: G.State, key: string, id: string): G.State {
  if ((s.missionsByDate[key] ?? []).includes(id)) return s;
  const m = MISSIONS.find((x) => x.id === id)!;
  return G.toggleMission(s, key, id, m.reward, MISSIONS.length);
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<G.State>(G.initialState);
  const [ready, setReady] = useState(false);
  const [now, setNow] = useState(() => new Date());
  const loaded = useRef(false);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(KEY);
        if (raw) setState(G.tick({ ...G.initialState, ...JSON.parse(raw) }, new Date()));
      } catch {}
      loaded.current = true;
      setReady(true);
    })();
  }, []);

  // Reloj: refresca el contador cada minuto y acredita días nuevos.
  useEffect(() => {
    const id = setInterval(() => {
      const n = new Date();
      setNow(n);
      setState((s) => G.tick(s, n));
    }, 60_000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!loaded.current) return;
    AsyncStorage.setItem(KEY, JSON.stringify(state)).catch(() => {});
  }, [state]);

  const today = G.dateKey(now);

  const update = useCallback((fn: (s: G.State, n: Date) => G.State) => {
    const n = new Date();
    setNow(n);
    setState((s) => fn(G.tick(s, n), n));
  }, []);

  const actions: Actions = useMemo(
    () => ({
      start: (profile, streakStart) =>
        update(() => G.tick({ ...G.initialState, profile, streakStart: streakStart.toISOString() }, new Date())),
      updateProfile: (profile) => update((s) => ({ ...s, profile })),
      toggleMission: (id) =>
        update((s, n) => {
          const m = MISSIONS.find((x) => x.id === id)!;
          return G.toggleMission(s, G.dateKey(n), id, m.reward, MISSIONS.length);
        }),
      markReading: () => update((s, n) => ensureMission(G.markReading(s, G.dateKey(n)), G.dateKey(n), 'evangelio')),
      addVictory: () => update((s, n) => G.addVictory(s, n)),
      relapse: (triggers, note) => update((s, n) => G.relapse(s, n, triggers, note)),
      addConfession: () => update((s, n) => G.addConfession(s, n)),
      saveExamen: (e) => update((s, n) => ensureMission(G.saveExamen(s, G.dateKey(n), e), G.dateKey(n), 'examen')),
      resetAll: () => {
        setState(G.initialState);
      },
    }),
    [update],
  );

  const value = useMemo(() => ({ state, now, ready, today, ...actions }), [state, now, ready, today, actions]);
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): Ctx {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore fuera de StoreProvider');
  return ctx;
}
