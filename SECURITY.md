# Security Baseline

## Implemented in Phase 1

- Laravel 12 with hashed password casting.
- Sanctum installed for first-party SPA authentication.
- Stateful SPA middleware enabled in `bootstrap/app.php`.
- CORS restricted to configured frontend origins with credentials enabled.
- Role middleware scaffolded for future admin/customer separation.
- CSRF token exposed in the root Blade view for SPA form flows.
- Offline/PWA shell kept minimal and same-origin.

## Mandatory controls for upcoming phases

- Use Form Requests for every write endpoint.
- Enforce `auth:sanctum` plus policy checks on customer and admin routes.
- Validate and sanitize all file uploads.
- Rate-limit login, registration, visitor events, checkout, and notification actions.
- Store hashed IP values only for visitor analytics.
- Never trust client-side pricing during order creation.
- Gate push subscriptions by authenticated user ownership.
- Restrict admin routes with role checks and policies, not UI hiding.
- Clear and rotate secrets before production deployment.

## Review checklist

- Are all public write endpoints rate-limited?
- Are all admin actions protected by both auth and authorization?
- Are JSON payloads validated and normalized?
- Are sensitive attributes excluded from API resources?
- Are storage disks public only where explicitly required?
- Are cookies/session settings aligned with the real deployment hostname?
