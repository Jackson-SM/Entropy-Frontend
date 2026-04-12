import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';
import { apiFetch } from '../api/client';

interface User {
  id?: string;
  email: string;
  name?: string | null;
  picture?: string | null;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('entropy_token'));
  const [isLoading, setIsLoading] = useState(true);

  const logout = useCallback(() => {
    localStorage.removeItem('entropy_token');
    setToken(null);
    setUser(null);
    window.location.href = '/login';
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      if (!token) {
        setUser(null);
        setIsLoading(false);
        return;
      }
      try {
        const decoded = jwtDecode<{ sub: string; exp: number }>(token);
        if (decoded.exp * 1000 < Date.now()) {
          logout();
          return;
        }
        setUser({ email: decoded.sub });
        setIsLoading(false);
        try {
          const me = await apiFetch<{ id: string; email: string; name: string | null; picture: string | null }>(
            '/api/auth/me'
          );
          if (!cancelled) {
            setUser({
              id: me.id,
              email: me.email,
              name: me.name,
              picture: me.picture,
            });
          }
        } catch {
          /* keep JWT-derived user */
        }
      } catch {
        logout();
        setIsLoading(false);
      }
    }

    init();
    return () => {
      cancelled = true;
    };
  }, [token, logout]);

  const login = (newToken: string) => {
    localStorage.setItem('entropy_token', newToken);
    setToken(newToken);
  };

  if (isLoading) return null;

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
