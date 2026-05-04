<?php

namespace Tests\Feature\Customer;

use App\Enums\OrderStatus;
use App\Enums\OrderType;
use App\Enums\PaymentMethod;
use App\Enums\PaymentStatus;
use App\Models\Order;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class CustomerOrdersIndexTest extends TestCase
{
    use RefreshDatabase;

    public function test_customer_orders_index_filters_by_status_and_date_and_paginates(): void
    {
        $customer = User::factory()->create([
            'phone' => '+14025550110',
        ]);
        $otherCustomer = User::factory()->create();

        $this->createOrder($customer, 'ORD-1001', OrderStatus::Completed, '2026-05-10 12:00:00');
        $this->createOrder($customer, 'ORD-1002', OrderStatus::Completed, '2026-05-12 12:00:00');
        $this->createOrder($customer, 'ORD-1003', OrderStatus::Completed, '2026-05-14 12:00:00');
        $this->createOrder($customer, 'ORD-1004', OrderStatus::Completed, '2026-05-16 12:00:00');
        $this->createOrder($customer, 'ORD-1005', OrderStatus::Completed, '2026-05-18 12:00:00');
        $latestMatchingOrder = $this->createOrder($customer, 'ORD-1006', OrderStatus::Completed, '2026-05-20 12:00:00');
        $this->createOrder($customer, 'ORD-3001', OrderStatus::Cancelled, '2026-05-15 12:00:00');
        $this->createOrder($customer, 'ORD-3002', OrderStatus::Completed, '2026-04-28 12:00:00');
        $this->createOrder($otherCustomer, 'ORD-2001', OrderStatus::Completed, '2026-05-21 12:00:00');

        Sanctum::actingAs($customer);

        $response = $this->getJson('/api/customer/orders?status=completed&date_from=2026-05-01&date_to=2026-05-31&per_page=5&page=1');

        $response
            ->assertOk()
            ->assertJsonCount(5, 'data')
            ->assertJsonPath('meta.total', 6)
            ->assertJsonPath('meta.per_page', 5)
            ->assertJsonPath('meta.current_page', 1)
            ->assertJsonPath('meta.last_page', 2)
            ->assertJsonPath('data.0.id', $latestMatchingOrder->id)
            ->assertJsonPath('data.0.order_number', 'ORD-1006');
    }

    private function createOrder(User $user, string $orderNumber, OrderStatus $status, string $placedAt): Order
    {
        return Order::query()->create([
            'user_id' => $user->id,
            'order_number' => $orderNumber,
            'customer_name' => $user->name,
            'customer_email' => $user->email,
            'customer_phone' => $user->phone,
            'order_type' => OrderType::Pickup->value,
            'status' => $status->value,
            'subtotal' => 25,
            'delivery_fee' => 0,
            'discount' => 0,
            'tax' => 0,
            'total' => 25,
            'payment_method' => PaymentMethod::Cash->value,
            'payment_status' => PaymentStatus::Unpaid->value,
            'placed_at' => $placedAt,
        ]);
    }
}
