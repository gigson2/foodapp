# Security Policy

This project is production-oriented and uses Laravel's session-based SPA authentication model with server-side authorization. This document describes the current security posture, how to report issues, and the minimum controls expected in deployment.

## Reporting a vulnerability

Do not open a public issue for a suspected security problem.

Report the issue privately to the project owner or deployment maintainer through the private channel already used for this project. If this repository is later hosted publicly, add a dedicated security mailbox or private disclosure form and update this file.

When reporting, include:

- affected route, page, or feature
- reproduction steps
- expected impact
- whether authentication is required
- screenshots or request samples when helpful

## Supported deployment posture

The current codebase assumes:

- HTTPS in production
- database-backed sessions
- Laravel Sanctum for first-party SPA auth
- stateful frontend origins listed in `SANCTUM_STATEFUL_DOMAINS`
- real `APP_URL` and `FRONTEND_URL`
- production mail configuration for OTP delivery
- valid VAPID keys for push notifications

## Current security controls

### Authentication and sessions

- Customer and admin web access uses Laravel session cookies.
- `GET /api/me` is used to resolve the active session.
- Login and registration regenerate the session after authentication.
- Logout is server-driven and CSRF-protected.
- Passwords use Laravel's hashed cast.
- Password reset invalidates sessions, personal access tokens, remembered sessions, and active OTP records.

### Authorization

- Protected routes use `auth:sanctum`.
- Customer routes are restricted with `role:customer`.
- Admin routes are restricted with `role:admin`.
- Access control is enforced on the API, not only in the UI.

### CSRF and SPA request handling

- Sanctum stateful SPA middleware is enabled in `bootstrap/app.php`.
- The shared Axios client automatically fetches the CSRF cookie before write requests.
- A `419` response triggers one automatic fresh-CSRF retry.

### Rate limiting

The application currently rate-limits:

- login
- registration
- password recovery request
- password recovery reset
- customer order submission
- push notification test sends
- visitor event submission

Review `AppServiceProvider` and `VisitorEventController` if you need to tune thresholds for production traffic.

### Password recovery

- Recovery codes are one-time OTPs delivered by email.
- OTPs are stored as HMAC hashes, not plaintext.
- OTPs expire after 15 minutes.
- Repeated invalid attempts invalidate the OTP.

### Data handling

- Visitor analytics store a hashed IP value instead of the raw IP address.
- Public payloads are intentionally constrained to avoid leaking sensitive user or operational data.
- Session state stays server-side.

### File uploads

- Public asset uploads pass through `FileUploadService`.
- Uploaded public files are stored on the `public` disk.
- SVG uploads are rejected for public assets.
- Existing uploaded files are replaced through controlled helpers.

### Notifications and push

- Push subscriptions are tied to authenticated users.
- Push delivery honors the user's `push_enabled` preference.
- Expired subscriptions are deleted when the push provider reports them as stale.

## Production hardening checklist

Before go-live, confirm:

- `APP_DEBUG=false`
- HTTPS is enforced
- session cookie security settings match the deployment domain
- `SANCTUM_STATEFUL_DOMAINS` contains only trusted origins
- `CORS_ALLOWED_ORIGINS` contains only trusted origins
- storage permissions are correct and `public/storage` is linked intentionally
- production mail credentials are set
- VAPID keys are valid
- queue worker and scheduler are supervised
- logs are retained and monitored
- seeded bootstrap credentials are removed or rotated

## Operational recommendations

- Keep dependencies up to date.
- Run `php artisan test`, `npm run lint`, `npm run typecheck`, and `npm run build` before release.
- Review admin-only endpoints whenever new features are added.
- Re-check any new file upload flow for MIME, extension, and storage policy.
- Avoid exposing test credentials, OTP mailboxes, or push keys in repository history or screenshots.
