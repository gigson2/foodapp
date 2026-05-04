<?php

namespace App\Http\Requests\Admin;

use App\Rules\RejectSvgUpload;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreSeoSettingRequest extends FormRequest
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
        return [
            'page_key' => ['required', 'string', 'max:120', Rule::unique('seo_settings', 'page_key')],
            'title' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'keywords' => ['nullable', 'string'],
            'og_image' => ['nullable', 'image', new RejectSvgUpload(), 'max:4096'],
            'schema_json' => ['nullable', 'array'],
        ];
    }
}
