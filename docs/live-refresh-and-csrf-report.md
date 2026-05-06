# Live Refresh And CSRF Handling

This document covers two production behaviors that matter for day-to-day operations: cross-tab storefront refresh and CSRF handling for SPA writes.

## Public content refresh

When admin users change public-facing content such as foods, categories, company settings, or reviews, the storefront can be notified across tabs through a local-storage based sync mechanism.

## Current sync scopes

- foods
- categories
- company settings
- reviews

## CSRF handling

The shared Axios client:

- ensures a Sanctum CSRF cookie before write requests
- retries once after a `419` with a fresh CSRF cookie
- retries once after a transient no-response network failure, which helps mobile wake-from-idle cases

## Why this matters

- admin saves are more resilient
- separate storefront tabs can react to admin-side changes
- session auth remains aligned with Laravel's normal CSRF protections
