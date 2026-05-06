# IDDRISSA

IDDRISSA is a production-ready Laravel and React pickup-ordering platform for Dri Africain Traditional Grill LLC. It ships a public storefront, a customer portal, and an admin console in a single SPA-backed application, using Laravel 12 for the API and React 19 for the frontend.

## What the application includes

- Public storefront with live menu, categories, reviews, company settings, SEO metadata, and visitor tracking.
- Customer account area for dashboard metrics, order history, notifications, reviews, profile updates, password changes, and guest-order claiming.
- Admin console for dashboard analytics, orders, menu management, categories, reviews, customers, notifications, company settings, SEO settings, and PWA notification setup.
- Session-based SPA authentication with Laravel Sanctum and role-based route protection for admin and customer areas.
- Push notifications with browser subscriptions stored in the database and delivered through `minishlink/web-push`.
- PWA support with `manifest.webmanifest`, `service-worker.js`, and `offline.html`.

## Technology stack

### Backend

- PHP `8.3+`
- Laravel `12`
- Laravel Sanctum
- MySQL or MariaDB
- Database-backed queue, cache, and session storage by default
- `minishlink/web-push` for browser push delivery

### Frontend

- React `19`
- TypeScript
- Vite `8`
- React Router `7`
- TanStack Query
- Zustand
- React Hook Form + Zod
- Tailwind CSS `4`
- ECharts + `echarts-for-react`
- `react-data-table-component`

## Product architecture

### Application surfaces

- `/` renders the public storefront.
- `/customer/*` renders the authenticated customer portal.
- `/admin/*` renders the authenticated admin console.
- `/admin/login` is the dedicated admin login route.

### API boundaries

- `routes/api.php` exposes public, auth, customer, admin, and push-notification endpoints.
- `routes/web.php` serves the SPA shell and excludes `api`, `sanctum`, and `storage` paths.
- Role restrictions are enforced server-side with the `role` middleware alias in `bootstrap/app.php`.

### Key backend domains

- `users`, `customer_profiles`, `notification_preferences`
- `categories`, `foods`
- `orders`, `order_items`
- `reviews`
- `company_settings`, `seo_settings`
- `visitor_sessions`, `visitor_events`
- `push_subscriptions`
- `password_reset_otps`
- Laravel `notifications`, `sessions`, `cache`, and `jobs`

### Key frontend directories

- `resources/js/components` shared storefront and common UI
- `resources/js/customer` customer application module
- `resources/js/admin` admin application module
- `resources/js/services` public/auth/shared service layer
- `resources/js/routes` root route registration

## Local setup

### Requirements

- PHP `8.3+`
- Composer `2.8+`
- Node.js `24+`
- MySQL `8+` or compatible MariaDB version

### First-time install

```powershell
cd C:\xampp\htdocs\iddrissa
composer install
Copy-Item .env.example .env -Force
php artisan key:generate
npm.cmd install
```

Create the database configured in `.env`, then run:

```powershell
php artisan migrate
php artisan storage:link
npm.cmd run build
```

If you want seeded content for local development:

```powershell
php artisan db:seed
```

The seed data creates company settings, SEO settings, categories, foods, and a bootstrap admin account. Treat seeded credentials as development-only and rotate or remove them before any shared or production environment.

### Day-to-day local development

```powershell
composer run dev
```

That starts:

- Laravel HTTP server
- queue listener
- `pail` log viewer
- Vite dev server

## Environment configuration

Review `.env.example` before deployment. The main variables you will typically set are:

- `APP_NAME`
- `APP_ENV`
- `APP_DEBUG`
- `APP_URL`
- `FRONTEND_URL`
- `DB_*`
- `SESSION_*`
- `SANCTUM_STATEFUL_DOMAINS`
- `CORS_ALLOWED_ORIGINS`
- `QUEUE_CONNECTION`
- `CACHE_STORE`
- `MAIL_*`
- `VITE_VAPID_PUBLIC_KEY`
- `VAPID_SUBJECT`
- `VAPID_PUBLIC_KEY`
- `VAPID_PRIVATE_KEY`

### Session and SPA auth notes

- Authentication is cookie-based, not bearer-token based, for the normal web app.
- Write requests automatically bootstrap the Sanctum CSRF cookie through the shared Axios client.
- `GET /api/me` is the source of truth for the current signed-in user.

## Background processing

Two runtime processes matter in production:

1. A queue worker for queued notifications and other async work.
2. The Laravel scheduler, which is configured in `routes/console.php` to run a queue worker every minute on shared-hosting style setups.

If you deploy to a server with a supervisor or service manager, prefer a long-running queue worker plus a standard `schedule:run` cron entry.

## Notifications and PWA

- The service worker is served from `public/service-worker.js`.
- The PWA manifest is `public/manifest.webmanifest`.
- Offline fallback is `public/offline.html`.
- Push subscriptions are saved through `/api/push-subscriptions`.
- Test notifications are sent through `/api/push-notifications/test`.

Production push delivery requires valid VAPID keys and HTTPS.

## Main API groups

### Public

- `GET /api/health`
- `GET /api/foods`
- `GET /api/foods/{slug}`
- `GET /api/categories`
- `GET /api/company-settings`
- `GET /api/reviews`
- `POST /api/visitor-events`

### Authentication

- `POST /api/register`
- `POST /api/login`
- `POST /api/password/forgot`
- `POST /api/password/reset`
- `GET /api/me`
- `POST /api/logout`

### Customer

- dashboard
- orders
- notifications
- reviews
- profile
- push subscriptions

### Admin

- dashboard overview
- orders and status updates
- menu and categories
- customers
- visitors and analytics
- reviews
- notifications
- company settings
- SEO settings
- profile

## Verification commands

Run these before merging or releasing:

```powershell
php artisan test
npm.cmd run lint
npm.cmd run typecheck
npm.cmd run build
```

## Production references

- `DEPLOYMENT.md` for release and runtime operations
- `SECURITY.md` for reporting and hardening expectations
- `TESTING.md` for automated and manual QA guidance
- `docs/` for product-area and operational notes
