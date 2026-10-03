import React, { useState, useEffect } from 'react';
import { 
  Shield, Truck, CheckCircle2, Clock, AlertCircle, 
  Filter, Search, RefreshCw, ArrowRight, Eye, UserCheck 
} from 'lucide-react';
import api from '../api/client';
import StatusBadge from '../components/StatusBadge';
import { useAuth } from '../context/AuthContext';

const STATUSES = ['All', 'Pending', 'Assigned', 'In Progress', 'Collected'];

export default function AdminPanel({ onSelectReport }) {
  const { user, switchDemoRole } = useAuth();
  const [reports, setReports] = useState([]);
  const [stats, setStats] = useState(null);
  const [statusFilter, setStatusFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchAdminData = async () => {
    try {
      const res = await api.admin.getReports(statusFilter);
      setReports(res.data.reports || []);
      setStats(res.data.stats || null);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchAdminData();
  }, [statusFilter, user]);

  const handleUpdateStatus = async (reportId, nextStatus) => {
    try {
      setUpdatingId(reportId);
      await api.admin.updateReportStatus(reportId, {
        status: nextStatus,
        assignedTo: nextStatus === 'Assigned' ? 'Rapid Response Truck #07' : undefined,
        resolutionNotes: `Status changed to ${nextStatus} by sanitation admin.`
      });
      await fetchAdminData();
    } catch (err) {
      alert(err.message || 'Status update failed');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-xs font-semibold text-emerald-400 mb-2">
              <Shield className="w-3.5 h-3.5" />
              <span>Municipal Sanitation Command Center</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Officer Operations Panel
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-lg">
              Manage citywide waste reports, assign clean-up response teams, and transition resolution stages.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => switchDemoRole(user?.role === 'admin' ? 'citizen' : 'admin')}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-2"
            >
              <UserCheck className="w-4 h-4 text-emerald-400" />
              Role: {user?.role === 'admin' ? 'Admin Mode (Active)' : 'Switch to Admin'}
            </button>
            <button
              onClick={fetchAdminData}
              className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 transition-colors"
              title="Refresh records"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Global Statistics */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800">
            <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700/50">
              <span className="text-[10px] uppercase font-bold text-slate-400">Total City Reports</span>
              <span className="text-xl font-bold text-white block mt-0.5">{stats.total}</span>
            </div>
            <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700/50">
              <span className="text-[10px] uppercase font-bold text-amber-400">Pending Review</span>
              <span className="text-xl font-bold text-amber-400 block mt-0.5">{stats.pending}</span>
            </div>
            <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700/50">
              <span className="text-[10px] uppercase font-bold text-blue-400">Assigned Teams</span>
              <span className="text-xl font-bold text-blue-400 block mt-0.5">{stats.assigned}</span>
            </div>
            <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700/50">
              <span className="text-[10px] uppercase font-bold text-emerald-400">Resolved / Collected</span>
              <span className="text-xl font-bold text-emerald-400 block mt-0.5">{stats.collected}</span>
            </div>
          </div>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        <Filter className="w-3.5 h-3.5 text-gray-400 shrink-0 ml-1" />
        {STATUSES.map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-3 py-1.5 rounded-xl font-semibold shrink-0 transition-all ${
              statusFilter === st
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {/* All Reports List */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs text-gray-500">Querying municipal waste reports...</p>
        </div>
      ) : reports.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-100">
          <p className="text-sm font-semibold text-gray-600">No reports matching filter '{statusFilter}'.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reports.map((rep) => {
            const isBusy = updatingId === rep.id;
            return (
              <div
                key={rep.id}
                className="bg-white rounded-3xl p-5 border border-gray-200 hover:border-emerald-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs"
              >
                <div className="flex items-start gap-4 min-w-0 flex-1">
                  <img
                    src={rep.image || 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=150&q=80'}
                    alt={rep.wasteType}
                    className="w-16 h-16 rounded-2xl object-cover shrink-0 border border-gray-100"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="font-mono text-xs font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                        {rep.id}
                      </span>
                      <span className="text-xs font-bold text-gray-900">
                        {rep.wasteType} Waste
                      </span>
                      <StatusBadge status={rep.status} size="sm" />
                      <span className="text-[11px] text-gray-400">
                        by {rep.userName || 'Citizen'}
                      </span>
                    </div>

                    <p className="text-xs text-gray-700 line-clamp-1">
                      {rep.description}
                    </p>
                    <p className="text-[11px] text-gray-500 mt-1 truncate">
                      📍 {rep.location}
                    </p>
                  </div>
                </div>

                {/* Status Transition Action Buttons */}
                <div className="flex flex-wrap items-center gap-1.5 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-gray-100">
                  <span className="text-[10px] font-bold uppercase text-gray-400 block w-full md:hidden mb-1">
                    Set Status:
                  </span>

                  <button
                    disabled={isBusy || rep.status.toLowerCase() === 'pending'}
                    onClick={() => handleUpdateStatus(rep.id, 'Pending')}
                    className={`px-2.5 py-1.5 text-xs rounded-xl font-semibold border transition-all ${
                      rep.status.toLowerCase() === 'pending'
                        ? 'bg-amber-500 text-white border-amber-500'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border-gray-200'
                    }`}
                  >
                    Pending
                  </button>

                  <button
                    disabled={isBusy || rep.status.toLowerCase() === 'assigned'}
                    onClick={() => handleUpdateStatus(rep.id, 'Assigned')}
                    className={`px-2.5 py-1.5 text-xs rounded-xl font-semibold border transition-all ${
                      rep.status.toLowerCase() === 'assigned'
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border-gray-200'
                    }`}
                  >
                    Assign
                  </button>

                  <button
                    disabled={isBusy || rep.status.toLowerCase() === 'in progress'}
                    onClick={() => handleUpdateStatus(rep.id, 'In Progress')}
                    className={`px-2.5 py-1.5 text-xs rounded-xl font-semibold border transition-all ${
                      rep.status.toLowerCase() === 'in progress'
                        ? 'bg-purple-600 text-white border-purple-600'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border-gray-200'
                    }`}
                  >
                    In Progress
                  </button>

                  <button
                    disabled={isBusy || rep.status.toLowerCase() === 'collected'}
                    onClick={() => handleUpdateStatus(rep.id, 'Collected')}
                    className={`px-2.5 py-1.5 text-xs rounded-xl font-semibold border transition-all ${
                      rep.status.toLowerCase() === 'collected'
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border-gray-200'
                    }`}
                  >
                    Resolve
                  </button>

                  <button
                    onClick={() => onSelectReport(rep.id)}
                    className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors ml-1"
                    title="View details & timeline"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
