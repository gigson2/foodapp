<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\Order */
class OrderResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'order_number' => $this->order_number,
            'customer_name' => $this->customer_name,
            'customer_email' => $this->customer_email,
            'customer_phone' => $this->customer_phone,
            'delivery_address' => $this->delivery_address,
            'order_type' => $this->order_type?->value ?? $this->order_type,
            'status' => $this->status?->value ?? $this->status,
            'subtotal' => (float) $this->subtotal,
            'delivery_fee' => (float) $this->delivery_fee,
            'discount' => (float) $this->discount,
            'tax' => (float) $this->tax,
            'total' => (float) $this->total,
            'payment_method' => $this->payment_method?->value ?? $this->payment_method,
            'payment_status' => $this->payment_status?->value ?? $this->payment_status,
            'customer_note' => $this->customer_note,
            'admin_note' => $this->admin_note,
            'placed_at' => $this->placed_at,
            'accepted_at' => $this->accepted_at,
            'completed_at' => $this->completed_at,
            'cancelled_at' => $this->cancelled_at,
            'items' => OrderItemResource::collection($this->whenLoaded('items')),
            'user' => $this->whenLoaded('user', fn () => new UserResource($this->user)),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
