<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;

class CustomerBroadcastMessageNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        protected string $title,
        protected string $message,
        protected string $url = '/customer/notifications',
    ) {
    }

    /**
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database', 'webpush'];
    }

    /**
     * @return array<string, mixed>
     */
    public function toWebPush(object $notifiable): array
    {
        return [
            'title' => $this->title,
            'body' => $this->message,
            'data' => [
                'kind' => 'system',
                'tag' => 'customer-broadcast',
                'url' => $this->url,
                'renotify' => true,
                'vibrate' => [220, 120, 220, 120, 320],
                'actions' => [
                    ['action' => 'open', 'title' => 'Open app'],
                ],
            ],
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public function toDatabase(object $notifiable): array
    {
        return [
            'title' => $this->title,
            'message' => $this->message,
            'kind' => 'system',
            'url' => $this->url,
        ];
    }
}
