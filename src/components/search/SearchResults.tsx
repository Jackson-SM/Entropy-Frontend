import { motion } from 'framer-motion';
import { GitBranch, Mail, Hash, HardDrive, FileText, MessageSquare } from 'lucide-react';
import { SynthesizedAnswer } from './SynthesizedAnswer';
import type { SearchResult } from '../../types';

const SOURCE_ICONS: Record<string, React.ReactNode> = {
  gmail: <Mail size={18} color="#ea4335" />,
  gdrive: <HardDrive size={18} color="#4285f4" />,
  notion: <FileText size={18} color="#ffffff" />,
  slack: <Hash size={18} color="#4a154b" />,
  github: <GitBranch size={18} color="#2ea043" />,
};

const SOURCE_LABELS: Record<string, string> = {
  gmail: 'Gmail',
  gdrive: 'Google Drive',
  notion: 'Notion',
  slack: 'Slack',
  github: 'GitHub',
};

interface SearchResultsProps {
  results: SearchResult[];
  synthesizedAnswer?: string | null;
}

export function SearchResults({ results, synthesizedAnswer }: SearchResultsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ width: '100%', maxWidth: '800px', marginTop: '3rem' }}
    >
      {synthesizedAnswer && <SynthesizedAnswer answer={synthesizedAnswer} />}

      <h4
        style={{
          color: 'var(--text-muted)',
          marginBottom: '1rem',
          fontSize: '0.875rem',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}
      >
        Retrieved Contexts
      </h4>

      {results.length === 0 ? (
        <div
          className="glass-card"
          style={{
            padding: '2rem',
            textAlign: 'center',
            color: 'var(--text-muted)',
          }}
        >
          No results found. Try connecting more services or syncing your data.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {results.map((res, index) => (
            <motion.div
              key={res.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.08 }}
              className="glass-card"
              style={{
                padding: '1.25rem',
                cursor: res.url ? 'pointer' : 'default',
              }}
              onClick={() => res.url && window.open(res.url, '_blank')}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '0.75rem',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                  }}
                >
                  {SOURCE_ICONS[res.source] ?? <MessageSquare size={18} />}
                  <div>
                    <span style={{ fontWeight: 600 }}>{res.title}</span>
                    <span
                      style={{
                        marginLeft: '0.5rem',
                        fontSize: '0.75rem',
                        color: 'var(--text-muted)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                      }}
                    >
                      {SOURCE_LABELS[res.source] ?? res.source}
                    </span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  {res.relevance != null && (
                    <span
                      style={{
                        fontSize: '0.75rem',
                        color: 'var(--accent-primary)',
                        fontWeight: 600,
                      }}
                    >
                      {res.relevance}%
                    </span>
                  )}
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                    {res.date}
                  </span>
                </div>
              </div>
              <p
                style={{
                  color: 'var(--text-secondary)',
                  fontSize: '0.9375rem',
                  lineHeight: 1.5,
                  margin: 0,
                }}
              >
                "{res.text}"
              </p>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
