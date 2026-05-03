<?php

namespace App\Enums;

enum OrderType: string
{
    case Pickup = 'pickup';
    case Delivery = 'delivery';

    /**
     * @return array<int, string>
     */
    public static function values(): array
    {
        return array_map(static fn (self $type): string => $type->value, self::cases());
    }
}
