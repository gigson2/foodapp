<?php

namespace App\Http\Controllers\Api\Public;

use App\Http\Controllers\Controller;
use App\Http\Requests\Public\StoreVisitorEventRequest;
use App\Models\VisitorEvent;
use App\Models\VisitorSession;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\RateLimiter;

class VisitorEventController extends Controller
{
    public function store(StoreVisitorEventRequest $request): JsonResponse
    {
        $key = sprintf('visitor-events:%s', $request->ip() ?? 'guest');

        if (RateLimiter::tooManyAttempts($key, 60)) {
            return response()->json([
                'message' => 'Too many visitor events submitted.',
            ], 429);
        }

        RateLimiter::hit($key, 60);

        $session = VisitorSession::query()->firstOrCreate(
            ['session_key' => $request->string('session_key')->toString()],
            [
                'user_id' => optional($request->user())->id,
                'ip_hash' => hash('sha256', $request->ip() ?? '0.0.0.0'),
                'user_agent' => $request->userAgent(),
                'device_type' => $request->input('device_type'),
                'browser' => $request->input('browser'),
                'platform' => $request->input('platform'),
                'referrer' => $request->input('referrer'),
                'landing_page' => $request->input('landing_page') ?? $request->input('page_url'),
                'last_seen_at' => now(),
            ],
        );

        $session->forceFill([
            'user_id' => $session->user_id ?? optional($request->user())->id,
            'user_agent' => $request->userAgent(),
            'device_type' => $request->input('device_type', $session->device_type),
            'browser' => $request->input('browser', $session->browser),
            'platform' => $request->input('platform', $session->platform),
            'referrer' => $request->input('referrer', $session->referrer),
            'landing_page' => $request->input('landing_page', $session->landing_page),
            'last_seen_at' => now(),
        ])->save();

        $event = VisitorEvent::query()->create([
            'visitor_session_id' => $session->id,
            'user_id' => optional($request->user())->id,
            'event_type' => $request->string('event_type')->toString(),
            'event_name' => $request->string('event_name')->toString(),
            'page_url' => $request->input('page_url'),
            'metadata' => $request->input('metadata'),
        ]);

        return response()->json([
            'message' => 'Visitor event recorded.',
            'event_id' => $event->id,
        ], 201);
    }
}
