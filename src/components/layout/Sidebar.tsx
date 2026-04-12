import { Search, Sparkles, Settings, Activity, LogOut, User } from 'lucide-react';
import { NavItem } from './NavItem';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

export function Sidebar({ activeView, onViewChange }: SidebarProps) {
  const { user, logout } = useAuth();

  const displayName = user?.name?.trim() || user?.email?.split('@')[0] || 'User';

  return (
    <aside className="sidebar-desktop" style={{
      width: 'var(--sidebar-width)',
      borderRight: '1px solid rgba(255, 255, 255, 0.04)',
      background: 'rgba(12, 13, 18, 0.85)',
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
          padding: '0.45rem',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px var(--accent-glow)',
        }}>
          <Sparkles size={18} color="white" />
        </div>
        <h1 style={{ fontSize: '1.15rem', margin: 0, letterSpacing: '-0.02em', fontWeight: 700 }}>Entropy</h1>
      </div>

      {/* Navigation */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', flex: 1 }}>
        <div style={{
          fontSize: '0.625rem',
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          fontWeight: 600,
          paddingLeft: '1rem',
          marginBottom: '0.5rem',
        }}>
          Menu
        </div>
        <NavItem icon={<Search size={17} />} label="Search" active={activeView === 'search'} onClick={() => onViewChange('search')} />
        <NavItem icon={<Activity size={17} />} label="Activity" active={activeView === 'activity'} onClick={() => onViewChange('activity')} />
        <NavItem icon={<Settings size={17} />} label="Data Sources" active={activeView === 'connectors'} onClick={() => onViewChange('connectors')} />
        <NavItem icon={<User size={17} />} label="Settings" active={activeView === 'settings'} onClick={() => onViewChange('settings')} />
      </nav>

      {/* User Panel */}
      <div style={{
        padding: '1rem',
        marginTop: 'auto',
        borderRadius: 'var(--radius-md)',
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(255, 255, 255, 0.04)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
          {user?.picture ? (
            <img
              src={user.picture}
              alt=""
              style={{
                width: 34, height: 34,
                borderRadius: '50%',
                objectFit: 'cover',
                border: '2px solid rgba(255,255,255,0.08)',
                flexShrink: 0,
              }}
            />
          ) : (
            <div style={{
              width: 34, height: 34,
              borderRadius: '50%',
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
          <button
            onClick={logout}
            style={{
              background: 'transparent', border: 'none',
              color: 'var(--text-muted)', cursor: 'pointer',
              padding: '0.35rem', borderRadius: '6px',
              display: 'flex', alignItems: 'center',
              transition: 'all 150ms',
            }}
            title="Sign Out"
          >
            <LogOut size={15} />
          </button>
        </div>

        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          paddingTop: '0.6rem',
          borderTop: '1px solid rgba(255,255,255,0.05)',
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
    </aside>
  );
}
