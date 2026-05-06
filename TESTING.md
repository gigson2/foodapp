# Testing Guide

This repository already contains backend feature coverage for the main production flows and frontend quality gates for linting, type safety, and builds.

## Automated checks

Run the full standard verification set:

```powershell
php artisan test
npm.cmd run lint
npm.cmd run typecheck
npm.cmd run build
```

## Current backend coverage

The feature tests in `tests/Feature` cover:

- session authentication
- admin phone login
- password recovery
- admin dashboard access
- admin order management
- admin food management
- admin customer password reset
- customer order listing
- customer duplicate-order protection
- public payload exposure boundaries

## Recommended release gate

Treat a release as blocked if any of the following fail:

- `php artisan test`
- `npm run lint`
- `npm run typecheck`
- `npm run build`

## Manual QA checklist

### Storefront

- homepage loads without console errors
- menu, categories, reviews, and company settings load from the API
- ordering modal works on mobile and desktop
- offline fallback loads when navigation is attempted without network
- favicon, title, and SEO metadata reflect database content

### Authentication

- customer registration succeeds
- customer login succeeds
- admin login succeeds
- logout clears the session cleanly
- password recovery request and reset succeed

### Customer portal

- dashboard metrics load
- orders list and order details load
- notifications mark-read flows work
- profile update and password change work
- review submission works

### Admin console

- dashboard overview loads with charts and queue widgets
- orders table loads and order quick view modal works
- menu modal add and edit flows work
- category modal add and edit flows work
- SEO modal add and edit flows work
- company settings save correctly
- reviews moderation works
- notification broadcast works

### Push notifications

- browser permission prompt appears when expected
- subscription is saved after permission is granted
- test notification reaches the device
- clicking a notification opens the intended app route

## Environment-specific checks

Before a production release, also verify:

- HTTPS cookies behave correctly on the real domain
- `SANCTUM_STATEFUL_DOMAINS` and CORS settings match the deployment hostnames
- mail delivery works from the live environment
- queue worker and scheduler are running
