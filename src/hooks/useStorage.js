import { useState, useEffect, useCallback } from 'react';
import { storageService } from '../utils/storage';

export function useStorage(key, initialValue) {
  const [data, setData] = useState(initialValue);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const loadData = useCallback(async () => {
    if (isInitialized) return; // منع التحميل المتكرر
    
    try {
      setLoading(true);
      const storedData = await storageService.get(key);
      if (storedData !== null) {
        setData(storedData);
      } else {
        setData(initialValue);
        // حفظ البيانات الأولية إذا لم تكن موجودة
        await storageService.set(key, initialValue);
      }
      setError(null);
      setIsInitialized(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
      setData(initialValue);
      setIsInitialized(true);
    } finally {
      setLoading(false);
    }
  }, [key]); // أزلنا initialValue من dependencies

  useEffect(() => {
    loadData();
  }, [loadData]);

  const saveData = useCallback(async (newData) => {
    try {
      const success = await storageService.set(key, newData);
      if (success) {
        setData(newData);
        setError(null);
        return true;
      } else {
        setError('Failed to save data');
        return false;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save data');
      return false;
    }
  }, [key]);

  const updateData = useCallback((updater) => {
    setData(current => {
      const newData = updater(current);
      saveData(newData);
      return newData;
    });
  }, [saveData]);

  return {
    data,
    setData: saveData,
    updateData,
    loading,
    error,
    reload: loadData,
  };
}