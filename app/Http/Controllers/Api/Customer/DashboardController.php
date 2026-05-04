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
        $user = $request->user()->loadMissing(['orders.items', 'reviews']);
        [$rangeStart, $rangeEnd] = $this->resolveRange(
            $request->query('date_from'),
            $request->query('date_to'),
            2,
        );

        $orders = $user->orders->filter(function ($order) use ($rangeStart, $rangeEnd) {
            $placedAt = $order->placed_at ?? $order->created_at;

            return $placedAt !== null
                && Carbon::parse($placedAt)->betweenIncluded($rangeStart, $rangeEnd);
        })->values();
        $completedOrders = $orders->where('status', OrderStatus::Completed);
        $reviews = $user->reviews->filter(
            fn ($review) => Carbon::parse($review->created_at)->betweenIncluded($rangeStart, $rangeEnd),
        )->values();

        return response()->json([
            'data' => [
                'date_range' => [
                    'from' => $rangeStart->toDateString(),
                    'to' => $rangeEnd->toDateString(),
                ],
                'metrics' => [
                    'total_orders' => $orders->count(),
                    'active_orders' => $orders->whereIn('status', [
                        OrderStatus::Received,
                        OrderStatus::Processing,
                        OrderStatus::ReadyForPickup,
                    ])->count(),
                    'completed_orders' => $completedOrders->count(),
                    'cancelled_orders' => $orders->where('status', OrderStatus::Cancelled)->count(),
                    'total_spent' => (float) $completedOrders->sum('total'),
                    'pending_reviews' => $reviews->where('status', ReviewStatus::Pending)->count(),
                    'unread_notifications' => $user->unreadNotifications()->count(),
                ],
                'status_breakdown' => [
                    OrderStatus::Received->value => $orders->where('status', OrderStatus::Received)->count(),
                    OrderStatus::Processing->value => $orders->where('status', OrderStatus::Processing)->count(),
                    OrderStatus::ReadyForPickup->value => $orders->where('status', OrderStatus::ReadyForPickup)->count(),
                    OrderStatus::Completed->value => $completedOrders->count(),
                    OrderStatus::Cancelled->value => $orders->where('status', OrderStatus::Cancelled)->count(),
                ],
                'recent_orders' => OrderResource::collection(
                    $orders->sortByDesc('placed_at')->take(5)->values(),
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
