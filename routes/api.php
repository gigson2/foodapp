<?php

use App\Http\Controllers\Api\Auth\CurrentUserController;
use Illuminate\Support\Facades\Route;

Route::get('/health', fn () => response()->json([
    'name' => config('app.name'),
    'status' => 'ok',
    'timestamp' => now()->toIso8601String(),
]));

Route::middleware('auth:sanctum')->group(function (): void {
    Route::get('/me', CurrentUserController::class)->name('api.me');
});
