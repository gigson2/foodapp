<?php

namespace App\Services;

use App\Models\PasswordResetOtp;
use App\Models\User;
use App\Notifications\CustomerPasswordResetOtpNotification;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class PasswordRecoveryService
{
    protected const OTP_EXPIRY_MINUTES = 15;

    protected const MAX_OTP_ATTEMPTS = 5;

    public function requestOtp(string $login, string $lookup): void
    {
        [$user, $normalizedLogin] = $this->resolveUser($login, $lookup);

        if (! $user || blank($user->email) || blank($normalizedLogin)) {
            return;
        }

        PasswordResetOtp::query()->where('user_id', $user->id)->delete();

        $otp = $this->generateOtp();

        PasswordResetOtp::query()->create([
            'user_id' => $user->id,
            'login_type' => $lookup,
            'login_value' => $normalizedLogin,
            'delivery_channel' => 'email',
            'delivery_destination' => strtolower((string) $user->email),
            'code_hash' => $this->hashOtp($otp),
            'attempts' => 0,
            'expires_at' => now()->addMinutes(self::OTP_EXPIRY_MINUTES),
        ]);

        $user->notify(new CustomerPasswordResetOtpNotification($otp, self::OTP_EXPIRY_MINUTES));
    }

    public function resetPassword(string $login, string $lookup, string $otp, string $password): void
    {
        [$user, $normalizedLogin] = $this->resolveUser($login, $lookup);

        if (! $user || blank($normalizedLogin)) {
            $this->throwInvalidRecoveryCode();
        }

        $resetOtp = PasswordResetOtp::query()
            ->where('user_id', $user->id)
            ->where('login_type', $lookup)
            ->where('login_value', $normalizedLogin)
            ->latest('id')
            ->first();

        if (! $resetOtp || $resetOtp->expires_at?->isPast()) {
            optional($resetOtp)->delete();
            $this->throwInvalidRecoveryCode();
        }

        if ($resetOtp->attempts >= self::MAX_OTP_ATTEMPTS) {
            $resetOtp->delete();
            $this->throwInvalidRecoveryCode();
        }

        if (! hash_equals($resetOtp->code_hash, $this->hashOtp($otp))) {
            $resetOtp->increment('attempts');

            if (($resetOtp->attempts + 1) >= self::MAX_OTP_ATTEMPTS) {
                $resetOtp->delete();
            }

            $this->throwInvalidRecoveryCode();
        }

        DB::transaction(function () use ($password, $resetOtp, $user): void {
            $user->forceFill([
                'password' => $password,
                'remember_token' => Str::random(60),
            ])->save();

            DB::table('sessions')->where('user_id', $user->id)->delete();
            DB::table(config('auth.passwords.users.table', 'password_reset_tokens'))
                ->when($user->email, fn ($query) => $query->where('email', $user->email))
                ->delete();

            $user->tokens()->delete();
            PasswordResetOtp::query()->where('user_id', $user->id)->delete();
            $resetOtp->delete();
        });
    }

    /**
     * @return array{0: User|null, 1: string|null}
     */
    protected function resolveUser(string $login, string $lookup): array
    {
        $normalizedEmail = strtolower(trim($login));

        return [
            User::query()->where('email', $normalizedEmail)->first(),
            $normalizedEmail,
        ];
    }

    protected function generateOtp(): string
    {
        return str_pad((string) random_int(0, 999999), 6, '0', STR_PAD_LEFT);
    }

    protected function hashOtp(string $otp): string
    {
        return hash_hmac('sha256', $otp, (string) config('app.key'));
    }

    protected function throwInvalidRecoveryCode(): never
    {
        throw ValidationException::withMessages([
            'code' => 'The recovery code is invalid or expired.',
        ]);
    }
}
