import { useState, useEffect } from 'react';

/**
 * Custom hook for persistent storage using window.storage API
 * @param {string} key - Storage key
 * @param {*} initialValue - Initial value if no stored value exists
 * @returns {Array} [value, setValue, loading]
 */
export const useStorage = (key, initialValue) => {
  const [value, setValue] = useState(initialValue);
  const [loading, setLoading] = useState(true);

  // Load data from storage on mount
  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      try {
        const result = await window.storage.get(key);
        
        if (mounted) {
          if (result?.value) {
            setValue(JSON.parse(result.value));
          } else if (initialValue !== null && initialValue !== undefined) {
            // Initialize storage with initial value
            await window.storage.set(key, JSON.stringify(initialValue));
          }
          setLoading(false);
        }
      } catch (error) {
        console.error(`Error loading storage key "${key}":`, error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      mounted = false;
    };
  }, [key, initialValue]);

  // Function to update both state and storage
  const updateValue = async (newValue) => {
    try {
      // Support functional updates like setState
      const valueToStore = typeof newValue === 'function' 
        ? newValue(value) 
        : newValue;

      setValue(valueToStore);
      await window.storage.set(key, JSON.stringify(valueToStore));
      return true;
    } catch (error) {
      console.error(`Error saving storage key "${key}":`, error);
      return false;
    }
  };

  return [value, updateValue, loading];
};

export default useStorage;