<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class BroadcastCustomerNotificationRequest extends FormRequest
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
            'title' => ['required', 'string', 'max:120'],
            'message' => ['required', 'string', 'max:500'],
            'url' => ['nullable', 'string', 'max:255'],
        ];
    }
}
