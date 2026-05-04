<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\Review */
class PublicReviewResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'customer_name' => $this->customer_name,
            'rating' => $this->rating,
            'message' => $this->message,
            'food_name' => $this->food_name,
            'status' => $this->status?->value ?? $this->status,
            'created_at' => $this->created_at,
        ];
    }
}
