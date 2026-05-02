# Frontend Foundation Report

## Architecture summary

- Single public SPA with section-based ordering flow.
- Local service boundaries for auth, orders, notifications, and PWA so Laravel APIs can replace the mocks later.
- Responsive shell with desktop/tablet headers and mobile bottom navigation.
- Dark mode default with manual theme toggle.

## File structure

```text
resources/js/
  app.tsx
  main.tsx
  routes/
  components/
    layout/
    theme/
    home/
    menu/
    ordering/
    account/
    notifications/
    pwa/
    common/
  hooks/
  services/
  data/
  types/
  utils/
  styles/
public/
  manifest.webmanifest
  service-worker.js
  offline.html
  icons/
```

## Dependency suggestions

- Keep the current React, TypeScript, Tailwind, Zustand, React Hook Form, Zod, Sonner, and Lucide stack.
- No new dependency was required for the current frontend-first implementation.

## Implementation plan delivered

1. Replace the placeholder shell with a one-page restaurant ordering UI.
2. Introduce theme tokens and manual dark/light switching.
3. Add mock data and frontend service boundaries.
4. Build responsive menu browsing and ordering modals.
5. Add local customer identity, account modal, notifications, and install prompt support.
6. Verify with route list, typecheck, and production build.

## Verification checklist

- Public route renders the one-page ordering UI.
- Theme toggles between dark and light and persists in `localStorage`.
- Desktop header is sticky and mobile bottom navigation is fixed.
- Food cards open a responsive order dialog.
- Unauthenticated ordering opens the customer details modal.
- Successful submission creates a mock pickup order and success modal.
- Account modal shows customer details and recent local orders.
- Notification permission button handles `default`, `granted`, and `denied`.
- Install prompt UI behaves correctly on supported browsers and iOS fallback hint is visible on iOS.
