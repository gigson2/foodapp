# Deployment Notes

## Local development assumptions

- PHP `8.3+`
- Composer `2.8+`
- Node `24+`
- MySQL `8+` or MariaDB equivalent
- Queue, cache, and session drivers initially use database-backed storage

## Local boot sequence

```powershell
mysql -u root -e "CREATE DATABASE IF NOT EXISTS restaurant_spa CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
php artisan migrate
composer run dev
```

## Production baseline

- Use Nginx or Apache with `public/` as the web root.
- Set real `APP_URL`, `FRONTEND_URL`, and `SANCTUM_STATEFUL_DOMAINS`.
- Use HTTPS before enabling real push subscriptions.
- Run `php artisan config:cache`, `route:cache`, and `view:cache` during release.
- Build frontend assets with `npm run build`.
- Run queues under a supervisor/service manager.
- Move mail, cache, queue, and broadcast drivers off the local defaults.

## Before first production release

- Replace the temporary SVG manifest icon set with production app icons.
- Add real sitemap generation and robots policy.
- Add storage symlink and public upload strategy.
- Configure backups, logs, and uptime monitoring.
- Review `SECURITY.md` and harden headers, cookies, and rate limiting.
