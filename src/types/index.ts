import type { ReactNode } from 'react';

export interface SearchResult {
  id: number;
  source: 'github' | 'discord' | 'gmail' | string;
  icon: ReactNode;
  title: string;
  date: string;
  text: string;
  relevance: number;
}
