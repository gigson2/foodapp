<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\WebPushService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PushNotificationTestController extends Controller
{
    public function __construct(
        private readonly WebPushService $webPushService,
    ) {
    }

    public function __invoke(Request $request): JsonResponse
    {
        $user = $request->user();

        if (! $user) {
            abort(401);
        }

        if (! $this->webPushService->hasPushEnabled($user)) {
            return response()->json([
                'message' => 'Push notifications are disabled for this account. Enable push notifications in your profile first.',
            ], 422);
        }

        if (! $this->webPushService->hasSubscriptions($user)) {
            return response()->json([
                'message' => 'This device is not registered for push notifications yet. Enable notifications on this device first.',
            ], 422);
        }

        $isAdmin = $user->role === 'admin';
        $title = $isAdmin ? 'Admin push test' : 'Customer push test';
        $body = $isAdmin
            ? 'This is a real web-push test for the admin dashboard on this device.'
            : 'This is a real web-push test for your customer account on this device.';
        $url = $isAdmin ? '/admin/notifications' : '/customer/notifications';

        $this->webPushService->sendToUser(
            $user,
            $title,
            $body,
            [
                'kind' => 'system',
                'tag' => $isAdmin ? 'admin-test' : 'customer-test',
                'url' => $url,
                'renotify' => true,
                'vibrate' => [220, 120, 220, 120, 320],
                'actions' => [
                    ['action' => 'open', 'title' => 'Open app'],
                ],
            ],
            [
                'urgency' => 'high',
                'ttl' => 300,
                'topic' => $isAdmin ? 'admin-test' : 'customer-test',
            ],
        );

        return response()->json([
            'message' => 'A real web-push test notification was sent to this device.',
        ]);
    }
}
