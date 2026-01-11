import React, { useState } from 'react';
import { LogIn, Lock } from 'lucide-react';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { Navigation } from './components/layout/Navigation';
import { Hero } from './components/home/Hero';
import { ServicesOverview } from './components/home/ServicesOverview';
import { MyAppointments } from './components/customer/MyAppointments';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminAppointments } from './components/admin/AdminAppointments';
import { AdminServices } from './components/admin/AdminServices';
import { ServiceSelection } from './components/booking/ServiceSelection';
import { DateTimeSelection } from './components/booking/DateTimeSelection';
import { CustomerInfoForm } from './components/booking/CustomerInfoForm';
import { BookingConfirmation } from './components/booking/BookingConfirmation';
import { ToastContainer } from './components/shared/Toast';
import { LoadingSpinner } from './components/shared/LoadingSpinner';
import { AppProvider, useApp } from './context/AppContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { useServices } from './hooks/useServices';
import { useAppointments } from './hooks/useAppointments';
import { formatDate } from './utils/dateUtils';

function AppContent() {
  const [currentPage, setCurrentPage] = useState('home');
  const [bookingStep, setBookingStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    serviceId: '',
    date: '',
    timeSlot: '',
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    notes: '',
  });

  const { toasts, removeToast, addToast } = useApp();
  const { isAdmin, login } = useAuth();
  const { services, loading: servicesLoading, getServiceById } = useServices();
  const { addAppointment } = useAppointments();

  const [adminPassword, setAdminPassword] = useState('');
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  const handleNavigate = (page) => {
    if (page === 'admin' && !isAdmin) {
      setShowAdminLogin(true);
      return;
    }
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const handleAdminLogin = async () => {
    const success = await login(adminPassword);
    if (success) {
      addToast('Login successful', 'success');
      setShowAdminLogin(false);
      setCurrentPage('admin');
    } else {
      addToast('Invalid password', 'error');
    }
    setAdminPassword('');
  };

  const handleBookNow = (serviceId) => {
    if (serviceId) {
      setBookingData({ ...bookingData, serviceId });
      setBookingStep(2);
    } else {
      setBookingStep(1);
    }
    setCurrentPage('book');
  };

  const handleBookingComplete = async () => {
    try {
      const appointment = await addAppointment({
        serviceId: bookingData.serviceId,
        customerName: bookingData.customerName,
        customerEmail: bookingData.customerEmail,
        customerPhone: bookingData.customerPhone,
        date: bookingData.date,
        timeSlot: bookingData.timeSlot,
        status: 'pending',
        notes: bookingData.notes || '',
      });

      if (appointment) {
        addToast('Appointment booked successfully!', 'success');
        setBookingData({
          serviceId: '',
          date: '',
          timeSlot: '',
          customerName: '',
          customerEmail: '',
          customerPhone: '',
          notes: '',
        });
        setBookingStep(1);
        setCurrentPage('my-appointments');
      } else {
        addToast('Failed to book appointment. Please try again.', 'error');
      }
    } catch (error) {
      addToast('An error occurred. Please try again.', 'error');
    }
  };

  if (servicesLoading) {
    return <LoadingSpinner fullScreen size="lg" text="Loading application..." />;
  }

  const renderBookingStep = () => {
    const selectedService = bookingData.serviceId ? getServiceById(bookingData.serviceId) : null;

    switch (bookingStep) {
      case 1:
        return (
          <ServiceSelection
            services={services}
            selectedServiceId={bookingData.serviceId || null}
            onSelectService={(id) => setBookingData({ ...bookingData, serviceId: id })}
            onNext={() => setBookingStep(2)}
          />
        );
      case 2:
        return selectedService ? (
          <DateTimeSelection
            service={selectedService}
            selectedDate={bookingData.date ? new Date(bookingData.date) : null}
            selectedTime={bookingData.timeSlot || null}
            onSelectDate={(date) => setBookingData({ ...bookingData, date: formatDate(date) })}
            onSelectTime={(time) => setBookingData({ ...bookingData, timeSlot: time })}
            onNext={() => setBookingStep(3)}
            onBack={() => setBookingStep(1)}
          />
        ) : null;
      case 3:
        return (
          <CustomerInfoForm
            customerName={bookingData.customerName || ''}
            customerEmail={bookingData.customerEmail || ''}
            customerPhone={bookingData.customerPhone || ''}
            notes={bookingData.notes || ''}
            onUpdateField={(field, value) => setBookingData({ ...bookingData, [field]: value })}
            onNext={() => setBookingStep(4)}
            onBack={() => setBookingStep(2)}
          />
        );
      case 4:
        return selectedService ? (
          <BookingConfirmation
            service={selectedService}
            date={bookingData.date}
            time={bookingData.timeSlot}
            customerName={bookingData.customerName}
            customerEmail={bookingData.customerEmail}
            customerPhone={bookingData.customerPhone}
            notes={bookingData.notes || ''}
            onConfirm={handleBookingComplete}
            onBack={() => setBookingStep(3)}
          />
        ) : null;
      default:
        return null;
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <>
            <Hero onBookNow={() => handleBookNow()} />
            <ServicesOverview services={services} onBookService={handleBookNow} />
          </>
        );
      case 'services':
        return (
          <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Services</h1>
                <p className="text-lg text-gray-600">Explore our comprehensive range of professional services</p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {services.filter(s => s.isActive).map(service => (
                  <div key={service.id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-shadow">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{service.name}</h3>
                    <p className="text-gray-600 text-sm mb-4">{service.description}</p>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-sm text-gray-600">{service.duration} min</span>
                      <span className="text-lg font-bold text-blue-600">${service.price}</span>
                    </div>
                    <button
                      onClick={() => handleBookNow(service.id)}
                      className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                      Book Now
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 'book':
        return (
          <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="mb-8">
                <div className="flex justify-center items-center gap-4 mb-8">
                  {[1, 2, 3, 4].map(step => (
                    <div key={step} className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                        step === bookingStep ? 'bg-blue-600 text-white' :
                        step < bookingStep ? 'bg-green-600 text-white' :
                        'bg-gray-300 text-gray-600'
                      }`}>
                        {step}
                      </div>
                      {step < 4 && <div className={`w-12 h-1 ${step < bookingStep ? 'bg-green-600' : 'bg-gray-300'}`} />}
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-8">
                {renderBookingStep()}
              </div>
            </div>
          </div>
        );
      case 'my-appointments':
        return <MyAppointments />;
      case 'admin':
        return isAdmin ? (
          <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <AdminDashboard
                onNavigateToAppointments={() => setCurrentPage('admin-appointments')}
                onNavigateToServices={() => setCurrentPage('admin-services')}
              />
            </div>
          </div>
        ) : null;
      case 'admin-appointments':
        return isAdmin ? (
          <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <button
                onClick={() => setCurrentPage('admin')}
                className="mb-6 text-blue-600 hover:text-blue-700 font-medium"
              >
                ← Back to Dashboard
              </button>
              <AdminAppointments />
            </div>
          </div>
        ) : null;
      case 'admin-services':
        return isAdmin ? (
          <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <button
                onClick={() => setCurrentPage('admin')}
                className="mb-6 text-blue-600 hover:text-blue-700 font-medium"
              >
                ← Back to Dashboard
              </button>
              <AdminServices />
            </div>
          </div>
        ) : null;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header onNavigate={handleNavigate} currentPage={currentPage} />
      <main className="flex-grow pb-16 md:pb-0">{renderPage()}</main>
      <Footer />
      <Navigation currentPage={currentPage} onNavigate={handleNavigate} />
      <ToastContainer toasts={toasts} onClose={removeToast} />

      {showAdminLogin && !isAdmin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-8 max-w-md w-full">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-blue-100 p-4 rounded-full">
                <Lock className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">Admin Login</h2>
            <p className="text-gray-600 mb-6 text-center">Enter admin password to continue</p>
            <input
              type="password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAdminLogin()}
              placeholder="Enter password"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowAdminLogin(false);
                  setAdminPassword('');
                }}
                className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAdminLogin}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <LogIn className="w-5 h-5" />
                Login
              </button>
            </div>
            <p className="mt-4 text-sm text-gray-500 text-center">
              Demo password: <span className="font-mono font-semibold">admin123</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </AuthProvider>
  );
}