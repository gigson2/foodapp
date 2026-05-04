<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Http\Resources\UserResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CurrentUserController extends Controller
{
    public function __invoke(Request $request): JsonResponse
    {
        $user = Auth::guard('sanctum')->user() ?? Auth::guard('web')->user();

        if ($user instanceof User) {
            $user->loadMissing('customerProfile');
        }

        return response()->json([
            'data' => $user instanceof User ? (new UserResource($user))->resolve($request) : null,
        ]);
    }
}
