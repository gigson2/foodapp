<?php

namespace Tests\Feature\Auth;

use App\Enums\UserRole;
use App\Models\User;
use Database\Seeders\RestaurantPlatformSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Auth;
use Tests\TestCase;

class SessionAuthenticationTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_me_endpoint_returns_null_payload(): void
    {
        $response = $this->withSession([])->getJson('/api/me');

        $response
            ->assertOk()
            ->assertExactJson([
                'data' => null,
            ]);
    }

    public function test_admin_login_establishes_session_for_me_and_dashboard(): void
    {
        $this->seed(RestaurantPlatformSeeder::class);

        $loginResponse = $this->withSession([])->postJson('/api/login', [
            'login' => '+14025550100',
            'password' => 'password',
        ]);

        $loginResponse
            ->assertOk()
            ->assertJsonPath('user.role', UserRole::Admin->value)
            ->assertJsonPath('user.phone', '+14025550100');

        $this->assertAuthenticated();

        $meResponse = $this->getJson('/api/me');

        $meResponse
            ->assertOk()
            ->assertJsonPath('data.role', UserRole::Admin->value)
            ->assertJsonPath('data.phone', '+14025550100');

        $dashboardResponse = $this->getJson('/api/admin/dashboard');

        $dashboardResponse
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
                'recent_orders',
            ]);
    }

    public function test_logout_clears_authenticated_session(): void
    {
        $admin = User::factory()->admin()->create([
            'phone' => '+14025559999',
            'password' => 'password',
        ]);

        $this->withSession([])->postJson('/api/login', [
            'login' => $admin->phone,
            'password' => 'password',
        ])->assertOk();

        $this->postJson('/api/logout')
            ->assertOk()
            ->assertJsonPath('message', 'Logout successful.');

        Auth::forgetGuards();
        $this->assertGuest('web');

        $this->getJson('/api/me')
            ->assertOk()
            ->assertExactJson([
                'data' => null,
            ]);
    }
}
