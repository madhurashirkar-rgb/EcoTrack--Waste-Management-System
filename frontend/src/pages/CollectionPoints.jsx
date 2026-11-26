import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import {
  Search,
  MapPin,
  Star,
  Clock,
  Phone,
  Navigation,
  Map as MapIcon,
  List,
  X,
  Sparkles,
} from 'lucide-react';
import api from '../api/client';
import { SpotlightCard } from '../components/MotionPrimitives';

const DEFAULT_HUBS = [
  {
    id: 'cp-1',
    name: 'GreenCircle Eco Hub',
    address: '42 Eco Boulevard, Sector 4',
    distance: '0.8 km away',
    status: 'Open Now',
    badge: 'Top Rated Hub',
    rating: 4.9,
    types: ['Plastic', 'Paper', 'Cardboard', 'Metal Cans'],
    operatingHours: 'Mon - Sat: 8:00 AM - 7:00 PM',
    phone: '+1 (555) 345-0199',
    lat: 40.7128,
    lng: -74.006,
  },
  {
    id: 'cp-2',
    name: 'Metro E-Waste & Battery Depository',
    address: '109 Tech Park Way, Building C',
    distance: '1.4 km away',
    status: 'Open Now',
    badge: 'Certified E-Steward',
    rating: 4.8,
    types: ['Electronic', 'Batteries', 'Cables', 'Small Appliances'],
    operatingHours: 'Daily: 9:00 AM - 8:00 PM',
    phone: '+1 (555) 789-0211',
    lat: 40.72,
    lng: -73.995,
  },
  {
    id: 'cp-3',
    name: 'BioClean Organic Composting Facility',
    address: '77 Greenway Lane, East Gardens',
    distance: '2.1 km away',
    status: 'Open Now',
    badge: 'Free Soil Compost Exchange',
    rating: 4.95,
    types: ['Organic', 'Food Scraps', 'Garden Trimmings'],
    operatingHours: 'Mon - Fri: 7:00 AM - 5:00 PM',
    phone: '+1 (555) 456-0322',
    lat: 40.73,
    lng: -74.01,
  },
  {
    id: 'cp-4',
    name: 'All-City Glass & Metal Reclamation Center',
    address: '255 Harbor Industrial Rd, Dock 9',
    distance: '3.5 km away',
    status: 'Open Now',
    badge: 'Instant Cash-for-Cans',
    rating: 4.85,
    types: ['Glass', 'Metal', 'Aluminium', 'Scrap Steel'],
    operatingHours: 'Mon - Sat: 8:30 AM - 6:00 PM',
    phone: '+1 (555) 678-0433',
    lat: 40.705,
    lng: -74.015,
  },
  {
    id: 'cp-5',
    name: 'Highland Hazardous Waste Unit',
    address: '500 Highland SafeZone Expressway',
    distance: '4.8 km away',
    status: 'Closes 4 PM',
    badge: 'Safety Certified',
    rating: 4.75,
    types: ['Hazardous', 'Paints', 'Solvents', 'Motor Oil'],
    operatingHours: 'Tue - Sat: 9:00 AM - 4:00 PM',
    phone: '+1 (555) 890-0544',
    lat: 40.745,
    lng: -73.98,
  },
];

export default function CollectionPoints() {
  const [hubs, setHubs] = useState(DEFAULT_HUBS);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'map'
  const [selectedHubDirections, setSelectedHubDirections] = useState(null);
  const [activePin, setActivePin] = useState(null);
  const containerRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    async function loadHubs() {
      try {
        const res = await api.collectionPoints.getAll();
        if (!mounted) return;
        if (res?.data && res.data.length > 0) {
          const formatted = res.data.map((h, i) => ({
            id: h.id || `hub-${i}`,
            name: h.name,
            address: h.address || 'Municipal District Hub',
            distance: h.distance ? `${h.distance} away` : `${(0.8 + i * 0.6).toFixed(1)} km away`,
            status: h.status || 'Open Now',
            badge: h.badge || 'Certified Hub',
            rating: h.rating || (4.9 - i * 0.05).toFixed(2),
            types: h.types || h.acceptedTypes || ['Plastic', 'Paper', 'Metals'],
            operatingHours: h.operatingHours || h.hours || 'Mon - Sat: 8:00 AM - 7:00 PM',
            phone: h.phone || '+1 (555) 345-0199',
            lat: h.lat ?? 40.7128 + i * 0.008,
            lng: h.lng ?? -74.006 + i * 0.006,
          }));
          setHubs(formatted);
          setActivePin(formatted[0]);
        }
      } catch {
        // Keep DEFAULT_HUBS fallback cleanly
      }
    }
    loadHubs();
    return () => {
      mounted = false;
    };
  }, []);

  useGSAP(
    () => {
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReduced) return;

      gsap.fromTo(
        '.hub-card',
        { y: 14 },
        {
          y: 0,
          duration: 0.45,
          stagger: 0.05,
          ease: 'power3.out',
        }
      );
    },
    { scope: containerRef, dependencies: [selectedCategory, viewMode] }
  );

  const categories = [
    { id: 'All', label: 'All Hubs', keywords: [] },
    { id: 'Plastic', label: 'Plastic & Cans', keywords: ['plastic', 'metal', 'aluminium', 'cans'] },
    { id: 'Paper', label: 'Paper & Glass', keywords: ['paper', 'cardboard', 'glass'] },
    { id: 'Electronic', label: 'E-Waste & Batteries', keywords: ['electronic', 'batteries', 'cables', 'appliances'] },
    { id: 'Organic', label: 'Compost & Organic', keywords: ['organic', 'food', 'garden'] },
    { id: 'Hazardous', label: 'Hazardous SafeZone', keywords: ['hazardous', 'paints', 'solvents', 'oil'] },
  ];

  const activeCategoryObj = categories.find((c) => c.id === selectedCategory);

  const filteredHubs = hubs.filter((hub) => {
    const typesLower = (hub.types || []).map((t) => t.toLowerCase());
    const matchesCategory =
      selectedCategory === 'All' ||
      (activeCategoryObj?.keywords || []).some((kw) =>
        typesLower.some((t) => t.includes(kw))
      );

    const q = search.trim().toLowerCase();
    const matchesSearch =
      !q ||
      hub.name.toLowerCase().includes(q) ||
      hub.address.toLowerCase().includes(q) ||
      typesLower.some((t) => t.includes(q));

    return matchesCategory && matchesSearch;
  });

  // Normalize lat/lng onto 10%-90% SVG sector map coordinates
  const getMapCoords = (hub, idx) => {
    const lats = hubs.map((h) => h.lat);
    const lngs = hubs.map((h) => h.lng);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);
    const latSpan = maxLat - minLat || 0.04;
    const lngSpan = maxLng - minLng || 0.04;

    const x = 15 + ((hub.lng - minLng) / lngSpan) * 70;
    const y = 82 - ((hub.lat - minLat) / latSpan) * 64;
    return { x: Number.isFinite(x) ? x : 20 + idx * 15, y: Number.isFinite(y) ? y : 30 + idx * 10 };
  };

  return (
    <div ref={containerRef} className="space-y-6">
      {/* Search & Filter Cluster */}
      <div className="bg-surface-container-lowest/95 backdrop-blur-md rounded-3xl p-5 sm:p-6 custom-shadow-card border border-surface-container-high space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-on-surface-variant" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search hubs by name, street, or accepted material (e.g. Batteries, Glass)..."
              className="w-full h-11 bg-surface-container-low border border-outline-variant rounded-xl pl-10 pr-4 text-on-surface text-xs focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/25 transition-all"
            />
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => setViewMode(viewMode === 'grid' ? 'map' : 'grid')}
              className="neon-btn neon-btn-primary h-11 px-4 bg-primary text-on-primary rounded-xl text-xs font-semibold flex items-center gap-2 hover:bg-primary-container"
            >
              {viewMode === 'grid' ? (
                <>
                  <MapIcon className="w-3.5 h-3.5" />
                  <span>Sector Map View</span>
                </>
              ) : (
                <>
                  <List className="w-3.5 h-3.5" />
                  <span>Card Grid View</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs shrink-0 transition-all duration-300 font-semibold ${
                  isSelected
                    ? 'bg-primary text-on-primary font-bold dark:shadow-[0_0_14px_rgba(0,255,148,0.35)]'
                    : 'bg-surface-container-low text-on-surface-variant hover:text-on-surface border border-surface-container-high'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Interactive Map View */}
      {viewMode === 'map' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 bg-surface-container-lowest/95 rounded-3xl p-5 border border-surface-container-high custom-shadow-card relative overflow-hidden min-h-[380px]">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono font-bold text-primary">
                Sector Recycling Network • {filteredHubs.length} Pinned Locations
              </span>
              <span className="text-[11px] font-mono text-on-surface-variant">Click a pin for details</span>
            </div>

            <div className="relative w-full h-[320px] rounded-2xl bg-surface-container-low border border-surface-container-high overflow-hidden eco-grid-bg">
              {/* Simulated arterial street lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-35" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path d="M 0 35 Q 45 42 100 28" stroke="currentColor" strokeWidth="0.6" fill="none" className="text-tertiary" />
                <path d="M 18 0 Q 32 55 24 100" stroke="currentColor" strokeWidth="0.6" fill="none" className="text-primary" />
                <path d="M 65 0 Q 58 48 76 100" stroke="currentColor" strokeWidth="0.5" fill="none" className="text-outline" />
              </svg>

              {filteredHubs.map((hub, idx) => {
                const { x, y } = getMapCoords(hub, idx);
                const isSelected = activePin?.id === hub.id;
                return (
                  <button
                    key={hub.id}
                    type="button"
                    onClick={() => setActivePin(hub)}
                    style={{ left: `${x}%`, top: `${y}%` }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 group flex flex-col items-center focus:outline-none`}
                  >
                    <span
                      className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all duration-300 ${
                        isSelected
                          ? 'bg-primary text-on-primary border-primary scale-110 shadow-neon'
                          : 'bg-surface-container-lowest text-primary border-primary/40 hover:scale-105'
                      }`}
                    >
                      <MapPin className="w-4 h-4" />
                    </span>
                    <span className="mt-1 px-2 py-0.5 rounded-md bg-surface-container-lowest/90 border border-surface-container-high text-[10px] font-semibold text-on-surface whitespace-nowrap shadow-xs">
                      {hub.name.split(' ').slice(0, 2).join(' ')}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-4 bg-surface-container-lowest/95 rounded-3xl p-6 border border-surface-container-high custom-shadow-card flex flex-col justify-between">
            {activePin ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-secondary-container text-primary border border-primary/25">
                    {activePin.badge}
                  </span>
                  <span className="text-xs font-mono text-tertiary">{activePin.distance}</span>
                </div>
                <div>
                  <h3 className="title-2 text-on-surface">{activePin.name}</h3>
                  <p className="text-xs text-on-surface-variant mt-1">{activePin.address}</p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {activePin.types.map((t) => (
                    <span
                      key={t}
                      className="px-2.5 py-1 rounded-lg bg-surface-container-low border border-surface-container-high text-[11px] text-on-surface"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <div className="text-xs font-mono text-on-surface-variant flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-tertiary" />
                  <span>{activePin.operatingHours}</span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-on-surface-variant">Select a hub pin on the map to inspect details.</p>
            )}

            {activePin && (
              <button
                type="button"
                onClick={() => setSelectedHubDirections(activePin)}
                className="neon-btn neon-btn-primary mt-6 w-full py-2.5 rounded-xl bg-primary text-on-primary text-xs font-bold flex items-center justify-center gap-1.5"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Get Directions</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Hubs Grid */}
      {filteredHubs.length === 0 ? (
        <div className="bg-surface-container-lowest rounded-3xl p-10 border border-surface-container-high text-center space-y-2">
          <h3 className="title-3 text-on-surface">No collection hubs match your filter</h3>
          <p className="text-xs text-on-surface-variant">
            Try clearing the search query or selecting All Hubs to view every drop off location.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHubs.map((hub) => (
            <SpotlightCard
              key={hub.id}
              className="hub-card bg-surface-container-lowest/95 backdrop-blur-md rounded-3xl p-6 custom-shadow-card border border-surface-container-high flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold border bg-secondary-container text-primary border-primary/25">
                      {hub.badge}
                    </span>
                    <h2 className="title-2 text-on-surface mt-2.5">{hub.name}</h2>
                    <p className="text-xs text-on-surface-variant flex items-center gap-1.5 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                      <span>
                        {hub.distance} • {hub.address}
                      </span>
                    </p>
                  </div>
                  <div className="flex items-center gap-1 bg-surface-container-low border border-surface-container-high px-2.5 py-1 rounded-xl text-xs font-bold text-on-surface shrink-0">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span>{hub.rating}</span>
                  </div>
                </div>

                <div className="mt-4 pt-3.5 border-t border-surface-container-high">
                  <div className="text-[11px] font-mono uppercase tracking-wider text-on-surface-variant mb-2">
                    Accepted Streams
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {hub.types.map((mat, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-lg bg-surface-container-low text-[11px] font-medium text-on-surface border border-surface-container-high"
                      >
                        {mat}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-4 text-[11px] text-on-surface-variant flex items-center gap-1.5 font-mono">
                  <Clock className="w-3.5 h-3.5 text-tertiary shrink-0" />
                  <span>{hub.operatingHours}</span>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-surface-container-high flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedHubDirections(hub)}
                  className="neon-btn neon-btn-primary flex-1 py-2.5 rounded-xl bg-primary text-on-primary text-xs font-semibold hover:bg-primary-container flex items-center justify-center gap-1.5"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Get Directions</span>
                </button>
                <a
                  href={`tel:${hub.phone}`}
                  className="p-2.5 rounded-xl border border-surface-container-high hover:border-primary/50 bg-surface-container-low text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center"
                  title={`Call ${hub.phone}`}
                >
                  <Phone className="w-4 h-4" />
                </a>
              </div>
            </SpotlightCard>
          ))}
        </div>
      )}

      {/* Directions Modal */}
      {selectedHubDirections && (
        <div
          data-lenis-prevent
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div className="bg-surface-container-lowest max-w-md w-full rounded-3xl p-6 sm:p-7 custom-shadow-modal border border-surface-container-high space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3.5 border-b border-surface-container-high">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-xl bg-secondary-container border border-primary/30 text-primary flex items-center justify-center">
                  <Navigation className="w-4 h-4" />
                </span>
                <h3 className="title-3 text-on-surface">{selectedHubDirections.name}</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedHubDirections(null)}
                className="p-1 rounded-lg text-on-surface-variant hover:text-on-surface"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs text-on-surface-variant">
              <p>
                <strong className="text-on-surface">Destination:</strong> {selectedHubDirections.address}
              </p>
              <p>
                <strong className="text-on-surface">Transit Distance:</strong> {selectedHubDirections.distance}
              </p>
              <p>
                <strong className="text-on-surface">Coordinates:</strong>{' '}
                <span className="font-mono">
                  {selectedHubDirections.lat}° N, {selectedHubDirections.lng}° W
                </span>
              </p>
              <p>
                <strong className="text-on-surface">Operating Window:</strong>{' '}
                {selectedHubDirections.operatingHours}
              </p>

              <div className="p-3.5 bg-secondary-container/60 rounded-2xl text-on-secondary-container border border-primary/25 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-primary">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Citizen Bonus</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  Drop off sorted recyclables here to earn up to +50 EcoPoints at the hub check in kiosk.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${selectedHubDirections.lat},${selectedHubDirections.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setSelectedHubDirections(null)}
                className="neon-btn neon-btn-primary px-5 py-2.5 bg-primary text-on-primary text-xs font-bold rounded-xl hover:bg-primary-container"
              >
                Open in Maps
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
