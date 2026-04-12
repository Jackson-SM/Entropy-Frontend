import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function Callback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      login(token);
      navigate('/');
    } else {
      navigate('/login');
    }
  }, [searchParams, navigate, login]);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100vw', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ color: 'var(--text-muted)', fontSize: '1.25rem', letterSpacing: '0.05em' }}>Authenticating...</div>
    </div>
  );
}
