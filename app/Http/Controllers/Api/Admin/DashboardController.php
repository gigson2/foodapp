<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\OrderResource;
use App\Http\Resources\ReviewResource;
use App\Services\DashboardMetricsService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function __construct(
        protected DashboardMetricsService $dashboardMetricsService,
    ) {
    }

    public function __invoke(Request $request): JsonResponse
    {
        $metrics = $this->dashboardMetricsService->getAdminOverview();

        return response()->json([
            'metrics' => [
                'total_orders' => $metrics['total_orders'],
                'today_orders' => $metrics['today_orders'],
                'pending_orders' => $metrics['pending_orders'],
                'received_orders' => $metrics['received_orders'],
                'processing_orders' => $metrics['processing_orders'],
                'ready_for_pickup_orders' => $metrics['ready_for_pickup_orders'],
                'completed_orders' => $metrics['completed_orders'],
                'cancelled_orders' => $metrics['cancelled_orders'],
                'total_customers' => $metrics['total_customers'],
                'total_visitors' => $metrics['total_visitors'],
                'total_revenue' => $metrics['total_revenue'],
                'today_revenue' => $metrics['today_revenue'],
                'week_revenue' => $metrics['week_revenue'],
                'month_revenue' => $metrics['month_revenue'],
                'pending_reviews' => $metrics['pending_reviews'],
                'unread_notifications' => $metrics['unread_notifications'],
            ],
            'recent_orders' => OrderResource::collection($metrics['recent_orders'])->resolve($request),
            'status_breakdown' => $metrics['status_breakdown'],
            'cash_sales_series' => $metrics['cash_sales_series'],
            'popular_foods' => collect($metrics['popular_foods'])->map(fn ($food): array => [
                'id' => (string) $food->id,
                'name' => $food->name,
                'orders_count' => (int) $food->orders_count,
                'revenue' => (float) $food->revenue,
            ])->values()->all(),
            'pending_reviews_list' => ReviewResource::collection($metrics['recent_pending_reviews'])->resolve($request),
            'visitor_summary' => $metrics['visitor_summary'],
            'quick_actions' => [
                ['id' => 'orders', 'label' => 'View New Orders', 'description' => 'Review incoming pickup orders.', 'to' => '/admin/orders'],
                ['id' => 'foods', 'label' => 'Add Food', 'description' => 'Create or update grill menu items.', 'to' => '/admin/menu'],
                ['id' => 'reviews', 'label' => 'Review Pending Reviews', 'description' => 'Approve or reject customer feedback.', 'to' => '/admin/reviews'],
                ['id' => 'notifications', 'label' => 'Enable Notifications', 'description' => 'Review admin alerts and push settings.', 'to' => '/admin/settings/pwa'],
                ['id' => 'company', 'label' => 'Update Company Info', 'description' => 'Edit business profile and pickup instructions.', 'to' => '/admin/settings/company'],
            ],
        ]);
    }
}
