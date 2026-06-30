# Lead Management System

A full-stack web application for managing sales leads. Add new leads with name, email, and status, and view them in a dashboard-style interface.

## Tech Stack

- **Backend:** Node.js, Express, Mongoose
- **Frontend:** Next.js, React, Tailwind CSS, shadcn/ui
- **Database:** MongoDB Atlas

## Project Structure

```
lead-management-system/
├── lead-manager/
│   ├── backend/       # REST API (port 8080)
│   └── frontend/      # Next.js app (port 3000)
└── README.md
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/leads` | Get all leads (newest first) |
| POST   | `/leads` | Create a new lead |

**Status options:** New, Engaged, Proposal Sent, Closed-Won, Closed-Lost

**Example request:**

```bash
curl -X POST http://localhost:8080/leads \
  -H "Content-Type: application/json" \
  -d '{"name":"Jane Doe","email":"jane@example.com","status":"New"}'
```

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Atlas account (or local MongoDB)

### Backend

```bash
cd lead-manager/backend
cp .env.example .env
```

Add your MongoDB connection string to `.env`, then:

```bash
npm install
npm run dev
```

API: http://localhost:8080

### Frontend

```bash
cd lead-manager/frontend
npm install
npm run dev
```

App: http://localhost:3000

### Environment Variables

| Variable       | Description               | Default                 |
|----------------|---------------------------|-------------------------|
| `MONGODB_URI`  | MongoDB connection string | Required                |
| `PORT`         | API port                  | `8080`                  |
| `FRONTEND_URL` | CORS allowed origin       | `http://localhost:3000` |

## Author

[Fanis3310](https://github.com/Fanis3310)

## License

MIT
