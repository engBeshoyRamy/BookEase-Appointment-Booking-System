import React, { useState } from 'react';
import { Calendar, Search } from 'lucide-react';
import { AppointmentCard } from './AppointmentCard';
import { Modal } from '../shared/Modal';
import { LoadingSpinner } from '../shared/LoadingSpinner';
import { useAppointments } from '../../hooks/useAppointments';
import { useServices } from '../../hooks/useServices';
import { useApp } from '../../context/AppContext';

export const MyAppointments = () => {
  const [email, setEmail] = useState('');
  const [searchEmail, setSearchEmail] = useState('');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);

  const { appointments, loading, updateAppointmentStatus } = useAppointments();
  const { getServiceById } = useServices();
  const { addToast } = useApp();

  const handleSearch = () => {
    if (email.trim()) {
      setSearchEmail(email.trim().toLowerCase());
    }
  };

  const userAppointments = searchEmail
    ? appointments.filter(apt => apt.customerEmail.toLowerCase() === searchEmail)
    : [];

  const handleCancelClick = (id) => {
    setSelectedAppointmentId(id);
    setShowCancelModal(true);
  };

  const handleConfirmCancel = async () => {
    if (selectedAppointmentId) {
      const success = await updateAppointmentStatus(selectedAppointmentId, 'cancelled');
      if (success) {
        addToast('Appointment cancelled successfully', 'success');
      } else {
        addToast('Failed to cancel appointment', 'error');
      }
      setShowCancelModal(false);
      setSelectedAppointmentId(null);
    }
  };

  const handleReschedule = (id) => {
    addToast('Rescheduling feature coming soon!', 'info');
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" text="Loading appointments..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">My Appointments</h1>
          <p className="text-lg text-gray-600">View and manage your bookings</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="max-w-2xl mx-auto">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter your email to view your appointments
            </label>
            <div className="flex gap-3">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && handleSearch()}
                placeholder="your-email@example.com"
                className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 transition-colors"
              />
              <button
                onClick={handleSearch}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Search className="w-5 h-5" />
                Search
              </button>
            </div>
          </div>
        </div>

        {searchEmail && (
          <>
            {userAppointments.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No appointments found</h3>
                <p className="text-gray-600">
                  We couldn't find any appointments for {searchEmail}
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Appointments for {searchEmail} ({userAppointments.length})
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {userAppointments
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .map(appointment => (
                      <AppointmentCard
                        key={appointment.id}
                        appointment={appointment}
                        service={getServiceById(appointment.serviceId)}
                        onCancel={handleCancelClick}
                        onReschedule={handleReschedule}
                      />
                    ))}
                </div>
              </div>
            )}
          </>
        )}

        <Modal
          isOpen={showCancelModal}
          onClose={() => setShowCancelModal(false)}
          title="Cancel Appointment"
          size="sm"
        >
          <div className="space-y-4">
            <p className="text-gray-700">
              Are you sure you want to cancel this appointment? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowCancelModal(false)}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                Keep Appointment
              </button>
              <button
                onClick={handleConfirmCancel}
                className="px-6 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
              >
                Cancel Appointment
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};