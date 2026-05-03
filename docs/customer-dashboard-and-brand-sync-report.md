# Customer Dashboard And Brand Sync Report

Date: 2026-05-03

## Scope Completed

This pass completed four related areas:

1. Browser title and storefront branding now read from database-backed company settings.
2. Static storefront business copy was reduced or replaced with dynamic company/address data.
3. A real route-based customer dashboard was added, backed by database/API data instead of local mock-only state.
4. Authenticated web-push subscription handling was completed so admin and customer notification flows can use the installed `minishlink/web-push` integration.

## 1. Dynamic Company Branding

Updated:

- `resources/views/app.blade.php`
- `resources/js/app.tsx`
- `resources/js/utils/company.ts`

Changes:

- Browser tab title now uses the saved company name only.
- Blade fallback metadata now reads company name, address, and description from `company_settings`.
- The React app now syncs the browser tab title and favicon from live company settings without requiring a full reload.

Result:

- The browser tab title is no longer hard-coded.
- Branding updates are now aligned with the data stored in the database.

## 2. Storefront Company Data Cleanup

Updated:

- `resources/js/components/layout/AppShell.tsx`
- `resources/js/components/home/HeroSection.tsx`
- `resources/js/components/home/AboutSection.tsx`
- `resources/js/components/home/ContactSection.tsx`
- `resources/js/components/home/PickupHowItWorksSection.tsx`
- `resources/js/components/layout/DesktopHeader.tsx`
- `resources/js/components/layout/TabletHeader.tsx`
- `resources/js/components/reviews/ReviewsSection.tsx`
- `resources/js/components/reviews/LeaveReviewModal.tsx`
- `resources/js/components/ordering/CustomerDetailsModal.tsx`
- `resources/js/components/menu/FoodOrderModal.tsx`
- `resources/js/services/publicService.ts`

Changes:

- Public storefront brand name now comes from `company_settings.company_name`.
- Public pickup address and location labels now come from `company_settings.address`.
- About and tagline content now read from `company_settings.about` and `company_settings.tagline`.
- Remaining visible hard-coded company/location copy in the storefront was converted to dynamic or neutral wording.
- Public food/category/logo/favicon image URLs now include cache-busting based on `updated_at`.

Result:

- The storefront no longer depends on hard-coded company identity for its main visible business copy.

## 3. Customer Dashboard Conversion To Real Route Pages

Added:

- `resources/js/customer/CustomerApp.tsx`
- `resources/js/customer/routes/customerRoutes.tsx`
- `resources/js/customer/layout/CustomerLayout.tsx`
- `resources/js/customer/layout/CustomerHeader.tsx`
- `resources/js/customer/layout/CustomerSidebar.tsx`
- `resources/js/customer/layout/CustomerMobileBottomNav.tsx`
- `resources/js/customer/layout/CustomerMobileDrawer.tsx`
- `resources/js/customer/layout/CustomerContentShell.tsx`
- `resources/js/customer/layout/navigation.ts`
- `resources/js/customer/components/RequireCustomer.tsx`
- `resources/js/customer/pages/CustomerOverviewPage.tsx`
- `resources/js/customer/pages/CustomerOrdersPage.tsx`
- `resources/js/customer/pages/CustomerNotificationsPage.tsx`
- `resources/js/customer/pages/CustomerProfilePage.tsx`
- `resources/js/customer/pages/CustomerReviewsPage.tsx`
- `resources/js/customer/services/customerPortalService.ts`
- `resources/js/customer/types/customerPortal.ts`

Updated:

- `resources/js/routes/index.tsx`
- `resources/js/components/layout/AppShell.tsx`

New customer routes:

- `/customer/dashboard`
- `/customer/orders`
- `/customer/notifications`
- `/customer/reviews`
- `/customer/profile`

Behavior:

- `/customer` now redirects to `/customer/dashboard`
- customer users are protected by frontend route guard UX
- admin users attempting customer pages are redirected to `/admin`
- customer pages are responsive for desktop, tablet, and mobile
- orders page uses `react-data-table-component`
- overview page uses `echarts-for-react`

Database/API-backed customer data now includes:

- dashboard metrics
- real orders
- real notifications
- real customer profile
- real submitted reviews
- real password update
- real push-subscription save

## 4. Customer Backend API Additions

Added:

- `app/Http/Controllers/Api/Customer/DashboardController.php`
- `app/Http/Controllers/Api/Customer/ProfileController.php`
- `app/Http/Controllers/Api/Customer/ReviewController.php`
- `app/Http/Requests/Customer/UpdateCustomerProfileRequest.php`
- `app/Http/Requests/Customer/UpdateCustomerPasswordRequest.php`
- `app/Http/Requests/Customer/StoreReviewRequest.php`

Updated:

- `routes/api.php`
- `app/Http/Resources/UserResource.php`

New customer API endpoints:

- `GET /api/customer/dashboard`
- `GET /api/customer/profile`
- `PUT /api/customer/profile`
- `PUT /api/customer/profile/password`
- `GET /api/customer/reviews`
- `POST /api/customer/reviews`

Other API changes:

- added authenticated `POST /api/push-subscriptions`
- added public `GET /api/reviews` for approved storefront reviews

## 5. Web Push Notification Flow

Backend already had:

- `App\Notifications\Channels\WebPushChannel`
- `App\Services\WebPushService`
- `minishlink/web-push`

This pass completed the role-side wiring:

Updated:

- `app/Notifications/AdminReviewSubmittedNotification.php`
- `app/Notifications/CustomerReviewModeratedNotification.php`
- `resources/js/admin/pages/AdminPwaSettingsPage.tsx`
- `resources/js/components/layout/AppShell.tsx`

Current notification behavior:

- when a customer places an order:
  - admin users receive database notification
  - admin users also receive web-push notification if they enabled notifications and registered a subscription
- when admin updates order status:
  - that specific customer receives database notification
  - that specific customer also receives web-push notification if subscribed
- when a customer submits a review:
  - admin users receive database notification
  - admin users also receive web-push review notification if subscribed
- when admin moderates a review:
  - that specific customer receives database notification
  - that specific customer also receives web-push review-status notification if subscribed

## 6. Storefront Review Data

Added:

- `app/Http/Controllers/Api/Public/ReviewController.php`

Updated:

- `resources/js/services/publicService.ts`
- `resources/js/components/layout/AppShell.tsx`
- `resources/js/admin/pages/AdminReviewsPage.tsx`
- `resources/js/services/publicContentSync.ts`

Result:

- public storefront approved reviews now come from the database
- admin review moderation now invalidates and cross-tab refreshes public review data

## 7. Live Refresh Behavior

This pass preserved the earlier cross-tab refresh work and extended it:

- foods
- categories
- company settings
- reviews

So storefront content updates now appear without manual refresh when those public-facing records are changed from admin.

## Verification

Passed:

- `npm.cmd run typecheck`
- `npm.cmd run lint`
- `npm.cmd run build`
- `php artisan test`
- `php artisan view:cache`

## How To Test

### Branding

1. Change company name in admin company settings.
2. Confirm the browser tab title changes to the saved company name only.
3. Confirm the storefront header/logo/company copy follows the saved values.

### Customer dashboard

1. Sign in as a customer.
2. Open:
   - `/customer/dashboard`
   - `/customer/orders`
   - `/customer/notifications`
   - `/customer/reviews`
   - `/customer/profile`
3. Confirm the data comes from the database, not local mock placeholders.

### Review flow

1. Sign in as a customer with real order history.
2. Submit a review from the storefront.
3. Confirm:
   - the admin reviews page receives the new pending review
   - the customer reviews page shows the submitted review
4. Approve the review in admin.
5. Confirm the public storefront reviews section updates without manual refresh.

### Push notifications

1. Enable notifications in:
   - storefront/customer account
   - admin PWA settings
2. Place a customer order.
3. Confirm the admin receives the new order notification.
4. Update order status in admin.
5. Confirm the specific customer receives the status update notification.

## Remaining Note

The production build passes, but the main frontend bundle is still large. A later optimization pass should split admin and customer routes more aggressively with lazy-loaded page chunks.
