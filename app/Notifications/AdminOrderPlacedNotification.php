<?php

namespace App\Notifications;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class AdminOrderPlacedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        protected Order $order,
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
            'title' => 'New pickup order received',
            'body'  => sprintf('%s placed order %s for pickup.', $this->order->customer_name, $this->order->order_number),
            'data'  => [
                'kind'         => 'new_order',
                'tag'          => 'order-'.$this->order->id,
                'order_id'     => $this->order->id,
                'order_number' => $this->order->order_number,
                'url'          => '/admin/orders',
                'renotify'     => true,
                'vibrate'      => [220, 120, 220, 120, 320],
                'actions'      => [
                    ['action' => 'open', 'title' => 'Open orders'],
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
            'title' => 'New pickup order received',
            'message' => sprintf('%s placed order %s for pickup.', $this->order->customer_name, $this->order->order_number),
            'kind' => 'new_order',
            'order_id' => $this->order->id,
            'order_number' => $this->order->order_number,
        ];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage())->line('A new pickup order was placed.');
    }
}
