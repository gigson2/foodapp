<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\VisitorEventResource;
use App\Services\AdminAnalyticsService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AnalyticsController extends Controller
{
    public function __construct(
        protected AdminAnalyticsService $adminAnalyticsService,
    ) {
    }

    public function __invoke(Request $request): JsonResponse
    {
        $overview = $this->adminAnalyticsService->getOverview();

        return response()->json([
            'metrics' => $overview['metrics'],
            'device_breakdown' => $overview['device_breakdown'],
            'top_foods' => $overview['top_foods'],
            'recent_events' => VisitorEventResource::collection($overview['recent_events']),
        ]);
    }
}
