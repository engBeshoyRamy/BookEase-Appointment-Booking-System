import React from 'react';
import { Home, Calendar, List, Settings } from 'lucide-react';

export const Navigation = ({ currentPage, onNavigate }) => {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'book', label: 'Book', icon: Calendar },
    { id: 'my-appointments', label: 'My Appointments', icon: List },
    { id: 'services', label: 'Services', icon: Settings },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40">
      <div className="grid grid-cols-4 gap-1">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center justify-center py-3 transition-colors ${
                isActive ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              <Icon className="w-5 h-5 mb-1" />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};