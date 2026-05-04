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
        $overview = $this->adminAnalyticsService->getOverview(
            $request->query('date_from'),
            $request->query('date_to'),
        );

        return response()->json([
            'date_range' => $overview['date_range'],
            'metrics' => $overview['metrics'],
            'device_breakdown' => $overview['device_breakdown'],
            'top_foods' => $overview['top_foods'],
            'recent_events' => VisitorEventResource::collection($overview['recent_events']),
        ]);
    }

    public function pruneOldestThirtyDays(): JsonResponse
    {
        $result = $this->adminAnalyticsService->pruneOldestThirtyDays();

        return response()->json([
            'message' => $result['deleted_days'] > 0
                ? sprintf('Deleted the oldest %d day(s) of analytics activity.', $result['deleted_days'])
                : 'There were no analytics records available to delete.',
            ...$result,
        ]);
    }
}
