import React, { useState } from 'react';
import { CheckCircle, Calendar, Clock, User, Mail, Phone, DollarSign } from 'lucide-react';
import { formatDisplayDate, formatTime } from '../../utils/dateUtils';
import { LoadingSpinner } from '../shared/LoadingSpinner';

export const BookingConfirmation = ({
  service,
  date,
  time,
  customerName,
  customerEmail,
  customerPhone,
  notes,
  onConfirm,
  onBack,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      await onConfirm();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Review Your Booking</h2>
        <p className="text-gray-600">Please review your appointment details</p>
      </div>

      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg border-2 border-blue-100 p-8">
        <div className="space-y-6">
          <div className="pb-6 border-b border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Service Details</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-gray-900">{service.name}</span>
              </div>
              <p className="text-sm text-gray-600 ml-8">{service.description}</p>
              <div className="flex items-center gap-6 ml-8 text-sm">
                <div className="flex items-center gap-1 text-gray-700">
                  <Clock className="w-4 h-4" />
                  <span>{service.duration} minutes</span>
                </div>
                <div className="flex items-center gap-1 font-semibold text-blue-600">
                  <DollarSign className="w-4 h-4" />
                  <span>${service.price}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pb-6 border-b border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Appointment Time</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-blue-600" />
                <span className="text-gray-900">{formatDisplayDate(date)}</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-blue-600" />
                <span className="text-gray-900">{formatTime(time)}</span>
              </div>
            </div>
          </div>

          <div className="pb-6 border-b border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Your Information</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-blue-600" />
                <span className="text-gray-900">{customerName}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-blue-600" />
                <span className="text-gray-900">{customerEmail}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-blue-600" />
                <span className="text-gray-900">{customerPhone}</span>
              </div>
            </div>
          </div>

          {notes && (
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Additional Notes</h3>
              <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{notes}</p>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-2xl mx-auto bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-gray-700">
          By confirming this booking, you agree to our terms and conditions. You will receive a confirmation email at {customerEmail}.
        </p>
      </div>

      <div className="flex justify-between">
        <button
          onClick={onBack}
          disabled={isSubmitting}
          className="px-8 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors disabled:opacity-50"
        >
          Back
        </button>
        <button
          onClick={handleConfirm}
          disabled={isSubmitting}
          className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          {isSubmitting ? (
            <>
              <LoadingSpinner size="sm" />
              <span>Confirming...</span>
            </>
          ) : (
            'Confirm Booking'
          )}
        </button>
      </div>
    </div>
  );
};