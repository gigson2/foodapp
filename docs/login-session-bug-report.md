# Login Session Bug Report

**Date:** 2026-05-04  
**Symptom:** User logs in successfully, sees the dashboard for ~1 second, then is automatically redirected back to the login page.  
**Status:** Resolved ✓

---

## Symptom

After submitting valid credentials on `/admin/login`, the admin dashboard would flash briefly on screen and then immediately redirect back to `/admin/login`. The cycle was consistent and reproducible every time.

---

## Diagnosis

Debug logging was added to three locations to trace session state across requests:

1. **`LoginController`** — logged session ID at every step (before login, after `Auth::login()`, after `session()->regenerate()`)
2. **`CurrentUserController`** (`/api/me`) — logged the session ID and auth state on every call
3. **`LogSessionState` middleware** — logged session ID before and after every handler for auth-related routes

### Log Evidence

The following session IDs were observed across a single login flow (before the fix):

| Request | Session ID |
|---|---|
| POST `/api/login` — after regenerate | `k749CEBf...` |
| GET `/api/me` (1st call — from `sessionService` confirm loop) | `nb6aN637...` |
| GET `/api/me` (2nd call — React Query background refetch) | `eobveuiX...` |

**Every request produced a completely different session ID.** The session was never loaded from the database — Laravel started a brand-new empty session on each request. Because the session had no auth data, `/api/me` returned `null`, which the frontend interpreted as "not logged in" and redirected to `/admin/login`.

---

## Root Cause

### Double `StartSession` middleware

`routes/api.php` wrapped auth routes with `Route::middleware('web')`:

```php
// routes/api.php (before fix)
Route::middleware('web')->group(function (): void {
    Route::post('/login', LoginController::class);
    Route::get('/me', CurrentUserController::class);
    // ...
});

Route::middleware(['web', 'auth:sanctum'])->group(function (): void {
    // protected routes
});
```

At the same time, `bootstrap/app.php` called `$middleware->statefulApi()`:

```php
// bootstrap/app.php
->withMiddleware(function (Middleware $middleware): void {
    $middleware->statefulApi(); // <-- this already adds StartSession, VerifyCsrfToken, etc.
    // ...
})
```

`statefulApi()` adds Sanctum's `EnsureFrontendRequestsAreStateful` middleware to the `api` middleware group. That middleware conditionally injects the full `web` middleware stack — including `StartSession`, `EncryptCookies`, and `VerifyCsrfToken` — for any request originating from a stateful domain.

The result: **`StartSession` ran twice per request.**

1. First run (from `statefulApi()`): loads the existing session from the database correctly.
2. Second run (from `middleware('web')` on the route): sees a session that is already started and reinitialises it as a new empty session, saves it to the database, and sends a new session cookie in the response.

The browser received a new session cookie on every response and sent it on the next request, but that new session contained no authentication data. The login session was effectively discarded after every response.

### Why the first `/api/me` call sometimes succeeded

In the log captured right after the fix was attempted (but before it fully worked), the first `/api/me` call succeeded because it ran within the same request lifetime as the login — the session was still in memory. The second `/api/me` call (React Query's background refetch, triggered when the `RequireAdmin` component mounted) hit a fresh HTTP request and received a different empty session.

---

## Fix

Remove `'web'` from all API route middleware groups. `statefulApi()` already provides complete session and CSRF handling for API routes — it does not need to be supplemented with `middleware('web')`.

```php
// routes/api.php (after fix)

// Auth routes — no middleware needed; statefulApi() handles session/CSRF
Route::middleware([])->group(function (): void {
    Route::post('/login', LoginController::class);
    Route::get('/me', CurrentUserController::class);
    Route::post('/logout', LogoutController::class)->middleware('auth:sanctum');
    // ...
});

// Protected routes — only auth:sanctum needed
Route::middleware(['auth:sanctum'])->group(function (): void {
    // customer and admin routes
});
```

---

## Verification

After the fix, the log showed the same session ID across all requests in a single login flow:

| Request | Session ID | Auth result |
|---|---|---|
| POST `/api/login` — after regenerate | `zfKEfktL...` | ✓ session saved |
| GET `/api/me` (1st refetch) | `zfKEfktL...` | ✓ user_id=1 authenticated |
| GET `/api/me` (2nd refetch) | `zfKEfktL...` | ✓ user_id=1 authenticated |

Login is now stable. The admin dashboard loads and remains loaded.

---

## Key Rule

> In a Laravel SPA using Sanctum stateful auth, **never add `middleware('web')` to API routes**. Call `$middleware->statefulApi()` once in `bootstrap/app.php` and let Sanctum manage the session for all API requests from stateful domains. Adding `middleware('web')` on top causes `StartSession` to run twice, destroying the session on every response.

---

## Files Changed

| File | Change |
|---|---|
| `routes/api.php` | Removed `'web'` from auth route group; removed `'web'` from protected route group |
| `bootstrap/app.php` | Added `LogSessionState` debug middleware (temporary — see below) |
| `app/Http/Controllers/Api/Auth/LoginController.php` | Added `Log::debug()` calls (temporary — remove after confirming stable) |
| `app/Http/Controllers/Api/Auth/CurrentUserController.php` | Added `Log::debug()` calls (temporary — remove after confirming stable) |
| `app/Http/Middleware/LogSessionState.php` | Created debug middleware (temporary — remove after confirming stable) |

### Cleanup (recommended)

Once the fix is confirmed stable in production, remove the temporary debug instrumentation:

1. Delete `app/Http/Middleware/LogSessionState.php`
2. Remove `use App\Http\Middleware\LogSessionState;` and `$middleware->append(LogSessionState::class);` from `bootstrap/app.php`
3. Strip all `Log::debug()` calls from `LoginController.php` and `CurrentUserController.php`
