<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\SeoSetting */
class SeoSettingResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'page_key' => $this->page_key,
            'title' => $this->title,
            'description' => $this->description,
            'keywords' => $this->keywords,
            'og_image' => $this->og_image,
            'schema_json' => $this->schema_json ?? [],
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
