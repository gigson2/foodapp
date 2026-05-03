<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreCompanySettingRequest extends FormRequest
{
    protected function prepareForValidation(): void
    {
        $openingHours = $this->input('opening_hours');
        $socialLinks = $this->input('social_links');

        $this->merge([
            'opening_hours' => is_string($openingHours) ? json_decode($openingHours, true) : $openingHours,
            'social_links' => is_string($socialLinks) ? json_decode($socialLinks, true) : $socialLinks,
        ]);
    }

    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'company_name' => ['required', 'string', 'max:255'],
            'tagline' => ['nullable', 'string', 'max:255'],
            'about' => ['nullable', 'string'],
            'phone' => ['nullable', 'string', 'max:25'],
            'email' => ['nullable', 'email', 'max:255'],
            'address' => ['nullable', 'string', 'max:255'],
            'pickup_instructions' => ['nullable', 'string'],
            'cash_only_notice' => ['nullable', 'string', 'max:255'],
            'opening_hours' => ['nullable', 'array'],
            'logo' => ['nullable', 'image', 'max:4096'],
            'favicon' => ['nullable', 'image', 'max:2048'],
            'social_links' => ['nullable', 'array'],
        ];
    }
}
