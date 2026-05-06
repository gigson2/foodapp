# Admin And Customer Authentication And Notifications

This document describes the current production behavior for session auth and notification delivery across the storefront, customer portal, and admin console.

## Authentication model

- The application uses Laravel Sanctum for first-party SPA session authentication.
- Customers sign in through the storefront flow and are routed into `/customer/*`.
- Admin users sign in through `/admin/login` and are routed into `/admin/*`.
- `GET /api/me` is the authoritative session check used by the frontend guards.

## Access control

- Customer routes require `auth:sanctum` and `role:customer`.
- Admin routes require `auth:sanctum` and `role:admin`.
- Authorization is enforced server-side; UI visibility is not the security boundary.

## Notification surfaces

### Customer

- in-app notification list in the customer portal
- quick notification access from the authenticated storefront/header experience
- mark-one and mark-all-as-read flows
- push subscription support per authenticated account

### Admin

- admin notification bell and dropdown in the dashboard shell
- customer broadcast messaging from the admin notifications page
- real push test notification flow from the PWA settings page

## Delivery behavior

- Notifications are stored through Laravel's notification system.
- Browser push subscriptions are stored in `push_subscriptions`.
- Push delivery uses `minishlink/web-push`.
- Delivery respects the user's `push_enabled` preference.
- Stale subscriptions are removed when the push provider reports them as expired.

## Operational notes

- Push delivery requires HTTPS and valid VAPID keys.
- Password recovery requires working mail delivery.
- Admin and customer sessions rely on the real deployment hostname being reflected in session, Sanctum, and CORS settings.
