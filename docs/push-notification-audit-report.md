# Push Notification Implementation

This document summarizes the current push-notification implementation in production terms.

## Frontend flow

- browser permission is requested from the storefront or admin PWA settings page
- the service worker is registered from `/service-worker.js`
- the browser subscription is saved through `/api/push-subscriptions`

## Backend flow

- subscriptions are stored per authenticated user
- delivery uses `minishlink/web-push`
- custom notification channel wiring is registered in `AppServiceProvider`
- stale subscriptions are deleted when the push provider reports them as expired

## User-facing flows

- customers can receive order and account-related notifications
- admins can receive operational notifications
- admins can send a real test notification to the current device

## Payload behavior

The service worker supports:

- title and body
- badge and icon
- vibration pattern
- tag and re-notify hints
- target URL for notification click behavior

## Production dependencies

- HTTPS
- valid VAPID keys
- browser push support
- working queue/runtime configuration when notifications are queued
