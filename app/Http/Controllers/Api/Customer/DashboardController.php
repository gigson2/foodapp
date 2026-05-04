<?php

namespace App\Http\Controllers\Api\Customer;

use App\Enums\OrderStatus;
use App\Enums\ReviewStatus;
use App\Http\Controllers\Controller;
use App\Http\Resources\OrderResource;
use Illuminate\Support\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function __invoke(Request $request): JsonResponse
    {
        $user = $request->user();
        [$rangeStart, $rangeEnd] = $this->resolveRange(
            $request->query('date_from'),
            $request->query('date_to'),
            2,
        );

        $ordersInRange = $user->orders()->whereBetween('placed_at', [$rangeStart, $rangeEnd]);
        $reviewsInRange = $user->reviews()->whereBetween('created_at', [$rangeStart, $rangeEnd]);
        $recentOrders = (clone $ordersInRange)
            ->with('items')
            ->latest('placed_at')
            ->take(5)
            ->get();
        $completedOrdersCount = (clone $ordersInRange)->where('status', OrderStatus::Completed)->count();
        $completedOrdersTotal = (float) (clone $ordersInRange)
            ->where('status', OrderStatus::Completed)
            ->sum('total');

        return response()->json([
            'data' => [
                'date_range' => [
                    'from' => $rangeStart->toDateString(),
                    'to' => $rangeEnd->toDateString(),
                ],
                'metrics' => [
                    'total_orders' => (clone $ordersInRange)->count(),
                    'active_orders' => (clone $ordersInRange)->whereIn('status', [
                        OrderStatus::Received,
                        OrderStatus::Processing,
                        OrderStatus::ReadyForPickup,
                    ])->count(),
                    'completed_orders' => $completedOrdersCount,
                    'cancelled_orders' => (clone $ordersInRange)->where('status', OrderStatus::Cancelled)->count(),
                    'total_spent' => $completedOrdersTotal,
                    'pending_reviews' => (clone $reviewsInRange)->where('status', ReviewStatus::Pending)->count(),
                    'unread_notifications' => $user->unreadNotifications()->count(),
                ],
                'status_breakdown' => [
                    OrderStatus::Received->value => (clone $ordersInRange)->where('status', OrderStatus::Received)->count(),
                    OrderStatus::Processing->value => (clone $ordersInRange)->where('status', OrderStatus::Processing)->count(),
                    OrderStatus::ReadyForPickup->value => (clone $ordersInRange)->where('status', OrderStatus::ReadyForPickup)->count(),
                    OrderStatus::Completed->value => $completedOrdersCount,
                    OrderStatus::Cancelled->value => (clone $ordersInRange)->where('status', OrderStatus::Cancelled)->count(),
                ],
                'recent_orders' => OrderResource::collection(
                    $recentOrders,
                )->resolve($request),
            ],
        ]);
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
}
