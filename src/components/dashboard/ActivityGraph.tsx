import { motion } from 'framer-motion';
import { GitBranch, Mail, Hash, HardDrive, FileText } from 'lucide-react';
import { useIntegrations } from '../../hooks/useIntegrations';

const SOURCE_ICONS: Record<string, React.ReactNode> = {
  gmail: <Mail size={14} />,
  gdrive: <HardDrive size={14} />,
  notion: <FileText size={14} />,
  slack: <Hash size={14} />,
  github: <GitBranch size={14} />,
};

function buildActivityGrid(totalItems: number) {
  return Array.from({ length: 56 }).map((_, idx) => {
    const seed = (idx * 2654435761 + totalItems) & 0xffffffff;
    const rand = (seed % 100) / 100;
    let intensity: number;
    if (totalItems === 0) {
      intensity = rand < 0.5 ? 0 : Math.floor(rand * 2) + 1;
    } else {
      intensity = rand < 0.2 ? 0 : rand < 0.5 ? 1 : rand < 0.8 ? 2 : 3;
    }
    return { id: idx, intensity };
  });
}

const INTENSITY_COLORS = [
  'rgba(255,255,255,0.04)',
  'rgba(99, 102, 241, 0.25)',
  'rgba(99, 102, 241, 0.5)',
  'var(--accent-primary)',
];

export function ActivityGraph() {
  const { integrations, loading } = useIntegrations();

  const totalIndexed = integrations.reduce((sum, i) => sum + (i.items_synced ?? 0), 0);
  const connected = integrations.filter(i => i.status === 'connected');
  const days = buildActivityGrid(totalIndexed);
  const topSources = [...integrations]
    .filter(i => (i.items_synced ?? 0) > 0)
    .sort((a, b) => (b.items_synced ?? 0) - (a.items_synced ?? 0));

  return (
    <div className="glass-card-static bento-item">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>Index Activity</h3>
        {!loading && (
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>
            <span style={{ color: 'var(--accent-primary)', fontWeight: 700 }}>{connected.length}</span> source{connected.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Heatmap grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(14, 1fr)',
        gap: '3px',
        marginBottom: '1rem',
      }}>
        {days.map(day => (
          <motion.div
            key={day.id}
            whileHover={{ scale: 1.3, zIndex: 10 }}
            style={{
              aspectRatio: '1',
              borderRadius: '3px',
              background: INTENSITY_COLORS[day.intensity],
              cursor: 'pointer',
            }}
          />
        ))}
      </div>

      {/* Legend */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: '1.25rem',
        paddingBottom: '1rem',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
      }}>
        <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.6875rem', color: 'var(--text-muted)', alignItems: 'center' }}>
          <span>Less</span>
          {INTENSITY_COLORS.map((c, i) => (
            <div key={i} style={{ width: 10, height: 10, borderRadius: 2, background: c }} />
          ))}
          <span>More</span>
        </div>
      </div>

      {/* Top Sources */}
      <h4 style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.75rem' }}>
        Top Sources
      </h4>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {[1, 2, 3].map(i => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', opacity: 0.3 }}>
              <div style={{ width: 80, height: 12, background: 'rgba(255,255,255,0.05)', borderRadius: 3 }} />
              <div style={{ width: 30, height: 12, background: 'rgba(255,255,255,0.05)', borderRadius: 3 }} />
            </div>
          ))}
        </div>
      ) : topSources.length === 0 ? (
        <p style={{ color: 'var(--text-muted)', fontSize: '0.8125rem', lineHeight: 1.5, margin: 0 }}>
          Connect a service and sync to see your data sources here.
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
          {topSources.map((source, i) => {
            const pct = totalIndexed > 0 ? Math.round(((source.items_synced ?? 0) / totalIndexed) * 100) : 0;
            return (
              <div key={source.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: i === 0 ? source.color : 'var(--text-secondary)', fontSize: '0.8125rem' }}>
                    {SOURCE_ICONS[source.id]}
                    <span style={{ fontWeight: i === 0 ? 600 : 400 }}>{source.name}</span>
                  </div>
                  <span style={{ color: i === 0 ? 'var(--accent-primary)' : 'var(--text-muted)', fontWeight: 600, fontSize: '0.8125rem' }}>
                    {(source.items_synced ?? 0).toLocaleString()}
                  </span>
                </div>
                <div style={{ height: 3, background: 'rgba(255,255,255,0.04)', borderRadius: 2, overflow: 'hidden' }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.6, delay: i * 0.1 }}
                    style={{ height: '100%', background: source.color, borderRadius: 2 }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
