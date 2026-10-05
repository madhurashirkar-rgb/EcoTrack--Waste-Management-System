import React, { useState, useEffect } from 'react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function Dashboard({ setActiveTab, onSelectReport }) {
  const { user, isAdmin } = useAuth();
  const [stats, setStats] = useState(null);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [statsRes, reportsRes] = await Promise.all([
          api.dashboard.getStats(),
          api.reports.getAll()
        ]);
        setStats(statsRes.data);
        setReports(reportsRes.data || []);
      } catch (err) {
        console.error('Dashboard data fetch error:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [user]);

  const userName = user?.name ? user.name.split(' ')[0] : (isAdmin ? 'Admin' : 'Alex');
  const ecoPoints = user?.ecoPoints ?? stats?.ecoPoints ?? 340;
  const reportsCount = stats?.reportsSubmitted ?? (reports.length > 0 ? reports.length : 12);
  const wasteCollected = stats?.wasteCollected ?? 84;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 1. Greeting Banner */}
      <div className="bg-surface-container-lowest rounded-xl p-6 sm:p-8 custom-shadow-card border border-surface-container-high flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="relative z-10 space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            <span>{isAdmin ? 'Municipal Command Center: Sector 7 – River North' : 'Operational Area: Sector 7 – River North'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">
            {isAdmin ? `Sanitation Command Center 🛡️` : `Good morning, ${userName}! 🌿`}
          </h1>
          <p className="text-on-surface-variant text-sm sm:text-base leading-relaxed">
            {isAdmin
              ? 'Real-time overview of citywide municipal collection drives, diverted tonnages, and operational dispatch clearance.'
              : "Let's make our city cleaner today. Monitor local community collection drives or file a 60-second waste report."}
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap gap-3">
          {isAdmin ? (
            <button 
              onClick={() => setActiveTab('admin')}
              className="bg-primary text-on-primary px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-primary-container transition-all flex items-center gap-2 shadow-xs hover:-translate-y-0.5 active:translate-y-0"
            >
              <span className="material-symbols-outlined text-lg">shield</span>
              <span>Review Reports & Dispatch</span>
            </button>
          ) : (
            <button 
              onClick={() => setActiveTab('report')}
              className="bg-primary text-on-primary px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-primary-container transition-all flex items-center gap-2 shadow-xs hover:-translate-y-0.5 active:translate-y-0"
            >
              <span className="material-symbols-outlined text-lg">add_circle</span>
              <span>Report Waste</span>
            </button>
          )}
          <button 
            onClick={() => setActiveTab('collection-points')}
            className="bg-surface-container-lowest text-primary border border-secondary-fixed-dim px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-surface-container-low transition-all flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-lg">near_me</span>
            <span>Nearby Hubs</span>
          </button>
        </div>
      </div>

      {/* 2. High-Level Metric Tiles (Operational & Personal) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Metric 1 */}
        <div className="bg-surface-container-lowest rounded-xl p-5 custom-shadow-card border border-surface-container-high flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs text-on-surface-variant font-medium">Waste Reports</span>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-secondary-container text-on-secondary-container">
              Submitted
            </span>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-on-surface">{reportsCount}</span>
            <span className="text-xs text-primary font-semibold">+3 this month</span>
          </div>
          <div className="mt-2 text-xs text-on-surface-variant">100% verified by field dispatch</div>
        </div>

        {/* Metric 2 */}
        <div className="bg-surface-container-lowest rounded-xl p-5 custom-shadow-card border border-surface-container-high flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs text-on-surface-variant font-medium">Recycled Materials</span>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-secondary-container text-on-secondary-container">
              Diverted
            </span>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-on-surface">{wasteCollected}</span>
            <span className="text-sm text-on-surface font-semibold">kg</span>
            <span className="text-xs text-primary font-semibold">↑ 18.2%</span>
          </div>
          <div className="mt-2 text-xs text-on-surface-variant">Prevented 142 kg CO₂e emissions</div>
        </div>

        {/* Metric 3 */}
        <div className="bg-surface-container-lowest rounded-xl p-5 custom-shadow-card border border-surface-container-high flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs text-on-surface-variant font-medium">EcoPoints Balance</span>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-tertiary-fixed text-on-tertiary-fixed-variant">
              Redeemable
            </span>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-primary">{ecoPoints}</span>
            <span className="text-xs text-on-surface-variant font-semibold">pts</span>
          </div>
          <div className="mt-2 text-xs text-on-surface-variant">60 pts to reach Transit Pass reward</div>
        </div>

        {/* Metric 4 */}
        <div className="bg-surface-container-lowest rounded-xl p-5 custom-shadow-card border border-surface-container-high flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs text-on-surface-variant font-medium">Citizen Ranking</span>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-secondary-container text-primary">
              Top 5%
            </span>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-xl font-bold text-on-surface">Level 3</span>
            <span className="text-xs text-on-surface-variant">Eco Citizen</span>
          </div>
          <div className="mt-2 text-xs text-on-surface-variant">Next tier unlocks Priority Review</div>
        </div>
      </div>

      {/* 3. Quick Action Cards */}
      <div>
        <h2 className="text-base font-bold text-on-surface mb-3">Quick Operational Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {!isAdmin ? (
            /* Quick Action 1 for Citizen: Report Waste */
            <div 
              onClick={() => setActiveTab('report')}
              className="group bg-surface-container-lowest rounded-xl p-5 border border-surface-container-high custom-shadow-card hover:border-primary cursor-pointer transition-all duration-200 hover:-translate-y-1"
            >
              <div className="w-12 h-12 rounded-lg bg-secondary-container text-primary flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-2xl">photo_camera</span>
              </div>
              <h3 className="text-sm font-semibold text-on-surface flex items-center justify-between">
                Report Waste
                <span className="material-symbols-outlined text-sm text-on-surface-variant group-hover:text-primary group-hover:translate-x-1 transition-all">
                  arrow_forward
                </span>
              </h3>
              <p className="mt-2 text-on-surface-variant text-xs">
                Spot illegal dumping or overflowing bins? File an alert in 60s.
              </p>
              <div className="mt-4 pt-3 border-t border-surface-container-high flex items-center justify-between">
                <span className="text-xs font-semibold text-primary">Earn +25 Pts</span>
                <span className="text-[11px] text-on-surface-variant">Instant GPS Sync</span>
              </div>
            </div>
          ) : (
            /* Quick Action 1 for Admin: Incident Dispatch (No Report Waste) */
            <div 
              onClick={() => setActiveTab('admin')}
              className="group bg-surface-container-lowest rounded-xl p-5 border border-surface-container-high custom-shadow-card hover:border-primary cursor-pointer transition-all duration-200 hover:-translate-y-1"
            >
              <div className="w-12 h-12 rounded-lg bg-secondary-container text-primary flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-2xl">shield</span>
              </div>
              <h3 className="text-sm font-semibold text-on-surface flex items-center justify-between">
                Citywide Reports & Dispatch
                <span className="material-symbols-outlined text-sm text-on-surface-variant group-hover:text-primary group-hover:translate-x-1 transition-all">
                  arrow_forward
                </span>
              </h3>
              <p className="mt-2 text-on-surface-variant text-xs">
                Review submitted citizen incidents and dispatch sanitation trucks.
              </p>
              <div className="mt-4 pt-3 border-t border-surface-container-high flex items-center justify-between">
                <span className="text-xs font-semibold text-primary">Command Center</span>
                <span className="text-[11px] text-on-surface-variant">Live audit trail</span>
              </div>
            </div>
          )}

          {/* Quick Action 2: Collection Points */}
          <div 
            onClick={() => setActiveTab('collection-points')}
            className="group bg-surface-container-lowest rounded-xl p-5 border border-surface-container-high custom-shadow-card hover:border-primary cursor-pointer transition-all duration-200 hover:-translate-y-1"
          >
            <div className="w-12 h-12 rounded-lg bg-surface-container-high text-tertiary flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-2xl">location_on</span>
            </div>
            <h3 className="text-sm font-semibold text-on-surface flex items-center justify-between">
              Collection Points
              <span className="material-symbols-outlined text-sm text-on-surface-variant group-hover:text-primary group-hover:translate-x-1 transition-all">
                arrow_forward
              </span>
            </h3>
            <p className="mt-2 text-on-surface-variant text-xs">
              Find nearby recycling centers, bulk item depots & e-waste hubs.
            </p>
            <div className="mt-4 pt-3 border-t border-surface-container-high flex items-center justify-between">
              <span className="text-xs font-semibold text-tertiary">14 nearby</span>
              <span className="text-[11px] text-on-surface-variant">Filter by waste</span>
            </div>
          </div>

          {/* Quick Action 3 */}
          {!isAdmin ? (
            <div 
              onClick={() => setActiveTab('my-reports')}
              className="group bg-surface-container-lowest rounded-xl p-5 border border-surface-container-high custom-shadow-card hover:border-primary cursor-pointer transition-all duration-200 hover:-translate-y-1"
            >
              <div className="w-12 h-12 rounded-lg bg-surface-variant text-on-surface flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-2xl">assignment</span>
              </div>
              <h3 className="text-sm font-semibold text-on-surface flex items-center justify-between">
                My Reports
                <span className="material-symbols-outlined text-sm text-on-surface-variant group-hover:text-primary group-hover:translate-x-1 transition-all">
                  arrow_forward
                </span>
              </h3>
              <p className="mt-2 text-on-surface-variant text-xs">
                Track real-time cleanup dispatch and verified municipal clearance.
              </p>
              <div className="mt-4 pt-3 border-t border-surface-container-high flex items-center justify-between">
                <span className="text-xs font-semibold text-on-secondary-container">2 in progress</span>
                <span className="text-[11px] text-on-surface-variant">Live stepper</span>
              </div>
            </div>
          ) : (
            <div 
              onClick={() => setActiveTab('collection-points')}
              className="group bg-surface-container-lowest rounded-xl p-5 border border-surface-container-high custom-shadow-card hover:border-primary cursor-pointer transition-all duration-200 hover:-translate-y-1"
            >
              <div className="w-12 h-12 rounded-lg bg-surface-variant text-on-surface flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-2xl">recycling</span>
              </div>
              <h3 className="text-sm font-semibold text-on-surface flex items-center justify-between">
                Municipal Depots
                <span className="material-symbols-outlined text-sm text-on-surface-variant group-hover:text-primary group-hover:translate-x-1 transition-all">
                  arrow_forward
                </span>
              </h3>
              <p className="mt-2 text-on-surface-variant text-xs">
                Inspect waste collection capacities, smart bins, and depot locations.
              </p>
              <div className="mt-4 pt-3 border-t border-surface-container-high flex items-center justify-between">
                <span className="text-xs font-semibold text-on-secondary-container">Interactive Map</span>
                <span className="text-[11px] text-on-surface-variant">Live operational sync</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 4. Live Environmental Pulse & Recent Feed Grid */}
      <div className={`grid grid-cols-1 ${!isAdmin ? 'lg:grid-cols-3' : ''} gap-6`}>
        {/* Live Municipal Clearance Feed */}
        <div className={`${!isAdmin ? 'lg:col-span-2' : 'col-span-full'} bg-surface-container-lowest rounded-xl p-6 custom-shadow-card border border-surface-container-high`}>
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-surface-container-high">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-xl">bolt</span>
              <h3 className="text-sm font-bold text-on-surface">Live Municipal Clearance Feed</h3>
            </div>
            <span className="text-xs font-medium text-on-surface-variant">Updated live</span>
          </div>
          <div className="space-y-3">
            <div className="flex items-start gap-4 p-3 rounded-lg bg-surface-container-low hover:bg-surface-container transition-colors">
              <div className="w-10 h-10 rounded-full bg-secondary-container text-primary flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-lg">check_circle</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-on-surface">Bulk E-Waste Collected</h4>
                  <span className="text-[11px] text-on-surface-variant">12 min ago</span>
                </div>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  Municipal Crew #04 resolved incident at Oakwood Blvd. 48kg components diverted to certified smelting.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-3 rounded-lg bg-surface-container-low hover:bg-surface-container transition-colors">
              <div className="w-10 h-10 rounded-full bg-tertiary-fixed text-tertiary flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-lg">local_shipping</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-on-surface">Routing Optimization Applied</h4>
                  <span className="text-[11px] text-on-surface-variant">34 min ago</span>
                </div>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  Automated dispatch re-routed Compactor 12 to 5th Street Alley to prevent sidewalk bottleneck.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-3 rounded-lg bg-surface-container-low hover:bg-surface-container transition-colors">
              <div className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-lg">recycling</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-on-surface">Smart Compactor 80% Threshold</h4>
                  <span className="text-[11px] text-on-surface-variant">1 hr ago</span>
                </div>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  Central Park Ave sensor triggered proactive pickup ticket before overflow occurred.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Weekly Impact Card - ONLY shown for non-admin citizens */}
        {!isAdmin && (
          <div className="bg-surface-container-lowest rounded-xl p-6 custom-shadow-card border border-surface-container-high flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-on-surface">Your Impact Goal</h3>
                <span className="material-symbols-outlined text-primary text-xl">eco</span>
              </div>
              <p className="text-xs text-on-surface-variant">
                You are 16 kg away from diverting 100 kg this quarter!
              </p>
              {/* Progress Bar */}
              <div className="mt-4 space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-on-surface">84 kg Diverted</span>
                  <span className="text-primary font-bold">84%</span>
                </div>
                <div className="w-full bg-surface-container-high h-2.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-primary h-full rounded-full transition-all duration-500" 
                    style={{ width: '84%' }}
                  />
                </div>
              </div>

              <div className="mt-6 p-3 bg-secondary-container/70 rounded-lg space-y-1 border border-secondary-fixed-dim">
                <div className="text-xs font-bold text-on-secondary-container">Community Benchmark</div>
                <div className="text-xs text-on-secondary-variant">
                  Your neighborhood diverted 4.2 tons of plastic this week, ranking 2nd in the district!
                </div>
              </div>
            </div>

            <button 
              onClick={() => setActiveTab('my-reports')}
              className="mt-6 w-full text-center py-2.5 rounded-lg border border-primary text-primary text-xs font-bold hover:bg-surface-container-low transition-colors"
            >
              View My Activity Log
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
