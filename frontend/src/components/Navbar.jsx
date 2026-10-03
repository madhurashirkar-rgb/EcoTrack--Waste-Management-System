import React from 'react';
import { Leaf, Award, Shield, User, LogOut, LogIn, PlusCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ activeTab, setActiveTab }) {
  const { user, isAdmin, logout, setIsAuthModalOpen, switchDemoRole } = useAuth();

  const navItems = [
    { id: 'dashboard', label: 'Home' },
    { id: 'report', label: 'Report' },
    { id: 'map', label: 'Map' },
    { id: 'history', label: 'History' },
    { id: 'profile', label: 'Profile' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-emerald-100 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div
          onClick={() => setActiveTab('dashboard')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-600/25 group-hover:scale-105 transition-transform">
            <Leaf className="w-5 h-5 fill-white/20" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg tracking-tight text-gray-900">
                Eco<span className="text-emerald-600">Track</span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
                v1.0
              </span>
            </div>
            <p className="text-[11px] text-gray-400 font-medium leading-none hidden sm:block">
              Waste Management System
            </p>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-gray-50/80 p-1 rounded-2xl border border-gray-100">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-4 py-1.5 text-xs font-semibold rounded-xl transition-all ${
                  isActive
                    ? 'bg-white text-emerald-700 shadow-xs border border-emerald-100'
                    : 'text-gray-600 hover:text-emerald-600 hover:bg-white/50'
                }`}
              >
                {item.label}
              </button>
            );
          })}

          {/* Admin Tab */}
          <button
            onClick={() => setActiveTab('admin')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-all ${
              activeTab === 'admin'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-emerald-700 hover:bg-emerald-50/60'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            Admin
          </button>
        </nav>

        {/* Right Actions: Points Pill & User Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {user ? (
            <>
              {/* EcoPoints pill */}
              <div
                onClick={() => setActiveTab('profile')}
                className="cursor-pointer flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full border border-emerald-200 text-xs font-bold hover:bg-emerald-100 transition-colors"
                title="Your EcoPoints balance"
              >
                <Award className="w-3.5 h-3.5 text-emerald-600" />
                <span>{user.ecoPoints || 0} pts</span>
              </div>

              {/* User Switcher / Profile Badge */}
              <button
                onClick={() => setActiveTab('profile')}
                className="flex items-center gap-2 p-1 pl-2 pr-3 bg-gray-100 hover:bg-gray-200/80 rounded-full text-xs font-medium text-gray-700 transition-colors"
              >
                <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[11px] font-bold">
                  {user.name?.charAt(0) || 'U'}
                </div>
                <span className="hidden sm:inline max-w-[100px] truncate">{user.name?.split(' ')[0]}</span>
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-sm hover:bg-emerald-700 transition-colors"
            >
              <LogIn className="w-4 h-4" />
              Sign In
            </button>
          )}

          {/* Quick Report Waste Button on Top Bar */}
          <button
            onClick={() => setActiveTab('report')}
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm shadow-emerald-600/20 transition-all hover:scale-102"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            Report Waste
          </button>
        </div>
      </div>
    </header>
  );
}
