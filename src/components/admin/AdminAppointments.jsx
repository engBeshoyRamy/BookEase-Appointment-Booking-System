import React, { useState, useMemo } from 'react';
import { Search, Filter, CheckCircle, XCircle, Calendar as CalendarIcon } from 'lucide-react';
import { Modal } from '../shared/Modal';
import { LoadingSpinner } from '../shared/LoadingSpinner';
import { useAppointments } from '../../hooks/useAppointments';
import { useServices } from '../../hooks/useServices';
import { useApp } from '../../context/AppContext';
import { formatDisplayDate, formatTime } from '../../utils/dateUtils';

export const AdminAppointments = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
  const [showActionModal, setShowActionModal] = useState(false);
  const [modalAction, setModalAction] = useState(null);

  const { appointments, loading, updateAppointmentStatus } = useAppointments();
  const { getServiceById } = useServices();
  const { addToast } = useApp();

  const filteredAppointments = useMemo(() => {
    return appointments.filter(apt => {
      const matchesSearch = 
        apt.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.customerPhone.includes(searchTerm);
      
      const matchesStatus = statusFilter === 'all' || apt.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [appointments, searchTerm, statusFilter]);

  const handleActionClick = (id, action) => {
    setSelectedAppointmentId(id);
    setModalAction(action);
    setShowActionModal(true);
  };

  const handleConfirmAction = async () => {
    if (!selectedAppointmentId || !modalAction) return;

    const status = modalAction === 'confirm' ? 'confirmed' : 'cancelled';
    const success = await updateAppointmentStatus(selectedAppointmentId, status);
    
    if (success) {
      addToast(`Appointment ${modalAction === 'confirm' ? 'confirmed' : 'cancelled'} successfully`, 'success');
    } else {
      addToast('Failed to update appointment', 'error');
    }
    
    setShowActionModal(false);
    setSelectedAppointmentId(null);
    setModalAction(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" text="Loading appointments..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Appointments</h1>
        <p className="text-gray-600">View and manage all bookings</p>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 transition-colors"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 transition-colors appearance-none"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {filteredAppointments.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-md">
          <CalendarIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No appointments found</h3>
          <p className="text-gray-600">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAppointments.map(apt => {
                  const service = getServiceById(apt.serviceId);
                  return (
                    <tr key={apt.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{apt.customerName}</div>
                          <div className="text-sm text-gray-500">{apt.customerEmail}</div>
                          <div className="text-sm text-gray-500">{apt.customerPhone}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{service?.name}</div>
                        <div className="text-sm text-gray-500">${service?.price}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatDisplayDate(apt.date)}</div>
                        <div className="text-sm text-gray-500">{formatTime(apt.timeSlot)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          apt.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                          apt.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {apt.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        {apt.status === 'pending' && (
                          <button
                            onClick={() => handleActionClick(apt.id, 'confirm')}
                            className="text-green-600 hover:text-green-900"
                          >
                            <CheckCircle className="w-5 h-5" />
                          </button>
                        )}
                        {apt.status !== 'cancelled' && (
                          <button
                            onClick={() => handleActionClick(apt.id, 'cancel')}
                            className="text-red-600 hover:text-red-900"
                          >
                            <XCircle className="w-5 h-5" />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal
        isOpen={showActionModal}
        onClose={() => setShowActionModal(false)}
        title={modalAction === 'confirm' ? 'Confirm Appointment' : 'Cancel Appointment'}
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            Are you sure you want to {modalAction === 'confirm' ? 'confirm' : 'cancel'} this appointment?
          </p>
          <div className="flex gap-3 justify-end">
            <button
              onClick={() => setShowActionModal(false)}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
            >
              Close
            </button>
            <button
              onClick={handleConfirmAction}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                modalAction === 'confirm'
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-red-600 text-white hover:bg-red-700'
              }`}
            >
              {modalAction === 'confirm' ? 'Confirm' : 'Cancel Appointment'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};