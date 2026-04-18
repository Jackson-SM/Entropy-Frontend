import { useCallback, useEffect, useReducer } from 'react';

export interface Notification {
  id: string;
  type: 'sync_complete' | 'sync_error' | 'info';
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
}

const STORAGE_KEY = 'entropy_notifications';
const MAX = 50;

const listeners = new Set<() => void>();
function notify() { listeners.forEach(l => l()); }

function read(): Notification[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch { return []; }
}

function write(next: Notification[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next.slice(0, MAX)));
  notify();
}

export function pushNotification(n: Omit<Notification, 'id' | 'timestamp' | 'read'>) {
  const prev = read();
  const entry: Notification = {
    ...n,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    timestamp: Date.now(),
    read: false,
  };
  write([entry, ...prev]);
}

export function useNotifications() {
  const [, bump] = useReducer((n: number) => n + 1, 0);

  useEffect(() => {
    const sub = () => bump();
    listeners.add(sub);
    return () => { listeners.delete(sub); };
  }, []);

  const notifications = read();
  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = useCallback(() => {
    write(read().map(n => ({ ...n, read: true })));
  }, []);

  const clearAll = useCallback(() => {
    write([]);
  }, []);

  const removeNotification = useCallback((id: string) => {
    write(read().filter(n => n.id !== id));
  }, []);

  return { notifications, unreadCount, markAllRead, clearAll, removeNotification };
}
