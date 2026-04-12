import { useEffect, useRef, type FormEvent } from 'react';
import { Search, Command, ArrowRight } from 'lucide-react';

interface SearchFormProps {
  query: string;
  setQuery: (q: string) => void;
  handleSearch: (e: FormEvent) => void;
}

export function SearchForm({ query, setQuery, handleSearch }: SearchFormProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <form onSubmit={handleSearch} style={{ position: 'relative', width: '100%' }}>
      <div style={{
        position: 'absolute',
        left: '1.25rem',
        top: '50%',
        transform: 'translateY(-50%)',
        color: 'var(--text-muted)',
        display: 'flex',
        alignItems: 'center',
        pointerEvents: 'none',
      }}>
        <Search size={20} strokeWidth={2} />
      </div>

      <input
        ref={inputRef}
        type="text"
        className="input-field glass-panel"
        placeholder="Search across all your connected services..."
        style={{
          paddingLeft: '3.25rem',
          paddingRight: '7rem',
          fontSize: '1rem',
          borderRadius: 'var(--radius-xl)',
          height: '56px',
        }}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <div style={{
        position: 'absolute',
        right: '0.75rem',
        top: '50%',
        transform: 'translateY(-50%)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.06)',
          padding: '0.3rem 0.5rem',
          borderRadius: '6px',
          display: 'flex',
          alignItems: 'center',
          gap: '0.2rem',
          color: 'var(--text-muted)',
          fontSize: '0.6875rem',
          fontWeight: 500,
          border: '1px solid rgba(255,255,255,0.06)',
        }}>
          <Command size={11} /> K
        </div>

        {query.trim() && (
          <button
            type="submit"
            style={{
              width: 32, height: 32,
              borderRadius: '8px',
              background: 'var(--accent-primary)',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#fff',
              transition: 'all 150ms ease',
            }}
          >
            <ArrowRight size={16} />
          </button>
        )}
      </div>
    </form>
  );
}
