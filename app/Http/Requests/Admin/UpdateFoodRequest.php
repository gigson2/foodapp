<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateFoodRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        $foodId = $this->route('food')?->id;

        return [
            'category_id' => ['required', 'integer', 'exists:categories,id'],
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['required', 'string', 'max:255', Rule::unique('foods', 'slug')->ignore($foodId)],
            'description' => ['required', 'string'],
            'short_description' => ['nullable', 'string', 'max:255'],
            'image' => [
                'nullable',
                Rule::when($this->hasFile('image'), ['image', 'max:4096']),
                Rule::when(! $this->hasFile('image'), ['string', 'max:255']),
            ],
            'price' => ['required', 'numeric', 'min:0'],
            'preparation_time_minutes' => ['required', 'integer', 'min:0', 'max:240'],
            'ingredients' => ['nullable', 'array'],
            'ingredients.*' => ['string', 'max:120'],
            'allergens' => ['nullable', 'array'],
            'allergens.*' => ['string', 'max:120'],
            'dietary_labels' => ['nullable', 'array'],
            'dietary_labels.*' => ['string', 'max:120'],
            'is_available' => ['nullable', 'boolean'],
            'is_featured' => ['nullable', 'boolean'],
            'is_popular' => ['nullable', 'boolean'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'seo_title' => ['nullable', 'string', 'max:255'],
            'seo_description' => ['nullable', 'string'],
        ];
    }
}
