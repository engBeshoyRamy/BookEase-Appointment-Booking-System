import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getMonthDays, formatDate, isPastDate, isSameDay } from '../../utils/dateUtils';

export const Calendar = ({ 
  selectedDate, 
  onSelectDate, 
  disabledDates = [], 
  highlightedDates = [] 
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthDays = getMonthDays(currentMonth.getFullYear(), currentMonth.getMonth());
  const today = new Date();

  const isDateDisabled = (date) => {
    return isPastDate(date) || disabledDates.some(d => isSameDay(d, date));
  };

  const isDateHighlighted = (date) => {
    return highlightedDates.some(d => isSameDay(d, date));
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const monthName = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={handlePrevMonth}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h3 className="text-lg font-semibold text-gray-900">{monthName}</h3>
        <button
          onClick={handleNextMonth}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {monthDays.map((date, index) => {
          const isCurrentMonth = date.getMonth() === currentMonth.getMonth();
          const isSelected = selectedDate && isSameDay(date, selectedDate);
          const isToday = isSameDay(date, today);
          const disabled = isDateDisabled(date);
          const highlighted = isDateHighlighted(date);

          return (
            <button
              key={index}
              onClick={() => !disabled && isCurrentMonth && onSelectDate(date)}
              disabled={disabled || !isCurrentMonth}
              className={`
                aspect-square p-2 text-sm rounded-lg transition-all
                ${isCurrentMonth ? 'text-gray-900' : 'text-gray-300'}
                ${isSelected ? 'bg-blue-600 text-white font-semibold' : ''}
                ${isToday && !isSelected ? 'border-2 border-blue-600' : ''}
                ${highlighted && !isSelected ? 'bg-blue-100' : ''}
                ${disabled ? 'cursor-not-allowed opacity-40' : 'hover:bg-blue-50 cursor-pointer'}
                ${!isCurrentMonth ? 'cursor-not-allowed' : ''}
              `}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
};