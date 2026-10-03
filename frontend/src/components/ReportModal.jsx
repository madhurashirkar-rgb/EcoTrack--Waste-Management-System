import React, { useState, useEffect } from 'react';
import { X, MapPin, Calendar, User, Tag, FileText, CheckCircle, ShieldAlert } from 'lucide-react';
import StatusBadge from './StatusBadge';
import ReportTimeline from './ReportTimeline';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function ReportModal({ reportId, isOpen, onClose, onStatusUpdated }) {
  const { isAdmin } = useAuth();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!reportId || !isOpen) return;

    let mounted = true;
    setLoading(true);
    setError('');

    api.reports
      .getById(reportId)
      .then((res) => {
        if (mounted) {
          setReport(res.data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (mounted) {
          setError(err.message || 'Failed to load report');
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, [reportId, isOpen]);

  const handleStatusChange = async (nextStatus) => {
    try {
      setUpdating(true);
      const res = await api.reports.updateStatus(report.id, {
        status: nextStatus,
        resolutionNotes: `Status changed to ${nextStatus}`
      });
      setReport(res.data);
      if (onStatusUpdated) onStatusUpdated(res.data);
    } catch (err) {
      alert(err.message || 'Status update failed');
    } finally {
      setUpdating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-emerald-100 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-gray-100 flex items-center justify-between z-20">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-md">
              {report?.id || 'Report Details'}
            </span>
            {report && <StatusBadge status={report.status} />}
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {loading ? (
            <div className="py-16 text-center">
              <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-sm text-gray-500 font-medium">Fetching report details...</p>
            </div>
          ) : error ? (
            <div className="p-4 bg-red-50 text-red-700 rounded-xl text-sm text-center">
              {error}
            </div>
          ) : report ? (
            <>
              {/* Image banner */}
              {report.image && (
                <div className="relative rounded-2xl overflow-hidden aspect-video bg-gray-100 border border-gray-100 shadow-inner">
                  <img
                    src={report.image}
                    alt={report.wasteType}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-emerald-400" />
                    {report.wasteType} Waste
                  </div>
                </div>
              )}

              {/* Status progression stepper */}
              <div className="bg-emerald-50/60 rounded-2xl p-5 border border-emerald-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-2">
                  Resolution Lifecycle
                </h4>
                <ReportTimeline
                  statusProgression={report.statusProgression || []}
                  currentStatus={report.status}
                />
              </div>

              {/* Key metadata grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-gray-50 border border-gray-100">
                  <MapPin className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-semibold text-gray-500 block">Report Location</span>
                    <p className="text-sm font-medium text-gray-800 mt-0.5">{report.location}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-gray-50 border border-gray-100">
                  <Calendar className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-semibold text-gray-500 block">Date Submitted</span>
                    <p className="text-sm font-medium text-gray-800 mt-0.5">
                      {new Date(report.date).toLocaleDateString([], {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-gray-50 border border-gray-100">
                  <User className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-semibold text-gray-500 block">Reporter</span>
                    <p className="text-sm font-medium text-gray-800 mt-0.5">{report.userName || 'Community Citizen'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-gray-50 border border-gray-100">
                  <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-semibold text-gray-500 block">Assigned Crew</span>
                    <p className="text-sm font-medium text-gray-800 mt-0.5">
                      {report.assignedTo || 'Pending Assignment'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                <span className="text-xs font-semibold text-gray-500 block mb-1">Issue Description</span>
                <p className="text-sm text-gray-700 leading-relaxed">{report.description}</p>
              </div>

              {/* Officer / Quick Status Progression Actions */}
              <div className="border-t border-gray-100 pt-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase text-gray-500 tracking-wider">
                    {isAdmin ? 'Officer Status Controls' : 'Quick Progress Simulation'}
                  </span>
                  {updating && <span className="text-xs text-emerald-600 animate-pulse">Updating status...</span>}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {['Pending', 'Assigned', 'In Progress', 'Collected'].map((st) => (
                    <button
                      key={st}
                      disabled={updating || report.status.toLowerCase() === st.toLowerCase()}
                      onClick={() => handleStatusChange(st)}
                      className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-all ${
                        report.status.toLowerCase() === st.toLowerCase()
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                          : 'bg-white text-gray-700 border-gray-200 hover:border-emerald-500 hover:bg-emerald-50/50'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
