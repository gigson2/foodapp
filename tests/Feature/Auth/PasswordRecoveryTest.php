<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use App\Notifications\CustomerPasswordResetOtpNotification;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Tests\TestCase;

class PasswordRecoveryTest extends TestCase
{
    use RefreshDatabase;

    public function test_phone_lookup_is_rejected_for_password_reset(): void
    {
        $this->postJson('/api/password/forgot', [
            'lookup' => 'phone',
            'login' => '(402) 555-0100',
        ])
            ->assertUnprocessable();

        $this->postJson('/api/password/reset', [
            'lookup' => 'phone',
            'login' => '(402) 555-0100',
            'code' => '123456',
            'password' => 'NewPassword123!',
            'password_confirmation' => 'NewPassword123!',
        ])
            ->assertUnprocessable();
    }

    public function test_customer_can_request_password_reset_by_email_lookup(): void
    {
        Notification::fake();

        $user = User::factory()->create([
            'email' => 'customer@example.com',
            'phone' => '+14025550101',
        ]);

        $this->postJson('/api/password/forgot', [
            'lookup' => 'email',
            'login' => 'CUSTOMER@EXAMPLE.COM',
        ])
            ->assertOk()
            ->assertJsonPath('message', 'If we found an account with a recovery email, a reset code has been sent.');

        Notification::assertSentTo($user, CustomerPasswordResetOtpNotification::class);

        $this->assertDatabaseHas('password_reset_otps', [
            'user_id' => $user->id,
            'login_type' => 'email',
            'login_value' => 'customer@example.com',
        ]);
    }
}
