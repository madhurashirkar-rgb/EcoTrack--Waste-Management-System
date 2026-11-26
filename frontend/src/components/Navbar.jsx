import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  Shield,
  LogOut,
  Sun,
  Moon,
  Sprout,
  Menu,
  X,
  ArrowRight,
  Home,
} from 'lucide-react';
import EcoTrackLogo from './EcoTrackLogo';

export default function Navbar({ activeTab, setActiveTab, onOpenOverview }) {
  const { user, isAdmin, logout, ecoPoints } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  const handleNavClick = (id) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <div className="sticky top-3 z-40 px-4 sm:px-6 pointer-events-none">
        <header className="pointer-events-auto max-w-7xl mx-auto rounded-2xl bg-surface-container-lowest/80 backdrop-blur-xl border border-surface-container-high custom-shadow-card transition-all duration-300">
          <div className="flex justify-between items-center w-full px-4 sm:px-5 py-2.5">
            {/* Brand Logo & Title */}
            <button
              type="button"
              className="flex items-center gap-3 cursor-pointer group text-left rounded-xl"
              onClick={() => handleNavClick(isAdmin ? 'admin' : 'dashboard')}
            >
              <EcoTrackLogo
                className="w-9 h-9"
                showText={true}
                isAdmin={isAdmin}
                subtitle={isAdmin ? 'Command Center' : 'Waste Governance'}
              />
            </button>

            {/* Desktop Navigation Links */}
            <nav
              aria-label="Primary Navigation"
              className="hidden md:flex items-center gap-1 bg-surface-container-low/70 p-1 rounded-xl border border-surface-container-high"
            >
              {navItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleNavClick(item.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all duration-300 ease-expo ${
                      isActive
                        ? 'bg-secondary-container text-primary border border-primary/35 dark:shadow-[0_0_16px_rgba(0,255,148,0.18)]'
                        : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container border border-transparent'
                    }`}
                  >
                    {item.icon && <item.icon className="w-3.5 h-3.5" />}
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Trailing Actions */}
            <div className="flex items-center gap-2 sm:gap-2.5">
              {onOpenOverview && (
                <button
                  type="button"
                  onClick={onOpenOverview}
                  className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-surface-container-high bg-surface-container-low hover:border-primary/40 text-xs font-semibold text-on-surface-variant hover:text-primary transition-colors"
                  title="View Public Landing Overview"
                >
                  <Home className="w-3.5 h-3.5" />
                  <span>Overview</span>
                </button>
              )}

              {isAdmin ? (
                <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container text-primary text-xs font-mono font-semibold border border-primary/30">
                  <Shield className="w-3.5 h-3.5" />
                  <span>{user?.email || 'admin@ecotrack.org'}</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => handleNavClick('eco-tips')}
                  className="cursor-pointer flex items-center gap-1.5 bg-secondary-container/80 text-primary px-3 py-1.5 rounded-full text-xs font-semibold border border-primary/25 hover:border-primary/60 transition-all duration-300"
                  title="View EcoAcademy & Rewards"
                >
                  <Sprout className="w-3.5 h-3.5" />
                  <span className="font-mono">{ecoPoints} pts</span>
                </button>
              )}

              {/* User Profile Avatar Pill */}
              {user && (
                <button
                  type="button"
                  className="flex items-center p-0.5 rounded-full border border-surface-container-high hover:border-primary transition-all duration-300 group"
                  onClick={() => handleNavClick('profile')}
                  title={`Logged in as ${user.name} (${user.email})`}
                >
                  <div className="w-8 h-8 rounded-full bg-primary text-on-primary font-bold flex items-center justify-center text-xs group-hover:scale-105 transition-transform duration-300">
                    {isAdmin
                      ? 'AD'
                      : user.name
                      ? user.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                          .slice(0, 2)
                          .toUpperCase()
                      : 'US'}
                  </div>
                </button>
              )}

              {/* Theme Mode Toggle */}
              <button
                type="button"
                onClick={toggleTheme}
                className="p-2 sm:px-2.5 sm:py-1.5 rounded-xl border border-surface-container-high bg-surface-container-low hover:border-primary/50 text-on-surface hover:text-primary transition-all duration-300 flex items-center gap-1.5 group"
                title={isDark ? 'Switch to Bright Mode' : 'Switch to Neon Dark Mode'}
                aria-label={isDark ? 'Switch to Bright Mode' : 'Switch to Neon Dark Mode'}
              >
                {isDark ? (
                  <>
                    <Sun className="w-3.5 h-3.5 text-amber-300 group-hover:rotate-45 transition-transform duration-300" />
                    <span className="text-xs font-semibold hidden xl:inline text-amber-200">Light</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-3.5 h-3.5 text-on-surface group-hover:-rotate-12 transition-transform duration-300" />
                    <span className="text-xs font-semibold hidden xl:inline text-on-surface">Neon</span>
                  </>
                )}
              </button>

              {/* Desktop Sign Out Button */}
              <button
                type="button"
                onClick={logout}
                className="hidden sm:flex p-2 sm:px-2.5 sm:py-1.5 rounded-xl border border-surface-container-high hover:border-error/50 hover:bg-error-container/30 text-error text-xs font-semibold transition-all duration-300 items-center gap-1.5"
                title="Sign out of your account"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden xl:inline">Sign Out</span>
              </button>

              {/* Mobile Full-Height Menu Button */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen((prev) => !prev)}
                className="md:hidden p-2 rounded-xl border border-surface-container-high bg-surface-container-low text-on-surface hover:text-primary transition-colors"
                aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </header>
      </div>

      {/* Full-Height Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden bg-background/95 backdrop-blur-2xl flex flex-col justify-between p-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <EcoTrackLogo
              className="w-9 h-9"
              showText={true}
              isAdmin={isAdmin}
              subtitle={isAdmin ? 'Command Center' : 'Waste Governance'}
            />
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-xl border border-surface-container-high bg-surface-container-low text-on-surface"
              aria-label="Close navigation menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="space-y-2.5 my-auto">
            {navItems.map((item, idx) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavClick(item.id)}
                  style={{ animationDelay: `${idx * 60}ms` }}
                  className={`w-full text-left px-4 py-3.5 rounded-2xl border text-sm font-semibold transition-all flex items-center justify-between animate-in slide-in-from-bottom-4 duration-300 ${
                    isActive
                      ? 'bg-secondary-container border-primary/40 text-primary'
                      : 'bg-surface-container-lowest border-surface-container-high text-on-surface hover:border-primary/40'
                  }`}
                >
                  <span>{item.label}</span>
                  <ArrowRight className="w-4 h-4 text-primary" />
                </button>
              );
            })}
            {onOpenOverview && (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenOverview();
                }}
                className="w-full text-left px-4 py-3.5 rounded-2xl border border-surface-container-high bg-surface-container-low text-sm font-semibold text-on-surface-variant flex items-center justify-between"
              >
                <span>Public Overview Page</span>
                <Home className="w-4 h-4" />
              </button>
            )}
          </nav>

          <div className="pt-4 border-t border-surface-container-high flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                logout();
              }}
              className="w-full py-3 rounded-xl border border-error/40 bg-error-container/30 text-error text-xs font-bold flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
