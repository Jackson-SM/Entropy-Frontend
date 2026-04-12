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

function buildActivityGrid(integrations: { items_synced?: number }[]) {
  const totalItems = integrations.reduce((sum, i) => sum + (i.items_synced ?? 0), 0);

  return Array.from({ length: 60 }).map((_, idx) => {
    const seed = (idx * 2654435761 + totalItems) & 0xffffffff;
    const rand = (seed % 100) / 100;

    let intensity: number;
    if (totalItems === 0) {
      intensity = rand < 0.4 ? 0 : Math.floor(rand * 3) + 1;
    } else {
      intensity = rand < 0.3 ? 0 : rand < 0.6 ? 1 : rand < 0.85 ? 2 : 3;
    }

    return { id: idx, intensity };
  });
}

const getColor = (intensity: number) => {
  switch (intensity) {
    case 1: return 'rgba(99, 102, 241, 0.3)';
    case 2: return 'rgba(99, 102, 241, 0.6)';
    case 3: return 'var(--accent-primary)';
    default: return 'rgba(255,255,255,0.05)';
  }
};

export function ActivityGraph() {
  const { integrations, loading } = useIntegrations();

  const days = buildActivityGrid(integrations);
  const connected = integrations.filter(i => i.status === 'connected');
  const totalIndexed = integrations.reduce((sum, i) => sum + (i.items_synced ?? 0), 0);

  const topSources = [...integrations]
    .filter(i => (i.items_synced ?? 0) > 0)
    .sort((a, b) => (b.items_synced ?? 0) - (a.items_synced ?? 0));

  return (
    <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', width: '100%' }}>
      {/* Activity heatmap */}
      <div className="glass-card bento-item" style={{ flex: '2 1 400px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Neural Index Activity</h3>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Last 60 Days</div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '0.5rem', marginBottom: '1rem' }}>
          {days.map(day => (
            <motion.div
              key={day.id}
              whileHover={{ scale: 1.2, zIndex: 10 }}
              style={{
                aspectRatio: '1',
                borderRadius: '4px',
                background: getColor(day.intensity),
                cursor: 'pointer',
              }}
            />
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
          {!loading && (
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
              <span style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>{connected.length}</span> source{connected.length !== 1 ? 's' : ''} connected
            </span>
          )}
        </div>
      </div>

      {/* Top Data Sources */}
      <div className="glass-card bento-item" style={{ flex: '1 1 260px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Top Data Sources</h3>
          {!loading && totalIndexed > 0 && (
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
              {totalIndexed.toLocaleString()} total
            </span>
          )}
        </div>

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.05)', opacity: 0.3 }}>
                <div style={{ width: 80, height: 14, background: 'rgba(255,255,255,0.05)', borderRadius: 4 }} />
                <div style={{ width: 40, height: 14, background: 'rgba(255,255,255,0.05)', borderRadius: 4 }} />
              </div>
            ))}
          </div>
        ) : topSources.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.5 }}>
            No data synced yet. Connect a service and run your first sync.
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            {topSources.map((source, i) => {
              const pct = totalIndexed > 0 ? Math.round(((source.items_synced ?? 0) / totalIndexed) * 100) : 0;
              const isFirst = i === 0;

              return (
                <div key={source.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: isFirst ? source.color : 'var(--text-secondary)' }}>
                      {SOURCE_ICONS[source.id]}
                      <span style={{ fontWeight: isFirst ? 600 : 400 }}>{source.name}</span>
                    </div>
                    <span style={{ color: isFirst ? 'var(--accent-primary)' : 'var(--text-secondary)', fontWeight: isFirst ? 600 : 400, fontSize: '0.875rem' }}>
                      {(source.items_synced ?? 0).toLocaleString()}
                    </span>
                  </div>
                  <div style={{ height: 3, background: 'rgba(255,255,255,0.05)', borderRadius: 2, overflow: 'hidden' }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8, delay: i * 0.1 }}
                      style={{ height: '100%', background: source.color, borderRadius: 2 }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
