# Admin Dashboard Order Queues

The admin dashboard overview includes queue-oriented widgets so staff can review operational work without leaving the dashboard.

## Current queue widgets

### Pickup queue

- focuses on newly received pickup orders
- supports quick review from the dashboard
- is intended to move staff quickly from receipt to processing

### Completed queue

- surfaces recently completed orders
- helps staff confirm recent fulfillment activity

## Quick-view behavior

- order inspection happens in a modal instead of an inline panel
- admins can review customer details, items, payment status, and internal notes without scrolling down the page
- the same modal pattern is used on the dedicated orders page

## Data source

- queue widgets are backed by live database orders
- dashboard metrics and lists are returned from `AdminDashboardController`
- order data is serialized through the same resource layer used elsewhere in the admin UI

## Related pages

- `/admin/dashboard/overview`
- `/admin/orders`
