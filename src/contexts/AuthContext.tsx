import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getToken, clearToken, setToken } from '@/lib/api';

interface User {
  email: string;
}

interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  login: (email: string, token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check for existing token on mount
    const token = getToken();
    const savedEmail = localStorage.getItem('dot_user_email');
    if (token && savedEmail) {
      setUser({ email: savedEmail });
      setIsLoggedIn(true);
    }
  }, []);

  const login = (email: string, token: string) => {
    setToken(token);
    localStorage.setItem('dot_user_email', email);
    setUser({ email });
    setIsLoggedIn(true);
  };

  const logout = () => {
    clearToken();
    localStorage.removeItem('dot_user_email');
    setUser(null);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
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
