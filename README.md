# Облік пального (FuelControl)

Web application for tracking diesel fuel: fuel tanks (barrels), fuel receipts, fuelings, diesel sales, per-car monthly limits and an accounting report.

> **Note:** fuelings (`fuel_events` table) are inserted into the database by an external third-party script. This project reads, edits, deactivates and reports on them, but does not create them.

## Main features

- **Fuel tanks** – MAIN tanks with optional connected ("euro") tanks; live balance, fill level, warning threshold and weighted average price. Only MAIN tanks are accessible: opening a non-MAIN tank URL (directly or after a refresh) redirects to its MAIN tank (or the first MAIN tank).
- **Receipts** – add, edit (price, payment method, paid flag), deactivate/restore and delete tank refills.
- **Fuelings** – list with date range / card / station filters, edit and deactivate; the home page lets fuelers assign a card or a sale amount to fuelings that need it.
- **Accounting report** – write-off and diesel sales statistics for a period, printable.
- **Car limits** – monthly liter limits per license plate with progress.
- **Admin panel** – users, tanks (main/connected), cards, limits and deactivated records.
- **Roles** – `admin`, `fueler`, `accountant` (enforced on both client and server).

## Tech stack

- **Client:** React 18, Create React App, Redux Toolkit, React Router 7, Chakra UI 3, axios, react-datepicker, react-to-print
- **Server:** Node.js (ESM), Express, mysql2, JSON Web Tokens, bcryptjs
- **Database:** MySQL-compatible (TiDB Cloud), connected over TLS

## Project structure

```
client/   React SPA (pages, components, redux slices/thunks, utils, hooks)
server/   Express REST API (routes -> controllers -> MySQL), auth middleware, helpers
```

## Setup

Requirements: Node.js 20+ and npm.

```bash
# server
cd server
npm install
cp .env.example .env   # fill in JWT secret and database credentials

# client
cd ../client
npm install
cp .env.example .env   # optional, only if the API is not on http://localhost:3001/api
```

### Environment variables

| Server (`server/.env`)                                | Description                                                       |
| ----------------------------------------------------- | ----------------------------------------------------------------- |
| `JWT_SECRET`                                          | **Required.** Secret used to sign auth tokens                     |
| `JWT_EXPIRES_IN`                                      | Token lifetime (default `90d`)                                    |
| `PORT`                                                | API port (default `3001`)                                         |
| `CORS_ORIGINS`                                        | Comma-separated allowed origins (default `http://localhost:3000`) |
| `DATABASE_HOST`, `DATABASE_PORT`                      | Database host and port (TiDB Cloud uses `4000`)                   |
| `DATABASE_USER`, `DATABASE_PASSWORD`, `DATABASE_NAME` | Database credentials                                              |
| `DATABASE_SSL`                                        | TLS connection (default `true`, set `false` for local MySQL)      |

| Client (`client/.env`) | Description                                        |
| ---------------------- | -------------------------------------------------- |
| `REACT_APP_API_URL`    | API base URL (default `http://localhost:3001/api`) |

## Running

```bash
# API (http://localhost:3001)
cd server
npm run dev      # with auto-reload (nodemon)
npm start        # production

# Client (http://localhost:3000)
cd client
npm start
```

## Build

```bash
cd client
npm run build            # production build into client/build
```

## Test Accounts

Use the following credentials to log in and test the application:

| Role       | Username     | Password        |
| ---------- | ------------ | --------------- |
| Fueler     | `fueler`     | `fueler123`     |
| Accountant | `accountant` | `accountant123` |
