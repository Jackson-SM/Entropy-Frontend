import { motion, AnimatePresence } from 'framer-motion';
import { X, Command } from 'lucide-react';

interface Props {
  open: boolean;
  onClose: () => void;
}

const SHORTCUT_GROUPS = [
  {
    title: 'General',
    shortcuts: [
      { keys: ['Ctrl', 'K'], desc: 'Open command palette' },
      { keys: ['?'], desc: 'Show keyboard shortcuts' },
      { keys: ['Esc'], desc: 'Close panel / Clear results' },
    ],
  },
  {
    title: 'Search',
    shortcuts: [
      { keys: ['Enter'], desc: 'Execute search' },
      { keys: ['↑', '↓'], desc: 'Navigate results' },
      { keys: ['Enter'], desc: 'Open result detail' },
      { keys: ['Ctrl', 'Click'], desc: 'Open result in new tab' },
    ],
  },
  {
    title: 'Navigation',
    shortcuts: [
      { keys: ['G', 'then', 'H'], desc: 'Go to Search home' },
      { keys: ['G', 'then', 'A'], desc: 'Go to Activity' },
      { keys: ['G', 'then', 'D'], desc: 'Go to Your Data' },
      { keys: ['G', 'then', 'C'], desc: 'Go to Connectors' },
      { keys: ['G', 'then', 'S'], desc: 'Go to Settings' },
    ],
  },
];

export function KeyboardShortcuts({ open, onClose }: Props) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onClick={onClose}
          style={{
            position: 'fixed', inset: 0, zIndex: 250,
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(4px)',
            WebkitBackdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '2rem',
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2 }}
            onClick={e => e.stopPropagation()}
            style={{
              width: '100%', maxWidth: 580,
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-xl)',
              boxShadow: '0 24px 80px rgba(0,0,0,0.4)',
              overflow: 'hidden',
            }}
          >
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '1.25rem 1.5rem',
              borderBottom: '1px solid var(--border-subtle)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Command size={18} color="var(--accent-primary)" />
                <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>Keyboard Shortcuts</h2>
              </div>
              <button onClick={onClose} className="btn-icon">
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: '1.25rem 1.5rem', maxHeight: '60vh', overflowY: 'auto' }}>
              {SHORTCUT_GROUPS.map((group, gi) => (
                <div key={group.title} style={{ marginBottom: gi < SHORTCUT_GROUPS.length - 1 ? '1.5rem' : 0 }}>
                  <h4 style={{
                    fontSize: '0.6875rem', fontWeight: 600, color: 'var(--text-muted)',
                    textTransform: 'uppercase', letterSpacing: '0.08em',
                    marginBottom: '0.6rem',
                  }}>
                    {group.title}
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    {group.shortcuts.map((s, si) => (
                      <div key={si} style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '0.5rem 0.75rem',
                        borderRadius: 'var(--radius-sm)',
                        background: si % 2 === 0 ? 'transparent' : 'var(--bg-panel)',
                      }}>
                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem' }}>
                          {s.desc}
                        </span>
                        <div style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
                          {s.keys.map((k, ki) => (
                            k === 'then' ? (
                              <span key={ki} style={{ color: 'var(--text-muted)', fontSize: '0.625rem', margin: '0 0.15rem' }}>then</span>
                            ) : (
                              <kbd key={ki} style={{
                                padding: '0.2rem 0.5rem',
                                borderRadius: '5px',
                                background: 'var(--bg-panel-solid)',
                                border: '1px solid var(--border-subtle)',
                                fontSize: '0.6875rem',
                                color: 'var(--text-secondary)',
                                fontFamily: 'var(--font-body)',
                                fontWeight: 500,
                                minWidth: 24, textAlign: 'center',
                                boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                              }}>
                                {k}
                              </kbd>
                            )
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div style={{
              padding: '0.75rem 1.5rem',
              borderTop: '1px solid var(--border-subtle)',
              display: 'flex', justifyContent: 'center',
            }}>
              <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                Press <kbd style={{
                  padding: '0.1rem 0.35rem', borderRadius: 3,
                  background: 'var(--bg-panel-solid)', border: '1px solid var(--border-subtle)',
                  fontSize: '0.625rem', fontFamily: 'var(--font-body)',
                }}>?</kbd> or <kbd style={{
                  padding: '0.1rem 0.35rem', borderRadius: 3,
                  background: 'var(--bg-panel-solid)', border: '1px solid var(--border-subtle)',
                  fontSize: '0.625rem', fontFamily: 'var(--font-body)',
                }}>Esc</kbd> to close
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
