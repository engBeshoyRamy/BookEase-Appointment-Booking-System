import React, { useMemo } from 'react';
import { Calendar, DollarSign, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import { StatisticsCard } from './StatisticsCard';
import { useAppointments } from '../../hooks/useAppointments';
import { useServices } from '../../hooks/useServices';
import { LoadingSpinner } from '../shared/LoadingSpinner';
import { formatDisplayDate, formatTime } from '../../utils/dateUtils';

export const AdminDashboard = ({ onNavigateToAppointments, onNavigateToServices }) => {
  const { appointments, loading: appointmentsLoading } = useAppointments();
  const {  getServiceById } = useServices();

  const statistics = useMemo(() => {
    const totalBookings = appointments.length;
    const confirmedBookings = appointments.filter(a => a.status === 'confirmed').length;
    const pendingBookings = appointments.filter(a => a.status === 'pending').length;
    
    const totalRevenue = appointments
      .filter(a => a.status !== 'cancelled')
      .reduce((sum, apt) => {
        const service = getServiceById(apt.serviceId);
        return sum + (service?.price || 0);
      }, 0);

    const serviceCounts = appointments
      .filter(a => a.status !== 'cancelled')
      .reduce((acc, apt) => {
        acc[apt.serviceId] = (acc[apt.serviceId] || 0) + 1;
        return acc;
      }, {});

    const popularServiceId = Object.entries(serviceCounts).sort((a, b) => b[1] - a[1])[0]?.[0];
    const popularService = popularServiceId ? getServiceById(popularServiceId) : null;

    return {
      totalBookings,
      confirmedBookings,
      pendingBookings,
      totalRevenue,
      popularService: popularService?.name || 'N/A',
    };
  }, [appointments, getServiceById]);

  const recentAppointments = useMemo(() => {
    return [...appointments]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
  }, [appointments]);

  if (appointmentsLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" text="Loading dashboard..." />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's your booking overview</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatisticsCard
          title="Total Bookings"
          value={statistics.totalBookings}
          icon={Calendar}
          color="text-blue-600"
          bgColor="bg-blue-50"
        />
        <StatisticsCard
          title="Total Revenue"
          value={`$${statistics.totalRevenue.toFixed(2)}`}
          icon={DollarSign}
          color="text-green-600"
          bgColor="bg-green-50"
        />
        <StatisticsCard
          title="Confirmed"
          value={statistics.confirmedBookings}
          icon={CheckCircle}
          color="text-green-600"
          bgColor="bg-green-50"
        />
        <StatisticsCard
          title="Pending"
          value={statistics.pendingBookings}
          icon={Clock}
          color="text-yellow-600"
          bgColor="bg-yellow-50"
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Recent Appointments</h2>
            <button
              onClick={onNavigateToAppointments}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              View All
            </button>
          </div>
          <div className="space-y-4">
            {recentAppointments.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No appointments yet</p>
            ) : (
              recentAppointments.map(apt => {
                const service = getServiceById(apt.serviceId);
                return (
                  <div key={apt.id} className="border-b border-gray-100 pb-4 last:border-0">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold text-gray-900">{apt.customerName}</p>
                        <p className="text-sm text-gray-600">{service?.name}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        apt.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                        apt.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {apt.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      {formatDisplayDate(apt.date)} at {formatTime(apt.timeSlot)}
                    </p>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="space-y-4">
            <button
              onClick={onNavigateToAppointments}
              className="w-full p-4 bg-blue-50 border-2 border-blue-200 rounded-lg hover:bg-blue-100 transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <Calendar className="w-6 h-6 text-blue-600" />
                <div>
                  <p className="font-semibold text-gray-900">Manage Appointments</p>
                  <p className="text-sm text-gray-600">View and manage all bookings</p>
                </div>
              </div>
            </button>
            <button
              onClick={onNavigateToServices}
              className="w-full p-4 bg-green-50 border-2 border-green-200 rounded-lg hover:bg-green-100 transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <TrendingUp className="w-6 h-6 text-green-600" />
                <div>
                  <p className="font-semibold text-gray-900">Manage Services</p>
                  <p className="text-sm text-gray-600">Add or edit available services</p>
                </div>
              </div>
            </button>
            <div className="p-4 bg-purple-50 border-2 border-purple-200 rounded-lg">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-6 h-6 text-purple-600" />
                <div>
                  <p className="font-semibold text-gray-900">Most Popular Service</p>
                  <p className="text-sm text-gray-600">{statistics.popularService}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};