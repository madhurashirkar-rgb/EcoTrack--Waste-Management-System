const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const DATA_DIR = path.join(__dirname, '../../data');
const DB_FILE = path.join(DATA_DIR, 'ecotrack.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial Database Schema & Seed Data
function getInitialData() {
  const salt = bcrypt.genSaltSync(10);
  const userPasswordHash = bcrypt.hashSync('password123', salt);
  const adminPasswordHash = bcrypt.hashSync('Admin@123', salt);

  return {
    users: [
      {
        id: 'usr-1',
        name: 'Alex Johnson',
        email: 'user@ecotrack.org',
        mobile: '+1 (555) 234-5678',
        password: userPasswordHash,
        location: 'Greenwood District, Sector 4',
        ecoPoints: 350,
        role: 'citizen',
        createdAt: '2026-09-15T09:00:00.000Z'
      },
      {
        id: 'usr-2',
        name: 'Sarah Connor',
        email: 'sarah@ecotrack.org',
        mobile: '+1 (555) 876-5432',
        password: userPasswordHash,
        location: 'Riverside Walk, Apt 12B',
        ecoPoints: 150,
        role: 'citizen',
        createdAt: '2026-09-20T11:30:00.000Z'
      },
      {
        id: 'usr-admin',
        name: 'Officer Davis (Sanitation Lead)',
        email: 'admin@ecotrack.com',
        mobile: '+1 (555) 999-0001',
        password: adminPasswordHash,
        location: 'Central Municipal Sanitation Office',
        ecoPoints: 1200,
        role: 'admin',
        createdAt: '2026-08-01T08:00:00.000Z'
      }
    ],
    reports: [
      {
        id: 'rep-101',
        userId: 'usr-1',
        userName: 'Alex Johnson',
        wasteType: 'Plastic',
        location: 'Corner of Maple St & 4th Avenue, near Park bench',
        description: 'Large pile of single-use plastic cups, takeout containers, and bottles left next to the public bench.',
        image: 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=600&q=80',
        status: 'Pending',
        date: '2026-09-29T10:15:00.000Z',
        assignedTo: null,
        resolutionNotes: null,
        history: [
          { status: 'Pending', timestamp: '2026-09-29T10:15:00.000Z', note: 'Report submitted by citizen.' }
        ]
      },
      {
        id: 'rep-102',
        userId: 'usr-1',
        userName: 'Alex Johnson',
        wasteType: 'Electronic',
        location: 'Behind Metro Station West Exit, Bike racks',
        description: 'Broken computer monitor, discarded keyboards, and tangled battery cords dumped near the bike stand.',
        image: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=600&q=80',
        status: 'Assigned',
        date: '2026-09-27T14:40:00.000Z',
        assignedTo: 'Rapid Green Response Team Alpha',
        resolutionNotes: 'Dispatch scheduled for vehicle #24.',
        history: [
          { status: 'Pending', timestamp: '2026-09-27T14:40:00.000Z', note: 'Report submitted by citizen.' },
          { status: 'Assigned', timestamp: '2026-09-28T09:00:00.000Z', note: 'Assigned to Alpha Response Team.' }
        ]
      },
      {
        id: 'rep-103',
        userId: 'usr-2',
        userName: 'Sarah Connor',
        wasteType: 'Hazardous',
        location: 'Industrial Alley 3, near drain entrance',
        description: 'Unsealed paint buckets and solvent containers dripping near storm drain.',
        image: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=600&q=80',
        status: 'In Progress',
        date: '2026-09-26T16:20:00.000Z',
        assignedTo: 'Special Hazardous Handling Unit',
        resolutionNotes: 'Barricade set up, containment team currently packing barrels.',
        history: [
          { status: 'Pending', timestamp: '2026-09-26T16:20:00.000Z', note: 'Report submitted by citizen.' },
          { status: 'Assigned', timestamp: '2026-09-27T08:30:00.000Z', note: 'Assigned to Hazmat unit.' },
          { status: 'In Progress', timestamp: '2026-09-28T11:00:00.000Z', note: 'Cleanup crew active on site.' }
        ]
      },
      {
        id: 'rep-104',
        userId: 'usr-1',
        userName: 'Alex Johnson',
        wasteType: 'Organic',
        location: 'Farmer Market Square, Bin Cluster #3',
        description: 'Spoiled vegetables and compostable packaging accumulated after weekend trade fair.',
        image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80',
        status: 'Collected',
        date: '2026-09-22T08:00:00.000Z',
        assignedTo: 'City Organic Composters #04',
        resolutionNotes: 'Transported 120kg to BioClean Composting facility for aerobic decomposition.',
        history: [
          { status: 'Pending', timestamp: '2026-09-22T08:00:00.000Z', note: 'Report submitted by citizen.' },
          { status: 'Assigned', timestamp: '2026-09-22T10:00:00.000Z', note: 'Assigned to BioClean crew.' },
          { status: 'In Progress', timestamp: '2026-09-22T13:30:00.000Z', note: 'Loading organic bins into compactor.' },
          { status: 'Collected', timestamp: '2026-09-22T15:45:00.000Z', note: 'Area thoroughly washed and cleared.' }
        ]
      }
    ],
    collectionPoints: [
      {
        id: 'cp-1',
        name: 'GreenCircle Eco Hub',
        distance: '0.8 km',
        types: ['Plastic', 'Paper', 'Cardboard', 'Metal Cans'],
        address: '42 Eco Boulevard, Sector 4',
        operatingHours: 'Mon - Sat: 8:00 AM - 7:00 PM',
        phone: '+1 (555) 345-0199',
        badge: 'Top Rated Hub',
        lat: 40.7128,
        lng: -74.0060
      },
      {
        id: 'cp-2',
        name: 'Metro E-Waste & Battery Depository',
        distance: '1.4 km',
        types: ['Electronic', 'Batteries', 'Cables', 'Small Appliances'],
        address: '109 Tech Park Way, Building C',
        operatingHours: 'Daily: 9:00 AM - 8:00 PM',
        phone: '+1 (555) 789-0211',
        badge: 'Certified E-Steward',
        lat: 40.7200,
        lng: -73.9950
      },
      {
        id: 'cp-3',
        name: 'BioClean Organic Composting Facility',
        distance: '2.1 km',
        types: ['Organic', 'Food Scraps', 'Garden Trimmings'],
        address: '77 Greenway Lane, East Gardens',
        operatingHours: 'Mon - Fri: 7:00 AM - 5:00 PM',
        phone: '+1 (555) 456-0322',
        badge: 'Free Soil Compost Exchange',
        lat: 40.7300,
        lng: -74.0100
      },
      {
        id: 'cp-4',
        name: 'All-City Glass & Metal Reclamation Center',
        distance: '3.5 km',
        types: ['Glass', 'Metal', 'Aluminium', 'Scrap Steel'],
        address: '255 Harbor Industrial Rd, Dock 9',
        operatingHours: 'Mon - Sat: 8:30 AM - 6:00 PM',
        phone: '+1 (555) 678-0433',
        badge: 'Instant Cash-for-Cans',
        lat: 40.7050,
        lng: -74.0150
      },
      {
        id: 'cp-5',
        name: 'Highland Hazardous Waste Unit',
        distance: '4.8 km',
        types: ['Hazardous', 'Paints', 'Solvents', 'Motor Oil'],
        address: '500 Highland SafeZone Expressway',
        operatingHours: 'Tue - Sat: 9:00 AM - 4:00 PM',
        phone: '+1 (555) 890-0544',
        badge: 'Safety Certified',
        lat: 40.7450,
        lng: -73.9800
      }
    ],
    ecoTips: [
      {
        id: 'tip-1',
        tip: 'Rinse plastic food containers before tossing them into recycling bins to prevent batch contamination.',
        category: 'Plastic & Packaging',
        icon: 'recycle'
      },
      {
        id: 'tip-2',
        tip: 'Separate dry and wet waste at source. This boosts municipal composting efficiency by up to 70%.',
        category: 'Source Segregation',
        icon: 'split'
      },
      {
        id: 'tip-3',
        tip: 'Never dispose of rechargeable or lithium-ion batteries in household trash—they are severe fire hazards.',
        category: 'Hazardous & Batteries',
        icon: 'battery-warning'
      },
      {
        id: 'tip-4',
        tip: 'Flatten all cardboard boxes before placing them in collection bins to maximize transport capacity.',
        category: 'Paper & Cardboard',
        icon: 'box'
      },
      {
        id: 'tip-5',
        tip: 'Keep a small countertop caddy for fruit peels and coffee grounds to make home composting effortless.',
        category: 'Composting',
        icon: 'sprout'
      },
      {
        id: 'tip-6',
        tip: 'Clean glass bottles can be recycled endlessly without loss of purity or quality.',
        category: 'Glass Recycling',
        icon: 'sparkles'
      }
    ]
  };
}

// Memory cache of DB for low latency
let dbCache = null;

function loadDatabase() {
  if (dbCache) return dbCache;

  if (fs.existsSync(DB_FILE)) {
    try {
      const data = fs.readFileSync(DB_FILE, 'utf-8');
      dbCache = JSON.parse(data);
      // Ensure admin@ecotrack.com is present with Admin@123
      const adminUser = dbCache.users.find((u) => u.email.toLowerCase() === 'admin@ecotrack.com');
      const salt = bcrypt.genSaltSync(10);
      const adminPasswordHash = bcrypt.hashSync('Admin@123', salt);
      if (!adminUser) {
        dbCache.users.push({
          id: 'usr-admin',
          name: 'Officer Davis (Sanitation Lead)',
          email: 'admin@ecotrack.com',
          mobile: '+1 (555) 999-0001',
          password: adminPasswordHash,
          location: 'Central Municipal Sanitation Office',
          ecoPoints: 1200,
          role: 'admin',
          createdAt: '2026-08-01T08:00:00.000Z'
        });
        saveDatabase();
      } else {
        // Guarantee password matches Admin@123
        adminUser.password = adminPasswordHash;
        adminUser.role = 'admin';
        saveDatabase();
      }
      return dbCache;
    } catch (err) {
      console.error('Error reading db file, re-initializing...', err);
    }
  }

  dbCache = getInitialData();
  saveDatabase();
  return dbCache;
}

function saveDatabase() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(dbCache, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing db file:', err);
  }
}

// Database helper functions with clean collections API
const db = {
  get: () => loadDatabase(),
  save: () => saveDatabase(),

  // Users collection
  users: {
    find: (predicate) => {
      const { users } = loadDatabase();
      return predicate ? users.filter(predicate) : users;
    },
    findById: (id) => {
      const { users } = loadDatabase();
      return users.find((u) => u.id === id);
    },
    findByEmail: (email) => {
      const { users } = loadDatabase();
      return users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    },
    create: (user) => {
      const data = loadDatabase();
      data.users.push(user);
      saveDatabase();
      return user;
    },
    update: (id, updates) => {
      const data = loadDatabase();
      const index = data.users.findIndex((u) => u.id === id);
      if (index === -1) return null;
      data.users[index] = { ...data.users[index], ...updates };
      saveDatabase();
      return data.users[index];
    }
  },

  // Reports collection
  reports: {
    find: (predicate) => {
      const { reports } = loadDatabase();
      return predicate ? reports.filter(predicate) : reports;
    },
    findById: (id) => {
      const { reports } = loadDatabase();
      return reports.find((r) => r.id === id);
    },
    create: (report) => {
      const data = loadDatabase();
      data.reports.unshift(report); // newest first
      saveDatabase();
      return report;
    },
    update: (id, updates) => {
      const data = loadDatabase();
      const index = data.reports.findIndex((r) => r.id === id);
      if (index === -1) return null;
      data.reports[index] = { ...data.reports[index], ...updates };
      saveDatabase();
      return data.reports[index];
    }
  },

  // Collection Points collection
  collectionPoints: {
    find: (predicate) => {
      const { collectionPoints } = loadDatabase();
      return predicate ? collectionPoints.filter(predicate) : collectionPoints;
    },
    findById: (id) => {
      const { collectionPoints } = loadDatabase();
      return collectionPoints.find((cp) => cp.id === id);
    }
  },

  // Eco Tips collection
  ecoTips: {
    find: (predicate) => {
      const { ecoTips } = loadDatabase();
      return predicate ? ecoTips.filter(predicate) : ecoTips;
    }
  }
};

module.exports = db;
