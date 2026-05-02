<?php

namespace App\Http\Middleware;

use App\Enums\UserRole;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserHasRole
{
    /**
     * @param  array<int, string>  $roles
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();

        if (! $user) {
            abort(Response::HTTP_UNAUTHORIZED);
        }

        $allowedRoles = array_map(
            static fn (string $role): string => UserRole::tryFrom($role)?->value ?? $role,
            $roles,
        );

        if ($allowedRoles !== [] && ! in_array($user->role, $allowedRoles, true)) {
            abort(Response::HTTP_FORBIDDEN);
        }

        return $next($request);
    }
}
