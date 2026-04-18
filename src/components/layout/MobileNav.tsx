import { useNavigate } from 'react-router-dom';
import { Search, Activity, Database, Settings, User } from 'lucide-react';

interface MobileNavProps {
  activeView: string;
}

const items = [
  { id: 'search',     path: '/',            icon: Search,   label: 'Search' },
  { id: 'activity',   path: '/activity',    icon: Activity, label: 'Activity' },
  { id: 'sources',    path: '/data',        icon: Database, label: 'Data' },
  { id: 'connectors', path: '/connectors',  icon: Settings, label: 'Sources' },
  { id: 'settings',   path: '/settings',    icon: User,     label: 'Profile' },
] as const;

export function MobileNav({ activeView }: MobileNavProps) {
  const navigate = useNavigate();

  return (
    <nav className="mobile-nav">
      {items.map(({ id, path, icon: Icon, label }) => (
        <button
          key={id}
          className={`mobile-nav-item${activeView === id ? ' active' : ''}`}
          onClick={() => navigate(path)}
        >
          <Icon size={20} strokeWidth={activeView === id ? 2.2 : 1.8} />
          <span>{label}</span>
        </button>
      ))}
    </nav>
  );
}
