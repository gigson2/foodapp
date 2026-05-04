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
    public function getAdminOverview(?string $dateFrom = null, ?string $dateTo = null): array
    {
        [$rangeStart, $rangeEnd] = $this->resolveRange($dateFrom, $dateTo, 4);

        $ordersInRange = Order::query()->whereBetween('placed_at', [$rangeStart, $rangeEnd]);
        $completedRevenueInRange = Order::query()
            ->where('status', OrderStatus::Completed->value)
            ->whereBetween('completed_at', [$rangeStart, $rangeEnd]);
        $recentOrders = Order::query()
            ->with('items')
            ->whereBetween('placed_at', [$rangeStart, $rangeEnd])
            ->latest('placed_at')
            ->take(10)
            ->get();

        return [
            'date_range' => [
                'from' => $rangeStart->toDateString(),
                'to' => $rangeEnd->toDateString(),
            ],
            'total_orders' => (clone $ordersInRange)->count(),
            'today_orders' => (clone $ordersInRange)->whereDate('placed_at', $rangeEnd->toDateString())->count(),
            'pending_orders' => (clone $ordersInRange)->whereIn('status', [
                OrderStatus::Pending->value,
                OrderStatus::Received->value,
                OrderStatus::Processing->value,
            ])->count(),
            'received_orders' => (clone $ordersInRange)->where('status', OrderStatus::Received->value)->count(),
            'processing_orders' => (clone $ordersInRange)->where('status', OrderStatus::Processing->value)->count(),
            'ready_for_pickup_orders' => (clone $ordersInRange)->where('status', OrderStatus::ReadyForPickup->value)->count(),
            'completed_orders' => (clone $ordersInRange)->where('status', OrderStatus::Completed->value)->count(),
            'cancelled_orders' => (clone $ordersInRange)->where('status', OrderStatus::Cancelled->value)->count(),
            'total_customers' => User::query()->where('role', UserRole::Customer->value)->count(),
            'total_visitors' => VisitorSession::query()->whereBetween('created_at', [$rangeStart, $rangeEnd])->count(),
            'total_revenue' => (float) (clone $completedRevenueInRange)->sum('total'),
            'today_revenue' => (float) (clone $completedRevenueInRange)->whereDate('completed_at', $rangeEnd->toDateString())->sum('total'),
            'week_revenue' => (float) (clone $completedRevenueInRange)->sum('total'),
            'month_revenue' => (float) (clone $completedRevenueInRange)->sum('total'),
            'pending_reviews' => Review::query()->where('status', 'pending')->whereBetween('created_at', [$rangeStart, $rangeEnd])->count(),
            'unread_notifications' => User::query()
                ->where('role', UserRole::Admin->value)
                ->withCount('unreadNotifications')
                ->get()
                ->sum('unread_notifications_count'),
            'recent_orders' => $recentOrders,
            'status_breakdown' => [
                ['status' => OrderStatus::Received->value, 'label' => 'Received', 'count' => (clone $ordersInRange)->where('status', OrderStatus::Received->value)->count()],
                ['status' => OrderStatus::Processing->value, 'label' => 'Processing', 'count' => (clone $ordersInRange)->where('status', OrderStatus::Processing->value)->count()],
                ['status' => OrderStatus::ReadyForPickup->value, 'label' => 'Ready for Pickup', 'count' => (clone $ordersInRange)->where('status', OrderStatus::ReadyForPickup->value)->count()],
                ['status' => OrderStatus::Completed->value, 'label' => 'Completed', 'count' => (clone $ordersInRange)->where('status', OrderStatus::Completed->value)->count()],
                ['status' => OrderStatus::Cancelled->value, 'label' => 'Cancelled', 'count' => (clone $ordersInRange)->where('status', OrderStatus::Cancelled->value)->count()],
            ],
            'cash_sales_series' => collect($this->buildDatePeriod($rangeStart, $rangeEnd))
                ->map(function (Carbon $date): array {
                    $label = $date->isSameYear(now()) ? $date->format('M j') : $date->format('M j, Y');

                    return [
                        'label' => $label,
                        'amount' => (float) Order::query()
                            ->whereDate('completed_at', $date->toDateString())
                            ->where('status', OrderStatus::Completed->value)
                            ->sum('total'),
                    ];
                })
                ->all(),
            'popular_foods' => Food::query()
                ->join('order_items', 'foods.id', '=', 'order_items.food_id')
                ->join('orders', 'order_items.order_id', '=', 'orders.id')
                ->select('foods.id', 'foods.name')
                ->selectRaw('COUNT(order_items.id) as orders_count')
                ->selectRaw('COALESCE(SUM(order_items.line_total), 0) as revenue')
                ->whereBetween('orders.placed_at', [$rangeStart, $rangeEnd])
                ->groupBy('foods.id', 'foods.name')
                ->orderByDesc('orders_count')
                ->limit(5)
                ->get(),
            'recent_pending_reviews' => Review::query()
                ->where('status', 'pending')
                ->whereBetween('created_at', [$rangeStart, $rangeEnd])
                ->latest()
                ->take(5)
                ->get(),
            'visitor_summary' => [
                'total_visitors' => VisitorSession::query()->whereBetween('created_at', [$rangeStart, $rangeEnd])->count(),
                'today_visitors' => VisitorSession::query()->whereDate('created_at', $rangeEnd->toDateString())->count(),
                'returning_visitors' => VisitorSession::query()->whereNotNull('user_id')->whereBetween('created_at', [$rangeStart, $rangeEnd])->distinct('user_id')->count('user_id'),
                'food_views' => VisitorEvent::query()->where('event_type', 'food_view')->whereBetween('created_at', [$rangeStart, $rangeEnd])->count(),
                'menu_clicks' => VisitorEvent::query()->where('event_type', 'add_to_cart')->whereBetween('created_at', [$rangeStart, $rangeEnd])->count(),
                'order_starts' => VisitorEvent::query()->where('event_type', 'checkout_started')->whereBetween('created_at', [$rangeStart, $rangeEnd])->count(),
                'completed_orders' => VisitorEvent::query()->where('event_type', 'order_completed')->whereBetween('created_at', [$rangeStart, $rangeEnd])->count(),
                'review_submissions' => VisitorEvent::query()->where('event_type', 'review_submitted')->whereBetween('created_at', [$rangeStart, $rangeEnd])->count(),
            ],
        ];
    }

    /**
     * @return array{0: Carbon, 1: Carbon}
     */
    private function resolveRange(?string $dateFrom, ?string $dateTo, int $defaultDays): array
    {
        $end = filled($dateTo) ? Carbon::parse($dateTo)->endOfDay() : now()->endOfDay();
        $start = filled($dateFrom) ? Carbon::parse($dateFrom)->startOfDay() : $end->copy()->subDays($defaultDays - 1)->startOfDay();

        if ($start->gt($end)) {
            [$start, $end] = [$end->copy()->startOfDay(), $start->copy()->endOfDay()];
        }

        return [$start, $end];
    }

    /**
     * @return array<int, Carbon>
     */
    private function buildDatePeriod(Carbon $start, Carbon $end): array
    {
        $cursor = $start->copy()->startOfDay();
        $dates = [];

        while ($cursor->lte($end)) {
            $dates[] = $cursor->copy();
            $cursor->addDay();
        }

        return $dates;
    }
}
