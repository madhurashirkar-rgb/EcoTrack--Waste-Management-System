import React from 'react';
import { useAuth } from '../context/AuthContext';

export default function BottomNav({ activeTab, setActiveTab }) {
  const { isAdmin } = useAuth();

  const citizenItems = [
    { id: 'dashboard', label: 'Home', icon: 'home' },
    { id: 'report', label: 'Report', icon: 'add_circle', highlight: true },
    { id: 'collection-points', label: 'Map', icon: 'location_on' },
    { id: 'my-reports', label: 'Tickets', icon: 'assignment' },
    { id: 'eco-tips', label: 'Tips', icon: 'lightbulb' },
    { id: 'profile', label: 'Profile', icon: 'person' },
  ];

  const adminItems = [
    { id: 'admin', label: 'Admin', icon: 'shield', highlight: true },
    { id: 'collection-points', label: 'Map', icon: 'location_on' },
    { id: 'dashboard', label: 'Overview', icon: 'analytics' },
    { id: 'profile', label: 'Profile', icon: 'person' },
  ];

  const items = isAdmin ? adminItems : citizenItems;

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 md:hidden bg-surface-container-lowest border-t border-surface-container-high shadow-lg flex justify-around items-center px-2 py-2">
      {items.map((item) => {
        const isActive = activeTab === item.id;
        
        if (item.highlight) {
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className="flex flex-col items-center justify-center -mt-5 group"
            >
              <div className="w-12 h-12 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-lg shadow-primary/30 group-hover:scale-105 active:scale-95 transition-all">
                <span className="material-symbols-outlined text-2xl">{item.icon}</span>
              </div>
              <span className="text-[10px] font-bold text-primary mt-0.5">
                {item.label}
              </span>
            </button>
          );
        }

        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center justify-center px-2.5 py-1 rounded-full text-[10px] transition-colors ${
              isActive 
                ? 'bg-secondary-container text-on-secondary-container font-bold' 
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-xl">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
