import { GitBranch, MessageSquare, Mail, Database } from 'lucide-react';
import { motion } from 'framer-motion';

const INTEGRATIONS = [
  { id: 'github', name: 'GitHub', icon: <GitBranch size={24} />, status: 'Connected', color: '#2ea043' },
  { id: 'discord', name: 'Discord', icon: <MessageSquare size={24} />, status: 'Connected', color: '#5865f2' },
  { id: 'gmail', name: 'Gmail', icon: <Mail size={24} />, status: 'Syncing...', color: '#ea4335' },
  { id: 'jira', name: 'Jira', icon: <Database size={24} />, status: 'Not Connected', color: '#64748b' }
];

export function IntegrationStatus() {
  return (
    <div className="glass-card bento-item">
      <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', fontWeight: 600 }}>Data Connectors</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem' }}>
        {INTEGRATIONS.map((app) => (
          <motion.div 
            key={app.id}
            onClick={() => {
              window.location.href = `http://localhost:8000/api/connect/${app.id}`;
            }}
            style={{ 
              padding: '1rem', 
              borderRadius: 'var(--radius-sm)', 
              background: 'rgba(0,0,0,0.2)',
              border: '1px solid rgba(255,255,255,0.05)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.75rem',
              cursor: 'pointer'
            }}
          >
            <div style={{ color: app.color }}>
              {app.icon}
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.875rem', fontWeight: 500 }}>{app.name}</div>
              <div style={{ 
                fontSize: '0.75rem', 
                color: app.status === 'Connected' ? '#10b981' : app.status === 'Syncing...' ? '#eab308' : 'var(--text-muted)',
                marginTop: '0.25rem'
              }}>
                {app.status}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
