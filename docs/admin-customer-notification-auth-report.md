# Admin / Customer Notification and Auth Update Report

Date: 2026-05-03

## Scope Completed

- Admin header notification dropdown visibility fix
- Admin order action icon state styling
- Admin notification read and read-all fixes
- Admin live broadcast notification system to all customers
- Customer header notification bell with quick dropdown
- Storefront logged-in customer notification bell backed by database notifications
- Customer registration flow from the storefront
- Customer logout fix
- Success toasts for login/logout actions
- First-time notification/install prompt path kept active on the storefront

## Key Fixes

### 1. Admin notification dropdown

Problem:
- The dropdown looked transparent and could visually blend under the header/body.

Fix:
- Increased stacking order
- Added fully opaque surface background
- Added stronger border and shadow

Files:
- `resources/js/admin/components/notifications/AdminNotificationBell.tsx`
- `resources/js/admin/components/notifications/AdminNotificationDropdown.tsx`

### 2. Orders page view icon styling

Problem:
- Processing orders needed stronger visual emphasis.

Fix:
- The view icon in the admin orders table now turns theme-red while the order is in `processing`
- It returns to the normal theme style after the status changes

File:
- `resources/js/admin/pages/AdminOrdersPage.tsx`

### 3. Notification read/read-all errors

Problem:
- `read-all` routes were declared after `/{id}/read`, causing route conflicts.

Fix:
- Reordered admin and customer notification routes so `read-all` resolves correctly
- Added success toasts on mark-read and mark-all-read actions

Files:
- `routes/api.php`
- `resources/js/admin/pages/AdminNotificationsPage.tsx`
- `resources/js/customer/pages/CustomerNotificationsPage.tsx`

### 4. Admin live broadcast notifications

Implemented:
- Admin can now send a live notification to all active customer accounts
- Notifications are delivered through:
  - database notifications
  - web push notifications

Use cases:
- break notice
- order closed
- food finished
- any customer-wide message

Files:
- `app/Notifications/CustomerBroadcastMessageNotification.php`
- `app/Http/Requests/Admin/BroadcastCustomerNotificationRequest.php`
- `app/Http/Controllers/Api/Admin/NotificationController.php`
- `routes/api.php`
- `resources/js/admin/services/adminNotificationService.ts`
- `resources/js/admin/pages/AdminNotificationsPage.tsx`

### 5. Customer quick notification access

Implemented:
- Customer dashboard header now includes a notification bell with unread count
- Bell opens a quick dropdown
- Mark-read and mark-all-read actions work from the quick dropdown and notification page

Files:
- `resources/js/customer/layout/CustomerHeader.tsx`
- `resources/js/customer/layout/CustomerLayout.tsx`
- `resources/js/components/notifications/NotificationBell.tsx`
- `resources/js/components/notifications/NotificationDropdown.tsx`

### 6. Storefront logged-in customer notifications

Implemented:
- The storefront notification bell now uses the real customer notification data from the database when the user is logged in
- Logged-in customers now see only their own notifications

Files:
- `resources/js/components/layout/AppShell.tsx`

### 7. Customer registration

Implemented:
- Storefront auth modal now supports:
  - sign in
  - register
- New customer registration requires:
  - full name
  - USA phone number
  - password
  - confirm password

Behavior:
- customer is registered immediately
- authenticated session/token is established
- success toast is shown

Files:
- `resources/js/components/auth/FrontendLoginModal.tsx`
- `resources/js/services/sessionService.ts`
- `app/Http/Controllers/Api/Auth/RegisterController.php`

### 8. Customer logout error fixed

Problem:
- `this.ensureCsrfCookie is not a function`

Cause:
- method reference loss from object-method `this` usage in `sessionService`

Fix:
- removed dependence on `this` inside `sessionService`
- refactored internal calls to direct helpers

Files:
- `resources/js/services/sessionService.ts`

### 9. Login/logout success toasts

Implemented:
- Admin login success toast
- Admin logout success toast
- Customer logout success toast
- Storefront login success toast
- Storefront registration success toast

Files:
- `resources/js/pages/admin/AdminLoginPage.tsx`
- `resources/js/admin/layout/AdminLayout.tsx`
- `resources/js/customer/layout/CustomerLayout.tsx`
- `resources/js/components/layout/AppShell.tsx`

## First-Time App Prompts

The storefront still provides first-visit prompts for:
- notification permission
- app install

This remains the primary first-touch path for:
- iPhone
- Android
- tablet
- desktop

The notification/install prompts continue to be triggered from:
- `resources/js/components/layout/AppShell.tsx`

## Verification Completed

- `npm.cmd run typecheck`
- `npm.cmd run lint`
- `php artisan test`
- `php artisan view:cache`

## Manual QA Checklist

### Admin
- Open the admin header bell and confirm the dropdown is opaque and layered correctly
- On `/admin/orders`, confirm processing orders show a red view icon
- On `/admin/notifications`, click `Mark read` and `Mark all read`
- Send a live customer broadcast and confirm success toast

### Customer Dashboard
- Open the customer dashboard header bell and confirm unread count appears
- Click one notification and confirm it marks as read
- Click `Mark all read` and confirm success toast
- Logout and confirm no CSRF error appears

### Storefront
- Login as a customer and open the storefront bell
- Confirm only that customer’s notifications appear
- Register a brand-new customer account with name, USA phone, password, and confirm password
- Confirm success toast and active signed-in state

### First-Time Prompts
- On a fresh browser profile, confirm:
  - notification permission prompt flow appears
  - install app prompt flow appears where supported

