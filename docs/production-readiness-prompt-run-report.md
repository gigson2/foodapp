# Production Readiness Prompt Run Report

Date: 2026-05-03

## Purpose

This report documents all implementation, hardening, optimization, and validation work completed during this prompt run.

It covers three major streams of work:

1. Storefront SEO and CRM tracking implementation.
2. Storefront sign-in modal production copy cleanup.
3. Production-readiness audit changes across backend, frontend, database, performance, and tests.

## Executive Summary

This prompt run moved the application closer to production in four ways:

- Implemented real storefront visitor tracking for CRM and analytics.
- Connected storefront SEO to database-managed SEO settings.
- Removed or hardened several risky production surfaces, especially public payload exposure and a dead admin password reset API.
- Reduced initial frontend bundle weight with additional route-level lazy loading and improved analytics query/index performance.

The final validation state at the end of the run was:

- Laravel API boot successful.
- Blade compilation successful.
- TypeScript compilation successful.
- Production frontend build successful.
- Full backend test suite successful.
- Composer audit clean.
- Production npm audit clean.

## Architecture Areas Touched

### Backend

- `routes/api.php`
- `app/Providers/AppServiceProvider.php`
- `app/Services/AdminAnalyticsService.php`
- `app/Support/FileUploadService.php`
- `app/Http/Controllers/Api/Admin/CustomerController.php`
- `app/Http/Controllers/Api/Public/*`
- `app/Http/Resources/Public*Resource.php`
- `app/Notifications/*`
- `config/services.php`

### Frontend

- `resources/js/components/layout/AppShell.tsx`
- `resources/js/hooks/useVisitorTracking.ts`
- `resources/js/services/visitorTrackingService.ts`
- `resources/js/components/auth/FrontendLoginModal.tsx`
- `resources/js/routes/index.tsx`
- `resources/js/admin/routes/adminRoutes.tsx`
- `resources/js/customer/routes/customerRoutes.tsx`
- `resources/js/services/publicService.ts`

### Blade / SEO Shell

- `resources/views/app.blade.php`

### Database / Tests

- `database/migrations/2026_05_03_220000_add_analytics_indexes.php`
- `tests/Feature/Admin/AdminCustomerPasswordResetTest.php`
- `tests/Feature/Public/PublicPayloadExposureTest.php`

## Part 1: Storefront SEO and CRM Implementation

### 1. SEO values are now driven by `SeoSetting`

Affected file:

- `resources/views/app.blade.php`

Changes made:

- Added a guarded lookup for `SeoSetting` with `page_key = 'home'`.
- Added fallbacks to existing `CompanySetting` values when SEO rows are missing.
- Replaced static title/description/Open Graph values with SEO-aware values.
- Added conditional `keywords` meta support.
- Allowed `schema_json` in `SeoSetting` to override the default schema block.
- Expanded the fallback JSON-LD schema with company phone, email, and opening hours.

Exact improvements:

- `<title>` now uses `$seoTitle`.
- `<meta name="description">` now uses `$seoDescription`.
- `<meta name="keywords">` is emitted only when populated.
- OG/Twitter image now uses `SeoSetting.og_image` when available.
- JSON-LD now includes `telephone`, `email`, and `openingHoursSpecification` when available.

Risk addressed:

- SEO settings previously existed in admin but were not used on the storefront shell.
- Metadata was effectively hardcoded to company defaults, limiting production SEO control.

Status:

- Applied.

### 2. Visitor tracking service added for storefront CRM/analytics

Affected files:

- `resources/js/services/visitorTrackingService.ts`
- `resources/js/hooks/useVisitorTracking.ts`
- `resources/js/components/layout/AppShell.tsx`

Changes made:

- Added a browser-side visitor tracking service.
- Added a React hook to initialize tracking on mount.
- Wired tracking calls into actual storefront user interactions.

Tracking service behavior:

- Persists a `session_key` in localStorage.
- Captures a landing page once per browser session.
- Detects browser, device type, and platform from user-agent data.
- Posts tracking payloads to `POST /api/visitor-events`.
- Uses fire-and-forget behavior and swallows tracking failures to avoid breaking UX.

Hook behavior:

- Sends a `page_view` once per mount.
- Exposes a stable `trackEvent()` callback for other UI events.

AppShell integration:

- `food_view` when a food item is opened.
- `checkout_started` when a guest begins checkout.
- `order_completed` after successful customer or guest order placement.
- `review_submitted` after successful review submission.

Risk addressed:

- Backend visitor analytics already existed, but the storefront had no frontend tracking implementation.
- Admin analytics and CRM features would otherwise remain incomplete in production.

Status:

- Applied.

## Part 2: Sign-In Modal Production Copy Cleanup

Affected file:

- `resources/js/components/auth/FrontendLoginModal.tsx`

Changes made:

- Removed internal/product-development-facing messaging.
- Replaced it with polished production-ready sign-in copy.

Exact content updates:

- Replaced the body note under the login inputs with:
  - `Welcome back! Sign in to track your orders, leave reviews, and enjoy a faster checkout experience.`
- Replaced modal description text with:
  - `Sign in to manage your orders and enjoy a personalised experience.`

Risk addressed:

- The prior wording exposed implementation behavior and role-specific dashboard logic in a consumer-facing auth modal.
- The content read like staging/demo guidance rather than production UI copy.

Status:

- Applied.

## Part 3: Production Hardening Audit Changes

### 3. Removed dead admin customer password reset endpoint

Affected files:

- `app/Http/Controllers/Api/Admin/CustomerController.php`
- `routes/api.php`
- `resources/js/admin/services/adminCustomerService.ts`
- `tests/Feature/Admin/AdminCustomerPasswordResetTest.php`

Changes made:

- Removed the `resetPassword()` controller method.
- Removed `POST /api/admin/customers/{customer}/reset-password`.
- Removed the unused frontend service method.
- Replaced the prior feature test with a regression test asserting the endpoint is no longer available.

Risk addressed:

- The removed endpoint reset customer passwords to a known hardcoded value.
- It returned the temporary password in the API response.
- Even if hidden in the UI, it remained a live admin capability and an unnecessary production risk.

Status:

- Applied.

Manual follow-up if needed:

- If password reset is still required later, implement a one-time reset flow with expiring tokens or admin-generated temporary secrets that must be rotated immediately.

### 4. Public API payloads split from admin-oriented resources

Affected files:

- `app/Http/Resources/PublicCategoryResource.php`
- `app/Http/Resources/PublicCompanySettingResource.php`
- `app/Http/Resources/PublicFoodResource.php`
- `app/Http/Resources/PublicReviewResource.php`
- `app/Http/Controllers/Api/Public/CategoryController.php`
- `app/Http/Controllers/Api/Public/CompanySettingController.php`
- `app/Http/Controllers/Api/Public/FoodController.php`
- `app/Http/Controllers/Api/Public/ReviewController.php`
- `resources/js/services/publicService.ts`
- `tests/Feature/Public/PublicPayloadExposureTest.php`

Changes made:

- Created dedicated public resources instead of reusing broad admin/resource shapes.
- Updated public controllers to return those public resources.
- Updated frontend public review mapping to stop expecting customer phone in public review responses.
- Added regression coverage to enforce the new payload boundaries.

Fields intentionally no longer exposed publicly:

#### Foods

- `category_id`
- `seo_title`
- `seo_description`
- `created_at`
- `deleted_at`

#### Categories

- `description`
- `sort_order`
- `is_active`
- `foods_count`
- `created_at`

#### Reviews

- `customer_phone`
- `user_id`
- `order_id`
- `food_id`

#### Company Settings

- `created_at`

Risk addressed:

- Public endpoints were returning fields the storefront did not need.
- Review responses exposed customer phone numbers and internal IDs.
- The public API surface was broader than necessary and therefore riskier.

Status:

- Applied.

### 5. Push notification test endpoint is now throttled

Affected files:

- `app/Providers/AppServiceProvider.php`
- `routes/api.php`

Changes made:

- Added a `push-notification-tests` rate limiter.
- Applied the limiter to `POST /api/push-notifications/test`.

Rate limit implemented:

- 5 requests per minute per authenticated user plus IP key.

Risk addressed:

- The push test endpoint is useful operationally, but without a dedicated throttle it could be spammed by authenticated users.

Status:

- Applied.

### 6. Notifications now queue instead of blocking request time

Affected files:

- `app/Notifications/AdminOrderPlacedNotification.php`
- `app/Notifications/CustomerBroadcastMessageNotification.php`
- `app/Notifications/CustomerOrderStatusUpdatedNotification.php`
- `app/Notifications/AdminReviewSubmittedNotification.php`
- `app/Notifications/CustomerReviewModeratedNotification.php`

Changes made:

- All listed notifications now implement `ShouldQueue`.

Risk addressed:

- Notification delivery was part of request-response latency for order placement, status updates, review moderation, and customer broadcast flows.
- Under heavier load, this can slow down checkout/admin actions unnecessarily.

Status:

- Applied.

Manual production step:

- Queue workers must be running in production for this to provide value.

### 7. File uploads no longer trust the client-provided extension

Affected file:

- `app/Support/FileUploadService.php`

Changes made:

- Replaced `getClientOriginalExtension()` with server-detected `$file->extension()`.
- Added a safe fallback to `bin` if no extension is detected.

Risk addressed:

- Public filenames previously trusted the client-declared original extension.
- That is not a safe production assumption, even when request validation requires images.

Status:

- Applied.

### 8. Analytics queries were optimized and database indexes added

Affected files:

- `app/Services/AdminAnalyticsService.php`
- `database/migrations/2026_05_03_220000_add_analytics_indexes.php`

Changes made:

- Replaced repeated `whereDate >=` / `whereDate <=` query patterns with `whereBetween` on timestamp columns where safe.
- Reused common base query builders for visitor sessions, visitor events, and reviews in the analytics service.
- Added indexes for common admin analytics filters.

Indexes added:

- `orders.completed_at`
- `orders(user_id, placed_at)`
- `reviews.created_at`
- `reviews.approved_at`
- `visitor_sessions.created_at`
- `visitor_sessions(user_id, created_at)`
- `visitor_events.created_at`
- `visitor_events(event_type, created_at)`

Risk addressed:

- Admin analytics relied on date-scoped activity tables that will grow quickly in production.
- Missing indexes and date-wrapped comparisons would degrade query performance over time.

Status:

- Applied.

Manual production step:

- The migration must be deployed with `php artisan migrate --force`.

### 9. VAPID config fallback normalized

Affected file:

- `config/services.php`

Changes made:

- Replaced the hardcoded fallback VAPID subject email with `mailto:admin@example.com`.

Risk addressed:

- A hardcoded brand-specific fallback email in config is not appropriate as a production default.
- Missing environment configuration should not silently imply a real contact value.

Status:

- Applied.

## Part 4: Frontend Performance / Bundle Changes

### 10. Top-level route shells now lazy-load

Affected files:

- `resources/js/routes/index.tsx`
- `resources/js/admin/routes/adminRoutes.tsx`
- `resources/js/customer/routes/customerRoutes.tsx`

Changes made:

- Switched the storefront shell route from eager `element` loading to route `lazy` loading.
- Switched the admin shell route to route `lazy` loading.
- Switched the customer shell route to route `lazy` loading.

Impact observed in build output:

- Main bundle dropped from roughly `543.59 kB` to `322.73 kB`.
- `AppShell` now loads in its own chunk around `168.95 kB`.
- `AdminApp` and `CustomerApp` now load separately.

Risk addressed:

- The bootstrap bundle was larger than necessary for first paint and first navigation.
- Route shell code was being loaded earlier than needed.

Status:

- Applied.

Remaining performance note:

- `AdminEChart` still contributes a very large chunk and remains the biggest remaining frontend bundle concern.

## Part 5: Validation and Test Work

### 11. Tests added and updated

Affected files:

- `tests/Feature/Admin/AdminCustomerPasswordResetTest.php`
- `tests/Feature/Public/PublicPayloadExposureTest.php`

Changes made:

- Updated the admin password reset test to enforce removal of the old endpoint.
- Added a public payload exposure test that locks down public API contracts.

New coverage verifies:

- Public reviews do not leak phone numbers or internal IDs.
- Public foods do not leak admin-only/SEO/soft-delete metadata.
- Public categories do not leak sort/description/active/admin-oriented fields.
- Public company settings do not leak unnecessary timestamps.

Status:

- Applied.

### 12. Validation commands run during this prompt

Commands executed successfully:

- `php artisan view:cache`
- `npm.cmd run typecheck`
- `php artisan route:list --path=api`
- `composer audit`
- `npm.cmd audit --omit=dev`
- `php artisan test tests/Feature/Admin/AdminCustomerPasswordResetTest.php tests/Feature/Admin/AdminOrderManagementTest.php tests/Feature/Auth/SessionAuthenticationTest.php`
- `php artisan test`
- `npm.cmd run build`

Observed outcomes:

- Blade templates compiled successfully.
- API route bootstrap succeeded after backend changes.
- Composer audit reported no advisories.
- Production npm audit reported no vulnerabilities.
- Full test suite passed.
- Production frontend build passed.

Final full test result at end of run:

- `15` tests passed.
- `90` assertions passed.

## Applied vs Not Applied Summary

### Applied in code

- SEO database integration for storefront metadata.
- Storefront visitor tracking service and hook.
- Tracking events wired into AppShell.
- Sign-in modal production copy cleanup.
- Removal of dead admin password-reset endpoint.
- Public resource split for payload hardening.
- Push test throttling.
- Queued notifications.
- Safer upload extension handling.
- Analytics query improvements.
- Analytics indexes migration.
- Neutral VAPID fallback config.
- Top-level route lazy loading.
- Public payload regression tests.

### Identified but intentionally left as manual/next-step work

- Moving SPA auth away from localStorage bearer tokens to cookie-only Sanctum sessions.
- Production `.env` hardening and infrastructure-specific values.
- Queue worker deployment and supervision.
- Scheduled analytics retention, backups, and incident alerting.
- Further ECharts/admin bundle splitting.
- Query-level optimization for customer dashboard if customer histories become large.

## Manual Production Checklist After This Run

### Required before production deploy

- Set `APP_ENV=production`.
- Set `APP_DEBUG=false`.
- Set real `APP_URL`, `FRONTEND_URL`, and `SANCTUM_STATEFUL_DOMAINS`.
- Set `SESSION_SECURE_COOKIE=true` under HTTPS.
- Configure exact CORS origins.
- Set real `VAPID_SUBJECT`, `VAPID_PUBLIC_KEY`, and `VAPID_PRIVATE_KEY`.
- Run queue workers because notifications are now queued.
- Run the new analytics index migration.

### Recommended for launch readiness

- Replace localStorage bearer-token auth with cookie-only Sanctum session auth for browser users.
- Add retention/pruning automation for visitor analytics data.
- Add failed-job monitoring and uptime/error alerting.
- Add backup verification and recovery drills.
- Add another bundle optimization pass around the admin chart layer.

## File-by-File Change Inventory

### SEO / CRM / UX

- `resources/views/app.blade.php`
- `resources/js/services/visitorTrackingService.ts`
- `resources/js/hooks/useVisitorTracking.ts`
- `resources/js/components/layout/AppShell.tsx`
- `resources/js/components/auth/FrontendLoginModal.tsx`

### Backend hardening

- `app/Http/Controllers/Api/Admin/CustomerController.php`
- `routes/api.php`
- `app/Providers/AppServiceProvider.php`
- `app/Notifications/AdminOrderPlacedNotification.php`
- `app/Notifications/CustomerBroadcastMessageNotification.php`
- `app/Notifications/CustomerOrderStatusUpdatedNotification.php`
- `app/Notifications/AdminReviewSubmittedNotification.php`
- `app/Notifications/CustomerReviewModeratedNotification.php`
- `app/Support/FileUploadService.php`
- `app/Services/AdminAnalyticsService.php`
- `config/services.php`

### Public data contract hardening

- `app/Http/Resources/PublicCategoryResource.php`
- `app/Http/Resources/PublicCompanySettingResource.php`
- `app/Http/Resources/PublicFoodResource.php`
- `app/Http/Resources/PublicReviewResource.php`
- `app/Http/Controllers/Api/Public/CategoryController.php`
- `app/Http/Controllers/Api/Public/CompanySettingController.php`
- `app/Http/Controllers/Api/Public/FoodController.php`
- `app/Http/Controllers/Api/Public/ReviewController.php`
- `resources/js/services/publicService.ts`

### Performance and routing

- `resources/js/routes/index.tsx`
- `resources/js/admin/routes/adminRoutes.tsx`
- `resources/js/customer/routes/customerRoutes.tsx`
- `database/migrations/2026_05_03_220000_add_analytics_indexes.php`

### Tests

- `tests/Feature/Admin/AdminCustomerPasswordResetTest.php`
- `tests/Feature/Public/PublicPayloadExposureTest.php`

## Final Outcome

This prompt run completed meaningful production-oriented work across security, data exposure, performance, analytics readiness, SEO, CRM tracking, and UX polish.

The repository now has:

- A safer public API surface.
- A reduced bootstrap bundle.
- Better analytics scalability.
- Queue-friendly notification behavior.
- Stronger regression coverage for public payloads.
- Real storefront SEO and visitor-tracking integration.

The remaining launch blockers are mostly operational and architectural rather than syntax or code health problems.
