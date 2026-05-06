# Deployment Guide

This application is designed for a Laravel + React production deployment where the SPA is served by Laravel and the API lives under the same origin.

## Runtime requirements

- PHP `8.3+`
- Composer `2.8+`
- Node.js `24+` for build steps
- MySQL `8+` or compatible MariaDB version
- HTTPS-enabled web server

## Required services

- web server pointing to `public/`
- database
- queue worker
- scheduler or cron
- SMTP or transactional mail provider

## Environment checklist

At minimum, configure:

- `APP_NAME`
- `APP_ENV=production`
- `APP_DEBUG=false`
- `APP_URL`
- `FRONTEND_URL`
- `DB_*`
- `SESSION_DRIVER=database`
- `SESSION_DOMAIN`
- `SESSION_SECURE_COOKIE=true`
- `SANCTUM_STATEFUL_DOMAINS`
- `CORS_ALLOWED_ORIGINS`
- `QUEUE_CONNECTION`
- `CACHE_STORE`
- `MAIL_*`
- `VITE_VAPID_PUBLIC_KEY`
- `VAPID_SUBJECT`
- `VAPID_PUBLIC_KEY`
- `VAPID_PRIVATE_KEY`

If the frontend and backend are served from the same host, keep the allowed origins aligned with that single origin.

## Release steps

### 1. Install dependencies

```powershell
composer install --no-dev --optimize-autoloader
npm.cmd install
```

### 2. Build frontend assets

```powershell
npm.cmd run build
```

### 3. Prepare Laravel

```powershell
php artisan key:generate
php artisan migrate --force
php artisan storage:link
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

Only run `php artisan db:seed --force` when you explicitly want to seed that environment.

## Queue and scheduler

The codebase uses queued work for notifications and a scheduled queue runner in `routes/console.php`.

### Preferred production setup

- run a dedicated queue worker under a supervisor or service manager
- run `php artisan schedule:run` every minute through cron

### Shared hosting fallback

The current scheduler definition supports a minute-based queue run pattern, but a proper long-running worker is still preferable on managed infrastructure.

## Web server notes

- Serve the app from `public/`.
- Allow Laravel to handle SPA routes so `/`, `/customer/*`, and `/admin/*` resolve correctly.
- Do not rewrite `/api/*`, `/sanctum/*`, or `/storage/*` into the SPA shell.

## Storage and uploads

- Public uploads are written to the `public` disk and exposed via `/storage/...`.
- Confirm `php artisan storage:link` has been run in the deployed environment.
- Ensure the upload directories are writable by the web process.

## Mail and OTP recovery

Password recovery depends on working mail delivery. Before go-live:

- configure `MAIL_*`
- test password recovery end-to-end
- verify OTP mail is actually delivered from the production host

## Push notifications

Production push delivery requires:

- HTTPS
- valid VAPID keys
- service worker access at `/service-worker.js`
- a functioning queue worker if notifications are queued by your runtime flow

## Search and indexing notes

`public/robots.txt` currently points to `/sitemap.xml`. If the production site should be indexed, make sure that sitemap exists or update `robots.txt` to match your real indexing setup.

## Post-deploy verification

After deployment, verify:

- `/api/health` returns `status: ok`
- storefront data loads from the database
- customer login and admin login both work
- customer order placement works
- admin order status updates work
- uploaded images load correctly
- password recovery sends email
- push notification opt-in works on a supported browser
- queue and scheduler processes stay healthy
