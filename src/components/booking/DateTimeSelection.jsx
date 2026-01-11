import React, { useMemo } from 'react';
import { Calendar } from '../shared/Calendar';
import { TimeSlotPicker } from '../shared/TimeSlotPicker';
import { formatDate, formatDisplayDate, getDayOfWeek, generateTimeSlots } from '../../utils/dateUtils';
import { useAppointments } from '../../hooks/useAppointments';
import { useStorage } from '../../hooks/useStorage';
import { StorageKeys } from '../../utils/storage';
import { sampleBusinessHours } from '../../utils/sampleData';

export const DateTimeSelection = ({
  service,
  selectedDate,
  selectedTime,
  onSelectDate,
  onSelectTime,
  onNext,
  onBack,
}) => {
  const { isTimeSlotAvailable } = useAppointments();
  const { data: businessHours } = useStorage(StorageKeys.BUSINESS_HOURS, sampleBusinessHours);

  const availableTimeSlots = useMemo(() => {
    if (!selectedDate) return [];

    const dayOfWeek = getDayOfWeek(selectedDate);
    const dayHours = businessHours.find(h => h.dayOfWeek === dayOfWeek);

    if (!dayHours || !dayHours.isOpen) return [];

    const slots = generateTimeSlots(dayHours.openTime, dayHours.closeTime, service.duration);
    const dateStr = formatDate(selectedDate);

    return slots.map(time => ({
      time,
      available: isTimeSlotAvailable(dateStr, time),
    }));
  }, [selectedDate, businessHours, service.duration, isTimeSlotAvailable]);

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Select Date & Time</h2>
        <p className="text-gray-600">Choose when you'd like your appointment</p>
        <div className="mt-4 inline-block bg-blue-50 px-6 py-3 rounded-lg">
          <p className="text-sm text-gray-700">
            <span className="font-semibold text-blue-600">{service.name}</span> • {service.duration} minutes • ${service.price}
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div>
          <Calendar
            selectedDate={selectedDate}
            onSelectDate={onSelectDate}
            disabledDates={[]}
          />
        </div>

        <div>
          {selectedDate ? (
            <>
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  {formatDisplayDate(selectedDate)}
                </h3>
              </div>
              <TimeSlotPicker
                timeSlots={availableTimeSlots}
                selectedTime={selectedTime}
                onSelectTime={onSelectTime}
              />
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-center p-8">
              <p className="text-gray-500">Please select a date to see available time slots</p>
            </div>
          )}
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
          onClick={onNext}
          disabled={!selectedDate || !selectedTime}
          className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Next: Your Information
        </button>
      </div>
    </div>
  );
};