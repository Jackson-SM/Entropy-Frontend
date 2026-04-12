import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface SynthesizedAnswerProps {
  answer: string;
}

export function SynthesizedAnswer({ answer }: SynthesizedAnswerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card"
      style={{ marginBottom: '2rem', position: 'relative', overflow: 'hidden' }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '4px',
          height: '100%',
          background: 'linear-gradient(to bottom, var(--accent-primary), var(--accent-secondary))',
        }}
      />
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          marginBottom: '1rem',
        }}
      >
        <Sparkles size={20} color="var(--accent-secondary)" />
        <h3 style={{ margin: 0, fontSize: '1.125rem' }}>Synthesized Answer</h3>
      </div>
      <p style={{ lineHeight: 1.6, color: 'var(--text-primary)', margin: 0 }}>{answer}</p>
    </motion.div>
  );
}
