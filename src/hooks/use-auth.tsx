'use client';

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

type User = {
  name: string;
  email: string;
};

interface AuthContextType {
  user: User | null;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to load user from localStorage", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, pass: string) => {
    // This is a mock login. In a real app, you'd call an API.
    return new Promise<void>((resolve, reject) => {
        setTimeout(() => {
            if (email === 'user@email.com' && pass === 'password') {
                const loggedInUser: User = { name: 'Demo User', email: 'user@email.com' };
                setUser(loggedInUser);
                localStorage.setItem('user', JSON.stringify(loggedInUser));
                resolve();
            } else {
                reject(new Error('Invalid credentials'));
            }
        }, 1000);
    });
  };

  const logout = async () => {
    setUser(null);
    localStorage.removeItem('user');
  };
  
  const value = {
    user,
    login,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
