# Admin Real Data Integration

The admin console is connected to live Laravel endpoints rather than local mock data.

## Live data areas

- dashboard overview metrics and widgets
- orders
- foods
- categories
- reviews
- customers
- analytics
- notifications
- company settings
- SEO settings
- profile settings

## Frontend behavior

- list pages use API-backed pagination and searching
- dashboard and analytics charts render live aggregates
- create and update flows submit directly to Laravel endpoints
- public-content mutations can signal storefront tabs to refresh

## File and media handling

- food images
- category images
- company branding assets
- SEO open graph images
- profile avatars

All of these are handled through live upload flows and stored on the public disk.
