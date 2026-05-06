# Admin Console Overview

The admin console is a dedicated module within the main SPA and is mounted under `/admin`.

## Main routes

- `/admin/dashboard/overview`
- `/admin/orders`
- `/admin/menu`
- `/admin/categories`
- `/admin/reviews`
- `/admin/customers`
- `/admin/analytics`
- `/admin/notifications`
- `/admin/settings/company`
- `/admin/settings/seo`
- `/admin/settings/pwa`
- `/admin/profile`

## Core workflows

- review and update pickup order status
- manage menu items and categories with modal-based create and edit flows
- moderate customer reviews
- review customer accounts and visitor analytics
- manage company profile, branding, pickup instructions, and SEO metadata
- enable push notifications and send a test notification to the current device

## UI structure

- desktop sidebar navigation
- tablet and mobile navigation variants
- full-width admin content column
- modal-driven detail and edit flows for high-traffic pages

## Data model expectations

The admin console works against live data for orders, foods, categories, reviews, customers, analytics, notifications, company settings, and SEO settings.
