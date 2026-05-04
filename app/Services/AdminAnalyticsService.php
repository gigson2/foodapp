<?php

namespace App\Services;

use App\Enums\VisitorEventType;
use App\Models\Food;
use App\Models\Review;
use App\Models\VisitorEvent;
use App\Models\VisitorSession;
use Carbon\Carbon;
use Carbon\CarbonInterface;
use Illuminate\Support\Facades\DB;

class AdminAnalyticsService
{
    /**
     * @return array<string, mixed>
     */
    public function getOverview(?string $dateFrom = null, ?string $dateTo = null): array
    {
        [$from, $to] = $this->resolveDateRange($dateFrom, $dateTo);

        $deviceBreakdown = VisitorSession::query()
            ->select('device_type', DB::raw('COUNT(*) as total'))
            ->whereDate('created_at', '>=', $from->toDateString())
            ->whereDate('created_at', '<=', $to->toDateString())
            ->groupBy('device_type')
            ->orderByDesc('total')
            ->get()
            ->map(fn ($row): array => [
                'device_type' => $row->device_type ?: 'unknown',
                'total' => (int) $row->total,
            ]);

        $topFoods = Food::query()
            ->leftJoin('order_items', 'foods.id', '=', 'order_items.food_id')
            ->leftJoin('orders', 'order_items.order_id', '=', 'orders.id')
            ->select('foods.id', 'foods.name', DB::raw('COUNT(order_items.id) as orders_count'), DB::raw('COALESCE(SUM(order_items.line_total), 0) as revenue'))
            ->where(function ($query) use ($from, $to): void {
                $query
                    ->whereNull('orders.id')
                    ->orWhere(function ($nested) use ($from, $to): void {
                        $nested
                            ->whereDate('orders.placed_at', '>=', $from->toDateString())
                            ->whereDate('orders.placed_at', '<=', $to->toDateString());
                    });
            })
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
            ->whereDate('created_at', '>=', $from->toDateString())
            ->whereDate('created_at', '<=', $to->toDateString())
            ->latest()
            ->paginate(10);

        return [
            'date_range' => [
                'from' => $from->toDateString(),
                'to' => $to->toDateString(),
            ],
            'metrics' => [
                'total_visitors' => VisitorSession::query()
                    ->whereDate('created_at', '>=', $from->toDateString())
                    ->whereDate('created_at', '<=', $to->toDateString())
                    ->count(),
                'today_visitors' => VisitorSession::query()
                    ->whereDate('created_at', '>=', $from->toDateString())
                    ->whereDate('created_at', '<=', $to->toDateString())
                    ->whereDate('created_at', now()->toDateString())
                    ->count(),
                'returning_visitors' => VisitorSession::query()
                    ->whereDate('created_at', '>=', $from->toDateString())
                    ->whereDate('created_at', '<=', $to->toDateString())
                    ->whereNotNull('user_id')
                    ->distinct('user_id')
                    ->count('user_id'),
                'food_views' => VisitorEvent::query()
                    ->whereDate('created_at', '>=', $from->toDateString())
                    ->whereDate('created_at', '<=', $to->toDateString())
                    ->where('event_type', VisitorEventType::FoodView->value)
                    ->count(),
                'menu_clicks' => VisitorEvent::query()
                    ->whereDate('created_at', '>=', $from->toDateString())
                    ->whereDate('created_at', '<=', $to->toDateString())
                    ->where('event_type', VisitorEventType::AddToCart->value)
                    ->count(),
                'order_starts' => VisitorEvent::query()
                    ->whereDate('created_at', '>=', $from->toDateString())
                    ->whereDate('created_at', '<=', $to->toDateString())
                    ->where('event_type', VisitorEventType::CheckoutStarted->value)
                    ->count(),
                'completed_orders' => VisitorEvent::query()
                    ->whereDate('created_at', '>=', $from->toDateString())
                    ->whereDate('created_at', '<=', $to->toDateString())
                    ->where('event_type', VisitorEventType::OrderCompleted->value)
                    ->count(),
                'review_submissions' => Review::query()
                    ->whereDate('created_at', '>=', $from->toDateString())
                    ->whereDate('created_at', '<=', $to->toDateString())
                    ->count(),
            ],
            'device_breakdown' => $deviceBreakdown,
            'top_foods' => $topFoods,
            'recent_events' => $recentEvents,
        ];
    }

    /**
     * @return array{deleted_days: int, deleted_sessions: int, deleted_events: int}
     */
    public function pruneOldestThirtyDays(): array
    {
        $eventDates = VisitorEvent::query()
            ->selectRaw('DATE(created_at) as day_key')
            ->distinct()
            ->pluck('day_key');
        $sessionDates = VisitorSession::query()
            ->selectRaw('DATE(created_at) as day_key')
            ->distinct()
            ->pluck('day_key');

        $days = $eventDates
            ->merge($sessionDates)
            ->filter()
            ->unique()
            ->sort()
            ->values()
            ->take(30);

        if ($days->isEmpty()) {
            return [
                'deleted_days' => 0,
                'deleted_sessions' => 0,
                'deleted_events' => 0,
            ];
        }

        $deletedEvents = VisitorEvent::query()
            ->whereIn(DB::raw('DATE(created_at)'), $days->all())
            ->delete();
        $deletedSessions = VisitorSession::query()
            ->whereIn(DB::raw('DATE(created_at)'), $days->all())
            ->delete();

        return [
            'deleted_days' => $days->count(),
            'deleted_sessions' => $deletedSessions,
            'deleted_events' => $deletedEvents,
        ];
    }

    /**
     * @return array{0: CarbonInterface, 1: CarbonInterface}
     */
    protected function resolveDateRange(?string $dateFrom, ?string $dateTo): array
    {
        $to = $dateTo ? Carbon::parse($dateTo)->endOfDay() : now()->endOfDay();
        $from = $dateFrom ? Carbon::parse($dateFrom)->startOfDay() : $to->copy()->subDays(6)->startOfDay();

        if ($from->greaterThan($to)) {
            [$from, $to] = [$to->copy()->startOfDay(), $from->copy()->endOfDay()];
        }

        return [$from, $to];
    }
}
