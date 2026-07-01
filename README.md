# Lead Manager

A full-stack web application for managing sales leads. Add new leads with name, email, and status, and view them in a dashboard-style interface.

## Tech Stack

- **Backend:** Node.js, Express, Mongoose
- **Frontend:** Next.js 16, React 19, Tailwind CSS 4, shadcn/ui
- **Database:** MongoDB Atlas

## Project Structure

```
lead-manager/
├── backend/       # REST API (port 8080)
│   ├── server.js
│   ├── models/Lead.js
│   └── .env.example
├── frontend/      # Next.js app (port 3000)
│   └── src/
│       ├── app/
│       ├── components/
│       └── lib/
└── README.md
```

## API Endpoints

| Method | Endpoint        | Description              |
|--------|-----------------|--------------------------|
| GET    | `/leads`        | Get all leads (newest first) |
| POST   | `/leads`        | Create a new lead        |
| PUT    | `/leads/:id`    | Update an existing lead  |
| DELETE | `/leads/:id`    | Delete a lead            |

**Status options:** New, Engaged, Proposal Sent, Closed-Won, Closed-Lost

**Example requests:**

```bash
# Create a lead
curl -X POST http://localhost:8080/leads \
  -H "Content-Type: application/json" \
  -d '{"name":"Jane Doe","email":"jane@example.com","status":"New"}'

# Get all leads
curl http://localhost:8080/leads

# Update a lead
curl -X PUT http://localhost:8080/leads/<id> \
  -H "Content-Type: application/json" \
  -d '{"name":"Jane Smith","email":"jane.smith@example.com","status":"Engaged"}'

# Delete a lead
curl -X DELETE http://localhost:8080/leads/<id>
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

Open `.env` and replace with your MongoDB connection string:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority
PORT=8080
FRONTEND_URL=http://localhost:3000
```

Then:

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

## Features

- Add, edit, and delete leads
- Live email validation
- Inline search (searches by name, email, or status)
- Dark mode with smooth transitions
- Responsive design (mobile-friendly)
- Custom delete confirmation

## Author

[Fanis3310](https://github.com/Fanis3310)

## License

MIT
