/**
 * 🎨 Stitch Component Reference
 * Use this as a template for your components inside Stitch.
 */
import React, { useState, useEffect } from 'react';
import { ecotrackFetch } from '../services/ecotrackApi';

export function StitchDashboardReference() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ecotrackFetch('/dashboard/stats')
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Stitch Integration Error:', err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-8 text-center text-emerald-600">Connecting to EcoTrack API...</div>;
  if (!stats) return <div className="p-8 text-center text-red-500">Failed to connect to backend. Ensure server is running on port 5000.</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6 bg-[#f6fbf7] rounded-3xl border border-emerald-100 shadow-sm">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">{stats.greeting}</h1>
        <span className="px-3 py-1 bg-emerald-500 text-white text-[10px] font-bold uppercase rounded-full">Stitch Connected</span>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Reports Submitted */}
        <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-xs">
          <span className="text-[10px] text-gray-400 font-black uppercase tracking-wider">Reports</span>
          <div className="text-3xl font-black text-gray-900 mt-1">{stats.reportsSubmitted}</div>
        </div>

        {/* Waste Collected */}
        <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-xs">
          <span className="text-[10px] text-emerald-500 font-black uppercase tracking-wider">Collected</span>
          <div className="text-3xl font-black text-emerald-600 mt-1">{stats.wasteCollected}</div>
        </div>

        {/* Pending Reports */}
        <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-xs">
          <span className="text-[10px] text-amber-500 font-black uppercase tracking-wider">Pending</span>
          <div className="text-3xl font-black text-amber-600 mt-1">{stats.pendingReports}</div>
        </div>

        {/* EcoPoints */}
        <div className="bg-emerald-600 p-5 rounded-2xl shadow-lg shadow-emerald-200">
          <span className="text-[10px] text-emerald-100 font-black uppercase tracking-wider">EcoPoints</span>
          <div className="text-3xl font-black text-white mt-1">{stats.ecoPoints}</div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-emerald-100">
        <p className="text-xs text-gray-500 font-medium">
          💡 This component is a reference for <strong>Stitch</strong> integration. 
          It uses the <code>ecotrackFetch</code> helper to pull real-time data from <code>http://localhost:5000/api</code>.
        </p>
      </div>
    </div>
  );
}

export default StitchDashboardReference;
