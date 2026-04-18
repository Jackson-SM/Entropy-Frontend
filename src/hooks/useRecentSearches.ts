import { useCallback, useEffect, useReducer } from 'react';

export interface SearchEntry {
  query: string;
  timestamp: number;
}

const STORAGE_KEY = 'entropy_recent_searches';
const MAX = 100;

const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((l) => l());
}

function read(): SearchEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.map((item: unknown) => {
      if (typeof item === 'string') {
        return { query: item, timestamp: Date.now() };
      }
      if (item && typeof item === 'object' && 'query' in item) {
        return item as SearchEntry;
      }
      return null;
    }).filter((x): x is SearchEntry => x !== null);
  } catch {
    return [];
  }
}

function write(next: SearchEntry[]) {
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

  const entries = read();
  const recentSearches = entries.map(e => e.query);

  const addSearch = useCallback((query: string) => {
    const q = query.trim();
    if (!q) return;
    const prev = read();
    const without = prev.filter((s) => s.query !== q);
    write([{ query: q, timestamp: Date.now() }, ...without].slice(0, MAX));
  }, []);

  const clearSearches = useCallback(() => {
    write([]);
  }, []);

  const removeSearch = useCallback((query: string) => {
    const prev = read();
    write(prev.filter((s) => s.query !== query));
  }, []);

  return { recentSearches, entries, addSearch, clearSearches, removeSearch };
}
