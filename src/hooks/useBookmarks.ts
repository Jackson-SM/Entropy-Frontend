import { useCallback, useEffect, useReducer } from 'react';
import type { SearchResult } from '../types';

const STORAGE_KEY = 'entropy_bookmarks';

const listeners = new Set<() => void>();

function notify() {
  listeners.forEach(l => l());
}

function read(): SearchResult[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function write(next: SearchResult[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  notify();
}

export function useBookmarks() {
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

  const bookmarks = read();

  const isBookmarked = useCallback((id: string | number) => {
    return read().some(b => b.id === id);
  }, []);

  const addBookmark = useCallback((result: SearchResult) => {
    const prev = read();
    if (prev.some(b => b.id === result.id)) return;
    write([result, ...prev]);
  }, []);

  const removeBookmark = useCallback((id: string | number) => {
    write(read().filter(b => b.id !== id));
  }, []);

  const toggleBookmark = useCallback((result: SearchResult) => {
    if (read().some(b => b.id === result.id)) {
      removeBookmark(result.id);
    } else {
      addBookmark(result);
    }
  }, [addBookmark, removeBookmark]);

  return { bookmarks, isBookmarked, addBookmark, removeBookmark, toggleBookmark };
}
