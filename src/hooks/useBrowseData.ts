import { useState, useEffect, useCallback, useRef } from 'react';

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

interface CacheEntry<T> {
  data: T;
  fetchedAt: number;
}

function readSession<T>(key: string): CacheEntry<T> | null {
  try {
    const raw = sessionStorage.getItem(`browse:${key}`);
    if (!raw) return null;
    const entry = JSON.parse(raw) as CacheEntry<T>;
    if (Date.now() - entry.fetchedAt > CACHE_TTL_MS) {
      sessionStorage.removeItem(`browse:${key}`);
      return null;
    }
    return entry;
  } catch {
    return null;
  }
}

function writeSession<T>(key: string, data: T): void {
  try {
    sessionStorage.setItem(`browse:${key}`, JSON.stringify({ data, fetchedAt: Date.now() }));
  } catch {
    // sessionStorage quota exceeded — not critical
  }
}

export function clearBrowseCache(connector: string): void {
  try {
    for (const k of Object.keys(sessionStorage)) {
      if (k.startsWith(`browse:${connector}`)) {
        sessionStorage.removeItem(k);
      }
    }
  } catch {}
}

export interface BrowseState<T> {
  data: T | null;
  loading: boolean;
  refreshing: boolean; // background re-fetch (data is already shown)
  error: string;
  fetchedAt: number | null; // timestamp of last successful fetch
  refresh: () => void;      // force re-fetch bypassing cache
}

/**
 * useBrowseData — fetches data with a two-layer cache strategy:
 *
 * 1. sessionStorage (frontend): instant display on component mount,
 *    survives view switches within the same tab session.
 * 2. Backend in-memory cache: avoids hammering external APIs when
 *    the sessionStorage entry expires or on manual refresh.
 *
 * Behaviour:
 * - Cache hit  → show data immediately, no loading spinner
 * - Cache miss → show loading spinner, fetch, write cache
 * - Stale data → show old data + subtle "refreshing" indicator
 * - Manual refresh (`refresh()`) → bypass cache, fetch fresh
 *
 * The `key` must be stable across renders for a given "query".
 * Changing `key` (e.g. different Gmail folder) triggers a new fetch.
 */
export function useBrowseData<T>(
  key: string,
  fetcher: () => Promise<T>,
): BrowseState<T> {
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  const [state, setState] = useState<Omit<BrowseState<T>, 'refresh'>>(() => {
    const cached = readSession<T>(key);
    return {
      data: cached?.data ?? null,
      loading: !cached,
      refreshing: false,
      error: '',
      fetchedAt: cached?.fetchedAt ?? null,
    };
  });

  const stateRef = useRef(state);
  stateRef.current = state;

  const load = useCallback(
    async (force = false) => {
      // Cache hit — no need to re-fetch
      if (!force) {
        const cached = readSession<T>(key);
        if (cached) {
          setState(s => ({
            ...s,
            data: cached.data,
            fetchedAt: cached.fetchedAt,
            loading: false,
            error: '',
          }));
          return;
        }
      }

      const hasData = stateRef.current.data !== null;
      setState(s => ({
        ...s,
        loading: !hasData,     // full spinner only when no data yet
        refreshing: hasData,   // subtle indicator when replacing existing data
        error: '',
      }));

      try {
        const result = await fetcherRef.current();
        writeSession(key, result);
        setState(s => ({
          ...s,
          data: result,
          loading: false,
          refreshing: false,
          fetchedAt: Date.now(),
          error: '',
        }));
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : 'Failed to load';
        setState(s => ({ ...s, loading: false, refreshing: false, error: msg }));
      }
    },
    [key],
  );

  // Re-run whenever key changes (different query, folder, etc.)
  useEffect(() => {
    const cached = readSession<T>(key);
    if (cached) {
      setState({
        data: cached.data,
        fetchedAt: cached.fetchedAt,
        loading: false,
        refreshing: false,
        error: '',
      });
    } else {
      setState({ data: null, loading: true, refreshing: false, error: '', fetchedAt: null });
      load();
    }
  }, [key, load]);

  return { ...state, refresh: () => load(true) };
}

/** Human-readable "X minutes ago" label */
export function useAgeLabel(fetchedAt: number | null): string {
  const [label, setLabel] = useState('');

  useEffect(() => {
    if (!fetchedAt) {
      setLabel('');
      return;
    }

    const update = () => {
      const diffMs = Date.now() - fetchedAt;
      const diffSec = Math.floor(diffMs / 1000);
      if (diffSec < 10) setLabel('just now');
      else if (diffSec < 60) setLabel(`${diffSec}s ago`);
      else if (diffSec < 3600) setLabel(`${Math.floor(diffSec / 60)}m ago`);
      else setLabel(`${Math.floor(diffSec / 3600)}h ago`);
    };

    update();
    const id = setInterval(update, 15_000);
    return () => clearInterval(id);
  }, [fetchedAt]);

  return label;
}
