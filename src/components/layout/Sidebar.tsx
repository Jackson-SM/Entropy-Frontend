import { Search, Sparkles, Settings, Activity } from 'lucide-react';
import { NavItem } from './NavItem';

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

export function Sidebar({ activeView, onViewChange }: SidebarProps) {
  return (
    <aside style={{
      width: 'var(--sidebar-width)',
      borderRight: '1px solid rgba(255, 255, 255, 0.05)',
      background: 'rgba(15, 17, 21, 0.8)',
      backdropFilter: 'blur(20px)',
      padding: '2rem 1.5rem',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 10
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '3rem' }}>
        <div style={{
          background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
          padding: '0.5rem',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 15px var(--accent-glow)'
        }}>
          <Sparkles size={20} color="white" />
        </div>
        <h1 style={{ fontSize: '1.25rem', margin: 0, letterSpacing: '-0.02em' }}>Entropy</h1>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
        <NavItem icon={<Search size={18} />} label="Universal Search" active={activeView === 'search'} onClick={() => onViewChange('search')} />
        <NavItem icon={<Activity size={18} />} label="Activity Graph" active={activeView === 'activity'} onClick={() => onViewChange('activity')} />
        <NavItem icon={<Settings size={18} />} label="Connectors" active={activeView === 'connectors'} onClick={() => onViewChange('connectors')} />
      </nav>

      <div className="glass-card" style={{ padding: '1rem', marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(to right, #4f46e5, #9333ea)', flexShrink: 0 }} />
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-primary)', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>Jackson</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Pro Member</div>
          </div>
        </div>
        
        <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)' }} />
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Indexing</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 10px rgba(16, 185, 129, 0.5)' }}></div>
            <span style={{ fontSize: '0.75rem', color: '#10b981' }}>Live</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
