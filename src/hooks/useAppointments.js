import { useCallback } from 'react';
import { useStorage } from './useStorage';
import { StorageKeys } from '../utils/storage';

export function useAppointments() {
  const { data: appointments, setData, loading, error, reload } = useStorage(
    StorageKeys.APPOINTMENTS,
    []
  );

  const addAppointment = useCallback(async (appointment) => {
    const newAppointment = {
      ...appointment,
      id: `apt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
    };

    const updated = [...appointments, newAppointment];
    const success = await setData(updated);
    return success ? newAppointment : null;
  }, [appointments, setData]);

  const updateAppointment = useCallback(async (id, updates) => {
    const updated = appointments.map(apt =>
      apt.id === id ? { ...apt, ...updates } : apt
    );
    return await setData(updated);
  }, [appointments, setData]);

  const deleteAppointment = useCallback(async (id) => {
    const updated = appointments.filter(apt => apt.id !== id);
    return await setData(updated);
  }, [appointments, setData]);

  const getAppointmentsByDate = useCallback((date) => {
    return appointments.filter(apt => apt.date === date);
  }, [appointments]);

  const getAppointmentsByEmail = useCallback((email) => {
    return appointments.filter(apt => apt.customerEmail.toLowerCase() === email.toLowerCase());
  }, [appointments]);

  const updateAppointmentStatus = useCallback(async (id, status) => {
    return await updateAppointment(id, { status });
  }, [updateAppointment]);

  const isTimeSlotAvailable = useCallback((date, timeSlot, serviceId) => {
    return !appointments.some(apt =>
      apt.date === date &&
      apt.timeSlot === timeSlot &&
      apt.status !== 'cancelled' &&
      (!serviceId || apt.serviceId === serviceId)
    );
  }, [appointments]);

  return {
    appointments,
    loading,
    error,
    addAppointment,
    updateAppointment,
    deleteAppointment,
    getAppointmentsByDate,
    getAppointmentsByEmail,
    updateAppointmentStatus,
    isTimeSlotAvailable,
    reload,
  };
}