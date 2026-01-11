import { useCallback } from 'react';
import { useStorage } from './useStorage';
import { StorageKeys } from '../utils/storage';
import { sampleServices } from '../utils/sampleData';

export function useServices() {
  const { data: services, setData, loading, error, reload } = useStorage(
    StorageKeys.SERVICES,
    sampleServices
  );

  const addService = useCallback(async (service) => {
    const newService = {
      ...service,
      id: `srv-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };

    const updated = [...services, newService];
    const success = await setData(updated);
    return success ? newService : null;
  }, [services, setData]);

  const updateService = useCallback(async (id, updates) => {
    const updated = services.map(srv =>
      srv.id === id ? { ...srv, ...updates } : srv
    );
    return await setData(updated);
  }, [services, setData]);

  const deleteService = useCallback(async (id) => {
    const updated = services.filter(srv => srv.id !== id);
    return await setData(updated);
  }, [services, setData]);

  const getServiceById = useCallback((id) => {
    return services.find(srv => srv.id === id);
  }, [services]);

  const getActiveServices = useCallback(() => {
    return services.filter(srv => srv.isActive);
  }, [services]);

  const getServicesByCategory = useCallback((category) => {
    return services.filter(srv => srv.category === category && srv.isActive);
  }, [services]);

  const toggleServiceActive = useCallback(async (id) => {
    const service = services.find(srv => srv.id === id);
    if (service) {
      return await updateService(id, { isActive: !service.isActive });
    }
    return false;
  }, [services, updateService]);

  return {
    services,
    loading,
    error,
    addService,
    updateService,
    deleteService,
    getServiceById,
    getActiveServices,
    getServicesByCategory,
    toggleServiceActive,
    reload,
  };
}