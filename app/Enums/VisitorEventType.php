<?php

namespace App\Enums;

enum VisitorEventType: string
{
    case PageView = 'page_view';
    case FoodView = 'food_view';
    case AddToCart = 'add_to_cart';
    case CheckoutStarted = 'checkout_started';
    case OrderCompleted = 'order_completed';
    case ReviewSubmitted = 'review_submitted';
    case Registration = 'registration';

    /**
     * @return array<int, string>
     */
    public static function values(): array
    {
        return array_map(static fn (self $type): string => $type->value, self::cases());
    }
}
