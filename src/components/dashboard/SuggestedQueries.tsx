import { Sparkles, ArrowRight, Clock, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRecentSearches } from '../../hooks/useRecentSearches';

interface Props {
  onSelect: (query: string) => void;
}

const QUERIES = [
  'Summarize my recent commits in AutoGPT',
  'Did anyone mention database migrations yesterday?',
  'Find the design doc shared by Sarah last week',
  "What's my schedule looking like tomorrow?",
];

export function SuggestedQueries({ onSelect }: Props) {
  const { recentSearches, removeSearch } = useRecentSearches();

  return (
    <div className="glass-card-static bento-item">
      {recentSearches.length > 0 && (
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
            <Clock size={16} color="var(--accent-primary)" strokeWidth={2.2} />
            <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>Recent</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', marginBottom: '1.25rem' }}>
            {recentSearches.map((q) => (
              <div
                key={q}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.6rem 0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(0,0,0,0.2)',
                  border: '1px solid rgba(255,255,255,0.04)',
                }}
              >
                <motion.button
                  type="button"
                  whileHover={{ x: 2 }}
                  onClick={() => onSelect(q)}
                  style={{
                    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    cursor: 'pointer', background: 'transparent', border: 'none',
                    padding: 0, color: 'var(--text-secondary)', textAlign: 'left',
                    fontSize: '0.8125rem', fontFamily: 'var(--font-body)',
                  }}
                >
                  <span style={{
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>{q}</span>
                  <ArrowRight size={14} color="var(--text-muted)" style={{ flexShrink: 0, marginLeft: '0.5rem' }} />
                </motion.button>
                <button
                  type="button"
                  aria-label="Remove"
                  onClick={(e) => { e.stopPropagation(); removeSearch(q); }}
                  style={{
                    flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    width: 24, height: 24, borderRadius: '6px',
                    border: 'none', background: 'rgba(255,255,255,0.04)',
                    color: 'var(--text-muted)', cursor: 'pointer',
                    transition: 'all 150ms',
                  }}
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
        <Sparkles size={16} color="var(--accent-secondary)" strokeWidth={2.2} />
        <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>Try Asking</h3>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
        {QUERIES.map((q) => (
          <motion.button
            key={q}
            type="button"
            whileHover={{ x: 2, background: 'rgba(255,255,255,0.06)' }}
            onClick={() => onSelect(q)}
            style={{
              padding: '0.6rem 0.75rem',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(0,0,0,0.2)',
              border: '1px solid rgba(255,255,255,0.04)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              cursor: 'pointer', color: 'var(--text-secondary)',
              fontSize: '0.8125rem', fontFamily: 'var(--font-body)',
              textAlign: 'left', width: '100%',
              transition: 'background 150ms',
            }}
          >
            <span>{q}</span>
            <ArrowRight size={14} color="var(--text-muted)" style={{ flexShrink: 0 }} />
          </motion.button>
        ))}
      </div>
    </div>
  );
}
