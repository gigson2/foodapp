<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use App\Notifications\CustomerPasswordResetOtpNotification;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Str;
use Tests\TestCase;

class PasswordRecoveryTest extends TestCase
{
    use RefreshDatabase;

    public function test_customer_can_request_password_reset_by_phone_and_complete_otp_reset(): void
    {
        Notification::fake();

        $user = User::factory()->create([
            'email' => 'customer@example.com',
            'phone' => '+14025550100',
            'password' => 'OldPassword123!',
        ]);

        DB::table('sessions')->insert([
            'id' => (string) Str::uuid(),
            'user_id' => $user->id,
            'ip_address' => '127.0.0.1',
            'user_agent' => 'PHPUnit',
            'payload' => 'a:0:{}',
            'last_activity' => now()->timestamp,
        ]);

        DB::table('password_reset_tokens')->insert([
            'email' => $user->email,
            'token' => 'legacy-token',
            'created_at' => now(),
        ]);

        $user->createToken('legacy-mobile-token');

        $this->postJson('/api/password/forgot', [
            'lookup' => 'phone',
            'login' => '(402) 555-0100',
        ])
            ->assertOk()
            ->assertJsonPath('message', 'If we found an account with a recovery email, a reset code has been sent.');

        $this->assertDatabaseHas('password_reset_otps', [
            'user_id' => $user->id,
            'login_type' => 'phone',
            'login_value' => '+14025550100',
            'delivery_channel' => 'email',
            'delivery_destination' => 'customer@example.com',
        ]);

        $otp = null;

        Notification::assertSentTo($user, CustomerPasswordResetOtpNotification::class, function ($notification) use (&$otp) {
            $reflection = new \ReflectionClass($notification);
            $property = $reflection->getProperty('otp');
            $property->setAccessible(true);
            $otp = $property->getValue($notification);

            return is_string($otp) && strlen($otp) === 6;
        });

        $this->assertNotNull($otp);

        $this->postJson('/api/password/reset', [
            'lookup' => 'phone',
            'login' => '(402) 555-0100',
            'code' => $otp,
            'password' => 'NewPassword123!',
            'password_confirmation' => 'NewPassword123!',
        ])
            ->assertOk()
            ->assertJsonPath('message', 'Password reset successful. Sign in with your new password.');

        $user->refresh();

        $this->assertTrue(Hash::check('NewPassword123!', $user->password));
        $this->assertDatabaseCount('password_reset_otps', 0);
        $this->assertDatabaseMissing('sessions', ['user_id' => $user->id]);
        $this->assertDatabaseMissing('password_reset_tokens', ['email' => $user->email]);
        $this->assertDatabaseCount('personal_access_tokens', 0);

        $this->postJson('/api/login', [
            'login' => '+14025550100',
            'password' => 'NewPassword123!',
        ])
            ->assertOk()
            ->assertJsonPath('user.id', $user->id);
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
