import { useState, useMemo, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GitBranch, Mail, Hash, HardDrive, FileText, MessageSquare,
  ExternalLink, Filter, SearchX, Plug, Lightbulb,
  Bookmark, Copy, ArrowUpRight,
} from 'lucide-react';
import { SynthesizedAnswer } from './SynthesizedAnswer';
import { ExportResults } from './ExportResults';
import { useBookmarks } from '../../hooks/useBookmarks';
import { useToast } from '../ui/Toast';
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
  onEscape?: () => void;
  onNavigate?: (path: string) => void;
  onSelectResult?: (result: SearchResult) => void;
}

export function SearchResults({ results, synthesizedAnswer, onEscape, onNavigate, onSelectResult }: SearchResultsProps) {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(-1);
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const toast = useToast();

  const sources = useMemo(() => {
    const s = new Set<string>();
    results.forEach(r => s.add(r.source));
    return Array.from(s);
  }, [results]);

  const filtered = activeFilter
    ? results.filter(r => r.source === activeFilter)
    : results;

  useEffect(() => {
    setActiveIndex(-1);
  }, [activeFilter, results]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (filtered.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(i => (i + 1) % filtered.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(i => (i <= 0 ? filtered.length - 1 : i - 1));
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault();
      const res = filtered[activeIndex];
      if (res) onSelectResult?.(res);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onEscape?.();
    }
  }, [filtered, activeIndex, onEscape]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

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
        <ExportResults results={filtered} query="" />
      </div>

      {filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card-static"
          style={{
            padding: '3rem 2rem',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1.25rem',
          }}
        >
          <div style={{
            width: 64, height: 64, borderRadius: 'var(--radius-lg)',
            background: 'rgba(99,102,241,0.08)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <SearchX size={28} color="var(--text-muted)" />
          </div>

          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.35rem' }}>
              {activeFilter ? 'No results from this source' : 'No results found'}
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', maxWidth: 380, margin: '0 auto', lineHeight: 1.5 }}>
              {activeFilter
                ? `Nothing matched from ${SOURCE_CONFIG[activeFilter]?.label ?? activeFilter}. Try removing the filter or broadening your query.`
                : 'We couldn\'t find anything matching your search. Here are a few things to try:'}
            </p>
          </div>

          {!activeFilter && (
            <div style={{
              display: 'flex', flexDirection: 'column', gap: '0.5rem',
              width: '100%', maxWidth: 320, textAlign: 'left',
            }}>
              {[
                { icon: <Lightbulb size={14} />, text: 'Use broader or different keywords' },
                { icon: <Plug size={14} />, text: 'Connect more services for wider coverage', action: () => onNavigate?.('/connectors') },
              ].map((tip, i) => (
                <div
                  key={i}
                  onClick={tip.action}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.75rem',
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.05)',
                    color: 'var(--text-secondary)',
                    fontSize: '0.8125rem',
                    cursor: tip.action ? 'pointer' : 'default',
                    transition: 'all 150ms',
                  }}
                >
                  <span style={{ color: 'var(--text-muted)', flexShrink: 0 }}>{tip.icon}</span>
                  {tip.text}
                </div>
              ))}
            </div>
          )}

          {activeFilter && (
            <button
              onClick={() => setActiveFilter(null)}
              className="btn-ghost"
              style={{ marginTop: '0.25rem' }}
            >
              Clear filter
            </button>
          )}
        </motion.div>
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
                    ...(activeIndex === index ? {
                      borderColor: 'var(--accent-primary)',
                      boxShadow: '0 0 0 2px rgba(99,102,241,0.25)',
                    } : {}),
                  }}
                  onClick={(e) => {
                    if (e.ctrlKey || e.metaKey) {
                      if (res.url) window.open(res.url, '_blank');
                    } else {
                      onSelectResult?.(res);
                    }
                  }}
                  onMouseEnter={() => setActiveIndex(index)}
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

                  {activeIndex === index && (
                    <motion.div
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.12 }}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '0.375rem',
                        marginTop: '0.75rem', paddingTop: '0.6rem',
                        borderTop: '1px solid rgba(255,255,255,0.05)',
                      }}
                    >
                      {res.url && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigator.clipboard.writeText(res.url!);
                            toast.success('Link copied to clipboard');
                          }}
                          style={{
                            display: 'flex', alignItems: 'center', gap: '0.35rem',
                            padding: '0.3rem 0.6rem', borderRadius: 'var(--radius-sm)',
                            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)',
                            color: 'var(--text-muted)', fontSize: '0.6875rem', fontWeight: 500,
                            cursor: 'pointer', fontFamily: 'var(--font-body)',
                            transition: 'all 150ms',
                          }}
                        >
                          <Copy size={11} /> Copy Link
                        </button>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleBookmark(res);
                          toast.success(isBookmarked(res.id) ? 'Removed from bookmarks' : 'Saved to bookmarks');
                        }}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '0.35rem',
                          padding: '0.3rem 0.6rem', borderRadius: 'var(--radius-sm)',
                          background: isBookmarked(res.id) ? 'rgba(168,85,247,0.12)' : 'rgba(255,255,255,0.04)',
                          border: `1px solid ${isBookmarked(res.id) ? 'rgba(168,85,247,0.25)' : 'rgba(255,255,255,0.06)'}`,
                          color: isBookmarked(res.id) ? 'var(--accent-secondary)' : 'var(--text-muted)',
                          fontSize: '0.6875rem', fontWeight: 500,
                          cursor: 'pointer', fontFamily: 'var(--font-body)',
                          transition: 'all 150ms',
                        }}
                      >
                        <Bookmark size={11} fill={isBookmarked(res.id) ? 'currentColor' : 'none'} />
                        {isBookmarked(res.id) ? 'Saved' : 'Save'}
                      </button>
                      {res.url && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(res.url, '_blank');
                          }}
                          style={{
                            display: 'flex', alignItems: 'center', gap: '0.35rem',
                            padding: '0.3rem 0.6rem', borderRadius: 'var(--radius-sm)',
                            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)',
                            color: 'var(--text-muted)', fontSize: '0.6875rem', fontWeight: 500,
                            cursor: 'pointer', fontFamily: 'var(--font-body)',
                            transition: 'all 150ms', marginLeft: 'auto',
                          }}
                        >
                          <ArrowUpRight size={11} /> Open
                        </button>
                      )}
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}
