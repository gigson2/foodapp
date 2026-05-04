<?php

namespace Tests\Feature\Customer;

use App\Enums\OrderStatus;
use App\Models\Category;
use App\Models\Food;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class CustomerOrderDeduplicationTest extends TestCase
{
    use RefreshDatabase;

    public function test_same_submission_key_returns_existing_order_without_creating_a_duplicate(): void
    {
        $customer = User::factory()->create();
        $category = Category::factory()->create();
        $food = Food::factory()->create([
            'category_id' => $category->id,
            'is_available' => true,
            'price' => 25,
        ]);

        Sanctum::actingAs($customer);

        $payload = [
            'food_id' => $food->id,
            'quantity' => 2,
            'submission_key' => 'submission-test-001',
        ];

        $firstResponse = $this->postJson('/api/customer/orders', $payload);
        $secondResponse = $this->postJson('/api/customer/orders', $payload);

        $firstResponse->assertSuccessful();
        $secondResponse->assertSuccessful();

        $this->assertDatabaseCount('orders', 1);
        $this->assertDatabaseHas('orders', [
            'user_id' => $customer->id,
            'status' => OrderStatus::Received->value,
            'submission_key' => 'submission-test-001',
        ]);

        $this->assertSame(
            $firstResponse->json('data.order_number'),
            $secondResponse->json('data.order_number'),
        );
    }
}
