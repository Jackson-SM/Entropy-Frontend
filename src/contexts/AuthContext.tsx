import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';

interface User {
  email: string;
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

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode<{sub: string, exp: number}>(token);
        if (decoded.exp * 1000 < Date.now()) {
          logout();
        } else {
          setUser({ email: decoded.sub });
        }
      } catch {
        logout();
      }
    } else {
      setUser(null);
    }
    setIsLoading(false);
  }, [token]);

  const login = (newToken: string) => {
    localStorage.setItem('entropy_token', newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem('entropy_token');
    setToken(null);
    setUser(null);
    window.location.href = '/login';
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
