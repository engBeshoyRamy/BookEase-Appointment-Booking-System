export const formatDate = (date) => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toISOString().split('T')[0];
};

export const formatDisplayDate = (date) => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const formatTime = (time) => {
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
};

export const addMinutes = (time, minutes) => {
  const [hours, mins] = time.split(':').map(Number);
  const totalMinutes = hours * 60 + mins + minutes;
  const newHours = Math.floor(totalMinutes / 60) % 24;
  const newMins = totalMinutes % 60;
  return `${String(newHours).padStart(2, '0')}:${String(newMins).padStart(2, '0')}`;
};

export const isTimeInRange = (time, start, end) => {
  return time >= start && time < end;
};

export const generateTimeSlots = (startTime, endTime, duration) => {
  const slots = [];
  let currentTime = startTime;

  while (currentTime < endTime) {
    const nextTime = addMinutes(currentTime, duration);
    if (nextTime <= endTime) {
      slots.push(currentTime);
    }
    currentTime = nextTime;
  }

  return slots;
};

export const isSameDay = (date1, date2) => {
  const d1 = typeof date1 === 'string' ? new Date(date1) : date1;
  const d2 = typeof date2 === 'string' ? new Date(date2) : date2;
  return formatDate(d1) === formatDate(d2);
};

export const isPastDate = (date) => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  d.setHours(0, 0, 0, 0);
  return d < today;
};

export const getDayOfWeek = (date) => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.getDay();
};

export const getMonthDays = (year, month) => {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const days = [];

  const startDay = firstDay.getDay();
  for (let i = 0; i < startDay; i++) {
    const prevDate = new Date(year, month, -startDay + i + 1);
    days.push(prevDate);
  }

  for (let day = 1; day <= lastDay.getDate(); day++) {
    days.push(new Date(year, month, day));
  }

  return days;
};