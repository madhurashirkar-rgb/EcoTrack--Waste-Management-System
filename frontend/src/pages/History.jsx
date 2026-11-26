import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import {
  Truck,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  FileText,
  Calendar,
} from 'lucide-react';
import api from '../api/client';

export default function History({ setActiveTab, onSelectReport }) {
  const [filter, setFilter] = useState('all');
  const [reports, setReports] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    async function loadReports() {
      try {
        const res = await api.reports.getAll();
        if (!mounted) return;
        const list = Array.isArray(res?.data) ? res.data : [];
        const formatted = list.map((r, i) => {
          const stLower = (r.status || 'Pending').toLowerCase();
          const isResolved = stLower === 'collected' || stLower === 'resolved';
          return {
            id: r.id || `rep-${800 + i}`,
            title: r.wasteType ? `${r.wasteType} Incident` : 'Municipal Waste Report',
            status: r.status || 'Pending',
            statusCategory: isResolved ? 'resolved' : 'active',
            badgeColor: isResolved
              ? 'bg-secondary-container text-primary border-primary/25'
              : stLower === 'in progress' || stLower === 'assigned'
              ? 'bg-tertiary-fixed text-tertiary border-tertiary/25'
              : 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/50',
            location: r.location || 'Municipal Sector 7',
            reportedAt: r.date || r.createdAt
              ? new Date(r.date || r.createdAt).toLocaleDateString([], {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })
              : 'Recent',
            assignedUnit: r.assignedTo || 'Pending Crew Assignment',
            estimatedQuantity: r.description || 'Municipal waste incident logged by citizen.',
            estimatedResolution: isResolved
              ? 'Completed & Verified'
              : stLower === 'in progress'
              ? 'Crew Active On Site'
              : 'Queued for Next Dispatch',
            rewardPoints: isResolved ? '+25 EcoPoints credited' : '+25 EcoPoints on clearance',
            step: isResolved
              ? 4
              : stLower === 'in progress'
              ? 3
              : stLower === 'assigned'
              ? 2
              : 1,
          };
        });
        setReports(formatted);
        if (formatted.length > 0) setSelectedTicket(formatted[0]);
      } catch (err) {
        console.error('History load error:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadReports();
    return () => {
      mounted = false;
    };
  }, []);

  useGSAP(
    () => {
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReduced) return;

      gsap.fromTo(
        '.ticket-item',
        { y: 12 },
        {
          y: 0,
          duration: 0.4,
          stagger: 0.05,
          ease: 'power3.out',
        }
      );
    },
    { scope: containerRef, dependencies: [filter] }
  );

  const activeReportsCount = reports.filter((r) => r.statusCategory === 'active').length;
  const resolvedReportsCount = reports.filter((r) => r.statusCategory === 'resolved').length;

  const filteredReports = reports.filter((r) => {
    if (filter === 'all') return true;
    return r.statusCategory === filter;
  });

  const spotlight = selectedTicket || filteredReports[0] || reports[0] || null;

  return (
    <div ref={containerRef} className="space-y-6">
      {/* Header & Status Filter Pills */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="heading-5 text-on-surface">My Reported Incidents</h1>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Audit trail of municipal pickup dispatches and verified clearances.
          </p>
        </div>

        <div className="bg-surface-container-low border border-surface-container-high rounded-xl p-1 inline-flex self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filter === 'all'
                ? 'bg-surface-container-lowest text-primary border border-primary/30 shadow-card'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            All Reports ({reports.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('active')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filter === 'active'
                ? 'bg-surface-container-lowest text-primary border border-primary/30 shadow-card'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Active ({activeReportsCount})
          </button>
          <button
            type="button"
            onClick={() => setFilter('resolved')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filter === 'resolved'
                ? 'bg-surface-container-lowest text-primary border border-primary/30 shadow-card'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Resolved ({resolvedReportsCount})
          </button>
        </div>
      </div>

      {loading ? (
        <div className="bg-surface-container-lowest rounded-3xl p-10 border border-surface-container-high text-center text-xs text-on-surface-variant">
          Loading your report history...
        </div>
      ) : reports.length === 0 ? (
        <div className="bg-surface-container-lowest rounded-3xl p-10 border border-surface-container-high text-center space-y-4">
          <h2 className="title-2 text-on-surface">No waste reports filed yet</h2>
          <p className="text-xs text-on-surface-variant max-w-md mx-auto">
            Submit your first incident report to track crew dispatch in real time and earn +25 EcoPoints.
          </p>
          <button
            type="button"
            onClick={() => setActiveTab('report')}
            className="neon-btn neon-btn-primary px-5 py-2.5 rounded-xl bg-primary text-on-primary text-xs font-bold"
          >
            Report Waste Now
          </button>
        </div>
      ) : (
        <>
          {/* Spotlight Stepper Tracker */}
          {spotlight && (
            <div className="bg-surface-container-lowest/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 custom-shadow-card border border-surface-container-high space-y-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-surface-container-high">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-tertiary-fixed border border-tertiary/25 text-tertiary flex items-center justify-center shrink-0">
                    <Truck className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-primary">#{spotlight.id}</span>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${spotlight.badgeColor}`}>
                        {spotlight.status}
                      </span>
                    </div>
                    <h2 className="title-2 text-on-surface mt-0.5">{spotlight.title}</h2>
                    <p className="text-xs text-on-surface-variant mt-0.5 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>
                        Reported {spotlight.reportedAt} • {spotlight.location}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-left lg:text-right">
                    <div className="text-[11px] font-mono text-on-surface-variant">Assigned Unit</div>
                    <div className="text-xs font-bold text-on-surface">{spotlight.assignedUnit}</div>
                  </div>
                  {onSelectReport && (
                    <button
                      type="button"
                      onClick={() => onSelectReport(spotlight.id)}
                      className="neon-btn px-3.5 py-2 rounded-xl bg-surface-container-low border border-surface-container-high hover:border-primary/50 text-xs font-semibold text-primary flex items-center gap-1.5"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Full Details</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Stepper Indicator */}
              <div className="py-2">
                <div className="text-[11px] font-mono font-bold text-on-surface-variant uppercase tracking-wider mb-4">
                  Incident Progress Lifecycle
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { num: 1, label: 'Step 1: Submitted', sub: 'Logged in queue' },
                    { num: 2, label: 'Step 2: Assigned', sub: 'Sanitation crew routed' },
                    { num: 3, label: 'Step 3: In Progress', sub: 'Crew active on site' },
                    { num: 4, label: 'Step 4: Collected', sub: 'Area cleared & verified' },
                  ].map((s) => {
                    const isDone = spotlight.step > s.num || (s.num === 4 && spotlight.step === 4);
                    const isCurrent = spotlight.step === s.num && s.num !== 4;
                    const isReached = spotlight.step >= s.num;

                    return (
                      <div
                        key={s.num}
                        className={`flex items-center md:flex-col md:items-start gap-3 p-3.5 rounded-2xl border transition-all ${
                          isCurrent || (s.num === 4 && spotlight.step === 4)
                            ? 'bg-secondary-container border-primary text-primary font-bold dark:shadow-[0_0_12px_rgba(0,255,148,0.18)]'
                            : isReached
                            ? 'bg-surface-container-low border-surface-container-high'
                            : 'bg-surface-container-low/40 border-surface-container-high opacity-55'
                        }`}
                      >
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                            isCurrent
                              ? 'bg-primary text-on-primary animate-pulse'
                              : isDone || isReached
                              ? 'bg-primary text-on-primary'
                              : 'bg-surface-container-high text-on-surface-variant'
                          }`}
                        >
                          {isDone || (isReached && !isCurrent) ? '✓' : s.num}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-on-surface">{s.label}</div>
                          <div className="text-[11px] font-mono text-on-surface-variant">{s.sub}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Incident Metadata */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-3.5 bg-surface-container-low rounded-2xl border border-surface-container-high">
                  <span className="text-[11px] font-mono uppercase text-on-surface-variant">Report Summary</span>
                  <div className="text-xs font-bold text-on-surface mt-1 line-clamp-2">
                    {spotlight.estimatedQuantity}
                  </div>
                </div>
                <div className="p-3.5 bg-surface-container-low rounded-2xl border border-surface-container-high">
                  <span className="text-[11px] font-mono uppercase text-on-surface-variant">Dispatch Status</span>
                  <div className="text-xs font-bold text-on-surface mt-1">{spotlight.estimatedResolution}</div>
                </div>
                <div className="p-3.5 bg-surface-container-low rounded-2xl border border-surface-container-high">
                  <span className="text-[11px] font-mono uppercase text-on-surface-variant">Reward Points</span>
                  <div className="text-xs font-bold text-primary mt-1 font-mono">{spotlight.rewardPoints}</div>
                </div>
              </div>
            </div>
          )}

          {/* Historical Incident List */}
          <div className="space-y-3">
            {filteredReports.map((report) => (
              <div
                key={report.id}
                onClick={() => setSelectedTicket(report)}
                className={`ticket-item bg-surface-container-lowest/95 backdrop-blur-md rounded-2xl p-5 border cursor-pointer transition-all duration-300 custom-shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  spotlight?.id === report.id
                    ? 'border-primary ring-1 ring-primary/30 dark:shadow-[0_0_14px_rgba(0,255,148,0.15)]'
                    : 'border-surface-container-high hover:border-primary/50'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                      report.statusCategory === 'resolved'
                        ? 'bg-secondary-container border-primary/25 text-primary'
                        : 'bg-error-container border-error/25 text-on-error-container'
                    }`}
                  >
                    {report.statusCategory === 'resolved' ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <Clock className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xs font-bold text-on-surface">{report.title}</h3>
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${report.badgeColor}`}>
                        {report.status}
                      </span>
                    </div>
                    <p className="text-xs text-on-surface-variant mt-1">
                      {report.location} • Reported {report.reportedAt}
                    </p>
                  </div>
                </div>

                <div className="self-end sm:self-center flex items-center gap-3">
                  {report.statusCategory === 'resolved' ? (
                    <span className="text-xs font-semibold text-primary flex items-center gap-1 font-mono">
                      <ShieldCheck className="w-4 h-4" />
                      <span>Audited &amp; Diverted</span>
                    </span>
                  ) : (
                    <span className="text-xs font-semibold text-primary flex items-center gap-1 hover:underline">
                      <span>View Live Stepper</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
