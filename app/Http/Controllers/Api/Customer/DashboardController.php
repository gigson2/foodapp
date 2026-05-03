<?php

namespace App\Http\Controllers\Api\Customer;

use App\Enums\OrderStatus;
use App\Enums\ReviewStatus;
use App\Http\Controllers\Controller;
use App\Http\Resources\OrderResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function __invoke(Request $request): JsonResponse
    {
        $user = $request->user()->loadMissing(['orders.items', 'reviews']);
        $orders = $user->orders;
        $completedOrders = $orders->where('status', OrderStatus::Completed);

        return response()->json([
            'data' => [
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
                    'pending_reviews' => $user->reviews->where('status', ReviewStatus::Pending)->count(),
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
}
