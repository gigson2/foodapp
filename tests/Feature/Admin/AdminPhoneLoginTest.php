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
            'login' => '(646) 250-3361',
            'password' => 'a.password!',
        ]);

        $response
            ->assertOk()
            ->assertJsonPath('user.role', 'admin')
            ->assertJsonPath('user.phone', '+16462503361');

        $this->assertAuthenticated();
    }
}
