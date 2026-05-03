<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\User */
class CustomerResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'phone' => $this->phone,
            'status' => $this->status,
            'last_login_at' => $this->last_login_at,
            'customer_profile' => $this->whenLoaded('customerProfile', fn (): ?array => $this->customerProfile ? [
                'address' => $this->customerProfile->address,
                'city' => $this->customerProfile->city,
                'notes' => $this->customerProfile->notes,
            ] : null),
            'orders_count' => $this->when(isset($this->orders_count), $this->orders_count),
            'lifetime_value' => (float) ($this->lifetime_value ?? 0),
            'last_order_at' => $this->last_order_at ?? null,
            'created_at' => $this->created_at,
        ];
    }
}
