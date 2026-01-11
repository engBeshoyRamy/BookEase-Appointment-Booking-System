import React from 'react';
import { Calendar, Clock, DollarSign, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { formatDisplayDate, formatTime } from '../../utils/dateUtils';

export const AppointmentCard = ({ appointment, service, onCancel, onReschedule }) => {
  const statusConfig = {
    pending: { 
      icon: AlertCircle, 
      color: 'text-yellow-600', 
      bg: 'bg-yellow-50', 
      border: 'border-yellow-200', 
      label: 'Pending' 
    },
    confirmed: { 
      icon: CheckCircle, 
      color: 'text-green-600', 
      bg: 'bg-green-50', 
      border: 'border-green-200', 
      label: 'Confirmed' 
    },
    cancelled: { 
      icon: XCircle, 
      color: 'text-red-600', 
      bg: 'bg-red-50', 
      border: 'border-red-200', 
      label: 'Cancelled' 
    },
  };

  const config = statusConfig[appointment.status];
  const StatusIcon = config.icon;

  if (!service) {
    return null;
  }

  return (
    <div className={`bg-white rounded-xl shadow-md border-2 ${config.border} p-6 hover:shadow-lg transition-shadow`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-1">{service.name}</h3>
          <p className="text-sm text-gray-600">{service.description}</p>
        </div>
        <div className={`${config.bg} ${config.color} px-3 py-1 rounded-full flex items-center gap-2`}>
          <StatusIcon className="w-4 h-4" />
          <span className="text-sm font-medium">{config.label}</span>
        </div>
      </div>

      <div className="space-y-3 mb-6">
        <div className="flex items-center gap-3 text-gray-700">
          <Calendar className="w-5 h-5 text-blue-600" />
          <span>{formatDisplayDate(appointment.date)}</span>
        </div>
        <div className="flex items-center gap-3 text-gray-700">
          <Clock className="w-5 h-5 text-blue-600" />
          <span>{formatTime(appointment.timeSlot)} ({service.duration} minutes)</span>
        </div>
        <div className="flex items-center gap-3 text-gray-700">
          <DollarSign className="w-5 h-5 text-blue-600" />
          <span className="font-semibold">${service.price}</span>
        </div>
      </div>

      {appointment.notes && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            <span className="font-medium">Notes:</span> {appointment.notes}
          </p>
        </div>
      )}

      {appointment.status !== 'cancelled' && (
        <div className="flex gap-3">
          <button
            onClick={() => onReschedule(appointment.id)}
            className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Reschedule
          </button>
          <button
            onClick={() => onCancel(appointment.id)}
            className="flex-1 py-2 px-4 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};