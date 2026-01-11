export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone) => {
  const phoneRegex = /^[+]?[(]?\d{3}[)]?[\s.-]?\d{3}[\s.-]?\d{4}$/;
  return phoneRegex.test(phone);
};

export const validateName = (name) => {
  return name && name.trim().length >= 2;
};

export const validateRequired = (value) => {
  return value && value.trim().length > 0;
};

export const validateBookingForm = (data) => {
  const errors = [];

  if (!validateRequired(data.customerName)) {
    errors.push({ field: 'customerName', message: 'Name is required' });
  } else if (!validateName(data.customerName)) {
    errors.push({ field: 'customerName', message: 'Name must be at least 2 characters' });
  }

  if (!validateRequired(data.customerEmail)) {
    errors.push({ field: 'customerEmail', message: 'Email is required' });
  } else if (!validateEmail(data.customerEmail)) {
    errors.push({ field: 'customerEmail', message: 'Invalid email format' });
  }

  if (!validateRequired(data.customerPhone)) {
    errors.push({ field: 'customerPhone', message: 'Phone number is required' });
  } else if (!validatePhone(data.customerPhone)) {
    errors.push({ field: 'customerPhone', message: 'Invalid phone number format' });
  }

  if (!data.serviceId) {
    errors.push({ field: 'serviceId', message: 'Please select a service' });
  }

  if (!data.date) {
    errors.push({ field: 'date', message: 'Please select a date' });
  }

  if (!data.timeSlot) {
    errors.push({ field: 'timeSlot', message: 'Please select a time slot' });
  }

  return errors;
};

export const validateService = (data) => {
  const errors = [];

  if (!validateRequired(data.name)) {
    errors.push({ field: 'name', message: 'Service name is required' });
  }

  if (!validateRequired(data.description)) {
    errors.push({ field: 'description', message: 'Description is required' });
  }

  if (data.duration <= 0) {
    errors.push({ field: 'duration', message: 'Duration must be greater than 0' });
  }

  if (data.price < 0) {
    errors.push({ field: 'price', message: 'Price cannot be negative' });
  }

  if (!validateRequired(data.category)) {
    errors.push({ field: 'category', message: 'Category is required' });
  }

  return errors;
};