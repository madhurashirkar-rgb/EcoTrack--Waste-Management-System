import React, { useState, useEffect } from 'react';
import {
  Shield,
  Truck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Search,
  RefreshCw,
  Eye,
  MapPin,
  Calendar,
  User,
  FileText,
  X,
  Sparkles,
} from 'lucide-react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';

const STATUS_OPTIONS = ['Pending', 'Assigned', 'In Progress', 'Collected'];

export default function AdminPanel({ onSelectReport }) {
  const { user, logout } = useAuth();
  const [reports, setReports] = useState([]);
  const [stats, setStats] = useState(null);
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const [detailModalReport, setDetailModalReport] = useState(null);
  const [expandedImage, setExpandedImage] = useState(null);

  const [assignCrewInput, setAssignCrewInput] = useState('EcoUnit #04 (Compactor)');
  const [resolutionNotesInput, setResolutionNotesInput] = useState('');

  const fetchAdminData = async () => {
    try {
      setLoading(true);
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
    fetchAdminData();
  }, [statusFilter, user]);

  const handleUpdateStatus = async (reportId, nextStatus, customCrew, customNotes) => {
    try {
      setUpdatingId(reportId);
      await api.admin.updateReportStatus(reportId, {
        status: nextStatus,
        assignedTo:
          customCrew || (nextStatus === 'Assigned' ? 'Rapid Green Response Unit #04' : undefined),
        resolutionNotes: customNotes || `Status updated to ${nextStatus} by Sanitation Officer.`,
      });
      await fetchAdminData();
      if (detailModalReport && detailModalReport.id === reportId) {
        setDetailModalReport((prev) => ({
          ...prev,
          status: nextStatus,
          assignedTo: customCrew || prev.assignedTo,
        }));
      }
    } catch (err) {
      alert(err.message || 'Status update failed.');
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredReports = reports.filter((r) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      (r.id && r.id.toLowerCase().includes(query)) ||
      (r.userName && r.userName.toLowerCase().includes(query)) ||
      (r.location && r.location.toLowerCase().includes(query)) ||
      (r.wasteType && r.wasteType.toLowerCase().includes(query)) ||
      (r.description && r.description.toLowerCase().includes(query))
    );
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-surface-container-lowest rounded-3xl p-6 sm:p-8 relative overflow-hidden custom-shadow-card border border-surface-container-high">
        <div
          aria-hidden="true"
          className="absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none"
        />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-secondary-container rounded-full text-xs font-semibold text-primary mb-2.5 border border-primary/25">
              <Shield className="w-3.5 h-3.5 text-primary" />
              <span>Municipal Sanitation Command Center</span>
            </div>
            <h1 className="heading-3 neon-text-gradient">Admin Operations Dashboard</h1>
            <p className="text-on-surface-variant text-xs sm:text-sm mt-1 max-w-xl">
              Logged in as{' '}
              <strong className="text-primary font-mono">{user?.email || 'admin@ecotrack.org'}</strong>
              . Review and dispatch all citizen-submitted waste reports citywide.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={fetchAdminData}
              className="p-2.5 bg-surface-container-low hover:border-primary/50 text-on-surface rounded-xl border border-surface-container-high transition-colors flex items-center gap-2 text-xs font-semibold"
              title="Refresh reports"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-primary' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
            <button
              type="button"
              onClick={logout}
              className="px-4 py-2.5 bg-error-container text-on-error-container hover:bg-error-container/80 rounded-xl text-xs font-bold transition-all border border-error/25"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Global Statistics Cards */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-6 pt-6 border-t border-surface-container-high">
            <div className="bg-surface-container-low p-4 rounded-2xl border border-surface-container-high">
              <span className="text-[10px] uppercase font-mono font-bold text-on-surface-variant">
                Total Reports
              </span>
              <span className="text-2xl font-mono font-bold text-on-surface block mt-0.5">
                {stats.total}
              </span>
            </div>
            <div className="bg-surface-container-low p-4 rounded-2xl border border-surface-container-high">
              <span className="text-[10px] uppercase font-mono font-bold text-amber-400">
                Pending Review
              </span>
              <span className="text-2xl font-mono font-bold text-amber-400 block mt-0.5">
                {stats.pending}
              </span>
            </div>
            <div className="bg-surface-container-low p-4 rounded-2xl border border-surface-container-high">
              <span className="text-[10px] uppercase font-mono font-bold text-tertiary">
                Assigned / In Transit
              </span>
              <span className="text-2xl font-mono font-bold text-tertiary block mt-0.5">
                {stats.assigned + stats.inProgress}
              </span>
            </div>
            <div className="bg-surface-container-low p-4 rounded-2xl border border-surface-container-high">
              <span className="text-[10px] uppercase font-mono font-bold text-primary">
                Collected &amp; Diverted
              </span>
              <span className="text-2xl font-mono font-bold text-primary block mt-0.5">
                {stats.collected}
              </span>
            </div>
            <div className="bg-surface-container-low p-4 rounded-2xl border border-surface-container-high col-span-2 sm:col-span-1">
              <span className="text-[10px] uppercase font-mono font-bold text-on-surface-variant">
                Active Citizens
              </span>
              <span className="text-2xl font-mono font-bold text-on-surface block mt-0.5">
                {stats.totalUsers || 2}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-surface-container-lowest p-4 sm:p-5 rounded-3xl border border-surface-container-high custom-shadow-card flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-on-surface-variant" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search all reports by ticket ID, citizen name, location, or keyword..."
            className="w-full h-10 pl-10 pr-4 bg-surface-container-low border border-outline-variant rounded-xl text-xs text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/25 transition-all"
          />
        </div>

        {/* Status Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {['All', 'Pending', 'Assigned', 'In Progress', 'Collected'].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStatusFilter(s)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all ${
                statusFilter === s
                  ? 'bg-primary text-on-primary font-bold dark:shadow-[0_0_12px_rgba(0,255,148,0.3)]'
                  : 'bg-surface-container-low text-on-surface-variant hover:text-on-surface border border-surface-container-high'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Reports Table & Card List */}
      <div className="bg-surface-container-lowest rounded-3xl border border-surface-container-high custom-shadow-card overflow-hidden">
        <div className="p-5 border-b border-surface-container-high flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="font-bold text-sm text-on-surface">Citywide Incident Logs</span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-secondary-container text-primary border border-primary/25">
              {filteredReports.length} {filteredReports.length === 1 ? 'record' : 'records'}
            </span>
          </div>
          <span className="text-xs text-on-surface-variant">Click any report to view complete details</span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-xs text-on-surface-variant">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            Loading submitted reports...
          </div>
        ) : filteredReports.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <CheckCircle2 className="w-10 h-10 text-primary mx-auto" />
            <h4 className="text-sm font-bold text-on-surface">No reports matching filter</h4>
            <p className="text-xs text-on-surface-variant">
              All incidents in this category have been processed or none were filed yet.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-surface-container-high">
            {filteredReports.map((report) => {
              const isUpdating = updatingId === report.id;
              const status = report.status || 'Pending';

              let statusBadgeClass =
                'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/50';
              if (status === 'Assigned')
                statusBadgeClass =
                  'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800/50';
              if (status === 'In Progress')
                statusBadgeClass =
                  'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800/50';
              if (status === 'Collected' || status === 'Resolved')
                statusBadgeClass =
                  'bg-secondary-container text-primary border-primary/30';

              return (
                <div key={report.id} className="p-5 hover:bg-surface-container-low/50 transition-colors space-y-3.5">
                  {/* Top row */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-bold text-primary bg-secondary-container px-2.5 py-0.5 rounded-lg border border-primary/25">
                        #{report.id}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${statusBadgeClass}`}>
                        {status}
                      </span>
                      <span className="text-xs font-bold text-on-surface">
                        {report.wasteType || 'General Waste'}
                      </span>
                      {report.urgency && (
                        <span className="text-[10px] uppercase font-bold text-error bg-error-container/40 border border-error/25 px-2 py-0.5 rounded-md">
                          {report.urgency}
                        </span>
                      )}
                    </div>

                    <div className="text-xs font-mono text-on-surface-variant flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{new Date(report.date || report.createdAt || Date.now()).toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Middle row */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
                    <div className="md:col-span-2 space-y-2">
                      <p className="text-xs text-on-surface leading-relaxed font-medium">
                        {report.description || 'No additional notes provided by citizen.'}
                      </p>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-on-surface-variant">
                        <div className="flex items-center gap-1 text-primary">
                          <MapPin className="w-3.5 h-3.5 shrink-0" />
                          <span>{report.location}</span>
                        </div>
                        <div className="flex items-center gap-1 text-on-surface-variant">
                          <User className="w-3.5 h-3.5 shrink-0" />
                          <span>
                            Submitted by: <strong>{report.userName || 'Citizen User'}</strong>
                          </span>
                        </div>
                        {report.assignedTo && (
                          <div className="flex items-center gap-1 text-tertiary bg-tertiary-fixed/40 px-2 py-0.5 rounded-md font-semibold text-[11px] border border-tertiary/25">
                            <Truck className="w-3.5 h-3.5" />
                            <span>Unit: {report.assignedTo}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Image Thumbnail & Actions */}
                    <div className="flex items-center justify-between md:justify-end gap-3">
                      {report.image && (
                        <div
                          onClick={() => setExpandedImage(report.image)}
                          className="relative group cursor-pointer w-16 h-16 rounded-xl overflow-hidden border border-surface-container-high bg-surface-container-low shrink-0"
                          title="Click to view full photo evidence"
                        >
                          <img
                            src={report.image}
                            alt="Evidence thumbnail"
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white">
                            <Eye className="w-4 h-4" />
                          </div>
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={() => setDetailModalReport(report)}
                        className="neon-btn px-4 py-2 rounded-xl border border-primary text-primary hover:bg-primary hover:text-on-primary text-xs font-bold transition-all flex items-center gap-1.5"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Inspect &amp; Dispatch</span>
                      </button>
                    </div>
                  </div>

                  {/* Status Progression Quick Buttons */}
                  <div className="pt-2 flex flex-wrap items-center gap-2 border-t border-surface-container-high/60">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-on-surface-variant mr-1">
                      Quick Status Update:
                    </span>
                    {STATUS_OPTIONS.map((nextStatus) => {
                      const isCurrent = status.toLowerCase() === nextStatus.toLowerCase();
                      return (
                        <button
                          key={nextStatus}
                          type="button"
                          disabled={isCurrent || isUpdating}
                          onClick={() => handleUpdateStatus(report.id, nextStatus)}
                          className={`px-3 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                            isCurrent
                              ? 'bg-surface-container-high text-on-surface-variant cursor-default'
                              : 'bg-surface-container hover:bg-primary hover:text-on-primary text-on-surface'
                          }`}
                        >
                          {isCurrent ? `✓ ${nextStatus}` : `Move to ${nextStatus}`}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* FULL DETAIL & DISPATCH MODAL */}
      {detailModalReport && (
        <div
          data-lenis-prevent
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div className="bg-surface-container-lowest max-w-2xl w-full rounded-3xl custom-shadow-modal border border-surface-container-high p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-surface-container-high pb-4">
              <div className="flex items-center gap-2.5">
                <span className="font-mono text-xs font-bold text-primary bg-secondary-container px-3 py-1 rounded-xl border border-primary/25">
                  #{detailModalReport.id}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-secondary-container text-primary border border-primary/25">
                  {detailModalReport.status}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setDetailModalReport(null)}
                className="p-1 rounded-lg hover:bg-surface-container text-on-surface-variant"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Photo Evidence Large */}
            {detailModalReport.image && (
              <div className="space-y-1">
                <span className="text-xs font-semibold text-on-surface">Photo Evidence Submitted:</span>
                <div
                  onClick={() => setExpandedImage(detailModalReport.image)}
                  className="cursor-pointer rounded-2xl overflow-hidden border border-surface-container-high max-h-64 group relative"
                >
                  <img
                    src={detailModalReport.image}
                    alt="Photo Evidence"
                    className="w-full h-full object-cover max-h-64"
                  />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-xs font-bold">
                    Click to view full image
                  </div>
                </div>
              </div>
            )}

            {/* Comprehensive Detail Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 bg-surface-container-low rounded-2xl border border-surface-container-high space-y-1">
                <span className="text-[11px] font-mono text-on-surface-variant">Incident Category:</span>
                <div className="font-bold text-on-surface text-sm">
                  {detailModalReport.wasteType || 'General Waste'}
                </div>
                <div className="text-[11px] text-on-surface-variant">
                  Urgency: {detailModalReport.urgency || 'Normal'}
                </div>
              </div>

              <div className="p-3.5 bg-surface-container-low rounded-2xl border border-surface-container-high space-y-1">
                <span className="text-[11px] font-mono text-on-surface-variant">Citizen Submitter:</span>
                <div className="font-bold text-on-surface text-sm">
                  {detailModalReport.userName || 'Citizen User'}
                </div>
                <div className="text-[11px] text-on-surface-variant">
                  ID: {detailModalReport.userId || 'usr-1'}
                </div>
              </div>

              <div className="p-3.5 bg-surface-container-low rounded-2xl border border-surface-container-high space-y-1 sm:col-span-2">
                <span className="text-[11px] font-mono text-on-surface-variant">Incident Location:</span>
                <div className="font-bold text-on-surface text-sm flex items-center gap-1.5 text-primary">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{detailModalReport.location}</span>
                </div>
              </div>

              <div className="p-3.5 bg-surface-container-low rounded-2xl border border-surface-container-high space-y-1 sm:col-span-2">
                <span className="text-[11px] font-mono text-on-surface-variant">Full Citizen Description:</span>
                <div className="text-on-surface text-xs leading-relaxed">{detailModalReport.description}</div>
              </div>
            </div>

            {/* Officer Action / Dispatch Controls */}
            <div className="p-5 bg-surface-container-low rounded-3xl border border-surface-container-high space-y-4">
              <span className="text-xs font-bold text-on-surface block uppercase tracking-wider font-mono">
                Officer Dispatch &amp; Resolution Controls
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-on-surface mb-1">
                    Assign Response Team / Truck:
                  </label>
                  <select
                    value={assignCrewInput}
                    onChange={(e) => setAssignCrewInput(e.target.value)}
                    className="w-full h-10 px-3 bg-surface-container-lowest border border-outline-variant rounded-xl text-xs"
                  >
                    <option value="EcoUnit #04 (Compactor)">EcoUnit #04 (Compactor)</option>
                    <option value="Rapid Green Crew Beta">Rapid Green Crew Beta</option>
                    <option value="Special Hazardous Handling Unit">Special Hazardous Handling Unit</option>
                    <option value="BioClean Composting Crew #02">BioClean Composting Crew #02</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-on-surface mb-1">
                    Officer Resolution Notes:
                  </label>
                  <input
                    type="text"
                    value={resolutionNotesInput}
                    onChange={(e) => setResolutionNotesInput(e.target.value)}
                    placeholder="Crew arrived on site, barrels loaded."
                    className="w-full h-10 px-3 bg-surface-container-lowest border border-outline-variant rounded-xl text-xs"
                  />
                </div>
              </div>

              {/* Status Action Buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                <button
                  type="button"
                  onClick={() =>
                    handleUpdateStatus(
                      detailModalReport.id,
                      'Pending',
                      assignCrewInput,
                      resolutionNotesInput
                    )
                  }
                  className="py-2.5 px-3 rounded-xl text-xs font-bold bg-amber-100 text-amber-900 hover:bg-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border dark:border-amber-800/60 transition-colors"
                >
                  Set Pending
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handleUpdateStatus(
                      detailModalReport.id,
                      'Assigned',
                      assignCrewInput,
                      resolutionNotesInput
                    )
                  }
                  className="py-2.5 px-3 rounded-xl text-xs font-bold bg-blue-100 text-blue-900 hover:bg-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border dark:border-blue-800/60 transition-colors"
                >
                  Assign Crew
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handleUpdateStatus(
                      detailModalReport.id,
                      'In Progress',
                      assignCrewInput,
                      resolutionNotesInput
                    )
                  }
                  className="py-2.5 px-3 rounded-xl text-xs font-bold bg-purple-100 text-purple-900 hover:bg-purple-200 dark:bg-purple-950/60 dark:text-purple-300 dark:border dark:border-purple-800/60 transition-colors"
                >
                  Set In Progress
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handleUpdateStatus(
                      detailModalReport.id,
                      'Collected',
                      assignCrewInput,
                      resolutionNotesInput
                    )
                  }
                  className="neon-btn neon-btn-primary py-2.5 px-3 rounded-xl text-xs font-bold bg-primary text-on-primary hover:bg-primary-container"
                >
                  Mark Collected
                </button>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setDetailModalReport(null)}
                className="px-5 py-2.5 bg-surface-container hover:bg-surface-container-high rounded-xl text-xs font-bold text-on-surface transition-colors"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Full Photo Evidence Zoom Modal */}
      {expandedImage && (
        <div
          onClick={() => setExpandedImage(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <img
              src={expandedImage}
              alt="Full size evidence"
              className="max-w-full max-h-[85vh] rounded-2xl shadow-2xl object-contain"
            />
            <button
              type="button"
              onClick={() => setExpandedImage(null)}
              className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full backdrop-blur-md transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
