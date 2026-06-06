# Zu Burger Spot Ordering Demo

A React + Tailwind demo for a fast burger ordering experience with a local order dashboard.

## Features

- Responsive menu browsing with search and category filters
- Add-to-cart flow, quantity controls, and cart summary
- Checkout form with validation and order confirmation
- Admin dashboard displaying saved orders and status updates
- Minimal Node.js backend for static serving and order persistence

## Getting Started

Install dependencies:

```bash
npm install
```

Run the app in development:

```bash
npm run dev
```

This starts Vite for the frontend and the Node backend server in parallel. The frontend proxies `/api` requests to the backend.

## Production Build

Build the frontend:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

Then open `http://localhost:5000`.

## Scripts

- `npm run dev` — start Vite plus backend server
- `npm run web` — start the Vite development server only
- `npm run api` — start only the Node backend server
- `npm run build` — create a production build
- `npm run preview` — preview the production build with Vite
- `npm start` — run the production backend server

## API Routes

- `GET /api/health`
- `GET /api/orders`
- `POST /api/orders`

## Notes

Orders are saved to `server/data/orders.json` in production and to local storage for the demo storefront.
