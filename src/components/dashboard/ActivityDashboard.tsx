import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Search, TrendingUp, Calendar, Zap, Clock,
  CheckCircle, XCircle, AlertTriangle,
  Mail, HardDrive, FileText, Hash, GitBranch,
} from 'lucide-react';
import { ActivityGraph } from './ActivityGraph';
import { useIntegrations } from '../../hooks/useIntegrations';
import { useRecentSearches, type SearchEntry } from '../../hooks/useRecentSearches';
import { useNotifications, type Notification } from '../../hooks/useNotifications';

const SOURCE_ICONS: Record<string, React.ReactNode> = {
  gmail: <Mail size={14} />,
  gdrive: <HardDrive size={14} />,
  notion: <FileText size={14} />,
  slack: <Hash size={14} />,
  github: <GitBranch size={14} />,
};

function SearchVolumeChart({ entries }: { entries: SearchEntry[] }) {
  const last7 = useMemo(() => {
    const days: number[] = Array(7).fill(0);
    const now = Date.now();
    entries.forEach(e => {
      const daysAgo = Math.floor((now - e.timestamp) / 86400000);
      if (daysAgo < 7) days[6 - daysAgo]++;
    });
    return days;
  }, [entries]);

  const max = Math.max(...last7, 1);
  const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const today = new Date().getDay();
  const labels = Array.from({ length: 7 }, (_, i) => dayLabels[(today - 6 + i + 7) % 7]);

  return (
    <div className="glass-card-static" style={{ padding: '1.25rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
        <TrendingUp size={16} color="var(--accent-primary)" />
        <h3 style={{ margin: 0, fontSize: '0.9375rem', fontWeight: 700 }}>Search Volume</h3>
        <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', marginLeft: 'auto' }}>Last 7 days</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.375rem', height: 80 }}>
        {last7.map((count, i) => (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${(count / max) * 100}%` }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              style={{
                width: '100%', minHeight: count > 0 ? 4 : 2,
                borderRadius: '3px 3px 0 0',
                background: count > 0
                  ? `linear-gradient(to top, var(--accent-primary), var(--accent-secondary))`
                  : 'var(--border-subtle)',
              }}
            />
            <span style={{ fontSize: '0.5625rem', color: 'var(--text-muted)' }}>{labels[i]}</span>
          </div>
        ))}
      </div>
      <div style={{
        marginTop: '0.75rem', paddingTop: '0.75rem',
        borderTop: '1px solid var(--border-subtle)',
        display: 'flex', justifyContent: 'space-between',
        fontSize: '0.75rem',
      }}>
        <span style={{ color: 'var(--text-muted)' }}>Total this week</span>
        <span style={{ color: 'var(--accent-primary)', fontWeight: 700 }}>
          {last7.reduce((a, b) => a + b, 0)} searches
        </span>
      </div>
    </div>
  );
}

function SyncTimeline({ notifications }: { notifications: Notification[] }) {
  const syncEvents = notifications.filter(n => n.type === 'sync_complete' || n.type === 'sync_error').slice(0, 8);

  return (
    <div className="glass-card-static" style={{ padding: '1.25rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
        <Clock size={16} color="var(--color-warning)" />
        <h3 style={{ margin: 0, fontSize: '0.9375rem', fontWeight: 700 }}>Sync Timeline</h3>
      </div>
      {syncEvents.length === 0 ? (
        <p style={{ color: 'var(--text-muted)', fontSize: '0.8125rem', margin: 0 }}>
          No sync events yet. Connect and sync a service to see activity here.
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {syncEvents.map(event => (
            <div key={event.id} style={{
              display: 'flex', alignItems: 'center', gap: '0.6rem',
              padding: '0.5rem 0', borderBottom: '1px solid var(--border-subtle)',
            }}>
              {event.type === 'sync_complete'
                ? <CheckCircle size={14} color="var(--color-success)" />
                : <XCircle size={14} color="var(--color-error)" />
              }
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '0.8125rem', fontWeight: 500 }}>{event.title}</div>
                <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>{event.message}</div>
              </div>
              <span style={{ fontSize: '0.625rem', color: 'var(--text-muted)', flexShrink: 0 }}>
                {new Date(event.timestamp).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ConnectorHealth() {
  const { integrations, loading } = useIntegrations();

  if (loading) return null;

  const connected = integrations.filter(i => i.status === 'connected');
  const errored = integrations.filter(i => i.status === 'error');
  const total = integrations.length;

  return (
    <div className="glass-card-static" style={{ padding: '1.25rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
        <Zap size={16} color="var(--accent-tertiary)" />
        <h3 style={{ margin: 0, fontSize: '0.9375rem', fontWeight: 700 }}>Connector Health</h3>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <div style={{ flex: 1, textAlign: 'center', padding: '0.75rem', borderRadius: 'var(--radius-md)', background: 'rgba(16,185,129,0.08)' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-success)' }}>{connected.length}</div>
          <div style={{ fontSize: '0.625rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Healthy</div>
        </div>
        <div style={{ flex: 1, textAlign: 'center', padding: '0.75rem', borderRadius: 'var(--radius-md)', background: errored.length > 0 ? 'rgba(239,68,68,0.08)' : 'rgba(100,116,139,0.05)' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: errored.length > 0 ? 'var(--color-error)' : 'var(--text-muted)' }}>{errored.length}</div>
          <div style={{ fontSize: '0.625rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Errors</div>
        </div>
        <div style={{ flex: 1, textAlign: 'center', padding: '0.75rem', borderRadius: 'var(--radius-md)', background: 'rgba(99,102,241,0.05)' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-secondary)' }}>{total}</div>
          <div style={{ fontSize: '0.625rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Total</div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
        {integrations.map(i => (
          <div key={i.id} style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.375rem 0',
          }}>
            <span style={{ color: i.color, flexShrink: 0 }}>{SOURCE_ICONS[i.id]}</span>
            <span style={{ fontSize: '0.8125rem', flex: 1 }}>{i.name}</span>
            {i.status === 'connected' && <CheckCircle size={12} color="var(--color-success)" />}
            {i.status === 'error' && <AlertTriangle size={12} color="var(--color-error)" />}
            {i.status === 'not_connected' && <span style={{ fontSize: '0.625rem', color: 'var(--text-muted)' }}>Off</span>}
            {i.status === 'syncing' && <span style={{ fontSize: '0.625rem', color: 'var(--color-warning)' }}>Syncing</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

export function ActivityDashboard() {
  const { entries } = useRecentSearches();
  const { notifications } = useNotifications();
  const totalSearches = entries.length;

  return (
    <div style={{ marginTop: '2rem' }}>
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.25rem)', margin: 0 }}>Activity</h2>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.4rem 0.8rem', borderRadius: 'var(--radius-full)',
            background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.15)',
          }}>
            <Search size={13} color="var(--accent-primary)" />
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent-primary)' }}>
              {totalSearches} total searches
            </span>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1rem', marginBottom: '1.5rem',
        }}>
          <SearchVolumeChart entries={entries} />
          <ConnectorHealth />
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1rem',
        }}>
          <ActivityGraph />
          <SyncTimeline notifications={notifications} />
        </div>
      </motion.div>
    </div>
  );
}
