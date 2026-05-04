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

    public function test_removed_customer_password_reset_endpoint_is_not_available(): void
    {
        $admin = User::factory()->admin()->create();
        $customer = User::factory()->create([
            'role' => UserRole::Customer->value,
            'password' => 'old-password-123',
        ]);

        Sanctum::actingAs($admin);

        $response = $this->postJson("/api/admin/customers/{$customer->id}/reset-password");

        $response->assertNotFound();

        $customer->refresh();

        $this->assertTrue(Hash::check('old-password-123', $customer->password));
    }
}
