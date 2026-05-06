# Session Authentication Stability Notes

An earlier login redirect loop was resolved, and the current codebase includes safeguards that should be preserved.

## Current stable behavior

- login calls `Auth::login(...)`
- the session is regenerated after successful authentication
- `last_login_at` is updated through a direct query update rather than a model save that could re-trigger password hashing behavior
- the frontend re-checks `GET /api/me` after login and logout before finalizing session state

## Frontend follow-up behavior

- login waits for the authenticated session to become observable through `/api/me`
- logout waits for the session to disappear through `/api/me`
- unauthorized responses dispatch a global event so route guards can react consistently

## Operational takeaway

If session behavior regresses, inspect:

- session cookie settings
- Sanctum stateful domains
- CSRF bootstrap flow
- any code that mutates the `password` attribute during login-related updates
