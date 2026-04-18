# 🎓 Smart College Event Management System

A full-stack responsive web application for managing college events with student registration, organizer panels, QR check-in, feedback system, and admin analytics dashboard.

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite + Tailwind CSS v3 |
| Backend | Node.js + Express.js |
| Database | MongoDB (Mongoose ODM) |
| Authentication | JWT (jsonwebtoken + bcryptjs) |
| QR System | qrcode + html5-qrcode |
| Charts | Recharts |
| Animations | Framer Motion |

## 📁 Project Structure

```
DBMS-FINAL/
├── client/                    # React Frontend
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── context/           # Auth context provider
│   │   ├── pages/             # Page components
│   │   ├── services/          # API service layer
│   │   ├── App.jsx            # Main app with routing
│   │   └── index.css          # Global styles + Tailwind
│   ├── tailwind.config.js
│   └── vite.config.js
├── server/                    # Express Backend
│   ├── config/                # Database connection
│   ├── controllers/           # Route handlers
│   ├── middleware/             # Auth & validation
│   ├── models/                # Mongoose schemas
│   ├── routes/                # API route definitions
│   ├── seed/                  # Sample data seeder
│   └── server.js              # Entry point
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18+)
- **MongoDB** running locally on `mongodb://localhost:27017`  
  OR a MongoDB Atlas URI

### 1. Backend Setup

```bash
cd server
npm install
```

Optionally update `.env`:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/college-events
JWT_SECRET=your_secret_key
JWT_EXPIRE=24h
```

Seed the database with sample data:
```bash
npm run seed
```

Start the server:
```bash
npm run dev
```

Server runs on **http://localhost:5000**

### 2. Frontend Setup

```bash
cd client
npm install
npm run dev
```

Frontend runs on **http://localhost:5173**

## 🔐 Demo Credentials

After seeding, use these accounts:

| Role | Email | Password |
|---|---|---|
| **Admin** | admin@college.edu | admin123 |
| **Coordinator** | anita@college.edu | coord123 |
| **Student** | aarav@student.edu | student123 |

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` — Register new student
- `POST /api/auth/login` — Login (student/coordinator)
- `GET /api/auth/me` — Get current user

### Events
- `GET /api/events` — List events (with filters)
- `GET /api/events/:id` — Event details
- `POST /api/events` — Create event (coordinator)
- `PUT /api/events/:id` — Update event
- `DELETE /api/events/:id` — Delete event

### Registrations
- `POST /api/registrations` — Register for event
- `DELETE /api/registrations/:eventId` — Unregister
- `GET /api/registrations/my` — My registrations
- `GET /api/registrations/event/:eventId` — Event participants
- `POST /api/registrations/checkin` — QR check-in
- `GET /api/registrations/qr/:regId` — Get QR code

### Feedback
- `POST /api/feedback` — Submit feedback
- `GET /api/feedback/event/:eventId` — Event feedback

### Admin
- `GET /api/admin/stats` — Dashboard stats
- `GET /api/admin/analytics` — Detailed analytics

## 📊 Database Schema

### Collections
- **Students** — name, email, collegeId, password, department, year
- **Events** — title, description, date, venue, category, coordinator, status
- **Registrations** — student (ref), event (ref), checkedIn, qrCode
- **Coordinators** — name, email, password, role (coordinator/admin)
- **Feedback** — student (ref), event (ref), rating (1-5), comment

### Relationships
- **Many-to-Many**: Students ↔ Events (through Registrations)
- **One-to-Many**: Coordinator → Events
- **One-to-Many**: Student → Feedback

## ✨ Features

- ✅ Responsive design (mobile + desktop)
- ✅ JWT authentication with role-based access
- ✅ Student registration & event management
- ✅ QR code check-in system
- ✅ Event feedback with star ratings
- ✅ Admin dashboard with analytics charts
- ✅ Search & filter events
- ✅ Glassmorphism UI with animations
- ✅ Sample seed data
