<?php

namespace App\Services;

use App\Enums\VisitorEventType;
use App\Models\Food;
use App\Models\Review;
use App\Models\VisitorEvent;
use App\Models\VisitorSession;
use Illuminate\Support\Facades\DB;

class AdminAnalyticsService
{
    /**
     * @return array<string, mixed>
     */
    public function getOverview(): array
    {
        $today = now()->startOfDay();

        $deviceBreakdown = VisitorSession::query()
            ->select('device_type', DB::raw('COUNT(*) as total'))
            ->groupBy('device_type')
            ->orderByDesc('total')
            ->get()
            ->map(fn ($row): array => [
                'device_type' => $row->device_type ?: 'unknown',
                'total' => (int) $row->total,
            ]);

        $topFoods = Food::query()
            ->leftJoin('order_items', 'foods.id', '=', 'order_items.food_id')
            ->select('foods.id', 'foods.name', DB::raw('COUNT(order_items.id) as orders_count'), DB::raw('COALESCE(SUM(order_items.line_total), 0) as revenue'))
            ->groupBy('foods.id', 'foods.name')
            ->orderByDesc('orders_count')
            ->limit(8)
            ->get()
            ->map(fn ($row): array => [
                'id' => $row->id,
                'name' => $row->name,
                'orders_count' => (int) $row->orders_count,
                'revenue' => (float) $row->revenue,
            ]);

        $recentEvents = VisitorEvent::query()
            ->with(['visitorSession', 'user'])
            ->latest()
            ->paginate(10);

        return [
            'metrics' => [
                'total_visitors' => VisitorSession::query()->count(),
                'today_visitors' => VisitorSession::query()->where('created_at', '>=', $today)->count(),
                'returning_visitors' => VisitorSession::query()->whereNotNull('user_id')->distinct('user_id')->count('user_id'),
                'food_views' => VisitorEvent::query()->where('event_type', VisitorEventType::FoodView->value)->count(),
                'menu_clicks' => VisitorEvent::query()->where('event_type', VisitorEventType::AddToCart->value)->count(),
                'order_starts' => VisitorEvent::query()->where('event_type', VisitorEventType::CheckoutStarted->value)->count(),
                'completed_orders' => VisitorEvent::query()->where('event_type', VisitorEventType::OrderCompleted->value)->count(),
                'review_submissions' => Review::query()->count(),
            ],
            'device_breakdown' => $deviceBreakdown,
            'top_foods' => $topFoods,
            'recent_events' => $recentEvents,
        ];
    }
}
