# Password Recovery And Cookie Auth Design

This application now uses session cookies for customer and admin authentication. The browser no longer stores or sends bearer tokens for normal SPA access.

## Authentication model

- `POST /api/login` and `POST /api/register` establish the Sanctum session through the `web` middleware and return the authenticated user payload only.
- `GET /api/me` remains the single source of truth for the current session.
- `POST /api/logout` only clears the authenticated session and rotates the CSRF-backed browser state.
- Frontend session state is derived from the server session instead of local token storage.

## Password recovery flow

- Recovery starts at `POST /api/password/forgot`.
- The client sends `lookup=phone` first. The backend normalizes the USA phone number and looks up the account by phone.
- If the account has a recovery email on file, the backend sends a 6-digit OTP to that email and stores only a hashed OTP in `password_reset_otps`.
- The client can also use `lookup=email` as the fallback path.
- OTPs expire after 15 minutes and are invalidated after too many failed attempts.
- `POST /api/password/reset` validates the OTP, changes the password, rotates the remember token, deletes active sessions, deletes stored password reset tokens, deletes personal access tokens, and clears OTP records.

## SMTP configuration

Do not commit mailbox credentials into source control. Set the runtime mail configuration in the environment for the deployed app.

Required settings for the current mailbox-based OTP delivery:

```env
MAIL_MAILER=smtp
MAIL_HOST=s3465.syd1.stableserver.net
MAIL_PORT=465
MAIL_ENCRYPTION=ssl
MAIL_USERNAME=admin@drisfoods.com
MAIL_PASSWORD=...
MAIL_FROM_ADDRESS=admin@drisfoods.com
MAIL_FROM_NAME="Dris Foods"
```

After updating environment values, clear and rebuild Laravel config cache in the target environment.

## Upload policy for SVG

- Public image upload entry points now reject SVG files explicitly during request validation.
- The shared file upload service also rejects SVG by extension or MIME type as a second guard.
- Current policy is reject, not sanitize.

## Customer dashboard and orders

- Customer dashboard metrics now use database queries scoped to the requested date range instead of loading full histories into memory.
- Customer orders now support server-side `page`, `per_page`, `status`, `search`, `date_from`, and `date_to` filters.
- The customer orders page defaults to the last 30 days and consumes paginated API metadata directly.

## Validation and regression coverage

- Session auth tests now assert that login responses do not include a token and that clearing the session leaves `/api/me` unauthenticated.
- Password recovery tests cover phone-first OTP reset and email fallback lookup.
- Customer order tests cover server-side filtering and pagination.
- Admin food upload tests cover SVG rejection.
