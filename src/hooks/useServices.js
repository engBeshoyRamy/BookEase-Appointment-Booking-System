import { useCallback, useMemo } from 'react'; // ✅ ضيف useMemo
import { useStorage } from './useStorage';
import { StorageKeys } from '../utils/storage';
import { sampleServices } from '../utils/sampleData';

export function useServices() {
  const { data: services, setData, loading, error, reload } = useStorage(
    StorageKeys.SERVICES,
    sampleServices
  );

  // ✅ استخدم useMemo بدل const عادي
  const safeServices = useMemo(() => services || [], [services]);

  const addService = useCallback(async (service) => {
    const newService = {
      ...service,
      id: `srv-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };

    const updated = [...safeServices, newService];
    const success = await setData(updated);
    return success ? newService : null;
  }, [safeServices, setData]);

  const updateService = useCallback(async (id, updates) => {
    const updated = safeServices.map(srv =>
      srv.id === id ? { ...srv, ...updates } : srv
    );
    return await setData(updated);
  }, [safeServices, setData]);

  const deleteService = useCallback(async (id) => {
    const updated = safeServices.filter(srv => srv.id !== id);
    return await setData(updated);
  }, [safeServices, setData]);

  const getServiceById = useCallback((id) => {
    return safeServices.find(srv => srv.id === id);
  }, [safeServices]);

  const getActiveServices = useCallback(() => {
    return safeServices.filter(srv => srv.isActive);
  }, [safeServices]);

  const getServicesByCategory = useCallback((category) => {
    return safeServices.filter(srv => srv.category === category && srv.isActive);
  }, [safeServices]);

  const toggleServiceActive = useCallback(async (id) => {
    const service = safeServices.find(srv => srv.id === id);
    if (service) {
      return await updateService(id, { isActive: !service.isActive });
    }
    return false;
  }, [safeServices, updateService]);

  return {
    services: safeServices,
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