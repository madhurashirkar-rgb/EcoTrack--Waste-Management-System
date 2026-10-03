# 🌱 EcoTrack – Waste Management System

A full-stack, clean, modern, and beginner-friendly waste management web application built with **Node.js + Express** on the backend and **React** on the frontend, specifically structured for integration with a frontend created in **Stitch**.

---

## ✨ Features & Architecture

- **Backend**: Node.js & Express REST API (`http://localhost:5000/api`)
  - Full CORS enabled (`app.use(cors())`)
  - Standard JSON response formatting (`{ success: true, data: {...} }`)
  - In-memory / persistent file database (`backend/data/ecotrack.json`)
  - Pre-seeded users, waste complaints, collection hubs, and sustainability tips
- **Frontend**: Clean, eco-themed React application (`http://localhost:3000`)
  - Styled with primary eco-green (`#16a34a`), white/light-green surfaces, rounded cards, and soft shadows
  - Mobile-first responsive navigation: **Home | Report | Map | History | Profile**
  - Interactive status progression: **Reported → Assigned → In Progress → Collected**
  - Integrated Officer / Admin operations panel
- **Stitch Compatibility**:
  - Full guide provided in [`STITCH_INTEGRATION.md`](./STITCH_INTEGRATION.md)
  - Modular API client supporting both `fetch` and `axios`

---

## 🚀 Running the Project

### 1. Prerequisites
- Node.js (v18+) & npm

### 2. Backend Server
```bash
cd backend
npm install
npm start
# Server starts at http://localhost:5000
```

### 3. Frontend Application
```bash
cd frontend
npm install
npm run dev
# Vite server starts at http://localhost:3000
```

---

## 📡 REST API Reference

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/signup` | Register new user (fields: name, email, mobile, password, location) |
| `POST` | `/api/auth/login` | Authenticate user & retrieve JWT token |
| `GET` | `/api/dashboard/stats` | Greeting, reportsSubmitted, wasteCollected, pendingReports, ecoPoints |
| `GET` | `/api/reports` | List reports (supports `?status=...` query filter) |
| `POST` | `/api/reports` | Submit waste report (wasteType, location, description, image) |
| `GET` | `/api/report/:id` | Single report with 4-stage status progression |
| `PATCH` | `/api/reports/:id/status` | Update status (`Pending` → `Assigned` → `In Progress` → `Collected`) |
| `GET` | `/api/collection-points` | Drop-off centers (name, distance, accepted waste types) |
| `GET` | `/api/eco-tips` | Sustainability & waste segregation tips |
| `GET` | `/api/user/profile` | Citizen profile, total points, badges, carbon savings |
| `GET` | `/api/admin/reports` | Officer view of all citizen reports |
| `PATCH` | `/api/admin/report/:id/status` | Administrative status progression update |

---

## 🔑 Demo Credentials

- **Citizen User**: `user@ecotrack.org` / `password123`
- **Sanitation Officer (Admin)**: `admin@ecotrack.org` / `admin123`
