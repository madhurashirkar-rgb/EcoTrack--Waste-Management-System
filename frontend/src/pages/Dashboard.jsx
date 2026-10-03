import React, { useState, useEffect } from 'react';
import { 
  FileText, CheckCircle2, Clock, Award, PlusCircle, MapPin, 
  Lightbulb, ArrowRight, Sparkles, RefreshCw 
} from 'lucide-react';
import api from '../api/client';
import StatusBadge from '../components/StatusBadge';
import { useAuth } from '../context/AuthContext';

export default function Dashboard({ setActiveTab, onSelectReport }) {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [dailyTip, setDailyTip] = useState(null);
  const [recentReports, setRecentReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, tipRes, reportsRes] = await Promise.all([
        api.dashboard.getStats(),
        api.ecoTips.getDaily(),
        api.reports.getAll()
      ]);

      setStats(statsRes.data);
      setDailyTip(tipRes.data);
      setRecentReports((reportsRes.data || []).slice(0, 3));
    } catch (err) {
      console.error('Failed to load dashboard:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
  };

  if (loading) {
    return (
      <div className="py-24 text-center">
        <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm font-semibold text-gray-500">Loading your green workspace...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Hero / Greeting Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-emerald-700 to-emerald-800 text-white p-6 sm:p-8 shadow-xl shadow-emerald-700/10">
        {/* Background decorative leaf circles */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-emerald-400/20 rounded-full blur-xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/15 backdrop-blur-md rounded-full text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
              <span>EcoTrack Waste Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {stats?.greeting || `Hello, ${user?.name?.split(' ')[0] || 'Citizen'}!`}
            </h1>
            <p className="text-emerald-100 text-sm sm:text-base mt-2 leading-relaxed">
              Every reported item brings our community closer to a clean, zero-waste future.
              Track municipal collection and earn rewards along the way.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveTab('report')}
              className="px-5 py-3 bg-white text-emerald-800 hover:bg-emerald-50 rounded-2xl text-xs sm:text-sm font-bold shadow-lg shadow-black/10 transition-all hover:scale-102 flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4 text-emerald-600" />
              Report Waste
            </button>
            <button
              onClick={handleRefresh}
              className="p-3 bg-white/15 hover:bg-white/25 rounded-2xl text-white backdrop-blur-md transition-colors"
              title="Refresh Stats"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* 4 Primary Stats Cards Grid */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-gray-900 tracking-tight">
            Activity Overview
          </h2>
          <span className="text-xs text-gray-500 font-medium">Real-time sync</span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* 1. Reports Submitted */}
          <div className="bg-white p-5 rounded-3xl border border-emerald-100/80 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
              <FileText className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">
              Reports Submitted
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                {stats?.reportsSubmitted ?? 0}
              </span>
              <span className="text-xs text-gray-400 font-medium">logged</span>
            </div>
          </div>

          {/* 2. Waste Collected */}
          <div className="bg-white p-5 rounded-3xl border border-emerald-100/80 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mb-3">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">
              Waste Collected
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                {stats?.wasteCollected ?? 0}
              </span>
              <span className="text-xs text-teal-600 font-medium font-semibold">cleared</span>
            </div>
          </div>

          {/* 3. Pending Reports */}
          <div className="bg-white p-5 rounded-3xl border border-emerald-100/80 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
              <Clock className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">
              Pending Reports
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                {stats?.pendingReports ?? 0}
              </span>
              <span className="text-xs text-amber-600 font-medium">in queue</span>
            </div>
          </div>

          {/* 4. Eco Points */}
          <div className="bg-white p-5 rounded-3xl border border-emerald-100/80 shadow-xs hover:shadow-md transition-shadow bg-gradient-to-br from-white to-emerald-50/50">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mb-3 shadow-md shadow-emerald-600/25">
              <Award className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider block">
              EcoPoints
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl sm:text-3xl font-extrabold text-emerald-700">
                {stats?.ecoPoints ?? 0}
              </span>
              <span className="text-xs text-emerald-600 font-bold">+50 per report</span>
            </div>
          </div>
        </div>
      </section>

      {/* Two Column Layout: Daily Tip & Quick Hub Finder */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Daily Eco Tip Card (1 col) */}
        {dailyTip && (
          <div className="bg-amber-50/70 border border-amber-200/80 rounded-3xl p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-amber-800 text-xs font-bold uppercase tracking-wider mb-2">
                <Lightbulb className="w-4 h-4 text-amber-600" />
                <span>Daily Eco Tip</span>
              </div>
              <h3 className="font-bold text-gray-900 text-base mb-2">
                {dailyTip.category}
              </h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                "{dailyTip.tip}"
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-amber-200/60 flex items-center justify-between text-xs font-semibold text-amber-900">
              <span>Recycle Smarter</span>
              <span className="text-amber-700">🌱 Sustainability</span>
            </div>
          </div>
        )}

        {/* Recent Reports / Activity Feed (2 cols) */}
        <div className={`bg-white rounded-3xl border border-emerald-100 p-6 ${dailyTip ? 'md:col-span-2' : 'md:col-span-3'}`}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-gray-900">Recent Reports</h3>
              <p className="text-xs text-gray-500">Click any report to view resolution progression</p>
            </div>
            <button
              onClick={() => setActiveTab('history')}
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
            >
              View All <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {recentReports.length === 0 ? (
            <div className="py-8 text-center bg-gray-50 rounded-2xl">
              <p className="text-sm text-gray-500 font-medium">No waste reports recorded yet.</p>
              <button
                onClick={() => setActiveTab('report')}
                className="mt-2 text-xs font-bold text-emerald-600 hover:underline"
              >
                Submit your first report now →
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {recentReports.map((report) => (
                <div
                  key={report.id}
                  onClick={() => onSelectReport(report.id)}
                  className="p-3.5 rounded-2xl border border-gray-100 hover:border-emerald-300 hover:bg-emerald-50/30 transition-all cursor-pointer flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <img
                      src={report.image || 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=150&q=80'}
                      alt={report.wasteType}
                      className="w-12 h-12 rounded-xl object-cover shrink-0 border border-gray-100"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-gray-900 truncate">
                          {report.wasteType} Waste
                        </span>
                        <span className="text-[11px] text-gray-400">
                          {new Date(report.date).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 truncate mt-0.5">
                        {report.location}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    <StatusBadge status={report.status} size="sm" />
                    <ArrowRight className="w-4 h-4 text-gray-300 hidden sm:block" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Action Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div
          onClick={() => setActiveTab('map')}
          className="p-5 rounded-3xl bg-white border border-emerald-100 hover:border-emerald-300 transition-all cursor-pointer flex items-center justify-between group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900 group-hover:text-emerald-700 transition-colors">
                Drop-off Collection Centers
              </h4>
              <p className="text-xs text-gray-500 mt-0.5">
                Locate verified recycling depots and e-waste points nearby
              </p>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
        </div>

        <div
          onClick={() => setActiveTab('profile')}
          className="p-5 rounded-3xl bg-white border border-emerald-100 hover:border-emerald-300 transition-all cursor-pointer flex items-center justify-between group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900 group-hover:text-amber-700 transition-colors">
                Citizen Eco Badges
              </h4>
              <p className="text-xs text-gray-500 mt-0.5">
                Check unlocked community milestones and carbon savings
              </p>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-amber-600 group-hover:translate-x-1 transition-all" />
        </div>
      </section>
    </div>
  );
}
