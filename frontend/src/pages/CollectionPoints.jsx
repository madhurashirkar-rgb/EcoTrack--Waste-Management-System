import React, { useState, useEffect } from 'react';
import api from '../api/client';

export default function CollectionPoints() {
  const [hubs, setHubs] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedHubDirections, setSelectedHubDirections] = useState(null);

  const defaultHubs = [
    {
      id: 'cp-1',
      name: 'GreenCycle Central Hub',
      address: '120 Green Way, Sector 4',
      distance: '0.8 km away',
      status: 'Open Now',
      statusColor: 'bg-secondary-container text-primary',
      rating: 4.9,
      category: 'Plastic & Cans Dry Waste',
      materials: ['Plastic Bottles', 'Glass Containers', 'Cardboard'],
      hours: 'Mon - Sat: 8:00 AM – 7:00 PM',
      phone: '+1 (555) 234-8901'
    },
    {
      id: 'cp-2',
      name: 'Metro E-Waste Depot',
      address: '88 Industrial Parkway',
      distance: '1.4 km away',
      status: 'Closes 6 PM',
      statusColor: 'bg-error-container text-error',
      rating: 4.8,
      category: 'E-Waste',
      materials: ['Lithium Batteries', 'Small Electronics', 'Monitors'],
      hours: 'Mon - Fri: 9:00 AM – 6:00 PM',
      phone: '+1 (555) 872-3341'
    },
    {
      id: 'cp-3',
      name: 'Civic Compost & Organic Drop',
      address: 'Municipal Gardens, Gate 2',
      distance: '2.1 km away',
      status: 'Open 24/7',
      statusColor: 'bg-secondary-container text-primary',
      rating: 4.95,
      category: 'Wet / Organic',
      materials: ['Food Scraps', 'Yard Trimmings', 'Biodegradable Bags'],
      hours: 'Self-serve drop kiosk open around the clock',
      phone: '+1 (555) 302-8877'
    },
    {
      id: 'cp-4',
      name: 'Pine Street Eco Drop',
      address: '345 Pine Street, Sector 2',
      distance: '1.1 km away',
      status: 'Open Now',
      statusColor: 'bg-secondary-container text-primary',
      rating: 4.85,
      category: 'Plastic & Cans Dry Waste',
      materials: ['Clean Textiles', 'Cardboard', 'Aluminium Cans'],
      hours: 'Tue - Sun: 9:00 AM – 5:30 PM',
      phone: '+1 (555) 412-9902'
    },
    {
      id: 'cp-5',
      name: 'South Bay Materials Hub',
      address: '90 Harbor View Road',
      distance: '3.5 km away',
      status: 'Open Now',
      statusColor: 'bg-secondary-container text-primary',
      rating: 4.7,
      category: 'Dry Waste',
      materials: ['Construction Scrap', 'Wood Furniture', 'Scrap Metal'],
      hours: 'Mon - Fri: 7:30 AM – 4:00 PM',
      phone: '+1 (555) 670-1122'
    }
  ];

  useEffect(() => {
    async function loadHubs() {
      try {
        const res = await api.collectionPoints.getAll(selectedCategory, search);
        if (res.data && res.data.length > 0) {
          // Merge with default format
          const formatted = res.data.map((h, i) => ({
            id: h.id || `hub-${i}`,
            name: h.name,
            address: h.address || h.location || 'Municipal District Hub',
            distance: h.distance || `${(0.8 + i * 0.6).toFixed(1)} km away`,
            status: h.status || 'Open Now',
            statusColor: 'bg-secondary-container text-primary',
            rating: h.rating || 4.8,
            category: h.acceptedTypes?.join(' ') || 'Plastic & Cans Dry Waste',
            materials: h.acceptedTypes || ['Plastic', 'Paper', 'Metals'],
            hours: h.hours || 'Mon - Sat: 8:00 AM – 7:00 PM',
            phone: h.phone || '+1 (555) 000-0000'
          }));
          setHubs(formatted);
        } else {
          setHubs(defaultHubs);
        }
      } catch {
        setHubs(defaultHubs);
      }
    }
    loadHubs();
  }, [selectedCategory, search]);

  const categories = [
    { id: 'All', label: 'All Hubs' },
    { id: 'Plastic & Cans', label: 'Plastic & Cans' },
    { id: 'Dry Waste', label: 'Dry Paper / Cardboard' },
    { id: 'E-Waste', label: 'E-Waste & Batteries' },
    { id: 'Wet / Organic', label: 'Compost & Organic' }
  ];

  const filteredHubs = hubs.filter(hub => {
    const matchesCategory = selectedCategory === 'All' || hub.category.toLowerCase().includes(selectedCategory.toLowerCase());
    const matchesSearch = !search || hub.name.toLowerCase().includes(search.toLowerCase()) || hub.address.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Search & Filter Cluster */}
      <div className="bg-surface-container-lowest rounded-xl p-5 custom-shadow-card border border-surface-container-high space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3 top-3 text-on-surface-variant text-lg">
              search
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search hubs by name, address, or accepted material..."
              className="w-full h-11 bg-surface-container-low border border-outline-variant rounded-md pl-10 pr-4 text-on-surface text-xs focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button className="h-11 px-4 border border-outline-variant rounded-md text-xs font-semibold text-on-surface flex items-center gap-2 hover:bg-surface-container-low transition-colors">
              <span className="material-symbols-outlined text-base">tune</span>
              <span>Radius: 5 km</span>
            </button>
            <button 
              onClick={() => alert('Map View active: Pinned 5 municipal drop-off centers within your sector.')}
              className="h-11 px-4 bg-primary text-on-primary rounded-md text-xs font-semibold flex items-center gap-2 hover:bg-primary-container transition-colors shadow-xs"
            >
              <span className="material-symbols-outlined text-base">map</span>
              <span>Map View</span>
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
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs shrink-0 transition-colors ${
                  isSelected
                    ? 'bg-primary text-on-primary font-bold'
                    : 'bg-surface-container text-on-surface-variant hover:text-primary font-semibold'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Hubs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredHubs.map((hub) => (
          <div
            key={hub.id}
            className="bg-surface-container-lowest rounded-xl p-5 custom-shadow-card border border-surface-container-high flex flex-col justify-between hover:border-primary transition-all duration-200"
          >
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${hub.statusColor}`}>
                    {hub.status}
                  </span>
                  <h3 className="text-base font-bold text-on-surface mt-2">{hub.name}</h3>
                  <p className="text-xs text-on-surface-variant flex items-center gap-1 mt-1">
                    <span className="material-symbols-outlined text-sm text-primary">distance</span>
                    <span>{hub.distance} • {hub.address}</span>
                  </p>
                </div>
                <div className="flex items-center gap-1 bg-surface-container-low px-2 py-1 rounded-md text-xs font-bold text-on-surface">
                  <span className="material-symbols-outlined text-sm text-amber-500">star</span>
                  <span>{hub.rating}</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-surface-container-high">
                <div className="text-[11px] font-semibold text-on-surface-variant mb-2">Accepts:</div>
                <div className="flex flex-wrap gap-1.5">
                  {hub.materials.map((mat, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-surface-container text-[11px] font-medium text-on-surface">
                      {mat}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-3 text-[11px] text-on-surface-variant flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm">schedule</span>
                <span>{hub.hours}</span>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-surface-container-high flex items-center gap-2">
              <button
                onClick={() => setSelectedHubDirections(hub)}
                className="flex-1 py-2 rounded-md bg-primary text-on-primary text-xs font-semibold hover:bg-primary-container transition-all flex items-center justify-center gap-1 shadow-xs"
              >
                <span className="material-symbols-outlined text-sm">directions</span>
                <span>Get Directions</span>
              </button>
              <a
                href={`tel:${hub.phone}`}
                className="p-2 rounded-md border border-outline-variant hover:bg-surface-container-low text-on-surface-variant transition-colors flex items-center justify-center"
                title={`Call ${hub.phone}`}
              >
                <span className="material-symbols-outlined text-base">call</span>
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Directions Modal */}
      {selectedHubDirections && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest max-w-md w-full rounded-2xl p-6 custom-shadow-modal border border-surface-container-high space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-surface-container-high">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">directions_car</span>
                <h3 className="font-bold text-sm text-on-surface">{selectedHubDirections.name}</h3>
              </div>
              <button 
                onClick={() => setSelectedHubDirections(null)}
                className="text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <div className="space-y-2 text-xs text-on-surface-variant">
              <p><strong className="text-on-surface">Destination:</strong> {selectedHubDirections.address}</p>
              <p><strong className="text-on-surface">Transit Distance:</strong> {selectedHubDirections.distance}</p>
              <p><strong className="text-on-surface">Operating Window:</strong> {selectedHubDirections.hours}</p>
              <div className="p-3 bg-secondary-container/60 rounded-xl text-on-secondary-container border border-secondary-fixed">
                🌱 Drop off segregated recyclables here to earn up to +50 EcoPoints directly at the kiosk scanner!
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedHubDirections(null)}
                className="px-4 py-2 bg-primary text-on-primary text-xs font-bold rounded-lg hover:bg-primary-container"
              >
                Start Navigation (GPS)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
