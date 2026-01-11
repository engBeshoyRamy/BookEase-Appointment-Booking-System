import React from 'react';
import { Calendar, Moon, Sun, LogOut } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';

export const Header = ({ onNavigate, currentPage }) => {
  const { darkMode, toggleDarkMode } = useApp();
  const { isAdmin, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
          >
            <Calendar className="w-8 h-8 text-blue-600" />
            <h1 className="text-xl font-bold text-gray-900">BookEase</h1>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <button
              onClick={() => onNavigate('home')}
              className={`text-sm font-medium transition-colors ${
                currentPage === 'home' ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => onNavigate('services')}
              className={`text-sm font-medium transition-colors ${
                currentPage === 'services' ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              Services
            </button>
            <button
              onClick={() => onNavigate('book')}
              className={`text-sm font-medium transition-colors ${
                currentPage === 'book' ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              Book Now
            </button>
            <button
              onClick={() => onNavigate('my-appointments')}
              className={`text-sm font-medium transition-colors ${
                currentPage === 'my-appointments' ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              My Appointments
            </button>
            {isAdmin && (
              <button
                onClick={() => onNavigate('admin')}
                className={`text-sm font-medium transition-colors ${
                  currentPage === 'admin' ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                Admin
              </button>
            )}
          </nav>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleDarkMode}
              className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            {isAdmin && (
              <button
                onClick={logout}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-red-600 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};