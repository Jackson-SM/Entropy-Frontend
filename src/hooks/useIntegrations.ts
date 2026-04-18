import { useState, useEffect, useCallback, useRef } from 'react';
import { getIntegrationStatus, syncConnector } from '../api/integrations';
import { clearBrowseCache } from './useBrowseData';
import { pushNotification } from './useNotifications';
import type { Integration } from '../types';

const FAST_POLL_MS = 3000;   // while any connector is syncing
const SLOW_POLL_MS = 30000;  // idle state

export function useIntegrations() {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const prevIntegrationsRef = useRef<Integration[]>([]);

  const fetchStatus = useCallback(async () => {
    try {
      const data = await getIntegrationStatus();

      // Detect sync completion (syncing → connected) and invalidate browse cache
      const prev = prevIntegrationsRef.current;
      if (prev.length > 0) {
        data.forEach(current => {
          const previous = prev.find(p => p.id === current.id);
          if (previous?.status === 'syncing' && current.status === 'connected') {
            clearBrowseCache(current.id);
            pushNotification({
              type: 'sync_complete',
              title: `${current.name} synced`,
              message: `${current.items_synced?.toLocaleString() ?? 0} items indexed successfully.`,
            });
          }
          if (previous?.status === 'syncing' && current.status === 'error') {
            pushNotification({
              type: 'sync_error',
              title: `${current.name} sync failed`,
              message: 'Something went wrong during sync. Try again.',
            });
          }
        });
      }
      prevIntegrationsRef.current = data;

      setIntegrations(data);
      setError(null);
    } catch {
      setError('Failed to load integration status');
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-poll: fast when any connector is syncing, slow otherwise
  useEffect(() => {
    const isSyncing = integrations.some((i) => i.status === 'syncing');
    const interval = isSyncing ? FAST_POLL_MS : SLOW_POLL_MS;

    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(fetchStatus, interval);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [integrations, fetchStatus]);

  // Initial fetch
  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  const sync = useCallback(
    async (id: string) => {
      // Optimistically mark as syncing so polling kicks in immediately
      setIntegrations((prev) =>
        prev.map((i) => (i.id === id ? { ...i, status: 'syncing' } : i))
      );
      try {
        const result = await syncConnector(id);
        // Fetch fresh status a moment after the background task kicks off
        setTimeout(fetchStatus, 500);
        return result;
      } catch (err) {
        // Revert optimistic update on error
        await fetchStatus();
        throw err;
      }
    },
    [fetchStatus]
  );

  return { integrations, loading, error, sync, refetch: fetchStatus };
}
