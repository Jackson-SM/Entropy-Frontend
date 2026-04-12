import { motion } from 'framer-motion';

export function ActivityGraph() {
  // Generate random mock activity data
  const days = Array.from({ length: 60 }).map((_, i) => ({
    id: i,
    intensity: Math.floor(Math.random() * 4) // 0 to 3
  }));

  const getColor = (intensity: number) => {
    switch(intensity) {
      case 1: return 'rgba(99, 102, 241, 0.3)';
      case 2: return 'rgba(99, 102, 241, 0.6)';
      case 3: return 'var(--accent-primary)';
      case 0:
      default: return 'rgba(255,255,255,0.05)';
    }
  };

  return (
    <div className="glass-card bento-item" style={{ flex: 1 }}>
       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
         <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Neural Index Activity</h3>
         <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Last 60 Days</div>
       </div>
       <div style={{ 
         display: 'grid', 
         gridTemplateColumns: 'repeat(12, 1fr)', 
         gap: '0.5rem',
         marginBottom: '1rem'
       }}>
         {days.map((day) => (
           <motion.div 
             key={day.id}
             whileHover={{ scale: 1.2, zIndex: 10 }}
             style={{
               aspectRatio: '1',
               borderRadius: '4px',
               background: getColor(day.intensity),
               cursor: 'pointer'
             }}
           />
         ))}
       </div>
       <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
         <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <div style={{ width: 8, height: 8, borderRadius: 2, background: 'var(--accent-primary)' }} />
            <span>High Volume</span>
         </div>
         <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <div style={{ width: 8, height: 8, borderRadius: 2, background: 'rgba(255,255,255,0.05)' }} />
            <span>No Activity</span>
         </div>
       </div>
    </div>
  );
}
