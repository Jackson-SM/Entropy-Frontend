import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Activity, Database, Settings, User, Sparkles,
  Clock, ArrowRight, Command,
} from 'lucide-react';
import { useRecentSearches } from '../../hooks/useRecentSearches';

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  onNavigate: (view: string) => void;
  onSearch: (query: string) => void;
}

interface PaletteItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  section: string;
  action: () => void;
}

const NAV_ITEMS: { id: string; label: string; icon: React.ReactNode; view: string }[] = [
  { id: 'nav-search', label: 'Search', icon: <Search size={16} />, view: '/' },
  { id: 'nav-activity', label: 'Activity', icon: <Activity size={16} />, view: '/activity' },
  { id: 'nav-sources', label: 'Your Data', icon: <Database size={16} />, view: '/data' },
  { id: 'nav-connectors', label: 'Connectors', icon: <Settings size={16} />, view: '/connectors' },
  { id: 'nav-history', label: 'History', icon: <Clock size={16} />, view: '/history' },
  { id: 'nav-settings', label: 'Settings', icon: <User size={16} />, view: '/settings' },
];

const SUGGESTED = [
  'Summarize my recent commits in AutoGPT',
  'Did anyone mention database migrations yesterday?',
  'Find the design doc shared by Sarah last week',
  "What's my schedule looking like tomorrow?",
];

function fuzzyMatch(text: string, query: string): boolean {
  const lower = text.toLowerCase();
  const q = query.toLowerCase();
  let qi = 0;
  for (let i = 0; i < lower.length && qi < q.length; i++) {
    if (lower[i] === q[qi]) qi++;
  }
  return qi === q.length;
}

export function CommandPalette({ open, onClose, onNavigate, onSearch }: CommandPaletteProps) {
  const [input, setInput] = useState('');
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const { recentSearches } = useRecentSearches();

  useEffect(() => {
    if (open) {
      setInput('');
      setActiveIdx(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  const items = useMemo<PaletteItem[]>(() => {
    const result: PaletteItem[] = [];

    if (input.trim()) {
      result.push({
        id: 'search-now',
        label: `Search "${input.trim()}"`,
        icon: <ArrowRight size={16} />,
        section: 'Action',
        action: () => { onSearch(input.trim()); onClose(); },
      });
    }

    const navFiltered = input
      ? NAV_ITEMS.filter(n => fuzzyMatch(n.label, input))
      : NAV_ITEMS;
    navFiltered.forEach(n => {
      result.push({
        id: n.id,
        label: n.label,
        icon: n.icon,
        section: 'Navigate',
        action: () => { onNavigate(n.view); onClose(); },
      });
    });

    const recFiltered = (input
      ? recentSearches.filter(s => fuzzyMatch(s, input))
      : recentSearches
    ).slice(0, 5);
    recFiltered.forEach((s, i) => {
      result.push({
        id: `recent-${i}`,
        label: s,
        icon: <Clock size={16} />,
        section: 'Recent Searches',
        action: () => { onSearch(s); onClose(); },
      });
    });

    if (!input) {
      SUGGESTED.forEach((s, i) => {
        result.push({
          id: `suggested-${i}`,
          label: s,
          icon: <Sparkles size={16} />,
          section: 'Suggested',
          action: () => { onSearch(s); onClose(); },
        });
      });
    }

    return result;
  }, [input, recentSearches, onNavigate, onSearch, onClose]);

  useEffect(() => {
    setActiveIdx(0);
  }, [input]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIdx(i => (i + 1) % items.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIdx(i => (i <= 0 ? items.length - 1 : i - 1));
    } else if (e.key === 'Enter' && items[activeIdx]) {
      e.preventDefault();
      items[activeIdx].action();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  }, [items, activeIdx, onClose]);

  useEffect(() => {
    const el = listRef.current?.children[activeIdx] as HTMLElement | undefined;
    el?.scrollIntoView({ block: 'nearest' });
  }, [activeIdx]);

  const sections = useMemo(() => {
    const map = new Map<string, PaletteItem[]>();
    items.forEach(item => {
      const arr = map.get(item.section) || [];
      arr.push(item);
      map.set(item.section, arr);
    });
    return Array.from(map.entries());
  }, [items]);

  let flatIdx = 0;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onClick={onClose}
          style={{
            position: 'fixed', inset: 0, zIndex: 200,
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(4px)',
            WebkitBackdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
            paddingTop: 'min(20vh, 180px)',
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -8 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            onClick={e => e.stopPropagation()}
            style={{
              width: '100%', maxWidth: 560,
              background: 'var(--bg-elevated)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 'var(--radius-xl)',
              boxShadow: '0 24px 80px rgba(0,0,0,0.5)',
              overflow: 'hidden',
            }}
          >
            <div style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              padding: '0.875rem 1.25rem',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
            }}>
              <Search size={18} color="var(--text-muted)" />
              <input
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a command or search..."
                style={{
                  flex: 1, background: 'transparent', border: 'none', outline: 'none',
                  color: 'var(--text-primary)', fontSize: '0.9375rem',
                  fontFamily: 'var(--font-body)',
                }}
              />
              <kbd style={{
                padding: '0.15rem 0.45rem', borderRadius: '5px',
                background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)',
                fontSize: '0.625rem', color: 'var(--text-muted)', fontFamily: 'var(--font-body)',
                fontWeight: 500,
              }}>
                ESC
              </kbd>
            </div>

            <div ref={listRef} style={{
              maxHeight: 360, overflowY: 'auto',
              padding: '0.5rem',
            }}>
              {items.length === 0 && (
                <div style={{
                  padding: '2rem', textAlign: 'center',
                  color: 'var(--text-muted)', fontSize: '0.875rem',
                }}>
                  No matching commands
                </div>
              )}
              {sections.map(([section, sectionItems]) => (
                <div key={section}>
                  <div style={{
                    fontSize: '0.625rem', fontWeight: 600,
                    color: 'var(--text-muted)', textTransform: 'uppercase',
                    letterSpacing: '0.08em', padding: '0.5rem 0.75rem 0.25rem',
                  }}>
                    {section}
                  </div>
                  {sectionItems.map(item => {
                    const idx = flatIdx++;
                    const isActive = idx === activeIdx;
                    return (
                      <div
                        key={item.id}
                        onClick={item.action}
                        onMouseEnter={() => setActiveIdx(idx)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '0.75rem',
                          padding: '0.6rem 0.75rem',
                          borderRadius: 'var(--radius-sm)',
                          cursor: 'pointer',
                          background: isActive ? 'rgba(99,102,241,0.12)' : 'transparent',
                          color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                          transition: 'background 100ms',
                        }}
                      >
                        <span style={{
                          color: isActive ? 'var(--accent-primary)' : 'var(--text-muted)',
                          flexShrink: 0,
                        }}>
                          {item.icon}
                        </span>
                        <span style={{
                          fontSize: '0.875rem', fontWeight: 500,
                          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                          flex: 1,
                        }}>
                          {item.label}
                        </span>
                        {isActive && (
                          <span style={{ fontSize: '0.625rem', color: 'var(--text-muted)' }}>
                            Enter
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>

            <div style={{
              display: 'flex', alignItems: 'center', gap: '1rem',
              padding: '0.6rem 1.25rem',
              borderTop: '1px solid rgba(255,255,255,0.06)',
              fontSize: '0.625rem', color: 'var(--text-muted)',
            }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <kbd style={{ padding: '0.1rem 0.3rem', borderRadius: 3, background: 'rgba(255,255,255,0.06)', fontSize: '0.6rem' }}>
                  ↑↓
                </kbd>
                Navigate
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <kbd style={{ padding: '0.1rem 0.3rem', borderRadius: 3, background: 'rgba(255,255,255,0.06)', fontSize: '0.6rem' }}>
                  ↵
                </kbd>
                Select
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginLeft: 'auto' }}>
                <Command size={10} /> K to toggle
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
