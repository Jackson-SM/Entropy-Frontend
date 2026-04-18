import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, HardDrive, FileText, Hash, GitBranch, X, Calendar } from 'lucide-react';

export interface SearchFilterState {
  sources: string[];
  dateFrom: string;
  dateTo: string;
}

interface SearchFiltersProps {
  open: boolean;
  filters: SearchFilterState;
  onChange: (filters: SearchFilterState) => void;
  onClose: () => void;
}

const SOURCES = [
  { id: 'gmail', label: 'Gmail', icon: <Mail size={14} />, color: '#ea4335' },
  { id: 'gdrive', label: 'Drive', icon: <HardDrive size={14} />, color: '#4285f4' },
  { id: 'notion', label: 'Notion', icon: <FileText size={14} />, color: '#9b9b9b' },
  { id: 'slack', label: 'Slack', icon: <Hash size={14} />, color: '#e01e5a' },
  { id: 'github', label: 'GitHub', icon: <GitBranch size={14} />, color: '#2ea043' },
];

const DATE_PRESETS = [
  { label: 'Past week', days: 7 },
  { label: 'Past month', days: 30 },
  { label: 'Past 3 months', days: 90 },
  { label: 'Past year', days: 365 },
];

function daysAgo(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().slice(0, 10);
}

export function SearchFilters({ open, filters, onChange, onClose }: SearchFiltersProps) {
  const toggleSource = (id: string) => {
    const next = filters.sources.includes(id)
      ? filters.sources.filter(s => s !== id)
      : [...filters.sources, id];
    onChange({ ...filters, sources: next });
  };

  const setPreset = (days: number) => {
    onChange({ ...filters, dateFrom: daysAgo(days), dateTo: '' });
  };

  const clearFilters = () => {
    onChange({ sources: [], dateFrom: '', dateTo: '' });
  };

  const hasFilters = filters.sources.length > 0 || filters.dateFrom || filters.dateTo;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
          style={{ overflow: 'hidden', width: '100%' }}
        >
          <div className="glass-card-static" style={{
            padding: '1.25rem', marginTop: '0.75rem',
            display: 'flex', flexDirection: 'column', gap: '1rem',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h4 style={{
                fontSize: '0.6875rem', fontWeight: 600, color: 'var(--text-muted)',
                textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0,
              }}>
                Filter by source
              </h4>
              <button onClick={onClose} className="btn-icon" style={{ padding: '0.2rem' }}>
                <X size={14} />
              </button>
            </div>

            <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
              {SOURCES.map(src => {
                const active = filters.sources.includes(src.id);
                return (
                  <button
                    key={src.id}
                    onClick={() => toggleSource(src.id)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '0.35rem',
                      padding: '0.35rem 0.7rem', borderRadius: 'var(--radius-full)',
                      fontSize: '0.75rem', fontWeight: 500, fontFamily: 'var(--font-body)',
                      cursor: 'pointer',
                      border: `1px solid ${active ? src.color : 'var(--border-subtle)'}`,
                      background: active ? `${src.color}18` : 'transparent',
                      color: active ? src.color : 'var(--text-muted)',
                      transition: 'all 150ms',
                    }}
                  >
                    {src.icon} {src.label}
                  </button>
                );
              })}
            </div>

            <div>
              <h4 style={{
                fontSize: '0.6875rem', fontWeight: 600, color: 'var(--text-muted)',
                textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 0.5rem',
              }}>
                <Calendar size={11} style={{ marginRight: '0.3rem', verticalAlign: '-1px' }} />
                Date range
              </h4>
              <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                {DATE_PRESETS.map(p => (
                  <button
                    key={p.days}
                    onClick={() => setPreset(p.days)}
                    style={{
                      padding: '0.3rem 0.65rem', borderRadius: 'var(--radius-full)',
                      fontSize: '0.6875rem', fontWeight: 500, fontFamily: 'var(--font-body)',
                      cursor: 'pointer',
                      border: `1px solid ${filters.dateFrom === daysAgo(p.days) ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
                      background: filters.dateFrom === daysAgo(p.days) ? 'rgba(99,102,241,0.12)' : 'transparent',
                      color: filters.dateFrom === daysAgo(p.days) ? 'var(--accent-primary)' : 'var(--text-muted)',
                      transition: 'all 150ms',
                    }}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <input
                  type="date"
                  value={filters.dateFrom}
                  onChange={e => onChange({ ...filters, dateFrom: e.target.value })}
                  style={{
                    flex: 1, padding: '0.35rem 0.5rem', borderRadius: 'var(--radius-sm)',
                    background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)',
                    color: 'var(--text-primary)', fontSize: '0.75rem', fontFamily: 'var(--font-body)',
                  }}
                />
                <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>to</span>
                <input
                  type="date"
                  value={filters.dateTo}
                  onChange={e => onChange({ ...filters, dateTo: e.target.value })}
                  style={{
                    flex: 1, padding: '0.35rem 0.5rem', borderRadius: 'var(--radius-sm)',
                    background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)',
                    color: 'var(--text-primary)', fontSize: '0.75rem', fontFamily: 'var(--font-body)',
                  }}
                />
              </div>
            </div>

            {hasFilters && (
              <button onClick={clearFilters} className="btn-ghost" style={{ alignSelf: 'flex-start', fontSize: '0.6875rem' }}>
                Clear all filters
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
