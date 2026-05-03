<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateAdminPasswordRequest;
use App\Http\Requests\Admin\UpdateAdminProfileRequest;
use App\Http\Resources\UserResource;
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
        return new UserResource($request->user());
    }

    public function update(UpdateAdminProfileRequest $request): UserResource
    {
        $user = $request->user();
        $validated = $request->validated();
        $validated['avatar'] = $this->fileUploadService->replacePublic($user->avatar, $request->file('avatar'), 'avatars');
        $user->fill($validated)->save();

        return new UserResource($user->refresh());
    }

    public function updatePassword(UpdateAdminPasswordRequest $request): JsonResponse
    {
        $request->user()->forceFill([
            'password' => Hash::make($request->string('password')->toString()),
        ])->save();

        return response()->json([
            'message' => 'Password updated successfully.',
        ]);
    }
}
