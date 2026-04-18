import { useState, useCallback, useRef } from 'react';
import type { FormEvent } from 'react';
import { apiFetch } from '../api/client';
import type { SearchResult } from '../types';
import { useRecentSearches } from './useRecentSearches';
import type { SearchFilterState } from '../components/search/SearchFilters';

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
  const [error, setError] = useState<string | null>(null);
  const filtersRef = useRef<SearchFilterState>({ sources: [], dateFrom: '', dateTo: '' });
  const { addSearch } = useRecentSearches();

  const setFilters = useCallback((f: SearchFilterState) => {
    filtersRef.current = f;
  }, []);

  const handleSearch = async (e: FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;

    setIsSearching(true);
    setHasResults(false);
    setSynthesizedAnswer(null);
    setError(null);

    const body: Record<string, unknown> = { query: trimmed };
    const f = filtersRef.current;
    if (f.sources.length > 0) body.sources = f.sources;
    if (f.dateFrom) body.date_from = f.dateFrom;
    if (f.dateTo) body.date_to = f.dateTo;

    try {
      const data = await apiFetch<SearchResponse>('/api/search', {
        method: 'POST',
        body: JSON.stringify(body),
      });

      setResults(data.results ?? []);
      setSynthesizedAnswer(data.synthesized_answer ?? null);
      addSearch(trimmed);
    } catch (err) {
      console.error(err);
      setResults([]);
      setSynthesizedAnswer(null);
      setError(
        err instanceof Error
          ? err.message
          : 'Something went wrong while searching. Please try again.',
      );
    } finally {
      setIsSearching(false);
      setHasResults(true);
    }
  };

  const clearResults = useCallback(() => {
    setHasResults(false);
    setResults([]);
    setSynthesizedAnswer(null);
    setError(null);
  }, []);

  return {
    query, setQuery, isSearching, hasResults, results,
    synthesizedAnswer, error, handleSearch, clearResults, setFilters,
  };
}
