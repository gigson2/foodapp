<?php

namespace App\Notifications\Channels;

use App\Services\WebPushService;
use Illuminate\Notifications\Notification;

class WebPushChannel
{
    public function __construct(private WebPushService $service)
    {
    }

    /**
     * Send the notification through the Web Push channel.
     */
    public function send(object $notifiable, Notification $notification): void
    {
        if (! method_exists($notification, 'toWebPush')) {
            return;
        }

        /** @var array{title: string, body: string, data?: array<string, mixed>} $message */
        $message = $notification->toWebPush($notifiable);

        $this->service->sendToUser(
            $notifiable,
            $message['title'],
            $message['body'],
            $message['data'] ?? [],
        );
    }
}
