<?php

namespace Tests\Feature\Admin;

use App\Enums\OrderStatus;
use App\Enums\OrderType;
use App\Enums\PaymentMethod;
use App\Enums\PaymentStatus;
use App\Models\Category;
use App\Models\Food;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AdminOrderManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_update_order_status(): void
    {
        $admin = User::factory()->admin()->create();
        $customer = User::factory()->create();
        $category = Category::factory()->create();
        $food = Food::factory()->create(['category_id' => $category->id]);

        $order = Order::query()->create([
            'user_id' => $customer->id,
            'order_number' => 'DRI-55555',
            'customer_name' => $customer->name,
            'customer_email' => $customer->email,
            'customer_phone' => $customer->phone,
            'order_type' => OrderType::Pickup,
            'status' => OrderStatus::Received,
            'subtotal' => 30,
            'delivery_fee' => 0,
            'discount' => 0,
            'tax' => 0,
            'total' => 30,
            'payment_method' => PaymentMethod::Cash,
            'payment_status' => PaymentStatus::Unpaid,
            'placed_at' => now(),
        ]);

        OrderItem::query()->create([
            'order_id' => $order->id,
            'food_id' => $food->id,
            'food_name' => $food->name,
            'unit_price' => 30,
            'quantity' => 1,
            'line_total' => 30,
        ]);

        Sanctum::actingAs($admin);

        $response = $this->patchJson("/api/admin/orders/{$order->id}/status", [
            'status' => OrderStatus::Completed->value,
        ]);

        $response
            ->assertOk()
            ->assertJsonPath('data.status', OrderStatus::Completed->value);

        $this->assertDatabaseHas('orders', [
            'id' => $order->id,
            'status' => OrderStatus::Completed->value,
            'payment_status' => PaymentStatus::Paid->value,
        ]);
    }
}
