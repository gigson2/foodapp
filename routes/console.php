<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Process queued push notifications every minute.
// On shared hosting, add one cron entry:
//   * * * * * cd /path/to/app && php artisan schedule:run >> /dev/null 2>&1
Schedule::command('queue:work --stop-when-empty --tries=3 --timeout=55')
    ->everyMinute()
    ->withoutOverlapping()
    ->runInBackground();
