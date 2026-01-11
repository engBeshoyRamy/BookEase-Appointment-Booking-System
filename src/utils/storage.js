export const StorageKeys = {
  APPOINTMENTS: 'appointments',
  SERVICES: 'services',
  BUSINESS_HOURS: 'business-hours',
  ADMIN_AUTH: 'admin-auth',
};

// Check if window.storage API is available (Claude.ai environment)
const hasWindowStorage = typeof window !== 'undefined' && window.storage;

// Mock storage API that mimics window.storage behavior
const mockStorage = {
  async get(key) {
    try {
      const value = localStorage.getItem(key);
      return value ? { key, value, shared: false } : null;
    } catch (error) {
      console.error(`Error getting ${key}:`, error);
      return null;
    }
  },

  async set(key, value) {
    try {
      localStorage.setItem(key, value);
      return { key, value, shared: false };
    } catch (error) {
      console.error(`Error setting ${key}:`, error);
      return null;
    }
  },

  async delete(key) {
    try {
      localStorage.removeItem(key);
      return { key, deleted: true, shared: false };
    } catch (error) {
      console.error(`Error deleting ${key}:`, error);
      return null;
    }
  },

  async list(prefix) {
    try {
      const keys = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (!prefix || key.startsWith(prefix)) {
          keys.push(key);
        }
      }
      return { keys, prefix, shared: false };
    } catch (error) {
      console.error(`Error listing keys:`, error);
      return { keys: [] };
    }
  },
};

// Use window.storage if available, otherwise use mockStorage
const storage = hasWindowStorage ? window.storage : mockStorage;

export const storageService = {
  async get(key) {
    try {
      const result = await storage.get(key);
      if (result && result.value) {
        return JSON.parse(result.value);
      }
      return null;
    } catch (error) {
      console.error(`Error getting ${key} from storage:`, error);
      return null;
    }
  },

  async set(key, value) {
    try {
      const result = await storage.set(key, JSON.stringify(value));
      return result !== null;
    } catch (error) {
      console.error(`Error setting ${key} in storage:`, error);
      return false;
    }
  },

  async delete(key) {
    try {
      const result = await storage.delete(key);
      return result !== null;
    } catch (error) {
      console.error(`Error deleting ${key} from storage:`, error);
      return false;
    }
  },

  async list(prefix) {
    try {
      const result = await storage.list(prefix);
      return result ? result.keys : [];
    } catch (error) {
      console.error(`Error listing keys with prefix ${prefix}:`, error);
      return [];
    }
  },
};