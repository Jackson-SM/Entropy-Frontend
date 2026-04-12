export interface SearchResult {
  id: string | number;
  source: 'gmail' | 'gdrive' | 'notion' | 'slack' | 'github';
  title: string;
  text: string;
  date: string;
  url?: string;
  relevance?: number;
}

export interface Integration {
  id: string;
  name: string;
  color: string;
  status: 'connected' | 'not_connected' | 'syncing' | 'error';
  last_sync?: string | null;
  items_synced?: number;
}
