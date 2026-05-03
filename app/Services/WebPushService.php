<?php

namespace App\Services;

use App\Models\PushSubscription;
use App\Models\User;
use Minishlink\WebPush\Subscription;
use Minishlink\WebPush\WebPush;

class WebPushService
{
    private WebPush $webPush;

    /**
     * @throws \ErrorException
     */
    public function __construct()
    {
        $this->webPush = new WebPush([
            'VAPID' => [
                'subject'    => config('services.vapid.subject'),
                'publicKey'  => config('services.vapid.public_key'),
                'privateKey' => config('services.vapid.private_key'),
            ],
        ]);

        $this->webPush->setReuseVAPIDHeaders(true);
        $this->webPush->setAutomaticPadding(false);
    }

    /**
     * Send a push notification to all of a user's registered subscriptions.
     *
     * @param array<string, mixed> $data  Extra payload data (url, kind, order_id, etc.)
     */
    public function sendToUser(User $user, string $title, string $body, array $data = []): void
    {
        $subscriptions = $user->pushSubscriptions()->get();

        if ($subscriptions->isEmpty()) {
            return;
        }

        $payload = json_encode([
            'title' => $title,
            'body'  => $body,
            ...$data,
        ]);

        $stale = [];

        foreach ($subscriptions as $sub) {
            $subscription = new Subscription(
                $sub->endpoint,
                $sub->public_key,
                $sub->auth_token,
                $sub->content_encoding ?? 'aesgcm',
            );

            try {
                $report = $this->webPush->sendOneNotification($subscription, $payload);

                if (! $report->isSuccess()) {
                    // 410 Gone means the subscription has been removed by the browser
                    if ($report->getResponse()?->getStatusCode() === 410) {
                        $stale[] = $sub->id;
                    }
                }
            } catch (\Throwable) {
                // Never fail the main request due to a push delivery error
            }
        }

        // Clean up expired subscriptions
        if (! empty($stale)) {
            PushSubscription::query()->whereIn('id', $stale)->delete();
        }
    }
}
