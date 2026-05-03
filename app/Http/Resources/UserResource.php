<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\User */
class UserResource extends JsonResource
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
            'role' => $this->role,
            'avatar' => $this->avatar,
            'status' => $this->status,
            'last_login_at' => $this->last_login_at,
            'email_verified_at' => $this->email_verified_at,
            'customer_profile' => $this->whenLoaded('customerProfile', fn (): ?array => $this->customerProfile ? [
                'address' => $this->customerProfile->address,
                'city' => $this->customerProfile->city,
                'notes' => $this->customerProfile->notes,
            ] : null),
            'notification_preference' => $this->whenLoaded('notificationPreference', fn (): ?array => $this->notificationPreference ? [
                'in_app_enabled' => $this->notificationPreference->in_app_enabled,
                'push_enabled' => $this->notificationPreference->push_enabled,
                'email_enabled' => $this->notificationPreference->email_enabled,
                'preferences' => $this->notificationPreference->preferences ?? [],
            ] : null),
        ];
    }
}
