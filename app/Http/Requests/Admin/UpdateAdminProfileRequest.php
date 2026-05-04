<?php

namespace App\Http\Requests\Admin;

use App\Rules\RejectSvgUpload;
use App\Support\PhoneNumber;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateAdminProfileRequest extends FormRequest
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
        $userId = $this->user()?->id;

        return [
            'name' => ['required', 'string', 'max:255'],
            'phone' => ['required', 'string', 'max:20', Rule::unique('users', 'phone')->ignore($userId)],
            'email' => ['nullable', 'email', 'max:255', Rule::unique('users', 'email')->ignore($userId)],
            'avatar' => ['nullable', 'image', new RejectSvgUpload(), 'max:4096'],
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'name' => trim((string) $this->input('name')),
            'email' => $this->filled('email') ? strtolower(trim((string) $this->input('email'))) : null,
            'phone' => PhoneNumber::normalizeUs($this->input('phone')),
        ]);
    }
}
