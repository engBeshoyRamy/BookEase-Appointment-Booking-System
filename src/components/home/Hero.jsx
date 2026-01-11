import React from 'react';
import { Calendar, Clock, CheckCircle } from 'lucide-react';

export const Hero = ({ onBookNow }) => {
  return (
    <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Book Your Appointments with Ease
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              Schedule professional services at your convenience. Simple, fast, and reliable booking system.
            </p>
            <button
              onClick={onBookNow}
              className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Book Now
            </button>
          </div>

          <div className="space-y-6">
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 border border-white border-opacity-20">
              <div className="flex items-start gap-4">
                <div className="bg-blue-500 p-3 rounded-lg">
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Easy Scheduling</h3>
                  <p className="text-blue-100">Pick your preferred date and time in seconds</p>
                </div>
              </div>
            </div>

            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 border border-white border-opacity-20">
              <div className="flex items-start gap-4">
                <div className="bg-blue-500 p-3 rounded-lg">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Real-time Availability</h3>
                  <p className="text-blue-100">See available slots instantly</p>
                </div>
              </div>
            </div>

            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 border border-white border-opacity-20">
              <div className="flex items-start gap-4">
                <div className="bg-blue-500 p-3 rounded-lg">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Instant Confirmation</h3>
                  <p className="text-blue-100">Get immediate booking confirmation</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};