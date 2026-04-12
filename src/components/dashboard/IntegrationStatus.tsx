import { motion } from 'framer-motion';
import {
  GitBranch,
  Mail,
  Hash,
  CheckCircle,
  XCircle,
  RefreshCw,
  ExternalLink,
  HardDrive,
  FileText,
} from 'lucide-react';
import { getConnectorUrl } from '../../api/client';
import { useIntegrations } from '../../hooks/useIntegrations';
import type { Integration } from '../../types';

const CONNECTOR_ICONS: Record<string, React.ReactNode> = {
  gmail: <Mail size={28} />,
  gdrive: <HardDrive size={28} />,
  notion: <FileText size={28} />,
  slack: <Hash size={28} />,
  github: <GitBranch size={28} />,
};

const CONNECTOR_DESCRIPTIONS: Record<string, string> = {
  gmail: 'Index your emails and find information from your inbox.',
  gdrive: 'Search documents, spreadsheets and files from Google Drive.',
  notion: 'Index pages and databases from your Notion workspace.',
  slack: 'Search messages and conversations from your Slack workspaces.',
  github: 'Search commits, issues, and pull requests from your repositories.',
};

function StatusBadge({ status }: { status: Integration['status'] }) {
  const config = {
    connected: { color: '#10b981', icon: <CheckCircle size={12} />, label: 'Connected' },
    not_connected: { color: 'var(--text-muted)', icon: <XCircle size={12} />, label: 'Not Connected' },
    syncing: { color: '#eab308', icon: <RefreshCw size={12} />, label: 'Syncing...' },
    error: { color: '#ef4444', icon: <XCircle size={12} />, label: 'Error' },
  }[status];

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: config.color, fontSize: '0.75rem', fontWeight: 500 }}>
      {config.icon}
      {config.label}
    </div>
  );
}

export function IntegrationStatus() {
  const { integrations, loading, syncingId, sync } = useIntegrations();

  const handleConnect = (id: string) => {
    window.location.href = getConnectorUrl(id);
  };

  const handleSync = async (id: string) => {
    try {
      const result = await sync(id);
      alert(`Synced ${result.synced} items from ${id}`);
    } catch {
      alert(`Failed to sync ${id}`);
    }
  };

  const formatLastSync = (last_sync?: string | null) => {
    if (!last_sync) return null;
    try {
      return new Date(last_sync).toLocaleString();
    } catch {
      return last_sync;
    }
  };

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="glass-card"
              style={{
                padding: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                opacity: 0.4,
                animation: 'pulse 1.5s infinite',
              }}
            >
              <div style={{ width: 48, height: 48, borderRadius: '12px', background: 'rgba(255,255,255,0.05)' }} />
              <div style={{ flex: 1 }}>
                <div style={{ width: 120, height: 16, borderRadius: 4, background: 'rgba(255,255,255,0.05)', marginBottom: 8 }} />
                <div style={{ width: 200, height: 12, borderRadius: 4, background: 'rgba(255,255,255,0.03)' }} />
              </div>
            </div>
          ))
        ) : (
          integrations.map((integration, index) => {
            const isConnected = integration.status === 'connected';
            const isSyncing = syncingId === integration.id;

            return (
              <motion.div
                key={integration.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.06 }}
                className="glass-card"
                style={{ padding: '1.5rem' }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                  <div
                    style={{
                      width: 48, height: 48, borderRadius: '12px',
                      background: `${integration.color}22`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: integration.color, flexShrink: 0,
                    }}
                  >
                    {CONNECTOR_ICONS[integration.id]}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>{integration.name}</h4>
                        <StatusBadge status={isSyncing ? 'syncing' : integration.status} />
                      </div>

                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {isConnected && (
                          <motion.button
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.96 }}
                            onClick={() => handleSync(integration.id)}
                            disabled={isSyncing}
                            style={{
                              padding: '0.4rem 0.875rem', borderRadius: 'var(--radius-sm)',
                              background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)',
                              color: 'var(--accent-primary)', fontWeight: 500, cursor: isSyncing ? 'wait' : 'pointer',
                              fontSize: '0.8125rem', display: 'flex', alignItems: 'center', gap: '0.4rem',
                              opacity: isSyncing ? 0.6 : 1,
                            }}
                          >
                            <RefreshCw size={13} style={{ animation: isSyncing ? 'spin 1s linear infinite' : 'none' }} />
                            {isSyncing ? 'Syncing...' : 'Sync Now'}
                          </motion.button>
                        )}
                        <motion.button
                          whileHover={{ scale: 1.04 }}
                          whileTap={{ scale: 0.96 }}
                          onClick={() => handleConnect(integration.id)}
                          style={{
                            padding: '0.4rem 0.875rem', borderRadius: 'var(--radius-sm)',
                            background: isConnected ? 'rgba(255,255,255,0.05)' : 'var(--accent-primary)',
                            border: isConnected ? '1px solid rgba(255,255,255,0.1)' : 'none',
                            color: isConnected ? 'var(--text-secondary)' : '#fff',
                            fontWeight: 500, cursor: 'pointer', fontSize: '0.8125rem',
                            display: 'flex', alignItems: 'center', gap: '0.4rem',
                          }}
                        >
                          <ExternalLink size={13} />
                          {isConnected ? 'Reconnect' : 'Connect'}
                        </motion.button>
                      </div>
                    </div>

                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', margin: 0, lineHeight: 1.4 }}>
                      {CONNECTOR_DESCRIPTIONS[integration.id]}
                    </p>

                    {isConnected && (
                      <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.75rem' }}>
                        {integration.items_synced != null && integration.items_synced > 0 && (
                          <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                            <span style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>
                              {integration.items_synced.toLocaleString()}
                            </span>{' '}
                            items indexed
                          </span>
                        )}
                        {formatLastSync(integration.last_sync) && (
                          <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                            Last sync: {formatLastSync(integration.last_sync)}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.2; }
        }
      `}</style>
    </>
  );
}
