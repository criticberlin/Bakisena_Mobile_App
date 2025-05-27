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
    console.log('AuthContext: Setting up auth state listener');
    const unsubscribe = onAuthStateChange(async (user) => {
      console.log('AuthContext: Auth state changed:', user?.uid || 'No user');
      setUser(user);
      if (user) {
        console.log('AuthContext: Fetching current user data for UID:', user.uid);
        const currentUser = await getCurrentUser();
        console.log('AuthContext: Fetched user data:', currentUser);
        setIsAdmin(currentUser?.isAdmin || false);
        console.log('AuthContext: isAdmin set to:', currentUser?.isAdmin || false);
      } else {
        setIsAdmin(false);
        console.log('AuthContext: isAdmin set to false (no user)');
      }
      setLoading(false);
      console.log('AuthContext: Loading set to false');
    });

    return () => {
      console.log('AuthContext: Cleaning up auth state listener');
      unsubscribe();
    };
  }, []);

  const handleLogin = async (email: string, password: string) => {
    console.log('AuthContext: Handling login for email:', email);
    setLoading(true); // Indicate loading during login
    const result = await login(email, password);
    console.log('AuthContext: Login result:', result);
    // The onAuthStateChange listener will update the state after successful login
    // setIsAdmin(result.isAdmin); // Removing direct state update here, let listener handle it for consistency
    setLoading(false); // Set loading to false after login attempt
    return { error: result.error };
  };

  const handleRegister = async (email: string, password: string) => {
    console.log('AuthContext: Handling registration for email:', email);
    setLoading(true); // Indicate loading during registration
    const result = await register(email, password);
    console.log('AuthContext: Registration result:', result);
    setLoading(false); // Set loading to false after registration attempt
    return { error: result.error };
  };

  const handleLogout = async () => {
    console.log('AuthContext: Handling logout');
    setLoading(true); // Indicate loading during logout
    const result = await logout();
    console.log('AuthContext: Logout result:', result);
    // The onAuthStateChange listener will set user to null and isAdmin to false
    setLoading(false); // Set loading to false after logout attempt
    return { error: result.error };
  };

  console.log('AuthContext: Rendering, isAdmin is:', isAdmin, 'loading is:', loading);

  if (loading) {
    console.log('AuthContext: Showing LoadingScreen');
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