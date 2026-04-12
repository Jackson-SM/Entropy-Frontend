import { useState } from 'react';
import type { FormEvent } from 'react';

export function useSearch() {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [hasResults, setHasResults] = useState(false);

  const [results, setResults] = useState<any[]>([]);

  const handleSearch = async (e: FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setIsSearching(true);
    setHasResults(false);
    
    try {
      const token = localStorage.getItem('entropy_token');
      const res = await fetch('http://localhost:8000/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ query })
      });

      if (!res.ok) throw new Error('Search failed');
      const data = await res.json();
      setResults(data.results || []);
    } catch (error) {
      console.error(error);
      setResults([]);
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
    handleSearch
  };
}
