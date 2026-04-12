import { motion } from 'framer-motion';
import { Database, Link2, Clock, Zap } from 'lucide-react';
import { ActivityGraph } from './ActivityGraph';
import { SuggestedQueries } from './SuggestedQueries';
import { useIntegrations } from '../../hooks/useIntegrations';

interface Props {
  onSelectQuery: (query: string) => void;
}

export function HomeDashboard({ onSelectQuery }: Props) {
  const { integrations, loading } = useIntegrations();

  const connectedCount = integrations.filter(i => i.status === 'connected').length;
  const totalIndexed = integrations.reduce((sum, i) => sum + (i.items_synced ?? 0), 0);
  const lastSyncDate = integrations
    .filter(i => i.last_sync)
    .sort((a, b) => new Date(b.last_sync!).getTime() - new Date(a.last_sync!).getTime())[0]?.last_sync;

  const stats = [
    {
      icon: Link2,
      label: 'Connected',
      value: loading ? '—' : `${connectedCount}/${integrations.length}`,
      color: 'var(--color-success)',
      bgColor: 'rgba(16, 185, 129, 0.1)',
    },
    {
      icon: Database,
      label: 'Indexed Items',
      value: loading ? '—' : totalIndexed.toLocaleString(),
      color: 'var(--accent-primary)',
      bgColor: 'rgba(99, 102, 241, 0.1)',
    },
    {
      icon: Clock,
      label: 'Last Sync',
      value: loading
        ? '—'
        : lastSyncDate
          ? new Date(lastSyncDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
          : 'Never',
      color: 'var(--color-warning)',
      bgColor: 'rgba(245, 158, 11, 0.1)',
    },
    {
      icon: Zap,
      label: 'Status',
      value: loading ? '—' : connectedCount > 0 ? 'Active' : 'Idle',
      color: connectedCount > 0 ? 'var(--accent-tertiary)' : 'var(--text-muted)',
      bgColor: connectedCount > 0 ? 'rgba(6, 182, 212, 0.1)' : 'rgba(100, 116, 139, 0.1)',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        marginTop: '1.5rem',
      }}
    >
      {/* Stats Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
        gap: '0.75rem',
      }}>
        {stats.map(({ icon: Icon, label, value, color, bgColor }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass-card-static"
            style={{
              padding: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.875rem',
            }}
          >
            <div style={{
              width: 40, height: 40,
              borderRadius: 'var(--radius-md)',
              background: bgColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color,
              flexShrink: 0,
            }}>
              <Icon size={18} strokeWidth={2} />
            </div>
            <div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, lineHeight: 1.2, color: 'var(--text-primary)' }}>
                {value}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500, letterSpacing: '0.02em' }}>
                {label}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Activity + Suggestions */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '1.5rem',
      }}>
        <ActivityGraph />
        <SuggestedQueries onSelect={onSelectQuery} />
      </div>
    </motion.div>
  );
}
