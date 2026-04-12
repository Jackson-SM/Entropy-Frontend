import { Sparkles } from 'lucide-react';

export function SynthesizedAnswer() {
  return (
    <div className="glass-card" style={{ marginBottom: '2rem', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: 'linear-gradient(to bottom, var(--accent-primary), var(--accent-secondary))' }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
        <Sparkles size={20} color="var(--accent-secondary)" />
        <h3 style={{ margin: 0, fontSize: '1.125rem' }}>Synthesized Answer</h3>
      </div>
      <p style={{ lineHeight: 1.6, color: 'var(--text-primary)' }}>
        Based on your digital trail, your boss mentioned the deadline change yesterday on <strong>Discord</strong> in the <span style={{ color: 'var(--accent-primary)', cursor: 'pointer' }}>#ai-dev</span> channel. 
        They stated that they are "checking in on the new contextual search idea" and would like you to "get the embeddings pipeline ready by Friday's demo."
      </p>
    </div>
  );
}
