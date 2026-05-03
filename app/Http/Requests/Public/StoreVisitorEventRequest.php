<?php

namespace App\Http\Requests\Public;

use App\Enums\VisitorEventType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreVisitorEventRequest extends FormRequest
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
        return [
            'session_key' => ['required', 'string', 'max:255'],
            'event_type' => ['required', Rule::in(VisitorEventType::values())],
            'event_name' => ['required', 'string', 'max:255'],
            'page_url' => ['nullable', 'string', 'max:255'],
            'metadata' => ['nullable', 'array'],
            'referrer' => ['nullable', 'string', 'max:255'],
            'landing_page' => ['nullable', 'string', 'max:255'],
            'device_type' => ['nullable', 'string', 'max:80'],
            'browser' => ['nullable', 'string', 'max:80'],
            'platform' => ['nullable', 'string', 'max:80'],
        ];
    }
}
