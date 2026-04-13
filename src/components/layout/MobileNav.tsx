import { Search, Activity, Database, Settings, User } from 'lucide-react';

interface MobileNavProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

const items = [
  { id: 'search',     icon: Search,   label: 'Search' },
  { id: 'activity',   icon: Activity, label: 'Activity' },
  { id: 'sources',    icon: Database, label: 'Data' },
  { id: 'connectors', icon: Settings, label: 'Sources' },
  { id: 'settings',   icon: User,     label: 'Profile' },
] as const;

export function MobileNav({ activeView, onViewChange }: MobileNavProps) {
  return (
    <nav className="mobile-nav">
      {items.map(({ id, icon: Icon, label }) => (
        <button
          key={id}
          className={`mobile-nav-item${activeView === id ? ' active' : ''}`}
          onClick={() => onViewChange(id)}
        >
          <Icon size={20} strokeWidth={activeView === id ? 2.2 : 1.8} />
          <span>{label}</span>
        </button>
      ))}
    </nav>
  );
}
