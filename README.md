# JobPilot

**Resume Builder + Job Application Tracker**

Build standout resumes, track every application, and land your next job.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Team](#team)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [API Documentation](#api-documentation)
- [Scripts](#scripts)

---

## Overview

JobPilot is a full-stack web application built as a college group project. It combines a powerful resume builder with a job application tracker, interview manager, and ATS score checker — giving job seekers a single place to manage their entire job search.

---

## Features

| Feature | Description |
|---|---|
| **Resume Builder** | Split-screen editor with live preview, 5 templates, 8 colour themes, 3 fonts, section reordering, and named version snapshots |
| **Job Application Tracker** | Kanban board with 6 pipeline stages (Wishlist → Applied → Interview → Offer → Rejected → Withdrawn), drag-and-drop, list view, filters |
| **Job URL Importer** | Paste a job posting URL — Cheerio scrapes JSON-LD, OG tags, and domain fallback to auto-fill the application form |
| **ATS Score Checker** | Pure text keyword matching between a resume version and a job description — no AI API needed |
| **Interview Management** | Schedule interviews, manage prep topic checklists, 24h email reminders via Nodemailer, post-interview check-in flow |
| **Dashboard** | Application stats, pipeline charts, interview outcome charts, overdue alerts, activity feed |
| **PDF Export** | Server-side PDF generation from resume content using PDFKit |
| **User Settings** | Profile update, password change, email notification preferences, account deletion |

---

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 18 + Vite | UI framework and build tool |
| TailwindCSS | Utility-first styling |
| React Router v6 | Client-side routing |
| @dnd-kit | Drag-and-drop for Kanban board |
| Recharts | Dashboard charts |
| react-hot-toast | Toast notifications |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express.js | REST API server |
| PostgreSQL | Relational database |
| pg (node-postgres) | Database client |
| bcryptjs | Password hashing |
| jsonwebtoken | JWT authentication |
| node-cron | Scheduled jobs (email reminders, check-in detection) |
| Nodemailer | Interview reminder emails |
| PDFKit | Server-side PDF generation |
| Cheerio + axios | Job URL scraping |
| express-rate-limit | Auth rate limiting |
| express-validator | Input validation |
| xss | XSS sanitisation |

---

## Team

| Name | Role |
|---|---|
| **Kaji** | Product Coordinator — Backend + Complex Full-Stack |
| **Miraj** | Backend + Moderate Frontend |
| **Sani** | Frontend UI Components |

---

## Project Structure

```
JobPilot/
├── client/                     # React + Vite frontend
│   └── src/
│       ├── components/
│       │   ├── layout/         # DashboardLayout, sidebar
│       │   ├── resume/         # Editor, templates, versioning
│       │   ├── tracker/        # Kanban, application cards, modals
│       │   └── ui/             # Shared UI components, skeletons
│       ├── hooks/              # useAuth
│       ├── pages/              # Page components
│       ├── services/           # API service layer
│       └── store/              # Auth context
│
├── server/                     # Express + Node.js backend
│   ├── controllers/            # Route handlers
│   ├── db/
│   │   ├── migrations/         # SQL migration files (01–08)
│   │   ├── migrate.js          # Migration runner
│   │   ├── pool.js             # PostgreSQL connection pool
│   │   └── seed.js             # Test user seed
│   ├── jobs/                   # Cron jobs (email reminder, interview detection)
│   ├── middleware/             # Auth, validation, sanitisation
│   ├── routes/                 # Express route definitions
│   └── utils/                  # ATS scorer, PDF generator, email templates, sanitiser
│
└── docs/
    ├── API.md                  # Full API endpoint reference
    └── schema.md               # Database schema reference
```

---

## Getting Started

### Prerequisites

- Node.js v18+
- PostgreSQL 14+
- npm

### 1. Clone the repository

```bash
git clone https://github.com/kajithebe/JobPilot.git
cd JobPilot
```

### 2. Install dependencies

```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

### 3. Configure environment variables

```bash
cd server
cp .env.example .env
```

Edit `.env` with your values — see [Environment Variables](#environment-variables) below.

### 4. Set up the database

```bash
cd server
npm run migrate
npm run seed      # optional — creates a test user
```

### 5. Run the application

Open two terminals:

```bash
# Terminal 1 — Backend
cd server
npm run dev

# Terminal 2 — Frontend
cd client
npm run dev
```

The app will be available at `http://localhost:5173`.
The API runs at `http://localhost:5000`.

---

## Environment Variables

All variables are in `server/.env`. Copy from `server/.env.example`.

| Variable | Description | Example |
|---|---|---|
| `PORT` | Express server port | `5000` |
| `DB_HOST` | PostgreSQL host | `localhost` |
| `DB_PORT` | PostgreSQL port | `5432` |
| `DB_NAME` | Database name | `jobpilot_db` |
| `DB_USER` | Database user | `postgres` |
| `DB_PASSWORD` | Database password | `yourpassword` |
| `JWT_SECRET` | JWT signing secret (any random string) | `jobpilot_secret_key` |
| `JWT_EXPIRES_IN` | JWT expiry duration | `7d` |
| `SMTP_HOST` | SMTP server host | `smtp.gmail.com` |
| `SMTP_PORT` | SMTP server port | `587` |
| `SMTP_USER` | Sender email address | `you@gmail.com` |
| `SMTP_PASSWORD` | Gmail App Password | `xxxx xxxx xxxx xxxx` |
| `CLIENT_URL` | Frontend origin for CORS | `http://localhost:5173` |

> **Gmail App Password:** Generate one at [https://myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords) — requires 2-Step Verification to be enabled on your Google account.

---

## Database Setup

JobPilot uses 8 PostgreSQL tables:

| Table | Description |
|---|---|
| `users` | Registered user accounts |
| `resumes` | Resume records with JSONB content field |
| `resume_versions` | Immutable named snapshots of a resume |
| `applications` | Job applications with pipeline status |
| `interviews` | Scheduled interviews linked to applications |
| `interview_prep_topics` | Prep checklist items per interview |
| `activities` | Activity log for dashboard feed |
| `email_logs` | Record of all reminder emails sent |

Full schema with column types and constraints: [`docs/schema.md`](docs/schema.md)

---

## API Documentation

Full API reference with request bodies, response examples, and error codes:

**[→ docs/API.md](docs/API.md)**

The API base URL is `http://localhost:5000/api`.
All protected endpoints require `Authorization: Bearer <token>`.

---

## Scripts

```bash
# Backend
npm run dev       # Start development server with nodemon
npm run migrate   # Run all database migrations
npm run seed      # Seed database with test user

# Frontend
npm run dev       # Start Vite development server
npm run build     # Build for production
```

---

## License

MIT — see [LICENSE](LICENSE)
