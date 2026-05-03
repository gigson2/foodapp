<?php

namespace App\Http\Controllers\Api\Customer;

use App\Http\Controllers\Controller;
use App\Http\Requests\Customer\StorePushSubscriptionRequest;
use App\Models\PushSubscription;
use Illuminate\Http\JsonResponse;

class PushSubscriptionController extends Controller
{
    public function store(StorePushSubscriptionRequest $request): JsonResponse
    {
        $subscription = PushSubscription::query()->updateOrCreate(
            ['endpoint_hash' => hash('sha256', $request->string('endpoint')->toString())],
            [
                'user_id' => $request->user()->id,
                'endpoint' => $request->string('endpoint')->toString(),
                'public_key' => $request->input('public_key'),
                'auth_token' => $request->input('auth_token'),
                'content_encoding' => $request->input('content_encoding'),
                'user_agent' => $request->input('user_agent'),
            ],
        );

        return response()->json([
            'message' => 'Push subscription saved.',
            'subscription_id' => $subscription->id,
        ], 201);
    }
}
