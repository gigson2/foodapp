# Testing Guide

## Phase 1 automated checks

Run:

```powershell
php artisan route:list
php artisan test
npm.cmd run typecheck
npm.cmd run build
```

## Manual QA checklist for this phase

- Load `/` and confirm the React storefront renders.
- Toggle dark, light, and system theme modes.
- Refresh the page and confirm the theme preference persists.
- Navigate to `/customer` and `/admin`.
- Open the application in DevTools and confirm `manifest.webmanifest` is linked.
- Confirm `sw.js` registers without console errors.
- Disable network in DevTools and verify `/offline.html` is available.

## Phase 2+ planned automated tests

- Registration and login flows.
- Admin access denial for customers.
- Food and category CRUD validation.
- Order creation, pricing, and state transitions.
- Notification creation and read-state behavior.
- Visitor analytics event capture.
- Dashboard metrics aggregation.

## Regression rule

Every phase should leave both of these green before moving on:

- `php artisan test`
- `npm.cmd run build`
