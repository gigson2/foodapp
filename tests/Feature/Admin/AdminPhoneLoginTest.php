<?php

namespace Tests\Feature\Admin;

use Database\Seeders\RestaurantPlatformSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminPhoneLoginTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_login_with_formatted_phone_number_and_password(): void
    {
        $this->seed(RestaurantPlatformSeeder::class);

        $response = $this->withSession([])->postJson('/api/login', [
            'login' => '(402) 555-0100',
            'password' => 'password',
        ]);

        $response
            ->assertOk()
            ->assertJsonPath('user.role', 'admin')
            ->assertJsonPath('user.phone', '+14025550100');

        $this->assertAuthenticated();
    }
}
