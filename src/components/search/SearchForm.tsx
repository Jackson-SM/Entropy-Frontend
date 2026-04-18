import { useRef, type FormEvent } from 'react';
import { Search, Command, ArrowRight, SlidersHorizontal } from 'lucide-react';

interface SearchFormProps {
  query: string;
  setQuery: (q: string) => void;
  handleSearch: (e: FormEvent) => void;
  onToggleFilters?: () => void;
  hasActiveFilters?: boolean;
}

export function SearchForm({ query, setQuery, handleSearch, onToggleFilters, hasActiveFilters }: SearchFormProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <form onSubmit={handleSearch} style={{ position: 'relative', width: '100%' }}>
      <div style={{
        position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)',
        color: 'var(--text-muted)', display: 'flex', alignItems: 'center', pointerEvents: 'none',
      }}>
        <Search size={20} strokeWidth={2} />
      </div>

      <input
        ref={inputRef}
        type="text"
        className="input-field glass-panel"
        placeholder="Search across all your connected services..."
        style={{
          paddingLeft: '3.25rem', paddingRight: '9.5rem',
          fontSize: '1rem', borderRadius: 'var(--radius-xl)', height: '56px',
        }}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <div style={{
        position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)',
        display: 'flex', alignItems: 'center', gap: '0.4rem',
      }}>
        {onToggleFilters && (
          <button
            type="button"
            onClick={onToggleFilters}
            style={{
              width: 32, height: 32, borderRadius: '8px',
              background: hasActiveFilters ? 'rgba(99,102,241,0.15)' : 'transparent',
              border: hasActiveFilters ? '1px solid rgba(99,102,241,0.3)' : '1px solid transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
              color: hasActiveFilters ? 'var(--accent-primary)' : 'var(--text-muted)',
              transition: 'all 150ms ease',
            }}
            title="Toggle search filters"
          >
            <SlidersHorizontal size={15} />
          </button>
        )}
        <div style={{
          background: 'rgba(128,128,128,0.12)', padding: '0.3rem 0.5rem',
          borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '0.2rem',
          color: 'var(--text-muted)', fontSize: '0.6875rem', fontWeight: 500,
          border: '1px solid var(--border-subtle)',
        }}>
          <Command size={11} /> K
        </div>

        {query.trim() && (
          <button type="submit" style={{
            width: 32, height: 32, borderRadius: '8px',
            background: 'var(--accent-primary)', border: 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: '#fff', transition: 'all 150ms ease',
          }}>
            <ArrowRight size={16} />
          </button>
        )}
      </div>
    </form>
  );
}
