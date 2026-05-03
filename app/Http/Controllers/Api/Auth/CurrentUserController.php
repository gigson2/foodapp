<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CurrentUserController extends Controller
{
    public function __invoke(Request $request): JsonResponse
    {
        $user = Auth::guard('sanctum')->user() ?? Auth::guard('web')->user();

        return response()->json([
            'data' => $user ? (new UserResource($user->loadMissing('customerProfile')))->resolve($request) : null,
        ]);
    }
}
