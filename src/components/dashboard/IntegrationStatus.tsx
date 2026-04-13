import { motion } from 'framer-motion';
import {
  GitBranch, Mail, Hash, CheckCircle, XCircle, RefreshCw,
  ExternalLink, HardDrive, FileText, ArrowUpRight,
} from 'lucide-react';
import { getConnectorUrl } from '../../api/client';
import { useIntegrations } from '../../hooks/useIntegrations';
import { useToast } from '../ui/Toast';
import type { Integration } from '../../types';

const CONNECTOR_ICONS: Record<string, React.ReactNode> = {
  gmail: <Mail size={24} />,
  gdrive: <HardDrive size={24} />,
  notion: <FileText size={24} />,
  slack: <Hash size={24} />,
  github: <GitBranch size={24} />,
};

const CONNECTOR_DESCRIPTIONS: Record<string, string> = {
  gmail: 'Emails and inbox messages',
  gdrive: 'Documents, sheets and files',
  notion: 'Pages and databases',
  slack: 'Messages and conversations',
  github: 'Commits, issues and PRs',
};

function StatusBadge({ status }: { status: Integration['status'] }) {
  const config = {
    connected:     { color: 'var(--color-success)', bg: 'rgba(16,185,129,0.12)', icon: <CheckCircle size={11} />, label: 'Connected' },
    not_connected: { color: 'var(--text-muted)',     bg: 'rgba(100,116,139,0.1)', icon: <XCircle size={11} />,    label: 'Not Connected' },
    syncing:       { color: 'var(--color-warning)',  bg: 'rgba(245,158,11,0.12)', icon: <RefreshCw size={11} />,  label: 'Syncing' },
    error:         { color: 'var(--color-error)',    bg: 'rgba(239,68,68,0.12)',  icon: <XCircle size={11} />,    label: 'Error' },
  }[status];

  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
      fontSize: '0.6875rem', fontWeight: 600,
      padding: '0.2rem 0.6rem',
      borderRadius: 'var(--radius-full)',
      background: config.bg,
      color: config.color,
    }}>
      {config.icon}
      {config.label}
    </span>
  );
}

export function IntegrationStatus() {
  const { integrations, loading, sync } = useIntegrations();
  const toast = useToast();

  const handleConnect = (id: string) => {
    window.location.href = getConnectorUrl(id);
  };

  const handleSync = async (id: string) => {
    try {
      await sync(id);
      toast.success(`Sync started for ${id} — check back shortly.`);
    } catch {
      toast.error(`Failed to sync ${id}. Try reconnecting.`);
    }
  };

  const formatLastSync = (last_sync?: string | null) => {
    if (!last_sync) return null;
    try {
      const d = new Date(last_sync);
      const now = new Date();
      const diffMs = now.getTime() - d.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours}h ago`;
      return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    } catch {
      return last_sync;
    }
  };

  if (loading) {
    return (
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '1rem',
      }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="glass-card-static"
            style={{ height: 160, animation: 'pulse 1.5s infinite' }}
          />
        ))}
      </div>
    );
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
      gap: '1rem',
    }}>
      {integrations.map((integration, index) => {
        const isConnected = integration.status === 'connected';
        const isSyncing = integration.status === 'syncing';

        return (
          <motion.div
            key={integration.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="glass-card-glow"
            style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  width: 44, height: 44,
                  borderRadius: 'var(--radius-md)',
                  background: `${integration.color}15`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: integration.color, flexShrink: 0,
                }}>
                  {CONNECTOR_ICONS[integration.id]}
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '0.9375rem', fontWeight: 600, lineHeight: 1.3 }}>
                    {integration.name}
                  </h4>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                    {CONNECTOR_DESCRIPTIONS[integration.id]}
                  </p>
                </div>
              </div>
              <StatusBadge status={isSyncing ? 'syncing' : integration.status} />
            </div>

            {isConnected && (
              <div style={{
                display: 'flex', gap: '1.5rem',
                padding: '0.6rem 0',
                borderTop: '1px solid rgba(255,255,255,0.04)',
                borderBottom: '1px solid rgba(255,255,255,0.04)',
              }}>
                {integration.items_synced != null && integration.items_synced > 0 && (
                  <div>
                    <div style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {integration.items_synced.toLocaleString()}
                    </div>
                    <div style={{ fontSize: '0.625rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      Items
                    </div>
                  </div>
                )}
                {formatLastSync(integration.last_sync) && (
                  <div>
                    <div style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {formatLastSync(integration.last_sync)}
                    </div>
                    <div style={{ fontSize: '0.625rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      Last Sync
                    </div>
                  </div>
                )}
              </div>
            )}

            <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
              {isConnected && (
                <button
                  onClick={() => handleSync(integration.id)}
                  disabled={isSyncing}
                  className="btn-ghost"
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    opacity: isSyncing ? 0.6 : 1,
                    cursor: isSyncing ? 'wait' : 'pointer',
                  }}
                >
                  <RefreshCw size={13} style={{ animation: isSyncing ? 'spin 1s linear infinite' : 'none' }} />
                  {isSyncing ? 'Syncing...' : 'Sync Now'}
                </button>
              )}
              <button
                onClick={() => handleConnect(integration.id)}
                className="btn-ghost"
                style={{
                  flex: isConnected ? undefined : 1,
                  justifyContent: 'center',
                  ...(isConnected ? {} : {
                    background: 'var(--accent-primary)',
                    color: '#fff',
                    border: 'none',
                    fontWeight: 600,
                  }),
                }}
              >
                {isConnected ? <ArrowUpRight size={13} /> : <ExternalLink size={13} />}
                {isConnected ? 'Reconnect' : 'Connect'}
              </button>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
