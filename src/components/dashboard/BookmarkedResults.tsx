import { motion, AnimatePresence } from 'framer-motion';
import {
  GitBranch, Mail, Hash, HardDrive, FileText, MessageSquare,
  Bookmark, ExternalLink, X,
} from 'lucide-react';
import { useBookmarks } from '../../hooks/useBookmarks';
import type { SearchResult } from '../../types';

const SOURCE_CONFIG: Record<string, { icon: React.ReactNode; label: string; color: string }> = {
  gmail:  { icon: <Mail size={14} />,      label: 'Gmail',        color: '#ea4335' },
  gdrive: { icon: <HardDrive size={14} />, label: 'Google Drive', color: '#4285f4' },
  notion: { icon: <FileText size={14} />,  label: 'Notion',       color: '#ffffff' },
  slack:  { icon: <Hash size={14} />,      label: 'Slack',        color: '#e01e5a' },
  github: { icon: <GitBranch size={14} />, label: 'GitHub',       color: '#2ea043' },
};

export function BookmarkedResults() {
  const { bookmarks, removeBookmark } = useBookmarks();

  if (bookmarks.length === 0) return null;

  return (
    <div className="glass-card-static bento-item">
      <div style={{
        display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem',
      }}>
        <Bookmark size={16} color="var(--accent-secondary)" fill="var(--accent-secondary)" strokeWidth={2.2} />
        <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>Saved Results</h3>
        <span style={{
          fontSize: '0.6875rem', color: 'var(--text-muted)',
          background: 'rgba(255,255,255,0.06)',
          padding: '0.1rem 0.45rem', borderRadius: 'var(--radius-full)',
          fontWeight: 600, marginLeft: 'auto',
        }}>
          {bookmarks.length}
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
        <AnimatePresence mode="popLayout">
          {bookmarks.slice(0, 5).map((result: SearchResult) => {
            const cfg = SOURCE_CONFIG[result.source];
            return (
              <motion.div
                key={result.id}
                layout
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 6, height: 0 }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.6rem',
                  padding: '0.6rem 0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(0,0,0,0.2)',
                  border: '1px solid rgba(255,255,255,0.04)',
                  cursor: result.url ? 'pointer' : 'default',
                }}
                onClick={() => result.url && window.open(result.url, '_blank')}
              >
                <div style={{
                  width: 26, height: 26, borderRadius: '6px',
                  background: `${cfg?.color ?? '#666'}18`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: cfg?.color ?? '#999', flexShrink: 0,
                }}>
                  {cfg?.icon ?? <MessageSquare size={14} />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: '0.8125rem', fontWeight: 600,
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                  }}>
                    {result.title}
                  </div>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                    {cfg?.label ?? result.source}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', flexShrink: 0 }}>
                  {result.url && <ExternalLink size={11} color="var(--text-muted)" />}
                  <button
                    onClick={(e) => { e.stopPropagation(); removeBookmark(result.id); }}
                    style={{
                      background: 'rgba(255,255,255,0.04)', border: 'none',
                      width: 22, height: 22, borderRadius: '5px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer', color: 'var(--text-muted)',
                      transition: 'all 150ms',
                    }}
                  >
                    <X size={11} />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
