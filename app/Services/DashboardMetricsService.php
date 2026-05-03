<?php

namespace App\Services;

use App\Enums\OrderStatus;
use App\Enums\UserRole;
use App\Models\Order;
use App\Models\User;
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

        $baseRevenueQuery = Order::query()->where('status', OrderStatus::Completed->value);

        return [
            'total_orders' => Order::query()->count(),
            'pending_orders' => Order::query()->whereIn('status', [
                OrderStatus::Pending->value,
                OrderStatus::Received->value,
                OrderStatus::Processing->value,
            ])->count(),
            'completed_orders' => Order::query()->where('status', OrderStatus::Completed->value)->count(),
            'cancelled_orders' => Order::query()->where('status', OrderStatus::Cancelled->value)->count(),
            'total_customers' => User::query()->where('role', UserRole::Customer->value)->count(),
            'total_visitors' => VisitorSession::query()->count(),
            'total_revenue' => (float) $baseRevenueQuery->sum('total'),
            'today_revenue' => (float) (clone $baseRevenueQuery)->whereDate('completed_at', $now->toDateString())->sum('total'),
            'week_revenue' => (float) (clone $baseRevenueQuery)->whereBetween('completed_at', [$weekStart, $now])->sum('total'),
            'month_revenue' => (float) (clone $baseRevenueQuery)->whereBetween('completed_at', [$monthStart, $now])->sum('total'),
            'recent_orders' => Order::query()
                ->with('items')
                ->latest('placed_at')
                ->take(6)
                ->get(),
        ];
    }
}
