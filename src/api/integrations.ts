import { apiFetch } from './client';
import type { Integration } from '../types';

export async function getIntegrationStatus(): Promise<Integration[]> {
  const data = await apiFetch<{ integrations: Integration[] }>('/api/integrations/status');
  return data.integrations;
}

export async function syncConnector(id: string): Promise<{ synced: number }> {
  return apiFetch<{ synced: number }>(`/api/connectors/${id}/sync`, {
    method: 'POST',
  });
}
