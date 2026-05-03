<?php

namespace App\Enums;

enum OrderStatus: string
{
    case Pending = 'pending';
    case Received = 'received';
    case Processing = 'processing';
    case ReadyForPickup = 'ready_for_pickup';
    case OnDelivery = 'on_delivery';
    case Completed = 'completed';
    case Cancelled = 'cancelled';

    /**
     * @return array<int, string>
     */
    public static function values(): array
    {
        return array_map(static fn (self $status): string => $status->value, self::cases());
    }
}
