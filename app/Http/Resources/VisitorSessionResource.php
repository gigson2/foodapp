<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\VisitorSession */
class VisitorSessionResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'session_key' => $this->session_key,
            'ip_hash' => $this->ip_hash,
            'user_agent' => $this->user_agent,
            'device_type' => $this->device_type,
            'browser' => $this->browser,
            'platform' => $this->platform,
            'referrer' => $this->referrer,
            'landing_page' => $this->landing_page,
            'last_seen_at' => $this->last_seen_at,
            'events_count' => $this->whenCounted('events', $this->events_count),
            'user' => $this->whenLoaded('user', fn () => new UserResource($this->user)),
            'created_at' => $this->created_at,
        ];
    }
}
