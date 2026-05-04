<?php

namespace Tests\Feature\Admin;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AdminCustomerPasswordResetTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_reset_customer_password_to_the_default_temporary_value(): void
    {
        $admin = User::factory()->admin()->create();
        $customer = User::factory()->create([
            'role' => UserRole::Customer->value,
            'password' => 'old-password-123',
        ]);

        Sanctum::actingAs($admin);

        $response = $this->postJson("/api/admin/customers/{$customer->id}/reset-password");

        $response
            ->assertOk()
            ->assertJsonPath('temporary_password', 'n.password1');

        $customer->refresh();

        $this->assertTrue(Hash::check('n.password1', $customer->password));
    }
}
