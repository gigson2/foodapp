<?php

namespace App\Http\Controllers\Api\Customer;

use App\Http\Controllers\Controller;
use App\Http\Requests\Customer\UpdateCustomerPasswordRequest;
use App\Http\Requests\Customer\UpdateCustomerProfileRequest;
use App\Http\Resources\UserResource;
use App\Models\CustomerProfile;
use App\Models\NotificationPreference;
use App\Support\FileUploadService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class ProfileController extends Controller
{
    public function __construct(
        protected FileUploadService $fileUploadService,
    ) {
    }

    public function show(Request $request): UserResource
    {
        return new UserResource($request->user()->loadMissing(['customerProfile', 'notificationPreference']));
    }

    public function update(UpdateCustomerProfileRequest $request): UserResource
    {
        $user = $request->user();
        $validated = $request->validated();

        $user->fill([
            'name' => $validated['name'],
            'phone' => $validated['phone'],
            'email' => $validated['email'] ?? null,
            'avatar' => $this->fileUploadService->replacePublic($user->avatar, $request->file('avatar'), 'avatars'),
        ])->save();

        CustomerProfile::query()->updateOrCreate(
            ['user_id' => $user->id],
            [
                'address' => $validated['address'] ?? null,
                'city' => $validated['city'] ?? null,
                'notes' => $validated['notes'] ?? null,
            ],
        );

        NotificationPreference::query()->updateOrCreate(
            ['user_id' => $user->id],
            [
                'in_app_enabled' => (bool) ($validated['in_app_enabled'] ?? true),
                'push_enabled' => (bool) ($validated['push_enabled'] ?? true),
                'email_enabled' => (bool) ($validated['email_enabled'] ?? false),
                'preferences' => [
                    'order_updates' => true,
                    'review_updates' => true,
                ],
            ],
        );

        return new UserResource($user->refresh()->loadMissing(['customerProfile', 'notificationPreference']));
    }

    public function updatePassword(UpdateCustomerPasswordRequest $request): JsonResponse
    {
        $request->user()->forceFill([
            'password' => Hash::make($request->string('password')->toString()),
        ])->save();

        return response()->json([
            'message' => 'Password updated successfully.',
        ]);
    }
}
