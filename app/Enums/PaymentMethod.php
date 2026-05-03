<?php

namespace App\Enums;

enum PaymentMethod: string
{
    case Cash = 'cash';
    case Card = 'card';
    case MobileMoney = 'mobile_money';

    /**
     * @return array<int, string>
     */
    public static function values(): array
    {
        return array_map(static fn (self $method): string => $method->value, self::cases());
    }
}
