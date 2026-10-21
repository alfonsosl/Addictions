import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Platform } from 'react-native';
import { MISSIONS } from '../content/missions';
import { virtueById } from '../content/virtues';
import * as G from './game';

const KEY = 'vigilia:state:v1';

export type Toast = { id: number; icon: string; text: string };

type Actions = {
  start: (profile: G.Profile, streakStart: Date) => void;
  updateProfile: (profile: G.Profile) => void;
  toggleMission: (missionId: string) => void;
  markReading: () => void;
  markChapter: (chapterId: string) => void;
  addVictory: () => void;
  relapse: (triggers: string[], note: string) => void;
  addConfession: () => void;
  saveExamen: (e: G.Examen) => void;
  setVirtueFocus: (virtueId: string, on: boolean) => void;
  toggleVirtueAction: (virtueId: string, actionId: string) => void;
  logVirtue: (virtueId: string, actionId: string, dateKey?: string) => void;
  resetAll: () => void;
  dismissBadge: () => void;
};

type Ctx = {
  state: G.State;
  now: Date;
  ready: boolean;
  today: string;
  toast: Toast | null;
  newBadge: G.Badge | null; // insignia recién conseguida (para celebrarla)
} & Actions;

const StoreContext = createContext<Ctx | null>(null);

function ensureMission(s: G.State, key: string, id: string): G.State {
  if ((s.missionsByDate[key] ?? []).includes(id)) return s;
  const m = MISSIONS.find((x) => x.id === id)!;
  return G.toggleMission(s, key, id, m.reward, MISSIONS.length);
}

export function haptic(kind: 'light' | 'success' | 'heavy' = 'light') {
  if (Platform.OS === 'web') return;
  const p =
    kind === 'success'
      ? Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
      : Haptics.impactAsync(kind === 'heavy' ? Haptics.ImpactFeedbackStyle.Heavy : Haptics.ImpactFeedbackStyle.Light);
  p.catch(() => {});
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<G.State>(G.initialState);
  const [ready, setReady] = useState(false);
  const [now, setNow] = useState(() => new Date());
  const [toast, setToast] = useState<Toast | null>(null);
  const [newBadge, setNewBadge] = useState<G.Badge | null>(null);
  const loaded = useRef(false);
  const stateRef = useRef(state);
  useEffect(() => {
    stateRef.current = state;
  }, [state]);
  const prevBest = useRef<number | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((icon: string, text: string) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ id: Date.now(), icon, text });
    toastTimer.current = setTimeout(() => setToast(null), 2600);
  }, []);

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
    // Detecta insignias nuevas para celebrarlas.
    if (prevBest.current !== null && state.bestStreakDays > prevBest.current) {
      const gained = G.BADGES.filter((b) => b.days > prevBest.current! && b.days <= state.bestStreakDays).pop();
      if (gained) {
        setNewBadge(gained);
        haptic('success');
      }
    }
    prevBest.current = state.bestStreakDays;
  }, [state]);

  const today = G.dateKey(now);

  const update = useCallback(
    (fn: (s: G.State, n: Date) => G.State, reward?: { icon: string; text: string }) => {
      const n = new Date();
      setNow(n);
      setState((s) => fn(G.tick(s, n), n));
      if (reward) {
        showToast(reward.icon, reward.text);
        haptic('success');
      }
    },
    [showToast],
  );

  const actions: Actions = useMemo(
    () => ({
      start: (profile, streakStart) => {
        prevBest.current = null; // no celebrar los días previos declarados en el registro
        update(() => G.tick({ ...G.initialState, profile, streakStart: streakStart.toISOString() }, new Date()));
      },
      updateProfile: (profile) => update((s) => ({ ...s, profile }), { icon: '✓', text: 'Cambios guardados' }),
      toggleMission: (id) => {
        const m = MISSIONS.find((x) => x.id === id)!;
        const added = !(stateRef.current.missionsByDate[G.dateKey(new Date())] ?? []).includes(id);
        update((s, n) => G.toggleMission(s, G.dateKey(n), id, m.reward, MISSIONS.length));
        haptic('light');
        if (added) showToast(m.icon, `${m.title} · +${m.reward} talentos`);
      },
      markReading: () =>
        update((s, n) => ensureMission(G.markReading(s, G.dateKey(n)), G.dateKey(n), 'evangelio'), {
          icon: '📖',
          text: `Palabra meditada · +${G.REWARDS.reading} talentos`,
        }),
      markChapter: (cid) =>
        update((s) => G.markChapter(s, cid), { icon: '📖', text: `Capítulo leído · +${G.REWARDS.chapter} talentos` }),
      addVictory: () =>
        update((s, n) => G.addVictory(s, n), {
          icon: '✝️',
          text: `¡Tentación vencida! +${G.REWARDS.victory} talentos`,
        }),
      relapse: (triggers, note) => update((s, n) => G.relapse(s, n, triggers, note)),
      addConfession: () =>
        update((s, n) => G.addConfession(s, n), {
          icon: '🕊️',
          text: `Has vuelto a casa · +${G.REWARDS.confession} talentos`,
        }),
      saveExamen: (e) =>
        update((s, n) => ensureMission(G.saveExamen(s, G.examenKey(n), { ...e, at: n.toISOString() }), G.examenKey(n), 'examen'), {
          icon: '🌙',
          text: 'Examen guardado. Descansa en paz.',
        }),
      setVirtueFocus: (vid, on) => {
        const v = virtueById(vid);
        if (!v) return;
        update(
          (s, n) => G.setVirtueFocus(s, vid, on, v.actions.map((a) => a.id), G.dateKey(n)),
          on ? { icon: 'sprout', text: `Empiezas a crecer en ${v.name.toLowerCase()}` } : undefined,
        );
      },
      toggleVirtueAction: (vid, aid) => {
        update((s) => G.toggleVirtueAction(s, vid, aid));
        haptic('light');
      },
      logVirtue: (vid, aid, key) => {
        const k = key ?? G.dateKey(new Date());
        const added = !(stateRef.current.virtueLog[k] ?? []).includes(`${vid}:${aid}`);
        update((s) => G.logVirtue(s, k, vid, aid));
        if (added) {
          const a = virtueById(vid)?.actions.find((x) => x.id === aid);
          showToast('sprout', `${a?.text ?? 'Propósito'} · +${G.REWARDS.virtue}`);
          haptic('success');
        } else haptic('light');
      },
      resetAll: () => {
        prevBest.current = null;
        setState(G.initialState);
      },
      dismissBadge: () => setNewBadge(null),
    }),
    [update, showToast],
  );

  const value = useMemo(
    () => ({ state, now, ready, today, toast, newBadge, ...actions }),
    [state, now, ready, today, toast, newBadge, actions],
  );
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): Ctx {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore fuera de StoreProvider');
  return ctx;
}
