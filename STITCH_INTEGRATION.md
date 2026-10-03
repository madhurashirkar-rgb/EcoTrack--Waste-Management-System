# 🔌 Integrating EcoTrack with Stitch (React UI)

This guide provides everything needed to connect a frontend designed in **Stitch** to the **EcoTrack REST API backend**.

---

## 🚀 Quick Setup Overview

- **Backend Base URL**: `http://localhost:5000/api`
- **CORS Enabled**: Configured on backend (`cors({ origin: '*' })`)
- **Body Parser**: Configured for JSON payload up to 10MB (`express.json()`)
- **Standard Response Shape**:
  ```json
  {
    "success": true,
    "data": { ... },
    "message": "Optional descriptive status"
  }
  ```

---

## 🛠️ 1. Reusable API Helper for Stitch Components

Create an `api.js` file in your Stitch project or embed this snippet directly in your Stitch components:

```javascript
// stitch/services/ecotrackApi.js
const API_BASE = 'http://localhost:5000/api';

export async function ecotrackFetch(endpoint, options = {}) {
  const token = localStorage.getItem('ecotrack_token');
  const user = JSON.parse(localStorage.getItem('ecotrack_user') || 'null');

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(user ? { 'x-user-id': user.id } : {}),
    ...(options.headers || {})
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || `Request failed with HTTP ${response.status}`);
  }

  return data.data;
}
```

---

## 📋 2. Stitch Component Implementation Snippets

### A. Authentication (Login & Signup)

```javascript
// Stitch Login Handler
async function handleLogin(email, password) {
  const data = await ecotrackFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });

  // Store token and user
  localStorage.setItem('ecotrack_token', data.token);
  localStorage.setItem('ecotrack_user', JSON.stringify(data.user));
  return data.user;
}

// Stitch Signup Handler
async function handleSignup({ name, email, mobile, password, location }) {
  const data = await ecotrackFetch('/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ name, email, mobile, password, location })
  });

  localStorage.setItem('ecotrack_token', data.token);
  localStorage.setItem('ecotrack_user', JSON.stringify(data.user));
  return data.user;
}
```

---

### B. Dashboard Stats (Greeting & 4 Key Cards)

```javascript
// In your Stitch Dashboard Component
import React, { useState, useEffect } from 'react';
import { ecotrackFetch } from './services/ecotrackApi';

export function StitchDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    ecotrackFetch('/dashboard/stats')
      .then((data) => setStats(data))
      .catch((err) => console.error(err));
  }, []);

  if (!stats) return <div>Loading EcoTrack...</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">{stats.greeting}</h1>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Reports Submitted */}
        <div className="bg-white p-4 rounded-2xl border border-emerald-100 shadow-sm">
          <span className="text-xs text-gray-500 font-bold uppercase">Reports</span>
          <div className="text-2xl font-black text-gray-900">{stats.reportsSubmitted}</div>
        </div>

        {/* Waste Collected */}
        <div className="bg-white p-4 rounded-2xl border border-emerald-100 shadow-sm">
          <span className="text-xs text-emerald-600 font-bold uppercase">Collected</span>
          <div className="text-2xl font-black text-emerald-600">{stats.wasteCollected}</div>
        </div>

        {/* Pending Reports */}
        <div className="bg-white p-4 rounded-2xl border border-emerald-100 shadow-sm">
          <span className="text-xs text-amber-600 font-bold uppercase">Pending</span>
          <div className="text-2xl font-black text-amber-600">{stats.pendingReports}</div>
        </div>

        {/* EcoPoints */}
        <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 shadow-sm">
          <span className="text-xs text-emerald-800 font-bold uppercase">EcoPoints</span>
          <div className="text-2xl font-black text-emerald-700">{stats.ecoPoints} pts</div>
        </div>
      </div>
    </div>
  );
}
```

---

### C. Report Waste Form

```javascript
// Submit Waste Report to POST /reports or POST /report
async function submitWasteReport(formData) {
  // Payload: { wasteType, location, description, image }
  return await ecotrackFetch('/reports', {
    method: 'POST',
    body: JSON.stringify({
      wasteType: formData.wasteType,     // e.g. "Plastic"
      location: formData.location,       // e.g. "Main Street, Sector 4"
      description: formData.description, // e.g. "Discarded bottles"
      image: formData.image              // URL or Base64 string
    })
  });
}
```

---

### D. Single Report & Status Progression

```javascript
// Fetch Single Report to display 4-stage progression:
// Reported -> Assigned -> In Progress -> Collected
async function getReportDetails(reportId) {
  const report = await ecotrackFetch(`/report/${reportId}`);
  
  // report.statusProgression array contains:
  // [
  //   { step: 1, name: "Reported", completed: true, timestamp: "..." },
  //   { step: 2, name: "Assigned", completed: true, timestamp: "..." },
  //   { step: 3, name: "In Progress", completed: false },
  //   { step: 4, name: "Collected", completed: false }
  // ]
  return report;
}
```

---

### E. Collection Points / Centers

```javascript
// Fetch Collection Centers
async function fetchCollectionPoints(wasteType = 'All', search = '') {
  const query = new URLSearchParams();
  if (wasteType !== 'All') query.append('type', wasteType);
  if (search) query.append('search', search);

  return await ecotrackFetch(`/collection-points?${query.toString()}`);
}
```

---

## 🧪 Pre-configured Test Accounts

| Role | Email | Password |
|---|---|---|
| **Citizen (Default)** | `user@ecotrack.org` | `password123` |
| **Sanitation Officer (Admin)** | `admin@ecotrack.org` | `admin123` |

---

## 🎨 Theme Tokens for Stitch Styling

- **Primary Color**: `#16a34a` (Tailwind `emerald-600` / `green-600`)
- **Background**: `#f6fbf7`
- **Border**: `#dcfce7` (Tailwind `emerald-100`)
- **Card Radius**: `rounded-2xl` / `rounded-3xl`
- **Shadows**: Soft blur `shadow-sm` / `shadow-md`
