import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GitBranch, Mail, Hash, HardDrive, FileText, MessageSquare,
  ExternalLink, Filter,
} from 'lucide-react';
import { SynthesizedAnswer } from './SynthesizedAnswer';
import type { SearchResult } from '../../types';

const SOURCE_CONFIG: Record<string, { icon: React.ReactNode; label: string; color: string }> = {
  gmail:  { icon: <Mail size={16} />,      label: 'Gmail',        color: '#ea4335' },
  gdrive: { icon: <HardDrive size={16} />, label: 'Google Drive', color: '#4285f4' },
  notion: { icon: <FileText size={16} />,  label: 'Notion',       color: '#ffffff' },
  slack:  { icon: <Hash size={16} />,      label: 'Slack',        color: '#e01e5a' },
  github: { icon: <GitBranch size={16} />, label: 'GitHub',       color: '#2ea043' },
};

interface SearchResultsProps {
  results: SearchResult[];
  synthesizedAnswer?: string | null;
}

export function SearchResults({ results, synthesizedAnswer }: SearchResultsProps) {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const sources = useMemo(() => {
    const s = new Set<string>();
    results.forEach(r => s.add(r.source));
    return Array.from(s);
  }, [results]);

  const filtered = activeFilter
    ? results.filter(r => r.source === activeFilter)
    : results;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ width: '100%', maxWidth: '800px', marginTop: '2rem' }}
    >
      {synthesizedAnswer && <SynthesizedAnswer answer={synthesizedAnswer} />}

      {/* Filter chips */}
      {sources.length > 1 && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          marginBottom: '1.25rem',
          flexWrap: 'wrap',
        }}>
          <Filter size={14} color="var(--text-muted)" />
          <button
            onClick={() => setActiveFilter(null)}
            style={{
              padding: '0.35rem 0.75rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.75rem',
              fontWeight: 500,
              fontFamily: 'var(--font-body)',
              cursor: 'pointer',
              border: '1px solid',
              borderColor: !activeFilter ? 'var(--accent-primary)' : 'rgba(255,255,255,0.08)',
              background: !activeFilter ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.03)',
              color: !activeFilter ? 'var(--accent-primary)' : 'var(--text-muted)',
              transition: 'all 150ms ease',
            }}
          >
            All ({results.length})
          </button>
          {sources.map(src => {
            const cfg = SOURCE_CONFIG[src];
            const count = results.filter(r => r.source === src).length;
            const isActive = activeFilter === src;
            return (
              <button
                key={src}
                onClick={() => setActiveFilter(isActive ? null : src)}
                style={{
                  padding: '0.35rem 0.75rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  fontFamily: 'var(--font-body)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  border: '1px solid',
                  borderColor: isActive ? cfg?.color ?? 'var(--accent-primary)' : 'rgba(255,255,255,0.08)',
                  background: isActive ? `${cfg?.color ?? 'var(--accent-primary)'}22` : 'rgba(255,255,255,0.03)',
                  color: isActive ? cfg?.color ?? 'var(--text-primary)' : 'var(--text-muted)',
                  transition: 'all 150ms ease',
                }}
              >
                {cfg?.icon}
                {cfg?.label ?? src} ({count})
              </button>
            );
          })}
        </div>
      )}

      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1rem',
      }}>
        <h4 style={{
          color: 'var(--text-muted)',
          fontSize: '0.75rem',
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          fontWeight: 600,
          margin: 0,
        }}>
          {filtered.length} result{filtered.length !== 1 ? 's' : ''} found
        </h4>
      </div>

      {filtered.length === 0 ? (
        <div
          className="glass-card-static"
          style={{
            padding: '2.5rem',
            textAlign: 'center',
            color: 'var(--text-muted)',
            fontSize: '0.9375rem',
          }}
        >
          {activeFilter
            ? `No results from ${SOURCE_CONFIG[activeFilter]?.label ?? activeFilter}. Try removing the filter.`
            : 'No results found. Try connecting more services or syncing your data.'}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <AnimatePresence mode="popLayout">
            {filtered.map((res, index) => {
              const cfg = SOURCE_CONFIG[res.source];
              return (
                <motion.div
                  key={res.id}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ delay: index * 0.04 }}
                  className="glass-card"
                  style={{
                    padding: '1.25rem',
                    cursor: res.url ? 'pointer' : 'default',
                  }}
                  onClick={() => res.url && window.open(res.url, '_blank')}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '0.6rem',
                    gap: '0.75rem',
                    flexWrap: 'wrap',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flex: 1, minWidth: 0 }}>
                      <div style={{
                        width: 32, height: 32,
                        borderRadius: '8px',
                        background: `${cfg?.color ?? '#666'}18`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: cfg?.color ?? '#999',
                        flexShrink: 0,
                      }}>
                        {cfg?.icon ?? <MessageSquare size={16} />}
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{
                          fontWeight: 600,
                          fontSize: '0.9375rem',
                          lineHeight: 1.3,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}>
                          {res.title}
                        </div>
                        <div style={{
                          fontSize: '0.6875rem',
                          color: cfg?.color ?? 'var(--text-muted)',
                          fontWeight: 500,
                          textTransform: 'uppercase',
                          letterSpacing: '0.04em',
                        }}>
                          {cfg?.label ?? res.source}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', flexShrink: 0 }}>
                      {res.relevance != null && (
                        <span style={{
                          fontSize: '0.75rem',
                          color: 'var(--accent-primary)',
                          fontWeight: 700,
                          background: 'rgba(99,102,241,0.12)',
                          padding: '0.2rem 0.5rem',
                          borderRadius: 'var(--radius-full)',
                        }}>
                          {res.relevance}%
                        </span>
                      )}
                      {res.date && (
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                          {res.date}
                        </span>
                      )}
                      {res.url && (
                        <ExternalLink size={13} color="var(--text-muted)" />
                      )}
                    </div>
                  </div>

                  <p style={{
                    color: 'var(--text-secondary)',
                    fontSize: '0.875rem',
                    lineHeight: 1.55,
                    margin: 0,
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical' as const,
                    overflow: 'hidden',
                  }}>
                    {res.text}
                  </p>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}
