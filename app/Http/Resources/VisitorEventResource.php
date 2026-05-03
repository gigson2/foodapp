<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\VisitorEvent */
class VisitorEventResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'visitor_session_id' => $this->visitor_session_id,
            'user_id' => $this->user_id,
            'event_type' => $this->event_type?->value ?? $this->event_type,
            'event_name' => $this->event_name,
            'page_url' => $this->page_url,
            'metadata' => $this->metadata ?? [],
            'visitor_session' => $this->whenLoaded('visitorSession', fn (): ?array => $this->visitorSession ? [
                'id' => $this->visitorSession->id,
                'session_key' => $this->visitorSession->session_key,
            ] : null),
            'user' => $this->whenLoaded('user', fn () => new UserResource($this->user)),
            'created_at' => $this->created_at,
        ];
    }
}
