import React, { createContext, useContext, useState, useCallback } from "react";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [services, setServices] = useState([]); // ✅ مهم
  const [toasts, setToasts] = useState([]);
  const [darkMode, setDarkMode] = useState(false);

  const addToast = useCallback((message, type = "info") => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toggleDarkMode = useCallback(() => {
    setDarkMode((prev) => !prev);
  }, []);

  return (
    <AppContext.Provider
      value={{
        services,
        setServices,
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

export const useApp = () => useContext(AppContext);
