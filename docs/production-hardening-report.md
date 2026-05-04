# Production Hardening Report

Date: 2026-05-03

## Scope Completed

- Removed dead frontend route/page code that was no longer mounted.
- Added route-level lazy loading for admin and customer pages to reduce initial JS load.
- Hardened customer order creation against duplicate submissions.
- Tightened food/category duplicate protection.
- Normalized phone numbers on backend profile/register flows.
- Added admin customer password reset to default temporary password `n.password1`.
- Added analytics date-range filtering and oldest-30-days cleanup flow.
- Updated the production seeder to keep only:
  - one admin user
  - company settings
  - food/menu data
  - categories
  - SEO settings
  - admin notification preferences
- Cleared demo customers, orders, reviews, visitor analytics seed data, and push subscriptions from seed output.
- Re-seeded the database fresh at the end.

## Security / Data Integrity Changes

### Auth and identity

- Backend phone values are now normalized consistently before validation and save:
  - `app/Support/PhoneNumber.php`
  - `app/Http/Requests/Auth/RegisterRequest.php`
  - `app/Http/Requests/Customer/UpdateCustomerProfileRequest.php`
  - `app/Http/Requests/Admin/UpdateAdminProfileRequest.php`
  - `app/Http/Controllers/Api/Auth/LoginController.php`

- Customer order detail access is now explicitly limited to the authenticated owner only:
  - `app/Http/Controllers/Api/Customer/OrderController.php`

### Duplicate prevention

- Orders now use a `submission_key` and recent-duplicate detection:
  - `database/migrations/2026_05_03_210000_harden_orders_foods_and_categories.php`
  - `app/Models/Order.php`
  - `app/Http/Requests/Customer/StoreOrderRequest.php`
  - `app/Services/OrderService.php`

- Food and category names now have both validation-level and database-level uniqueness protection:
  - `app/Http/Requests/Admin/StoreFoodRequest.php`
  - `app/Http/Requests/Admin/UpdateFoodRequest.php`
  - `app/Http/Requests/Admin/StoreCategoryRequest.php`
  - `app/Http/Requests/Admin/UpdateCategoryRequest.php`
  - `database/migrations/2026_05_03_210000_harden_orders_foods_and_categories.php`

### Rate limiting

- Added dedicated rate limiters for:
  - login
  - registration
  - customer order creation

Files:
- `app/Providers/AppServiceProvider.php`
- `routes/api.php`

### Order workflow protection

- Order status transitions are now enforced server-side:
  - received -> processing or cancelled
  - processing -> ready_for_pickup
  - ready_for_pickup -> completed
  - completed/cancelled are terminal

Files:
- `app/Services/OrderService.php`
- `app/Http/Controllers/Api/Admin/OrderStatusController.php`

## Admin Additions

### Customer password reset

- Admin can now view a customer and reset that customer password to `n.password1`.
- The customer’s Sanctum tokens are revoked on reset.

Files:
- `app/Http/Controllers/Api/Admin/CustomerController.php`
- `routes/api.php`
- `resources/js/admin/services/adminCustomerService.ts`
- `resources/js/admin/types/adminCustomer.ts`
- `resources/js/admin/pages/AdminCustomersPage.tsx`

### Analytics controls

- Admin analytics page now supports:
  - default last 7 days
  - custom date range
  - clear-oldest-30-days confirmation flow

Files:
- `app/Services/AdminAnalyticsService.php`
- `app/Http/Controllers/Api/Admin/AnalyticsController.php`
- `app/Http/Controllers/Api/Admin/VisitorController.php`
- `resources/js/admin/services/adminAnalyticsService.ts`
- `resources/js/admin/pages/AdminAnalyticsPage.tsx`

## Frontend / UX Hardening

- Disabled repeat submit behavior on:
  - storefront login/register
  - customer details modal
  - food order modal

Files:
- `resources/js/components/auth/FrontendLoginModal.tsx`
- `resources/js/components/ordering/CustomerDetailsModal.tsx`
- `resources/js/components/menu/FoodOrderModal.tsx`
- `resources/js/components/layout/AppShell.tsx`

- Public content queries now use longer cache freshness to help slower connections:
  - `resources/js/components/layout/AppShell.tsx`

- Dark-theme select dropdown option text is now forced readable:
  - `resources/js/styles/app.css`

## Cleanup / Bundle Reduction

- Added lazy-loaded route pages:
  - `resources/js/routes/index.tsx`
  - `resources/js/admin/routes/adminRoutes.tsx`
  - `resources/js/customer/routes/customerRoutes.tsx`

- Removed dead frontend files under:
  - `resources/js/pages/admin/*` except `AdminLoginPage.tsx`
  - `resources/js/pages/customer/CustomerDashboardPage.tsx`
  - `resources/js/services/customerDashboardService.ts`

## Seeder Result

Fresh seeded admin credentials:

- phone: `+16462503361`
- password: `a.password!`

Seed keeps:

- admin user
- company settings
- categories
- foods
- SEO settings
- admin notification preference

Seed does not keep:

- demo customers
- demo orders
- demo reviews
- demo visitor analytics
- demo push subscriptions

Seeder file:
- `database/seeders/RestaurantPlatformSeeder.php`

## Regression Tests Added / Updated

- Added:
  - `tests/Feature/Customer/CustomerOrderDeduplicationTest.php`
  - `tests/Feature/Admin/AdminCustomerPasswordResetTest.php`

- Updated:
  - `tests/Feature/Auth/SessionAuthenticationTest.php`
  - `tests/Feature/Admin/AdminPhoneLoginTest.php`
  - `tests/Feature/Admin/AdminOrderManagementTest.php`

## Verification Completed

- `npm.cmd run typecheck`
- `npm.cmd run lint`
- `php artisan test`
- `npm.cmd run build`
- `php artisan view:cache`
- `php artisan migrate:fresh --seed`

## Remaining Note

- Build is clean, but ECharts still contributes a large admin chunk. Route-level lazy loading reduced initial load pressure, but further chunk-splitting inside the chart/table layer would be the next optimization pass if needed.
