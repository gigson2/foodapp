<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateSeoSettingRequest extends FormRequest
{
    protected function prepareForValidation(): void
    {
        $schemaJson = $this->input('schema_json');

        $this->merge([
            'schema_json' => is_string($schemaJson) ? json_decode($schemaJson, true) : $schemaJson,
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
        $seoSettingId = $this->route('seo_setting')?->id ?? $this->route('seoSetting')?->id;

        return [
            'page_key' => ['required', 'string', 'max:120', Rule::unique('seo_settings', 'page_key')->ignore($seoSettingId)],
            'title' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'keywords' => ['nullable', 'string'],
            'og_image' => ['nullable', 'image', 'max:4096'],
            'schema_json' => ['nullable', 'array'],
        ];
    }
}
