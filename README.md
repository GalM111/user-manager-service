# User Manager Service

Node.js service that stores and serves enriched user profiles. The app exposes a REST API built on Express, persists data in MongoDB via Mongoose, and ships with a lightweight static UI (in `public/`) for quickly exercising the endpoints.

## Features
- CRUD operations for user profile data, including liked/disliked content tracking.
- Email-based lookup endpoint optimized for client applications.
- Simple `/health` probe for uptime monitoring.
- Static HTML app for manual testing without Postman or curl.
- Environment-driven configuration via `.env`.

## Tech Stack
- Node.js + Express 5
- MongoDB with Mongoose ODM
- CORS-enabled API
- Vanilla HTML/CSS/JS frontend served from Express

## Project Structure
```
.
├── controllers/        # Route handlers (business logic)
├── models/             # Mongoose schemas and models
├── routes/             # API route definitions
├── public/             # Static UI bundled with the server
├── mock_user.json      # Sample payload you can import for quick testing
├── server.js           # Application entrypoint
├── package.json        # Scripts and dependencies
└── .env                # Local configuration (not committed)
```

## Prerequisites
- Node.js 18+ (matches what Render/modern environments expect)
- npm 9+
- MongoDB instance with credentials/connection string you control

## Environment Variables
Create a `.env` file in the project root with at least:

```
DB_URI=mongodb+srv://<user>:<password>@<cluster>/<db>?retryWrites=true&w=majority
PORT=5001
```

Never commit secrets—use your own values locally or configure them via your host (Render, etc).

## Installation & Local Development
```bash
npm install          # install dependencies
npm run dev          # start with nodemon + live reload
# or
npm start            # plain node server.js
```

The server boots on `http://localhost:5001` by default and automatically serves the static UI. Point a browser to that URL to open the dashboard; it proxies API requests to the same origin.

### Connecting to MongoDB
1. Spin up a MongoDB instance (Atlas, Docker, local `mongod`, etc.).
2. Set `DB_URI` in `.env`.
3. Start the server—Mongoose logs “MongoDB connected” on success.

If you need seed data, import `mock_user.json` or craft a POST request as shown below.

## API Reference
All routes are prefixed with `/api` (see `routes/userDataRoutes.js`).

| Method | Path                         | Description |
|--------|-----------------------------|-------------|
| GET    | `/health`                   | Returns `{ status: "Server is running" }`. Useful for smoke tests. |
| POST   | `/api/userdata`             | Create a new user. Requires `name` & `email`. Optional: `assets[]`, `investorType`, `contentType[]`. |
| GET    | `/api/userdata`             | Fetch every stored user document. |
| GET    | `/api/userdata/email?email=`| Lookup a single user by email (query string parameter). |
| GET    | `/api/userdata/:id`         | Fetch a user by MongoDB document ID. |
| PUT    | `/api/userdata/:id`         | Update provided fields. `likedContent` and `dislikedContent` append new items without overwriting existing entries. |
| DELETE | `/api/userdata/:id`         | Delete a user by ID. Returns the removed document for confirmation. |

### Sample Requests
```bash
# Create
curl -X POST http://localhost:5001/api/userdata \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Ada Lovelace",
    "email": "ada@example.com",
    "assets": ["stocks", "bonds"],
    "investorType": "retail",
    "contentType": ["video", "newsletter"]
  }'

# Lookup by email
curl "http://localhost:5001/api/userdata/email?email=ada@example.com"

# Append liked content
curl -X PUT http://localhost:5001/api/userdata/<id> \
  -H "Content-Type: application/json" \
  -d '{ "likedContent": ["deep-dive-123"] }'
```

### User Schema
Defined in `models/UserData.js`:
- `name` *(String, required)*
- `email` *(String, required, unique)*
- `assets` *(String[], default `[]`)*
- `investorType` *(String, optional)*
- `contentType` *(String[], default `[]`)*
- `likedContent`, `dislikedContent` *(Array, optional, appended with `$addToSet`)*
- `createdAt` *(Date, default `Date.now`)*

Mongoose enforces validation and unique emails; errors bubble up as JSON responses with proper status codes.

## Frontend Companion
- Served automatically from `/public`.
- `public/index.html` includes forms to create users, fetch a user by email, and refresh the full list.
- `public/app.js` consumes the REST API using `fetch`.
- Helpful for demos or manual QA without external tooling.

## Development Tips
- Nodemon reloads on every change when running `npm run dev`.
- Use the `/health` route for Render/Kubernetes probes.
- Keep controller logic in `controllers/userDataController.js`—add new actions there and wire them up via `routes/userDataRoutes.js`.
- Remember to update the README/API docs when adding new routes or schema fields.

## Future Enhancements
- Input validation layer (e.g., `express-validator`) for richer error messages.
- Pagination/filtering for `GET /api/userdata`.
- Authentication/authorization if exposed publicly.
- Automated tests (replace the placeholder `npm test` script).

---
Need help or want to contribute? Open an issue or submit a PR—this README is the place to document any new behavior you add.

