<?php

namespace App\Http\Controllers\Api\Auth;

use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Resources\UserResource;
use App\Models\CustomerProfile;
use App\Models\NotificationPreference;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;

class RegisterController extends Controller
{
    public function __invoke(RegisterRequest $request): JsonResponse
    {
        $email = $request->filled('email')
            ? $request->string('email')->lower()->toString()
            : null;

        $user = User::query()->create([
            'name' => $request->string('name')->toString(),
            'email' => $email,
            'phone' => $request->string('phone')->toString(),
            'password' => $request->string('password')->toString(),
            'role' => UserRole::Customer->value,
            'status' => 'active',
            'email_verified_at' => $email ? now() : null,
        ]);

        CustomerProfile::query()->create([
            'user_id' => $user->id,
            'address' => $request->input('address'),
            'city' => $request->input('city'),
            'notes' => $request->input('notes'),
        ]);

        NotificationPreference::query()->create([
            'user_id' => $user->id,
            'in_app_enabled' => true,
            'push_enabled' => true,
            'email_enabled' => false,
            'preferences' => [
                'order_updates' => true,
            ],
        ]);

        Auth::login($user);
        $request->session()->regenerate();
        $user->forceFill(['last_login_at' => now()])->save();
        $token = $user->createToken($this->tokenName($request))->plainTextToken;

        return response()->json([
            'message' => 'Registration successful.',
            'token' => $token,
            'user' => new UserResource($user->load(['customerProfile', 'notificationPreference'])),
        ], 201);
    }

    private function tokenName(Request $request): string
    {
        $segment = $request->userAgent() ? substr(md5($request->userAgent()), 0, 8) : 'unknown';

        return sprintf('spa-%s-%s', now()->timestamp, $segment);
    }
}
