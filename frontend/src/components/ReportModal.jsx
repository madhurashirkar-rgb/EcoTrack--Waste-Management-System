import React, { useState, useEffect } from 'react';
import { X, MapPin, Calendar, User, Tag, CheckCircle2 } from 'lucide-react';
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
        resolutionNotes: `Status changed to ${nextStatus}`,
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
    <div
      data-lenis-prevent
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-md flex items-center justify-center p-4"
    >
      <div className="bg-surface-container-lowest text-on-surface rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto custom-shadow-modal border border-surface-container-high animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="sticky top-0 bg-surface-container-lowest/95 backdrop-blur-md px-6 py-4 border-b border-surface-container-high flex items-center justify-between z-20">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold text-primary bg-secondary-container px-2.5 py-1 rounded-lg border border-primary/25">
              {report?.id || 'Report Details'}
            </span>
            {report && <StatusBadge status={report.status} />}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {loading ? (
            <div className="py-16 text-center">
              <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-xs text-on-surface-variant font-mono">Fetching report details...</p>
            </div>
          ) : error ? (
            <div className="p-4 bg-error-container border border-error/25 text-on-error-container rounded-2xl text-xs text-center">
              {error}
            </div>
          ) : report ? (
            <>
              {/* Image banner */}
              {report.image && (
                <div className="relative rounded-2xl overflow-hidden aspect-video bg-surface-container-low border border-surface-container-high shadow-inner">
                  <img
                    src={report.image}
                    alt={report.wasteType}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 border border-white/10">
                    <Tag className="w-3.5 h-3.5 text-primary" />
                    <span>{report.wasteType} Waste</span>
                  </div>
                </div>
              )}

              {/* Status progression stepper */}
              <div className="bg-surface-container-low rounded-2xl p-5 border border-surface-container-high">
                <h4 className="text-[11px] font-mono font-bold uppercase tracking-wider text-primary mb-2">
                  Resolution Lifecycle
                </h4>
                <ReportTimeline
                  statusProgression={report.statusProgression || []}
                  currentStatus={report.status}
                />
              </div>

              {/* Key metadata grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-surface-container-low border border-surface-container-high">
                  <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[11px] font-mono text-on-surface-variant block">Report Location</span>
                    <p className="text-xs font-medium text-on-surface mt-0.5">{report.location}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-surface-container-low border border-surface-container-high">
                  <Calendar className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[11px] font-mono text-on-surface-variant block">Date Submitted</span>
                    <p className="text-xs font-medium text-on-surface mt-0.5 font-mono">
                      {new Date(report.date).toLocaleDateString([], {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-surface-container-low border border-surface-container-high">
                  <User className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[11px] font-mono text-on-surface-variant block">Reporter</span>
                    <p className="text-xs font-medium text-on-surface mt-0.5">
                      {report.userName || 'Community Citizen'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-surface-container-low border border-surface-container-high">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[11px] font-mono text-on-surface-variant block">Assigned Crew</span>
                    <p className="text-xs font-medium text-on-surface mt-0.5">
                      {report.assignedTo || 'Pending Assignment'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="p-4 rounded-2xl bg-surface-container-low border border-surface-container-high">
                <span className="text-[11px] font-mono text-on-surface-variant block mb-1">Issue Description</span>
                <p className="text-xs text-on-surface leading-relaxed">{report.description}</p>
              </div>

              {/* Quick Status Progression Actions */}
              <div className="border-t border-surface-container-high pt-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-mono font-bold uppercase text-on-surface-variant tracking-wider">
                    {isAdmin ? 'Officer Status Controls' : 'Quick Progress Simulation'}
                  </span>
                  {updating && <span className="text-xs text-primary animate-pulse font-mono">Updating...</span>}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {['Pending', 'Assigned', 'In Progress', 'Collected'].map((st) => (
                    <button
                      key={st}
                      type="button"
                      disabled={updating || report.status.toLowerCase() === st.toLowerCase()}
                      onClick={() => handleStatusChange(st)}
                      className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-all ${
                        report.status.toLowerCase() === st.toLowerCase()
                          ? 'bg-primary text-on-primary border-primary shadow-neon font-bold'
                          : 'bg-surface-container-low text-on-surface border-surface-container-high hover:border-primary/50'
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
