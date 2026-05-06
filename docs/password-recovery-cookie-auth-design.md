# Password Recovery And Session Authentication

The application uses server-side sessions for normal web authentication and email OTPs for password recovery.

## Session auth model

- `POST /api/login` starts the session
- `POST /api/register` creates a customer account and starts the session
- `GET /api/me` returns the authenticated user when the session is active
- `POST /api/logout` clears the session

## Password recovery flow

### Request

- client sends `POST /api/password/forgot`
- backend looks up the account by login value
- if a recovery email exists, a 6-digit OTP is created and emailed
- only the OTP hash is stored

### Reset

- client sends `POST /api/password/reset`
- backend validates the OTP and expiry window
- failed attempts are counted and eventually invalidate the OTP
- successful reset rotates the password and remember token
- active sessions, tokens, and reset records are cleared

## Delivery dependency

Password recovery depends on working production mail settings. Validate mail delivery before launch.
