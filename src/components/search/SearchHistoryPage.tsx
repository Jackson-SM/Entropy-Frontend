import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Clock, Search, Trash2, ArrowRight, X } from 'lucide-react';
import { useRecentSearches, type SearchEntry } from '../../hooks/useRecentSearches';

interface Props {
  onSearch: (query: string) => void;
}

function groupByDate(entries: SearchEntry[]): { label: string; items: SearchEntry[] }[] {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const yesterday = today - 86400000;
  const weekAgo = today - 7 * 86400000;

  const groups: Record<string, SearchEntry[]> = { Today: [], Yesterday: [], 'This Week': [], Older: [] };

  entries.forEach(entry => {
    if (entry.timestamp >= today) groups.Today.push(entry);
    else if (entry.timestamp >= yesterday) groups.Yesterday.push(entry);
    else if (entry.timestamp >= weekAgo) groups['This Week'].push(entry);
    else groups.Older.push(entry);
  });

  return Object.entries(groups)
    .filter(([, items]) => items.length > 0)
    .map(([label, items]) => ({ label, items }));
}

export function SearchHistoryPage({ onSearch }: Props) {
  const { entries, removeSearch, clearSearches } = useRecentSearches();
  const [filter, setFilter] = useState('');

  const filtered = useMemo(() => {
    if (!filter.trim()) return entries;
    const q = filter.toLowerCase();
    return entries.filter(e => e.query.toLowerCase().includes(q));
  }, [entries, filter]);

  const groups = useMemo(() => groupByDate(filtered), [filtered]);

  return (
    <div style={{ marginTop: '2rem', width: '100%', maxWidth: '700px', marginLeft: 'auto', marginRight: 'auto' }}>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.25rem)', margin: 0 }}>Search History</h2>
          {entries.length > 0 && (
            <button onClick={clearSearches} className="btn-ghost" style={{ fontSize: '0.75rem' }}>
              <Trash2 size={13} /> Clear All
            </button>
          )}
        </div>

        {entries.length > 5 && (
          <div style={{ position: 'relative', marginBottom: '1.25rem' }}>
            <Search size={15} style={{
              position: 'absolute', left: '0.75rem', top: '50%',
              transform: 'translateY(-50%)', color: 'var(--text-muted)',
            }} />
            <input
              value={filter}
              onChange={e => setFilter(e.target.value)}
              placeholder="Filter history..."
              className="input-field"
              style={{
                paddingLeft: '2.5rem', paddingRight: filter ? '2.5rem' : '1rem',
                height: 42, fontSize: '0.875rem', borderRadius: 'var(--radius-md)',
              }}
            />
            {filter && (
              <button
                onClick={() => setFilter('')}
                className="btn-icon"
                style={{ position: 'absolute', right: '0.5rem', top: '50%', transform: 'translateY(-50%)' }}
              >
                <X size={14} />
              </button>
            )}
          </div>
        )}

        {entries.length === 0 ? (
          <div className="glass-card-static" style={{
            padding: '4rem 2rem', textAlign: 'center',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem',
          }}>
            <div style={{
              width: 56, height: 56, borderRadius: 'var(--radius-lg)',
              background: 'rgba(99,102,241,0.08)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Clock size={24} color="var(--text-muted)" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.3rem' }}>No search history</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', margin: 0 }}>
                Your search queries will appear here after you search.
              </p>
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            No results matching "{filter}"
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {groups.map(group => (
              <div key={group.label}>
                <h4 style={{
                  fontSize: '0.6875rem', fontWeight: 600, color: 'var(--text-muted)',
                  textTransform: 'uppercase', letterSpacing: '0.08em',
                  marginBottom: '0.5rem', paddingLeft: '0.25rem',
                }}>
                  {group.label}
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  {group.items.map((entry, i) => (
                    <motion.div
                      key={`${entry.query}-${entry.timestamp}`}
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.02 }}
                      className="glass-card"
                      style={{
                        padding: '0.75rem 1rem',
                        display: 'flex', alignItems: 'center', gap: '0.75rem',
                        cursor: 'pointer',
                      }}
                      onClick={() => onSearch(entry.query)}
                    >
                      <Clock size={14} color="var(--text-muted)" style={{ flexShrink: 0 }} />
                      <span style={{
                        flex: 1, fontSize: '0.875rem', fontWeight: 500,
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      }}>
                        {entry.query}
                      </span>
                      <span style={{ fontSize: '0.625rem', color: 'var(--text-muted)', flexShrink: 0 }}>
                        {new Date(entry.timestamp).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <button
                        onClick={(e) => { e.stopPropagation(); removeSearch(entry.query); }}
                        className="btn-icon"
                        style={{ padding: '0.2rem', flexShrink: 0 }}
                      >
                        <X size={12} />
                      </button>
                      <ArrowRight size={13} color="var(--text-muted)" style={{ flexShrink: 0 }} />
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
