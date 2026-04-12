import { Sparkles, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  onSelect: (query: string) => void;
}

const QUERIES = [
  "Summarize my recent commits in AutoGPT",
  "Did anyone mention database migrations yesterday?",
  "Find the design doc shared by Sarah last week",
  "What's my schedule looking like tomorrow?"
];

export function SuggestedQueries({ onSelect }: Props) {
  return (
    <div className="glass-card bento-item">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
        <Sparkles size={20} color="var(--accent-secondary)" />
        <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Try Asking</h3>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {QUERIES.map((q) => (
          <motion.div
            key={q}
            whileHover={{ x: 4, background: 'rgba(255,255,255,0.1)' }}
            onClick={() => onSelect(q)}
            style={{
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(0,0,0,0.2)',
              border: '1px solid rgba(255,255,255,0.05)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              color: 'var(--text-secondary)'
            }}
          >
            <span style={{ fontSize: '0.875rem' }}>{q}</span>
            <ArrowRight size={16} color="var(--text-muted)" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
