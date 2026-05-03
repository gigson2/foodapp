<?php

namespace Tests\Feature\Admin;

use App\Enums\UserRole;
use App\Models\User;
use Database\Seeders\RestaurantPlatformSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AdminDashboardTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_view_dashboard_metrics(): void
    {
        $this->seed(RestaurantPlatformSeeder::class);
        $admin = User::query()->where('role', UserRole::Admin->value)->firstOrFail();

        Sanctum::actingAs($admin);

        $response = $this->getJson('/api/admin/dashboard');

        $response
            ->assertOk()
            ->assertJsonStructure([
                'metrics' => [
                    'total_orders',
                    'pending_orders',
                    'completed_orders',
                    'cancelled_orders',
                    'total_customers',
                    'total_visitors',
                    'total_revenue',
                    'today_revenue',
                    'week_revenue',
                    'month_revenue',
                ],
                'recent_orders' => [
                    '*' => [
                        'id',
                        'order_number',
                        'status',
                    ],
                ],
            ]);
    }

    public function test_customer_cannot_view_admin_dashboard(): void
    {
        $customer = User::factory()->create([
            'role' => UserRole::Customer->value,
        ]);

        Sanctum::actingAs($customer);

        $this->getJson('/api/admin/dashboard')->assertForbidden();
    }
}
