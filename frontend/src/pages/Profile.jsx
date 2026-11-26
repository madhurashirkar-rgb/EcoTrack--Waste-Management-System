import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  Sun,
  Moon,
  Monitor,
  Check,
  Edit3,
  LogOut,
  ShieldCheck,
  TreePine,
  Recycle,
  Zap,
  Award,
  Sparkles,
  MapPin,
  Calendar,
} from 'lucide-react';

export default function Profile({ setActiveTab }) {
  const { user, logout, ecoPoints } = useAuth();
  const { theme, setTheme } = useTheme();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || 'Alex Rivera');
  const [location, setLocation] = useState(user?.location || 'Sector 7 (River North)');

  const initials =
    name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'AR';

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Bio & Level Badge */}
        <div className="bg-surface-container-lowest rounded-3xl p-6 sm:p-8 custom-shadow-card border border-surface-container-high flex flex-col items-center text-center space-y-5">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-primary text-on-primary text-2xl font-bold font-mono flex items-center justify-center border-4 border-secondary-container shadow-neon">
              {initials}
            </div>
            <span className="absolute bottom-0 right-0 bg-primary text-on-primary p-1.5 rounded-full shadow-xs">
              <ShieldCheck className="w-4 h-4" />
            </span>
          </div>

          <div>
            <h1 className="heading-6 text-on-surface">{name}</h1>
            <p className="text-xs text-on-surface-variant font-mono mt-0.5">
              {user?.email || 'alex.rivera@ecotrack.org'}
            </p>
            <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-container border border-primary/25 text-primary text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Level 3 Eco Citizen</span>
            </div>
          </div>

          <div className="w-full pt-4 border-t border-surface-container-high text-left space-y-3">
            <div className="flex justify-between text-xs">
              <span className="text-on-surface-variant">EcoPoints Balance</span>
              <span className="font-mono font-bold text-primary">{ecoPoints} Pts</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-on-surface-variant">Member Since</span>
              <span className="font-bold text-on-surface font-mono">March 2023</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-on-surface-variant">Primary Sector</span>
              <span className="font-bold text-on-surface">{location}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-on-surface-variant">Verified Submissions</span>
              <span className="font-bold text-on-surface font-mono">12 Reports (100% Accuracy)</span>
            </div>
          </div>

          {editing ? (
            <div className="w-full space-y-3 pt-2">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full Name"
                className="w-full h-10 px-3 bg-surface-container-low border border-outline-variant rounded-xl text-xs text-on-surface focus:outline-none focus:border-primary"
              />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Sector Location"
                className="w-full h-10 px-3 bg-surface-container-low border border-outline-variant rounded-xl text-xs text-on-surface focus:outline-none focus:border-primary"
              />
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="neon-btn neon-btn-primary w-full py-2.5 rounded-xl bg-primary text-on-primary text-xs font-bold"
              >
                Save Changes
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="w-full py-2.5 rounded-xl border border-surface-container-high hover:border-primary/50 bg-surface-container-low text-xs font-semibold text-on-surface transition-colors flex items-center justify-center gap-2"
            >
              <Edit3 className="w-4 h-4 text-primary" />
              <span>Edit Profile Settings</span>
            </button>
          )}

          {user && (
            <button
              type="button"
              onClick={logout}
              className="text-xs text-error hover:underline flex items-center gap-1.5 pt-1"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          )}
        </div>

        {/* Right: Carbon Footprint Meter & Achievements */}
        <div className="lg:col-span-2 space-y-6">
          {/* Carbon Offset Gauge Tile */}
          <div className="bg-surface-container-lowest rounded-3xl p-6 sm:p-7 custom-shadow-card border border-surface-container-high space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-mono font-bold text-primary uppercase tracking-wider">
                  Environmental Savings Meter
                </span>
                <h2 className="title-2 text-on-surface mt-0.5">Cumulative Carbon Offset</h2>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-secondary-container text-primary border border-primary/25">
                Top 5% in Sector
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 bg-surface-container-low rounded-2xl border border-surface-container-high">
                <div className="text-[11px] font-mono text-on-surface-variant flex items-center gap-1.5">
                  <TreePine className="w-3.5 h-3.5 text-primary" />
                  <span>CO₂ Offset Total</span>
                </div>
                <div className="text-2xl font-mono font-bold text-primary mt-1">142.4 kg</div>
                <div className="text-[11px] text-on-surface-variant mt-1">Equivalent to 6 trees grown</div>
              </div>
              <div className="p-4 bg-surface-container-low rounded-2xl border border-surface-container-high">
                <div className="text-[11px] font-mono text-on-surface-variant flex items-center gap-1.5">
                  <Recycle className="w-3.5 h-3.5 text-tertiary" />
                  <span>Landfill Diversion</span>
                </div>
                <div className="text-2xl font-mono font-bold text-tertiary mt-1">84.0 kg</div>
                <div className="text-[11px] text-on-surface-variant mt-1">Bottles, paper &amp; batteries</div>
              </div>
              <div className="p-4 bg-surface-container-low rounded-2xl border border-surface-container-high">
                <div className="text-[11px] font-mono text-on-surface-variant flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>Response Rate</span>
                </div>
                <div className="text-2xl font-mono font-bold text-on-surface mt-1">&lt; 3.2 hrs</div>
                <div className="text-[11px] text-on-surface-variant mt-1">Average municipal dispatch</div>
              </div>
            </div>
          </div>

          {/* Citizen Badges Showcase */}
          <div className="bg-surface-container-lowest rounded-3xl p-6 sm:p-7 custom-shadow-card border border-surface-container-high space-y-4">
            <h2 className="title-2 text-on-surface flex items-center gap-2">
              <Award className="w-5 h-5 text-primary" />
              <span>Civic Achievements &amp; Badges</span>
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-4 rounded-2xl border border-primary/25 bg-secondary-container/40 text-center space-y-1">
                <span className="text-2xl">⚡</span>
                <div className="font-bold text-xs text-on-surface">First Responder</div>
                <div className="text-[10px] text-on-surface-variant">Reported within 1 hr of dumping</div>
              </div>
              <div className="p-4 rounded-2xl border border-primary/25 bg-secondary-container/40 text-center space-y-1">
                <span className="text-2xl">📦</span>
                <div className="font-bold text-xs text-on-surface">Sorting Master</div>
                <div className="text-[10px] text-on-surface-variant">100% correct categorization</div>
              </div>
              <div className="p-4 rounded-2xl border border-primary/25 bg-secondary-container/40 text-center space-y-1">
                <span className="text-2xl">🏙️</span>
                <div className="font-bold text-xs text-on-surface">Clean Sector</div>
                <div className="text-[10px] text-on-surface-variant">Helped clear 10 sector zones</div>
              </div>
              <div className="p-4 rounded-2xl border border-surface-container-high bg-surface-container-low text-center space-y-1 opacity-60">
                <span className="text-2xl">🌟</span>
                <div className="font-bold text-xs text-on-surface">Centurion (Locked)</div>
                <div className="text-[10px] text-on-surface-variant">Divert 100 kg of waste</div>
              </div>
            </div>
          </div>

          {/* Theme & Display Appearance Card */}
          <div className="bg-surface-container-lowest rounded-3xl p-6 sm:p-7 custom-shadow-card border border-surface-container-high space-y-4">
            <div>
              <h2 className="title-2 text-on-surface">Appearance &amp; Theme Mode</h2>
              <p className="text-xs text-on-surface-variant mt-0.5">
                Customize your visual interface. Switch between Botanical Bright Mode and Obsidian Bioluminescent Neon Dark Mode.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              {/* Bright Mode Option */}
              <button
                type="button"
                onClick={() => setTheme('light')}
                className={`p-4 rounded-2xl border text-left transition-all duration-300 flex flex-col justify-between relative ${
                  theme === 'light'
                    ? 'border-primary bg-primary/10 ring-2 ring-primary/30'
                    : 'border-surface-container-high bg-surface-container-low hover:border-outline-variant hover:bg-surface-container'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
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
                type="button"
                onClick={() => setTheme('dark')}
                className={`p-4 rounded-2xl border text-left transition-all duration-300 flex flex-col justify-between relative ${
                  theme === 'dark'
                    ? 'border-primary bg-primary/15 ring-2 ring-primary/40 shadow-neon'
                    : 'border-surface-container-high bg-surface-container-low hover:border-outline-variant hover:bg-surface-container'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-3">
                  <div className="w-10 h-10 rounded-xl bg-surface-container border border-primary/30 text-primary flex items-center justify-center shrink-0">
                    <Moon className="w-5 h-5" />
                  </div>
                  {theme === 'dark' && (
                    <span className="w-5 h-5 rounded-full bg-primary text-on-primary flex items-center justify-center">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </span>
                  )}
                </div>
                <div>
                  <span className="font-bold text-xs text-on-surface block">Neon Dark</span>
                  <p className="text-[11px] text-on-surface-variant mt-0.5 leading-snug">
                    Obsidian carbon aesthetics with bioluminescent emerald &amp; cyber cyan accents.
                  </p>
                </div>
              </button>

              {/* System Preference Option */}
              <button
                type="button"
                onClick={() => setTheme('system')}
                className={`p-4 rounded-2xl border text-left transition-all duration-300 flex flex-col justify-between relative ${
                  theme === 'system'
                    ? 'border-primary bg-primary/10 ring-2 ring-primary/30'
                    : 'border-surface-container-high bg-surface-container-low hover:border-outline-variant hover:bg-surface-container'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-3">
                  <div className="w-10 h-10 rounded-xl bg-surface-container border border-surface-container-high text-on-surface flex items-center justify-center shrink-0">
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
                    Syncs dynamically with your OS device theme preference.
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
