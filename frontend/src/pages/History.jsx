import React, { useState, useEffect } from 'react';
import api from '../api/client';

export default function History({ setActiveTab, onSelectReport }) {
  const [filter, setFilter] = useState('all');
  const [reports, setReports] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);

  const defaultReports = [
    {
      id: 'EC-2024-884',
      title: 'Illegal Plastic Dumping',
      status: 'In Progress',
      statusCategory: 'active',
      badgeColor: 'bg-tertiary-fixed text-on-tertiary-fixed-variant',
      location: '5th St Alley (Coordinates: 40.7142° N, 74.0044° W)',
      reportedAt: 'Yesterday at 3:15 PM',
      assignedUnit: 'EcoUnit #04 (Compactor)',
      estimatedQuantity: '~120 kg discarded plastic crates',
      estimatedResolution: 'Today at 2:30 PM',
      rewardPoints: '+25 EcoPoints on clearance',
      step: 3
    },
    {
      id: 'EC-2024-912',
      title: 'Overflowing Public Bin',
      status: 'Pending Review',
      statusCategory: 'active',
      badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/50',
      location: 'Central Park Ave, near West Pavilion',
      reportedAt: '2 hours ago',
      assignedUnit: 'Pending Dispatch Assignment',
      estimatedQuantity: '~35 kg dry containers',
      estimatedResolution: 'Today within 4 hrs',
      rewardPoints: '+20 EcoPoints on clearance',
      step: 1
    },
    {
      id: 'EC-2024-803',
      title: 'Discarded Electronics & Small Appliances',
      status: 'Resolved / Cleared',
      statusCategory: 'resolved',
      badgeColor: 'bg-secondary-container text-on-secondary-container',
      location: 'Oakwood Blvd & 12th St',
      reportedAt: '3 days ago',
      assignedUnit: 'Rapid Green Crew Beta',
      estimatedQuantity: '48 kg components diverted to certified smelting',
      estimatedResolution: 'Completed',
      rewardPoints: '+30 points awarded to balance',
      step: 4
    }
  ];

  useEffect(() => {
    async function loadReports() {
      try {
        const res = await api.reports.getAll();
        if (res.data && res.data.length > 0) {
          const merged = res.data.map((r, i) => ({
            id: r.id || `EC-2024-${800 + i}`,
            title: r.wasteType ? `${r.wasteType} Waste Incident` : 'Municipal Waste Report',
            status: r.status || 'In Progress',
            statusCategory: r.status === 'Collected' || r.status === 'Resolved' ? 'resolved' : 'active',
            badgeColor: r.status === 'Collected' ? 'bg-secondary-container text-on-secondary-container' : 'bg-tertiary-fixed text-on-tertiary-fixed-variant',
            location: r.location || 'Municipal Sector 7',
            reportedAt: r.createdAt ? new Date(r.createdAt).toLocaleDateString() : 'Recent',
            assignedUnit: r.assignedTo || 'EcoUnit #04 (Compactor)',
            estimatedQuantity: r.description || '~60 kg recyclables',
            estimatedResolution: r.status === 'Collected' ? 'Completed' : 'Today',
            rewardPoints: '+25 EcoPoints',
            step: r.status === 'Collected' ? 4 : r.status === 'In Progress' ? 3 : r.status === 'Assigned' ? 2 : 1
          }));
          setReports(merged);
          setSelectedTicket(merged[0]);
        } else {
          setReports(defaultReports);
          setSelectedTicket(defaultReports[0]);
        }
      } catch {
        setReports(defaultReports);
        setSelectedTicket(defaultReports[0]);
      }
    }
    loadReports();
  }, []);

  const activeReportsCount = reports.filter(r => r.statusCategory === 'active').length;
  const resolvedReportsCount = reports.filter(r => r.statusCategory === 'resolved').length;

  const filteredReports = reports.filter(r => {
    if (filter === 'all') return true;
    return r.statusCategory === filter;
  });

  const spotlight = selectedTicket || reports[0] || defaultReports[0];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header & Status Filter Pills */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-on-surface">My Reported Incidents</h2>
          <p className="text-xs text-on-surface-variant">Audit trail of verified municipal pickup dispatches</p>
        </div>

        <div className="bg-surface-container rounded-lg p-1 inline-flex self-start sm:self-auto">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-1.5 rounded-md text-xs transition-all ${
              filter === 'all'
                ? 'font-semibold bg-surface-container-lowest text-on-surface shadow-xs'
                : 'font-medium text-on-surface-variant hover:text-on-surface'
            }`}
          >
            All Reports ({reports.length})
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-4 py-1.5 rounded-md text-xs transition-all ${
              filter === 'active'
                ? 'font-semibold bg-surface-container-lowest text-on-surface shadow-xs'
                : 'font-medium text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Active ({activeReportsCount})
          </button>
          <button
            onClick={() => setFilter('resolved')}
            className={`px-4 py-1.5 rounded-md text-xs transition-all ${
              filter === 'resolved'
                ? 'font-semibold bg-surface-container-lowest text-on-surface shadow-xs'
                : 'font-medium text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Resolved ({resolvedReportsCount})
          </button>
        </div>
      </div>

      {/* Spotlight Stepper Tracker */}
      {spotlight && (
        <div className="bg-surface-container-lowest rounded-xl p-6 custom-shadow-card border border-surface-container-high space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-surface-container-high">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-tertiary-fixed text-tertiary flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-2xl">local_shipping</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-on-surface-variant">#{spotlight.id}</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${spotlight.badgeColor}`}>
                    {spotlight.status}
                  </span>
                </div>
                <h3 className="text-base font-bold text-on-surface mt-0.5">{spotlight.title}</h3>
                <p className="text-xs text-on-surface-variant">
                  Reported {spotlight.reportedAt} • {spotlight.location}
                </p>
              </div>
            </div>

            <div className="text-left lg:text-right">
              <div className="text-[11px] text-on-surface-variant">Assigned Unit</div>
              <div className="text-xs font-bold text-on-surface">{spotlight.assignedUnit}</div>
            </div>
          </div>

          {/* Stepper Indicator */}
          <div className="py-2">
            <div className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-4">
              Incident Progress Status
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {/* Step 1 */}
              <div className={`flex items-center md:flex-col md:items-start gap-3 p-3 rounded-lg border ${
                spotlight.step >= 1 
                  ? 'bg-surface-container-low border-surface-container-high' 
                  : 'bg-surface-container-low/50 opacity-60'
              }`}>
                <div className="w-7 h-7 rounded-full bg-primary text-on-primary flex items-center justify-center text-xs font-bold shrink-0">
                  ✓
                </div>
                <div>
                  <div className="text-xs font-bold text-on-surface">Step 1: Submitted</div>
                  <div className="text-[11px] text-on-surface-variant">Verified timestamp</div>
                </div>
              </div>

              {/* Step 2 */}
              <div className={`flex items-center md:flex-col md:items-start gap-3 p-3 rounded-lg border ${
                spotlight.step >= 2 
                  ? 'bg-surface-container-low border-surface-container-high' 
                  : 'bg-surface-container-low/50 opacity-60'
              }`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                  spotlight.step >= 2 ? 'bg-primary text-on-primary' : 'bg-surface-variant text-on-surface-variant'
                }`}>
                  {spotlight.step >= 2 ? '✓' : '2'}
                </div>
                <div>
                  <div className="text-xs font-bold text-on-surface">Step 2: Verified</div>
                  <div className="text-[11px] text-on-surface-variant">AI image audit passed</div>
                </div>
              </div>

              {/* Step 3 */}
              <div className={`flex items-center md:flex-col md:items-start gap-3 p-3 rounded-lg border ${
                spotlight.step === 3 
                  ? 'bg-secondary-container border-primary text-on-secondary-container' 
                  : spotlight.step > 3 
                    ? 'bg-surface-container-low border-surface-container-high' 
                    : 'bg-surface-container-low/50 opacity-60'
              }`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                  spotlight.step === 3 ? 'bg-primary text-on-primary animate-pulse' : spotlight.step > 3 ? 'bg-primary text-on-primary' : 'bg-surface-variant text-on-surface-variant'
                }`}>
                  {spotlight.step > 3 ? '✓' : '3'}
                </div>
                <div>
                  <div className="text-xs font-bold text-on-surface">Step 3: Crew Dispatched</div>
                  <div className="text-[11px] font-semibold text-primary">ETA: ~45 mins</div>
                </div>
              </div>

              {/* Step 4 */}
              <div className={`flex items-center md:flex-col md:items-start gap-3 p-3 rounded-lg border ${
                spotlight.step === 4 
                  ? 'bg-secondary-container border-primary text-on-secondary-container' 
                  : 'bg-surface-container-low/50 opacity-60'
              }`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                  spotlight.step === 4 ? 'bg-primary text-on-primary' : 'bg-surface-variant text-on-surface-variant'
                }`}>
                  {spotlight.step === 4 ? '✓' : '4'}
                </div>
                <div>
                  <div className="text-xs font-bold text-on-surface">Step 4: Cleaned & Diverted</div>
                  <div className="text-[11px] text-on-surface-variant">Resolution confirmation</div>
                </div>
              </div>
            </div>
          </div>

          {/* Incident Metadata */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-3 bg-surface-container-low rounded-lg">
              <span className="text-[11px] text-on-surface-variant">Estimated Quantity</span>
              <div className="text-xs font-bold text-on-surface mt-1">{spotlight.estimatedQuantity}</div>
            </div>
            <div className="p-3 bg-surface-container-low rounded-lg">
              <span className="text-[11px] text-on-surface-variant">Estimated Resolution</span>
              <div className="text-xs font-bold text-on-surface mt-1">{spotlight.estimatedResolution}</div>
            </div>
            <div className="p-3 bg-surface-container-low rounded-lg">
              <span className="text-[11px] text-on-surface-variant">Reward Points Pending</span>
              <div className="text-xs font-bold text-primary mt-1">{spotlight.rewardPoints}</div>
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
            className={`bg-surface-container-lowest rounded-xl p-5 border cursor-pointer transition-all duration-200 custom-shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
              spotlight?.id === report.id ? 'border-primary ring-1 ring-primary/20' : 'border-surface-container-high hover:border-primary/50'
            }`}
          >
            <div className="flex items-start gap-4">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                report.statusCategory === 'resolved' 
                  ? 'bg-secondary-container text-primary' 
                  : 'bg-error-container text-on-error-container'
              }`}>
                <span className="material-symbols-outlined text-xl">
                  {report.statusCategory === 'resolved' ? 'check_circle' : 'warning'}
                </span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-on-surface">{report.title}</h4>
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${report.badgeColor}`}>
                    {report.status}
                  </span>
                </div>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  {report.location} • Reported {report.reportedAt}
                </p>
              </div>
            </div>

            <div className="self-end sm:self-center">
              {report.statusCategory === 'resolved' ? (
                <span className="text-xs font-bold text-secondary flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm text-primary">verified</span>
                  <span>Audited & Diverted</span>
                </span>
              ) : (
                <button className="text-xs font-bold text-primary hover:underline">
                  View Live Stepper →
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
