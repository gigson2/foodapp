# Dashboard Date Range Report

Date: 2026-05-03

## Scope

Added responsive date-range filtering to:

- Admin dashboard overview
- Customer dashboard overview

## Default Range Behavior

- Admin dashboard defaults to the past 4 days
- Customer dashboard defaults to the past 2 days

Both ranges include the current day.

## Backend Changes

- Admin dashboard endpoint now accepts:
  - `date_from`
  - `date_to`
- Customer dashboard endpoint now accepts:
  - `date_from`
  - `date_to`
- Admin dashboard data now filters:
  - order metrics
  - recent orders
  - status breakdown
  - cash sales series
  - popular foods
  - pending reviews
  - visitor activity summary
- Customer dashboard data now filters:
  - order metrics
  - status breakdown
  - recent orders

The applied normalized range is also returned by both APIs.

## Frontend Changes

- Added responsive date inputs on both dashboard overview pages
- Added reset actions:
  - admin: reset to past 4 days
  - customer: reset to past 2 days
- Updated dashboard cards to reflect range-based summaries
- Filtered customer dashboard recent notifications and reviews display to the selected range
- Added empty-state handling for admin dashboard widgets when a selected range has no matching data

## Files Updated

- `app/Services/DashboardMetricsService.php`
- `app/Http/Controllers/Api/Admin/DashboardController.php`
- `app/Http/Controllers/Api/Customer/DashboardController.php`
- `resources/js/admin/services/adminDashboardService.ts`
- `resources/js/admin/hooks/useAdminDashboardMetrics.ts`
- `resources/js/admin/types/adminDashboard.ts`
- `resources/js/admin/pages/AdminDashboardPage.tsx`
- `resources/js/admin/components/dashboard/RecentOrdersWidget.tsx`
- `resources/js/admin/components/dashboard/PopularFoodsWidget.tsx`
- `resources/js/admin/components/dashboard/PendingReviewsWidget.tsx`
- `resources/js/customer/services/customerPortalService.ts`
- `resources/js/customer/types/customerPortal.ts`
- `resources/js/customer/pages/CustomerOverviewPage.tsx`

## Verification

Passed:

- `npm.cmd run typecheck`
- `npm.cmd run lint`
- `php artisan test`

## QA Checklist

### Admin

1. Open `/admin/dashboard/overview`
2. Confirm the default range shows the past 4 days
3. Change `From` and `To`
4. Confirm KPI values, charts, recent orders, best movers, pending reviews, and visitor summary update
5. Confirm the layout remains usable on desktop, tablet, and mobile

### Customer

1. Open `/customer/dashboard`
2. Confirm the default range shows the past 2 days
3. Change `From` and `To`
4. Confirm KPI values, chart, recent orders, and dashboard notification/review summaries update
5. Confirm the layout remains usable on desktop, tablet, and mobile
