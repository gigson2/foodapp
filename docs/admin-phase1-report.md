# Admin Frontend Architecture

The admin frontend now exists as a dedicated production module under `resources/js/admin`.

## Module structure

- `AdminApp.tsx` bootstraps the authenticated admin experience
- `routes/adminRoutes.tsx` declares route-level lazy loading
- `layout/*` contains responsive shell components
- `pages/*` contains route screens
- `components/*` contains dashboard widgets and shared admin UI
- `services/*` contains API clients and feature services
- `hooks/*` contains admin-specific hooks

## Current UX patterns

- responsive layout for desktop, tablet, and mobile
- data tables for index pages
- modal-based add, edit, and quick-view flows
- charts for dashboard and analytics pages
- notification surfaces in the shared shell

## Production notes

- the admin experience is live-data backed
- route guards check the current authenticated session
- the UI is built to avoid scroll-dependent forms on high-use pages such as menu, categories, and orders
