<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\OrderResource;
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
                'pending_orders' => $metrics['pending_orders'],
                'completed_orders' => $metrics['completed_orders'],
                'cancelled_orders' => $metrics['cancelled_orders'],
                'total_customers' => $metrics['total_customers'],
                'total_visitors' => $metrics['total_visitors'],
                'total_revenue' => $metrics['total_revenue'],
                'today_revenue' => $metrics['today_revenue'],
                'week_revenue' => $metrics['week_revenue'],
                'month_revenue' => $metrics['month_revenue'],
            ],
            'recent_orders' => OrderResource::collection($metrics['recent_orders'])->resolve($request),
        ]);
    }
}
