import { motion } from 'framer-motion';
import { Sparkles, Search, Bot, Plug, ArrowRight } from 'lucide-react';

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000';

const features = [
  { icon: Search, title: 'Universal Search', desc: 'One query across email, files, chat, and code.' },
  { icon: Bot, title: 'AI-Powered Answers', desc: 'Synthesized answers grounded in your own data.' },
  { icon: Plug, title: 'Connected Services', desc: 'Gmail, Drive, Slack, GitHub, Notion and more.' },
] as const;

export function Login() {
  const handleGoogleLogin = () => {
    window.location.href = `${BASE_URL}/api/auth/google/login`;
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'clamp(1rem, 4vw, 2rem)',
    }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: 420,
          padding: 'clamp(2rem, 5vw, 2.5rem)',
          textAlign: 'center',
        }}
      >
        {/* Logo */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', marginBottom: '1.75rem' }}>
          <div style={{
            background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
            padding: '0.6rem',
            borderRadius: '14px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 8px 24px var(--accent-glow)',
          }}>
            <Sparkles size={26} color="white" strokeWidth={2} />
          </div>
          <h1 style={{
            fontSize: 'clamp(2rem, 6vw, 2.75rem)',
            margin: 0,
            letterSpacing: '-0.04em',
            background: 'linear-gradient(135deg, #f8fafc 30%, #a5b4fc 70%, #c4b5fd)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            Entropy
          </h1>
          <p style={{
            color: 'var(--text-secondary)',
            fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
            lineHeight: 1.5,
            maxWidth: 320,
            margin: 0,
          }}>
            Your digital life, unified. Search everything that matters in one place.
          </p>
        </div>

        {/* Features */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.75rem', textAlign: 'left' }}>
          {features.map(({ icon: Icon, title, desc }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.06 }}
              style={{
                padding: '0.875rem 1rem',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.05)',
                display: 'flex', alignItems: 'flex-start', gap: '0.75rem',
              }}
            >
              <div style={{
                flexShrink: 0, width: 36, height: 36,
                borderRadius: '9px',
                background: 'rgba(99, 102, 241, 0.12)',
                border: '1px solid rgba(99, 102, 241, 0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--accent-primary)',
              }}>
                <Icon size={17} strokeWidth={2} />
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.15rem' }}>{title}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', lineHeight: 1.45 }}>{desc}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Login Button */}
        <motion.button
          type="button"
          whileHover={{ scale: 1.015 }}
          whileTap={{ scale: 0.985 }}
          onClick={handleGoogleLogin}
          style={{
            width: '100%',
            padding: '0.85rem 1.25rem',
            background: '#ffffff',
            color: '#1f2937',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.9375rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem',
            boxShadow: '0 2px 12px rgba(0, 0, 0, 0.15)',
            fontFamily: 'var(--font-body)',
            transition: 'box-shadow 200ms',
          }}
        >
          <img src="https://www.google.com/favicon.ico" width={20} height={20} alt="" aria-hidden />
          Continue with Google
          <ArrowRight size={16} style={{ marginLeft: 'auto', opacity: 0.4 }} />
        </motion.button>

        <p style={{
          marginTop: '1.5rem',
          fontSize: '0.75rem',
          color: 'var(--text-muted)',
          letterSpacing: '0.02em',
        }}>
          Your data stays private. Always.
        </p>
      </motion.div>
    </div>
  );
}
