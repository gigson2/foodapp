# Frontend Experience Overview

The frontend is a single React SPA served by Laravel and split into public, customer, and admin experiences.

## Public storefront

- database-backed menu and category browsing
- responsive ordering flow
- pickup-only messaging
- review display
- company and contact information driven by company settings

## Customer module

- authenticated route tree under `/customer`
- dashboard metrics and order history
- profile, notifications, and reviews

## Admin module

- authenticated route tree under `/admin`
- lazy-loaded pages
- responsive navigation
- modal-driven CRUD and quick-view flows

## Shared frontend behaviors

- TanStack Query for server-state fetching and invalidation
- Axios client with CSRF bootstrap and network retry handling
- route-level error boundaries and hydration fallbacks
- dynamic document branding from company settings
- shared footer branding across all app surfaces

## PWA surface

- `manifest.webmanifest`
- `service-worker.js`
- `offline.html`

The service worker caches shell assets and offline fallback content but does not cache API responses.
