import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';

// Recordatorios locales (no hay servidor: se programan en el propio teléfono).
const KEY = 'vigilia:notif:v1';
const CHANNEL = 'recordatorios';
export const NOTIF_SUPPORTED = Platform.OS !== 'web';

export type Reminder = { on: boolean; hour: number; minute: number };
export type ReminderSettings = { gospel: Reminder; examen: Reminder };

export const DEFAULT_REMINDERS: ReminderSettings = {
  gospel: { on: false, hour: 8, minute: 0 },
  examen: { on: false, hour: 22, minute: 30 },
};

const CONTENT = {
  gospel: {
    id: 'vigilia-gospel',
    title: 'Tu Evangelio de hoy',
    body: 'Cinco minutos con Jesús: lee y medita la Palabra de hoy.',
    url: '/evangelio',
  },
  examen: {
    id: 'vigilia-examen',
    title: 'Examen de la noche',
    body: 'Diez minutos con Dios antes de dormir. Él te espera con misericordia.',
    url: '/examen',
  },
} as const;

if (NOTIF_SUPPORTED) {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });
}

async function ensurePermission(): Promise<boolean> {
  if (!NOTIF_SUPPORTED) return false;
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync(CHANNEL, {
      name: 'Recordatorios',
      // eslint-disable-next-line import/namespace -- se exporta con export *, el plugin no lo ve
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }
  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return true;
  if (!current.canAskAgain) return false;
  const asked = await Notifications.requestPermissionsAsync();
  return asked.granted;
}

/** Cancela y vuelve a programar los recordatorios diarios según los ajustes. */
async function applySchedule(s: ReminderSettings) {
  if (!NOTIF_SUPPORTED) return;
  for (const k of ['gospel', 'examen'] as const) {
    await Notifications.cancelScheduledNotificationAsync(CONTENT[k].id).catch(() => {});
    if (!s[k].on) continue;
    await Notifications.scheduleNotificationAsync({
      identifier: CONTENT[k].id,
      content: { title: CONTENT[k].title, body: CONTENT[k].body, data: { url: CONTENT[k].url } },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: s[k].hour,
        minute: s[k].minute,
        channelId: CHANNEL,
      },
    });
  }
}

async function load(): Promise<ReminderSettings> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (raw) {
      const v = JSON.parse(raw);
      return { gospel: { ...DEFAULT_REMINDERS.gospel, ...v.gospel }, examen: { ...DEFAULT_REMINDERS.examen, ...v.examen } };
    }
  } catch {}
  return DEFAULT_REMINDERS;
}

/** Ajustes de recordatorios con persistencia y reprogramación automática. */
export function useReminders() {
  const [settings, setSettings] = useState<ReminderSettings>(DEFAULT_REMINDERS);
  const [denied, setDenied] = useState(false);

  useEffect(() => {
    load().then(setSettings);
  }, []);

  const update = useCallback(async (kind: keyof ReminderSettings, patch: Partial<Reminder>) => {
    const prev = await load();
    const next = { ...prev, [kind]: { ...prev[kind], ...patch } };
    if (next[kind].on && !(await ensurePermission())) {
      setDenied(true);
      next[kind].on = false;
    } else {
      setDenied(false);
    }
    setSettings(next);
    await AsyncStorage.setItem(KEY, JSON.stringify(next)).catch(() => {});
    await applySchedule(next).catch(() => {});
  }, []);

  return { settings, update, denied, supported: NOTIF_SUPPORTED };
}

/** Al tocar un recordatorio, abre la pantalla correspondiente. */
export function NotificationRouter() {
  if (!NOTIF_SUPPORTED) return null;
  return <NotificationRouterNative />;
}

function NotificationRouterNative() {
  const response = Notifications.useLastNotificationResponse();
  const handled = useRef<string | null>(null);
  useEffect(() => {
    if (!response) return;
    const id = response.notification.request.identifier + response.notification.date;
    if (handled.current === id) return;
    handled.current = id;
    const url = response.notification.request.content.data?.url;
    if (typeof url === 'string') setTimeout(() => router.push(url as never), 300);
  }, [response]);
  return null;
}
