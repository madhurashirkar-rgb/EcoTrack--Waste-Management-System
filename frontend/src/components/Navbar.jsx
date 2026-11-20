import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Shield, LogOut, User, Sun, Moon } from 'lucide-react';
import EcoTrackLogo from './EcoTrackLogo';

export default function Navbar({ activeTab, setActiveTab }) {
  const { user, isAdmin, logout, ecoPoints } = useAuth();
  const { theme, isDark, toggleTheme } = useTheme();

  const citizenNavItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'report', label: 'Report Waste' },
    { id: 'collection-points', label: 'Collection Points' },
    { id: 'my-reports', label: 'My Reports' },
    { id: 'eco-tips', label: 'EcoAcademy' },
  ];

  const adminNavItems = [
    { id: 'admin', label: 'Admin Dashboard', icon: Shield },
    { id: 'collection-points', label: 'Collection Points' },
  ];

  const navItems = isAdmin ? adminNavItems : citizenNavItems;
  const points = ecoPoints;

  return (
    <header className="sticky top-0 z-40 bg-surface-container-lowest border-b border-surface-container-high shadow-xs backdrop-blur-md">
      <div className="flex justify-between items-center w-full px-4 sm:px-6 py-3 max-w-7xl mx-auto">
        {/* Brand Logo & Title */}
        <div 
          className="flex items-center gap-3 cursor-pointer group" 
          onClick={() => setActiveTab(isAdmin ? 'admin' : 'dashboard')}
        >
          <EcoTrackLogo 
            className="w-9 h-9" 
            showText={true} 
            isAdmin={isAdmin} 
            subtitle={isAdmin ? 'Command Center' : 'Waste Management System'} 
          />
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-3">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all duration-150 ${
                  isActive
                    ? 'text-primary font-bold bg-secondary-container/80 border-b-2 border-primary'
                    : 'text-on-surface-variant hover:text-primary hover:bg-surface-container-low'
                }`}
              >
                {item.icon && <item.icon className="w-3.5 h-3.5" />}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Trailing Actions: Admin badge / Points & User Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {isAdmin ? (
            <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 text-emerald-400 text-xs font-bold border border-slate-700">
              <Shield className="w-3.5 h-3.5" />
              <span>{user?.email || 'admin@ecotrack.org'}</span>
            </div>
          ) : (
            <div 
              onClick={() => setActiveTab('eco-tips')}
              className="cursor-pointer flex items-center gap-1.5 bg-secondary-container text-on-secondary-container px-3 py-1.5 rounded-full text-xs font-bold shadow-xs hover:bg-secondary-fixed transition-colors"
              title="Click to view EcoAcademy & rewards"
            >
              <span className="text-sm leading-none">🌱</span>
              <span>{points} EcoPoints</span>
            </div>
          )}

          {/* User Profile Avatar Pill */}
          {user && (
            <button 
              className="flex items-center gap-2 p-1 rounded-full border border-surface-container-high hover:border-primary transition-all group"
              onClick={() => setActiveTab('profile')}
              title={`Logged in as ${user.name} (${user.email})`}
            >
              <div className="w-8 h-8 rounded-full bg-primary text-on-primary font-bold flex items-center justify-center text-xs shadow-xs group-hover:scale-105 transition-transform">
                {isAdmin ? 'AD' : user.name ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'US'}
              </div>
            </button>
          )}

          {/* Bright / Dark Mode Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg border border-surface-container-high bg-surface-container-low hover:bg-surface-container text-on-surface hover:text-primary transition-all flex items-center gap-1.5 shadow-xs group"
            title={isDark ? "Switch to Bright Mode" : "Switch to Dark Mode"}
            aria-label={isDark ? "Switch to Bright Mode" : "Switch to Dark Mode"}
          >
            {isDark ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-400 group-hover:rotate-45 transition-transform duration-300" />
                <span className="text-xs font-semibold hidden sm:inline text-amber-300">Bright</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-slate-700 group-hover:-rotate-12 transition-transform duration-300" />
                <span className="text-xs font-semibold hidden sm:inline text-on-surface">Dark</span>
              </>
            )}
          </button>

          {/* Direct Sign Out Button */}
          <button
            onClick={logout}
            className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg border border-outline-variant hover:bg-error-container/20 text-error text-xs font-bold transition-colors flex items-center gap-1"
            title="Sign out of your account"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </div>
    </header>
  );
}
