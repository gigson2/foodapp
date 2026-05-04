<?php

namespace App\Services;

use App\Models\PushSubscription;
use App\Models\User;
use Illuminate\Support\Facades\Log;
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
     * @param array<string, mixed> $delivery Extra delivery hints (urgency, ttl, topic)
     */
    public function sendToUser(User $user, string $title, string $body, array $data = [], array $delivery = []): void
    {
        $user->loadMissing('notificationPreference', 'pushSubscriptions');

        if ($user->notificationPreference && ! $user->notificationPreference->push_enabled) {
            return;
        }

        $subscriptions = $user->pushSubscriptions()->get();

        if ($subscriptions->isEmpty()) {
            return;
        }

        $payload = json_encode([
            'title' => $title,
            'body'  => $body,
            'silent' => false,
            'vibrate' => $data['vibrate'] ?? [180, 80, 220],
            'renotify' => $data['renotify'] ?? true,
            'timestamp' => now()->getTimestampMs(),
            ...$data,
        ]);

        $options = array_filter([
            'TTL' => (int) ($delivery['ttl'] ?? 300),
            'urgency' => $delivery['urgency'] ?? 'high',
            'topic' => $delivery['topic'] ?? ($data['tag'] ?? $data['kind'] ?? null),
        ], static fn (mixed $value): bool => $value !== null);

        $stale = [];

        foreach ($subscriptions as $sub) {
            $subscription = new Subscription(
                $sub->endpoint,
                $sub->public_key,
                $sub->auth_token,
                $sub->content_encoding ?? 'aesgcm',
            );

            try {
                $report = $this->webPush->sendOneNotification($subscription, $payload, $options);

                if (! $report->isSuccess()) {
                    // 410 Gone means the subscription has been removed by the browser
                    if ($report->getResponse()?->getStatusCode() === 410) {
                        $stale[] = $sub->id;
                    } else {
                        Log::warning('[WebPush] Delivery failed', [
                            'user_id'    => $user->id,
                            'status'     => $report->getResponse()?->getStatusCode(),
                            'reason'     => $report->getReason(),
                            'endpoint'   => substr($sub->endpoint, 0, 60).'…',
                        ]);
                    }
                }
            } catch (\Throwable $e) {
                // Never fail the main request due to a push delivery error
                Log::error('[WebPush] Delivery exception', [
                    'user_id'    => $user->id,
                    'endpoint'   => substr($sub->endpoint, 0, 60).'…',
                    'error'      => $e->getMessage(),
                ]);
            }
        }

        // Clean up expired subscriptions
        if (! empty($stale)) {
            PushSubscription::query()->whereIn('id', $stale)->delete();
        }
    }

    public function hasPushEnabled(User $user): bool
    {
        $user->loadMissing('notificationPreference');

        return $user->notificationPreference?->push_enabled ?? true;
    }

    public function hasSubscriptions(User $user): bool
    {
        return $user->pushSubscriptions()->exists();
    }
}
