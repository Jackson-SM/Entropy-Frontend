import { motion } from 'framer-motion';
import { MOCK_RESULTS } from '../../data/mockData';
import { SynthesizedAnswer } from './SynthesizedAnswer';

export function SearchResults() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ width: '100%', maxWidth: '800px', marginTop: '3rem' }}
    >
      <SynthesizedAnswer />

      <h4 style={{ color: 'var(--text-muted)', marginBottom: '1rem', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Retrieved Contexts</h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {MOCK_RESULTS.map((res, index) => (
          <motion.div 
            key={res.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-card"
            style={{ padding: '1.25rem' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                {res.icon}
                <span style={{ fontWeight: 600 }}>{res.title}</span>
              </div>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{res.date}</span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', lineHeight: 1.5, margin: 0 }}>
              "{res.text}"
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
