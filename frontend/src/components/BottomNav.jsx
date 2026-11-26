import React from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Home,
  PlusCircle,
  MapPin,
  ClipboardList,
  Lightbulb,
  User,
  Shield,
  BarChart3,
} from 'lucide-react';

export default function BottomNav({ activeTab, setActiveTab }) {
  const { isAdmin } = useAuth();

  const citizenItems = [
    { id: 'dashboard', label: 'Home', Icon: Home },
    { id: 'report', label: 'Report', Icon: PlusCircle, highlight: true },
    { id: 'collection-points', label: 'Map', Icon: MapPin },
    { id: 'my-reports', label: 'Tickets', Icon: ClipboardList },
    { id: 'eco-tips', label: 'Tips', Icon: Lightbulb },
    { id: 'profile', label: 'Profile', Icon: User },
  ];

  const adminItems = [
    { id: 'admin', label: 'Admin', Icon: Shield, highlight: true },
    { id: 'collection-points', label: 'Map', Icon: MapPin },
    { id: 'dashboard', label: 'Overview', Icon: BarChart3 },
    { id: 'profile', label: 'Profile', Icon: User },
  ];

  const items = isAdmin ? adminItems : citizenItems;

  return (
    <nav
      aria-label="Mobile Navigation"
      className="fixed bottom-3 left-3 right-3 z-50 md:hidden rounded-2xl bg-surface-container-lowest/90 backdrop-blur-xl border border-surface-container-high custom-shadow-modal flex justify-around items-center px-2 py-2"
    >
      {items.map((item) => {
        const isActive = activeTab === item.id;
        const Icon = item.Icon;

        if (item.highlight) {
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveTab(item.id)}
              className="flex flex-col items-center justify-center -mt-6 group"
            >
              <div className="w-12 h-12 rounded-2xl bg-primary text-on-primary flex items-center justify-center shadow-neon group-hover:scale-105 active:scale-95 transition-all duration-300">
                <Icon className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-bold text-primary mt-1">
                {item.label}
              </span>
            </button>
          );
        }

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center justify-center px-2.5 py-1.5 rounded-xl text-[10px] transition-all duration-300 ${
              isActive
                ? 'bg-secondary-container text-primary font-bold border border-primary/25'
                : 'text-on-surface-variant hover:text-on-surface border border-transparent'
            }`}
          >
            <Icon className="w-4 h-4 mb-0.5" />
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
