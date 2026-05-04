<?php

namespace Tests\Feature\Auth;

use App\Enums\UserRole;
use App\Models\User;
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
        $this->seed('Database\\Seeders\\RestaurantPlatformSeeder');

        $loginResponse = $this->withSession([])->postJson('/api/login', [
            'login' => '+16462503361',
            'password' => 'a.password!',
        ]);

        $loginResponse
            ->assertOk()
            ->assertJsonMissingPath('token')
            ->assertJsonPath('user.role', UserRole::Admin->value)
            ->assertJsonPath('user.phone', '+16462503361');

        $this->assertAuthenticated();

        $meResponse = $this->getJson('/api/me');

        $meResponse
            ->assertOk()
            ->assertJsonPath('data.role', UserRole::Admin->value)
            ->assertJsonPath('data.phone', '+16462503361');

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

    public function test_cleared_session_cannot_access_me_without_reauthentication(): void
    {
        $this->seed('Database\\Seeders\\RestaurantPlatformSeeder');

        $this->withSession([])->postJson('/api/login', [
            'login' => '+16462503361',
            'password' => 'a.password!',
        ])->assertOk();

        $this->flushSession();
        Auth::forgetGuards();

        $this->getJson('/api/me')
            ->assertOk()
            ->assertExactJson([
                'data' => null,
            ]);
    }
}
