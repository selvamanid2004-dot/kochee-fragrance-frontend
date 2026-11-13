import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(authService.getCurrentUser());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function verify() {
      if (authService.isAuthenticated()) {
        try {
          const profile = await authService.getProfile();
          setCurrentUser(profile);
        } catch {
          authService.logout();
          setCurrentUser(null);
        }
      }
      setLoading(false);
    }
    verify();
  }, []);

  const login = async (email, password) => {
    const data = await authService.login(email, password);
    setCurrentUser(data.user);
    return data;
  };

  const register = async (name, email, password) => {
    const data = await authService.register(name, email, password);
    setCurrentUser(data.user);
    return data;
  };

  const logout = () => {
    authService.logout();
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        adminUser: currentUser?.role === 'admin' ? currentUser : null,
        isAuthenticated: !!currentUser,
        isAdmin: currentUser?.role === 'admin',
        login,
        register,
        logout,
        loading
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
