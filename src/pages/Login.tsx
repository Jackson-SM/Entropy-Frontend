import { motion } from 'framer-motion';

export function Login() {
  const handleGoogleLogin = () => {
    // Redirect to FastAPI Google Login endpoint
    window.location.href = 'http://localhost:8000/api/auth/google/login';
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100vw', alignItems: 'center', justifyContent: 'center' }}>
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="glass-card" 
        style={{ width: '400px', textAlign: 'center', padding: '3rem 2rem' }}
      >
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', background: 'linear-gradient(to right, #f8fafc, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.03em' }}>
          Entropy
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '3rem' }}>Your digital life, unified.</p>

        <button 
          onClick={handleGoogleLogin}
          style={{
            width: '100%',
            padding: '1rem',
            background: 'white',
            color: 'black',
            border: 'none',
            borderRadius: '12px',
            fontSize: '1rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            transition: 'transform 0.2s ease',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          <img src="https://www.google.com/favicon.ico" width={20} alt="Google" />
          Continue with Google
        </button>
      </motion.div>
    </div>
  );
}
