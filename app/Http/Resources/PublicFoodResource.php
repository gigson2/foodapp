<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\Food */
class PublicFoodResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'category' => $this->whenLoaded('category', fn (): array => [
                'id' => $this->category?->id,
                'name' => $this->category?->name,
                'slug' => $this->category?->slug,
            ]),
            'name' => $this->name,
            'slug' => $this->slug,
            'description' => $this->description,
            'short_description' => $this->short_description,
            'image' => $this->image,
            'price' => (float) $this->price,
            'preparation_time_minutes' => $this->preparation_time_minutes,
            'dietary_labels' => $this->dietary_labels ?? [],
            'is_available' => $this->is_available,
            'is_featured' => $this->is_featured,
            'is_popular' => $this->is_popular,
            'updated_at' => $this->updated_at,
        ];
    }
}
