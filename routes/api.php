<?php

use App\Enums\UserRole;
use App\Http\Controllers\Api\Admin\CategoryController as AdminCategoryController;
use App\Http\Controllers\Api\Admin\CompanySettingController as AdminCompanySettingController;
use App\Http\Controllers\Api\Admin\CustomerController as AdminCustomerController;
use App\Http\Controllers\Api\Admin\AnalyticsController as AdminAnalyticsController;
use App\Http\Controllers\Api\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Api\Admin\FoodController as AdminFoodController;
use App\Http\Controllers\Api\Admin\NotificationController as AdminNotificationController;
use App\Http\Controllers\Api\Admin\OrderNoteController as AdminOrderNoteController;
use App\Http\Controllers\Api\Admin\OrderPaymentStatusController as AdminOrderPaymentStatusController;
use App\Http\Controllers\Api\Admin\OrderController as AdminOrderController;
use App\Http\Controllers\Api\Admin\ProfileController as AdminProfileController;
use App\Http\Controllers\Api\Admin\ReviewController as AdminReviewController;
use App\Http\Controllers\Api\Admin\OrderStatusController as AdminOrderStatusController;
use App\Http\Controllers\Api\Admin\SeoSettingController as AdminSeoSettingController;
use App\Http\Controllers\Api\Admin\VisitorController as AdminVisitorController;
use App\Http\Controllers\Api\Auth\CurrentUserController;
use App\Http\Controllers\Api\Auth\LoginController;
use App\Http\Controllers\Api\Auth\LogoutController;
use App\Http\Controllers\Api\Auth\RegisterController;
use App\Http\Controllers\Api\PushNotificationTestController;
use App\Http\Controllers\Api\Customer\NotificationController as CustomerNotificationController;
use App\Http\Controllers\Api\Customer\DashboardController as CustomerDashboardController;
use App\Http\Controllers\Api\Customer\OrderController as CustomerOrderController;
use App\Http\Controllers\Api\Customer\ProfileController as CustomerProfileController;
use App\Http\Controllers\Api\Customer\PushSubscriptionController;
use App\Http\Controllers\Api\Customer\ReviewController as CustomerReviewController;
use App\Http\Controllers\Api\Public\CategoryController as PublicCategoryController;
use App\Http\Controllers\Api\Public\CompanySettingController as PublicCompanySettingController;
use App\Http\Controllers\Api\Public\FoodController as PublicFoodController;
use App\Http\Controllers\Api\Public\ReviewController as PublicReviewController;
use App\Http\Controllers\Api\Public\VisitorEventController as PublicVisitorEventController;
use Illuminate\Support\Facades\Route;

Route::get('/health', fn () => response()->json([
    'name' => config('app.name'),
    'status' => 'ok',
    'timestamp' => now()->toIso8601String(),
]));

Route::get('/foods', [PublicFoodController::class, 'index'])->name('api.public.foods.index');
Route::get('/foods/{slug}', [PublicFoodController::class, 'show'])->name('api.public.foods.show');
Route::get('/categories', [PublicCategoryController::class, 'index'])->name('api.public.categories.index');
Route::get('/company-settings', PublicCompanySettingController::class)->name('api.public.company-settings.show');
Route::get('/reviews', [PublicReviewController::class, 'index'])->name('api.public.reviews.index');
Route::post('/visitor-events', [PublicVisitorEventController::class, 'store'])->name('api.public.visitor-events.store');

Route::middleware('web')->group(function (): void {
    Route::post('/register', RegisterController::class)->name('api.register');
    Route::post('/login', LoginController::class)->name('api.login');
    Route::get('/me', CurrentUserController::class)->name('api.me');
    Route::post('/logout', LogoutController::class)->middleware('auth:sanctum')->name('api.logout');
});

Route::middleware(['web', 'auth:sanctum'])->group(function (): void {
    Route::post('/push-subscriptions', [PushSubscriptionController::class, 'store'])->name('api.push-subscriptions.store');
    Route::post('/push-notifications/test', PushNotificationTestController::class)->name('api.push-notifications.test');

    Route::prefix('customer')->middleware('role:'.UserRole::Customer->value)->group(function (): void {
        Route::get('/dashboard', CustomerDashboardController::class)->name('api.customer.dashboard');
        Route::get('/orders', [CustomerOrderController::class, 'index'])->name('api.customer.orders.index');
        Route::post('/orders', [CustomerOrderController::class, 'store'])->name('api.customer.orders.store');
        Route::get('/orders/{order}', [CustomerOrderController::class, 'show'])->name('api.customer.orders.show');
        Route::get('/reviews', [CustomerReviewController::class, 'index'])->name('api.customer.reviews.index');
        Route::post('/reviews', [CustomerReviewController::class, 'store'])->name('api.customer.reviews.store');
        Route::get('/notifications', [CustomerNotificationController::class, 'index'])->name('api.customer.notifications.index');
        Route::patch('/notifications/read-all', [CustomerNotificationController::class, 'markAllRead'])->name('api.customer.notifications.read-all');
        Route::patch('/notifications/{id}/read', [CustomerNotificationController::class, 'markRead'])->name('api.customer.notifications.read');
        Route::get('/profile', [CustomerProfileController::class, 'show'])->name('api.customer.profile.show');
        Route::put('/profile', [CustomerProfileController::class, 'update'])->name('api.customer.profile.update');
        Route::put('/profile/password', [CustomerProfileController::class, 'updatePassword'])->name('api.customer.profile.password');
        Route::post('/push-subscriptions', [PushSubscriptionController::class, 'store'])->name('api.customer.push-subscriptions.store');
    });

    Route::prefix('admin')->middleware('role:'.UserRole::Admin->value)->group(function (): void {
        Route::get('/dashboard', AdminDashboardController::class)->name('api.admin.dashboard');
        Route::get('/dashboard/overview', AdminDashboardController::class)->name('api.admin.dashboard.overview');
        Route::get('/orders', [AdminOrderController::class, 'index'])->name('api.admin.orders.index');
        Route::get('/orders/{order}', [AdminOrderController::class, 'show'])->name('api.admin.orders.show');
        Route::patch('/orders/{order}/status', AdminOrderStatusController::class)->name('api.admin.orders.status');
        Route::patch('/orders/{order}/payment-status', AdminOrderPaymentStatusController::class)->name('api.admin.orders.payment-status');
        Route::patch('/orders/{order}/note', AdminOrderNoteController::class)->name('api.admin.orders.note');
        Route::get('/customers', [AdminCustomerController::class, 'index'])->name('api.admin.customers.index');
        Route::get('/visitors', [AdminVisitorController::class, 'index'])->name('api.admin.visitors.index');
        Route::get('/analytics', AdminAnalyticsController::class)->name('api.admin.analytics');
        Route::get('/reviews', [AdminReviewController::class, 'index'])->name('api.admin.reviews.index');
        Route::patch('/reviews/{review}/status', [AdminReviewController::class, 'updateStatus'])->name('api.admin.reviews.status');
        Route::apiResource('foods', AdminFoodController::class);
        Route::post('/foods/{id}/restore', [AdminFoodController::class, 'restore'])->name('api.admin.foods.restore');
        Route::apiResource('categories', AdminCategoryController::class);
        Route::patch('/categories/{category}/toggle-active', [AdminCategoryController::class, 'toggleActive'])->name('api.admin.categories.toggle-active');
        Route::get('/company-settings', [AdminCompanySettingController::class, 'show'])->name('api.admin.company-settings.show');
        Route::put('/company-settings', [AdminCompanySettingController::class, 'update'])->name('api.admin.company-settings.update');
        Route::apiResource('seo-settings', AdminSeoSettingController::class);
        Route::get('/notifications', [AdminNotificationController::class, 'index'])->name('api.admin.notifications.index');
        Route::post('/notifications/broadcast', [AdminNotificationController::class, 'broadcastToCustomers'])->name('api.admin.notifications.broadcast');
        Route::patch('/notifications/read-all', [AdminNotificationController::class, 'markAllRead'])->name('api.admin.notifications.read-all');
        Route::patch('/notifications/{id}/read', [AdminNotificationController::class, 'markRead'])->name('api.admin.notifications.read');
        Route::get('/profile', [AdminProfileController::class, 'show'])->name('api.admin.profile.show');
        Route::put('/profile', [AdminProfileController::class, 'update'])->name('api.admin.profile.update');
        Route::put('/profile/password', [AdminProfileController::class, 'updatePassword'])->name('api.admin.profile.password');
    });
});
