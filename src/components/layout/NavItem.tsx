import type { ReactNode } from 'react';

interface NavItemProps {
  icon: ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

export function NavItem({ icon, label, active = false, onClick }: NavItemProps) {
  return (
    <div 
      onClick={onClick}
      style={{
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      padding: '0.75rem 1rem',
      borderRadius: '8px',
      cursor: 'pointer',
      background: active ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
      color: active ? 'var(--text-primary)' : 'var(--text-muted)',
      fontWeight: active ? 500 : 400,
      transition: 'all 0.2s',
    }}
    onMouseEnter={(e) => {
      if (!active) {
        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
        e.currentTarget.style.color = 'var(--text-primary)';
      }
    }}
    onMouseLeave={(e) => {
      if (!active) {
        e.currentTarget.style.background = 'transparent';
        e.currentTarget.style.color = 'var(--text-muted)';
      }
    }}
    >
      {icon}
      <span>{label}</span>
    </div>
  );
}
