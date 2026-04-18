import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Check, Trash2, CheckCircle, XCircle, Info, X } from 'lucide-react';
import { useNotifications, type Notification } from '../../hooks/useNotifications';

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

const ICON_MAP: Record<Notification['type'], React.ReactNode> = {
  sync_complete: <CheckCircle size={14} color="var(--color-success)" />,
  sync_error: <XCircle size={14} color="var(--color-error)" />,
  info: <Info size={14} color="var(--accent-primary)" />,
};

export function NotificationCenter() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { notifications, unreadCount, markAllRead, clearAll, removeNotification } = useNotifications();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    if (open) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => { setOpen(o => !o); if (!open) markAllRead(); }}
        className="btn-icon"
        style={{ position: 'relative' }}
      >
        <Bell size={17} />
        {unreadCount > 0 && (
          <span style={{
            position: 'absolute', top: 0, right: 0,
            width: 16, height: 16, borderRadius: '50%',
            background: 'var(--color-error)', color: '#fff',
            fontSize: '0.5625rem', fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transform: 'translate(4px, -4px)',
          }}>
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            style={{
              position: 'absolute', left: 0, top: '100%',
              marginTop: '0.5rem',
              width: 320, maxHeight: 420,
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: '0 12px 40px rgba(0,0,0,0.3)',
              overflow: 'hidden',
              zIndex: 100,
              display: 'flex', flexDirection: 'column',
            }}
          >
            <div style={{
              padding: '0.875rem 1rem',
              borderBottom: '1px solid var(--border-subtle)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <h4 style={{ margin: 0, fontSize: '0.875rem', fontWeight: 700 }}>Notifications</h4>
              <div style={{ display: 'flex', gap: '0.25rem' }}>
                {notifications.length > 0 && (
                  <>
                    <button onClick={markAllRead} className="btn-icon" title="Mark all read" style={{ padding: '0.25rem' }}>
                      <Check size={13} />
                    </button>
                    <button onClick={clearAll} className="btn-icon" title="Clear all" style={{ padding: '0.25rem' }}>
                      <Trash2 size={13} />
                    </button>
                  </>
                )}
              </div>
            </div>

            <div style={{ flex: 1, overflowY: 'auto' }}>
              {notifications.length === 0 ? (
                <div style={{
                  padding: '3rem 1rem', textAlign: 'center',
                  color: 'var(--text-muted)', fontSize: '0.8125rem',
                }}>
                  No notifications yet
                </div>
              ) : (
                notifications.slice(0, 20).map(n => (
                  <div
                    key={n.id}
                    style={{
                      padding: '0.75rem 1rem',
                      borderBottom: '1px solid var(--border-subtle)',
                      display: 'flex', gap: '0.6rem', alignItems: 'flex-start',
                      background: n.read ? 'transparent' : 'rgba(99,102,241,0.04)',
                    }}
                  >
                    <div style={{ marginTop: '0.15rem', flexShrink: 0 }}>
                      {ICON_MAP[n.type]}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.1rem' }}>
                        {n.title}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                        {n.message}
                      </div>
                      <div style={{ fontSize: '0.625rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                        {timeAgo(n.timestamp)}
                      </div>
                    </div>
                    <button
                      onClick={() => removeNotification(n.id)}
                      className="btn-icon"
                      style={{ padding: '0.15rem', flexShrink: 0 }}
                    >
                      <X size={11} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
