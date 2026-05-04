<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\CompanySetting */
class PublicCompanySettingResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'company_name' => $this->company_name,
            'tagline' => $this->tagline,
            'about' => $this->about,
            'phone' => $this->phone,
            'email' => $this->email,
            'address' => $this->address,
            'pickup_instructions' => $this->pickup_instructions,
            'cash_only_notice' => $this->cash_only_notice,
            'opening_hours' => $this->opening_hours ?? [],
            'logo' => $this->logo,
            'favicon' => $this->favicon,
            'social_links' => $this->social_links ?? [],
            'updated_at' => $this->updated_at,
        ];
    }
}
