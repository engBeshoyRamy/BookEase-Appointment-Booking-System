import React from 'react';
import { Clock } from 'lucide-react';
import { formatTime } from '../../utils/dateUtils';

export const TimeSlotPicker = ({ timeSlots, selectedTime, onSelectTime }) => {
  if (timeSlots.length === 0) {
    return (
      <div className="text-center py-12">
        <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">No available time slots for this date</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
        <Clock className="w-5 h-5" />
        Select a Time
      </h3>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
        {timeSlots.map(slot => (
          <button
            key={slot.time}
            onClick={() => slot.available && onSelectTime(slot.time)}
            disabled={!slot.available}
            className={`
              py-3 px-4 rounded-lg text-sm font-medium transition-all
              ${selectedTime === slot.time
                ? 'bg-blue-600 text-white shadow-md scale-105'
                : slot.available
                ? 'bg-white text-gray-700 border-2 border-gray-200 hover:border-blue-600 hover:text-blue-600'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }
            `}
          >
            {formatTime(slot.time)}
          </button>
        ))}
      </div>
    </div>
  );
};