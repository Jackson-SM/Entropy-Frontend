import { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, ExternalLink, Copy, Bookmark,
  Mail, HardDrive, FileText, Hash, GitBranch, MessageSquare,
} from 'lucide-react';
import { useBookmarks } from '../../hooks/useBookmarks';
import { useToast } from '../ui/Toast';
import type { SearchResult } from '../../types';

const SOURCE_CFG: Record<string, { icon: React.ReactNode; label: string; color: string }> = {
  gmail:  { icon: <Mail size={16} />,      label: 'Gmail',        color: '#ea4335' },
  gdrive: { icon: <HardDrive size={16} />, label: 'Google Drive', color: '#4285f4' },
  notion: { icon: <FileText size={16} />,  label: 'Notion',       color: '#ffffff' },
  slack:  { icon: <Hash size={16} />,      label: 'Slack',        color: '#e01e5a' },
  github: { icon: <GitBranch size={16} />, label: 'GitHub',       color: '#2ea043' },
};

interface Props {
  result: SearchResult | null;
  onClose: () => void;
}

export function ResultDetailPanel({ result, onClose }: Props) {
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const toast = useToast();

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);

  useEffect(() => {
    if (!result) return;
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [result, handleKeyDown]);

  const cfg = result ? SOURCE_CFG[result.source] : null;

  return (
    <AnimatePresence>
      {result && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'fixed', inset: 0, zIndex: 150,
              background: 'rgba(0,0,0,0.4)',
            }}
          />
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            style={{
              position: 'fixed', top: 0, right: 0, bottom: 0,
              width: 'min(520px, 100vw)', zIndex: 151,
              background: 'var(--bg-elevated)',
              borderLeft: '1px solid var(--border-subtle)',
              boxShadow: '-8px 0 40px rgba(0,0,0,0.3)',
              display: 'flex', flexDirection: 'column',
              overflowY: 'auto',
            }}
          >
            {/* Header */}
            <div style={{
              padding: '1.25rem 1.5rem',
              borderBottom: '1px solid var(--border-subtle)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              flexShrink: 0,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 'var(--radius-md)',
                  background: `${cfg?.color ?? '#666'}15`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: cfg?.color ?? '#999',
                }}>
                  {cfg?.icon ?? <MessageSquare size={16} />}
                </div>
                <div>
                  <div style={{
                    fontSize: '0.6875rem', fontWeight: 600,
                    color: cfg?.color ?? 'var(--text-muted)',
                    textTransform: 'uppercase', letterSpacing: '0.04em',
                  }}>
                    {cfg?.label ?? result.source}
                  </div>
                  {result.date && (
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {result.date}
                    </div>
                  )}
                </div>
              </div>
              <button onClick={onClose} className="btn-icon">
                <X size={18} />
              </button>
            </div>

            {/* Content */}
            <div style={{ padding: '1.5rem', flex: 1 }}>
              <h2 style={{
                fontSize: '1.25rem', fontWeight: 700,
                lineHeight: 1.3, marginBottom: '0.5rem',
              }}>
                {result.title}
              </h2>

              {result.relevance != null && (
                <span style={{
                  display: 'inline-flex', alignItems: 'center',
                  fontSize: '0.75rem', color: 'var(--accent-primary)', fontWeight: 700,
                  background: 'rgba(99,102,241,0.12)',
                  padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-full)',
                  marginBottom: '1.25rem',
                }}>
                  {result.relevance}% match
                </span>
              )}

              <div style={{
                color: 'var(--text-secondary)',
                fontSize: '0.9375rem',
                lineHeight: 1.7,
                whiteSpace: 'pre-wrap',
              }}>
                {result.text}
              </div>
            </div>

            {/* Actions */}
            <div style={{
              padding: '1rem 1.5rem',
              borderTop: '1px solid var(--border-subtle)',
              display: 'flex', gap: '0.5rem', flexShrink: 0,
              flexWrap: 'wrap',
            }}>
              {result.url && (
                <button
                  onClick={() => window.open(result.url, '_blank')}
                  className="btn-primary"
                  style={{ flex: 1, minWidth: 120 }}
                >
                  <ExternalLink size={14} />
                  Open Original
                </button>
              )}
              {result.url && (
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(result.url!);
                    toast.success('Link copied');
                  }}
                  className="btn-ghost"
                  style={{ justifyContent: 'center' }}
                >
                  <Copy size={14} />
                </button>
              )}
              <button
                onClick={() => {
                  toggleBookmark(result);
                  toast.success(isBookmarked(result.id) ? 'Removed' : 'Saved');
                }}
                className="btn-ghost"
                style={{
                  justifyContent: 'center',
                  color: isBookmarked(result.id) ? 'var(--accent-secondary)' : undefined,
                }}
              >
                <Bookmark size={14} fill={isBookmarked(result.id) ? 'currentColor' : 'none'} />
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
