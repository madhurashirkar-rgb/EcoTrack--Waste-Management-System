import React, { useState, useEffect } from 'react';
import { 
  User, Award, Mail, Phone, MapPin, Calendar, 
  Shield, CheckCircle2, Sparkles, LogOut, ArrowRight, RefreshCw 
} from 'lucide-react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function Profile({ setActiveTab }) {
  const { user, switchDemoRole, logout, setIsAuthModalOpen } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.user
      .getProfile()
      .then((res) => {
        setProfileData(res.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [user]);

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-300">
      
      {/* User Header Profile Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center text-3xl font-extrabold shadow-lg shadow-emerald-600/30">
            {user?.name?.charAt(0) || 'U'}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
              <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 truncate">
                {user?.name || 'Citizen User'}
              </h1>
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                user?.role === 'admin'
                  ? 'bg-slate-900 text-white'
                  : 'bg-emerald-100 text-emerald-800'
              }`}>
                {user?.role === 'admin' ? '🛡️ Municipal Officer' : '🌱 Active Citizen'}
              </span>
            </div>

            <p className="text-xs text-gray-500 flex items-center justify-center sm:justify-start gap-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              {user?.location || 'Greenwood District'}
            </p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-4 pt-4 border-t border-gray-100 text-xs text-gray-600">
              <div className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-gray-400" />
                <span>{user?.email}</span>
              </div>
              {user?.mobile && (
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-gray-400" />
                  <span>{user.mobile}</span>
                </div>
              )}
            </div>
          </div>

          {/* EcoPoints Balance Box */}
          <div className="shrink-0 bg-emerald-50 rounded-2xl p-4 border border-emerald-200 text-center sm:text-right min-w-[140px]">
            <span className="text-[10px] font-bold uppercase text-emerald-800 tracking-wider block">
              Total EcoPoints
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-700 mt-0.5">
              {profileData?.ecoPoints ?? user?.ecoPoints ?? 0}
            </div>
            <span className="text-[11px] font-medium text-emerald-600 block mt-0.5">
              Level: {profileData?.ecoPoints >= 300 ? 'Gold Contributor' : 'Silver Pioneer'}
            </span>
          </div>
        </div>
      </div>

      {/* Activity Impact Summary */}
      <section className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-sm">
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">
          Personal Environmental Impact
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 text-center">
            <span className="text-xs font-semibold text-gray-500 block">Total Reports</span>
            <span className="text-xl font-extrabold text-gray-900 block mt-1">
              {profileData?.activitySummary?.totalReports || 0}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 text-center">
            <span className="text-xs font-semibold text-emerald-700 block">Waste Cleared</span>
            <span className="text-xl font-extrabold text-emerald-700 block mt-1">
              {profileData?.activitySummary?.collected || 0}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100 text-center">
            <span className="text-xs font-semibold text-amber-700 block">Pending Cleanup</span>
            <span className="text-xl font-extrabold text-amber-700 block mt-1">
              {profileData?.activitySummary?.pending || 0}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-teal-50 border border-teal-100 text-center">
            <span className="text-xs font-semibold text-teal-700 block">CO₂ Saved (Est.)</span>
            <span className="text-xl font-extrabold text-teal-700 block mt-1">
              {profileData?.activitySummary?.estimatedCarbonSavedKg || '0.0'} kg
            </span>
          </div>
        </div>
      </section>

      {/* Badges & Achievements */}
      <section className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
              Citizen Badges & Milestones
            </h3>
            <p className="text-xs text-gray-500">Unlock community badges by reporting and segregating waste</p>
          </div>
          <Award className="w-5 h-5 text-emerald-600" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {(profileData?.badges || []).map((badge) => (
            <div
              key={badge.id}
              className={`p-4 rounded-2xl border transition-all flex items-center gap-3.5 ${
                badge.unlocked
                  ? 'bg-emerald-50/60 border-emerald-200'
                  : 'bg-gray-50/50 border-gray-200 opacity-60'
              }`}
            >
              <div className="w-12 h-12 rounded-2xl bg-white shadow-xs flex items-center justify-center text-2xl shrink-0">
                {badge.icon}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-gray-900">{badge.name}</h4>
                  <span className="text-[10px] font-bold text-gray-400">{badge.minPoints} pts</span>
                </div>
                <p className="text-[11px] text-gray-500 mt-0.5 line-clamp-1">{badge.description}</p>
                
                {/* Progress bar */}
                <div className="w-full bg-gray-200 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div
                    className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${badge.progress}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Account Settings & Quick Switcher */}
      <section className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
          Demo Testing & Session
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={() => switchDemoRole('citizen')}
            className={`p-3.5 rounded-2xl border text-left transition-all flex items-center gap-3 ${
              user?.role === 'citizen'
                ? 'border-emerald-600 bg-emerald-50/80 ring-2 ring-emerald-500/20'
                : 'border-gray-200 hover:bg-gray-50'
            }`}
          >
            <span className="text-xl">🌱</span>
            <div>
              <span className="text-xs font-bold text-gray-900 block">Alex Johnson (Citizen)</span>
              <span className="text-[10px] text-gray-500">Regular citizen account with reports</span>
            </div>
          </button>

          <button
            onClick={() => switchDemoRole('admin')}
            className={`p-3.5 rounded-2xl border text-left transition-all flex items-center gap-3 ${
              user?.role === 'admin'
                ? 'border-slate-800 bg-slate-50 ring-2 ring-slate-700/20'
                : 'border-gray-200 hover:bg-gray-50'
            }`}
          >
            <span className="text-xl">🛡️</span>
            <div>
              <span className="text-xs font-bold text-gray-900 block">Officer Davis (Admin)</span>
              <span className="text-[10px] text-gray-500">Municipal sanitation officer credentials</span>
            </div>
          </button>
        </div>

        <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="text-xs font-bold text-emerald-600 hover:text-emerald-700"
          >
            Log in with different credentials →
          </button>

          <button
            onClick={logout}
            className="text-xs font-semibold text-red-600 hover:text-red-700 flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>
      </section>
    </div>
  );
}
