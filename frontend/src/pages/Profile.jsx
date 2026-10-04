import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, Monitor, Check } from 'lucide-react';

export default function Profile({ setActiveTab }) {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || 'Alex Rivera');
  const [location, setLocation] = useState(user?.location || 'Sector 7 (River North)');

  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'AR';

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Bio & Level Badge */}
        <div className="bg-surface-container-lowest rounded-xl p-6 custom-shadow-card border border-surface-container-high flex flex-col items-center text-center space-y-4">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-primary text-on-primary text-3xl font-bold flex items-center justify-center border-4 border-secondary-container shadow-md">
              {initials}
            </div>
            <span className="absolute bottom-0 right-0 bg-primary text-on-primary p-1.5 rounded-full shadow-xs">
              <span className="material-symbols-outlined text-sm">verified_user</span>
            </span>
          </div>

          <div>
            <h2 className="text-xl font-bold text-on-surface">{name}</h2>
            <p className="text-xs text-on-surface-variant">{user?.email || 'alex.rivera@ecotrack.org'}</p>
            <div className="mt-2 inline-flex items-center gap-1 px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container text-xs font-bold">
              <span>🌱</span>
              <span>Level 3 Eco Citizen</span>
            </div>
          </div>

          <div className="w-full pt-4 border-t border-surface-container-high text-left space-y-3">
            <div className="flex justify-between text-xs">
              <span className="text-on-surface-variant">Member Since</span>
              <span className="font-bold text-on-surface">March 2023</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-on-surface-variant">Primary Sector</span>
              <span className="font-bold text-on-surface">{location}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-on-surface-variant">Verified Submissions</span>
              <span className="font-bold text-on-surface">12 Reports (100% Accuracy)</span>
            </div>
          </div>

          <button
            onClick={() => setEditing(!editing)}
            className="w-full py-2.5 rounded-md border border-outline-variant hover:bg-surface-container-low text-xs font-semibold text-on-surface transition-colors flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-base">edit</span>
            <span>{editing ? 'Save Profile' : 'Edit Profile Settings'}</span>
          </button>

          {user && (
            <button
              onClick={logout}
              className="text-xs text-error hover:underline flex items-center gap-1 pt-2"
            >
              <span className="material-symbols-outlined text-sm">logout</span>
              <span>Sign Out</span>
            </button>
          )}
        </div>

        {/* Right: Carbon Footprint Meter & Achievements */}
        <div className="lg:col-span-2 space-y-6">
          {/* Carbon Offset Gauge Tile */}
          <div className="bg-surface-container-lowest rounded-xl p-6 custom-shadow-card border border-surface-container-high space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-primary uppercase">Environmental Savings Meter</span>
                <h3 className="text-base font-bold text-on-surface mt-0.5">Cumulative Carbon Offset</h3>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-secondary-container text-on-secondary-container">
                Top 5% in Sector
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 bg-surface-container-low rounded-lg">
                <div className="text-[11px] text-on-surface-variant">CO₂ Offset Total</div>
                <div className="text-2xl font-bold text-primary mt-1">142.4 kg</div>
                <div className="text-[11px] text-on-surface-variant mt-1">Equivalent to 6 trees grown</div>
              </div>
              <div className="p-4 bg-surface-container-low rounded-lg">
                <div className="text-[11px] text-on-surface-variant">Landfill Diversion</div>
                <div className="text-2xl font-bold text-tertiary mt-1">84.0 kg</div>
                <div className="text-[11px] text-on-surface-variant mt-1">Bottles, paper & batteries</div>
              </div>
              <div className="p-4 bg-surface-container-low rounded-lg">
                <div className="text-[11px] text-on-surface-variant">Cleanup Response Rate</div>
                <div className="text-2xl font-bold text-on-surface mt-1">&lt; 3.2 hrs</div>
                <div className="text-[11px] text-on-surface-variant mt-1">Average municipal dispatch</div>
              </div>
            </div>
          </div>

          {/* Citizen Badges Showcase */}
          <div className="bg-surface-container-lowest rounded-xl p-6 custom-shadow-card border border-surface-container-high space-y-4">
            <h3 className="text-sm font-bold text-on-surface">Civic Achievements & Badges</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-lg border border-secondary-fixed-dim bg-secondary-container/30 text-center space-y-1">
                <span className="text-2xl">⚡</span>
                <div className="font-bold text-xs text-on-surface">First Responder</div>
                <div className="text-[10px] text-on-surface-variant">Reported within 1 hr of dumping</div>
              </div>
              <div className="p-3 rounded-lg border border-secondary-fixed-dim bg-secondary-container/30 text-center space-y-1">
                <span className="text-2xl">📦</span>
                <div className="font-bold text-xs text-on-surface">Sorting Master</div>
                <div className="text-[10px] text-on-surface-variant">100% correct waste categorization</div>
              </div>
              <div className="p-3 rounded-lg border border-secondary-fixed-dim bg-secondary-container/30 text-center space-y-1">
                <span className="text-2xl">🏙️</span>
                <div className="font-bold text-xs text-on-surface">Clean Neighborhood</div>
                <div className="text-[10px] text-on-surface-variant">Helped clear 10 sector zones</div>
              </div>
              <div className="p-3 rounded-lg border border-surface-container-high bg-surface-container-low text-center space-y-1 opacity-60">
                <span className="text-2xl">🌟</span>
                <div className="font-bold text-xs text-on-surface">Centurion (Locked)</div>
                <div className="text-[10px] text-on-surface-variant">Divert 100 kg of waste</div>
              </div>
            </div>
          </div>

          {/* Theme & Display Appearance Card */}
          <div className="bg-surface-container-lowest rounded-xl p-6 custom-shadow-card border border-surface-container-high space-y-4">
            <div>
              <h3 className="text-sm font-bold text-on-surface">Appearance & Theme Mode</h3>
              <p className="text-xs text-on-surface-variant mt-0.5">
                Customize your visual interface. Choose between high-clarity Bright Mode or modern midnight Dark Mode.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              {/* Bright Mode Option */}
              <button
                onClick={() => setTheme('light')}
                className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between relative ${
                  theme === 'light'
                    ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                    : 'border-surface-container-high bg-surface-container-low hover:border-outline-variant hover:bg-surface-container'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-3">
                  <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                    <Sun className="w-5 h-5" />
                  </div>
                  {theme === 'light' && (
                    <span className="w-5 h-5 rounded-full bg-primary text-on-primary flex items-center justify-center">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </span>
                  )}
                </div>
                <div>
                  <span className="font-bold text-xs text-on-surface block">Bright Mode</span>
                  <p className="text-[11px] text-on-surface-variant mt-0.5 leading-snug">
                    Vibrant daylight contrast for clear daytime use.
                  </p>
                </div>
              </button>

              {/* Dark Mode Option */}
              <button
                onClick={() => setTheme('dark')}
                className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between relative ${
                  theme === 'dark'
                    ? 'border-primary bg-primary/10 ring-2 ring-primary/20'
                    : 'border-surface-container-high bg-surface-container-low hover:border-outline-variant hover:bg-surface-container'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-3">
                  <div className="w-9 h-9 rounded-lg bg-slate-800 text-sky-400 flex items-center justify-center shrink-0 border border-slate-700">
                    <Moon className="w-5 h-5" />
                  </div>
                  {theme === 'dark' && (
                    <span className="w-5 h-5 rounded-full bg-primary text-on-primary flex items-center justify-center">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </span>
                  )}
                </div>
                <div>
                  <span className="font-bold text-xs text-on-surface block">Dark Mode</span>
                  <p className="text-[11px] text-on-surface-variant mt-0.5 leading-snug">
                    Midnight slate aesthetics with reduced glare.
                  </p>
                </div>
              </button>

              {/* System Preference Option */}
              <button
                onClick={() => setTheme('system')}
                className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between relative ${
                  theme === 'system'
                    ? 'border-primary bg-primary/10 ring-2 ring-primary/20'
                    : 'border-surface-container-high bg-surface-container-low hover:border-outline-variant hover:bg-surface-container'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-3">
                  <div className="w-9 h-9 rounded-lg bg-surface-container-high text-primary flex items-center justify-center shrink-0">
                    <Monitor className="w-5 h-5" />
                  </div>
                  {theme === 'system' && (
                    <span className="w-5 h-5 rounded-full bg-primary text-on-primary flex items-center justify-center">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </span>
                  )}
                </div>
                <div>
                  <span className="font-bold text-xs text-on-surface block">System Auto</span>
                  <p className="text-[11px] text-on-surface-variant mt-0.5 leading-snug">
                    Syncs dynamically with your OS device theme.
                  </p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
