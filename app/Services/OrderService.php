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
use App\Notifications\AdminOrderPlacedNotification;
use App\Notifications\CustomerOrderStatusUpdatedNotification;
use Illuminate\Support\Facades\DB;
use LogicException;

class OrderService
{
    /**
     * @param  array<string, mixed>  $input
     */
    public function createPickupOrder(User $user, Food $food, array $input): Order
    {
        $quantity = (int) $input['quantity'];
        $subtotal = $food->price * $quantity;
        $submissionKey = trim((string) ($input['submission_key'] ?? ''));

        if ($submissionKey !== '') {
            $existingOrder = Order::query()
                ->where('user_id', $user->id)
                ->where('submission_key', $submissionKey)
                ->first();

            if ($existingOrder) {
                return $existingOrder->load(['items', 'user']);
            }
        }

        $duplicateOrder = $this->findRecentDuplicatePickupOrder($user, $food, $quantity, $input['customer_note'] ?? null, $subtotal);

        if ($duplicateOrder) {
            return $duplicateOrder->load(['items', 'user']);
        }

        $order = DB::transaction(function () use ($food, $input, $quantity, $subtotal, $submissionKey, $user): Order {
            $order = Order::query()->create([
                'user_id' => $user->id,
                'order_number' => $this->generateOrderNumber(),
                'submission_key' => $submissionKey !== '' ? $submissionKey : null,
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

            return $order;
        });

        $order->load('items');

        User::query()
            ->where('role', 'admin')
            ->get()
            ->each(fn (User $admin) => $admin->notify(new AdminOrderPlacedNotification($order)));

        return $order;
    }

    public function updateStatus(Order $order, OrderStatus $status, ?string $adminNote = null): Order
    {
        $this->assertValidStatusTransition($order, $status);

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

        if ($order->user) {
            $order->user->notify(new CustomerOrderStatusUpdatedNotification($order));
        }

        return $order->refresh()->load(['items', 'user']);
    }

    public function updatePaymentStatus(Order $order, PaymentStatus $paymentStatus): Order
    {
        $order->forceFill([
            'payment_status' => $paymentStatus,
        ])->save();

        return $order->refresh()->load(['items', 'user']);
    }

    public function updateAdminNote(Order $order, ?string $adminNote): Order
    {
        $order->forceFill([
            'admin_note' => $adminNote,
        ])->save();

        return $order->refresh()->load(['items', 'user']);
    }

    protected function generateOrderNumber(): string
    {
        do {
            $orderNumber = 'DRI-'.str_pad((string) random_int(1, 99999), 5, '0', STR_PAD_LEFT);
        } while (Order::query()->where('order_number', $orderNumber)->exists());

        return $orderNumber;
    }

    protected function findRecentDuplicatePickupOrder(User $user, Food $food, int $quantity, ?string $customerNote, float $subtotal): ?Order
    {
        $normalizedNote = trim((string) ($customerNote ?? ''));

        return Order::query()
            ->where('user_id', $user->id)
            ->whereIn('status', [
                OrderStatus::Received,
                OrderStatus::Processing,
                OrderStatus::ReadyForPickup,
            ])
            ->where('total', $subtotal)
            ->where('placed_at', '>=', now()->subMinutes(2))
            ->where(function ($query) use ($normalizedNote): void {
                if ($normalizedNote === '') {
                    $query->whereNull('customer_note')->orWhere('customer_note', '');

                    return;
                }

                $query->where('customer_note', $normalizedNote);
            })
            ->whereHas('items', function ($query) use ($food, $quantity): void {
                $query
                    ->where('food_id', $food->id)
                    ->where('quantity', $quantity)
                    ->where('unit_price', $food->price);
            })
            ->latest('placed_at')
            ->first();
    }

    protected function assertValidStatusTransition(Order $order, OrderStatus $status): void
    {
        $currentStatus = $order->status instanceof OrderStatus
            ? $order->status
            : OrderStatus::from((string) $order->status);

        $allowedTransitions = [
            OrderStatus::Received->value => [OrderStatus::Received, OrderStatus::Processing, OrderStatus::Cancelled],
            OrderStatus::Processing->value => [OrderStatus::Processing, OrderStatus::ReadyForPickup],
            OrderStatus::ReadyForPickup->value => [OrderStatus::ReadyForPickup, OrderStatus::Completed],
            OrderStatus::Completed->value => [OrderStatus::Completed],
            OrderStatus::Cancelled->value => [OrderStatus::Cancelled],
        ];

        $allowed = $allowedTransitions[$currentStatus->value] ?? [$currentStatus];

        if (! in_array($status, $allowed, true)) {
            throw new LogicException(sprintf(
                'Orders in status [%s] cannot be moved to [%s].',
                $currentStatus->value,
                $status->value,
            ));
        }
    }
}
