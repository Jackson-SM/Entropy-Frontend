import { useState, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GitBranch, Mail, Hash, HardDrive, FileText,
  LogOut, History, ChevronDown, AlertTriangle, Shield, Keyboard, Palette, Sun, Moon, Monitor,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useIntegrations } from '../../hooks/useIntegrations';
import { useRecentSearches } from '../../hooks/useRecentSearches';
import { useTheme } from '../../hooks/useTheme';
import { useToast } from '../ui/Toast';
import type { Integration } from '../../types';

const CONNECTOR_ICONS: Record<string, ReactNode> = {
  gmail: <Mail size={18} />,
  gdrive: <HardDrive size={18} />,
  notion: <FileText size={18} />,
  slack: <Hash size={18} />,
  github: <GitBranch size={18} />,
};

function badgeLabel(status: Integration['status']): 'Connected' | 'Not Connected' {
  if (status === 'connected' || status === 'syncing') return 'Connected';
  return 'Not Connected';
}

export function SettingsPage() {
  const { user, logout } = useAuth();
  const { integrations, loading } = useIntegrations();
  const { clearSearches } = useRecentSearches();
  const { theme, setTheme } = useTheme();
  const toast = useToast();
  const [dangerOpen, setDangerOpen] = useState(false);

  const displayName = user?.name?.trim() || user?.email?.split('@')[0] || 'User';
  const initial = displayName.charAt(0).toUpperCase();

  const handleClearHistory = () => {
    clearSearches();
    toast.success('Search history cleared');
  };

  const sectionStyle: React.CSSProperties = {
    padding: 'clamp(1.25rem, 3vw, 1.75rem)',
  };

  return (
    <div style={{ marginTop: '2rem', width: '100%', maxWidth: '680px', marginLeft: 'auto', marginRight: 'auto' }}>
      <motion.h2
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ fontSize: 'clamp(1.75rem, 4vw, 2.25rem)', marginBottom: '1.5rem' }}
      >
        Settings
      </motion.h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {/* Profile */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="glass-panel"
          style={sectionStyle}
        >
          <h3 style={{ fontSize: '0.75rem', marginBottom: '1.25rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Profile
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
            {user?.picture ? (
              <img src={user.picture} alt="" style={{
                width: 64, height: 64, borderRadius: '50%', objectFit: 'cover',
                border: '2px solid rgba(255,255,255,0.08)',
                boxShadow: 'var(--shadow-md)',
              }} />
            ) : (
              <div style={{
                width: 64, height: 64, borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.5rem', fontWeight: 700, color: '#fff',
                boxShadow: '0 6px 20px var(--accent-glow)',
              }}>
                {initial}
              </div>
            )}
            <div style={{ flex: 1, minWidth: 180 }}>
              <div style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.25rem' }}>{displayName}</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                {user?.email ?? '—'}
              </div>
            </div>
          </div>
        </motion.section>

        {/* Connected Services */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          className="glass-panel"
          style={sectionStyle}
        >
          <h3 style={{ fontSize: '0.75rem', marginBottom: '1rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Connected Services
          </h3>
          {loading ? (
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{ width: 80, height: 32, borderRadius: 'var(--radius-full)', background: 'rgba(255,255,255,0.04)', animation: 'pulse 1.5s infinite' }} />
              ))}
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {integrations.map((integration) => {
                const connected = badgeLabel(integration.status) === 'Connected';
                return (
                  <div
                    key={integration.id}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                      padding: '0.4rem 0.75rem',
                      borderRadius: 'var(--radius-full)',
                      background: connected ? `${integration.color}12` : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${connected ? `${integration.color}30` : 'rgba(255,255,255,0.06)'}`,
                      color: connected ? integration.color : 'var(--text-muted)',
                      fontSize: '0.8125rem', fontWeight: 500,
                    }}
                  >
                    {CONNECTOR_ICONS[integration.id]}
                    {integration.name}
                    <div style={{
                      width: 6, height: 6, borderRadius: '50%',
                      background: connected ? 'var(--color-success)' : 'var(--text-muted)',
                      marginLeft: '0.25rem',
                    }} />
                  </div>
                );
              })}
            </div>
          )}
        </motion.section>

        {/* Theme */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.08 }}
          className="glass-panel"
          style={sectionStyle}
        >
          <h3 style={{ fontSize: '0.75rem', marginBottom: '1rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Palette size={13} /> Appearance
          </h3>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {([
              { value: 'light' as const, icon: <Sun size={14} />, label: 'Light' },
              { value: 'dark' as const, icon: <Moon size={14} />, label: 'Dark' },
              { value: 'system' as const, icon: <Monitor size={14} />, label: 'System' },
            ]).map(opt => (
              <button
                key={opt.value}
                onClick={() => setTheme(opt.value)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.4rem',
                  padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)',
                  fontSize: '0.8125rem', fontWeight: 500, fontFamily: 'var(--font-body)',
                  cursor: 'pointer',
                  border: `1.5px solid ${theme === opt.value ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
                  background: theme === opt.value ? 'rgba(99,102,241,0.1)' : 'transparent',
                  color: theme === opt.value ? 'var(--accent-primary)' : 'var(--text-secondary)',
                  transition: 'all 150ms',
                }}
              >
                {opt.icon} {opt.label}
              </button>
            ))}
          </div>
        </motion.section>

        {/* Shortcuts */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="glass-panel"
          style={sectionStyle}
        >
          <h3 style={{ fontSize: '0.75rem', marginBottom: '1rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Keyboard size={13} /> Keyboard Shortcuts
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {[
              { keys: ['Ctrl', 'K'], action: 'Focus search bar' },
              { keys: ['Enter'], action: 'Execute search' },
              { keys: ['Esc'], action: 'Clear focus' },
            ].map(({ keys, action }) => (
              <div key={action} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem' }}>{action}</span>
                <div style={{ display: 'flex', gap: '0.25rem' }}>
                  {keys.map(k => (
                    <kbd key={k} style={{
                      padding: '0.2rem 0.5rem',
                      borderRadius: '5px',
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      fontSize: '0.6875rem',
                      color: 'var(--text-secondary)',
                      fontFamily: 'var(--font-body)',
                      fontWeight: 500,
                    }}>
                      {k}
                    </kbd>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Account */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
          className="glass-panel"
          style={sectionStyle}
        >
          <h3 style={{ fontSize: '0.75rem', marginBottom: '1rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Shield size={13} /> Account & Privacy
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxWidth: 320 }}>
            <button
              type="button"
              onClick={() => logout()}
              className="btn-ghost"
              style={{ justifyContent: 'center', padding: '0.65rem 1rem', width: '100%' }}
            >
              <LogOut size={15} />
              Sign Out
            </button>
            <button
              type="button"
              onClick={handleClearHistory}
              className="btn-ghost"
              style={{ justifyContent: 'center', padding: '0.65rem 1rem', width: '100%' }}
            >
              <History size={15} />
              Clear Search History
            </button>
          </div>

          {/* Danger Zone */}
          <div style={{ marginTop: '1.25rem', borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '1rem' }}>
            <button
              type="button"
              onClick={() => setDangerOpen(o => !o)}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                width: '100%', background: 'transparent', border: 'none',
                color: 'var(--text-secondary)', cursor: 'pointer',
                fontSize: '0.8125rem', fontWeight: 600, padding: '0.25rem 0',
                fontFamily: 'var(--font-body)',
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <AlertTriangle size={15} color="#f87171" />
                Danger Zone
              </span>
              <motion.span animate={{ rotate: dangerOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                <ChevronDown size={16} />
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {dangerOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  style={{ overflow: 'hidden' }}
                >
                  <div style={{
                    marginTop: '0.75rem',
                    padding: '1rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid rgba(248, 113, 113, 0.2)',
                    background: 'rgba(127, 29, 29, 0.08)',
                  }}>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem', lineHeight: 1.55, margin: 0 }}>
                      Permanently deleting your account and all indexed data cannot be undone. This action is not
                      available in the app yet — contact support if you need a full data purge.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
