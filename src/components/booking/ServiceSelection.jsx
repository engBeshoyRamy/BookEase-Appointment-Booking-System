import React from 'react';
import { Clock, DollarSign, Check } from 'lucide-react';

export const ServiceSelection = ({ services, selectedServiceId, onSelectService, onNext }) => {
  const activeServices = services.filter(s => s.isActive);
  const categories = Array.from(new Set(activeServices.map(s => s.category)));

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Select a Service</h2>
        <p className="text-gray-600">Choose the service you'd like to book</p>
      </div>

      {categories.map(category => {
        const categoryServices = activeServices.filter(s => s.category === category);

        return (
          <div key={category}>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">{category}</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {categoryServices.map(service => {
                const isSelected = selectedServiceId === service.id;

                return (
                  <button
                    key={service.id}
                    onClick={() => onSelectService(service.id)}
                    className={`text-left p-6 rounded-xl border-2 transition-all ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50 shadow-lg'
                        : 'border-gray-200 bg-white hover:border-blue-400 hover:shadow-md'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="text-lg font-bold text-gray-900">{service.name}</h4>
                      {isSelected && (
                        <div className="bg-blue-600 rounded-full p-1">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-4">{service.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-700">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{service.duration} min</span>
                      </div>
                      <div className="flex items-center gap-1 font-semibold text-blue-600">
                        <DollarSign className="w-4 h-4" />
                        <span>${service.price}</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}

      <div className="flex justify-end">
        <button
          onClick={onNext}
          disabled={!selectedServiceId}
          className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Next: Select Date & Time
        </button>
      </div>
    </div>
  );
};