# Push Notification Audit Report

Date: 2026-05-03

## What Was Checked

- Service worker registration and push display flow
- Browser permission and subscription save flow
- Backend web-push delivery through `minishlink/web-push`
- Admin and customer event notifications
- Account-level push preference handling
- Real test-notification path

## What Was Already Working

- Push subscriptions were being stored in the database
- Backend notifications for orders and reviews were already wired to the custom `webpush` channel
- The service worker already displayed incoming push notifications through `showNotification(...)`

## Gaps Found

1. Push delivery did not honor `push_enabled`
2. Admin “Send test notification” only created a local browser notification, not a real backend push
3. Push payloads were missing stronger mobile-friendly notification options such as vibration and re-notify hints
4. Subscription calls could fail intermittently if the service worker was not fully ready
5. The customer order-status push URL pointed to `/customer` instead of the orders page
6. `.env.example` did not document required VAPID frontend/backend keys

## Changes Applied

- `WebPushService` now:
  - respects `notification_preference.push_enabled`
  - sends high-urgency web push with TTL/topic hints
  - includes mobile-friendly payload data such as `vibrate`, `renotify`, and `timestamp`
- Added real authenticated test endpoint:
  - `POST /api/push-notifications/test`
- Admin PWA settings now send a real backend push test instead of a local `new Notification(...)`
- Customer profile now includes a real push test action
- Service worker now uses:
  - `renotify`
  - `silent: false`
  - `vibrate`
  - `timestamp`
  - notification actions
- Push subscription helpers now ensure the service worker is registered and ready before subscribing
- Customer order-status push now opens `/customer/orders`
- Added VAPID configuration placeholders to `.env.example`

## Important Real-World Limitation

Custom notification sounds are **not reliably controllable** in standard web push the way they are in native mobile apps.

What this implementation now does:

- sends real web push through the OS/browser path
- requests non-silent notifications
- adds vibration hints for supported mobile browsers
- uses high urgency so mobile browsers are more likely to surface the alert promptly

What still depends on the device/browser:

- whether a sound is played
- which default sound is used
- whether vibration is honored
- how iPhone/iPad treats installed PWA push on the current iOS version

## Expected Behavior Now

If all prerequisites are satisfied:

- Admin receives device push notifications when customers place orders
- Customer receives device push notifications when their order status changes
- Admin receives device push notifications for pending reviews
- Customer receives device push notifications when review status changes
- Notifications should appear in the browser/device notification center
- Supported mobile browsers may also play the system default notification sound and/or vibration pattern

## Required Prerequisites

1. Valid VAPID keys configured in `.env`
2. `VITE_VAPID_PUBLIC_KEY` set for the frontend
3. Notification permission granted
4. Push subscription saved for the signed-in user on the current device
5. Service worker registered successfully
6. Browser/device supports web push for the current app context

## Recommended QA Flow

1. Install the PWA on a mobile phone
2. Sign in as admin on one device and customer on another
3. Enable push notifications on both devices
4. Use “Send push test” from customer profile and admin PWA settings
5. Place a customer order
6. Confirm the admin device receives the push in its notification center
7. Update the order status from admin
8. Confirm the customer device receives the push in its notification center

## Files Changed

- `app/Services/WebPushService.php`
- `app/Http/Controllers/Api/PushNotificationTestController.php`
- `routes/api.php`
- `app/Notifications/AdminOrderPlacedNotification.php`
- `app/Notifications/CustomerOrderStatusUpdatedNotification.php`
- `app/Notifications/AdminReviewSubmittedNotification.php`
- `app/Notifications/CustomerReviewModeratedNotification.php`
- `public/service-worker.js`
- `resources/js/services/pwaService.ts`
- `resources/js/admin/pages/AdminPwaSettingsPage.tsx`
- `resources/js/customer/pages/CustomerProfilePage.tsx`
- `.env.example`
