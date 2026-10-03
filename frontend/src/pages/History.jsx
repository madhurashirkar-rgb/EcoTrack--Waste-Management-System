import React, { useState, useEffect } from 'react';
import { FileText, MapPin, Calendar, ArrowRight, Filter, PlusCircle, RefreshCw } from 'lucide-react';
import api from '../api/client';
import StatusBadge from '../components/StatusBadge';
import { useAuth } from '../context/AuthContext';

const STATUS_FILTERS = ['All', 'Pending', 'Assigned', 'In Progress', 'Collected'];

export default function History({ setActiveTab, onSelectReport }) {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchReports = async () => {
    try {
      const res = await api.reports.getAll(filter);
      setReports(res.data || []);
    } catch (err) {
      console.error('Failed to load reports:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchReports();
  }, [filter, user]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchReports();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
            My Reports History
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Track and monitor the status lifecycle of all your logged waste complaints.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            className="p-2.5 bg-white border border-gray-200 hover:bg-gray-50 rounded-xl text-gray-600 transition-colors"
            title="Refresh list"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={() => setActiveTab('report')}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            New Report
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        <Filter className="w-3.5 h-3.5 text-gray-400 shrink-0 ml-1" />
        {STATUS_FILTERS.map((st) => (
          <button
            key={st}
            onClick={() => setFilter(st)}
            className={`px-3 py-1.5 rounded-xl font-semibold shrink-0 transition-all ${
              filter === st
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {/* Reports List */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs text-gray-500">Loading your history records...</p>
        </div>
      ) : reports.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-emerald-100 space-y-4">
          <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto">
            <FileText className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900">No reports found</h3>
            <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
              {filter !== 'All'
                ? `You have no reports with status '${filter}'. Try selecting 'All'.`
                : 'You have not submitted any waste reports yet.'}
            </p>
          </div>
          <button
            onClick={() => setActiveTab('report')}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors inline-flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            Report Waste Now
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reports.map((report) => (
            <div
              key={report.id}
              onClick={() => onSelectReport(report.id)}
              className="bg-white rounded-3xl p-5 border border-emerald-100 hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded font-bold">
                      {report.id}
                    </span>
                    <span className="text-xs font-bold text-gray-900">
                      {report.wasteType} Waste
                    </span>
                  </div>
                  <StatusBadge status={report.status} size="sm" />
                </div>

                <div className="flex gap-4">
                  {report.image && (
                    <img
                      src={report.image}
                      alt={report.wasteType}
                      className="w-16 h-16 rounded-2xl object-cover shrink-0 border border-gray-100"
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-gray-700 line-clamp-2 leading-relaxed">
                      {report.description}
                    </p>
                    
                    <div className="flex items-center gap-1.5 text-[11px] text-gray-500 mt-2 truncate">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="truncate">{report.location}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-gray-400 text-[11px]">
                  <Calendar className="w-3 h-3" />
                  <span>
                    {new Date(report.date).toLocaleDateString([], {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                </div>

                <span className="text-emerald-700 font-bold group-hover:text-emerald-800 flex items-center gap-1 text-[11px]">
                  Track Progress <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
