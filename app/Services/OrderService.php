<?php

namespace App\Services;

use App\Enums\OrderStatus;
use App\Enums\OrderType;
use App\Enums\PaymentMethod;
use App\Enums\PaymentStatus;
use App\Models\Food;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\User;

class OrderService
{
    /**
     * @param  array<string, mixed>  $input
     */
    public function createPickupOrder(User $user, Food $food, array $input): Order
    {
        $quantity = (int) $input['quantity'];
        $subtotal = $food->price * $quantity;

        $order = Order::query()->create([
            'user_id' => $user->id,
            'order_number' => $this->generateOrderNumber(),
            'customer_name' => $user->name,
            'customer_email' => $user->email,
            'customer_phone' => $user->phone,
            'delivery_address' => null,
            'order_type' => OrderType::Pickup,
            'status' => OrderStatus::Received,
            'subtotal' => $subtotal,
            'delivery_fee' => 0,
            'discount' => 0,
            'tax' => 0,
            'total' => $subtotal,
            'payment_method' => PaymentMethod::Cash,
            'payment_status' => PaymentStatus::Unpaid,
            'customer_note' => $input['customer_note'] ?? null,
            'placed_at' => now(),
        ]);

        OrderItem::query()->create([
            'order_id' => $order->id,
            'food_id' => $food->id,
            'food_name' => $food->name,
            'unit_price' => $food->price,
            'quantity' => $quantity,
            'line_total' => $subtotal,
            'customer_note' => $input['customer_note'] ?? null,
        ]);

        return $order->load('items');
    }

    public function updateStatus(Order $order, OrderStatus $status, ?string $adminNote = null): Order
    {
        $attributes = [
            'status' => $status,
            'admin_note' => $adminNote,
        ];

        if ($status === OrderStatus::Processing && ! $order->accepted_at) {
            $attributes['accepted_at'] = now();
        }

        if ($status === OrderStatus::Completed) {
            $attributes['completed_at'] = now();
            $attributes['payment_status'] = PaymentStatus::Paid;
        }

        if ($status === OrderStatus::Cancelled) {
            $attributes['cancelled_at'] = now();
        }

        $order->forceFill($attributes)->save();

        return $order->refresh()->load(['items', 'user']);
    }

    protected function generateOrderNumber(): string
    {
        return 'DRI-'.str_pad((string) random_int(1, 99999), 5, '0', STR_PAD_LEFT);
    }
}
