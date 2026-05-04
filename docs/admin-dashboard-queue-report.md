# Admin Dashboard Queue Report

Date: 2026-05-03

## Scope

Updated the admin dashboard overview to add two operational queue sections:

- Pickup queue
- Completed orders queue

Both are responsive and use real database-backed order data.

## Pickup Queue

Purpose:

- show only newly received customer orders
- let admin staff open a quick view without leaving the dashboard
- let staff move the order into workflow immediately

Behavior:

- only orders with status `received` are shown
- paginated at 4 items per page
- each card shows:
  - order number
  - customer
  - items
  - total
  - created date/time
  - `View order` link
- quick view modal actions:
  - Start processing
  - Mark ready for pickup
  - Cancel order
- once the order leaves `received`, it disappears from this queue

## Completed Orders Queue

Purpose:

- show orders that are ready for pickup and still unpaid
- let admin finalize them quickly after handoff

Behavior:

- shows orders where:
  - status = `ready_for_pickup`
  - payment status = `unpaid`
- paginated at 4 items per page
- each card shows:
  - order number
  - customer
  - items
  - total
  - created date/time
  - `View order` link
- quick view modal action:
  - Mark completed & cash received
- once completed, the order disappears from this queue

## Responsive Design

Desktop:

- two-column card grid inside each queue
- full-width completed-orders section under the top dashboard row

Tablet:

- queue cards remain readable in two-column layout where space allows
- pager stays compact and aligned

Mobile:

- queue cards stack to one column
- modal stays usable with the shared responsive modal shell
- pager remains touch-friendly with previous/next controls

## Files Added

- `resources/js/admin/components/dashboard/DashboardOrderQueueWidget.tsx`
- `resources/js/admin/components/dashboard/DashboardOrderQuickViewModal.tsx`

## Files Updated

- `resources/js/admin/pages/AdminDashboardPage.tsx`

## Verification

Passed:

- `npm.cmd run typecheck`
- `npm.cmd run lint`
- `php artisan test`

## QA Checklist

1. Open `/admin/dashboard/overview`
2. Confirm `Pickup queue` shows only `received` orders
3. Confirm `Ready for pickup & awaiting cash` shows only unpaid `ready_for_pickup` orders
4. Confirm each queue paginates at 4 items per page
5. Click `View order` in pickup queue
6. Confirm the modal opens and allows:
   - Start processing
   - Mark ready for pickup
   - Cancel order
7. Perform one of those actions and confirm the order disappears from pickup queue
8. Click `View order` in the ready-for-pickup queue
9. Confirm the modal only offers `Mark completed & cash received`
10. Complete the order and confirm it disappears from that queue
11. Test the same flows on desktop, tablet, and mobile widths
