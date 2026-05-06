<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Support\PhoneNumber;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class LoginController extends Controller
{
    public function __invoke(LoginRequest $request): JsonResponse
    {
        $login = trim($request->string('login')->toString());
        $normalizedPhone = PhoneNumber::normalizeUs($login);

        $user = User::query()
            ->where(function ($query) use ($login, $normalizedPhone): void {
                $query->where('email', $login)
                    ->orWhere('phone', $login);

                if ($normalizedPhone !== null) {
                    $query->orWhere('phone', $normalizedPhone);
                }
            })
            ->first();

        if (! $user || ! Hash::check($request->string('password')->toString(), $user->password)) {
            return response()->json([
                'message' => 'The provided credentials are incorrect.',
                'errors' => [
                    'login' => ['The provided credentials are incorrect.'],
                ],
            ], 422);
        }

        Auth::login($user, remember: true);

        if ($request->hasSession()) {
            $request->session()->regenerate();
        }

        // Update last_login_at without triggering model events or attribute casting
        // to prevent password re-hashing that would cause immediate logout
        User::query()->where('id', $user->id)->update(['last_login_at' => now()]);
        $user->last_login_at = now();

        return response()->json([
            'message' => 'Login successful.',
            'user' => new UserResource($user->load('customerProfile')),
        ]);
    }
}
