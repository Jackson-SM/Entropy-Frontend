import type { FormEvent } from 'react';
import { Search, Command } from 'lucide-react';

interface SearchFormProps {
  query: string;
  setQuery: (q: string) => void;
  handleSearch: (e: FormEvent) => void;
}

export function SearchForm({ query, setQuery, handleSearch }: SearchFormProps) {
  return (
    <form onSubmit={handleSearch} style={{ position: 'relative', width: '100%' }}>
      <div style={{ position: 'absolute', left: '1.5rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
        <Search size={22} />
      </div>
      <input 
        type="text" 
        className="input-field glass-panel"
        placeholder="e.g., What did my boss say about the deadline change yesterday?"
        style={{ paddingLeft: '3.5rem', paddingRight: '4rem', fontSize: '1.125rem', borderRadius: 'var(--radius-lg)' }}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <div style={{
        position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)',
        background: 'rgba(255, 255, 255, 0.1)', padding: '0.25rem 0.5rem', borderRadius: '6px',
        display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--text-muted)', fontSize: '0.75rem'
      }}>
        <Command size={12} /> K
      </div>
    </form>
  );
}
