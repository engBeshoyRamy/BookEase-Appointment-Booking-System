import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

const AppContext = createContext(undefined);

export const AppProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const [darkMode, setDarkMode] = useState(() => {
    // تحميل الوضع من localStorage
    const saved = localStorage.getItem('darkMode');
    return saved === 'true';
  });

  // تطبيق Dark Mode على الصفحة
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.body.style.backgroundColor = '#1a1a1a';
    } else {
      document.documentElement.classList.remove('dark');
      document.body.style.backgroundColor = '#ffffff';
    }
  }, [darkMode]);

  const addToast = useCallback((message, type = 'info') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const toast = { id, message, type };
    setToasts(prev => [...prev, toast]);

    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 5000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const toggleDarkMode = useCallback(() => {
    setDarkMode(prev => {
      const newMode = !prev;
      localStorage.setItem('darkMode', newMode.toString());
      return newMode;
    });
  }, []);

  return (
    <AppContext.Provider
      value={{
        toasts,
        addToast,
        removeToast,
        darkMode,
        toggleDarkMode,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};