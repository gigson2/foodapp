# Admin Backend Foundations

This document summarizes the backend foundation that supports the admin console in production.

## Core admin API areas

- dashboard metrics and recent activity
- orders and status transitions
- foods and categories
- reviews
- customers
- analytics and visitors
- notifications
- company settings
- SEO settings
- profile management

## Supporting backend pieces

- Form Request validation on admin write endpoints
- API resources for stable JSON payloads
- role middleware for admin-only access
- file upload handling for public assets
- queue-compatible notifications

## Important operational rules

- order status transitions are validated in the service layer
- payment state can be updated separately from workflow status
- uploaded images are stored on the public disk
- company and SEO content can directly affect storefront branding and metadata
