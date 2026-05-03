<?php

namespace App\Services;

use App\Enums\OrderStatus;
use App\Enums\UserRole;
use App\Models\Food;
use App\Models\Order;
use App\Models\Review;
use App\Models\User;
use App\Models\VisitorEvent;
use App\Models\VisitorSession;
use Illuminate\Support\Carbon;

class DashboardMetricsService
{
    /**
     * @return array<string, mixed>
     */
    public function getAdminOverview(): array
    {
        $now = now();
        $weekStart = $now->copy()->startOfWeek(Carbon::MONDAY);
        $monthStart = $now->copy()->startOfMonth();
        $todayStart = $now->copy()->startOfDay();

        $baseRevenueQuery = Order::query()->where('status', OrderStatus::Completed->value);
        $recentOrders = Order::query()
            ->with('items')
            ->latest('placed_at')
            ->take(10)
            ->get();

        return [
            'total_orders' => Order::query()->count(),
            'today_orders' => Order::query()->where('placed_at', '>=', $todayStart)->count(),
            'pending_orders' => Order::query()->whereIn('status', [
                OrderStatus::Pending->value,
                OrderStatus::Received->value,
                OrderStatus::Processing->value,
            ])->count(),
            'received_orders' => Order::query()->where('status', OrderStatus::Received->value)->count(),
            'processing_orders' => Order::query()->where('status', OrderStatus::Processing->value)->count(),
            'ready_for_pickup_orders' => Order::query()->where('status', OrderStatus::ReadyForPickup->value)->count(),
            'completed_orders' => Order::query()->where('status', OrderStatus::Completed->value)->count(),
            'cancelled_orders' => Order::query()->where('status', OrderStatus::Cancelled->value)->count(),
            'total_customers' => User::query()->where('role', UserRole::Customer->value)->count(),
            'total_visitors' => VisitorSession::query()->count(),
            'total_revenue' => (float) $baseRevenueQuery->sum('total'),
            'today_revenue' => (float) (clone $baseRevenueQuery)->whereDate('completed_at', $now->toDateString())->sum('total'),
            'week_revenue' => (float) (clone $baseRevenueQuery)->whereBetween('completed_at', [$weekStart, $now])->sum('total'),
            'month_revenue' => (float) (clone $baseRevenueQuery)->whereBetween('completed_at', [$monthStart, $now])->sum('total'),
            'pending_reviews' => Review::query()->where('status', 'pending')->count(),
            'unread_notifications' => User::query()
                ->where('role', UserRole::Admin->value)
                ->withCount('unreadNotifications')
                ->get()
                ->sum('unread_notifications_count'),
            'recent_orders' => $recentOrders,
            'status_breakdown' => [
                ['status' => OrderStatus::Received->value, 'label' => 'Received', 'count' => Order::query()->where('status', OrderStatus::Received->value)->count()],
                ['status' => OrderStatus::Processing->value, 'label' => 'Processing', 'count' => Order::query()->where('status', OrderStatus::Processing->value)->count()],
                ['status' => OrderStatus::ReadyForPickup->value, 'label' => 'Ready for Pickup', 'count' => Order::query()->where('status', OrderStatus::ReadyForPickup->value)->count()],
                ['status' => OrderStatus::Completed->value, 'label' => 'Completed', 'count' => Order::query()->where('status', OrderStatus::Completed->value)->count()],
                ['status' => OrderStatus::Cancelled->value, 'label' => 'Cancelled', 'count' => Order::query()->where('status', OrderStatus::Cancelled->value)->count()],
            ],
            'cash_sales_series' => collect(range(6, 0))
                ->map(function (int $offset) use ($now): array {
                    $date = $now->copy()->subDays($offset);

                    return [
                        'label' => $date->format('D'),
                        'amount' => (float) Order::query()
                            ->whereDate('completed_at', $date->toDateString())
                            ->where('status', OrderStatus::Completed->value)
                            ->sum('total'),
                    ];
                })
                ->all(),
            'popular_foods' => Food::query()
                ->leftJoin('order_items', 'foods.id', '=', 'order_items.food_id')
                ->select('foods.id', 'foods.name')
                ->selectRaw('COUNT(order_items.id) as orders_count')
                ->selectRaw('COALESCE(SUM(order_items.line_total), 0) as revenue')
                ->groupBy('foods.id', 'foods.name')
                ->orderByDesc('orders_count')
                ->limit(5)
                ->get(),
            'recent_pending_reviews' => Review::query()
                ->where('status', 'pending')
                ->latest()
                ->take(5)
                ->get(),
            'visitor_summary' => [
                'total_visitors' => VisitorSession::query()->count(),
                'today_visitors' => VisitorSession::query()->where('created_at', '>=', $todayStart)->count(),
                'returning_visitors' => VisitorSession::query()->whereNotNull('user_id')->distinct('user_id')->count('user_id'),
                'food_views' => VisitorEvent::query()->where('event_type', 'food_view')->count(),
                'menu_clicks' => VisitorEvent::query()->where('event_type', 'add_to_cart')->count(),
                'order_starts' => VisitorEvent::query()->where('event_type', 'checkout_started')->count(),
                'completed_orders' => VisitorEvent::query()->where('event_type', 'order_completed')->count(),
                'review_submissions' => VisitorEvent::query()->where('event_type', 'review_submitted')->count(),
            ],
        ];
    }
}
