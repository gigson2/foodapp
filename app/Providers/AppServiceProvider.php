<?php

namespace App\Providers;

use App\Notifications\Channels\WebPushChannel;
use App\Services\WebPushService;
use Illuminate\Notifications\ChannelManager;
use Illuminate\Support\Facades\Notification;
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
        Notification::extend('webpush', function ($app) {
            return new WebPushChannel($app->make(WebPushService::class));
        });
    }
}
