import React from 'react';
import { Calendar, Mail, Phone, MapPin } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-6 h-6 text-blue-500" />
              <h3 className="text-lg font-bold text-white">BookEase</h3>
            </div>
            <p className="text-sm text-gray-400">
              Your trusted appointment booking platform for professional services.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-blue-500 transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-500 transition-colors">
                  Services
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-500 transition-colors">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-500 transition-colors">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Business Hours</h4>
            <ul className="space-y-2 text-sm">
              <li>Monday - Wednesday: 9:00 AM - 6:00 PM</li>
              <li>Thursday - Friday: 9:00 AM - 8:00 PM</li>
              <li>Saturday: 10:00 AM - 4:00 PM</li>
              <li>Sunday: Closed</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-500" />
                (555) 123-4567
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-500" />
                info@bookease.com
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-500" />
                123 Main Street, City, State
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} Eng. Beshoy Ramy - BookEase. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};