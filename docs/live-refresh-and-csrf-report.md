# Live Refresh And CSRF Fix Report

Date: 2026-05-03

## Problem Summary

Two issues were affecting the app:

1. Admin-side content updates did not appear on the storefront until a manual refresh.
2. Admin save actions could fail intermittently with CSRF mismatch errors, or require multiple clicks/retries.

## Root Causes

### 1. Storefront data refresh was tab-local only

The public storefront reads foods, categories, and company settings through React Query.
Admin save pages were invalidating those public query keys, but that only helps inside the same browser tab and the same React Query client instance.

If the admin dashboard and storefront were open in separate tabs, the storefront tab had no signal that content had changed.

### 2. CSRF bootstrap was not centralized for all write requests

The project was only ensuring the Sanctum CSRF cookie around login and logout.
General admin mutations such as food/category/company updates could still hit write endpoints without a fresh CSRF cookie, which caused intermittent `419 CSRF token mismatch` failures.

## Fixes Implemented

### Shared API client hardening

Updated:

- `resources/js/services/apiClient.ts`
- `resources/js/services/sessionService.ts`

Changes:

- Added centralized `ensureCsrfCookie()` in the shared API client.
- Added automatic CSRF bootstrap before `POST`, `PUT`, `PATCH`, and `DELETE` requests.
- Added automatic retry once on `419` after fetching a fresh CSRF cookie.
- Reused the same CSRF helper from session login/logout flow.

Result:

- Admin save actions no longer depend on manual refresh or repeated clicks after session drift.
- CSRF handling is now consistent across login, logout, and normal admin mutations.

### Cross-tab public content sync

Added:

- `resources/js/services/publicContentSync.ts`

Updated:

- `resources/js/components/layout/AppShell.tsx`
- `resources/js/admin/pages/AdminMenuPage.tsx`
- `resources/js/admin/pages/AdminCategoriesPage.tsx`
- `resources/js/admin/pages/AdminCompanySettingsPage.tsx`

Changes:

- Admin pages now publish a lightweight browser event/localStorage signal whenever public-facing content changes.
- The storefront listens for those updates and invalidates the matching React Query keys immediately.

Scopes currently synced:

- `foods`
- `categories`
- `company-settings`

Result:

- If the storefront is open in another tab, food/category/company changes now appear without manual refresh.

### Cache-busted public image URLs

Updated:

- `resources/js/services/publicService.ts`
- `resources/js/types/company.ts`

Changes:

- Public food, category, logo, and favicon URLs now receive a version query parameter based on `updated_at`.
- This prevents stale browser-cached images from continuing to render after content updates.

Result:

- Updated company logo/favicon and public food/category images refresh more reliably without hard reload.

### Pending-state save guards

Updated:

- `resources/js/admin/pages/AdminMenuPage.tsx`
- `resources/js/admin/pages/AdminCategoriesPage.tsx`
- `resources/js/admin/pages/AdminCompanySettingsPage.tsx`
- `resources/js/admin/pages/AdminSeoSettingsPage.tsx`
- `resources/js/admin/pages/AdminProfilePage.tsx`

Changes:

- Save buttons now disable while a mutation is in progress.
- Relevant action buttons in menu/categories also disable while save/delete/archive is active.

Result:

- Prevents repeated accidental submissions and reduces the “click several times” behavior.

## How To Test

### Storefront live refresh

1. Open storefront in one tab.
2. Open admin in another tab.
3. Change:
   - a food record
   - a category record
   - company logo or company text
4. Save from admin.
5. Confirm the storefront updates without manual refresh.

### CSRF stability

1. Sign in to admin.
2. Update food, category, company, SEO, and profile records multiple times.
3. Confirm save actions complete without intermittent `419` CSRF mismatch errors.

### Image refresh

1. Change company logo.
2. Save.
3. Confirm the storefront header logo updates without hard refresh.

## Notes

- These fixes cover the current public data sources already wired through the backend:
  - foods
  - categories
  - company settings
- Reviews on the storefront are still on the older local/mock path, so they are not part of this live-refresh sync scope yet.
