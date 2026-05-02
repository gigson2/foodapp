# Restaurant SPA PWA Ordering Platform

Laravel 12 + React 19 + TypeScript + TailwindCSS 4 foundation for a premium restaurant ordering platform with separated public, customer, and admin experiences.

## Phase 1 status

Completed in this repository:

- Laravel `12.58` foundation with Sanctum installed and stateful SPA middleware enabled.
- React + TypeScript SPA shell mounted through a single Blade entry.
- Dark mode by default with light/system switching and local persistence.
- Public storefront foundation with polished menu discovery UI.
- Customer and admin dashboard shells routed separately.
- Initial PWA primitives: `manifest.webmanifest`, `sw.js`, and `offline.html`.
- AI agent and skill documentation under `.ai/`.

## Recommended architecture

### Backend

- `app/Actions` for command-style write operations.
- `app/DTOs` for validated payload transport objects.
- `app/Enums` for `UserRole`, order state, payment state, and similar domain constants.
- `app/Http/Controllers/Api/Public|Customer|Admin` for explicit API boundaries.
- `app/Http/Requests` for validation and authorization per action.
- `app/Http/Resources` for stable JSON contracts.
- `app/Services` for pricing, orders, notifications, visitor tracking, and dashboard metrics.
- `app/Policies` for admin/customer authorization rules.
- `app/Support` for shared helpers, metadata, and infrastructure glue.

### Frontend

- `resources/js/layouts` for public/customer/admin shells.
- `resources/js/pages` for route-level screens.
- `resources/js/components` for shared UI and feature cards.
- `resources/js/providers` for theme and server-state plumbing.
- `resources/js/stores` for cart and auth state.
- `resources/js/lib` for HTTP and utility helpers.
- `resources/js/data` for temporary Phase 1 view data until public APIs land in Phase 3.

## Exact installation commands

### Windows PowerShell / XAMPP

```powershell
cd C:\xampp\htdocs\iddrissa
composer install
Copy-Item .env.example .env -Force
php artisan key:generate
mysql -u root -e "CREATE DATABASE IF NOT EXISTS restaurant_spa CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
php artisan migrate
npm.cmd install
npm.cmd run build
php artisan storage:link
composer run dev
```

### Cross-platform equivalent

```bash
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
npm install
npm run build
php artisan storage:link
composer run dev
```

## Dependency list

### Backend

- `laravel/framework:^12.0`
- `laravel/sanctum:^4.3`
- `laravel/tinker:^3.0`

### Frontend runtime

- `react`
- `react-dom`
- `react-router-dom`
- `axios`
- `@tanstack/react-query`
- `zustand`
- `react-hook-form`
- `zod`
- `@hookform/resolvers`
- `lucide-react`
- `clsx`
- `tailwind-merge`
- `class-variance-authority`
- `sonner`

### Frontend build tooling

- `typescript`
- `@vitejs/plugin-react`
- `vite`
- `laravel-vite-plugin`
- `tailwindcss`
- `@tailwindcss/vite`

### PWA note

`vite-plugin-pwa` was intentionally not installed because the currently resolved package line does not support the Laravel starter's `Vite 8` dependency tree. Phase 1 uses a manual manifest + service worker foundation instead of forcing an unstable peer-dependency override.

## Folder structure

```text
app/
  Actions/
  DTOs/
  Enums/
  Http/
    Controllers/
      Api/
        Admin/
        Auth/
        Customer/
        Public/
    Middleware/
    Resources/
  Notifications/
  Policies/
  Services/
  Support/
resources/
  css/
  js/
    components/
    data/
    layouts/
    lib/
    pages/
    providers/
    stores/
    types/
  views/
routes/
  api.php
  web.php
public/
  icons/
  manifest.webmanifest
  offline.html
  sw.js
.ai/
  agents/
  skills/
```

## Key files created in Phase 1

- `bootstrap/app.php`
- `routes/api.php`
- `routes/web.php`
- `resources/views/app.blade.php`
- `resources/js/app.tsx`
- `resources/js/router.tsx`
- `resources/js/layouts/marketing-layout.tsx`
- `resources/js/pages/public/home-page.tsx`
- `resources/js/pages/customer/customer-dashboard.tsx`
- `resources/js/pages/admin/admin-dashboard.tsx`
- `resources/js/providers/theme-provider.tsx`
- `public/manifest.webmanifest`
- `public/sw.js`
- `.ai/agents/*.md`
- `.ai/skills/*.md`

## Verification checklist for Phase 1

- `php artisan --version` returns a Laravel 12.x version.
- `php artisan route:list` shows the SPA route plus `/api/health` and `/api/me`.
- `npm.cmd run build` completes successfully.
- Loading `/` shows the React storefront instead of the default Laravel welcome screen.
- Theme toggle switches between dark, light, and system preferences.
- `/customer` and `/admin` render their dashboard shells.
- DevTools shows a registered service worker and linked web manifest.

## Common errors to check

- MySQL database missing or misnamed in `.env`.
- `npm` PowerShell execution-policy failures: use `npm.cmd` on Windows.
- Session/auth issues if `APP_URL`, `FRONTEND_URL`, and `SANCTUM_STATEFUL_DOMAINS` do not reflect your local hostname.
- Cached config after env changes: run `php artisan optimize:clear`.

## Next phase recommendation

Phase 2 should focus on database-first backend foundation:

- Replace the default Laravel user migration with the full restaurant schema.
- Add enums for order, payment, and visitor event state.
- Build models, relationships, factories, seeders, and policy scaffolding.
- Seed a real menu and company profile so Phase 3 can swap the current static storefront dataset to live APIs.
