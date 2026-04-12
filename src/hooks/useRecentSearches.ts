import { useCallback, useEffect, useReducer } from 'react';

const STORAGE_KEY = 'entropy_recent_searches';
const MAX = 8;

const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((l) => l());
}

function read(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === 'string') : [];
  } catch {
    return [];
  }
}

function write(next: string[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  notify();
}

export function useRecentSearches() {
  const [, bump] = useReducer((n: number) => n + 1, 0);

  useEffect(() => {
    const sub = () => bump();
    listeners.add(sub);
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) bump();
    };
    window.addEventListener('storage', onStorage);
    return () => {
      listeners.delete(sub);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  const recentSearches = read();

  const addSearch = useCallback((query: string) => {
    const q = query.trim();
    if (!q) return;
    const prev = read();
    const without = prev.filter((s) => s !== q);
    write([q, ...without].slice(0, MAX));
  }, []);

  const clearSearches = useCallback(() => {
    write([]);
  }, []);

  const removeSearch = useCallback((query: string) => {
    const prev = read();
    write(prev.filter((s) => s !== query));
  }, []);

  return { recentSearches, addSearch, clearSearches, removeSearch };
}
