import { useState } from 'react';
import type { FormEvent } from 'react';
import { apiFetch } from '../api/client';
import type { SearchResult } from '../types';

interface SearchResponse {
  query: string;
  synthesized_answer: string | null;
  results: SearchResult[];
}

export function useSearch() {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [hasResults, setHasResults] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [synthesizedAnswer, setSynthesizedAnswer] = useState<string | null>(null);

  const handleSearch = async (e: FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    setHasResults(false);
    setSynthesizedAnswer(null);

    try {
      const data = await apiFetch<SearchResponse>('/api/search', {
        method: 'POST',
        body: JSON.stringify({ query }),
      });

      setResults(data.results ?? []);
      setSynthesizedAnswer(data.synthesized_answer ?? null);
    } catch (error) {
      console.error(error);
      setResults([]);
      setSynthesizedAnswer(null);
    } finally {
      setIsSearching(false);
      setHasResults(true);
    }
  };

  return {
    query,
    setQuery,
    isSearching,
    hasResults,
    results,
    synthesizedAnswer,
    handleSearch,
  };
}
