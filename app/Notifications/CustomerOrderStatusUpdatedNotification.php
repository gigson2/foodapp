<?php

namespace App\Notifications;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class CustomerOrderStatusUpdatedNotification extends Notification
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
            'title' => 'Order status updated',
            'body'  => sprintf('Your pickup order %s is now %s.', $this->order->order_number, str_replace('_', ' ', $this->order->status->value)),
            'data'  => [
                'kind'         => 'order_status',
                'order_id'     => $this->order->id,
                'order_number' => $this->order->order_number,
                'status'       => $this->order->status->value,
                'url'          => '/customer',
            ],
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public function toDatabase(object $notifiable): array
    {
        return [
            'title' => 'Order status updated',
            'message' => sprintf('Your pickup order %s is now %s.', $this->order->order_number, str_replace('_', ' ', $this->order->status->value)),
            'kind' => 'order_status',
            'order_id' => $this->order->id,
            'order_number' => $this->order->order_number,
            'status' => $this->order->status->value,
        ];
    }
}
