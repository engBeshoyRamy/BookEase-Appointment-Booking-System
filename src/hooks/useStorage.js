import { useState, useEffect, useRef } from 'react';

export const useStorage = (key, initialValue) => {
  // ✅ استخدم useRef عشان نحفظ initialValue بدون ما يتغير
  const initialValueRef = useRef(initialValue);
  
  const [data, setData] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : initialValueRef.current;
    } catch {
      return initialValueRef.current;
    }
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(key);
      if (stored === null) {
        localStorage.setItem(key, JSON.stringify(initialValueRef.current));
        setData(initialValueRef.current);
      }
    } catch (err) {
      console.error(err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [key]); // ✅ دلوقتي مفيش warning

  const updateData = (newValue) => {
    try {
      const valueToStore = typeof newValue === 'function' ? newValue(data) : newValue;
      setData(valueToStore);
      localStorage.setItem(key, JSON.stringify(valueToStore));
      return true;
    } catch (err) {
      console.error(err);
      setError(err);
      return false;
    }
  };

  const reload = () => {
    try {
      const stored = localStorage.getItem(key);
      setData(stored ? JSON.parse(stored) : initialValueRef.current);
    } catch (err) {
      console.error(err);
      setError(err);
    }
  };

  return {
    data,
    setData: updateData,
    loading,
    error,
    reload,
  };
};

export default useStorage;