# Blood Donor Finder System

A full-stack web application for connecting blood donors with hospitals and patients in need. Built as a **DBMS University Project** demonstrating advanced database concepts.

> **One Drop. One Life.**

---

## Features

- **Donor Registration** — Register with blood group, city, and contact details
- **Hospital Dashboard** — Post blood requests with urgency levels
- **Smart Matching** — Search donors by blood group and city using stored procedures
- **Badge System** — Earn badges (First Drop, Life Saver, Hero) based on donation count
- **Interactive Map** — Leaflet.js map with blood-group-colored pins
- **Blood Compatibility Chart** — Interactive SVG showing donation/receiving compatibility
- **Eligibility Checker** — Check if you're eligible to donate (56-day rule + weight)
- **Urgency Timer** — Live countdown on critical blood requests
- **Dark Mode** — Toggle with localStorage persistence
- **Email Alerts** — Nodemailer sends alerts to matching donors on critical requests
- **Admin Dashboard** — Chart.js charts, stats, user management
- **PWA Support** — Installable on mobile devices
- **Role-Based Access** — Donor, Hospital, and Admin roles with JWT authentication

---

## Tech Stack

| Layer      | Technology                              |
|------------|-----------------------------------------|
| Frontend   | React 18, Tailwind CSS v3, Vite         |
| Backend    | Node.js, Express.js                     |
| Database   | MySQL 8.x                               |
| Auth       | JWT (jsonwebtoken) + bcryptjs           |
| Maps       | Leaflet.js + React-Leaflet             |
| Charts     | Chart.js + react-chartjs-2             |
| Animations | Framer Motion                           |
| Email      | Nodemailer (Gmail SMTP)                 |
| PWA        | vite-plugin-pwa                         |
| Upload     | Multer (profile pictures)               |

---

## Project Structure

```
Blood Donar Finder System/
├── schema.sql          # MySQL schema (tables, triggers, views, procedures)
├── seed.sql            # Sample data for demo
├── README.md
├── backend/
│   ├── server.js       # Express entry point
│   ├── config/db.js    # MySQL2 connection pool
│   ├── middleware/      # auth.js, role.js
│   ├── controllers/    # authController, donorController, etc.
│   ├── routes/         # auth, donors, requests, notifications, admin, upload
│   └── utils/mailer.js # Nodemailer helper
└── frontend/
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    └── src/
        ├── App.jsx
        ├── components/ # Navbar, DonorCard, MapView, BloodCompatibilityChart, etc.
        ├── pages/      # Home, Login, Register, DonorSearch, AdminDashboard, etc.
        ├── context/    # AuthContext.jsx
        ├── hooks/      # useDonors, useRequests, useNotifications
        └── utils/      # api.js, bloodGroups.js
```

---

## Setup Instructions

### Prerequisites
- **Node.js** v18+
- **MySQL** 8.x (running locally)
- **npm** or **yarn**

### 1. Database Setup

```bash
# Login to MySQL
mysql -u root -p

# Run the schema
source /path/to/schema.sql;

# Load sample data
source /path/to/seed.sql;
```

### 2. Backend Setup

```bash
cd backend

# Copy environment file and edit with your credentials
cp .env.example .env
# Edit .env: set DB_PASS, JWT_SECRET, etc.

# Install dependencies
npm install

# Start the server
npm run dev
# Server runs on http://localhost:5000
```

### 3. Frontend Setup

```bash
cd frontend

# Copy environment file
cp .env.example .env

# Install dependencies
npm install

# Start dev server
npm run dev
# App runs on http://localhost:5173
```

### 4. Demo Credentials

| Role     | Email                   | Password     |
|----------|-------------------------|-------------|
| Admin    | admin@blooddonor.com    | password123 |

---

## API Documentation

### Auth Endpoints

| Method | Endpoint           | Auth | Description          |
|--------|--------------------|------|----------------------|
| POST   | /api/auth/register | No   | Register user        |
| POST   | /api/auth/login    | No   | Login, returns JWT   |
| GET    | /api/auth/me       | Yes  | Get current profile  |

### Donor Endpoints

| Method | Endpoint                     | Auth | Description                 |
|--------|------------------------------|------|-----------------------------|
| GET    | /api/donors/search           | No   | Search donors (stored proc) |
| GET    | /api/donors/:id              | No   | Donor profile + badges      |
| PUT    | /api/donors/toggle-availability | Yes | Toggle availability         |
| GET    | /api/donors/eligibility      | Yes  | Check eligibility           |

### Request Endpoints

| Method | Endpoint                     | Auth | Description            |
|--------|------------------------------|------|------------------------|
| POST   | /api/requests                | Yes  | Create blood request   |
| GET    | /api/requests                | No   | List open requests     |
| GET    | /api/requests/:id            | No   | Request detail         |
| PUT    | /api/requests/:id/status     | Yes  | Update status          |
| POST   | /api/requests/:id/donate     | Yes  | Volunteer to donate    |

### Admin Endpoints

| Method | Endpoint         | Auth | Description       |
|--------|------------------|------|-------------------|
| GET    | /api/admin/stats | Yes  | Dashboard stats   |
| GET    | /api/admin/users | Yes  | User management   |

---

## DBMS Concepts Demonstrated

| Concept               | Implementation                                          |
|-----------------------|---------------------------------------------------------|
| **Normalization (3NF)** | Separate users, donors, blood_requests, donations tables |
| **Triggers**          | Auto-update donor stats on donation; auto-award badges   |
| **Views**             | `eligible_donors` — real-time view of eligible donors    |
| **Stored Procedures** | `find_donors(blood_group, city)` — parameterized search  |
| **Indexes**           | On blood_group, city, is_available for query optimization |
| **Transactions**      | Used in registration (user + donor insert atomically)    |
| **Foreign Keys**      | Referential integrity across all 6 tables                |
| **ENUM Types**        | Role, blood group, urgency, status fields                |
| **Aggregate Functions** | COUNT, GROUP BY in admin stats                          |
| **JOINs**             | Multi-table JOINs in donor search, donation history      |

---

## ER Diagram

```
users ──1:1──> donors ──1:N──> donations <──N:1── blood_requests
  │                  │
  │                  └──1:N──> badges
  │
  └──1:N──> notifications
  └──1:N──> blood_requests (as hospital)
```

**Key Relationships:**
- A **user** with role `donor` has one **donors** record
- A **user** with role `hospital` can create many **blood_requests**
- A **donor** can make many **donations** to different **requests**
- **Badges** are earned automatically via triggers (1, 5, 10 donations)

---

## Screenshots

> *Screenshots to be added after deployment.*

---

## License

This project is built for educational purposes as a DBMS university project.
