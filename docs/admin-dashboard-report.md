# Admin Dashboard Report

## Scope

The admin side has been rebuilt from a single console page into a route-based dashboard application inside the existing SPA.

## Route Structure

Implemented admin routes:
- `/admin/login`
- `/admin`
- `/admin/orders`
- `/admin/orders/:orderId`
- `/admin/foods`
- `/admin/foods/new`
- `/admin/foods/:foodId/edit`
- `/admin/categories`
- `/admin/categories/new`
- `/admin/categories/:categoryId/edit`
- `/admin/customers`
- `/admin/visitors`
- `/admin/settings/company`
- `/admin/settings/seo`
- `/admin/notifications`

Updated router:
- [resources/js/routes/index.tsx](/c:/xampp/htdocs/iddrissa/resources/js/routes/index.tsx:1)

## Admin Shell

Created:
- [resources/js/components/admin/AdminLayout.tsx](/c:/xampp/htdocs/iddrissa/resources/js/components/admin/AdminLayout.tsx:1)
- [resources/js/components/admin/AdminMetricCard.tsx](/c:/xampp/htdocs/iddrissa/resources/js/components/admin/AdminMetricCard.tsx:1)
- [resources/js/components/admin/AdminPageHeading.tsx](/c:/xampp/htdocs/iddrissa/resources/js/components/admin/AdminPageHeading.tsx:1)
- [resources/js/components/admin/AdminTableCard.tsx](/c:/xampp/htdocs/iddrissa/resources/js/components/admin/AdminTableCard.tsx:1)
- [resources/js/pages/admin/AdminLoginPage.tsx](/c:/xampp/htdocs/iddrissa/resources/js/pages/admin/AdminLoginPage.tsx:1)
- [resources/js/pages/admin/AdminRouteLayout.tsx](/c:/xampp/htdocs/iddrissa/resources/js/pages/admin/AdminRouteLayout.tsx:1)

Applied:
- dedicated admin login page
- auth-guarded admin layout
- persistent sidebar navigation
- route-based page rendering with proper URLs
- logout flow and theme toggle inside the admin shell

## Dashboard Pages

Created:
- [resources/js/pages/admin/AdminOverviewPage.tsx](/c:/xampp/htdocs/iddrissa/resources/js/pages/admin/AdminOverviewPage.tsx:1)
- [resources/js/pages/admin/AdminOrdersPage.tsx](/c:/xampp/htdocs/iddrissa/resources/js/pages/admin/AdminOrdersPage.tsx:1)
- [resources/js/pages/admin/AdminOrderDetailPage.tsx](/c:/xampp/htdocs/iddrissa/resources/js/pages/admin/AdminOrderDetailPage.tsx:1)
- [resources/js/pages/admin/AdminFoodsPage.tsx](/c:/xampp/htdocs/iddrissa/resources/js/pages/admin/AdminFoodsPage.tsx:1)
- [resources/js/pages/admin/AdminFoodEditorPage.tsx](/c:/xampp/htdocs/iddrissa/resources/js/pages/admin/AdminFoodEditorPage.tsx:1)
- [resources/js/pages/admin/AdminCategoriesPage.tsx](/c:/xampp/htdocs/iddrissa/resources/js/pages/admin/AdminCategoriesPage.tsx:1)
- [resources/js/pages/admin/AdminCategoryEditorPage.tsx](/c:/xampp/htdocs/iddrissa/resources/js/pages/admin/AdminCategoryEditorPage.tsx:1)
- [resources/js/pages/admin/AdminCustomersPage.tsx](/c:/xampp/htdocs/iddrissa/resources/js/pages/admin/AdminCustomersPage.tsx:1)
- [resources/js/pages/admin/AdminVisitorsPage.tsx](/c:/xampp/htdocs/iddrissa/resources/js/pages/admin/AdminVisitorsPage.tsx:1)
- [resources/js/pages/admin/AdminCompanySettingsPage.tsx](/c:/xampp/htdocs/iddrissa/resources/js/pages/admin/AdminCompanySettingsPage.tsx:1)
- [resources/js/pages/admin/AdminSeoSettingsPage.tsx](/c:/xampp/htdocs/iddrissa/resources/js/pages/admin/AdminSeoSettingsPage.tsx:1)
- [resources/js/pages/admin/AdminNotificationsPage.tsx](/c:/xampp/htdocs/iddrissa/resources/js/pages/admin/AdminNotificationsPage.tsx:1)

Implemented:
- overview metrics and recent orders
- full orders table with status updates
- dedicated order detail page
- food list plus create/edit/archive flows
- category list plus create/edit/delete flows
- customer records page
- visitor analytics page
- company settings edit page
- SEO settings management page
- admin notifications page with mark-read actions

## Data Layer

Updated:
- [resources/js/services/adminService.ts](/c:/xampp/htdocs/iddrissa/resources/js/services/adminService.ts:1)
- [resources/js/types/admin.ts](/c:/xampp/htdocs/iddrissa/resources/js/types/admin.ts:1)
- [resources/js/utils/admin.ts](/c:/xampp/htdocs/iddrissa/resources/js/utils/admin.ts:1)

Added admin frontend support for:
- current admin user
- dashboard metrics
- order detail retrieval
- order status updates
- food create/update/delete
- category create/update/delete
- company settings update
- SEO create/update/delete
- notification mark-read and mark-all-read

## Notes

- The old single-file `AdminConsolePage.tsx` was removed from the active compile path and replaced by the route-based page system.
- Home-page login is now the primary role-aware sign-in flow:
  - admin users are redirected from the public site to `/admin`
  - customer users remain on the storefront and can open `/customer`
- `/admin/login` remains available as a direct admin-only sign-in page.
- Laravel session auth for the SPA now runs through `web` middleware on `/api/login`, `/api/me`, `/api/logout`, and the protected admin/customer API groups.
- Guest `/api/me` requests now return `200` with `{"data": null}` instead of a browser-console `401`, which keeps the storefront session check quiet before sign-in.
- Frontend auth is now unified around a shared session query hook instead of split `session-user` and `admin/me` login state branches.
- Both the storefront sign-in modal and `/admin/login` now verify the session with `/api/me` after `/api/login` before redirecting, so the UI only navigates after the browser is actually authenticated.

## Customer Dashboard

Created:
- [resources/js/pages/customer/CustomerDashboardPage.tsx](/c:/xampp/htdocs/iddrissa/resources/js/pages/customer/CustomerDashboardPage.tsx:1)

Implemented:
- real `/customer` route instead of the old placeholder
- role-aware redirect from the storefront account/login entry
- authenticated customer dashboard using `/api/me`, `/api/customer/orders`, and `/api/customer/notifications`
- fallback support for the existing local pickup identity so the route still works for guest/local flows already stored on the device

## Verification

Passed:
- `npm.cmd run lint`
- `npm.cmd run typecheck`
- `npm.cmd run build`
- `php artisan view:cache`
- `php artisan test`

Auth regression coverage now includes:
- guest `/api/me` returns `data: null`
- admin login establishes a session for `/api/me`
- authenticated admin can access `/api/admin/dashboard`
- logout clears the authenticated session

Build note:
- the Vite build still warns that the main JS chunk is above the default warning threshold, but the build completes successfully.
