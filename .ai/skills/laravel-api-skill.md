# Laravel API Skill

## Conventions

- Put controllers under `app/Http/Controllers/Api/{Public|Customer|Admin}`.
- Validate with Form Requests.
- Authorize with policies or route middleware before mutating state.
- Return JsonResources or ResourceCollections, not raw Eloquent models.
- Move pricing, ordering, and notification orchestration into services/actions.
- Cover critical writes with feature tests.
