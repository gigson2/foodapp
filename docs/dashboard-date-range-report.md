# Dashboard Date Range Filtering

Both the admin dashboard and customer dashboard support date-range-aware metrics.

## Admin overview

The admin overview accepts:

- `date_from`
- `date_to`

This affects KPI metrics, status breakdowns, revenue series, recent activity slices, and visitor summary calculations.

## Customer overview

The customer overview supports the same range concept for a customer's own activity.

## Behavior notes

- invalid inverted ranges are normalized server-side
- date ranges are returned in the payload so the UI can display the active filter window
- dashboards default to short, recent windows when explicit dates are not provided
