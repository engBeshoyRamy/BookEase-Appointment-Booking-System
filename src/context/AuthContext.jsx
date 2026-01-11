import React, { createContext, useContext, useState, useEffect } from 'react';
import { storageService, StorageKeys } from '../utils/storage';

const AuthContext = createContext(undefined);

const ADMIN_PASSWORD = 'admin123';

export const AuthProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const authData = await storageService.get(StorageKeys.ADMIN_AUTH);
      if (authData?.isAuthenticated) {
        setIsAdmin(true);
      }
    };
    checkAuth();
  }, []);

  const login = async (password) => {
    if (password === ADMIN_PASSWORD) {
      setIsAdmin(true);
      await storageService.set(StorageKeys.ADMIN_AUTH, { isAuthenticated: true });
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAdmin(false);
    storageService.delete(StorageKeys.ADMIN_AUTH);
  };

  return (
    <AuthContext.Provider value={{ isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};