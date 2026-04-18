import { useNavigate, useLocation } from 'react-router-dom';
import { Search, Sparkles, Settings, Activity, LogOut, User, Database, Clock, Sun, Moon, Maximize2 } from 'lucide-react';
import { NavItem } from './NavItem';
import { NotificationCenter } from '../ui/NotificationCenter';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../hooks/useTheme';

interface SidebarProps {
  activeView: string;
  onToggleFocus?: () => void;
}

export function Sidebar({ activeView, onToggleFocus }: SidebarProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { resolvedTheme, setTheme } = useTheme();

  const displayName = user?.name?.trim() || user?.email?.split('@')[0] || 'User';

  const go = (path: string) => navigate(path);

  return (
    <aside className="sidebar-desktop" style={{
      width: 'var(--sidebar-width)',
      borderRight: '1px solid var(--border-subtle)',
      background: 'var(--bg-panel)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      padding: '1.75rem 1.25rem',
      flexDirection: 'column',
      zIndex: 10,
      position: 'sticky',
      top: 0,
      height: '100vh',
      overflowY: 'auto',
      flexShrink: 0,
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2.5rem', paddingLeft: '0.5rem' }}>
        <div style={{
          background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
          padding: '0.45rem', borderRadius: '10px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 12px var(--accent-glow)',
        }}>
          <Sparkles size={18} color="white" />
        </div>
        <h1 style={{ fontSize: '1.15rem', margin: 0, letterSpacing: '-0.02em', fontWeight: 700 }}>Entropy</h1>
      </div>

      {/* Navigation */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', flex: 1 }}>
        <div style={{
          fontSize: '0.625rem', color: 'var(--text-muted)', textTransform: 'uppercase',
          letterSpacing: '0.1em', fontWeight: 600, paddingLeft: '1rem', marginBottom: '0.5rem',
        }}>
          Menu
        </div>
        <NavItem icon={<Search size={17} />} label="Search" active={activeView === 'search'} onClick={() => go('/')} />
        <NavItem icon={<Activity size={17} />} label="Activity" active={activeView === 'activity'} onClick={() => go('/activity')} />
        <NavItem icon={<Database size={17} />} label="Your Data" active={activeView === 'sources'} onClick={() => go('/data')} />
        <NavItem icon={<Settings size={17} />} label="Connectors" active={activeView === 'connectors'} onClick={() => go('/connectors')} />
        <NavItem icon={<Clock size={17} />} label="History" active={activeView === 'history'} onClick={() => go('/history')} />
        <NavItem icon={<User size={17} />} label="Settings" active={activeView === 'settings'} onClick={() => go('/settings')} />
      </nav>

      {/* Bottom controls */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: 'auto' }}>
        {/* Theme + Notifications row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', paddingLeft: '0.5rem' }}>
          <button
            onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
            className="btn-icon"
            title={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {resolvedTheme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <NotificationCenter />
          {onToggleFocus && (
            <button onClick={onToggleFocus} className="btn-icon" title="Focus mode">
              <Maximize2 size={16} />
            </button>
          )}
        </div>

        {/* User Panel */}
        <div style={{
          padding: '1rem', borderRadius: 'var(--radius-md)',
          background: 'rgba(128, 128, 128, 0.06)',
          border: '1px solid var(--border-subtle)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            {user?.picture ? (
              <img src={user.picture} alt="" style={{
                width: 34, height: 34, borderRadius: '50%', objectFit: 'cover',
                border: '2px solid var(--border-muted)', flexShrink: 0,
              }} />
            ) : (
              <div style={{
                width: 34, height: 34, borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.8rem', fontWeight: 700, color: '#fff', flexShrink: 0,
              }}>
                {displayName.charAt(0).toUpperCase()}
              </div>
            )}
            <div style={{ overflow: 'hidden', flex: 1 }}>
              <div style={{
                fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)',
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}>
                {displayName}
              </div>
              <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>Free Plan</div>
            </div>
            <button onClick={logout} className="btn-icon" title="Sign Out">
              <LogOut size={15} />
            </button>
          </div>

          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            paddingTop: '0.6rem', borderTop: '1px solid var(--border-subtle)',
          }}>
            <span style={{
              fontSize: '0.625rem', color: 'var(--text-muted)',
              textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600,
            }}>
              Status
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <div style={{
                width: 6, height: 6, borderRadius: '50%',
                background: 'var(--color-success)',
                boxShadow: '0 0 8px rgba(16, 185, 129, 0.5)',
              }} />
              <span style={{ fontSize: '0.6875rem', color: 'var(--color-success)', fontWeight: 500 }}>Online</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
