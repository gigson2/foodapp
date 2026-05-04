<?php

namespace App\Providers;

use App\Notifications\Channels\WebPushChannel;
use App\Services\WebPushService;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->singleton(WebPushService::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        RateLimiter::for('auth-login', function ($request) {
            $login = strtolower(trim((string) $request->input('login')));

            return Limit::perMinute(6)->by($login.'|'.$request->ip());
        });

        RateLimiter::for('auth-register', function ($request) {
            $phone = trim((string) $request->input('phone'));

            return Limit::perMinutes(10, 4)->by($phone.'|'.$request->ip());
        });

        RateLimiter::for('password-recovery-request', function ($request) {
            $login = strtolower(trim((string) $request->input('login')));

            return Limit::perMinutes(10, 4)->by($login.'|'.$request->ip());
        });

        RateLimiter::for('password-recovery-reset', function ($request) {
            $login = strtolower(trim((string) $request->input('login')));

            return Limit::perMinutes(10, 8)->by($login.'|'.$request->ip());
        });

        RateLimiter::for('customer-orders', function ($request) {
            return Limit::perMinute(10)->by((string) ($request->user()?->id ?? $request->ip()));
        });

        RateLimiter::for('push-notification-tests', function ($request) {
            return Limit::perMinute(5)->by((string) ($request->user()?->id ?? 'guest').'|'.$request->ip());
        });

        Notification::extend('webpush', function ($app) {
            return new WebPushChannel($app->make(WebPushService::class));
        });
    }
}
