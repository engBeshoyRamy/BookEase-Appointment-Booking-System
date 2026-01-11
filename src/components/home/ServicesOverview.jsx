import React from 'react';
import { Clock, DollarSign } from 'lucide-react';

export const ServicesOverview = ({ services, onBookService }) => {
  const activeServices = services.filter(s => s.isActive).slice(0, 6);

  return (
    <div className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Services</h2>
          <p className="text-lg text-gray-600">Choose from our wide range of professional services</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {activeServices.map(service => (
            <div
              key={service.id}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow p-6 border border-gray-200"
            >
              <div className="mb-4">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{service.name}</h3>
                <p className="text-gray-600 text-sm">{service.description}</p>
              </div>

              <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{service.duration} min</span>
                </div>
                <div className="flex items-center gap-1">
                  <DollarSign className="w-4 h-4" />
                  <span>${service.price}</span>
                </div>
              </div>

              <button
                onClick={() => onBookService(service.id)}
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
};