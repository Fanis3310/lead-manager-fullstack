<div align="center">

# 📊 Lead Manager

A full-stack lead management dashboard built with Next.js 16, Express, and MongoDB.

[![Next.js](https://img.shields.io/badge/Next.js-16.x-black?logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://react.dev)
[![Tailwind](https://img.shields.io/badge/Tailwind-4.x-06b6d4?logo=tailwindcss)](https://tailwindcss.com)
[![Express](https://img.shields.io/badge/Express-5.x-000?logo=express)](https://expressjs.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?logo=mongodb)](https://mongodb.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6?logo=typescript)](https://typescriptlang.org)

</div>

---

## 📸 Screenshots

<div align="center">

| Light Mode | Dark Mode |
|:----------:|:---------:|
| ![Light Mode](screenshots/light.png) | ![Dark Mode](screenshots/dark.png) |

</div>

---

## ✨ Features

- **Full CRUD** — Create, read, update, and delete leads
- **Live validation** — Email field validates in real-time with red/green indicators
- **Inline editing** — Edit any lead directly in the table without a modal
- **Smart search** — Animated search bar that filters by name, email, or status instantly
- **Dark mode** — System-aware dark/light toggle with smooth CSS transitions
- **Delete confirmation** — Custom modal that requires typing "yes" to confirm
- **Responsive** — Works on desktop, tablet, and mobile
- **Professional UI** — Built with shadcn/ui and Tailwind CSS

---

## 🛠 Tech Stack

| Layer | Technology |
|:------|:-----------|
| **Frontend** | Next.js 16, React 19, TypeScript, Tailwind CSS 4, shadcn/ui |
| **Backend** | Node.js, Express 5, Mongoose 9 |
| **Database** | MongoDB Atlas |
| **Icons** | Lucide React |

---

## 📦 Project Structure

```
lead-manager/
├── backend/                # REST API (Express + Mongoose)
│   ├── server.js           # API server (port 8080)
│   ├── models/
│   │   └── Lead.js         # Mongoose schema
│   ├── .env.example        # Environment template
│   └── package.json
├── frontend/               # Next.js app (port 3000)
│   └── src/
│       ├── app/
│       │   ├── page.tsx           # Main dashboard page
│       │   ├── layout.tsx         # Root layout
│       │   └── globals.css        # Global styles + theme
│       ├── components/
│       │   ├── LeadForm.tsx       # Add lead form
│       │   ├── LeadList.tsx       # Leads table
│       │   └── ui/                # shadcn/ui components
│       ├── lib/
│       │   ├── api.ts             # API service layer
│       │   └── utils.ts           # Utilities
│       └── ...
└── README.md
```

---

## 🔌 API Endpoints

| Method | URL | Description | Example |
|:-------|:----|:------------|:--------|
| `GET` | `/leads` | Fetch all leads (newest first) | `curl http://localhost:8080/leads` |
| `POST` | `/leads` | Add a new lead | `curl -X POST .../leads -d '{"name":"Jane","email":"j@e.com"}'` |
| `PUT` | `/leads/:id` | Update a lead | `curl -X PUT .../leads/<id> -d '{"status":"Engaged"}'` |
| `DELETE` | `/leads/:id` | Remove a lead | `curl -X DELETE .../leads/<id>` |

### Lead Schema

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "status": "New",
  "createdAt": "2026-07-01T12:00:00.000Z"
}
```

**Status values:** `New` | `Engaged` | `Proposal Sent` | `Closed-Won` | `Closed-Lost`

---

## ⚡ Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **MongoDB Atlas** account ([free tier works](https://mongodb.com/atlas))

### 1. Clone the Repo

```bash
git clone https://github.com/Fanis3310/lead-manager-fullstack.git
cd lead-manager-fullstack
```

### 2. Backend Setup

```bash
cd lead-manager/backend
cp .env.example .env
```

Edit `.env` — paste your MongoDB connection string:

```env
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/<db>?retryWrites=true&w=majority
PORT=8080
FRONTEND_URL=http://localhost:3000
```

```bash
npm install
npm run dev
```

> ✅ Backend running at **http://localhost:8080**

### 3. Frontend Setup

Open a **second terminal** from the repo root (`lead-manager-fullstack`):

```bash
cd lead-manager/frontend
npm install
npm run dev
```

> ✅ Frontend running at **http://localhost:3000**

### 4. Open the App

Navigate to **[http://localhost:3000](http://localhost:3000)** — you're ready to manage leads!

### Installed Packages

<details>
<summary><strong>Backend Dependencies</strong></summary>

| Package | Version | Purpose |
|:--------|:--------|:--------|
| `express` | ^5.2.1 | HTTP server |
| `mongoose` | ^9.7.3 | MongoDB ODM |
| `cors` | ^2.8.6 | Cross-origin requests |
| `dotenv` | ^17.4.2 | Environment variables |

</details>

<details>
<summary><strong>Frontend Dependencies</strong></summary>

| Package | Version | Purpose |
|:--------|:--------|:--------|
| `next` | 16.2.9 | React framework |
| `react` | 19.2.4 | UI library |
| `react-dom` | 19.2.4 | React DOM renderer |
| `shadcn` | ^4.12.0 | UI component library |
| `radix-ui` | ^1.6.1 | Headless UI primitives |
| `lucide-react` | ^1.22.0 | Icons |
| `tailwindcss` | ^4 | CSS framework |
| `class-variance-authority` | ^0.7.1 | Variant management |
| `clsx` | ^2.1.1 | Class utilities |
| `tailwind-merge` | ^3.6.0 | Tailwind class merging |
| `tw-animate-css` | ^1.4.0 | Animation utilities |
| `typescript` | ^5 | Type checking |

</details>

---

## 🔧 Environment Variables

| Variable | Description | Default |
|:---------|:------------|:--------|
| `MONGODB_URI` | MongoDB Atlas connection string | *(Required)* |
| `PORT` | Backend API port | `8080` |
| `FRONTEND_URL` | CORS allowed origin | `http://localhost:3000` |

---

## 👤 Author

**Fanis3310** — [GitHub](https://github.com/Fanis3310)

---

<div align="center">

Made with ❤️ for the Lead Manager assessment

</div>
