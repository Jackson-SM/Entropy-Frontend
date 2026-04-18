import { motion } from 'framer-motion';
import {
  Sparkles, Mail, HardDrive, FileText, Hash, GitBranch,
  ArrowRight, Search, Zap,
} from 'lucide-react';
import { getConnectorUrl } from '../../api/client';
import { useAuth } from '../../contexts/AuthContext';

const CONNECTORS = [
  { id: 'gmail', name: 'Gmail', icon: <Mail size={18} />, color: '#ea4335' },
  { id: 'gdrive', name: 'Google Drive', icon: <HardDrive size={18} />, color: '#4285f4' },
  { id: 'github', name: 'GitHub', icon: <GitBranch size={18} />, color: '#2ea043' },
  { id: 'slack', name: 'Slack', icon: <Hash size={18} />, color: '#e01e5a' },
  { id: 'notion', name: 'Notion', icon: <FileText size={18} />, color: '#ffffff' },
];

const STEPS = [
  { icon: <Sparkles size={20} />, title: 'Connect a service', desc: 'Link your accounts below to get started' },
  { icon: <Zap size={20} />, title: 'Sync your data', desc: 'We\'ll index your content securely' },
  { icon: <Search size={20} />, title: 'Search everything', desc: 'Find anything across all your tools' },
];

export function OnboardingCard() {
  const { user } = useAuth();
  const displayName = user?.name?.split(' ')[0] || 'there';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="glass-card-glow"
      style={{ padding: 'clamp(1.5rem, 4vw, 2.5rem)', position: 'relative', overflow: 'hidden' }}
    >
      <div style={{
        position: 'absolute', top: '-40%', right: '-10%',
        width: '50%', height: '80%',
        background: 'radial-gradient(ellipse, rgba(99,102,241,0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{
          fontSize: 'clamp(1.5rem, 3.5vw, 2rem)',
          marginBottom: '0.5rem',
          background: 'linear-gradient(135deg, #f8fafc 30%, #818cf8 60%, #c084fc 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>
          Welcome, {displayName}
        </h2>
        <p style={{
          color: 'var(--text-secondary)', fontSize: '0.9375rem',
          lineHeight: 1.5, maxWidth: 440, margin: 0,
        }}>
          Get started by connecting your first service. Entropy will index your data so you can search across everything in one place.
        </p>
      </div>

      {/* Steps */}
      <div style={{
        display: 'flex', gap: '1rem', marginBottom: '2rem',
        flexWrap: 'wrap',
      }}>
        {STEPS.map((step, i) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.08 }}
            style={{
              flex: '1 1 180px',
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.05)',
              display: 'flex', flexDirection: 'column', gap: '0.5rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div style={{
                width: 28, height: 28, borderRadius: '7px',
                background: 'rgba(99,102,241,0.12)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--accent-primary)', fontSize: '0.75rem', fontWeight: 700,
              }}>
                {i + 1}
              </div>
              <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{step.title}</span>
            </div>
            <p style={{
              color: 'var(--text-muted)', fontSize: '0.75rem',
              lineHeight: 1.45, margin: 0,
            }}>
              {step.desc}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Connector Buttons */}
      <div>
        <h4 style={{
          fontSize: '0.6875rem', fontWeight: 600,
          color: 'var(--text-muted)', textTransform: 'uppercase',
          letterSpacing: '0.08em', marginBottom: '0.75rem',
        }}>
          Connect a service to begin
        </h4>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
          gap: '0.5rem',
        }}>
          {CONNECTORS.map((connector, i) => (
            <motion.button
              key={connector.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + i * 0.05 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => { window.location.href = getConnectorUrl(connector.id); }}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.6rem',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                background: `${connector.color}10`,
                border: `1px solid ${connector.color}25`,
                color: connector.color,
                cursor: 'pointer',
                fontFamily: 'var(--font-body)',
                fontWeight: 600, fontSize: '0.8125rem',
                transition: 'all 150ms',
              }}
            >
              {connector.icon}
              {connector.name}
              <ArrowRight size={13} style={{ marginLeft: 'auto', opacity: 0.5 }} />
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
