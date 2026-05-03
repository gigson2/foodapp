<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\Review */
class ReviewResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'order_id' => $this->order_id,
            'food_id' => $this->food_id,
            'customer_name' => $this->customer_name,
            'customer_phone' => $this->customer_phone,
            'rating' => $this->rating,
            'message' => $this->message,
            'food_name' => $this->food_name,
            'status' => $this->status?->value ?? $this->status,
            'approved_at' => $this->approved_at,
            'rejected_at' => $this->rejected_at,
            'order' => $this->whenLoaded('order', fn (): ?array => $this->order ? [
                'id' => $this->order->id,
                'order_number' => $this->order->order_number,
            ] : null),
            'food' => $this->whenLoaded('food', fn (): ?array => $this->food ? [
                'id' => $this->food->id,
                'name' => $this->food->name,
            ] : null),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
