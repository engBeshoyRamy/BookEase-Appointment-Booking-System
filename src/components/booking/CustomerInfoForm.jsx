import React, { useState } from 'react';
import { User, Mail, Phone, MessageSquare } from 'lucide-react';
import { validateBookingForm } from '../../utils/validators';

export const CustomerInfoForm = ({
  customerName,
  customerEmail,
  customerPhone,
  notes,
  onUpdateField,
  onNext,
  onBack,
}) => {
  const [errors, setErrors] = useState({});

  const handleSubmit = () => {
    const validationErrors = validateBookingForm({
      customerName,
      customerEmail,
      customerPhone,
      serviceId: 'temp',
      date: 'temp',
      timeSlot: 'temp',
    });

    if (validationErrors.length > 0) {
      const errorMap = {};
      validationErrors.forEach(err => {
        errorMap[err.field] = err.message;
      });
      setErrors(errorMap);
    } else {
      setErrors({});
      onNext();
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Your Information</h2>
        <p className="text-gray-600">Please provide your contact details</p>
      </div>

      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name *
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={customerName}
              onChange={e => onUpdateField('customerName', e.target.value)}
              className={`w-full pl-12 pr-4 py-3 border-2 rounded-lg focus:outline-none focus:border-blue-600 transition-colors ${
                errors.customerName ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="John Doe"
            />
          </div>
          {errors.customerName && (
            <p className="mt-1 text-sm text-red-600">{errors.customerName}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address *
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="email"
              value={customerEmail}
              onChange={e => onUpdateField('customerEmail', e.target.value)}
              className={`w-full pl-12 pr-4 py-3 border-2 rounded-lg focus:outline-none focus:border-blue-600 transition-colors ${
                errors.customerEmail ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="john@example.com"
            />
          </div>
          {errors.customerEmail && (
            <p className="mt-1 text-sm text-red-600">{errors.customerEmail}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number *
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="tel"
              value={customerPhone}
              onChange={e => onUpdateField('customerPhone', e.target.value)}
              className={`w-full pl-12 pr-4 py-3 border-2 rounded-lg focus:outline-none focus:border-blue-600 transition-colors ${
                errors.customerPhone ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="(555) 123-4567"
            />
          </div>
          {errors.customerPhone && (
            <p className="mt-1 text-sm text-red-600">{errors.customerPhone}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Additional Notes (Optional)
          </label>
          <div className="relative">
            <MessageSquare className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <textarea
              value={notes}
              onChange={e => onUpdateField('notes', e.target.value)}
              rows={4}
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 transition-colors resize-none"
              placeholder="Any special requests or information we should know..."
            />
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <button
          onClick={onBack}
          className="px-8 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
        >
          Back
        </button>
        <button
          onClick={handleSubmit}
          className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Review Booking
        </button>
      </div>
    </div>
  );
};