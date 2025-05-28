import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from 'firebase/auth';
import { login, register, logout, onAuthStateChange, getCurrentUser } from '../services/auth';
import LoadingScreen from './LoadingScreen';

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ error: string | null }>;
  register: (email: string, password: string) => Promise<{ error: string | null }>;
  logout: () => Promise<{ error: string | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (user) => {
      setUser(user);
      if (user) {
        const currentUser = await getCurrentUser();
        setIsAdmin(currentUser?.isAdmin || false);
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleLogin = async (email: string, password: string) => {
    setLoading(true); // Indicate loading during login
    const result = await login(email, password);
    // The onAuthStateChange listener will update the state after successful login
    setLoading(false); // Set loading to false after login attempt
    return { error: result.error };
  };

  const handleRegister = async (email: string, password: string) => {
    setLoading(true); // Indicate loading during registration
    const result = await register(email, password);
    setLoading(false); // Set loading to false after registration attempt
    return { error: result.error };
  };

  const handleLogout = async () => {
    setLoading(true); // Indicate loading during logout
    const result = await logout();
    // The onAuthStateChange listener will set user to null and isAdmin to false
    setLoading(false); // Set loading to false after logout attempt
    return { error: result.error };
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin,
        loading,
        login: handleLogin,
        register: handleRegister,
        logout: handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 