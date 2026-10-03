import React, { useState, useEffect } from 'react';
import { MapPin, Search, Phone, Clock, Navigation, Check, Filter } from 'lucide-react';
import api from '../api/client';

const FILTER_TYPES = ['All', 'Plastic', 'Electronic', 'Organic', 'Glass', 'Hazardous'];

export default function CollectionPoints() {
  const [points, setPoints] = useState([]);
  const [selectedType, setSelectedType] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeCenter, setActiveCenter] = useState(null);

  useEffect(() => {
    setLoading(true);
    api.collectionPoints
      .getAll(selectedType, searchQuery)
      .then((res) => {
        setPoints(res.data || []);
        if (res.data?.length > 0 && !activeCenter) {
          setActiveCenter(res.data[0]);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [selectedType, searchQuery]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
            Collection Centers
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Locate authorized municipal drop-off points, e-waste depositories, and recycling stations.
          </p>
        </div>
        <div className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200 self-start sm:self-auto">
          🌱 {points.length} Verified Centers
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-3xl border border-emerald-100 shadow-xs space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by center name, street, or accepted waste..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
        </div>

        {/* Filter tags */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <Filter className="w-3.5 h-3.5 text-gray-400 shrink-0 ml-1" />
          {FILTER_TYPES.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold shrink-0 transition-all ${
                selectedType === type
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200/70'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Map Visual Simulator */}
      <div className="relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 shadow-inner h-48 sm:h-56 p-4 flex flex-col justify-between">
        {/* Subtle grid lines styling */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'radial-gradient(#10b981 1px, transparent 1px)',
            backgroundSize: '24px 24px'
          }}
        />

        <div className="relative z-10 flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-xs font-mono uppercase text-emerald-400 font-bold">
              GPS Radar Active
            </span>
          </div>
          <span className="text-[11px] text-slate-400">
            Selected: <strong className="text-white">{activeCenter?.name || 'Nearest Station'}</strong>
          </span>
        </div>

        {/* Simulated Map Pins */}
        <div className="relative z-10 flex items-center justify-around px-4">
          {points.slice(0, 4).map((pt, idx) => (
            <button
              key={pt.id}
              onClick={() => setActiveCenter(pt)}
              className={`flex flex-col items-center group transition-transform ${
                activeCenter?.id === pt.id ? 'scale-110' : 'opacity-80 hover:opacity-100'
              }`}
            >
              <div
                className={`w-9 h-9 rounded-2xl flex items-center justify-center text-xs font-bold shadow-md transition-all ${
                  activeCenter?.id === pt.id
                    ? 'bg-emerald-500 text-white ring-4 ring-emerald-400/40'
                    : 'bg-slate-800 text-emerald-400 border border-slate-700'
                }`}
              >
                <MapPin className="w-4 h-4" />
              </div>
              <span className="text-[10px] text-white mt-1 max-w-[80px] truncate text-center font-medium">
                {pt.name.split(' ')[0]}
              </span>
              <span className="text-[9px] text-emerald-400 font-mono">
                {pt.distance}
              </span>
            </button>
          ))}
        </div>

        <div className="relative z-10 text-[11px] text-slate-400 flex items-center justify-between border-t border-slate-800/80 pt-2">
          <span>Coordinates: Greenwood Metropolitan Sector</span>
          <span className="text-emerald-400 font-medium">Live Dispatch Route</span>
        </div>
      </div>

      {/* Centers Cards Grid */}
      {loading ? (
        <div className="py-16 text-center">
          <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs text-gray-500">Locating recycling stations...</p>
        </div>
      ) : points.length === 0 ? (
        <div className="p-8 text-center bg-white rounded-3xl border border-gray-100">
          <p className="text-sm font-semibold text-gray-600">No collection centers found matching your search.</p>
          <button
            onClick={() => { setSelectedType('All'); setSearchQuery(''); }}
            className="mt-2 text-xs font-bold text-emerald-600 hover:underline"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {points.map((center) => {
            const isSelected = activeCenter?.id === center.id;
            return (
              <div
                key={center.id}
                onClick={() => setActiveCenter(center)}
                className={`p-5 rounded-3xl border transition-all cursor-pointer bg-white ${
                  isSelected
                    ? 'border-emerald-600 ring-2 ring-emerald-500/20 shadow-md'
                    : 'border-emerald-100/80 hover:border-emerald-300 hover:shadow-xs'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <span className="inline-block text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full mb-1">
                      {center.badge || 'Drop-off Station'}
                    </span>
                    <h3 className="text-base font-bold text-gray-900 leading-snug">
                      {center.name}
                    </h3>
                  </div>

                  <span className="shrink-0 px-2.5 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-bold flex items-center gap-1">
                    <Navigation className="w-3 h-3 text-emerald-600" />
                    {center.distance}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-gray-600 my-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <span className="truncate">{center.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <span>{center.operatingHours}</span>
                  </div>
                  {center.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span>{center.phone}</span>
                    </div>
                  )}
                </div>

                {/* Accepted Waste Types */}
                <div className="pt-3 border-t border-gray-100">
                  <span className="text-[10px] font-bold uppercase text-gray-400 tracking-wider block mb-1.5">
                    Accepted Materials:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {center.types.map((t) => (
                      <span
                        key={t}
                        className="text-[11px] font-medium bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-md"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
