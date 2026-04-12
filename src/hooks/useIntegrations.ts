import { useState, useEffect, useCallback } from 'react';
import { getIntegrationStatus, syncConnector } from '../api/integrations';
import type { Integration } from '../types';

export function useIntegrations() {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getIntegrationStatus();
      setIntegrations(data);
    } catch {
      setError('Failed to load integration status');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  const sync = useCallback(
    async (id: string) => {
      setSyncingId(id);
      try {
        const result = await syncConnector(id);
        await fetchStatus();
        return result;
      } finally {
        setSyncingId(null);
      }
    },
    [fetchStatus]
  );

  return { integrations, loading, syncingId, error, sync, refetch: fetchStatus };
}
