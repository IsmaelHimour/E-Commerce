# ShopSphere Client

This is the React, TypeScript, Vite, and Tailwind CSS frontend for ShopSphere.

## Architecture Decisions

Pages are route-level screens. Each page owns its layout and page-specific interactions.

Components are reusable UI pieces such as product cards, notices, skeleton states, and empty states.

Services contain Axios calls. UI code calls functions like `getProducts`, `addCartItem`, or `getAdminOrders` instead of writing endpoint strings throughout the app.

Hooks coordinate async data loading and refresh behavior. This keeps pages readable and avoids duplicating `useEffect`, loading, and error handling patterns.

Context handles global app state:
- `AuthContext` stores the signed-in user and JWT-backed session behavior.
- `ThemeContext` stores dark mode preference.

Protected routes centralize access control. Customer pages require a logged-in user, while the admin dashboard also requires the `Admin` role.

## Folder Guide

- `components`: shared UI components.
- `context`: React context providers and context definitions.
- `hooks`: custom hooks for API-backed state.
- `layouts`: shared page shell and navigation.
- `pages`: route-level screens.
- `routes`: React Router configuration and route guards.
- `services`: Axios client and API service functions.
- `types`: TypeScript models for API data.
- `utils`: formatting and API error helpers.

## Local Development

Install dependencies:

```powershell
npm install
```

Run the dev server:

```powershell
npm run dev -- --host 127.0.0.1 --port 5173
```

Run linting:

```powershell
npm run lint
```

Create a production build:

```powershell
npm run build
```

## API Connection

The client uses `src/services/api.ts` as the shared Axios instance. It points to:

```text
http://localhost:5298/api
```

The API server must be running before testing catalog, cart, auth, order, or admin features.
